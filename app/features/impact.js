/* ============================================================================
   features/impact.js — «أثر عهد» impact analytics view-model (JL-3). A pure,
   deterministic projection: k-anonymous netting-efficiency AGGREGATES over
   honestly-labeled deterministic test circles («دوائر تجريبيّة — بيانات اختبار»).
   The minimal-transfer computation is the GOLDEN engine.netting — consumed
   DI-style (makeSettleFn) and called VERBATIM, never reimplemented. Integer
   halalas only; aggregates only (never an individual's number); no date /
   randomness / locale primitive anywhere (statically scanned by impact.test).
   Dual module: Node `require`, browser `window.Impact`.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Impact = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* k-anonymity floor: a size-bucket is exposed only when it covers >= 3 circles —
     below that, an "aggregate" starts pointing at individuals, so it is suppressed
     and the suppression itself is reported (the honesty line). */
  var K_FLOOR = 3;

  /* ≥ 8 deterministic TEST circles — the screen must label them «دوائر تجريبيّة
     (بيانات اختبار)». Members are NEUTRAL codes م١..م٨ (never real-looking names
     next to amounts — spine); every amount is an integer halalas, a whole-SAR
     multiple of 100 (asserted in tests/app/impact.test.cjs). Sizes span 3..8 so
     the bucket distribution is non-trivial AND the k-floor visibly does work
     (sizes 6/7/8 have one circle each → suppressed, honestly counted). */
  var FIXTURE_CIRCLES = [
    { id: "TC-01", label: "عشاء العُلا", size: 3, obligations: [
      { from: "م١", to: "م٢", halalas: 20000 },
      { from: "م٢", to: "م٣", halalas: 20000 },
      { from: "م١", to: "م٣", halalas: 10000 }] },
    { id: "TC-02", label: "قهوة الحيّ", size: 3, obligations: [
      { from: "م١", to: "م٢", halalas: 15000 },
      { from: "م٢", to: "م٣", halalas: 15000 },
      { from: "م٣", to: "م١", halalas: 15000 }] },
    { id: "TC-03", label: "هديّة زميل", size: 3, obligations: [
      { from: "م١", to: "م٢", halalas: 10000 },
      { from: "م٣", to: "م٢", halalas: 20000 },
      { from: "م١", to: "م٣", halalas: 5000 }] },
    { id: "TC-04", label: "شقّة الرياض", size: 4, obligations: [
      { from: "م١", to: "م٢", halalas: 30000 },
      { from: "م٢", to: "م٣", halalas: 30000 },
      { from: "م٣", to: "م٤", halalas: 30000 }] },
    { id: "TC-05", label: "رحلة الشرقيّة", size: 4, obligations: [
      { from: "م١", to: "م٢", halalas: 10000 },
      { from: "م١", to: "م٣", halalas: 10000 },
      { from: "م١", to: "م٤", halalas: 10000 },
      { from: "م٢", to: "م٤", halalas: 5000 }] },
    { id: "TC-06", label: "عزيمة العائلة", size: 4, obligations: [
      { from: "م١", to: "م٢", halalas: 20000 },
      { from: "م٣", to: "م٤", halalas: 20000 },
      { from: "م٢", to: "م٣", halalas: 20000 }] },
    { id: "TC-07", label: "ديوانيّة الجمعة", size: 5, obligations: [
      { from: "م١", to: "م٥", halalas: 10000 },
      { from: "م٢", to: "م٥", halalas: 10000 },
      { from: "م٣", to: "م٥", halalas: 10000 },
      { from: "م٤", to: "م٥", halalas: 10000 }] },
    { id: "TC-08", label: "مخيّم الربع", size: 5, obligations: [
      { from: "م١", to: "م٢", halalas: 20000 },
      { from: "م٢", to: "م٣", halalas: 20000 },
      { from: "م٣", to: "م٤", halalas: 20000 },
      { from: "م٤", to: "م٥", halalas: 20000 },
      { from: "م٥", to: "م١", halalas: 10000 },
      { from: "م١", to: "م٣", halalas: 10000 },
      { from: "م٢", to: "م٤", halalas: 10000 }] },
    { id: "TC-09", label: "عقيقة صديق", size: 5, obligations: [
      { from: "م١", to: "م٢", halalas: 8000 },
      { from: "م٢", to: "م٣", halalas: 8000 },
      { from: "م٣", to: "م٤", halalas: 8000 },
      { from: "م٤", to: "م٥", halalas: 8000 },
      { from: "م٥", to: "م١", halalas: 8000 }] },
    { id: "TC-10", label: "استراحة الشباب", size: 6, obligations: [
      { from: "م١", to: "م٢", halalas: 12000 },
      { from: "م٢", to: "م٣", halalas: 12000 },
      { from: "م٣", to: "م٤", halalas: 12000 },
      { from: "م٤", to: "م٥", halalas: 12000 },
      { from: "م٥", to: "م٦", halalas: 12000 }] },
    { id: "TC-11", label: "رحلة أبها", size: 7, obligations: [
      { from: "م١", to: "م٢", halalas: 10000 },
      { from: "م٢", to: "م٣", halalas: 10000 },
      { from: "م٣", to: "م٤", halalas: 10000 },
      { from: "م٤", to: "م٥", halalas: 10000 },
      { from: "م٥", to: "م٦", halalas: 10000 },
      { from: "م٦", to: "م٧", halalas: 10000 },
      { from: "م٧", to: "م١", halalas: 5000 }] },
    { id: "TC-12", label: "زواج ابن العم", size: 8, obligations: [
      { from: "م١", to: "م٢", halalas: 10000 },
      { from: "م٢", to: "م٣", halalas: 10000 },
      { from: "م٣", to: "م١", halalas: 10000 },
      { from: "م٤", to: "م٥", halalas: 20000 },
      { from: "م٥", to: "م٦", halalas: 20000 },
      { from: "م٦", to: "م٧", halalas: 20000 },
      { from: "م٧", to: "م٨", halalas: 20000 }] }
  ];

  /* PLAN-SPIRIT NOTE (plan Task 1 Step 3 vs. engine reality): the golden
     netting/balancesOf (app/engine.js §3 «Muqassa», the byte-copy of the frozen
     demo) iterate the FIXED five-name roster `NODES`, so by themselves they
     cannot see the fixture م-codes. makeSettleFn therefore appends the edge
     members to the engine's own exported roster for the duration of the call and
     restores it in `finally`: the golden algorithm runs VERBATIM (call, never
     modify; never reimplement), the golden five keep their indices (we only
     append, so the deterministic tiebreak is unchanged), and on the golden
     tangle the shim is a byte-identical pass-through — both facts are asserted
     in tests/app/impact.test.cjs. */
  function makeSettleFn(engine) {
    return function (edges) {
      var roster = engine.NODES, base = roster.length, list = edges || [], i, e;
      for (i = 0; i < list.length; i++) {
        e = list[i];
        if (roster.indexOf(e.from) < 0) roster.push(e.from);
        if (roster.indexOf(e.to) < 0) roster.push(e.to);
      }
      try { return engine.netting(list); }
      finally { roster.length = base; }
    };
  }

  /* names appearing in an edge list, first-seen order (deterministic) */
  function edgeNames(edges) {
    var names = [];
    edges.forEach(function (e) {
      if (names.indexOf(e.from) < 0) names.push(e.from);
      if (names.indexOf(e.to) < 0) names.push(e.to);
    });
    return names;
  }

  /* integer net position per name — the CONSERVATION check (a verification sum,
     not the netting: the minimal-transfer computation stays golden above) */
  function netsOf(names, edges) {
    var bal = {};
    names.forEach(function (n) { bal[n] = 0; });
    edges.forEach(function (e) { bal[e.from] -= e.amount; bal[e.to] += e.amount; });
    return bal;
  }

  function sumAmounts(edges) {
    return edges.reduce(function (a, e) { return a + e.amount; }, 0);
  }

  function computeCircleImpact(circle, settleFn) {
    var before = (circle.obligations || []).map(function (o) {
      return { from: o.from, to: o.to, amount: o.halalas };
    });
    var after = settleFn(before);
    var names = edgeNames(before.concat(after));
    var nb = netsOf(names, before), na = netsOf(names, after);
    var conserved = names.every(function (n) { return nb[n] === na[n]; });
    var movedBeforeH = sumAmounts(before), movedAfterH = sumAmounts(after);
    return {
      id: circle.id, size: circle.size,
      obligationsCount: before.length,
      transfersAfter: after.length,
      transfersAvoided: before.length - after.length,
      movedBeforeH: movedBeforeH, movedAfterH: movedAfterH,
      savedH: movedBeforeH - movedAfterH,
      conservationOk: conserved
    };
  }

  function computeImpact(circles, settleFn) {
    var per = (circles || []).map(function (c) { return computeCircleImpact(c, settleFn); });
    var totals = { obligations: 0, transfersAfter: 0, transfersAvoided: 0, movedBeforeH: 0, movedAfterH: 0, savedH: 0 };
    var bySize = {};
    per.forEach(function (p) {
      totals.obligations += p.obligationsCount;
      totals.transfersAfter += p.transfersAfter;
      totals.transfersAvoided += p.transfersAvoided;
      totals.movedBeforeH += p.movedBeforeH;
      totals.movedAfterH += p.movedAfterH;
      totals.savedH += p.savedH;
      if (!bySize[p.size]) bySize[p.size] = { count: 0, avoided: 0 };
      bySize[p.size].count += 1;
      bySize[p.size].avoided += p.transfersAvoided;
    });
    var sizes = Object.keys(bySize).map(Number).sort(function (a, b) { return a - b; });
    var buckets = [], suppressed = 0;
    sizes.forEach(function (s) {
      var g = bySize[s];
      if (g.count >= K_FLOOR) {
        var t = g.avoided * 10; /* integer tenths, floored via pure integer ops — no float math */
        buckets.push({ size: s, count: g.count, avgTransfersAvoidedTenths: (t - (t % g.count)) / g.count });
      } else {
        suppressed += 1;
      }
    });
    return {
      kFloor: K_FLOOR, circlesCount: per.length, totals: totals,
      buckets: buckets, suppressedBuckets: suppressed,
      fixture: true /* hard-wired: this data is test circles; the screen must say so */
    };
  }

  /* integer halalas → whole SAR (fixture amounts are whole-SAR multiples of 100,
     asserted in impact.test — the remainder is always zero; kept explicit so the
     arithmetic stays integer-only) */
  function sarOf(h) { return (h - (h % 100)) / 100; }

  /* integer tenths → «X٫Y» with the Arabic decimal separator — string math only */
  function tenthsAr(t) { return String((t - (t % 10)) / 10) + "٫" + String(t % 10); }

  function describeImpactAr(impact, fmtN) {
    var f = fmtN || function (n) { return String(n); };
    var T = impact.totals;
    var heroLine = "عبر " + f(impact.circlesCount) + " دائرة تجريبيّة: من " + f(T.obligations) +
      " التزامًا إلى " + f(T.transfersAfter) + " تحويلًا — والمراكز محفوظة";
    var totalsLines = [
      "التزاماتٌ قبل المقاصّة: " + f(T.obligations) + " — تحويلاتٌ بعدها: " + f(T.transfersAfter) +
        " (وُفِّر " + f(T.transfersAvoided) + " تحويلًا)",
      "المال المتحرّك: من " + f(sarOf(T.movedBeforeH)) + " ر.س إلى " + f(sarOf(T.movedAfterH)) + " ر.س",
      "وفّرت المقاصّةُ تحريكَ " + f(sarOf(T.savedH)) + " ر.س — والحقوق نفسُها بالهللة"
    ];
    var bucketLines = impact.buckets.map(function (b) {
      return "دوائر من " + f(b.size) + " أعضاء (العدد " + f(b.count) + "): متوسّط التحويلات الموفَّرة " +
        tenthsAr(b.avgTransfersAvoidedTenths);
    });
    var honestyLine = "تحليلاتٌ حتميّةٌ من دوائر تجريبيّة (بيانات اختبار) — مجاميع مجهّلة فقط، ولا رقمَ فردٍ أبدًا. " +
      "لا يُعرَض تجميعٌ لأقلّ من " + f(impact.kFloor) + " دوائر" +
      (impact.suppressedBuckets > 0 ? " — حُجِبت " + f(impact.suppressedBuckets) + " فئاتٍ دون الحدّ" : "") + ".";
    var conservationLine = "في كلّ دائرة: صافي كلّ عضوٍ قبل المقاصّة = صافيه بعدها — بالهللة.";
    return {
      heroLine: heroLine, totalsLines: totalsLines, bucketLines: bucketLines,
      honestyLine: honestyLine, conservationLine: conservationLine
    };
  }

  return {
    K_FLOOR: K_FLOOR,
    FIXTURE_CIRCLES: FIXTURE_CIRCLES,
    makeSettleFn: makeSettleFn,
    computeCircleImpact: computeCircleImpact,
    computeImpact: computeImpact,
    describeImpactAr: describeImpactAr
  };
});
