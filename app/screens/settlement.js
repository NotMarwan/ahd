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
    var P = (typeof window !== "undefined") ? window.SettlePresets : null;
    var presetKey = (app.settleState && app.settleState.preset) || "golden";
    var edges = P ? P.edgesFor(presetKey, e) : e.IOUS;
    var v = S.settlementView(edges, e);
    var cp = S.conservationProof(edges, e);
    var chips = P ? '<div class="se-presets">' + P.PRESETS.map(function (p) {
      var on = p.key === presetKey;
      return '<button class="fchip' + (on ? " on" : "") + '" onclick="AhdApp.settlePreset(\'' + p.key + '\')">' + App.esc(p.labelAr) + "</button>";
    }).join("") + "</div>" : "";
    var transfers = v.after.map(function (t) {
      return '<div class="se-row"><span>' + App.esc(t.from) + " تدفع " + App.esc(t.to) + "</span><b>" + App.fmtN(t.amount) + " ر.س</b></div>";
    }).join("");
    var legs = v.legs.map(function (m) {
      var pays = (m.pays || []).map(function (p) { return "يدفع " + App.esc(p.to) + " " + App.fmtN(p.amount); });
      var gets = (m.gets || []).map(function (g) { return "يقبض من " + App.esc(g.from) + " " + App.fmtN(g.amount); });
      return '<div class="se-leg"><b>' + App.esc(m.name) + "</b><span>" + (pays.concat(gets).join(" · ") || "متوازن — لا دفع ولا قبض") + "</span></div>";
    }).join("");
    /* the strong proof, made visible: every member's net is identical before & after */
    var members = cp.perMember.map(function (m) {
      var role = m.netBefore > 0 ? "يقبض صافيًا" : (m.netBefore < 0 ? "يدفع صافيًا" : "متوازن");
      var amt = m.netBefore === 0 ? "" : " " + App.fmtN(Math.abs(m.netBefore)) + " ر.س";
      return '<div class="se-mem"><b>' + App.esc(m.name) + "</b>" +
        '<span class="se-mem-net">' + role + amt + "</span>" +
        '<span class="se-mem-ok' + (m.preserved ? "" : " bad") + '">' + (m.preserved ? "نفسه قبل وبعد ✓" : "تغيّر ✗") + "</span></div>";
    }).join("");
    var okProof = cp.conserved && cp.netsPreserved;
    return '<div class="settle">' +
      '<div class="se-head">المقاصّة — أقلّ التحويلات تُصفّي الجميع</div>' +
      chips +
      '<div class="se-big"><span>' + App.digit(v.beforeCount) + "</span> التزامًا <em>⟶</em> <span>" + App.digit(v.afterCount) + "</span> " +
        (v.afterCount === 1 ? "تحويل" : v.afterCount === 2 ? "تحويلان" : "تحويلات") + "</div>" +
      '<div class="se-card">' + transfers + "</div>" +
      '<div class="se-proof ' + (okProof ? "ok" : "bad") + '">' + (okProof
        ? "✓ برهان الحفظ: مجموع الصافي = 0، ومركز كلِّ عضوٍ نفسُه قبل وبعد — لا ريال يُخلق ولا يضيع، ولا فائدة"
        : "✗ خلل في الحفظ") + "</div>" +
      '<div class="se-moved">المال المتحرّك: <b>' + App.fmtN(cp.moneyMovedBefore) + '</b> ر.س لو سُدِّدت منفردةً ⟶ <b>' + App.fmtN(cp.moneyMovedAfter) + '</b> ر.س بالمقاصّة — حركةٌ أقلّ، ومراكزُ محفوظة.</div>' +
      '<div class="se-members"><div class="se-sub">مركز كلِّ عضوٍ (لم يتغيّر — المقاصّة تُقلِّل التحويلات لا الحقوق):</div>' + members + "</div>" +
      '<div class="se-legs"><div class="se-sub">رِجل كلِّ عضوٍ — حوالةٌ بالتراضي يوافق عليها قبل التنفيذ:</div>' + legs + "</div>" +
      '<div class="se-note">لا أحد يدفع أكثر ممّا عليه؛ المصرف يحسب ويشهد، والمال مالكم.</div>' +
      /* contextual bridge to «أثر عهد» (JL-3) — the same netting, measured across cohorts */
      '<button class="se-impact-chip" onclick="AhdApp.go(\'impact\')">📊 أثر عهد — الأثر عبر الدوائر</button>' +
    "</div>";
  }

  App.registerScreen({ key: "settle", label: "المقاصّة", icon: "🔗", render: render });
})();
