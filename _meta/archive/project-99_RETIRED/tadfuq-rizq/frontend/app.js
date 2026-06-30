/* app.js — Rizq shell + state machine (Contract 4c) — OWNER: Agent 3
   Orchestrates: pick → connecting → reveal → drilldown → forecast(A4) → buckets(A4) → summary.
   Consumes window.RizqApi (C3) + window.TR.* components. Offline, deterministic, RTL. */
(function () {
  "use strict";

  var STEPS = [
    ["pick", "اختيار"], ["connecting", "ربط"], ["reveal", "الحدّ"],
    ["drilldown", "التفسير"], ["forecast", "التوقّع"], ["buckets", "التوزيع"]
  ];

  var App = { state: { step: "pick", persona: null, bundle: null, result: null, offline: true, _elapsedMs: 0 }, personas: [] };
  var screen;

  function renderStepper() {
    var box = document.getElementById("stepper"); if (!box) return;
    var cur = STEPS.findIndex(function (s) { return s[0] === App.state.step; });
    if (App.state.step === "summary") cur = STEPS.length; // all done
    box.innerHTML = STEPS.map(function (s, i) {
      var cls = i < cur ? "done" : (i === cur ? "active" : "");
      return '<span class="rz-stp ' + cls + '">' + (i < cur ? "✓ " : "") + s[1] + '</span>';
    }).join('<span class="rz-stp-sep">›</span>');
  }

  function setStep(s) { App.state.step = s; renderStepper(); }
  function go(s) { setStep(s); render(); }

  function render() {
    var s = App.state;
    switch (s.step) {
      case "pick":
        TR.renderPersonaPick(screen, App.personas, { onPick: onPick }); break;
      case "reveal":
        TR.renderLimitReveal(screen, { bundle: s.bundle, result: s.result, elapsedMs: s._elapsedMs }, { onWhy: function () { go("drilldown"); } }); break;
      case "drilldown":
        TR.renderExplainCard(screen, { bundle: s.bundle, result: s.result }, { onForecast: function () { go("forecast"); }, onRestart: restart }); break;
      case "forecast":
        if (TR.renderForecast) TR.renderForecast(screen, s.bundle, { onContinue: function () { go("buckets"); } });
        else placeholder("forecast (Agent 4)"); break;
      case "buckets":
        if (TR.renderBuckets) {
          var f = TR.computeForecast ? TR.computeForecast(s.bundle) : { baseline: 5000 };
          TR.renderBuckets(screen, { bundle: s.bundle, payment: f.baseline || 5000 }, { onDone: function () { go("summary"); } });
        } else placeholder("buckets (Agent 4)"); break;
      case "summary":
        renderSummary(); break;
    }
  }

  async function onPick(id) {
    setStep("connecting");
    var bundle;
    try { bundle = await RizqApi.connect(id); }
    catch (e) { screen.innerHTML = errCard("تعذّر ربط الحساب: " + e.message); return; }
    App.state.persona = id; App.state.bundle = bundle;
    var uw = RizqApi.underwrite(bundle).catch(function (e) { return { _error: e.message }; });

    TR.renderConnect(screen, { name_ar: bundle.profile.name_ar, months: bundle.profile.months_active }, {
      onDone: async function (info) {
        var result = await uw;
        if (result._error) { screen.innerHTML = errCard("تعذّر التمويل: " + result._error); return; }
        App.state.result = result;
        App.state._elapsedMs = (info.connectMs || 4800) + (result.generated_in_ms || 300);
        go("reveal");
      }
    });
  }

  function renderSummary() {
    var s = App.state, r = s.result;
    var fmt = function (n) { return Math.round(n).toLocaleString("en-US"); };
    screen.innerHTML =
      '<div class="rz-wrap rz-center">' +
        '<div class="tr-card">' +
          '<div class="tr-pill" style="background:var(--c-primary-tint);color:var(--c-primary)">تدفّق داخل رزق</div>' +
          '<h1 class="tr-h1" style="margin-top:10px">' + s.bundle.profile.name_ar + ' أصبح قابلاً للتمويل</h1>' +
          '<p class="tr-sub">حدّ <b class="tr-num">' + fmt(r.limit_sar) + ' ر.س</b> بصيغة التورّق، محسوب من المصرفية المفتوحة + زاتكا، ' +
            'مع خطة شهرية تحمي الزكاة والضريبة والاحتياطي.</p>' +
          '<p class="tr-sub" style="margin-top:10px">هذا هو ركن <b>التمويل</b> من طبقة مصرفية إسلامية ذكية: ' +
            '<span class="tr-num">معرفة · حماية · نماء · تمويل</span>.</p>' +
          '<div style="margin-top:18px"><button class="tr-btn" id="rz-again">جرّب ملفًّا آخر</button></div>' +
        '</div>' +
      '</div>';
    var a = screen.querySelector("#rz-again"); if (a) a.addEventListener("click", restart);
  }

  function placeholder(name) { screen.innerHTML = '<div class="rz-wrap"><div class="tr-card tr-center">شاشة <b>' + name + '</b> لم تُحمّل — تابع الدمج.</div></div>'; }
  function errCard(msg) { return '<div class="rz-wrap"><div class="tr-card tr-center" style="color:var(--c-danger)">' + msg + '</div></div>'; }
  function restart() { App.state = { step: "pick", persona: null, bundle: null, result: null, offline: RizqApi.OFFLINE, _elapsedMs: 0 }; go("pick"); }

  document.addEventListener("DOMContentLoaded", async function () {
    screen = document.getElementById("screen");
    var badge = document.getElementById("mode-badge");
    if (badge) {
      badge.textContent = RizqApi.OFFLINE ? "● OFFLINE — بلا شبكة" : "● LIVE — backend";
      badge.className = "rz-mode " + (RizqApi.OFFLINE ? "off" : "live");
    }
    App.state.offline = RizqApi.OFFLINE;
    try { App.personas = await RizqApi.getPersonas(); }
    catch (e) { screen.innerHTML = errCard("تعذّر تحميل الملفات: " + e.message); return; }
    go("pick");
  });

  window.RizqApp = App;
})();
