/* ============================================================================
   covenant-log.test.cjs — TDD for features/covenant-log.js. «سِجلّ المعروف»:
   the reminder ladder + grace + forgiveness folded into ONE sealed, ordered,
   tamper-evident good-faith trail that PROVES mercy — exportable as a NEUTRAL
   court exhibit (the SEALED RECORD is on-spine; the trust signal is NOT and must
   never appear). Sealed with the golden sha256/sealBlock/GENESIS (reused, not
   modified). Deterministic, integer halalas, no Date/Math.random/float.
============================================================================ */
const assert = require("assert");
const path = require("path");
const engine = require(path.join(__dirname, "..", "..", "app", "engine.js"));
const C = require(path.join(__dirname, "..", "..", "app", "features", "covenant-log.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");
const M = engine.toMinor;
const ev = engine.ev;
const AS_OF = "2026-06-21";

/* a full معروف life: sealed → 2 gentle reminders (Ahd, on the lender's behalf) →
   the borrower asked for time → the lender granted grace → a partial payment →
   the lender forgave the remainder. The reminders live in a SEPARATE history map
   (as دفتري stores them), keyed by record id — NOT in record.events. */
const record = {
  id: "R-CAFE", lender: "نايف", borrower: "مقهى الحي", amountSAR: 2500,
  installments: [{ dueISO: "2026-06-01", amountSAR: 2500 }],
  events: [
    ev("AHD_DRAFTED", { installments: 1 }), ev("LENDER_SIGNED"), ev("COUNTERPARTY_SIGNED"),
    ev("RECORD_SEALED"), ev("ACTIVATED"),
    ev("GRACE_REQUESTED", { reasonKey: "salary_delay", atISO: "2026-06-10" }),
    ev("GRACE_GRANTED"),
    ev("PRINCIPAL_PAID", { amountMinor: M(1000) }),
    ev("FORGIVEN")
  ]
};
const reminderHistory = {
  "R-CAFE": [{ tier: 1, atISO: "2026-06-05" }, { tier: 2, atISO: "2026-06-08" }]
};

console.log("covenant-log.test: sealed good-faith / mercy trail");

/* --- ORDERED build: canonical order sealed → reminders → grace_requested → grace_granted → paid → forgiven --- */
const log = C.buildCovenantLog(record, reminderHistory, engine, AS_OF);
ok(Array.isArray(log) && log.length >= 6, "buildCovenantLog returns a non-trivial ordered list");
const kinds = log.map(function (x) { return x.kind; });
assert.deepStrictEqual(
  kinds,
  ["sealed", "reminder", "reminder", "grace_requested", "grace_granted", "paid", "forgiven_all"],
  "kinds are in canonical order"
);
ok(true, "kinds order == sealed,reminder,reminder,grace_requested,grace_granted,paid,forgiven_all");
eq(kinds[0], "sealed", "first entry is the seal");
eq(kinds[kinds.length - 1], "forgiven_all", "last entry is the إبراء (forgiven_all)");

/* --- reminders carry the ORIGINAL amount + NO day-count / days-overdue field (dignity) --- */
const reminders = log.filter(function (x) { return x.kind === "reminder"; });
eq(reminders.length, 2, "exactly two reminder entries (one per history row)");
reminders.forEach(function (r, i) {
  eq(r.amountMinor, M(2500), "reminder " + (i + 1) + " carries the ORIGINAL principal amount (2500)");
});
const dayKeys = ["days", "daysOverdue", "dayCount", "overdueDays", "daysLate", "age"];
log.forEach(function (x) {
  dayKeys.forEach(function (k) { ok(!(k in x), "entry (" + x.kind + ") has NO day-count key «" + k + "»"); });
});
/* the reminder Arabic line must not leak a day number either */
reminders.forEach(function (r) { ok(!/\d+\s*(يوم|يوما|أيام|يومًا)/.test(r.ar), "reminder line exposes no «N يوم» day-counter"); });

/* --- amount honesty: no entry exceeds the principal; every amount is an integer halala --- */
log.forEach(function (x) {
  ok(typeof x.amountMinor === "number" && x.amountMinor % 1 === 0, "entry (" + x.kind + ") amountMinor is an integer");
  ok(x.amountMinor <= M(record.amountSAR), "entry (" + x.kind + ") amountMinor never exceeds the principal");
  ok(x.amountMinor >= 0, "entry (" + x.kind + ") amountMinor is non-negative");
});

/* --- canonical entry line is a stable, integer-halala string --- */
const line0 = C.covenantEntryCanonical(log[0], record, engine);
ok(typeof line0 === "string" && line0.length > 0, "covenantEntryCanonical returns a non-empty string");
eq(C.covenantEntryCanonical(log[0], record, engine), line0, "covenantEntryCanonical is deterministic");
ok(line0.indexOf(".") >= 0 ? /\.\d\d/.test(line0) : true, "canonical amounts (if any) are fixed-2 integer halalas");

/* --- SEAL the log: golden chain seal_i = sealBlock(prev, sha256(canonical_i), i) from GENESIS --- */
const sealed = C.sealCovenantLog(log, record, engine);
ok(sealed && Array.isArray(sealed.entries) && typeof sealed.head === "string", "sealCovenantLog returns {entries, head}");
eq(sealed.entries.length, log.length, "every entry is sealed");
/* determinism: identical head + identical entry seals across two runs */
const sealed2 = C.sealCovenantLog(C.buildCovenantLog(record, reminderHistory, engine, AS_OF), record, engine);
eq(sealed2.head, sealed.head, "sealCovenantLog head is deterministic across two runs");
assert.deepStrictEqual(sealed2.entries.map(function (e) { return e.seal; }),
  sealed.entries.map(function (e) { return e.seal; }), "all entry seals are deterministic across two runs");
ok(true, "seal chain is deterministic (head + per-entry seals identical across runs)");
/* head is the LAST seal */
eq(sealed.head, sealed.entries[sealed.entries.length - 1].seal, "head === last entry seal");
/* the chain is built with the GOLDEN primitives from GENESIS */
eq(sealed.entries[0].seal, engine.sealBlock(engine.GENESIS, sealed.entries[0].canonical_hash, 0),
  "entry 0 seal == sealBlock(GENESIS, hash0, 0) (golden primitive, from GENESIS)");
eq(sealed.entries[1].seal, engine.sealBlock(sealed.entries[0].seal, sealed.entries[1].canonical_hash, 1),
  "entry 1 seal chains off entry 0 (prev = previous seal)");
/* neighbouring seals differ (each block is distinct) */
for (var i = 1; i < sealed.entries.length; i++) {
  ok(sealed.entries[i].seal !== sealed.entries[i - 1].seal, "entry " + i + " seal differs from its neighbour " + (i - 1));
}

/* --- VERIFY: intact chain is ok; tampering entry #1's amount breaks it at/after 1 --- */
const vOk = C.verifyCovenantLog(sealed, record, engine);
eq(vOk.ok, true, "verifyCovenantLog(intact).ok === true");
eq(vOk.firstBrokenAt, -1, "intact chain has firstBrokenAt === -1 (nothing broken)");
const vBad = C.verifyCovenantLog(sealed, record, engine, 1);
eq(vBad.ok, false, "verifyCovenantLog(tamper @1).ok === false");
ok(vBad.firstBrokenAt >= 1, "tamper at index 1 breaks the chain at/after 1 (firstBrokenAt >= 1)");

/* --- EXHIBIT: neutral court projection — parties + termsHash + timeline + head, NO score/band/number-reputation --- */
const exhibit = C.exhibitFor(sealed, record, engine);
const s = JSON.stringify(exhibit);
ok(!/(score|band|rating|percent|٪|reputation|كفاءة|تصنيف)/.test(s),
  "exhibit contains NONE of score/band/rating/percent/٪/reputation/كفاءة/تصنيف");
ok(s.indexOf(record.lender) >= 0 && s.indexOf(record.borrower) >= 0, "exhibit contains BOTH parties");
ok(exhibit.parties && exhibit.parties.lender === record.lender && exhibit.parties.borrower === record.borrower,
  "exhibit.parties = {lender, borrower}");
ok(typeof exhibit.head === "string" && exhibit.head.length > 0 && exhibit.head === sealed.head,
  "exhibit.head === the sealed head");
ok(typeof exhibit.termsHash === "string" && exhibit.termsHash.length > 0, "exhibit carries a termsHash");
ok(Array.isArray(exhibit.timeline) && exhibit.timeline.length === log.length, "exhibit.timeline mirrors the sealed log");
exhibit.timeline.forEach(function (t) {
  ok(typeof t.kind === "string" && typeof t.seal === "string", "timeline row has {kind, seal}");
  ok(/^\d+\.\d\d$/.test(t.amountFixed2), "timeline row amountFixed2 is a fixed-2 integer-halala projection");
});
ok(typeof exhibit.finalStatus === "string" && exhibit.finalStatus.length > 0, "exhibit carries a finalStatus");

/* --- the exhibit's terms text is ribaScan-CLEAN (interest-free قرض حسن; negation before EACH trigger) --- */
eq(engine.ribaScan(C.covenantTermsAr(record, engine)).verdict, "clean",
  "covenantTermsAr reads CLEAN in the golden riba linter (زيادة/فائدة/غرامة each negated with «ولا»)");

/* --- an empty معروف (only draft/seal, no reminders/grace/pay/forgive) still builds & seals cleanly --- */
const bare = { id: "R-BARE", lender: "أ", borrower: "ب", amountSAR: 100,
  installments: [{ dueISO: "2026-06-01", amountSAR: 100 }],
  events: [ev("AHD_DRAFTED", { installments: 1 }), ev("RECORD_SEALED"), ev("ACTIVATED")] };
const bareLog = C.buildCovenantLog(bare, {}, engine, AS_OF);
eq(bareLog.length, 1, "a bare (sealed-only) record yields exactly one معروف entry (the seal)");
eq(C.verifyCovenantLog(C.sealCovenantLog(bareLog, bare, engine), bare, engine).ok, true, "the bare sealed log verifies ok");

console.log("\n========================================================");
console.log("COVENANT-LOG: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
