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
    if (row.isOverdue) return '<div class="due late">تأخّر عن ' + App.esc(row.nextDueLabel) + ' — ' + row.daysOverdue + ' يومًا</div>';
    if (row.statusKey === "ACTIVE" || row.statusKey === "SETTLING") return '<div class="due">القسط القادم: ' + App.esc(row.nextDueLabel) + "</div>";
    return "";
  }

  function amountLine(row) {
    var left = row.remainingSAR >= row.amountSAR ? "باقٍ كامل" : ("باقٍ " + App.engine.fmt(row.remainingSAR));
    if (row.statusKey === "KEPT" || row.statusKey === "FORGIVEN") left = "—";
    return '<div class="amt">' + App.engine.fmt(row.amountSAR) + ' ر.س · ' + left + "</div>";
  }

  function sheet(row, app) {
    var id = row.id, isMine = row.role === "lender";
    var gate = app.D.canSendReminder(row, app.reminderHistory[id] || [], app.AS_OF);
    var opts = [];
    if (isMine) {
      if (gate.allowed) opts.push('<button class="opt primary" onclick="AhdApp.daftariCompose(\'' + id + '\')">تذكيرٌ بالمعروف 🤍</button>');
      opts.push('<button class="opt" onclick="AhdApp.daftariCloseSheet()">اطمئن، أمهِله</button>');
      opts.push('<button class="opt" onclick="AhdApp.debtorGrace(\'' + id + '\')">اقترِح إعادة جدولة 🌿</button>');
      opts.push('<button class="opt" onclick="AhdApp.daftariForgive(\'' + id + '\')">أبرئ ما تبقّى</button>');
      opts.push('<button class="opt sober" onclick="AhdApp.daftariExport(\'' + id + '\')">صدّر السجلّ</button>');
    } else {
      opts.push('<button class="opt primary" onclick="AhdApp.debtorSettle(\'' + id + '\')">أسدّد الآن عبر سريع</button>');
      opts.push('<button class="opt" onclick="AhdApp.debtorGrace(\'' + id + '\')">أطلب مهلة 🌿</button>');
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
    return '<div class="row">' +
      '<div class="row-main">' + avatar(row.counterparty) +
        '<div class="row-body"><div class="who">' + App.esc(row.counterparty) + "</div>" + amountLine(row) + dueLine(row) + "</div>" +
        '<div class="row-side"><span class="chip ' + chipClass(row) + '">' + App.esc(row.chipLabel) + "</span>" + dots + "</div>" +
      "</div>" +
      (open ? sheet(row, app) : "") + (composing ? compose(row, app) : "") + "</div>";
  }

  function render(app) {
    var led = app.D.buildLedger(app.records, app.viewer, app.engine, app.AS_OF);
    var tiles = app.D.summaryTiles(led);
    var st = app.daftariState;
    var list = st.tab === "on" ? led.iOwe : led.owedToMe;

    var flash = st.flash ? '<div class="flash" onclick="AhdApp.daftariDismiss()">' + App.esc(st.flash) + ' <span class="x">×</span></div>' : "";
    var head =
      '<div class="tiles">' +
        '<div class="tile"><div class="tl">لك عند الناس</div><div class="tv">' + app.engine.fmt(tiles.me.amountSAR) + ' <small>ر.س</small></div><div class="tc">' + tiles.me.count + ' عهود</div></div>' +
        '<div class="tile"><div class="tl">عليك للناس</div><div class="tv">' + app.engine.fmt(tiles.on.amountSAR) + ' <small>ر.س</small></div><div class="tc">' + tiles.on.count + ' عهود</div></div>' +
      "</div>";
    var tabs =
      '<div class="tabs" role="tablist">' +
        '<button class="tab' + (st.tab === "me" ? " on" : "") + '" role="tab" aria-selected="' + (st.tab === "me") + '" onclick="AhdApp.daftariTab(\'me\')">لي</button>' +
        '<button class="tab' + (st.tab === "on" ? " on" : "") + '" role="tab" aria-selected="' + (st.tab === "on") + '" onclick="AhdApp.daftariTab(\'on\')">عليّ</button>' +
      "</div>";
    var body = list.length
      ? '<div class="list">' + list.map(function (r) { return rowHTML(r, app); }).join("") + "</div>"
      : '<div class="empty">دفترك نظيف. أول ما تكتب عهدًا — قرضًا لك أو عليك — يظهر هنا، محفوظًا.</div>';

    return '<div class="daftari">' + flash + head + tabs + body + "</div>";
  }

  App.registerScreen({ key: "daftari", label: "دفتري", icon: "📔", render: render });
})();
