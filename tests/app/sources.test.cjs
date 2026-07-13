/* ============================================================================
   sources.test.cjs — TDD for «المصادر والمنهجيّة» (Data criterion, W3: real
   data / honest numbers). Asserts the checked-in sources dataset is
   deterministic, every entry carries a year + an explicit measured/
   illustrative flag, every MEASURED entry's figure matches the real cited
   number in docs/evidence/EVIDENCE-BRIEF.md (D-1), and every ILLUSTRATIVE
   entry's own text says so — never presented as measured.
============================================================================ */
const fs = require("fs");
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "app", ...p);
const Src = require(P("features", "sources.js"));
const IN = require(P("features", "impact-national.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };

console.log("sources.test: «المصادر والمنهجيّة» — checked-in, deterministic, cited-or-labelled");

/* ---- module shape ---- */
ok(Object.isFrozen(Src.SOURCES), "SOURCES is frozen (deterministic, checked-in — never mutated at runtime)");
ok(Array.isArray(Src.SOURCES) && Src.SOURCES.length >= 3, "SOURCES has at least 3 entries (got " + Src.SOURCES.length + ")");
ok(typeof Src.byId === "function" && typeof Src.isMeasured === "function" && typeof Src.isIllustrative === "function", "helper functions exist");
ok(Src.KIND.MEASURED === "measured" && Src.KIND.ILLUSTRATIVE === "illustrative", "KIND enum names both flags");
ok(Src.GRADE && Src.GRADE.PRIMARY === "primary" && Src.GRADE.SECONDARY === "secondary" && Src.GRADE.MODEL === "model", "GRADE enum names evidence provenance");
ok(typeof Src.gradeOf === "function" && typeof Src.badgeAr === "function", "grade helpers exist");

/* ---- every entry: id, year, kind, citations ---- */
Src.SOURCES.forEach(function (s) {
  ok(Object.isFrozen(s), s.id + ": entry is frozen");
  ok(typeof s.id === "string" && s.id.length > 0, s.id + ": has a non-empty id");
  ok(typeof s.nameAr === "string" && s.nameAr.length > 0, s.id + ": has a non-empty Arabic name");
  ok(typeof s.figureAr === "string" && s.figureAr.length > 0, s.id + ": has a non-empty figure/claim string");
  ok(typeof s.year === "string" && s.year.length > 0, s.id + ": carries a non-empty year (vintage of the figure)");
  ok(s.kind === Src.KIND.MEASURED || s.kind === Src.KIND.ILLUSTRATIVE, s.id + ": kind is exactly measured or illustrative");
  ok(Src.gradeOf(s) === Src.GRADE.PRIMARY || Src.gradeOf(s) === Src.GRADE.SECONDARY || Src.gradeOf(s) === Src.GRADE.MODEL, s.id + ": has a valid provenance grade");
  ok(typeof s.citeAr === "string" && s.citeAr.length > 10, s.id + ": carries a real citation/methodology string");
  ok(typeof s.usedOnAr === "string" && s.usedOnAr.length > 0, s.id + ": states which screen(s) show it");
});

ok(new Set(Src.SOURCES.map(function (s) { return s.id; })).size === Src.SOURCES.length, "every source id is unique");

/* ---- measured entries must NOT read as illustrative, and vice versa ---- */
Src.SOURCES.filter(Src.isMeasured).forEach(function (s) {
  ok(!/توضيحيّ|سيناريو/.test(s.citeAr) || /رقمٌ حقيقيّ/.test(s.citeAr), s.id + ": measured entry's citation doesn't read as an illustrative disclaimer");
});
Src.SOURCES.filter(Src.isIllustrative).forEach(function (s) {
  ok(/توضيحيّ|سيناريو|لا رقمٌ مُقاس|بيانات اختبار/.test(s.citeAr), s.id + ": illustrative entry explicitly says so in its own citation text");
});

/* ---- at least one of each kind (the dataset must distinguish, not flatten) ---- */
ok(Src.SOURCES.some(Src.isMeasured), "at least one MEASURED (real, cited) entry exists");
ok(Src.SOURCES.some(Src.isIllustrative), "at least one ILLUSTRATIVE (labelled scenario) entry exists");

/* ---- D-1 entry ties to the SAME real figures the app already cites (impact-national's
   frozen EXTERNAL_STAT) — one dataset, no drift between the two places that name it ---- */
var d1 = Src.byId("D-1");
ok(!!d1 && Src.isMeasured(d1), "D-1 entry exists and is flagged measured");
ok(d1.figureAr.indexOf("٥٧١٬٢٥١") >= 0, "D-1 figure states the real cited request count (571,251)");
ok(d1.figureAr.indexOf("٥٨٫٦") >= 0, "D-1 figure states the real cited share (58.6 of every 100)");
ok(d1.year === IN.EXTERNAL_STAT.vintage, "D-1's year matches impact-national's own frozen vintage string (no drift)");
ok(String(IN.EXTERNAL_STAT.requests) === "571251", "cross-check: impact-national's EXTERNAL_STAT.requests is the same 571,251");

/* ---- the national-scenario entry (the synthetic ÷3-style ratio) is explicitly illustrative ---- */
var nat = Src.byId("national-scenario");
ok(!!nat && Src.isIllustrative(nat), "national-scenario entry exists and is flagged illustrative (never measured)");
ok(/مضروبةً/.test(nat.figureAr), "national-scenario figure names it as a derived/multiplied projection, not a raw measurement");
ok(/D-1/.test(nat.citeAr), "national-scenario citation names the D-1 source it derives from (traceable to the entry above)");

/* ---- the impact fixture-circle dataset is explicitly illustrative (test data, not a real survey) ---- */
var fix = Src.byId("impact-fixture");
ok(!!fix && Src.isIllustrative(fix), "impact-fixture entry exists and is flagged illustrative");
ok(/بيانات اختبار/.test(fix.citeAr) || /دوائر تجريبيّة/.test(fix.citeAr), "impact-fixture citation states plainly it is test data, not a real survey");

/* ---- D2 (data-rigor): the real, primary-sourced Findex demand figure — the honest
   non-survey substitute for "informal qard hasan happens at scale in Saudi"
   (OPEN-ITEMS panel#3 item 4, swarm/agent-3-official-stats/findings-claude.md).
   Figures copied VERBATIM from the World Bank Little Data Book 2022 p.111. ---- */
var fx = Src.byId("findex-borrow-family");
ok(!!fx && Src.isMeasured(fx), "findex-borrow-family entry exists and is flagged MEASURED (real, primary-sourced)");
ok(fx.figureAr.indexOf("٣٥٫٨") >= 0, "Findex figure states the real cited KSA rate (35.8 of every 100 adults)");
ok(fx.figureAr.indexOf("١٣٫٧") >= 0, "Findex figure states the real cited high-income-country comparison (13.7)");
ok(fx.year === "٢٠٢١", "Findex entry's year is the survey vintage (2021), not the 2022 publish date");
ok(/World Bank/.test(fx.citeAr) && /Little Data Book/.test(fx.citeAr), "Findex citation names the primary source (World Bank Little Data Book 2022)");
ok(/findings-claude/.test(fx.citeAr), "Findex citation traces back to the in-repo swarm findings file");
ok(!/سيناريو|توضيحيّ/.test(fx.citeAr), "Findex citation does NOT read as an illustrative disclaimer — it is a real measured figure");

/* ---- no forbidden nondeterminism primitive lives in the live (comment-stripped) source
   (belt-and-suspenders on top of the whole-app app-offline.test.cjs scan) ---- */
var src = fs.readFileSync(P("features", "sources.js"), "utf8");
["Date.now", "new Date", "Math.random", "fetch(", "XMLHttpRequest", "Intl.", ".toLocaleString"].forEach(function (tok) {
  ok(src.indexOf(tok) < 0, "sources.js: no forbidden primitive «" + tok + "» in source");
});

/* Data-rigor ladder: primary Findex/GASTAT, secondary Nafith, explicit model. */
["findex-series", "findex-emergency", "gastat-context", "nafith-count", "market-band"].forEach(function (id) {
  ok(!!Src.byId(id), id + " source entry exists");
});
ok(Src.gradeOf(Src.byId("findex-series")) === Src.GRADE.PRIMARY, "Findex decade series is primary");
ok(Src.gradeOf(Src.byId("findex-emergency")) === Src.GRADE.PRIMARY, "Findex emergency series is primary");
ok(Src.gradeOf(Src.byId("gastat-context")) === Src.GRADE.PRIMARY, "GASTAT context is primary");
ok(Src.gradeOf(Src.byId("nafith-count")) === Src.GRADE.SECONDARY, "Nafith count is secondary");
ok(Src.gradeOf(Src.byId("market-band")) === Src.GRADE.MODEL, "market band is model-grade");
ok(/ليست توزيعًا لقروض الأفراد/.test(Src.byId("gastat-context").citeAr), "GASTAT source rejects personal-loan-distribution reading");

console.log("\nsources.test: " + pass + "/" + (pass + fail) + (fail ? "  (" + fail + " FAILED)" : ""));
process.exit(fail ? 1 : 0);
