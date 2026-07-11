/* ============================================================================
   features/exhibit-view.js — Arabic line projection of the NEUTRAL court
   exhibit (CovenantLog.exhibitFor). Pure strings for the covenant screen to
   escape + render. ON-SPINE: parties + terms-hash + sealed timeline + final
   status ONLY — no reputation vocabulary, no day-counter, no percentage.
   Dual module: Node `require`, browser `window.ExhibitView`.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ExhibitView = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* exhibit timeline kind → dignified Arabic noun (mirrors CovenantLog.EVENT_KIND kinds) */
  var KIND_AR = {
    sealed: "خُتم العهد", reminder: "تذكيرٌ لطيف", grace_requested: "طُلبت نظرةٌ إلى ميسرة",
    grace_granted: "أُعيدت الجدولة بالمعروف", paid: "دفعةٌ حين تيسّر",
    forgiven_partial: "إبراءٌ جزئيٌّ صدقةً", forgiven_all: "إبراءُ ما تبقّى صدقةً",
    settled: "وُفِّي به — ذمّة محفوظة", dispute: "محلّ خلاف — وثيقة محايدة"
  };

  function shortHash(h) { return String(h || "").slice(0, 16); }

  function exhibitLinesAr(x) {
    var headerLines = [
      "وثيقة بيّنة محايدة — " + x.docType,
      "الطرفان: «" + x.parties.lender + "» و«" + x.parties.borrower + "» — عهد " + x.ahdId,
      "بصمة الشروط (terms-hash): " + shortHash(x.termsHash) + "…",
      "الأساس: قرضٌ حسنٌ دون أيّ زيادة — " + x.basis + " ﴿فنظرةٌ إلى ميسرة﴾"
    ];
    var timelineLines = (x.timeline || []).map(function (t, i) {
      return String(i + 1) + ". " + (KIND_AR[t.kind] || t.kind) +
        (t.atISO ? " — " + t.atISO : "") + " — " + t.amountFixed2 + " ر.س — SEAL " + t.seal + "…";
    });
    var footerLines = [
      "الحالة النهائيّة: " + (x.finalStatus || "قائم"),
      "رأس السلسلة (head): " + shortHash(x.head) + "…",
      "وقائعُ مختومةٌ فقط — لا عدَّ أيّامٍ فيها ولا حكمَ على أحد (نظام الإثبات ٢٠٢٢)."
    ];
    return { headerLines: headerLines, timelineLines: timelineLines, footerLines: footerLines };
  }

  return { exhibitLinesAr: exhibitLinesAr, KIND_AR: KIND_AR };
});
