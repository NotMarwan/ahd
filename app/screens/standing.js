/* ============================================================================
   screens/standing.js — «سُلفة بالمعروف · قرضٌ حسنٌ قائم» render (F3).
   A STANDING two-party qard hasan: two fixed parties, one per-cycle amount, one
   sealed عهد posted per cycle key. QUIET & dignified — no due, no red, no penalty.
   Shows the ledger (posted · سُدِّد · باقٍ), each cycle's post with a short seal +
   a live tamper toggle, and a VISIBLE ⚠️ seam note that wage-linkage/Musaned is a
   documented integration seam pending counsel (OT-VAL) — it ASSERTS nothing.

   State: app.standing (the arrangement), app.standingState { tamper, repaid?, flash? }.
   The AhdApp.* handlers + state are wired by the integrator (Task 4); this screen
   only references them.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  function render(app) {
    if (!app.Standing || !app.standing) return '<div class="empty">لا توجد سُلفةٌ قائمة.</div>';
    var S = app.Standing, e = app.engine, standing = app.standing;
    var st = app.standingState || {};
    var seam = S.WAGE_LINKAGE_SEAM;
    var repaid = st.repaid || [];
    var posts = S.standingPosts(standing, e);
    var ledger = S.standingLedger(standing, e, repaid);
    var ver = S.verifyStanding(standing, e, st.tamper ? 9999 : null);
    var flash = App.flashHTML(st.flash, "standingDismiss");
    var repaidSet = {};
    repaid.forEach(function (k) { repaidSet[k] = true; });

    /* ledger strip — posted · سُدِّد · باقٍ. Amounts via App.fmtN. NO score, NO %. */
    var ledgerHTML =
      '<div class="st-ledger">' +
        '<div class="st-lcell"><div class="st-ll">أُثبِت</div><div class="st-lv">' + App.fmtN(ledger.postedMinor / 100) + ' <small>ر.س</small></div></div>' +
        '<div class="st-lcell"><div class="st-ll">سُدِّد</div><div class="st-lv paid">' + App.fmtN(ledger.repaidMinor / 100) + ' <small>ر.س</small></div></div>' +
        '<div class="st-lcell"><div class="st-ll">باقٍ</div><div class="st-lv rem">' + App.fmtN(ledger.outstandingMinor / 100) + ' <small>ر.س</small></div></div>' +
      '</div>';

    /* the cycle posts — one sealed عهد per cycle key, each with a short seal. */
    var postsHTML = posts.map(function (p) {
      var done = !!repaidSet[p.cycleKey];
      return '<div class="st-post' + (done ? " done" : "") + '">' +
        '<div class="st-pk">دورة ' + App.esc(p.cycleKey) + '</div>' +
        '<div class="st-pa">' + App.fmtN(p.principalMinor / 100) + ' <small>ر.س</small></div>' +
        '<div class="st-ps">' + App.esc(done ? "سُدِّد ✓" : "قائم — متى ما تيسّر") + '</div>' +
        '<div class="st-ph">SEAL: ' + App.esc(e.short(p.seal, 20)) + '…</div>' +
      '</div>';
    }).join("");

    /* the ⚠️ COUNSEL seam note — visible, derived from WAGE_LINKAGE_SEAM. Asserts nothing. */
    var seamHTML =
      '<div class="st-seam" role="note">' +
        '<div class="st-seam-h">⚠️ حدُّ تكاملٍ موثّق — بانتظار المراجعة الشرعيّة (OT-VAL)</div>' +
        '<div class="st-seam-b">' +
          'ربط هذه السُّلفة بالراتب أو بمنصّة «مساند» (توطين رواتب العمالة المنزليّة) ' +
          'هو حدُّ تكاملٍ موثّق لم يُبتّ فيه بعد؛ ' +
          'musanedIntegration = ' + (seam.musanedIntegration ? "true" : "false") + '، ' +
          'needsCounselSignOff = ' + (seam.needsCounselSignOff ? "true" : "false") + '. ' +
          'لا يُقرّر التطبيق هنا حكمًا نظاميًّا ولا شرعيًّا — يُحال لأهل الاختصاص.' +
        '</div>' +
      '</div>';

    return '<div class="standing">' + flash +
      '<div class="st-head">سُلفةٌ بالمعروف — قرضٌ حسنٌ قائمٌ بين طرفين</div>' +
      '<div class="st-parties">' +
        '<span class="st-party lender">' + App.esc(standing.lender) + '</span>' +
        '<span class="st-arrow" aria-hidden="true">↻</span>' +
        '<span class="st-party borrower">' + App.esc(standing.borrower) + '</span>' +
      '</div>' +
      '<div class="st-per">في كلّ دورة: <strong>' + App.fmtN(standing.perCycleMinor / 100) + '</strong> ر.س · ' +
        App.esc(String((standing.cycleKeys || []).length)) + ' دورات</div>' +
      '<div class="st-hero-num">' + App.fmtN(ledger.outstandingMinor / 100) + ' <small>ر.س باقٍ</small></div>' +
      ledgerHTML +
      '<div class="st-note">سُلفةٌ قائمةٌ متجدّدة — لا موعد، لا تذكير، لا حرج. في كلّ دورةٍ يُختم عهدٌ واحد، يُسدَّد متى ما تيسّر، بلا أيّ زيادة.</div>' +
      '<div class="st-posts-h">العهود المختومة · دورةً دورة</div>' +
      '<div class="st-posts">' + postsHTML + '</div>' +
      '<div class="st-terms">' + App.esc(S.standingTermsAr(standing, e)) + '</div>' +
      '<div class="st-verify">' +
        '<div class="st-vl">التحقّق من ختم الترتيب القائم</div>' +
        '<div class="sv ' + (ver.ok ? "ok" : "bad") + '">' + (ver.ok ? "✓ الوثيقة سليمة — مطابقة للختم" : "✗ عبثٌ مكشوف! الختم لا يطابق") + '</div>' +
        '<button class="mini" onclick="AhdApp.standingTamperToggle()">' + (st.tamper ? "أعد الأصل" : "🧪 جرّب العبث بالمبلغ") + '</button>' +
      '</div>' +
      seamHTML +
    '</div>';
  }

  App.registerScreen({ key: "standing", label: "سُلفة بالمعروف", icon: "🔁", render: render });
})();
