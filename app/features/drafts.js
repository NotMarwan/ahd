/* ============================================================================
   features/drafts.js — Splitwise G10: a recurring anything NEVER creates a
   commitment by itself. It proposes a DRAFT; a human approves (once) or
   declines with a reason. Generic approvable-draft queue: propose → approve /
   decline. Deterministic ids (DR-1 …), immutable transitions, no clock.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Drafts = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function makeState() { return { items: [], seq: 0 }; }

  function copyItems(items) { return items.map(function (i) { return Object.assign({}, i); }); }

  function propose(state, item) {
    var seq = state.seq + 1;
    var next = { items: copyItems(state.items), seq: seq };
    next.items.push(Object.assign({ id: "DR-" + seq, status: "proposed", reasonAr: null }, item));
    return next;
  }

  function findOpen(state, id) {
    for (var i = 0; i < state.items.length; i++) {
      if (state.items[i].id === id) {
        if (state.items[i].status !== "proposed") throw new Error("المسودة مغلقة — لا اعتماد مكررًا");
        return i;
      }
    }
    throw new Error("لا مسودة بهذا المرجع: " + id);
  }

  function approve(state, id) {
    var i = findOpen(state, id);
    var next = { items: copyItems(state.items), seq: state.seq };
    next.items[i].status = "approved";
    return { state: next, item: next.items[i] };
  }

  function decline(state, id, reasonAr) {
    var i = findOpen(state, id);
    var next = { items: copyItems(state.items), seq: state.seq };
    next.items[i].status = "declined";
    next.items[i].reasonAr = String(reasonAr || "أُهملت");
    return next;
  }

  function pending(state) {
    return state.items.filter(function (i) { return i.status === "proposed"; });
  }

  return { makeState: makeState, propose: propose, approve: approve, decline: decline, pending: pending };
});
