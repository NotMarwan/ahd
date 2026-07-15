const path = require("path");
let Split, Q;
try {
  Split = require(path.join(__dirname, "..", "..", "app", "features", "split.js"));
  Q = require(path.join(__dirname, "..", "..", "app", "features", "qaid.js"));
} catch (error) { console.log("SPLIT RED: " + error.message); process.exit(1); }

let passed = 0, failed = 0;
const ok = (condition, name) => condition ? (passed++, console.log("  ✓ " + name)) : (failed++, console.log("  ✗ " + name));

const participants = ["أنت", "سالم", "نورة", "هند", "منال", "عبير"];
const split = Split.makeSplit({ totalMinor: 48001, payer: "أنت", participants });
ok(split.shares.reduce((sum, item) => sum + item.amountMinor, 0) === 48001, "odd split conserves every halala");
ok(split.shares[0].amountMinor === 8001 && split.shares.slice(1).every(item => item.amountMinor === 8000), "largest remainder goes to earliest participants");
ok(split.qaidDrafts.length === 5 && split.qaidDrafts.every(item => item.amountMinor === 8000), "non-payer participants become qaid drafts");
const applied = Split.applySplit(Q.makeState("أنت"), split);
ok(applied.qaids.length === 5 && applied.qaids.every(item => item.direction === "alayya"), "applySplit appends receivable lite qaids");

let mutual = Q.makeState("أنت");
mutual = Q.addQaid(mutual, { direction: "lahum", name: "سالم", amountMinor: 12500, noteAr: "الأول" });
mutual = Q.addQaid(mutual, { direction: "alayya", name: "سالم", amountMinor: 12500, noteAr: "الثاني" });
const hint = Q.netHint(mutual);
ok(hint.balanced === true && hint.textAr === "أنت وسالم متعادلان", "mutual qaids produce balanced netHint");
ok(hint.transferRequired === false, "balanced hint requires no transfer");

console.log(`\nSPLIT: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
