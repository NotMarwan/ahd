/* ============================================================================
   features/shariah-basis.js — «الأساس الشرعي»: for each core mechanic (قرض
   حسن، الختم الرقمي، المقاصّة، لا ربا/لا غرامة/لا ميسر/لا غرر، إشارة الثقة
   النوعيّة) names the cited verse/AAOIFI standard/law, honestly graded
   (verified/recorded/pending — never invented), and lists every genuinely
   open Shariah question AS A QUESTION for a qualified scholar. AI issues no
   fatwa: this module CITES and FLAGS, it never rules. Every citation here is
   copied verbatim from the project's own vetted arsenal
   (docs/research/…/legal-shariah-citations.md, docs/evidence/EVIDENCE-BRIEF.md)
   — nothing is invented; unpinned clause/article numbers are marked "pending".
   Pure content model: no DOM, no Date, no engine, no network. Frozen.
   Dual module: Node `require`, browser `window.ShariahBasis`.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ShariahBasis = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function deepFreeze(o) {
    Object.getOwnPropertyNames(o).forEach(function (k) {
      var v = o[k];
      if (v && typeof v === "object") deepFreeze(v);
    });
    return Object.freeze(o);
  }

  var HEADING = "الأساس الشرعي";
  var SUB = "كلُّ آليّةٍ في عهد تستند إلى نصٍّ أو معيارٍ مذكورٍ باسمه — والذكاءُ هنا يستشهد ولا يُفتي.";
  var NO_FATWA_LINE = "الذكاءُ يستشهد بالنصوص والمعايير ويرصد الشبهة — ولا يُفتي، ولا يحكم في مسألةٍ خلافيّة؛ كلُّ سؤالٍ فقهيٍّ مفتوحٍ أدناه يُحال إلى عالِمٍ شرعيٍّ معتمد.";
  var PENDING_NOTE = "أسئلة بانتظار مراجعة عالِم — لم تُعرَض بعدُ على أيّ هيئةٍ شرعيّةٍ ولم تُرفَع بعد إلى الإنماء.";

  /* grade legend (mirrors EVIDENCE-BRIEF.md's own 🟢/🟡/🔴):
     "verified"   — 🟢 the substance is corroborated (project's own vetted arsenal)
     "recorded"   — 🟡 cited in the project's own file, not independently re-fetched
     "pending"    — 🔴 the EXACT clause/article number is not pinned — counsel/scholar confirms
     "design-only"— an on-spine design choice with no single classical citation on file */

  var MECHANICS = deepFreeze([
    {
      key: "qard",
      titleAr: "شهادة القرض الحسن — عهد يكتب ويشهد، لا يُقرض",
      mechanicAr: "عهد يكتب عهدَ القرض الحسن بين طرفين ويختمه، دون أن يكون طرفًا مُقرِضًا — هو الكاتب، لا أحد الشاهدين.",
      citations: [
        {
          kind: "quran", labelAr: "آية الدَّين", refAr: "٢:٢٨٢",
          quoteAr: "﴿... وَلْيَكْتُب بَّيْنَكُمْ كَاتِبٌۢ بِٱلْعَدْلِ ۚ ... وَٱسْتَشْهِدُوا۟ شَهِيدَيْنِ مِن رِّجَالِكُمْ ۖ ...﴾",
          noteAr: "الأمر بكتابة الدَّين وإشهاده؛ التفريق بين الكاتب (بِٱلْعَدْلِ) والشاهدَين — عهد هو الكاتب، لا طرفٌ شاهد أو مُقرِض.",
          grade: "verified"
        },
        {
          kind: "aaoifi", labelAr: "معيار الشريعة رقم ١٩ — القرض (AAOIFI SS-19)",
          clauseAr: "التعريف العام للقرض الحسن (رقم البند الدقيق للتعريف: يُراجَع)",
          noteAr: "القرض عقدٌ إرفاقٍ بلا زيادةٍ مشروطة؛ أيّ زيادةٍ مشروطة على المبلغ المقروض رِبًا — الأصل الذي يقوم عليه رفض عهد لأيّ فائدةٍ أو غرامة.",
          grade: "recorded"
        },
        {
          kind: "maxim", labelAr: "الإقرار سيّد الأدلّة",
          noteAr: "قاعدةٌ فقهيّةٌ إجرائيّةٌ كلاسيكيّة (وليست معيارًا مرقَّمًا): إقرارُ المدين بالدَّين من أقوى الأدلّة — الأساس الذي يجعل «إقرارٌ بدَين» موقَّعًا وثيقةً ذات وزن.",
          grade: "recorded"
        }
      ]
    },
    {
      key: "seal",
      titleAr: "الختم الرقميّ — امتدادٌ تقنيٌّ لأمر الكتابة",
      mechanicAr: "الختم بِـ SHA-256 هو تنفيذٌ تقنيٌّ لأمر «فاكتبوه» بوسيلةٍ عصريّة تفضح أيّ عبثٍ لاحق — الحفظ الرقميّ لا يغيّر طبيعة الالتزام الشرعيّ للكتابة.",
      citations: [
        {
          kind: "quran", labelAr: "آية الدَّين", refAr: "٢:٢٨٢",
          quoteAr: "﴿... فَٱكْتُبُوهُ ۚ ...﴾",
          noteAr: "أمرٌ صريحٌ بكتابة الدَّين — الختم الرقميّ صورةٌ من صور الكتابة والحفظ، لا بديلٌ شرعيّ جديد.",
          grade: "verified"
        },
        {
          kind: "law", labelAr: "نظام الإثبات (السجلّات والتوقيعات الرقميّة) — المرسوم الملكيّ م/٤٣ لعام ٢٠٢٢",
          clauseAr: "الجوهر: الأدلّة الرقميّة أدلّةٌ كتابيّةٌ متى تحقّقت شروط السلامة/النسبة، وعبء الإثبات ينتقل إلى الطرف المُنكِر (المواد المُشار إليها في أرشيف المشروع: ٥٧/٥٨ تقريبًا — أرقام الموادّ الدقيقة تُراجَع، OT-CITE)",
          noteAr: "الجوهر مؤكَّدٌ بمصادر عدّة؛ رقم المادّة الدقيق ونصّها الأساسيّ لم يُقرأ من نصٍّ رسميٍّ حتى الآن — يحتاج تأكيدًا قانونيًّا قبل التصريح به على المنصّة.",
          grade: "pending"
        },
        {
          kind: "law", labelAr: "نظام المعاملات الإلكترونيّة — المرسوم الملكيّ م/١٨ لعام ٢٠٠٧",
          clauseAr: "المادّة ١٤ — التوقيع الإلكترونيّ له ذاتُ الحجّيّة القانونيّة للتوقيع اليدويّ متى تحقّقت شروط الموثوقيّة",
          noteAr: "يُبنى عليها اعتماد التوقيع عبر نفاذ/مزوّد خدمات ثقةٍ مرخَّص — مُسجَّلٌ في أرشيف المشروع، لم يُعَد التحقّق منه مباشرةً في هذه الجلسة.",
          grade: "recorded"
        }
      ]
    },
    {
      key: "netting",
      titleAr: "المقاصّة والتسوية — أقلّ التحويلات، الصافي محفوظ",
      mechanicAr: "عهد يُصفّي التزاماتٍ متبادلةً بين أطرافٍ عدّةٍ إلى أقلّ عددٍ من التحويلات، بحيث يبقى صافي مركز كلّ طرفٍ كما هو قبل التصفية وبعدها — بالتراضي، لا بإلزامٍ أحاديّ.",
      citations: [
        {
          kind: "fiqh", labelAr: "المقاصّة (Set-off)",
          noteAr: "مفهومٌ مستقرٌّ في الفقه الإسلاميّ: تقاصّ الديون المتبادلة من جنسٍ واحدٍ وعملةٍ واحدةٍ صحيحٌ برضا الأطراف — الأساس الذي تُبنى عليه تسوية عهد.",
          grade: "verified"
        },
        {
          kind: "fiqh", labelAr: "الحوالة (نقل الدَّين) بالتراضي",
          noteAr: "كلّ ساقٍ من سيقان التسوية في عهد تُعرَض كحوالةٍ بالتراضي بين طرفين — المفهوم الفقهيّ للحوالة الثنائيّة مستقرّ؛ المعيار الشرعيّ المرقَّم المحدَّد لهذا التطبيق في هذا المشروع: يُراجَع.",
          grade: "pending"
        },
        {
          kind: "fiqh", labelAr: "الغرر والميسر",
          noteAr: "التسوية تشترط رضا كلّ طرفٍ عن سِيَقان تحويله — لا عنصر مقامرةٍ ولا غررَ في مقدار الالتزام؛ الأصل الفقهيّ الكلاسيكيّ في تحريم بيع الغرر.",
          grade: "verified"
        }
      ]
    },
    {
      key: "no-riba",
      titleAr: "لا ربا · لا غرامة · لا ميسر · لا غرر",
      mechanicAr: "لا زيادة على القرض بأيّ اسم، لا غرامة تأخيرٍ، لا شرط جزائيّ، ولا عنصر مقامرةٍ أو غررٍ في أيّ تسويةٍ أو جدولة — التأخّر يُقابَل بالمهلة لا بالزيادة.",
      citations: [
        {
          kind: "quran", labelAr: "تحريم الربا", refAr: "٢:٢٧٥، ٢:٢٧٨–٢٧٩",
          noteAr: "لا زيادةَ على القرض، ولا رسمَ متصاعدًا مع الزمن، ولا غرامة تأخير — الأساس الذي يمنع عهد من فرض أيّ زيادةٍ على مبلغ القرض.",
          grade: "verified"
        },
        {
          kind: "quran", labelAr: "المهلة للمُعسِر", refAr: "٢:٢٨٠",
          quoteAr: "﴿وَإِن كَانَ ذُو عُسْرَةٍ فَنَظِرَةٌ إِلَىٰ مَيْسَرَةٍ﴾",
          noteAr: "مهلةٌ مأمورةٌ للمعسر، بلا غرامةٍ على العُسر — الأساس الذي تُبنى عليه ميزة «أحتاج وقتًا» بلا زيادةِ هللةٍ واحدة.",
          grade: "verified"
        },
        {
          kind: "aaoifi", labelAr: "معيار الشريعة رقم ١٩ — القرض (AAOIFI SS-19)",
          clauseAr: "البند ١٠/٣/٢",
          noteAr: "لا يجوز ربط أجرة الخدمة بمبلغ القرض الممنوح أو المسحوب — أجرةٌ نسبيّةٌ من مبلغ القرض رِبًا؛ الأساس الذي يمنع عهد من أخذ نسبةٍ من مبلغ القرض.",
          grade: "recorded"
        },
        {
          kind: "aaoifi", labelAr: "معيار الشريعة رقم ١٩ — القرض (AAOIFI SS-19)",
          clauseAr: "البند ٧/٨",
          noteAr: "اختبار الحيلة: لا يجوز اشتراط عقدٍ معاوضيٍّ كشرطٍ لمنح القرض؛ خدمة التوثيق يجب أن تكون مستقلّةً وحقيقيّةً، لا شرطًا مُقنَّعًا للقرض.",
          grade: "recorded"
        }
      ]
    },
    {
      key: "trust-band",
      titleAr: "إشارة الثقة النوعيّة — كلمةٌ لا رقم",
      mechanicAr: "أثر المستخدم عند نفسه كلمةٌ («وفّى بعهوده») لا رقمٌ ولا تصنيفٌ ائتمانيّ — لا يُصدَّر، لا يُباع، ولا يُستخدَم لتسعير أو رفض أيّ عهدٍ جديد.",
      citations: [
        {
          kind: "design", labelAr: "قاعدةٌ تصميميّةٌ تنفّذ السبينة، لا نصًّا فقهيًّا واحدًا بعينه",
          noteAr: "لا يستند أرشيف المشروع الشرعيّ إلى نصٍّ أو معيارٍ مرقَّمٍ واحدٍ بعينه لهذا العنصر تحديدًا؛ هو خيارٌ تصميميٌّ ينفّذ حدود عهد نفسها (لا تصنيف ائتمانيّ، لا تصدير) — والسؤال الشرعيّ المفتوح الحقيقيّ حوله مذكورٌ أدناه (D-1).",
          grade: "design-only"
        }
      ]
    }
  ]);

  /* Every genuinely open question, phrased AS A QUESTION for a qualified
     scholar — never a ruling. relatesTo links to the tracked decision/thread
     id in docs/DECISIONS-FOR-MARWAN.md or docs/evidence/EVIDENCE-BRIEF.md. */
  var OPEN_QUESTIONS = deepFreeze([
    {
      id: "D-6a-Hilah",
      questionAr: "هل يخلو فصل القرض الحسن (بلا زيادةٍ البتّة) عن أجرة توثيقٍ ثابتةٍ على عقد وكالةٍ منفصل من شبهة الحيلة أو قاعدة «كلّ قرضٍ جرَّ نفعًا»، وفق معيار الشريعة رقم ١٩ (البند ١٠/٣/٢ — عدم الربط بمبلغ القرض، والبند ٧/٨ — اختبار الحيلة)؟",
      forAudience: "لجنة/عالِمٍ شرعيٍّ معتمد (المرجعيّة المقترحة: الهيئة الشرعيّة لمصرف الإنماء)",
      relatesTo: ["D-6", "D-6a"]
    },
    {
      id: "D-1",
      questionAr: "هل يُخِلّ إفصاح المستخدم طوعًا عن كلمة «وفّى بعهوده» الخاصّة بتاريخه هو وحده (لا بيانات أيّ طرفٍ آخر) لطرفٍ جديدٍ بقاعدة أنّ إشارة الثقة «لا تُصدَّر ولا تُستخدَم في تقييم أحد»؟",
      forAudience: "عالِمٍ شرعيٍّ معتمد (مسألة خصوصيّةٍ وشرعٍ مشتركة)",
      relatesTo: ["D-1"]
    },
    {
      id: "D-3",
      questionAr: "هل يخلو نموذج «التعهّد ثم الدفع عند الصرف» (بلا إيداعٍ مجمَّعٍ لدى البنك) من شبهة الغرر أو الأمانة في تجميع دائرةٍ نحو هدفٍ مشترك؟ وهل يجوز لصندوق قرضٍ حسنٍ مؤسّسيٍّ أن يحتفظ بمالٍ مجمَّعٍ في عهدته تحت أيّ بنية أمانةٍ/حفظٍ مرخَّصة؟",
      forAudience: "لجنة/عالِمٍ شرعيٍّ معتمد",
      relatesTo: ["D-3"]
    },
    {
      id: "netting-multilateral",
      questionAr: "هل يمتدّ حكم المقاصّة والحوالة الثنائيّة المستقرّ فقهيًّا (بين طرفين) إلى مقاصّةٍ متعدّدة الأطراف (تسويةٌ شبكيّةٌ بين أكثر من طرفين دفعةً واحدة، كما تفعلها شاشة المقاصّة في عهد)، أم يستلزم ذلك شرطًا إضافيًّا في الرضا أو صيغة العقد لم يُشترَط في الحوالة الثنائيّة؟",
      forAudience: "عالِمٍ شرعيٍّ معتمد متخصّصٍ في فقه المعاملات",
      relatesTo: ["D-7"]
    }
  ]);

  function describeAr() {
    return {
      heading: HEADING,
      sub: SUB,
      noFatwaLine: NO_FATWA_LINE,
      pendingNote: PENDING_NOTE
    };
  }

  return {
    HEADING: HEADING,
    SUB: SUB,
    NO_FATWA_LINE: NO_FATWA_LINE,
    PENDING_NOTE: PENDING_NOTE,
    MECHANICS: MECHANICS,
    OPEN_QUESTIONS: OPEN_QUESTIONS,
    describeAr: describeAr
  };
});
