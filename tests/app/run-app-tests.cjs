/* ============================================================================
   run-app-tests.cjs — runs every app/ test suite (auto-discovered)
   in its own Node process and aggregates. Exits 0 iff all green. The original
   demo harness (run-tests/offline-check/dom-smoke) is separate and unchanged;
   this is the ADDITIVE app suite the overnight work grows.
============================================================================ */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const DIR = __dirname;
const SUITE = /(\.test|-parity|-smoke)\.cjs$/;   // test|parity|smoke files
const files = fs.readdirSync(DIR).filter(f => SUITE.test(f) && f !== "run-app-tests.cjs").sort();

let failed = 0;
console.log("=== ahd-app test suites (" + files.length + ") ===\n");
for (const f of files) {
  try {
    execFileSync(process.execPath, [path.join(DIR, f)], { stdio: "inherit" });
    console.log("");
  } catch (e) {
    failed++;
    console.log("  !! SUITE FAILED: " + f + "\n");
  }
}
console.log("========================================================");
console.log("APP SUITES: " + (files.length - failed) + "/" + files.length + " green" + (failed ? "  (" + failed + " FAILED)" : ""));
console.log("========================================================");
process.exit(failed ? 1 : 0);
