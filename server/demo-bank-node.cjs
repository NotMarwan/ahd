#!/usr/bin/env node
/* ============================================================================
   demo-bank-node.cjs — ONE-COMMAND, judge-facing live "bank node" walkthrough.

   T3 (make the backend + protocol JUDGE-VISIBLE): the app screens stay
   provably OFFLINE (no fetch/XHR/WebSocket anywhere in app/ or demo/ — see
   tests/offline-check.cjs + tests/app/app-offline.test.cjs) — the app itself
   NEVER calls this server. This file is a SEPARATE terminal surface a
   presenter runs by hand, alongside the app, to make the backend + the
   Open-Witness protocol perceivable to a judge without touching the app's
   offline guarantee.

   What this proves, over a REAL localhost socket (Node's own `http`, no
   fetch/XHR/WebSocket — same primitive server/smoke-live.cjs already uses):
     1) the REAL server process (server/http.cjs's createAhdServer) with the
        REAL durable store (server/store.cjs, fsync'd append-only log) and
        REAL HMAC auth (server/auth.cjs) switched ON — not a stub;
     2) a mutating call WITHOUT a token is genuinely rejected (401) — auth is
        enforced, not merely present;
     3) an AUTHENTICATED create -> seal round trip over real HTTP reproduces
        the project's pinned golden NEW-1 seal (the same seal the browser
        app/demo produce for this exact record — "the seal IS the API");
     4) the server's own /verify endpoint (public — witnessing stays open)
        recomputes the seal and detects a tampered amount;
     5) an INDEPENDENT third party — protocol/verify-ahd-seal.cjs, which
        requires ONLY Node's built-in `crypto`, never app/engine.js or
        anything under app/ or demo/ (see tests/app/open-witness.test.cjs) —
        recomputes the SAME seal from the record's raw fields alone, and
        detects the same tamper. This is genuine independent recomputation,
        not a re-formatting of a pre-trusted string.

   Spine (unchanged by this file): the bank only witnesses/seals/verifies;
   no lending, no dispute judging, no interest/penalty, no credit score, no
   fatwa. Determinism: no Date.now/new Date/Math.random/Intl/toLocaleString
   in this file's own logic (the live process's real elapsed-time clock for
   token expiry lives inside server/auth.cjs's defaultNow, already audited).

   Run:   node server/demo-bank-node.cjs
   Exit:  0 = every step verified as printed; 1 = something did not hold.
============================================================================ */
"use strict";
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { createAhdServer } = require("./http.cjs");
const Store = require("./store.cjs");
const Auth = require("./auth.cjs");
const Verifier = require(path.join(__dirname, "..", "protocol", "verify-ahd-seal.cjs"));

const HOST = "127.0.0.1";
const GOLDEN_NEW1_SEAL = "0463553997c80d77e65d1a411acc0e0bd9d4bef67a92dc96af045dfa24a2b8f8";

let step = 0;
function heading(t) { step += 1; console.log("\n[" + step + "] " + t); }
function say(t) { console.log("    " + t); }
function mark(cond, t) { console.log("    " + (cond ? "✓ " : "✗ ") + t); return !!cond; }

/* real HTTP client — Node's own `http` module, the same primitive
   server/smoke-live.cjs already uses (never fetch/XHR/WebSocket). */
function post(port, urlPath, body, token) {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(JSON.stringify(body || {}), "utf8");
    const headers = { "Content-Type": "application/json", "Content-Length": data.length };
    if (token) headers.Authorization = "Bearer " + token;
    const req = http.request(
      { host: HOST, port: port, path: urlPath, method: "POST", headers: headers },
      function (res) {
        const chunks = [];
        res.on("data", function (c) { chunks.push(c); });
        res.on("end", function () {
          try { resolve({ status: res.statusCode, body: JSON.parse(Buffer.concat(chunks).toString("utf8")) }); }
          catch (e) { reject(e); }
        });
      }
    );
    req.on("error", reject);
    req.end(data);
  });
}

