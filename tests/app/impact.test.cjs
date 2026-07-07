/* ============================================================================
   impact.test.cjs — TDD for «أثر عهد» impact analytics (JL-3). The judge-facing
   claim: the SAME golden netting that proves 9→2 finds insight ACROSS cohorts —
   k-anonymous netting-efficiency aggregates over honestly-labeled deterministic
   test circles. Golden netting is reused DI-style (called verbatim via the
   roster shim, NEVER reimplemented); integer halalas only; aggregates only
   (never an individual's number); fixture flagged so the screen must label it.
============================================================================ */
const fs = require("fs");
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "app", ...p);
const E = require(P("engine.js"));
const I = require(P("features", "impact.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("impact.test: «أثر عهد» — k-anonymous netting-efficiency aggregates (golden netting via DI)");

/* snapshot the golden roster BEFORE anything runs — the shim must leave zero trace */
const nodesBefore = JSON.stringify(E.NODES);

/* ---- module shape (the exact plan contract) ---- */
eq(I.K_FLOOR, 3, "K_FLOOR === 3 (the k-anonymity floor)");
ok(typeof I.makeSettleFn === "function", "makeSettleFn exists (builds the DI settle function over the GOLDEN engine.netting)");
ok(typeof I.computeCircleImpact === "function", "computeCircleImpact exists");
ok(typeof I.computeImpact === "function", "computeImpact exists");
ok(typeof I.describeImpactAr === "function", "describeImpactAr exists");
ok(Array.isArray(I.FIXTURE_CIRCLES), "FIXTURE_CIRCLES is an array");
ok(I.FIXTURE_CIRCLES.length >= 8, "at least 8 deterministic test circles (got " + I.FIXTURE_CIRCLES.length + ")");

/* ---- fixture integrity: integer halalas, neutral member codes, sizes 3..8 ---- */
const F = I.FIXTURE_CIRCLES;
ok(F.every(c => typeof c.id === "string" && c.id && typeof c.label === "string" && c.label), "every circle has an id + an Arabic label");
ok(new Set(F.map(c => c.id)).size === F.length, "circle ids are unique");
ok(F.every(c => Number.isInteger(c.size) && c.size >= 3 && c.size <= 8), "every circle size is an integer within 3..8");
ok(new Set(F.map(c => c.size)).size >= 3, "sizes are spread (at least 3 distinct sizes — non-trivial buckets)");
ok(F.some(c => c.size === 3) && F.some(c => c.size >= 6), "the spread reaches both small (3) and large (>= 6) circles");
ok(F.every(c => Array.isArray(c.obligations) && c.obligations.length > 0), "every circle carries a non-empty obligations tangle");
ok(F.every(c => c.obligations.every(o => Number.isInteger(o.halalas) && o.halalas > 0)), "every obligation amount is an INTEGER halalas > 0 (no float money)");
ok(F.every(c => c.obligations.every(o => o.halalas % 100 === 0)), "every fixture amount is a whole-SAR multiple (exact ر.س rendering, no fractions)");
ok(F.every(c => c.obligations.every(o => /^م[١٢٣٤٥٦٧٨]$/.test(o.from) && /^م[١٢٣٤٥٦٧٨]$/.test(o.to))), "members are NEUTRAL codes م١..م٨ — never real-looking names with amounts (spine)");
ok(F.every(c => c.obligations.every(o => o.from !== o.to)), "no self-obligation (from !== to)");
ok(F.every(c => {
  const m = new Set();
  c.obligations.forEach(o => { m.add(o.from); m.add(o.to); });
  return m.size === c.size;
}), "each circle's member union matches its declared size exactly");

/* ---- golden reuse: the shim is a byte-identical pass-through on the golden tangle ---- */
const settle = I.makeSettleFn(E);
ok(JSON.stringify(settle(E.IOUS)) === JSON.stringify(E.netting(E.IOUS)), "makeSettleFn(E) on the golden 9-IOU tangle === engine.netting verbatim (golden reuse, not a reimplementation)");
eq(settle(E.IOUS).length, 2, "…and the golden 9→2 result still holds through the shim");

/* ---- computeCircleImpact: conservation + minimality on EVERY fixture circle ---- */
const per = F.map(c => I.computeCircleImpact(c, settle));
ok(per.every(p => p.conservationOk === true), "EVERY circle: conservationOk — each member's net position identical before & after (integer compare)");
ok(per.every((p, i) => p.transfersAfter <= F[i].size - 1), "EVERY circle: transfersAfter <= size-1 (netting minimality bound)");
ok(per.every(p => p.movedAfterH <= p.movedBeforeH), "EVERY circle: money moved does not grow (movedAfterH <= movedBeforeH)");
ok(per.every(p => p.savedH === p.movedBeforeH - p.movedAfterH), "EVERY circle: savedH === movedBeforeH - movedAfterH");
ok(per.every(p => p.transfersAvoided === p.obligationsCount - p.transfersAfter), "EVERY circle: transfersAvoided === obligationsCount - transfersAfter");
ok(per.every(p => [p.obligationsCount, p.transfersAfter, p.transfersAvoided, p.movedBeforeH, p.movedAfterH, p.savedH]
  .every(Number.isInteger)), "EVERY circle: all outputs are integers (halalas + counts, no float anywhere)");
ok(per.every((p, i) => p.id === F[i].id && p.size === F[i].size), "id + size pass through untouched");

/* hand-verified circles (pin the fixtures against the greedy golden netting) */
const byId = {};
per.forEach(p => { byId[p.id] = p; });
eq(byId["TC-01"].transfersAfter, 1, "TC-01 (3 members, 3 obligations): nets to ONE transfer");
eq(byId["TC-01"].savedH, 20000, "TC-01: saves exactly 20,000 halalas of movement");
eq(byId["TC-02"].transfersAfter, 0, "TC-02 (perfect cycle): nets to ZERO transfers — a perfect مقاصّة");
eq(byId["TC-02"].movedAfterH, 0, "TC-02: no money needs to move at all");
eq(byId["TC-04"].transfersAfter, 1, "TC-04 «شقّة الرياض» (chain of 3): collapses to ONE transfer");
eq(byId["TC-04"].movedAfterH, 30000, "TC-04: 90,000 halalas of gross movement becomes 30,000");
eq(byId["TC-07"].transfersAvoided, 0, "TC-07 (already-minimal star): honesty — netting avoids NOTHING here");
eq(byId["TC-07"].movedAfterH, byId["TC-07"].movedBeforeH, "TC-07: money moved unchanged when the tangle is already minimal");

/* empty-tangle safety (mirrors settlement-conserve's empty case) */
const emptyImp = I.computeCircleImpact({ id: "E-0", label: "فارغة", size: 3, obligations: [] }, settle);
eq(emptyImp.transfersAfter, 0, "empty obligations → 0 transfers, no throw");
eq(emptyImp.conservationOk, true, "empty obligations → conserved (vacuously)");

/* ---- computeImpact: totals are the exact integer sums of the per-circle values ---- */
const agg = I.computeImpact(F, settle);
eq(agg.kFloor, 3, "aggregate carries kFloor: 3");
eq(agg.circlesCount, F.length, "circlesCount matches the fixture count");
eq(agg.fixture, true, "fixture === true — the hard-wired honesty flag the screen must render");
const sum = key => per.reduce((a, p) => a + p[key], 0);
eq(agg.totals.obligations, sum("obligationsCount"), "totals.obligations === Σ per-circle obligations");
eq(agg.totals.transfersAfter, sum("transfersAfter"), "totals.transfersAfter === Σ per-circle transfers");
eq(agg.totals.transfersAvoided, sum("transfersAvoided"), "totals.transfersAvoided === Σ per-circle avoided");
eq(agg.totals.movedBeforeH, sum("movedBeforeH"), "totals.movedBeforeH === Σ per-circle moved-before (halalas)");
eq(agg.totals.movedAfterH, sum("movedAfterH"), "totals.movedAfterH === Σ per-circle moved-after (halalas)");
eq(agg.totals.savedH, sum("savedH"), "totals.savedH === Σ per-circle saved (halalas)");
eq(agg.totals.obligations, 54, "the fixture story: 54 obligations across the cohorts");
eq(agg.totals.transfersAfter, 18, "…collapse to 18 transfers (the across-cohorts 54→18)");

/* ---- k-anonymity: only buckets covering >= K_FLOOR circles are exposed ---- */
ok(Array.isArray(agg.buckets) && agg.buckets.length > 0, "buckets array is non-empty");
ok(agg.buckets.every(b => b.count >= agg.kFloor), "EVERY exposed bucket covers at least kFloor circles (k-anonymity holds)");
ok(agg.buckets.every((b, i, arr) => i === 0 || arr[i - 1].size < b.size), "buckets are sorted by size, ascending (deterministic order)");
ok(agg.buckets.every(b => Number.isInteger(b.avgTransfersAvoidedTenths)), "avgTransfersAvoidedTenths is an INTEGER (tenths — no float anywhere)");
const distinctSizes = new Set(F.map(c => c.size)).size;
eq(agg.suppressedBuckets, distinctSizes - agg.buckets.length, "suppressedBuckets counts exactly the size-buckets hidden by the k-floor");
ok(agg.suppressedBuckets > 0, "the default fixture set EXERCISES the k-floor (some buckets are suppressed — the honesty line has real work)");

/* hand-computed bucket averages (integer tenths, floored) */
const bucketOf = s => agg.buckets.filter(b => b.size === s)[0];
eq(bucketOf(3) && bucketOf(3).avgTransfersAvoidedTenths, 20, "size-3 bucket: avoided (2+3+1)/3 → 20 tenths («2٫0»)");
eq(bucketOf(4) && bucketOf(4).avgTransfersAvoidedTenths, 16, "size-4 bucket: avoided (2+1+2)/3 → floor(50/3) = 16 tenths («1٫6»)");
eq(bucketOf(5) && bucketOf(5).avgTransfersAvoidedTenths, 30, "size-5 bucket: avoided (0+4+5)/3 → 30 tenths («3٫0»)");

/* ---- k-floor teeth on synthetic cohorts (count 2 hidden; count 3 shown) ---- */
const syn = id => ({ id: id, label: "دائرة اصطناعيّة", size: 3, obligations: [
  { from: "م١", to: "م٢", halalas: 100 }, { from: "م٢", to: "م٣", halalas: 100 }] });
const agg2 = I.computeImpact([syn("S-1"), syn("S-2")], settle);
eq(agg2.buckets.length, 0, "a size-bucket with only 2 circles is ABSENT from buckets");
eq(agg2.suppressedBuckets, 1, "…and counted in suppressedBuckets (the honesty line)");
const agg3 = I.computeImpact([syn("S-1"), syn("S-2"), syn("S-3")], settle);
eq(agg3.buckets.length, 1, "the same bucket with 3 circles IS exposed");
eq(agg3.buckets[0].count, 3, "…with count 3");
eq(agg3.suppressedBuckets, 0, "…and nothing suppressed");
eq(agg3.buckets[0].avgTransfersAvoidedTenths, 10, "synthetic chain (2 obligations → 1 transfer): avg avoided = 10 tenths («1٫0»)");

/* ---- determinism + purity ---- */
ok(JSON.stringify(I.computeImpact(F, settle)) === JSON.stringify(agg), "computeImpact is deterministic (identical JSON on a second run)");
ok(JSON.stringify(I.computeCircleImpact(F[0], settle)) === JSON.stringify(per[0]), "computeCircleImpact is deterministic too");
const fixturesSnapshot = JSON.stringify(I.FIXTURE_CIRCLES);
I.computeImpact(I.FIXTURE_CIRCLES, settle);
ok(JSON.stringify(I.FIXTURE_CIRCLES) === fixturesSnapshot, "computeImpact does NOT mutate its inputs (pure projection)");
ok(JSON.stringify(E.NODES) === nodesBefore && E.NODES.length === 5, "the golden roster is EXACTLY as it was — the shim leaves zero trace");
eq(E.netting(E.IOUS).length, 2, "the golden 9→2 vector is untouched after all fixture computations");

/* ---- describeImpactAr: honest, aggregate-only Arabic lines, no % glyph ---- */
const d = I.describeImpactAr(agg, E.fmt);
ok(typeof d.heroLine === "string" && Array.isArray(d.totalsLines) && Array.isArray(d.bucketLines)
  && typeof d.honestyLine === "string" && typeof d.conservationLine === "string",
  "describeImpactAr returns { heroLine, totalsLines[], bucketLines[], honestyLine, conservationLine }");
const allText = JSON.stringify(d);
ok(d.honestyLine.indexOf("دوائر تجريبيّة") >= 0, "honestyLine names the data «دوائر تجريبيّة»");
ok(d.honestyLine.indexOf("بيانات اختبار") >= 0, "honestyLine carries the explicit «بيانات اختبار» label");
ok(d.honestyLine.indexOf("لا يُعرَض تجميعٌ لأقلّ من") >= 0, "honestyLine states the k-floor rule");
ok(d.honestyLine.indexOf("حُجِبت") >= 0, "honestyLine reports the suppressed-bucket count when > 0");
ok(allText.indexOf("%") < 0 && allText.indexOf("٪") < 0, "NO percentage glyph (%/٪) anywhere in the described lines");
ok(!/م[١٢٣٤٥٦٧٨]/.test(allText), "aggregates only — no individual member code appears in any line");
eq(d.bucketLines.length, agg.buckets.length, "one bucket line per exposed bucket");
ok(d.bucketLines.every(l => l.indexOf("متوسّط التحويلات الموفَّرة") >= 0), "bucket lines carry «متوسّط التحويلات الموفَّرة»");
ok(d.bucketLines.some(l => l.indexOf("1٫6") >= 0), "tenths render with the Arabic decimal separator from INTEGER tenths («1٫6» — string math, no float)");
ok(d.bucketLines.some(l => l.indexOf("2٫0") >= 0), "a round average renders as «2٫0» (tenth always shown)");
ok(d.conservationLine.indexOf("بالهللة") >= 0, "conservationLine states the proof in halalas («بالهللة»)");
ok(d.heroLine.indexOf("54") >= 0 && d.heroLine.indexOf("18") >= 0, "heroLine carries the across-cohorts 54→18 (fmtN-formatted)");
ok(d.totalsLines.join(" ").indexOf("7,400") >= 0, "totals render moved-before as whole SAR via fmtN (7,400 ر.س from 740,000 halalas)");
ok(d.totalsLines.join(" ").indexOf("2,470") >= 0, "totals render moved-after as whole SAR via fmtN (2,470 ر.س)");
ok(d.totalsLines.some(l => l.indexOf("وفّرت المقاصّةُ تحريكَ") >= 0 && l.indexOf("4,930") >= 0), "the saved line reads «وفّرت المقاصّةُ تحريكَ 4,930 ر.س»");
ok(JSON.stringify(I.describeImpactAr(agg, E.fmt)) === JSON.stringify(d), "describeImpactAr is deterministic");

/* ---- source purity: the module carries no nondeterminism/networking primitive
   (raw-text scan, mirroring app-offline.test.cjs's token list — comments included,
   so the implementation must not even name these tokens verbatim) ---- */
const src = fs.readFileSync(P("features", "impact.js"), "utf8");
["Date.now", "new Date", "Math.random", "Intl.", ".toLocaleString", "fetch(", "XMLHttpRequest", "WebSocket"].forEach(tok =>
  ok(src.indexOf(tok) < 0, "module source has no «" + tok + "»"));
ok(src.indexOf("٪") < 0, "module source contains no Arabic percent glyph ٪");

console.log("\n========================================================");
console.log("IMPACT: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
