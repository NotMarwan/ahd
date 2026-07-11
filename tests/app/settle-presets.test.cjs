/* ============================================================================
   settle-presets.test.cjs — TDD for features/settle-presets.js: alternative
   demo tangles for «المقاصّة». Every preset uses ONLY the golden five names
   (no roster shim needed), whole-SAR integer amounts, and must (a) conserve
   every member's net through the GOLDEN netting and (b) never increase the
   transfer count. Default preset "golden" IS engine.IOUS byte-identically.
============================================================================ */
const path = require("path");
const ROOT = path.join(__dirname, "..", "..", "app");
const engine = require(path.join(ROOT, "engine.js"));
const S = require(path.join(ROOT, "features", "settlement.js"));
const P = require(path.join(ROOT, "features", "settle-presets.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("settle-presets.test: alternative tangles through the golden netting");

(function goldenDefault() {
  eq(P.PRESETS[0].key, "golden", "first preset is the golden tangle");
  const edges = P.edgesFor("golden", engine);
  ok(edges === engine.IOUS, "golden preset returns engine.IOUS ITSELF (byte-identical, no copy)");
})();

(function presetShape() {
  ok(P.PRESETS.length >= 3, "at least 3 presets (golden + 2 alternatives)");
  P.PRESETS.forEach(p => {
    const edges = P.edgesFor(p.key, engine);
    ok(edges.length > 0, p.key + ": has edges");
    ok(edges.every(t => engine.NODES.indexOf(t.from) >= 0 && engine.NODES.indexOf(t.to) >= 0),
      p.key + ": every name is one of the golden five (no roster shim)");
    ok(edges.every(t => Number.isInteger(t.amount) && t.amount > 0), p.key + ": whole-SAR integer amounts");
    ok(typeof p.labelAr === "string" && p.labelAr.length > 0, p.key + ": has an Arabic label");
  });
})();

(function conservationEverywhere() {
  P.PRESETS.forEach(p => {
    const edges = P.edgesFor(p.key, engine);
    const cp = S.conservationProof(edges, engine);
    ok(cp.conserved && cp.netsPreserved, p.key + ": golden netting conserves every member's net");
    const v = S.settlementView(edges, engine);
    ok(v.afterCount <= v.beforeCount, p.key + ": netting never adds transfers (" + v.beforeCount + "→" + v.afterCount + ")");
  });
})();

(function reductionIsVisible() {
  // the alternative presets must actually DEMONSTRATE reduction (not 3→3)
  P.PRESETS.filter(p => p.key !== "golden").forEach(p => {
    const v = S.settlementView(P.edgesFor(p.key, engine), engine);
    ok(v.afterCount < v.beforeCount, p.key + ": visibly reduces (" + v.beforeCount + "→" + v.afterCount + ")");
  });
})();

(function unknownKeyFallsBack() {
  ok(P.edgesFor("nope", engine) === engine.IOUS, "unknown key falls back to the golden tangle");
})();

console.log("\n========================================================");
console.log("SETTLE-PRESETS: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
