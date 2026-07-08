/* ============================================================================
   features/bounds.js — «الضمانات والحدود» content view-model (JL-4).
   Guarantees-as-code: three columns (للمدين · للدائن · حدود المصرف) where EVERY
   guarantee names the exact file/test that enforces it in this repo — and
   tests/app/bounds.test.cjs proves each named file exists on disk. The panel
   DESCRIBES existing guarantees only; it changes zero semantics. Borrower-
   invokable إبراء stays OUT (lender-owned — D-territory, DECISIONS-FOR-MARWAN).
   Pure constant content + a describe function: no date / randomness / locale
   primitive anywhere (statically scanned by bounds.test.cjs). Deep-frozen so
   the content cannot drift at runtime. Dual module: Node `require`,
   browser `window.Bounds`.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Bounds = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function deepFreeze(o) {
    Object.getOwnPropertyNames(o).forEach(function (k) {
      var v = o[k];
      if (v && typeof v === "object") deepFreeze(v);
    });
    return Object.freeze(o);
  }

  /* Every enforcedBy names repo-root-relative files that REALLY exist — the
     suite extracts each app/…·tests/… token and fs.existsSync's it (the teeth).
     Format: «feature-or-rule file · the test that guards it». */
  var SECTIONS = deepFreeze([
    {
      key: "borrower",
      titleAr: "للمدين — كرامتُك محفوظة",
      items: [
        { text: "لا غرامةَ تأخيرٍ أبدًا — التأخّرُ لا يزيد عليك هللةً واحدة.",
          enforcedBy: "app/features/riba-lint.js · tests/app/riba-lint-corpus.test.cjs" },
        { text: "«أحتاج وقتًا» تعيد الجدولة بلا زيادةِ هللةٍ — ﴿فنظرةٌ إلى ميسرة﴾.",
          enforcedBy: "app/features/borrower.js · tests/app/borrower.test.cjs" },
        { text: "«ادفع ما تيسّر» مقبولٌ دائمًا — أيُّ مبلغٍ يُنقص المتبقّي فورًا، بالهللة.",
          enforcedBy: "app/features/borrower.js · tests/app/borrower.test.cjs" },
        { text: "لا عدّادَ تأخيرٍ أحمر — المتأخّرُ كهرمانيٌّ بكلمةٍ كريمة، بلا عدِّ أيّام.",
          enforcedBy: "tests/app/app-dom-smoke.cjs" },
        { text: "الخلافُ يوقف التذكيرَ فورًا — عهدٌ يشهد ولا يحكم.",
          enforcedBy: "app/features/daftari.js · tests/app/daftari.test.cjs" }
      ]
    },
    {
      key: "lender",
      titleAr: "للدائن — حقُّك موثَّق",
      items: [
        { text: "وثيقةٌ مختومةٌ تفضح أيَّ عبث — يتغيّر حرفٌ فيتغيّر الختمُ كلُّه.",
          enforcedBy: "app/engine.js · tests/app/proof.test.cjs" },
        { text: "المصرفُ يُذكِّر نيابةً عنك بالمعروف — فلا تصير أنت «المُطالِب».",
          enforcedBy: "app/features/daftari.js · tests/app/daftari.test.cjs" },
        { text: "الإبراءُ بيدك وحدك — تُغلقه صدقةً بكرامةٍ متى شئت.",
          enforcedBy: "app/features/open-loan.js · tests/app/open-loan.test.cjs" },
        { text: "المقاصّةُ لا تغيّر صافيَ حقّك هللةً — مركزُك قبلها هو مركزُك بعدها.",
          enforcedBy: "app/features/settlement.js · tests/app/settlement-conserve.test.cjs" }
      ]
    },
    {
      key: "bank",
      titleAr: "حدود المصرف — يشهد ولا يتجاوز",
      items: [
        { text: "يكتب ويشهد ويحفظ — ولا يُقرض من عنده أبدًا.",
          enforcedBy: "app/features/settings.js · tests/app/settings.test.cjs" },
        { text: "لا يحكم في خلاف — يوقف ويحفظ البيّنةَ للطرفين وللقضاء.",
          enforcedBy: "app/features/dispute.js · tests/app/dispute.test.cjs" },
        { text: "لا يأخذ على القرض شيئًا — لا رسمَ ولا عمولةَ ولا أجرَ خدمةٍ عليه.",
          enforcedBy: "app/engine.js · tests/app/riba-lint-corpus.test.cjs" },
        { text: "لا رقمَ ائتمانٍ ولا تصدير — سجلُّ وفائك كلمةٌ تُقال لك وحدك، ولا تخرج.",
          enforcedBy: "app/features/daftari.js · tests/app/daftari.test.cjs" },
        { text: "الذكاءُ يصوغ ويستشهد ولا يُفتي — يرصد الشبهةَ ويقترح البديلَ الحلال.",
          enforcedBy: "app/features/riba-lint.js · tests/app/riba-lint.test.cjs" }
      ]
    }
  ]);

  function describeAr() {
    return {
      heroLine: "ضماناتٌ مكتوبةٌ في الكود، لا في الشعارات — كلُّ بندٍ أدناه يحرسه ملفٌّ حقيقيٌّ باسمه، تقرؤه وتشغّله بنفسك.",
      footerLine: "كلُّ بندٍ أعلاه يحرسه اختبارٌ آليٌّ يعمل دون إنترنت — اطلب تشغيله."
    };
  }

  return { SECTIONS: SECTIONS, describeAr: describeAr };
});
