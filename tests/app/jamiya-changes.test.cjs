const path = require("path");
let JC;
try { JC = require(path.join(__dirname, "..", "..", "app", "features", "jamiya-changes.js")); }
catch (e) { console.log("JAMCHANGES RED: " + e.message); process.exit(1); }
let passed = 0, failed = 0;
const ok = (c, n) => c ? (passed++, console.log("  ✓ " + n)) : (failed++, console.log("  ✗ " + n));
const throws = (fn, n) => { try { fn(); failed++; console.log("  ✗ " + n + " (did not throw)"); } catch (e) { passed++; console.log("  ✓ " + n); } };

const jam = { members: ["أ", "ب", "ج"], orderAgreed: ["أ", "ب", "ج"] };
const log0 = JC.makeLog();
ok(log0.entries.length === 0 && log0.seq === 0, "empty log");

const sw = JC.swapRounds(log0, jam, "أ", "ج");
ok(sw.orderAfter.join(",") === "ج,ب,أ", "swap actually swaps the two rounds");
ok(sw.log.entries.length === 1 && sw.log.entries[0].id === "JC-1" && sw.log.entries[0].type === "swap", "swap logged as JC-1");
ok(sw.log.entries[0].bothConsent === true && sw.log.entries[0].detailAr.indexOf("أ") >= 0, "entry records both-consent + names");
ok(log0.entries.length === 0, "immutable — original log untouched");
throws(() => JC.swapRounds(log0, jam, "أ", "غريب"), "swapping with a non-member throws");

const wd = JC.withdraw(sw.log, jam, "ب", "ظرف طارئ");
ok(wd.log.entries.length === 2 && wd.log.entries[1].type === "withdraw" && wd.log.entries[1].detailAr.indexOf("ظرف طارئ") >= 0, "withdraw logged with reason");

ok(JC.verify(wd.log).ok === true, "verify passes on an untouched log");
const tampered = { entries: wd.log.entries.slice(1), seq: wd.log.seq };
ok(JC.verify(tampered).ok === false, "verify fails after an entry is removed (append-only)");

console.log(`\nJAMCHANGES: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
