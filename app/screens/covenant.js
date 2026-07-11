/* ============================================================================
   screens/covenant.js — «سِجلّ المعروف» (the sealed good-faith / mercy trail).
   A CONTEXTUAL screen (reached from a دفتري row / the dispute screen, not a nav
   pill). Turns the reminder ladder + grace + forgiveness of ONE عهد into a single
   sealed, ordered, tamper-evident معروف timeline that PROVES good faith — each
   entry a dignified Arabic line + a short seal; a live tamper toggle shows the
   chain breaking; «صدّر كبيّنة محايدة» prepares the NEUTRAL court exhibit.
   ON-SPINE: the exhibit is parties + terms-hash + timeline + status ONLY — no
   score, no band, no number-as-reputation. Reminders show the ORIGINAL amount,
   never a day-counter. «كلمتك محفوظة، وعلاقتك محميّة».
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  /* one معروف step → a dignified row: an amber-neutral dot, the Arabic line,
     the original/step amount (money only, never a score), and its short seal. */
  function stepHTML(entry, broken, App) {
    var e = App.engine;
    var amt = entry.amountMinor > 0 ? '<span class="cv-amt">' + App.fmtN(entry.amountMinor / 100) + " ر.س</span>" : "";
    var sealShort = App.esc(e.short(entry.seal, 24));
    return '<div class="cv-step kind-' + App.esc(entry.kind) + (broken ? " broken" : "") + '">' +
      '<span class="cv-dot" aria-hidden="true"></span>' +
      '<div class="cv-body"><div class="cv-line">' + App.esc(entry.ar) + amt + "</div>" +
      '<div class="cv-seal">SEAL: ' + sealShort + "…" + (broken ? ' <span class="cv-x">✗ انكسر الختم</span>' : "") + "</div>" +
      "</div></div>";
  }

  function render(app) {
    /* guard — the module + the contextual state must both be wired (integrator) */
    if (!app.CovenantLog || !app.covenantState) return '<div class="empty">لا يوجد سِجلّ معروفٍ لعرضه.</div>';
    var C = app.CovenantLog, e = app.engine, st = app.covenantState;
    var r = app.recordById(st.recordId) || (app.records && app.records[0]);
    if (!r) return '<div class="empty">لا يوجد عهد لعرض معروفه.</div>';

    var log = C.buildCovenantLog(r, app.reminderHistory || {}, e, app.AS_OF);
    if (!log.length) return '<div class="empty">لا معروف بعدُ في هذا العهد — لم يُختم بعد.</div>';

    var sealed = C.sealCovenantLog(log, r, e);
    /* live tamper: mutate the FIRST post-seal entry (index 1 when it exists) to
       show the chain break exactly like the other seals' tamper toggles. */
    var tamperIdx = st.tamper ? (sealed.entries.length > 1 ? 1 : 0) : null;
    var ver = C.verifyCovenantLog(sealed, r, e, tamperIdx);
    var broke = ver.firstBrokenAt;
    var flash = App.flashHTML(st.flash, "covenantDismiss");

    var steps = sealed.entries.map(function (entry, i) {
      var isBroken = (broke >= 0 && i >= broke);
      return stepHTML(entry, isBroken, App);
    }).join("");

    var status = (typeof e.statusLabel === "function") ? e.statusLabel(r.events || []) : "";

    var exhibitBlock = "";
    if (st.exhibit && window.ExhibitView) {
      var ex = C.exhibitFor(sealed, r, e);
      var L = window.ExhibitView.exhibitLinesAr(ex);
      exhibitBlock = '<div class="cv-exhibit">' +
        L.headerLines.map(function (l) { return '<div class="cv-ex-h">' + App.esc(l) + "</div>"; }).join("") +
        '<div class="cv-ex-tl">' + L.timelineLines.map(function (l) { return '<div class="cv-ex-row">' + App.esc(l) + "</div>"; }).join("") + "</div>" +
        L.footerLines.map(function (l) { return '<div class="cv-ex-f">' + App.esc(l) + "</div>"; }).join("") +
      "</div>";
    }

    return '<div class="covenant">' +
      '<button class="pf-back" onclick="AhdApp.covenantBack()">→ رجوع إلى دفتري</button>' + flash +
      '<div class="cv-head">سِجلّ المعروف</div>' +
      '<div class="cv-sub">عهد «' + App.esc(r.lender) + '» و«' + App.esc(r.borrower) + '» — ' + App.fmtN(r.amountSAR) + ' ر.س</div>' +
      '<div class="cv-intro">كلُّ تذكيرٍ لطيف، وكلُّ نظرةٍ إلى ميسرة، وكلُّ إبراء — مختومٌ ومرتّبٌ هنا. ' +
        'هذا سِجلٌّ يشهد بحُسن النيّة، لا يُقيّم أحدًا ولا يُصنّفه.</div>' +
      '<div class="cv-timeline">' + steps + "</div>" +
      '<div class="cv-status"><span class="chip ' + (broke >= 0 ? "bad" : "teal") + '">' +
        (broke >= 0 ? "✗ عبثٌ مكشوف — سلسلة الختم مقطوعة من الخطوة " + App.digit(String(broke + 1))
                    : "✓ السلسلة سليمة — كلّ خطوةٍ مطابقةٌ لختمها") + "</span>" +
        (status ? ' <span class="chip gold">' + App.esc(status) + "</span>" : "") + "</div>" +
      '<div class="cv-note">لا يظهر هنا عددُ أيّامٍ ولا تصنيفٌ ولا رقمُ سمعة — أصلُ المبلغ وحده، ومعروفٌ محفوظ.</div>' +
      '<div class="cv-act">' +
        '<button class="primary" onclick="AhdApp.covenantExport()">' + (st.exhibit ? "أخفِ البيّنة" : "📤 صدِّرها كبيّنة محايدة") + "</button>" +
        '<button class="mini" onclick="AhdApp.covenantTamperToggle()">' + (st.tamper ? "أعد الأصل" : "🧪 جرّب العبث بالسِّجل") + "</button>" +
      "</div>" +
      exhibitBlock +
      '<div class="cv-exhibit-note">البيّنة المحايدة تحوي الطرفين وبصمة الشروط والخطوات المختومة وحالتها النهائية فقط — بلا أيّ سمعةٍ أو تقييم، كما تُقبل دليلًا (نظام الإثبات ٢٠٢٢).</div>' +
    "</div>";
  }

  App.registerScreen({ key: "maroof", label: "سِجلّ المعروف", icon: "🕊️", render: render });
})();
