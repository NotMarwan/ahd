/* ============================================================================
   sadu-tokens.test.cjs — W1 (Sadu design language, for real). TDD-first gate:
   (1) a real token file (app/styles/sadu-tokens.css) exists, wired offline
       (no CDN/@import), and declares a genuine palette + 3-step type scale +
       spacing rhythm + radii + motion durations derived from the canonical
       application/prototypes/dir-b-sadu.html direction;
   (2) the font-bundled status is stated HONESTLY on-disk (grep-able marker),
       never fabricated;
   (3) the HOME screen actually uses the tokens: hero numerals for the two
       دفتري totals, a distinct display face for titles, and the woven-band
       metaphor made MEANINGFUL — one real thread per witnessed عهد, coloured
       by its real status (not a decoration repeated for its own sake);
   (4) designed hover/focus/active/empty states exist for the new pieces.
   Static file checks + a headless VM render (mirrors app-dom-smoke.cjs).
============================================================================ */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..", "..");
const APP = path.join(ROOT, "app");

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };

console.log("sadu-tokens.test: W1 design-language gate (tokens + home hierarchy + weave metaphor)\n");

/* ---- [1] the token file exists and is real (not a stub) ---- */
const TOKENS_PATH = path.join(APP, "styles", "sadu-tokens.css");
console.log("[1] app/styles/sadu-tokens.css");
ok(fs.existsSync(TOKENS_PATH), "app/styles/sadu-tokens.css exists");
const tokensSrc = fs.existsSync(TOKENS_PATH) ? fs.readFileSync(TOKENS_PATH, "utf8") : "";

const MUST_VARS = [
  "--sadu-terra", "--sadu-teal", "--sadu-gold", "--sadu-ground",
  "--font-display", "--font-body",
  "--sadu-type-display", "--sadu-type-title", "--sadu-type-body", "--sadu-type-hero-num",
  "--sadu-space-1", "--sadu-space-6",
  "--sadu-r-sm", "--sadu-r-lg", "--sadu-r-pill",
  "--sadu-motion-fast", "--sadu-motion-base", "--sadu-motion-slow"
];
for (const v of MUST_VARS) ok(tokensSrc.indexOf(v + ":") >= 0, "declares " + v);

/* offline rule: no CDN, no remote font service, no @import */
ok(!/https?:\/\//.test(tokensSrc), "no http(s):// URL anywhere in the token file (offline rule)");
ok(!/@import/.test(tokensSrc), "no @import (offline rule)");
ok(!/fonts\.googleapis|fonts\.gstatic/.test(tokensSrc), "no Google Fonts reference");

/* [2] font-bundled status is stated HONESTLY on-disk — grep-able, not narrated only */
console.log("\n[2] font-bundled honesty marker");
ok(/FONT-BUNDLED:\s*false/.test(tokensSrc), "token file states FONT-BUNDLED: false (no Arabic font is vendored yet — verified: repo has zero woff2/woff/ttf/otf Arabic-script files)");
/* prove that claim: scan the whole repo (excluding node_modules/.git) for any font file */
function findFontFiles(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
  for (const e of entries) {
    if (e.name === "node_modules" || e.name === ".git") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) findFontFiles(full, out);
    else if (/\.(woff2?|ttf|otf)$/i.test(e.name)) out.push(full);
  }
  return out;
}
const fontFiles = findFontFiles(ROOT, []);
const arabicNamed = fontFiles.filter(f => /arab|kufi|naskh|sadu/i.test(f));
ok(arabicNamed.length === 0, "no bundled Arabic-script font file found in the repo — FONT-BUNDLED:false is accurate, not a shortcut (found " + fontFiles.length + " unrelated Latin font files elsewhere)");

/* [3] app/index.html wires the token file offline, before app.css */
console.log("\n[3] app/index.html wiring");
const indexSrc = fs.readFileSync(path.join(APP, "index.html"), "utf8");
ok(/href="styles\/sadu-tokens\.css"/.test(indexSrc), "index.html links styles/sadu-tokens.css");
const iTokens = indexSrc.indexOf("styles/sadu-tokens.css");
const iAppCss = indexSrc.indexOf('href="app.css"');
ok(iTokens >= 0 && iAppCss >= 0 && iTokens < iAppCss, "sadu-tokens.css loads BEFORE app.css (tokens available when app.css uses them)");

