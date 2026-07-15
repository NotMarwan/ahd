#!/usr/bin/env node
/* run-all.cjs — the single-keystroke gate («شغّلها أمام اللجنة»).
   Additive convenience wrapper: runs every gate command + the demo tripwire and prints one
   judge-readable banner. It weakens nothing — each underlying suite still fails the process
   on any red. Usage:  cd tests && node run-all.cjs                                        */
"use strict";
var cp = require("child_process");
var path = require("path");

var HERE = __dirname;
var ROOT = path.join(HERE, "..");

var steps = [
  { key: "coreLogic", name: "core logic  (run-tests)", cmd: "node run-tests.cjs", cwd: HERE },
  { key: "offline", name: "offline     (offline-check)", cmd: "node offline-check.cjs", cwd: HERE },
  { key: "domSmoke", name: "dom smoke   (dom-smoke)", cmd: "node dom-smoke.cjs", cwd: HERE },
  { key: "structure", name: "structure   (structure-check)", cmd: "node structure-check.cjs", cwd: HERE },
  { key: "app", name: "app suites  (run-app-tests)", cmd: "node app/run-app-tests.cjs", cwd: HERE }
];

function extractCounts(out) {
  // sums every "N passed" / counts every "M failed" the harnesses print
  var passed = 0, failed = 0, m;
  var reP = /(\d+)\s+passed/g, reF = /(\d+)\s+failed/g;
  while ((m = reP.exec(out))) passed += parseInt(m[1], 10);
  while ((m = reF.exec(out))) failed += parseInt(m[1], 10);
  return { passed: passed, failed: failed };
}

var totalPassed = 0, totalFailed = 0, broken = [];
var stepCounts = {};
var t0 = process.hrtime();

for (var i = 0; i < steps.length; i++) {
  var s = steps[i], out = "", ok = true;
  try {
    out = cp.execSync(s.cmd, { cwd: s.cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    ok = false;
    out = String((e && e.stdout) || "") + String((e && e.stderr) || "");
  }
  var c = extractCounts(out);
  stepCounts[s.key] = c.passed;
  totalPassed += c.passed; totalFailed += c.failed;
  if (!ok || c.failed > 0) broken.push(s.name);
  console.log((ok && c.failed === 0 ? "  ✓ " : "  ✗ ") + s.name + " — " + c.passed + " passed, " + c.failed + " failed");
}

/* JL-6: no-drift gate — hand the LIVE numbers we just computed (never
   hardcoded) to gate-drift-check.cjs, which fails red if any judge-facing
   surface cites a stale gate-assertion count. Runs once, no re-invocation
   of any suite above. Like the tripwire below, this is a META gate condition
   (process/doc hygiene) — its own internal self-teeth are NOT folded into
   the headline product totalPassed/totalFailed, so adding drift-check teeth
   never itself moves the very number every doc cites (which would just
   reintroduce the drift this check exists to catch). */
var policyOk = false, policyOut = "";
try {
  policyOut = cp.execSync("node agent-governance.cjs", { cwd: HERE, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  policyOk = /AGENT-GOVERNANCE: OK/.test(policyOut);
} catch (e) {
  policyOut = String((e && e.stdout) || "") + String((e && e.stderr) || "");
}
if (!policyOk) broken.push("agent-policy (agent-governance)");
console.log((policyOk ? "  ✓ " : "  ✗ ") + "agent-policy (agent-governance) — " + (policyOk ? "binding task/evidence/path policy green (meta, not in product total)" : "FAILED:\n" + policyOut));

var readmeOut = "", readmeOk = false;
try {
  readmeOut = cp.execSync("node readme-judge-contract.cjs", { cwd: HERE, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  readmeOk = /README JUDGE CONTRACT OK/.test(readmeOut);
} catch (e) {
  readmeOut = String((e && e.stdout) || "") + String((e && e.stderr) || "");
}
if (!readmeOk) broken.push("readme-judge (public story)");
console.log((readmeOk ? "  ✓ " : "  ✗ ") + "readme-judge (public story) — " + (readmeOk ? "judge-first story and tracked visuals green (meta, not in product total)" : "FAILED:\n" + readmeOut));

var driftEnv = Object.assign({}, process.env, {
  AHD_GATE_TOTAL: String(totalPassed),
  AHD_GATE_CORE_LOGIC: String(stepCounts.coreLogic || 0),
  AHD_GATE_OFFLINE: String(stepCounts.offline || 0),
  AHD_GATE_DOM_SMOKE: String(stepCounts.domSmoke || 0),
  AHD_GATE_STRUCTURE: String(stepCounts.structure || 0),
  AHD_GATE_APP: String(stepCounts.app || 0)
});
var driftOut = "", driftOk = true;
try {
  driftOut = cp.execSync("node gate-drift-check.cjs", { cwd: HERE, encoding: "utf8", env: driftEnv, stdio: ["ignore", "pipe", "pipe"] });
} catch (e) {
  driftOk = false;
  driftOut = String((e && e.stdout) || "") + String((e && e.stderr) || "");
}
var dc = extractCounts(driftOut);
if (!driftOk || dc.failed > 0) broken.push("no-drift    (gate-drift-check)");
console.log((driftOk && dc.failed === 0 ? "  ✓ " : "  ✗ ") + "no-drift    (gate-drift-check) — " + dc.passed + " passed, " + dc.failed + " failed (meta, not in the product total)");

/* T4: smoke-live — a REAL over-the-wire HTTP round trip (ephemeral OS-assigned
   port, never the fixed 8225 the live process uses — see server/smoke-live.cjs's
   header for why a fixed port here would risk a false-red port-collision hang)
   proving server/router.cjs's golden-seal parity holds over an actual socket,
   not just the pure in-process calls tests/app/server-parity.test.cjs already
   covers. META step (like tripwire + no-drift below): its own pass/fail line,
   excluded from the product assertion total — it is a robustness proof, not a
   pile of additional product assertions to count. */
var smoke = "", smokeOk = false;
try {
  smoke = cp.execSync("node smoke-live.cjs", { cwd: path.join(ROOT, "server"), encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  smokeOk = /SMOKE-LIVE: OK/.test(smoke);
} catch (e) {
  smokeOk = false;
  smoke = String((e && e.stdout) || "") + String((e && e.stderr) || "");
}
if (!smokeOk) broken.push("smoke-live  (over-the-wire parity)");
console.log((smokeOk ? "  ✓ " : "  ✗ ") + "smoke-live  (over-the-wire parity) — " + (smokeOk ? "real HTTP round-trip reproduces every pinned golden seal (meta, not in the product total)" : "FAILED:\n" + smoke));

var trip = require("./tripwire.cjs").verify(ROOT), tripOk = trip.ok;
console.log((tripOk ? "  ✓ " : "  ✗ ") + "tripwire    (frozen demo) — " + (tripOk ? "demo/index.html: OK (e2f48467…)" : "FAILED"));

var dt = process.hrtime(t0);
var secs = (dt[0] + dt[1] / 1e9).toFixed(1);

console.log("\n============================================================");
if (broken.length === 0 && tripOk) {
  console.log("  AHD GATE ✅  " + totalPassed + "/" + totalFailed + "  — every assertion green, demo sealed");
} else {
  console.log("  AHD GATE ❌  " + totalPassed + " passed, " + totalFailed + " failed — RED: " + (broken.join(", ") || "tripwire"));
}
console.log("  (" + secs + "s, fully offline, deterministic — run it yourself)");
console.log("============================================================");
process.exit(broken.length === 0 && tripOk ? 0 : 1);
