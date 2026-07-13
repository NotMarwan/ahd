/* ============================================================================
   server-auth.test.cjs — proves T2 real auth: HMAC session tokens gate the
   MUTATING server endpoints (/create-loan, /seal, /net); /verify and /list
   stay PUBLIC (the witness model). Auth is OPT-IN via ctx.auth — every call
   here that does NOT set ctx.auth mirrors server-parity.test.cjs's ctx shape
   exactly, proving that suite's golden parity path is untouched by this file.

   All calls go through server/router.cjs's route() — the SAME pure
   dispatcher server/http.cjs wires to a real socket — so this is a genuine
   request-handler proof, not an auth.cjs-internals shortcut.
============================================================================ */
"use strict";
const path = require("path");
const { route } = require(path.join(__dirname, "..", "..", "server", "router.cjs"));
const engine = require(path.join(__dirname, "..", "..", "server", "engine.cjs"));
const Store = require(path.join(__dirname, "..", "..", "server", "store.cjs"));
const Auth = require(path.join(__dirname, "..", "..", "server", "auth.cjs"));

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; console.log("  ✓ " + msg); } else { fail++; console.log("  ✗ " + msg); } };

console.log("server-auth: HMAC session tokens gate mutating endpoints; /verify + /list stay public; opt-in seam untouched");

const SECRET = "fixed-test-secret-key-for-determinism";
const WRONG_SECRET = "a-different-key-that-must-never-verify";
let clockMs = 1000000; // injected virtual clock (ms) — fully deterministic, advanced only by these tests
const fixedNow = () => clockMs;

function authOffCtx() {
  // EXACTLY server-parity.test.cjs's freshCtx() shape: no `auth` key at all.
  return { engine: engine, store: Store.createStore() };
}
function authOnCtx() {
  return { engine: engine, store: Store.createStore(), auth: { enabled: true, secretKey: SECRET, now: fixedNow } };
}
function bearer(token) { return { authorization: "Bearer " + token }; }

/* ---- 0) OPT-IN SEAM: auth OFF by default (no ctx.auth) -> mutating endpoints
   stay open with NO token at all — proves server-parity.test.cjs's ctx shape
   (and every assertion built on it) is completely unaffected by T2. ---- */
{
  const ctx = authOffCtx();
  const c = route("POST", "/create-loan", { id: "OPTIN-1", lender: "a", borrower: "b", amountSAR: 100 }, ctx);
  ok(c.status === 201, "opt-in OFF (no ctx.auth): POST /create-loan with NO token -> 201 (parity path untouched)");
  const s = route("POST", "/seal", { id: "OPTIN-1" }, ctx);
  ok(s.status === 200, "opt-in OFF: POST /seal with NO token -> 200");
  const n = route("POST", "/net", {}, ctx);
  ok(n.status === 200, "opt-in OFF: POST /net with NO token -> 200");
  // also: calling route() with the OLD 4-arg signature (no headers arg at all) still works
  const c2 = route("POST", "/create-loan", { id: "OPTIN-2", lender: "a", borrower: "b", amountSAR: 50 }, authOffCtx());
  ok(c2.status === 201, "route() called with the pre-T2 4-arg signature (no headers) still works unchanged");
}

/* ---- 1) auth ON + valid token -> mutating endpoints succeed ---- */
{
  const ctx = authOnCtx();
  const token = Auth.issueToken({ actor: "نورة", secretKey: SECRET, now: fixedNow });
  const c = route("POST", "/create-loan", { id: "AUTH-1", lender: "نورة", borrower: "سارة", amountSAR: 500 }, ctx, bearer(token));
  ok(c.status === 201, "auth ON, valid token: POST /create-loan -> 201");
  const s = route("POST", "/seal", { id: "AUTH-1" }, ctx, bearer(token));
  ok(s.status === 200 && s.body.status === "WITNESSED", "auth ON, valid token: POST /seal -> 200 WITNESSED");
  const n = route("POST", "/net", {}, ctx, bearer(token));
  ok(n.status === 200 && n.body.count === 2, "auth ON, valid token: POST /net -> 200 (golden 9->2 reduction still holds)");
}

/* ---- 2) auth ON + MISSING token on a mutating endpoint -> 401 ---- */
{
  const ctx = authOnCtx();
  const c = route("POST", "/create-loan", { id: "NOAUTH-1", lender: "a", borrower: "b", amountSAR: 100 }, ctx);
  ok(c.status === 401, "auth ON, no token: POST /create-loan -> 401");
  const s = route("POST", "/seal", { id: "NOAUTH-1" }, ctx);
  ok(s.status === 401, "auth ON, no token: POST /seal -> 401");
  const n = route("POST", "/net", {}, ctx);
  ok(n.status === 401, "auth ON, no token: POST /net -> 401");
  ok(!Store.getLoan(ctx.store, "NOAUTH-1"), "auth ON, no token: the rejected /create-loan never actually created the record");
}

/* ---- 3) tampered payload -> 401 (signature recomputed over the ORIGINAL
   payload string no longer matches the token's signature) ---- */
{
  const ctx = authOnCtx();
  const token = Auth.issueToken({ actor: "نورة", secretKey: SECRET, now: fixedNow });
  const dot = token.indexOf(".");
  const payloadB64 = token.slice(0, dot), sig = token.slice(dot + 1);
  const flippedChar = payloadB64.slice(-1) === "A" ? "B" : "A";
  const tampered = payloadB64.slice(0, -1) + flippedChar + "." + sig; // payload mutated, ORIGINAL signature kept
  const c = route("POST", "/create-loan", { id: "TAMPER-1", lender: "a", borrower: "b", amountSAR: 100 }, ctx, bearer(tampered));
  ok(c.status === 401, "tampered token payload (signature mismatch) -> 401");
}

