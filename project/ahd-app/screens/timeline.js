/* ============================================================================
   screens/timeline.js — «سِجلّ الشهادة» (the witness timeline) screen, deepened
   into the product's CONNECTIVE TISSUE: a per-عهد STORY view (each relationship's
   witnessed narrative) with links out to حافظة الإثبات / محلّ خلاف / الدفتر, a
   toggle to the flat «حسب الوقت» feed, and a focus mode (arrived from دفتري).
   Display-only over features/timeline.js. Late = amber. Disputes neutral. No %.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  function chip(n, label, cls) { return n > 0 ? '<span class="tl-c ' + cls + '">' + App.digit(n) + " " + label + "</span>" : ""; }

  function actionBtns(g) {
    return App.Timeline.ahdActions(g).map(function (a) {
      var call = a.key === "proof" ? "openProof" : (a.key === "dispute" ? "openDispute" : "timelineToDaftari");
      return '<button class="tl-act" onclick="AhdApp.' + call + "('" + g.recordId + "')\">" + a.icon + " " + App.esc(a.label) + "</button>";
    }).join("");
  }

  function storyCard(g, focused) {
    var head = '<div class="story-head"><div class="story-who">' + App.esc(g.who) + "</div>" +
      '<div class="story-meta">' + App.fmtN(g.amountSAR) + " ر.س" + (g.dueAr ? " · " + App.esc(g.dueAr) : "") + "</div></div>";
    var steps = g.entries.map(function (x) {
      return '<div class="story-step tone-' + App.esc(x.tone) + '"><span class="ss-ico" aria-hidden="true">' + App.esc(x.icon) +
        '</span><span class="ss-ar">' + App.esc(x.ar) + "</span></div>";
    }).join("");
    return '<div class="story' + (focused ? " focus" : "") + " tone-" + App.esc(g.outcome ? g.outcome.tone : "sealed") + '">' +
      head + '<div class="story-steps">' + steps + "</div>" +
      '<div class="story-acts">' + actionBtns(g) + "</div></div>";
  }

  function flatItem(x) {
    var meta = App.esc(x.who) + " · " + App.fmtN(x.amountSAR) + " ر.س" + (x.dueAr ? " · " + App.esc(x.dueAr) : "");
    return '<div class="tl-item tone-' + App.esc(x.tone) + '"><div class="tl-ico" aria-hidden="true">' + App.esc(x.icon) + "</div>" +
      '<div class="tl-body"><div class="tl-ar">' + App.esc(x.ar) + '</div><div class="tl-meta">' + meta + "</div></div></div>";
  }

  function render(app) {
    var e = app.engine, T = app.Timeline, st = app.timelineState || { view: "story", focus: null };
    if (!T) return '<div class="empty">وحدة السجلّ غير محمّلة.</div>';
    var feed = T.buildTimeline(app.records, app.reminderHistory, e, app.viewer, app.AS_OF);
    var c = T.timelineCounts(feed);
    var header = '<div class="tl-head">سِجلّ الشهادة</div>' +
      '<div class="tl-sub">المصرف يشهد ويحفظ — لا يُقرض، ولا يحكم، ولا يُصنّف. هذا ما جرى توثيقه.</div>';

    if (!feed.length) {
      return '<div class="timeline">' + header +
        '<div class="empty">لا شيء بعد — حين تُنشئ عهدًا أو يجري عليه شيء، يُسجَّل هنا شهادةً محفوظة.</div></div>';
    }

    var counts = '<div class="tl-counts">' + chip(c.sealed, "موثّق", "sealed") + chip(c.kept, "ذمّة محفوظة", "kept") +
      chip(c.mercy, "رحمة", "mercy") + chip(c.neutral, "محلّ خلاف", "neutral") + chip(c.amber, "تذكير لطيف", "amber") + "</div>";
    var toggle = '<div class="tl-toggle" role="tablist">' +
      '<button class="tchip' + (st.view !== "flat" ? " on" : "") + '" onclick="AhdApp.setTimelineView(\'story\')">حسب العهد</button>' +
      '<button class="tchip' + (st.view === "flat" ? " on" : "") + '" onclick="AhdApp.setTimelineView(\'flat\')">حسب الوقت</button>' +
      "</div>";

    var body;
    if (st.view === "flat") {
      body = '<div class="tl-feed">' + feed.map(flatItem).join("") + "</div>";
    } else {
      var groups = T.groupByAhd(feed), focusBar = "", focused = false;
      if (st.focus) {
        var fg = groups.filter(function (g) { return g.recordId === st.focus; });
        if (fg.length) { groups = fg; focused = true; focusBar = '<button class="tl-clear" onclick="AhdApp.timelineClearFocus()">← كل العهود</button>'; }
      }
      body = focusBar + '<div class="tl-stories">' + groups.map(function (g) { return storyCard(g, focused); }).join("") + "</div>";
    }

    return '<div class="timeline">' + header + counts + toggle + body + "</div>";
  }

  App.registerScreen({ key: "timeline", label: "السجلّ", icon: "📜", render: render });
})();
