/* ============================================================================
   features/review-gate.js — the Najiz/DocuSign-inspired FIXED REVIEW before
   sealing: a frozen summary of exactly what will be sealed (parties, amount,
   schedule, terms) + the «ما ليس في هذا العهد» absent-list + a deterministic
   preview fingerprint (djb2 — a PREVIEW checksum, NOT the cryptographic seal;
   the real SHA-256 seal happens after confirmation via the golden engine).
   Pure, deterministic, DOM-free.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ReviewGate = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* djb2 over UTF-16 code units → 8 hex chars. Labeled «بصمة معاينة» in UI. */
  function fingerprint(str) {
    var h = 5381, s = String(str == null ? "" : str);
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    var hex = (h >>> 0).toString(16);
    while (hex.length < 8) hex = "0" + hex;
    return hex;
  }

  var ABSENT = [
    "لا فائدة ولا زيادة مشروطة",
    "لا غرامة تأخير",
    "لا خصم آلي ولا حيازة أموال"
  ];

  function build(draft, termsAr) {
    draft = draft || {};
    var sar = (Number(draft.amountMinor) || 0) / 100;
    var schedule = draft.open ? "مفتوح · متى ما تيسّر" : ((draft.months || 1) + " أقساط شهرية");
    var lines = [
      { k: "المُقرِض", v: String(draft.lender || "") },
      { k: "المقترض", v: String(draft.borrower || "") },
      { k: "المبلغ", v: sar + " ر.س" },
      { k: "السداد", v: schedule },
      { k: "النص", v: String(termsAr || "") }
    ];
    var canonical = lines.map(function (l) { return l.k + ":" + l.v; }).join("|");
    return { lines: lines, absentAr: ABSENT.slice(), fingerprint: fingerprint(canonical) };
  }

  return { build: build, fingerprint: fingerprint, ABSENT: ABSENT };
});
