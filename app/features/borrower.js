/* ============================================================================
   features/borrower.js — «ما عليّ» borrower home (F1). The mirror-image of
   دفتري, told from the DEBTOR's side: the person Qur'an 2:280 is about
   («وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة»). Surfaces the viewer's OWN obligations
   as dignified rows (amber, NEVER red, NO day-counter to the borrower), lets the
   borrower INITIATE a grace request (fixed enum, adds NOTHING — no riba, no
   surcharge) and pay-what-eased (clamped to remaining, conservation exact,
   integer halalas). No score / band / number-as-reputation — ever.

   Reuses (DI): the golden engine (toMinor/minorToFixed2/fmt/fold/statusLabel/ev),
   Daftari.rowFor (remaining/status/overdue, computed the SAME way the ledger does)
   and OpenLoan.foldOpenLoan for open-term records. Edits neither. Deterministic:
   fixed asOf, pure civil-days compare — NO Date.now / new Date / Math.random / Intl.

   Dual module: Node `require(...)`, browser `window.Borrower` (uses window.AHD).
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("../engine.js"), require("./daftari.js"), require("./open-loan.js"));
  } else {
    root.Borrower = factory(root.AHD, root.Daftari, root.OpenLoan);
  }
})(typeof self !== "undefined" ? self : this, function (ENGINE, DAFTARI, OPENLOAN) {
  "use strict";

  var AS_OF_DEFAULT = "2026-06-21";   // fixed demo "today" — determinism (matches Daftari)
  var DUE_SOON_DAYS = 7;              // an unpassed due within a week = «قريب» (bucket 1)
  var CLOSED = { KEPT: 1, FORGIVEN: 1, VOID: 1 };

  /* ---- the fixed, dignified grace-reason enum (never free text ⇒ deterministic + safe) ---- */
  var GRACE_REASONS = Object.freeze([
    Object.freeze({ key: "salary_delay", ar: "تأخّر الراتب" }),
    Object.freeze({ key: "medical", ar: "ظرفٌ صحّي" }),
    Object.freeze({ key: "urgent_obligation", ar: "التزامٌ عاجل" }),
    Object.freeze({ key: "unspecified", ar: "ظرفٌ طارئ — دون تفصيل" })
  ]);
  function isReason(key) { for (var i = 0; i < GRACE_REASONS.length; i++) if (GRACE_REASONS[i].key === key) return true; return false; }
  function reasonAr(key) { for (var i = 0; i < GRACE_REASONS.length; i++) if (GRACE_REASONS[i].key === key) return GRACE_REASONS[i].ar; return GRACE_REASONS[GRACE_REASONS.length - 1].ar; }

  /* has the borrower asked for grace that the lender hasn't yet granted? (pending mercy) */
  function graceRequestedPending(events) {
    var requested = false, granted = false;
    (events || []).forEach(function (e) {
      if (e.type === "GRACE_REQUESTED") requested = true;
      else if (e.type === "GRACE_GRANTED") granted = true;
    });
    return requested && !granted;
  }
  function graceGranted(events) {
    var f = ENGINE.fold(events || []);
    return !!f.graced;
  }

  /* is this an open-term record? (OpenLoan makes term==="open") */
  function isOpenTerm(record) { return record && record.term === "open"; }

  /* halalas the borrower has knocked off THIS record via arbitrary partial payments /
     إبراء — events the installment-fold (Daftari) doesn't see. The borrower can pay
     any amount whenever eased (2:280); we honour those against the row's remaining.
     Pure sum; conservation stays exact (paid + forgiven + remaining == principal). */
  function amountFoldMinor(events) {
    var paid = 0, forgiven = 0;
    (events || []).forEach(function (e) {
      if (e.type === "PRINCIPAL_PAID") paid += (e.amountMinor || 0);
      else if (e.type === "PARTIAL_FORGIVEN") forgiven += (e.amountMinor || 0);
    });
    return { paidMinor: paid, forgivenMinor: forgiven, knockedMinor: paid + forgiven };
  }

  /* ---- one obligation row for a debt the viewer OWES ----
     Remaining/status/overdue come from the SAME fold the ledger uses:
       · installment records → Daftari.rowFor (reuses engine.fold/statusLabel)
       · open-term records   → OpenLoan.foldOpenLoan (no due ⇒ never overdue)
     urgencyRank: overdue=0 → due-soon=1 → open/on-track=2 → settled=3. */
  function obligationFor(record, viewer, engine, asOf) {
    var e = engine || ENGINE;
    asOf = asOf || AS_OF_DEFAULT;
    var inGrace = graceGranted(record.events) || graceRequestedPending(record.events);

    if (isOpenTerm(record) && OPENLOAN && OPENLOAN.foldOpenLoan) {
      var of = OPENLOAN.foldOpenLoan(record);
      var openClosed = (of.statusKey === "KEPT" || of.statusKey === "FORGIVEN");
      return {
        record: record,
        remainingMinor: of.remainingMinor,
        statusKey: of.statusKey,
        statusAr: OPENLOAN.openLoanStatusAr ? OPENLOAN.openLoanStatusAr(record, e) : of.statusKey,
        isOverdue: false,                         // an open loan is NEVER overdue (no due date)
        dueSoon: false,
        inGrace: inGrace,
        counterparty: record.lender,
        urgencyRank: openClosed ? 3 : 2           // open/on-track bucket, or settled
      };
    }

    /* installment / dated record → reuse the creditor-home row math (byte-for-byte),
       then subtract any borrower partial payments / إبراء the installment-fold can't
       see (clamped so remaining never goes below 0). */
    var row = DAFTARI.rowFor(record, viewer, e, asOf);
    var closed = CLOSED[row.statusKey];
    var baseRemaining = e.toMinor(row.remainingSAR);
    var knocked = amountFoldMinor(record.events).knockedMinor;
    var remainingMinor = Math.max(0, baseRemaining - knocked);
    var dueSoon = false;
    if (!closed && !row.isOverdue && row.nextDueISO) {
      var d = DAFTARI.daysBetween(row.nextDueISO, asOf);   // days FROM asOf UNTIL the due date
      dueSoon = (d >= 0 && d <= DUE_SOON_DAYS);
    }
    var rank = closed ? 3 : (row.isOverdue ? 0 : (dueSoon ? 1 : 2));
    return {
      record: record,
      remainingMinor: remainingMinor,
      statusKey: row.statusKey,
      statusAr: row.status,
      isOverdue: !!row.isOverdue,
      dueSoon: dueSoon,
      inGrace: inGrace,
      counterparty: record.lender,                // the person the viewer owes
      urgencyRank: rank
    };
  }

  function byId(a, b) { var ia = a.record.id, ib = b.record.id; return ia < ib ? -1 : ia > ib ? 1 : 0; }
  function sortObligations(a, b) {
    if (a.urgencyRank !== b.urgencyRank) return a.urgencyRank - b.urgencyRank;
    return byId(a, b);   // stable within a rank by record id (deterministic across runs)
  }

  /* the viewer's «عليّ» debts (records where the viewer is the borrower), sorted */
  function borrowerObligations(records, viewer, engine, asOf) {
    return (records || [])
      .filter(function (r) { return r && r.borrower === viewer; })
      .map(function (r) { return obligationFor(r, viewer, engine, asOf); })
      .sort(sortObligations);
  }

  /* ---- borrower-INITIATED grace request: a deterministic GRACE_REQUESTED event
         carrying a reasonKey from the fixed enum (unknown/missing → "unspecified").
         Adds NO amount — grace changes nothing; a later lender GRACE_GRANTED
         re-spreads the SAME remaining sum-preserving (no riba, no surcharge). ---- */
  function graceRequest(record, reasonKey, asOf) {
    var key = isReason(reasonKey) ? reasonKey : "unspecified";
    return ENGINE.ev("GRACE_REQUESTED", { reasonKey: key, atISO: asOf || AS_OF_DEFAULT });
  }

  /* remaining (integer halalas) for a record the viewer owes — the fold the row uses */
  function remainingMinorOf(record, viewer, engine, asOf) {
    return obligationFor(record, viewer, engine, asOf).remainingMinor;
  }

  /* ---- borrower-initiated partial payment, CLAMPED to the remaining (no overpay);
         bad input → a safe no-op event (amountMinor 0). Integer halalas. ---- */
  function payWhatEased(record, amountSAR, engine) {
    var e = engine || ENGINE;
    var amt = Number(amountSAR);
    var want = (isFinite(amt) && amt > 0) ? e.toMinor(amt) : 0;
    var rem = remainingMinorOf(record, record ? record.borrower : null, e);
    var pay = Math.max(0, Math.min(want, rem));
    return e.ev("PRINCIPAL_PAID", { amountMinor: pay });
  }

  /* ---- summary strip: counts + total remaining, integers ONLY. No score, no band,
         no percent, no number-as-reputation (spine: the trust signal is never a number
         and never lives here). ---- */
  function borrowerSummary(records, viewer, engine, asOf) {
    var obs = borrowerObligations(records, viewer, engine, asOf);
    var owedCount = 0, totalRemainingMinor = 0, inGraceCount = 0;
    obs.forEach(function (o) {
      if (!CLOSED[o.statusKey]) owedCount++;                 // LIVE obligations only
      totalRemainingMinor += o.remainingMinor;               // Σ in integer halalas
      if (o.inGrace) inGraceCount++;
    });
    return { owedCount: owedCount, totalRemainingMinor: totalRemainingMinor, inGraceCount: inGraceCount };
  }

  /* ---- the whole borrower view: dignified rows + summary. Deterministic; contains
         no band/score/percent/rating token (asserted by the test's regex scan). ---- */
  function makeBorrowerView(records, viewer, engine, asOf) {
    var obs = borrowerObligations(records, viewer, engine, asOf);
    var rows = obs.map(function (o) {
      return {
        id: o.record.id,
        counterparty: o.counterparty,
        remainingMinor: o.remainingMinor,
        statusKey: o.statusKey,
        statusAr: o.statusAr,
        isOverdue: o.isOverdue,
        dueSoon: o.dueSoon,
        inGrace: o.inGrace,
        urgencyRank: o.urgencyRank
      };
    });
    return { rows: rows, summary: borrowerSummary(records, viewer, engine, asOf) };
  }

  return {
    AS_OF_DEFAULT: AS_OF_DEFAULT, DUE_SOON_DAYS: DUE_SOON_DAYS, GRACE_REASONS: GRACE_REASONS,
    reasonAr: reasonAr, graceRequestedPending: graceRequestedPending,
    obligationFor: obligationFor, borrowerObligations: borrowerObligations,
    graceRequest: graceRequest, payWhatEased: payWhatEased,
    borrowerSummary: borrowerSummary, makeBorrowerView: makeBorrowerView
  };
});
