/* ============================================================================
   tests/app/webapp-showcase.test.cjs — the desktop Web-App showcase page
   (webapp/index.html): one page, every service visible, seeded demo data.

   Guards (same spine as everything else):
   - determinism: no Date.now / new Date( / Math.random / Intl / toLocaleString
   - offline: no external src/href/import/fetch — fonts are local files
   - spine wording: band WORD (never a number), (محاكاة) tags, the four refusals
   - all major service sections actually present in the one page
============================================================================ */
const fs = require("fs");
const path = require("path");

let passed = 0, failed = 0;
const ok = (c, n) => c ? (passed++, console.log("  ✓ " + n)) : (failed++, console.log("  ✗ " + n));

const PAGE = path.join(__dirname, "..", "..", "webapp", "index.html");
ok(fs.existsSync(PAGE), "webapp/index.html exists");
if (!fs.existsSync(PAGE)) { console.log("WEBAPP-SHOWCASE: " + passed + " passed, " + failed + " failed"); process.exit(1); }
const html = fs.readFileSync(PAGE, "utf8");

/* ---- determinism (display page, still no clock/random anywhere) ---- */
ok(html.indexOf("Date.now") < 0, "no Date.now");
ok(html.indexOf("new Date(") < 0, "no new Date(");
ok(html.indexOf("Math.random") < 0, "no Math.random");
ok(html.indexOf("toLocaleString") < 0, "no toLocaleString");
ok(html.indexOf("Intl.") < 0, "no Intl");
ok(html.indexOf("2026-06-21") >= 0, "fixed AS_OF 2026-06-21 stated on the page");

/* ---- offline: nothing loads from the network ---- */
ok(!/src\s*=\s*["']https?:/i.test(html), "no external src");
ok(!/href\s*=\s*["']https?:/i.test(html), "no external href");
ok(!/@import\s+url\(\s*["']?https?:/i.test(html), "no external @import");
ok(!/fetch\s*\(/.test(html), "no fetch calls");
ok(html.indexOf("fonts/IBMPlexSansArabic-Regular.woff2") >= 0, "local Regular font wired");
ok(html.indexOf("fonts/IBMPlexSansArabic-SemiBold.woff2") >= 0, "local SemiBold font wired");
ok(fs.existsSync(path.join(__dirname, "..", "..", "webapp", "fonts", "IBMPlexSansArabic-Regular.woff2")), "Regular woff2 file shipped");
ok(fs.existsSync(path.join(__dirname, "..", "..", "webapp", "fonts", "IBMPlexSansArabic-SemiBold.woff2")), "SemiBold woff2 file shipped");

/* ---- Arabic-first RTL ---- */
ok(/<html[^>]+lang="ar"/.test(html), 'lang="ar"');
ok(/<html[^>]+dir="rtl"/.test(html), 'dir="rtl"');

/* ---- spine wording ---- */
ok(html.indexOf("وفّى بعهوده") >= 0, "band WORD «وفّى بعهوده» present");
ok(!/نقاط\s*الثقة|درجة\s*ائتمان/.test(html), "no trust-points / credit-score language");
ok(html.indexOf("(محاكاة)") >= 0, "simulated actions carry (محاكاة) in the label");
ok(html.indexOf("لا فائدة") >= 0, "states لا فائدة");
ok(html.indexOf("لا غرامة") >= 0, "states لا غرامة");
ok(html.indexOf("لا يُقرض") >= 0, "bank never lends stated");
ok(html.indexOf("لا يحكم") >= 0, "bank never judges stated");
ok(html.indexOf("بيانات تجريبيّة") >= 0 || html.indexOf("بيانات تجريبية") >= 0, "demo-data honesty label present");
ok(html.indexOf("نايف") >= 0, "the pseudonymous viewer (نايف) is the account");

/* ---- every major service visible on the one page ---- */
[
  ["daftari", "دفتري"],
  ["netting", "المقاصّة"],
  ["jamiya", "الجمعيّة"],
  ["standing", "سُلفة بالمعروف"],
  ["open-loan", "القرض المفتوح"],
  ["proof", "سند الإثبات"],
  ["timeline", "سِجلّ الشهادة"],
  ["dispute", "محلّ خلاف"],
  ["rifq", "رِفْق"],
  ["band", "إشارة الوفاء"],
  ["impact", "أثر عهد"],
  ["billing", "الأجرة والخطط"],
  ["bounds", "الحدود"],
  ["shariah", "الأساس الشرعيّ"],
  ["daily", "قيد اليوم"],
  ["catalog", "فهرس القدرات"],
  ["settings", "الإعدادات"]
].forEach(function (pair) {
  ok(html.indexOf(pair[1]) >= 0, "section present: " + pair[1] + " (" + pair[0] + ")");
});

/* ---- red is reserved for cryptographic tamper only ---- */
ok(html.indexOf("--break") >= 0, "a dedicated --break color token exists (tamper only)");
ok(html.indexOf("العبث") >= 0, "tamper demo present");

console.log("WEBAPP-SHOWCASE: " + passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
