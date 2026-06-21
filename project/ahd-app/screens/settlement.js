/* ============================================================================
   screens/settlement.js — «المقاصّة» (Muqassa) in the app: the tangle of debts
   reduced to the fewest transfers, with the consent legs + the conservation proof.
   Display-only over the golden Muqassa (features/settlement.js → engine.netting).
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  function render(app) {
    var e = app.engine, S = app.Settlement;
    if (!S) return '<div class="empty">وحدة المقاصّة غير محمّلة.</div>';
    var v = S.settlementView(e.IOUS, e);
    var transfers = v.after.map(function (t) {
      return '<div class="se-row"><span>' + App.esc(t.from) + " تدفع " + App.esc(t.to) + "</span><b>" + e.fmt(t.amount) + " ر.س</b></div>";
    }).join("");
    var legs = v.legs.map(function (m) {
      var pays = (m.pays || []).map(function (p) { return "يدفع " + App.esc(p.to) + " " + e.fmt(p.amount); });
      var gets = (m.gets || []).map(function (g) { return "يقبض من " + App.esc(g.from) + " " + e.fmt(g.amount); });
      return '<div class="se-leg"><b>' + App.esc(m.name) + "</b><span>" + pays.concat(gets).join(" · ") + "</span></div>";
    }).join("");
    return '<div class="settle">' +
      '<div class="se-head">المقاصّة — أقلّ التحويلات تُصفّي الجميع</div>' +
      '<div class="se-big"><span>' + v.beforeCount + "</span> التزامًا <em>⟶</em> <span>" + v.afterCount + "</span> تحويلان</div>" +
      '<div class="se-card">' + transfers + "</div>" +
      '<div class="se-proof ' + (v.conserved ? "ok" : "bad") + '">' + (v.conserved
        ? "✓ برهان الحفظ: مجموع صافي المراكز = 0 — لا ريال يُخلق ولا يضيع، ولا فائدة"
        : "✗ خلل في الحفظ") + "</div>" +
      '<div class="se-legs"><div class="se-sub">رِجل كلِّ عضوٍ (يوافق عليها قبل التنفيذ · مقاصّةٌ بالتراضي):</div>' + legs + "</div>" +
      '<div class="se-note">لا أحد يدفع أكثر ممّا عليه؛ المصرف يحسب ويشهد، والمال مالكم.</div>' +
    "</div>";
  }

  App.registerScreen({ key: "settle", label: "المقاصّة", icon: "🔗", render: render });
})();
