/* ==========================================================================
   features/reminder.js — fixed, dignified, WhatsApp-ready reminders.
   No free text, threat, shame, fee, penalty, network call, or ambient clock.
   Due logic and overdue eligibility reuse Daftari; events are immutable seals.
=========================================================================== */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./daftari.js"), require("../engine.js"));
  else root.Reminder = factory(root.Daftari, root.AHD);
})(typeof self !== "undefined" ? self : this, function (DAFTARI, ENGINE) {
  "use strict";

  var TEMPLATES = {
    gentle: "السلام عليكم — تذكير لطيف من عهد بموعدٍ قادم. لا عجلة، وإن احتجت وقتًا فالمهلة بالمعروف متاحة.",
    near_due: "السلام عليكم — اقترب موعد عهدك. هذا تذكير هادئ فقط، ويمكنك طلب مهلة بالمعروف دون حرج.",
    overdue: "السلام عليكم — مضى موعد عهدك. نعلم أن الظروف تختلف؛ يمكنك السداد أو طلب مهلة بالمعروف، دون حرج."
  };

  function dueISOOf(record) {
    if (record && record.dueISO) return record.dueISO;
    var installments = record && record.installments || [];
    return installments.length ? installments[0].dueISO : null;
  }

  function normalizedRecord(record) {
    if (!record) throw new Error("record required");
    var amountSAR = record.amountSAR;
    if (amountSAR == null && Number.isSafeInteger(record.amountMinor)) amountSAR = ENGINE.minorToFixed2(record.amountMinor);
    return Object.assign({}, record, {
      amountSAR: amountSAR,
      installments: record.installments || [{ dueISO: record.dueISO, amountSAR: amountSAR }],
      events: (record.events || []).slice()
    });
  }

  function reminderEvents(record) {
    return (record && record.events || []).filter(function (event) {
      return event.type === "DAILY_REMINDER" && event.canonical_hash && event.seal;
    });
  }

  function reminderFor(record, asOf, engine) {
    var e = engine || ENGINE;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(asOf || ""))) throw new Error("fixed AS_OF required");
    var source = normalizedRecord(record), dueISO = dueISOOf(source);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dueISO || ""))) throw new Error("due date required");
    var row = DAFTARI.rowFor(source, source.lender, e, asOf);
    var key;
    if (row.isOverdue) {
      var gate = DAFTARI.canSendReminder(row, [], asOf);
      if (!gate.allowed) throw new Error("reminder unavailable: " + gate.reason);
      key = "overdue";
    } else {
      var daysUntil = DAFTARI.daysBetween(dueISO, asOf);
      key = daysUntil <= 3 ? "near_due" : "gentle";
    }
    return { key: key, text: TEMPLATES[key], shareText: "عهد يذكّرك بالمعروف:\n" + TEMPLATES[key] };
  }

  function eventCanonical(record, result, asOf, sequence, engine) {
    var e = engine || ENGINE;
    return [
      "AHD-DAILY-REMINDER-v1",
      "record=" + String(record.id || ""),
      "month=" + asOf.slice(0, 7),
      "as_of=" + asOf,
      "template=" + result.key,
      "sequence=" + sequence,
      "text_hash=" + e.sha256(result.text)
    ].join("\n");
  }

  function sendReminder(record, asOf, engine) {
    var e = engine || ENGINE, source = normalizedRecord(record), month = String(asOf || "").slice(0, 7);
    var sealed = reminderEvents(source), monthCount = sealed.filter(function (event) { return event.month === month; }).length;
    if (monthCount >= 2) throw new Error("monthly reminder cap is 2");
    var result = reminderFor(source, asOf, e), sequence = sealed.length + 1;
    var canonical = eventCanonical(source, result, asOf, sequence, e), canonicalHash = e.sha256(canonical);
    var previousSeal = sealed.length ? sealed[sealed.length - 1].seal : (source.seal || e.GENESIS);
    var event = {
      type: "DAILY_REMINDER", templateKey: result.key, month: month, atISO: asOf,
      canonical: canonical, canonical_hash: canonicalHash,
      seal: e.sealBlock(previousSeal, canonicalHash, sequence)
    };
    var next = Object.assign({}, source, { events: source.events.concat([event]) });
    return { record: next, event: event, shareText: result.shareText };
  }

  return { TEMPLATES: TEMPLATES, reminderFor: reminderFor, sendReminder: sendReminder, reminderEvents: reminderEvents };
});
