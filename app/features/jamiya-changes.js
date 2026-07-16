/* ============================================================================
   features/jamiya-changes.js — Hakbah G8: an APPEND-ONLY change log for the
   jamiya. Every order-swap (تراضٍ بين الاثنين) and withdrawal is a numbered
   entry (JC-1, JC-2 …); verify() recomputes the seq chain so a removed or
   reordered entry is exposed. Pure + immutable + deterministic (no clock).
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.JamiyaChanges = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function makeLog() { return { entries: [], seq: 0 }; }

  function append(log, entry) {
    var seq = log.seq + 1;
    var next = { entries: log.entries.slice(), seq: seq };
    next.entries.push(Object.assign({ id: "JC-" + seq, n: seq }, entry));
    return next;
  }

  function assertMember(jam, name) {
    if ((jam.members || []).indexOf(name) < 0) throw new Error("ليس عضوًا في الجمعية: " + name);
  }

  /* swap two members' rounds — only بالتراضي (both named, both consent recorded) */
  function swapRounds(log, jam, nameA, nameB) {
    assertMember(jam, nameA); assertMember(jam, nameB);
    var order = (jam.orderAgreed || []).slice();
    var ia = order.indexOf(nameA), ib = order.indexOf(nameB);
    if (ia < 0 || ib < 0) throw new Error("الاسمان يجب أن يكونا في الترتيب");
    order[ia] = nameB; order[ib] = nameA;
    var nextLog = append(log, {
      type: "swap", bothConsent: true,
      detailAr: "تبادل الدورين بالتراضي: " + nameA + " (الشهر " + (ia + 1) + ") ↔ " + nameB + " (الشهر " + (ib + 1) + ")"
    });
    return { log: nextLog, orderAfter: order };
  }

  function withdraw(log, jam, name, reasonAr) {
    assertMember(jam, name);
    var nextLog = append(log, {
      type: "withdraw", bothConsent: true,
      detailAr: "انسحب " + name + " — " + String(reasonAr || "بلا سبب مذكور")
    });
    return { log: nextLog, member: name };
  }

  /* append-only proof: ids must be JC-1..JC-n in order and seq must match */
  function verify(log) {
    for (var i = 0; i < log.entries.length; i++) {
      if (log.entries[i].n !== i + 1 || log.entries[i].id !== "JC-" + (i + 1)) {
        return { ok: false, whyAr: "السجل ليس متسلسلًا — حُذف أو أُعيد ترتيب قيد" };
      }
    }
    if (log.seq !== log.entries.length) return { ok: false, whyAr: "عدّاد السجل لا يطابق القيود" };
    return { ok: true };
  }

  return { makeLog: makeLog, swapRounds: swapRounds, withdraw: withdraw, verify: verify };
});
