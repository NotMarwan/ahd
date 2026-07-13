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

    /* «رِفْق» — mercy-first clearing (I-L1, docs/superpowers/plans/2026-07-13-
       ceiling-break-8-9-plan.md §1.2): a CONSENTED-hardship debtor is excluded
       from forced set-off; her obligations are held aside at the ORIGINAL
       amount and sealed as a grace event; the GOLDEN netting still compresses
       everyone else. Additive: OFF by default, the baseline view above is
       unaffected either way. Fixture declaration only (a real build gathers
       this from an on-screen حالة عسر flow) — never inferred from history. */
    var Rf = app.Rifq;
    var rifqActive = !!(Rf && app.rifqState && app.rifqState.active);
    var rifqBtn = Rf ? ('<button class="rifq-toggle' + (rifqActive ? " on" : "") + '" onclick="AhdApp.rifqToggle()">🤲 رِفْق — نظرة إلى ميسرة' +
      (rifqActive ? " (مُفعَّل)" : "") + "</button>") : "";
    var rifqPanel = "";
    if (rifqActive) {
      var debtorId = app.rifqState.debtorId;
      var decl = [{ debtorId: debtorId, creditorConsent: true, witnessedAt: app.rifqState.witnessedAt }];
      var rr = Rf.applyRifq(edges, decl, e);
      var rc = Rf.rifqConservation(edges, decl, e);
      var deferredSAR = rr.deferred.reduce(function (a, ed) { return a + ed.amount; }, 0);
      var sparedRows = rr.deferred.map(function (ed) {
        return '<div class="se-row rifq-deferred"><span>' + App.esc(ed.from) + " مؤجَّلٌ عن " + App.esc(ed.to) + "</span><b>" + App.fmtN(ed.amount) + " ر.س</b></div>";
      }).join("");
      var restRows = rr.netted.map(function (t) {
        return '<div class="se-row"><span>' + App.esc(t.from) + " تدفع " + App.esc(t.to) + "</span><b>" + App.fmtN(t.amount) + " ر.س</b></div>";
      }).join("");
      var graceHead = (rr.grace && rr.grace.head)
        ? (typeof e.short === "function" ? e.short(rr.grace.head, 24) : String(rr.grace.head).slice(0, 24)) : "";
      var okAll = rc.partitionOk && rc.netsPreserved;
      rifqPanel = '<div class="rifq-panel">' +
        '<div class="rifq-h">🤲 رِفْق — «' + App.esc(debtorId) + '» أعلنت العُسر، وشهد دائنوها بالموافقة</div>' +
        (rr.deferred.length
          ? ('<div class="rifq-note">مُستثناةٌ من المقاصّة القسريّة الآن — دَينها الأصليّ (<b>' + App.fmtN(deferredSAR) +
              '</b> ر.س) مؤجَّلٌ كما هو، بلا أيّ نقصان إلّا أن يتبرّع الدائن بإبراء. ﴿وَإِن كَانَ ذُو عُسْرَةٍ فَنَظِرَةٌ إِلَىٰ مَيْسَرَةٍ﴾ (٢٨٠).</div>' +
              '<div class="se-sub">مؤجَّلٌ بالمعروف (' + App.digit(rr.deferred.length) + "):</div>" + sparedRows)
          : ('<div class="rifq-note">لا التزامَ على «' + App.esc(debtorId) + '» في هذه الشبكة حاليًّا — فلا شيء يُؤجَّل، وتستمرّ المقاصّة كما هي.</div>')) +
        '<div class="se-sub">والبقيّة تُقاصّ كالمعتاد (' + App.digit(rr.netted.length) + (rr.netted.length === 1 ? " تحويل" : " تحويلات") + "):</div>" + (restRows || '<div class="se-note">لا تحويل مطلوب — الباقون متوازنون.</div>') +
        '<div class="se-proof ' + (okAll ? "ok" : "bad") + '">' + (okAll
          ? "✓ برهان الحفظ يصمد مع رِفْق أيضًا: المؤجَّل + المقاصّ = الأصل، ومركز كلٍّ محفوظ — بالهللة"
          : "✗ خلل في الحفظ") + "</div>" +
        (graceHead ? ('<div class="rifq-seal">التأجيل ذاته حدثٌ مختومٌ مستقلٌّ في السلسلة الذهبيّة: <code>' + App.esc(graceHead) + "…</code></div>") : "") +
        '<div class="rifq-gate">شهادةٌ لا حكم: عهدٌ يُثبت الإعلان والموافقة والتأجيل، ولا يقرّر هل العُسر حقيقيّ.</div>' +
      "</div>";
    }

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

    /* Front D: the national compression SCENARIO — Ahd's netting ratio, computed
       (live, from the golden engine) over 12 hand-built SYNTHETIC test circles —
       never "measured" over real usage — projected at the scale of the cited
       execution-court load (EVIDENCE-BRIEF D-1). Illustrative, integer, provenance
       kept separate, the synthetic-data caveat carried ON the card (not only in
       the impact screen's sources panel).
       Data-rigor fix D1: the headline is now a p10-p90 SENSITIVITY BAND
       (features/impact-band.js — 200 deterministic synthetic circles, golden
       netting reused via DI) instead of one fragile single ratio. The old
       single point (features/impact-national.js) is kept only as a labelled
       reference value shown to sit INSIDE the band — never the headline number
       anymore, never recomputed, never blended with the band's own model. */
    var Imp = (typeof window !== "undefined") ? window.Impact : null;
    var IN = (typeof window !== "undefined") ? window.ImpactNational : null;
    var Bnd = (typeof window !== "undefined") ? window.ImpactBand : null;
    var natCard = "";
    if (Imp && IN) {
      var measured = Imp.computeImpact(Imp.FIXTURE_CIRCLES, Imp.makeSettleFn(e)).totals;
      var sc = IN.scenario(measured, IN.EXTERNAL_STAT);
      var circlesCount = Imp.FIXTURE_CIRCLES.length;
      var grp = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); };
      var bandLine = "";
      if (Bnd) {
        var bnd = Bnd.band(Imp.makeSettleFn(e), IN.EXTERNAL_STAT.requests);
        var avoidedBest = bnd.requests - bnd.projectedP10, avoidedWorst = bnd.requests - bnd.projectedP90;
        bandLine = '<div class="se-nat-proj">' + App.esc(Bnd.LABEL) + ': نسبةُ الانضغاط تتفاوت بتفاوت شكل الدائرة — نموذجٌ حتميٌّ على <b>' +
          App.digit(String(bnd.circlesCount)) + '</b> دائرةَ اختبارٍ توليديّة (أحجام <b>' + App.digit(String(bnd.minSize)) + '–' + App.digit(String(bnd.maxSize)) +
          '</b> أعضاء، بأنماط دوائر عهد الاثنتي عشرة نفسها)؛ توضيحيًّا، لو انطبقت على تلك الطلبات: من نحو <b>' + App.digit(String(bnd.projectedP10Thousands)) +
          ' ألف</b> إلى نحو <b>' + App.digit(String(bnd.projectedP90Thousands)) + ' ألف</b> تسويةٍ بدل <b>' + App.digit(grp(sc.requests)) +
          '</b> — أي من نحو <b>' + App.digit(String(Math.floor(avoidedWorst / 1000))) + '</b> إلى <b>' + App.digit(String(Math.floor(avoidedBest / 1000))) +
          ' ألف</b> مطالبةٍ أقلّ. نقطةُ عهد الأصليّة أعلاه (نسبة الدوائر الاثنتي عشرة نفسها، دون تنويعٍ): نحو <b>' +
          App.digit(String(sc.projectedThousands)) + ' ألف</b> — وسيطٌ تقع داخل هذا النطاق، لا حدٌّ مقاس.</div>';
      }
      natCard = '<div class="se-nat">' +
        '<div class="se-nat-h">لو صمدت نفس النسبة على حجم المشكلة الوطنيّة</div>' +
        '<div class="se-nat-anchor">سنداتُ الأمر هي الفئةُ الأكبر أمام محاكم التنفيذ: <b>' + App.esc(sc.sharePer100) + '</b> من كلّ ١٠٠ طلب — <b>' + App.digit(grp(sc.requests)) + '</b> طلبًا، <b>' + App.esc(sc.enforcementSAR_B) + '</b> مليار ريال (' + App.digit(String(sc.months)) + ' شهرًا).</div>' +
        (bandLine || ('<div class="se-nat-proj">نسبةُ الضغط في دوائر عهد التجريبيّة (<b>' + App.digit(grp(sc.ratioObligations)) + '</b> التزامًا ← <b>' + App.digit(grp(sc.ratioTransfers)) + '</b> تحويلًا) — توضيحيًّا، لو انطبقت على تلك الطلبات: نحو <b>' + App.digit(String(sc.projectedThousands)) + ' ألف</b> تسويةٍ بدل <b>' + App.digit(grp(sc.requests)) + '</b> — أي نحو <b>' + App.digit(String(sc.avoidedThousands)) + ' ألف</b> مطالبةٍ أقلّ.</div>')) +
        '<div class="se-nat-caveat">⚠️ النسبةُ نفسُها محسوبةٌ على <b>' + App.digit(String(circlesCount)) + '</b> دائرةَ اختبارٍ مُركَّبةً يدويًّا (بيانات تجريبيّة) — لا استخدامًا حقيقيًّا؛ الأرقام أعلاه تقريبيّة عمدًا، لا نتيجةَ قياسٍ.</div>' +
        '<div class="se-nat-label">🟡 ' + App.esc(sc.label) + ' — المصدر: ' + App.esc(sc.source) + '، ' + App.esc(sc.vintage) + '. القضايا ليست دوائرَ متبادلةً بالضرورة؛ الغرضُ إظهارُ قوّة النسبة لا التنبّؤ.</div>' +
      "</div>";
    }

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
      rifqBtn + rifqPanel +
      natCard +
      '<div class="se-members"><div class="se-sub">مركز كلِّ عضوٍ (لم يتغيّر — المقاصّة تُقلِّل التحويلات لا الحقوق):</div>' + members + "</div>" +
      '<div class="se-legs"><div class="se-sub">رِجل كلِّ عضوٍ — حوالةٌ بالتراضي يوافق عليها قبل التنفيذ:</div>' + legs + "</div>" +
      '<div class="se-note">لا أحد يدفع أكثر ممّا عليه؛ المصرف يحسب ويشهد، والمال مالكم.</div>' +
      /* contextual bridge to «أثر عهد» (JL-3) — the same netting, measured across cohorts */
      '<button class="se-impact-chip" onclick="AhdApp.go(\'impact\')">📊 أثر عهد — الأثر عبر الدوائر</button>' +
    "</div>";
  }

  App.registerScreen({ key: "settle", label: "المقاصّة", icon: "🔗", render: render });
})();
