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
    var flash = App.flashHTML(st.flash, "createDismiss");

    var head = '<div class="cr-card"><div class="cr-h">أنشئ عهدًا · قرضٌ حسن</div>' +
      '<div class="cr-fields">' +
        '<div><span>المُقرِض</span><b>' + App.esc(draft.lender) + "</b></div>" +
        '<div><span>المقترض</span><b>' + App.esc(draft.borrower) + "</b></div>" +
        '<div><span>المبلغ</span><b>' + App.fmtN(draft.amountMinor / 100) + ' ر.س</b></div>' +
        '<div><span>السداد</span><b>' + (draft.open ? "مفتوح · متى ما تيسّر" : (draft.months + " أقساط")) + "</b></div>" +
      "</div></div>";

    var linter;
    if (clean) {
      linter = '<div class="cr-lint ok">✓ النصّ سليم — قرضٌ حسن بلا ربا ولا غرامة ولا أيّ زيادة</div>';
    } else {
      var n = v.hits.length;
      var lintHead = '<div class="cr-lint-head">✗ رصدَ عهد ' + App.digit(n) + ' ' +
        (n === 1 ? "شرطًا مخالفًا" : (n === 2 ? "شرطين مخالفين" : "شروطٍ مخالفة")) + " — لا يُختَم حتى تُزال:</div>";
      var items = v.hits.map(function (h) {
        return '<div class="cr-hit"><div class="cr-why">• ' + App.esc(h.why) + "</div>" +
          '<div class="fix"><b>البديل الحلال:</b> ' + App.esc(h.fix) + "</div></div>";
      }).join("");
      linter = '<div class="cr-lint bad">' + lintHead + items + "</div>";
    }
    var tryBar = st.extra
      ? '<button class="ghost" onclick="AhdApp.createClearRiba()">أزِل الشرط وأعد الصياغة</button>'
      : '<button class="ghost" onclick="AhdApp.createInjectRiba()">🧪 شرط غرامة</button>' +
        '<button class="ghost" onclick="AhdApp.createInjectSneaky()">🧪 صياغة ملتبسة (مموّهة)</button>';
    var termsBox = '<div class="cr-card"><div class="cr-sub">الشروط (صياغة علّام · محاكاة):</div>' +
      '<div class="cr-terms">' + App.esc(terms) + "</div>" + linter + '<div class="cr-trybar">' + tryBar + "</div></div>";

    var duressBlocked = !!(app.Care && app.Care.preSealBlocked(st.auxiliaryEvents));
    var duressNote = duressBlocked
      ? '<div class="cr-lint bad">بلاغ الإكراه قيد مراجعة بشرية؛ لا يُختَم العهد، ولا يصدر عهد حكمًا أو عقوبة.</div>'
      : '<button class="ghost" onclick="AhdApp.createReportDuress(\'coercion\')">أبلّغ عن إكراه</button>';
    var sealArea;
    if (st.sealed) {
      var ver = Cr.verifyCreated(draft, e, st.tamper ? 9999 : null);
      sealArea = '<div class="ol-seal"><div class="sl">الوثيقة المختومة · نفاذ (محاكاة) + SHA-256</div>' +
        '<div class="sh">SEAL: ' + App.esc(e.short(st.sealed.seal, 24)) + "…</div>" +
        '<div class="sv ' + (ver.ok ? "ok" : "bad") + '">' + (ver.ok ? "✓ سليمة — مطابقة للختم" : "✗ عبثٌ مكشوف! الختم لا يطابق") + "</div>" +
        '<button class="mini" onclick="AhdApp.createTamperToggle()">' + (st.tamper ? "أعد الأصل" : "🧪 جرّب العبث بالمبلغ") + "</button>" +
        '<button class="mini" onclick="AhdApp.createAddToDaftari()">أضِفها إلى دفتري ←</button></div>';
      /* the money story at the seal moment: the قرض costs nothing, the flat أجرة is a
         SEPARATE line — never summed into the loan (spine). Guarded so screens that
         don't load Billing (e.g. an isolated smoke) render exactly as before. */
      if (App.Billing && App.FeeReceipt) {
        var fr = App.FeeReceipt.build(App.Billing.feeForSeal(draft), App.Billing.sarStr);
        var frLines = fr.lines.map(function (ln) {
          return '<div class="pl-rline' + (ln.zero ? " zero" : "") + '"><span>' + App.esc(ln.k) + "</span><b>" + App.digit(ln.v) + " ر.س</b></div>";
        }).join("");
        sealArea += '<div class="pl-receipt"><div class="pl-rtitle">' + App.esc(fr.title) + "</div>" + frLines +
          '<div class="pl-rnote">' + App.esc(fr.note) + "</div>" +
          '<div class="pl-badge">🕋 ' + App.esc(fr.badge) + "</div>" +
          '<button class="mini" onclick="AhdApp.go(\'plans\')">الأجرة والخطط ←</button></div>';
      }
    } else if (App.ReviewGate && st.reviewing) {
      /* the FIXED review (Najiz/DocuSign G2): exactly what will be sealed + what is NOT in it */
      var rv = App.ReviewGate.build({ lender: draft.lender, borrower: draft.borrower, amountMinor: draft.amountMinor, months: draft.months, open: draft.open }, terms);
      var rvLines = rv.lines.map(function (l) {
        return '<div class="pv-row"><span>' + App.esc(l.k) + "</span><b>" + App.esc(l.v) + "</b></div>";
      }).join("");
      var rvAbsent = rv.absentAr.map(function (a) { return '<div class="rv-abs">✕ ' + App.esc(a) + "</div>"; }).join("");
      sealArea = '<div class="cr-card rv-card"><div class="cr-sub">مراجعة أخيرة — هذا ما سيُختَم:</div>' + rvLines +
        '<div class="rv-abshead">ما ليس في هذا العهد:</div>' + rvAbsent +
        '<div class="rv-fp">بصمة المعاينة: ' + rv.fingerprint + "</div>" +
        '<div class="cr-act"><button class="primary"' + (clean && !duressBlocked ? "" : " disabled") + ' onclick="AhdApp.createSeal()">أكّد واختم العهد عبر نفاذ (محاكاة)</button>' +
        '<button class="ghost" onclick="AhdApp.createBackFromReview()">عدّل</button></div></div>' + duressNote;
    } else if (App.ReviewGate) {
      sealArea = '<div class="cr-act"><button class="primary"' + (clean && !duressBlocked ? "" : " disabled") + ' onclick="AhdApp.createOpenReview()">راجع قبل الختم</button></div>' + duressNote +
        (clean ? "" : '<div class="cr-note">لا يُختَم حتى يُزال الشرط المخالف — هذا ما يحفظه عهد لكما.</div>');
    } else {
      sealArea = '<div class="cr-act"><button class="primary"' + (clean && !duressBlocked ? "" : " disabled") + ' onclick="AhdApp.createSeal()">اختم العهد عبر نفاذ (محاكاة)</button></div>' + duressNote +
        (clean ? "" : '<div class="cr-note">لا يُختَم حتى يُزال الشرط المخالف — هذا ما يحفظه عهد لكما.</div>');
    }
    return '<div class="create">' + flash + head + termsBox + sealArea + "</div>";
  }

  App.registerScreen({ key: "create", label: "أنشئ عهدًا", icon: "➕", render: render });
})();
