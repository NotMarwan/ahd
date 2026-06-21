/* ============================================================================
   features/create.js — create a new عهد (scheduled or open). The riba linter is
   the golden engine.ribaScan (reused, unmodified); the seal is the golden
   sha256/sealBlock. Auto-drafted terms negate each riba trigger DIRECTLY
   («بلا فائدةٍ، وبلا غرامة، وبلا أيّ زيادة») so the negation guard reads them clean
   (the golden guard only clears a trigger immediately preceded by a negation —
   a known FP otherwise; we phrase around it, never touch the linter).

   Dual module: Node `require`, browser `window.CreateAhd` (uses window.AHD).
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("../engine.js"));
  else root.CreateAhd = factory(root.AHD);
})(typeof self !== "undefined" ? self : this, function (ENGINE) {
  "use strict";
  var ev = ENGINE.ev;

  function makeDraft(input) {
    var open = !!input.open;
    return {
      id: input.id, type: "قرض حسن", lender: input.lender, borrower: input.borrower,
      amountMinor: ENGINE.toMinor(input.amountSAR), open: open, months: open ? 0 : (input.months || 1),
      start: input.start || { y: 2026, m: 7 }, timestamp: input.timestamp || "2026-07-01T10:00:00+03:00",
      purpose: input.purpose || ""
    };
  }

  function draftSchedule(draft, engine) {
    var e = engine || ENGINE;
    if (draft.open) return [];
    var insts = e.respread(draft.amountMinor, draft.months), arr = [], y = draft.start.y, m = draft.start.m;
    for (var i = 0; i < draft.months; i++) {
      var mm = ((m - 1 + i) % 12), yy = y + Math.floor((m - 1 + i) / 12);
      arr.push({ label: "1 " + e.AR_MONTHS[mm] + " " + yy, dueISO: yy + "-" + String(mm + 1).padStart(2, "0") + "-01", amountMinor: insts[i] });
    }
    return arr;
  }

  function draftTermsAr(draft, engine) {
    var e = engine || ENGINE, amt = e.fmt(draft.amountMinor / 100);
    var tail = "يُردُّ كما أُخِذ بلا فائدةٍ، وبلا غرامةِ تأخير، وبلا أيّ زيادة";
    if (draft.open) {
      return "يُقِرّ الطرفان بأنّ «" + draft.lender + "» أقرض «" + draft.borrower + "» مبلغ " + amt +
        " ريال على سبيل القرض الحسن، يُسدَّد متى ما تيسّر دون موعدٍ محدّد، " + tail +
        ". ﴿وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة﴾.";
    }
    var inst = e.fmt(e.respread(draft.amountMinor, draft.months)[0] / 100);
    return "يُقِرّ الطرفان بأنّ «" + draft.lender + "» أقرض «" + draft.borrower + "» مبلغ " + amt +
      " ريال على سبيل القرض الحسن، يُسدَّد على " + draft.months + " أقساطٍ شهريّةٍ متساوية قدر كلٍّ منها " +
      inst + " ريال، " + tail + ". عند العجز يُمهَل المقترض بالمعروف.";
  }

  /* the riba linter — the GOLDEN ribaScan, untouched */
  function ribaCheck(text, engine) { return (engine || ENGINE).ribaScan(text); }

  function createCanonical(draft, engine, overrideMinor) {
    var e = engine || ENGINE;
    var principal = overrideMinor == null ? draft.amountMinor : e.toMinor(overrideMinor);
    var lines = ["AHD-RECORD-v1", "ahd_id=" + draft.id, "type=" + draft.type, "lender=" + draft.lender,
      "borrower=" + draft.borrower, "principal=" + e.minorToFixed2(principal) + " SAR"];
    if (draft.open) { lines.push("term=open", "schedule=NONE", "due=none"); }
    else {
      var sched = draftSchedule(draft, e).map(function (s, i) { return (i + 1) + ":" + s.label + ":" + e.minorToFixed2(s.amountMinor); }).join("|");
      lines.push("term=scheduled", "months=" + draft.months, "schedule=" + sched);
    }
    lines.push("terms_hash=" + e.sha256(draftTermsAr(draft, e)), "basis=Quran:" + (draft.open ? "2:280" : "2:282"),
      "riba=interest:false;late_penalty_to_lender:false;gharar:none", "ts=" + draft.timestamp);
    return lines.join("\n");
  }
  function createSeal(draft, engine) {
    var e = engine || ENGINE, ch = e.sha256(createCanonical(draft, e));
    return { canonical_hash: ch, seal: e.sealBlock(e.GENESIS, ch, 1) };
  }
  function verifyCreated(draft, engine, tamperSAR) {
    var e = engine || ENGINE, base = createSeal(draft, e);
    var ch = e.sha256(createCanonical(draft, e, tamperSAR == null ? null : tamperSAR));
    var seal = e.sealBlock(e.GENESIS, ch, 1);
    return { ok: seal === base.seal, sealed: base.seal, recomputed: seal, canonical_hash: ch };
  }

  /* the create → دفتري loop — a created عهد is a valid دفتري record */
  function toDaftariRecord(draft, engine) {
    var e = engine || ENGINE;
    var installments = draft.open ? [{ dueISO: null, amountSAR: draft.amountMinor / 100 }]
      : draftSchedule(draft, e).map(function (s) { return { dueISO: s.dueISO, amountSAR: s.amountMinor / 100 }; });
    return {
      id: draft.id, lender: draft.lender, borrower: draft.borrower, amountSAR: draft.amountMinor / 100,
      installments: installments,
      events: [ev("AHD_DRAFTED", { installments: draft.open ? 1 : draft.months }), ev("LENDER_SIGNED"), ev("COUNTERPARTY_SIGNED"), ev("RECORD_SEALED"), ev("ACTIVATED")]
    };
  }

  return {
    makeDraft: makeDraft, draftSchedule: draftSchedule, draftTermsAr: draftTermsAr, ribaCheck: ribaCheck,
    createCanonical: createCanonical, createSeal: createSeal, verifyCreated: verifyCreated, toDaftariRecord: toDaftariRecord
  };
});
