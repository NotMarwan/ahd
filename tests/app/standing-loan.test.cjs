/* ============================================================================
   standing-loan.test.cjs — TDD for features/standing-loan.js. F3 «سُلفة بالمعروف»:
   a STANDING (recurring) two-party qard hasan between two FIXED parties that
   deterministically posts ONE sealed عهد per cycle key — no bank money, no fee,
   no penalty, no interest, no pooled deposit. Wage-linkage/Musaned is a documented
   COUNSEL seam (WAGE_LINKAGE_SEAM), asserted by no one. Cycle keys are fixed strings
   passed in (NO Date). Integer halalas; sealed with the golden primitives (reused).
============================================================================ */
const assert = require("assert");
const path = require("path");
const engine = require(path.join(__dirname, "..", "..", "app", "engine.js"));
const S = require(path.join(__dirname, "..", "..", "app", "features", "standing-loan.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");
const M = engine.toMinor;

console.log("standing-loan.test: standing/recurring two-party qard hasan (سُلفة بالمعروف)");

const spec = {
  id: "STND-FAHD-RAMESH",
  lender: "أبو فهد",
  borrower: "راميش",
  perCycleSAR: 800,
  cycleKeys: ["2026-01", "2026-02", "2026-03"],
  purpose: "سُلفة شهريّة بالمعروف",
  timestamp: "2026-01-01T09:00:00+03:00"
};
const standing = S.makeStanding(spec);

/* --- makeStanding shape --- */
eq(standing.id, "STND-FAHD-RAMESH", "makeStanding keeps id");
eq(standing.lender, "أبو فهد", "makeStanding keeps lender");
eq(standing.borrower, "راميش", "makeStanding keeps borrower");
eq(standing.perCycleMinor, M(800), "perCycleMinor === toMinor(800)");
eq(standing.cycleKeys.length, 3, "3 cycle keys");
ok(Array.isArray(standing.events) && standing.events.length > 0, "carries an events array");

/* --- standingPosts: one sealed عهد per cycle --- */
const posts = S.standingPosts(standing, engine);
eq(posts.length, 3, "standingPosts returns one post per cycle key (3)");
eq(posts[0].cycleKey, "2026-01", "post[0].cycleKey == 2026-01");
eq(posts[0].ahdId, "STND-FAHD-RAMESH:2026-01", "post id == <id>:<cycleKey>");
eq(posts[1].ahdId, "STND-FAHD-RAMESH:2026-02", "post[1] id == <id>:2026-02");
eq(posts[2].ahdId, "STND-FAHD-RAMESH:2026-03", "post[2] id == <id>:2026-03");
posts.forEach(function (p, i) { eq(p.principalMinor, standing.perCycleMinor, "post[" + i + "] principal == perCycleMinor"); });

/* --- determinism: two runs deep-equal, seals identical --- */
const posts2 = S.standingPosts(standing, engine);
ok(JSON.stringify(posts) === JSON.stringify(posts2), "standingPosts is deterministic (two runs deep-equal)");
posts.forEach(function (p, i) { eq(p.seal, posts2[i].seal, "post[" + i + "] seal identical across runs"); });
/* neighbouring posts have distinct seals (seq + cycleKey differ) */
ok(posts[0].seal !== posts[1].seal, "post seals differ between cycles");

/* --- seal reuses the golden primitive exactly --- */
posts.forEach(function (p, i) {
  const expect = engine.sealBlock(engine.GENESIS, engine.sha256(p.canonical), i + 1);
  eq(p.seal, expect, "post[" + i + "] seal == sealBlock(GENESIS, sha256(canonical), i+1)");
  eq(p.canonical_hash, engine.sha256(p.canonical), "post[" + i + "] canonical_hash == sha256(canonical)");
});

/* --- standingCanonical + verifyStanding --- */
const can = S.standingCanonical(standing, engine);
ok(/arrangement=standing/.test(can), "canonical carries arrangement=standing");
ok(/riba=interest:false/.test(can), "canonical carries riba=interest:false");
ok(/late_penalty_to_lender:false/.test(can), "canonical carries late_penalty_to_lender:false");
ok(/gharar:none/.test(can), "canonical carries gharar:none");
ok(/basis=Quran:2:280/.test(can), "canonical cites basis 2:280 (mercy)");
ok(/cycles=3/.test(can), "canonical carries cycle count");
const seal = S.standingSeal(standing, engine);
eq(S.standingSeal(standing, engine).seal, seal.seal, "standingSeal is deterministic");
eq(S.verifyStanding(standing, engine).ok, true, "verifyStanding intact == ok");
eq(S.verifyStanding(standing, engine, 9999).ok, false, "verifyStanding under tampered amount is caught");

/* --- terms Arabic must be ribaScan-clean --- */
const terms = S.standingTermsAr(standing, engine);
ok(typeof terms === "string" && terms.length > 0, "standingTermsAr returns a non-empty string");
eq(engine.ribaScan(terms).verdict, "clean", "standingTermsAr is ribaScan-CLEAN (no riba vocabulary)");

/* --- ledger conservation: posted == repaid + outstanding --- */
const ledger0 = S.standingLedger(standing, engine);
eq(ledger0.cycleCount, 3, "ledger cycleCount == 3");
eq(ledger0.postedMinor, 3 * standing.perCycleMinor, "postedMinor == 3 * perCycleMinor");
eq(ledger0.repaidMinor, 0, "with no repaid cycles, repaidMinor == 0");
eq(ledger0.outstandingMinor, 3 * standing.perCycleMinor, "outstandingMinor == full posted");
eq(ledger0.postedMinor, ledger0.repaidMinor + ledger0.outstandingMinor, "CONSERVATION: posted == repaid + outstanding");

const ledger1 = S.standingLedger(standing, engine, ["2026-01"]);
eq(ledger1.repaidMinor, standing.perCycleMinor, "with repaid=[2026-01], repaidMinor == perCycleMinor");
eq(ledger1.outstandingMinor, 2 * standing.perCycleMinor, "outstandingMinor == 2 * perCycleMinor");
eq(ledger1.postedMinor, ledger1.repaidMinor + ledger1.outstandingMinor, "CONSERVATION holds with a repaid cycle");

/* a repaid key not in cycleKeys must not over-credit (clamp to known cycles) */
const ledger2 = S.standingLedger(standing, engine, ["2026-01", "2026-01", "9999-99"]);
eq(ledger2.repaidMinor, standing.perCycleMinor, "duplicate/unknown repaid keys don't over-credit");
eq(ledger2.postedMinor, ledger2.repaidMinor + ledger2.outstandingMinor, "CONSERVATION under messy repaid input");

/* --- the wage-linkage / Musaned COUNSEL seam --- */
eq(S.WAGE_LINKAGE_SEAM.musanedIntegration, false, "WAGE_LINKAGE_SEAM.musanedIntegration === false (asserts nothing)");
eq(S.WAGE_LINKAGE_SEAM.needsCounselSignOff, true, "WAGE_LINKAGE_SEAM.needsCounselSignOff === true (pending counsel)");
ok(Object.isFrozen(S.WAGE_LINKAGE_SEAM), "WAGE_LINKAGE_SEAM is frozen");

/* --- no float anywhere: integer halalas only --- */
eq(standing.perCycleMinor % 1, 0, "perCycleMinor is an integer (no float)");
posts.forEach(function (p, i) { eq(p.principalMinor % 1, 0, "post[" + i + "] principal is an integer"); });
eq(ledger0.postedMinor % 1, 0, "postedMinor is an integer");
eq(ledger0.outstandingMinor % 1, 0, "outstandingMinor is an integer");
eq(ledger1.repaidMinor % 1, 0, "repaidMinor is an integer");

/* --- no number-as-reputation leaks into the arrangement/posts/ledger --- */
const blob = JSON.stringify(standing) + JSON.stringify(posts) + JSON.stringify(ledger1);
ok(!/(score|band|rating|percent|٪|reputation|تصنيف|كفاءة)/.test(blob), "no score/band/rating/percent leaks anywhere");

console.log("\n========================================================");
console.log("STANDING-LOAN: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
