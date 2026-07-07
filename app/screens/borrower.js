/* ============================================================================
   screens/borrower.js — «ما عليّ · التزاماتي» (F1). The borrower's OWN home:
   the debts the viewer owes, told with dignity. Amber (never red) for a passed
   due, NO day-counter, mercy always within reach. Each row offers: pay-what-eased,
   a grace request (fixed reason enum → AhdApp.borrowerAskGrace), and the sealed
   proof. A summary strip of counts + total remaining — NO score, no band, no rank.

   Pure render over Borrower logic + the engine. innerHTML strings + AhdApp.*
   onclick actions (borrowerPay / borrowerAskGrace / openProof are wired by the
   integrator in Task 4 — the screen only references them). No-ops gracefully
   before integration via the `!app.Borrower` guard (like open-loan.js).
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  function chipClass(o) {
    if (o.isOverdue) return "amber";
    if (o.statusKey === "KEPT" || o.statusKey === "FORGIVEN" || o.inGrace) return "gold";
    if (o.statusKey === "DISPUTED") return "mute";
    if (o.dueSoon) return "teal";
    return "teal";
  }
  function avatar(name) { return '<span class="ava">' + App.esc(String(name).slice(0, 1)) + "</span>"; }

  /* the status WORD the borrower sees — reuses the engine's dignified label, and
     softens overdue to «عليك وعدٌ — بلا حرج» (amber, never a red countdown). */
  function statusWord(o) {
    if (o.inGrace) return "مؤجّل بالتراضي — نظرةٌ إلى ميسرة 🌿";
    if (o.isOverdue) return "عليك وعدٌ — أدِّه متى تيسّر، بلا حرج";
    if (o.dueSoon) return "موعدٌ قريب — متى ما تيسّر";
    return o.statusAr || "";
  }

  function closedOf(o) { return o.statusKey === "KEPT" || o.statusKey === "FORGIVEN" || o.statusKey === "VOID"; }

  /* the merciful exit: a fixed enum of grace reasons — each a single tap that emits
     AhdApp.borrowerAskGrace(id, reasonKey). Never free text (deterministic + safe). */
  function graceReasons(o) {
    var B = App.Borrower;
    var reasons = (B && B.GRACE_REASONS) || [];
    return '<div class="bw-grace"><div class="bw-glabel">أحتاج وقتًا — لماذا؟ (اختياريّ، يُطلَع عليه المُقرِض فقط)</div>' +
      '<div class="bw-gopts">' + reasons.map(function (r) {
        return '<button class="bw-greason" onclick="AhdApp.borrowerAskGrace(\'' + App.esc(o.record.id) + '\',\'' + App.esc(r.key) + '\')">' + App.esc(r.ar) + "</button>";
      }).join("") + "</div>" +
      '<div class="bw-gnote">طلبُ المهلة لا يزيد المبلغ ولا يضيف أيّ غرامة — ﴿وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة﴾.</div>' +
      "</div>";
  }

  function rowHTML(o) {
    var id = o.record.id, closed = closedOf(o);
    var remLine = closed
      ? '<div class="bw-amt">— · ذمّةٌ محفوظة</div>'
      : '<div class="bw-amt">المتبقّي <b>' + App.fmtN(o.remainingMinor / 100) + '</b> <small>ر.س</small></div>';
    var acts = closed ? "" :
      '<div class="bw-act">' +
        '<button class="primary" onclick="AhdApp.borrowerPay(\'' + App.esc(id) + '\',' + (o.remainingMinor / 100) + ')">سدِّد ما تيسّر</button>' +
        '<button class="ghost" onclick="AhdApp.openProof(\'' + App.esc(id) + '\')">🔏 الوثيقة</button>' +
      "</div>" + (o.inGrace ? "" : graceReasons(o));
    return '<div class="bw-row' + (o.isOverdue ? " overdue" : "") + '">' +
      '<div class="bw-main">' + avatar(o.counterparty) +
        '<div class="bw-body"><div class="bw-who">لـ ' + App.esc(o.counterparty) + "</div>" + remLine + "</div>" +
        '<div class="bw-side"><span class="chip ' + chipClass(o) + '">' + App.esc(statusWord(o)) + "</span></div>" +
      "</div>" + acts + "</div>";
  }

  function render(app) {
    /* graceful no-op before the integrator wires app.Borrower (Task 4) */
    if (!app.Borrower) return '<div class="empty">«ما عليّ» يظهر هنا بعد الربط — التزاماتك، محفوظةً وبكرامة.</div>';

    var B = app.Borrower;
    var view = B.makeBorrowerView(app.records || [], app.viewer, app.engine, app.AS_OF);
    var obs = B.borrowerObligations(app.records || [], app.viewer, app.engine, app.AS_OF);
    var sum = view.summary;

    var st = app.borrowerState || {};
    var flash = App.flashHTML(st.flash, "borrowerDismiss");

    /* summary strip — counts + total remaining ONLY. No score, no band, no rank. */
    var head =
      '<div class="bw-head"><div class="bw-title">ما عليّ</div>' +
        '<div class="bw-sub">التزاماتُك — بترتيب ما يستحقّ عنايتك أوّلًا، بلا مطالبة ولا عدّ أيّام</div></div>' +
      '<div class="bw-tiles">' +
        '<div class="bw-tile"><div class="bw-tl">إجمالي ما عليك</div><div class="bw-tv">' + App.fmtN(sum.totalRemainingMinor / 100) + ' <small>ر.س</small></div></div>' +
        '<div class="bw-tile"><div class="bw-tl">عهودٌ قائمة</div><div class="bw-tv">' + App.digit(sum.owedCount) + '</div></div>' +
        (sum.inGraceCount > 0
          ? '<div class="bw-tile grace"><div class="bw-tl">بمهلةٍ بالتراضي</div><div class="bw-tv">' + App.digit(sum.inGraceCount) + '</div></div>'
          : "") +
      "</div>";

    var note = '<div class="bw-verse">﴿وَإِن كَانَ ذُو عُسْرَةٍ فَنَظِرَةٌ إِلَىٰ مَيْسَرَةٍ﴾ — لك أن تطلب المهلة بكرامة، ولك أن تسدّد متى تيسّر.</div>';

    var body = obs.length
      ? '<div class="bw-list">' + obs.map(rowHTML).join("") + "</div>"
      : '<div class="empty">لا شيء عليك الآن 🤍 — ذمّتك خفيفة. أوّل عهدٍ عليك يظهر هنا، محفوظًا.</div>';

    return '<div class="borrower">' + flash + head + note + body + "</div>";
  }

  App.registerScreen({ key: "mine", label: "ما عليّ", icon: "🫱", render: render });
})();
