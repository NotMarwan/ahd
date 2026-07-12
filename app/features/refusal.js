/* ============================================================================
   features/refusal.js — «ما لا يفعله عهد»: the three refusals that define the
   product, made into content a screen can DRAMATIZE instead of merely assert.
   A normal bank lends, scores, and judges; عهد refuses all three — on purpose.
   Each refusal names the REAL repo file that enforces it (a refusal without a
   guard is a slogan). Pure content model: no DOM, no Date, no engine. Frozen.

   Spine: this only VISUALIZES rules already enforced elsewhere — it introduces
   no new claim, no riba, no score, no fatwa. Node-testable; browser → window.Refusal.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Refusal = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var HEADING = "عهد لا يُقرض، لا يُقيّم، لا يحكم";
  var SUB = "ثلاثة أبوابٍ يطرقها كلُّ بنكٍ تقليديّ — وعهد يُغلقها عمدًا. ليست نقصًا نعتذر عنه، بل هُويّتنا.";

  var ITEMS = [
    Object.freeze({
      key: "lend",
      act: "لا يُقرض",
      control: "معدّل الفائدة على القرض",
      bankDoes: "بنكٌ تقليديّ يُقرضك من ماله، ويربح على القرض فائدةً أو غرامةَ تأخير.",
      whyRefused: "عهد يشهد ويختم ويُسوّي، لا يُقرض من ماله ولا يربح على القرض — حصّتُه من القرض صفرٌ في الكود (loanChargeHalalas: 0)، والمالُ من الناس للناس.",
      enforcedBy: "app/features/billing.js"
    }),
    Object.freeze({
      key: "score",
      act: "لا يُقيّم",
      control: "الرقم الائتمانيّ للعميل",
      bankDoes: "بنكٌ تقليديّ يمنحك رقمًا ائتمانيًّا يتبعك، ويُصنّفك، ويُتداول عنك.",
      whyRefused: "عهد لا يُصدر رقمًا ولا تصنيفًا. أثرُك عندك وحدك كلمةٌ لا رقم — «وفّى بعهوده» — لا تُصدَّر ولا تُباع.",
      enforcedBy: "app/features/daftari.js"
    }),
    Object.freeze({
      key: "judge",
      act: "لا يحكم",
      control: "إصدار الحكم في الخلاف",
      bankDoes: "طرفٌ ثالثٌ يفصل في خلافك، ويُصدر حكمًا مُلزمًا لأحد الطرفين.",
      whyRefused: "عند الخلاف يتوقّف عهد ويعرض البيّنة المختومة — لا يقضي ولا يُفتي؛ يذكر الآية ويُحيل لأهل العلم.",
      enforcedBy: "app/features/dispute.js"
    })
  ];

  var CHARITY = Object.freeze({
    act: "اجعلها صدقة",
    line: "وحين يعجز المدين، لعهد بابٌ لا يملكه بنك: بضغطةٍ يتحوّل الدَّين إلى صدقةٍ بكرامة — يُبرَأ ما تبقّى، ويُختَم كبيّنةٍ للمعروف، بلا أيّ زيادة.",
    ayah: "﴿وأن تصدّقوا خيرٌ لكم إن كنتم تعلمون﴾",
    enforcedBy: "app/features/open-loan.js"
  });

  function model() {
    return Object.freeze({ heading: HEADING, sub: SUB, items: Object.freeze(ITEMS.slice()), charity: CHARITY });
  }

  return { HEADING: HEADING, model: model };
});
