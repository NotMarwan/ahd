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
  { name: "core logic  (run-tests)", cmd: "node run-tests.cjs", cwd: HERE },
  { name: "offline     (offline-check)", cmd: "node offline-check.cjs", cwd: HERE },
  { name: "dom smoke   (dom-smoke)", cmd: "node dom-smoke.cjs", cwd: HERE },
  { name: "structure   (structure-check)", cmd: "node structure-check.cjs", cwd: HERE },
  { name: "app suites  (run-app-tests)", cmd: "node app/run-app-tests.cjs", cwd: HERE }
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
  totalPassed += c.passed; totalFailed += c.failed;
  if (!ok || c.failed > 0) broken.push(s.name);
  console.log((ok && c.failed === 0 ? "  ✓ " : "  ✗ ") + s.name + " — " + c.passed + " passed, " + c.failed + " failed");
}

var trip = "", tripOk = false;
try {
  trip = cp.execSync("sha256sum -c _overnight/backup/demo.sha256", { cwd: ROOT, encoding: "utf8" });
  tripOk = /:\s*OK/.test(trip);
} catch (e) { tripOk = false; }
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
