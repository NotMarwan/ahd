/* ============================================================================
   features/impact-drill.js — aggregate-only drill-down under an «أثر عهد»
   size-bucket. Pure projection: reuses Impact.computeCircleImpact VERBATIM
   over the same honest fixtures; the k-anonymity floor is enforced
   STRUCTURALLY (a bucket below K_FLOOR yields `null`, so the screen cannot
   even try to show it).

   JL-8 hardening: past the k-floor this NEVER emits a per-circle row (no
   `id`, no `label`, no per-record anything) — not even for a bucket far
   larger than K_FLOOR. It returns exactly ONE aggregate object per bucket
   (counts + min/max ranges + a bucket-wide total), regardless of how many
   circles are in the bucket. "Harmless on fixtures, unsafe on real data" is
   the exact failure this closes: the no-leak regression in
   tests/app/impact-drill.test.cjs asserts this on both a k-sized bucket and
   a large synthetic bucket.

   Integer halalas → whole SAR only; no date/randomness/locale primitive.
   Dual module: Node `require`, browser `window.ImpactDrill`.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./impact.js"));
  else root.ImpactDrill = factory(root.Impact);
})(typeof self !== "undefined" ? self : this, function (Impact) {
  "use strict";

  /* integer halalas → whole SAR (fixture amounts are whole-SAR multiples of 100) */
  function sarOf(h) { return (h - (h % 100)) / 100; }

  /* min/max over a non-empty integer array — ONLY the range is kept, never
     the individual values that produced it */
  function rangeOf(nums) {
    var min = nums[0], max = nums[0], i;
    for (i = 1; i < nums.length; i++) {
      if (nums[i] < min) min = nums[i];
      if (nums[i] > max) max = nums[i];
    }
    return { min: min, max: max };
  }

  /* the drill-down for one size-bucket: ONE aggregate object, or null when
     the bucket is below the k-anonymity floor. Never an array of per-circle
     rows — this holds for a bucket of any size. */
  function bucketAggregate(size, circles, settleFn) {
    var inBucket = (circles || []).filter(function (c) { return c.size === size; });
    if (inBucket.length < Impact.K_FLOOR) return null; // k-anonymity: suppressed bucket has no drill-down

    var per = inBucket.map(function (c) { return Impact.computeCircleImpact(c, settleFn); });
    var obligations = per.map(function (p) { return p.obligationsCount; });
    var transfersAfter = per.map(function (p) { return p.transfersAfter; });
    var transfersAvoided = per.map(function (p) { return p.transfersAvoided; });
    var savedSARs = per.map(function (p) { return sarOf(p.savedH); });
    var savedSARTotal = savedSARs.reduce(function (a, n) { return a + n; }, 0);

    return {
      size: size,
      count: per.length,
      obligationsRange: rangeOf(obligations),
      transfersAfterRange: rangeOf(transfersAfter),
      transfersAvoidedRange: rangeOf(transfersAvoided),
      savedSARRange: rangeOf(savedSARs),
      savedSARTotal: savedSARTotal,
      allConservationOk: per.every(function (p) { return p.conservationOk; })
    };
  }

  function rangeAr(r, f) { return r.min === r.max ? f(r.min) : "من " + f(r.min) + " إلى " + f(r.max); }

  function describeBucketAr(agg, fmtN) {
    var f = fmtN || function (n) { return String(n); };
    return "دوائر تجريبيّة من " + f(agg.size) + " أعضاء (العدد " + f(agg.count) + "): التزاماتٌ " +
      rangeAr(agg.obligationsRange, f) + " إلى تحويلاتٍ " + rangeAr(agg.transfersAfterRange, f) +
      " — وُفِّر تحريكُ " + rangeAr(agg.savedSARRange, f) + " ر.س لكلّ دائرة (الإجمالي " +
      f(agg.savedSARTotal) + " ر.س)، والمراكز محفوظة في الجميع";
  }

  return { bucketAggregate: bucketAggregate, describeBucketAr: describeBucketAr };
});
