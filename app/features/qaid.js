/* ==========================================================================
   features/qaid.js — «قيد خفيف»: private, single-player, explicitly unsealed.
   Integer halalas only. Upgrade delegates to the existing create module.
=========================================================================== */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("../engine.js"), require("./create.js"));
  else root.Qaid = factory(root.AHD, root.CreateAhd);
})(typeof self !== "undefined" ? self : this, function (ENGINE, CREATE) {
  "use strict";

  var AS_OF = "2026-07-15";
  var TIMESTAMP = "2026-07-15T09:00:00+03:00";

  function emptyState(owner) {
    return { owner: String(owner || "أنا"), qaids: [] };
  }

  function cloneQaid(qaid) {
    return {
      id: qaid.id, owner: qaid.owner, direction: qaid.direction, name: qaid.name,
      amountMinor: qaid.amountMinor, noteAr: qaid.noteAr, sealed: false,
      labelAr: "قيد شخصي — غير مختوم", settled: !!qaid.settled,
      events: (qaid.events || []).map(function (event) { return { type: event.type }; })
    };
  }

  function cloneState(state) {
    state = state || emptyState("أنا");
    return { owner: String(state.owner || "أنا"), qaids: (state.qaids || []).map(cloneQaid) };
  }

  function addQaid(state, spec) {
    if (spec === undefined) { spec = state || {}; state = emptyState(spec.owner || "أنا"); }
    state = cloneState(state);
    spec = spec || {};
    var errors = [];
    if (spec.direction !== "lahum" && spec.direction !== "alayya") errors.push("direction must be lahum or alayya");
    var name = String(spec.name == null ? "" : spec.name).trim();
    if (!name) errors.push("name is required");
    if (!Number.isSafeInteger(spec.amountMinor) || spec.amountMinor <= 0) errors.push("amount must be positive integer halalas");
    if (errors.length) throw new Error(errors.join("; "));
    var id = "Q-" + String(state.qaids.length + 1).padStart(4, "0");
    state.qaids.push({
      id: id, owner: state.owner, direction: spec.direction, name: name,
      amountMinor: spec.amountMinor, noteAr: String(spec.noteAr || "").trim(),
      sealed: false, labelAr: "قيد شخصي — غير مختوم", settled: false,
      events: [{ type: "QAID_ADDED" }]
    });
    return state;
  }

  function qaidList(state, filter) {
    var qaids = cloneState(state).qaids.filter(function (qaid) {
      if (filter === "open") return !qaid.settled;
      if (filter === "settled") return qaid.settled;
      if (filter === "lahum" || filter === "alayya") return qaid.direction === filter;
      return true;
    });
    return {
      all: qaids,
      lahum: qaids.filter(function (qaid) { return qaid.direction === "lahum"; }),
      alayya: qaids.filter(function (qaid) { return qaid.direction === "alayya"; })
    };
  }

  function isSettled(qaid) {
    return !!(qaid && (qaid.settled || (qaid.events || []).some(function (event) { return event.type === "QAID_SETTLED"; })));
  }

  function settleQaid(state, id) {
    var next = cloneState(state), found = false;
    next.qaids = next.qaids.map(function (qaid) {
      if (qaid.id !== id) return qaid;
      found = true;
      if (qaid.settled) return qaid;
      qaid.settled = true;
      qaid.events = qaid.events.concat([{ type: "QAID_SETTLED" }]);
      return qaid;
    });
    if (!found) throw new Error("qaid not found");
    return next;
  }

  function upgradeToAhd(qaid) {
    if (!qaid || qaid.sealed !== false) throw new Error("personal unsealed qaid required");
    var owner = String(qaid.owner || "أنا");
    var lender = qaid.direction === "alayya" ? owner : qaid.name;
    var borrower = qaid.direction === "alayya" ? qaid.name : owner;
    return CREATE.makeDraft({
      id: "AHD-" + qaid.id,
      lender: lender,
      borrower: borrower,
      amountSAR: ENGINE.minorToFixed2(qaid.amountMinor),
      open: true,
      start: { y: 2026, m: 7 },
      timestamp: TIMESTAMP,
      purpose: qaid.noteAr || "قيد خفيف"
    });
  }

  function netHint(state) {
    var order = [], positions = {};
    (state && state.qaids || []).forEach(function (qaid) {
      if (qaid.settled) return;
      if (!positions[qaid.name]) { positions[qaid.name] = { minor: 0, lahum: false, alayya: false }; order.push(qaid.name); }
      positions[qaid.name][qaid.direction] = true;
      positions[qaid.name].minor += qaid.direction === "alayya" ? qaid.amountMinor : -qaid.amountMinor;
    });
    for (var i = 0; i < order.length; i++) {
      var name = order[i], position = positions[name];
      if (position.minor === 0 && position.lahum && position.alayya) {
        return { balanced: true, counterparty: name, netMinor: 0, transferRequired: false, textAr: "أنت و" + name + " متعادلان" };
      }
    }
    return { balanced: false, counterparty: null, netMinor: null, transferRequired: true, textAr: "لا توجد مقاصّة كاملة الآن" };
  }

  return {
    AS_OF: AS_OF,
    makeState: emptyState,
    emptyState: emptyState,
    addQaid: addQaid,
    qaidList: qaidList,
    settleQaid: settleQaid,
    isSettled: isSettled,
    upgradeToAhd: upgradeToAhd,
    netHint: netHint
  };
});
