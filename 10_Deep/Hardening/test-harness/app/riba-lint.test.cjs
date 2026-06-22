/* ============================================================================
   riba-lint.test.cjs — TDD for features/riba-lint.js (the deepened riba linter).
   An ADDITIVE layer over the GOLDEN engine.ribaScan (which is byte-pinned and
   never modified). The layer must:
     • catch MORE real riba than the golden 4 rules (synonyms, disguised fees,
       conditional benefit قرض جرّ نفعًا, classical جاهلية, repay-more),
     • understand DISTRIBUTED negation across أو/و lists (clears clean clauses
       the golden guard wrongly blocks),
     • re-block NEGATED-negation traps the golden guard wrongly clears
       («ليست بلا فائدة» = with interest),
     • stay a strict SUPERSET of golden's true-positives,
     • never block the app's own auto-drafted terms,
     • be deterministic, integer-halala-safe, DOM-free (Node-testable).

   The linter FLAGS + SUGGESTS a halal alternative + cites the principle.
   It issues NO fatwa. Late = amber. No number/score anywhere.
============================================================================ */
const path = require("path");
const ROOT = path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app");
const engine = require(path.join(ROOT, "engine.js"));
const RL = require(path.join(ROOT, "features", "riba-lint.js"));
const C = require(path.join(ROOT, "features", "create.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");
const scan = (t) => RL.scan(t, engine);
const verdict = (t) => scan(t).verdict;

console.log("riba-lint.test: the deepened riba linter (additive over golden)");

/* ---- shape / back-compat ------------------------------------------------- */
ok(typeof RL.scan === "function", "RibaLint.scan is a function");
eq(scan("").verdict, "clean", "empty text is clean");
eq(scan("   ").verdict, "clean", "whitespace-only is clean");
ok(Array.isArray(scan("").hits), "scan returns a hits array");
(function () {
  var h = scan("عليه غرامةُ تأخيرٍ شهريّة.").hits[0];
  ok(h && typeof h.why === "string" && h.why.length > 0, "a hit carries a 'why'");
  ok(h && typeof h.fix === "string" && h.fix.length > 0, "a hit carries a halal 'fix'");
  ok(h && typeof h.category === "string" && h.category.length > 0, "a hit carries a 'category'");
})();

/* ---- golden behavior preserved (clean negation + plain riba) ------------- */
eq(verdict("قرضٌ حسن بلا فائدة ولا غرامة."), "clean", "plain «بلا فائدة ولا غرامة» stays clean");
eq(verdict("يُردُّ كما أُخِذ بلا فائدةٍ، وبلا غرامةِ تأخير، وبلا أيّ زيادة."), "clean", "the app's tail phrasing stays clean");
eq(verdict("عليه فائدة ٥٪."), "block", "explicit interest is blocked");
eq(verdict("وعليه غرامةُ تأخيرٍ ٢٪ شهريًّا."), "block", "explicit late penalty is blocked");
eq(verdict("نسبةُ ٢٪ من مبلغ القرض."), "block", "percentage-of-loan is blocked");

/* ---- DEFECT 1: negated-negation now BLOCKS (golden false-negative) ------- */
console.log("  — defect 1: negated negation (false-negative) —");
eq(verdict("القرض ليس بلا فائدة."), "block", "«ليس بلا فائدة» = with interest → BLOCK");
eq(verdict("ليست بلا فائدةٍ على المبلغ."), "block", "«ليست بلا فائدة» → BLOCK");
eq(verdict("هذا القرض ليس دون زيادة."), "block", "«ليس دون زيادة» → BLOCK");
eq(verdict("غير معفيٍّ من غرامة التأخير."), "block", "«غير معفيّ من الغرامة» → BLOCK");

/* ---- DEFECT 2: distributed negation now CLEAN (golden false-positive) ---- */
console.log("  — defect 2: distributed negation across أو/و (false-positive) —");
eq(verdict("يُردُّ بلا فائدةٍ أو غرامةٍ أو زيادة."), "clean", "«بلا فائدة أو غرامة أو زيادة» → CLEAN");
eq(verdict("دون أيّ فائدةٍ ولا نسبةٍ ولا ربح."), "clean", "«دون أيّ فائدة ولا نسبة ولا ربح» → CLEAN");
eq(verdict("من غير زيادةٍ أو عمولة."), "clean", "«من غير زيادة أو عمولة» → CLEAN");
eq(verdict("بلا فائدةٍ وغرامة."), "clean", "«بلا فائدةٍ وغرامة» (negation distributes via و) → CLEAN");
/* …but a re-asserted «بـ» after the list breaks the negation scope */
eq(verdict("بلا فائدةٍ وبغرامةِ تأخير."), "block", "«وبغرامة» (بـ = with) re-asserts → BLOCK");
eq(verdict("يُردُّ بلا فائدة، لكن عليه غرامةُ تأخير."), "block", "«لكن» breaks the negation scope → BLOCK");

/* ---- EXT: synonyms the golden 4 rules miss ------------------------------- */
console.log("  — ext: synonym evasion —");
eq(verdict("يُرَدّ المبلغ ومعه عائدٌ شهريّ."), "block", "«عائد» (yield) → BLOCK");
eq(verdict("له عليه مردودٌ زائدٌ عند السداد."), "block", "«مردود زائد» → BLOCK");
eq(verdict("يأخذ غُنمًا مقابل القرض."), "block", "«غُنم مقابل القرض» → BLOCK");
eq(verdict("علاوةٌ على المبلغ عند التأخير."), "block", "«علاوة على المبلغ» → BLOCK");
eq(verdict("يدفع المقترض بدلَ تأخيرٍ شهريًّا."), "block", "«بدل تأخير» → BLOCK");
/* «بدل» as an innocent word must NOT false-positive */
eq(verdict("يُسلّمه المبلغ بدلًا من الشيك."), "clean", "«بدلًا من» (instead of) stays CLEAN");

/* ---- EXT: disguised fees tied to the loan -------------------------------- */
console.log("  — ext: disguised fees tied to the loan —");
eq(verdict("رسومُ تأجيلٍ يدفعها المقترض عند التأخير."), "block", "«رسوم تأجيل» → BLOCK");
eq(verdict("مصاريفُ معالجةٍ مقابل تأجيل السداد."), "block", "«مصاريف … مقابل تأجيل» → BLOCK");
eq(verdict("تأمينٌ على القرض يتحمّله المقترض."), "block", "«تأمين على القرض» → BLOCK");
eq(verdict("أتعابٌ مقابل تمديد المهلة."), "block", "«أتعاب مقابل تمديد» → BLOCK");
/* a genuinely separate flat service fee phrased as the halal alternative is clean */
eq(verdict("أجرةُ خدمةٍ ثابتةٌ منفصلةٌ عن القرض لا تتغيّر بتأخيره."), "clean", "flat service fee, separate from principal → CLEAN");

/* ---- EXT: conditional benefit (قرض جرّ نفعًا) ----------------------------- */
console.log("  — ext: conditional benefit (قرض جرّ نفعًا) —");
eq(verdict("أُقرضك على أن تُهديني هديةً عند السداد."), "block", "conditional gift «على أن … هدية» → BLOCK");
eq(verdict("القرض بشرط أن يسكنني داره مدّة الدين."), "block", "conditional benefit «بشرط أن يسكنني» → BLOCK");
eq(verdict("بشرط أن أنتفع بسيّارته مقابل القرض."), "block", "conditional benefit «بشرط … مقابل القرض» → BLOCK");
/* an UNCONDITIONAL voluntary gift after repayment, explicitly no condition → clean */
eq(verdict("وله أن يُهدي بعد السداد تطوّعًا دون شرطٍ سابق."), "clean", "unconditional voluntary gift → CLEAN");

/* ---- EXT: classical جاهلية «أنظِرني أزِدك» -------------------------------- */
console.log("  — ext: classical «أنظِرني أزِدك» —");
eq(verdict("إن أخّرت زدتُ عليك المبلغ."), "block", "«إن أخّرت زدتُ» → BLOCK");
eq(verdict("أنظِرني وأزيدك في الدَّين."), "block", "«أنظِرني وأزيدك» → BLOCK");
eq(verdict("كلّما تأخّر شهرًا زاد الدَّين."), "block", "«كلّما تأخّر … زاد الدين» → BLOCK");

/* ---- EXT: repay more than taken ------------------------------------------ */
console.log("  — ext: repay more than taken —");
eq(verdict("يردّ أكثر ممّا أخذ."), "block", "«يردّ أكثر مما أخذ» → BLOCK");

/* ---- multiple violations: ALL hits returned ------------------------------ */
(function () {
  var r = scan("عليه فائدةٌ، وغرامةُ تأخير، ونسبةُ ٢٪.");
  eq(r.verdict, "block", "multi-violation clause is blocked");
  ok(r.hits.length >= 2, "multi-violation returns >= 2 hits (got " + r.hits.length + ")");
})();

/* ---- SUPERSET property: never less strict than golden on non-negated riba  */
console.log("  — property: layer ⊇ golden true-positives (no negation present) —");
[
  "عليه فائدة شهرية", "غرامة تأخير ٥٠ ريال", "نسبة ٣٪ من المبلغ", "عمولةٌ على الدين",
  "ربا صريح على القرض", "أرباحٌ مضمونة للمقرض", "زيادةٌ مقابل الأجل", "فايدة بسيطة على المبلغ"
].forEach(function (t) {
  var g = engine.ribaScan(t).verdict, l = verdict(t);
  ok(g !== "block" || l === "block", "golden blocks ⇒ layer blocks: «" + t + "» (golden=" + g + ", layer=" + l + ")");
});

/* ---- app-copy regression: the auto-drafted terms must stay clean ---------- */
console.log("  — regression: app's own auto-drafted terms stay clean —");
var dS = C.makeDraft({ id: "RL-S", lender: "أنت", borrower: "سلطان", amountSAR: 1200, months: 3 });
var dO = C.makeDraft({ id: "RL-O", lender: "أنت", borrower: "ماجد", amountSAR: 5000, open: true });
eq(scan(C.draftTermsAr(dS, engine)).verdict, "clean", "scheduled draft terms read CLEAN through the layer");
eq(scan(C.draftTermsAr(dO, engine)).verdict, "clean", "open draft terms read CLEAN through the layer");

/* ---- determinism --------------------------------------------------------- */
(function () {
  var a = JSON.stringify(scan("على أن تُهديني هديةً، وعليه نسبةُ ٢٪."));
  var b = JSON.stringify(scan("على أن تُهديني هديةً، وعليه نسبةُ ٢٪."));
  eq(a, b, "scan is deterministic (identical on re-run)");
})();

console.log("\n========================================================");
console.log("RIBA-LINT: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
