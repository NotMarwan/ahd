/* ============================================================================
   create.test.cjs — TDD for features/create.js. Create a new عهد (scheduled or
   open), with the golden riba linter + golden seal, and a دفتري-compatible record.
   Deterministic, integer halalas. Golden funcs (ribaScan/sha256/sealBlock) reused.
============================================================================ */
const path = require("path");
const engine = require(path.join(__dirname, "..", "..", "app", "engine.js"));
const C = require(path.join(__dirname, "..", "..", "app", "features", "create.js"));
const D = require(path.join(__dirname, "..", "..", "app", "features", "daftari.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("create.test: create-عهد flow");

const draft = C.makeDraft({ id: "NEW-1", lender: "أنت", borrower: "سلطان", amountSAR: 1200, months: 3 });
eq(draft.open, false, "scheduled draft: open == false");
eq(draft.months, 3, "scheduled draft: months == 3");
eq(draft.amountMinor, engine.toMinor(1200), "amount stored in integer halalas");

/* terms auto-draft + the RIBA LINTER (golden ribaScan, reused) */
const terms = C.draftTermsAr(draft, engine);
ok(/سلطان/.test(terms), "terms name the borrower");
ok(/1,200/.test(terms), "terms carry the amount");
ok(/قرض/.test(terms) && /حسن/.test(terms), "terms state قرض حسن");
eq(C.ribaCheck(terms, engine).verdict, "clean", "auto-drafted terms pass the riba linter (clean)");
const blocked = C.ribaCheck(terms + " وعليه غرامةُ تأخيرٍ شهريّة.", engine);
eq(blocked.verdict, "block", "a late-penalty clause is BLOCKED");
ok(blocked.hits.length > 0 && /غرامة|تأخير/.test(blocked.hits[0].why + blocked.hits[0].fix), "block carries the reason + the halal fix");
eq(C.ribaCheck("قرضٌ حسن بلا فائدة ولا غرامة.", engine).verdict, "clean", "negation «بلا فائدة» reads CLEAN (golden guard)");
eq(C.ribaCheck("عليه فائدة ٥٪.", engine).verdict, "block", "an explicit interest clause is BLOCKED");

/* canonical + seal (own generic canonical, golden sha256/sealBlock) */
const can = C.createCanonical(draft, engine);
ok(/ahd_id=NEW-1/.test(can), "canonical carries ahd_id");
ok(/principal=1200\.00 SAR/.test(can), "canonical principal = 1200.00 SAR");
ok(/months=3/.test(can), "scheduled canonical carries months=3");
ok(/basis=Quran:2:282/.test(can), "scheduled canonical cites 2:282 (write the debt)");
const s1 = C.createSeal(draft, engine);
ok(!!s1.seal && s1.seal.length === 64, "createSeal returns a real SHA-256 seal");
eq(C.createSeal(draft, engine).seal, s1.seal, "seal is deterministic");
eq(C.verifyCreated(draft, engine).ok, true, "verify intact == ok");
eq(C.verifyCreated(draft, engine, 9999).ok, false, "verify under a tampered amount is caught");

/* open-term variant reuses the open canonical shape */
const od = C.makeDraft({ id: "NEW-2", lender: "أنت", borrower: "ماجد", amountSAR: 5000, open: true });
eq(od.open, true, "open draft: open == true");
ok(/term=open/.test(C.createCanonical(od, engine)), "open canonical carries term=open");

/* the create → دفتري loop: a created عهد is a valid دفتري row */
const rec = C.toDaftariRecord(draft, engine);
const row = D.rowFor(rec, "أنت", engine, "2026-06-21");
eq(row.role, "lender", "created عهد: viewer is the lender");
eq(row.counterparty, "سلطان", "created عهد: counterparty is the borrower");
eq(row.amountSAR, 1200, "created عهد: amount flows into دفتري");
ok(row.statusKey === "ACTIVE" || row.statusKey === "SETTLING", "created عهد starts ACTIVE in دفتري");

console.log("\n========================================================");
console.log("CREATE: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
