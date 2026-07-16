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

const files = ["engine.js", "features/jamiya.js", "features/jamiya-invite.js", "features/jamiya-changes.js", "features/jamiya-goal.js", "app.js", "screens/jamiya.js"];
noThrow(() => files.forEach(file => vm.runInContext(fs.readFileSync(path.join(APP, file), "utf8"), sandbox, { filename: file })), "jamiya scripts load into one realm");
const App = sandbox.AhdApp;
ok(!!App && !!App.screens.jamiya, "screen registers under key jamiya");
ok(App.screens.jamiya.label === "الجمعية" && App.screens.jamiya.icon === "🤝", "screen label and icon are Arabic-first");
ok(App.NAV_ORDER.indexOf("jamiya") >= 0, "jamiya is reachable from primary navigation");
const html = noThrow(() => App.go("jamiya"), "jamiya renders without error") || "";
ok(/بطاقة الدعوة — كل الشروط قبل القبول/.test(html), "per-member invitation cards show ALL terms before any acceptance (Hakbah G7 — stronger than one checkbox)");
ok(/لا حيازة/.test(html) && /لا رسوم/.test(html) && /لا سند تنفيذي/.test(html), "invite card carries the absent-list (Hakbah rejections stay rejected)");
ok(/بانتظار/.test(html) && /يقبل \(محاكاة\)/.test(html) && /يعتذر/.test(html), "members start undecided with recorded accept/decline actions");
ok(/وثّق الجمعية واختمها<\/button>/.test(html) && /disabled[^>]*onclick="AhdApp\.jamiyaCreate\(\)"/.test(html), "seal button is DISABLED until every member accepts");
ok(/أم سارة/.test(html) && /لجين/.test(html), "six-member mid-cycle demo is pre-seeded");
ok(/موثّقة|الختم/.test(html) && /SEAL/.test(html), "sealed contract card renders");
ok(/الجولة|الشهر/.test(html) && /دفع|بانتظار/.test(html), "rounds grid shows paid and pending states");
ok(/progressbar/.test(html), "progress bar renders");
ok(/الهدف/.test(html) && /هدف وصفي — لا وعد مالي ولا عائد/.test(html), "goal section renders with the fixed promise-free line (MoneyFellows G9, adapted)");
ok(/قارن السيناريوهات قبل الدعوة/.test(html) && /أشهر/.test(html), "scenario compare renders before the invitation");
ok(/سجل التغييرات/.test(html) && /لا تغييرات/.test(html), "change log renders empty + honest (Hakbah G8)");
ok(noThrow(() => App.go("jamiya"), "second deterministic render does not throw") === html, "screen HTML is deterministic");

/* the unanimity gate in action: create blocked while anyone waits; accepting all opens it */
const blocked = noThrow(() => App.jamiyaCreate(), "creating before acceptance is a safe, blocked action");
ok(/حتى يقبل كل عضو/.test(blocked), "the block explains itself: لا تُختَم حتى يقبل كل عضو");
let afterAccepts = "";
["أم سارة", "نورة", "هند", "منال", "عبير", "لجين"].forEach(name => { afterAccepts = App.jamInviteAccept(name); });
ok(/قَبِل ✓/.test(afterAccepts) && /بانتظار 0/.test(afterAccepts), "all six recorded acceptances show on the cards");
ok(!/disabled[^>]*onclick="AhdApp\.jamiyaCreate\(\)"/.test(afterAccepts), "seal button unlocks once everyone accepted");
const declined = App.jamInviteDecline("نورة");
ok(/اعتذر/.test(declined) && /disabled[^>]*onclick="AhdApp\.jamiyaCreate\(\)"/.test(declined), "one decline re-locks the seal — unanimity is live, not a checkbox");
App.jamInviteAccept("نورة");   // restore

/* the change log in action: swap the two future rounds بالتراضي */
const beforeSwap = App.jamiyaState.contract.orderAgreed.join(",");
const paidBefore = App.jamiyaState.contract.payments.length;
const swapped = noThrow(() => App.jamSwapDemo(), "swap the last two rounds");
ok(/JC-1/.test(swapped) && /تبادل الدورين بالتراضي/.test(swapped), "the swap is a numbered, consented log entry");
ok(App.jamiyaState.contract.orderAgreed.join(",") !== beforeSwap, "the agreed order actually changed");
ok(App.jamiyaState.contract.payments.length === paidBefore, "every already-sealed payment replayed into the new version");
ok(/✓ متسلسل/.test(swapped), "the change log verifies append-only");

console.log(`\nJAMIYA SCREEN SMOKE: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
