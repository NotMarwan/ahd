/* ============================================================================
   screens/bounds.js — «الضمانات والحدود» (JL-4): the guarantees-as-code panel
   a presenter opens when a judge asks «وايش يحمي الأطراف؟». Three columns
   (للمدين · للدائن · حدود المصرف); every بند carries a small grey
   «يحرسه: <file · test>» line naming the REAL guard on disk (proved by
   tests/app/bounds.test.cjs). Display-only over features/bounds.js — it
   describes existing guarantees and changes zero semantics.
   CONTEXTUAL screen: home card + chips on «ما عليّ» and «حافظة الإثبات»;
   NAV_ORDER is untouched.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  var Bounds = (typeof window !== "undefined") ? window.Bounds : null;
  if (!App) return;

  /* the judge-invitation line: the ONE command that runs every guard, printed
     mono + LTR (a printed command line — it opens nothing) */
  var RUN_CMD = "cd tests && node run-all.cjs";

  function itemHTML(it) {
    return '<div class="bd-item">' + App.esc(it.text) +
      '<div class="bd-guard">يحرسه: <code>' + App.esc(it.enforcedBy) + "</code></div>" +
    "</div>";
  }

  function cardHTML(sec) {
    return '<div class="bd-card ' + App.esc(sec.key) + '">' +
      '<div class="bd-title">' + App.esc(sec.titleAr) + "</div>" +
      sec.items.map(itemHTML).join("") +
    "</div>";
  }

  function render() {
    if (!Bounds) return '<div class="empty">وحدة الضمانات غير محمّلة.</div>';
    var d = Bounds.describeAr();
    return '<div class="bounds">' +
      '<div class="bd-head">الضمانات والحدود — مكتوبةٌ في الكود</div>' +
      '<div class="bd-hero">' + App.esc(d.heroLine) + "</div>" +
      '<div class="bd-cols">' + Bounds.SECTIONS.map(cardHTML).join("") + "</div>" +
      '<div class="bd-foot">' + App.esc(d.footerLine) + "</div>" +
      '<div class="bd-run" aria-label="أمر تشغيل الحزمة">' + App.esc(RUN_CMD) + "</div>" +
      '<div class="bd-chips">' +
        '<button class="bd-chip" onclick="AhdApp.go(\'mine\')">🫱 ما عليّ</button>' +
        '<button class="bd-chip" onclick="AhdApp.go(\'proof\')">🔏 حافظة الإثبات</button>' +
        '<button class="bd-chip" onclick="AhdApp.go(\'home\')">🏠 الرئيسية</button>' +
      "</div>" +
    "</div>";
  }

  App.registerScreen({ key: "bounds", label: "الضمانات والحدود", icon: "🧭", render: render });
})();
