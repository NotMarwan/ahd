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
      '<button class="bw-greason" onclick="AhdApp.borrowerRequestForgiveness(\'' + App.esc(o.record.id) + '\',\'financial_hardship\')">أطلب إبراءً</button>' +
      '<div class="bw-gnote">طلبُ المهلة لا يزيد المبلغ ولا يضيف أيّ غرامة — ﴿وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة﴾.</div>' +
      "</div>";
  }

  function rowHTML(o) {
    var id = o.record.id, closed = closedOf(o);
    var remLine = closed
      ? '<div class="bw-amt">— · ذمّةٌ محفوظة</div>'
      : '<div class="bw-amt">المتبقّي <b>' + App.fmtN(o.remainingMinor / 100) + '</b> <small>ر.س</small></div>';
    /* تصديق السداد (Najiz G4): record a payment WITH a مؤيد — the balance moves
       only after the creditor accepts. The form is inline + deterministic. */
    var pcBits = "";
    if (App.PayConfirm && App.payConfirmState && !closed) {
      var pcPending = App.PayConfirm.pendingFor(App.payConfirmState, id);
      var pcChip = pcPending.length
        ? '<div class="pc-pending">⏳ دفعة بانتظار تصديق ' + App.esc(o.counterparty) + " — " + App.esc(pcPending[0].evidenceAr) + "</div>" +
          '<div class="rem-sim">ما سيراه ' + App.esc(o.counterparty) + " (محاكاة):" +
            '<button class="mini" onclick="AhdApp.pcAccept(\'' + pcPending[0].id + '\')">صدّق — يُختَم السداد</button>' +
            '<button class="mini" onclick="AhdApp.pcReject(\'' + pcPending[0].id + '\',\'notReceived\')">ارفض — لم يصلني</button>' +
          "</div>"
        : "";
      var pcForm = (App.pcState && App.pcState.formId === id)
        ? '<div class="pc-form"><label>المبلغ (ر.س)<input id="pc-amount" type="number" value="' + (o.remainingMinor / 100) + '"></label>' +
          '<label>المؤيد — كيف سُدّدت؟<input id="pc-evidence" value="حوالة مصرفية — مرجع "></label>' +
          '<div class="cr-act"><button class="primary" onclick="AhdApp.pcSubmitClaim(\'' + App.esc(id) + '\')">أرسل للتصديق</button>' +
          '<button class="ghost" onclick="AhdApp.pcCancelForm()">تراجع</button></div>' +
          '<div class="bw-gnote">لا يتغيّر الرصيد حتى يصدّق ' + App.esc(o.counterparty) + " — ورفضه المسبب يفتح محلّ خلاف.</div></div>"
        : '<button class="ghost" onclick="AhdApp.pcOpenForm(\'' + App.esc(id) + '\')">سجّلت دفعة — اطلب تصديقها</button>';
      pcBits = pcChip + pcForm;
    }
    var acts = closed ? "" :
      '<div class="bw-act">' +
        '<button class="primary" onclick="AhdApp.borrowerPay(\'' + App.esc(id) + '\',' + (o.remainingMinor / 100) + ')">سدِّد ما تيسّر</button>' +
        '<button class="ghost" onclick="AhdApp.openProof(\'' + App.esc(id) + '\')">🔏 الوثيقة</button>' +
        pcBits +
      "</div>" + (o.inGrace ? "" : graceReasons(o));
    /* next-step line (Zirtue G1): borrower rows get the same «التالي» guidance,
       built from the SAME Daftari.rowFor projection the ledger uses. */
    var nextLine = "";
    if (App.NextStep && App.D && !closed) {
      var nsRow = App.D.rowFor(o.record, App.viewer, App.engine, App.AS_OF);
      var ns = App.NextStep.fromRow(nsRow);
      nextLine = '<div class="row-next"><span class="nsx-ref">' + App.esc(ns.ref) + '</span> ' + App.esc(ns.nextAr) + "</div>";
    }
    return '<div class="bw-row' + (o.isOverdue ? " overdue" : "") + '">' +
      '<div class="bw-main">' + avatar(o.counterparty) +
        '<div class="bw-body"><div class="bw-who">لـ ' + App.esc(o.counterparty) + "</div>" + remLine + "</div>" +
        '<div class="bw-side"><span class="chip ' + chipClass(o) + '">' + App.esc(statusWord(o)) + "</span></div>" +
      "</div>" + nextLine + acts + "</div>";
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

    var note = '<div class="bw-verse">﴿وَإِن كَانَ ذُو عُسْرَةٍ فَنَظِرَةٌ إِلَىٰ مَيْسَرَةٍ﴾ — لك أن تطلب المهلة بكرامة، ولك أن تسدّد متى تيسّر.</div>' +
      /* contextual bridge to «الضمانات والحدود» (JL-4) — what protects the debtor, each بند with its test */
      '<button class="bd-chip" onclick="AhdApp.go(\'bounds\')">🧭 الضمانات والحدود — ما يحميك هنا، باختباره</button>';

    var body = obs.length
      ? '<div class="bw-list">' + obs.map(rowHTML).join("") + "</div>"
      : '<div class="empty">لا شيء عليك الآن 🤍 — ذمّتك خفيفة. أوّل عهدٍ عليك يظهر هنا، محفوظًا.</div>';

    return '<div class="borrower">' + flash + head + note + body + "</div>";
  }

  /* reads the inline تصديق form (daily.js DOM-reading pattern) then delegates
     to the pure pcClaim action — validation errors surface as a flash */
  App.pcSubmitClaim = function (recordId) {
    if (typeof document === "undefined") return App.rerender();
    var amount = document.getElementById("pc-amount") ? document.getElementById("pc-amount").value : "";
    var evidence = document.getElementById("pc-evidence") ? document.getElementById("pc-evidence").value : "";
    return App.pcClaim(recordId, amount, evidence);
  };

  App.registerScreen({ key: "mine", label: "ما عليّ", icon: "🫱", render: render });
})();
