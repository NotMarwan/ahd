/* explain-card.js — Rizq step "drilldown" (Contract 4c) — OWNER: Agent 3
   The "why this number" proof: signals + SAR contributions + OB/ZATCA source badges + cited Tawarruq.
   UMD → global TR. render(el, {bundle, result}, {onForecast, onRestart}). Offline, RTL, deterministic. */
(function (root) {
  "use strict";
  var fmt = function (n) { return Math.round(n).toLocaleString("en-US"); };
  function srcBadge(name) {
    var s = (root.RizqApi && root.RizqApi.sourceOf) ? root.RizqApi.sourceOf(name) : "MIX";
    if (s === "OB") return '<span class="tr-badge tr-badge--ob">OB</span>';
    if (s === "ZATCA") return '<span class="tr-badge tr-badge--zatca">ZATCA</span>';
    return '<span class="tr-badge tr-badge--mix">مشترك</span>';
  }

  function renderExplainCard(el, ctx, opts) {
    ctx = ctx || {}; opts = opts || {};
    var r = ctx.result;
    var maxC = Math.max.apply(null, r.signals.map(function (s) { return s.contribution_sar; }).concat([1]));

    var rows = r.signals.map(function (s) {
      var w = Math.max(4, Math.round(s.contribution_sar / maxC * 100));
      return '<div class="rz-sig">' +
        '<div class="rz-sig-head">' +
          '<span class="rz-sig-label">' + s.label_ar + '</span>' + srcBadge(s.name) +
          '<span class="rz-sig-amt tr-num">+' + fmt(s.contribution_sar) + ' ر.س</span>' +
        '</div>' +
        '<div class="rz-sig-track"><div class="rz-sig-fill" style="width:' + w + '%"></div></div>' +
        '<div class="rz-sig-val tr-sub tr-num">' + Math.round(s.value * 100) + '٪</div>' +
      '</div>';
    }).join("");

    var standin = r._explainer_standin
      ? '<div class="rz-standin">شرح تجريبي (Stand-in) — يُستبدل بمخرجات ALLaM عبر IBM watsonx عند الدمج.</div>' : "";

    el.innerHTML =
      '<div class="rz-wrap">' +
        '<h1 class="tr-h1">لماذا هذا المبلغ</h1>' +
        '<div class="tr-card rz-explain">' +
          '<p class="rz-explanation">' + r.explanation_ar + '</p>' + standin +
          '<div class="rz-sigs">' + rows + '</div>' +
          '<div class="rz-moat">العائدان معًا — <b>المصرفية المفتوحة</b> (حركة النقد) و<b>زاتكا</b> (المبيعات الموثّقة) — ' +
            'يقودان الرقم. هذا ما يجعل التمويل مقاومًا للاحتيال، ومتاحًا لأول مرة في السعودية.</div>' +
          '<div class="rz-explain-foot">' +
            '<span class="tr-shariah">☾ تورّق · بلا ربا</span>' +
            '<span class="tr-sub tr-num">الثقة ' + Math.round(r.confidence * 100) + '٪ · ' + r.decision_id + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="rz-actions">' +
          '<button class="tr-btn block" id="rz-fc">اعرض خطتي الشهرية ←</button>' +
          '<button class="tr-btn ghost block" id="rz-restart">ابدأ من جديد</button>' +
        '</div>' +
      '</div>';

    var fc = el.querySelector("#rz-fc"); if (fc) fc.addEventListener("click", function () { if (opts.onForecast) opts.onForecast(); });
    var rs = el.querySelector("#rz-restart"); if (rs) rs.addEventListener("click", function () { if (opts.onRestart) opts.onRestart(); });
  }

  root.TR = root.TR || {};
  root.TR.renderExplainCard = renderExplainCard;
})(typeof window !== "undefined" ? window : globalThis);
