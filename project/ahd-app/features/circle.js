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
  /* a GROUP reminder for the whole circle that NEVER names the late member —
     «ذمّة المناسبة محفوظة». Collective, with the 2:280 mercy exit, and no زيادة.
     pendingCount is a dignified tally, never a named list. */
  function groupReminder(circle, engine) {
    var members = circle.members || [];
    var pendingCount = members.filter(function (m) {
      return !m.self && !/محفوظة|أُبرئ/.test(engine.statusLabel(m.events));
    }).length;
    var ar = "تذكيرٌ لطيفٌ من عهد إلى جماعة دائرة «" + circle.name + "» 🤍 — لا تزال هناك مساهماتٌ يسيرة " +
      "لتتمّ ذمّة المناسبة. نُرسله للجميع، ولا نُسمّي أحدًا ولا نُحرج أحدًا؛ من تيسّر له فجزاه الله خيرًا، " +
      "ومن احتاج وقتًا فله ذلك بالمعروف، بلا أيّ زيادة. ﴿وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة﴾.";
    var names = members.map(function (m) { return m.name; });
    return { ar: ar, pendingCount: pendingCount, collective: true,
      namesAnyone: names.some(function (n) { return ar.indexOf(n) >= 0; }) };
  }

  return { circleDashboard: circleDashboard, groupReminder: groupReminder };
});
