/* _personas.stub.js — TEMP deterministic data stand-in (OWNER of real data: Agent 2 / data/generate.py).
   Exists only so Agent 4's forecast/buckets run in isolation before A2's fallback-recording.json lands.
   Emits Contract-1 AccountBundles. Seeded → identical every run (no Math.random in the demo path).
   REPLACE with data/out/*.json + data/fallback-recording.json when A2 publishes. UMD → global TR. */
(function (root) {
  "use strict";

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // 12 months: 2025-07 .. 2026-06 (fixed anchor — deterministic, no clock)
  function monthDate(i, day) {
    var mi = (6 + i) % 12, yr = 2025 + Math.floor((6 + i) / 12);
    return yr + "-" + String(mi + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
  }
  function monthNum(i) { return ((6 + i) % 12) + 1; }
  function r2(n) { return Math.round(n / 10) * 10; }

  var P = {
    freelancer_designer: {
      name_ar: "نورة العتيبي", segment: "مصمّمة جرافيك مستقلة", months_active: 22,
      base: 11000, variance: 0.10, invoiceRatio: 0.95, nCredits: 3, seed: 4011,
      buyers: ["وكالة نون للإعلان", "شركة مدى الرقمية", "متجر رفوف", "استوديو لمسة"],
      teaser_ar: "دخل ثابت نسبيًا مع ضعف صيفي", pos: 0,
      seasonal: function (m) { return (m === 7 || m === 8) ? 0.60 : (m === 12 ? 1.12 : 1.0); }
    },
    gig_driver: {
      name_ar: "سعد القحطاني", segment: "سائق توصيل (تطبيقات)", months_active: 14,
      base: 6000, variance: 0.38, invoiceRatio: 0.12, nCredits: 8, seed: 7720,
      buyers: ["منصة التوصيل"], teaser_ar: "دخل متقلّب جدًا، تسويات أسبوعية", pos: 0.85,
      seasonal: function (m) { return (m === 2 || m === 3) ? 1.22 : 1.0; }
    },
    small_merchant: {
      name_ar: "مؤسسة دانة التجارية", segment: "متجر تجزئة صغير", months_active: 30,
      base: 24000, variance: 0.18, invoiceRatio: 0.90, nCredits: 6, seed: 9302,
      buyers: ["عملاء التجزئة", "شركة الإمداد", "متجر إلكتروني"], teaser_ar: "موسمي — ذروة رمضان", pos: 0.7,
      seasonal: function (m) { return (m === 2 || m === 3) ? 1.55 : (m === 12 ? 1.15 : ((m === 7 || m === 8) ? 0.85 : 1.0)); }
    }
  };

  function makeBundle(persona_id) {
    var p = P[persona_id]; if (!p) throw new Error("unknown persona " + persona_id);
    var rnd = mulberry32(p.seed);
    var ob = [], inv = [], pos = [];
    for (var i = 0; i < 12; i++) {
      var m = monthNum(i);
      var target = p.base * p.seasonal(m) * (1 + (rnd() * 2 - 1) * p.variance);
      target = Math.max(500, target);
      // income credits
      var k = p.nCredits, left = target;
      for (var c = 0; c < k; c++) {
        var amt = c === k - 1 ? left : r2(target / k * (0.6 + rnd() * 0.8));
        amt = Math.min(amt, left); left -= amt; if (amt <= 0) continue;
        ob.push({ date: monthDate(i, 4 + c * 3), amount_sar: r2(amt), direction: "credit",
                  category: "client_payment", counterparty: p.buyers[c % p.buyers.length] });
      }
      // a couple of expenses (debits) for realism
      ob.push({ date: monthDate(i, 2), amount_sar: r2(target * (0.12 + rnd() * 0.06)), direction: "debit",
                category: "expense", counterparty: "إيجار/مصاريف" });
      // ZATCA invoices (verified sales) — mostly match income
      var invTotal = target * p.invoiceRatio, bk = Math.max(1, Math.round(k * 0.7)), li = invTotal;
      for (var j = 0; j < bk; j++) {
        var iamt = j === bk - 1 ? li : r2(invTotal / bk * (0.7 + rnd() * 0.6));
        iamt = Math.min(iamt, li); li -= iamt; if (iamt <= 0) continue;
        inv.push({ date: monthDate(i, 6 + j * 4), amount_sar: r2(iamt), buyer: p.buyers[j % p.buyers.length],
                   status: rnd() > 0.12 ? "cleared" : "pending", uuid: "z-" + persona_id + "-" + i + "-" + j });
      }
      // POS settlements
      if (p.pos > 0) {
        var posTotal = target * p.pos;
        for (var w = 0; w < 4; w++) pos.push({ date: monthDate(i, 3 + w * 7), amount_sar: r2(posTotal / 4), terminal: "POS-" + persona_id });
      }
    }
    return {
      persona_id: persona_id,
      profile: { name_ar: p.name_ar, segment: p.segment, months_active: p.months_active, has_simah_score: false },
      ob_transactions: ob, zatca_invoices: inv, pos_settlements: pos
    };
  }

  function listPersonas() {
    return Object.keys(P).map(function (id) {
      return { persona_id: id, name_ar: P[id].name_ar, segment: P[id].segment, teaser_ar: P[id].teaser_ar };
    });
  }
  // representative incoming payment for the buckets screen = median of the last 6 income credits
  function latestPayment(bundle) {
    var cr = (bundle.ob_transactions || [])
      .filter(function (t) { return t.direction === "credit" && t.category !== "transfer"; })
      .map(function (t) { return t.amount_sar; });
    if (!cr.length) return 0;
    var last = cr.slice(-6).sort(function (a, b) { return a - b; });
    return last[Math.floor(last.length / 2)]; // median → avoids tiny/huge outliers
  }

  root.TR = root.TR || {};
  root.TR.makeBundle = makeBundle;
  root.TR.listPersonas = listPersonas;
  root.TR.latestPayment = latestPayment;
})(typeof window !== "undefined" ? window : globalThis);
