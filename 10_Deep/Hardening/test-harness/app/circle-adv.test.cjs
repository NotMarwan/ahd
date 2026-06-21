/* ============================================================================
   circle-adv.test.cjs — TDD for features/circle-adv.js. Advanced Circle:
   بالأصناف split, recurring auto-post, graduation قَيْد→عهد (reuses القرض المفتوح),
   and a mode-B PLEDGE sketch (no pooled deposit; flagged for Shariah review).
   Deterministic, integer halalas, sum-preserving via respread.
============================================================================ */
const path = require("path");
const engine = require(path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", "engine.js"));
const OpenLoan = require(path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", "features", "open-loan.js"));
const CA = require(path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", "features", "circle-adv.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");
const M = engine.toMinor;
const sum = (o) => Object.keys(o).reduce((a, k) => a + o[k], 0);

console.log("circle-adv.test: advanced Circle logic");

/* --- بالأصناف (by-item) split — sum-preserving via respread --- */
const items = [
  { label: "ستيك", amountMinor: M(300), assignedTo: ["خالد"] },
  { label: "بيتزا مشتركة", amountMinor: M(200), assignedTo: ["خالد", "ريم", "نورة"] },
  { label: "عصائر", amountMinor: M(90), assignedTo: ["ريم", "نورة"] }
];
const bc = CA.byCategorySplit(items, ["خالد", "ريم", "نورة"], engine);
eq(bc.totalMinor, M(590), "بالأصناف total = 590 SAR");
eq(sum(bc.shares), M(590), "بالأصناف conserves: Σ shares == total (no phantom halala)");
eq(bc.conserved, true, "بالأصناف conserved flag");
eq(bc.shares["خالد"], M(300) + 6667, "خالد = steak 300 + 1/3 of pizza (6667 halalas)");
eq(bc.shares["ريم"], 6667 + 4500, "ريم = 1/3 pizza + 1/2 juice");
eq(bc.shares["نورة"], 6666 + 4500, "نورة = 1/3 pizza (rounding remainder) + 1/2 juice");

/* --- recurring auto-post — N deterministic cycles, payer excluded from owing --- */
const tmpl = { name: "الإيجار", amountMinor: M(3600), payer: "تركي", members: ["سعود", "تركي", "عبدالله"], split: "equal", period: "monthly" };
const posts = CA.recurringPosts(tmpl, ["2026-07", "2026-08", "2026-09"]);
eq(posts.length, 3, "3 cycles → 3 posts");
eq(posts[0].cycleKey, "2026-07", "post carries its cycle key");
eq(posts[0].owed["سعود"], M(1200), "each non-payer owes their equal share (1,200)");
ok(!("تركي" in posts[0].owed), "the payer (تركي) is NOT in owed (no debt to oneself)");
eq(sum(posts[0].owed) + posts[0].payerShareMinor, M(3600), "owed + payer's own share == the full bill (conserved)");
eq(sum(posts[2].owed), M(2400), "last cycle owed total == 2,400");

/* --- graduation قَيْد→عهد (reuses القرض المفتوح + golden seal) --- */
const circle = { id: "CIR-STD-MALQA", organizer: "سعود", name: "شقة الملقا" };
const g = CA.graduateShare({ name: "تركي", amountMinor: M(1500) }, circle, engine, OpenLoan);
eq(g.lender, "سعود", "graduated عهد: organizer is the lender/creditor");
eq(g.borrower, "تركي", "graduated عهد: the share owner is the borrower");
eq(g.principalMinor, M(1500), "graduated principal == the share amount");
eq(g.term, "open", "graduation → an open-term قرض حسن «متى ما تيسّر»");
ok(!!g.seal && g.seal.length === 64, "graduated عهد carries a real SHA-256 seal");
eq(OpenLoan.verifyOpenLoan(g.loan, engine).ok, true, "graduated عهد verifies (intact)");
eq(g.provenance.circleId, "CIR-STD-MALQA", "provenance links back to the circle");
eq(g.provenance.shareName, "تركي", "provenance records the originating share");

/* --- mode B «نجمع للهدف» — PLEDGE sketch only, NO pooled deposit, flagged --- */
const ps = CA.pledgeSketch({ name: "رحلة العلا", goalMinor: M(8000) }, ["لُجين", "نورة", "سارة", "خالد"], engine);
eq(ps.pledges.length, 4, "pledge sketch: one pledge per member");
eq(sum(ps.pledges.reduce((o, p) => (o[p.member] = p.amountMinor, o), {})), M(8000), "pledges sum to the goal (conserved)");
eq(ps.poolHeldByBank, false, "NO pooled deposit held by the bank (spine guard)");
eq(ps.model, "pledge-then-pay-at-spend", "model = pledge then pay at spend (mode A on spend)");
eq(ps.shariahReviewNeeded, true, "mode B is flagged for Shariah review (not finalized)");
ok(ps.pledges.every(p => p.status === "pledged"), "each pledge is status 'pledged' (not deposited)");

console.log("\n========================================================");
console.log("CIRCLE-ADV: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
