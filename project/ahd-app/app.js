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
    daftariState: { tab: "me", sheetId: null, composeId: null, composeTier: 1, flash: null },

    esc: esc,
    registerScreen: function (def) { if (!this.screens[def.key]) this.order.push(def.key); this.screens[def.key] = def; },
    recordById: function (id) { for (var i = 0; i < this.records.length; i++) if (this.records[i].id === id) return this.records[i]; return null; },

    navHTML: function () {
      var self = this;
      return '<nav class="nav">' + this.order.map(function (k) {
        var s = self.screens[k], on = (k === self.current) ? " on" : "";
        return '<button class="navbtn' + on + '" onclick="AhdApp.go(\'' + k + '\')">' +
          '<span class="navico">' + (s.icon || "") + "</span>" + esc(s.label) + "</button>";
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

    _reasonAr: function (reason) {
      return { cooldown: "مهلةٌ بين التذكيرين", ladder_exhausted: "اكتفى عهد بالتذكير، الأمر إليك الآن", not_due: "لم يحِن موعده بعد", disputed_paused: "محلّ خلاف — عهد لا يحكم", closed: "العهد مُغلق" }[reason] || "";
    }
  };

  if (typeof window !== "undefined") window.AhdApp = AhdApp;
  if (typeof document !== "undefined" && document.addEventListener)
    document.addEventListener("DOMContentLoaded", function () { try { AhdApp.boot(); } catch (e) {} });
})();
