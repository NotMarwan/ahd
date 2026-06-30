/* ============================================================================
   request.test.cjs — «اطلب عهدًا» (borrower-initiated qard-hasan request) suite.
   The product's emotional core: dignifying the ASK. You (the borrower) compose a
   witnessed request to a lender; on accept it becomes a sealed عهد in your «عليّ».
   Reuses the GOLDEN create seal (no new crypto); riba-clean terms; integer halalas.
============================================================================ */
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "app", ...p);
const E = require(P("engine.js"));
const CR = require(P("features", "create.js"));
const R = require(P("features", "request.js"));

let pass = 0, fail = 0;
const ok = (c, m, d) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m + (d ? "  — " + d : "")); } };

console.log("request.test: «اطلب عهدًا» — the borrower-initiated ask\n");

const req = R.makeRequest({ id: "REQ-1", borrower: "نايف", lender: "سلطان", amountSAR: 1500, months: 3, purpose: "إصلاح السيارة" });

/* ---- the request keeps the asker as borrower, integer halalas ---- */
ok(req.borrower === "نايف" && req.lender === "سلطان", "the asker is the BORROWER; the other party is the lender");
ok(R.toDraft(req).amountMinor === E.toMinor(1500), "amount is integer halalas (toMinor) via the create draft");

/* ---- terms are riba-clean (reuses the golden ribaScan through create) ---- */
ok(R.requestRibaCheck(req, E).verdict === "clean", "the auto-drafted request terms pass the riba linter (clean)");
ok(/قرض الحسن|قرضٌ حسن|القرض الحسن/.test(R.requestTermsAr(req, E)), "the terms frame it as قرض حسن");
ok(/بلا فائدة|بلا أيّ زيادة/.test(R.requestTermsAr(req, E)), "the terms state no interest / no increase");

/* ---- seal reuses the GOLDEN create seal exactly (no new crypto) ---- */
const draft = CR.makeDraft({ id: "REQ-1", lender: "سلطان", borrower: "نايف", amountSAR: 1500, months: 3, purpose: "إصلاح السيارة" });
ok(R.requestSeal(req, E).seal === CR.createSeal(draft, E).seal, "request seal == the golden create seal for the equivalent draft (byte-identical reuse)");
ok(/^[0-9a-f]{64}$/.test(R.requestSeal(req, E).seal), "the seal is a valid 64-hex");
ok(R.requestSeal(req, E).seal === R.requestSeal(req, E).seal, "deterministic seal");

/* ---- on accept → a real دفتري record that lands in «عليّ» (you owe) ---- */
const rec = R.acceptToRecord(req, E);
ok(rec.borrower === "نايف" && rec.lender === "سلطان", "accepted record: borrower = you → it lands in the «عليّ» tab");
ok(rec.events.some(e => e.type === "RECORD_SEALED"), "accepted record carries a RECORD_SEALED event (witnessed)");
ok(rec.amountSAR === 1500, "accepted record preserves the amount exactly");
ok(rec.installments && rec.installments.length === 3, "scheduled request → 3 installments");

/* ---- open-term ask («متى ما تيسّر») ---- */
const openReq = R.makeRequest({ id: "REQ-OPEN", borrower: "نايف", lender: "منيرة", amountSAR: 4000, open: true, purpose: "قرض ميسّر" });
ok(R.requestRibaCheck(openReq, E).verdict === "clean", "open-term request terms are riba-clean too");
const openRec = R.acceptToRecord(openReq, E);
ok(openRec.installments[0].dueISO === null, "open-term accepted record has no due date (never overdue)");

/* ---- no score / percentage anywhere ---- */
ok(!/\d{1,3}\s*[%٪]/.test(R.requestTermsAr(req, E)), "no percentage in the request terms");

console.log("\n" + "=".repeat(56));
console.log("REQUEST: " + pass + " passed, " + fail + " failed");
console.log("=".repeat(56));
process.exit(fail ? 1 : 0);
