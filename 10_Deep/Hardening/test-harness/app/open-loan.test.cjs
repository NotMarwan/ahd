/* ============================================================================
   open-loan.test.cjs — TDD for features/open-loan.js. Open-term qard hasan:
   no schedule, no due, NEVER overdue; partial pay + lender إبراء; sealed with
   the golden primitives (reused, not modified). Deterministic, integer halalas.
============================================================================ */
const assert = require("assert");
const path = require("path");
const engine = require(path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", "engine.js"));
const L = require(path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", "features", "open-loan.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");
const M = engine.toMinor;
const apply = (loan, e) => Object.assign({}, loan, { events: loan.events.concat(e) });
const cons = (loan) => { const f = L.foldOpenLoan(loan); return f.paidMinor + f.forgivenMinor + f.remainingMinor; };

console.log("open-loan.test: open-term qard hasan");

const loan = L.makeOpenLoan({ id: "OPEN-MUNIRA-MAJID", lender: "منيرة", borrower: "ماجد", amountSAR: 20000, purpose: "لتجهيز عربة القهوة" });

/* --- shape + initial state --- */
eq(loan.term, "open", "loan.term == open");
eq(L.foldOpenLoan(loan).remainingMinor, M(20000), "initial remaining = full principal");
eq(L.foldOpenLoan(loan).statusKey, "ACTIVE", "initial statusKey ACTIVE (sealed+activated)");
ok(/مفتوح/.test(L.openLoanStatusAr(loan, engine)), "status label says «مفتوح … متى ما تيسّر»");
eq(cons(loan), M(20000), "conservation at start: paid+forgiven+remaining == principal");

/* --- canonical + seal (own canonical, golden primitives reused) --- */
const can = L.openLoanCanonical(loan, engine);
ok(/term=open/.test(can), "canonical carries term=open");
ok(/schedule=NONE/.test(can), "canonical carries schedule=NONE");
ok(/due=none/.test(can), "canonical carries due=none");
ok(/basis=Quran:2:280/.test(can), "canonical cites 2:280 (mercy is the basis of the open type)");
ok(/principal=20000\.00 SAR/.test(can), "canonical principal = 20000.00 SAR (integer halalas)");
ok(can.indexOf("متأخّر") < 0 && can.indexOf("schedule=1:") < 0, "canonical has NO schedule/overdue line");
const s1 = L.openLoanSeal(loan, engine);
eq(L.openLoanSeal(loan, engine).seal, s1.seal, "seal is deterministic (same loan → same seal)");
eq(L.verifyOpenLoan(loan, engine).ok, true, "verify intact == ok");
eq(L.verifyOpenLoan(loan, engine, 9999).ok, false, "verify under tampered amount is caught");

/* --- partial payment (any amount, whenever) --- */
const e1 = L.payEvent(loan, 5000, engine);
const loan2 = apply(loan, e1);
eq(L.foldOpenLoan(loan2).remainingMinor, M(15000), "after paying 5,000 → remaining 15,000");
eq(L.foldOpenLoan(loan2).statusKey, "PARTIAL", "after partial pay → statusKey PARTIAL");
ok(/سُدِّد جزء/.test(L.openLoanStatusAr(loan2, engine)), "status «سُدِّد جزءٌ منه — والباقي متى تيسّر»");
eq(cons(loan2), M(20000), "conservation after partial pay");

/* --- overpay is clamped to remaining (no overpayment) --- */
const e2 = L.payEvent(loan2, 99999, engine);
eq(e2.amountMinor, M(15000), "overpay clamps the event amount to the remaining 15,000");
const loan3 = apply(loan2, e2);
eq(L.foldOpenLoan(loan3).remainingMinor, 0, "after clamped pay → remaining 0");
eq(L.foldOpenLoan(loan3).statusKey, "KEPT", "fully paid open loan → KEPT");
ok(/ذمّة محفوظة/.test(L.openLoanStatusAr(loan3, engine)), "status «ذمّة محفوظة — وُفِّي به»");

/* --- إبراء: full forgiveness (lender-owned action) --- */
const loanF = apply(loan, L.forgiveEvent(loan, null, engine));
eq(L.foldOpenLoan(loanF).remainingMinor, 0, "full إبراء → remaining 0");
eq(L.foldOpenLoan(loanF).statusKey, "FORGIVEN", "full إبراء → FORGIVEN");
ok(/أُبرئ/.test(L.openLoanStatusAr(loanF, engine)), "status «أُبرئ — صدقةٌ من المُقرِض»");
eq(cons(loanF), M(20000), "conservation after full forgive (forgiven absorbs the remainder)");

/* --- إبراء: partial forgiveness leaves the rest an OPEN loan --- */
const loanPF = apply(loan, L.forgiveEvent(loan, 8000, engine));
eq(L.foldOpenLoan(loanPF).forgivenMinor, M(8000), "partial إبراء forgives exactly 8,000");
eq(L.foldOpenLoan(loanPF).remainingMinor, M(12000), "partial إبراء → 12,000 still open");
ok(L.foldOpenLoan(loanPF).statusKey !== "FORGIVEN", "partial إبراء does NOT close the ذمّة");
eq(cons(loanPF), M(20000), "conservation after partial forgive");

/* --- pay part then forgive the rest → FORGIVEN, exact --- */
const loanMix = apply(apply(loan, L.payEvent(loan, 12000, engine)), L.forgiveEvent(apply(loan, L.payEvent(loan, 12000, engine)), null, engine));
eq(L.foldOpenLoan(loanMix).remainingMinor, 0, "pay 12,000 then forgive rest → remaining 0");
eq(L.foldOpenLoan(loanMix).statusKey, "FORGIVEN", "closed by إبراء after a partial pay → FORGIVEN");
eq(cons(loanMix), M(20000), "conservation in the mixed path");

/* --- THE invariant: an open loan is NEVER overdue / DEFAULTED, even after long silence --- */
ok(["DEFAULTED", "ESCALATED"].indexOf(L.foldOpenLoan(loan).statusKey) < 0, "open loan is never DEFAULTED (no due date ⇒ no تأخّر)");
ok(typeof L.foldOpenLoan(loan).remainingMinor === "number", "remaining is a clean integer-halala number");

console.log("\n========================================================");
console.log("OPEN-LOAN: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
