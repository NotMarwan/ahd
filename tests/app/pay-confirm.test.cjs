const path = require("path");
let PC;
try { PC = require(path.join(__dirname, "..", "..", "app", "features", "pay-confirm.js")); }
catch (e) { console.log("PAYCONFIRM RED: " + e.message); process.exit(1); }
let passed = 0, failed = 0;
const ok = (c, n) => c ? (passed++, console.log("  ✓ " + n)) : (failed++, console.log("  ✗ " + n));
const throws = (fn, n) => { try { fn(); failed++; console.log("  ✗ " + n + " (did not throw)"); } catch (e) { passed++; console.log("  ✓ " + n); } };

const s0 = PC.makeState();
ok(Array.isArray(s0.claims) && s0.claims.length === 0 && s0.seq === 0, "makeState starts empty");

const s1 = PC.claim(s0, { recordId: "R-FAHD", amountMinor: 40000, evidenceAr: "حوالة مصرفية — مرجع 88213", byAr: "نايف" });
ok(s1.claims.length === 1 && s1.claims[0].id === "PC-1" && s1.claims[0].status === "pending", "claim creates PC-1 pending");
ok(s1.claims[0].evidenceAr.indexOf("88213") >= 0, "evidence text kept verbatim");
ok(s0.claims.length === 0, "claim is immutable — original state untouched");

throws(() => PC.claim(s0, { recordId: "R-X", amountMinor: 0, evidenceAr: "x", byAr: "أ" }), "zero amount rejected");
throws(() => PC.claim(s0, { recordId: "R-X", amountMinor: 100.5, evidenceAr: "x", byAr: "أ" }), "non-integer halalas rejected");
throws(() => PC.claim(s0, { recordId: "R-X", amountMinor: 100, evidenceAr: "  ", byAr: "أ" }), "empty evidence rejected");

const acc = PC.accept(s1, "PC-1");
ok(acc.accepted.status === "accepted" && acc.state.claims[0].status === "accepted", "accept transitions to accepted");
ok(s1.claims[0].status === "pending", "accept immutable — prior state still pending");
throws(() => PC.accept(acc.state, "PC-1"), "double-accept throws (closed claim)");
throws(() => PC.accept(s1, "PC-9"), "unknown claim id throws");

const rej = PC.reject(s1, "PC-1", "notReceived");
ok(rej.rejected.status === "rejected" && rej.rejected.reasonAr === PC.REASONS.notReceived, "reject keeps the fixed-enum reason");
ok(rej.rejected.opensDispute === true, "rejection opens the dispute path");
throws(() => PC.reject(s1, "PC-1", "whatever"), "unknown reason key throws");

const s2 = PC.claim(s1, { recordId: "R-ABD", amountMinor: 15000, evidenceAr: "نقدًا أمام شاهد", byAr: "نايف" });
ok(s2.claims[1].id === "PC-2", "seq increments deterministically");
ok(PC.pendingFor(s2, "R-FAHD").length === 1 && PC.pendingFor(s2, "R-ABD").length === 1, "pendingFor filters by record");
ok(PC.byId(s2, "PC-2").recordId === "R-ABD", "byId finds claim");

const r1 = PC.claim(PC.makeState(), { recordId: "R-FAHD", amountMinor: 40000, evidenceAr: "حوالة", byAr: "نايف" });
const r2 = PC.claim(PC.makeState(), { recordId: "R-FAHD", amountMinor: 40000, evidenceAr: "حوالة", byAr: "نايف" });
ok(JSON.stringify(r1) === JSON.stringify(r2), "fully deterministic — same ops, identical states");

console.log(`\nPAYCONFIRM: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
