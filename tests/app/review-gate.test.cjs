const path = require("path");
let RG;
try { RG = require(path.join(__dirname, "..", "..", "app", "features", "review-gate.js")); }
catch (e) { console.log("REVIEWGATE RED: " + e.message); process.exit(1); }
let passed = 0, failed = 0;
const ok = (c, n) => c ? (passed++, console.log("  ✓ " + n)) : (failed++, console.log("  ✗ " + n));

const draft = { lender: "نايف", borrower: "سالم", amountMinor: 50000, months: 5, open: false };
const r = RG.build(draft, "شروط تجريبية");
ok(r.lines.length >= 4, "summary has parties/amount/schedule lines");
ok(r.lines.some(l => l.v.indexOf("500") >= 0), "amount rendered in SAR from integer halalas");
ok(r.lines.some(l => l.v.indexOf("نايف") >= 0) && r.lines.some(l => l.v.indexOf("سالم") >= 0), "both parties named");
ok(r.lines.some(l => l.v.indexOf("5") >= 0 && l.v.indexOf("أقساط") >= 0), "schedule line shows installments");
ok(r.absentAr.length === 3 && r.absentAr.join("").indexOf("فائدة") >= 0, "absent list names لا فائدة/لا غرامة/لا حيازة");
ok(r.absentAr.join("").indexOf("غرامة") >= 0 && r.absentAr.join("").indexOf("حيازة") >= 0, "absent list covers penalty + custody");
ok(/^[0-9a-f]{8}$/.test(r.fingerprint), "fingerprint is 8 hex chars");
ok(RG.build(draft, "شروط تجريبية").fingerprint === r.fingerprint, "deterministic fingerprint");
ok(RG.build(draft, "شروط أخرى").fingerprint !== r.fingerprint, "different terms → different fingerprint");
ok(RG.build(Object.assign({}, draft, { amountMinor: 50001 }), "شروط تجريبية").fingerprint !== r.fingerprint, "different amount → different fingerprint");

const open = RG.build(Object.assign({}, draft, { open: true }), "x");
ok(open.lines.some(l => l.v.indexOf("مفتوح") >= 0), "open loan shows مفتوح schedule");

ok(typeof RG.fingerprint === "function" && RG.fingerprint("a") !== RG.fingerprint("b"), "fingerprint exported and discriminates");
ok(JSON.stringify(RG.build(draft, "شروط تجريبية")) === JSON.stringify(r), "build fully deterministic");

console.log(`\nREVIEWGATE: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
