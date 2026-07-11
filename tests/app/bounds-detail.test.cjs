/* ============================================================================
   bounds-detail.test.cjs — TDD for features/bounds-detail.js: parse each
   guarantee's «يحرسه» line into its real guard files + the one command that
   runs that guard. Every parsed file must EXIST on disk (same teeth as
   bounds.test.cjs) — the screen's disclosure never names a ghost file.
============================================================================ */
const path = require("path");
const fs = require("fs");
const ROOT = path.join(__dirname, "..", "..");
const Bounds = require(path.join(ROOT, "app", "features", "bounds.js"));
const BD = require(path.join(ROOT, "app", "features", "bounds-detail.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("bounds-detail.test: enforcedBy → files + run command");

(function parsing() {
  const d = BD.parseEnforcedBy("app/engine.js · tests/app/proof.test.cjs");
  eq(d.files.length, 2, "splits on the middle dot");
  eq(d.files[0], "app/engine.js", "first file kept verbatim");
  eq(d.runCmd, "node tests/app/proof.test.cjs", "runCmd targets the tests/ file");
})();

(function noTestFile() {
  const d = BD.parseEnforcedBy("tests/app/app-dom-smoke.cjs");
  eq(d.files.length, 1, "single-file line parses");
  eq(d.runCmd, "node tests/app/app-dom-smoke.cjs", "a tests/ single file still gets a runCmd");
})();

(function allSectionsParse() {
  let items = 0, allExist = true, allHaveCmd = true;
  Bounds.SECTIONS.forEach(sec => sec.items.forEach(it => {
    items++;
    const d = BD.parseEnforcedBy(it.enforcedBy);
    d.files.forEach(f => { if (!fs.existsSync(path.join(ROOT, f))) allExist = false; });
    if (!d.runCmd) allHaveCmd = false;
  }));
  ok(items >= 14, "all sections' items parsed (" + items + ")");
  ok(allExist, "EVERY parsed guard file exists on disk (teeth)");
  ok(allHaveCmd, "every item yields a runnable guard command");
})();

(function arabicDetail() {
  const item = Bounds.SECTIONS[0].items[0];
  const d = BD.detailAr(item);
  ok(d.invite.indexOf("شغّل") >= 0 || d.invite.indexOf("اطلب") >= 0, "invite line invites running the guard");
  ok(d.files.length >= 1 && d.runCmd, "detailAr carries files + runCmd through");
})();

console.log("\n========================================================");
console.log("BOUNDS-DETAIL: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
