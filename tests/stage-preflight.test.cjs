#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
let Preflight;
const PREFLIGHT_PATH = path.join(__dirname, "stage-preflight.cjs");
try {
  if (/module\.exports/.test(fs.readFileSync(PREFLIGHT_PATH, "utf8"))) Preflight = require(PREFLIGHT_PATH);
} catch (_) {}

let passed = 0, failed = 0;
function ok(condition, name) {
  if (condition) { passed++; console.log("  ✓ " + name); }
  else { failed++; console.log("  ✗ " + name); }
}

console.log("stage-preflight.test: static stage assets, bounded commands, normalization");
ok(!!Preflight, "preflight module exports controls");
if (!Preflight) {
  console.log("stage-preflight.test: " + passed + " passed, " + failed + " failed");
  process.exit(1);
}

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ahd-stage-preflight-"));
  ["app", "server", "demo", "tests/fixtures", "docs/pitch/fallback", "_meta/agent-presence"].forEach(dir => fs.mkdirSync(path.join(root, dir), { recursive: true }));
  fs.writeFileSync(path.join(root, "app", "_serve-app.cjs"), "process.exit(0);\n");
  fs.writeFileSync(path.join(root, "server", "demo-bank-node.cjs"), "process.exit(0);\n");
  fs.writeFileSync(path.join(root, "tests", "run-all.cjs"), "process.exit(0);\n");
  fs.writeFileSync(path.join(root, "demo", "index.html"), "frozen", "utf8");
  const hash = crypto.createHash("sha256").update("frozen").digest("hex");
  fs.writeFileSync(path.join(root, "tests", "fixtures", "demo.sha256"), hash + "  demo/index.html\n");
  for (let i = 1; i <= 6; i++) fs.writeFileSync(path.join(root, "docs", "pitch", "fallback", String(i).padStart(2, "0") + "-frame.png"), "png");
  fs.writeFileSync(path.join(root, "_meta", "agent-presence", "root.json"), JSON.stringify({ agent_id: "root", status: "exited", last_heartbeat: "2026-07-15T03:00:00+03:00" }));
  return root;
}

let root = fixture();
try {
  ok(Preflight.inspect(root).ok, "accepts offline app, terminal proof, six fallback frames, exited presence, and matching demo hash");
  fs.unlinkSync(path.join(root, "docs", "pitch", "fallback", "06-frame.png"));
  ok(!Preflight.inspect(root).ok, "rejects incomplete fallback media");
} finally { fs.rmSync(root, { recursive: true, force: true }); }

root = fixture();
try {
  fs.writeFileSync(path.join(root, "_meta", "agent-presence", "active.json"), JSON.stringify({ agent_id: "other", status: "active", last_heartbeat: "2026-07-15T04:00:00+03:00" }));
  ok(!Preflight.inspect(root).ok, "rejects active presence regardless of heartbeat age");
  fs.unlinkSync(path.join(root, "_meta", "agent-presence", "active.json"));
  fs.writeFileSync(path.join(root, "demo", "index.html"), "tampered");
  ok(!Preflight.inspect(root).ok, "rejects wrong demo hash");
} finally { fs.rmSync(root, { recursive: true, force: true }); }

root = fixture();
try {
  fs.unlinkSync(path.join(root, "server", "demo-bank-node.cjs"));
  ok(!Preflight.inspect(root).ok, "rejects missing terminal proof");
} finally { fs.rmSync(root, { recursive: true, force: true }); }

ok(Preflight.PLAN.app.command === "node" && Preflight.PLAN.app.args.join(" ") === "app/_serve-app.cjs", "pins offline app launch command");
ok(Preflight.PLAN.terminal.command === "node" && Preflight.PLAN.terminal.args.join(" ") === "server/demo-bank-node.cjs", "pins terminal proof command");
ok(Preflight.PLAN.gate === "node tests/run-all.cjs", "pins exact phase gate command without running it in preflight budget");
ok(Preflight.MAX_BUDGET_MS === 30000, "caps preflight execution budget at 30 seconds");

const normalizedA = Preflight.normalizeEvidence({ status: "ready", duration_ms: 20, started_at: "x", port: 8124, temp_dir: "C:/tmp/a", checks: [{ name: "tripwire", ok: true }] });
const normalizedB = Preflight.normalizeEvidence({ status: "ready", duration_ms: 99, started_at: "y", port: 9999, temp_dir: "D:/tmp/b", checks: [{ name: "tripwire", ok: true }] });
ok(JSON.stringify(normalizedA) === JSON.stringify(normalizedB), "normalizes volatile time, port, and temp evidence");
ok(normalizedA.checks[0].ok === true, "preserves stable evidence fields");

(async function () {
  const timeout = await Preflight.runCommand(process.execPath, ["-e", "setInterval(function(){},1000)"], { cwd: __dirname, timeoutMs: 100 });
  ok(timeout.timedOut === true && timeout.cleaned === true && timeout.durationMs < 3000, "times out and cleans a hung child promptly");
  const success = await Preflight.runCommand(process.execPath, ["-e", "process.exit(0)"], { cwd: __dirname, timeoutMs: 1000 });
  ok(success.ok === true && success.cleaned === true, "cleans successful child state");
  const plan = await Preflight.executePlan("C:/fixture", {
    budgetMs: 30000,
    inspect: () => ({ ok: true, checks: [{ name: "static", ok: true }] }),
    runner: async (command, args) => ({ ok: command === "node" && args.length === 1, timedOut: false, cleaned: true, durationMs: 1 })
  });
  ok(plan.ok && plan.checks.every(check => check.ok), "executes bounded app and terminal checks through injected runner");
  const overBudget = await Preflight.executePlan("C:/fixture", { budgetMs: 30001, inspect: () => ({ ok: true, checks: [] }), runner: async () => ({ ok: true, cleaned: true, durationMs: 1 }) });
  ok(!overBudget.ok && /budget/i.test(overBudget.errors.join(" ")), "rejects a preflight budget over 30 seconds");
  console.log("stage-preflight.test: " + passed + " passed, " + failed + " failed");
  process.exit(failed ? 1 : 0);
})().catch(error => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
