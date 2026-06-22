/* ============================================================================
   features/request.js — «اطلب عهدًا» (borrower-initiated qard-hasan request).
   The product's emotional core: dignifying the ASK. Today only the lender can
   create a عهد; here YOU (the borrower) compose a witnessed request to a lender,
   and on accept it becomes a sealed عهد in your «عليّ». Thin by design: it reuses
   the GOLDEN create seal + riba linter + the create→دفتري loop (no new crypto).

   Dual module: Node `require`, browser `window.RequestAhd` (uses window.AHD + window.CreateAhd).
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("../engine.js"), require("./create.js"));
  else root.RequestAhd = factory(root.AHD, root.CreateAhd);
})(typeof self !== "undefined" ? self : this, function (ENGINE, CREATE) {
  "use strict";

  function makeRequest(input) {
    return {
      id: input.id, borrower: input.borrower, lender: input.lender,
      amountSAR: input.amountSAR, open: !!input.open, months: input.open ? 0 : (input.months || 1),
      purpose: input.purpose || "", note: input.note || ""
    };
  }

  /* map the ask to a CreateAhd draft — same witnessed record, roles set by the ask */
  function toDraft(req) {
    return CREATE.makeDraft({ id: req.id, lender: req.lender, borrower: req.borrower, amountSAR: req.amountSAR, open: req.open, months: req.months, purpose: req.purpose });
  }
  function requestTermsAr(req, engine) { return CREATE.draftTermsAr(toDraft(req), engine || ENGINE); }
  function requestRibaCheck(req, engine) { return (engine || ENGINE).ribaScan(requestTermsAr(req, engine || ENGINE)); }
  function requestSeal(req, engine) { return CREATE.createSeal(toDraft(req), engine || ENGINE); }
  /* the lender accepts → a sealed دفتري record (borrower = the asker ⇒ «عليّ») */
  function acceptToRecord(req, engine) { return CREATE.toDaftariRecord(toDraft(req), engine || ENGINE); }

  return { makeRequest: makeRequest, toDraft: toDraft, requestTermsAr: requestTermsAr, requestRibaCheck: requestRibaCheck, requestSeal: requestSeal, acceptToRecord: acceptToRecord };
});