/* [4] app.css actually consumes the tokens for home hierarchy + the weave + states */
console.log("\n[4] app.css consumes the tokens (home hierarchy + weave + states)");
const appCss = fs.readFileSync(path.join(APP, "app.css"), "utf8");
ok(/\.hstat-v\{[^}]*var\(--font-display\)/.test(appCss.replace(/\s+/g, " ")) || /var\(--font-display\)/.test(appCss), "app.css references var(--font-display) (hero-numeral / title hierarchy)");
ok(/\.home-weave/.test(appCss), "app.css styles .home-weave (the meaningful band)");
ok(/\.hw-thread/.test(appCss), "app.css styles .hw-thread (one thread per عهد)");
ok(/\.hw-empty/.test(appCss), "app.css styles a designed EMPTY state (.hw-empty)");
ok(/\.hw-thread[^{]*:hover/.test(appCss) || /\.hw-thread:hover/.test(appCss), "app.css designs a HOVER state for threads");
ok(/\.hw-thread:active/.test(appCss), "app.css designs an ACTIVE state for threads");

/* ---- [5] headless render: the HOME screen actually renders the hierarchy + weave ---- */
console.log("\n[5] headless render of screens/home.js");

function makeEl() {
  const e = { _html: "", style: {}, disabled: false, value: "", dataset: {},
    classList: { s: new Set(), add(c){this.s.add(c);}, remove(c){this.s.delete(c);}, toggle(c){this.s.has(c)?this.s.delete(c):this.s.add(c);}, contains(c){return this.s.has(c);} },
    addEventListener(){}, removeEventListener(){}, focus(){}, setAttribute(){}, removeAttribute(){},
    appendChild(){}, querySelector(){return makeEl();}, querySelectorAll(){return [];} };
  Object.defineProperty(e, "innerHTML", { get(){return this._html;}, set(v){this._html=String(v);} });
  Object.defineProperty(e, "textContent", { get(){return this._html;}, set(v){this._html=String(v);} });
  return e;
}
const byId = {};
const sandbox = {
  Math, Array, Object, JSON, String, Number, Boolean, RegExp, Error, parseInt, parseFloat, isNaN, isFinite, Date: undefined,
  TextEncoder, Uint8Array, Uint16Array, Uint32Array, Int32Array, Float64Array, ArrayBuffer, DataView,
  console: { log(){}, error(){}, warn(){} },
  setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
  document: {
    body: { contains: () => true, appendChild(){} },
    getElementById: (id) => byId[id] || (byId[id] = makeEl()),
    querySelector: () => makeEl(), querySelectorAll: () => [], createElement: () => makeEl(), addEventListener(){},
  },
};
sandbox.window = sandbox; sandbox.self = sandbox; sandbox.globalThis = sandbox; sandbox.scrollTo = () => {}; sandbox.addEventListener = () => {};

vm.createContext(sandbox);
const FILES = ["engine.js", "features/home-layout.js", "features/daftari.js", "features/timeline.js", "app.js", "screens/home.js"];
let loadErr = null;
try { for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(APP, f), "utf8"), sandbox, { filename: f }); }
catch (e) { loadErr = e; }
ok(!loadErr, "engine + minimal features + app.js + screens/home.js load into one realm" + (loadErr ? "  — " + loadErr.message : ""));

const App = sandbox.AhdApp;
ok(!!App, "window.AhdApp is defined");

let hh = "";
try { App.boot(); hh = App.go("home"); } catch (e) { ok(false, "App.go('home') renders without throwing — " + e.message); }

ok(/لك عند الناس/.test(hh) && /عليك للناس/.test(hh), "home still shows the two دفتري totals (existing behaviour preserved)");
ok(/class="hstat-v"/.test(hh), "the two totals now render as HERO NUMERALS (.hstat-v), not plain inline text");
ok(/class="home-weave"/.test(hh), "home renders the .home-weave metaphor block");
ok(/كلّ قرضٍ خيط، والسجلّ نسيج/.test(hh), "the weave states the metaphor in words: «كلّ قرضٍ خيط، والسجلّ نسيج»");

