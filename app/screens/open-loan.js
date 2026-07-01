/* ============================================================================
   screens/open-loan.js — «القرض المفتوح · متى ما تيسّر» render (Agent-2 §3 هـ/و).
   A deliberately QUIET panel: remaining only, no due, no red, no countdown.
   Partial pay (سريع) + the lender-owned إبراء. Sealed record + tamper verify.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  function sheetHTML() {
    return '<div class="ol-sheet"><div class="ayah">﴿وَأَن تَصَدَّقُوا خَيْرٌ لَّكُمْ إِن كُنتُمْ تَعْلَمُونَ﴾</div>' +
      '<button class="opt primary" onclick="AhdApp.openLoanForgiveFull()">أُبرئ المبلغ كاملًا — لوجه الله</button>' +
      '<button class="opt" onclick="AhdApp.openLoanForgivePartial(8000)">أُبرئ جزءًا (٨٬٠٠٠) — والباقي يبقى مفتوحًا</button>' +
      '<button class="opt sober" onclick="AhdApp.openLoanCloseSheet()">تراجع</button></div>';
  }

  function render(app) {
    if (!app.openLoan || !app.OpenLoan) return '<div class="empty">لا يوجد قرضٌ مفتوح.</div>';
    var OL = app.OpenLoan, e = app.engine, loan = app.openLoan, st = app.openLoanState;
    var f = OL.foldOpenLoan(loan);
    var pr = OL.openLoanProgress(loan);
    var hist = OL.openLoanHistory(loan);
    var seal = OL.openLoanSeal(loan, e);
    var ver = OL.verifyOpenLoan(loan, e, st.tamper ? 9999 : null);
    var closed = (f.statusKey === "KEPT" || f.statusKey === "FORGIVEN");
    var flash = App.flashHTML(st.flash, "openLoanDismiss");

    /* a proportional bar (paid · صدقة · باقٍ) — flex-grow fractions, NO % text/score */
    var seg = function (frac, cls) { return frac > 0 ? '<span class="ol-seg ' + cls + '" style="flex-grow:' + frac + '"></span>' : ""; };
    var bar = '<div class="ol-bar" aria-hidden="true">' + seg(pr.paidFrac, "paid") + seg(pr.forgivenFrac, "forgiven") + seg(pr.remainingFrac, "rem") + "</div>";
    var lg = [];
    if (pr.paidMinor > 0) lg.push('<span class="ol-lg paid">سُدِّد ' + App.fmtN(pr.paidMinor / 100) + "</span>");
    if (pr.forgivenMinor > 0) lg.push('<span class="ol-lg forgiven">صدقة ' + App.fmtN(pr.forgivenMinor / 100) + "</span>");
    lg.push('<span class="ol-lg rem">باقٍ ' + App.fmtN(pr.remainingMinor / 100) + "</span>");
    lg.push('<span class="ol-lg total">من ' + App.fmtN(pr.principalMinor / 100) + " ر.س</span>");
    var progress = '<div class="ol-progress">' + bar + '<div class="ol-legend">' + lg.join("") + "</div></div>";

    var moves = hist.filter(function (x) { return x.kind !== "sealed"; });
    var journey = moves.length
      ? '<div class="ol-journey"><div class="ol-jh">رحلة السداد · متى ما تيسّر</div>' +
        hist.map(function (x) {
          var amt = x.amountMinor > 0 ? " · " + App.fmtN(x.amountMinor / 100) + " ر.س" : "";
          return '<div class="ol-jstep kind-' + App.esc(x.kind) + '"><span class="ol-jdot" aria-hidden="true"></span><span>' + App.esc(x.ar) + amt + "</span></div>";
        }).join("") + "</div>"
      : "";

    return '<div class="openloan">' + flash +
      '<div class="ol-head">قرضٌ مفتوحٌ بينك وبين ' + App.esc(loan.borrower) + ' — متى ما تيسّر</div>' +
      '<div class="ol-rem"><div class="ol-rl">المتبقّي</div><div class="ol-rv">' + App.fmtN(f.remainingMinor / 100) + ' <small>ر.س</small></div></div>' +
      progress +
      '<div class="ol-status"><span class="chip ' + (closed ? "gold" : "teal") + '">' + App.esc(OL.openLoanStatusAr(loan)) + "</span></div>" +
      journey +
      '<div class="ol-note">لا موعد، لا تذكير منك، لا حرج. حين ييسّر الله، يردّ — ولكِ أن تُبرئ متى شئتِ.</div>' +
      (closed ? "" :
        '<div class="ol-act">' +
          '<button class="primary" onclick="AhdApp.openLoanPay(5000)">سدِّد جزءًا الآن (٥٬٠٠٠)</button>' +
          '<button class="ghost" onclick="AhdApp.openLoanForgiveSheet()">🤍 اجعلها صدقة</button>' +
        "</div>") +
      (st.sheet && !closed ? sheetHTML() : "") +
      '<div class="ol-terms">' + App.esc(OL.openLoanTermsAr(loan, e)) + "</div>" +
      '<div class="ol-seal">' +
        '<div class="sl">الوثيقة المختومة · قرضٌ مفتوح</div>' +
        '<div class="sk">السداد: متى ما تيسّر (قرضٌ مفتوح — بلا موعد)</div>' +
        '<div class="sh">SEAL: ' + App.esc(e.short(seal.seal, 24)) + "…</div>" +
        '<div class="sv ' + (ver.ok ? "ok" : "bad") + '">' + (ver.ok ? "✓ الوثيقة سليمة — مطابقة للختم" : "✗ عبثٌ مكشوف! الختم لا يطابق") + "</div>" +
        '<button class="mini" onclick="AhdApp.openLoanTamperToggle()">' + (st.tamper ? "أعد الأصل" : "🧪 جرّب العبث بالمبلغ") + "</button>" +
      "</div></div>";
  }

  App.registerScreen({ key: "open", label: "قرضٌ مفتوح", icon: "♾️", render: render });
})();
