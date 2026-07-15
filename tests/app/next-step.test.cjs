const path = require("path");
let NS;
try { NS = require(path.join(__dirname, "..", "..", "app", "features", "next-step.js")); }
catch (e) { console.log("NEXTSTEP RED: " + e.message); process.exit(1); }
let passed = 0, failed = 0;
const ok = (c, n) => c ? (passed++, console.log("  ✓ " + n)) : (failed++, console.log("  ✗ " + n));

ok(NS.refOf("R-CAFE") === "عهد-CAFE", "refOf strips R- prefix into عهد-");
ok(NS.refOf("NEW-1") === "عهد-NEW-1", "refOf keeps ids without R- prefix whole");

const active = { id: "R-CAFE", role: "lender", counterparty: "سالم", amountSAR: 500, remainingSAR: 300, statusKey: "ACTIVE", isOverdue: false, graced: false, nextDueLabel: "١٥ يوليو", daysOverdue: 0 };
const a = NS.fromRow(active);
ok(a.ref === "عهد-CAFE", "active row carries ref");
ok(a.agreedAr.indexOf("500") >= 0 && a.agreedAr.indexOf("سالم") >= 0, "agreed line names party + amount");
ok(a.happenedAr.indexOf("200") >= 0, "happened line shows paid so far (500-300)");
ok(a.nextAr.indexOf("١٥ يوليو") >= 0, "next line points to next due");
ok(a.tone === "ok", "active tone ok");

const overdue = Object.assign({}, active, { isOverdue: true, daysOverdue: 9 });
const o = NS.fromRow(overdue);
ok(o.tone === "attention" && o.nextAr.length > 0, "overdue gets attention tone + concrete next step");
ok(o.nextAr.indexOf("غرامة") < 0 || o.nextAr.indexOf("لا غرامة") >= 0, "no penalty language ever (only explicit negation allowed)");

const graced = Object.assign({}, active, { graced: true });
ok(NS.fromRow(graced).tone === "warm", "graced tone warm");
const kept = Object.assign({}, active, { statusKey: "KEPT", remainingSAR: 0 });
const k = NS.fromRow(kept);
ok(k.nextAr.length > 0 && k.tone === "ok", "kept has a closing next step");
const disputed = Object.assign({}, active, { statusKey: "DISPUTED" });
ok(NS.fromRow(disputed).nextAr.indexOf("خلاف") >= 0, "disputed points to محل خلاف");
const forgiven = Object.assign({}, active, { statusKey: "FORGIVEN" });
ok(NS.fromRow(forgiven).tone === "warm", "forgiven tone warm");

const borrower = Object.assign({}, active, { role: "borrower" });
ok(NS.fromRow(borrower).agreedAr.indexOf("استلفت") >= 0, "borrower agreed line flips direction");

const unpaid = Object.assign({}, active, { remainingSAR: 500 });
ok(NS.fromRow(unpaid).happenedAr.indexOf("لم تُسجَّل") >= 0, "no payments yet wording");

const two = NS.fromRow(active);
ok(JSON.stringify(two) === JSON.stringify(a), "deterministic: same row → identical output");

console.log(`\nNEXTSTEP: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
