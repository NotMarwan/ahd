/* ============================================================================
   features/settlement.js — «مقاصّة» view-model. A THIN projection over the
   GOLDEN Muqassa primitives (engine.netting / balancesOf / muqassaLegs, reused
   and never modified): turns a tangle of IOUs into the minimum set of transfers,
   the per-member consent legs (consented novation), and the conservation proof.
   Pure, deterministic. Dual module: Node `require`, browser `window.Settlement`.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Settlement = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  function settlementView(ious, engine) {
    var before = ious || [];
    var after = engine.netting(before);
    var balances = engine.balancesOf(before);
    var legs = engine.muqassaLegs(after);
    var net = Object.keys(balances).reduce(function (a, k) { return a + balances[k]; }, 0);
    return {
      before: before, after: after, balances: balances, legs: legs,
      beforeCount: before.length, afterCount: after.length, conserved: net === 0
    };
  }
  return { settlementView: settlementView };
});