async function main() {
  let allOk = true;
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "ahd-bank-node-demo-"));

  console.log("============================================================");
  console.log("  AHD BANK NODE — live, over real HTTP (المصرف يشهد ولا يقرض)");
  console.log("============================================================");

  /* ---- 1) start the REAL server: durable store + real HMAC auth, both ON ---- */
  heading("start the real server: durable store (fsync'd log) + HMAC auth ON");
  const store = Store.createStore(dataDir); // durable mode: real fs-backed append-only log, not an in-memory stub
  const secretKey = Auth.resolveSecretKey(dataDir); // real crypto.randomBytes(32) key, persisted to disk
  const authConfig = { enabled: true, secretKey: secretKey };
  const server = createAhdServer(store, authConfig); // the SAME binder `node server/http.cjs` runs
  await new Promise(function (resolve) { server.listen(0, HOST, resolve); });
  const port = server.address().port;
  say("durable data dir : " + dataDir);
  say("listening        : http://" + HOST + ":" + port + "  (real socket, real process)");

  try {
    /* ---- 2) prove auth is ENFORCED: the same mutating call with no token is rejected ---- */
    heading("auth is enforced, not just present: create-loan WITHOUT a token");
    const rejected = await post(port, "/create-loan", { id: "NEW-1", lender: "أنت", borrower: "سلطان", amountSAR: 1200, months: 3 });
    allOk = mark(rejected.status === 401, "POST /create-loan (no token) -> 401 unauthorized: " + JSON.stringify(rejected.body)) && allOk;

    /* ---- 3) mint a real HMAC session token and create the loan, authenticated ---- */
    heading("mint a real HMAC session token (server/auth.cjs) and retry, authenticated");
    const token = Auth.issueToken({ actor: "الإنماء — تشغيل العرض الحيّ", secretKey: secretKey, ttlMs: 5 * 60 * 1000 });
    say("token (truncated): " + token.slice(0, 24) + "...");
    const createBody = { id: "NEW-1", lender: "أنت", borrower: "سلطان", amountSAR: 1200, months: 3, start: { y: 2026, m: 7 }, timestamp: "2026-07-01T10:00:00+03:00" };
    const c = await post(port, "/create-loan", createBody, token);
    allOk = mark(c.status === 201 && c.body.status === "DRAFT" && c.body.riba.verdict === "clean",
      "POST /create-loan (authenticated) -> 201 DRAFT, riba verdict clean") && allOk;

    /* ---- 4) seal it: bank node witnesses + seals over real HTTP ---- */
    heading("witness + seal NEW-1 over real HTTP");
    const s = await post(port, "/seal", { id: "NEW-1" }, token);
    allOk = mark(s.status === 200 && s.body.status === "WITNESSED", "POST /seal (authenticated) -> 200 WITNESSED") && allOk;
    allOk = mark(s.body.seal === GOLDEN_NEW1_SEAL,
      "bank node sealed NEW-1 -> " + s.body.seal + "  (== the SAME pinned golden seal the browser app/demo produce for this exact record — the seal IS the API)") && allOk;

    /* ---- 5) the bank's own /verify: public (witnessing stays open, no token needed) ---- */
    heading("bank's own /verify (public endpoint, no token) recomputes the seal");
    const v = await post(port, "/verify", { id: "NEW-1" });
    allOk = mark(v.body.ok === true && v.body.sealed === GOLDEN_NEW1_SEAL && v.body.recomputed === GOLDEN_NEW1_SEAL,
      "POST /verify (NEW-1) -> ok true, recomputed == sealed == " + v.body.sealed) && allOk;

    const vt = await post(port, "/verify", { id: "NEW-1", amountSAR: 50000 });
    allOk = mark(vt.body.ok === false && vt.body.recomputed !== GOLDEN_NEW1_SEAL,
      "POST /verify (NEW-1, claimed amount changed to 50000) -> ok false, recomputed seal diverges (server-side tamper-evidence)") && allOk;

    /* ---- 6) durable proof: a real, fsync'd file sits on disk right now ---- */
    heading("durable persistence proof: a real file on disk, not memory-only");
    const logFile = Store.logFilePath(dataDir);
    const logLines = fs.readFileSync(logFile, "utf8").split("\n").filter(function (l) { return l.trim(); }).length;
    allOk = mark(logLines >= 2, logFile + " has " + logLines + " append-only lines on real disk (would replay identically after a process restart — see tests/app/server-persistence.test.cjs)") && allOk;

    /* ---- 7) THE INDEPENDENT VERIFIER: zero Ahd code, standard Node crypto only ---- */
    heading("independent Open-Witness verifier (protocol/verify-ahd-seal.cjs — zero Ahd code, standard crypto only)");
    say("this is a THIRD PARTY's tool: it never requires app/engine.js, app/, or demo/ (see tests/app/open-witness.test.cjs §0)");
    const record = {
      profile: "ahd-create-v1",
      ahd_id: createBody.id,
      type: "قرض حسن",
      lender: createBody.lender,
      borrower: createBody.borrower,
      amount_sar: createBody.amountSAR,
      open: false,
      months: createBody.months,
      start: createBody.start,
      timestamp: createBody.timestamp,
      sealed_seal: s.body.seal /* the seal the LIVE bank node just produced above, not a static fixture */
    };
    const independent = Verifier.verify(record);
    allOk = mark(independent.ok === true && independent.recomputed === GOLDEN_NEW1_SEAL,
      "independent verifier recomputes " + independent.recomputed + " from the record's raw fields alone -> matches the bank node's seal -> VALID") && allOk;

    const tamperedRecord = Object.assign({}, record, { amount_sar: record.amount_sar + 1 });
    const independentTampered = Verifier.verify(tamperedRecord);
    allOk = mark(independentTampered.ok === false && independentTampered.recomputed !== GOLDEN_NEW1_SEAL,
      "tamper +1 SAR (1200 -> 1201, same claimed seal) -> independent verifier recomputes " + independentTampered.recomputed + " -> INVALID, no Ahd code involved") && allOk;
  } finally {
    server.close();
    try { fs.rmSync(dataDir, { recursive: true, force: true }); } catch (e) { /* best-effort cleanup, never fails the demo */ }
  }

  console.log("\n============================================================");
  console.log(allOk
    ? "  BANK NODE DEMO ✅  every step verified live — real HTTP, real auth, real durability, independent proof"
    : "  BANK NODE DEMO ❌  one or more steps did not verify — see ✗ lines above");
  console.log("============================================================");
  process.exitCode = allOk ? 0 : 1;
}

main().catch(function (e) {
  console.error("BANK NODE DEMO: ERROR", e);
  process.exitCode = 1;
});
