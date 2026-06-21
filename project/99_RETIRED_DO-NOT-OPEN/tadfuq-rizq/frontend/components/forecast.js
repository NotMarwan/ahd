/* forecast.js — Rizq secondary screen: lean-month projection (Contract step "forecast")
   OWNER: Agent 4. UMD → global TR. Pure compute (Node-testable) + DOM render (browser).
   Consumes AccountBundle (Contract 1). No imports/network → file:// + offline safe. Deterministic.
   Model: build a seasonal profile from history, project the next 6 months, surface the next LEAN month
   (the freelancer's real risk) and the shortfall a Tadfuq buffer would cover. */
(function (root) {
  "use strict";

  var AR_MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو",
                   "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  function fmt(n) { return Math.round(n).toLocaleString("en-US"); }
  function mean(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : 0; }
  function median(a) {
    if (!a.length) return 0;
    var s = a.slice().sort(function (x, y) { return x - y; });
    var m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  }

  /* ---- PURE ---- */
  function computeForecast(bundle) {
    var byMonth = {};
    (bundle.ob_transactions || []).forEach(function (t) {
      if (t.direction !== "credit" || t.category === "transfer") return;
      var key = t.date.slice(0, 7);
      byMonth[key] = (byMonth[key] || 0) + t.amount_sar;
    });
    var keys = Object.keys(byMonth).sort();
    var allIncomes = keys.map(function (k) { return byMonth[k]; });
    var overallMean = mean(allIncomes);
    var last12keys = keys.slice(-12);
    var baseline = median(last12keys.map(function (k) { return byMonth[k]; }));

    // seasonal profile: factor per calendar month = avg(that month) / overallMean
    var perMM = {};
    keys.forEach(function (k) {
      var mm = parseInt(k.slice(5, 7), 10);
      (perMM[mm] = perMM[mm] || []).push(byMonth[k]);
    });
    var seasonal = {};
    for (var mm = 1; mm <= 12; mm++) seasonal[mm] = (perMM[mm] && overallMean) ? mean(perMM[mm]) / overallMean : 1;

    var months = last12keys.map(function (k) {
      var m = parseInt(k.slice(5, 7), 10);
      return { month: k, label: AR_MONTHS[m - 1], income: Math.round(byMonth[k]), lean: byMonth[k] < baseline * 0.8, kind: "hist" };
    });

    // project the next 6 months
    var lastK = keys[keys.length - 1] || "2026-05";
    var ly = parseInt(lastK.slice(0, 4), 10), lm = parseInt(lastK.slice(5, 7), 10);
    var projection = [], leanAhead = null;
    for (var i = 1; i <= 6; i++) {
      var mm2 = ((lm - 1 + i) % 12) + 1;
      var projected = Math.round(overallMean * seasonal[mm2]);
      var isLean = projected < baseline * 0.85;
      var p = { label: AR_MONTHS[mm2 - 1], mm: mm2, projected: projected, lean: isLean, kind: "proj", monthsAway: i };
      projection.push(p);
      if (isLean && !leanAhead) leanAhead = p;
    }
    var nextLean = leanAhead || projection.reduce(function (a, b) { return b.projected < a.projected ? b : a; }, projection[0]);
    var shortfall = Math.max(0, Math.round(baseline - nextLean.projected));

    return {
      months: months, baseline: Math.round(baseline), mean: Math.round(overallMean),
      projection: projection, leanAhead: leanAhead, nextLean: nextLean,
      nextLabel: nextLean.label, expectedNext: nextLean.projected,
      monthsAway: nextLean.monthsAway, shortfall: shortfall,
      leanCount: months.filter(function (m) { return m.lean; }).length
    };
  }

  /* ---- DOM ---- */
  function renderForecast(el, bundle, opts) {
    opts = opts || {};
    var f = computeForecast(bundle);
    // chart = last 8 history + next 4 projection
    var hist = f.months.slice(-8);
    var proj = f.projection.slice(0, 4);
    var series = hist.map(function (m) { return { label: m.label, v: m.income, lean: m.lean, proj: false }; })
      .concat(proj.map(function (p) { return { label: p.label, v: p.projected, lean: p.lean, proj: true }; }));

    var W = 660, H = 240, padX = 14, padTop = 22, padBot = 36;
    var max = Math.max.apply(null, series.map(function (s) { return s.v; }).concat([f.baseline])) * 1.14;
    var gap = (W - padX * 2) / series.length, bw = gap * 0.6;
    var y = function (v) { return padTop + (H - padTop - padBot) * (1 - v / max); };

    var bars = series.map(function (s, i) {
      var x = padX + gap * i + (gap - bw) / 2;
      var fill = s.proj ? "var(--c-accent)" : (s.lean ? "var(--c-danger)" : "var(--c-primary)");
      var extra = s.proj ? ' opacity="0.9" stroke="var(--c-ink)" stroke-dasharray="3 3"' : (s.lean ? ' ' : '');
      var lbl = (s.proj && s.lean) ? '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y(s.v) - 6).toFixed(1) + '" text-anchor="middle" font-size="10" font-weight="700" fill="var(--c-danger)">▼</text>' : '';
      return '<rect x="' + x.toFixed(1) + '" y="' + y(s.v).toFixed(1) + '" width="' + bw.toFixed(1) +
        '" height="' + (H - padBot - y(s.v)).toFixed(1) + '" rx="4" fill="' + fill + '"' + extra + '/>' + lbl +
        '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - padBot + 16) + '" text-anchor="middle" font-size="10" fill="' +
        (s.proj ? "var(--c-ink)" : "var(--c-ink-soft)") + '"' + (s.proj ? ' font-weight="700"' : '') + '>' + s.label + '</text>';
    }).join("");

    var by = y(f.baseline);
    var baseLine = '<line x1="' + padX + '" y1="' + by.toFixed(1) + '" x2="' + (W - padX) + '" y2="' + by.toFixed(1) +
      '" stroke="var(--c-primary-dark)" stroke-width="1.5" stroke-dasharray="6 5"/>' +
      '<text x="' + (W - padX) + '" y="' + (by - 6).toFixed(1) + '" text-anchor="end" font-size="11" fill="var(--c-primary-dark)">الشهر المعتاد · <tspan class="tr-num">' + fmt(f.baseline) + '</tspan> ر.س</text>';

    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="توقّع الدخل">' + baseLine + bars + '</svg>';

    var hasGap = f.shortfall > 0 && f.leanAhead;
    var alert = hasGap
      ? '<span class="tr-badge tr-badge--mix" style="background:#FBE8DE;color:var(--c-danger)">⚠︎ شهر ضعيف قادم</span>' +
        '<p class="tr-sub" style="margin-top:10px">أقرب شهر ضعيف هو <b>' + f.nextLabel + '</b> (بعد ' + f.monthsAway + ' أشهر): دخل متوقّع ≈ <span class="tr-num">' + fmt(f.expectedNext) +
        '</span> ر.س — أي <b style="color:var(--c-danger)">عجز <span class="tr-num">' + fmt(f.shortfall) + '</span> ر.س</b> عن شهرك المعتاد.</p>' +
        '<p class="tr-sub">سيُموّل <b>تدفّق</b> هذا العجز بحدّ رأس مال عامل (تورّق) — والحدّ المعتمد يغطّيه بالكامل.</p>'
      : '<span class="tr-badge tr-badge--mix" style="background:var(--c-primary-tint);color:var(--c-primary)">✓ الأشهر القادمة ضمن المعتاد</span>' +
        '<p class="tr-sub" style="margin-top:10px">أضعف شهر متوقّع: <b>' + f.nextLabel + '</b> ≈ <span class="tr-num">' + fmt(f.expectedNext) + '</span> ر.س — ضمن نطاقك المعتاد. يبقى احتياطي التسوية جاهزًا.</p>';

    el.innerHTML =
      '<div class="tr-card">' +
        '<span class="tr-badge tr-badge--ob">رادار الدخل · OB</span>' +
        '<h2 class="tr-h1" style="margin-top:10px">دخلك متقلّب — لكنه ليس مفاجئًا</h2>' +
        '<p class="tr-sub">حلّلنا تدفّقك النقدي عبر المصرفية المفتوحة. أحمر = شهر ضعيف سابق · ذهبي متقطّع = توقّع قادم · ▼ = أقرب شهر ضعيف.</p>' +
        '<div style="margin:18px 0">' + svg + '</div>' + alert +
        (opts.onContinue ? '<div style="margin-top:18px"><button class="tr-btn" id="fc-next">' + (hasGap ? 'احسب حدّ التمويل المقترح ←' : 'تابع ←') + '</button></div>' : "") +
      '</div>';

    if (opts.onContinue) {
      var b = el.querySelector("#fc-next");
      if (b) b.addEventListener("click", function () { opts.onContinue(f); });
    }
    return f;
  }

  root.TR = root.TR || {};
  root.TR.computeForecast = computeForecast;
  root.TR.renderForecast = renderForecast;
})(typeof window !== "undefined" ? window : globalThis);
