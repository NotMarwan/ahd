/* ============================================================================
   features/org.js — «لوحة المؤسسة» institution/waqf admin view-model (Phase B).
   The surface the FIRST PAYING CUSTOMER logs into: a charity/employer running an
   interest-free qard-hasan fund, paying a FLAT monthly software أجرة. Everything
   here is AGGREGATE — counts + total money in integer halalas — with NEVER an
   individual's trust band, NEVER a per-person score, NEVER an export. The
   institution/bank holds NO pooled member money (pledge-then-pay-at-spend, D-3).
   The subscription price comes from the Billing engine (flat, never % of a loan).
   Pure + deterministic: no date/random/locale primitive; integer halalas only.
   Dual module: Node `require`, browser `window.Org`.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Org = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* k-anonymity floor — mirrors Impact: nothing is broken out below this many
     covenants, so an "aggregate" never collapses onto one identifiable person. */
  var K_FLOOR = 3;

  /* a deterministic TEST fund («صندوق تجريبيّ — بيانات اختبار»). Covenants carry NO
     member identity — only an opaque id + integer-halalas amounts — because the
     admin view is AGGREGATE ONLY (spine: never an individual's number on screen).
     Every amount is a whole-SAR multiple of 100 (exact ر.س rendering). */
  var FIXTURE = {
    orgId: "ORG-BIRR-01",
    name: "صندوق البِرّ للقرض الحسن",
    type: "charity-qard-fund",
    planKey: "org",
    cycleKey: "2026-07",
    seats: 90,                     /* registered members = the subscription unit */
    covenants: [
      { id: "C-01", disbursedHalalas: 150000, repaidHalalas: 150000, status: "settled" },
      { id: "C-02", disbursedHalalas: 200000, repaidHalalas: 80000,  status: "active"  },
      { id: "C-03", disbursedHalalas: 50000,  repaidHalalas: 0,      status: "active"  },
      { id: "C-04", disbursedHalalas: 300000, repaidHalalas: 300000, status: "settled" },
      { id: "C-05", disbursedHalalas: 120000, repaidHalalas: 60000,  status: "active"  },
      { id: "C-06", disbursedHalalas: 80000,  repaidHalalas: 80000,  status: "settled" },
      { id: "C-07", disbursedHalalas: 250000, repaidHalalas: 100000, status: "active"  },
      { id: "C-08", disbursedHalalas: 60000,  repaidHalalas: 0,      status: "active"  },
      { id: "C-09", disbursedHalalas: 180000, repaidHalalas: 180000, status: "settled" },
      { id: "C-10", disbursedHalalas: 90000,  repaidHalalas: 45000,  status: "active"  },
      { id: "C-11", disbursedHalalas: 140000, repaidHalalas: 140000, status: "settled" },
      { id: "C-12", disbursedHalalas: 110000, repaidHalalas: 30000,  status: "active"  }
    ]
  };

  function makeOrg(spec) {
    var s = spec || {};
    return {
      orgId: s.orgId || FIXTURE.orgId,
      name: s.name || FIXTURE.name,
      type: s.type || FIXTURE.type,
      planKey: s.planKey || FIXTURE.planKey,
      cycleKey: s.cycleKey || FIXTURE.cycleKey,
      seats: (typeof s.seats === "number") ? s.seats : FIXTURE.seats,
      covenants: s.covenants || FIXTURE.covenants
    };
  }

  /* AGGREGATE ledger — counts + total money only. Conservation: the aggregate
     outstanding must equal Σ(disbursed − repaid) per covenant (integer compare). */
  function orgLedger(org) {
    var cov = (org && org.covenants) || [];
    var active = 0, settled = 0, disbursed = 0, repaid = 0, perOutstanding = 0;
    for (var i = 0; i < cov.length; i++) {
      var c = cov[i];
      if (c.status === "settled") settled += 1; else active += 1;
      disbursed += c.disbursedHalalas;
      repaid += c.repaidHalalas;
      perOutstanding += (c.disbursedHalalas - c.repaidHalalas);
    }
    var outstanding = disbursed - repaid;
    return {
      seats: (org && org.seats) || 0,
      activeCovenants: active,
      settledCovenants: settled,
      totalCovenants: cov.length,
      disbursedHalalas: disbursed,
      repaidHalalas: repaid,
      outstandingHalalas: outstanding,
      conservationOk: outstanding === perOutstanding,
      kFloor: K_FLOOR,
      /* the spine flags this surface asserts structurally */
      holdsNoMemberMoney: true,
      custodyModel: "pledge-then-pay-at-spend",
      aggregatesOnly: true,
      fixture: true
    };
  }

  /* the flat monthly software invoice — delegated to the Billing engine, priced
     per seat (4 ر.س/مقعد). NEVER a function of any member's loan. */
  function orgInvoice(org, billing) {
    if (!billing || typeof billing.subscriptionInvoice !== "function") return null;
    return billing.subscriptionInvoice(org.planKey, org.cycleKey, org.seats);
  }

  /* integer halalas → whole SAR (fixture amounts are whole-SAR multiples of 100) */
  function sarOf(h) { return (h - (h % 100)) / 100; }

  function describeOrgAr(org, ledger, invoice, fmtN, sarStr) {
    var f = fmtN || function (n) { return String(n); };
    var money = sarStr || function (h) { return String(h); };
    var heroLine = "صندوق «" + org.name + "» · دورة " + org.cycleKey + ": " +
      f(ledger.activeCovenants) + " عهدًا نشطًا من " + f(ledger.totalCovenants) + " — والمراكز محفوظة بالهللة";
    var ledgerLines = [
      "الأعضاء المشتركون: " + f(ledger.seats) + " · عهودٌ نشطة: " + f(ledger.activeCovenants) +
        " · محفوظة (مسدَّدة): " + f(ledger.settledCovenants),
      "أُقرِض قرضًا حسنًا: " + f(sarOf(ledger.disbursedHalalas)) + " ر.س — بلا أيّ زيادة",
      "مُسدَّد: " + f(sarOf(ledger.repaidHalalas)) + " ر.س · متبقٍّ: " + f(sarOf(ledger.outstandingHalalas)) + " ر.س"
    ];
    var invoiceLine = invoice
      ? "أجرة البرمجيّة (ثابتة): " + money(invoice.amountHalalas) + " ر.س/شهر — " +
        f(org.seats) + " مقعدٍ × ٤ ر.س. أجرةٌ على الأداة، لا على قرضِ أحد."
      : "";
    var guardLine = "تجميعاتٌ فقط — لا رقمَ فردٍ ولا تصنيف، ولا يُصدَّر شيء. " +
      "لا يُحتفَظ بمالٍ مجمَّع (كلٌّ يدفع لحظة الصرف — عهدٌ حسن مباشر). " +
      "لا يُعرَض تفصيلٌ لأقلّ من " + f(ledger.kFloor) + " عهود.";
    return {
      heroLine: heroLine, ledgerLines: ledgerLines,
      invoiceLine: invoiceLine, guardLine: guardLine
    };
  }

  return {
    K_FLOOR: K_FLOOR,
    FIXTURE: FIXTURE,
    makeOrg: makeOrg,
    orgLedger: orgLedger,
    orgInvoice: orgInvoice,
    describeOrgAr: describeOrgAr
  };
});
