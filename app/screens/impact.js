/* ============================================================================
   screens/impact.js — «أثر عهد» (JL-3): the k-anonymous netting-efficiency
   dashboard over honestly-labeled test circles + the animated 9→2 collapse.
   Display-only over features/impact.js (the GOLDEN netting consumed DI-style
   via Impact.makeSettleFn) and the SAME conservationProof the settle screen
   renders — nothing is recomputed by hand, nothing hardcoded independently.
   CONTEXTUAL screen: reached from a home card + the settle-screen chip;
   NAV_ORDER is untouched.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  var Impact = (typeof window !== "undefined") ? window.Impact : null;
  if (!App) return;

  /* the collapse toggle: flips ONE class on the svg wrapper — all motion is
     CSS-only (and reduced-motion-guarded in app.css); no rerender, no timers.
     Defined here, not in app.js, so the whole feature stays additive. */
  App.impactCollapse = function () {
    if (typeof document === "undefined") return "";
    var el = document.getElementById("im-collapse");
    if (el && el.classList) el.classList.toggle("on");
    return "";
  };

  /* deterministic pentagon coordinates for the 5 member dots (precomputed
     integer constants — no trig at runtime), index-aligned with engine.NODES */
  var DOTS = [[180, 34], [292, 116], [249, 247], [111, 247], [68, 116]];

  function lineSVG(t, engine, cls) {
    var a = DOTS[engine.NODES.indexOf(t.from)], b = DOTS[engine.NODES.indexOf(t.to)];
    if (!a || !b) return "";
    return '<line class="' + cls + '" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>';
  }

  /* integer halalas → whole SAR for display (fixture amounts are whole-SAR
     multiples of 100 — asserted in tests/app/impact.test.cjs; integer ops only) */
  function sarOf(h) { return (h - (h % 100)) / 100; }

  /* the collapse visual: the SAME demo tangle the settle screen nets — the 9
     golden IOUs and the 2 transfers the golden netting returns (via
     features/settlement.js). Dots only: no names, no amounts (aggregates-only
     spine). The caption's numbers are the settle screen's computed values,
     per the plan — nothing hardcoded here. */
  function collapseHTML(app, cp) {
    var e = app.engine, S = app.Settlement;
    var after = S.settlementView(e.IOUS, e).after;
    var nine = e.IOUS.map(function (t) { return lineSVG(t, e, "im-l9"); }).join("");
    var two = after.map(function (t) { return lineSVG(t, e, "im-l2"); }).join("");
    var dots = e.NODES.map(function (n, i) {
      return '<circle class="im-dot" cx="' + DOTS[i][0] + '" cy="' + DOTS[i][1] + '" r="10"/>';
    }).join("");
    var afterTxt = cp.transfersAfter === 1 ? "تحويلٌ واحد"
      : (cp.transfersAfter === 2 ? "تحويلان" : App.digit(cp.transfersAfter) + " تحويلات");
    return '<div id="im-collapse" class="im-collapse">' +
      '<svg viewBox="0 0 360 282" role="img" aria-label="شبكة التزاماتٍ متشابكة تنهار إلى تحويلين">' +
        nine + two + dots + "</svg>" +
      '<button class="im-btn" onclick="AhdApp.impactCollapse()">شاهد الانهيار ' + App.digit(cp.transfersBefore) + ' ← ' + App.digit(cp.transfersAfter) + '</button>' +
      '<div class="im-cap"><b>' + App.digit(cp.transfersBefore) + '</b> التزاماتٍ — <b>' + afterTxt +
        '</b>. المالُ المتحرّك: من <b>' + App.fmtN(cp.moneyMovedBefore) + '</b> إلى <b>' +
        App.fmtN(cp.moneyMovedAfter) + '</b> ريال، والمراكزُ محفوظة.</div>' +
    "</div>";
  }

  function render(app) {
    var e = app.engine, S = app.Settlement;
    if (!S || !Impact) return '<div class="empty">وحدة أثر عهد غير محمّلة.</div>';
    var cp = S.conservationProof(e.IOUS, e);
    var fmtN = function (n) { return App.fmtN(n); };  /* keep `this` = App inside describeImpactAr */
    var agg = Impact.computeImpact(Impact.FIXTURE_CIRCLES, Impact.makeSettleFn(e));
    var d = Impact.describeImpactAr(agg, fmtN);

    var cards = '<div class="im-cards">' +
      '<div class="im-card"><b>' + App.digit(agg.totals.obligations) + '</b><span>التزامًا قبل المقاصّة</span></div>' +
      '<div class="im-card"><b>' + App.digit(agg.totals.transfersAfter) + '</b><span>تحويلًا بعدها — وُفِّر ' + App.digit(agg.totals.transfersAvoided) + '</span></div>' +
      '<div class="im-card"><b>' + App.fmtN(sarOf(agg.totals.movedBeforeH)) + '</b><span>ر.س كانت ستتحرّك منفردةً</span></div>' +
      '<div class="im-card"><b>' + App.fmtN(sarOf(agg.totals.movedAfterH)) + '</b><span>ر.س تتحرّك بالمقاصّة</span></div>' +
    "</div>";

    /* distribution bars: widths via INTEGER flex-grow ratios (the open-loan
       house trick) — no percentage text is ever rendered */
    var maxT = 0;
    agg.buckets.forEach(function (b) { if (b.avgTransfersAvoidedTenths > maxT) maxT = b.avgTransfersAvoidedTenths; });
    var drill = (typeof window !== "undefined") ? window.ImpactDrill : null;
    var openBucket = app.impactState ? app.impactState.bucket : null;
    var rows = agg.buckets.map(function (b, i) {
      var t = b.avgTransfersAvoidedTenths;
      var isOpen = (openBucket === b.size);
      var head = '<button class="im-row' + (isOpen ? " on" : "") + '" onclick="AhdApp.impactBucket(' + b.size + ')">' +
        '<span class="im-row-l">' + App.esc(d.bucketLines[i]) + '</span>' +
        '<span class="im-bar" aria-hidden="true"><i style="flex-grow:' + t + '"></i><em style="flex-grow:' + (maxT - t) + '"></em></span>' +
        '<span class="im-caret" aria-hidden="true">' + (isOpen ? "▾" : "◂") + "</span></button>";
      var body = "";
      if (isOpen && drill) {
        var circles = drill.circlesForBucket(b.size, Impact.FIXTURE_CIRCLES, Impact.makeSettleFn(e));
        body = '<div class="im-drill">' + circles.map(function (c) {
          return '<div class="im-circle">' + App.esc(drill.describeCircleAr(c, function (n) { return App.fmtN(n); })) +
            ' <span class="chip ' + (c.conservationOk ? "teal" : "bad") + '">' + (c.conservationOk ? "✓" : "✗") + "</span></div>";
        }).join("") + "</div>";
      }
      return head + body;
    }).join("");

    return '<div class="impact">' +
      '<div class="im-head">أثر عهد — أثر المقاصّة عبر الدوائر</div>' +
      '<div class="im-banner">' + App.esc(d.honestyLine) + "</div>" +
      collapseHTML(app, cp) +
      '<div class="im-hero">' + App.esc(d.heroLine) + "</div>" +
      cards +
      '<div class="im-saved">' + App.esc(d.totalsLines[2]) + "</div>" +
      '<div class="im-dist"><div class="im-sub">توزيع الأثر حسب حجم الدائرة (مجاميع مجهّلة):</div>' + rows + "</div>" +
      '<div class="im-cons">' + App.esc(d.conservationLine) +
        ' <button class="im-chip" onclick="AhdApp.go(\'settle\')">🔗 المقاصّة — البرهان الحيّ</button></div>' +
    "</div>";
  }

  App.registerScreen({ key: "impact", label: "أثر عهد", icon: "📊", render: render });
})();
