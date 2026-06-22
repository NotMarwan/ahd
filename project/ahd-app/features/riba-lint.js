/* ============================================================================
   features/riba-lint.js — the DEEPENED riba linter (additive layer).

   The golden engine.ribaScan (4 regex rules + an immediate-preceding-negation
   guard) is byte-pinned to the demo and is NEVER modified. This layer wraps it
   and makes the linter genuinely hard to fool, while staying on-spine: it FLAGS
   a suspected-riba clause and SUGGESTS a halal alternative + cites the principle.
   It issues NO fatwa — it rules nothing. Late = amber. No number, no score.

   Over the golden 4 rules it adds:
     • a NORMALIZE pass (strips harakat + tatweel, folds alef/ya/ta-marbuta/hamza)
       → defeats obfuscation like «فـائـدة» / «فائِدة» and spelling variants;
     • EXTENDED triggers the golden rules miss — increase/yield synonyms
       (عائد/مردود/غُنم/علاوة/ريع/مكسب/بدل تأخير), payment-for-time / rollover
       (مقابل المهلة، كلّما طال الأجل زاد، يتراكم/يكبر), disguised fees tied to the
       loan (رسوم تأجيل، تأمين على القرض، أتعاب عن كل ألف، مصاريف ما دام الدين قائمًا),
       conditional benefit (قرض جرّ نفعًا), classical جاهلية، «يردّ أكثر ممّا أخذ»،
       per-principal-unit charges، liquidated late penalty (بدل إخلال);
     • a NEGATION-AWARE analyzer that understands:
        – DISTRIBUTED negation across أو/و lists, incl. multi-word items
          («بغير فائدةٍ أو زيادةٍ في رأس المال أو عمولةِ خدمة» → CLEAN),
        – NEGATED negation («ليست بلا فائدة» = with interest → BLOCK),
        – VERB negation («لا يستحقّ على الإمهال زيادةً» → CLEAN),
        – a STOP set so an affirmative obligation («وعليه فائدة») breaks the scope,
        – NEGATION-WITH-EXCEPTION («بلا فائدةٍ إلا عند التأخير» → BLOCK).

   SAFETY: golden engine.ribaScan is reused as an authoritative FLOOR — when golden
   blocks and NO negation particle is present, the layer blocks too. So the layer
   is a strict superset of golden's true-positives; the only golden-blocked clauses
   it clears are genuine negation cases.

   KNOWN, INTENTIONAL conservatism (favouring the spine over a few false-positives):
   any «٪» or «أرباح» inside a loan clause is flagged even if it is arithmetically
   unrelated to the money («نسبة إنجاز ٨٠٪»); and purely-numeric «return more»
   (e.g. ١١٠٠ مقابل ١٠٠٠ with no keyword) is caught only when a keyword/phrase marks
   it — the linter reasons over wording, not arithmetic. Both are logged, not ruled.

   Pure, DOM-free, deterministic (no Date/Math.random); never touches money.
   Dual module: Node `require`, browser `window.RibaLint` (uses window.AHD).
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("../engine.js"));
  else root.RibaLint = factory(root.AHD);
})(typeof self !== "undefined" ? self : this, function (ENGINE) {
  "use strict";

  /* ---- normalize: strip harakat/tatweel, fold letter variants (detection only;
     the engine bytes / seals are NEVER computed from this) ---- */
  function normalize(text) {
    return String(text == null ? "" : text)
      .replace(/[ً-ْٰ]/g, "")
      .replace(/ـ/g, "")
      .replace(/[آأإٱ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* halal alternatives (concrete; copy stays "flag + suggest + cite", never a ruling) */
  var FIX_INCREASE = "الأصل فقط — قرضٌ حسن يُرَدّ بمثله بلا أيّ زيادة؛ وإن أراد المُقرض أجرًا فأجرُه على الله.";
  var FIX_LATE = "عند العُسر: نظرةٌ إلى ميسرة (إمهالٌ بالمعروف بلا زيادة)، أو التزامٌ تطوّعيٌّ بالتصدّق لجهةٍ خيريّة لا تعود للمُقرض.";
  var FIX_PERCENT = "أجرةُ خدمةٍ ثابتةٌ منفصلةٌ عن مبلغ القرض لا تتغيّر بتأخيره — لا نسبةٌ من المبلغ.";
  var FIX_FEE = "إن لزمت أجرةُ خدمةٍ فلتكن مبلغًا ثابتًا مقابل عملٍ فعليّ، منفصلًا عن القرض ولا يزيد بالتأجيل.";
  var FIX_CONDITION = "القرض الحسن لا يُشترَط فيه نفعٌ للمُقرض («كلّ قرضٍ جرّ نفعًا فهو ربا»). أمّا هديةٌ بعد الوفاء تطوّعًا بلا شرطٍ سابق فجائزة.";
  var FIX_CLASSIC = "لا زيادةَ مقابل الأجل أو التأخير («أنظِرني أزِدك» هو ربا الجاهلية). الأصل يبقى أصلًا، والعُسر يُقابَل بالإمهال لا بالزيادة.";
  var FIX_REPAY = "يُرَدّ المثلُ بالمثل — لا يُرَدّ أكثر ممّا أُخِذ؛ أيّ زيادةٍ مشروطةٍ على القرض ربا.";

  /* TRIGGER rules — single trigger words/phrases; subject to the negation analyzer.
     Patterns are NORMALIZED. */
  var TRIGGER_RULES = [
    /* golden mirror (the demo's 4 rules, normalized) — reused, not altered */
    { re: /فايده|ربا|ربوي/, category: "interest", severity: "high", source: "golden", why: "شرط فائدة/ربا على القرض", fix: FIX_INCREASE },
    { re: /غرامه|عقوبه|جزاء/, category: "late-penalty", severity: "high", source: "golden", why: "غرامةٌ/عقوبةٌ على التأخير لصالح المُقرض", fix: FIX_LATE },
    { re: /نسبه|٪|%|في\s*الم(?:ئه|يه|ايه)|بالم(?:ئه|يه|ايه)/, category: "percentage", severity: "high", source: "golden", why: "نسبةٌ مئويّةٌ مرتبطةٌ بمبلغ القرض", fix: FIX_PERCENT },
    { re: /عموله|زياده|ارباح|ربح/, category: "markup", severity: "high", source: "golden", why: "زيادةٌ/عمولةٌ على أصل الدَّين", fix: FIX_INCREASE },
    /* increase/yield synonyms the golden 4 miss */
    { re: /عايد(?!\s*ال)/, category: "synonym-yield", severity: "high", source: "ext", why: "عائدٌ (زيادة/ربح) على القرض", fix: FIX_INCREASE },
    { re: /مردود(?:ا|ه)?\s+(?:زايد|اكبر|اكثر|اعلي)/, category: "synonym-yield", severity: "high", source: "ext", why: "مردودٌ زائدٌ على الأصل", fix: FIX_INCREASE },
    { re: /(?:غنم(?:ا|ه)?|يغنم|مغنم)\s+(?:مقابل|التاخير|عن)/, category: "synonym-yield", severity: "high", source: "ext", why: "غُنمٌ (زيادة) مقابل القرض/التأخير", fix: FIX_INCREASE },
    { re: /ريع(?:ا|ه)?\s+(?:شهري|سنوي|مقابل|عن|على)/, category: "synonym-yield", severity: "high", source: "ext", why: "ريعٌ (عائدٌ) على بقاء القرض", fix: FIX_INCREASE },
    { re: /مكسب(?:ا|ه)?\s+(?:مقطوع|مضمون|شهري|قدره)|يضاف[\s\S]{0,24}?مكسب/, category: "synonym-yield", severity: "high", source: "ext", why: "مكسبٌ مُضافٌ إلى أصل القرض", fix: FIX_INCREASE },
    { re: /علاوه\s+(?:علي|عن)\s+(?:المبلغ|الاصل|القرض|الدين)|علاوه\s+(?:تاخير|تاجيل|بسيطه)/, category: "surcharge", severity: "high", source: "ext", why: "علاوةٌ على المبلغ/مقابل المدة", fix: FIX_INCREASE },
    { re: /بدل(?:ا)?\s+(?:تاخير|تاجيل|المهله|الزمن|الاجل|زمني)|بدل\s+اخلال/, category: "late-fee", severity: "high", source: "ext", why: "بدلُ تأخيرٍ/إخلالٍ يدفعه المقترض", fix: FIX_LATE },
    /* payment for time / for the deferral itself (ربا النسيئة) */
    { re: /(?:مقابل(?:ا)?|نظير|لقاء|عوضا)\s+(?:عن\s+)?(?:المهله|الامهال|الانظار|الاجل|التاجيل|المده\s+الاضافيه|الزمن|الصبر|بقاء)|مقابل\s+(?:كل\s+)?(?:شهر|يوم|اسبوع)/, category: "time-price", severity: "high", source: "ext", why: "مبلغٌ مقابل المهلة/الزمن — ثمنٌ للأجل (ربا النسيئة)", fix: FIX_LATE },
    /* disguised fees TIED to the loan / its deferral */
    { re: /رسوم\s+(?:تاجيل|تاخير|جدوله|الجدوله|تمديد|التمديد|التاجيل)/, category: "disguised-fee", severity: "high", source: "ext", why: "رسومٌ على التأجيل/التأخير (زيادةٌ مقنّعة)", fix: FIX_FEE },
    { re: /مصاريف[\s\S]{0,28}?مقابل\s+(?:تاجيل|تاخير|المهله|الاجل|التاجيل)/, category: "disguised-fee", severity: "high", source: "ext", why: "مصاريفُ مقابل التأجيل (زيادةٌ مقنّعة)", fix: FIX_FEE },
    { re: /تامين\s+(?:علي|عل)\s+(?:القرض|الدين|المبلغ)/, category: "disguised-fee", severity: "med", source: "ext", why: "تأمينٌ على القرض يتحمّله المقترض", fix: FIX_FEE },
    { re: /اتعاب[\s\S]{0,28}?(?:مقابل|عن\s+كل|قدرها)\s*(?:تمديد|تاجيل|المهله|الاجل|تاخير|الف|عشره)/, category: "disguised-fee", severity: "high", source: "ext", why: "أتعابٌ مقابل التمديد/مرتبطةٌ بمقدار القرض", fix: FIX_FEE }
  ];

  /* STRUCTURAL rules — whole-phrase riba structures (affirmative; not list-negated).
     Each is a predicate over normalized text. */
  var STRUCT_RULES = [
    { category: "conditional-benefit", severity: "high", why: "قرضٌ جرّ نفعًا — نفعٌ مشروطٌ للمُقرض", fix: FIX_CONDITION,
      test: function (T) {
        if (/(?:دون|بلا|بغير)\s+شرط/.test(T) && !/بشرط|يشترط|اشترط|مشروطه/.test(T)) return false; // explicitly unconditional
        var benefit = /(?:تهديني|يهديني|تهدي\s+لي|هديه\s+مشروطه|هديه\s+يقدمها|يسكنني|اسكنه|يسكن[\s\S]{0,22}?(?:بيتي|بيته|داري|داره|غرفه)|انتفع|انتفاع|منفعه|سيارت[يه]|اركب|استعمل\s+سيارت|يخدمني|اعمل\s+(?:في|عند)|اشتغل\s+(?:في|عند)|مزرعت[هي]|بستان|ثمر|محصول|يبيعني|يبيعه[\s\S]{0,18}?(?:باقل|اقل)|اقل\s+من\s+(?:سعر|السوق|سعرها)|يخصم\s+لي|حق\s+السكن|شكر\s+المعروف|غرفه\s+من\s+بيت|ياكل\s+من|امكنه\s+من|مكنه\s+من|يمكنه\s+من|مبلغا\s+اضافيا|مبلغ\s+اضافي)/;
        if (!benefit.test(T)) return false;
        /* find a cond marker that is NOT itself negated («لا/لم/لن يشترط») nor disclaimed («دون شرط») */
        var cond = /(?:بشرط\s+ان|بشرط\b|شريطه\s+ان|علي\s+ان|عل\s+ان|يشترط(?:\s+(?:في\s+العقد|عند))?[\s\S]{0,18}?ان|يشترط\s+(?:في\s+العقد|عند\s+رد)|اشترط[\s\S]{0,14}?ان|مقابل\s+ان|وفاء\s+بالجميل\s+مقابل|مصحوبا\s+بهديه|هديه\s+مشروطه)/g;
        var m;
        while ((m = cond.exec(T))) {
          var pre = T.slice(Math.max(0, m.index - 7), m.index);
          if (/(?:لا|لم|لن)\s+$/.test(pre)) continue;                 // «لا يشترط …» = explicitly NOT conditioned
          if (/دون\s+شرط|بلا\s+شرط/.test(T.slice(m.index))) continue;  // disclaimed downstream
          return true;
        }
        return false;
      } },
    { category: "classical-jahiliyya", severity: "high", why: "ربا الجاهليّة — زيادةٌ مقابل التأجيل/التأخير", fix: FIX_CLASSIC,
      test: function (T) {
        return /ان\s+اخرت[\s\S]{0,22}?(?:زدت|ازيد|زاد|زياده|اكثر)/.test(T) ||
          /انظرني[\s\S]{0,16}?(?:ازيدك|ازيد|ازده|زياده)/.test(T) ||
          /اجلني[\s\S]{0,16}?(?:ازيدك|ازيد)/.test(T) ||
          /(?:كلما|كل\s+ما)\s+(?:تاخر|طال|طول|مر|طوّل|طولت|طوّلت)[\s\S]{0,34}?(?:زاد|يزيد|زياده|اكثر|اكبر|يكبر|يتراكم|عظم|عظّم|يثقل|يتعاظم|يزداد)/.test(T) ||
          /(?:المبلغ|الدين|المستحق|اللي\s+علي?ك|ما\s+علي?ك|الرصيد)[\s\S]{0,26}?(?:يكبر|يتراكم|يثقل|يتعاظم|يزداد|يصير\s+اكثر|يصير\s+اكبر|عظم)/.test(T) ||
          /(?:عظم|عظّم|يتراكم|يزداد)[\s\S]{0,20}?(?:المبلغ|الدين|المستحق)/.test(T) ||
          /علي\s+ان\s+(?:يضيف|اضيف|يضاف)[\s\S]{0,34}?(?:اصل\s+القرض|الدين|نظير\s+المده|المده\s+الاضافيه)/.test(T);
      } },
    { category: "late-charge", severity: "high", why: "مبلغٌ يُدفع مقابل/عند التأخير — غرامةُ تأخيرٍ مقنّعة", fix: FIX_LATE,
      test: function (T) {
        return /(?:عن|مقابل|لقاء|عند)\s+كل\s+(?:يوم|اسبوع|شهر)[\s\S]{0,28}?(?:تاخير|التاخير)/.test(T) ||
          /كل\s+(?:يوم|اسبوع|شهر)\s+تاخير[\s\S]{0,28}?(?:ريال|مبلغ|اضافي|اضافيه)/.test(T) ||
          /(?:ريال|ريالات|مبلغ|مبلغا|مئة|مية|خمسين|عشره|عشرة)[\s\S]{0,30}?(?:عن|مقابل|لقاء|عند)\s+(?:كل\s+)?(?:يوم|اسبوع|شهر)?\s*(?:تاخير|التاخير|الامهال|الانظار)/.test(T) ||
          /(?:كل\s+(?:يوم|اسبوع|شهر)\s+تاخير|عند\s+كل\s+تاخير)[\s\S]{0,24}?(?:عليك|عليه|يدفع|يستحق)/.test(T) ||
          /(?:يجبر\s+الدائن|ما\s+يجبر[\s\S]{0,18}?تاخير)/.test(T) ||
          /(?:بدل|تعويض|عوض)\s+(?:اخلال|تاخير)\s+(?:مقطوع|مقطوعا|قدره)/.test(T) ||
          /لو\s+(?:ما\s+)?(?:تاخرت|سددت|طولت)[\s\S]{0,40}?(?:اكثر\s+مما\s+اخذ|تدفع\s+لي\s+اكثر|عليك\s+اكثر|بكثير|زود)/.test(T) ||
          (/اذا\s+تاخرت[\s\S]{0,34}?(?:ريال\s+اضافيه|اضافيه|اكثر|زود)/.test(T) && !/ما\s+علي?ك|لا\s+ازيد|ولا\s+ازيد/.test(T));
      } },
    { category: "fee-per-principal", severity: "high", why: "رسمٌ يُحسب لكلّ وحدةٍ من مبلغ القرض — زيادةٌ نسبيّةٌ على رأس المال", fix: FIX_FEE,
      test: function (T) {
        return /(?:عن|ل)\s*كل\s+(?:الف|عشره\s+الاف|عشرة\s+الاف|مئة|مية)[\s\S]{0,16}?(?:ريال|من\s+(?:قيمة|مبلغ|قيمه)|مقرض)/.test(T) ||
          /(?:خمسون|ثلاثون|قدرها|قدره|مبلغ|ريالات?)[\s\S]{0,22}?(?:عن|ل)\s*كل\s+(?:الف|عشره|عشرة|مئة|مية)/.test(T) ||
          /(?:رسوم|رسما|اتعاب|تامين|قسط)[\s\S]{0,30}?(?:عن|ل)\s*كل\s+(?:الف|عشره|عشرة|مئة|مية)/.test(T) ||
          /لكل\s+الف[\s\S]{0,20}?عن\s+كل\s+شهر/.test(T);
      } },
    { category: "recurring-fee", severity: "high", why: "رسمٌ دوريٌّ يستمرّ ما دام الدَّين قائمًا — يؤول إلى زيادةٍ على الأصل بمرور الزمن", fix: FIX_FEE,
      test: function (T) {
        return /(?:مصاريف|رسوم|مبلغ|اتعاب|قسط|تامين)[\s\S]{0,42}?(?:شهري|شهريه|دوري|متكرر|اسبوعي)[\s\S]{0,44}?(?:ما\s+دام|مادام|طالما|ما\s+بقي|حتي\s+تمام|ما\s+دامت|مستمر|قائم)/.test(T) ||
          /(?:شهري|شهريه|دوري)[\s\S]{0,30}?(?:ما\s+دام|مادام|طالما)\s+(?:الدين|القرض|المبلغ)\s+قائم/.test(T);
      } },
    { category: "repay-more", severity: "high", why: "يُرَدّ أكثر ممّا أُخِذ — زيادةٌ على الأصل", fix: FIX_REPAY,
      test: function (T) {
        return /يرد(?:ها)?\s+اكثر|يرجع(?:ها)?\s+اكثر|ترجعها\s+اكثر|تردها\s+اكثر|يردها\s+زياده/.test(T) ||
          /(?:ترجعها|تردها|يرجعها|يردها|يعيدها|اعيدها|ارجعها|رده|ردها)[\s\S]{0,18}?(?:و\s*زود|وزود|زياده|زود)/.test(T) ||
          /وزود\s+(?:شوي|عليه|على|فوق|عليها)/.test(T) ||
          /(?:يعيدها|يردها|يرد|ترجعها|ترجع)[\s\S]{0,18}?(?:الف\s+و|مئة\s+و|مية\s+و|اثني\s+عشر|اثنا\s+عشر)/.test(T) ||
          /مقابل\s+المبلغ\s+المستلم[\s\S]{0,18}?وقدره|علي\s+ان\s+(?:يعيدها|يردها|يرجعها)[\s\S]{0,44}?(?:بعد|عند)/.test(T) ||
          /مجموع\s+ما\s+يدفعه?\s+اكبر\s+من\s+المبلغ|اك(?:بر|ثر)\s+من\s+المبلغ\s+المقبوض/.test(T) ||
          /(?:صاعا?|صاع|جرام|جراما?)[\s\S]{0,24}?(?:بصاعين|بجنسها|من\s+جنسها|من\s+التمر\s+الادني|الادني)[\s\S]{0,30}?(?:تاجيل|بعد|الموسم|اشهر)/.test(T) ||
          /(?:مئة|مية|١٠٠|100)\s+(?:جرام|غرام)[\s\S]{0,30}?(?:مئة|مية|١١٠|110)\s*(?:و|ا)?\s*عشر[\s\S]{0,16}?(?:جرام|غرام)/.test(T);
      } },
    { category: "conditional-negation", severity: "high", why: "نفيٌ مشروطٌ بالأجل — «بلا زيادةٍ إلا عند التأخير» = زيادةٌ عند التأخير", fix: FIX_LATE,
      test: function (T) {
        return /(?:بلا|بدون|دون|بغير|من\s+غير)\s+\S+[\s\S]{0,24}?\b(?:الا|الّا)\s+(?:عند|اذا|في\s+حال|بعد|كل|ان\s+تاخر|عند\s+التاخير|اذا\s+تاخر)[\s\S]{0,16}?(?:تاخر|تاخير|الاجل|المهله|شهر|يوم|اسبوع|سدد)/.test(T);
      } }
  ];

  /* ---- negation analyzer ---------------------------------------------------
     A trigger is CLEARED if it sits inside a (possibly multi-word, possibly
     أو/و-distributed) negated list, OR a verb negation governs it — UNLESS a
     negation-of-negation flips the scope. An affirmative-obligation STOP word
     ends the list scope. */
  var NEG = "(?:بلا|بدون|دون|بغير|من\\s+غير|عدم|لا|غير)";
  var FILLER = "(?:اي|ايه)";
  var CONN = "(?:و|او|ولا|او\\s*لا|،|و\\s*لا)";
  var STOP = "(?:مقابل|نظير|لقاء|عليه|عليك|عليهم|عليها|يجب|يلزم|يستحق|يدفع|يتقاضي|بشرط|لكن|الا)";
  var STOP_RE = new RegExp("(?:^|\\s)و?" + STOP + "(?:\\s|$)");
  var LWORD = "(?:(?!" + STOP + "(?:\\s|$))[\\u0621-\\u064A]+)";
  var ITEM = "(?:" + LWORD + "\\s+){1,5}";
  /* a negated noun-list: NEG, then (item + connector)*, then a SHORT bare tail
     (≤2 words — e.g. an adjective «ربويةٍ»). A long bare run with NO connector is
     a clause, not a list, so «لا يخلو السداد من فائدة» does NOT clear. */
  var NEG_LIST_RE = new RegExp(
    "(?:^|\\s)و?" + NEG + "\\s+(?:" + FILLER + "\\s+)?" +
    "(?:" + ITEM + CONN + "\\s*)*" +
    "(?:" + LWORD + "\\s+){0,2}(?:" + FILLER + "\\s+)?$"
  );
  /* litotes: a negation OF an absence/exemption AFFIRMS the trigger → do NOT clear
     («غير معفيٍّ من الغرامة» / «لا يخلو من فائدة» = riba). */
  var LITOTES_RE = new RegExp(
    "^(?:و?" + NEG + ")\\s+(?:معفي|معفى|معاف|خالي|خال|يخلو|تخلو|بمنا|محصن|بريء|منزه|يمنع|يحرم|عاري)"
  );
  var FLIPPER_RE = /(?:^|\s)(?:ليس|ليست|لست|لسنا|ليسوا|لسن)\s*$/;
  var VERBNEG_RE = /(?:^|\s)و?(?:لا|لن|لم)\s+(?:يستحق|يجب|يلزم|يحق|يترتب|ياخذ|ياخذه|يضيف|يزيد|يطالب|يتقاضي|يفرض|يصح|يشترط|يتضمن|يحتوي)\s([\s\S]{0,70})$/;
  var HAS_NEGATION_RE = new RegExp("(?:^|\\s)و?" + NEG + "(?:\\s|$)");
  var ARABIC = /[ء-ي]/;

  /* compute the text BEFORE a trigger for negation analysis, handling Arabic
     proclitics: «وغرامة» → the «و» is a list connector (keep it); «وبغرامة» /
     «بفائدة» → the «بـ/كـ» re-asserts the trigger (return null ⇒ not negated);
     a trigger matched mid-word (e.g. «ربا» inside «أرباح») snaps to the word start. */
  var NEGEND_RE = new RegExp("(?:^|\\s)و?" + NEG + "\\s+(?:" + FILLER + "\\s+)?$");
  function negScope(T, mIdx) {
    var ws = mIdx;
    while (ws > 0 && ARABIC.test(T.charAt(ws - 1))) ws--;
    var prefix = T.slice(ws, mIdx);
    var before = T.slice(0, ws);
    if (/^[وف]?[بك]/.test(prefix)) {                       // «بـ/كـ» = "with/like" → affirms…
      return NEGEND_RE.test(before) ? before : null;       // …unless itself directly negated («لا بزيادة»)
    }
    if (/^[وف]/.test(prefix)) before += prefix.charAt(0);  // keep a «و/ف» conjunction as a connector
    return before;
  }
  function listNegationClears(before) {
    var m = NEG_LIST_RE.exec(before);
    if (!m) return false;
    var lead = /^\s/.test(m[0]) ? 1 : 0, scopeStart = m.index + lead;
    if (FLIPPER_RE.test(before.slice(0, scopeStart))) return false;  // «ليس بلا …» re-blocks
    if (LITOTES_RE.test(before.slice(scopeStart))) return false;     // «غير معفيٍّ من …» re-blocks
    return true;
  }
  /* breaks a verb-negation scope only on a NEW affirmative clause — a preposition
     («عليه») or a «و»-prefixed verb («ويدفع»). A bare «يدفع» stays inside the scope
     («لا يشترط أن يدفع فائدة» = clean). */
  var VERB_STOP_RE = /(?:^|\s)(?:عليه|عليك|عليهم|عليها|مقابل|نظير|لقاء|لكن|بشرط|و(?:يدفع|يستحق|يلزم|يجب|يضيف|يزيد|يتقاضي|عليه|على))(?:\s|$)/;
  function verbNegationClears(before) {
    var m = VERBNEG_RE.exec(before);
    if (!m) return false;
    if (/(?:^|\s)(?:الا|الّا|سوي)(?:\s|$)/.test(m[1])) return false; // «إلا/سوى» re-introduces
    return !VERB_STOP_RE.test(m[1]);                                 // a new affirmative clause breaks it
  }
  function installmentExtension(T, mIdx) {
    if (!/^زياده\s+(?:عدد\s+)?(?:الاقساط|اقساط|المده|الاجل|الفتره|عدد)/.test(T.slice(mIdx, mIdx + 60))) return false;
    return /دون\s+(?:اي\s+)?(?:مبلغ|زياده)|بلا\s+(?:اي\s+)?مبلغ|بدون\s+مبلغ/.test(T);
  }
  function cleared(T, mIdx) {
    var before = negScope(T, mIdx);
    if (before === null) return false;
    return listNegationClears(before) || verbNegationClears(before) || installmentExtension(T, mIdx);
  }

  function hitOf(rule) {
    return { why: rule.why, fix: rule.fix, category: rule.category, severity: rule.severity || "high", source: rule.source || "ext" };
  }

  var MAX_LEN = 4000;   // bound the input so the bounded-wildcard regexes stay fast on huge pastes
  function scan(text, engine) {
    var e = engine || ENGINE;
    var T = normalize(text);
    if (!T) return { verdict: "clean", hits: [] };
    if (T.length > MAX_LEN) T = T.slice(0, MAX_LEN);
    var hits = [], seen = {}, sawTrigger = false;

    TRIGGER_RULES.forEach(function (rule) {
      if (seen[rule.category]) return;
      var re = new RegExp(rule.re.source, "g"), m;
      while ((m = re.exec(T))) {
        sawTrigger = true;
        if (!cleared(T, m.index)) { seen[rule.category] = 1; hits.push(hitOf(rule)); break; }
        if (re.lastIndex === m.index) re.lastIndex++;
      }
    });

    STRUCT_RULES.forEach(function (rule) {
      if (!seen[rule.category] && rule.test(T)) { seen[rule.category] = 1; hits.push(hitOf(rule)); }
    });

    var verdict = hits.length ? "block" : "clean";

    /* SAFETY FLOOR: reuse the golden linter as an authoritative backstop. If golden
       blocks but the layer is clean, propagate the block — UNLESS the layer actually
       SAW the trigger and cleared it via a present negation. A golden category the
       layer's own patterns never matched (sawTrigger=false) ALWAYS propagates, so a
       stray, unrelated negation word elsewhere can never silence the floor. */
    if (verdict === "clean" && e && typeof e.ribaScan === "function") {
      var g = e.ribaScan(text);
      if (g.verdict === "block" && (!sawTrigger || !HAS_NEGATION_RE.test(T))) {
        var gh = (g.hits && g.hits[0]) || {};
        hits.push({ why: gh.why || "شرطٌ ربويّ", fix: gh.fix || FIX_INCREASE, category: "golden", severity: "high", source: "golden" });
        verdict = "block";
      }
    }

    return { verdict: verdict, hits: hits };
  }

  return {
    scan: scan, normalize: normalize,
    TRIGGER_RULES: TRIGGER_RULES, STRUCT_RULES: STRUCT_RULES,
    NEG_LIST_RE: NEG_LIST_RE, FLIPPER_RE: FLIPPER_RE, cleared: cleared
  };
});
