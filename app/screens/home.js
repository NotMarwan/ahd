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
    return '<div class="home">' +
      '<div class="hero"><div class="brand">عهد</div>' +
        '<div class="tag">قرضٌ حسن — مكتوبٌ ومشهود، بكرامة.</div>' +
        '<div class="sub">المصرف يكتب ويشهد ويحفظ ويُسوّي — ولا يُقرض، ولا يحكم، ولا يأخذ على القرض شيئًا. بلا ربا، بلا غرامة، بلا تصنيف.</div></div>' +
      '<div class="hcards">' +
        card("create", "➕", "أنشئ عهدًا", "اكتب قرضًا حسنًا — وعهد يحرسه من الربا") +
        card("request", "🙏", "اطلب عهدًا", "اطلب قرضًا حسنًا بكرامة — لا حرج في أن تسأل") +
        card("daftari", "📔", "دفتري", "كلّ ما لك وما عليك — وعهد يذكّر بالمعروف") +
        card("open", "♾️", "قرضٌ مفتوح", "متى ما تيسّر — بلا موعد، بلا غرامة") +
        card("circle", "👥", "الدائرة", "أمين الصندوق: تقدّمٌ وكرامة، وذمّة المناسبة محفوظة") +
        card("circle-adv", "🔁", "الدائرة+", "مناسبةٌ وتقسيمٌ وتخريجٌ إلى عهد") +
        card("settle", "🔗", "المقاصّة", "أقلّ التحويلات تُصفّي الجميع — بالتراضي") +
        card("impact", "📊", "أثر عهد", "أثر المقاصّة عبر الدوائر — مجاميع مجهّلة من دوائر تجريبيّة") +
        card("mine", "🫱", "ما عليّ", "التزاماتك بكرامة — سدِّد ما تيسّر، واطلب مهلةً بالمعروف") +
        card("standing", "🗓️", "سُلفة بالمعروف", "سُلفةٌ متجدّدةٌ بين طرفين — بلا فائدة، متى تيسّر") +
        card("maroof", "🕊️", "سِجلّ المعروف", "كلُّ تذكيرٍ ونظرةٍ وإبراءٍ — مختومٌ ومحفوظٌ كبيّنة") +
        card("bounds", "🧭", "الضمانات والحدود", "ما يحمي الطرفين وما لا يفعله المصرف — كلُّ ضمانةٍ باختبارها") +
      "</div>" +
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
