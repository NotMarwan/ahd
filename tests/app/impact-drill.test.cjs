/* ============================================================================
   impact-drill.test.cjs — TDD for features/impact-drill.js: the AGGREGATE-ONLY
   drill-down under an «أثر عهد» size-bucket (JL-8 k-floor hardening). Pure
   projection over the existing Impact fixtures + the GOLDEN netting via
   Impact.makeSettleFn (call, never modify). k-anonymity is respected
   structurally: drill-down exists ONLY for exposed buckets (count >= K_FLOOR),
   and even then it is ONE aggregate object — never a per-circle row with an
   id/label — regardless of how large the bucket is.
============================================================================ */
const path = require("path");
const ROOT = path.join(__dirname, "..", "..", "app");
const engine = require(path.join(ROOT, "engine.js"));
const Impact = require(path.join(ROOT, "features", "impact.js"));
const Drill = require(path.join(ROOT, "features", "impact-drill.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("impact-drill.test: bucket drill-down is aggregate-only (JL-8 k-floor hardening)");

const settle = Impact.makeSettleFn(engine);

(function bucketAggregateShape() {
  const agg = Drill.bucketAggregate(3, Impact.FIXTURE_CIRCLES, settle);
  ok(!!agg, "size-3 bucket (count 3, at K_FLOOR) returns an aggregate");
  ok(!Array.isArray(agg), "the drill-down is ONE object, never an array of per-circle rows");
  eq(agg.size, 3, "aggregate carries the bucket size");
  eq(agg.count, 3, "aggregate carries the circle count");
  ok(agg.allConservationOk === true, "conservation holds across the whole bucket");
  ok(Number.isInteger(agg.savedSARTotal), "savedSARTotal is integer whole-SAR");
  ok(Number.isInteger(agg.obligationsRange.min) && Number.isInteger(agg.obligationsRange.max), "obligationsRange is an integer min/max pair");
  ok(agg.transfersAfterRange.max <= agg.obligationsRange.max, "netting never adds transfers, even in the aggregate range");
})();

(function kFloorGuard() {
  const agg = Drill.bucketAggregate(6, Impact.FIXTURE_CIRCLES, settle);
  eq(agg, null, "suppressed bucket (size 6, count 1 < K_FLOOR) returns null — k-anonymity");
})();

(function describeLine() {
  const agg = Drill.bucketAggregate(3, Impact.FIXTURE_CIRCLES, settle);
  const line = Drill.describeBucketAr(agg, String);
  ok(line.indexOf("%") < 0 && line.indexOf("٪") < 0, "no percentage glyph (spine)");
  ok(/محفوظة/.test(line), "line states conservation in words");
  ok(!/TC-\d\d/.test(line), "description names no circle id");
})();

(function determinism() {
  const a = JSON.stringify(Drill.bucketAggregate(4, Impact.FIXTURE_CIRCLES, settle));
  const b = JSON.stringify(Drill.bucketAggregate(4, Impact.FIXTURE_CIRCLES, settle));
  eq(a, b, "drill-down is deterministic (identical on re-run)");
})();

/* ============================================================================
   JL-8 no-leak regression: past K_FLOOR the drill-down must NEVER carry a
   per-record identifying field (id/label/name), on a SMALL (k-sized) bucket
   AND a LARGE (many-circle) bucket. This is the missing regression the panel
   flagged: "harmless on fixtures, unsafe on real data" — a pre-fix
   `circlesForBucket` returned an array of per-circle rows (each with `id`
   and `label`) once a bucket cleared K_FLOOR; verified during dev that this
   test FAILS against that pre-fix shape and PASSES against the aggregate-
   only `bucketAggregate` below.
============================================================================ */
(function noLeakSmallBucket() {
  const agg = Drill.bucketAggregate(3, Impact.FIXTURE_CIRCLES, settle);
  const json = JSON.stringify(agg);
  ok(!("id" in agg), "small-bucket (k-sized) aggregate carries no `id` field");
  ok(!("label" in agg), "small-bucket (k-sized) aggregate carries no `label` field");
  Impact.FIXTURE_CIRCLES.filter(c => c.size === 3).forEach(c => {
    ok(json.indexOf(c.id) < 0, "small-bucket aggregate JSON does not contain circle id " + c.id);
    ok(json.indexOf(c.label) < 0, "small-bucket aggregate JSON does not contain circle label " + c.label);
  });
})();

(function noLeakLargeBucket() {
  // synthesize a LARGE bucket (far past K_FLOOR) with IDENTIFYING
  // fixture-shaped circles, mirroring what real production circle data
  // would look like (real ids, real-looking labels).
  const N = 50, size = 9;
  const bigBucket = [];
  for (let i = 0; i < N; i++) {
    bigBucket.push({
      id: "REAL-" + i, label: "دائرة حقيقيّة رقم " + i, size: size,
      obligations: [
        { from: "م١", to: "م٢", halalas: 10000 + i * 100 },
        { from: "م٢", to: "م٣", halalas: 10000 + i * 100 },
        { from: "م٣", to: "م١", halalas: 5000 + i * 100 }
      ]
    });
  }
  const agg = Drill.bucketAggregate(size, bigBucket, settle);
  ok(!!agg, "a large bucket (50 circles, far past K_FLOOR) still returns an aggregate");
  ok(!Array.isArray(agg), "a large bucket NEVER returns a per-circle array — regardless of bucket size");
  eq(agg.count, N, "large-bucket aggregate reports the true count");
  ok(!("id" in agg) && !("label" in agg), "large-bucket aggregate carries no id/label field");
  const json = JSON.stringify(agg);
  bigBucket.forEach(c => {
    ok(json.indexOf(c.id) < 0, "large-bucket aggregate JSON does not contain " + c.id);
    ok(json.indexOf(c.label) < 0, "large-bucket aggregate JSON does not contain " + c.label);
  });
  ok(Object.keys(agg).every(k => ["size", "count", "obligationsRange", "transfersAfterRange",
    "transfersAvoidedRange", "savedSARRange", "savedSARTotal", "allConservationOk"].includes(k)),
    "large-bucket aggregate has ONLY the fixed aggregate-safe key set — no extra per-record field ever sneaks in");
})();

console.log("\n========================================================");
console.log("IMPACT-DRILL: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
