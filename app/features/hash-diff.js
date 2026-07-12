/* ============================================================================
   features/hash-diff.js — pure hex-string divergence for the judge-driven tamper
   (Front C). Given two seal hashes, report which nibbles differ so the UI can
   highlight the avalanche character-by-character. No DOM, no Date, no engine —
   the SHA-256 itself stays in the golden engine; this only compares two strings.
   Node-testable; browser → window.HashDiff.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HashDiff = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* indices where a and b differ (the longer string's tail counts as changed) */
  function diverging(a, b) {
    a = String(a == null ? "" : a);
    b = String(b == null ? "" : b);
    var n = Math.max(a.length, b.length), out = [];
    for (var i = 0; i < n; i++) { if (a.charAt(i) !== b.charAt(i)) out.push(i); }
    return out;
  }

  /* per-character render model for `hex`, flagging the changed indices */
  function spans(hex, indices) {
    hex = String(hex == null ? "" : hex);
    var set = {};
    (indices || []).forEach(function (i) { set[i] = true; });
    var out = [];
    for (var i = 0; i < hex.length; i++) out.push({ ch: hex.charAt(i), changed: !!set[i] });
    return out;
  }

  function count(a, b) { return diverging(a, b).length; }

  return { diverging: diverging, spans: spans, count: count };
});
