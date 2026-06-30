/* ============================================================================
   determinism.test.cjs — RELOAD determinism. The engine is pure & offline, so
   two INDEPENDENT loads (require → bust the require cache → require again) must
   produce byte-identical golden outputs. If anything differed across loads, the
   engine would be carrying hidden state (Date.now / Math.random / module-level
   mutation) — exactly what «عهد» must never do. Also pins the absolute golden
   seal + the netting cardinality so a silent value drift is caught here too.
============================================================================ */
const path = require("path");

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("determinism.test: byte-identical across two independent engine loads");

const enginePath = path.join(__dirname, "..", "..", "app", "engine.js");

/* capture a full golden snapshot from a freshly-required engine instance */
function snapshot(E) {
  return {
    sealedSeal: E.SEALED.seal,
    canonicalHash: E.SEALED.canonical_hash,
    genesis: E.GENESIS,
    nettingJson: JSON.stringify(E.netting(E.IOUS)),
    nettingLen: E.netting(E.IOUS).length,
    balancesJson: JSON.stringify(E.balancesOf(E.IOUS)),
    demoSeal: E.circleSeal(E.DEMO_CIRCLE),
    standingSeal: E.circleSeal(E.STANDING_CIRCLE),
    demoCanonical: E.circleCanonical(E.DEMO_CIRCLE),
    standingCanonical: E.circleCanonical(E.STANDING_CIRCLE),
    circleIousJson: JSON.stringify(E.CIRCLE_IOUS),
    muqassaSeals: JSON.stringify(E.MUQASSA_CIRCLES.map(c => E.circleSeal(c))),
    trustBands: JSON.stringify(Object.fromEntries(E.NODES.map(n => [n, E.TRUST[n].band]))),
    trustRatios: JSON.stringify(Object.fromEntries(E.NODES.map(n => [n, E.TRUST[n].ratio]))),
    verifyOk: JSON.stringify(E.verifyRecord(null)),
    verifyTamper: JSON.stringify(E.verifyRecord(9999)),
    agTermsHash: E.AG.terms_hash,
    foldDemo: E.foldCircle(E.DEMO_CIRCLE).status,
    foldStanding: E.foldCircle(E.STANDING_CIRCLE).status
  };
}

/* --- load #1 --- */
const E1 = require(enginePath);
const snap1 = snapshot(E1);

/* --- bust the require cache, load #2 (a genuinely independent module instance) --- */
delete require.cache[require.resolve(enginePath)];
const E2 = require(enginePath);
const snap2 = snapshot(E2);

/* prove the two requires really produced DISTINCT module objects (cache was busted) */
ok(E1 !== E2, "cache busted: the two requires returned distinct module instances");
ok(E1.SEALED !== E2.SEALED, "cache busted: SEALED objects are distinct instances (not the cached one)");

/* every captured output must be byte-identical across the two independent loads */
const keys = Object.keys(snap1);
for (const key of keys) {
  eq(snap2[key], snap1[key], "reload-stable: " + key + " is byte-identical across loads");
}

/* --- absolute pins (these MUST never drift) --- */
eq(snap1.sealedSeal, "6c9410b95ba4715a3c2b174ff70aa2d7ab88fa0294868a41354d2f9e60f7fd18",
  "PIN: SEALED.seal == the golden 6c9410b9… digest");
eq(snap1.nettingLen, 2, "PIN: netting(IOUS) reduces the 9-IOU tangle to exactly 2 transfers");

/* third load to be thorough: still identical (idempotent under repeated reload) */
delete require.cache[require.resolve(enginePath)];
const E3 = require(enginePath);
eq(E3.SEALED.seal, snap1.sealedSeal, "third independent load: seal still identical");
eq(E3.circleSeal(E3.DEMO_CIRCLE), snap1.demoSeal, "third independent load: DEMO_CIRCLE seal still identical");
eq(E3.circleSeal(E3.STANDING_CIRCLE), snap1.standingSeal, "third independent load: STANDING_CIRCLE seal still identical");
eq(JSON.stringify(E3.netting(E3.IOUS)), snap1.nettingJson, "third independent load: netting output still identical");

/* sanity: the snapshot actually covered a meaningful surface */
ok(keys.length >= 18, "snapshot covered a broad surface (" + keys.length + " golden outputs)");

console.log("\n========================================================");
console.log("DETERMINISM: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
