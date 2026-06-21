/* ============================================================================
   features/open-loan.js — «القرض المفتوح · متى ما تيسّر» (Agent-2 spec).
   An open-term qard hasan: NO schedule, NO due, NEVER overdue. Settled by
   partial payments whenever eased; closed by full settle (KEPT) or by a
   lender-owned إبراء (full/partial → FORGIVEN). Its own canonical (term=open),
   sealed with the engine's GOLDEN sha256/sealBlock/GENESIS — reused, untouched.

   Dual module: Node `require`, browser `window.OpenLoan` (uses window.AHD).
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("../engine.js"));
  else root.OpenLoan = factory(root.AHD);
})(typeof self !== "undefined" ? self : this, function (ENGINE) {
  "use strict";
  var ev = ENGINE.ev;

  function makeOpenLoan(spec) {
    return {
      id: spec.id, type: "قرض حسن", lender: spec.lender, borrower: spec.borrower,
      principalMinor: ENGINE.toMinor(spec.amountSAR), term: "open", purpose: spec.purpose || "",
      timestamp: spec.timestamp || "2026-06-01T10:00:00+03:00",
      events: [ev("AHD_DRAFTED", { installments: 0, open: true }), ev("LENDER_SIGNED"),
        ev("COUNTERPARTY_SIGNED"), ev("RECORD_SEALED"), ev("ACTIVATED")]
    };
  }

  /* amount-aware reducer — the engine's fold counts installments; an open loan
     tracks paid/forgiven HALALAS. Pure & deterministic; conservation exact. */
  function foldOpenLoan(loan) {
    var principal = loan.principalMinor, paid = 0, forgiven = 0, sealed = false;
    (loan.events || []).forEach(function (e) {
      if (e.type === "RECORD_SEALED") sealed = true;
      else if (e.type === "PRINCIPAL_PAID") paid += (e.amountMinor || 0);
      else if (e.type === "PARTIAL_FORGIVEN") forgiven += (e.amountMinor || 0);
      else if (e.type === "FORGIVEN") forgiven = Math.max(forgiven, principal - paid); // forgive the remainder
      else if (e.type === "ALL_SETTLED") paid = principal - forgiven;                  // full settle of remaining
    });
    paid = Math.min(paid, principal);
    forgiven = Math.min(forgiven, principal - paid);
    var remaining = Math.max(0, principal - paid - forgiven);
    var statusKey = !sealed ? "DRAFT"
      : (remaining === 0 ? (forgiven > 0 ? "FORGIVEN" : "KEPT")
        : ((paid > 0 || forgiven > 0) ? "PARTIAL" : "ACTIVE"));
    return { statusKey: statusKey, paidMinor: paid, forgivenMinor: forgiven, remainingMinor: remaining, sealed: sealed };
  }

  function openLoanStatusAr(loan) {
    var f = foldOpenLoan(loan);
    return ({ DRAFT: "مسودّة — قرضٌ مفتوح", ACTIVE: "نشِط — مفتوح، متى ما تيسّر",
      PARTIAL: "سُدِّد جزءٌ منه — والباقي متى تيسّر", KEPT: "ذمّة محفوظة — وُفِّي به",
      FORGIVEN: "أُبرئ — صدقةٌ من المُقرِض" })[f.statusKey] || f.statusKey;
  }

  function openLoanTermsAr(loan, engine) {
    var e = engine || ENGINE;
    return "يُقِرّ الطرفان بأنّ «" + loan.lender + "» أقرضت «" + loan.borrower + "» مبلغ " +
      e.fmt(loan.principalMinor / 100) + " ريال على سبيل القرض الحسن، يُسدَّد متى ما تيسّر — كاملاً أو على " +
      "دفعاتٍ يبدؤها المقترض حين يقدر — دون موعدٍ محدّد، ودون أيّ زيادةٍ أو فائدةٍ أو غرامة. " +
      "وللمُقرِضة أن تُبرئ ما تشاء صدقةً متى شاءت. ﴿وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة﴾.";
  }

  /* OWN canonical — term=open, schedule=NONE, due=none. Sealed with golden sha256. */
  function openLoanCanonical(loan, engine, overrideMinor) {
    var e = engine || ENGINE;
    var principal = (overrideMinor == null) ? loan.principalMinor : e.toMinor(overrideMinor);
    return [
      "AHD-RECORD-v1", "ahd_id=" + loan.id, "type=" + loan.type,
      "lender=" + loan.lender, "borrower=" + loan.borrower,
      "principal=" + e.minorToFixed2(principal) + " SAR",
      "term=open", "schedule=NONE", "due=none",
      "terms_hash=" + e.sha256(openLoanTermsAr(loan, e)),
      "basis=Quran:2:280",
      "riba=interest:false;late_penalty_to_lender:false;gharar:none",
      "ts=" + loan.timestamp
    ].join("\n");
  }
  function openLoanSeal(loan, engine) {
    var e = engine || ENGINE, ch = e.sha256(openLoanCanonical(loan, e));
    return { canonical_hash: ch, seal: e.sealBlock(e.GENESIS, ch, 1) };
  }
  function verifyOpenLoan(loan, engine, tamperSAR) {
    var e = engine || ENGINE, base = openLoanSeal(loan, e);
    var ch = e.sha256(openLoanCanonical(loan, e, tamperSAR == null ? null : tamperSAR));
    var seal = e.sealBlock(e.GENESIS, ch, 1);
    return { ok: seal === base.seal, sealed: base.seal, recomputed: seal, canonical_hash: ch };
  }

  /* partial payment — any amount, clamped to remaining (no overpay) */
  function payEvent(loan, amountSAR, engine) {
    var e = engine || ENGINE, rem = foldOpenLoan(loan).remainingMinor;
    return ev("PRINCIPAL_PAID", { amountMinor: Math.min(e.toMinor(amountSAR), rem) });
  }
  /* إبراء — null = forgive the whole remainder; else a partial amount (rest stays open) */
  function forgiveEvent(loan, amountSAR, engine) {
    if (amountSAR == null) return ev("FORGIVEN");
    var e = engine || ENGINE, rem = foldOpenLoan(loan).remainingMinor;
    return ev("PARTIAL_FORGIVEN", { amountMinor: Math.min(e.toMinor(amountSAR), rem) });
  }

  return {
    makeOpenLoan: makeOpenLoan, foldOpenLoan: foldOpenLoan, openLoanStatusAr: openLoanStatusAr,
    openLoanTermsAr: openLoanTermsAr, openLoanCanonical: openLoanCanonical, openLoanSeal: openLoanSeal,
    verifyOpenLoan: verifyOpenLoan, payEvent: payEvent, forgiveEvent: forgiveEvent
  };
});
