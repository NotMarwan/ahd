/* ============================================================================
   features/settings.js — «الإعدادات» pure logic. The Arabic-Indic digit layer
   (resolves logged decision D-2 by making it the USER's choice). A deterministic
   display map applied on TOP of the engine's golden fmt() — the engine bytes
   never change, only the rendered glyphs. Default = western (engine-consistent).
   Also exposes the «ما لا نفعله» manifesto (the spine, stated plainly).

   Dual module: Node `require`, browser `window.Settings`.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Settings = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var W = "0123456789", A = "٠١٢٣٤٥٦٧٨٩";

  function toArabicDigits(s) {
    return String(s == null ? "" : s).replace(/[0-9]/g, function (d) { return A.charAt(W.indexOf(d)); });
  }
  function applyDigits(s, mode) {
    return mode === "arabic" ? toArabicDigits(s) : String(s == null ? "" : s);
  }

  /* the spine, stated as what عهد will NOT do (display copy — no numbers) */
  var SPINE_NO = [
    { t: "لا نُقرض", d: "المال مالُكم؛ عهد يشهد ويحفظ، ولا يُقرض من عنده." },
    { t: "لا نحكم", d: "عند الخلاف نحفظ الوثيقة محايدةً، ولا نقضي بين الطرفين." },
    { t: "لا نأخذ زيادة", d: "لا فائدة، ولا غرامةَ تأخير، ولا أيّ زيادةٍ على القرض — أبدًا." },
    { t: "لا نُصنّف", d: "لا رقم ولا درجةَ ائتمان؛ سجلّ وفائك مرآةٌ لك وحدك، لا يُصدَّر." }
  ];

  return { toArabicDigits: toArabicDigits, applyDigits: applyDigits, SPINE_NO: SPINE_NO };
});
