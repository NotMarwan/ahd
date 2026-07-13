/* ============================================================================
   http.cjs — the LIVE Node http binder for the Ahd server slice.

   Built-ins only (http, path). Binds LOCALHOST ONLY, fully offline, zero
   external calls. This file is NOT part of the deterministic gate (it opens a
   real socket) — the deterministic proof is server/router.cjs's route(),
   called directly by tests/app/server-parity.test.cjs. Use server/smoke-live.cjs
   for an optional, manual, real-socket smoke check of this file.

   Durable by default: the live process persists every witnessed/sealed loan
   to an append-only log under DATA_DIR (server/data/ unless AHD_DATA_DIR
   overrides it — see server/store.cjs) so restarting this process does NOT
   lose server-created loans. Callers that want an ephemeral store (e.g. a
   one-off script) can still pass their own `store` argument explicitly.

   Authenticated by default (T2): mutating endpoints (/create-loan, /seal,
   /net) require a valid "Authorization: Bearer <token>" HMAC session token
   (see server/auth.cjs). /verify and /list stay PUBLIC — witnessing is meant
   to be open. The signing key is generated once (crypto.randomBytes) and
   persisted at DATA_DIR/auth.key (or set AHD_AUTH_KEY yourself); mint tokens
   for an actor with `node server/issue-token.cjs <actor>`. Callers that want
   auth OFF (e.g. an embedded/offline harness) can pass their own `authConfig`
   argument explicitly ({ enabled: false }).

   Run:  node server/http.cjs   ->  http://127.0.0.1:8225
============================================================================ */
"use strict";
const http = require("http");
const path = require("path");
const route = require("./router.cjs").route;
const engine = require("./engine.cjs");
const Store = require("./store.cjs");
const Auth = require("./auth.cjs");
const RateLimit = require("./rate-limit.cjs");

const PORT = 8225;
const HOST = "127.0.0.1"; // localhost only — never binds 0.0.0.0
const DATA_DIR = process.env.AHD_DATA_DIR || path.join(__dirname, "data");

function defaultAuthConfig() {
  var secretKey = process.env.AHD_AUTH_KEY || Auth.resolveSecretKey(DATA_DIR);
  return { enabled: true, secretKey: secretKey };
}

/* Monotonic elapsed milliseconds, injected into every live rate-limit check.
   Never use wall-clock time: rate windows need elapsed duration only. */
function defaultRateNow() {
  return Number(process.hrtime.bigint() / 1000000n);
}

function defaultRateLimitConfig() {
  return {
    enabled: true,
    mutatingLimiter: RateLimit.createFixedWindowLimiter({ limit: 30, windowMs: 60000 }),
    verifyLimiter: RateLimit.createFixedWindowLimiter({ limit: 120, windowMs: 60000 }),
    now: defaultRateNow
  };
}

/* Partial live overrides (normally an injected test clock) retain the route
   policy. Passing { enabled: false } remains the explicit opt-out seam. */
function resolveRateLimitConfig(overrides) {
  return Object.assign(defaultRateLimitConfig(), overrides || {});
}

function createAhdServer(store, authConfig, rateLimitConfig) {
  var ctx = {
    engine: engine,
    store: store || Store.createStore(DATA_DIR),
    auth: authConfig || defaultAuthConfig(),
    rateLimit: resolveRateLimitConfig(rateLimitConfig)
  };
  return http.createServer(function (req, res) {
    var chunks = [];
    req.on("data", function (c) { chunks.push(c); });
    req.on("error", function () {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ ok: false, error: "request error" }));
    });
    req.on("end", function () {
      var body = {};
      var raw = Buffer.concat(chunks).toString("utf8");
      if (raw) {
        try {
          body = JSON.parse(raw);
        } catch (e) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: false, error: "invalid JSON body" }));
          return;
        }
      }
      /* Identity is the actual connected peer. Deliberately ignore forwarded
         headers: localhost server does not trust a proxy to attest addresses. */
      var requestCtx = Object.assign({}, ctx, {
        rateLimit: Object.assign({}, ctx.rateLimit || {}, { clientKey: (req.socket && req.socket.remoteAddress) || "unknown" })
      });
      var result = route(req.method, req.url, body, requestCtx, req.headers);
      var responseHeaders = { "Content-Type": "application/json; charset=utf-8" };
      if (result.status === 429 && result.body && Number.isInteger(result.body.retryAfterMs)) {
        responseHeaders["Retry-After"] = String(Math.max(1, Math.ceil(result.body.retryAfterMs / 1000)));
      }
      res.writeHead(result.status, responseHeaders);
      res.end(JSON.stringify(result.body));
    });
  });
}

if (require.main === module) {
  createAhdServer().listen(PORT, HOST, function () {
    console.log("ahd-server (thin) on http://" + HOST + ":" + PORT);
  });
}

module.exports = {
  createAhdServer: createAhdServer, PORT: PORT, HOST: HOST, DATA_DIR: DATA_DIR,
  defaultAuthConfig: defaultAuthConfig, defaultRateLimitConfig: defaultRateLimitConfig,
  resolveRateLimitConfig: resolveRateLimitConfig, defaultRateNow: defaultRateNow
};
