/* ============================================================================
   features/impact-drill.js — per-circle drill-down under an «أثر عهد» bucket.
   Pure projection: reuses Impact.computeCircleImpact VERBATIM over the same
   honest fixtures; the k-anonymity floor is enforced STRUCTURALLY (a bucket
   below K_FLOOR yields zero rows, so the screen cannot even try to show it).
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

  function circlesForBucket(size, circles, settleFn) {
    var inBucket = (circles || []).filter(function (c) { return c.size === size; });
    if (inBucket.length < Impact.K_FLOOR) return []; // k-anonymity: suppressed bucket has no drill-down
    return inBucket.map(function (c) {
      var p = Impact.computeCircleImpact(c, settleFn);
      return {
        id: p.id, label: c.label, size: p.size,
        obligationsCount: p.obligationsCount,
        transfersAfter: p.transfersAfter,
        transfersAvoided: p.transfersAvoided,
        savedSAR: sarOf(p.savedH),
        conservationOk: p.conservationOk
      };
    });
  }

  function describeCircleAr(row, fmtN) {
    var f = fmtN || function (n) { return String(n); };
    return "«" + row.label + "» (دائرة تجريبيّة): من " + f(row.obligationsCount) +
      " التزاماتٍ إلى " + f(row.transfersAfter) + " — وُفِّر تحريكُ " + f(row.savedSAR) +
      " ر.س، والمراكز محفوظة";
  }

  return { circlesForBucket: circlesForBucket, describeCircleAr: describeCircleAr };
});
