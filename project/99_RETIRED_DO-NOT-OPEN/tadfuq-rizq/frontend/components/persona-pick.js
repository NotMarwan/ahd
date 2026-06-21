/* persona-pick.js — Rizq step "pick" (Contract 4c) — OWNER: Agent 3
   UMD → global TR (namespace reconciled with A4). render(el, personas, {onPick}). Offline, RTL, deterministic. */
(function (root) {
  "use strict";
  var SEG = { freelancer: "عمل حر", small_merchant: "تاجر تجزئة", gig_driver: "اقتصاد المهام" };

  function renderPersonaPick(el, personas, opts) {
    opts = opts || {};
    var cards = personas.map(function (p) {
      return '' +
        '<button class="rz-persona" data-id="' + p.persona_id + '">' +
          '<div class="rz-persona-top">' +
            '<span class="tr-pill" style="background:var(--c-primary-tint);color:var(--c-primary)">' + (SEG[p.segment] || p.segment) + '</span>' +
            '<span class="tr-pill" style="background:#FBE8DE;color:var(--c-danger)">بلا سجل سِمَة</span>' +
          '</div>' +
          '<div class="rz-persona-name">' + p.name_ar + '</div>' +
          '<div class="tr-sub">' + p.teaser_ar + '</div>' +
          '<div class="rz-persona-cta">اربط الحساب (OB + زاتكا) ←</div>' +
        '</button>';
    }).join("");

    el.innerHTML =
      '<div class="rz-wrap">' +
        '<h1 class="tr-h1">مَن سيُموَّل اليوم؟</h1>' +
        '<p class="tr-sub" style="margin-bottom:20px">اختر مستقلًّا أو منشأة صغيرة — ' +
          '2.25 مليون مستقلّ في السعودية لا يراهم نظام الضمانات. سنُموّل أحدهم في أقل من 15 ثانية.</p>' +
        '<div class="rz-persona-grid">' + cards + '</div>' +
      '</div>';

    Array.prototype.forEach.call(el.querySelectorAll(".rz-persona"), function (b) {
      b.addEventListener("click", function () { if (opts.onPick) opts.onPick(b.getAttribute("data-id")); });
    });
  }

  root.TR = root.TR || {};
  root.TR.renderPersonaPick = renderPersonaPick;
})(typeof window !== "undefined" ? window : globalThis);
