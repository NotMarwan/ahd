/* ============================================================================
   screens/settings.js — «الإعدادات · عن عهد». The Arabic-Indic digit toggle
   (D-2 made the user's choice), applied app-wide via App.fmtN — engine bytes
   never change, only the rendered glyphs. Plus the «ما لا نفعله» manifesto
   (the spine, stated plainly) and the Quranic basis.
============================================================================ */
(function () {
  "use strict";
  var App = (typeof window !== "undefined") ? window.AhdApp : null;
  if (!App) return;

  function render(app) {
    var S = app.Settings;
    if (!S) return '<div class="empty">وحدة الإعدادات غير محمّلة.</div>';
    var ar = app.digitMode === "arabic", hidden = !!app.privacy;
    var sample = App.fmtN(12500);   // toggle-aware (+ privacy-aware) live preview

    var nos = S.SPINE_NO.map(function (x) {
      return '<div class="set-no"><b>✕ ' + App.esc(x.t) + "</b><div>" + App.esc(x.d) + "</div></div>";
    }).join("");
    var yes = (S.SPINE_YES || []).map(function (x) {
      return '<div class="set-yes"><b>✓ ' + App.esc(x.t) + "</b><div>" + App.esc(x.d) + "</div></div>";
    }).join("");

    return '<div class="settings">' +
      '<div class="set-head">الإعدادات · عن عهد</div>' +
      '<div class="set-card">' +
        '<div class="set-lbl">نظام الأرقام</div>' +
        '<div class="set-seg">' +
          '<button class="' + (ar ? "" : "on") + '" onclick="AhdApp.setDigitMode(\'western\')">0123 — غربية</button>' +
          '<button class="' + (ar ? "on" : "") + '" onclick="AhdApp.setDigitMode(\'arabic\')">٠١٢٣ — عربية</button>' +
        "</div>" +
        '<div class="set-prev">مثال: <b>' + sample + ' ر.س</b> — يُطبَّق فورًا (والختم لا يتغيّر، فهو على المحتوى لا على شكل الأرقام).</div>' +
      "</div>" +
      '<div class="set-card">' +
        '<div class="set-lbl">الخصوصيّة · إخفاء المبالغ</div>' +
        '<div class="set-seg">' +
          '<button class="' + (hidden ? "" : "on") + '" onclick="AhdApp.setPrivacy(false)">إظهار</button>' +
          '<button class="' + (hidden ? "on" : "") + '" onclick="AhdApp.setPrivacy(true)">إخفاء •••</button>' +
        "</div>" +
        '<div class="set-prev">حين تُري شاشتك لأحد: تختفي المبالغ من التطبيق كلِّه (تُستبدَل بـ «•••»). عرضٌ فقط — لا يمسّ الوثيقة ولا الختم.</div>' +
      "</div>" +
      '<div class="set-h2">ما يفعله عهد</div>' +
      '<div class="set-yeses">' + yes + "</div>" +
      '<div class="set-h2">ما لا يفعله عهد</div>' +
      '<div class="set-nos">' + nos + "</div>" +
      '<div class="set-model">النموذج: عقدان منفصلان — قرضٌ حسن بلا أيّ زيادة بينكما، وأجرةُ خدمةٍ ثابتةٌ للمصرف على التوثيق والحفظ (لا نسبةٌ من المبلغ، ولا تزيد بالتأخير). فصلٌ تامّ بين القرض والأجرة.</div>' +
      '<div class="set-basis">﴿وَإِن كَانَ ذُو عُسْرَةٍ فَنَظِرَةٌ إِلَىٰ مَيْسَرَةٍ﴾ · ﴿وَأَن تَصَدَّقُوا خَيْرٌ لَّكُمْ﴾ (٢٨٠) — ﴿فَاكْتُبُوهُ﴾ (٢٨٢)</div>' +
      '<div class="set-about">عهد — قرضٌ حسن مكتوبٌ ومشهود، بكرامة. كلمتك محفوظة، وعلاقتك محميّة.</div>' +
    "</div>";
  }

  App.registerScreen({ key: "settings", label: "الإعدادات", icon: "⚙️", render: render });
})();
