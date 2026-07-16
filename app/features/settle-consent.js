/* ============================================================================
   features/settle-consent.js — G11: the Muqassa legs become INTERACTIVE
   consents. Each minimal transfer (from → to) is a card both parties must
   approve (حوالة بالتراضي — consented novation, spine); the settlement seals
   only when every leg is ready. Consumes the golden netting's transfer list
   ({from,to,amount}) untouched. Pure + immutable + deterministic.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SettleConsent = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function makeState(transfers) {
    return {
      legs: (transfers || []).map(function (t) {
        return { from: t.from, to: t.to, amount: t.amount, consents: {} };
      })
    };
  }

  function consent(state, index, party) {
    if (!state.legs[index]) throw new Error("لا رِجل بهذا الرقم");
    var leg = state.legs[index];
    if (party !== leg.from && party !== leg.to) throw new Error("الموافقة لطرفي الحوالة فقط: " + leg.from + " و" + leg.to);
    var legs = state.legs.map(function (l) { return { from: l.from, to: l.to, amount: l.amount, consents: Object.assign({}, l.consents) }; });
    legs[index].consents[party] = true;
    return { legs: legs };
  }

  function legReady(leg) { return !!(leg.consents[leg.from] && leg.consents[leg.to]); }

  function allReady(state) { return state.legs.length > 0 && state.legs.every(legReady); }

  function impactAr(leg, party) {
    if (party === leg.from) return leg.from + " يدفع " + leg.amount + " ر.س — دفعة واحدة تصفّي التزاماته المتشابكة";
    if (party === leg.to) return leg.to + " يستلم " + leg.amount + " ر.س — حقّها كاملًا، من طرف واحد بدل عدة أطراف";
    return "";
  }

  return { makeState: makeState, consent: consent, legReady: legReady, allReady: allReady, impactAr: impactAr };
});
