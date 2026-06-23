/* ============================================================================
   circle-reminder.test.cjs — TDD for the DEEPENED treasurer dashboard: a GROUP
   reminder that NEVER names the late member («ذمّة المناسبة محفوظة»). The bank
   reminds the whole circle collectively, with the mercy exit, and no زيادة.
   Pure, deterministic. Reuses the golden circle engine; no golden change.
============================================================================ */
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", ...p);
const E = require(P("engine.js"));
const CD = require(P("features", "circle.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };

console.log("circle-reminder.test: a group reminder that never names the late\n");

const circle = E.DEMO_CIRCLE;
ok(typeof CD.groupReminder === "function", "groupReminder exists");
const gr = CD.groupReminder(circle, E);

/* ---- THE DIGNITY GUARANTEE: the reminder names NO member ---- */
const memberNames = circle.members.map(m => m.name);
ok(gr.namesAnyone === false, "the reminder reports it names no one (namesAnyone === false)");
ok(memberNames.every(n => gr.ar.indexOf(n) < 0), "NO member name appears anywhere in the reminder text (the late is never exposed)");

/* ---- collective + on-spine copy ---- */
ok(gr.collective === true, "the reminder is collective (sent to the whole circle)");
ok(/جماعة|الدائرة|الجميع/.test(gr.ar), "the copy addresses the group, not an individual");
ok(/نظرة إلى ميسرة|عسرة/.test(gr.ar), "carries the 2:280 mercy («نظرة إلى ميسرة»)");
ok(/بلا أيّ زيادة|بلا زيادة/.test(gr.ar), "states NO زيادة (no riba, no penalty)");
ok(/احتاج وقت|وقتًا|تيسّر/.test(gr.ar), "carries the «احتاج وقتًا / متى تيسّر» dignified exit");
ok(!/مطالبة|تأخّر|متأخّر|تأخير/.test(gr.ar), "no shaming/مطالبة language");

/* ---- the pending count is a dignified tally, never a named list ---- */
ok(Number.isInteger(gr.pendingCount) && gr.pendingCount >= 0, "pendingCount is a non-negative integer (a tally, not names)");

/* ---- determinism + no score ---- */
ok(JSON.stringify(CD.groupReminder(circle, E)) === JSON.stringify(gr), "groupReminder is deterministic");
ok(!/\d{1,3}\s*[%٪]/.test(JSON.stringify(gr)), "no percentage/score in the reminder");

/* ---- the dashboard still works alongside it (unchanged) ---- */
ok(CD.circleDashboard(circle, E).members.length === circle.members.length, "circleDashboard is unaffected");

console.log("\n" + "=".repeat(56));
console.log("CIRCLE-REMINDER: " + pass + " passed, " + fail + " failed");
console.log("=".repeat(56));
process.exit(fail ? 1 : 0);
