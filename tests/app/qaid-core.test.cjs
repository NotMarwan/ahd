const path = require("path");

let Q;
try { Q = require(path.join(__dirname, "..", "..", "app", "features", "qaid.js")); }
catch (error) { console.log("QAID CORE RED: " + error.message); process.exit(1); }

let passed = 0, failed = 0;
const ok = (condition, name) => condition ? (passed++, console.log("  ✓ " + name)) : (failed++, console.log("  ✗ " + name));
const rejects = (fn, name) => { try { fn(); ok(false, name); } catch (_) { ok(true, name); } };

const empty = Q.makeState("أنت");
const one = Q.addQaid(empty, { direction: "lahum", name: "سالم", amountMinor: 12550, noteAr: "قهوة ومشتريات" });
const two = Q.addQaid(one, { direction: "alayya", name: "نورة", amountMinor: 9000, noteAr: "تذكرة" });

ok(empty.qaids.length === 0 && one.qaids.length === 1 && two.qaids.length === 2, "addQaid appends immutably");
ok(one.qaids[0].id === "Q-0001" && two.qaids[1].id === "Q-0002", "IDs are deterministic");
ok(one.qaids[0].labelAr === "قيد شخصي — غير مختوم", "personal entry is clearly unsealed");
const grouped = Q.qaidList(two, "all");
ok(grouped.lahum.length === 1 && grouped.alayya.length === 1, "qaidList groups both directions");
ok(Q.qaidList(two, "open").all.length === 2, "open filter returns unsettled entries");

const settled = Q.settleQaid(two, "Q-0001");
ok(two.qaids[0].events.length === 1 && settled.qaids[0].events.length === 2, "settleQaid appends an event immutably");
ok(Q.qaidList(settled, "settled").all[0].id === "Q-0001", "settled filter returns paid entry");
ok(Q.isSettled(settled.qaids[0]) === true, "settlement fold marks paid");

rejects(() => Q.addQaid(empty, { direction: "wrong", name: "سالم", amountMinor: 100 }), "rejects invalid direction");
rejects(() => Q.addQaid(empty, { direction: "lahum", name: "", amountMinor: 0 }), "rejects empty name and non-positive money");

console.log(`\nQAID CORE: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
