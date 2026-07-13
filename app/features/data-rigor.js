/* Source-bounded, checked-in Saudi context. Integer-only; no runtime fetch. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.DataRigor = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var FINDEX_SERIES = Object.freeze([
    Object.freeze({ year: 2014, familyFriendsPermille: 373, source: "World Bank Global Findex fin22b", grade: "primary" }),
    Object.freeze({ year: 2017, familyFriendsPermille: 335, source: "World Bank Global Findex fin22b", grade: "primary" }),
    Object.freeze({ year: 2021, familyFriendsPermille: 358, source: "World Bank Global Findex fin22b", grade: "primary" }),
    Object.freeze({ year: 2024, familyFriendsPermille: 304, source: "World Bank Global Findex fin22b", grade: "primary" })
  ]);
  var EMERGENCY_SERIES = Object.freeze([
    Object.freeze({ year: 2021, familyFriendsPermille: 333, source: "World Bank Global Findex fin24fam", grade: "primary" }),
    Object.freeze({ year: 2024, familyFriendsPermille: 380, source: "World Bank Global Findex fin24fam", grade: "primary" })
  ]);
  var NAFITH_SERIES = Object.freeze([
    Object.freeze({ year: 2020, countFloor: 160000, source: "Nafith reported count", grade: "secondary" }),
    Object.freeze({ year: 2021, countFloor: 526000, source: "Nafith reported count", grade: "secondary" }),
    Object.freeze({ year: 2024, countFloor: 5500000, source: "Nafith reported count", grade: "secondary" })
  ]);
  var GASTAT_CONTEXT = Object.freeze({
    year: 2023,
    sampleHouseholds: 122325,
    transferOutPermille: 994,
    notLoanDistribution: true,
    source: "GASTAT Household Income and Consumption Expenditure Survey 2023, tables 8-2 and 8-4",
    grade: "primary",
    householdBands: Object.freeze([
      Object.freeze({ householdSize: "1–2", incomeSar: 6013, expenditureSar: 5092 }),
      Object.freeze({ householdSize: "3–4", incomeSar: 11471, expenditureSar: 9090 }),
      Object.freeze({ householdSize: "5+", incomeSar: 19038, expenditureSar: 14843 })
    ])
  });

  function findexByYear(year) {
    for (var i = 0; i < FINDEX_SERIES.length; i++) if (FINDEX_SERIES[i].year === year) return FINDEX_SERIES[i];
    return null;
  }
  function nafithGrowthFloor() {
    return Math.floor(NAFITH_SERIES[NAFITH_SERIES.length - 1].countFloor / NAFITH_SERIES[0].countFloor);
  }
  function describeAr(fmtN) {
    var f = fmtN || function (n) { return String(n); };
    return {
      findexLine: "الاقتراض من الأهل أو الأصدقاء: من " + f(373) + " إلى " + f(304) + " من كل ألف بين ٢٠١٤ و٢٠٢٤؛ القياس Findex أوليّ.",
      emergencyLine: "مصدر الطوارئ من الأهل أو الأصدقاء: من " + f(333) + " إلى " + f(380) + " من كل ألف بين ٢٠٢١ و٢٠٢٤.",
      gastatLine: "سياق GASTAT ٢٠٢٣: عينة " + f(GASTAT_CONTEXT.sampleHouseholds) + " أسرة؛ دخل وإنفاق شهري حسب حجم الأسرة.",
      gastatCaveat: "هذا سياق GASTAT ليس توزيعًا لقروض الأفراد؛ لا يُستخدم لتقييم أي فرد.",
      nafithLine: "نافذ: من أكثر من " + f(NAFITH_SERIES[0].countFloor) + " إلى أكثر من " + f(NAFITH_SERIES[2].countFloor) + " سند؛ حدّ نمو " + f(nafithGrowthFloor()) + "×، مصدر ثانوي وعدد فقط."
    };
  }

  return {
    FINDEX_SERIES: FINDEX_SERIES,
    EMERGENCY_SERIES: EMERGENCY_SERIES,
    NAFITH_SERIES: NAFITH_SERIES,
    GASTAT_CONTEXT: GASTAT_CONTEXT,
    findexByYear: findexByYear,
    nafithGrowthFloor: nafithGrowthFloor,
    describeAr: describeAr
  };
});
