/* ============================================================================
   features/daftari.js — «دفتري» creditor-home pure logic (Agent-3 spec).
   An INDEX over عهود the viewer is party to. Reuses the engine (DI) for
   fold/statusLabel/toMinor; invents no new states. Deterministic: fixed AS_OF,
   day math via a pure civil-days algorithm — NO Date.now / new Date / Intl.

   Dual module: Node `require(...)` and browser `window.Daftari` (uses window.AHD).
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Daftari = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var AS_OF_DEFAULT = "2026-06-21";   // fixed demo "today" — determinism (matches TRUST_CFG style)
  var COOLDOWN_DAYS = 7;              // min days between reminder tiers (protects the debtor)
  var CLOSED = { KEPT: 1, FORGIVEN: 1, VOID: 1 };

  /* ---- pure civil-days math (Howard Hinnant's algorithm) — no Date object ---- */
  function daysFromCivil(y, m, d) {
    y = m <= 2 ? y - 1 : y;
    var era = Math.floor((y >= 0 ? y : y - 399) / 400);
    var yoe = y - era * 400;
    var doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1;
    var doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
    return era * 146097 + doe - 719468;
  }
  function parseISO(iso) { var p = String(iso).split("-"); return { y: +p[0], m: +p[1], d: +p[2] }; }
  function dayNum(iso) { var t = parseISO(iso); return daysFromCivil(t.y, t.m, t.d); }
  function daysBetween(later, earlier) { return dayNum(later) - dayNum(earlier); }

  /* ---- integer grouping identical to engine.fmt (display only, no value math) ---- */
  function group(n) { return String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function arDueLabel(iso, engine) {
    var t = parseISO(iso), months = (engine && engine.AR_MONTHS) || [];
    return t.d + " " + (months[t.m - 1] || "") + " " + t.y;
  }

  /* ---- one ledger row (reuses engine.fold/statusLabel/toMinor) ---- */
  function rowFor(record, viewer, engine, asOf) {
    asOf = asOf || AS_OF_DEFAULT;
    var f = engine.fold(record.events);
    /* prefer the explicit app-level schedule length over the event-log's installment count
       (the schedule is the source of truth for remaining/next-due; robust for any record) */
    var total = (record.installments && record.installments.length) || f.total || 1;
    var principalMinor = engine.toMinor(record.amountSAR);
    var instMinor = Math.round(principalMinor / total);
    var role = record.lender === viewer ? "lender" : "borrower";
    var counterparty = role === "lender" ? record.borrower : record.lender;
    var remainingMinor = CLOSED[f.status] ? 0 : Math.max(0, principalMinor - f.settled * instMinor);
    var nextDueISO = (record.installments && record.installments[f.settled]) ? record.installments[f.settled].dueISO : null;
    var activeish = (f.status === "ACTIVE" || f.status === "SETTLING");
    var isOverdue = !!(activeish && !f.graced && nextDueISO && daysBetween(asOf, nextDueISO) > 0);
    var statusLabel = engine.statusLabel(record.events);
    /* overdue chip reuses the existing TRUST_BAND_AR.overdue word «عليه وعدٌ متأخّر» (amber,
       never red — late is not a crime); no new vocabulary invented (spec §4/§8). */
    var chipLabel = isOverdue ? ((engine.TRUST_BAND_AR && engine.TRUST_BAND_AR.overdue) || "عليه وعدٌ متأخّر") : statusLabel;
    return {
      id: record.id, counterparty: counterparty, role: role,
      amountSAR: record.amountSAR, remainingSAR: remainingMinor / 100,
      status: statusLabel, chipLabel: chipLabel, statusKey: f.status,
      nextDueISO: nextDueISO, nextDueLabel: nextDueISO ? arDueLabel(nextDueISO, engine) : null,
      isOverdue: isOverdue, daysOverdue: isOverdue ? daysBetween(asOf, nextDueISO) : 0,
      graced: f.graced
    };
  }

  function bucketOf(r) { return CLOSED[r.statusKey] ? 2 : (r.isOverdue ? 0 : 1); }
  function byId(a, b) { return a.id < b.id ? -1 : a.id > b.id ? 1 : 0; }
  function sortRows(a, b) {
    var ba = bucketOf(a), bb = bucketOf(b);
    if (ba !== bb) return ba - bb;
    if (ba === 0) return (b.daysOverdue - a.daysOverdue) || byId(a, b);            // most-overdue first
    if (ba === 1) {                                                                // due-soon first
      var da = a.nextDueISO ? dayNum(a.nextDueISO) : Infinity;
      var db = b.nextDueISO ? dayNum(b.nextDueISO) : Infinity;
      return (da - db) || byId(a, b);
    }
    return byId(a, b);
  }

  function buildLedger(records, viewer, engine, asOf) {
    var rows = records.map(function (r) { return rowFor(r, viewer, engine, asOf); });
    var owedToMe = rows.filter(function (r) { return r.role === "lender"; }).sort(sortRows);
    var iOwe = rows.filter(function (r) { return r.role === "borrower"; }).sort(sortRows);
    return { owedToMe: owedToMe, iOwe: iOwe };
  }

  function isLive(r) { return !CLOSED[r.statusKey]; }
  function summaryTiles(ledger) {
    function tile(rows) {
      var live = rows.filter(isLive);
      return { amountSAR: live.reduce(function (a, r) { return a + r.remainingSAR; }, 0), count: live.length };
    }
    return { me: tile(ledger.owedToMe), on: tile(ledger.iOwe) };
  }

  /* ---- «تذكيرٌ بالمعروف» — fixed warm templates, sent BY عهد, original amount only,
         NO day-counter to the debtor, every reminder carries the «أحتاج وقت» exit ---- */
  function reminderTemplate(tier, ctx) {
    var amt = group(ctx.amountSAR), who = ctx.creditor, due = ctx.dueLabel;
    if (tier === 2) {
      return "تذكيرٌ ثانٍ بالمعروف من عهد: لا يزال عهدُك مع " + who + " (" + amt + " ر.س) قائمًا. " +
        "نعلم أنّ الظروف تختلف — اختر ما يناسبك: السداد، أو طلب مهلة، ودون أيّ حرج. " +
        "﴿وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة﴾.";
    }
    return "السلام عليكم 🤍 — تذكيرٌ لطيف فقط: عهدُك مع " + who + " (" + amt + " ر.س) موعده كان " + due + ". " +
      "لا عجلة ولا مطالبة — متى ما تيسّر. وإن احتجت وقتًا، عهد يعيد الجدولة بالمعروف، بلا أيّ زيادة.";
  }

  /* receipt Naif sees — he never had to be the bad guy */
  var SENDER_RECEIPT = "أرسل عهد تذكيرًا لطيفًا بالنيابة عنك 🤍 — بقي الأمر بينك وبينه على خير.";

  /* finite, merciful cadence ladder: due → Tier1 → cooldown → Tier2 → STOP → hand back */
  function canSendReminder(row, history, asOf) {
    asOf = asOf || AS_OF_DEFAULT; history = history || [];
    if (row.statusKey === "DISPUTED") return { allowed: false, reason: "disputed_paused" };
    if (CLOSED[row.statusKey] || row.statusKey === "DEFAULTED" || row.statusKey === "ESCALATED")
      return { allowed: false, reason: "closed" };
    if (!row.isOverdue) return { allowed: false, reason: "not_due" };
    var t2 = history.filter(function (h) { return h.tier === 2; })[0];
    if (t2) return { allowed: false, reason: "ladder_exhausted" };
    var t1 = history.filter(function (h) { return h.tier === 1; })
      .sort(function (a, b) { return dayNum(b.atISO) - dayNum(a.atISO); })[0];
    if (!t1) return { allowed: true, nextTier: 1 };
    if (daysBetween(asOf, t1.atISO) >= COOLDOWN_DAYS) return { allowed: true, nextTier: 2 };
    return { allowed: false, reason: "cooldown" };
  }

  /* the viewer's OWN trust band — own-history qualitative mirror (Agent-3 Screen E.1).
     Reuses the engine's trustSignal + TRUST_BAND_AR. A WORD, never a number; shown
     only to the owner; never exported/shared (the sharing half is deferred — D-1). */
  function selfBand(history, openOverdue, engine) {
    var s = engine.trustSignal(history || [], !!openOverdue);
    /* return ONLY the qualitative word — never the numeric ratio/count (spine: never a number) */
    return { band: s.band, word: (engine.TRUST_BAND_AR || {})[s.band] || "" };
  }

  return {
    AS_OF_DEFAULT: AS_OF_DEFAULT, COOLDOWN_DAYS: COOLDOWN_DAYS, SENDER_RECEIPT: SENDER_RECEIPT,
    daysFromCivil: daysFromCivil, daysBetween: daysBetween, dayNum: dayNum, arDueLabel: arDueLabel,
    rowFor: rowFor, buildLedger: buildLedger, summaryTiles: summaryTiles,
    reminderTemplate: reminderTemplate, canSendReminder: canSendReminder, selfBand: selfBand
  };
});
