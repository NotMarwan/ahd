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

  /* the rigorous conservation proof: netting MINIMISES transfers but PRESERVES
     every member's net position EXACTLY. Reuses the golden netting/balancesOf. */
  function conservationProof(ious, engine) {
    var before = ious || [];
    var after = engine.netting(before);
    var bBal = engine.balancesOf(before), aBal = engine.balancesOf(after);
    var names = Object.keys(bBal);
    Object.keys(aBal).forEach(function (n) { if (names.indexOf(n) < 0) names.push(n); });
    var perMember = names.map(function (n) {
      var nb = bBal[n] || 0, na = aBal[n] || 0;
      return { name: n, netBefore: nb, netAfter: na, preserved: nb === na };
    });
    var gross = function (arr) { return arr.reduce(function (a, t) { return a + t.amount; }, 0); };
    var totalNet = names.reduce(function (a, n) { return a + (bBal[n] || 0); }, 0);
    return {
      perMember: perMember,
      netsPreserved: perMember.every(function (m) { return m.preserved; }),
      totalNet: totalNet, conserved: totalNet === 0,
      transfersBefore: before.length, transfersAfter: after.length,
      moneyMovedBefore: gross(before), moneyMovedAfter: gross(after),
      saved: before.length - after.length
    };
  }

  return { settlementView: settlementView, conservationProof: conservationProof };
});
