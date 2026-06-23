/* ============================================================================
   open-loan-progress.test.cjs — TDD for the DEEPENED القرض المفتوح: a progress
   breakdown (paid · صدقة · باقٍ) for the «متى ما تيسّر» bar, and the payment
   JOURNEY (the chronological partial-payments + إبراء). Pure, integer halalas,
   conservation exact. Reuses the engine; no golden change.
============================================================================ */
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", ...p);
const E = require(P("engine.js"));
const OL = require(P("features", "open-loan.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("open-loan-progress.test: progress breakdown + payment journey");

const base = OL.makeOpenLoan({ id: "OL-MUNIRA", lender: "منيرة", borrower: "ماجد", amountSAR: 20000 });
const loan = Object.assign({}, base, { events: base.events.concat(OL.payEvent(base, 5000, E), OL.forgiveEvent(base, 3000, E)) });

/* ---- openLoanProgress: the three-segment breakdown, exact conservation ---- */
ok(typeof OL.openLoanProgress === "function", "openLoanProgress exists");
const pr = OL.openLoanProgress(loan);
eq(pr.principalMinor, E.toMinor(20000), "principal = 20,000 in halalas");
eq(pr.paidMinor, E.toMinor(5000), "paid = 5,000 (a partial payment when eased)");
eq(pr.forgivenMinor, E.toMinor(3000), "forgiven = 3,000 (صدقة)");
eq(pr.remainingMinor, E.toMinor(12000), "remaining = 20,000 − 5,000 − 3,000 = 12,000");
ok(pr.paidMinor + pr.forgivenMinor + pr.remainingMinor === pr.principalMinor, "CONSERVATION: paid + forgiven + remaining == principal exactly");
ok([pr.paidMinor, pr.forgivenMinor, pr.remainingMinor, pr.principalMinor].every(Number.isInteger), "all figures are integer halalas (no float money)");
ok(Math.abs((pr.paidFrac + pr.forgivenFrac + pr.remainingFrac) - 1) < 1e-9, "the three fractions sum to 1 (for the progress bar)");
ok(pr.paidFrac > 0 && pr.remainingFrac > 0, "fractions reflect a real partial state");
/* a fresh loan: nothing paid/forgiven, all remaining */
const fresh = OL.openLoanProgress(base);
eq(fresh.paidMinor, 0, "fresh loan: paid 0");
eq(fresh.remainingMinor, E.toMinor(20000), "fresh loan: all remaining");
ok(Math.abs(fresh.remainingFrac - 1) < 1e-9, "fresh loan: remaining fraction is the whole bar");

/* ---- openLoanHistory: the «متى ما تيسّر» journey ---- */
ok(typeof OL.openLoanHistory === "function", "openLoanHistory exists");
const h = OL.openLoanHistory(loan);
ok(Array.isArray(h) && h.length >= 3, "history has the sealing + the payment + the إبراء");
eq(h[0].kind, "sealed", "the journey opens with the sealing");
ok(h.some(x => x.kind === "paid" && x.amountMinor === E.toMinor(5000)), "a «paid» entry carries the 5,000 partial payment");
ok(h.some(x => x.kind === "forgiven-partial" && x.amountMinor === E.toMinor(3000)), "a «forgiven-partial» entry carries the 3,000 صدقة");
ok(h.every(x => x.ar && x.ar.length > 0), "every journey entry has dignified Arabic copy");
ok(h.some(x => /بلا أيّ زيادة|تيسّر/.test(x.ar)), "the journey copy stays on-spine («متى ما تيسّر»، بلا زيادة)");
ok(!/\d{1,3}\s*[%٪]/.test(JSON.stringify(h)), "no percentage/score in the journey");

/* ---- full إبراء closes the journey as صدقة (FORGIVEN), conservation holds ---- */
const forgiven = Object.assign({}, base, { events: base.events.concat(OL.forgiveEvent(base, null, E)) });
const pf = OL.openLoanProgress(forgiven);
eq(pf.remainingMinor, 0, "full إبراء → remaining 0");
ok(pf.forgivenMinor === pf.principalMinor, "full إبراء → the whole principal is forgiven (صدقة)");
ok(OL.openLoanHistory(forgiven).some(x => x.kind === "forgiven-all"), "full إبراء shows a «forgiven-all» journey entry");

/* ---- code-review fix: a degenerate zero-principal loan returns honest zeros
   (no false fractions) and never throws ---- */
const zero = OL.makeOpenLoan({ id: "OL-Z", lender: "أ", borrower: "ب", amountSAR: 0 });
const zp = OL.openLoanProgress(zero);
eq(zp.principalMinor, 0, "zero-principal: principal 0");
ok(zp.paidFrac === 0 && zp.forgivenFrac === 0 && zp.remainingFrac === 0, "zero-principal: honest zero fractions (no false «1»)");
ok(zp.paidMinor === 0 && zp.remainingMinor === 0, "zero-principal: zero amounts, no throw");

/* ---- determinism ---- */
ok(JSON.stringify(OL.openLoanProgress(loan)) === JSON.stringify(pr), "openLoanProgress is deterministic");

console.log("\n========================================================");
console.log("OPEN-LOAN-PROGRESS: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
