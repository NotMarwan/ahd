const fs = require("fs");
const path = require("path");
const vm = require("vm");

const APP = path.join(__dirname, "..", "..", "app");
let passed = 0, failed = 0;
const ok = (condition, name, detail) => { condition ? (passed++, console.log("  ✓ " + name)) : (failed++, console.log("  ✗ " + name + (detail ? " — " + detail : ""))); };
const noThrow = (fn, name) => { try { const value = fn(); ok(true, name); return value; } catch (error) { ok(false, name, error.message); } };
function element() {
  const item = { _html: "", value: "", checked: false, style: {}, dataset: {}, classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } }, addEventListener(){}, focus(){}, querySelector(){ return element(); }, querySelectorAll(){ return []; } };
  Object.defineProperty(item, "innerHTML", { get(){ return this._html; }, set(value){ this._html = String(value); } });
  return item;
}
const byId = {};
const sandbox = {
  Math, Array, Object, JSON, String, Number, Boolean, RegExp, Error, parseInt, parseFloat, isNaN, isFinite, Date: undefined,
  TextEncoder, Uint8Array, Uint16Array, Uint32Array, Int32Array, Float64Array, ArrayBuffer, DataView,
  console: { log(){}, error(){}, warn(){} }, setTimeout: () => 0, clearTimeout(){}, setInterval: () => 0, clearInterval(){},
  document: { body: { contains: () => true }, getElementById: id => byId[id] || (byId[id] = element()), querySelector: () => element(), querySelectorAll: () => [], createElement: () => element(), addEventListener(){} }
};
sandbox.window = sandbox; sandbox.self = sandbox; sandbox.globalThis = sandbox; sandbox.scrollTo = () => {}; sandbox.addEventListener = () => {};
vm.createContext(sandbox);

const files = ["engine.js", "features/jamiya.js", "app.js", "screens/jamiya.js"];
noThrow(() => files.forEach(file => vm.runInContext(fs.readFileSync(path.join(APP, file), "utf8"), sandbox, { filename: file })), "jamiya scripts load into one realm");
const App = sandbox.AhdApp;
ok(!!App && !!App.screens.jamiya, "screen registers under key jamiya");
ok(App.screens.jamiya.label === "الجمعية" && App.screens.jamiya.icon === "🤝", "screen label and icon are Arabic-first");
ok(App.NAV_ORDER.indexOf("jamiya") >= 0, "jamiya is reachable from primary navigation");
const html = noThrow(() => App.go("jamiya"), "jamiya renders without error") || "";
ok(/الكل وافق على الترتيب/.test(html), "create form requires unanimous order confirmation");
ok(/أم سارة/.test(html) && /لجين/.test(html), "six-member mid-cycle demo is pre-seeded");
ok(/موثّقة|الختم/.test(html) && /SEAL/.test(html), "sealed contract card renders");
ok(/الجولة|الشهر/.test(html) && /دفع|بانتظار/.test(html), "rounds grid shows paid and pending states");
ok(/progressbar/.test(html), "progress bar renders");
ok(noThrow(() => App.go("jamiya"), "second deterministic render does not throw") === html, "screen HTML is deterministic");

console.log(`\nJAMIYA SCREEN SMOKE: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
