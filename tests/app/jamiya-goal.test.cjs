const path = require("path");
let JG;
try { JG = require(path.join(__dirname, "..", "..", "app", "features", "jamiya-goal.js")); }
catch (e) { console.log("JAMGOAL RED: " + e.message); process.exit(1); }
let passed = 0, failed = 0;
const ok = (c, n) => c ? (passed++, console.log("  ✓ " + n)) : (failed++, console.log("  ✗ " + n));

const jam = { members: ["أ", "ب", "ج"], monthlyMinor: 100000, payments: [{}, {}, {}] };  // 3 of 9 payments
const d = JG.describe("جهاز عرس أخي", jam);
ok(d.goalAr === "جهاز عرس أخي", "goal text kept");
ok(d.progress.done === 3 && d.progress.total === 9 && d.progress.pct === 33, "progress from payments: 3/9 → 33%");
ok(d.promiseFreeAr === "هدف وصفي — لا وعد مالي ولا عائد", "the promise-free line is fixed (MoneyFellows rejection stays rejected)");

const empty = JG.describe("", { members: ["أ", "ب"], monthlyMinor: 5000, payments: [] });
ok(empty.progress.pct === 0 && empty.goalAr === "", "empty goal + no payments safe");

const sc = JG.scenarios(100000, [6, 10, 12]);
ok(sc.length === 3 && sc[0].months === 6, "one scenario per option");
ok(sc.every(s => s.totalMinor === s.perRoundMinor * s.months), "every scenario conserves: total = perRound × months");
ok(sc[0].perRoundMinor === 100000 && sc[0].totalMinor === 600000, "scenario math in integer halalas");
ok(JSON.stringify(JG.scenarios(100000, [6, 10, 12])) === JSON.stringify(sc), "deterministic");

console.log(`\nJAMGOAL: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
