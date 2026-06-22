/* ============================================================================
   screens/circle-adv.js — advanced Circle demo (Agent-1 v2 + Agent-4 v2).
   Four panels: بالأصناف split · recurring auto-post · graduation قَيْد→عهد ·
   mode-B pledge sketch (with a visible Shariah-review guard). Display-only over
   the circle-adv logic; the only state is the graduation result.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  function arMonth(key, e) { var p = key.split("-"); return ((e.AR_MONTHS || [])[(+p[1]) - 1] || key) + " " + p[0]; }
  function rowsFromShares(shares, e) {
    return Object.keys(shares).map(function (n) {
      return '<div class="ca-line"><span>' + App.esc(n) + "</span><span>" + App.fmtN(shares[n] / 100) + " ر.س</span></div>";
    }).join("");
  }

  function render(app) {
    var e = app.engine, CA = app.CircleAdv;
    if (!CA) return '<div class="empty">وحدة الدائرة المتقدّمة غير محمّلة.</div>';
    var st = app.circleAdvState;
    var flash = st.flash ? '<div class="flash" onclick="AhdApp.circleAdvDismiss()">' + App.esc(st.flash) + ' <span class="x">×</span></div>' : "";

    /* 1 · بالأصناف */
    var items = [
      { label: "ستيك", amountMinor: e.toMinor(300), assignedTo: ["خالد"] },
      { label: "بيتزا مشتركة", amountMinor: e.toMinor(200), assignedTo: ["خالد", "ريم", "نورة"] },
      { label: "عصائر", amountMinor: e.toMinor(90), assignedTo: ["ريم", "نورة"] }
    ];
    var bc = CA.byCategorySplit(items, ["خالد", "ريم", "نورة"], e);
    var pAsnaf = '<div class="ca-card"><div class="ca-h">تقسيم بالأصناف · عشاء الخميس</div>' +
      '<div class="ca-sub">كلٌّ يدفع عمّا طلب — والمجموع محفوظٌ بالهللة (' + App.fmtN(bc.totalMinor / 100) + ' ر.س)</div>' +
      rowsFromShares(bc.shares, e) +
      '<div class="ca-ok">' + (bc.conserved ? "✓ المجموع محفوظ تمامًا — لا كَسْر يخلق ربا" : "✗ خلل في الحفظ") + "</div></div>";

    /* 2 · recurring */
    var tmpl = { name: "الإيجار", amountMinor: e.toMinor(3600), payer: "تركي", members: ["سعود", "تركي", "عبدالله"], split: "equal" };
    var posts = CA.recurringPosts(tmpl, ["2026-07", "2026-08", "2026-09"]);
    var pRec = '<div class="ca-card"><div class="ca-h">قِسْمة دائمة · الإيجار</div>' +
      '<div class="ca-sub">' + App.fmtN(tmpl.amountMinor / 100) + ' ر.س · كل شهر · يدفع تركي ثم تُقسَّم بالتساوي</div>' +
      posts.map(function (p) {
        return '<div class="ca-line"><span>' + arMonth(p.cycleKey, e) + "</span><span>نصيب سعود وعبدالله: " + App.fmtN(p.owed["سعود"] / 100) + " ر.س لكلٍّ</span></div>";
      }).join("") +
      '<div class="ca-note">تُنشَر تلقائيًّا كل شهر — «عدّل» / «أوقف» متاحة دائمًا، بلا فائدة ولا غرامة.</div></div>';

    /* 3 · graduation */
    var pGrad;
    if (st.graduated) {
      var g = st.graduated;
      pGrad = '<div class="ca-card grad"><div class="ca-h">صار عهدًا موثّقًا · ' + App.esc(g.borrower) + "</div>" +
        '<div class="ca-sub">' + App.esc(g.lender) + " ← " + App.esc(g.borrower) + " · " + App.fmtN(g.principalMinor / 100) + ' ر.س · قرضٌ مفتوح «متى ما تيسّر»</div>' +
        '<div class="ca-seal">SEAL: ' + App.esc(e.short(g.seal, 24)) + "…</div>" +
        '<div class="ca-prov">من دائرة «' + App.esc(g.provenance.circleName) + "» — حُفِظت الصلة (provenance)</div></div>";
    } else {
      pGrad = '<div class="ca-card"><div class="ca-h">تخريج قَيْد → عهد</div>' +
        '<div class="ca-sub">المبلغ بينك وبين تركي صار ١٬٥٠٠ ر.س — تحبّ توثّقونه كعهدٍ مكتوب؟</div>' +
        '<button class="primary" onclick="AhdApp.circleGraduate()">وثّقها كعهد</button>' +
        '<div class="ca-note">«عهد» يَعرِض، ولا يفرض — يبقى في الميزان إن شئت.</div></div>';
    }

    /* 4 · mode B pledge sketch — with the visible Shariah-review guard */
    var ps = CA.pledgeSketch({ name: "رحلة العلا", goalMinor: e.toMinor(8000) }, ["لُجين", "نورة", "سارة", "خالد"], e);
    var pPledge = '<div class="ca-card pledge"><div class="ca-h">نجمع للهدف معًا · ' + App.esc(ps.name) + " (مسودّة)</div>" +
      '<div class="ca-sub">الهدف ' + App.fmtN(ps.totalMinor / 100) + " ر.س · " + ps.pledges.length + " متعهّدين</div>" +
      ps.pledges.map(function (p) { return '<div class="ca-line"><span>' + App.esc(p.member) + "</span><span>تعهّد " + App.fmtN(p.amountMinor / 100) + " ر.س</span></div>"; }).join("") +
      '<div class="ca-warn">⚠️ تعهّدٌ فقط — لا وديعةٌ مجمّعة يحفظها المصرف. هذا النمط (ب) يحتاج مراجعةً شرعيّة قبل الإطلاق.</div></div>';

    return '<div class="circleadv">' + flash + pAsnaf + pRec + pGrad + pPledge + "</div>";
  }

  App.registerScreen({ key: "circle-adv", label: "الدائرة+", icon: "🔁", render: render });
})();
