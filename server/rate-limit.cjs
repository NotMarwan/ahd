/*
  rate-limit.cjs — deterministic, in-process fixed-window rate limiting.

  This layer protects the local server's availability. It does not inspect a
  loan, infer trust, rank people, or enter any sealed record. Callers inject
  monotonic milliseconds into check(), keeping route tests deterministic and
  avoiding wall-clock time.

  createFixedWindowLimiter({ limit, windowMs }).check(key, nowMs) returns
  { allowed, remaining, retryAfterMs }. State is process-local by design; a
  deployed multi-instance service needs a shared limiter before horizontal
  scaling (documented in the cloud profile).
*/
"use strict";

function positiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) throw new Error(name + " must be a positive integer");
  return value;
}

function createFixedWindowLimiter(options) {
  var opts = options || {};
  var limit = positiveInteger(opts.limit, "limit");
  var windowMs = positiveInteger(opts.windowMs, "windowMs");
  var buckets = new Map();

  function check(key, nowMs) {
    if (!Number.isInteger(nowMs) || nowMs < 0) throw new Error("nowMs must be a non-negative integer");
    var clientKey = String(key || "unknown");
    var startMs = Math.floor(nowMs / windowMs) * windowMs;
    var bucket = buckets.get(clientKey);
    if (!bucket || bucket.startMs !== startMs) {
      bucket = { startMs: startMs, count: 0 };
      buckets.set(clientKey, bucket);
    }
    if (bucket.count >= limit) {
      return { allowed: false, remaining: 0, retryAfterMs: startMs + windowMs - nowMs };
    }
    bucket.count += 1;
    return { allowed: true, remaining: limit - bucket.count, retryAfterMs: 0 };
  }

  return Object.freeze({ check: check });
}

module.exports = { createFixedWindowLimiter: createFixedWindowLimiter };
