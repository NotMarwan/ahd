const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const MODULE_PATH = path.join(ROOT, "app", "features", "data-rigor.js");
let pass = 0, fail = 0;
function ok(condition, message) {
  if (condition) { pass++; console.log("  ✓ " + message); }
  else { fail++; console.log("  ✗ " + message); }
}

console.log("data-rigor.test: source-bounded Saudi context");
ok(fs.existsSync(MODULE_PATH), "data-rigor module exists");
if (!fs.existsSync(MODULE_PATH)) {
  console.log("data-rigor.test: " + pass + " passed, " + fail + " failed");
  process.exit(1);
}

const D = require(MODULE_PATH);
["FINDEX_SERIES", "EMERGENCY_SERIES", "NAFITH_SERIES", "GASTAT_CONTEXT", "findexByYear", "nafithGrowthFloor", "describeAr"].forEach(function (key) {
  ok(Object.prototype.hasOwnProperty.call(D, key), key + " is exported");
});
const family = D.FINDEX_SERIES.map(function (row) { return row.familyFriendsPermille; });
ok(family.join(",") === "373,335,358,304", "Findex family/friends series is 2014/2017/2021/2024 exact values");
ok(D.findexByYear(2021).familyFriendsPermille === 358, "findexByYear returns 2021 primary observation");
ok(D.findexByYear(2024).familyFriendsPermille === 304, "findexByYear returns 2024 primary observation");
ok(D.EMERGENCY_SERIES.map(function (row) { return row.familyFriendsPermille; }).join(",") === "333,380", "emergency reliance is 2021/2024 exact values");
ok(D.NAFITH_SERIES[0].countFloor === 160000 && D.NAFITH_SERIES[2].countFloor === 5500000, "Nafith is count-only with conservative 2020/2024 floors");
ok(D.nafithGrowthFloor() === 34, "Nafith growth floor is 34x");
ok(D.GASTAT_CONTEXT.sampleHouseholds === 122325, "GASTAT sample count is exact");
ok(D.GASTAT_CONTEXT.notLoanDistribution === true, "GASTAT context rejects loan-distribution interpretation");
ok(D.GASTAT_CONTEXT.householdBands.map(function (row) { return row.incomeSar + "/" + row.expenditureSar; }).join(",") === "6013/5092,11471/9090,19038/14843", "GASTAT household-size context is exact");
const src = fs.readFileSync(MODULE_PATH, "utf8");
ok(!/Date\.now|new Date|Math\.random|Intl|fetch\s*\(/.test(src), "data module has no time, randomness, locale, or network primitive");
ok(!/%/.test(JSON.stringify(D)), "data values use integer per-mille, not percentage strings");
ok(/ليس توزيعًا لقروض الأفراد/.test(D.describeAr(function (n) { return String(n); }).gastatCaveat), "Arabic description keeps GASTAT caveat visible");

console.log("data-rigor.test: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
