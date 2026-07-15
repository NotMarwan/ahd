/* ==========================================================================
   screens/daily.js — «عهد اليومي»: quick private qaids, exact bill split,
   dignified reminder text, upgrade to existing create flow, offline confirm.
=========================================================================== */
(function () {
  "use strict";
  var App = typeof window !== "undefined" ? window.AhdApp : null;
  var Q = typeof window !== "undefined" ? window.Qaid : null;
  var Split = typeof window !== "undefined" ? window.Split : null;
  var Reminder = typeof window !== "undefined" ? window.Reminder : null;
  var WaLink = typeof window !== "undefined" ? window.WaLink : null;
  if (!App || !Q || !Split || !Reminder || !WaLink) return;

  function parseMinor(value) {
    var match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(String(value == null ? "" : value).trim());
    if (!match) throw new Error("أدخل مبلغًا صحيحًا بالريال");
    var fraction = ((match[2] || "") + "00").slice(0, 2);
    var minor = Number(match[1]) * 100 + Number(fraction);
    if (!Number.isSafeInteger(minor) || minor <= 0) throw new Error("المبلغ يجب أن يكون أكبر من صفر");
    return minor;
  }

  function seedState() {
    var state = Q.makeState("أنت");
    state = Q.addQaid(state, { direction: "alayya", name: "سالم", amountMinor: 12500, noteAr: "مشتريات البيت" });
    state = Q.addQaid(state, { direction: "lahum", name: "سالم", amountMinor: 12500, noteAr: "تذكرة مشتركة" });
    state = Q.addQaid(state, { direction: "alayya", name: "نورة", amountMinor: 8000, noteAr: "قسمة عشاء" });
    state = Q.addQaid(state, { direction: "lahum", name: "هند", amountMinor: 2300, noteAr: "قهوة" });
    return state;
  }

  function seedSplit() {
    return Split.makeSplit({ totalMinor: 48001, payer: "أنت", participants: ["أنت", "سالم", "نورة", "هند", "منال", "عبير"] });
  }

  App.Qaid = Q; App.Split = Split; App.Reminder = Reminder; App.WaLink = WaLink;
  App.dailyState = App.dailyState || {
    ledger: seedState(), splitDraft: seedSplit(), flash: null, shareText: null,
    reminderRecords: {}, showSplit: true
  };

  function byId(id) {
    return App.dailyState.ledger.qaids.filter(function (qaid) { return qaid.id === id; })[0] || null;
  }

  function sharedRecord(qaid) {
    var draft = Q.upgradeToAhd(qaid);
    return WaLink.makeSharedRecord({
      id: draft.id, lender: draft.lender, borrower: draft.borrower,
      amountMinor: qaid.amountMinor,
      termsAr: App.CreateAhd.draftTermsAr(draft, App.engine)
    }, App.engine);
  }

  function reminderRecord(qaid) {
    var draft = Q.upgradeToAhd(qaid);
    var existing = App.dailyState.reminderRecords[qaid.id];
    if (existing) return existing;
    return {
      id: draft.id, lender: draft.lender, borrower: draft.borrower,
      amountMinor: qaid.amountMinor, amountSAR: App.engine.minorToFixed2(qaid.amountMinor),
      installments: [{ dueISO: "2026-07-14", amountSAR: App.engine.minorToFixed2(qaid.amountMinor) }],
      events: [App.engine.ev("AHD_DRAFTED", { installments: 1 }), App.engine.ev("LENDER_SIGNED"), App.engine.ev("COUNTERPARTY_SIGNED"), App.engine.ev("RECORD_SEALED"), App.engine.ev("ACTIVATED")]
    };
  }

  App.dailyAdd = function () {
    try {
      var direction = document.getElementById("daily-direction-lahum").checked ? "lahum" : "alayya";
      this.dailyState.ledger = Q.addQaid(this.dailyState.ledger, {
        direction: direction,
        name: document.getElementById("daily-name").value,
        amountMinor: parseMinor(document.getElementById("daily-amount").value),
        noteAr: document.getElementById("daily-note").value
      });
      this.dailyState.flash = "أُضيف القيد الشخصي — غير مختوم";
    } catch (error) { this.dailyState.flash = error.message; }
    return this.rerender();
  };

  App.dailySettle = function (id) {
    try { this.dailyState.ledger = Q.settleQaid(this.dailyState.ledger, id); this.dailyState.flash = "سُجّلت التسوية في قيدك الشخصي"; }
    catch (error) { this.dailyState.flash = error.message; }
    return this.rerender();
  };

  App.dailyUpgrade = function (id) {
    var qaid = byId(id);
    if (!qaid) return this.rerender();
    this.createDraft = Q.upgradeToAhd(qaid);
    this.createState.sealed = null; this.createState.extra = ""; this.createState.flash = "معبّأ من قيدك الشخصي — راجع ثم اختم";
    return this.go("create");
  };

  App.dailyShare = function (id) {
    var qaid = byId(id);
    if (qaid) {
      this.dailyState.shareText = WaLink.buildShareText(sharedRecord(qaid));
      this.dailyState.flash = "جُهّز رابط تحقق واتساب — لم يُرسل شيء من التطبيق";
    }
    return this.rerender();
  };

  App.dailyRemind = function (id) {
    var qaid = byId(id);
    if (!qaid) return this.rerender();
    try {
      var sent = Reminder.sendReminder(reminderRecord(qaid), "2026-07-15", App.engine);
      this.dailyState.reminderRecords[id] = sent.record;
      this.dailyState.shareText = sent.shareText;
      this.dailyState.flash = "جُهّز تذكير بالمعروف — لم يُرسل شيء من التطبيق";
    } catch (error) { this.dailyState.flash = error.message; }
    return this.rerender();
  };

  App.dailySplitToggle = function () { this.dailyState.showSplit = !this.dailyState.showSplit; return this.rerender(); };
  App.dailySplit = function () {
    try {
      var participants = String(document.getElementById("daily-split-names").value || "").split(/[،,\n]/).map(function (name) { return name.trim(); }).filter(Boolean);
      var split = Split.makeSplit({
        totalMinor: parseMinor(document.getElementById("daily-split-total").value),
        payer: String(document.getElementById("daily-split-payer").value || "").trim(),
        participants: participants
      });
      if (split.payer !== this.dailyState.ledger.owner) throw new Error("طبّق القسمة من دفتر من دفع الفاتورة");
      this.dailyState.ledger = Split.applySplit(this.dailyState.ledger, split);
      this.dailyState.splitDraft = split;
      this.dailyState.flash = "قُسّمت الفاتورة بالهللة دون فاقد";
    } catch (error) { this.dailyState.flash = error.message; }
    return this.rerender();
  };
  App.dailyDismiss = function () { this.dailyState.flash = null; this.dailyState.shareText = null; return this.rerender(); };

  function money(minor) { return App.digit(App.engine.minorToFixed2(minor)); }
  function directionAr(direction) { return direction === "lahum" ? "لهم عليّ" : "لي عليهم"; }

  function rowHTML(qaid) {
    var settled = Q.isSettled(qaid);
    return '<div class="row"><div class="row-main"><span class="ava">' + App.esc(qaid.name.slice(0, 1)) + '</span>' +
      '<div class="row-body"><div class="who">' + App.esc(qaid.name) + '</div><div class="amt">' + money(qaid.amountMinor) + ' ر.س · ' + App.esc(directionAr(qaid.direction)) + '</div>' +
      '<div class="due">' + App.esc(qaid.noteAr || "بلا ملاحظة") + '</div><div class="due">قيد شخصي — غير مختوم</div></div>' +
      '<div class="row-side"><span class="chip ' + (settled ? "gold" : "mute") + '">' + (settled ? "تمت التسوية" : "خاص") + '</span></div></div>' +
      '<div class="rem-act">' + (settled ? '' : '<button class="mini" onclick="AhdApp.dailySettle(\'' + qaid.id + '\')">✓ تسوية</button>') +
      '<button class="mini" onclick="AhdApp.dailyUpgrade(\'' + qaid.id + '\')">حوّل إلى عهد مختوم</button>' +
      '<button class="mini" onclick="AhdApp.dailyShare(\'' + qaid.id + '\')">واتساب</button>' +
      '<button class="mini" onclick="AhdApp.dailyRemind(\'' + qaid.id + '\')">تذكير</button></div></div>';
  }

  function quickAdd() {
    return '<section class="card"><div class="eyebrow">قيد خفيف · في ثوانٍ</div><h2>أضف قيدًا شخصيًا</h2>' +
      '<div class="dfilter"><label class="fchip on"><input id="daily-direction-alayya" type="radio" name="daily-direction" checked> لي عليهم</label>' +
      '<label class="fchip"><input id="daily-direction-lahum" type="radio" name="daily-direction"> لهم عليّ</label></div>' +
      '<div class="form-grid"><label>الاسم<input id="daily-name" value="سالم"></label><label>المبلغ<input id="daily-amount" inputmode="decimal" value="25.00"></label>' +
      '<label>الملاحظة<input id="daily-note" value="مشتريات"></label></div><button class="primary" onclick="AhdApp.dailyAdd()">أضف القيد</button></section>';
  }

  function splitForm(app) {
    if (!app.dailyState.showSplit) return '';
    var preview = app.dailyState.splitDraft.shares.map(function (share) { return '<span class="chip mute">' + App.esc(share.name) + ' · ' + money(share.amountMinor) + '</span>'; }).join(" ");
    return '<section class="card" id="daily-split"><div class="eyebrow">القسمة · أكبر باقٍ بالترتيب</div><h2>قسمة فاتورة</h2>' +
      '<div class="form-grid"><label>الإجمالي<input id="daily-split-total" value="480.01" inputmode="decimal"></label>' +
      '<label>الأسماء<input id="daily-split-names" value="أنت، سالم، نورة، هند، منال، عبير"></label><label>من دفع<input id="daily-split-payer" value="أنت"></label></div>' +
      '<div class="chips">' + preview + '</div><button class="primary" onclick="AhdApp.dailySplit()">طبّق القسمة</button></section>';
  }

  function render(app) {
    var list = Q.qaidList(app.dailyState.ledger, "all").all;
    var hint = Q.netHint(app.dailyState.ledger);
    return '<main class="screen"><header class="screen-head"><div><div class="eyebrow">عهد اليومي</div><h1>اليومي</h1><p>استخدم عهد وحدك أولًا؛ وثّق، قسّم، ثم اختم عندما تحتاج.</p></div></header>' +
      (app.dailyState.flash ? '<div class="flash"><span>' + App.esc(app.dailyState.flash) + '</span><button onclick="AhdApp.dailyDismiss()">×</button></div>' : '') +
      quickAdd() + '<div class="net ' + (hint.balanced ? "bal" : "") + '">' + App.esc(hint.textAr) + (hint.balanced ? ' — لا حوالة' : '') + '</div>' +
      '<section><div class="shead"><span class="slabel">قيودي الخاصة</span><span class="scount">' + App.digit(list.length) + '</span></div>' + list.map(rowHTML).join("") + '</section>' +
      splitForm(app) + (app.dailyState.shareText ? '<section class="card"><div class="eyebrow">نص جاهز للمشاركة</div><pre class="rem-card">' + App.esc(app.dailyState.shareText) + '</pre></section>' : '') + '</main>';
  }

  App.registerScreen({ key: "daily", label: "اليومي", icon: "⚡", render: render });
})();
