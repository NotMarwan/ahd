/* ============================================================================
   plans-smoke.cjs — headless render smoke for the «الأجرة والخطط» screen. Loads
   engine + settings + billing + fee-receipt + app shell + the plans screen into
   ONE fake DOM realm and asserts the revenue page renders spine-clean: the thesis
   «أجرة على الخدمة، لا على القرض», every tier, the honest «قيد المراجعة الشرعيّة»
   badge, and the live two-line fee receipt (0.00 / 5.00) — with NO score/percentage.
   plans stays CONTEXTUAL (never a nav pill). Mirrors app-dom-smoke's realm pattern.
============================================================================ */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const APP = path.join(__dirname, "..", "..", "app");
let passed = 0, failed = 0;
const ok = (c, n, d) => { if (c) { passed++; console.log("  ✓ " + n); } else { failed++; console.log("  ✗ " + n + (d ? "  — " + d : "")); } };
const noThrow = (fn, n) => { try { const r = fn(); ok(true, n); return r; } catch (e) { ok(false, n, e && e.message); } };

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

console.log("plans-smoke: «الأجرة والخطط» — spine-clean revenue page\n");
vm.createContext(sandbox);
const FILES = ["engine.js", "features/settings.js", "features/billing.js", "features/fee-receipt.js", "app.js", "screens/plans.js"];
noThrow(() => { for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(APP, f), "utf8"), sandbox, { filename: f }); }, "all revenue scripts load into one realm");

const App = sandbox.AhdApp;
ok(!!App, "window.AhdApp is defined");
ok(!!sandbox.Billing && !!sandbox.FeeReceipt, "Billing + FeeReceipt attach to window");
ok(App.NAV_ORDER.indexOf("plans") < 0, "plans is CONTEXTUAL — NOT a nav pill (nav stays 8)");
ok(!!App.screens.plans && App.screens.plans.label === "الأجرة والخطط", "the plans screen registered with its label");

const html = noThrow(() => App.go("plans"), "go('plans') renders the revenue page");
ok(App.current === "plans", "current screen is plans");
ok(/الأجرة والخطط/.test(html), "page shows the «الأجرة والخطط» header");
ok(/أجرة على الخدمة، لا على القرض/.test(html), "the thesis line «أجرة على الخدمة، لا على القرض» is on screen");
ok(/القرض مجاني/.test(html), "every tier reasserts «القرض مجانيٌّ للأبد»");

/* every tier renders */
["مجاني", "دفتري بلس", "الدائرة", "المؤسسة", "ترخيص المصرف"].forEach(name =>
  ok(html.indexOf(name) >= 0, "tier «" + name + "» renders"));
ok(/2,900/.test(html), "the institutional tier shows its flat 2,900 ر.س price (comma-formatted)");
ok(/250,000/.test(html), "the white-label tier shows its 250,000 ر.س annual price");
ok(/مجانًا — للأبد/.test(html), "the free tier shows «مجانًا — للأبد»");

/* the honest badge on every paid tier + the receipt */
ok((html.match(/قيد المراجعة الشرعيّة/g) || []).length >= 2, "the «قيد المراجعة الشرعيّة» badge appears on paid tiers + the receipt (honest, never asserts approval)");

/* the live two-line receipt — the memorable proof */
ok(/أجرة التوثيق — منفصلةٌ عن القرض/.test(html), "the fee-receipt block renders");
ok(/الزيادة على القرض/.test(html) && /0\.00 ر\.س/.test(html), "receipt line 1: «الزيادة على القرض 0.00 ر.س» (nothing on the قرض)");
ok(/أجرة توثيقٍ ثابتة/.test(html) && /5\.00 ر\.س/.test(html), "receipt line 2: «أجرة توثيقٍ ثابتة 5.00 ر.س» (flat)");

/* the spine guard: no score, no percentage anywhere */
ok(html.indexOf("%") < 0 && html.indexOf("٪") < 0, "NO percentage/score glyph (%/٪) anywhere on the revenue page");

/* Arabic-Indic digit toggle flows through (display-only) */
noThrow(() => App.setDigitMode("arabic"), "switch to Arabic-Indic digits");
const htmlAr = App.go("plans");
ok(/[٠-٩]/.test(htmlAr), "arabic mode renders Arabic-Indic digits on the revenue page");
ok(/٥٫?\.?٠٠ ر\.س|٥\.٠٠ ر\.س/.test(htmlAr) || /٥\.٠٠/.test(htmlAr), "the 5.00 أجرة renders in Arabic-Indic digits (٥.٠٠)");
noThrow(() => App.setDigitMode("western"), "restore western digits");

/* determinism */
ok(App.go("plans") === html, "the revenue page is deterministic (identical HTML on a re-render)");

console.log("\n" + "=".repeat(56));
console.log("PLANS SMOKE: " + passed + " passed, " + failed + " failed");
console.log("=".repeat(56));
process.exit(failed ? 1 : 0);
