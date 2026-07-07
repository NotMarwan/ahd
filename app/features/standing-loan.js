/* ============================================================================
   features/standing-loan.js — «سُلفة بالمعروف» (F3): a STANDING / recurring
   two-party قرض حسن. Two FIXED parties (e.g. an employer «أبو فهد» and a worker
   «راميش») agree ONE per-cycle amount; the bank deterministically posts ONE sealed
   عهد per cycle key — no bank money (party-to-party), no fee, no penalty, no
   interest, no pooled deposit, no score. Each post is a 1-installment qard hasan
   whose OWN canonical (arrangement=standing) is sealed with the engine's GOLDEN
   sha256/sealBlock/GENESIS — reused, untouched.

   Cycle keys are FIXED strings passed in (e.g. ["2026-01",…]) — NO Date/clock, so
   the schedule is fully deterministic (mirrors circle-adv.js's recurringPosts).

   Wage-linkage / Musaned (mandatory domestic-worker e-salary, Jan 2026) is a
   DOCUMENTED integration seam pending counsel (WAGE_LINKAGE_SEAM) — this module
   ASSERTS nothing regulatory; it only carries the flag.

   Dual module: Node `require`, browser `window.Standing` (uses window.AHD).
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("../engine.js"));
  else root.Standing = factory(root.AHD);
})(typeof self !== "undefined" ? self : this, function (ENGINE) {
  "use strict";
  var ev = ENGINE.ev;

  /* wage-linkage / Musaned is a documented COUNSEL seam — flagged, asserted by NO ONE. */
  var WAGE_LINKAGE_SEAM = Object.freeze({ musanedIntegration: false, needsCounselSignOff: true });

  /* build a standing arrangement from a spec. perCycleMinor is integer halalas; cycle
     keys are the fixed string schedule (no Date). events mirror a sealed+active عهد so
     the arrangement itself is a witnessed, on-spine record — not the bank's money. */
  function makeStanding(spec) {
    var keys = (spec.cycleKeys || []).slice();
    return {
      id: spec.id, type: "قرض حسن", arrangement: "standing",
      lender: spec.lender, borrower: spec.borrower,
      perCycleMinor: ENGINE.toMinor(spec.perCycleSAR),
      cycleKeys: keys, purpose: spec.purpose || "",
      timestamp: spec.timestamp || "2026-01-01T09:00:00+03:00",
      events: [ev("AHD_DRAFTED", { installments: 1, standing: true }), ev("LENDER_SIGNED"),
        ev("COUNTERPARTY_SIGNED"), ev("RECORD_SEALED"), ev("ACTIVATED")]
    };
  }

  /* Arabic terms for the whole standing arrangement. MUST be ribaScan-clean: every
     riba trigger word (زيادة/فائدة/غرامة) is immediately negated by «بلا أيّ … ولا …»,
     which the engine's negation guard (بلا/ولا at a word boundary) reads as CLEAN.
     NEVER use a bare penalty/interest word. */
  function standingTermsAr(standing, engine) {
    var e = engine || ENGINE;
    return "يُقِرّ الطرفان بأنّ «" + standing.lender + "» تُسلِف «" + standing.borrower + "» مبلغ " +
      e.fmt(standing.perCycleMinor / 100) + " ريال في كلّ دورة على سبيل القرض الحسن، سُلفةٌ قائمةٌ بينهما " +
      "تتكرّر عبر " + (standing.cycleKeys || []).length + " دورةً، يُسدَّد متى تيسّر — بلا أيّ زيادةٍ ولا فائدةٍ ولا غرامة. " +
      "ولا يحفظ المصرف في هذه السُّلفة مالًا، ولا يتقاضى عليها أجرًا؛ إنّما يشهد ويختم ويوثّق. " +
      "﴿وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة﴾.";
  }

  /* OWN canonical for the standing arrangement — arrangement=standing, per-cycle amount,
     cycle count, riba flags, basis 2:280. Sealed with golden sha256. `overrideMinor` lets
     the verifier recompute under a tampered per-cycle amount to prove any change breaks it. */
  function standingCanonical(standing, engine, overrideMinor) {
    var e = engine || ENGINE;
    var per = (overrideMinor == null) ? standing.perCycleMinor : e.toMinor(overrideMinor);
    var keys = standing.cycleKeys || [];
    return [
      "AHD-RECORD-v1", "ahd_id=" + standing.id, "type=" + standing.type,
      "arrangement=standing",
      "lender=" + standing.lender, "borrower=" + standing.borrower,
      "per_cycle=" + e.minorToFixed2(per) + " SAR",
      "cycles=" + keys.length,
      "cycle_keys=" + keys.join(","),
      "schedule=recurring", "due=none",
      "terms_hash=" + e.sha256(standingTermsAr(standing, e)),
      "basis=Quran:2:280",
      "riba=interest:false;late_penalty_to_lender:false;gharar:none",
      "ts=" + standing.timestamp
    ].join("\n");
  }

  function standingSeal(standing, engine) {
    var e = engine || ENGINE, ch = e.sha256(standingCanonical(standing, e));
    return { canonical_hash: ch, seal: e.sealBlock(e.GENESIS, ch, 1) };
  }
  function verifyStanding(standing, engine, tamperSAR) {
    var e = engine || ENGINE, base = standingSeal(standing, e);
    var ch = e.sha256(standingCanonical(standing, e, tamperSAR == null ? null : tamperSAR));
    var seal = e.sealBlock(e.GENESIS, ch, 1);
    return { ok: seal === base.seal, sealed: base.seal, recomputed: seal, canonical_hash: ch };
  }

  /* the per-cycle OWN canonical of a single posted عهد (one installment for that cycle).
     Distinct per cycle (carries cycle=<key> + the post id) so each post's seal differs. */
  function postCanonical(standing, cycleKey, engine, overrideMinor) {
    var e = engine || ENGINE;
    var per = (overrideMinor == null) ? standing.perCycleMinor : e.toMinor(overrideMinor);
    return [
      "AHD-RECORD-v1", "ahd_id=" + standing.id + ":" + cycleKey,
      "type=" + standing.type, "arrangement=standing-post",
      "lender=" + standing.lender, "borrower=" + standing.borrower,
      "principal=" + e.minorToFixed2(per) + " SAR",
      "cycle=" + cycleKey, "schedule=NONE", "due=none",
      "terms_hash=" + e.sha256(standingTermsAr(standing, e)),
      "basis=Quran:2:280",
      "riba=interest:false;late_penalty_to_lender:false;gharar:none",
      "ts=" + standing.timestamp
    ].join("\n");
  }

  /* «سُلفة دائمة» — deterministically post ONE sealed عهد per cycle key (mirrors
     circle-adv.js recurringPosts: pure over the given fixed keys, NO Date). Each post
     is index-sealed: seal_i = sealBlock(GENESIS, sha256(canonical_i), i+1). */
  function standingPosts(standing, engine) {
    var e = engine || ENGINE;
    return (standing.cycleKeys || []).map(function (key, i) {
      var canonical = postCanonical(standing, key, e);
      var ch = e.sha256(canonical);
      return {
        cycleKey: key, ahdId: standing.id + ":" + key,
        principalMinor: standing.perCycleMinor,
        canonical: canonical, canonical_hash: ch,
        seal: e.sealBlock(e.GENESIS, ch, i + 1)
      };
    });
  }

  /* ledger — fold posted (one per cycle) against a repaid SET. Conservation is exact in
     integer halalas: postedMinor == repaidMinor + outstandingMinor. `repaidCycleKeys`
     is clamped to the known cycle keys (dedup + unknowns ignored) so it can never
     over-credit. NO penalty/interest ever changes the sum. */
  function standingLedger(standing, engine, repaidCycleKeys) {
    var per = standing.perCycleMinor || 0;
    var keys = standing.cycleKeys || [];
    var repaidSet = {};
    (repaidCycleKeys || []).forEach(function (k) { if (keys.indexOf(k) >= 0) repaidSet[k] = true; });
    var repaidCount = keys.reduce(function (a, k) { return a + (repaidSet[k] ? 1 : 0); }, 0);
    var posted = keys.length * per;
    var repaid = repaidCount * per;
    return {
      postedMinor: posted, repaidMinor: repaid, outstandingMinor: posted - repaid,
      cycleCount: keys.length
    };
  }

  return {
    WAGE_LINKAGE_SEAM: WAGE_LINKAGE_SEAM,
    makeStanding: makeStanding, standingPosts: standingPosts,
    standingCanonical: standingCanonical, standingSeal: standingSeal,
    verifyStanding: verifyStanding, standingLedger: standingLedger,
    standingTermsAr: standingTermsAr
  };
});
