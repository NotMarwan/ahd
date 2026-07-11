/* ============================================================================
   app.js — the «عهد» app shell (parallel publishable surface). A tiny screen
   registry + router over the parity-proven engine (window.AHD) and the pure
   feature modules. Mirrors the demo's proven pattern: screens render innerHTML
   strings; actions are AhdApp.* methods invoked from inline onclick.

   Determinism: a FIXED AS_OF (no Date.now); integer halalas via the engine.
   The demo (demo/index.html) is never touched — this is all new files.
============================================================================ */
(function () {
  "use strict";
  var AHD = (typeof window !== "undefined" ? window.AHD : null);
  var Daftari = (typeof window !== "undefined" ? window.Daftari : null);
  var OpenLoan = (typeof window !== "undefined" ? window.OpenLoan : null);
  var CircleAdv = (typeof window !== "undefined" ? window.CircleAdv : null);
  var CreateAhd = (typeof window !== "undefined" ? window.CreateAhd : null);
  var Settlement = (typeof window !== "undefined" ? window.Settlement : null);
  var CircleDash = (typeof window !== "undefined" ? window.CircleDash : null);
  var Timeline = (typeof window !== "undefined" ? window.Timeline : null);
  var Proof = (typeof window !== "undefined" ? window.Proof : null);
  var Dispute = (typeof window !== "undefined" ? window.Dispute : null);
  var Settings = (typeof window !== "undefined" ? window.Settings : null);
  var RequestAhd = (typeof window !== "undefined" ? window.RequestAhd : null);
  var Borrower = (typeof window !== "undefined" ? window.Borrower : null);
  var CovenantLog = (typeof window !== "undefined" ? window.CovenantLog : null);
  var Standing = (typeof window !== "undefined" ? window.Standing : null);

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function flashHTML(msg, dismissCall) {
    return msg ? '<div class="flash" onclick="AhdApp.' + dismissCall + '()">' + esc(msg) + ' <span class="x">×</span></div>' : "";
  }
  var ev = AHD ? AHD.ev : function (t, x) { return Object.assign({ type: t }, x || {}); };
  var sealedActive = function () {
    return [ev("AHD_DRAFTED", { installments: 1 }), ev("LENDER_SIGNED"), ev("COUNTERPARTY_SIGNED"), ev("RECORD_SEALED"), ev("ACTIVATED")];
  };
  var rec = function (id, lender, borrower, amountSAR, dueISO, extra) {
    return { id: id, lender: lender, borrower: borrower, amountSAR: amountSAR,
      installments: [{ dueISO: dueISO, amountSAR: amountSAR }],
      events: sealedActive().concat(extra || []) };
  };

  /* Naif's real ledger (from 12_Consumer/Agent-3/journey.md) — deterministic seed */
  function seedRecords() {
    return [
      rec("R-CAFE", "نايف", "مقهى الحي", 2500, "2026-06-01"),                 // overdue 20d
      rec("R-SULTAN", "نايف", "سلطان", 1200, "2026-05-15"),                  // overdue 37d
      rec("R-ABD", "نايف", "عبدالله", 600, "2026-07-01"),                    // on-track
      rec("R-KEPT", "نايف", "ريم", 800, "2026-04-01", [ev("ALL_SETTLED")]),  // ذمّة محفوظة
      rec("R-DISP", "نايف", "ماجد", 900, "2026-05-20", [ev("DISPUTE_RAISED")]), // محلّ خلاف
      rec("R-FAHD", "فهد", "نايف", 3000, "2026-07-10")                       // عليّ (Naif owes)
    ];
  }

  var AhdApp = {
    engine: AHD, D: Daftari,
    AS_OF: (Daftari && Daftari.AS_OF_DEFAULT) || "2026-06-21",
    viewer: "نايف",
    screens: {}, order: [], current: null,
    /* product-flow nav order (not feature build order). Only PRIMARY screens get a nav
       pill; contextual screens (e.g. proof-pack, dispute) are registered + reachable via
       go() but intentionally absent here, so the nav stays clean as features grow. */
    NAV_ORDER: ["home", "create", "daftari", "timeline", "open", "circle", "circle-adv", "settle"],
    records: seedRecords(),
    reminderHistory: {},
    /* Naif's OWN kept-history → his own trust band (own mirror; never shared) */
    selfHistory: [{ t: "2025-08", kept: true }, { t: "2025-10", kept: true }, { t: "2025-12", kept: true },
      { t: "2026-01", kept: true }, { t: "2026-03", kept: true }, { t: "2026-05", kept: true }],
    daftariState: { tab: "me", filter: "all", sheetId: null, composeId: null, composeTier: 1, flash: null },
    OpenLoan: OpenLoan,
    openLoan: OpenLoan ? OpenLoan.makeOpenLoan({ id: "OPEN-MUNIRA-MAJID", lender: "منيرة", borrower: "ماجد", amountSAR: 20000, purpose: "لتجهيز عربة القهوة" }) : null,
    openLoanState: { sheet: false, tamper: false, flash: null },
    CircleAdv: CircleAdv,
    advCircle: { id: "CIR-STD-MALQA", organizer: "سعود", name: "شقة الملقا" },
    advShare: { name: "تركي", amountMinor: (AHD ? AHD.toMinor(1500) : 150000) },
    circleAdvState: { graduated: null, flash: null },
    CreateAhd: CreateAhd,
    createDraft: CreateAhd ? CreateAhd.makeDraft({ id: "NEW-AHD-1", lender: "أنت", borrower: "سلطان", amountSAR: 1200, months: 3 }) : null,
    createState: { extra: "", sealed: null, tamper: false, flash: null },
    Settlement: Settlement,
    CircleDash: CircleDash,
    circleState: { reminder: false },
    /* «أثر عهد» drill-down: which size-bucket is expanded (number|null) */
    ImpactDrill: (typeof window !== "undefined" ? window.ImpactDrill : null),
    impactState: { bucket: null },
    Timeline: Timeline,
    timelineState: { view: "story", focus: null },
    Proof: Proof,
    proofState: { recordId: null, tamper: false, flash: null },
    Dispute: Dispute,
    disputeState: { recordId: null, flash: null },
    Settings: Settings,
    digitMode: "western",   // D-2: user choice; default engine-consistent (western)
    privacy: false,         // «إخفاء المبالغ» — display-only mask; engine bytes/seals unaffected
    RequestAhd: RequestAhd,
    request: RequestAhd ? RequestAhd.makeRequest({ id: "REQ-NAIF", borrower: "نايف", lender: "خالد", amountSAR: 1500, months: 3, purpose: "تجهيز عربة القهوة" }) : null,
    requestState: { sent: false, accepted: null, flash: null },
    /* ما عليّ (borrower home) — the debtor's mirror of دفتري; reads app.records/viewer */
    Borrower: Borrower,
    borrowerState: { flash: null },
    /* سِجلّ المعروف (sealed good-faith trail) — CONTEXTUAL; seeded on Naif's café عهد */
    CovenantLog: CovenantLog,
    covenantState: { recordId: "R-CAFE", tamper: false, flash: null },
    /* سُلفة بالمعروف (standing qard) — a recurring two-party قرض حسن (Musaned wedge) */
    Standing: Standing,
    standing: Standing ? Standing.makeStanding({ id: "STD-ABUFAHD-RAMESH", lender: "أبو فهد", borrower: "راميش", perCycleSAR: 800, cycleKeys: ["2026-01", "2026-02", "2026-03", "2026-04"], purpose: "سُلفةٌ شهريّةٌ بالمعروف على الراتب", timestamp: "2026-01-01T09:00:00+03:00" }) : null,
    standingState: { tamper: false, repaid: ["2026-01", "2026-02"], flash: null },

    esc: esc,
    flashHTML: flashHTML,
    /* toggle-aware number formatter: golden engine.fmt + an optional display map.
       The engine bytes never change — only the rendered glyphs (D-2). */
    fmtN: function (n) {
      var s = this.engine.fmt(n);
      s = (this.Settings && this.digitMode === "arabic") ? this.Settings.toArabicDigits(s) : s;
      return (this.Settings && this.privacy) ? this.Settings.maskAmount(s, true) : s;
    },
    /* digit map for any already-built string (dates, counts) — display-only */
    digit: function (s) {
      return (this.Settings && this.digitMode === "arabic") ? this.Settings.toArabicDigits(s) : String(s == null ? "" : s);
    },
    registerScreen: function (def) { if (!this.screens[def.key]) this.order.push(def.key); this.screens[def.key] = def; },
    recordById: function (id) { for (var i = 0; i < this.records.length; i++) if (this.records[i].id === id) return this.records[i]; return null; },

    navHTML: function () {
      var self = this;
      return '<nav class="nav" role="navigation" aria-label="التنقّل بين الشاشات">' + this.NAV_ORDER.filter(function (k) { return self.screens[k]; }).map(function (k) {
        var s = self.screens[k], on = (k === self.current);
        return '<button class="navbtn' + (on ? " on" : "") + '"' + (on ? ' aria-current="page"' : '') + ' onclick="AhdApp.go(\'' + k + '\')">' +
          '<span class="navico" aria-hidden="true">' + (s.icon || "") + "</span>" + esc(s.label) + "</button>";
      }).join("") + "</nav>";
    },

    go: function (key) {
      var s = this.screens[key];
      if (!s) return (typeof document !== "undefined" && document.getElementById("app") ? document.getElementById("app").innerHTML : "");
      this.current = key;
      var body = "";
      try { body = s.render(this); } catch (e) { body = '<div class="fallback">تعذّر العرض مؤقّتًا — أعد المحاولة.</div>'; }
      var html = this.navHTML() + '<main class="screen">' + body + "</main>";
      if (typeof document !== "undefined") { var m = document.getElementById("app"); if (m) m.innerHTML = html; }
      return html;
    },
    rerender: function () { return this.go(this.current); },

    boot: function () {
      this.current = (this.NAV_ORDER.length && this.screens[this.NAV_ORDER[0]]) ? this.NAV_ORDER[0] : (this.order[0] || null);
      if (this.current) return this.go(this.current);
      return "";
    },

    /* ---- دفتري actions (mutate deterministic state, then re-render) ---- */
    daftariTab: function (which) { if (which === "me" || which === "on") this.daftariState.tab = which; this.daftariState.filter = "all"; this.daftariState.sheetId = null; this.daftariState.composeId = null; return this.rerender(); },
    daftariFilter: function (f) { this.daftariState.filter = f || "all"; this.daftariState.sheetId = null; this.daftariState.composeId = null; return this.rerender(); },
    daftariOpenSheet: function (id) { if (this.recordById(id)) { this.daftariState.sheetId = id; this.daftariState.composeId = null; } return this.rerender(); },
    daftariCloseSheet: function () { this.daftariState.sheetId = null; return this.rerender(); },
    daftariCompose: function (id) {
      var r = this.recordById(id); if (!r) return this.rerender();
      var row = this.D.rowFor(r, this.viewer, this.engine, this.AS_OF);
      var gate = this.D.canSendReminder(row, this.reminderHistory[id] || [], this.AS_OF);
      this.daftariState.sheetId = null;
      if (gate.allowed) { this.daftariState.composeId = id; this.daftariState.composeTier = gate.nextTier; }
      else { this.daftariState.composeId = null; this.daftariState.flash = "لا تذكير الآن — " + this._reasonAr(gate.reason); }
      return this.rerender();
    },
    daftariSend: function (id) {
      var r = this.recordById(id); if (!r) return this.rerender();
      (this.reminderHistory[id] = this.reminderHistory[id] || []).push({ tier: this.daftariState.composeTier, atISO: this.AS_OF });
      this.daftariState.composeId = null;
      this.daftariState.flash = this.D.SENDER_RECEIPT;
      return this.rerender();
    },
    debtorSettle: function (id) { var r = this.recordById(id); if (r) { r.events = r.events.concat(ev("ALL_SETTLED")); this.daftariState.composeId = null; this.daftariState.flash = "سُدِّد العهد — ذمّة محفوظة 🤍"; } return this.rerender(); },
    debtorGrace: function (id) { var r = this.recordById(id); if (r) { r.events = r.events.concat(ev("GRACE_GRANTED")); this.daftariState.composeId = null; this.daftariState.flash = "أُعيدت الجدولة بالمعروف — بلا أيّ زيادة (٢٨٠)."; } return this.rerender(); },
    daftariForgive: function (id) { var r = this.recordById(id); if (r) { r.events = r.events.concat(ev("FORGIVEN")); this.daftariState.sheetId = null; this.daftariState.flash = "أُبرئ ما تبقّى صدقةً ﴿وأن تصدّقوا خيرٌ لكم﴾."; } return this.rerender(); },
    daftariDismiss: function () { this.daftariState.flash = null; return this.rerender(); },

    /* ---- حافظة الإثبات (proof-pack) — a CONTEXTUAL screen reached from دفتري ---- */
    openProof: function (id) { if (this.recordById(id)) { this.proofState = { recordId: id, tamper: false, flash: null, fromDispute: false }; this.daftariState.sheetId = null; return this.go("proof"); } return this.rerender(); },
    /* opened from محلّ خلاف → the proof is framed as the NEUTRAL EXHIBIT; back goes to the dispute */
    openProofAsExhibit: function (id) { if (this.recordById(id)) { this.proofState = { recordId: id, tamper: false, flash: null, fromDispute: true }; return this.go("proof"); } return this.rerender(); },
    proofTamperToggle: function () { this.proofState.tamper = !this.proofState.tamper; return this.rerender(); },
    proofExport: function () { this.proofState.flash = "جُهّزت الوثيقة كملفٍ موقّع — مهيّأةٌ للمشاركة دليلًا عند الحاجة."; return this.rerender(); },
    proofBack: function () { if (this.proofState && this.proofState.fromDispute) { this.proofState.fromDispute = false; return this.go("dispute"); } return this.go("daftari"); },
    proofDismiss: function () { this.proofState.flash = null; return this.rerender(); },

    /* ---- سِجلّ الشهادة (the witness timeline) — the connective tissue ---- */
    setTimelineView: function (v) { this.timelineState.view = (v === "flat") ? "flat" : "story"; return this.rerender(); },
    openTimelineFor: function (id) { if (this.recordById(id)) { this.timelineState.focus = id; this.timelineState.view = "story"; this.daftariState.sheetId = null; return this.go("timeline"); } return this.rerender(); },
    timelineClearFocus: function () { this.timelineState.focus = null; return this.rerender(); },
    timelineToDaftari: function (id) {
      var r = this.recordById(id);
      if (r) { this.daftariState.tab = (r.lender === this.viewer) ? "me" : "on"; this.daftariState.filter = "all"; this.daftariState.sheetId = null; return this.go("daftari"); }
      return this.rerender();
    },

    /* ---- محلّ خلاف (dispute pause) — a CONTEXTUAL screen; bank pauses, never judges ---- */
    openDispute: function (id) { if (this.recordById(id)) { this.disputeState = { recordId: id, flash: null }; this.daftariState.sheetId = null; return this.go("dispute"); } return this.rerender(); },
    disputeBack: function () { return this.go("daftari"); },
    disputeGrace: function (id) { var r = this.recordById(id); if (r) { r.events = r.events.concat(ev("GRACE_GRANTED")); this.daftariState.flash = "اقتُرحت إعادة الجدولة بالمعروف — صلحًا، بلا أيّ زيادة (٢٨٠)."; } return this.go("daftari"); },
    disputeForgive: function (id) { var r = this.recordById(id); if (r) { r.events = r.events.concat(ev("FORGIVEN")); this.daftariState.flash = "أُبرئ ما تبقّى صدقةً ﴿وأن تصدّقوا خيرٌ لكم﴾."; } return this.go("daftari"); },
    disputeDismiss: function () { this.disputeState.flash = null; return this.rerender(); },

    /* ---- الإعدادات (settings) — the Arabic-Indic digit choice (D-2), app-wide ---- */
    setDigitMode: function (mode) { this.digitMode = (mode === "arabic") ? "arabic" : "western"; return this.rerender(); },
    setPrivacy: function (on) { this.privacy = !!on; return this.rerender(); },

    /* ---- اطلب عهدًا (borrower-initiated request) — a CONTEXTUAL screen from home ---- */
    requestSend: function () {
      if (this.request && this.RequestAhd && this.RequestAhd.requestRibaCheck(this.request, this.engine).verdict === "clean") this.requestState.sent = true;
      return this.rerender();
    },
    requestAccept: function () {
      if (this.request && this.RequestAhd) {
        var r = this.RequestAhd.acceptToRecord(this.request, this.engine);
        if (!this.recordById(r.id)) this.records.push(r);
        this.requestState.accepted = r;
        this.requestState.flash = "تمّ بحمدِ الله — عهدُك مكتوبٌ ومحفوظ في دفترك.";
        this.daftariState.tab = "on";
      }
      return this.rerender();
    },
    requestDismiss: function () { this.requestState.flash = null; return this.rerender(); },

    /* ---- ما عليّ (borrower home) — borrower-INVOKABLE grace + pay-what-eased (2:280) ---- */
    borrowerPay: function (id, amountSAR) {
      var r = this.recordById(id), amt = Number(amountSAR);
      if (r && this.Borrower && isFinite(amt) && amt > 0) {
        r.events = r.events.concat(this.Borrower.payWhatEased(r, amt, this.engine));
        this.borrowerState.flash = "سدّدتَ ما تيسّر — المتبقّي ينقص، بلا أيّ زيادة 🤍";
      }
      return this.rerender();
    },
    borrowerAskGrace: function (id, reasonKey) {
      var r = this.recordById(id);
      if (r && this.Borrower) {
        r.events = r.events.concat(this.Borrower.graceRequest(r, reasonKey, this.AS_OF));
        this.borrowerState.flash = "طلبتَ نظرةً إلى ميسرةٍ بكرامة — بلّغنا المُقرِض، والأمر إليه ﴿فنظرةٌ إلى ميسرة﴾.";
      }
      return this.rerender();
    },
    borrowerDismiss: function () { this.borrowerState.flash = null; return this.rerender(); },

    /* ---- سِجلّ المعروف (covenant trail) — CONTEXTUAL (from دفتري / الخلاف); never a score ---- */
    openCovenant: function (id) { if (this.recordById(id)) { this.covenantState = { recordId: id, tamper: false, flash: null }; this.daftariState.sheetId = null; return this.go("maroof"); } return this.rerender(); },
    covenantTamperToggle: function () { this.covenantState.tamper = !this.covenantState.tamper; return this.rerender(); },
    covenantExport: function () { this.covenantState.flash = "جُهّزت البيّنة المحايدة — الطرفان وبصمة الشروط والخطوات المختومة وحالتها فقط، مهيّأةٌ دليلًا عند الحاجة."; return this.rerender(); },
    covenantBack: function () { return this.go("daftari"); },
    covenantDismiss: function () { this.covenantState.flash = null; return this.rerender(); },

    /* ---- سُلفة بالمعروف (standing qard) — recurring two-party قرض حسن ---- */
    standingTamperToggle: function () { this.standingState.tamper = !this.standingState.tamper; return this.rerender(); },
    standingDismiss: function () { this.standingState.flash = null; return this.rerender(); },

    /* ---- القرض المفتوح actions (integer halalas; bad input is a clean no-op) ---- */
    openLoanPay: function (amountSAR) {
      var amt = Number(amountSAR); if (!isFinite(amt) || amt <= 0 || !this.openLoan || !this.OpenLoan) return this.rerender();
      this.openLoan.events = this.openLoan.events.concat(this.OpenLoan.payEvent(this.openLoan, amt, this.engine));
      this.openLoanState.flash = "سُدّدت دفعةٌ عبر سريع — المتبقّي ينقص، بلا أيّ زيادة."; return this.rerender();
    },
    openLoanForgiveSheet: function () { this.openLoanState.sheet = true; return this.rerender(); },
    openLoanCloseSheet: function () { this.openLoanState.sheet = false; return this.rerender(); },
    openLoanForgiveFull: function () {
      if (this.openLoan && this.OpenLoan) { this.openLoan.events = this.openLoan.events.concat(this.OpenLoan.forgiveEvent(this.openLoan, null, this.engine)); this.openLoanState.sheet = false; this.openLoanState.flash = "أبرأتِ ما تبقّى صدقةً 🤍 ﴿وأن تصدّقوا خيرٌ لكم﴾."; }
      return this.rerender();
    },
    openLoanForgivePartial: function (amountSAR) {
      var amt = Number(amountSAR); if (!isFinite(amt) || amt <= 0 || !this.openLoan || !this.OpenLoan) return this.rerender();
      this.openLoan.events = this.openLoan.events.concat(this.OpenLoan.forgiveEvent(this.openLoan, amt, this.engine));
      this.openLoanState.sheet = false; this.openLoanState.flash = "أُبرئ جزءٌ صدقةً — والباقي يبقى قرضًا مفتوحًا."; return this.rerender();
    },
    openLoanTamperToggle: function () { this.openLoanState.tamper = !this.openLoanState.tamper; return this.rerender(); },
    openLoanDismiss: function () { this.openLoanState.flash = null; return this.rerender(); },

    /* ---- advanced Circle actions ---- */
    circleGraduate: function () {
      if (this.CircleAdv && this.OpenLoan) { this.circleAdvState.graduated = this.CircleAdv.graduateShare(this.advShare, this.advCircle, this.engine, this.OpenLoan); this.circleAdvState.flash = "وُثِّقت كعهدٍ مفتوح — حُفِظ الحقّ بكرامة، بلا أيّ زيادة."; }
      return this.rerender();
    },
    circleAdvDismiss: function () { this.circleAdvState.flash = null; return this.rerender(); },
    /* graduation → القرض المفتوح: load the new عهد into the (deepened) open-loan view */
    circleGraduateView: function () {
      var g = this.circleAdvState.graduated;
      if (g && g.loan) { this.openLoan = g.loan; this.openLoanState = { sheet: false, tamper: false, flash: null }; return this.go("open"); }
      return this.rerender();
    },

    /* ---- الدائرة (treasurer dashboard) — the group reminder that names no one ---- */
    circleReminderToggle: function () { this.circleState.reminder = !this.circleState.reminder; return this.rerender(); },

    /* ---- أثر عهد: expand/collapse one k-anonymous size-bucket ---- */
    impactBucket: function (size) {
      var s = Number(size);
      this.impactState.bucket = (this.impactState.bucket === s) ? null : s;
      return this.rerender();
    },

    /* ---- create-عهد actions (the riba linter gates the seal) ---- */
    createInjectRiba: function () { this.createState.extra = "وعليه غرامةُ تأخيرٍ ٢٪ شهريًّا."; this.createState.sealed = null; return this.rerender(); },
    /* a DISGUISED clause (synonyms + payment-for-time) the naive 4-rule linter misses
       but the deepened layer catches — proves «hard to fool» live in the demo. */
    createInjectSneaky: function () { this.createState.extra = "على أن يردّ المبلغ ومعه عائدٌ يسير، ويُمنح المُقرض مقابلًا عن الزمن مقابل المهلة."; this.createState.sealed = null; return this.rerender(); },
    createClearRiba: function () { this.createState.extra = ""; return this.rerender(); },
    createSeal: function () {
      if (this.CreateAhd && this.createDraft) {
        var terms = this.CreateAhd.draftTermsAr(this.createDraft, this.engine) + (this.createState.extra ? " " + this.createState.extra : "");
        if (this.CreateAhd.ribaCheck(terms, this.engine).verdict === "clean") { this.createState.sealed = this.CreateAhd.createSeal(this.createDraft, this.engine); this.createState.flash = "خُتم العهد — وثيقةٌ مشهودة 🤍"; }
        else { this.createState.flash = "لا يُختَم — أزِل الشرط المخالف أولًا."; }
      }
      return this.rerender();
    },
    createAddToDaftari: function () {
      if (this.CreateAhd && this.createDraft) {
        var r = this.CreateAhd.toDaftariRecord(this.createDraft, this.engine);
        if (!this.recordById(r.id)) this.records.push(r);
        this.daftariState.flash = "أُضيفت إلى دفترك 🤍"; this.daftariState.tab = "me"; return this.go("daftari");
      }
      return this.rerender();
    },
    createTamperToggle: function () { this.createState.tamper = !this.createState.tamper; return this.rerender(); },
    createDismiss: function () { this.createState.flash = null; return this.rerender(); },

    _reasonAr: function (reason) {
      return { cooldown: "مهلةٌ بين التذكيرين", ladder_exhausted: "اكتفى عهد بالتذكير، الأمر إليك الآن", not_due: "لم يحِن موعده بعد", disputed_paused: "محلّ خلاف — عهد لا يحكم", closed: "العهد مُغلق" }[reason] || "";
    }
  };

  if (typeof window !== "undefined") window.AhdApp = AhdApp;
  if (typeof document !== "undefined" && document.addEventListener)
    document.addEventListener("DOMContentLoaded", function () { try { AhdApp.boot(); } catch (e) {} });
})();
