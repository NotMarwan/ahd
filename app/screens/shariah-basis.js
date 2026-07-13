/* ============================================================================
   screens/shariah-basis.js — «الأساس الشرعي» (feasibility gate, W4): every
   core mechanic (قرض حسن، الختم، المقاصّة، لا ربا/لا غرامة/لا ميسر/لا غرر،
   إشارة الثقة) with its cited verse/AAOIFI standard/law, honestly graded, plus
   every open Shariah question — SHOWN as a question for a scholar, never a
   ruling. Display-only over features/shariah-basis.js; reuses the guarantees-
   panel (.bd-*) classes — no new CSS. CONTEXTUAL screen: reached from «ما لا
   يفعله عهد» and «الضمانات والحدود» chips + a home card; NAV_ORDER untouched.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  var SB = (typeof window !== "undefined") ? window.ShariahBasis : null;
  if (!App) return;

  var GRADE_LABEL = {
    verified: "🟢 مؤكَّد",
    recorded: "🟡 مُسجَّلٌ في الأرشيف — لم يُعَد التحقّق",
    pending: "🔴 الرقم الدقيق يُراجَع",
    "design-only": "⚪ خيارٌ تصميميّ — لا نصَّ مرقَّمًا بعينه"
  };

  function citationHTML(c) {
    var quote = c.quoteAr ? '<div class="bd-cmd" dir="rtl">' + App.esc(c.quoteAr) + "</div>" : "";
    var clause = c.clauseAr ? '<div class="bd-file">' + App.esc(c.clauseAr) + "</div>" : "";
    var ref = c.refAr ? " — " + App.esc(c.refAr) : "";
    return '<div class="bd-detail">' +
      '<div class="bd-file"><code>' + App.esc(c.labelAr) + App.esc(ref) + "</code></div>" +
      clause + quote +
      '<div class="bd-invite">' + App.esc(c.noteAr) + "</div>" +
      '<div class="bd-guard">' + App.esc(GRADE_LABEL[c.grade] || c.grade) + "</div>" +
    "</div>";
  }

  function mechanicHTML(m) {
    return '<details class="bd-item"><summary>' + App.esc(m.titleAr) + "</summary>" +
      '<div class="bd-invite">' + App.esc(m.mechanicAr) + "</div>" +
      m.citations.map(citationHTML).join("") +
    "</details>";
  }

  function questionHTML(q) {
    return '<div class="bd-item">' +
      '<div>❓ ' + App.esc(q.questionAr) + "</div>" +
      '<div class="bd-guard">لِـ: ' + App.esc(q.forAudience) + "</div>" +
    "</div>";
  }

  function render() {
    if (!SB) return '<div class="empty">وحدة الأساس الشرعيّ غير محمّلة.</div>';
    var d = SB.describeAr();
    return '<div class="bounds">' +
      '<div class="bd-head">' + App.esc(d.heading) + "</div>" +
      '<div class="bd-hero">' + App.esc(d.sub) + "</div>" +
      '<div class="bd-card mechanics"><div class="bd-title">الآليّات المستندة إلى نصٍّ أو معيار</div>' +
        SB.MECHANICS.map(mechanicHTML).join("") +
      "</div>" +
      '<div class="bd-card questions"><div class="bd-title">أسئلةٌ مفتوحةٌ بانتظار مراجعة عالِم</div>' +
        SB.OPEN_QUESTIONS.map(questionHTML).join("") +
      "</div>" +
      '<div class="bd-foot">' + App.esc(d.noFatwaLine) + "</div>" +
      '<div class="bd-run">' + App.esc(d.pendingNote) + "</div>" +
      '<div class="bd-chips">' +
        '<button class="bd-chip" onclick="AhdApp.go(\'bounds\')">🧭 الضمانات والحدود ←</button>' +
        '<button class="bd-chip" onclick="AhdApp.go(\'refusal\')">🛡️ ما لا يفعله عهد ←</button>' +
        '<button class="bd-chip" onclick="AhdApp.go(\'home\')">🏠 الرئيسية</button>' +
      "</div>" +
    "</div>";
  }

  App.registerScreen({ key: "shariah", label: "الأساس الشرعي", icon: "📜", render: render });
})();
