/* ============================================================================
   features/jamiya-goal.js — MoneyFellows G9, WITHOUT what we reject: the
   jamiya starts from a GOAL (وصفيّ) with a progress bar over sealed payments,
   and scenario compare (months options → per-round & total) BEFORE inviting.
   The promise-free line is fixed and always rendered: no financial promise,
   no return, no matching, no fee. Integer halalas only. Pure + deterministic.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.JamiyaGoal = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var PROMISE_FREE = "هدف وصفي — لا وعد مالي ولا عائد";

  function describe(goalAr, jam) {
    var n = (jam.members || []).length;
    var total = n * n;
    var done = (jam.payments || []).length;
    var pct = total > 0 ? Math.floor(done * 100 / total) : 0;
    return {
      goalAr: String(goalAr || ""),
      progress: { done: done, total: total, pct: pct },
      promiseFreeAr: PROMISE_FREE
    };
  }

  /* compare cycle lengths BEFORE the invitation goes out (MoneyFellows lesson:
     show every obligation before participation — as transparency, not fees) */
  function scenarios(monthlyMinor, monthsOptions) {
    return (monthsOptions || []).map(function (months) {
      return { months: months, perRoundMinor: monthlyMinor, totalMinor: monthlyMinor * months };
    });
  }

  return { describe: describe, scenarios: scenarios, PROMISE_FREE: PROMISE_FREE };
});
