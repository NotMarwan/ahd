/* ============================================================================
   features/circle.js — «لوحة أمين الصندوق» (treasurer dashboard) view-model
   (Agent-4 G3). A THIN projection over the GOLDEN circle engine — foldCircle,
   circleSeal, statusLabel, CIRCLE_STATE_AR — reused and never modified. Each
   member's state is its own dignified label; the occasion has ONE sealed proof.
   Pure, deterministic. Dual module: Node `require`, browser `window.CircleDash`.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.CircleDash = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  function circleDashboard(circle, engine) {
    var f = engine.foldCircle(circle);
    var members = circle.members.map(function (m) {
      return { name: m.name, amountSAR: m.amountMinor / 100, self: !!m.self, stateAr: engine.statusLabel(m.events) };
    });
    return {
      name: circle.name, organizer: circle.organizer, mode: circle.mode,
      statusKey: f.status, statusAr: (engine.CIRCLE_STATE_AR || {})[f.status] || f.status,
      debtCount: f.debtCount, closed: f.closed,
      owedSAR: f.owedMinor / 100, collectedSAR: f.collectedMinor / 100,
      members: members, seal: engine.circleSeal(circle)
    };
  }
  return { circleDashboard: circleDashboard };
});
