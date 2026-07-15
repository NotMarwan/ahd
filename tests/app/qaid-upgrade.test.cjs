const path = require("path");
let Q;
try { Q = require(path.join(__dirname, "..", "..", "app", "features", "qaid.js")); }
catch (error) { console.log("QAID UPGRADE RED: " + error.message); process.exit(1); }
const Create = require(path.join(__dirname, "..", "..", "app", "features", "create.js"));
const Engine = require(path.join(__dirname, "..", "..", "app", "engine.js"));

let passed = 0, failed = 0;
const ok = (condition, name) => condition ? (passed++, console.log("  ✓ " + name)) : (failed++, console.log("  ✗ " + name));

const state = Q.addQaid(Q.makeState("أنت"), { direction: "alayya", name: "سالم", amountMinor: 48001, noteAr: "قسمة عشاء" });
const draft = Q.upgradeToAhd(state.qaids[0]);
ok(draft.id === "AHD-Q-0001" && draft.amountMinor === 48001, "upgrade keeps ID and exact halalas");
ok(draft.lender === "أنت" && draft.borrower === "سالم", "upgrade maps direction to create roles");
ok(draft.open === true && draft.purpose === "قسمة عشاء", "upgrade creates an open qard draft");
const sealed = Create.createSeal(draft, Engine);
ok(/^[0-9a-f]{64}$/.test(sealed.seal), "existing create path seals the upgraded draft");
ok(Create.verifyCreated(draft, Engine).ok === true, "existing create verification accepts sealed draft");
ok(Create.toDaftariRecord(draft, Engine).events.some(event => event.type === "RECORD_SEALED"), "upgraded draft feeds existing create-to-ledger path");

console.log(`\nQAID UPGRADE: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
