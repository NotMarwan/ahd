/* ==========================================================================
   features/split.js — «القسمة»: exact integer-halala bill division.
   Largest remainder is deterministic: leftover halalas go to the earliest
   participants in the supplied array. The payer's own share creates no qaid.
=========================================================================== */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./qaid.js"));
  else root.Split = factory(root.Qaid);
})(typeof self !== "undefined" ? self : this, function (QAID) {
  "use strict";

  function makeSplit(spec) {
    spec = spec || {};
    var participants = (spec.participants || []).map(function (name) { return String(name || "").trim(); });
    var seen = {};
    if (!Number.isSafeInteger(spec.totalMinor) || spec.totalMinor <= 0) throw new Error("total must be positive integer halalas");
    if (participants.length < 2 || participants.some(function (name) { if (!name || seen[name]) return true; seen[name] = true; return false; })) throw new Error("participants must be unique names");
    var payer = String(spec.payer || "").trim();
    if (participants.indexOf(payer) < 0) throw new Error("payer must be a participant");
    var base = Math.floor(spec.totalMinor / participants.length);
    var remainder = spec.totalMinor - base * participants.length;
    var shares = participants.map(function (name, index) {
      return { name: name, amountMinor: base + (index < remainder ? 1 : 0) };
    });
    var qaidDrafts = shares.filter(function (share) { return share.name !== payer; }).map(function (share) {
      return { direction: "alayya", name: share.name, amountMinor: share.amountMinor, noteAr: "قسمة فاتورة" };
    });
    return { totalMinor: spec.totalMinor, payer: payer, participants: participants.slice(), shares: shares, qaidDrafts: qaidDrafts };
  }

  function applySplit(state, split) {
    var next = state;
    (split.qaidDrafts || []).forEach(function (draft) { next = QAID.addQaid(next, draft); });
    return next;
  }

  return { makeSplit: makeSplit, applySplit: applySplit };
});
