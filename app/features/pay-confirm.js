/* ============================================================================
   features/pay-confirm.js — «تصديق السداد» (Najiz G4): the debtor RECORDS a
   payment with a descriptive مؤيد (evidence text — never a file upload, never
   an automatic truth), the creditor ACCEPTS (then — and only then — the app
   applies the payment through the existing pay path) or REJECTS with a reason
   from a FIXED enum, and a rejection opens «محلّ خلاف» with both records kept.
   No silent balance change, ever (درس ناجز: دليل سداد لا يغيّر الحالة صامتًا).
   Pure immutable state machine. Deterministic ids (PC-1, PC-2 …), no clock.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.PayConfirm = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var REASONS = {
    amount: "المبلغ لا يطابق",
    notReceived: "لم يصلني",
    duplicate: "دفعة مكررة",
    other: "سبب آخر مذكور"
  };

  function makeState() { return { claims: [], seq: 0 }; }

  function copyClaims(claims) { return claims.map(function (c) { return Object.assign({}, c); }); }

  function claim(state, spec) {
    spec = spec || {};
    if (!Number.isSafeInteger(spec.amountMinor) || spec.amountMinor <= 0) throw new Error("المبلغ يجب أن يكون هللات صحيحة موجبة");
    var evidence = String(spec.evidenceAr || "").trim();
    if (!evidence) throw new Error("المؤيد مطلوب — صف كيف سُدّدت الدفعة");
    var seq = state.seq + 1;
    var next = { claims: copyClaims(state.claims), seq: seq };
    next.claims.push({
      id: "PC-" + seq,
      recordId: String(spec.recordId || ""),
      amountMinor: spec.amountMinor,
      evidenceAr: evidence,
      byAr: String(spec.byAr || ""),
      status: "pending",
      reasonAr: null,
      opensDispute: false
    });
    return next;
  }

  function findIndex(state, id) {
    for (var i = 0; i < state.claims.length; i++) if (state.claims[i].id === id) return i;
    throw new Error("لا توجد دفعة بهذا المرجع: " + id);
  }

  function transition(state, id, patch) {
    var i = findIndex(state, id);
    if (state.claims[i].status !== "pending") throw new Error("لا يمكن تصديق دفعة مغلقة");
    var next = { claims: copyClaims(state.claims), seq: state.seq };
    Object.assign(next.claims[i], patch);
    return { state: next, item: next.claims[i] };
  }

  function accept(state, id) {
    var t = transition(state, id, { status: "accepted" });
    return { state: t.state, accepted: t.item };
  }

  function reject(state, id, reasonKey) {
    if (!Object.prototype.hasOwnProperty.call(REASONS, reasonKey)) throw new Error("سبب الرفض يجب أن يكون من القائمة الثابتة");
    var t = transition(state, id, { status: "rejected", reasonAr: REASONS[reasonKey], opensDispute: true });
    return { state: t.state, rejected: t.item };
  }

  function pendingFor(state, recordId) {
    return state.claims.filter(function (c) { return c.recordId === recordId && c.status === "pending"; });
  }

  function byId(state, id) {
    for (var i = 0; i < state.claims.length; i++) if (state.claims[i].id === id) return state.claims[i];
    return null;
  }

  return { makeState: makeState, claim: claim, accept: accept, reject: reject, pendingFor: pendingFor, byId: byId, REASONS: REASONS };
});
