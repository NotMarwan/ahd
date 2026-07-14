/* Auxiliary care workflows. No new debt, guarantee, score, judgment, or seal rewrite. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("../engine.js"));
  else root.Care = factory(root.AHD);
})(typeof self !== "undefined" ? self : this, function (ENGINE) {
  "use strict";

  var FORGIVENESS_REASONS = Object.freeze([
    Object.freeze({ key: "financial_hardship", ar: "عسر مالي" }),
    Object.freeze({ key: "medical", ar: "ظرف صحي" }),
    Object.freeze({ key: "unspecified", ar: "دون تفصيل" })
  ]);
  var DURESS_REASONS = Object.freeze([
    Object.freeze({ key: "coercion", ar: "إكراه" }),
    Object.freeze({ key: "capacity_concern", ar: "قلق أهلية" }),
    Object.freeze({ key: "unspecified", ar: "دون تفصيل" })
  ]);

  var FORGIVENESS_SCOPES = Object.freeze(["full", "partial"]);

  function isAllowed(list, key) {
    for (var i = 0; i < list.length; i++) if ((typeof list[i] === "string" ? list[i] : list[i].key) === key) return true;
    return false;
  }
  function hasRecordId(record) {
    return !!record && typeof record.id === "string" && record.id.length > 0;
  }
  function principalMinor(record, engine) {
    var e = engine || ENGINE;
    return record && Number.isInteger(record.amountMinor) ? record.amountMinor : e.toMinor(record && record.amountSAR || 0);
  }
  function paidMinor(events) {
    var total = 0;
    (events || []).forEach(function (item) { if (item.type === "PRINCIPAL_PAID" && Number.isInteger(item.amountMinor) && item.amountMinor > 0) total += item.amountMinor; });
    return total;
  }
  function remainingMinor(record, engine) { return Math.max(0, principalMinor(record, engine) - paidMinor(record && record.events)); }
  function recordThirdPartyGift(record, input, engine) {
    var e = engine || ENGINE, data = input || {}, payer = typeof data.payerId === "string" ? data.payerId : "";
    var amount = data.amountMinor;
    var valid = !!record && payer.length > 0 && payer !== record.borrower && payer !== record.lender && Number.isInteger(amount) && amount > 0;
    var applied = valid ? Math.min(amount, remainingMinor(record, e)) : 0;
    return e.ev("PRINCIPAL_PAID", { amountMinor: applied, metadata: { channel: "third_party_gift", payerId: payer, reference: typeof data.reference === "string" ? data.reference : "", recourse: false } });
  }
  function requestForgiveness(record, input, engine) {
    var e = engine || ENGINE, data = input || {}, remaining = remainingMinor(record, e);
    if (!hasRecordId(record) || data.borrowerId !== record.borrower || !isAllowed(FORGIVENESS_SCOPES, data.scope) || !isAllowed(FORGIVENESS_REASONS, data.reasonKey)) return null;
    if (data.scope === "partial" && (!Number.isInteger(data.amountMinor) || data.amountMinor <= 0)) return null;
    var amount = data.scope === "full" ? remaining : Math.min(data.amountMinor, remaining);
    if (amount <= 0) return null;
    return e.ev("FORGIVENESS_REQUESTED", { recordId: record.id, borrowerId: data.borrowerId, scope: data.scope, amountMinor: amount, reasonKey: data.reasonKey });
  }
  function reportDuress(record, input, engine) {
    var e = engine || ENGINE, data = input || {};
    if (!hasRecordId(record) || (data.reporterId !== record.borrower && data.reporterId !== record.lender) || !isAllowed(DURESS_REASONS, data.reasonKey)) return null;
    return e.ev("DURESS_REPORTED", { recordId: record.id, reporterId: data.reporterId, reasonKey: data.reasonKey });
  }
  function preSealBlocked(events) { return (events || []).some(function (item) { return item.type === "DURESS_REPORTED"; }); }
  function duressStatus(events) { return { pendingReview: preSealBlocked(events), sealEffect: "none" }; }

  return { FORGIVENESS_REASONS: FORGIVENESS_REASONS, FORGIVENESS_SCOPES: FORGIVENESS_SCOPES, DURESS_REASONS: DURESS_REASONS, remainingMinor: remainingMinor, recordThirdPartyGift: recordThirdPartyGift, requestForgiveness: requestForgiveness, reportDuress: reportDuress, preSealBlocked: preSealBlocked, duressStatus: duressStatus };
});
