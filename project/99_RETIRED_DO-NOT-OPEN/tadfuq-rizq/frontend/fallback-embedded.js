/* =============================================================================
 * fallback-embedded.js  —  Agent 3 (frontend)
 * OFFLINE demo data, file://-safe (NO fetch). Sets window.RIZQ_FALLBACK.
 *
 * ⚠️ STAND-IN, clearly labeled. This mirrors Agent 1's backend/fixtures.py
 * persona profiles + a TRANSPARENT stand-in scorer so the whole frontend runs
 * by double-click before integration. When Agent 2 ships data/fallback-recording.json
 * (captured from Agent 1's real POST /underwrite), bake it in here / load it and
 * set _standIn:false. The real path (OFFLINE=false) already hits the backend.
 *
 * Deterministic: seeded PRNG (no Math.random), fixed "now" = 2026-05 (matches A1).
 * Numerals rendered Western in the UI (Contract 4a).
 * ============================================================================= */
(function () {
  "use strict";

  // --- deterministic PRNG (mulberry32) ---
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const uni = (r, lo, hi) => lo + r() * (hi - lo);
  const rint = (r, lo, hi) => Math.floor(lo + r() * (hi - lo + 1));
  const round2 = (n) => Math.round(n * 100) / 100;

  // months anchored to 2026-05 going back n months (oldest first)
  function months(n) {
    const out = []; let y = 2026, m = 5;
    for (let i = 0; i < n; i++) { out.push(`${y}-${String(m).padStart(2, "0")}`); m--; if (m === 0) { m = 12; y--; } }
    return out.reverse();
  }
  const day = (r, mo) => `${mo}-${String(rint(r, 2, 27)).padStart(2, "0")}`;

  // ---------- persona bundle generators (ported/simplified from A1 fixtures.py) ----------
  function designer() {
    const r = rng(11), mos = months(18), clients = ["استوديو نون", "وكالة مدى", "شركة أفق"];
    const ob = [], zatca = [];
    mos.forEach((mo, mi) => {
      clients.forEach((c, ci) => {
        if (r() < 0.88) {
          const amt = round2(uni(r, 3500, 5200)), d = day(r, mo);
          ob.push({ date: d, amount_sar: amt, direction: "credit", category: "design_services", counterparty: c });
          if (r() < 0.80) zatca.push({ date: d, amount_sar: amt, buyer: c, status: r() < 0.9 ? "cleared" : "pending", uuid: `zd-${mi}-${ci}` });
        }
      });
      for (let k = 0; k < rint(r, 4, 6); k++)
        ob.push({ date: day(r, mo), amount_sar: round2(uni(r, 700, 1800)), direction: "debit", category: "living", counterparty: "نفقات" });
    });
    return { persona_id: "freelancer_designer", profile: { name_ar: "نورة — مصمّمة مستقلّة", segment: "freelancer", months_active: 18, has_simah_score: false }, ob_transactions: ob, zatca_invoices: zatca, pos_settlements: [] };
  }

  function merchant() {
    const r = rng(22), mos = months(24);
    const ob = [], zatca = [], pos = [];
    mos.forEach((mo, mi) => {
      const mn = +mo.slice(5, 7);
      const seasonal = (mn === 3 || mn === 4) ? 1.6 : (mn === 9 || mn === 12) ? 1.3 : 1.0;
      const base = uni(r, 16000, 26000) * seasonal, n = rint(r, 3, 5);
      for (let s = 0; s < n; s++) {
        const amt = round2(base / n * uni(r, 0.85, 1.15)), d = day(r, mo);
        pos.push({ date: d, amount_sar: amt, terminal: `POS-${rint(r, 1, 3)}` });
        ob.push({ date: d, amount_sar: amt, direction: "credit", category: "pos_settlement", counterparty: "مدى" });
        if (r() < 0.90) zatca.push({ date: d, amount_sar: amt, buyer: "عملاء التجزئة", status: r() < 0.92 ? "cleared" : "pending", uuid: `zm-${mi}-${s}` });
      }
      for (let k = 0; k < rint(r, 5, 8); k++)
        ob.push({ date: day(r, mo), amount_sar: round2(uni(r, 1500, 5000)), direction: "debit", category: "inventory", counterparty: "موردون" });
    });
    return { persona_id: "small_merchant", profile: { name_ar: "متجر الرفاع — تجارة تجزئة", segment: "small_merchant", months_active: 24, has_simah_score: false }, ob_transactions: ob, zatca_invoices: zatca, pos_settlements: pos };
  }

  function gigDriver() {
    const r = rng(33), mos = months(12);
    const ob = [], zatca = [];
    mos.forEach((mo, mi) => {
      const target = uni(r, 4000, 9000); let acc = 0, guard = 0;
      while (acc < target && guard < 40) {
        const amt = round2(uni(r, 35, 160));
        ob.push({ date: day(r, mo), amount_sar: amt, direction: "credit", category: "ride_payout", counterparty: "منصة توصيل" });
        acc += amt; guard++;
      }
      if (r() < 0.25) zatca.push({ date: day(r, mo), amount_sar: round2(acc * uni(r, 0.1, 0.3)), buyer: "منصة توصيل", status: "cleared", uuid: `zg-${mi}` });
      for (let k = 0; k < rint(r, 6, 10); k++)
        ob.push({ date: day(r, mo), amount_sar: round2(uni(r, 120, 480)), direction: "debit", category: "fuel", counterparty: "وقود" });
    });
    return { persona_id: "gig_driver", profile: { name_ar: "سعد — سائق توصيل", segment: "gig_driver", months_active: 12, has_simah_score: false }, ob_transactions: ob, zatca_invoices: zatca, pos_settlements: [] };
  }

  // ---------- TRANSPARENT stand-in scorer (mirrors Contract 2; replace w/ A1 recording) ----------
  const SEEDS = { freelancer_designer: 11, small_merchant: 22, gig_driver: 33 };
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  function byMonth(txns, dir) {
    const m = {};
    txns.filter(t => t.direction === dir).forEach(t => { const k = t.date.slice(0, 7); m[k] = (m[k] || 0) + t.amount_sar; });
    return Object.keys(m).sort().map(k => m[k]);
  }
  const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
  const stdev = a => { if (a.length < 2) return 0; const mu = mean(a); return Math.sqrt(mean(a.map(x => (x - mu) ** 2))); };

  function standInUnderwrite(b) {
    const rev = byMonth(b.ob_transactions, "credit");
    const exp = byMonth(b.ob_transactions, "debit");
    const mRev = mean(rev), mExp = mean(exp);
    const cv = mRev ? stdev(rev) / mRev : 1;
    const cashflow_stability = clamp(1 - cv, 0.05, 0.98);                                   // OB
    const income_regularity = rev.length ? rev.filter(x => x >= 0.5 * mRev).length / rev.length : 0; // OB
    const half = Math.floor(rev.length / 2) || 1;
    const trendRatio = mean(rev.slice(half)) / (mean(rev.slice(0, half)) || 1);
    const revenue_trend = clamp(0.5 + (trendRatio - 1) * 0.6, 0.1, 0.95);                   // mixed
    const cleared = b.zatca_invoices.filter(z => z.status === "cleared").reduce((s, z) => s + z.amount_sar, 0);
    const totalCredit = b.ob_transactions.filter(t => t.direction === "credit").reduce((s, t) => s + t.amount_sar, 0);
    const invoice_verified_ratio = clamp(totalCredit ? cleared / totalCredit : 0, 0, 1);    // ZATCA (the moat)
    const savingsRate = mRev ? clamp((mRev - mExp) / mRev, 0, 1) : 0;
    const buffer_months = clamp(savingsRate * 2, 0, 1);                                      // OB

    const sig = [
      { name: "cashflow_stability", value: cashflow_stability, label_ar: "استقرار التدفق النقدي", w: 0.28 },
      { name: "invoice_verified_ratio", value: invoice_verified_ratio, label_ar: "نسبة الفواتير المعتمدة (زاتكا)", w: 0.26 },
      { name: "income_regularity", value: income_regularity, label_ar: "انتظام الدخل", w: 0.18 },
      { name: "revenue_trend", value: revenue_trend, label_ar: "اتجاه نمو الإيراد", w: 0.16 },
      { name: "buffer_months", value: buffer_months, label_ar: "هامش الفائض الشهري", w: 0.12 },
    ];
    const blended = sig.reduce((s, x) => s + x.w * x.value, 0);
    const limit_sar = Math.round((mRev * 4.0 * blended) / 500) * 500;
    const weighted = sig.reduce((s, x) => s + x.w * x.value, 0) || 1;
    let allocated = 0;
    const signals = sig.map((x, i) => {
      let c = Math.round((limit_sar * (x.w * x.value) / weighted) / 100) * 100;
      if (i === sig.length - 1) c = limit_sar - allocated; allocated += c;
      return { name: x.name, value: round2(x.value), contribution_sar: c, label_ar: x.label_ar };
    });
    const top = [...signals].sort((a, c) => c.contribution_sar - a.contribution_sar).slice(0, 2);
    const confidence = round2(clamp(0.5 + 0.45 * blended, 0.5, 0.95));
    const fmt = n => n.toLocaleString("en-US");
    const explanation_ar =
      `بناءً على تحليل ${b.profile.months_active} شهرًا من تدفقاتك البنكية وفواتير زاتكا المعتمدة، ` +
      `نَعرض حدّ رأس مال عامل بصيغة التورّق قدره ${fmt(limit_sar)} ريال لمدة 6 أشهر. ` +
      `أبرز ما دعم القرار: ${top[0].label_ar} و${top[1].label_ar}. ` +
      `الحدّ متوافق مع الشريعة، بلا فائدة ربوية.`;
    return {
      limit_sar, structure: limit_sar > 0 ? "Tawarruq" : "none", tenor_months: 6,
      explanation_ar, confidence, signals,
      decision_id: `det-${SEEDS[b.persona_id]}-${b.persona_id}`,
      generated_in_ms: 300 + (b.ob_transactions.length % 200),
      _explainer_standin: true,
    };
  }

  // ---------- assemble fallback ----------
  const builders = { freelancer_designer: designer, small_merchant: merchant, gig_driver: gigDriver };
  const personas = [
    { persona_id: "freelancer_designer", name_ar: "نورة — مصمّمة مستقلّة", segment: "freelancer", teaser_ar: "دخل غير منتظم من 3 عملاء، 18 شهرًا، بلا سجل سِمَة" },
    { persona_id: "small_merchant", name_ar: "متجر الرفاع", segment: "small_merchant", teaser_ar: "مبيعات موسمية عبر نقاط البيع، فواتير زاتكا معتمدة، 24 شهرًا" },
    { persona_id: "gig_driver", name_ar: "سعد — سائق توصيل", segment: "gig_driver", teaser_ar: "دخل يومي متقلّب من منصات التوصيل، 12 شهرًا" },
  ];
  const bundles = {}, results = {};
  personas.forEach(p => { const b = builders[p.persona_id](); bundles[p.persona_id] = b; results[p.persona_id] = standInUnderwrite(b); });

  window.RIZQ_FALLBACK = {
    personas, bundles, results,
    _standIn: true,
    _note: "STAND-IN data + scorer (Agent 3). Replace `results` with data/fallback-recording.json (A2, from A1's /underwrite). Persona profiles mirror backend/fixtures.py.",
    standInUnderwrite, // exposed for transparency
  };
})();
