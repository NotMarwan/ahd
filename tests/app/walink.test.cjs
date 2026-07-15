const path = require("path");
let W;
try { W = require(path.join(__dirname, "..", "..", "app", "features", "walink.js")); }
catch (error) { console.log("WALINK RED: " + error.message); process.exit(1); }
const Engine = require(path.join(__dirname, "..", "..", "app", "engine.js"));

let passed = 0, failed = 0;
const ok = (condition, name) => condition ? (passed++, console.log("  ✓ " + name)) : (failed++, console.log("  ✗ " + name));

const record = W.makeSharedRecord({ id: "AHD-LINK-1", lender: "نورة", borrower: "سالم", amountMinor: 48001, termsAr: "قرض حسن بلا أي زيادة" }, Engine);
const before = JSON.stringify(record);
const token = W.encodeRecord(record);
const decoded = W.decodeRecord(token);
ok(JSON.stringify(decoded) === before, "encode-decode roundtrip is byte-exact");
ok(!/[+=/]/.test(token), "payload uses URL-safe base64 without padding");
const first = W.buildConfirmCode(record), second = W.buildConfirmCode(record);
ok(first === second && /^[0-9a-f]{12}$/.test(first), "confirmation code is deterministic and 12 hex chars");
ok(W.verifyConfirmCode(record, first) === true, "matching confirmation code verifies");
const tampered = Object.assign({}, record, { amountMinor: 48002 });
ok(W.buildConfirmCode(tampered) !== first, "tampered payload changes confirmation code");
ok(W.verifyConfirmCode(tampered, first) === false, "old code fails against tampered payload");
ok(W.verifySharedRecord(record).ok === true, "shared sealed record verifies locally");
const message = W.buildShareText(record);
ok(message.includes("confirm.html#" + token) && message.includes("عهد"), "share text contains Arabic message and offline confirm URL");

console.log(`\nWALINK: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
