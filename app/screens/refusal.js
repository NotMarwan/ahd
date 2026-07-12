/* ============================================================================
   screens/refusal.js — «ما لا يفعله عهد». The identity moment, SEEN not spoken:
   three refusals, each greying out the control a normal bank would use, stamped
   with the plain reason and the real guard file that enforces it — mirroring the
   riba-linter's own block-and-explain language. Then the charity beat (اجعلها
   صدقة), celebrated as a hero card, not buried in a fallback folder.

   Contextual screen (reached from home; NAV_ORDER untouched). Pure render over
   the frozen Refusal content model; no engine/golden touch.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  function render(app) {
    var R = (typeof window !== "undefined" && window.Refusal) ? window.Refusal : null;
    if (!R) return '<div class="empty">تعذّر تحميل الصفحة.</div>';
    var m = R.model();

    var cards = m.items.map(function (it) {
      return '<div class="rf-card">' +
        '<div class="rf-act">✗ ' + App.esc(it.act) + "</div>" +
        '<div class="rf-ctl" aria-disabled="true"><span class="rf-ctl-l">' + App.esc(it.control) + "</span>" +
          '<span class="rf-lock">🔒 معطّلٌ في عهد</span></div>' +
        '<div class="rf-bank">' + App.esc(it.bankDoes) + "</div>" +
        '<div class="rf-why">' + App.esc(it.whyRefused) + "</div>" +
        '<div class="rf-guard">يحرسه: <code>' + App.esc(it.enforcedBy) + "</code></div>" +
        "</div>";
    }).join("");

    var charity = '<div class="rf-charity">' +
      '<div class="rf-ch-act">🤍 ' + App.esc(m.charity.act) + "</div>" +
      '<div class="rf-ch-line">' + App.esc(m.charity.line) + "</div>" +
      '<div class="rf-ayah">' + App.esc(m.charity.ayah) + "</div>" +
      '<div class="rf-guard">يحرسه: <code>' + App.esc(m.charity.enforcedBy) + "</code></div>" +
      '<button class="rf-do" onclick="AhdApp.go(\'open\')">🤍 جرّبها الآن في «القرض المفتوح» ←</button>' +
      "</div>";

    return '<div class="refusal">' +
      '<div class="rf-head">' + App.esc(m.heading) + "</div>" +
      '<div class="rf-sub">' + App.esc(m.sub) + "</div>" +
      cards + charity +
      '<div class="rf-chips">' +
        '<button class="rf-chip" onclick="AhdApp.go(\'bounds\')">الضمانات والحدود ←</button>' +
        '<button class="rf-chip" onclick="AhdApp.go(\'create\')">جرّب مانع الربا ←</button>' +
      "</div>" +
    "</div>";
  }

  App.registerScreen({ key: "refusal", label: "ما لا يفعله عهد", icon: "🛡️", render: render });
})();
