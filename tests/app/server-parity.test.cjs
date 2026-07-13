/* ============================================================================
   server-parity.test.cjs — proves server/ runs the SAME golden engine as the
   browser/demo, byte-identically, over the deterministic gate (no live port).

   Every assertion here calls server/router.cjs's route(method, path, body, ctx)
   directly — the SAME pure dispatcher server/http.cjs wires to a real socket —
   so this is a genuine request-handler proof, not a reimplementation shortcut.

   The killer claim under test: "the same sealed record verifies identically in
   browser and server — the seal IS the API."
     (a) POST /verify with no id hits the sentinel MAIN record — the single
         frozen demo agreement (نورة→سارة, 5000 SAR/5) baked into the golden
         engine at module load — and must reproduce the project's ONE pinned
         golden main seal 6c9410b9… exactly, via engine.verifyRecord (golden,
         untouched).
     (b) POST /create-loan -> POST /seal for the SAME vector used by
         golden-vectors.test.cjs (id NEW-1, أنت->سلطان 1200/3) must reproduce
         THAT suite's pinned golden seal exactly, proving server-side sealing
         of a brand-new record — not just the frozen one — is byte-identical
         to the browser/app path.
     (c) tamper-evidence, riba on-spine refusal, netting parity, and an
         offline/determinism static scan of server/*.cjs round out the slice.
============================================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const { route } = require(path.join(__dirname, "..", "..", "server", "router.cjs"));
const engine = require(path.join(__dirname, "..", "..", "server", "engine.cjs"));
const Store = require(path.join(__dirname, "..", "..", "server", "store.cjs"));
const AppEngine = require(path.join(__dirname, "..", "..", "app", "engine.js"));
const { stripComments } = require(path.join(__dirname, "..", "load-logic.cjs"));

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; console.log("  ✓ " + msg); } else { fail++; console.log("  ✗ " + msg); } };

console.log("server-parity: server-side seal parity + on-spine endpoint proof");

const GOLDEN_MAIN_SEAL = "6c9410b95ba4715a3c2b174ff70aa2d7ab88fa0294868a41354d2f9e60f7fd18";
const GOLDEN_NEW1_SEAL = "0463553997c80d77e65d1a411acc0e0bd9d4bef67a92dc96af045dfa24a2b8f8"; // golden-vectors.test.cjs NEW-1

function freshCtx() { return { engine: engine, store: Store.createStore() }; }

/* ---- 0) reuse, not reimplementation ---- */
ok(engine === AppEngine, "server/engine.cjs is a direct re-export of app/engine.js (same module instance)");
ok(engine.SEALED.seal === GOLDEN_MAIN_SEAL, "server engine's SEALED.seal matches the project golden main seal");

/* ---- (a) THE PARITY PROOF: POST /verify (MAIN, no id) reproduces the golden main seal ---- */
{
  const ctx = freshCtx();
  const r = route("POST", "/verify", {}, ctx);
  ok(r.status === 200, "POST /verify (MAIN): 200");
  ok(r.body.main === true, "POST /verify (MAIN): flagged as the main frozen record");
  ok(r.body.ok === true, "POST /verify (MAIN): ok true (untampered)");
  ok(r.body.sealed === GOLDEN_MAIN_SEAL, "POST /verify (MAIN): sealed == golden main seal (6c9410b9…) — SAME seal as demo/app");
  ok(r.body.recomputed === GOLDEN_MAIN_SEAL, "POST /verify (MAIN): recomputed == sealed (untampered)");

  /* tamper the MAIN record's amount through the server path -> must diverge, same as the demo's tamper toggle */
  const rt = route("POST", "/verify", { amountSAR: 9999 }, ctx);
  ok(rt.body.ok === false, "POST /verify (MAIN, tampered amountSAR): ok false");
  ok(rt.body.sealed === GOLDEN_MAIN_SEAL, "POST /verify (MAIN, tampered): sealed still reports the golden main seal");
  ok(rt.body.recomputed !== GOLDEN_MAIN_SEAL, "POST /verify (MAIN, tampered): recomputed seal diverges");
}

/* ---- (b) new-loan create->seal->verify round trip reproduces golden-vectors.test.cjs's NEW-1 seal ---- */
{
  const ctx = freshCtx();
  const c = route("POST", "/create-loan", { id: "NEW-1", lender: "أنت", borrower: "سلطان", amountSAR: 1200, months: 3 }, ctx);
  ok(c.status === 201, "POST /create-loan: 201");
  ok(c.body.status === "DRAFT", "POST /create-loan: status DRAFT (not yet witnessed)");
  ok(c.body.riba.verdict === "clean", "POST /create-loan: auto-drafted terms pass the riba linter clean");

  const s = route("POST", "/seal", { id: "NEW-1" }, ctx);
  ok(s.status === 200, "POST /seal: 200");
  ok(s.body.status === "WITNESSED", "POST /seal: status WITNESSED");
  ok(s.body.seal === GOLDEN_NEW1_SEAL, "POST /seal: seal == golden-vectors.test.cjs's pinned NEW-1 seal — server reproduces the SAME app-path seal for a BRAND-NEW record");

  const v = route("POST", "/verify", { id: "NEW-1" }, ctx);
  ok(v.body.ok === true && v.body.sealed === GOLDEN_NEW1_SEAL, "POST /verify (NEW-1): ok true, sealed == golden NEW-1 seal");

  const vt = route("POST", "/verify", { id: "NEW-1", amountSAR: 50000 }, ctx);
  ok(vt.body.ok === false, "POST /verify (NEW-1, tampered): ok false — tamper-evidence holds server-side too");

  /* idempotent re-seal: sealing twice returns the SAME seal, never a second/different one */
  const s2 = route("POST", "/seal", { id: "NEW-1" }, ctx);
  ok(s2.body.seal === GOLDEN_NEW1_SEAL && s2.body.already === true, "POST /seal (already sealed): idempotent, same seal returned");
}

