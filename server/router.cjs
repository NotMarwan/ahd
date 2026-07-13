/* ============================================================================
   router.cjs — the PURE request-handler dispatcher for the Ahd server slice.

   route(method, pathname, body, ctx, headers) -> { status, body }. No socket,
   no I/O beyond ctx.store (in-memory), no clock. This is the SAME function
   called by the live http binder (server/http.cjs) AND by the deterministic
   parity test (tests/app/server-parity.test.cjs) — the test never opens a
   port. `headers` is an OPTIONAL 5th argument (defaults to {}) added for T2
   auth — every pre-existing 4-arg call site (server-parity/server-persistence)
   is untouched and keeps working exactly as before.

   Auth (opt-in seam, mirrors store.cjs's dataDir pattern): mutating routes
   (create-loan/seal/net) are marked `mutating: true`. The gate only fires
   when the CALLER opts in via ctx.auth = { enabled: true, secretKey, now? }
   — with no ctx.auth (every existing test's ctx shape), routing is IDENTICAL
   to before this file changed. /verify and /list are never gated — witnessing
   is meant to be open to anyone (the witness model), auth or not. See
   server/auth.cjs for the token format; server/http.cjs turns this ON by
   default for the live process.
============================================================================ */
"use strict";
const Handlers = require("./handlers.cjs");
const Auth = require("./auth.cjs");

const ROUTES = [
  { method: "POST", path: "/create-loan", fn: Handlers.createLoan, mutating: true },
  { method: "POST", path: "/seal", fn: Handlers.sealLoan, mutating: true },
  { method: "POST", path: "/verify", fn: Handlers.verifyLoan, mutating: false },
  { method: "POST", path: "/net", fn: Handlers.netLoans, mutating: true },
  { method: "GET", path: "/list", fn: Handlers.listLoans, mutating: false },
  { method: "GET", path: "/health", fn: Handlers.health, mutating: false }
];

/* extract "Bearer <token>" from a case-insensitive Authorization header */
function bearerToken(headers) {
  var h = headers || {};
  var raw = h.authorization || h.Authorization || "";
  var m = /^Bearer\s+(.+)$/.exec(String(raw).trim());
  return m ? m[1] : null;
}

function route(method, pathname, body, ctx, headers) {
  var m = String(method || "GET").toUpperCase();
  var p = String(pathname || "/").split("?")[0];
  for (var i = 0; i < ROUTES.length; i++) {
    var r = ROUTES[i];
    if (r.method !== m || r.path !== p) continue;
    if (r.mutating && ctx && ctx.auth && ctx.auth.enabled) {
      var token = bearerToken(headers);
      var v = Auth.verifyToken(token, ctx.auth.secretKey, ctx.auth.now);
      if (!v.ok) return { status: 401, body: { ok: false, error: "unauthorized: " + v.error } };
    }
    return r.fn(body, ctx);
  }
  return { status: 404, body: { ok: false, error: "no such route: " + m + " " + p } };
}

module.exports = { route: route, ROUTES: ROUTES };
