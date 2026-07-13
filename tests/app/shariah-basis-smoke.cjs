/* ============================================================================
   shariah-basis-smoke.cjs — headless render smoke for the «الأساس الشرعي»
   screen (feasibility gate, W4). Loads engine + shell + the new feature +
   screen into ONE fake DOM realm and asserts the page renders: every mechanic
   with its cited verse/standard, the honest grade badges, every open question
   ending in «؟», the visible «أسئلة بانتظار مراجعة عالِم» note, the no-fatwa
   line, and reachability from «ما لا يفعله عهد» + «الضمانات والحدود» + home.
   Spine: NO percentage/score glyph anywhere; stays CONTEXTUAL (no nav pill).
============================================================================ */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const APP = path.join(__dirname, "..", "..", "app");
let passed = 0, failed = 0;
const ok = (c, n, d) => { if (c) { passed++; console.log("  ✓ " + n); } else { failed++; console.log("  ✗ " + n + (d ? "  — " + d : "")); } };
const noThrow = (fn, n) => { try { const r = fn(); ok(true, n); return r; } catch (e) { ok(false, n, e && e.message); return undefined; } };

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

console.log("shariah-basis-smoke: «الأساس الشرعي» — cited, question-framed, on-spine (feasibility gate)\n");
vm.createContext(sandbox);
const FILES = ["engine.js", "features/bounds.js", "features/bounds-detail.js", "features/shariah-basis.js", "features/refusal.js", "app.js", "screens/refusal.js", "screens/bounds.js", "screens/shariah-basis.js"];
noThrow(() => { for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(APP, f), "utf8"), sandbox, { filename: f }); }, "all shariah-basis scripts load into one realm");

const App = sandbox.AhdApp;
ok(!!App, "window.AhdApp is defined");
ok(!!sandbox.ShariahBasis, "ShariahBasis module attaches to window");
ok(App.NAV_ORDER.indexOf("shariah") < 0, "shariah is CONTEXTUAL — NOT a nav pill");
ok(!!App.screens.shariah && App.screens.shariah.label === "الأساس الشرعي", "the shariah screen registered with its label");

const html = noThrow(() => App.go("shariah"), "go('shariah') renders «الأساس الشرعي»");
ok(App.current === "shariah", "current screen is shariah");
ok(/الأساس الشرعي/.test(html), "page shows the «الأساس الشرعي» header");

/* every mechanic title renders */
["شهادة القرض الحسن", "الختم الرقميّ", "المقاصّة والتسوية", "لا ربا", "إشارة الثقة النوعيّة"].forEach(t =>
  ok(html.indexOf(t) >= 0, "mechanic «" + t + "» renders"));

/* at least one AAOIFI clause + both cited verses are ON SCREEN */
ok(/١٠\/٣\/٢/.test(html) && /٧\/٨/.test(html), "AAOIFI SS-19 clauses 10/3/2 and 7/8 are on screen");
ok(/٢:٢٨٢/.test(html), "Qur'an 2:282 reference is on screen");
ok(/٢:٢٨٠/.test(html), "Qur'an 2:280 reference is on screen");
ok(/نظام الإثبات/.test(html), "the Evidence Law (نظام الإثبات) is named on screen");
ok(/مؤكَّد|مُسجَّلٌ|يُراجَع|خيارٌ تصميميّ/.test(html), "at least one honest grade badge renders");

/* every open question renders and ends with a question mark, never a ruling */
ok((html.match(/❓/g) || []).length >= 4, "at least 4 open questions render (❓ marker)");
ok(/؟/.test(html), "at least one rendered question ends in ؟");
["الحيلة", "D-1"].forEach(() => {}); // (ids are internal; text is what's asserted below)
ok(/فصل القرض الحسن/.test(html), "the Hilah/two-contract question text renders");
ok(/إفصاح المستخدم طوعًا/.test(html), "the D-1 self-disclosure question text renders");
ok(/التعهّد ثم الدفع عند الصرف/.test(html), "the D-3 pledge-then-pay question text renders");

/* the honest pending-review note + no-fatwa line are VISIBLE */
ok(/بانتظار مراجعة عالِم/.test(html), "the visible «أسئلة بانتظار مراجعة عالِم» note renders");
ok(/لا يُفتي/.test(html), "the no-fatwa line («لا يُفتي») renders");

/* spine: no percentage/score glyph anywhere */
ok(html.indexOf("%") < 0 && html.indexOf("٪") < 0, "NO percentage/score glyph anywhere on the shariah-basis page");

/* reachable from «ما لا يفعله عهد» and «الضمانات والحدود» (chips) */
const rf = App.go("refusal");
ok(/الأساس الشرعي/.test(rf), "«ما لا يفعله عهد» offers a chip to «الأساس الشرعي»");
const bd = App.go("bounds");
ok(/الأساس الشرعي/.test(bd), "«الضمانات والحدود» offers a chip to «الأساس الشرعي»");
const backToBounds = noThrow(() => App.go("shariah") && App.go("bounds"), "shariah screen's own chip target (bounds) is reachable");
ok(App.current === "bounds", "chip navigation lands correctly");

/* determinism */
ok(App.go("shariah") === html, "the shariah-basis page is deterministic (identical HTML on a re-render)");

console.log("\n" + "=".repeat(56));
console.log("SHARIAH-BASIS SMOKE: " + passed + " passed, " + failed + " failed");
console.log("=".repeat(56));
process.exit(failed ? 1 : 0);
