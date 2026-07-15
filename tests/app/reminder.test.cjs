const path = require("path");
let Reminder;
try { Reminder = require(path.join(__dirname, "..", "..", "app", "features", "reminder.js")); }
catch (error) { console.log("REMINDER RED: " + error.message); process.exit(1); }
const Engine = require(path.join(__dirname, "..", "..", "app", "engine.js"));
const RibaLint = require(path.join(__dirname, "..", "..", "app", "features", "riba-lint.js"));

let passed = 0, failed = 0;
const ok = (condition, name) => condition ? (passed++, console.log("  ✓ " + name)) : (failed++, console.log("  ✗ " + name));
const active = [Engine.ev("AHD_DRAFTED", { installments: 1 }), Engine.ev("LENDER_SIGNED"), Engine.ev("COUNTERPARTY_SIGNED"), Engine.ev("RECORD_SEALED"), Engine.ev("ACTIVATED")];
function record(id, dueISO) { return { id, lender: "أنت", borrower: "سالم", amountMinor: 48001, amountSAR: "480.01", installments: [{ dueISO, amountSAR: "480.01" }], events: active.slice() }; }

ok(Reminder.reminderFor(record("G", "2026-07-10"), "2026-06-21").key === "gentle", "future record selects gentle template");
ok(Reminder.reminderFor(record("N", "2026-06-23"), "2026-06-21").key === "near_due", "near due record selects near-due template");
ok(Reminder.reminderFor(record("O", "2026-06-20"), "2026-06-21").key === "overdue", "late record selects overdue template via daftari row logic");
ok(Object.keys(Reminder.TEMPLATES).length === 3, "exactly three fixed templates exist");
ok(Object.values(Reminder.TEMPLATES).every(text => RibaLint.scan(text, Engine).verdict === "clean"), "all fixed templates pass riba lint");

const base = record("CAP", "2026-06-20");
const once = Reminder.sendReminder(base, "2026-06-21");
const twice = Reminder.sendReminder(once.record, "2026-06-22");
ok(base.events.length + 1 === once.record.events.length && twice.record.events.length === base.events.length + 2, "sending appends immutable sealed events");
ok(once.event.canonical_hash && once.event.seal, "reminder event is sealed");
let capped = false;
try { Reminder.sendReminder(twice.record, "2026-06-29"); } catch (error) { capped = /2|cap|month/i.test(error.message); }
ok(capped, "third reminder in same month is rejected");
ok(Reminder.sendReminder(twice.record, "2026-07-01").record.events.length === base.events.length + 3, "new month resets deterministic cap");

console.log(`\nREMINDER: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
