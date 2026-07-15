#!/usr/bin/env node
"use strict";

const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const Tripwire = require("./tripwire.cjs");

const ROOT = path.join(__dirname, "..");
const MAX_BUDGET_MS = 30000;
const PLAN = Object.freeze({
  app: { command: "node", args: ["app/_serve-app.cjs"] },
  terminal: { command: "node", args: ["server/demo-bank-node.cjs"] },
  gate: "node tests/run-all.cjs"
});

function check(name, ok, detail) { return { name, ok: !!ok, detail: detail || null }; }

function inspect(root) {
  const checks = [];
  checks.push(check("offline-app", fs.existsSync(path.join(root, "app", "_serve-app.cjs")), "app/_serve-app.cjs"));
  checks.push(check("terminal-proof", fs.existsSync(path.join(root, "server", "demo-bank-node.cjs")), "server/demo-bank-node.cjs"));
  checks.push(check("phase-gate", fs.existsSync(path.join(root, "tests", "run-all.cjs")), PLAN.gate));
  const fallback = path.join(root, "docs", "pitch", "fallback");
  const frames = fs.existsSync(fallback) ? fs.readdirSync(fallback).filter(file => /\.png$/i.test(file)).sort() : [];
  checks.push(check("fallback-media", frames.length === 6, frames.length + "/6 PNG frames"));

  const presenceDir = path.join(root, "_meta", "agent-presence");
  const offenders = [];
  if (fs.existsSync(presenceDir)) fs.readdirSync(presenceDir).filter(file => file.endsWith(".json")).forEach(file => {
    try {
      const value = JSON.parse(fs.readFileSync(path.join(presenceDir, file), "utf8"));
      if (value.status !== "exited") offenders.push(file + ":" + String(value.status || "missing"));
    } catch (_) { offenders.push(file + ":invalid-json"); }
  });
  checks.push(check("presence", offenders.length === 0, offenders.join(", ") || "all exited"));
  const tripwire = Tripwire.verify(root);
  checks.push(check("tripwire", tripwire.ok, tripwire.ok ? tripwire.actual : (tripwire.reason || tripwire.actual || "failed")));
  return { ok: checks.every(item => item.ok), checks, errors: checks.filter(item => !item.ok).map(item => item.name + ": " + item.detail) };
}

function normalizeEvidence(value) {
  const volatile = new Set(["duration_ms", "durationMs", "started_at", "finished_at", "port", "temp_dir", "pid"]);
  if (Array.isArray(value)) return value.map(normalizeEvidence);
  if (!value || typeof value !== "object") return value;
  const out = {};
  Object.keys(value).sort().forEach(key => { if (!volatile.has(key)) out[key] = normalizeEvidence(value[key]); });
  return out;
}

function runCommand(command, args, options) {
  const opts = options || {};
  const timeoutMs = Number(opts.timeoutMs || 1000);
  return new Promise(resolve => {
    const start = process.hrtime.bigint();
    let child, timedOut = false, matched = false, settled = false, stdout = "", stderr = "";
    function elapsed() { return Number((process.hrtime.bigint() - start) / 1000000n); }
    function finish(code, signal, error) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ ok: !timedOut && !error && (matched || code === 0), code, signal, timedOut, cleaned: true, durationMs: elapsed(), stdout, stderr, error: error ? String(error.message || error) : null });
    }
    try {
      child = cp.spawn(command, args || [], { cwd: opts.cwd, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
    } catch (error) {
      resolve({ ok: false, code: null, signal: null, timedOut: false, cleaned: true, durationMs: elapsed(), stdout, stderr, error: String(error.message || error) });
      return;
    }
    const timer = setTimeout(() => {
      timedOut = true;
      try { child.kill(); } catch (_) {}
    }, timeoutMs);
    function capture(kind, chunk) {
      const text = String(chunk);
      if (kind === "stdout") stdout += text; else stderr += text;
      if (!matched && opts.successPattern && opts.successPattern.test(stdout + stderr)) {
        matched = true;
        try { child.kill(); } catch (_) {}
      }
    }
    child.stdout.on("data", chunk => capture("stdout", chunk));
    child.stderr.on("data", chunk => capture("stderr", chunk));
    child.on("error", error => finish(null, null, error));
    child.on("close", (code, signal) => finish(code, signal, null));
  });
}

async function executePlan(root, options) {
  const opts = options || {};
  const budgetMs = Number(opts.budgetMs || MAX_BUDGET_MS);
  if (!Number.isSafeInteger(budgetMs) || budgetMs <= 0 || budgetMs > MAX_BUDGET_MS) return { ok: false, checks: [], errors: ["budget must be 1..30000 ms"] };
  const staticResult = (opts.inspect || inspect)(root);
  if (!staticResult.ok) return staticResult;
  const runner = opts.runner || runCommand;
  const app = await runner(PLAN.app.command, PLAN.app.args, { cwd: root, timeoutMs: Math.min(5000, budgetMs), successPattern: /https?:\/\/localhost:8124|listening|8124/i });
  const remaining = Math.max(1, budgetMs - Math.min(app.durationMs || 0, budgetMs));
  const terminal = await runner(PLAN.terminal.command, PLAN.terminal.args, { cwd: root, timeoutMs: remaining });
  const checks = staticResult.checks.concat([
    check("offline-app-launch", app.ok && app.cleaned, app.error || (app.timedOut ? "timeout" : "exit " + app.code)),
    check("terminal-proof-run", terminal.ok && terminal.cleaned, terminal.error || (terminal.timedOut ? "timeout" : "exit " + terminal.code))
  ]);
  return { ok: checks.every(item => item.ok), status: checks.every(item => item.ok) ? "ready" : "not-ready", checks, errors: checks.filter(item => !item.ok).map(item => item.name + ": " + item.detail), duration_ms: (app.durationMs || 0) + (terminal.durationMs || 0) };
}

module.exports = { PLAN, MAX_BUDGET_MS, inspect, normalizeEvidence, runCommand, executePlan };

if (require.main === module) {
  executePlan(ROOT, { budgetMs: MAX_BUDGET_MS }).then(result => {
    result.checks.forEach(item => console.log((item.ok ? "  ✓ " : "  ✗ ") + item.name + (item.detail ? " — " + item.detail : "")));
    console.log("\n============================================================");
    console.log(result.ok ? "  READY FOR STAGE ✅" : "  NOT READY ❌");
    console.log("============================================================");
    process.exit(result.ok ? 0 : 1);
  }).catch(error => {
    console.error("NOT READY: " + (error && error.message ? error.message : String(error)));
    process.exit(1);
  });
}
