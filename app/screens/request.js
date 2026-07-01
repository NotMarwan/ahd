/* ============================================================================
   screens/request.js — «اطلب عهدًا» (borrower-initiated ask). A CONTEXTUAL screen
   (reached from a home card). You compose a dignified, riba-checked request to a
   lender; «أرسل الطلب» → (محاكاة) the lender accepts → a sealed عهد drops into your
   «عليّ». Reuses the create look + the golden seal. «لا حرج في أن تسأل».
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  function render(app) {
    var e = app.engine, R = app.RequestAhd, req = app.request, st = app.requestState;
    if (!R || !req) return '<div class="empty">تعذّر تحميل الطلب.</div>';
    var terms = R.requestTermsAr(req, e);
    var clean = R.requestRibaCheck(req, e).verdict === "clean";
    var flash = App.flashHTML(st.flash, "requestDismiss");

    var head = '<div class="cr-card"><div class="cr-h">اطلب عهدًا · قرضٌ حسن</div>' +
      '<div class="cr-sub">أنت تطلب — وعهدٌ يكتبها بكرامة. لا حرج في أن تسأل، والكلمة محفوظة.</div>' +
      '<div class="cr-fields">' +
        '<div><span>المُقترِض (أنت)</span><b>' + App.esc(req.borrower) + "</b></div>" +
        '<div><span>تطلب من</span><b>' + App.esc(req.lender) + "</b></div>" +
        '<div><span>المبلغ</span><b>' + App.fmtN(req.amountSAR) + ' ر.س</b></div>' +
        '<div><span>السداد</span><b>' + (req.open ? "مفتوح · متى ما تيسّر" : (App.digit(req.months) + " أقساط")) + "</b></div>" +
      "</div></div>";

    var termsCard = '<div class="cr-card"><div class="cr-sub">الشروط (صياغة علّام · محاكاة):</div>' +
      '<div class="cr-terms">' + App.esc(terms) + "</div>" +
      '<div class="cr-lint ' + (clean ? "ok" : "bad") + '">' + (clean
        ? "✓ النصّ سليم — قرضٌ حسن بلا ربا، ولا غرامة، ولا أيّ زيادة"
        : "✗ يحتاج تصحيحًا") + "</div></div>";

    var action;
    if (st.accepted) {
      action = '<div class="cr-card">' +
        '<div class="ca-ok">✓ وافق ' + App.esc(req.lender) + ' — خُتم العهد وأُضيف إلى دفترك («عليّ») 🤍</div>' +
        '<div class="ca-seal">SEAL: ' + App.esc(e.short(R.requestSeal(req, e).seal, 24)) + "…</div>" +
        '<button class="primary" onclick="AhdApp.go(\'daftari\')">افتح دفتري · «عليّ»</button></div>';
    } else if (st.sent) {
      action = '<div class="cr-card"><div class="cr-sub">أُرسل الطلب — بانتظار موافقة ' + App.esc(req.lender) + ".</div>" +
        '<div class="rem-sim">محاكاة: <button class="mini" onclick="AhdApp.requestAccept()">وافق ' + App.esc(req.lender) + ' على العهد 🤍</button></div></div>';
    } else {
      action = '<div class="cr-act"><button class="primary"' + (clean ? "" : " disabled") + ' onclick="AhdApp.requestSend()">أرسِل الطلب بالمعروف</button></div>' +
        '<div class="cr-note">الطلب لا يُلزم أحدًا — للمُقرض أن يوافق أو يعتذر بلا حرج.</div>';
    }

    return '<div class="create">' + flash + head + termsCard + action + "</div>";
  }

  App.registerScreen({ key: "request", label: "اطلب عهدًا", icon: "🙏", render: render });
})();
