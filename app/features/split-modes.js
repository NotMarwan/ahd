/* ============================================================================
   features/split-modes.js — Splitwise-grade flexible splitting ON TOP of the
   existing split.js guarantee: exact / percent / shares modes, all conserving
   every integer halala (largest remainder → earliest participants, the SAME
   policy split.js uses). equal delegates to Split.makeSplit byte-for-byte.
   validate() never throws — it returns { ok } or { ok:false, errorAr } so the
   screen can gate the save button with a clear Arabic message.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./split.js"));
  else root.SplitModes = factory(root.Split);
})(typeof self !== "undefined" ? self : this, function (SPLIT) {
  "use strict";

  var MODES = { equal: 1, exact: 1, percent: 1, shares: 1 };

  function baseCheck(spec) {
    spec = spec || {};
    if (!MODES[spec.mode]) return "طريقة تقسيم غير معروفة";
    if (!Number.isSafeInteger(spec.totalMinor) || spec.totalMinor <= 0) return "الأصل يجب أن يكون هللات صحيحة موجبة";
    var names = (spec.participants || []).map(function (n) { return String(n || "").trim(); });
    if (names.length < 2) return "شخصان على الأقل";
    var seen = {};
    for (var i = 0; i < names.length; i++) {
      if (!names[i] || seen[names[i]]) return "الأسماء يجب أن تكون فريدة وغير فارغة";
      seen[names[i]] = true;
    }
    if (names.indexOf(String(spec.payer || "").trim()) < 0) return "الدافع يجب أن يكون من المشاركين";
    return null;
  }

  function valuesCheck(spec) {
    if (spec.mode === "equal") return null;
    var v = spec.values || [];
    if (v.length !== spec.participants.length) return "أدخل قيمة لكل مشارك";
    for (var i = 0; i < v.length; i++) {
      if (!Number.isSafeInteger(v[i]) || v[i] < 0) return "القيم يجب أن تكون أعدادًا صحيحة غير سالبة";
    }
    var sum = v.reduce(function (a, x) { return a + x; }, 0);
    if (spec.mode === "exact" && sum !== spec.totalMinor) return "المجموع لا يساوي الأصل — عدّل الحصص";
    if (spec.mode === "percent" && sum !== 100) return "مجموع النسب يجب أن يساوي 100";
    if (spec.mode === "shares" && sum <= 0) return "مجموع الحصص يجب أن يكون موجبًا";
    return null;
  }

  function validate(spec) {
    var err = baseCheck(spec) || valuesCheck(spec);
    return err ? { ok: false, errorAr: err } : { ok: true };
  }

  /* proportional integer distribution: floor everyone, then hand the leftover
     halalas to the EARLIEST participants — identical policy to split.js. */
  function distribute(totalMinor, weights) {
    var wSum = weights.reduce(function (a, w) { return a + w; }, 0);
    var floors = weights.map(function (w) { return Math.floor(totalMinor * w / wSum); });
    var leftover = totalMinor - floors.reduce(function (a, x) { return a + x; }, 0);
    return floors.map(function (f, i) { return f + (i < leftover ? 1 : 0); });
  }

  function make(spec) {
    var v = validate(spec);
    if (!v.ok) throw new Error(v.errorAr);
    if (spec.mode === "equal") {
      var eq = SPLIT.makeSplit({ totalMinor: spec.totalMinor, payer: spec.payer, participants: spec.participants });
      return { totalMinor: eq.totalMinor, payer: eq.payer, participants: eq.participants, shares: eq.shares, qaidDrafts: eq.qaidDrafts, mode: "equal" };
    }
    var names = spec.participants.map(function (n) { return String(n).trim(); });
    var payer = String(spec.payer).trim();
    var amounts = spec.mode === "exact" ? spec.values.slice() : distribute(spec.totalMinor, spec.values);
    var shares = names.map(function (name, i) { return { name: name, amountMinor: amounts[i] }; });
    var qaidDrafts = shares.filter(function (s) { return s.name !== payer && s.amountMinor > 0; }).map(function (s) {
      return { direction: "alayya", name: s.name, amountMinor: s.amountMinor, noteAr: "قسمة فاتورة" };
    });
    return { totalMinor: spec.totalMinor, payer: payer, participants: names.slice(), shares: shares, qaidDrafts: qaidDrafts, mode: spec.mode };
  }

  return { make: make, validate: validate, MODES: MODES };
});
