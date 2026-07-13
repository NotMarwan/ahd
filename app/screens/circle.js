/* ============================================================================
   screens/circle.js — «لوحة أمين الصندوق» (Agent-4 G3). The treasurer sees the
   occasion's progress + every member's DIGNIFIED state + the one sealed proof.
   Dignity: the individual states are the treasurer's view; reminders are group-
   wide and never name the late member. Display-only over features/circle.js.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  function chipClass(stateAr) {
    if (/محفوظة|أُبرئ|مؤجّل بالتراضي/.test(stateAr)) return "gold";
    if (/خلاف/.test(stateAr)) return "mute";
    if (/نشِط/.test(stateAr)) return "teal";
    return "mute";
  }

  function render(app) {
    var e = app.engine, CD = app.CircleDash;
    if (!CD) return '<div class="empty">وحدة الدائرة غير محمّلة.</div>';
    var d = CD.circleDashboard(e.DEMO_CIRCLE, e);
    var st = app.circleState || { reminder: false };
    var gr = CD.groupReminder(e.DEMO_CIRCLE, e);
    var pct = d.owedSAR > 0 ? Math.round(d.collectedSAR / d.owedSAR * 100) : 0;
    var rows = d.members.map(function (m) {
      var who = m.self ? App.esc(m.name) + ' <small>(أنتِ · أمينة الصندوق)</small>' : App.esc(m.name);
      var chip = m.self ? '<span class="chip teal">دفعتِ عن الجميع</span>'
        : '<span class="chip ' + chipClass(m.stateAr) + '">' + App.esc(m.stateAr) + "</span>";
      return '<div class="cd-row"><span>' + who + " · " + App.fmtN(m.amountSAR) + ' ر.س</span>' + chip + "</div>";
    }).join("");
    return '<div class="circledash">' +
      '<div class="cd-head">دائرة «' + App.esc(d.name) + '» · أمين الصندوق ' + App.esc(d.organizer) + "</div>" +
      '<div class="cd-prog"><div class="cd-hero-num">' + App.fmtN(d.collectedSAR) + ' <small>ر.س</small></div>' +
        '<div class="cd-pl">جُمِع من إجمالي ' + App.fmtN(d.owedSAR) + ' ر.س</div>' +
        '<div class="cd-bar"><div class="cd-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="cd-status">' + App.esc(d.statusAr) + "</div></div>" +
      '<div class="cd-card">' + rows + "</div>" +
      '<div class="cd-remind">' +
        '<button class="cd-rbtn" onclick="AhdApp.circleReminderToggle()">' + (st.reminder ? "إخفاء التذكير" : "ذكّر الدائرة بلطف 🤍") + "</button>" +
        (st.reminder
          ? '<div class="cd-rcard"><div class="cd-rfrom">عهد · تذكيرٌ جماعيّ (لا يُسمّى أحد)</div>' +
            '<div class="cd-rtext">' + App.esc(gr.ar) + "</div>" +
            '<div class="cd-rfoot">يصل ' + App.digit(gr.pendingCount) + " من بقيت مساهمتُهم — دفعةً واحدة، بلا تمييز ولا إحراج.</div></div>"
          : "") +
      "</div>" +
      '<div class="cd-note">التذكير جماعيٌّ يصل الجميع — لا يُسمّى المتأخّر ولا يُفضح. ومتى تعسّر عضوٌ: «أحتاج وقت» (٢٨٠) أو إبراءٌ صدقةً.</div>' +
      '<div class="cd-seal">ختم الدائرة — دليلٌ واحدٌ للمناسبة كلِّها: ' + App.esc(e.short(d.seal, 20)) + "…</div>" +
    "</div>";
  }

  App.registerScreen({ key: "circle", label: "الدائرة", icon: "👥", render: render });
})();
