/* ============================================================================
   app.js — the «عهد» app shell (parallel publishable surface). A tiny screen
   registry + router over the parity-proven engine (window.AHD) and the pure
   feature modules. Mirrors the demo's proven pattern: screens render innerHTML
   strings; actions are AhdApp.* methods invoked from inline onclick.

   Determinism: a FIXED AS_OF (no Date.now); integer halalas via the engine.
   The demo (ahd-demo/index.html) is never touched — this is all new files.
============================================================================ */
(function () {
  "use strict";
  var AHD = (typeof window !== "undefined" ? window.AHD : null);
  var Daftari = (typeof window !== "undefined" ? window.Daftari : null);
  var OpenLoan = (typeof window !== "undefined" ? window.OpenLoan : null);
  var CircleAdv = (typeof window !== "undefined" ? window.CircleAdv : null);
  var CreateAhd = (typeof window !== "undefined" ? window.CreateAhd : null);
  var Settlement = (typeof window !== "undefined" ? window.Settlement : null);

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
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
    records: seedRecords(),
    reminderHistory: {},
    /* Naif's OWN kept-history → his own trust band (own mirror; never shared) */
    selfHistory: [{ t: "2025-08", kept: true }, { t: "2025-10", kept: true }, { t: "2025-12", kept: true },
      { t: "2026-01", kept: true }, { t: "2026-03", kept: true }, { t: "2026-05", kept: true }],
    daftariState: { tab: "me", sheetId: null, composeId: null, composeTier: 1, flash: null },
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

    esc: esc,
    registerScreen: function (def) { if (!this.screens[def.key]) this.order.push(def.key); this.screens[def.key] = def; },
    recordById: function (id) { for (var i = 0; i < this.records.length; i++) if (this.records[i].id === id) return this.records[i]; return null; },

    navHTML: function () {
      var self = this;
      return '<nav class="nav" role="navigation" aria-label="التنقّل بين الشاشات">' + this.order.map(function (k) {
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
      this.current = this.order.length ? this.order[0] : null;
      if (this.current) return this.go(this.current);
      return "";
    },

    /* ---- دفتري actions (mutate deterministic state, then re-render) ---- */
    daftariTab: function (which) { if (which === "me" || which === "on") this.daftariState.tab = which; this.daftariState.sheetId = null; this.daftariState.composeId = null; return this.rerender(); },
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
    daftariExport: function (id) { if (this.recordById(id)) { this.daftariState.sheetId = null; this.daftariState.flash = "تصدير الوثيقة المختومة — مهيّأةٌ كدليلٍ إلكتروني، إن احتجت."; } return this.rerender(); },
    daftariDismiss: function () { this.daftariState.flash = null; return this.rerender(); },

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

    /* ---- create-عهد actions (the riba linter gates the seal) ---- */
    createInjectRiba: function () { this.createState.extra = "وعليه غرامةُ تأخيرٍ ٢٪ شهريًّا."; this.createState.sealed = null; return this.rerender(); },
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
