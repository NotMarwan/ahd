/* ============================================================================
   engine-parity.cjs — proves project/ahd-app/engine.js is a FAITHFUL copy of the
   demo's pure AHD-LOGIC region: same golden outputs AND byte-identical slice.

   This is the drift guard for the parallel app. If anyone ever edits the demo's
   logic, this test fails until engine.js is regenerated (node build-engine.cjs).
   The demo itself is NEVER touched by this or the generator (read-only slice).
============================================================================ */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { loadLogic, extractPure, readHtml } = require("../load-logic.cjs");

const ENGINE_PATH = path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", "engine.js");

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; console.log("  ✓ " + msg); } else { fail++; console.log("  ✗ " + msg); } };

console.log("engine-parity: faithful-copy proof for project/ahd-app/engine.js");

if (!fs.existsSync(ENGINE_PATH)) {
  console.log("  ✗ engine.js not generated yet (run: node build-engine.cjs)");
  console.log("\n========================================================");
  console.log("ENGINE PARITY: 0 passed, 1 failed  (engine.js missing)");
  console.log("========================================================");
  process.exit(1);
}

const demo = loadLogic();
const engine = require(ENGINE_PATH);

/* (a) it loads and exposes the full API surface */
const API = ["sha256","canonical","sealBlock","recomputeSeal","verifyRecord","fmt","respread",
  "netting","balancesOf","muqassaLegs","ribaScan","trustSignal","fold","statusLabel",
  "makeCircle","foldCircle","circleSeal","circleToIous","circleBalances",
  "SEALED","IOUS","NODES","DEMO_CIRCLE","STANDING_CIRCLE","SEED_AHDS"];
API.forEach(k => ok(engine[k] !== undefined, "engine exposes " + k));

/* (b) golden behavioral parity — engine reproduces the demo's frozen outputs */
ok(engine.SEALED.seal === demo.SEALED.seal, "seal parity (" + demo.SEALED.seal.slice(0,8) + "…)");
ok(engine.SEALED.canonical_hash === demo.SEALED.canonical_hash, "canonical_hash parity");
ok(engine.verifyRecord(null).ok === true, "verifyRecord(null) intact == ok");
ok(engine.verifyRecord(9999).ok === false, "verifyRecord(tamper) caught");
ok(JSON.stringify(engine.netting(engine.IOUS)) === JSON.stringify(demo.netting(demo.IOUS)),
   "netting parity (9 IOUs → same transfers)");
ok(engine.netting(engine.IOUS).length === 2, "netting reduces 9 → 2 transfers");
ok(engine.circleSeal(engine.DEMO_CIRCLE) === demo.circleSeal(demo.DEMO_CIRCLE), "DEMO_CIRCLE seal parity");
ok(engine.circleSeal(engine.STANDING_CIRCLE) === demo.circleSeal(demo.STANDING_CIRCLE), "STANDING_CIRCLE seal parity");
ok(engine.fmt(5000) === demo.fmt(5000) && engine.fmt(5000) === "5,000", "fmt parity (grouping)");
ok(JSON.stringify(engine.respread(100001,3)) === JSON.stringify(demo.respread(100001,3)),
   "respread parity (sum-preserving split)");
ok(engine.ribaScan("بلا فائدة").verdict === "clean",
   "ribaScan negation parity («بلا فائدة» clean)");

/* (c) byte-faithful: engine.js literally contains the exact demo AHD-LOGIC slice */
const slice = extractPure(readHtml());
const engineSrc = fs.readFileSync(ENGINE_PATH, "utf8");
ok(engineSrc.includes(slice), "engine.js contains the exact demo AHD-LOGIC slice (byte-faithful copy)");

console.log("\n========================================================");
console.log("ENGINE PARITY: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
