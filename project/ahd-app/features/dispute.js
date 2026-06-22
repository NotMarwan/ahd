/* ============================================================================
   features/dispute.js — «محلّ خلاف» (the dispute-pause flow). The spine pillar
   "the bank never judges", made into a screen: when a عهد is disputed, عهد PAUSES
   (no reminders), NEVER penalises, and keeps the sealed record as a NEUTRAL
   exhibit for both sides — then offers two dignified paths: تراضٍ (the encouraged
   reconciliation) and قضاء (where the sealed doc is neutral evidence). «يشهد ولا يحكم».

   Pure + deterministic; reads the engine only (toMinor). Adds no money, ever.

   Dual module: Node `require`, browser `window.Dispute` (uses window.AHD).
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("../engine.js"));
  else root.Dispute = factory(root.AHD);
})(typeof self !== "undefined" ? self : this, function (ENGINE) {
  "use strict";

  function isDisputed(record) {
    return (record && record.events || []).some(function (e) { return e.type === "DISPUTE_RAISED"; });
  }

  function disputeView(record, engine) {
    var e = engine || ENGINE;
    return {
      id: record.id,
      lender: record.lender, borrower: record.borrower,
      amountSAR: record.amountSAR, amountMinor: e.toMinor(record.amountSAR),  // unchanged — no penalty added
      disputed: isDisputed(record),
      paused: true,        // while disputed, عهد sends no reminders
      noPenalty: true,     // never any غرامة/زيادة — not even in dispute
      status: "محلّ خلاف",
      stance: "عهدٌ يشهد ولا يحكم — يحفظ الوثيقة محايدةً للطرفين، ولا يقضي بينهما، ولا يضيف أيّ زيادة.",
      neutralExhibit: { available: true, ar: "السجلّ المختوم محفوظٌ كما هو — دليلٌ محايد لا يميل لأحد." },
      paths: [
        { key: "reconcile", icon: "🤝", ar: "تراضٍ — تصالُحٌ بالمعروف", note: "الأحبّ إلى عهد ﴿والصلح خير﴾ — يُقترَح إمهالٌ أو إبراءٌ بلا أيّ زيادة.", encouraged: true },
        { key: "court", icon: "⚖️", ar: "قضاء — إن لزم", note: "تُقدَّم الوثيقة المختومة دليلًا محايدًا (نظام الإثبات)؛ عهد لا يكون خصمًا ولا حَكَمًا.", encouraged: false }
      ]
    };
  }

  return { isDisputed: isDisputed, disputeView: disputeView };
});
