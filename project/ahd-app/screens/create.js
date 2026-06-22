/* ============================================================================
   screens/create.js — create a new عهد. The star is the RIBA LINTER: type a
   penalty/interest clause and عهد BLOCKS the seal + offers the halal alternative.
   Then seal (Nafath + SHA-256), verify/tamper, and drop it into دفتري.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  function render(app) {
    var e = app.engine, Cr = app.CreateAhd, draft = app.createDraft, st = app.createState;
    if (!Cr || !draft) return '<div class="empty">تعذّر تحميل الإنشاء.</div>';
    var terms = Cr.draftTermsAr(draft, e) + (st.extra ? " " + st.extra : "");
    var v = Cr.ribaCheck(terms, e), clean = v.verdict === "clean";
    var flash = st.flash ? '<div class="flash" onclick="AhdApp.createDismiss()">' + App.esc(st.flash) + ' <span class="x">×</span></div>' : "";

    var head = '<div class="cr-card"><div class="cr-h">أنشئ عهدًا · قرضٌ حسن</div>' +
      '<div class="cr-fields">' +
        '<div><span>المُقرِض</span><b>' + App.esc(draft.lender) + "</b></div>" +
        '<div><span>المقترض</span><b>' + App.esc(draft.borrower) + "</b></div>" +
        '<div><span>المبلغ</span><b>' + App.fmtN(draft.amountMinor / 100) + ' ر.س</b></div>' +
        '<div><span>السداد</span><b>' + (draft.open ? "مفتوح · متى ما تيسّر" : (draft.months + " أقساط")) + "</b></div>" +
      "</div></div>";

    var linter = clean
      ? '<div class="cr-lint ok">✓ النصّ سليم — قرضٌ حسن بلا ربا ولا غرامة</div>'
      : '<div class="cr-lint bad">✗ ' + App.esc(v.hits[0].why) + '<div class="fix">البديل الحلال: ' + App.esc(v.hits[0].fix) + "</div></div>";
    var tryBar = st.extra
      ? '<button class="ghost" onclick="AhdApp.createClearRiba()">أزِل الشرط</button>'
      : '<button class="ghost" onclick="AhdApp.createInjectRiba()">🧪 جرّب: أضِف شرط غرامة</button>';
    var termsBox = '<div class="cr-card"><div class="cr-sub">الشروط (صياغة علّام · محاكاة):</div>' +
      '<div class="cr-terms">' + App.esc(terms) + "</div>" + linter + '<div class="cr-trybar">' + tryBar + "</div></div>";

    var sealArea;
    if (st.sealed) {
      var ver = Cr.verifyCreated(draft, e, st.tamper ? 9999 : null);
      sealArea = '<div class="ol-seal"><div class="sl">الوثيقة المختومة · نفاذ + SHA-256</div>' +
        '<div class="sh">SEAL: ' + App.esc(e.short(st.sealed.seal, 24)) + "…</div>" +
        '<div class="sv ' + (ver.ok ? "ok" : "bad") + '">' + (ver.ok ? "✓ سليمة — مطابقة للختم" : "✗ عبثٌ مكشوف! الختم لا يطابق") + "</div>" +
        '<button class="mini" onclick="AhdApp.createTamperToggle()">' + (st.tamper ? "أعد الأصل" : "🧪 جرّب العبث بالمبلغ") + "</button>" +
        '<button class="mini" onclick="AhdApp.createAddToDaftari()">أضِفها إلى دفتري ←</button></div>';
    } else {
      sealArea = '<div class="cr-act"><button class="primary"' + (clean ? "" : " disabled") + ' onclick="AhdApp.createSeal()">اختم العهد عبر نفاذ</button></div>' +
        (clean ? "" : '<div class="cr-note">لا يُختَم حتى يُزال الشرط المخالف — هذا ما يحفظه عهد لكما.</div>');
    }
    return '<div class="create">' + flash + head + termsBox + sealArea + "</div>";
  }

  App.registerScreen({ key: "create", label: "أنشئ عهدًا", icon: "➕", render: render });
})();
