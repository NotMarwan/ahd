/* ============================================================================
   screens/daftari.js — «دفتري» creditor-home render (Agent-3 spec §4).
   Pure render over Daftari logic + the engine. innerHTML strings + AhdApp.*
   onclick actions. Amber (never red) for late; mercy always attached.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  function chipClass(row) {
    if (row.isOverdue) return "amber";
    if (row.statusKey === "KEPT" || row.statusKey === "FORGIVEN" || row.graced) return "gold";
    if (row.statusKey === "DISPUTED") return "mute";
    return "teal";
  }
  function avatar(name) { return '<span class="ava">' + App.esc(String(name).slice(0, 1)) + "</span>"; }

  function dueLine(row) {
    if (!row.nextDueISO) return "";
    if (row.isOverdue) return '<div class="due late">تأخّر عن ' + App.esc(App.digit(row.nextDueLabel)) + ' — ' + App.esc(App.digit(row.daysOverdue)) + ' يومًا</div>';
    if (row.statusKey === "ACTIVE" || row.statusKey === "SETTLING") return '<div class="due">القسط القادم: ' + App.esc(App.digit(row.nextDueLabel)) + "</div>";
    return "";
  }

  function amountLine(row) {
    var left = row.remainingSAR >= row.amountSAR ? "باقٍ كامل" : ("باقٍ " + App.fmtN(row.remainingSAR));
    if (row.statusKey === "KEPT" || row.statusKey === "FORGIVEN") left = "—";
    return '<div class="amt">' + App.fmtN(row.amountSAR) + ' ر.س · ' + left + "</div>";
  }

  function sheet(row, app) {
    var id = row.id, isMine = row.role === "lender";
    var gate = app.D.canSendReminder(row, app.reminderHistory[id] || [], app.AS_OF);
    var opts = [];
    if (isMine) {
      if (row.statusKey === "DISPUTED") opts.push('<button class="opt" onclick="AhdApp.openDispute(\'' + id + '\')">تفاصيل الخلاف ⚖️</button>');
      if (gate.allowed) opts.push('<button class="opt primary" onclick="AhdApp.daftariCompose(\'' + id + '\')">تذكيرٌ بالمعروف 🤍</button>');
      opts.push('<button class="opt" onclick="AhdApp.daftariCloseSheet()">اطمئن، أمهِله</button>');
      opts.push('<button class="opt" onclick="AhdApp.debtorGrace(\'' + id + '\')">اقترِح إعادة جدولة 🌿</button>');
      opts.push('<button class="opt" onclick="AhdApp.daftariForgive(\'' + id + '\')">أبرئ ما تبقّى</button>');
      opts.push('<button class="opt sober" onclick="AhdApp.openProof(\'' + id + '\')">وثيقة الإثبات 🔏</button>');
      opts.push('<button class="opt sober" onclick="AhdApp.openTimelineFor(\'' + id + '\')">سجلّ هذا العهد 📜</button>');
      opts.push('<button class="opt sober" onclick="AhdApp.openCovenant(\'' + id + '\')">سِجلّ المعروف 🕊️</button>');
    } else {
      opts.push('<button class="opt primary" onclick="AhdApp.debtorSettle(\'' + id + '\')">أسدّد الآن عبر سريع</button>');
      opts.push('<button class="opt" onclick="AhdApp.debtorGrace(\'' + id + '\')">أطلب مهلة 🌿</button>');
      opts.push('<button class="opt sober" onclick="AhdApp.openTimelineFor(\'' + id + '\')">سجلّ هذا العهد 📜</button>');
      opts.push('<button class="opt sober" onclick="AhdApp.openCovenant(\'' + id + '\')">سِجلّ المعروف 🕊️</button>');
      opts.push('<button class="opt" onclick="AhdApp.daftariCloseSheet()">إغلاق</button>');
    }
    return '<div class="sheet">' + opts.join("") + "</div>";
  }

  function compose(row, app) {
    var id = row.id, tier = app.daftariState.composeTier;
    var ctx = { creditor: app.viewer, amountSAR: row.remainingSAR || row.amountSAR, dueLabel: row.nextDueLabel || "" };
    var text = app.D.reminderTemplate(tier, ctx);
    return '<div class="compose">' +
      '<div class="rem-from">عهد · تذكيرٌ بالمعروف' + (tier === 2 ? " (ثانٍ)" : "") + "</div>" +
      '<div class="rem-card">' + App.esc(text) + "</div>" +
      '<div class="rem-act">' +
        '<button class="primary" onclick="AhdApp.daftariSend(\'' + id + '\')">أرسِل بالنيابة عني 🤍</button>' +
        '<button class="ghost" onclick="AhdApp.daftariTab(\'' + app.daftariState.tab + '\')">تراجع</button>' +
      "</div>" +
      '<div class="rem-sim">ما سيراه ' + App.esc(row.counterparty) + ' (مُحاكاة):' +
        '<button class="mini" onclick="AhdApp.debtorSettle(\'' + id + '\')">أسدّد الآن عبر سريع</button>' +
        '<button class="mini" onclick="AhdApp.debtorGrace(\'' + id + '\')">أحتاج وقت 🌿</button>' +
      "</div></div>";
  }

  function rowHTML(row, app) {
    var open = (app.daftariState.sheetId === row.id), composing = (app.daftariState.composeId === row.id);
    var canAct = row.statusKey !== "KEPT" && row.statusKey !== "FORGIVEN" && row.statusKey !== "VOID";
    var dots = canAct ? '<button class="dots" onclick="AhdApp.daftariOpenSheet(\'' + row.id + '\')" aria-label="إجراءات">⋯</button>' : "";
    /* next-step line (Zirtue G1): the row itself says what to do next + its reference */
    var nextLine = "";
    if (App.NextStep && canAct) {
      var ns = App.NextStep.fromRow(row);
      nextLine = '<div class="row-next"><span class="nsx-ref">' + App.esc(ns.ref) + '</span> ' + App.esc(ns.nextAr) + "</div>";
    }
    return '<div class="row">' +
      '<div class="row-main">' + avatar(row.counterparty) +
        '<div class="row-body"><div class="who">' + App.esc(row.counterparty) + "</div>" + amountLine(row) + dueLine(row) + "</div>" +
        '<div class="row-side"><span class="chip ' + chipClass(row) + '">' + App.esc(row.chipLabel) + "</span>" + dots + "</div>" +
      "</div>" + nextLine +
      (open ? sheet(row, app) : "") + (composing ? compose(row, app) : "") + "</div>";
  }

  /* net position — a MONEY balance (factual), never a score */
  function netLine(app, led) {
    var np = app.D.netPosition(led, app.engine);
    if (np.side === "balanced") return '<div class="net bal">ميزانك متوازن — لا لك ولا عليك 🤍</div>';
    var word = np.side === "lak" ? "صافي ما لك" : "صافي ما عليك";
    return '<div class="net ' + np.side + '">' + word + ' <b>' + App.fmtN(np.netSAR) + ' ر.س</b><small>بعد مقاصّة ما لك بما عليك</small></div>';
  }

  /* filter chips — only the categories present in the active side are shown */
  function filterBar(app, sideRows) {
    var cur = app.daftariState.filter || "all";
    var defs = [
      { k: "all", t: "الكل" },
      { k: "overdue", t: "متأخّرة", has: sideRows.some(function (r) { return r.isOverdue; }) },
      { k: "active", t: "قائمة", has: sideRows.some(function (r) { return app.D.filterRows([r], "active").length; }) },
      { k: "disputed", t: "خلاف", has: sideRows.some(function (r) { return r.statusKey === "DISPUTED"; }) },
      { k: "kept", t: "محفوظة", has: sideRows.some(function (r) { return app.D.filterRows([r], "kept").length; }) }
    ].filter(function (d) { return d.k === "all" || d.has; });
    if (defs.length <= 2) return "";  // nothing meaningful to filter
    return '<div class="dfilter" role="tablist" aria-label="تصفية">' + defs.map(function (d) {
      return '<button class="fchip' + (d.k === cur ? " on" : "") + '" onclick="AhdApp.daftariFilter(\'' + d.k + '\')">' + App.esc(d.t) + "</button>";
    }).join("") + "</div>";
  }

  function sectionHTML(sec, app) {
    var note = sec.note ? '<span class="snote">' + App.esc(sec.note) + "</span>" : "";
    return '<div class="dsection"><div class="shead"><span class="slabel">' + App.esc(sec.label) +
      '</span><span class="scount">' + App.digit(sec.rows.length) + "</span>" + note + "</div>" +
      sec.rows.map(function (r) { return rowHTML(r, app); }).join("") + "</div>";
  }

  /* a SENT-but-unaccepted طلب عهد — visible in «عليّ», but NOT yet in any total
     (it is not a sealed عهد until the lender accepts) */
  function pendingRequestRow(app) {
    var req = app.request, rs = app.requestState;
    if (!req || !rs || !rs.sent || rs.accepted) return "";
    return '<div class="dpending"><span class="ava">' + App.esc(String(req.lender).slice(0, 1)) + "</span>" +
      '<div class="pbody"><div class="ptitle">طلبُ عهدٍ إلى ' + App.esc(req.lender) + ' — بانتظار القبول</div>' +
      '<div class="psub">' + App.fmtN(req.amountSAR) + ' ر.س · لم يُختَم بعد، فليس في ميزانك حتى يُقبل</div></div>' +
      '<button class="pgo" onclick="AhdApp.go(\'request\')">متابعة ←</button></div>';
  }

  function render(app) {
    var led = app.D.buildLedger(app.records, app.viewer, app.engine, app.AS_OF);
    var tiles = app.D.summaryTiles(led);
    var st = app.daftariState;
    var sideRows = st.tab === "on" ? led.iOwe : led.owedToMe;
    var sections = app.D.groupLedger(app.D.filterRows(sideRows, st.filter || "all"));

    var flash = App.flashHTML(st.flash, "daftariDismiss");
    var head =
      '<div class="dhead"><div class="dtitle">دفتري</div><button class="dask" onclick="AhdApp.go(\'request\')">＋ اطلب عهدًا</button></div>' +
      '<div class="tiles">' +
        '<div class="tile"><div class="tl">لك عند الناس</div><div class="tv">' + App.fmtN(tiles.me.amountSAR) + ' <small>ر.س</small></div><div class="tc">' + App.digit(tiles.me.count) + ' عهود</div></div>' +
        '<div class="tile"><div class="tl">عليك للناس</div><div class="tv">' + App.fmtN(tiles.on.amountSAR) + ' <small>ر.س</small></div><div class="tc">' + App.digit(tiles.on.count) + ' عهود</div></div>' +
      "</div>" + netLine(app, led);
    var tabs =
      '<div class="tabs" role="tablist">' +
        '<button class="tab' + (st.tab === "me" ? " on" : "") + '" role="tab" aria-selected="' + (st.tab === "me") + '" onclick="AhdApp.daftariTab(\'me\')">لي</button>' +
        '<button class="tab' + (st.tab === "on" ? " on" : "") + '" role="tab" aria-selected="' + (st.tab === "on") + '" onclick="AhdApp.daftariTab(\'on\')">عليّ</button>' +
      "</div>";
    var filter = filterBar(app, sideRows);
    var bandHTML = "";
    if (st.tab === "on" && app.selfHistory && app.D.selfBand) {
      var sb = app.D.selfBand(app.selfHistory, false, app.engine);
      bandHTML = '<div class="selfband">سجلّ وفائك <span class="sbnote">(مرآةٌ لك وحدك — كلمة، لا رقم)</span> <b>' + App.esc(sb.word) + "</b></div>";
    }
    var pending = st.tab === "on" ? pendingRequestRow(app) : "";
    var body = sections.length
      ? '<div class="list">' + sections.map(function (s) { return sectionHTML(s, app); }).join("") + "</div>"
      : '<div class="empty">' + ((st.filter && st.filter !== "all")
          ? "لا عهود في هذا التصنيف."
          : "دفترك نظيف. أول ما تكتب عهدًا — قرضًا لك أو عليك — يظهر هنا، محفوظًا.") + "</div>";

    return '<div class="daftari">' + flash + head + tabs + filter + bandHTML + pending + body + "</div>";
  }

  App.registerScreen({ key: "daftari", label: "دفتري", icon: "📔", render: render });
})();
