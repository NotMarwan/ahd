const path = require("path");
const J = require(path.join(__dirname, "..", "..", "app", "features", "jamiya.js"));
const RibaLint = require(path.join(__dirname, "..", "..", "app", "features", "riba-lint.js"));

let passed = 0, failed = 0;
const ok = (condition, name, detail) => { condition ? (passed++, console.log("  ✓ " + name)) : (failed++, console.log("  ✗ " + name + (detail ? " — " + detail : ""))); };
const jamiya = J.makeJamiya({ members: ["أم سارة", "نورة", "هند"], monthlyMinor: 100000, startMonth: "2026-07", orderAgreed: ["هند", "أم سارة", "نورة"] });
const terms = J.jamiyaTermsAr(jamiya);
const scan = RibaLint.scan(terms);

ok(scan.verdict === "clean", "Arabic jamiya terms pass the additive riba linter", JSON.stringify(scan.hits));
ok(/بتراضي|باتفاق/.test(terms) && /عشوائي/.test(terms), "terms bind consensual order and refuse random selection");
ok(/رِفق|رفق/.test(terms), "default routes to the existing rifq/grace path");

console.log(`\nJAMIYA RIBA LINT: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
