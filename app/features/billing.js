/* ============================================================================
   features/billing.js — «الأجرة والخطط» pluggable fee engine (Phase A revenue).
   The ONE source of truth for what عهد may charge, built to the spine:
   the قرض حسن is 0 to the bank FOREVER; every price here is a flat, integer-
   halalas amount for a GENUINELY SEPARATE service (software / documentation) —
   NEVER a percentage of a loan, never growing with delay (AAOIFI SS-19 cl 10/3/2).
   Every paid item carries shariahReviewNeeded:true — nothing is board-approved
   yet (D-6). Pure + deterministic: no date/random/locale primitive; money is
   integer halalas and all formatting is string math (no float money).
   Dual module: Node `require`, browser `window.Billing`.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Billing = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* flat documentation أجرة per witnessed covenant — a FIXED amount, independent
     of the loan size and its tenor. Benchmarked to the actual DIRECT service cost
     band (Nafath/CSP signature + RFC-3161 timestamp + rail fee ≈ 2–5 ر.س). Held at
     the low end. This is the ONLY per-covenant number, and it never scales. */
  var FLAT_SEAL_FEE_HALALAS = 500;                 /* 5.00 ر.س, flat */

  var SHARIAH_REVIEW_LABEL = "قيد المراجعة الشرعيّة";
  var LOAN_FREE_AR = "القرض مجانيٌّ للأبد";
  var SERVICE_NOT_LOAN_AR = "أجرة على الخدمة، لا على القرض";

  /* The tiers. `paid` tiers are ALL flagged shariahReviewNeeded — honest posture:
     the model is planned, pending board sign-off (D-6). `priceHalalas` is a flat
     amount per `cycle`; `perSeatHalalas` (when present) is an alternative flat
     per-seat option. NO price is ever a function of a member's loan. */
  var PLANS = [
    {
      key: "free", name: "مجاني", payer: "الأفراد",
      priceHalalas: 0, cycle: "شهر", unit: "",
      paid: false, shariahReviewNeeded: false, loanAlwaysFree: true,
      note: "توثيق العهد وختمه وتسويته — مجانًا للأبد.",
      features: [
        "توثيق العهود وختمها وتسويتها — بلا أيّ رسم",
        "دفترك ومقاصّتك الأساسيّة",
        "البيّنة المحايدة عند الحاجة — مجانًا"
      ]
    },
    {
      key: "plus", name: "دفتري بلس", payer: "الأفراد",
      priceHalalas: 1200, cycle: "شهر", unit: "لكلّ شهر",
      paid: true, shariahReviewNeeded: true, loanAlwaysFree: true,
      note: "ميزاتٌ غير-قرضيّة فقط — توثيق القرض يبقى مجانيًّا.",
      features: [
        "دوائر بلا حدّ",
        "تحليلاتٌ مفصّلة",
        "تذكيراتٌ بإيقاعٍ مخصّص",
        "تصديرٌ أولويٌّ للوثائق"
      ]
    },
    {
      key: "circle", name: "الدائرة", payer: "منظّم الدائرة",
      priceHalalas: 1900, cycle: "شهر", unit: "لكلّ دائرة/شهر",
      paid: true, shariahReviewNeeded: true, loanAlwaysFree: true,
      note: "يدفعها المنظّم، لا المقترضون.",
      features: [
        "مقاصّةٌ جماعيّة",
        "قسمةٌ تلقائيّة بالأصناف",
        "إدارة العهود المتكرّرة"
      ]
    },
    {
      key: "org", name: "المؤسسة · الوقف", payer: "جمعيّة / جهة عمل / مكتب عائلي",
      priceHalalas: 290000, perSeatHalalas: 400, cycle: "شهر", unit: "لكلّ شهر (أو ٤ ر.س لكلّ مقعد)",
      paid: true, shariahReviewNeeded: true, loanAlwaysFree: true,
      note: "أجرةٌ على البرمجيّة يدفعها الكيان — لا تُنتزَع من قرضِ أحد.",
      features: [
        "إدارة صندوق قرضٍ حسن",
        "عهود الأجور (مساند)",
        "توثيقٌ بالجملة",
        "تقرير الأثر المجهّل"
      ]
    },
    {
      key: "bank", name: "ترخيص المصرف (white-label)", payer: "مصرف / منشأة تقنيّة ماليّة",
      priceHalalas: 25000000, cycle: "سنة", unit: "لكلّ سنة + ~١–٣ ر.س لكلّ ختم",
      paid: true, shariahReviewNeeded: true, loanAlwaysFree: true,
      note: "المصرف يشغّله لعملائه كمنتج ولاءٍ مجاني — والقرض يبقى مجانيًّا.",
      features: [
        "المحرّك كاملًا (توثيق + مقاصّة مختومة)",
        "بندٌ يمنع الربا والغرامة والتصنيف",
        "تشغيلٌ باسم المصرف"
      ]
    }
  ];

  function planByKey(key) {
    for (var i = 0; i < PLANS.length; i++) if (PLANS[i].key === key) return PLANS[i];
    return null;
  }

  /* the flat per-covenant أجرة. Deliberately IGNORES the record entirely — the fee
     must not depend on the loan amount or tenor. `loanChargeHalalas` is 0 (the bank
     takes nothing on the قرض); `feeHalalas` is the flat service أجرة. */
  function feeForSeal(record) {
    return {
      loanChargeHalalas: 0,
      feeHalalas: FLAT_SEAL_FEE_HALALAS,
      flat: true,
      percentOfLoan: 0,
      shariahReviewNeeded: true
    };
  }

  /* a flat monthly (or annual) software invoice for an institution/circle. The
     amount is the plan's flat price for the cycle — or seats × the flat per-seat
     price when `seats` is given and the plan offers a per-seat option. Integer
     halalas only; never a function of any member's loan. `cycleKey` is a caller-
     supplied period string (e.g. "2026-07") — no clock is read here. */
  function subscriptionInvoice(planOrKey, cycleKey, seats) {
    var plan = (typeof planOrKey === "string") ? planByKey(planOrKey) : planOrKey;
    if (!plan) return null;
    var amount = plan.priceHalalas || 0;
    var s = Number(seats);
    if (plan.perSeatHalalas && isFinite(s) && s > 0) {
      amount = plan.perSeatHalalas * Math.floor(s);
    }
    return {
      planKey: plan.key,
      cycleKey: (cycleKey == null ? "" : String(cycleKey)),
      amountHalalas: amount,
      seats: (plan.perSeatHalalas && isFinite(s) && s > 0) ? Math.floor(s) : null,
      flat: true,
      percentOfAnyLoan: 0,
      shariahReviewNeeded: !!plan.paid
    };
  }

  /* integer halalas → "X.YY" (western digits) via string math only — no float,
     no locale primitive. e.g. 0 → "0.00", 500 → "5.00", 290000 → "2900.00". */
  function sarStr(halalas) {
    var h = Number(halalas);
    if (!isFinite(h)) h = 0;
    var neg = h < 0; if (neg) h = -h;
    var whole = (h - (h % 100)) / 100;
    var cents = h % 100;
    var cs = cents < 10 ? "0" + cents : "" + cents;
    return (neg ? "-" : "") + whole + "." + cs;
  }

  /* integer halalas → whole riyals (floor), for comma-formatting a whole-SAR price
     through the golden fmt at the display layer. */
  function wholeSar(halalas) {
    var h = Number(halalas);
    if (!isFinite(h)) h = 0;
    return (h - (h % 100)) / 100;
  }

  return {
    FLAT_SEAL_FEE_HALALAS: FLAT_SEAL_FEE_HALALAS,
    SHARIAH_REVIEW_LABEL: SHARIAH_REVIEW_LABEL,
    LOAN_FREE_AR: LOAN_FREE_AR,
    SERVICE_NOT_LOAN_AR: SERVICE_NOT_LOAN_AR,
    PLANS: PLANS,
    planByKey: planByKey,
    feeForSeal: feeForSeal,
    subscriptionInvoice: subscriptionInvoice,
    sarStr: sarStr,
    wholeSar: wholeSar
  };
});
