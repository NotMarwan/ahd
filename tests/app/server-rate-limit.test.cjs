/*
  server-rate-limit.test.cjs — T-L5 deterministic fixed-window protection.
  Tests are intentionally written before server/rate-limit.cjs and its router/
  HTTP wiring. They prove route-level limits, public-health exemption, injected
  time, and that socket identity — never a forwarded header — chooses a bucket.
*/
"use strict";
const http = require("http");
const path = require("path");
const RateLimit = require(path.join(__dirname, "..", "..", "server", "rate-limit.cjs"));
const { route } = require(path.join(__dirname, "..", "..", "server", "router.cjs"));
const { createAhdServer } = require(path.join(__dirname, "..", "..", "server", "http.cjs"));
const engine = require(path.join(__dirname, "..", "..", "server", "engine.cjs"));
const Store = require(path.join(__dirname, "..", "..", "server", "store.cjs"));

let pass = 0, fail = 0;
function ok(condition, message) {
  if (condition) { pass++; console.log("  ✓ " + message); }
  else { fail++; console.log("  ✗ " + message); }
}

function rateCtx(limiter, now, clientKey) {
  return {
    engine: engine,
    store: Store.createStore(),
    rateLimit: { enabled: true, limiter: limiter, now: now, clientKey: clientKey }
  };
}

function request(port, method, pathname, body, headers) {
  return new Promise(function (resolve, reject) {
    const payload = Buffer.from(JSON.stringify(body || {}), "utf8");
    const req = http.request({
      host: "127.0.0.1", port: port, method: method, path: pathname,
      headers: Object.assign({ "Content-Type": "application/json", "Content-Length": payload.length }, headers || {})
    }, function (res) {
      const chunks = [];
      res.on("data", function (chunk) { chunks.push(chunk); });
      res.on("end", function () {
        resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(Buffer.concat(chunks).toString("utf8")) });
      });
    });
    req.on("error", reject);
    req.end(payload);
  });
}

console.log("server-rate-limit: deterministic fixed windows; live binder trusts socket address only");

/* 1. Unit contract: limit boundary, exact-window refill, and client isolation. */
{
  const limiter = RateLimit.createFixedWindowLimiter({ limit: 2, windowMs: 60000 });
  const first = limiter.check("client-a", 0);
  const second = limiter.check("client-a", 59999);
  const blocked = limiter.check("client-a", 59999);
  const refilled = limiter.check("client-a", 60000);
  const otherClient = limiter.check("client-b", 59999);
  ok(first.allowed === true && first.remaining === 1 && first.retryAfterMs === 0, "first request is allowed with one remaining");
  ok(second.allowed === true && second.remaining === 0 && second.retryAfterMs === 0, "limit boundary permits final request");
  ok(blocked.allowed === false && blocked.remaining === 0 && blocked.retryAfterMs === 1, "over-limit request is rejected with deterministic retry delay");
  ok(refilled.allowed === true && refilled.remaining === 1 && refilled.retryAfterMs === 0, "exact next-window boundary refills bucket");
  ok(otherClient.allowed === true && otherClient.remaining === 1, "separate client receives an isolated bucket");
}

/* 2. Router seam stays opt-in: old parity context is untouched; enabled
      limiter applies 30/min to mutating routes, 120/min to /verify, never /health. */
{
  let nowMs = 0;
  const now = function () { return nowMs; };
  const noRate = { engine: engine, store: Store.createStore() };
  const oldShape = route("POST", "/verify", {}, noRate);
  ok(oldShape.status === 200 && oldShape.body.ok === true, "direct route without rateLimit retains parity behavior");

  const mutating = rateCtx(RateLimit.createFixedWindowLimiter({ limit: 30, windowMs: 60000 }), now, "direct-client");
  let mutatingStatus = 0;
  for (let i = 0; i < 31; i++) {
    mutatingStatus = route("POST", "/create-loan", { id: "RATE-" + i, lender: "a", borrower: "b", amountSAR: 100 }, mutating).status;
  }
  ok(mutatingStatus === 429, "31st mutating request is rejected at 30/min/client");

  const verify = rateCtx(RateLimit.createFixedWindowLimiter({ limit: 120, windowMs: 60000 }), now, "verify-client");
  let verifyResult;
  for (let i = 0; i < 121; i++) verifyResult = route("POST", "/verify", {}, verify);
  ok(verifyResult.status === 429 && verifyResult.body.error === "rate limit exceeded" && verifyResult.body.retryAfterMs === 60000,
    "121st /verify request is deterministic 429 at 120/min/client");

  const health = rateCtx(RateLimit.createFixedWindowLimiter({ limit: 1, windowMs: 60000 }), now, "health-client");
  let healthStatus = 0;
  for (let i = 0; i < 125; i++) healthStatus = route("GET", "/health", {}, health).status;
  ok(healthStatus === 200, "/health remains unlimited even with an enabled limiter");
}

/* 3. Live HTTP: caller-supplied forwarding headers cannot bypass the one
      socket-address bucket. Injected clock pins Retry-After exactly. */
(async function () {
  const fixedNow = function () { return 5000; };
  const server = createAhdServer(Store.createStore(), { enabled: false }, { now: fixedNow });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  const port = server.address().port;
  try {
    let result;
    for (let i = 0; i < 121; i++) {
      result = await request(port, "POST", "/verify", {}, { "X-Forwarded-For": "198.51.100." + i });
    }
    ok(result.status === 429 && result.body.retryAfterMs === 55000, "live /verify rejects header-rotation bypass from one socket");
    ok(result.headers["retry-after"] === "55", "live 429 exposes deterministic Retry-After seconds");

    let health;
    for (let i = 0; i < 125; i++) health = await request(port, "GET", "/health", {});
    ok(health.status === 200 && health.body.ok === true, "live /health remains unlimited after /verify exhaustion");
  } catch (error) {
    ok(false, "live HTTP test completed: " + error.message);
  } finally {
    await new Promise(function (resolve) { server.close(resolve); });
  }

  console.log("\n========================================================");
  console.log("SERVER RATE LIMIT: " + pass + " passed, " + fail + " failed");
  console.log("========================================================");
  process.exit(fail ? 1 : 0);
})();
