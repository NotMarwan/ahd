const fs = require("fs");
const path = require("path");
const vm = require("vm");

const APP = path.join(__dirname, "..", "..", "app");
let passed = 0, failed = 0;
const ok = (condition, name, detail) => condition ? (passed++, console.log("  ✓ " + name)) : (failed++, console.log("  ✗ " + name + (detail ? " — " + detail : "")));
const noThrow = (fn, name) => { try { const value = fn(); ok(true, name); return value; } catch (error) { ok(false, name, error.message); } };
function element() {
  const item = { _html: "", value: "", checked: false, style: {}, dataset: {}, classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } }, addEventListener(){}, focus(){}, querySelector(){ return element(); }, querySelectorAll(){ return []; } };
  Object.defineProperty(item, "innerHTML", { get(){ return this._html; }, set(value){ this._html = String(value); } });
  return item;
}
const byId = {};
const sandbox = {
  Math, Array, Object, JSON, String, Number, Boolean, RegExp, Error, parseInt, parseFloat, isNaN, isFinite, Date: undefined,
  TextEncoder, TextDecoder, Uint8Array, Uint16Array, Uint32Array, Int32Array, Float64Array, ArrayBuffer, DataView,
  console: { log(){}, error(){}, warn(){} }, setTimeout: () => 0, clearTimeout(){}, setInterval: () => 0, clearInterval(){},
  document: { body: { contains: () => true }, getElementById: id => byId[id] || (byId[id] = element()), querySelector: () => element(), querySelectorAll: () => [], createElement: () => element(), addEventListener(){} }
};
sandbox.window = sandbox; sandbox.self = sandbox; sandbox.globalThis = sandbox; sandbox.scrollTo = () => {}; sandbox.addEventListener = () => {};
vm.createContext(sandbox);

const files = ["engine.js", "features/riba-lint.js", "features/daftari.js", "features/create.js", "features/request.js", "features/qaid.js", "features/split.js", "features/split-modes.js", "features/reminder.js", "features/walink.js", "app.js", "screens/daily.js"];
noThrow(() => files.forEach(file => vm.runInContext(fs.readFileSync(path.join(APP, file), "utf8"), sandbox, { filename: file })), "daily scripts load into one realm");
const App = sandbox.AhdApp;
ok(!!App && !!App.screens.daily, "screen registers under key daily");
ok(App.screens.daily.label === "اليومي" && App.screens.daily.icon === "⚡", "screen label and icon are Arabic-first");
ok(App.NAV_ORDER.indexOf("daily") >= 0, "daily is reachable from primary navigation");
const html = noThrow(() => App.go("daily"), "daily renders without error") || "";
ok(/daily-name/.test(html) && /daily-amount/.test(html) && /daily-note/.test(html), "quick add has exactly three data fields");
ok(/لهم عليّ/.test(html) && /لي عليهم/.test(html), "direction toggle renders");
ok(/قيد شخصي — غير مختوم/.test(html), "unsealed status is visible");
ok(/سالم/.test(html) && /نورة/.test(html) && /هند/.test(html), "four demo qaids are pre-seeded");
ok(/قسمة فاتورة/.test(html) && /daily-split/.test(html), "inline split form renders");
ok(/daily-split-mode/.test(html) && /متساوٍ/.test(html) && /مبالغ محددة/.test(html) && /نسب مئوية/.test(html) && /حصص/.test(html), "split-mode select offers equal/exact/percent/shares (Splitwise G5)");
ok(/عاين الحصص قبل الحفظ/.test(html), "preview-before-save button renders");
ok(/متعادلان|المحصلة/.test(html), "netHint banner renders");
ok(/تسوية|حوّل إلى عهد|واتساب|تذكير/.test(html), "per-row daily actions render");
ok(noThrow(() => App.go("daily"), "second deterministic render does not throw") === html, "screen HTML is deterministic");

console.log(`\nDAILY SCREEN SMOKE: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
