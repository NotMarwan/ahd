/* ============================================================================
   fee-receipt.test.cjs — TDD for «إيصال أجرة التوثيق». The judge-legible proof
   that the money story is spine-clean: two contractually-SEPARATE lines — «الزيادة
   على القرض: 0.00» and «أجرة توثيقٍ ثابتة: 5.00» — that are NEVER summed. Pure
   view-model over Billing.feeForSeal(...), formatter injected (DI), honest badge.
============================================================================ */
const fs = require("fs");
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "app", ...p);
const B = require(P("features", "billing.js"));
const R = require(P("features", "fee-receipt.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("fee-receipt.test: «إيصال أجرة التوثيق» — two separate lines, never summed");

ok(typeof R.build === "function", "build exists");

/* ---- the canonical receipt: flat 5.00 أجرة, zero on the loan ---- */
const rec = R.build(B.feeForSeal({ id: "R-X", amountSAR: 1200 }), B.sarStr);
ok(typeof rec.title === "string" && rec.title.indexOf("أجرة التوثيق") >= 0, "title names «أجرة التوثيق — منفصلةٌ عن القرض»");
ok(Array.isArray(rec.lines) && rec.lines.length === 2, "receipt has exactly TWO lines");
eq(rec.lines[0].k, "الزيادة على القرض", "line 1 label: «الزيادة على القرض»");
eq(rec.lines[0].v, "0.00", "line 1 value: «0.00» — the bank takes nothing on the قرض");
eq(rec.lines[0].zero, true, "line 1 is flagged zero:true");
eq(rec.lines[1].k, "أجرة توثيقٍ ثابتة", "line 2 label: «أجرة توثيقٍ ثابتة»");
eq(rec.lines[1].v, "5.00", "line 2 value: «5.00» — the flat service أجرة");
eq(rec.loanChargeHalalas, 0, "loanChargeHalalas === 0");
eq(rec.feeHalalas, 500, "feeHalalas === 500 (flat)");
eq(rec.summed, false, "summed === false — the two lines are NEVER combined into a total");
eq(rec.flat, true, "flat === true");
eq(rec.shariahReviewNeeded, true, "shariahReviewNeeded === true (pending D-6)");
ok(rec.badge.indexOf("المراجعة الشرعيّة") >= 0, "carries the honest «قيد المراجعة الشرعيّة» badge");
ok(rec.note.indexOf("عقدان منفصلان") >= 0, "note states the two-contract separation");
ok(Object.keys(rec).indexOf("total") < 0 && Object.keys(rec).indexOf("sumHalalas") < 0, "NO combined-total field exists (summing the قرض + الأجرة is forbidden by the spine)");

/* ---- the invariant: the fee never changes with the loan size (flat) ---- */
const small = R.build(B.feeForSeal({ amountSAR: 10 }), B.sarStr);
const huge  = R.build(B.feeForSeal({ amountSAR: 9000000 }), B.sarStr);
eq(small.lines[1].v, huge.lines[1].v, "the أجرة line is identical for a 10 ر.س and a 9,000,000 ر.س loan (flat, never scales)");
eq(small.lines[0].v, "0.00", "the loan-charge line stays 0.00 regardless of loan size");

/* ---- DI + defaults ---- */
const noFmt = R.build(B.feeForSeal({}));
ok(noFmt.lines[1].v === "500", "without a formatter, values fall back to String(halalas) (DI default)");
eq(R.build(null).shariahReviewNeeded, true, "a null fee still defaults shariahReviewNeeded:true (fail-safe honesty)");
eq(R.build({ feeHalalas: 500, shariahReviewNeeded: false }).shariahReviewNeeded, false, "an explicitly-cleared fee (shariahReviewNeeded:false) is honored");

/* ---- purity: no percentage glyph; deterministic ---- */
const allText = JSON.stringify(rec);
ok(allText.indexOf("%") < 0 && allText.indexOf("٪") < 0, "NO percentage glyph (%/٪) anywhere in the receipt");
ok(JSON.stringify(R.build(B.feeForSeal({ id: "R-X", amountSAR: 1200 }), B.sarStr)) === JSON.stringify(rec), "build is deterministic (identical JSON on a second run)");

/* ---- source purity scan ---- */
const src = fs.readFileSync(P("features", "fee-receipt.js"), "utf8");
["Date.now", "new Date", "Math.random", "Intl.", ".toLocaleString", "fetch(", "XMLHttpRequest", "WebSocket"].forEach(tok =>
  ok(src.indexOf(tok) < 0, "fee-receipt.js source has no «" + tok + "»"));
ok(src.indexOf("٪") < 0, "fee-receipt.js source has no Arabic percent glyph ٪");

console.log("\n========================================================");
console.log("FEE-RECEIPT: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
