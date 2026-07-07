/* ============================================================================
   screens/proof.js — «حافظة الإثبات» (proof-pack / neutral exhibit). A CONTEXTUAL
   screen reached from دفتري OR from محلّ خلاف (then framed as the neutral exhibit).
   Shows the record's PROVENANCE (سَنَد), the raw canonical content, the
   genesis→content→seal hash-chain, and a LIVE, PRECISE tamper demo: «جرّب العبث»
   mutates the amount → the exact changed field + the diverging seal are shown.
   The proof stands on cryptography, not the bank's judgment.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  function shortH(e, h, n) { return (typeof e.short === "function") ? e.short(h, n) : String(h).slice(0, n); }

  function render(app) {
    var e = app.engine, PF = app.Proof, st = app.proofState;
    if (!PF) return '<div class="empty">وحدة الإثبات غير محمّلة.</div>';
    var r = st.recordId ? app.recordById(st.recordId) : null;
    if (!r) return '<div class="empty">اختر عهدًا من دفترك أوّلًا لعرض وثيقته المختومة.</div>';

    var pv = PF.provenance(r, e);
    var pack = PF.buildProofPack(r, e);
    var tamperSAR = r.amountSAR + 4000;                        // an obvious mutation for the demo
    var tr = PF.tamperReport(r, e, st.tamper ? tamperSAR : null);
    var canon = st.tamper ? PF.proofCanonical(r, e, tamperSAR) : pack.canonical;
    var flash = App.flashHTML(st.flash, "proofDismiss");

    var backLabel = st.fromDispute ? "→ رجوع إلى الخلاف" : "→ رجوع إلى دفتري";
    var exhibit = st.fromDispute
      ? '<div class="pf-exhibit">⚖️ هذه الوثيقة <b>دليلٌ محايد</b> — تُقدَّم للطرفين وللقضاء عند الحاجة. عهد يحفظها كما خُتمت، ويشهد ولا يحكم.</div>'
      : "";

    var sched = pv.open
      ? '<div class="pv-row"><span>السداد</span><b>مفتوح · متى ما تيسّر</b></div>'
      : pv.schedule.map(function (s) {
          return '<div class="pv-row"><span>قسط ' + App.digit(s.n) + '</span><b>' + App.fmtN(s.amountMinor / 100) + " ر.س · " + App.esc(App.digit(s.dueISO || "")) + "</b></div>";
        }).join("");
    var prov = '<div class="pf-prov"><div class="pl">سَنَد العهد · provenance</div>' +
      '<div class="pv-row"><span>الطرفان</span><b>' + App.esc(pv.lender) + " ← " + App.esc(pv.borrower) + "</b></div>" +
      '<div class="pv-row"><span>الأصل</span><b>' + App.fmtN(pv.principalSAR) + ' ر.س</b></div>' +
      '<div class="pv-row"><span>النوع</span><b>' + App.esc(pv.type) + "</b></div>" + sched +
      '<div class="pv-row"><span>الحالة</span><b>' + App.esc(pv.statusAr || "مُوثَّق") + "</b></div>" +
      '<div class="pv-row"><span>التوثيق</span><b>' + App.esc(pv.witnessedVia) + "</b></div>" +
      '<div class="pv-row"><span>الأساس</span><b>﴿فاكتبوه﴾ · ' + App.esc(pv.basis) + "</b></div>" +
      '<div class="pv-row"><span>الربا</span><b>لا فائدة · لا غرامة · لا غرر</b></div></div>';

    var doc = '<div class="pf-doc"><div class="pl">المحتوى المُوثَّق (canonical — هذا ما يُختَم)</div>' +
      '<div class="pf-can">' + App.esc(canon) + "</div>" +
      '<div class="pf-hash">content hash: ' + App.esc(st.tamper ? tr.hashAfter : tr.hashBefore) + "</div></div>";

    var chain = '<div class="pf-chain2"><div class="pl">سلسلة الختم (hash-chain)</div>' +
      '<div class="ch"><span>genesis</span><code>' + App.esc(shortH(e, pack.chain[0].hash, 28)) + "…</code></div>" +
      '<div class="ch-link" aria-hidden="true">↓</div>' +
      '<div class="ch"><span>المحتوى · SHA-256</span><code>' + App.esc(shortH(e, st.tamper ? tr.hashAfter : tr.hashBefore, 28)) + "…</code></div>" +
      '<div class="ch-link" aria-hidden="true">↓</div>' +
      '<div class="ch block' + (tr.ok ? "" : " broken") + '"><span>الختم · block #1</span><code>' + App.esc(shortH(e, st.tamper ? tr.sealAfter : tr.sealBefore, 28)) + "…</code></div></div>";

    var verify = '<div class="pf-verify ' + (tr.ok ? "ok" : "bad") + '">' +
      (tr.ok ? "✓ سليمة — يطابق الختمُ الأصلي، لم تُمَسّ" : "✗ عبثٌ مكشوف — تغيّر الختم، فلا تُقبل") + "</div>";
    var diff = st.tamper
      ? '<div class="pf-diff"><div class="dd-h">الحقل المتغيّر: <b>المبلغ</b></div>' +
        '<div class="dd-row"><span>قبل</span><b>' + App.fmtN(tr.before) + ' ر.س</b></div>' +
        '<div class="dd-row"><span>بعد العبث</span><b>' + App.fmtN(tr.after) + ' ر.س</b></div>' +
        '<div class="dd-hash">الختم قبل: ' + App.esc(shortH(e, tr.sealBefore, 22)) + "…</div>" +
        '<div class="dd-hash">الختم بعد: ' + App.esc(shortH(e, tr.sealAfter, 22)) + "…</div>" +
        '<div class="dd-note">تغيّر رقمٌ واحد ⇒ تغيّر الختمُ كلّه. لا يمكن تزوير الوثيقة دون أن ينكشف.</div></div>'
      : "";

    return '<div class="proof">' +
      '<button class="pf-back" onclick="AhdApp.proofBack()">' + backLabel + "</button>" + flash + exhibit +
      '<div class="pf-head">حافظة الإثبات</div>' +
      '<div class="pf-sub">وثيقةٌ مختومة تقف على التعمية لا على حكم المصرف — مقبولةٌ كدليلٍ إلكتروني (نظام الإثبات).</div>' +
      prov + doc + chain + verify + diff +
      '<div class="pf-act">' +
        '<button class="' + (st.tamper ? "restore" : "primary") + '" onclick="AhdApp.proofTamperToggle()">' + (st.tamper ? "أصلِح الوثيقة" : "جرّب العبث بالمبلغ 🧪") + "</button>" +
        '<button onclick="AhdApp.proofExport()">صدّر / شارك الوثيقة</button>' +
      "</div>" +
      '<div class="pf-note">المصرف يشهد ويحفظ — لا يحكم بين الطرفين. الوثيقة لكما، ودليلٌ عند الحاجة.</div>' +
    "</div>";
  }

  App.registerScreen({ key: "proof", label: "الإثبات", icon: "🔏", render: render });
})();
