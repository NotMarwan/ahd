const path = require("path");
const J = require(path.join(__dirname, "..", "..", "app", "features", "jamiya.js"));

let passed = 0, failed = 0;
const ok = (condition, name) => { condition ? (passed++, console.log("  ✓ " + name)) : (failed++, console.log("  ✗ " + name)); };
const spec = { members: ["أم سارة", "نورة", "هند"], monthlyMinor: 100000, startMonth: "2026-07", orderAgreed: ["نورة", "هند", "أم سارة"] };
const first = J.jamiyaSeal(J.makeJamiya(spec));
const second = J.jamiyaSeal(J.makeJamiya(spec));

ok(J.jamiyaCanonical(first) === J.jamiyaCanonical(second), "canonical text is stable for the same input");
ok(first.seal === second.seal && first.canonical_hash === second.canonical_hash, "seal is stable for the same input");
ok(J.verifyJamiya(first).ok === true, "sealed contract verifies");

const tampered = JSON.parse(JSON.stringify(first));
tampered.members[0] = tampered.members[0] + "ة";
const result = J.verifyJamiya(tampered);
ok(result.ok === false && result.contractOk === false, "one-character contract tamper is detected");

const paid = J.recordPayment(first, { round: 0, member: "أم سارة" });
ok(paid.payments[0].canonical_hash && paid.payments[0].seal && J.verifyJamiya(paid).ok, "monthly payment is a sealed verifiable event");

console.log(`\nJAMIYA SEAL: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
