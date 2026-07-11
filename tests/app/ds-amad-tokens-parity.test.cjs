/* ============================================================================
   ds-amad-tokens-parity.test.cjs — drift gate for the AMAD/Alinma palette.

   The canonical token source is ds-bundle/guidelines/tokens-amad.css.
   deck06 slides and the Alinma concept prototypes each carry a self-contained
   copy of these tokens in their :root (files must open standalone offline),
   so this test pins every copy to the canonical values:

     • tokens-amad.css exists and declares the full canonical vocabulary,
     • every deck06 slide declares --navy / --navy-deep / --peach / --ar
       with canonical values (aliases like --deep may point at var(--navy-deep)),
     • any canonical token name that appears in a slide or concept file
       has EXACTLY the canonical value (no drift),
     • AlinmaOfficial and SaduAlinma stay on canonical values too.

   Purely static text checks — no DOM, no Date, no randomness.
============================================================================ */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..", "..");
const DS = path.join(ROOT, "ds-bundle");

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

// -- parse `--name: value` pairs out of a CSS/HTML text -----------------------
function parseTokens(text) {
  const out = {};
  const re = /--([a-z][a-z0-9-]*)\s*:\s*([^;}]+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    // first declaration wins (the :root block comes first in these files)
    if (!(m[1] in out)) out[m[1]] = m[2].trim();
  }
  return out;
}

const CANON_PATH = path.join(DS, "guidelines", "tokens-amad.css");

console.log("ds-amad-tokens-parity: canonical AMAD palette vs embedded copies");

console.log("\n[1] canonical file");
ok(fs.existsSync(CANON_PATH), "guidelines/tokens-amad.css exists");
const canon = fs.existsSync(CANON_PATH) ? parseTokens(fs.readFileSync(CANON_PATH, "utf8")) : {};
const MUST = ["navy", "navy-deep", "peach", "terra", "blush", "bronze", "r-amad", "ar", "mono"];
for (const t of MUST) ok(t in canon, "canonical declares --" + t);
eq(canon["navy"], "#002134", "canonical --navy is the Alinma navy");
eq(canon["navy-deep"], "#02141E", "canonical --navy-deep");
eq(canon["peach"], "#E2AD8B", "canonical --peach");
eq(canon["blush"], "#F3E4DE", "canonical --blush");

// -- files that carry embedded copies ----------------------------------------
const deckDir = path.join(DS, "components", "deck06");
const slides = fs.existsSync(deckDir)
  ? fs.readdirSync(deckDir).sort().map(d => path.join(deckDir, d, d + ".html")).filter(f => fs.existsSync(f))
  : [];
const concepts = ["AlinmaOfficial", "SaduAlinma"].map(n =>
  path.join(DS, "components", "concepts", n, n + ".html"));

console.log("\n[2] deck06 slides (" + slides.length + ")");
ok(slides.length === 14, "all 14 deck06 slides found");
for (const f of slides) {
  const name = path.basename(f, ".html");
  const toks = parseTokens(fs.readFileSync(f, "utf8"));
  // required canonical names present (aliases allowed on top, not instead)
  const required = ["navy", "navy-deep", "peach", "ar"];
  const missing = required.filter(t => !(t in toks));
  ok(missing.length === 0, name + ": declares canonical names (missing: " + (missing.join(",") || "none") + ")");
  // any canonical token it declares must match canonical value exactly
  const drift = Object.keys(toks).filter(t => t in canon && toks[t] !== canon[t]);
  ok(drift.length === 0, name + ": no drift from canonical (drift: " + (drift.join(",") || "none") + ")");
}

console.log("\n[3] Alinma concepts");
for (const f of concepts) {
  const name = path.basename(f, ".html");
  ok(fs.existsSync(f), name + ".html exists");
  if (!fs.existsSync(f)) continue;
  const toks = parseTokens(fs.readFileSync(f, "utf8"));
  const drift = Object.keys(toks).filter(t => t in canon && toks[t] !== canon[t]);
  ok(drift.length === 0, name + ": no drift from canonical (drift: " + (drift.join(",") || "none") + ")");
}

console.log("\n========================================================");
console.log("DS-AMAD-TOKENS: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
