/* ============================================================================
   features/bounds-detail.js — parse a guarantee's «يحرسه» line into its guard
   files + the ONE offline command that runs that guard. Pure string work; the
   files' existence is proven by tests/app/bounds-detail.test.cjs (same teeth
   as bounds.test.cjs). Honesty: the screen INVITES running the guard — it
   never claims a live pass it did not run.
   Dual module: Node `require`, browser `window.BoundsDetail`.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.BoundsDetail = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function parseEnforcedBy(str) {
    var files = String(str || "").split("·").map(function (s) { return s.trim(); }).filter(Boolean);
    var testFile = null;
    for (var i = 0; i < files.length; i++) {
      if (files[i].indexOf("tests/") === 0) { testFile = files[i]; break; }
    }
    return { files: files, runCmd: testFile ? "node " + testFile : null };
  }

  function detailAr(item) {
    var d = parseEnforcedBy(item.enforcedBy);
    return {
      files: d.files, runCmd: d.runCmd,
      invite: "شغّل حارسَه بنفسك دون إنترنت — الاختبار يفشل إن خالف الكودُ هذا الوعد."
    };
  }

  return { parseEnforcedBy: parseEnforcedBy, detailAr: detailAr };
});
