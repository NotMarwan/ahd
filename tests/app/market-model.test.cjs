/* ============================================================================
   market-model.test.cjs — TDD for the bottom-up TAM/SAM/SOM market-sizing BAND
   (Front D, data-rigor lever D-L2). Asserts: every constant is a hardcoded
   integer (never fetched), the band is deterministic and integer-only
   throughout, LOW <= BASE <= HIGH holds at every stage (borrowers/TAM/SAM/SOM),
   the arithmetic is pure floor-division (no spurious precision), the model
   never uses a percentage glyph directly after a digit (house convention —
   see impact-national.test.cjs), and describeMarketAr labels the whole thing
   illustrative, never measured.
============================================================================ */
const fs = require("fs");
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "app", ...p);
const M = require(P("features", "market-model.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };

console.log("market-model.test: bottom-up TAM/SAM/SOM market-sizing BAND (deterministic · integer · sourced)");

/* ---- module shape ---- */
ok(typeof M.band === "function", "band exists");
ok(typeof M.describeMarketAr === "function", "describeMarketAr exists");
ok(typeof M.borrowers === "function" && typeof M.tam === "function" && typeof M.sam === "function" && typeof M.som === "function", "stage helper functions exist");
ok(/توضيحيّ/.test(M.LABEL) && /لا رقمٌ مُقاس/.test(M.LABEL), "LABEL is hard-labelled illustrative — never presented as measured");

/* ---- hardcoded constants are all plain integers (never fetched, never float) ---- */
ok(Number.isInteger(M.POPULATION) && M.POPULATION === 32175224, "POPULATION is the cited GASTAT 2022 census figure (32,175,224)");
ok(Number.isInteger(M.ADULT_SHARE_PERMILLE) && M.ADULT_SHARE_PERMILLE === 766, "ADULT_SHARE_PERMILLE is the cited ~76.6% adult share, as an integer per-mille");
ok(Number.isInteger(M.ADULTS_15_PLUS), "ADULTS_15_PLUS is a plain integer");
ok(Math.floor(M.ADULTS_15_PLUS / 1000000) === 24, "ADULTS_15_PLUS rounds to ~24M (the cited ≈24.6M)");

ok(M.PREVALENCE_PERMILLE.LOW === 304 && M.PREVALENCE_PERMILLE.HIGH === 358, "prevalence LOW/HIGH are the cited Findex 30.4%/35.8% (2024/2021 waves), as integer per-mille");
ok(M.PREVALENCE_PERMILLE.BASE === Math.floor((M.PREVALENCE_PERMILLE.LOW + M.PREVALENCE_PERMILLE.HIGH) / 2) || M.PREVALENCE_PERMILLE.BASE === (M.PREVALENCE_PERMILLE.LOW + M.PREVALENCE_PERMILLE.HIGH) / 2,
  "prevalence BASE is the exact midpoint of the two observed waves (not a separately-invented figure)");
ok(M.PREVALENCE_PERMILLE.LOW <= M.PREVALENCE_PERMILLE.BASE && M.PREVALENCE_PERMILLE.BASE <= M.PREVALENCE_PERMILLE.HIGH, "prevalence LOW <= BASE <= HIGH");

ok(M.AVG_LOAN_SAR.LOW === 1000 && M.AVG_LOAN_SAR.BASE === 5000 && M.AVG_LOAN_SAR.HIGH === 18000, "avg loan size is the cited proxy-anchored band: 1,000/5,000/18,000 SAR");
ok(M.AVG_LOAN_SAR.LOW <= M.AVG_LOAN_SAR.BASE && M.AVG_LOAN_SAR.BASE <= M.AVG_LOAN_SAR.HIGH, "avg loan size LOW <= BASE <= HIGH");

ok(M.BANKED_PERMILLE === 788, "banked share is the cited Findex 2024 account-ownership figure (78.8%), as integer per-mille");
ok(M.CAPTURE_BP.LOW === 50 && M.CAPTURE_BP.BASE === 150 && M.CAPTURE_BP.HIGH === 400, "capture rate is the stated founder-judgment band: 50/150/400 basis points (0.5%/1.5%/4%)");

/* ---- the band itself ---- */
const b = M.band();

/* integer-only throughout — every leaf value is a plain integer */
["adults15Plus"].forEach(k => ok(Number.isInteger(b[k]), "band." + k + " is a plain integer"));
["borrowers", "tam", "sam", "som", "tamBnTenths", "samBnTenths", "somMillions", "somBnTenths"].forEach(group => {
  ["low", "base", "high"].forEach(tier => {
    ok(Number.isInteger(b[group][tier]), "band." + group + "." + tier + " is a plain integer (got " + JSON.stringify(b[group][tier]) + ")");
  });
});

/* ---- monotonicity: LOW <= BASE <= HIGH at every stage (by construction) ---- */
["borrowers", "tam", "sam", "som"].forEach(group => {
  ok(b[group].low <= b[group].base && b[group].base <= b[group].high, group + ": LOW <= BASE <= HIGH");
});

/* ---- TAM >= SAM >= SOM at every tier (funnel narrows, never widens) ---- */
["low", "base", "high"].forEach(tier => {
  ok(b.tam[tier] >= b.sam[tier], "tam." + tier + " >= sam." + tier + " (SAM is a subset of TAM)");
  ok(b.sam[tier] >= b.som[tier], "sam." + tier + " >= som." + tier + " (SOM is a subset of SAM)");
});

/* ---- pure floor-division arithmetic — no spurious precision, every stage
   independently re-derivable from the public helper functions ---- */
ok(b.borrowers.low === M.borrowers(M.PREVALENCE_PERMILLE.LOW), "borrowers.low = borrowers(PREVALENCE_PERMILLE.LOW)");
ok(b.tam.high === M.tam(M.PREVALENCE_PERMILLE.HIGH, M.AVG_LOAN_SAR.HIGH), "tam.high = tam(PREVALENCE_PERMILLE.HIGH, AVG_LOAN_SAR.HIGH)");
ok(b.sam.base === M.sam(b.tam.base), "sam.base = sam(tam.base)");
ok(b.som.high === M.som(b.sam.high, M.CAPTURE_BP.HIGH), "som.high = som(sam.high, CAPTURE_BP.HIGH)");
ok(b.tam.low === b.borrowers.low * M.AVG_LOAN_SAR.LOW, "tam.low is exactly borrowers.low * avg loan size — no float introduced");

/* the displayed order-of-magnitude figures sit in the right ballpark of Appendix B's
   own illustrative table (small variance from double-rounding order is expected and
   documented — this model computes from the integer primitives, not from Appendix B's
   own pre-rounded intermediate figures) */
ok(b.tamBnTenths.low >= 70 && b.tamBnTenths.low <= 80, "TAM low sits at ~7.x billion SAR (Appendix B: ~7.5bn)");
ok(b.tamBnTenths.high >= 1500 && b.tamBnTenths.high <= 1650, "TAM high sits at ~15x.x billion SAR (Appendix B: ~158.6bn)");
ok(b.somMillions.low >= 20 && b.somMillions.low <= 40, "SOM low sits at tens of millions SAR (Appendix B: ~29M)");

/* ---- determinism: same constants => byte-identical band, including across
   two independent requires of the module ---- */
ok(JSON.stringify(M.band()) === JSON.stringify(b), "band() is deterministic on repeated calls (pure function)");
const modPath = P("features", "market-model.js");
delete require.cache[require.resolve(modPath)];
const M2 = require(modPath);
ok(JSON.stringify(M2.band()) === JSON.stringify(b), "band() is byte-identical across two independent requires of the module");

/* ---- house convention: never a percentage glyph directly after a digit
   (see tests/app/impact-national.test.cjs) — this module's own output never
   renders one either ---- */
ok(!/[0-9]\s*[%٪]/.test(JSON.stringify(b)), "band JSON carries no percentage glyph directly after a digit");

/* ---- describeMarketAr: honest Arabic lines, hard-labels illustrative, never
   silently presents SOM/TAM as measured ---- */
const d = M.describeMarketAr(b, function (n) { return String(n); });
["headline", "tamLine", "samLine", "somLine", "caveatLine", "label"].forEach(k =>
  ok(typeof d[k] === "string" && d[k].length > 0, "describeMarketAr returns non-empty ." + k));
ok(/توضيحيّ/.test(d.headline) || /توضيحيّ/.test(d.label), "describeMarketAr's output carries the illustrative label somewhere");
ok(/تقدير مؤسِّسين/.test(d.somLine), "somLine explicitly flags the capture rate as founder judgment, not data");
ok(/مسحًا ميدانيًّا/.test(d.caveatLine), "caveatLine names the real demand survey (OT-A1/D-L5) as the still-open lever for a measured loan size");
ok(!/[0-9]\s*[%٪]/.test(d.headline + d.tamLine + d.samLine + d.somLine + d.caveatLine), "describeMarketAr text carries no percentage glyph directly after a digit");

/* ---- source purity: no networking/nondeterminism primitive (belt-and-suspenders
   on top of app-offline.test.cjs's whole-app scan) ---- */
const src = fs.readFileSync(P("features", "market-model.js"), "utf8");
["Date.now", "new Date", "Math.random", "Intl.", ".toLocaleString", "fetch(", "XMLHttpRequest", "WebSocket"].forEach(tok =>
  ok(src.indexOf(tok) < 0, "market-model.js: no forbidden primitive «" + tok + "»"));

console.log("\n========================================================");
console.log("MARKET-MODEL: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
