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

  /* a display-only privacy mask — «إخفاء المبالغ». Deterministic; replaces a
     formatted amount with «•••» so no figure leaks to a shoulder-surfer. It is
     applied ONLY at the display layer (App.fmtN); the engine bytes and every seal
     are computed from content, never from a masked string — so this is byte-safe. */
  function maskAmount(s, hide) { return hide ? "•••" : String(s == null ? "" : s); }

  /* the spine, stated as what عهد will NOT do (display copy — no numbers) */
  var SPINE_NO = [
    { t: "لا نُقرض", d: "المال مالُكم؛ عهد يشهد ويحفظ، ولا يُقرض من عنده." },
    { t: "لا نحكم", d: "عند الخلاف نحفظ الوثيقة محايدةً، ولا نقضي بين الطرفين." },
    { t: "لا نأخذ زيادة", d: "لا فائدة، ولا غرامةَ تأخير، ولا أيّ زيادةٍ على القرض — أبدًا." },
    { t: "لا نُصنّف", d: "لا رقم ولا درجةَ ائتمان؛ سجلّ وفائك مرآةٌ لك وحدك، لا يُصدَّر." }
  ];

  /* the positive counterpart — what عهد DOES (the four verbs of the spine) */
  var SPINE_YES = [
    { t: "نكتب ونشهد", d: "نوثّق العهد بصياغةٍ واضحة، ونختمه ختمًا لا يُزوَّر (نفاذ + تعمية)." },
    { t: "نحفظ الوثيقة", d: "تبقى الوثيقة المختومة لكما — دليلٌ محايدٌ عند الحاجة، لا نملكه ولا نبيعه." },
    { t: "نُسوّي بالتراضي", d: "نُقاصّ الديون المتشابكة بأقلّ التحويلات — بموافقة الجميع، بلا أيّ زيادة." },
    { t: "نُذكّر بالمعروف", d: "نُرسل تذكيرًا لطيفًا بالنيابة عنك حين يحين الموعد — بكرامة، بلا مطالبة." },
    { t: "نُيسّر عند العُسر", d: "نقترح الإمهال والإبراء — والعُسرُ يُقابَل بالرحمة، لا بالزيادة." }
  ];

  return { toArabicDigits: toArabicDigits, applyDigits: applyDigits, maskAmount: maskAmount, SPINE_NO: SPINE_NO, SPINE_YES: SPINE_YES };
});
