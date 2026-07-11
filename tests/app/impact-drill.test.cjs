/* ============================================================================
   impact-drill.test.cjs — TDD for features/impact-drill.js: the per-circle
   drill-down under an «أثر عهد» size-bucket. Pure projection over the existing
   Impact fixtures + the GOLDEN netting via Impact.makeSettleFn (call, never
   modify). k-anonymity is respected structurally: drill-down exists ONLY for
   exposed buckets (count >= K_FLOOR); labels are honest test-fixture labels.
============================================================================ */
const path = require("path");
const ROOT = path.join(__dirname, "..", "..", "app");
const engine = require(path.join(ROOT, "engine.js"));
const Impact = require(path.join(ROOT, "features", "impact.js"));
const Drill = require(path.join(ROOT, "features", "impact-drill.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("impact-drill.test: per-circle drill-down under a bucket");

const settle = Impact.makeSettleFn(engine);

(function bucketRows() {
  const rows = Drill.circlesForBucket(3, Impact.FIXTURE_CIRCLES, settle);
  eq(rows.length, 3, "size-3 bucket exposes its 3 test circles");
  ok(rows.every(r => r.size === 3), "every row is a size-3 circle");
  ok(rows.every(r => r.conservationOk === true), "conservation holds on every drilled circle");
  ok(rows.every(r => Number.isInteger(r.savedSAR)), "savedSAR is integer whole-SAR");
  ok(rows.every(r => r.transfersAfter <= r.obligationsCount), "netting never adds transfers");
  eq(rows[0].id, "TC-01", "rows keep fixture order (deterministic)");
  ok(typeof rows[0].label === "string" && rows[0].label.length > 0, "row carries the honest fixture label");
})();

(function kFloorGuard() {
  const rows = Drill.circlesForBucket(6, Impact.FIXTURE_CIRCLES, settle);
  eq(rows.length, 0, "suppressed bucket (size 6, count 1 < K_FLOOR) returns NO rows — k-anonymity");
})();

(function describeLine() {
  const rows = Drill.circlesForBucket(3, Impact.FIXTURE_CIRCLES, settle);
  const line = Drill.describeCircleAr(rows[0], String);
  ok(line.indexOf(rows[0].label) >= 0, "Arabic line names the circle label");
  ok(line.indexOf("%") < 0 && line.indexOf("٪") < 0, "no percentage glyph (spine)");
  ok(/محفوظة/.test(line), "line states conservation in words");
})();

(function determinism() {
  const a = JSON.stringify(Drill.circlesForBucket(4, Impact.FIXTURE_CIRCLES, settle));
  const b = JSON.stringify(Drill.circlesForBucket(4, Impact.FIXTURE_CIRCLES, settle));
  eq(a, b, "drill-down is deterministic (identical on re-run)");
})();

console.log("\n========================================================");
console.log("IMPACT-DRILL: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
