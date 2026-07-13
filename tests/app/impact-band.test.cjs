/* ============================================================================
   impact-band.test.cjs — TDD for the national compression SENSITIVITY BAND
   (Front D, data-rigor fix D1). The panel flagged the old single-point
   projection (features/impact-national.js: one ratio from 12 synthetic
   circles, multiplied across the cited D-1 count) as fragile false precision.
   features/impact-band.js replaces the point with a p10/p50/p90 BAND over 200
   deterministically-generated synthetic circles, netted via the SAME golden
   engine (dependency-injected, never reimplemented). This asserts: byte-exact
   determinism, integer-only arithmetic throughout, p10<=p50<=p90 monotonicity,
   that the band actually BRACKETS the old single point (not assumed — checked
   against a live, independently-computed value), and source purity.
============================================================================ */
const fs = require("fs");
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "app", ...p);
const E = require(P("engine.js"));
const Impact = require(P("features", "impact.js"));
const IN = require(P("features", "impact-national.js"));
const Band = require(P("features", "impact-band.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("impact-band.test: national compression SENSITIVITY BAND (deterministic · integer · brackets the old point)");

/* snapshot the golden roster BEFORE anything runs — the shim must leave zero trace */
const nodesBefore = JSON.stringify(E.NODES);

/* ---- module shape ---- */
ok(typeof Band.generateCircles === "function", "generateCircles exists");
ok(typeof Band.band === "function", "band exists");
ok(typeof Band.describeBandAr === "function", "describeBandAr exists");
ok(typeof Band.percentileOf === "function", "percentileOf exists");
eq(Band.CIRCLE_COUNT, 200, "CIRCLE_COUNT is 200 (the spec's 'many' plausible circles)");
ok(Band.MIN_SIZE >= 3 && Band.MAX_SIZE <= 8 && Band.MIN_SIZE < Band.MAX_SIZE, "circle size range is bounded (matches the shipped fixture set's 3..8)");
ok(/توضيحيّ/.test(Band.LABEL) && /لا رقمٌ مُقاس/.test(Band.LABEL), "LABEL is hard-labelled illustrative — never presented as measured");

/* ---- generateCircles(): the honestly-bounded parameter space ---- */
const circles = Band.generateCircles();
eq(circles.length, Band.CIRCLE_COUNT, "generateCircles returns exactly CIRCLE_COUNT circles");
ok(circles.every(c => Number.isInteger(c.size) && c.size >= Band.MIN_SIZE && c.size <= Band.MAX_SIZE), "every circle's size is an integer within the bounded range");
ok(circles.every(c => Array.isArray(c.edges) && c.edges.length > 0), "every circle has a non-empty edge list");
ok(circles.every(c => c.edges.every(e => Number.isInteger(e.amount) && e.amount > 0)), "every edge amount is an integer halalas > 0 (no float money)");
ok(circles.every(c => c.edges.every(e => e.amount % 1000 === 0)), "every edge amount is a whole-1000-halalas step (10 SAR — transparent, bounded)");
ok(circles.every(c => c.edges.every(e => e.from !== e.to)), "no self-obligation (from !== to) in any generated circle");
ok(new Set(circles.map(c => c.archetype)).size === 3 && circles.every(c => ["balanced", "star", "tangle"].indexOf(c.archetype) >= 0),
  "every circle is one of the three archetypes already present in the shipped 12-fixture set, and all three appear");

/* generateCircles is a pure function of the fixed SEED — calling it again gives byte-identical output */
ok(JSON.stringify(Band.generateCircles()) === JSON.stringify(circles), "generateCircles is deterministic (identical JSON on a second call)");

/* ---- the band itself, computed via the SAME injected settleFn features/impact.js's
   consumers already build (golden netting reused, never reimplemented) ---- */
const settleFn = Impact.makeSettleFn(E);
const requests = IN.EXTERNAL_STAT.requests;
const band = Band.band(settleFn, requests);

/* ---- integer-only throughout (no float money, no persisted float anywhere) ---- */
["ratioP10", "ratioP50", "ratioP90", "projectedP10", "projectedP50", "projectedP90",
  "projectedP10Thousands", "projectedP50Thousands", "projectedP90Thousands", "requests"].forEach(k =>
  ok(Number.isInteger(band[k]), "band." + k + " is a plain integer (got " + JSON.stringify(band[k]) + ")"));

/* ---- monotonicity: p10 <= p50 <= p90 by construction (percentiles of one sorted array) ---- */
ok(band.ratioP10 <= band.ratioP50 && band.ratioP50 <= band.ratioP90, "ratio percentiles are monotonic: p10 <= p50 <= p90");
ok(band.projectedP10 <= band.projectedP50 && band.projectedP50 <= band.projectedP90, "projected-count percentiles are monotonic: p10 <= p50 <= p90");
ok(band.projectedP10Thousands <= band.projectedP50Thousands && band.projectedP50Thousands <= band.projectedP90Thousands, "rounded-thousands percentiles are monotonic: p10 <= p50 <= p90");

/* ---- projection arithmetic is pure integer floor division (no spurious precision) ---- */
eq(band.projectedP10, Math.floor(requests * band.ratioP10 / 1000), "projectedP10 = floor(requests * ratioP10 / 1000)");
eq(band.projectedP50, Math.floor(requests * band.ratioP50 / 1000), "projectedP50 = floor(requests * ratioP50 / 1000)");
eq(band.projectedP90, Math.floor(requests * band.ratioP90 / 1000), "projectedP90 = floor(requests * ratioP90 / 1000)");
eq(band.projectedP10Thousands, Math.floor(band.projectedP10 / 1000), "projectedP10Thousands = floor(exact / 1000) — pure integer division");
eq(band.projectedP90Thousands, Math.floor(band.projectedP90 / 1000), "projectedP90Thousands = floor(exact / 1000) — pure integer division");

/* ---- the band BRACKETS the old single-point projection — checked against a LIVE,
   independently-computed value (not hardcoded, not assumed) ---- */
const measured = Impact.computeImpact(Impact.FIXTURE_CIRCLES, Impact.makeSettleFn(E)).totals;
const oldScenario = IN.scenario(measured, IN.EXTERNAL_STAT);
ok(band.projectedP10 <= oldScenario.projectedSettlements, "band's p10 <= the old single-point projection");
ok(oldScenario.projectedSettlements <= band.projectedP90, "the old single-point projection <= band's p90 — the band BRACKETS it");

/* ---- determinism: same seed => byte-identical band across two INDEPENDENT requires ---- */
const modPath = P("features", "impact-band.js");
delete require.cache[require.resolve(modPath)];
const Band2 = require(modPath);
const settleFn2 = Impact.makeSettleFn(E);
const band2 = Band2.band(settleFn2, requests);
ok(JSON.stringify(band2) === JSON.stringify(band), "band() is byte-identical across two independent requires of the module (same seed)");

/* calling band() twice in the SAME require is also deterministic (pure function) */
ok(JSON.stringify(Band.band(Impact.makeSettleFn(E), requests)) === JSON.stringify(band), "band() is deterministic on repeated calls (pure function)");

/* ---- the golden roster is untouched — the DI shim leaves zero trace across 200 circles ---- */
ok(JSON.stringify(E.NODES) === nodesBefore && E.NODES.length === 5, "the golden roster is EXACTLY as it was after generating + netting 200 synthetic circles");
eq(E.netting(E.IOUS).length, 2, "the golden 9→2 vector is untouched after all band computations");

/* ---- describeBandAr: honest Arabic lines, labels the illustrative model, never blends
   the reference (old) point into the model itself ---- */
const dNoRef = Band.describeBandAr(band, E.fmt);
ok(typeof dNoRef.rangeLine === "string" && typeof dNoRef.methodLine === "string", "describeBandAr returns { rangeLine, methodLine, refLine }");
ok(dNoRef.refLine === null, "refLine is null when no reference value is supplied (never fabricated)");
ok(dNoRef.rangeLine.indexOf(Band.LABEL) >= 0, "rangeLine carries the hard illustrative label");
ok(dNoRef.methodLine.indexOf("200") >= 0 || dNoRef.methodLine.indexOf(String(Band.CIRCLE_COUNT)) >= 0, "methodLine states the circle count");
ok(dNoRef.methodLine.indexOf("عهد الاثنتي عشرة") >= 0, "methodLine traces the archetypes back to the shipped 12-fixture set (no invented provenance)");

const dRefInside = Band.describeBandAr(band, E.fmt, oldScenario.projectedThousands);
ok(dRefInside.refLine.indexOf("تقع داخل هذا النطاق") >= 0, "refLine correctly reports the old point as INSIDE the band (it is, per the bracket check above)");

const dRefOutside = Band.describeBandAr(band, E.fmt, band.projectedP90Thousands + 999999);
ok(dRefOutside.refLine.indexOf("خارج هذا النطاق") >= 0, "refLine correctly reports an out-of-range reference value as OUTSIDE the band (no false 'inside' claim)");

/* ---- source purity: no networking/nondeterminism primitive (belt-and-suspenders on
   top of app-offline.test.cjs's whole-app scan) ---- */
const src = fs.readFileSync(P("features", "impact-band.js"), "utf8");
["Date.now", "new Date", "Math.random", "Intl.", ".toLocaleString", "fetch(", "XMLHttpRequest", "WebSocket"].forEach(tok =>
  ok(src.indexOf(tok) < 0, "impact-band.js: no forbidden primitive «" + tok + "»"));

console.log("\n========================================================");
console.log("IMPACT-BAND: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
