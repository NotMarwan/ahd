/* ============================================================================
   settlement.test.cjs — TDD for features/settlement.js. A thin view-model over
   the GOLDEN Muqassa (engine.netting/balancesOf/muqassaLegs, reused untouched):
   the 9-IOU tangle → 2 transfers, with consent legs + the conservation proof.
============================================================================ */
const path = require("path");
const engine = require(path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", "engine.js"));
const S = require(path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", "features", "settlement.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("settlement.test: Muqassa view-model");

const v = S.settlementView(engine.IOUS, engine);
eq(v.beforeCount, 9, "9 IOUs go in");
eq(v.afterCount, 2, "Muqassa nets them to 2 transfers (9→2)");
ok(v.afterCount < v.beforeCount, "settlement strictly reduces the number of transfers");
eq(v.conserved, true, "conservation: Σ net positions == 0");
/* golden net positions (the directive's pinned values) */
eq(v.balances["نورة"], -900, "net نورة = −900 (golden)");
eq(v.balances["خالد"], 600, "net خالد = +600 (golden)");
eq(v.balances["فهد"], 300, "net فهد = +300 (golden)");
ok(Array.isArray(v.after) && v.after.every(t => t.from && t.to && typeof t.amount === "number"), "after-transfers are well-formed {from,to,amount}");
ok(v.legs.length > 0, "per-member consent legs are derived (consented novation)");
/* the sum of the 2 transfers equals the total moved, and creditors net out */
const moved = v.after.reduce((a, t) => a + t.amount, 0);
eq(moved, 900, "total moved by the 2 transfers == 900 SAR");

console.log("\n========================================================");
console.log("SETTLEMENT: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
