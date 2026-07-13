/* ============================================================================
   features/impact-national.js — the national compression SCENARIO (Front D).
   Ahd measures a real compression on its own golden netting (obligations →
   transfers). Saudi execution courts carry a real, cited debt-enforcement load
   (EVIDENCE-BRIEF D-1). Nobody had multiplied the two. This does — as an
   explicitly ILLUSTRATIVE scenario, integer counts only, provenance kept in its
   own frozen EXTERNAL_STAT so a measured ratio and a cited stat never blend.

   Honesty travels with the card: it is labelled «سيناريو توضيحيّ — لا رقمٌ مُقاس»,
   the source + its stale vintage are stated, and the screen adds the caveat that
   court cases are not necessarily mutual circles. No Date/Math.random/float money.
   Node-testable; browser → window.ImpactNational.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ImpactNational = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* D-1: promissory notes are the single largest category of debt at Saudi
     execution courts — 58.6% of 571,251 enforcement requests, SAR 115.4B over 11
     months (Argaam / MoJ execution courts, 2020–21; graded 🟡 — stale, load-bearing). */
  var EXTERNAL_STAT = Object.freeze({
    requests: 571251,
    sharePer100: "٥٨٫٦",           // 58.6 of every 100 requests (rendered without a % glyph)
    enforcementSAR_B: "١١٥٫٤",     // 115.4 billion SAR — context only; no arithmetic on it
    months: 11,
    source: "محاكم التنفيذ (وزارة العدل) عبر أرقام — EVIDENCE-BRIEF D-1",
    vintage: "٢٠٢٠–٢١"
  });

  var LABEL = "سيناريو توضيحيّ — لا رقمٌ مُقاس";

  /* the projection multiplies a small-sample ratio (12 synthetic test circles)
     across a six-figure cited count — the exact product (e.g. 190,417) is spurious
     precision no synthetic ratio earns. Round DOWN to the nearest thousand for
     display («نحو ١٩٠ ألف») and keep the exact integers only for internal checks
     (never rendered). Pure integer division — no float math. */
  var THOUSAND = 1000;
  function roundedThousands(n) { return Math.floor(n / THOUSAND); }

  /* apply Ahd's netting compression (obligations→transfers, computed on its own
     synthetic test circles — never "measured" over real usage) to the cited
     request count. Integer-only (a count projection, never a money float);
     divide-by-zero guarded. The value-in-SAR figure is carried as context, never
     multiplied. */
  function scenario(measured, external) {
    var ext = external || EXTERNAL_STAT;
    var obligations = Math.max(1, (measured && measured.obligations) | 0);
    var transfers = (measured && measured.transfersAfter) | 0;
    var requests = ext.requests | 0;
    var projected = Math.floor(requests * transfers / obligations);
    var avoided = requests - projected;
    return {
      requests: requests,
      ratioObligations: obligations,
      ratioTransfers: transfers,
      projectedSettlements: projected,
      avoided: avoided,
      /* display-only rounded magnitudes — see THOUSAND note above */
      projectedThousands: roundedThousands(projected),
      avoidedThousands: roundedThousands(avoided),
      sharePer100: ext.sharePer100,
      enforcementSAR_B: ext.enforcementSAR_B,
      months: ext.months,
      source: ext.source,
      vintage: ext.vintage,
      label: LABEL,
      illustrative: true
    };
  }

  return { EXTERNAL_STAT: EXTERNAL_STAT, LABEL: LABEL, scenario: scenario };
});
