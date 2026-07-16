const path = require("path");
let DR;
try { DR = require(path.join(__dirname, "..", "..", "app", "features", "drafts.js")); }
catch (e) { console.log("DRAFTS RED: " + e.message); process.exit(1); }
let passed = 0, failed = 0;
const ok = (c, n) => c ? (passed++, console.log("  ✓ " + n)) : (failed++, console.log("  ✗ " + n));
const throws = (fn, n) => { try { fn(); failed++; console.log("  ✗ " + n + " (did not throw)"); } catch (e) { passed++; console.log("  ✓ " + n); } };

const s0 = DR.makeState();
const s1 = DR.propose(s0, { kind: "recurring", labelAr: "قسمة إيجار يوليو", amountMinor: 50000 });
ok(s1.items.length === 1 && s1.items[0].id === "DR-1" && s1.items[0].status === "proposed", "propose creates DR-1 proposed");
ok(s0.items.length === 0, "propose immutable");

const s2 = DR.propose(s1, { kind: "recurring", labelAr: "قسمة إيجار أغسطس", amountMinor: 50000 });
ok(DR.pending(s2).length === 2, "pending lists both drafts");

const ap = DR.approve(s2, "DR-1");
ok(ap.item.labelAr === "قسمة إيجار يوليو" && ap.state.items[0].status === "approved", "approve returns the item exactly once");
ok(DR.pending(ap.state).length === 1, "approved draft leaves the pending list");
throws(() => DR.approve(ap.state, "DR-1"), "double-approve throws (Arabic error)");
throws(() => DR.approve(s2, "DR-9"), "unknown draft id throws");

const dc = DR.decline(s2, "DR-2", "لا نحتاجها هذا الشهر");
ok(dc.items[1].status === "declined" && dc.items[1].reasonAr === "لا نحتاجها هذا الشهر", "decline keeps the reason");
ok(DR.pending(dc).length === 1, "declined draft leaves the pending list");

const r1 = DR.propose(DR.makeState(), { kind: "recurring", labelAr: "x", amountMinor: 100 });
const r2 = DR.propose(DR.makeState(), { kind: "recurring", labelAr: "x", amountMinor: 100 });
ok(JSON.stringify(r1) === JSON.stringify(r2), "deterministic");

console.log(`\nDRAFTS: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
