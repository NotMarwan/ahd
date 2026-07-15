/* ==========================================================================
   features/jamiya.js — «الجمعية الموثّقة»: deterministic sealed ROSCA.
   Members move money directly. Ahd witnesses the mutually agreed order,
   schedule, and each monthly payment. No custody, random selection, fee,
   interest, penalty, score, clock, or floating-point money.
=========================================================================== */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("../engine.js"));
  else root.Jamiya = factory(root.AHD);
})(typeof self !== "undefined" ? self : this, function (ENGINE) {
  "use strict";

  function copyPayments(payments) {
    return (payments || []).map(function (payment) {
      return {
        type: payment.type,
        round: payment.round,
        month: payment.month,
        member: payment.member,
        recipient: payment.recipient,
        amountMinor: payment.amountMinor,
        canonical_hash: payment.canonical_hash,
        seal: payment.seal
      };
    });
  }

  function cloneJamiya(jamiya) {
    return {
      kind: "jamiya",
      members: (jamiya.members || []).slice(),
      monthlyMinor: jamiya.monthlyMinor,
      startMonth: jamiya.startMonth,
      orderAgreed: (jamiya.orderAgreed || []).slice(),
      payments: copyPayments(jamiya.payments),
      canonical_hash: jamiya.canonical_hash,
      seal: jamiya.seal
    };
  }

  function cleanNames(values) {
    return (values || []).map(function (value) { return String(value == null ? "" : value).trim(); });
  }

  function unique(values) {
    var seen = {};
    for (var i = 0; i < values.length; i++) {
      if (!values[i] || seen[values[i]]) return false;
      seen[values[i]] = true;
    }
    return true;
  }

  function validMonth(value) {
    var match = /^(\d{4})-(\d{2})$/.exec(String(value || ""));
    if (!match) return false;
    var month = Number(match[2]);
    return month >= 1 && month <= 12;
  }

  function permutation(members, order) {
    if (members.length !== order.length || !unique(members) || !unique(order)) return false;
    var expected = members.slice().sort();
    var actual = order.slice().sort();
    for (var i = 0; i < expected.length; i++) if (expected[i] !== actual[i]) return false;
    return true;
  }

  function makeJamiya(spec) {
    spec = spec || {};
    var members = cleanNames(spec.members);
    var order = cleanNames(spec.orderAgreed);
    var errors = [];
    if (members.length < 3 || members.length > 20 || !unique(members)) errors.push("members must contain 3-20 unique names");
    if (!Number.isSafeInteger(spec.monthlyMinor) || spec.monthlyMinor <= 0) errors.push("amount must be a positive integer in halalas");
    if (!permutation(members, order)) errors.push("order must be a permutation of members");
    if (!validMonth(spec.startMonth)) errors.push("startMonth must be YYYY-MM");
    if (errors.length) throw new Error(errors.join("; "));
    return {
      kind: "jamiya",
      members: members,
      monthlyMinor: spec.monthlyMinor,
      startMonth: String(spec.startMonth),
      orderAgreed: order,
      payments: []
    };
  }

  function addMonths(startMonth, offset) {
    var parts = startMonth.split("-");
    var index = Number(parts[0]) * 12 + Number(parts[1]) - 1 + offset;
    var year = Math.floor(index / 12);
    var month = index - year * 12 + 1;
    return String(year) + "-" + (month < 10 ? "0" : "") + String(month);
  }

  function jamiyaSchedule(jamiya) {
    return jamiya.orderAgreed.map(function (recipient, round) {
      return {
        round: round,
        month: addMonths(jamiya.startMonth, round),
        recipient: recipient,
        expectedPerMemberMinor: jamiya.monthlyMinor
      };
    });
  }

  function jamiyaTermsAr(jamiya, engine) {
    var e = engine || ENGINE;
    var potMinor = jamiya.monthlyMinor * jamiya.members.length;
    return "اتفق أعضاء الجمعية جميعًا على أن يدفع كل عضو " + e.minorToFixed2(jamiya.monthlyMinor) +
      " ريال شهريًّا، وأن يستلم مستفيد الشهر مبلغ " + e.minorToFixed2(potMinor) +
      " ريال. ثُبّت ترتيب الاستلام بتراضي الأعضاء جميعًا، من غير سحبٍ عشوائي. " +
      "الأموال تنتقل بين الأعضاء مباشرةً؛ المصرف لا يحتفظ بها ولا يتصرّف فيها، وإنما يشهد ويوثّق ويختم. " +
      "هذا تعاونٌ بلا أيّ زيادةٍ ولا فائدةٍ ولا غرامة. وعند التعثّر يُحال العضو إلى مسار رِفق والمهلة.";
  }

  function jamiyaCanonical(jamiya, engine) {
    var e = engine || ENGINE;
    return [
      "AHD-JAMIYA-v1",
      "members=" + jamiya.members.join("|"),
      "monthly=" + e.minorToFixed2(jamiya.monthlyMinor) + " SAR",
      "start_month=" + jamiya.startMonth,
      "agreed_order=" + jamiya.orderAgreed.join("|"),
      "rounds=" + jamiya.members.length,
      "selection=mutual-consent",
      "custody=member-to-member",
      "terms_hash=" + e.sha256(jamiyaTermsAr(jamiya, e)),
      "riba=interest:false;late_penalty:false;surplus:false",
      "random_selection=false"
    ].join("\n");
  }

  function jamiyaSeal(jamiya, engine) {
    var e = engine || ENGINE;
    var sealed = cloneJamiya(jamiya);
    var canonicalHash = e.sha256(jamiyaCanonical(sealed, e));
    sealed.canonical_hash = canonicalHash;
    sealed.seal = e.sealBlock(e.GENESIS, canonicalHash, 1);
    return sealed;
  }

  function paymentCanonical(jamiya, payment, engine) {
    var e = engine || ENGINE;
    return [
      "AHD-JAMIYA-PAYMENT-v1",
      "contract_seal=" + jamiya.seal,
      "round=" + payment.round,
      "month=" + payment.month,
      "member=" + payment.member,
      "recipient=" + payment.recipient,
      "amount=" + e.minorToFixed2(payment.amountMinor) + " SAR"
    ].join("\n");
  }

  function recordPayment(jamiya, entry, engine) {
    var e = engine || ENGINE;
    var sealed = jamiya && jamiya.seal ? cloneJamiya(jamiya) : jamiyaSeal(jamiya, e);
    entry = entry || {};
    var round = entry.round;
    var member = String(entry.member == null ? "" : entry.member).trim();
    if (!Number.isInteger(round) || round < 0 || round >= sealed.members.length) throw new Error("round is outside the jamiya schedule");
    if (sealed.members.indexOf(member) < 0) throw new Error("member is not part of this jamiya");
    for (var i = 0; i < sealed.payments.length; i++) {
      if (sealed.payments[i].round === round && sealed.payments[i].member === member) throw new Error("payment already recorded");
    }
    var schedule = jamiyaSchedule(sealed);
    var payment = {
      type: "JAMIYA_PAYMENT",
      round: round,
      month: schedule[round].month,
      member: member,
      recipient: schedule[round].recipient,
      amountMinor: sealed.monthlyMinor
    };
    var canonicalHash = e.sha256(paymentCanonical(sealed, payment, e));
    var previousSeal = sealed.payments.length ? sealed.payments[sealed.payments.length - 1].seal : sealed.seal;
    payment.canonical_hash = canonicalHash;
    payment.seal = e.sealBlock(previousSeal, canonicalHash, sealed.payments.length + 2);
    sealed.payments.push(payment);
    return sealed;
  }

  function foldJamiya(jamiya) {
    var count = jamiya.members.length;
    var paid = [];
    var r, m;
    for (r = 0; r < count; r++) {
      paid[r] = [];
      for (m = 0; m < count; m++) paid[r][m] = false;
    }
    (jamiya.payments || []).forEach(function (payment) {
      var memberIndex = jamiya.members.indexOf(payment.member);
      if (payment.round >= 0 && payment.round < count && memberIndex >= 0) paid[payment.round][memberIndex] = true;
    });
    var whoReceived = [];
    var currentRound = count;
    for (r = 0; r < count; r++) {
      var complete = paid[r].every(function (value) { return value; });
      if (complete) whoReceived.push(jamiya.orderAgreed[r]);
      else if (currentRound === count) currentRound = r;
    }
    return { paid: paid, currentRound: currentRound, whoReceived: whoReceived };
  }

  function conservation(jamiya) {
    var count = jamiya.members.length;
    var fullIn = jamiya.monthlyMinor * count;
    var rows = jamiya.members.map(function (member) {
      var receipts = 0;
      for (var i = 0; i < jamiya.orderAgreed.length; i++) if (jamiya.orderAgreed[i] === member) receipts++;
      var totalOut = receipts * fullIn;
      return { member: member, totalInMinor: fullIn, totalOutMinor: totalOut, netMinor: totalOut - fullIn };
    });
    var totalIn = rows.reduce(function (sum, row) { return sum + row.totalInMinor; }, 0);
    var totalOut = rows.reduce(function (sum, row) { return sum + row.totalOutMinor; }, 0);
    return {
      ok: totalIn === totalOut && rows.every(function (row) { return row.netMinor === 0; }),
      members: rows,
      totalInMinor: totalIn,
      totalOutMinor: totalOut,
      surplusMinor: totalOut - totalIn
    };
  }

  function verifyJamiya(jamiya, engine) {
    var e = engine || ENGINE;
    if (!jamiya || !jamiya.seal || !jamiya.canonical_hash) return { ok: false, contractOk: false, eventsOk: false };
    var canonicalHash = e.sha256(jamiyaCanonical(jamiya, e));
    var expectedContractSeal = e.sealBlock(e.GENESIS, canonicalHash, 1);
    var contractOk = canonicalHash === jamiya.canonical_hash && expectedContractSeal === jamiya.seal;
    var previousSeal = expectedContractSeal;
    var eventsOk = true;
    for (var i = 0; i < (jamiya.payments || []).length; i++) {
      var payment = jamiya.payments[i];
      var paymentHash = e.sha256(paymentCanonical(jamiya, payment, e));
      var paymentSeal = e.sealBlock(previousSeal, paymentHash, i + 2);
      if (paymentHash !== payment.canonical_hash || paymentSeal !== payment.seal) eventsOk = false;
      previousSeal = paymentSeal;
    }
    return { ok: contractOk && eventsOk, contractOk: contractOk, eventsOk: eventsOk, sealed: jamiya.seal, recomputed: expectedContractSeal };
  }

  function jamiyaStatusAr(jamiya) {
    if (!jamiya || !jamiya.seal) return "مسودة";
    var total = jamiya.members.length * jamiya.members.length;
    if ((jamiya.payments || []).length === total) return "مكتملة";
    if (!(jamiya.payments || []).length) return "موثّقة";
    return "جارية";
  }

  return {
    makeJamiya: makeJamiya,
    jamiyaSchedule: jamiyaSchedule,
    recordPayment: recordPayment,
    foldJamiya: foldJamiya,
    conservation: conservation,
    jamiyaCanonical: jamiyaCanonical,
    jamiyaSeal: jamiyaSeal,
    verifyJamiya: verifyJamiya,
    jamiyaTermsAr: jamiyaTermsAr,
    jamiyaStatusAr: jamiyaStatusAr
  };
});
