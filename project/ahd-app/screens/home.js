/* ============================================================================
   screens/home.js — the «عهد» front door. Introduces the product, surfaces the
   live دفتري summary, links to every feature, and states the spine + the basis.
   Registered FIRST → the default screen on boot.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  function card(key, ico, title, sub) {
    return '<button class="hcard" onclick="AhdApp.go(\'' + key + '\')">' +
      '<div class="hico">' + ico + '</div><div class="ht">' + App.esc(title) + '</div><div class="hs">' + App.esc(sub) + "</div></button>";
  }

  function render(app) {
    var e = app.engine, D = app.D;
    var tiles = (D && app.records) ? D.summaryTiles(D.buildLedger(app.records, app.viewer, e, app.AS_OF)) : { me: { amountSAR: 0 }, on: { amountSAR: 0 } };
    return '<div class="home">' +
      '<div class="hero"><div class="brand">عهد</div>' +
        '<div class="tag">قرضٌ حسن — مكتوبٌ ومشهود، بكرامة.</div>' +
        '<div class="sub">المصرف يكتب ويشهد ويحفظ ويُسوّي — ولا يُقرض، ولا يحكم، ولا يأخذ على القرض شيئًا. بلا ربا، بلا غرامة، بلا تصنيف.</div></div>' +
      '<div class="hcards">' +
        card("create", "➕", "أنشئ عهدًا", "اكتب قرضًا حسنًا — وعهد يحرسه من الربا") +
        card("daftari", "📔", "دفتري", "كلّ ما لك وما عليك — وعهد يذكّر بالمعروف") +
        card("open", "♾️", "قرضٌ مفتوح", "متى ما تيسّر — بلا موعد، بلا غرامة") +
        card("circle-adv", "🔁", "الدائرة+", "مناسبةٌ وتقسيمٌ وتخريجٌ إلى عهد") +
        card("settle", "🔗", "المقاصّة", "أقلّ التحويلات تُصفّي الجميع — بالتراضي") +
      "</div>" +
      '<div class="hsummary">لك عند الناس <b>' + e.fmt(tiles.me.amountSAR) + ' ر.س</b> · عليك للناس <b>' + e.fmt(tiles.on.amountSAR) + ' ر.س</b></div>' +
      '<div class="hsteps">' +
        '<div class="step"><span>١</span> اكتب العهد</div>' +
        '<div class="step"><span>٢</span> يُشهَد ويُختَم<br><small>نفاذ · SHA-256</small></div>' +
        '<div class="step"><span>٣</span> يُسوّى بالمعروف</div>' +
      "</div>" +
      '<div class="hbasis">﴿إذا تداينتم بدينٍ إلى أجلٍ مسمًّى فاكتبوه﴾ · ﴿وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة﴾</div>' +
    "</div>";
  }

  App.registerScreen({ key: "home", label: "الرئيسية", icon: "🏠", render: render });
})();
