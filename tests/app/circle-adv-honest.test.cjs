/* ============================================================================
   circle-adv-honest.test.cjs — the recurring panel must not advertise controls
   that do not exist (a judge clicking dead copy is the worst moment). Static
   source scan (the house pattern): the screen must wire a real stop/resume
   handler, app.js must define it + its state, and the old dead-copy line
   («عدّل» / «أوقف» متاحة دائمًا) must be gone.
============================================================================ */
const path = require("path");
const fs = require("fs");
const ROOT = path.join(__dirname, "..", "..", "app");
const screenSrc = fs.readFileSync(path.join(ROOT, "screens", "circle-adv.js"), "utf8");
const appSrc = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };

console.log("circle-adv-honest.test: no dead controls in the recurring panel");

ok(screenSrc.indexOf("AhdApp.circleRecurringToggle()") >= 0, "screen wires the stop/resume handler");
ok(appSrc.indexOf("circleRecurringToggle:") >= 0, "app.js defines circleRecurringToggle");
ok(appSrc.indexOf("recStopped") >= 0, "circleAdvState carries recStopped");
ok(screenSrc.indexOf("«عدّل» / «أوقف» متاحة دائمًا") < 0, "old dead-copy line removed");
ok(screenSrc.indexOf("recStopped") >= 0, "screen renders both stopped and running states");
ok(!/غرامة\s+تأخير|فائدة\s+شهريّة/.test(screenSrc), "no riba copy introduced (spine)");

console.log("\n========================================================");
console.log("CIRCLE-ADV-HONEST: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
