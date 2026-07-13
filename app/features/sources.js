/* ============================================================================
   features/sources.js — «المصادر والمنهجية» (Data criterion, W3: real data /
   honest numbers). A single, checked-in, deterministic dataset naming every
   external or aggregate figure a judge can see across the app, each tagged
   MEASURED (a real cited fact, with its year) or ILLUSTRATIVE (a labelled
   scenario/projection that is never presented as measured). Nothing here is
   fetched or invented: every MEASURED entry's figure is copied verbatim from
   `docs/evidence/EVIDENCE-BRIEF.md`; every ILLUSTRATIVE entry says so in its
   own citeAr text, subordinate to — and clearly separated from — the cited
   facts. Screens render this list; they do not compute or duplicate it.
   Dual module: Node `require`, browser `window.Sources`.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Sources = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var KIND = Object.freeze({ MEASURED: "measured", ILLUSTRATIVE: "illustrative" });
  var GRADE = Object.freeze({ PRIMARY: "primary", SECONDARY: "secondary", MODEL: "model" });

  /* Every entry: id, nameAr (what it is), figureAr (the number/claim as shown
     or summarised), year (Arabic-Indic literal — vintage of the figure, never
     the current date), kind (measured|illustrative), citeAr (source name +
     honest caveat), usedOnAr (which screen(s) show it). */
  var SOURCES = Object.freeze([
    Object.freeze({
      id: "D-1",
      nameAr: "سندات الأمر أمام محاكم التنفيذ",
      figureAr: "٥٨٫٦ من كلّ ١٠٠ طلب — ٥٧١٬٢٥١ طلب تنفيذٍ — ١١٥٫٤ مليار ريال خلال ١١ شهرًا",
      year: "٢٠٢٠–٢١",
      kind: KIND.MEASURED,
      grade: GRADE.SECONDARY,
      citeAr: "محاكم التنفيذ (وزارة العدل) عبر أرقام Argaam، نُشر ٢٤ يوليو ٢٠٢١ — EVIDENCE-BRIEF.md §D-1. رقمٌ حقيقيٌّ لكنّه قديم (٢٠٢٠–٢١)؛ بانتظار تحديثٍ من نجيز/نفاذ.",
      usedOnAr: "المقاصّة — سيناريو الأثر الوطني"
    }),
    Object.freeze({
      id: "national-scenario",
      nameAr: "سيناريو الانضغاط الوطني (لو صمدت نسبة عهد)",
      figureAr: "نسبة عهد (التزاماتٌ ← تحويلات) من ١٢ دائرةَ اختبارٍ توضيحيّة — لا رقمٌ مُقاس — مضروبةً في طلبات D-1 — عددٌ صحيحٌ فقط، لا كسرَ مالٍ",
      year: "٢٠٢٦",
      kind: KIND.ILLUSTRATIVE,
      grade: GRADE.MODEL,
      citeAr: "سيناريوٌ توضيحيّ — لا رقمٌ مُقاس. يدمج نسبةً حقيقيّة من دوائر عهد التجريبيّة مع رقم D-1 المذكور؛ قضايا التنفيذ ليست دوائرَ متبادلةً بالضرورة، والغرض إظهار قوّة النسبة لا التنبّؤ.",
      usedOnAr: "المقاصّة"
    }),
    Object.freeze({
      id: "impact-fixture",
      nameAr: "دوائر أثر عهد (١٢ دائرة تجريبيّة)",
      figureAr: "مجاميعُ مجهّلة (التزامات/تحويلات/ريال) عن بياناتِ اختبارٍ مُركَّبة يدويًّا — ليست مسحًا ميدانيًّا ولا بيانات مستخدمين حقيقيّين",
      year: "٢٠٢٦",
      kind: KIND.ILLUSTRATIVE,
      grade: GRADE.MODEL,
      citeAr: "app/features/impact.js — بيانات اختبارٍ حتميّة موسومة على الشاشة «دوائر تجريبيّة». بانتظار مسحٍ حقيقيّ (n≥١٥٠) يحلّ محلّها (OT-A1 / JL-8).",
      usedOnAr: "أثر عهد"
    }),
    /* D2 (data-rigor fix): the real, primary-sourced KSA demand figure the evidence
       base was missing (OPEN-ITEMS panel#3 item 4) — copied VERBATIM from the World
       Bank's Little Data Book on Financial Inclusion 2022, p.111 (via
       swarm/agent-3-official-stats/findings-claude.md). NOT a synthetic scenario:
       a real household-survey statistic, KSA-specific (not a U.S. proxy) — the
       honest non-survey substitute for "informal qard hasan happens at scale in
       Saudi" while a real Saudi micro-survey (OT-A1) stays open. */
    Object.freeze({
      id: "findex-borrow-family",
      nameAr: "اقتراضٌ من العائلة/الأصدقاء (Global Findex)",
      figureAr: "٣٥٫٨ من كلّ ١٠٠ بالغٍ سعوديّ (١٥ سنة فأكثر) اقترضوا من العائلة أو الأصدقاء خلال ١٢ شهرًا — مقابل ١٣٫٧ من كلّ ١٠٠ في الدول مرتفعة الدخل. الجدول نفسه: اقترضوا من أيّ مصدرٍ ٥٩٫٧، اقترضوا رسميًّا ٣٢٫٤، يملكون حسابًا ٧٤٫٣ (عيّنة ١٬٠١٩، سبتمبر ٢٠٢١)",
      year: "٢٠٢١",
      kind: KIND.MEASURED,
      grade: GRADE.PRIMARY,
      citeAr: "World Bank, Little Data Book on Financial Inclusion 2022، ص ١١١ — رقمٌ سعوديٌّ أوّليٌّ حقيقيّ (ليس بديلًا أمريكيًّا)، مُستخرَجٌ حرفيًّا من ملفّ البنك الدوليّ. swarm/agent-3-official-stats/findings-claude.md. أفضل بديلٍ متاحٍ لمسحٍ ميدانيّ سعوديّ مباشر (لم يوجد بعد — OT-A1)؛ يجيب عن مدى شيوع الاقتراض غير الرسميّ، لا عن سبب عزوف الناس عن توثيقه.",
      usedOnAr: "أثر عهد"
    }),
    Object.freeze({ id: "findex-series", nameAr: "اتجاه الاقتراض من الأهل والأصدقاء", figureAr: "٣٧٣، ٣٣٥، ٣٥٨، ٣٠٤ من كل ألف بالغ (٢٠١٤–٢٠٢٤)", year: "٢٠١٤–٢٠٢٤", kind: KIND.MEASURED, grade: GRADE.PRIMARY, citeAr: "World Bank Global Findex، المؤشر fin22b، سلسلة سعودية أولية محفوظة داخل المنتج.", usedOnAr: "أثر عهد — سلّم الدليل" }),
    Object.freeze({ id: "findex-emergency", nameAr: "مصدر الطوارئ من الأهل والأصدقاء", figureAr: "٣٣٣ ثم ٣٨٠ من كل ألف بالغ (٢٠٢١، ٢٠٢٤)", year: "٢٠٢١–٢٠٢٤", kind: KIND.MEASURED, grade: GRADE.PRIMARY, citeAr: "World Bank Global Findex، المؤشر fin24fam، قياس أولي سعودي.", usedOnAr: "أثر عهد — سلّم الدليل" }),
    Object.freeze({ id: "gastat-context", nameAr: "سياق دخل وإنفاق الأسرة", figureAr: "عينة ١٢٢٬٣٢٥ أسرة؛ دخل وإنفاق شهري حسب حجم الأسرة", year: "٢٠٢٣", kind: KIND.MEASURED, grade: GRADE.PRIMARY, citeAr: "GASTAT Household Income and Consumption Expenditure Survey 2023، الجداول 8-2 و8-4؛ هذه سياقات اقتصادية وليست توزيعًا لقروض الأفراد.", usedOnAr: "أثر عهد — سلّم الدليل" }),
    Object.freeze({ id: "nafith-count", nameAr: "نمو تسجيل سندات نافذ", figureAr: "أكثر من ١٦٠٬٠٠٠ إلى أكثر من ٥٬٥٠٠٬٠٠٠ سند؛ حدّ نمو ٣٤×", year: "٢٠٢٠–٢٠٢٤", kind: KIND.MEASURED, grade: GRADE.SECONDARY, citeAr: "أرقام نافذ المبلّغ عنها؛ مصدر ثانوي وعدد تسجيلات فقط، لا قيمة سوق ولا حصة قروض شخصية.", usedOnAr: "أثر عهد — سلّم الدليل" }),
    Object.freeze({ id: "market-band", nameAr: "نطاق TAM/SAM/SOM", figureAr: "نموذج حتمي منخفض/أساسي/مرتفع بافتراضات ظاهرة", year: "٢٠٢٤", kind: KIND.ILLUSTRATIVE, grade: GRADE.MODEL, citeAr: "نموذج سوق توضيحيّ؛ لا رقمٌ مُقاس. معدل الاستحواذ حكم مؤسسين، وحجم القرض نطاق وكيل معلن.", usedOnAr: "أثر عهد — سلّم الدليل" })
  ]);

  function byId(id) {
    for (var i = 0; i < SOURCES.length; i++) { if (SOURCES[i].id === id) return SOURCES[i]; }
    return null;
  }

  function isMeasured(entry) { return !!entry && entry.kind === KIND.MEASURED; }
  function isIllustrative(entry) { return !!entry && entry.kind === KIND.ILLUSTRATIVE; }
  function gradeOf(entry) { return entry && entry.grade ? entry.grade : null; }
  function badgeAr(entry) {
    var grade = gradeOf(entry);
    return grade === GRADE.PRIMARY ? "أولي" : (grade === GRADE.SECONDARY ? "ثانوي" : "نموذج");
  }

  return {
    KIND: KIND,
    GRADE: GRADE,
    SOURCES: SOURCES,
    byId: byId,
    isMeasured: isMeasured,
    isIllustrative: isIllustrative,
    gradeOf: gradeOf,
    badgeAr: badgeAr
  };
});
