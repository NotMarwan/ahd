/* ============================================================================
   circle.test.cjs — TDD for features/circle.js (the basic treasurer dashboard
   view-model, Agent-4 G3). A thin projection over the GOLDEN circle engine
   (makeCircle/foldCircle/circleShares/circleSeal/statusLabel), reused untouched.
============================================================================ */
const path = require("path");
const engine = require(path.join(__dirname, "..", "..", "app", "engine.js"));
const C = require(path.join(__dirname, "..", "..", "app", "features", "circle.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("circle.test: treasurer-dashboard view-model");

const dash = C.circleDashboard(engine.DEMO_CIRCLE, engine);
eq(dash.name, "رحلة العلا", "dashboard carries the circle name");
eq(dash.organizer, "لُجين", "dashboard carries the organizer (treasurer)");
ok(dash.members.length === 5, "5 members (organizer + 4)");
eq(dash.debtCount, 4, "4 are debtors (organizer's own share isn't a debt)");
/* equal split of 8,000 among 5 → 1,600 each; owed = 4×1,600 = 6,400 */
eq(dash.owedSAR, 6400, "total owed = 6,400 SAR");
eq(dash.collectedSAR, 1600, "collected so far = 1,600 (نورة paid)");
ok(/جُمِع بعضها|بعضها/.test(dash.statusAr), "status = «جُمِع بعضها» (CIRCLE_PARTIAL)");
/* per-member dignified states (own labels via the engine) */
const by = {}; dash.members.forEach(m => by[m.name] = m);
ok(by["لُجين"].self === true, "organizer flagged as self (already covered)");
ok(/ذمّة محفوظة/.test(by["نورة"].stateAr), "نورة → «ذمّة محفوظة» (paid)");
ok(/نشِط/.test(by["سارة"].stateAr), "سارة → «نشِط» (active)");
ok(/مؤجّل بالتراضي/.test(by["خالد"].stateAr), "خالد → «مؤجّل بالتراضي» (grace, dignified)");
/* one sealed proof for the whole occasion */
ok(typeof dash.seal === "string" && dash.seal.length === 64, "the circle has ONE sealed proof (SHA-256)");
eq(dash.seal, engine.circleSeal(engine.DEMO_CIRCLE), "dashboard seal == engine.circleSeal (reused, not reinvented)");

/* a fully-kept circle reads «ذمّة المناسبة محفوظة» */
const kept = engine.makeCircle({ id: "K", mode: "occasion", name: "ع", type: "t", organizer: "أ",
  participants: ["أ", "ب", "ج"], totalMinor: engine.toMinor(300), split: "equal", states: { "ب": "kept", "ج": "kept" } });
ok(/ذمّة المناسبة محفوظة/.test(C.circleDashboard(kept, engine).statusAr), "all-paid circle → «ذمّة المناسبة محفوظة»");

console.log("\n========================================================");
console.log("CIRCLE: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
