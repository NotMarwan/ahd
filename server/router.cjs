/* ============================================================================
   router.cjs — the PURE request-handler dispatcher for the Ahd server slice.

   route(method, pathname, body, ctx) -> { status, body }. No socket, no I/O
   beyond ctx.store (in-memory), no clock. This is the SAME function called by
   the live http binder (server/http.cjs) AND by the deterministic parity test
   (tests/app/server-parity.test.cjs) — the test never opens a port.
============================================================================ */
"use strict";
const Handlers = require("./handlers.cjs");

const ROUTES = [
  { method: "POST", path: "/create-loan", fn: Handlers.createLoan },
  { method: "POST", path: "/seal", fn: Handlers.sealLoan },
  { method: "POST", path: "/verify", fn: Handlers.verifyLoan },
  { method: "POST", path: "/net", fn: Handlers.netLoans },
  { method: "GET", path: "/list", fn: Handlers.listLoans }
];

function route(method, pathname, body, ctx) {
  var m = String(method || "GET").toUpperCase();
  var p = String(pathname || "/").split("?")[0];
  for (var i = 0; i < ROUTES.length; i++) {
    if (ROUTES[i].method === m && ROUTES[i].path === p) return ROUTES[i].fn(body, ctx);
  }
  return { status: 404, body: { ok: false, error: "no such route: " + m + " " + p } };
}

module.exports = { route: route, ROUTES: ROUTES };
