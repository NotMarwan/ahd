/* ============================================================================
   screens/dispute.js — «محلّ خلاف» (dispute-pause). A CONTEXTUAL screen (reached
   from a disputed دفتري row, not a nav pill). Shows the bank's calm restraint:
   reminders paused · NO penalty · the sealed record kept as a NEUTRAL exhibit ·
   two dignified paths (تراضٍ encouraged · قضاء with the doc as neutral evidence).
   «عهدٌ يشهد ولا يحكم».
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  function pathHTML(p, id) {
    var acts = p.key === "reconcile"
      ? '<div class="dp-acts"><button class="primary" onclick="AhdApp.disputeGrace(\'' + id + '\')">اقترِح إعادة جدولة 🌿</button>' +
        '<button onclick="AhdApp.disputeForgive(\'' + id + '\')">أبرئ ما تبقّى 🤲</button></div>'
      : '<div class="dp-acts"><button onclick="AhdApp.openProof(\'' + id + '\')">اعرض الوثيقة دليلًا 🔏</button></div>';
    return '<div class="dp-path' + (p.encouraged ? " enc" : "") + '">' +
      '<div class="dp-pt">' + p.icon + " " + App.esc(p.ar) + (p.encouraged ? ' <span class="dp-tag">الأحبّ</span>' : "") + "</div>" +
      '<div class="dp-pn">' + App.esc(p.note) + "</div>" + acts + "</div>";
  }

  function render(app) {
    var e = app.engine, DP = app.Dispute, st = app.disputeState;
    if (!DP) return '<div class="empty">وحدة الخلاف غير محمّلة.</div>';
    var r = app.recordById(st.recordId) || app.records[0];
    if (!r) return '<div class="empty">لا يوجد عهد لعرضه.</div>';
    var v = DP.disputeView(r, e);
    var flash = st.flash ? '<div class="flash" onclick="AhdApp.disputeDismiss()">' + App.esc(st.flash) + ' <span class="x">×</span></div>' : "";

    return '<div class="dispute">' +
      '<button class="pf-back" onclick="AhdApp.disputeBack()">→ رجوع إلى دفتري</button>' + flash +
      '<div class="dp-head">محلّ خلاف</div>' +
      '<div class="dp-sub">عهد «' + App.esc(r.lender) + '» و«' + App.esc(r.borrower) + '» — ' + e.fmt(r.amountSAR) + ' ر.س</div>' +
      '<div class="dp-stance">' + App.esc(v.stance) + "</div>" +
      '<div class="dp-paused">⏸️ أوقف عهد التذكيرات هنا — بلا غرامة، بلا انحياز، بلا أيّ زيادة. الوقت الآن للصلح.</div>' +
      '<div class="dp-exhibit"><b>الوثيقة المحايدة</b><div class="dp-ex-ar">' + App.esc(v.neutralExhibit.ar) + "</div>" +
        '<button onclick="AhdApp.openProof(\'' + r.id + '\')">اعرض السجلّ المختوم 🔏</button></div>' +
      '<div class="dp-paths">' + v.paths.map(function (p) { return pathHTML(p, r.id); }).join("") + "</div>" +
      '<div class="dp-note">المصرف ليس خصمًا ولا حَكَمًا — يشهد، ويحفظ الحقّ بكرامةٍ للطرفين.</div>' +
    "</div>";
  }

  App.registerScreen({ key: "dispute", label: "محلّ خلاف", icon: "⚖️", render: render });
})();
