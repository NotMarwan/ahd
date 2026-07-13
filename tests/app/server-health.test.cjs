/* ============================================================================
   server-health.test.cjs — T5 deploy story: an additive GET /health endpoint
   for container/orchestrator healthchecks (Docker HEALTHCHECK, k8s liveness
   probes, etc). Deterministic by construction: the body is a STATIC
   { ok: true } — no wall-clock timestamp/uptime, so this suite never
   introduces a Date.now/new Date primitive into server/*.cjs (still enforced
   by server-parity.test.cjs's static scan).

   Public by construction: /health is `mutating: false` in server/router.cjs's
   ROUTES table, so the auth gate (server/router.cjs's `if (r.mutating && ...)`
   guard) never fires for it — mirrors /verify and /list (see
   server-auth.test.cjs section 6). Asserted directly here too, auth ON,
   with NO token, so a regression that accidentally marks /health mutating
   would be caught red, not silently passed.
============================================================================ */
"use strict";
const path = require("path");
const { route } = require(path.join(__dirname, "..", "..", "server", "router.cjs"));
const engine = require(path.join(__dirname, "..", "..", "server", "engine.cjs"));
const Store = require(path.join(__dirname, "..", "..", "server", "store.cjs"));

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; console.log("  ✓ " + msg); } else { fail++; console.log("  ✗ " + msg); } };

console.log("server-health: additive GET /health (public, deterministic, no auth)");

function freshCtx() { return { engine: engine, store: Store.createStore() }; }

/* ---- GET /health -> 200 { ok: true }, no auth, no ctx.auth at all ---- */
{
  const r = route("GET", "/health", {}, freshCtx());
  ok(r.status === 200, "GET /health: 200");
  ok(r.body.ok === true, "GET /health: body.ok === true");
  ok(Object.keys(r.body).length === 1 && Object.keys(r.body)[0] === "ok", "GET /health: body is EXACTLY { ok: true } — no wall-clock timestamp/uptime leaks in");
}

/* ---- GET /health is PUBLIC even with auth ON and NO token (mirrors /verify + /list) ---- */
{
  const ctx = { engine: engine, store: Store.createStore(), auth: { enabled: true, secretKey: "any-key" } };
  const r = route("GET", "/health", {}, ctx); // deliberately no headers/token at all
  ok(r.status === 200 && r.body.ok === true, "GET /health, auth ON, NO token: still 200 (public — never gated)");
}

/* ---- determinism: calling twice returns byte-identical JSON (no clock/random) ---- */
{
  const a = JSON.stringify(route("GET", "/health", {}, freshCtx()).body);
  const b = JSON.stringify(route("GET", "/health", {}, freshCtx()).body);
  ok(a === b && a === '{"ok":true}', "GET /health: byte-identical response across calls — '{\"ok\":true}' exactly");
}

console.log("\n========================================================");
console.log("SERVER HEALTH: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
