const path = require("path");

let passed = 0, failed = 0;
const ok = (condition, name, detail) => {
  if (condition) { passed++; console.log("  ✓ " + name); }
  else { failed++; console.log("  ✗ " + name + (detail ? " — " + detail : "")); }
};
const rejects = (fn, pattern, name) => {
  try { fn(); ok(false, name, "لم يُرفض الإدخال"); }
  catch (error) { ok(pattern.test(String(error && error.message)), name, error && error.message); }
};

let J;
try { J = require(path.join(__dirname, "..", "..", "app", "features", "jamiya.js")); }
catch (error) {
  console.log("jamiya-core: RED — module missing\n");
  console.log("  ✗ app/features/jamiya.js exists — " + error.message);
  process.exit(1);
}

const members = ["أم سارة", "نورة", "هند"];
const base = J.makeJamiya({ members, monthlyMinor: 100000, startMonth: "2026-07", orderAgreed: members });
ok(base.members !== members && base.members.join("|") === members.join("|"), "makeJamiya copies the member list");
ok(base.monthlyMinor === 100000 && base.payments.length === 0, "makeJamiya stores integer halalas and an empty event log");

const schedule = J.jamiyaSchedule(base);
ok(schedule.map(r => r.month).join(",") === "2026-07,2026-08,2026-09", "schedule advances fixed civil months without Date");
ok(schedule.map(r => r.recipient).join("|") === members.join("|"), "schedule follows the mutually agreed order");
ok(schedule.every(r => r.expectedPerMemberMinor === 100000), "schedule keeps the expected contribution in halalas");

let next = base;
members.forEach(member => { next = J.recordPayment(next, { round: 0, member }); });
next = J.recordPayment(next, { round: 1, member: members[0] });
const folded = J.foldJamiya(next);
ok(base.payments.length === 0 && next.payments.length === 4, "recordPayment is immutable");
ok(folded.currentRound === 1 && folded.paid[0].every(Boolean) && folded.paid[1][0], "foldJamiya returns the paid matrix and current round");
ok(folded.whoReceived.join("|") === "أم سارة", "foldJamiya marks recipients only after a round is fully funded");

rejects(() => J.makeJamiya({ members: ["أ", "ب"], monthlyMinor: 1, startMonth: "2026-07", orderAgreed: ["أ", "ب"] }), /3|members/i, "rejects fewer than three members");
rejects(() => J.makeJamiya({ members, monthlyMinor: 0, startMonth: "2026-07", orderAgreed: ["أم سارة", "نورة", "نورة"] }), /amount.*order|order.*amount/i, "rejects non-positive money and a non-permutation order");

console.log(`\nJAMIYA CORE: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
