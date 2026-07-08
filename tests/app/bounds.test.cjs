/* ============================================================================
   bounds.test.cjs — TDD for «الضمانات والحدود» (JL-4). The judge-facing claim:
   guarantees-as-code — three columns (للمدين · للدائن · حدود المصرف) where
   EVERY guarantee names the exact file/test that enforces it, and this suite
   proves each named file actually exists on disk (fs.existsSync — the teeth).
   The panel DESCRIBES existing guarantees only; it changes zero semantics.
   Borrower-invokable إبراء stays OUT (lender-owned; D-territory — asserted).
============================================================================ */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..", "..");
const P = (...p) => path.join(ROOT, "app", ...p);
const B = require(P("features", "bounds.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("bounds.test: «الضمانات والحدود» — guarantees-as-code (every بند names a real guard file)");

/* ---- module shape (the exact plan contract) ---- */
ok(Array.isArray(B.SECTIONS), "SECTIONS is an array");
eq(B.SECTIONS.length, 3, "exactly 3 sections (للمدين · للدائن · حدود المصرف)");
eq(B.SECTIONS.map(s => s.key).join(","), "borrower,lender,bank", "section keys are borrower,lender,bank in that order");
ok(typeof B.describeAr === "function", "describeAr exists");

const S = {}; B.SECTIONS.forEach(s => { S[s.key] = s; });

/* ---- titles: each column names its audience ---- */
ok(B.SECTIONS.every(s => typeof s.titleAr === "string" && s.titleAr.length > 0), "every section carries a non-empty Arabic title");
ok(S.borrower.titleAr.indexOf("للمدين") >= 0, "borrower column is titled «للمدين»");
ok(S.lender.titleAr.indexOf("للدائن") >= 0, "lender column is titled «للدائن»");
ok(S.bank.titleAr.indexOf("حدود المصرف") >= 0, "bank column is titled «حدود المصرف»");

/* ---- minimum item counts (the plan's floors) ---- */
ok(Array.isArray(S.borrower.items) && S.borrower.items.length >= 5, "borrower column has at least 5 guarantees (got " + S.borrower.items.length + ")");
ok(Array.isArray(S.lender.items) && S.lender.items.length >= 4, "lender column has at least 4 guarantees (got " + S.lender.items.length + ")");
ok(Array.isArray(S.bank.items) && S.bank.items.length >= 5, "bank column has at least 5 bounds (got " + S.bank.items.length + ")");

/* ---- every item: non-empty text + non-empty enforcedBy ---- */
const ALL = [];
B.SECTIONS.forEach(s => s.items.forEach(it => ALL.push({ sec: s.key, it: it })));
ok(ALL.every(x => typeof x.it.text === "string" && x.it.text.length > 0), "EVERY item carries a non-empty Arabic text");
ok(ALL.every(x => typeof x.it.enforcedBy === "string" && x.it.enforcedBy.length > 0), "EVERY item carries a non-empty enforcedBy");

/* ---- THE TEETH: every enforcedBy path exists on disk (repo-root-relative) ----
   A "path" is any app/… or tests/… token ending in .js/.cjs. Every item must
   name at least one, every named file must exist, and every item must name at
   least one file under tests/ (a guarantee without a test is a slogan). */
const PATH_RE = /(?:app|tests)\/[\w./-]+\.c?js/g;
const pathsOf = s => s.match(PATH_RE) || [];
ok(ALL.every(x => pathsOf(x.it.enforcedBy).length >= 1), "EVERY enforcedBy names at least one real-looking file path");
ok(ALL.every(x => pathsOf(x.it.enforcedBy).some(p => p.indexOf("tests/") === 0)), "EVERY item names at least one guard under tests/ (a guarantee without a test is a slogan)");
ALL.forEach(x => {
  const ps = pathsOf(x.it.enforcedBy);
  const missing = ps.filter(p => !fs.existsSync(path.join(ROOT, p)));
  ok(missing.length === 0, "[" + x.sec + "] «" + x.it.text.slice(0, 28) + "…» — every named guard EXISTS on disk (" + ps.join(", ") + ")" + (missing.length ? "  MISSING: " + missing.join(", ") : ""));
});
const distinct = new Set(); ALL.forEach(x => pathsOf(x.it.enforcedBy).forEach(p => distinct.add(p)));
ok(distinct.size >= 12, "the guards span the codebase: at least 12 DISTINCT files named (got " + distinct.size + ")");

/* ---- spine wording: no percentage glyph; riba words only ever negated ---- */
const allText = JSON.stringify(B.SECTIONS);
ok(allText.indexOf("%") < 0 && allText.indexOf("٪") < 0, "NO percentage glyph (%/٪) anywhere in the sections");
ok(ALL.every(x => {
  if (!/(غرامة|فائدة|عمولة|رسوم|رسم)/.test(x.it.text)) return true;
  return /(لا|بلا|ولا|دون|أبدًا)/.test(x.it.text);
}), "every mention of غرامة/فائدة/عمولة/رسم appears ONLY inside a negation (no riba-implying wording)");
ok(S.borrower.items.some(x => x.text.indexOf("لا غرامة") >= 0), "borrower column states «لا غرامة تأخير» explicitly");
ok(S.borrower.items.some(x => x.text.indexOf("ما تيسّر") >= 0), "borrower column carries «ادفع ما تيسّر»");
ok(S.borrower.items.some(x => x.text.indexOf("ميسرة") >= 0), "borrower column carries the 2:280 grace («ميسرة»)");
ok(S.borrower.items.some(x => x.text.indexOf("كهرمان") >= 0), "borrower column states the amber-not-red rule («كهرمانيّ»)");
ok(S.lender.items.some(x => x.text.indexOf("المقاصّة") >= 0 && x.text.indexOf("هللة") >= 0), "lender column states the netting conservation in halalas");
ok(S.bank.items.some(x => x.text.indexOf("يُقرض") >= 0), "bank column states «لا يُقرض من عنده»");
ok(S.bank.items.some(x => x.text.indexOf("لا يحكم") >= 0), "bank column states «لا يحكم في خلاف»");
ok(S.bank.items.some(x => x.text.indexOf("يُفتي") >= 0), "bank column states the AI bound («لا يُفتي»)");

/* ---- Shariah guard (D-territory): borrower-invokable إبراء stays OUT ----
   إبراء is lender-owned; the borrower column must not offer or imply it. */
ok(S.borrower.items.every(x => !/(إبراء|أبرئ|الإبراء)/.test(x.text)), "borrower column NEVER mentions إبراء (lender-owned — changing that is D-territory)");
ok(S.lender.items.some(x => /الإبراء/.test(x.text) && /(بيدك|وحدك)/.test(x.text)), "lender column states «الإبراء بيدك وحدك» (the ownership is explicit)");

/* ---- describeAr: hero + footer, honest and deterministic ---- */
const d = B.describeAr();
ok(typeof d.heroLine === "string" && d.heroLine.length > 0, "describeAr returns a non-empty heroLine");
ok(typeof d.footerLine === "string" && d.footerLine.length > 0, "describeAr returns a non-empty footerLine");
ok(d.heroLine.indexOf("في الكود") >= 0, "heroLine carries the claim «مكتوبةٌ في الكود، لا في الشعارات»");
ok(d.footerLine.indexOf("دون إنترنت") >= 0, "footerLine states the guards run offline («دون إنترنت»)");
ok(d.footerLine.indexOf("اطلب تشغيله") >= 0, "footerLine invites the judge: «اطلب تشغيله»");
ok(JSON.stringify(d).indexOf("%") < 0 && JSON.stringify(d).indexOf("٪") < 0, "NO percentage glyph in the described lines");
ok(JSON.stringify(B.describeAr()) === JSON.stringify(d), "describeAr is deterministic (identical JSON on a second call)");

/* ---- immutability + determinism of the content itself ---- */
const snap = JSON.stringify(B.SECTIONS);
B.describeAr();
ok(JSON.stringify(B.SECTIONS) === snap, "describeAr does NOT mutate SECTIONS");
ok(Object.isFrozen(B.SECTIONS) && B.SECTIONS.every(s => Object.isFrozen(s) && Object.isFrozen(s.items)), "SECTIONS is deep-frozen (content cannot drift at runtime)");

/* ---- source purity: the module carries no nondeterminism/networking primitive
   (raw-text scan, mirroring app-offline.test.cjs's token list — comments included,
   so the implementation must not even name these tokens verbatim) ---- */
const src = fs.readFileSync(P("features", "bounds.js"), "utf8");
["Date.now", "new Date", "Math.random", "Intl.", ".toLocaleString", "fetch(", "XMLHttpRequest", "WebSocket"].forEach(tok =>
  ok(src.indexOf(tok) < 0, "module source has no «" + tok + "»"));
ok(src.indexOf("٪") < 0, "module source contains no Arabic percent glyph ٪");

console.log("\n========================================================");
console.log("BOUNDS: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
