/* ============================================================================
   screens/proof.js — «حافظة الإثبات» (proof-pack / evidence export). A CONTEXTUAL
   screen (reached from دفتري «صدّر السجلّ», not a nav pill). Shows the canonical
   content, the SHA-256 content hash, the genesis→block chain, and a LIVE
   tamper-verify: «جرّب العبث» mutates the amount → the seal breaks (✗); «أصلِح»
   restores it (✓). The proof stands on cryptography, not the bank's judgment.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  function render(app) {
    var e = app.engine, PF = app.Proof, st = app.proofState;
    if (!PF) return '<div class="empty">وحدة الإثبات غير محمّلة.</div>';
    var r = app.recordById(st.recordId) || app.records[0];
    if (!r) return '<div class="empty">لا يوجد عهد لعرض وثيقته.</div>';

    var pack = PF.buildProofPack(r, e);
    var tamperSAR = r.amountSAR + 4000;                       // an obvious mutation for the demo
    var v = st.tamper ? PF.verifyProof(r, e, tamperSAR) : PF.verifyProof(r, e);
    var canon = st.tamper ? PF.proofCanonical(r, e, tamperSAR) : pack.canonical;
    var shownSeal = st.tamper ? v.recomputed : pack.seal;
    var flash = st.flash ? '<div class="flash" onclick="AhdApp.proofDismiss()">' + App.esc(st.flash) + ' <span class="x">×</span></div>' : "";

    return '<div class="proof">' +
      '<button class="pf-back" onclick="AhdApp.proofBack()">→ رجوع إلى دفتري</button>' + flash +
      '<div class="pf-head">حافظة الإثبات</div>' +
      '<div class="pf-sub">عهد «' + App.esc(r.lender) + '» لـ «' + App.esc(r.borrower) + '» — ' + e.fmt(r.amountSAR) +
        ' ر.س. وثيقةٌ مختومة تقف على التعمية لا على حكم المصرف — مقبولةٌ كدليلٍ إلكتروني (نظام الإثبات).</div>' +
      '<div class="pf-doc">' +
        '<div class="pl">المحتوى المُوثَّق (canonical)</div>' +
        '<div class="pf-can">' + App.esc(canon) + '</div>' +
        '<div class="pf-hash">content hash: ' + App.esc(v.contentHash) + '</div>' +
        '<div class="pf-chain"><div>سلسلة الختم (hash-chain):</div>' +
          '<div class="lk">genesis: ' + App.esc(pack.chain[0].hash) + '</div>' +
          '<div class="lk">block #1 seal: ' + App.esc(shownSeal) + '</div></div>' +
      '</div>' +
      '<div class="pf-verify ' + (v.ok ? "ok" : "bad") + '">' +
        (v.ok ? '✓ سليمة — تطابق الختمُ الأصلي، لم تُمَسّ' : '✗ عبثٌ مكشوف — تغيّر الختم (' + e.fmt(r.amountSAR) + '→' + e.fmt(tamperSAR) + ')، فلا تُقبل') +
      '</div>' +
      '<div class="pf-act">' +
        '<button class="' + (st.tamper ? "" : "primary") + '" onclick="AhdApp.proofTamperToggle()">' + (st.tamper ? "أصلِح الوثيقة" : "جرّب العبث بالمبلغ 🧪") + '</button>' +
        '<button onclick="AhdApp.proofExport()">صدّر / شارك الوثيقة</button>' +
      '</div>' +
      '<div class="pf-note">المصرف يشهد ويحفظ — لا يحكم بين الطرفين. الوثيقة لكما، ودليلٌ عند الحاجة.</div>' +
    '</div>';
  }

  App.registerScreen({ key: "proof", label: "الإثبات", icon: "🔏", render: render });
})();
