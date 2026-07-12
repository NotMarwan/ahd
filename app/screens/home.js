/* ============================================================================
   screens/home.js — the «عهد» front door. Introduces the product, surfaces the
   live دفتري summary, links to every feature, and states the spine + the basis.
   Registered FIRST → the default screen on boot.

   Front A (2026-07-12): the flat 14-card menu is now a 3-tier HIERARCHY —
   one dominant hero action (أنشئ عهدًا), a primary grid of the core surfaces,
   and the rest folded into «المزيد» — driven by the pure HomeLayout module.
   An octagon seal emblem marks the door. Additive: same destinations, all
   reachable; no engine/golden touch.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;
  var HL = (typeof window !== "undefined" && window.HomeLayout) ? window.HomeLayout : null;

  /* one source of truth for every front-door destination (id · icon · title · sub),
     grouped into tiers by HomeLayout. Order here is the natural product order; the
     tiering (which four are primary) is HomeLayout's fixed editorial priority. */
  var DESTS = [
    { id: "create",     ico: "➕",  title: "أنشئ عهدًا",       sub: "اكتب قرضًا حسنًا — وعهد يحرسه من الربا" },
    { id: "request",    ico: "🙏",  title: "اطلب عهدًا",       sub: "اطلب قرضًا حسنًا بكرامة — لا حرج في أن تسأل" },
    { id: "daftari",    ico: "📔",  title: "دفتري",            sub: "كلّ ما لك وما عليك — وعهد يذكّر بالمعروف" },
    { id: "open",       ico: "♾️",  title: "قرضٌ مفتوح",       sub: "متى ما تيسّر — بلا موعد، بلا غرامة" },
    { id: "circle",     ico: "👥",  title: "الدائرة",          sub: "أمين الصندوق: تقدّمٌ وكرامة، وذمّة المناسبة محفوظة" },
    { id: "circle-adv", ico: "🔁",  title: "الدائرة+",         sub: "مناسبةٌ وتقسيمٌ وتخريجٌ إلى عهد" },
    { id: "settle",     ico: "🔗",  title: "المقاصّة",         sub: "أقلّ التحويلات تُصفّي الجميع — بالتراضي" },
    { id: "impact",     ico: "📊",  title: "أثر عهد",          sub: "أثر المقاصّة عبر الدوائر — مجاميع مجهّلة من دوائر تجريبيّة" },
    { id: "mine",       ico: "🫱",  title: "ما عليّ",          sub: "التزاماتك بكرامة — سدِّد ما تيسّر، واطلب مهلةً بالمعروف" },
    { id: "standing",   ico: "🗓️",  title: "سُلفة بالمعروف",   sub: "سُلفةٌ متجدّدةٌ بين طرفين — بلا فائدة، متى تيسّر" },
    { id: "maroof",     ico: "🕊️",  title: "سِجلّ المعروف",    sub: "كلُّ تذكيرٍ ونظرةٍ وإبراءٍ — مختومٌ ومحفوظٌ كبيّنة" },
    { id: "bounds",     ico: "🧭",  title: "الضمانات والحدود", sub: "ما يحمي الطرفين وما لا يفعله المصرف — كلُّ ضمانةٍ باختبارها" },
    { id: "refusal",    ico: "🛡️",  title: "ما لا يفعله عهد",   sub: "لا يُقرض، لا يُقيّم، لا يحكم — هُويّةٌ لا اعتذار" },
    { id: "plans",      ico: "🧾",  title: "الأجرة والخطط",    sub: "كيف يربح عهد — أجرةٌ على الخدمة لا على القرض، والقرض مجانيٌّ للأبد" },
    { id: "org",        ico: "🏛️",  title: "لوحة المؤسسة",     sub: "صندوق قرض حسن كـ SaaS — مجاميع مجهّلة وفاتورةٌ ثابتة، بلا مالٍ مجمَّع" }
  ];

  /* defensive fallback if the module didn't load — the door still opens */
  function groupsOf(dests) {
    if (HL && typeof HL.groups === "function") return HL.groups(dests);
    return { hero: dests[0], primary: dests.slice(1, 5), more: dests.slice(5) };
  }

  /* octagon seal enclosing «عهد» — authority through craft, gold hairline + teal inner */
  var EMBLEM =
    '<div class="home-emblem" aria-hidden="true"><svg viewBox="0 0 44 44">' +
      '<polygon class="oct" points="14,2.5 30,2.5 41.5,14 41.5,30 30,41.5 14,41.5 2.5,30 2.5,14"/>' +
      '<polygon class="oct-in" points="15,6 29,6 38,15 38,29 29,38 15,38 6,29 6,15"/>' +
      '<text x="22" y="23.5">عهد</text>' +
    "</svg></div>";

  function card(d) {
    return '<button class="hcard" onclick="AhdApp.go(\'' + d.id + '\')">' +
      '<div class="hico">' + d.ico + '</div><div class="ht">' + App.esc(d.title) + '</div><div class="hs">' + App.esc(d.sub) + "</div></button>";
  }
  function heroTile(d) {
    return '<button class="home-hero-tile" onclick="AhdApp.go(\'' + d.id + '\')">' +
      '<span class="hht-ico" aria-hidden="true">' + d.ico + '</span>' +
      '<span class="hht-body"><span class="t">' + App.esc(d.title) + '</span><span class="s">' + App.esc(d.sub) + '</span></span>' +
      '<span class="hht-go" aria-hidden="true">›</span></button>';
  }

  function render(app) {
    var e = app.engine, D = app.D;
    var led = (D && app.records) ? D.buildLedger(app.records, app.viewer, e, app.AS_OF) : null;
    var tiles = led ? D.summaryTiles(led) : { me: { amountSAR: 0 }, on: { amountSAR: 0 } };
    /* a live dashboard strip reflecting the deepened product — all factual (money +
       a witnessed-moments count + the own standing WORD), never a trust score. */
    var net = (led && D.netPosition) ? D.netPosition(led, e) : null;
    var moments = (app.Timeline && led) ? app.Timeline.buildTimeline(app.records, app.reminderHistory, e, app.viewer, app.AS_OF).length : 0;
    var band = (app.selfHistory && D.selfBand) ? D.selfBand(app.selfHistory, false, e) : null;
    function hst(go, label, val) { return '<button class="hst" onclick="AhdApp.go(\'' + go + '\')"><span>' + label + '</span><b>' + val + "</b></button>"; }
    var netVal = net ? (net.side === "balanced" ? "متوازن" : (net.side === "lak" ? "لك " : "عليك ") + App.fmtN(net.netSAR) + " ر.س") : "—";
    var standing = led ? '<div class="hstanding">' +
      hst("daftari", "صافي مركزك", netVal) +
      hst("timeline", "سجلّ الشهادة", App.digit(moments) + " لحظة محفوظة") +
      (band ? hst("daftari", "سجلّ وفائك", App.esc(band.word)) : "") +
      "</div>" : "";

    var G = groupsOf(DESTS);
    var primaryCards = G.primary.map(card).join("");
    var moreCards = G.more.map(card).join("");

    return '<div class="home">' +
      '<div class="hero">' + EMBLEM +
        '<div class="brand">عهد</div>' +
        '<div class="tag">قرضٌ حسن — مكتوبٌ ومشهود، بكرامة.</div>' +
        '<div class="sub">المصرف يكتب ويشهد ويحفظ ويُسوّي — ولا يُقرض، ولا يحكم، ولا يأخذ على القرض شيئًا. بلا ربا، بلا غرامة، بلا تصنيف.</div></div>' +
      heroTile(G.hero) +
      '<div class="hgrid" role="list">' + primaryCards + "</div>" +
      '<details class="hmore"><summary>المزيد من عهد…</summary><div class="hgrid hmore-grid" role="list">' + moreCards + "</div></details>" +
      '<div class="hsummary">لك عند الناس <b>' + App.fmtN(tiles.me.amountSAR) + ' ر.س</b> · عليك للناس <b>' + App.fmtN(tiles.on.amountSAR) + ' ر.س</b></div>' +
      standing +
      '<div class="hsteps">' +
        '<div class="step"><span>١</span> اكتب العهد</div>' +
        '<div class="step"><span>٢</span> يُشهَد ويُختَم<br><small>نفاذ · SHA-256</small></div>' +
        '<div class="step"><span>٣</span> يُسوّى بالمعروف</div>' +
      "</div>" +
      '<div class="hbasis">﴿إذا تداينتم بدينٍ إلى أجلٍ مسمًّى فاكتبوه﴾ · ﴿وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة﴾</div>' +
      '<button class="hsettings" onclick="AhdApp.go(\'settings\')">⚙️ الإعدادات · عن عهد · نظام الأرقام</button>' +
    "</div>";
  }

  App.registerScreen({ key: "home", label: "الرئيسية", icon: "🏠", render: render });
})();
