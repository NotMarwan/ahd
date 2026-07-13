/* ============================================================================
   features/market-model.js — bottom-up TAM/SAM/SOM market-sizing BAND (Front D,
   data-rigor lever D-L2, docs/superpowers/plans/2026-07-13-ceiling-break-8-9-
   plan.md §2.2 / Appendix B). Retires the old order-of-magnitude "M-8" hand-wave
   with a deterministic, fully-sourced model: adults(15+) x borrowing prevalence
   (the Findex-OBSERVED range, never an invented one) x average loan size -> TAM;
   x banked-share -> SAM; x a stated founder-judgment capture rate -> SOM.

   Every input below is a hardcoded, cited constant (never fetched at runtime) —
   see features/sources.js entries "gastat-population", "findex-decade" and
   "loan-size-proxy" for the same figures shown to a judge on screen (no drift
   between this model and the sources panel).

   INPUTS (verbatim from the ceiling-break plan's Appendix B):
     - POPULATION = 32,175,224 — GASTAT 2022 Census, total population 🟢
     - ADULT_SHARE_PERMILLE = 766 (~76.6% aged 15+, Findex's own surveyed age
       band) 🟡 -> ADULTS_15_PLUS ≈ 24.6M (computed, floor — see below)
     - PREVALENCE_PERMILLE — Findex "borrowed from family/friends, past 12
       months", the OBSERVED RANGE across two real survey waves (not an
       invented spread): LOW = 304 (30.4%, 2024 wave) · HIGH = 358 (35.8%,
       2021 wave) · BASE = the exact midpoint (331 = (304+358)/2) 🟢
     - AVG_LOAN_SAR — the ONE input with NO direct KSA/GCC publication
       (OT-LOANSIZE, a real field-wide gap, not a shortcut this project took):
       PROXY-ANCHORED to PER-EVENT proxies only (never a diluted household-flow
       average):
         LOW  1,000  — Hakbah جمعية minimum monthly "hand" contribution range 🟡
         BASE 5,000  — Hakbah self-reported average-user "hand" size 🟡
         HIGH 18,000 — Saudi Social Development Bank official qard-hasan
                       financing floor (marriage/Kanaf products) 🟢
       CRITICAL framing (stated, not hidden): household-flow proxies (GASTAT
       HIES "transfers paid" ≈ SAR 841/household/month) are averaged across ALL
       households/months — most lend nothing that month — so they DILUTE
       per-event size. This model never uses them as a primary estimate.
     - BANKED_PERMILLE = 788 (78.8% account ownership, Findex 2024 — the SAME
       wave as the LOW prevalence figure, so SAM ties to the freshest data) 🟢
     - CAPTURE_BP — founder-judgment capture rate of SAM, in basis points, NOT
       a measured input: LOW 50bp (0.5%) · BASE 150bp (1.5%) · HIGH 400bp (4%) ⚪

   STATED ASSUMPTIONS (own the caveats; the model foregrounds its own weakest
   input rather than hiding it):
     1. Findex prevalence is already "past 12 months", so no frequency
        multiplier is stacked on top (conservative, not inflated).
     2. Banked x informal-borrowing independence is FLAGGED, not resolved —
        this model does not attempt to model that correlation.
     3. The capture rate is a founder judgment call, not data — SOM is the
        softest number here and is labelled accordingly on screen.
     4. No parallel household-based model is built alongside this person-based
        one — mixing the two units would manufacture false precision.
     5. A precise MEASURED average loan size still requires the primary demand
        survey (Q4, OT-A1/D-L5) — this band's low input stays ⚪ until then.

   Determinism: pure integer arithmetic in whole SAR (an aggregate market
   statistic, never an individual transaction — the "no float MONEY" spine
   rule is about ledger logic; this module still uses Math.floor division only
   and persists no float anywhere, matching the rest of the app's discipline).
   LOW <= BASE <= HIGH holds by construction (monotonic inputs, monotonic
   formula). No date / randomness / locale / network primitive anywhere.
   Node-testable; browser -> window.MarketModel.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.MarketModel = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var POPULATION = 32175224;                 // GASTAT 2022 Census 🟢
  var ADULT_SHARE_PERMILLE = 766;             // ~76.6% aged 15+ 🟡
  var ADULTS_15_PLUS = Math.floor(POPULATION * ADULT_SHARE_PERMILLE / 1000); // ≈24.6M

  /* Findex family/friend borrowing, per-mille of adults — the ACTUAL observed
     range across two real survey waves (2021 HIGH, 2024 LOW); BASE is their
     exact midpoint, not a separately-sourced figure. */
  var PREVALENCE_PERMILLE = Object.freeze({ LOW: 304, BASE: 331, HIGH: 358 });

  /* proxy-anchored average loan size, SAR — see header for the per-event vs
     household-flow framing caveat */
  var AVG_LOAN_SAR = Object.freeze({ LOW: 1000, BASE: 5000, HIGH: 18000 });

  var BANKED_PERMILLE = 788;                  // Findex 2024 account ownership 🟢

  /* founder-judgment capture rate of SAM, in basis points (NOT data) */
  var CAPTURE_BP = Object.freeze({ LOW: 50, BASE: 150, HIGH: 400 });
  var BP_BASE = 10000;

  var LABEL = "نموذجٌ حتميٌّ من أسفل إلى أعلى — نطاقٌ توضيحيّ، لا رقمٌ مُقاس";

  function borrowers(prevalencePermille) {
    return Math.floor(ADULTS_15_PLUS * prevalencePermille / 1000);
  }

  function tam(prevalencePermille, avgLoanSAR) {
    return borrowers(prevalencePermille) * avgLoanSAR;
  }

  function sam(tamSAR) {
    return Math.floor(tamSAR * BANKED_PERMILLE / 1000);
  }

  function som(samSAR, captureBp) {
    return Math.floor(samSAR * captureBp / BP_BASE);
  }

  var TENTH_BN = 100000000;                   // one-tenth of a billion SAR
  function tenthsBn(n) { return Math.floor(n / TENTH_BN); }
  var MILLION = 1000000;
  function millions(n) { return Math.floor(n / MILLION); }

  /* the full band: every stage (borrowers -> TAM -> SAM -> SOM) computed for
     LOW/BASE/HIGH from the integer constants above — nothing hardcoded twice. */
  function band() {
    var borrowersLow = borrowers(PREVALENCE_PERMILLE.LOW);
    var borrowersBase = borrowers(PREVALENCE_PERMILLE.BASE);
    var borrowersHigh = borrowers(PREVALENCE_PERMILLE.HIGH);

    var tamLow = tam(PREVALENCE_PERMILLE.LOW, AVG_LOAN_SAR.LOW);
    var tamBase = tam(PREVALENCE_PERMILLE.BASE, AVG_LOAN_SAR.BASE);
    var tamHigh = tam(PREVALENCE_PERMILLE.HIGH, AVG_LOAN_SAR.HIGH);

    var samLow = sam(tamLow);
    var samBase = sam(tamBase);
    var samHigh = sam(tamHigh);

    var somLow = som(samLow, CAPTURE_BP.LOW);
    var somBase = som(samBase, CAPTURE_BP.BASE);
    var somHigh = som(samHigh, CAPTURE_BP.HIGH);

    return {
      adults15Plus: ADULTS_15_PLUS,
      borrowers: { low: borrowersLow, base: borrowersBase, high: borrowersHigh },
      tam: { low: tamLow, base: tamBase, high: tamHigh },
      sam: { low: samLow, base: samBase, high: samHigh },
      som: { low: somLow, base: somBase, high: somHigh },
      tamBnTenths: { low: tenthsBn(tamLow), base: tenthsBn(tamBase), high: tenthsBn(tamHigh) },
      samBnTenths: { low: tenthsBn(samLow), base: tenthsBn(samBase), high: tenthsBn(samHigh) },
      somMillions: { low: millions(somLow), base: millions(somBase), high: millions(somHigh) },
      somBnTenths: { low: tenthsBn(somLow), base: tenthsBn(somBase), high: tenthsBn(somHigh) },
      label: LABEL,
      illustrative: true
    };
  }

  /* integer tenths -> «X٫Y» string (Arabic decimal separator, string math only —
     mirrors features/impact.js's tenthsAr convention) */
  function bnAr(tenths) { return String(Math.floor(tenths / 10)) + "٫" + String(tenths % 10); }

  function describeMarketAr(b, fmtN) {
    var f = fmtN || function (n) { return String(n); };
    var headline = "حجم السوق التوضيحيّ من أسفل إلى أعلى: بالغون ١٥+ (نحو " + f(Math.floor(b.adults15Plus / MILLION)) +
      " مليون) × انتشار الاقتراض من العائلة/الأصدقاء (نطاق Findex الفعليّ، لا نطاقٌ مُختلَق) × متوسّط حجم القرض (مُرساةٌ بوكلاء، لا مقيسة).";
    var tamLine = "الحجم الكلّيّ للسوق (TAM سنويًّا): من نحو " + bnAr(b.tamBnTenths.low) + " مليار ريال إلى نحو " +
      bnAr(b.tamBnTenths.high) + " مليار ريال (الوسيط نحو " + bnAr(b.tamBnTenths.base) + " مليار).";
    var samLine = "بعد استبعاد غير المتعاملين مصرفيًّا (السوق القابل للخدمة، SAM): من نحو " +
      bnAr(b.samBnTenths.low) + " إلى نحو " + bnAr(b.samBnTenths.high) + " مليار ريال.";
    var somLine = "بمعدّل استحواذٍ تقديريّ (⚪ تقدير مؤسِّسين لا بيانات) — السوق القابل للالتقاط (SOM): من نحو " +
      f(b.somMillions.low) + " مليون ريال إلى نحو " + bnAr(b.somBnTenths.high) + " مليار ريال.";
    var caveatLine = "متوسّط حجم القرض الواحد — المُدخَل الوحيد بلا مصدرٍ مباشر في أيّ نشرةٍ سعوديّةٍ أو خليجيّة — مُرساةٌ بوكلاء لكلّ حالةٍ فرديّة" +
      " (جمعيّة هكباه، وأرضيّة القرض الحسن الرسميّة لبنك التنمية الاجتماعيّة)، لا بمتوسّطاتِ تدفّقٍ أسريّ (تُخفِّف الرقم لو استُخدمت أساسًا)." +
      " الوسيط المقيس الحقيقيّ ينتظر مسحًا ميدانيًّا (OT-A1/D-L5).";
    return { headline: headline, tamLine: tamLine, samLine: samLine, somLine: somLine, caveatLine: caveatLine, label: b.label };
  }

  return {
    POPULATION: POPULATION,
    ADULT_SHARE_PERMILLE: ADULT_SHARE_PERMILLE,
    ADULTS_15_PLUS: ADULTS_15_PLUS,
    PREVALENCE_PERMILLE: PREVALENCE_PERMILLE,
    AVG_LOAN_SAR: AVG_LOAN_SAR,
    BANKED_PERMILLE: BANKED_PERMILLE,
    CAPTURE_BP: CAPTURE_BP,
    LABEL: LABEL,
    borrowers: borrowers,
    tam: tam,
    sam: sam,
    som: som,
    band: band,
    describeMarketAr: describeMarketAr
  };
});
