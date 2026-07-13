/* ============================================================================
   auth.cjs — HMAC session tokens for the thin server slice (Node built-ins
   only: crypto; no npm deps). This is an AUTHENTICATION layer, not a lending/
   scoring one: it answers "who is acting", never "should this loan be
   approved" — the spine (witness-only, no riba/judging/credit-score) is
   untouched by this file.

   Token shape:  <payloadB64>.<hmacHex>
     payloadB64 = base64url( JSON.stringify({ actor, issuedAt, exp }) )
     hmacHex    = HMAC-SHA256(payloadB64, secretKey) via Node's crypto.createHmac
   Verification recomputes hmacHex over the SAME payloadB64 string and
   timing-safe-compares it to the token's signature BEFORE ever trusting the
   decoded payload — so a tampered payload (which changes payloadB64) or a
   signature forged with the wrong key both fail identically. Only after the
   signature checks out is `exp` compared against an injected clock.

   A token is NEVER folded into any hashed/sealed canonical — auth is a layer
   strictly OUTSIDE app/features/create.js + the golden engine's sealing path
   (see server/router.cjs: the auth gate runs BEFORE a handler is invoked, and
   no handler reads ctx.auth or a token).

   Clock (determinism): verify/issue take an INJECTED `now()` (tests pass a
   fixed function -> fully deterministic). The module default, `defaultNow`,
   reads process.hrtime.bigint() — Node's MONOTONIC clock (ns since an
   arbitrary, fixed-per-process reference point) converted to milliseconds.
   This deliberately avoids Date.now()/new Date() (this project's determinism
   rule forbids a wall/epoch clock in any server/*.cjs file — enforced by
   tests/app/server-parity.test.cjs's static scan across every file in this
   directory) while still giving the LIVE process a genuinely real, elapsed-
   time-accurate clock for token expiry (hrtime advances at the same rate as
   real time; it just isn't anchored to the Unix epoch). No Math.random is
   used anywhere in this file.
============================================================================ */
"use strict";
const crypto = require("crypto");

const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes

/* monotonic, real-elapsed-time clock — NOT Date.now/new Date (see header). */
function defaultNow() {
  return Number(process.hrtime.bigint() / 1000000n); // ns -> ms
}

function base64urlEncode(str) {
  return Buffer.from(str, "utf8").toString("base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(str) {
  var padded = String(str).replace(/-/g, "+").replace(/_/g, "/");
  while (padded.length % 4) padded += "=";
  return Buffer.from(padded, "base64").toString("utf8");
}

function hmacHex(payloadB64, secretKey) {
  return crypto.createHmac("sha256", String(secretKey)).update(payloadB64).digest("hex");
}

/* constant-time signature compare — resistant to timing side-channels;
   falls back to `false` (never throws) when lengths differ. */
function safeEqualHex(a, b) {
  var bufA = Buffer.from(String(a || ""), "utf8");
  var bufB = Buffer.from(String(b || ""), "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/* issueToken({actor, secretKey, ttlMs, now}) -> "payloadB64.hmacHex" */
function issueToken(opts) {
  var o = opts || {};
  if (!o.actor || typeof o.actor !== "string") throw new Error("issueToken: actor (string) is required");
  if (!o.secretKey) throw new Error("issueToken: secretKey is required");
  var now = typeof o.now === "function" ? o.now : defaultNow;
  var ttlMs = o.ttlMs != null ? Number(o.ttlMs) : DEFAULT_TTL_MS;
  var issuedAt = now();
  var payload = { actor: o.actor, issuedAt: issuedAt, exp: issuedAt + ttlMs };
  var payloadB64 = base64urlEncode(JSON.stringify(payload));
  return payloadB64 + "." + hmacHex(payloadB64, o.secretKey);
}

/* verifyToken(token, secretKey, now) -> { ok, actor, error } */
function verifyToken(token, secretKey, now) {
  var clock = typeof now === "function" ? now : defaultNow;
  if (!token || typeof token !== "string") return { ok: false, error: "missing token" };
  var dot = token.indexOf(".");
  if (dot <= 0 || dot === token.length - 1) return { ok: false, error: "malformed token" };
  var payloadB64 = token.slice(0, dot);
  var sig = token.slice(dot + 1);
  if (!secretKey) return { ok: false, error: "server has no auth key configured" };
  var expectedSig = hmacHex(payloadB64, secretKey);
  if (!safeEqualHex(sig, expectedSig)) return { ok: false, error: "bad signature" };

  var payload;
  try {
    payload = JSON.parse(base64urlDecode(payloadB64));
  } catch (e) {
    return { ok: false, error: "malformed payload" };
  }
  if (!payload || typeof payload.actor !== "string" || typeof payload.exp !== "number") {
    return { ok: false, error: "malformed payload" };
  }
  if (clock() > payload.exp) return { ok: false, error: "expired" };
  return { ok: true, actor: payload.actor };
}

/* resolveSecretKey(dataDir) — for the LIVE process only (server/http.cjs):
   persist a once-generated random signing key alongside the durable loan
   log so it survives restarts and can be shared with server/issue-token.cjs
   (an out-of-band CLI, not a self-service network registration endpoint —
   real user registration/login-over-HTTP remains a residual gap, flagged
   honestly, not faked). Uses crypto.randomBytes (never Math.random). */
function resolveSecretKey(dataDir) {
  var fs = require("fs");
  var path = require("path");
  fs.mkdirSync(dataDir, { recursive: true });
  var keyFile = path.join(dataDir, "auth.key");
  if (fs.existsSync(keyFile)) {
    var existing = fs.readFileSync(keyFile, "utf8").trim();
    if (existing) return existing;
  }
  var fresh = crypto.randomBytes(32).toString("hex");
  fs.writeFileSync(keyFile, fresh, "utf8");
  return fresh;
}

module.exports = {
  issueToken: issueToken, verifyToken: verifyToken, defaultNow: defaultNow,
  resolveSecretKey: resolveSecretKey, DEFAULT_TTL_MS: DEFAULT_TTL_MS
};
