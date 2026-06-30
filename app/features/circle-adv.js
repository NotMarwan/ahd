/* ============================================================================
   features/circle-adv.js — advanced Circle (Agent-1 v2 + Agent-4 v2):
     • byCategorySplit — «بالأصناف» per-item split, sum-preserving via respread.
     • recurringPosts  — «قِسْمة دائمة» auto-post over given cycle keys (no Date).
     • graduateShare   — «قَيْد → عهد»: a circle debt graduates into an open-term
                          witnessed قرض حسن (reuses القرض المفتوح + golden seal).
     • pledgeSketch    — mode B «نجمع للهدف» PLEDGE sketch ONLY: no pooled deposit
                          held by the bank; flagged for Shariah review (DECISIONS).
   Pure, deterministic, integer halalas. Demo/engine untouched (reused).

   Dual module: Node `require`, browser `window.CircleAdv` (uses window.AHD/OpenLoan).
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("../engine.js"), require("./open-loan.js"));
  else root.CircleAdv = factory(root.AHD, root.OpenLoan);
})(typeof self !== "undefined" ? self : this, function (ENGINE, OPENLOAN) {
  "use strict";

  /* «بالأصناف» — each item's cost is split (respread) among only its assignees.
     respread preserves the sum exactly per item ⇒ Σ shares == Σ items, no phantom riba. */
  function byCategorySplit(items, members, engine) {
    var e = engine || ENGINE, shares = {}, total = 0;
    (members || []).forEach(function (m) { shares[m] = 0; });
    (items || []).forEach(function (it) {
      var who = it.assignedTo || [];
      var parts = e.respread(it.amountMinor, who.length || 1);
      who.forEach(function (name, i) { shares[name] = (shares[name] || 0) + (parts[i] || 0); });
      total += it.amountMinor;
    });
    var got = Object.keys(shares).reduce(function (a, k) { return a + shares[k]; }, 0);
    return { shares: shares, totalMinor: total, conserved: got === total };
  }

  /* «قِسْمة دائمة» — auto-post one entry per given cycle key. Equal split via respread;
     the payer's own share is theirs (not a debt); others owe their share. */
  function recurringPosts(template, cycleKeys, engine) {
    var e = engine || ENGINE;
    var members = template.members || [], amount = template.amountMinor || 0;
    var parts = e.respread(amount, members.length || 1);
    var payerIdx = members.indexOf(template.payer);
    var payerShare = payerIdx >= 0 ? parts[payerIdx] : 0;
    return (cycleKeys || []).map(function (key) {
      var owed = {};
      members.forEach(function (m, i) { if (i !== payerIdx) owed[m] = parts[i]; });
      return { cycleKey: key, payer: template.payer, name: template.name,
        totalMinor: amount, payerShareMinor: payerShare, owed: owed };
    });
  }

  /* «قَيْد → عهد» — graduate a circle share into a full witnessed عهد. Most on-spine
     form for a friend-debt-gone-serious is an OPEN-term قرض حسن «متى ما تيسّر»: we
     reuse the القرض المفتوح module (own canonical sealed with golden sha256/sealBlock).
     Provenance links the new عهد back to the originating circle + share. */
  function graduateShare(share, circle, engine, OpenLoan) {
    var e = engine || ENGINE, OL = OpenLoan || OPENLOAN;
    var loan = OL.makeOpenLoan({
      id: circle.id + "-GRAD-" + share.name, lender: circle.organizer, borrower: share.name,
      amountSAR: share.amountMinor / 100, purpose: "تخرّج من «" + circle.name + "»"
    });
    var sealObj = OL.openLoanSeal(loan, e);
    return {
      lender: circle.organizer, borrower: share.name, principalMinor: share.amountMinor,
      term: "open", loan: loan, seal: sealObj.seal, canonical_hash: sealObj.canonical_hash,
      provenance: { circleId: circle.id, shareName: share.name, circleName: circle.name }
    };
  }

  /* mode B «نجمع للهدف» — a PLEDGE sketch. The bank holds NO pooled deposit (that would
     raise أمانة/غرر concerns); each member pledges, and at the moment of spend the
     pledges convert to mode-A qard hasan. NOT finalized — flagged for Shariah review. */
  function pledgeSketch(goal, members, engine) {
    var e = engine || ENGINE;
    var parts = e.respread(goal.goalMinor, (members || []).length || 1);
    var pledges = (members || []).map(function (m, i) { return { member: m, amountMinor: parts[i] || 0, status: "pledged" }; });
    return {
      name: goal.name, pledges: pledges, totalMinor: goal.goalMinor,
      poolHeldByBank: false, model: "pledge-then-pay-at-spend", shariahReviewNeeded: true,
      note: "تعهّدٌ ثم دفعٌ عند الصرف — بلا وديعةٍ مجمّعة يحفظها المصرف (يُترك للمراجعة الشرعيّة)."
    };
  }

  /* a PER-ITEM conservation proof: each item's shares sum to its cost exactly
     (golden respread), so no rounding ever invents or loses a halala. */
  function splitConservation(items, engine) {
    var e = engine || ENGINE;
    var perItem = (items || []).map(function (it) {
      var who = it.assignedTo || [];
      var parts = e.respread(it.amountMinor, who.length || 1);
      var got = parts.reduce(function (a, p) { return a + p; }, 0);
      return { label: it.label || "", itemMinor: it.amountMinor, shareCount: who.length || 0, shares: parts, conserved: got === it.amountMinor };
    });
    var total = perItem.reduce(function (a, x) { return a + x.itemMinor; }, 0);
    return { perItem: perItem, totalMinor: total, allConserved: perItem.every(function (x) { return x.conserved; }) };
  }

  return { byCategorySplit: byCategorySplit, splitConservation: splitConservation, recurringPosts: recurringPosts, graduateShare: graduateShare, pledgeSketch: pledgeSketch };
});
