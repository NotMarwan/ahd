/* ============================================================================
   features/next-step.js — «وش الوضع؟»: the Zirtue-inspired status strip model.
   Answers three questions for any covenant row: ما المتفق عليه؟ ماذا حدث؟
   ما التالي؟ — plus a Najiz-style reference number. Pure over a Daftari row
   (output of Daftari.rowFor); no engine, no DOM, no dates. Never a penalty,
   never red for lateness (tone: ok | warm | attention).
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.NextStep = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function refOf(id) {
    var s = String(id || "");
    return "عهد-" + (s.indexOf("R-") === 0 ? s.slice(2) : s);
  }

  var NEXT = {
    ACTIVE_LENDER: "انتظر الموعد، أو أرسل تذكيرًا لطيفًا من دفتري.",
    ACTIVE_BORROWER: "سدّد قسطك قبل الموعد، أو اطلب مهلة إن ضاق الوقت.",
    OVERDUE_LENDER: "تواصل بلطف — تذكير، مهلة، أو جدولة جديدة. لا غرامة هنا.",
    OVERDUE_BORROWER: "سجّل دفعة، أو اطلب مهلة بكرامة — التأخر ليس جريمة.",
    GRACED: "في مهلة متفق عليها — لا خطوة مطلوبة الآن.",
    DISPUTED: "راجع «محلّ خلاف» — عهد يعرض السجل ولا يحكم.",
    KEPT: "اكتمل — يمكنك إغلاقه في سجلّ المعروف.",
    FORGIVEN: "أُبرئ — أثره محفوظ في سجلّ المعروف."
  };

  function fromRow(row) {
    var paid = Math.round((row.amountSAR - row.remainingSAR) * 100) / 100;
    var agreed = (row.role === "lender" ? "أقرضت " : "استلفت من ") + row.counterparty + " " + row.amountSAR + " ر.س";
    var happened = paid > 0 ? ("سُدّد " + paid + " ر.س، وبقي " + row.remainingSAR + " ر.س") : "لم تُسجَّل دفعات بعد";
    var next, tone;
    if (row.statusKey === "DISPUTED") { next = NEXT.DISPUTED; tone = "attention"; }
    else if (row.statusKey === "KEPT") { next = NEXT.KEPT; tone = "ok"; happened = "اكتمل السداد كاملًا"; }
    else if (row.statusKey === "FORGIVEN") { next = NEXT.FORGIVEN; tone = "warm"; }
    else if (row.graced) { next = NEXT.GRACED; tone = "warm"; }
    else if (row.isOverdue) { next = NEXT[row.role === "lender" ? "OVERDUE_LENDER" : "OVERDUE_BORROWER"]; tone = "attention"; }
    else {
      var base = NEXT[row.role === "lender" ? "ACTIVE_LENDER" : "ACTIVE_BORROWER"];
      next = row.nextDueLabel ? ("الموعد القادم: " + row.nextDueLabel + ". " + base) : base;
      tone = "ok";
    }
    return { ref: refOf(row.id), agreedAr: agreed, happenedAr: happened, nextAr: next, tone: tone };
  }

  return { fromRow: fromRow, refOf: refOf, NEXT: NEXT };
});
