/* ============================================================================
   features/impact-band.js — the national compression SENSITIVITY BAND (Front D,
   data-rigor fix D1). features/impact-national.js multiplies ONE ratio (Ahd's own
   12 fixture circles, aggregated: 54 obligations -> 18 transfers, exactly "÷3")
   across the cited D-1 court-request count. A single point from 12 hand-built
   circles is fragile false precision. This module replaces the point with a
   RANGE: it deterministically builds MANY (200) plausible synthetic circles
   across a transparent, honestly-bounded parameter space, runs the GOLDEN
   netting on every one via the SAME dependency-injection shim
   features/impact.js already uses (Impact.makeSettleFn(engine) — netting is
   NEVER reimplemented here, only called), collects each circle's own
   compression ratio (transfersAfter / obligations), and reports the
   distribution's p10/p50/p90 — integer-only, deterministic, seeded (no
   randomness or clock primitive anywhere — statically scanned by impact-band.test).

   Parameter space (not invented — read off the ALREADY-SHIPPED 12-circle
   fixture set in features/impact.js): every synthetic circle is one of the
   three structural shapes that set already contains —
     "balanced"  a perfectly-equal-amount cycle (TC-02 قهوة الحيّ / TC-09 عقيقة
                 صديق net to ZERO transfers this way) — 2 of the 12 fixtures.
     "star"      one hub owed by every other member (TC-07 ديوانيّة الجمعة is
                 already this shape — a star is already minimal, so it nets to
                 NO compression at all) — 1 of the 12 fixtures.
     "tangle"    a ring plus random chords with independent random amounts
                 (TC-01/03/04/05/06/08/10/11/12 are this shape) — 9 of the 12.
   Circle sizes are drawn from the SAME 3–8 member range the fixture set uses.
   Archetype draws are weighted 2:1:9 (out of 12) to mirror that same 2:1:9
   split already present in the 12 shipped fixtures — not tuned to fit any
   target number.

   HONESTY: this is still an ILLUSTRATIVE model over SYNTHETIC circles, never
   "measured" usage — the band shows the ratio's SENSITIVITY to circle
   structure, not a survey. The old single-point projection
   (features/impact-national.js) is not recomputed or blended here; a consumer
   may keep showing it, clearly labelled as a reference value that this band's
   own p10/p90 happen to bracket (asserted in tests, not assumed).
   No date/randomness/float money primitive. Node-testable; browser -> window.ImpactBand.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ImpactBand = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* fixed, arbitrary, documented seed — never a randomness or clock primitive.
     Same seed => same sequence => byte-identical band on every run. */
  var SEED = 0x00c0ffee;
  var CIRCLE_COUNT = 200;
  var MIN_SIZE = 3, MAX_SIZE = 8;             // the fixture set's own size range
  var AMOUNT_STEPS = 50, AMOUNT_UNIT = 1000;  // per-edge amount: 1,000..50,000 halalas (10..500 SAR)

  var LABEL = "نطاق توضيحيّ حتميّ — لا رقمٌ مُقاس";

  /* ---- deterministic LCG (Numerical Recipes constants a=1664525, c=1013904223,
     m=2^32) — NOT a runtime randomness or clock primitive. The low bits of this
     family of LCG have short periods under a small modulus, so draws take the
     HIGH bits (>>> 16) rather than `state % n` directly. ---- */
  function makeLCG(seed) {
    var state = seed >>> 0;
    return function () {
      state = (Math.imul(1664525, state) + 1013904223) >>> 0;
      return state;
    };
  }
  function randInt(rand, n) { return (rand() >>> 16) % n; }

  /* synthetic-only member codes — never collide with the golden NODES roster
     or the impact.js fixture set's م-codes (both are appended/restored by the
     injected settleFn exactly like features/impact.js does). */
  function memberCode(i) { return "ح" + i; }

  /* archetype draw: weighted 2:1:9 (of 12) — see file header for the fixture-
     derived rationale. */
  function pickArchetype(rand) {
    var v = randInt(rand, 12);
    if (v < 2) return "balanced";
    if (v === 2) return "star";
    return "tangle";
  }

  function buildCircle(rand) {
    var size = MIN_SIZE + randInt(rand, MAX_SIZE - MIN_SIZE + 1);
    var members = [];
    for (var i = 0; i < size; i++) members.push(memberCode(i));
    var archetype = pickArchetype(rand);
    var edges = [];
    function amt() { return AMOUNT_UNIT * (1 + randInt(rand, AMOUNT_STEPS)); }
    if (archetype === "balanced") {
      var a = amt();
      for (i = 0; i < size; i++) edges.push({ from: members[i], to: members[(i + 1) % size], amount: a });
    } else if (archetype === "star") {
      for (i = 1; i < size; i++) edges.push({ from: members[i], to: members[0], amount: amt() });
    } else {
      for (i = 0; i < size; i++) edges.push({ from: members[i], to: members[(i + 1) % size], amount: amt() });
      var chords = randInt(rand, size);
      for (var c = 0; c < chords; c++) {
        var x = randInt(rand, size), y = randInt(rand, size);
        if (x === y) continue;
        edges.push({ from: members[x], to: members[y], amount: amt() });
      }
    }
    return { size: size, archetype: archetype, edges: edges };
  }

  /* CIRCLE_COUNT deterministic circles from the fixed SEED — pure function of
     constants above, so calling this twice (even across two independent
     `require`s of this module) always yields the identical sequence. */
  function generateCircles() {
    var rand = makeLCG(SEED);
    var circles = [];
    for (var i = 0; i < CIRCLE_COUNT; i++) circles.push(buildCircle(rand));
    return circles;
  }

  /* one circle's own compression ratio, in integer PER-MILLE (‰) so the whole
     pipeline stays integer-only — never a persisted float. `settleFn` is the
     SAME injected netting function features/impact.js's consumers build via
     Impact.makeSettleFn(engine); this module never reimplements netting. */
  function ratioPerMilleOf(circle, settleFn) {
    var after = settleFn(circle.edges);
    return Math.floor(after.length * 1000 / circle.edges.length);
  }

  /* the sorted per-mille ratio distribution across all CIRCLE_COUNT circles */
  function sortedRatios(settleFn) {
    var circles = generateCircles();
    var ratios = circles.map(function (c) { return ratioPerMilleOf(c, settleFn); });
    ratios.sort(function (x, y) { return x - y; });
    return ratios;
  }

  /* integer percentile index into an already-sorted array — pure floor
     arithmetic (no float persisted, consistent with the rest of the app). */
  function percentileOf(sorted, p) {
    var idx = Math.floor((sorted.length - 1) * p / 100);
    return sorted[idx];
  }

  var THOUSAND = 1000;
  function roundedThousands(n) { return Math.floor(n / THOUSAND); }

  /* the band: p10/p50/p90 of the compression-ratio DISTRIBUTION, each
     projected across `requests` (the cited D-1 count) and rounded down to the
     nearest thousand for display — never the exact integer (spurious
     precision no synthetic ratio earns). Integer-only throughout; p10<=p50<=
     p90 by construction (percentiles of one sorted array). */
  function band(settleFn, requests) {
    var ratios = sortedRatios(settleFn);
    var reqs = requests | 0;
    var p10 = percentileOf(ratios, 10);
    var p50 = percentileOf(ratios, 50);
    var p90 = percentileOf(ratios, 90);
    var projectedP10 = Math.floor(reqs * p10 / 1000);
    var projectedP50 = Math.floor(reqs * p50 / 1000);
    var projectedP90 = Math.floor(reqs * p90 / 1000);
    return {
      circlesCount: CIRCLE_COUNT,
      minSize: MIN_SIZE,
      maxSize: MAX_SIZE,
      ratioP10: p10, ratioP50: p50, ratioP90: p90,
      projectedP10: projectedP10, projectedP50: projectedP50, projectedP90: projectedP90,
      projectedP10Thousands: roundedThousands(projectedP10),
      projectedP50Thousands: roundedThousands(projectedP50),
      projectedP90Thousands: roundedThousands(projectedP90),
      requests: reqs,
      label: LABEL,
      illustrative: true
    };
  }

  /* Arabic description lines for the consuming screen — mirrors the
     describeImpactAr(impact, fmtN) convention in features/impact.js. `refThousands`
     is an OPTIONAL already-computed reference value (e.g. impact-national's own
     projectedThousands) the caller wants noted as sitting inside the band; this
     function never recomputes or blends it — it only labels it. */
  function describeBandAr(b, fmtN, refThousands) {
    var f = fmtN || function (n) { return String(n); };
    var rangeLine = LABEL + ": من نحو " + f(b.projectedP10Thousands) + " ألفًا إلى نحو " +
      f(b.projectedP90Thousands) + " ألفًا (الوسيط النموذجيّ نحو " + f(b.projectedP50Thousands) + " ألفًا)";
    var methodLine = "مبنيٌّ على " + f(b.circlesCount) + " دائرةَ اختبارٍ توليديّةٍ حتميّة (أحجام " +
      f(b.minSize) + "–" + f(b.maxSize) + " أعضاء)، بأنماطٍ ثلاثة مأخوذةٍ من دوائر عهد الاثنتي عشرة نفسها" +
      " — لا استخدامًا حقيقيًّا، ولا مسحًا ميدانيًّا.";
    var refLine = null;
    if (typeof refThousands === "number") {
      var inside = refThousands >= b.projectedP10Thousands && refThousands <= b.projectedP90Thousands;
      refLine = "نقطة عهد الأصليّة (نسبة الدوائر الاثنتي عشرة): نحو " + f(refThousands) + " ألفًا — " +
        (inside ? "تقع داخل هذا النطاق." : "خارج هذا النطاق.");
    }
    return { rangeLine: rangeLine, methodLine: methodLine, refLine: refLine };
  }

  return {
    SEED: SEED,
    CIRCLE_COUNT: CIRCLE_COUNT,
    MIN_SIZE: MIN_SIZE,
    MAX_SIZE: MAX_SIZE,
    LABEL: LABEL,
    generateCircles: generateCircles,
    ratioPerMilleOf: ratioPerMilleOf,
    sortedRatios: sortedRatios,
    percentileOf: percentileOf,
    band: band,
    describeBandAr: describeBandAr
  };
});
