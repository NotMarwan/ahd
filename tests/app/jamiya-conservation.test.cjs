const path = require("path");
const J = require(path.join(__dirname, "..", "..", "app", "features", "jamiya.js"));

let passed = 0, failed = 0;
const ok = (condition, name) => { condition ? (passed++, console.log("  ✓ " + name)) : (failed++, console.log("  ✗ " + name)); };
const members = ["أم سارة", "نورة", "هند", "منال"];
let jamiya = J.jamiyaSeal(J.makeJamiya({ members, monthlyMinor: 125000, startMonth: "2026-07", orderAgreed: ["هند", "أم سارة", "منال", "نورة"] }));

for (let round = 0; round < members.length; round++) {
  for (const member of members) jamiya = J.recordPayment(jamiya, { round, member });
}

const check = J.conservation(jamiya);
ok(check.ok === true, "full-cycle conservation holds");
ok(check.members.length === members.length && check.members.every(row => row.totalInMinor === row.totalOutMinor && row.netMinor === 0), "every member pays in exactly the pot received");
ok(check.totalInMinor === check.totalOutMinor && check.totalInMinor === 2000000, "system total has zero surplus");
ok(J.foldJamiya(jamiya).currentRound === members.length, "completed fold has no pending round");

console.log(`\nJAMIYA CONSERVATION: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
