/* ============================================================================
   features/timeline.js — «سِجلّ الشهادة» (the witness timeline) pure logic.
   The bank's role is to WITNESS; this turns the append-only event logs of all
   the viewer's عهود into one human feed of the *significant* witnessed moments:
   sealed · a bank-sent gentle reminder · grace (٢٨٠) · kept (ذمّة محفوظة) ·
   إبراء (صدقة) · محلّ خلاف (neutral — «يشهد ولا يحكم»).

   On-spine: late = AMBER never red; disputes are NEUTRAL (shown, never judged);
   no score, no %. Deterministic: ordered by the عهد's due date (a real field) +
   lifecycle stage — NO Date.now / new Date / Intl. Integer halalas via the engine.

   Dual module: Node `require(...)` and browser `window.Timeline` (engine via DI arg).
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Timeline = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* significant witnessed events → how they read in the feed (others are noise) */
  var EV = {
    RECORD_SEALED: { kind: "sealed", tone: "sealed", icon: "🔏", ar: "وُثِّق وخُتم العهد — شهادةٌ محفوظة", stage: 0 },
    GRACE_GRANTED: { kind: "mercy", tone: "mercy", icon: "🕊️", ar: "نظرة إلى ميسرة — أُعيدت الجدولة بالمعروف، بلا أيّ زيادة (٢٨٠)", stage: 2 },
    DISPUTE_RAISED: { kind: "neutral", tone: "neutral", icon: "⚖️", ar: "محلّ خلاف — عهدٌ يشهد ولا يحكم", stage: 2 },
    ALL_SETTLED: { kind: "kept", tone: "kept", icon: "🤍", ar: "وُفِّي به — ذمّة محفوظة", stage: 3 },
    SETTLEMENT_INITIATED: { kind: "settle", tone: "sealed", icon: "🔗", ar: "بدأت مقاصّةٌ بالتراضي — أقلّ التحويلات تُصفّي الجميع", stage: 2 },
    SETTLEMENT_SETTLED: { kind: "kept", tone: "kept", icon: "🤍", ar: "سُوِّي بالمقاصّة — ذمّة محفوظة", stage: 3 },
    PARTIAL: { kind: "partial", tone: "progress", icon: "🪙", ar: "سدادٌ جزئيّ — المتبقّي ينقص، بلا أيّ زيادة", stage: 1 },
    FORGIVEN: { kind: "mercy", tone: "mercy", icon: "🤲", ar: "أُبرئ ما تبقّى صدقةً ﴿وأن تصدّقوا خيرٌ لكم﴾", stage: 3 }
  };
  var REMINDER = { kind: "reminder", tone: "amber", icon: "📩", ar: "أرسل عهدٌ تذكيرًا لطيفًا بالنيابة عنك", stage: 1 };

  function direction(r, viewer) {
    if (r.lender === viewer) return { who: "لـ " + r.borrower, party: r.borrower, dir: "out" };
    if (r.borrower === viewer) return { who: "من " + r.lender, party: r.lender, dir: "in" };
    return { who: r.lender + " ← " + r.borrower, party: r.borrower, dir: "other" };
  }

  function dueAr(dueISO, engine) {
    if (!dueISO || !engine || !engine.AR_MONTHS) return "";
    var p = String(dueISO).split("-");
    var mi = parseInt(p[1], 10) - 1;
    if (!(mi >= 0 && mi < 12)) return "";
    return "أجل " + engine.AR_MONTHS[mi] + " " + p[0];
  }

  /* one feed of significant entries across all the viewer's عهود */
  function buildTimeline(records, reminderHistory, engine, viewer, asOf) {
    var e = engine, hist = reminderHistory || {}, out = [];
    (records || []).forEach(function (r) {
      var d = direction(r, viewer);
      var base = {
        recordId: r.id, who: d.who, party: d.party, dir: d.dir,
        amountSAR: r.amountSAR, amountMinor: e.toMinor(r.amountSAR),
        dueISO: (r.installments && r.installments[0] && r.installments[0].dueISO) || r.dueISO || "",
        borrower: r.borrower, lender: r.lender
      };
      base.dueAr = dueAr(base.dueISO, e);
      (r.events || []).forEach(function (evt) {
        var v = EV[evt.type];
        if (v) out.push(Object.assign({}, base, { kind: v.kind, tone: v.tone, icon: v.icon, ar: v.ar, stage: v.stage }));
      });
      (hist[r.id] || []).forEach(function () {
        out.push(Object.assign({}, base, { kind: REMINDER.kind, tone: REMINDER.tone, icon: REMINDER.icon, ar: REMINDER.ar, stage: REMINDER.stage }));
      });
    });
    /* deterministic: عهد due latest first, then by id, then latest lifecycle stage first */
    out.sort(function (a, b) {
      if (a.dueISO !== b.dueISO) return a.dueISO < b.dueISO ? 1 : -1;
      if (a.recordId !== b.recordId) return a.recordId < b.recordId ? -1 : 1;
      return b.stage - a.stage;
    });
    return out;
  }

  function timelineCounts(entries) {
    var c = { sealed: 0, kept: 0, mercy: 0, neutral: 0, amber: 0 };
    (entries || []).forEach(function (x) { if (c[x.tone] != null) c[x.tone]++; });
    return c;
  }

  /* ---- the connective tissue: one witnessed STORY per عهد ----
     Fold the flat feed into per-عهد groups (feed order preserved → due-date order),
     each carrying the عهد header, its entries (latest stage first), and the terminal
     outcome. This is the witnessed narrative of each relationship. */
  function groupByAhd(entries) {
    var order = [], byId = {};
    (entries || []).forEach(function (x) {
      var g = byId[x.recordId];
      if (!g) {
        g = byId[x.recordId] = {
          recordId: x.recordId, who: x.who, party: x.party, dir: x.dir,
          amountSAR: x.amountSAR, amountMinor: x.amountMinor, dueISO: x.dueISO, dueAr: x.dueAr,
          lender: x.lender, borrower: x.borrower, entries: [], disputed: false, kept: false, outcome: null
        };
        order.push(x.recordId);
      }
      g.entries.push(x);
      if (x.kind === "neutral") g.disputed = true;
      if (x.kind === "kept") g.kept = true;
    });
    return order.map(function (id) {
      var g = byId[id];
      g.outcome = g.entries.reduce(function (best, e) { return (!best || e.stage > best.stage) ? e : best; }, null);
      return g;
    });
  }

  /* the connective LINKS each story exposes — proof always, dispute only if disputed,
     and a way back to the دفتر. (The screen wires these to AhdApp.openProof/openDispute/…) */
  function ahdActions(group) {
    var a = [{ key: "proof", label: "وثيقة الإثبات", icon: "🔏" }];
    if (group && group.disputed) a.push({ key: "dispute", label: "تفاصيل الخلاف", icon: "⚖️" });
    a.push({ key: "record", label: "في الدفتر", icon: "📔" });
    return a;
  }

  return { buildTimeline: buildTimeline, timelineCounts: timelineCounts, groupByAhd: groupByAhd, ahdActions: ahdActions, EV: EV, REMINDER: REMINDER };
});
