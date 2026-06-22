/* ============================================================================
   screens/timeline.js — «سِجلّ الشهادة» (the witness timeline) screen.
   Display-only over features/timeline.js. The bank witnesses → here is the
   witness made human: every significant, sealed moment across your عهود.
   Late = amber. Disputes neutral («يشهد ولا يحكم»). No score, no %.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  function chip(n, label, cls) { return n > 0 ? '<span class="tl-c ' + cls + '">' + n + " " + label + "</span>" : ""; }

  function render(app) {
    var e = app.engine, T = app.Timeline;
    if (!T) return '<div class="empty">وحدة السجلّ غير محمّلة.</div>';
    var feed = T.buildTimeline(app.records, app.reminderHistory, e, app.viewer, app.AS_OF);
    var c = T.timelineCounts(feed);

    if (!feed.length) {
      return '<div class="timeline"><div class="tl-head">سِجلّ الشهادة</div>' +
        '<div class="empty">لا شيء بعد — حين تُنشئ عهدًا أو يجري عليه شيء، يُسجَّل هنا شهادةً محفوظة.</div></div>';
    }

    var counts = chip(c.sealed, "موثّق", "sealed") + chip(c.kept, "ذمّة محفوظة", "kept") +
      chip(c.mercy, "رحمة", "mercy") + chip(c.neutral, "محلّ خلاف", "neutral") + chip(c.amber, "تذكير لطيف", "amber");

    var items = feed.map(function (x) {
      var meta = App.esc(x.who) + " · " + e.fmt(x.amountSAR) + " ر.س" + (x.dueAr ? " · " + App.esc(x.dueAr) : "");
      return '<div class="tl-item tone-' + x.tone + '">' +
        '<div class="tl-ico" aria-hidden="true">' + x.icon + "</div>" +
        '<div class="tl-body"><div class="tl-ar">' + x.ar + "</div>" +
        '<div class="tl-meta">' + meta + "</div></div></div>";
    }).join("");

    return '<div class="timeline">' +
      '<div class="tl-head">سِجلّ الشهادة</div>' +
      '<div class="tl-sub">المصرف يشهد ويحفظ — لا يُقرض، ولا يحكم، ولا يُصنّف. هذا ما جرى توثيقه.</div>' +
      '<div class="tl-counts">' + counts + "</div>" +
      '<div class="tl-feed">' + items + "</div>" +
    "</div>";
  }

  App.registerScreen({ key: "timeline", label: "السجلّ", icon: "📜", render: render });
})();
