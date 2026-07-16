/* ============================================================================
   features/jamiya-invite.js — Hakbah-inspired invitation cards (G7): every
   member sees ALL the terms — amount, duration, agreed order, THEIR round —
   plus the «ما ليس في هذه الجمعية» absent-list (لا رسوم، لا حيازة، لا سند
   تنفيذي) BEFORE accepting. The seal is gated on unanimous, INDIVIDUAL,
   recorded acceptances — a stronger gate than one «الكل وافق» checkbox.
   Declines keep their reason; a change of mind before the seal is allowed.
   Pure + immutable + deterministic.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.JamiyaInvite = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var ABSENT = [
    "لا رسوم على الجمعية ولا على الدور",
    "لا حيازة — الأموال لا تمر بالمصرف",
    "لا سند تنفيذي ولا تقييم مخاطر"
  ];

  function build(spec) {
    spec = spec || {};
    var members = spec.members || [];
    var order = spec.orderAgreed || members;
    var sar = (Number(spec.monthlyMinor) || 0) / 100;
    var receive = sar * members.length;
    var termsAr = [
      { k: "المساهمة الشهرية", v: sar + " ر.س لكل عضو" },
      { k: "المدة", v: members.length + " أشهر — دورة كاملة" },
      { k: "قيمة الاستلام", v: receive + " ر.س في دورك" },
      { k: "بداية الدورة", v: String(spec.startMonth || "") },
      { k: "ترتيب الاستلام", v: order.join(" ← ") }
    ];
    var perMember = members.map(function (name) {
      return { name: name, round: order.indexOf(name) + 1 };
    });
    return { termsAr: termsAr, absentAr: ABSENT.slice(), perMember: perMember };
  }

  function makeState(members) {
    var names = {};
    (members || []).forEach(function (m) { names[m] = true; });
    return { decisions: {}, membersKey: names };
  }

  function copyState(state) {
    var d = {};
    Object.keys(state.decisions).forEach(function (k) { d[k] = Object.assign({}, state.decisions[k]); });
    return { decisions: d, membersKey: state.membersKey };
  }

  function assertMember(state, name) {
    if (!state.membersKey[name]) throw new Error("ليس عضوًا في هذه الجمعية: " + name);
  }

  function accept(state, name) {
    assertMember(state, name);
    var next = copyState(state);
    next.decisions[name] = { status: "accepted" };
    return next;
  }

  function decline(state, name, reasonAr) {
    assertMember(state, name);
    var next = copyState(state);
    next.decisions[name] = { status: "declined", reasonAr: String(reasonAr || "اعتذر") };
    return next;
  }

  function allAccepted(state, members) {
    return (members || []).length > 0 && members.every(function (m) {
      return state.decisions[m] && state.decisions[m].status === "accepted";
    });
  }

  function summaryAr(state, members) {
    var acc = 0, dec = 0;
    (members || []).forEach(function (m) {
      var d = state.decisions[m];
      if (d && d.status === "accepted") acc++;
      else if (d && d.status === "declined") dec++;
    });
    var waiting = members.length - acc - dec;
    return "قَبِل " + acc + " · اعتذر " + dec + " · بانتظار " + waiting;
  }

  return { build: build, makeState: makeState, accept: accept, decline: decline, allAccepted: allAccepted, summaryAr: summaryAr, ABSENT: ABSENT };
});
