/* limit-reveal.js — Rizq step "reveal" (Contract 4c) — THE HERO MOMENT — OWNER: Agent 3
   UMD → global TR. render(el, {bundle, result, elapsedMs}, {onWhy}). The ONLY place --c-accent is used.
   Count-up is requestAnimationFrame, fixed duration → deterministic end state. Western numerals. RTL, offline. */
(function (root) {
  "use strict";
  var fmt = function (n) { return Math.round(n).toLocaleString("en-US"); };

  function renderLimitReveal(el, ctx, opts) {
    ctx = ctx || {}; opts = opts || {};
    var r = ctx.result, b = ctx.bundle;
    var secs = ((ctx.elapsedMs || (r.generated_in_ms + 4800)) / 1000);
    var secsTxt = (Math.round(secs * 10) / 10).toFixed(1);
    var conf = Math.round((r.confidence || 0) * 100);

    el.innerHTML =
      '<div class="rz-wrap rz-reveal">' +
        '<div class="rz-elapsed">⚡ أُنجز خلال <span class="tr-num">' + secsTxt + '</span> ثانية — أقل من 15</div>' +
        '<div class="rz-reveal-card">' +
          '<div class="rz-reveal-sub">' + (b.profile.name_ar) + ' — حدّ تمويل رأس مال عامل</div>' +
          '<div class="rz-limit"><span class="rz-limit-num tr-num" id="rz-limit-num">0</span> <span class="rz-limit-cur">ر.س</span></div>' +
          '<div class="rz-reveal-meta">' +
            '<span class="tr-shariah">☾ تورّق · متوافق مع الشريعة · بلا ربا</span>' +
            '<span class="tr-pill" style="background:var(--c-primary-tint);color:var(--c-primary)">لمدة ' + r.tenor_months + ' أشهر</span>' +
          '</div>' +
          '<div class="rz-sources">' +
            '<span class="rz-src-label">مدعوم ببيانات:</span>' +
            '<span class="tr-badge tr-badge--ob">المصرفية المفتوحة</span><span class="rz-plus">+</span>' +
            '<span class="tr-badge tr-badge--zatca">زاتكا</span>' +
            '<span class="rz-src-note">— أول مرة يجتمع المصدران في السعودية</span>' +
          '</div>' +
          '<div class="rz-conf">درجة الثقة: <b class="tr-num">' + conf + '%</b></div>' +
        '</div>' +
        '<button class="tr-btn block" id="rz-why">لماذا هذا المبلغ بالضبط؟ ←</button>' +
      '</div>';

    // count-up (deterministic: fixed 950ms, lands exactly on limit_sar)
    var target = r.limit_sar || 0, t0 = null, dur = 950;
    var node = el.querySelector("#rz-limit-num");
    function step(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
      node.textContent = fmt(target * eased);
      if (k < 1) requestAnimationFrame(step); else node.textContent = fmt(target);
    }
    requestAnimationFrame(step);

    var why = el.querySelector("#rz-why");
    if (why) why.addEventListener("click", function () { if (opts.onWhy) opts.onWhy(); });
  }

  root.TR = root.TR || {};
  root.TR.renderLimitReveal = renderLimitReveal;
})(typeof window !== "undefined" ? window : globalThis);
