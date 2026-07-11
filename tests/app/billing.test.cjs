/* ============================================================================
   billing.test.cjs — TDD for the «الأجرة والخطط» fee engine (Phase A revenue).
   The spine-critical contract: the قرض is 0 to the bank forever; every price is a
   FLAT integer-halalas amount for a separate service, NEVER a percentage of a loan
   and NEVER growing with delay (AAOIFI SS-19 cl 10/3/2). Every paid tier is honestly
   flagged shariahReviewNeeded (D-6). Pure + deterministic; money is integer halalas.
============================================================================ */
const fs = require("fs");
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "app", ...p);
const B = require(P("features", "billing.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("billing.test: «الأجرة والخطط» — flat, spine-clean fee engine (no % of loan, ever)");

/* ---- module shape ---- */
ok(typeof B.feeForSeal === "function", "feeForSeal exists");
ok(typeof B.subscriptionInvoice === "function", "subscriptionInvoice exists");
ok(typeof B.sarStr === "function", "sarStr exists");
ok(typeof B.wholeSar === "function", "wholeSar exists");
ok(typeof B.planByKey === "function", "planByKey exists");
ok(Array.isArray(B.PLANS), "PLANS is an array");
eq(B.FLAT_SEAL_FEE_HALALAS, 500, "FLAT_SEAL_FEE_HALALAS === 500 (5.00 ر.س, flat)");
ok(typeof B.SHARIAH_REVIEW_LABEL === "string" && B.SHARIAH_REVIEW_LABEL.indexOf("المراجعة الشرعيّة") >= 0, "SHARIAH_REVIEW_LABEL carries «المراجعة الشرعيّة»");
ok(B.LOAN_FREE_AR.indexOf("القرض مجاني") >= 0, "LOAN_FREE_AR states «القرض مجانيّ للأبد»");

/* ---- PLANS integrity ---- */
const PL = B.PLANS;
ok(PL.length >= 4, "at least 4 tiers (got " + PL.length + ")");
ok(PL.every(p => p.key && p.name && p.payer && Array.isArray(p.features) && p.features.length > 0), "every plan has key/name/payer + non-empty features");
ok(new Set(PL.map(p => p.key)).size === PL.length, "plan keys are unique");
ok(PL.every(p => Number.isInteger(p.priceHalalas) && p.priceHalalas >= 0), "every priceHalalas is a non-negative INTEGER (halalas, no float money)");
ok(PL.every(p => p.priceHalalas % 100 === 0), "every priceHalalas is a whole-SAR multiple of 100 (clean ر.س)");
ok(PL.every(p => p.perSeatHalalas == null || (Number.isInteger(p.perSeatHalalas) && p.perSeatHalalas % 100 === 0)), "any perSeatHalalas is an integer whole-SAR multiple");
ok(PL.every(p => p.loanAlwaysFree === true), "EVERY tier asserts loanAlwaysFree:true — the قرض is never behind the paywall (spine)");

const free = B.planByKey("free");
ok(!!free && free.paid === false && free.priceHalalas === 0, "the free tier: paid:false, priceHalalas:0");
eq(free.shariahReviewNeeded, false, "free tier needs NO shariah review (no fee at all)");
ok(PL.filter(p => p.paid).length >= 3, "there are >= 3 paid tiers (plus/circle/org/bank)");
ok(PL.filter(p => p.paid).every(p => p.shariahReviewNeeded === true), "EVERY paid tier is honestly flagged shariahReviewNeeded:true (D-6 — nothing board-approved yet)");
ok(!!B.planByKey("circle") && B.planByKey("circle").payer.indexOf("منظّم") >= 0, "the circle tier is paid by the ORGANIZER, not the borrowers");
ok(!!B.planByKey("org") && !!B.planByKey("bank"), "institutional (org) + white-label (bank) tiers exist (the primary B2B revenue)");
eq(B.planByKey("nope"), null, "planByKey with an unknown key → null");

/* ---- feeForSeal: FLAT and INDEPENDENT of the loan (the spine-critical property) ---- */
const small = { id: "R-A", amountMinor: 5000, amountSAR: 50, installments: [{ amountSAR: 50 }] };
const huge  = { id: "R-B", amountMinor: 900000000, amountSAR: 9000000, installments: [{ amountSAR: 9000000 }] };
const f1 = B.feeForSeal(small), f2 = B.feeForSeal(huge);
eq(f1.feeHalalas, 500, "feeForSeal → flat 500 halalas");
eq(f1.feeHalalas, f2.feeHalalas, "feeForSeal is IDENTICAL for a 50 ر.س loan and a 9,000,000 ر.س loan (flat — never scales with principal)");
eq(f1.loanChargeHalalas, 0, "feeForSeal.loanChargeHalalas === 0 — the bank takes NOTHING on the قرض");
eq(f1.percentOfLoan, 0, "feeForSeal.percentOfLoan === 0 (no riba linkage)");
eq(f1.flat, true, "feeForSeal.flat === true");
eq(f1.shariahReviewNeeded, true, "feeForSeal.shariahReviewNeeded === true (consumer fee, pending D-6)");
eq(B.feeForSeal(undefined).feeHalalas, 500, "feeForSeal(undefined) is still the flat fee (ignores the record entirely)");

/* ---- subscriptionInvoice: flat, never a function of any loan ---- */
const inv = B.subscriptionInvoice("circle", "2026-07");
eq(inv.amountHalalas, 1900, "circle invoice === flat 1900 halalas (19.00 ر.س)");
eq(inv.cycleKey, "2026-07", "invoice carries the caller-supplied cycleKey (no clock read)");
eq(inv.percentOfAnyLoan, 0, "invoice.percentOfAnyLoan === 0");
eq(inv.flat, true, "invoice.flat === true");
eq(inv.shariahReviewNeeded, true, "paid-tier invoice is flagged shariahReviewNeeded");
const invSeats = B.subscriptionInvoice("org", "2026-07", 40);
eq(invSeats.amountHalalas, 400 * 40, "per-seat org invoice: 40 seats × 400 halalas = 16,000 halalas");
eq(invSeats.seats, 40, "per-seat invoice records the seat count");
eq(B.subscriptionInvoice("org", "2026-07").amountHalalas, 290000, "org invoice WITHOUT seats → the flat base (290,000 halalas / 2,900 ر.س)");
eq(B.subscriptionInvoice("nope", "2026-07"), null, "invoice for an unknown plan → null");
ok(Number.isInteger(invSeats.amountHalalas) && Number.isInteger(inv.amountHalalas), "invoice amounts are integers (halalas, no float)");

/* ---- sarStr: integer→\"X.YY\" via string math (no float, no locale) ---- */
eq(B.sarStr(0), "0.00", "sarStr(0) → «0.00»");
eq(B.sarStr(500), "5.00", "sarStr(500) → «5.00»");
eq(B.sarStr(1200), "12.00", "sarStr(1200) → «12.00»");
eq(B.sarStr(1905), "19.05", "sarStr(1905) → «19.05» (cents zero-padded)");
eq(B.sarStr(290000), "2900.00", "sarStr(290000) → «2900.00»");
eq(B.sarStr(25000000), "250000.00", "sarStr(25000000) → «250000.00»");
eq(B.wholeSar(1900), 19, "wholeSar(1900) → 19");
eq(B.wholeSar(25000000), 250000, "wholeSar(25000000) → 250000");
ok(Number.isInteger(B.wholeSar(290000)), "wholeSar returns an integer");

/* ---- purity: no percentage glyph anywhere; deterministic; inputs not mutated ---- */
const plansJSON = JSON.stringify(B.PLANS);
ok(plansJSON.indexOf("%") < 0 && plansJSON.indexOf("٪") < 0, "NO percentage glyph (%/٪) anywhere in PLANS (flat amounts only)");
ok(JSON.stringify(B.feeForSeal(small)) === JSON.stringify(f1), "feeForSeal is deterministic");
ok(JSON.stringify(B.subscriptionInvoice("circle", "2026-07")) === JSON.stringify(inv), "subscriptionInvoice is deterministic");
const snap = JSON.stringify(B.PLANS);
B.feeForSeal(small); B.subscriptionInvoice("org", "2026-07", 3);
ok(JSON.stringify(B.PLANS) === snap, "PLANS is never mutated by fee/invoice calls (pure)");

/* ---- source purity scan (nondeterminism/networking primitives) ---- */
const src = fs.readFileSync(P("features", "billing.js"), "utf8");
["Date.now", "new Date", "Math.random", "Intl.", ".toLocaleString", "fetch(", "XMLHttpRequest", "WebSocket"].forEach(tok =>
  ok(src.indexOf(tok) < 0, "billing.js source has no «" + tok + "»"));
ok(src.indexOf("٪") < 0, "billing.js source has no Arabic percent glyph ٪");

console.log("\n========================================================");
console.log("BILLING: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