/* ---- endpoint validation + on-spine behavior ---- */
{
  const ctx = freshCtx();
  ok(route("POST", "/create-loan", {}, ctx).status === 400, "POST /create-loan: missing fields -> 400");
  ok(route("POST", "/create-loan", { id: "MAIN", lender: "a", borrower: "b", amountSAR: 10 }, ctx).status === 400, "POST /create-loan: id 'MAIN' is reserved -> 400");
  ok(route("POST", "/seal", { id: "NO-SUCH-ID" }, ctx).status === 404, "POST /seal: unknown id -> 404");
  ok(route("POST", "/verify", { id: "NO-SUCH-ID" }, ctx).status === 404, "POST /verify: unknown id -> 404");

  route("POST", "/create-loan", { id: "UNSEALED-1", lender: "a", borrower: "b", amountSAR: 100 }, ctx);
  ok(route("POST", "/verify", { id: "UNSEALED-1" }, ctx).status === 409, "POST /verify: not-yet-sealed loan -> 409");

  /* white-box: the riba-linter guard actually blocks sealing when terms are flagged
     (createLoan always auto-drafts clean terms, so we exercise the GUARD directly by
     injecting a record whose terms verdict is 'block' — proving the refusal branch is real). */
  Store.putLoan(ctx.store, "BAD-TERMS", {
    id: "BAD-TERMS",
    draft: { id: "BAD-TERMS", type: "قرض حسن", lender: "a", borrower: "b", amountMinor: 10000, open: false, months: 1, timestamp: "2026-07-01T10:00:00+03:00" },
    status: "DRAFT", terms_ar: "بفائدة 5%", riba: engine.ribaScan("بفائدة 5%"), seal: null, canonical_hash: null,
    events: [engine.ev("AHD_DRAFTED", { installments: 1 })]
  });
  const blocked = route("POST", "/seal", { id: "BAD-TERMS" }, ctx);
  ok(blocked.status === 422, "POST /seal: riba-flagged terms refused with 422 (on-spine — no riba ever witnessed)");
  ok(/riba/i.test(blocked.body.error), "POST /seal: refusal message names the riba guard");
}

/* ---- /net — Muqassa netting via the server path, default = golden 9-IOU demo tangle ---- */
{
  const ctx = freshCtx();
  const n = route("POST", "/net", {}, ctx);
  ok(n.status === 200, "POST /net: 200");
  ok(n.body.count === 2, "POST /net (default IOUS): 9 IOUs -> 2 transfers (golden reduction)");
  ok(JSON.stringify(n.body.transfers) === JSON.stringify(engine.netting(engine.IOUS)), "POST /net: transfers match engine.netting(engine.IOUS) exactly (same golden netting core)");

  const custom = route("POST", "/net", { edges: [{ from: "نورة", to: "سارة", amount: 100 }] }, ctx);
  ok(custom.body.count === 1 && custom.body.transfers[0].amount === 100, "POST /net (custom edges): single edge nets to itself");
}

/* ---- /list ---- */
{
  const ctx = freshCtx();
  route("POST", "/create-loan", { id: "L-1", lender: "a", borrower: "b", amountSAR: 500 }, ctx);
  const l = route("GET", "/list", {}, ctx);
  ok(l.status === 200 && l.body.count === 1 && l.body.items[0].id === "L-1", "GET /list: returns the created loan");
}

/* ---- unknown route ---- */
{
  const ctx = freshCtx();
  const r = route("GET", "/no-such-route", {}, ctx);
  ok(r.status === 404, "unknown route -> 404");
}

/* ---- offline + determinism static scan of server/*.cjs (mirrors app-offline.test.cjs's intent) ---- */
{
  const SERVER_DIR = path.join(__dirname, "..", "..", "server");
  const FORBIDDEN = ["fetch(", "XMLHttpRequest", "WebSocket", "Date.now", "new Date", "Math.random", "Intl.", ".toLocaleString"];
  const files = fs.readdirSync(SERVER_DIR).filter((f) => f.endsWith(".cjs"));
  ok(files.length >= 5, "scanning at least 5 server/*.cjs files (got " + files.length + ")");
  let totalRawHits = 0;
  for (const f of files) {
    const src = fs.readFileSync(path.join(SERVER_DIR, f), "utf8");
    const stripped = stripComments(src);
    const hits = FORBIDDEN.filter((tok) => stripped.indexOf(tok) >= 0);
    ok(hits.length === 0, "server/" + f + ": no networking/nondeterminism primitive in live code" + (hits.length ? "  [FOUND: " + hits.join(", ") + "]" : ""));
    totalRawHits += FORBIDDEN.filter((tok) => src.indexOf(tok) >= 0 && stripped.indexOf(tok) < 0).length;
  }
}

/* ---- determinism: two independent stores, same inputs, byte-identical seals ---- */
{
  const ctxA = freshCtx(), ctxB = freshCtx();
  const inputA = { id: "DET-1", lender: "x", borrower: "y", amountSAR: 777, months: 2 };
  route("POST", "/create-loan", inputA, ctxA);
  route("POST", "/create-loan", inputA, ctxB);
  const sA = route("POST", "/seal", { id: "DET-1" }, ctxA);
  const sB = route("POST", "/seal", { id: "DET-1" }, ctxB);
  ok(sA.body.seal === sB.body.seal && !!sA.body.seal, "determinism: two independent server instances seal the SAME input to the SAME seal");
}

console.log("\n========================================================");
console.log("SERVER PARITY: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