/* ---- 4) forged token (signed with the WRONG key) -> 401 ---- */
{
  const ctx = authOnCtx();
  const forged = Auth.issueToken({ actor: "مهاجم", secretKey: WRONG_SECRET, now: fixedNow });
  const c = route("POST", "/create-loan", { id: "FORGE-1", lender: "a", borrower: "b", amountSAR: 100 }, ctx, bearer(forged));
  ok(c.status === 401, "forged token (HMAC signed with the wrong key) -> 401");
}

/* ---- 5) expired token -> 401 ---- */
{
  const ctx = authOnCtx();
  const shortLived = Auth.issueToken({ actor: "نورة", secretKey: SECRET, ttlMs: 1000, now: fixedNow });
  clockMs += 5000; // advance the injected virtual clock well past the token's exp
  const c = route("POST", "/create-loan", { id: "EXP-1", lender: "a", borrower: "b", amountSAR: 100 }, ctx, bearer(shortLived));
  ok(c.status === 401, "expired token (virtual clock advanced past exp) -> 401");
  clockMs -= 5000; // restore for the remaining assertions in this file
}

/* ---- 6) /verify and /list stay PUBLIC even with auth ON and NO token ---- */
{
  const ctx = authOnCtx();
  const v = route("POST", "/verify", {}, ctx); // MAIN sentinel, deliberately no token/headers at all
  ok(v.status === 200 && v.body.ok === true, "auth ON, NO token: POST /verify (MAIN) -> 200 (public — the witness model)");
  const l = route("GET", "/list", {}, ctx);
  ok(l.status === 200, "auth ON, NO token: GET /list -> 200 (public)");
}

/* ---- 7) TEETH — a forged/garbage token is only rejected because the auth
   GATE checks it; the exact same request, routed through a ctx with auth OFF,
   sails straight through to 201. This proves the 401s above are the auth
   layer actually firing (router-enforced), not a coincidental validation
   error the handler would have produced anyway. ---- */
{
  const forged = Auth.issueToken({ actor: "مهاجم", secretKey: WRONG_SECRET, now: fixedNow });
  const ctxAuthOff = authOffCtx();
  const c = route("POST", "/create-loan", { id: "TEETH-1", lender: "a", borrower: "b", amountSAR: 100 }, ctxAuthOff, bearer(forged));
  ok(c.status === 201, "teeth: the SAME forged token sails through -> 201 when ctx.auth is absent (proves the 401s above come from the auth gate, not the handler)");

  const ctxAuthOn = authOnCtx();
  const c2 = route("POST", "/create-loan", { id: "TEETH-2", lender: "a", borrower: "b", amountSAR: 100 }, ctxAuthOn, bearer(forged));
  ok(c2.status === 401, "teeth: the IDENTICAL forged token, same secret/actor, IS rejected once ctx.auth.enabled is true");
}

/* ---- 8) auth.cjs unit-level checks (direct, not via the router) ---- */
{
  const token = Auth.issueToken({ actor: "actor-x", secretKey: SECRET, now: fixedNow });
  const v = Auth.verifyToken(token, SECRET, fixedNow);
  ok(v.ok === true && v.actor === "actor-x", "Auth.verifyToken: valid token verifies; actor recovered from the payload");

  const vWrongKey = Auth.verifyToken(token, WRONG_SECRET, fixedNow);
  ok(vWrongKey.ok === false, "Auth.verifyToken: the SAME token verified against the WRONG key -> rejected");

  const vMissing = Auth.verifyToken(null, SECRET, fixedNow);
  ok(vMissing.ok === false, "Auth.verifyToken: missing token -> rejected");

  const vMalformed = Auth.verifyToken("not-a-real-token-no-dot", SECRET, fixedNow);
  ok(vMalformed.ok === false, "Auth.verifyToken: malformed token (no payload/sig separator) -> rejected");

  const vNoKey = Auth.verifyToken(token, "", fixedNow);
  ok(vNoKey.ok === false, "Auth.verifyToken: no server secretKey configured -> rejected, never silently accepted");
}

/* ---- 9) auth token is NEVER part of the sealed canonical/hash — sealing the
   SAME record with vs. without a token in flight produces the IDENTICAL seal
   (auth is a layer strictly outside the golden sealing path). ---- */
{
  const ctxA = authOnCtx();
  const token = Auth.issueToken({ actor: "نورة", secretKey: SECRET, now: fixedNow });
  route("POST", "/create-loan", { id: "SEAL-PARITY-1", lender: "x", borrower: "y", amountSAR: 300, months: 2 }, ctxA, bearer(token));
  const sA = route("POST", "/seal", { id: "SEAL-PARITY-1" }, ctxA, bearer(token));

  const ctxB = authOffCtx(); // auth OFF entirely, no token ever passed
  route("POST", "/create-loan", { id: "SEAL-PARITY-1", lender: "x", borrower: "y", amountSAR: 300, months: 2 }, ctxB);
  const sB = route("POST", "/seal", { id: "SEAL-PARITY-1" }, ctxB);

  ok(sA.body.seal === sB.body.seal && !!sA.body.seal, "auth never enters the sealed canonical: identical record seals IDENTICALLY with auth on (token supplied) vs. off (no token)");
}

console.log("\n========================================================");
console.log("SERVER AUTH: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
