/* connect-animation.js — Rizq step "connecting" (Contract 4c) — OWNER: Agent 3
   The OB+ZATCA "linking…" beat that earns the <15s reveal. UMD → global TR.
   render(el, {name_ar, months}, {onDone}). Deterministic timers (no Math.random). Offline, RTL. */
(function (root) {
  "use strict";

  function renderConnect(el, ctx, opts) {
    ctx = ctx || {}; opts = opts || {};
    var months = ctx.months || 18;
    var steps = [
      { t: "ربط الحساب البنكي عبر المصرفية المفتوحة", tag: "OB",    cls: "tr-badge--ob",    ms: 1100 },
      { t: "قراءة " + months + " شهرًا من المعاملات",  tag: "OB",    cls: "tr-badge--ob",    ms: 1300 },
      { t: "التحقق من فواتير زاتكا المعتمدة",          tag: "ZATCA", cls: "tr-badge--zatca", ms: 1300 },
      { t: "حساب إشارات الجدارة الائتمانية",           tag: "AI",    cls: "tr-badge--mix",   ms: 1100 }
    ];
    var totalMs = steps.reduce(function (s, x) { return s + x.ms; }, 0);

    el.innerHTML =
      '<div class="rz-wrap rz-connect">' +
        '<div class="tr-card">' +
          '<div class="rz-connect-name">' + (ctx.name_ar || "") + '</div>' +
          '<h2 class="tr-h1" style="margin-top:4px">جارٍ القراءة الآمنة لبياناتك…</h2>' +
          '<p class="tr-sub">بموافقتك ولمرة واحدة — تحت تنظيم المصرفية المفتوحة المرخّصة (مارس 2026).</p>' +
          '<div class="rz-steps">' +
            steps.map(function (s, i) {
              return '<div class="rz-step" id="rz-step-' + i + '">' +
                '<span class="rz-step-ic" id="rz-ic-' + i + '">○</span>' +
                '<span class="rz-step-t">' + s.t + '</span>' +
                '<span class="tr-badge ' + s.cls + '">' + s.tag + '</span>' +
              '</div>';
            }).join("") +
          '</div>' +
        '</div>' +
      '</div>';

    var acc = 0;
    steps.forEach(function (s, i) {
      // mark active
      setTimeout(function () {
        var ic = el.querySelector("#rz-ic-" + i); if (ic) { ic.textContent = "◐"; ic.parentElement.classList.add("rz-step--active"); }
      }, acc);
      acc += s.ms;
      // mark done
      setTimeout(function () {
        var ic = el.querySelector("#rz-ic-" + i);
        if (ic) { ic.textContent = "✓"; ic.classList.add("rz-step--done"); ic.parentElement.classList.remove("rz-step--active"); ic.parentElement.classList.add("rz-step--ok"); }
      }, acc - 120);
    });

    setTimeout(function () { if (opts.onDone) opts.onDone({ connectMs: totalMs }); }, totalMs + 250);
    return totalMs;
  }

  root.TR = root.TR || {};
  root.TR.renderConnect = renderConnect;
})(typeof window !== "undefined" ? window : globalThis);
