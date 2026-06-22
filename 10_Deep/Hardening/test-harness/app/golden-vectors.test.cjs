/* ============================================================================
   golden-vectors.test.cjs — pins the NEW features' deterministic outputs to
   absolute golden values, exactly as the demo's golden-vectors.json pins the
   demo. The feature suites prove *relative* determinism (same input → same seal);
   THIS proves the absolute bytes never drift — so a silent change to any feature's
   canonical layout, terms wording, or split logic is caught immediately.

   To regenerate after an INTENTIONAL change: recompute the seals and update here
   (a deliberate, reviewed act — never an automatic one).
============================================================================ */
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", ...p);
const E = require(P("engine.js"));
const OL = require(P("features", "open-loan.js"));
const CA = require(P("features", "circle-adv.js"));
const CR = require(P("features", "create.js"));
const PF = require(P("features", "proof.js"));
const M = E.toMinor;

let pass = 0, fail = 0;
const eq = (a, b, m) => { if (a === b) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m + "  (got " + JSON.stringify(a) + ")"); } };

console.log("golden-vectors.test: absolute drift-guard for the new surface");

/* the demo's main record seal — the project's anchor golden value */
eq(E.SEALED.seal, "6c9410b95ba4715a3c2b174ff70aa2d7ab88fa0294868a41354d2f9e60f7fd18", "engine main record seal (golden 6c9410b9…)");

/* القرض المفتوح — منيرة→ماجد 20,000 */
const ol = OL.makeOpenLoan({ id: "OPEN-MUNIRA-MAJID", lender: "منيرة", borrower: "ماجد", amountSAR: 20000, purpose: "لتجهيز عربة القهوة" });
eq(OL.openLoanSeal(ol, E).seal, "b080f79e32c96d725cc70364305e0412465ed5a135c2d9332b26a4d83f5b5e45", "open-loan seed seal (golden)");

/* create-عهد — NEW-1 أنت→سلطان 1,200 / 3 */
const d1 = CR.makeDraft({ id: "NEW-1", lender: "أنت", borrower: "سلطان", amountSAR: 1200, months: 3 });
eq(CR.createSeal(d1, E).seal, "0463553997c80d77e65d1a411acc0e0bd9d4bef67a92dc96af045dfa24a2b8f8", "create NEW-1 seal (golden)");
/* the APP's seeded create draft (NEW-AHD-1) — what the live screen seals */
const d2 = CR.makeDraft({ id: "NEW-AHD-1", lender: "أنت", borrower: "سلطان", amountSAR: 1200, months: 3 });
eq(CR.createSeal(d2, E).seal, "866304d85d6dae159ba5d6ddabfc84380d64669cc4a4e4017ba6f87ab6ae6afe", "app create-screen seed seal (golden)");

/* graduation قَيْد→عهد — تركي 1,500 from «شقة الملقا» */
const g = CA.graduateShare({ name: "تركي", amountMinor: M(1500) }, { id: "CIR-STD-MALQA", organizer: "سعود", name: "شقة الملقا" }, E, OL);
eq(g.seal, "5fb4dad1657f5899c9c54e37edb202e3226b2b93932201ee90e7e5356477c44a", "graduation→عهد seal (golden)");

/* بالأصناف — exact per-member halalas (conserved) */
const bc = CA.byCategorySplit([
  { label: "ستيك", amountMinor: M(300), assignedTo: ["خالد"] },
  { label: "بيتزا مشتركة", amountMinor: M(200), assignedTo: ["خالد", "ريم", "نورة"] },
  { label: "عصائر", amountMinor: M(90), assignedTo: ["ريم", "نورة"] }
], ["خالد", "ريم", "نورة"], E);
eq(bc.shares["خالد"], 36667, "بالأصناف خالد halalas (golden)");
eq(bc.shares["ريم"], 11167, "بالأصناف ريم halalas (golden)");
eq(bc.shares["نورة"], 11166, "بالأصناف نورة halalas (golden)");
eq(bc.shares["خالد"] + bc.shares["ريم"] + bc.shares["نورة"], M(590), "بالأصناف Σ == 590 SAR (conserved)");

/* recurring auto-post — equal split, payer excluded (golden) */
const posts = CA.recurringPosts({ name: "الإيجار", amountMinor: M(3600), payer: "تركي", members: ["سعود", "تركي", "عبدالله"], split: "equal" }, ["2026-07"]);
eq(posts[0].owed["سعود"], M(1200), "recurring owed سعود (golden)");
eq(posts[0].payerShareMinor + posts[0].owed["سعود"] + posts[0].owed["عبدالله"], M(3600), "recurring conserved == full bill");

/* حافظة الإثبات — proof-pack of the نورة→سارة 5,000 عهد (anchors the canonical layout) */
const ev = (t, x) => Object.assign({ type: t }, x || {});
const prec = { id: "R-PROOF", lender: "نورة", borrower: "سارة", amountSAR: 5000, installments: [{ dueISO: "2026-08-01", amountSAR: 5000 }], events: [ev("AHD_DRAFTED", { installments: 1 }), ev("LENDER_SIGNED"), ev("COUNTERPARTY_SIGNED"), ev("RECORD_SEALED"), ev("ACTIVATED")] };
const ppk = PF.buildProofPack(prec, E);
eq(ppk.contentHash, "c21b44e75822e867aece71046bbaf3ca35c07ee933994ec6b71b8abce87b44f0", "proof-pack content hash (golden)");
eq(ppk.seal, "c1ae7f25f74efa87be18f6f53d9eb3a237173a05c521dce6f2ac2eed2fca2f54", "proof-pack block seal (golden c1ae7f25…)");

console.log("\n========================================================");
console.log("GOLDEN-VECTORS: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
