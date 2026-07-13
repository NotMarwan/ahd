/* ============================================================================
   screens/org.js — «لوحة المؤسسة · صندوق قرض حسن» (Phase B). The dashboard the
   first paying customer logs into: aggregate KPIs (members, active/settled
   covenants, money lent/repaid/outstanding — all integer halalas), the flat
   monthly software invoice from the Billing engine, and a visible guard footer:
   aggregates only, never an individual's number, no pooled custody. CONTEXTUAL —
   a home card, not a nav pill. New file; the frozen demo is untouched.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  var Org = (typeof window !== "undefined") ? window.Org : null;
  var Billing = (typeof window !== "undefined") ? window.Billing : null;
  if (!App) return;

  function kpi(label, val) {
    return '<div class="org-kpi"><span>' + App.esc(label) + "</span><b>" + val + "</b></div>";
  }

  function render(app) {
    if (!Org || !Billing) return '<div class="empty">وحدة المؤسسة غير محمّلة.</div>';
    var org = Org.makeOrg();
    var L = Org.orgLedger(org);
    var inv = Org.orgInvoice(org, Billing);
    var sar = Billing.wholeSar;

    var tiles =
      kpi("الأعضاء المشتركون", App.digit(L.seats)) +
      kpi("عهودٌ نشطة", App.digit(L.activeCovenants)) +
      kpi("محفوظة (مسدَّدة)", App.digit(L.settledCovenants)) +
      kpi("أُقرِض قرضًا حسنًا", App.fmtN(sar(L.disbursedHalalas)) + " ر.س") +
      kpi("مُسدَّد", App.fmtN(sar(L.repaidHalalas)) + " ر.س") +
      kpi("متبقٍّ", App.fmtN(sar(L.outstandingHalalas)) + " ر.س");

    var invoiceHTML = inv
      ? '<div class="pl-receipt">' +
          '<div class="pl-rtitle">اشتراك البرمجيّة — أجرةٌ ثابتة</div>' +
          '<div class="pl-rline"><span>الخطة المؤسسيّة (الوقف/الجمعية)</span><b>' +
            App.digit(Billing.sarStr(inv.amountHalalas)) + " ر.س/شهر</b></div>" +
          '<div class="pl-rline zero"><span>نسبةٌ من قروض الأعضاء</span><b>' + App.digit("0.00") + " ر.س</b></div>" +
          '<div class="pl-rnote">' + App.digit(App.esc(String(org.seats))) + " مقعدٍ × ٤ ر.س — أجرةٌ على الأداة، ثابتةٌ لا تكبر بمبالغ القروض ولا بعددها." + "</div>" +
          '<div class="pl-badge">🕋 ' + App.esc(Billing.SHARIAH_REVIEW_LABEL) + "</div>" +
        "</div>"
      : "";

    var nettingHTML = '<button class="org-link" onclick="AhdApp.go(\'impact\')">' +
      "📊 أثر المقاصّة عبر دوائر الصندوق — مجاميع مجهّلة ←</button>";

    var conservation = L.conservationOk
      ? '<div class="org-proof">✓ برهان الحفظ: صافي الصندوق = مجموع العهود بالهللة</div>' : "";

    var guard = '<div class="org-guard">' +
      '<div>🛡️ تجميعاتٌ فقط — لا رقمَ فردٍ، ولا تصنيف، ولا يُصدَّر شيء.</div>' +
      '<div>🤍 لا يحتفظ الصندوق بمالٍ مجمَّع — كلٌّ يدفع لحظة الصرف (عهدٌ حسن مباشر).</div>' +
      '<div>لا يُعرَض تفصيلٌ لأقلّ من ' + App.digit(L.kFloor) + " عهود.</div>" +
    "</div>";

    return '<div class="org">' +
      '<div class="org-head">لوحة المؤسسة · صندوق قرض حسن</div>' +
      '<div class="org-fund"><b>' + App.esc(org.name) + "</b><span> · دورة " + App.digit(App.esc(org.cycleKey)) + " · بيانات اختبار</span></div>" +
      '<div class="org-hero-num">' + App.fmtN(sar(L.outstandingHalalas)) + ' <small>ر.س متبقٍّ للصندوق</small></div>' +
      '<div class="org-kpis">' + tiles + "</div>" +
      conservation +
      invoiceHTML +
      nettingHTML +
      guard +
      '<div class="org-cta"><button class="org-link" onclick="AhdApp.go(\'plans\')">🧾 الأجرة والخطط ←</button>' +
      '<button class="hsettings" onclick="AhdApp.go(\'home\')">← الرئيسية</button></div>' +
    "</div>";
  }

  App.registerScreen({ key: "org", label: "لوحة المؤسسة", icon: "🏛️", render: render });
})();
