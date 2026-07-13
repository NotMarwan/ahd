/* ============================================================================
   server-persistence.test.cjs — proves server/store.cjs is DURABLE: a
   witnessed/sealed record survives a simulated process restart via a real
   file on disk, replayed on the NEXT store instance — not merely an
   in-memory Map (that was the old behavior; see the "control" section below,
   which shows the old/ephemeral shape genuinely losing state, so this test
   has teeth: it would FAIL if store.cjs still only wrapped a bare Map).

   Every write goes through server/router.cjs's route() (the same pure
   dispatcher server/http.cjs wires to a real socket) so this is a genuine
   end-to-end proof of the durable path, not a store-internals shortcut.
============================================================================ */
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const { route } = require(path.join(__dirname, "..", "..", "server", "router.cjs"));
const engine = require(path.join(__dirname, "..", "..", "server", "engine.cjs"));
const Store = require(path.join(__dirname, "..", "..", "server", "store.cjs"));

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; console.log("  ✓ " + msg); } else { fail++; console.log("  ✗ " + msg); } };

console.log("server-persistence: durable append-only log survives a simulated restart");

const GOLDEN_NEW1_SEAL = "0463553997c80d77e65d1a411acc0e0bd9d4bef67a92dc96af045dfa24a2b8f8"; // pinned in golden-vectors.test.cjs + server-parity.test.cjs

function mkTmpDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

/* ---- (a) THE PROOF: create+seal through instance A, then a FRESH instance
   B reading the SAME log file (a simulated process restart) sees the same
   record and reproduces the SAME golden seal. ---- */
{
  const dataDir = mkTmpDir("ahd-persist-a-");
  const ctxA = { engine: engine, store: Store.createStore(dataDir) };

  const c = route("POST", "/create-loan", { id: "NEW-1", lender: "أنت", borrower: "سلطان", amountSAR: 1200, months: 3 }, ctxA);
  ok(c.status === 201, "instance A: POST /create-loan -> 201");

  const s = route("POST", "/seal", { id: "NEW-1" }, ctxA);
  ok(s.status === 200 && s.body.status === "WITNESSED", "instance A: POST /seal -> 200 WITNESSED");
  ok(s.body.seal === GOLDEN_NEW1_SEAL, "instance A: seal == pinned golden NEW-1 seal (durable path still uses the golden engine)");

  const logFile = Store.logFilePath(dataDir);
  ok(fs.existsSync(logFile), "a REAL log file exists on disk at " + logFile);
  const rawBefore = fs.readFileSync(logFile, "utf8");
  ok(rawBefore.split("\n").filter((l) => l.trim()).length >= 2, "log file has >=2 append lines (draft PUT + sealed PUT)");

  /* ---- simulated restart: brand-new process-local state, same log file ---- */
  const ctxB = { engine: engine, store: Store.createStore(dataDir) };
  const rec = Store.getLoan(ctxB.store, "NEW-1");
  ok(rec !== null, "instance B (post-restart): NEW-1 is present after replay");
  ok(rec && rec.status === "WITNESSED", "instance B (post-restart): status is WITNESSED (the sealed PUT superseded the draft PUT)");
  ok(rec && rec.seal === GOLDEN_NEW1_SEAL, "instance B (post-restart): seal == the SAME pinned golden seal instance A produced");

  const v = route("POST", "/verify", { id: "NEW-1" }, ctxB);
  ok(v.status === 200 && v.body.ok === true, "instance B (post-restart): POST /verify -> ok true (re-derivable through the golden engine)");
  ok(v.body.sealed === GOLDEN_NEW1_SEAL && v.body.recomputed === GOLDEN_NEW1_SEAL,
    "instance B (post-restart): sealed == recomputed == golden NEW-1 seal — the restart round-trip is byte-identical");
}

/* ---- (b) CONTROL — proves this test has teeth: the ephemeral (dataDir-less)
   mode — the exact shape of the OLD in-memory-Map-only store — does NOT
   survive a "restart" (a fresh store instance). If store.cjs were reverted to
   the old bare-Map implementation, section (a) above would fail exactly like
   this control does. ---- */
{
  const ctxA = { engine: engine, store: Store.createStore() }; // no dataDir -> ephemeral, by design
  route("POST", "/create-loan", { id: "EPHEMERAL-1", lender: "a", borrower: "b", amountSAR: 500 }, ctxA);
  route("POST", "/seal", { id: "EPHEMERAL-1" }, ctxA);
  ok(Store.getLoan(ctxA.store, "EPHEMERAL-1") !== null, "control: ephemeral instance A does have the record (before 'restart')");

  const ctxB = { engine: engine, store: Store.createStore() }; // simulated restart, no shared file
  ok(Store.getLoan(ctxB.store, "EPHEMERAL-1") === null,
    "control: ephemeral instance B (post-'restart') has LOST the record — proves durability is real work, not a no-op");
}

/* ---- (c) atomicity intent: a torn/truncated tail line (simulating a crash
   mid-append) is SKIPPED on replay, never loaded as a valid record — and the
   earlier, well-formed record is untouched. ---- */
{
  const dataDir = mkTmpDir("ahd-persist-torn-");
  const ctx1 = { engine: engine, store: Store.createStore(dataDir) };
  route("POST", "/create-loan", { id: "GOOD-1", lender: "x", borrower: "y", amountSAR: 300 }, ctx1);
  route("POST", "/seal", { id: "GOOD-1" }, ctx1);

  const logFile = Store.logFilePath(dataDir);
  const before = fs.readFileSync(logFile, "utf8");
  ok(before.endsWith("\n"), "well-formed log ends with a newline-terminated line (no torn tail yet)");

  /* append a deliberately truncated/corrupt JSON fragment with NO trailing
     newline — exactly what a crash mid-write() could leave behind. */
  fs.appendFileSync(logFile, '{"op":"PUT","id":"TORN-1","record":{"id":"TORN-1","status":"WIT');

  const ctx2 = { engine: engine, store: Store.createStore(dataDir) }; // replay over the torn file
  ok(Store.getLoan(ctx2.store, "TORN-1") === null, "atomicity: the torn/corrupt tail line is SKIPPED, never loaded as a record");
  const good = Store.getLoan(ctx2.store, "GOOD-1");
  ok(good !== null && good.status === "WITNESSED", "atomicity: the earlier well-formed record (GOOD-1) survives untouched despite the torn tail");
}

/* ---- (d) production wiring sanity: server/http.cjs's live process opts into
   the durable default path (server/data/, or AHD_DATA_DIR) by construction —
   requiring it must NOT start listening (no port bound just by require()). ---- */
{
  const httpMod = require(path.join(__dirname, "..", "..", "server", "http.cjs"));
  const expected = process.env.AHD_DATA_DIR || Store.DEFAULT_DATA_DIR;
  ok(httpMod.DATA_DIR === expected, "server/http.cjs's live DATA_DIR resolves to the durable default (server/data/) unless AHD_DATA_DIR overrides it");
  ok(Store.createStore(true).dataDir === Store.DEFAULT_DATA_DIR, "createStore(true) sentinel resolves to the same DEFAULT_DATA_DIR used by http.cjs");
}

console.log("\n========================================================");
console.log("SERVER PERSISTENCE: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
