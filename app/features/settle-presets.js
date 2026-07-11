/* ============================================================================
   features/settle-presets.js — alternative demo tangles for «المقاصّة», so a
   judge can poke the netting instead of watching one canned result. Every
   preset uses ONLY the golden five (engine.NODES, by index — never a copied
   name string), whole-SAR integer amounts; the netting itself stays the
   GOLDEN engine.netting via features/settlement.js (call, never modify).
   Preset "golden" returns engine.IOUS itself — the default view is
   byte-identical to before this file existed.
   Dual module: Node `require`, browser `window.SettlePresets`.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SettlePresets = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* edge builder over golden roster indices — amounts are whole SAR integers */
  function E(i, j, amount) { return { i: i, j: j, amount: amount }; }

  /* the two alternative tangles, as roster-index triples:
     - "chain": a 5-member payment chain + a back edge → collapses hard
     - "hub": everyone owes one member different amounts → nets to few legs */
  var ALT = {
    chain: [E(0, 1, 500), E(1, 2, 500), E(2, 3, 500), E(3, 4, 500), E(4, 0, 300), E(0, 2, 200)],
    hub: [E(1, 0, 400), E(2, 0, 250), E(3, 0, 350), E(4, 0, 150), E(0, 4, 100)]
  };

  var PRESETS = [
    { key: "golden", labelAr: "شبكة العرض (٩ التزامات)" },
    { key: "chain", labelAr: "سلسلة تسديد (٦ التزامات)" },
    { key: "hub", labelAr: "الكلّ يدين لواحد (٥ التزامات)" }
  ];

  function edgesFor(key, engine) {
    var alt = ALT[key];
    if (!alt) return engine.IOUS;
    return alt.map(function (t) {
      return { from: engine.NODES[t.i], to: engine.NODES[t.j], amount: t.amount };
    });
  }

  return { PRESETS: PRESETS, edgesFor: edgesFor };
});
