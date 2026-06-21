/* buckets.js — Rizq secondary screen: auto-allocation of an incoming payment (Contract step "buckets")
   OWNER: Agent 4. UMD → global TR. Pure compute (Node-testable) + DOM render. Deterministic, offline.
   Splits each incoming payment into zakat / VAT(ZATCA) / smoothing-reserve / spendable. */
(function (root) {
  "use strict";

  var VAT_RATE = 0.15;                 // KSA standard VAT (since Jul 2020)
  var VAT_REG_THRESHOLD = 37500;       // SAR/yr voluntary registration threshold (mandatory at 375k)
  var ZAKAT_RATE = 0.025;              // 2.5% set-aside estimate (not a fatwa; forward provisioning)
  var DEFAULT_RESERVE_RATE = 0.20;     // smoothing reserve toward forecast lean months

  function fmt(n) { return Math.round(n).toLocaleString("en-US"); }

  /* ---- PURE: split an incoming (VAT-inclusive) payment ---- */
  function computeBuckets(payment, bundle, opts) {
    opts = opts || {};
    var invoices = (bundle && bundle.zatca_invoices || []).filter(function (i) { return i.status === "cleared"; });
    var total = invoices.reduce(function (a, i) { return a + i.amount_sar; }, 0);
    var months = {};
    invoices.forEach(function (i) { months[i.date.slice(0, 7)] = 1; });
    var nMonths = Math.max(1, Object.keys(months).length);
    var annualized = total / nMonths * 12;
    var vatRegistered = invoices.length > 0 && annualized >= VAT_REG_THRESHOLD;

    var vat = vatRegistered ? payment * VAT_RATE / (1 + VAT_RATE) : 0; // extract VAT from a gross amount
    var net = payment - vat;
    var zakat = net * ZAKAT_RATE;
    var reserveRate = opts.reserveRate != null ? opts.reserveRate : DEFAULT_RESERVE_RATE;
    var reserve = net * reserveRate;
    var spendable = payment - vat - zakat - reserve;

    return {
      payment: Math.round(payment),
      vat: Math.round(vat), zakat: Math.round(zakat),
      reserve: Math.round(reserve), spendable: Math.round(spendable),
      vatRegistered: vatRegistered, annualized: Math.round(annualized),
      rates: { vat: VAT_RATE, zakat: ZAKAT_RATE, reserve: reserveRate }
    };
  }

  /* ---- DOM: render the allocation card with a donut + rows ---- */
  function renderBuckets(el, ctx, opts) {
    ctx = ctx || {}; opts = opts || {};
    var bundle = ctx.bundle, payment = ctx.payment;
    var b = computeBuckets(payment, bundle, opts);

    var rows = [
      { key: "zakat",     label: "الزكاة (تقدير)",      val: b.zakat,     col: "var(--c-zakat)" },
      { key: "vat",       label: "ضريبة القيمة المضافة", val: b.vat,       col: "var(--c-vat)" },
      { key: "reserve",   label: "احتياطي التسوية",      val: b.reserve,   col: "var(--c-reserve)" },
      { key: "spendable", label: "متاح للصرف",           val: b.spendable, col: "var(--c-spend)" }
    ];
    var tot = b.payment || 1;

    // donut via stroke-dasharray
    var r = 64, C = 2 * Math.PI * r, cum = 0;
    var ring = rows.map(function (row) {
      var frac = row.val / tot;
      var seg = '<circle r="' + r + '" cx="90" cy="90" fill="none" stroke="' + row.col +
        '" stroke-width="26" stroke-dasharray="' + (frac * C).toFixed(2) + ' ' + (C - frac * C).toFixed(2) +
        '" stroke-dashoffset="' + (-cum * C).toFixed(2) + '" transform="rotate(-90 90 90)"></circle>';
      cum += frac; return seg;
    }).join("");
    var donut = '<svg viewBox="0 0 180 180" width="180" height="180" role="img" aria-label="توزيع الدفعة">' +
      '<circle r="' + r + '" cx="90" cy="90" fill="none" stroke="var(--c-line)" stroke-width="26"></circle>' +
      ring +
      '<text x="90" y="84" text-anchor="middle" font-size="13" fill="var(--c-ink-soft)">الدفعة</text>' +
      '<text x="90" y="106" text-anchor="middle" font-size="20" font-weight="700" fill="var(--c-ink)" class="tr-num">' + fmt(b.payment) + '</text>' +
      '</svg>';

    var rowHtml = rows.map(function (row) {
      var pct = Math.round(row.val / tot * 100);
      return '<div style="display:flex;align-items:center;gap:10px;margin:10px 0">' +
        '<span style="width:12px;height:12px;border-radius:3px;background:' + row.col + ';flex:none"></span>' +
        '<span style="flex:1">' + row.label + '</span>' +
        '<span class="tr-num" style="font-weight:700">' + fmt(row.val) + ' ر.س</span>' +
        '<span class="tr-num tr-sub" style="width:38px;text-align:left">' + pct + '%</span>' +
        '</div>';
    }).join("");

    var vatNote = b.vatRegistered
      ? '<p class="tr-sub">خاضع للضريبة (مبيعات سنوية ≈ <span class="tr-num">' + fmt(b.annualized) + '</span> ر.س) — حُجزت الضريبة تلقائيًا.</p>'
      : '<p class="tr-sub">غير مسجّل في ضريبة القيمة المضافة — لا حجز ضريبي.</p>';

    el.innerHTML =
      '<div class="tr-card">' +
        '<div class="tr-pill" style="background:var(--c-primary-tint);color:var(--c-primary);margin-bottom:8px">التوزيع التلقائي</div>' +
        '<h2 class="tr-h1">وصلت دفعة — وزّعناها قبل أن تختفي</h2>' +
        '<p class="tr-sub">كل دخل يُقسَّم تلقائيًا بموافقتك: الزكاة والضريبة محجوزتان، واحتياطي للشهر الضعيف — والباقي لك.</p>' +
        '<div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap;margin-top:18px">' +
          '<div style="flex:none">' + donut + '</div>' +
          '<div style="flex:1;min-width:240px">' + rowHtml + '</div>' +
        '</div>' +
        vatNote +
        (opts.onDone ? '<div style="margin-top:16px"><button class="tr-btn" id="bk-done">تم — اعرض خطتي الشهرية</button></div>' : "") +
      '</div>';

    if (opts.onDone) {
      var btn = el.querySelector("#bk-done");
      if (btn) btn.addEventListener("click", function () { opts.onDone(b); });
    }
    return b;
  }

  root.TR = root.TR || {};
  root.TR.computeBuckets = computeBuckets;
  root.TR.renderBuckets = renderBuckets;
})(typeof window !== "undefined" ? window : globalThis);
