"use strict";
const assert = require("assert");
const path = require("path");
const engine = require(path.join(__dirname, "..", "..", "app", "engine.js"));
const Care = require(path.join(__dirname, "..", "..", "app", "features", "care.js"));
let pass = 0, fail = 0;
function ok(value, message) { if (value) { pass++; console.log("  ✓ " + message); } else { fail++; console.log("  ✗ " + message); } }
function eq(actual, expected, message) { ok(actual === expected, message + " (got " + JSON.stringify(actual) + ")"); }
function event(type, extra) { return engine.ev(type, extra || {}); }
function record(extra) { return Object.assign({ id: "CARE-1", lender: "Lender", borrower: "Borrower", amountSAR: 1000, installments: [{ dueISO: "2026-08-01", amountSAR: 1000 }], events: [event("AHD_DRAFTED", { installments: 1 }), event("LENDER_SIGNED"), event("COUNTERPARTY_SIGNED"), event("RECORD_SEALED"), event("ACTIVATED")] }, extra || {}); }

console.log("care.test: gift + forgiveness request + duress guard");
const base = record();
const gift = Care.recordThirdPartyGift(base, { payerId: "Friend", amountMinor: 25000, reference: "gift-1" }, engine);
eq(gift.type, "PRINCIPAL_PAID", "third-party gift uses existing principal-payment event");
eq(gift.amountMinor, 25000, "third-party gift stores integer halalas");
eq(gift.metadata.channel, "third_party_gift", "third-party channel is explicit metadata");
eq(gift.metadata.recourse, false, "gift has no recourse");
eq(gift.metadata.payerId, "Friend", "distinct payer is recorded");
ok(!/reimburse|guarantee|debt|score/i.test(JSON.stringify(gift.metadata)), "gift metadata creates no reimbursement, guarantee, debt, or score");
eq(Care.recordThirdPartyGift(base, { payerId: "Borrower", amountMinor: 1 }, engine).amountMinor, 0, "borrower cannot be third-party payer");
eq(Care.recordThirdPartyGift(base, { payerId: "Lender", amountMinor: 1 }, engine).amountMinor, 0, "lender cannot be third-party payer");
eq(Care.recordThirdPartyGift(base, { payerId: "Friend", amountMinor: 999999999 }, engine).amountMinor, engine.toMinor(1000), "gift clamps to remaining principal");
eq(Care.recordThirdPartyGift(Object.assign({}, base, { events: base.events.concat(gift) }), { payerId: "Other", amountMinor: 999999999 }, engine).amountMinor, 75000, "second gift clamps after prior payment");
eq(Care.recordThirdPartyGift(base, { payerId: "Friend", amountMinor: 12.5 }, engine).amountMinor, 0, "fractional halalas are rejected");
const ask = Care.requestForgiveness(base, { borrowerId: "Borrower", scope: "partial", amountMinor: 999999999, reasonKey: "financial_hardship" }, engine);
eq(ask.type, "FORGIVENESS_REQUESTED", "forgiveness request is auxiliary event");
eq(ask.reasonKey, "financial_hardship", "forgiveness reason enum recorded");
eq(ask.recordId, "CARE-1", "forgiveness request binds its record ID");
eq(ask.borrowerId, "Borrower", "only linked borrower may request forgiveness");
eq(ask.scope, "partial", "forgiveness request records fixed scope enum");
eq(ask.amountMinor, engine.toMinor(1000), "partial request amount clamps only as request metadata");
ok(Care.FORGIVENESS_REASONS.some(function (x) { return x.key === ask.reasonKey; }), "forgiveness reason is from fixed enum");
eq(Care.requestForgiveness(base, { borrowerId: "Wrong", scope: "full", reasonKey: "financial_hardship" }, engine), null, "unlinked actor cannot request forgiveness");
eq(Care.requestForgiveness(base, { borrowerId: "Borrower", scope: "free_text", reasonKey: "financial_hardship" }, engine), null, "unknown forgiveness scope is rejected");
eq(Care.requestForgiveness(Object.assign({}, base, { id: "" }), { borrowerId: "Borrower", scope: "full", reasonKey: "financial_hardship" }, engine), null, "missing record ID is rejected");
eq(Care.remainingMinor(base, engine), Care.remainingMinor(Object.assign({}, base, { events: base.events.concat(ask) }), engine), "request does not change balance before lender acceptance");
const report = Care.reportDuress(base, { reporterId: "Borrower", reasonKey: "coercion" }, engine);
eq(report.type, "DURESS_REPORTED", "duress report is auxiliary event");
eq(report.reasonKey, "coercion", "duress reason enum recorded");
eq(report.recordId, "CARE-1", "duress report binds its record ID");
eq(report.reporterId, "Borrower", "duress report binds a linked reporter");
ok(Care.DURESS_REASONS.some(function (x) { return x.key === report.reasonKey; }), "duress reason is from fixed enum");
eq(Care.reportDuress(base, { reporterId: "Stranger", reasonKey: "coercion" }, engine), null, "unlinked actor cannot report duress");
eq(Care.reportDuress(base, { reporterId: "Borrower", reasonKey: "free_text" }, engine), null, "unknown duress reason is rejected");
ok(Care.preSealBlocked([report]), "pre-seal duress blocks sealing pending human review");
ok(!Care.preSealBlocked([]), "no duress report leaves pre-seal path open");
const post = Care.duressStatus(base.events.concat(report));
eq(post.pendingReview, true, "post-seal duress remains pending human review");
eq(post.sealEffect, "none", "post-seal duress does not rewrite or invalidate seal");
ok(!/truth|sanction|score|judg/i.test(JSON.stringify(post)), "duress state makes no truth judgment, sanction, or score");
console.log("CARE: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
