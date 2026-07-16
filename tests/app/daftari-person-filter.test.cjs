const path = require("path");
let D;
try { D = require(path.join(__dirname, "..", "..", "app", "features", "daftari.js")); }
catch (e) { console.log("PERSONFILTER RED: " + e.message); process.exit(1); }
let passed = 0, failed = 0;
const ok = (c, n) => c ? (passed++, console.log("  ✓ " + n)) : (failed++, console.log("  ✗ " + n));

if (typeof D.peopleOf !== "function" || typeof D.filterByPerson !== "function") {
  console.log("PERSONFILTER RED: peopleOf/filterByPerson not exported");
  process.exit(1);
}

const rows = [
  { id: "R-1", counterparty: "سالم", statusKey: "ACTIVE", isOverdue: true },
  { id: "R-2", counterparty: "نورة", statusKey: "ACTIVE", isOverdue: false },
  { id: "R-3", counterparty: "سالم", statusKey: "KEPT", isOverdue: false }
];

const people = D.peopleOf(rows);
ok(JSON.stringify(people) === JSON.stringify(["سالم", "نورة"]), "peopleOf returns unique names in first-seen order");

const salem = D.filterByPerson(rows, "سالم");
ok(salem.length === 2 && salem.every(r => r.counterparty === "سالم"), "filterByPerson keeps only that person's rows");
ok(D.filterByPerson(rows, "الكل").length === 3, "«الكل» sentinel returns everything");
ok(D.filterByPerson(rows, null).length === 3, "null person returns everything");

/* composes WITH the existing status filter */
const composed = D.filterRows(D.filterByPerson(rows, "سالم"), "kept");
ok(composed.length === 1 && composed[0].id === "R-3", "person + status filters compose");

ok(rows.length === 3, "filters never mutate the input rows");

console.log(`\nPERSONFILTER: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
