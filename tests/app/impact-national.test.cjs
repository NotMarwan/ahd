/* ============================================================================
   impact-national.test.cjs — TDD for the national compression SCENARIO (Front D,
   data). Splices two things the project HAD but never combined: (a) Ahd's own
   MEASURED netting compression (obligations→transfers, from the golden engine)
   and (b) the cited KSA execution-court load (EVIDENCE-BRIEF D-1). The result is
   an on-screen, honestly-labelled illustrative scenario — integer counts only,
   provenance never blended, the source + its stale vintage stated.
============================================================================ */
const path = require("path");
const IN = require(path.join(__dirname, "..", "..", "app", "features", "impact-national.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };

console.log("impact-national.test: national compression SCENARIO (illustrative · integer · cited)");

const measured = { obligations: 54, transfersAfter: 18 };  // example aggregate (the screen uses the LIVE engine total)
const s = IN.scenario(measured, IN.EXTERNAL_STAT);

ok(Number.isInteger(s.projectedSettlements) && Number.isInteger(s.avoided), "projection is integer counts (never a money float)");
ok(s.projectedSettlements < s.requests, "netting projects FEWER settlements than raw requests");
ok(s.avoided === s.requests - s.projectedSettlements, "avoided = requests − projected (the arithmetic conserves)");
ok(s.projectedSettlements === Math.floor(571251 * 18 / 54), "applies the MEASURED ratio to the cited request count");
ok(/توضيحيّ/.test(s.label) && /لا رقمٌ مُقاس/.test(s.label), "hard-labelled illustrative — NOT presented as measured");
ok(/EVIDENCE-BRIEF/.test(s.source) && /٢٠٢٠/.test(s.vintage), "cites the source + its (stale) vintage honestly");
ok(!/[0-9]\s*[%٪]/.test(JSON.stringify(s)), "no percentage glyph — the share reads as «من كلّ ١٠٠»");
ok(IN.EXTERNAL_STAT.requests === 571251, "the external stat is the cited 571,251 enforcement requests");
ok(Object.isFrozen(IN.EXTERNAL_STAT), "the external stat is frozen — provenance never blends with fixtures");
ok(JSON.stringify(IN.scenario(measured, IN.EXTERNAL_STAT)) === JSON.stringify(s), "scenario is deterministic (pure)");
ok(typeof IN.scenario({ obligations: 0, transfersAfter: 0 }, IN.EXTERNAL_STAT).projectedSettlements === "number", "guards divide-by-zero (obligations = 0)");

/* ---- display-only rounded magnitudes (data-honesty fix: no spurious 6-figure
   precision on a synthetic-ratio projection — round DOWN to the nearest thousand,
   render as «نحو X ألف», never the exact six-digit product) ---- */
ok(s.projectedThousands === 190, "projectedThousands rounds 190,417 down to 190 (thousands)");
ok(s.avoidedThousands === 380, "avoidedThousands rounds 380,834 down to 380 (thousands)");
ok(Number.isInteger(s.projectedThousands) && Number.isInteger(s.avoidedThousands), "rounded magnitudes are plain integers (no float math)");
ok(s.projectedThousands === Math.floor(s.projectedSettlements / 1000), "projectedThousands = floor(exact / 1000) — pure integer division");
ok(s.avoidedThousands === Math.floor(s.avoided / 1000), "avoidedThousands = floor(exact / 1000) — pure integer division");

console.log("\nimpact-national: " + pass + "/" + (pass + fail) + (fail ? "  (" + fail + " FAILED)" : ""));
process.exit(fail ? 1 : 0);