const threadCount = (hh.match(/class="hw-thread /g) || []).length;
ok(threadCount === App.records.length, "one .hw-thread per real record — " + threadCount + " threads for " + App.records.length + " records (data, not decoration)");

/* the threads carry REAL status colour (reusing the app's existing tone vocabulary) */
ok(/hw-thread teal/.test(hh), "at least one thread is teal (an active, on-track عهد)");
ok(/hw-thread gold/.test(hh), "at least one thread is gold (R-KEPT — وُفِّي به, ذمّة محفوظة)");
ok(/hw-thread amber/.test(hh), "at least one thread is amber (an overdue عهد — never red, spine)");
ok(/hw-thread mute/.test(hh), "at least one thread is mute (R-DISP — محلّ خلاف, neutral)");
ok(hh.indexOf("hw-thread red") < 0 && !/tone-red/.test(hh), "no thread is ever red (spine: late is amber, never red)");

/* the empty state is real: with zero records, the weave shows a designed empty state */
const savedRecords = App.records;
App.records = [];
let hhEmpty = "";
try { hhEmpty = App.rerender(); } catch (e) { ok(false, "rerender with zero records does not throw — " + e.message); }
ok(/class="hw-empty"/.test(hhEmpty), "with zero records, the weave renders a designed EMPTY state (.hw-empty)");
ok((hhEmpty.match(/class="hw-thread /g) || []).length === 0, "the empty state renders NO thread elements");
App.records = savedRecords;

/* ============================================================================
   Iteration-2 (2026-07-13) — three adversarial critics found VERIFIED DEFECTS
   in iteration 1; each fix below is proven here, not just narrated. Plus the
   app-wide sweep: the identity band + the primary demo-path screens' titles.
============================================================================ */

/* ---- [6] defect W1-1: brand regression + monotonic type scale ---- */
console.log("\n[6] defect fix — brand regression (38→30px) + monotonic type scale");
const dispM = tokensSrc.match(/--sadu-type-display:\s*(\d+)px/);
const titleM = tokensSrc.match(/--sadu-type-title:\s*(\d+)px/);
const bodyTypeM = tokensSrc.match(/--sadu-type-body:\s*(\d+)px/);
const heroM = tokensSrc.match(/--sadu-type-hero-num:\s*(\d+)px/);
const dispV = dispM ? +dispM[1] : 0, titleV = titleM ? +titleM[1] : 0, bodyTypeV = bodyTypeM ? +bodyTypeM[1] : 0, heroV = heroM ? +heroM[1] : 0;
ok(dispV >= 38, "--sadu-type-display is >= 38px (the brand wordmark never shrinks below its original size) — is " + dispV + "px");
ok(bodyTypeV < titleV && titleV < heroV && heroV < dispV,
  "the type scale is MONOTONIC: body(" + bodyTypeV + ") < title(" + titleV + ") < hero-num(" + heroV + ") < display(" + dispV + ") — display is the largest step");
const brandRuleCount = (appCss.match(/\.hero \.brand\{/g) || []).length;
ok(brandRuleCount === 1, "app.css declares .hero .brand exactly ONCE (no second, competing rule fighting the cascade — the exact defect that silently shrank the brand 38→30px)");
ok(/\.hero \.brand\{[^}]*font-size:var\(--sadu-type-display\)/.test(appCss.replace(/\s+/g, " ")), ".hero .brand's font-size is var(--sadu-type-display) — the scale's largest, single-sourced step");

/* ---- [7] defect W1-2: --sadu-terra is consumed, meaningfully, app-wide ---- */
console.log("\n[7] defect fix — --sadu-terra consumed (meaningful, app-wide, not a sprinkle)");
const terraUses = (appCss.match(/var\(--sadu-terra\)/g) || []).length;
ok(terraUses >= 2, "--sadu-terra is used in more than one deliberate place (the app-wide seal-band mark + the primary-screen title marker — same meaning, not decoration repeated for its own sake) — found " + terraUses);
ok(/\.sadu-band::before\{[^}]*var\(--sadu-terra\)/.test(appCss.replace(/\s+/g, " ")), "the app-wide .sadu-band (rendered on EVERY screen by app.js's shell) carries a --sadu-terra seal mark");
ok(/\.dtitle,\.tl-head,\.pf-head,\.se-head,\.cr-h\{[^}]*var\(--sadu-terra\)/.test(appCss.replace(/\s+/g, " ")), "the primary demo-path screens' titles (دفتري · السجلّ · الإثبات · المقاصّة · أنشئ عهدًا) carry the same terra marker");
ok(/\.sadu-band\{[^}]*var\(--sadu-teal\)[\s\S]*?var\(--sadu-gold\)[\s\S]*?var\(--sadu-hair\)/.test(appCss), "the .sadu-band strip derives its weave colours from the Sadu tokens (not app.css's separate --teal/--gold/--line)");

/* ---- [8] defect W1-3: dead .hsummary code removed ---- */
console.log("\n[8] defect fix — dead .hsummary rules removed");
ok(!/\.hsummary/.test(appCss), "app.css no longer defines .hsummary (home.js has not emitted that class since Front A's hierarchy rewrite — orphaned rule deleted)");

/* ---- [9] defect W1-4: ONE type scale — legacy --t-hero/--t-md ALIAS the Sadu tokens ---- */
console.log("\n[9] defect fix — consolidated to ONE type scale (no parallel systems)");
ok(/--t-hero:\s*var\(--sadu-type-display\)/.test(appCss), "app.css's --t-hero ALIASES var(--sadu-type-display) — no independent literal value");
ok(/--t-md:\s*var\(--sadu-type-body\)/.test(appCss), "app.css's --t-md ALIASES var(--sadu-type-body) — no independent literal value");
ok(!/--t-hero:\s*30px/.test(appCss) && !/--t-md:\s*14px/.test(appCss), "no hardcoded duplicate 30px/14px literal remains for --t-hero/--t-md");

/* ---- [10] defect W1-5: numeral fragmentation (24/34/36/38px) — ONE hero-num token ---- */
console.log("\n[10] defect fix — hero-numeral size unified to ONE token (home · دفتري · قرض مفتوح · مقاصّة · سجلّ)");
const heroSelectors = [".tv", ".ol-rv", ".se-big span", ".hstat-v", ".tl-count-hero"];
const flatCss = appCss.replace(/\s+/g, " ");
for (const sel of heroSelectors) {
  const re = new RegExp(sel.replace(/\./g, "\\.").replace(/ /g, "\\s+") + "\\{[^}]*var\\(--sadu-type-hero-num\\)");
  ok(re.test(flatCss), sel + " uses var(--sadu-type-hero-num) — the single hero-numeral token, not its own literal size");
}

/* ---- [11] app-wide sweep: primary demo-path screens render with the Sadu treatment ---- */
console.log("\n[11] app-wide sweep — دفتري · أنشئ عهدًا · المقاصّة · سِجلّ الشهادة render with the identity band + hero numerals");
const sandbox2 = {
  Math, Array, Object, JSON, String, Number, Boolean, RegExp, Error, parseInt, parseFloat, isNaN, isFinite, Date: undefined,
  TextEncoder, Uint8Array, Uint16Array, Uint32Array, Int32Array, Float64Array, ArrayBuffer, DataView,
  console: { log(){}, error(){}, warn(){} },
  setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
  document: {
    body: { contains: () => true, appendChild(){} },
    getElementById: (id) => ({}),
    querySelector: () => makeEl(), querySelectorAll: () => [], createElement: () => makeEl(), addEventListener(){},
  },
};
sandbox2.document.getElementById = (function () { const store = {}; return (id) => store[id] || (store[id] = makeEl()); })();
sandbox2.window = sandbox2; sandbox2.self = sandbox2; sandbox2.globalThis = sandbox2; sandbox2.scrollTo = () => {}; sandbox2.addEventListener = () => {};
vm.createContext(sandbox2);
const FILES2 = ["engine.js", "features/home-layout.js", "features/refusal.js", "features/hash-diff.js", "features/riba-lint.js",
  "features/daftari.js", "features/open-loan.js", "features/circle-adv.js", "features/create.js", "features/request.js",
  "features/settlement.js", "features/settle-presets.js", "features/impact.js", "features/impact-drill.js", "features/impact-national.js",
  "features/circle.js", "features/timeline.js", "features/proof.js", "features/dispute.js", "features/settings.js",
  "features/borrower.js", "features/covenant-log.js", "features/exhibit-view.js", "features/standing-loan.js",
  "features/bounds.js", "features/bounds-detail.js", "features/billing.js", "features/fee-receipt.js", "features/org.js",
  "app.js", "screens/home.js", "screens/refusal.js", "screens/daftari.js", "screens/open-loan.js", "screens/circle-adv.js",
  "screens/create.js", "screens/request.js", "screens/settlement.js", "screens/impact.js", "screens/circle.js",
  "screens/timeline.js", "screens/proof.js", "screens/dispute.js", "screens/settings.js", "screens/borrower.js",
  "screens/covenant.js", "screens/standing.js", "screens/bounds.js", "screens/plans.js", "screens/org.js"];
let loadErr2 = null;
try { for (const f of FILES2) vm.runInContext(fs.readFileSync(path.join(APP, f), "utf8"), sandbox2, { filename: f }); }
catch (e) { loadErr2 = e; }
ok(!loadErr2, "the full app (all screens) loads into a second realm" + (loadErr2 ? "  — " + loadErr2.message : ""));

const App2 = sandbox2.AhdApp;
let hDaftari = "", hCreate = "", hSettle = "", hTimeline = "";
try {
  App2.boot();
  hDaftari = App2.go("daftari");
  hCreate = App2.go("create");
  hSettle = App2.go("settle");
  hTimeline = App2.go("timeline");
} catch (e) { ok(false, "دفتري / أنشئ عهدًا / المقاصّة / السجلّ render without throwing — " + e.message); }

ok(/class="tv"/.test(hDaftari), "دفتري still renders its hero-numeral tiles (.tv) after the token sweep");
ok(/class="se-big"/.test(hSettle), "المقاصّة still renders its hero-numeral card (.se-big) after the token sweep");
ok(/class="tl-count-hero"/.test(hTimeline), "سِجلّ الشهادة renders the NEW hero-numeral count (.tl-count-hero)");
const feedCountMatch = hTimeline.match(/class="tl-count-hero">(\d+)</);
ok(!!feedCountMatch && +feedCountMatch[1] > 0, "the timeline hero count is a real number > 0 (data, not decoration)" + (feedCountMatch ? " — is " + feedCountMatch[1] : ""));
ok(/class="sadu-band"/.test(hDaftari) && /class="sadu-band"/.test(hSettle) && /class="sadu-band"/.test(hTimeline) && /class="sadu-band"/.test(hCreate),
  "the Sadu identity band (now terra-accented, token-derived) renders on EVERY primary demo-path screen, not just home");

/* ============================================================================
   Iteration-3 (2026-07-13) — G1/G2/G3: sweep the remaining 12 screens, fold
   --t-xs/sm/lg/xl into ONE Sadu type scale, and fix the display/hero-num
   apex collision (was 38 vs 36px, a 1.05x near-tie — now a real step).
============================================================================ */

/* ---- [12] G3: apex fix — display is a REAL step above hero-num ---- */
console.log("\n[12] G3 — apex fix: --sadu-type-display is a clear step above --sadu-type-hero-num");
ok(dispV >= 42, "--sadu-type-display >= 42px (a real apex, not the old 1.05x near-tie with hero-num) — is " + dispV + "px");
ok(dispV / heroV >= 1.15, "display/hero-num ratio >= 1.15x (was 1.05x = 38/36 before this fix) — is " + (dispV / heroV).toFixed(3) + "x");

/* ---- [13] G2: --t-xs/sm/lg/xl fold into named Sadu steps (ONE scale) ---- */
console.log("\n[13] G2 — --t-xs/sm/lg/xl fold into --sadu-type-xs/sm/lg/xl (ONE scale, no independent literals)");
["xs", "sm", "lg", "xl"].forEach(function (step) {
  ok(tokensSrc.indexOf("--sadu-type-" + step + ":") >= 0, "sadu-tokens.css declares --sadu-type-" + step);
  var re = new RegExp("--t-" + step + ":\\s*var\\(--sadu-type-" + step + "\\)");
  ok(re.test(appCss), "app.css's --t-" + step + " ALIASES var(--sadu-type-" + step + ") — no independent literal value");
});

/* ---- [14] G2: hardcoded font-size literal count drops materially ---- */
console.log("\n[14] G2 — hardcoded font-size:Npx literal count in app.css drops materially");
/* baseline measured against the committed pre-iter3 app.css (git HEAD), counting
   BOTH whole (12px) and half-step (12.5px) literals — 247. Iter-2's own count of
   "143" only matched whole-px, undercounting the real total; this is the honest
   comparable number. */
const literalMatches = appCss.match(/font-size:\s*\d+(\.\d+)?px/g) || [];
console.log("  (hardcoded font-size literal count in app.css: " + literalMatches.length + " — pre-iter3 baseline was 247)");
ok(literalMatches.length <= 200, "hardcoded font-size literal count is materially down from the 247 pre-iter3 baseline — is " + literalMatches.length);

/* ---- [15] G1: the 12 remaining screens' titles carry the terra marker + display face ---- */
console.log("\n[15] G1 — the 12 remaining screens' titles carry the terra marker + display face + ONE token size");
const sweptTitleSelectors = [".cd-head", ".im-head", ".bd-head", ".rf-head", ".dp-head", ".set-head", ".bw-title", ".cv-head", ".st-head", ".pl-head", ".org-head", ".ca-scr-head"];
const flatCss2 = appCss.replace(/\s+/g, " ");
sweptTitleSelectors.forEach(function (sel) {
  var escSel = sel.replace(".", "\\.");
  var reTerra = new RegExp(escSel + "[^{]*\\{[^}]*var\\(--sadu-terra\\)");
  ok(reTerra.test(flatCss2), sel + " carries the --sadu-terra title marker");
  var reFont = new RegExp(escSel + "[^{]*\\{[^}]*var\\(--font-display\\)");
  ok(reFont.test(flatCss2), sel + " uses var(--font-display)");
  var reSize = new RegExp(escSel + "[^{]*\\{[^}]*var\\(--sadu-type-title\\)");
  ok(reSize.test(flatCss2), sel + " uses var(--sadu-type-title) — no independent raw-px title size");
});

/* ---- [16] headless render: all 12 remaining screens render with the deep sweep ---- */
console.log("\n[16] G1 — headless render: الدائرة · الدائرة+ · أثر عهد · الضمانات والحدود · ما لا يفعله عهد · محلّ خلاف · الإعدادات · ما عليّ · سِجلّ المعروف · سُلفة بالمعروف · الأجرة والخطط · لوحة المؤسسة");
let sweptHTML = {};
let sweptErr = null;
try {
  sweptHTML.circle = App2.go("circle");
  sweptHTML.circleAdv = App2.go("circle-adv");
  App2.circleGraduate();                       /* exercise the graduated hero-numeral branch */
  sweptHTML.circleAdvGrad = App2.go("circle-adv");
  sweptHTML.impact = App2.go("impact");
  sweptHTML.bounds = App2.go("bounds");
  sweptHTML.refusal = App2.go("refusal");
  App2.openDispute(App2.records[0].id);
  sweptHTML.dispute = App2.go("dispute");
  sweptHTML.settings = App2.go("settings");
  sweptHTML.borrower = App2.go("mine");
  App2.openCovenant(App2.records[0].id);
  sweptHTML.covenant = App2.go("maroof");
  sweptHTML.standing = App2.go("standing");
  sweptHTML.plans = App2.go("plans");
  sweptHTML.org = App2.go("org");
} catch (e) { sweptErr = e; }
ok(!sweptErr, "all 12 remaining screens render without throwing" + (sweptErr ? "  — " + sweptErr.message : ""));

ok(/class="cd-head"/.test(sweptHTML.circle) && /class="cd-hero-num"/.test(sweptHTML.circle), "الدائرة renders its title + a hero-numeral collected amount");
ok(/class="ca-scr-head"/.test(sweptHTML.circleAdv), "الدائرة+ renders its (new) screen-level title");
ok(/class="ca-hero-num"/.test(sweptHTML.circleAdvGrad), "الدائرة+ renders a hero-numeral principal once a قَيْد graduates to عهد");
ok(/class="im-head"/.test(sweptHTML.impact) && /class="im-card"/.test(sweptHTML.impact), "أثر عهد renders its title + hero-numeral impact cards");
ok(/class="bd-head"/.test(sweptHTML.bounds), "الضمانات والحدود renders its title with the terra marker");
ok(/class="rf-head"/.test(sweptHTML.refusal), "ما لا يفعله عهد renders its title with the terra marker");
ok(/class="dp-head"/.test(sweptHTML.dispute) && /class="dp-amt-hero"/.test(sweptHTML.dispute), "محلّ خلاف renders its title + a hero-numeral disputed amount");
ok(/class="set-head"/.test(sweptHTML.settings) && /class="set-hero-num"/.test(sweptHTML.settings), "الإعدادات renders its title + a hero-numeral live digit-toggle preview");
ok(/class="bw-title"/.test(sweptHTML.borrower) && /class="bw-tv"/.test(sweptHTML.borrower), "ما عليّ renders its title + its hero-numeral total tile");
ok(/class="cv-head"/.test(sweptHTML.covenant) && /class="cv-amt-hero"/.test(sweptHTML.covenant), "سِجلّ المعروف renders its title + a hero-numeral عهد amount");
ok(/class="st-head"/.test(sweptHTML.standing) && /class="st-hero-num"/.test(sweptHTML.standing), "سُلفة بالمعروف renders its title + a hero-numeral outstanding balance");
ok(/class="pl-head"/.test(sweptHTML.plans) && /class="pl-price"/.test(sweptHTML.plans), "الأجرة والخطط renders its title + hero-numeral plan prices");
ok(/class="org-head"/.test(sweptHTML.org) && /class="org-hero-num"/.test(sweptHTML.org), "لوحة المؤسسة renders its title + a hero-numeral outstanding balance");

/* every one of the 12 uses the shared, already-designed .empty state for its
   not-yet-wired guard branch — proven by grep on each screen source, not by
   forcing the guard (the fixtures are always wired in this harness) */
const screensDir = path.join(APP, "screens");
["circle.js", "circle-adv.js", "impact.js", "bounds.js", "refusal.js", "dispute.js", "settings.js", "borrower.js", "covenant.js", "standing.js", "plans.js", "org.js"].forEach(function (f) {
  var src = fs.readFileSync(path.join(screensDir, f), "utf8");
  ok(/class="empty"/.test(src), f + " uses the shared, designed .empty state for its not-yet-loaded guard (not a bare string)");
});

/* ============================================================================
   Iteration-4 (2026-07-13, judge-lens real-leap) — JOB 1: distinctive Arabic
   font STACK (offline half of JL-7, no download/bundling) + JOB 2: a scoped
   editorial Sadu-motif divider on home. Both additive, both gate-safe.
============================================================================ */

/* ---- [17] JOB 1: --font-display leads with a distinctive Windows-bundled
   Arabic face, THEN falls back to the exact prior stack (graceful, no
   regression on machines lacking that face) ---- */
console.log("\n[17] JOB 1 — --font-display leads with a distinctive face + preserves the graceful fallback tail");
const fontDisplayM = tokensSrc.match(/--font-display:\s*([^;]+);/);
const fontDisplayV = fontDisplayM ? fontDisplayM[1].trim() : "";
ok(fontDisplayV.length > 0, "--font-display is declared — is " + JSON.stringify(fontDisplayV));
const firstFaceM = fontDisplayV.match(/^"([^"]+)"/);
const firstFace = firstFaceM ? firstFaceM[1] : "";
ok(firstFace.length > 0 && firstFace !== "Segoe UI", "--font-display's FIRST face is a distinctive non-\"Segoe UI\" face — is \"" + firstFace + "\"");
ok(/Majalla|Typesetting|Traditional Arabic/i.test(firstFace), "the leading face is one of the verified Windows-bundled Arabic display faces — is \"" + firstFace + "\"");
ok(fontDisplayV.indexOf('"Segoe UI","Tahoma",system-ui,sans-serif') >= 0, "--font-display still ENDS with the exact prior stack (\"Segoe UI\",\"Tahoma\",system-ui,sans-serif) — machines lacking the new face render IDENTICALLY to before");

/* ---- [18] --font-body stays legibility-first (unchanged, Segoe UI-led) ---- */
console.log("\n[18] --font-body stays maximally legible — Segoe UI-led, unchanged");
const fontBodyM = tokensSrc.match(/--font-body:\s*([^;]+);/);
const fontBodyV = fontBodyM ? fontBodyM[1].trim() : "";
ok(/^"Segoe UI"/.test(fontBodyV), "--font-body's first face is still \"Segoe UI\" (body copy — money lines, legal/verse text — stays on the proven legible stack) — is " + JSON.stringify(fontBodyV));

/* ---- [19] honesty: the comment still states FONT-BUNDLED:false and does NOT
   claim a bundled/portable font — this is a stack change, not JL-7's fix ---- */
console.log("\n[19] honesty — no bundled-font claim, JL-7 (portable OFL fix) stays open");
ok(/FONT-BUNDLED:\s*false/.test(tokensSrc), "FONT-BUNDLED: false still stated (unchanged from before this stack change)");
ok(/JL-7/.test(tokensSrc), "the token file's comment cross-references JL-7 (the still-open, human/download-gated portable fix)");
ok(!/@font-face\s*\{/.test(tokensSrc), "no actual @font-face AT-RULE was added (the comment only NAMES it as future work for JL-7 — no bundling here, pure stack change, per the offline/no-download constraint)");

/* ---- [20] JOB 2: the scoped editorial Sadu-motif divider — additive CSS +
   minimal markup, on-spine, reusing the existing token palette ---- */
console.log("\n[20] JOB 2 — editorial Sadu-motif divider (home) reuses existing Sadu tokens, on-spine");
ok(/\.sadu-motif\{[^}]*margin/.test(appCss.replace(/\s+/g, " ")), "app.css declares .sadu-motif (the divider container)");
ok(/\.sm-glyphs\{[^}]*var\(--sadu-terra\)/.test(appCss.replace(/\s+/g, " ")), ".sm-glyphs reuses var(--sadu-terra) — the SAME accent as .sadu-band/.hw-thread, no second visual language");
ok(/\.sm-line\{[^}]*var\(--sadu-ink-soft\)/.test(appCss.replace(/\s+/g, " ")), ".sm-line reuses var(--sadu-ink-soft) — the SAME secondary-label token used elsewhere");
ok(/class="sadu-motif"/.test(hh), "home renders the .sadu-motif divider");
ok(/class="sm-glyphs"/.test(hh) && /class="sm-line"/.test(hh), "home renders both the glyph row and the poetic caption line");
ok(/كما يُنسَج الصوف خيطًا خيطًا، يُكتب العهد عهدًا عهدًا/.test(hh), "the divider states its own distinct poetic line (not a repeat of the weave's own caption)");
const weaveCaptionCount = (hh.match(/كلّ قرضٍ خيط، والسجلّ نسيج/g) || []).length;
ok(weaveCaptionCount === 1, "sanity: the weave's own caption is unaffected — still appears exactly once (found " + weaveCaptionCount + ")");
const motifIdx = hh.indexOf('class="sadu-motif"');
const motifBlock = motifIdx >= 0 ? hh.slice(motifIdx - 20, motifIdx + 300) : "";
ok(motifIdx >= 0 && !/onclick=/.test(motifBlock), "the divider block has NO onclick/interaction surface — purely decorative, no new data or affordance");

console.log("\n========================================================");
console.log("SADU-TOKENS: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
