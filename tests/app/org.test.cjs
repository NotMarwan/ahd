/* ============================================================================
   org.test.cjs — TDD for «لوحة المؤسسة» (Phase B). The surface the first paying
   customer logs into: AGGREGATE ledger (counts + integer-halalas money, never an
   individual's number), a FLAT software invoice from the Billing engine (never %
   of a loan), and the spine guards — aggregates only, k-anon, NO pooled custody.
   Pure + deterministic; integer halalas; no date/random/locale primitive.
============================================================================ */
const fs = require("fs");
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "app", ...p);
const E = require(P("engine.js"));
const B = require(P("features", "billing.js"));
const O = require(P("features", "org.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("org.test: «لوحة المؤسسة» — aggregate ledger + flat SaaS invoice (spine-clean)");

/* ---- module shape ---- */
ok(typeof O.makeOrg === "function", "makeOrg exists");
ok(typeof O.orgLedger === "function", "orgLedger exists");
ok(typeof O.orgInvoice === "function", "orgInvoice exists");
ok(typeof O.describeOrgAr === "function", "describeOrgAr exists");
eq(O.K_FLOOR, 3, "K_FLOOR === 3 (k-anonymity floor, mirrors Impact)");
ok(!!O.FIXTURE && Array.isArray(O.FIXTURE.covenants), "FIXTURE with a covenants array");

/* ---- fixture integrity: integer halalas, whole-SAR, no member identity ---- */
const F = O.FIXTURE;
ok(F.covenants.length >= 8, "at least 8 fixture covenants (got " + F.covenants.length + ")");
ok(F.covenants.every(c => Number.isInteger(c.disbursedHalalas) && Number.isInteger(c.repaidHalalas)), "every covenant amount is an INTEGER halalas (no float money)");
ok(F.covenants.every(c => c.disbursedHalalas % 100 === 0 && c.repaidHalalas % 100 === 0), "every fixture amount is a whole-SAR multiple (exact ر.س)");
ok(F.covenants.every(c => c.repaidHalalas <= c.disbursedHalalas), "no covenant is repaid beyond what was disbursed (outstanding >= 0)");
ok(F.covenants.every(c => c.status === "active" || c.status === "settled"), "every covenant status is active|settled");
ok(F.covenants.every(c => !("name" in c) && !("member" in c) && !("trust" in c) && !("score" in c) && !("band" in c)),
  "NO covenant carries a member name / trust band / score (aggregate surface — spine)");

/* ---- orgLedger: the aggregate totals (hand-verified) ---- */
const org = O.makeOrg();
const L = O.orgLedger(org);
eq(L.seats, 90, "seats === 90 (the subscription unit)");
eq(L.activeCovenants, 7, "activeCovenants === 7");
eq(L.settledCovenants, 5, "settledCovenants === 5");
eq(L.totalCovenants, 12, "totalCovenants === 12");
eq(L.disbursedHalalas, 1730000, "disbursedHalalas === 1,730,000 (17,300 ر.س)");
eq(L.repaidHalalas, 1165000, "repaidHalalas === 1,165,000 (11,650 ر.س)");
eq(L.outstandingHalalas, 565000, "outstandingHalalas === 565,000 (5,650 ر.س)");
eq(L.outstandingHalalas, L.disbursedHalalas - L.repaidHalalas, "outstanding === disbursed − repaid (aggregate identity)");
eq(L.conservationOk, true, "conservationOk — aggregate outstanding equals Σ per-covenant (disbursed − repaid)");
ok([L.disbursedHalalas, L.repaidHalalas, L.outstandingHalalas, L.activeCovenants, L.settledCovenants].every(Number.isInteger),
  "every ledger figure is an integer (halalas + counts, no float)");

/* ---- the spine flags this surface must assert structurally ---- */
eq(L.holdsNoMemberMoney, true, "holdsNoMemberMoney === true — the fund holds NO pooled member money (D-3)");
eq(L.custodyModel, "pledge-then-pay-at-spend", "custodyModel is pledge-then-pay-at-spend (no أمانة/غرر)");
eq(L.aggregatesOnly, true, "aggregatesOnly === true — never an individual's number");
eq(L.kFloor, 3, "ledger carries the k-anonymity floor");

/* ---- orgInvoice: FLAT, from the Billing engine, never a function of any loan ---- */
const inv = O.orgInvoice(org, B);
eq(inv.amountHalalas, 400 * 90, "invoice === 90 seats × 400 halalas = 36,000 halalas (360.00 ر.س) — flat per-seat");
eq(inv.percentOfAnyLoan, 0, "invoice.percentOfAnyLoan === 0 (never scales with any qard)");
eq(inv.flat, true, "invoice.flat === true");
eq(inv.shariahReviewNeeded, true, "invoice flagged shariahReviewNeeded (paid tier, pending D-6)");
/* the invoice is INDEPENDENT of the fund's loan volume — halving every loan leaves it unchanged */
const leanOrg = O.makeOrg({ seats: 90, covenants: F.covenants.map(c => ({ id: c.id, disbursedHalalas: 100, repaidHalalas: 0, status: c.status })) });
eq(O.orgInvoice(leanOrg, B).amountHalalas, inv.amountHalalas, "the invoice is IDENTICAL when every loan shrinks to 100 halalas — priced on seats, never on loans");
eq(O.orgInvoice(org, null), null, "orgInvoice without a billing engine → null (safe)");

/* ---- describeOrgAr: aggregates only, no member/covenant id, no % ---- */
const d = O.describeOrgAr(org, L, inv, E.fmt, B.sarStr);
ok(typeof d.heroLine === "string" && Array.isArray(d.ledgerLines) && typeof d.invoiceLine === "string" && typeof d.guardLine === "string",
  "describeOrgAr returns { heroLine, ledgerLines[], invoiceLine, guardLine }");
const allText = JSON.stringify(d);
ok(d.heroLine.indexOf("7") >= 0 && d.heroLine.indexOf("12") >= 0, "heroLine carries the active/total (7 of 12)");
ok(d.ledgerLines.join(" ").indexOf("17,300") >= 0, "ledger renders disbursed as 17,300 ر.س via fmt");
ok(d.ledgerLines.join(" ").indexOf("11,650") >= 0 && d.ledgerLines.join(" ").indexOf("5,650") >= 0, "ledger renders repaid 11,650 + outstanding 5,650 ر.س");
ok(d.invoiceLine.indexOf("360.00") >= 0, "invoiceLine shows the flat 360.00 ر.س/شهر (Billing.sarStr)");
ok(d.invoiceLine.indexOf("لا على قرضِ أحد") >= 0, "invoiceLine states the fee is on the tool, «لا على قرضِ أحد»");
ok(d.guardLine.indexOf("لا رقمَ فردٍ") >= 0 && d.guardLine.indexOf("لا يُصدَّر") >= 0, "guardLine states aggregates-only + no export (spine)");
ok(d.guardLine.indexOf("لا يُحتفَظ بمالٍ مجمَّع") >= 0, "guardLine states NO pooled custody");
ok(d.guardLine.indexOf("لا يُعرَض تفصيلٌ لأقلّ من") >= 0, "guardLine states the k-floor rule");
ok(allText.indexOf("%") < 0 && allText.indexOf("٪") < 0, "NO percentage glyph (%/٪) anywhere in the described lines");
ok(!/C-\d\d/.test(allText), "aggregates only — no covenant id (C-01…) appears in any line");

/* ---- determinism + purity ---- */
ok(JSON.stringify(O.orgLedger(org)) === JSON.stringify(L), "orgLedger is deterministic");
ok(JSON.stringify(O.describeOrgAr(org, L, inv, E.fmt, B.sarStr)) === JSON.stringify(d), "describeOrgAr is deterministic");
const snap = JSON.stringify(O.FIXTURE);
O.orgLedger(org); O.orgInvoice(org, B);
ok(JSON.stringify(O.FIXTURE) === snap, "FIXTURE is never mutated (pure)");

/* ---- source purity scan ---- */
const src = fs.readFileSync(P("features", "org.js"), "utf8");
["Date.now", "new Date", "Math.random", "Intl.", ".toLocaleString", "fetch(", "XMLHttpRequest", "WebSocket"].forEach(tok =>
  ok(src.indexOf(tok) < 0, "org.js source has no «" + tok + "»"));
ok(src.indexOf("٪") < 0, "org.js source has no Arabic percent glyph ٪");

console.log("\n========================================================");
console.log("ORG: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
