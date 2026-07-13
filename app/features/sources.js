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
      citeAr: "محاكم التنفيذ (وزارة العدل) عبر أرقام Argaam، نُشر ٢٤ يوليو ٢٠٢١ — EVIDENCE-BRIEF.md §D-1. رقمٌ حقيقيٌّ لكنّه قديم (٢٠٢٠–٢١)؛ بانتظار تحديثٍ من نجيز/نفاذ.",
      usedOnAr: "المقاصّة — سيناريو الأثر الوطني"
    }),
    Object.freeze({
      id: "national-scenario",
      nameAr: "سيناريو الانضغاط الوطني (لو صمدت نسبة عهد)",
      figureAr: "نسبة عهد (التزاماتٌ ← تحويلات) من ١٢ دائرةَ اختبارٍ توضيحيّة — لا رقمٌ مُقاس — مضروبةً في طلبات D-1 — عددٌ صحيحٌ فقط، لا كسرَ مالٍ",
      year: "٢٠٢٦",
      kind: KIND.ILLUSTRATIVE,
      citeAr: "سيناريوٌ توضيحيّ — لا رقمٌ مُقاس. يدمج نسبةً حقيقيّة من دوائر عهد التجريبيّة مع رقم D-1 المذكور؛ قضايا التنفيذ ليست دوائرَ متبادلةً بالضرورة، والغرض إظهار قوّة النسبة لا التنبّؤ.",
      usedOnAr: "المقاصّة"
    }),
    Object.freeze({
      id: "impact-fixture",
      nameAr: "دوائر أثر عهد (١٢ دائرة تجريبيّة)",
      figureAr: "مجاميعُ مجهّلة (التزامات/تحويلات/ريال) عن بياناتِ اختبارٍ مُركَّبة يدويًّا — ليست مسحًا ميدانيًّا ولا بيانات مستخدمين حقيقيّين",
      year: "٢٠٢٦",
      kind: KIND.ILLUSTRATIVE,
      citeAr: "app/features/impact.js — بيانات اختبارٍ حتميّة موسومة على الشاشة «دوائر تجريبيّة». بانتظار مسحٍ حقيقيّ (n≥١٥٠) يحلّ محلّها (OT-A1 / JL-8).",
      usedOnAr: "أثر عهد"
    })
  ]);

  function byId(id) {
    for (var i = 0; i < SOURCES.length; i++) { if (SOURCES[i].id === id) return SOURCES[i]; }
    return null;
  }

  function isMeasured(entry) { return !!entry && entry.kind === KIND.MEASURED; }
  function isIllustrative(entry) { return !!entry && entry.kind === KIND.ILLUSTRATIVE; }

  return {
    KIND: KIND,
    SOURCES: SOURCES,
    byId: byId,
    isMeasured: isMeasured,
    isIllustrative: isIllustrative
  };
});
