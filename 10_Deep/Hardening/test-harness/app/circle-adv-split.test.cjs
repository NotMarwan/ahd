/* ============================================================================
   circle-adv-split.test.cjs — TDD for the DEEPENED «بالأصناف» split: a PER-ITEM
   conservation proof (each item's shares sum to its cost exactly, via the golden
   respread — no fraction creates phantom riba). Pure, deterministic, integer halalas.
============================================================================ */
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", ...p);
const E = require(P("engine.js"));
const CA = require(P("features", "circle-adv.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("circle-adv-split.test: per-item conservation of the «بالأصناف» split");

/* items whose costs do NOT divide evenly among assignees → respread must still conserve */
const items = [
  { label: "ستيك", amountMinor: E.toMinor(300), assignedTo: ["خالد"] },
  { label: "بيتزا مشتركة", amountMinor: E.toMinor(200), assignedTo: ["خالد", "ريم", "نورة"] }, // 20000/3 = 6667+6667+6666
  { label: "عصائر", amountMinor: E.toMinor(100), assignedTo: ["ريم", "نورة", "خالد"] }          // 10000/3 = 3334+3333+3333
];

ok(typeof CA.splitConservation === "function", "splitConservation exists");
const sc = CA.splitConservation(items, E);

eq(sc.perItem.length, 3, "the proof covers every item");
ok(sc.perItem.every(x => Number.isInteger(x.itemMinor)), "every item cost is an integer halala amount");
ok(sc.perItem.every(x => x.shares.reduce((a, p) => a + p, 0) === x.itemMinor), "PER-ITEM: each item's shares sum to its cost EXACTLY (respread conserves)");
ok(sc.perItem.every(x => x.conserved), "every item is marked conserved");
ok(sc.allConserved === true, "allConserved is true when every item conserves");
eq(sc.totalMinor, E.toMinor(600), "total = 300 + 200 + 100 = 600 SAR");
/* the indivisible item is genuinely uneven yet exact */
const pizza = sc.perItem.find(x => x.label === "بيتزا مشتركة");
ok(pizza.shares.length === 3 && pizza.shares[0] !== pizza.shares[2], "the 200/3 split is uneven (6667/6667/6666) — yet conserves");
ok(sc.perItem.every(x => x.shares.every(Number.isInteger)), "every share is an integer halala (no float, no phantom riba)");

/* ---- the grand byCategorySplit still agrees + golden respread is reused ---- */
const bc = CA.byCategorySplit(items, ["خالد", "ريم", "نورة"], E);
eq(bc.totalMinor, sc.totalMinor, "splitConservation total agrees with byCategorySplit");
ok(bc.conserved && sc.allConserved, "both the grand and per-item proofs hold");

/* ---- determinism + empty safety ---- */
ok(JSON.stringify(CA.splitConservation(items, E)) === JSON.stringify(sc), "splitConservation is deterministic");
const empty = CA.splitConservation([], E);
ok(empty.allConserved === true && empty.totalMinor === 0, "empty items → conserved (vacuously), total 0, no throw");
ok(!/\d{1,3}\s*[%٪]/.test(JSON.stringify(sc)), "no percentage/score in the split proof");

console.log("\n========================================================");
console.log("CIRCLE-ADV-SPLIT: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
