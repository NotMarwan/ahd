/* ============================================================================
   screens/plans.js — «الأجرة والخطط». The revenue story, made visible and spine-
   clean: every paid tier is headlined «أجرة على الخدمة، لا على القرض · القرض
   مجانيٌّ للأبد», carries the honest «قيد المراجعة الشرعيّة» badge (D-6), and the
   page shows the live two-line fee receipt (الزيادة على القرض: 0.00 · أجرة ثابتة:
   5.00) so the judge SEES the separation, not just reads about it. CONTEXTUAL —
   reached from a home card, never a nav pill (nav stays 8). New file; the frozen
   demo is untouched. Reads window.Billing + window.FeeReceipt.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  var Billing = (typeof window !== "undefined") ? window.Billing : null;
  var FeeReceipt = (typeof window !== "undefined") ? window.FeeReceipt : null;
  if (!App) return;

  function priceHTML(app, plan) {
    if (!plan.paid) return '<div class="pl-price free">مجانًا — للأبد</div>';
    var e = app.engine;
    var num = app.digit(e ? e.fmt(Billing.wholeSar(plan.priceHalalas)) : String(Billing.wholeSar(plan.priceHalalas)));
    return '<div class="pl-price"><b>' + num + ' ر.س</b><span> · ' + App.esc(plan.unit || ("لكلّ " + plan.cycle)) + "</span></div>";
  }

  function planCard(app, plan) {
    var feats = (plan.features || []).map(function (f) {
      return '<li>' + App.esc(f) + "</li>";
    }).join("");
    var badge = plan.paid
      ? '<div class="pl-badge">🕋 ' + App.esc(Billing.SHARIAH_REVIEW_LABEL) + "</div>"
      : '<div class="pl-badge free">✓ بلا رسم</div>';
    return '<div class="pl-card' + (plan.paid ? "" : " is-free") + '">' +
      '<div class="pl-name">' + App.esc(plan.name) + "</div>" +
      '<div class="pl-payer">يدفعها: ' + App.esc(plan.payer) + "</div>" +
      priceHTML(app, plan) +
      '<ul class="pl-feats">' + feats + "</ul>" +
      '<div class="pl-note">' + App.esc(plan.note || "") + "</div>" +
      '<div class="pl-free">' + App.esc(Billing.LOAN_FREE_AR) + "</div>" +
      badge +
    "</div>";
  }

  function receiptHTML(app) {
    if (!FeeReceipt) return "";
    var r = FeeReceipt.build(Billing.feeForSeal({}), Billing.sarStr);
    var lines = r.lines.map(function (ln) {
      return '<div class="pl-rline' + (ln.zero ? " zero" : "") + '"><span>' + App.esc(ln.k) + "</span>" +
        '<b>' + app.digit(ln.v) + " ر.س</b></div>";
    }).join("");
    return '<div class="pl-receipt">' +
      '<div class="pl-rtitle">' + App.esc(r.title) + "</div>" +
      lines +
      '<div class="pl-rnote">' + App.esc(r.note) + "</div>" +
      '<div class="pl-badge">🕋 ' + App.esc(r.badge) + "</div>" +
    "</div>";
  }

  function render(app) {
    if (!Billing) return '<div class="empty">وحدة الأجرة غير محمّلة.</div>';
    var cards = Billing.PLANS.map(function (p) { return planCard(app, p); }).join("");
    return '<div class="plans">' +
      '<div class="pl-head">الأجرة والخطط</div>' +
      '<div class="pl-thesis"><b>' + App.esc(Billing.SERVICE_NOT_LOAN_AR) + "</b> · " + App.esc(Billing.LOAN_FREE_AR) + "</div>" +
      '<div class="pl-sub">الخيرُ مجاني، والبنية لها أجرة — كمسجدٍ الصلاةُ فيه مجانيّة وبناؤه مدفوع. كلّ سعرٍ ثابتٌ للخدمة، لا نسبةً من قرض، ولا يزيد بالتأخير.</div>' +
      receiptHTML(app) +
      '<div class="pl-cards">' + cards + "</div>" +
      '<div class="pl-basis">الأساس المعياريّ: أجرةٌ ثابتةٌ بقدر التكلفة المباشرة على عقدٍ منفصل (AAOIFI SS-19: لا ربطَ بالمبلغ، ولا بالمدّة). ' +
        'كلُّ رقمٍ هنا مقترحٌ ' + App.esc(Billing.SHARIAH_REVIEW_LABEL) + " — لا يُذكر حكمًا مستقرًّا حتى يُعتمد.</div>" +
      '<button class="hsettings" onclick="AhdApp.go(\'home\')">← الرئيسية</button>' +
    "</div>";
  }

  App.registerScreen({ key: "plans", label: "الأجرة والخطط", icon: "🧾", render: render });
})();
