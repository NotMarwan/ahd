/* ============================================================================
   app-dom-smoke.cjs — headless render smoke for project/ahd-app (the parallel
   publishable app). Loads engine.js + features + app.js + screens into ONE fake
   DOM (browser-global simulation) and drives the دفتري screen + its actions,
   asserting nothing throws and the right warm copy renders. Mirrors the demo's
   proven dom-smoke pattern (innerHTML strings + global action functions).
============================================================================ */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const APP = path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app");
let passed = 0, failed = 0;
const ok = (c, n, d) => { if (c) { passed++; console.log("  ✓ " + n); } else { failed++; console.log("  ✗ " + n + (d ? "  — " + d : "")); } };
const noThrow = (fn, n) => { try { const r = fn(); ok(true, n); return r; } catch (e) { ok(false, n, e && e.message); } };

/* ---- minimal fake DOM (concrete innerHTML-bearing elements, by-id registry) ---- */
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

console.log("ahd-app headless render smoke\n");
vm.createContext(sandbox);
const FILES = ["engine.js", "features/daftari.js", "features/open-loan.js", "features/circle-adv.js", "features/create.js", "app.js", "screens/home.js", "screens/daftari.js", "screens/open-loan.js", "screens/circle-adv.js", "screens/create.js"];
noThrow(() => { for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(APP, f), "utf8"), sandbox, { filename: f }); }, "all app scripts load into one realm");

const App = sandbox.AhdApp;
ok(!!App, "window.AhdApp is defined");
ok(!!sandbox.AHD && !!sandbox.Daftari, "engine (AHD) + Daftari attach to window");
let booted = noThrow(() => App.boot(), "App.boot() initialises (nav + default screen)");
ok(/عهد/.test(booted) && /دفتري/.test(booted), "boot lands on the home front door (brand + feature cards)");
let hh = noThrow(() => App.go("home"), "go('home') renders the front door");
ok(/قرضٌ حسن/.test(hh) && /لك عند الناس/.test(hh), "home shows the spine tagline + live دفتري summary");

/* دفتري home renders */
let h = noThrow(() => App.go("daftari"), "go('daftari') renders the creditor home");
ok(/لك عند الناس/.test(h), "home shows «لك عند الناس» tile");
ok(/عليك للناس/.test(h), "home shows «عليك للناس» tile");
ok(/مقهى الحي|سلطان/.test(h), "home lists Naif's debtors (لي tab default)");
ok(/عليه وعدٌ متأخّر/.test(h), "overdue row shows the amber «عليه وعدٌ متأخّر» chip");

/* tab switch to «عليّ» shows what Naif owes */
let hon = noThrow(() => App.daftariTab("on"), "switch to «عليّ» tab");
ok(/فهد/.test(hon), "«عليّ» tab shows فهد (Naif owes his brother)");
App.daftariTab("me");

/* the gentle reminder compose — bank-sent, with the two debtor buttons */
let comp = noThrow(() => App.daftariCompose("R-CAFE"), "compose «تذكيرٌ بالمعروف» for the overdue café debt");
ok(/تذكيرٌ لطيف|عهد/.test(comp), "compose shows the warm bank-sent template");
ok(/أسدّد الآن|أحتاج وقت/.test(comp), "compose carries BOTH debtor buttons (pay / ask for time)");
ok(comp.indexOf("متأخّر ") < 0 || /عليه وعدٌ متأخّر/.test(comp), "compose template has no shaming day-counter");

/* send → Naif's dignified receipt; history recorded */
let sent = noThrow(() => App.daftariSend("R-CAFE"), "send the reminder on Naif's behalf");
ok(/بالنيابة عنك/.test(sent), "after send: «أرسل عهد تذكيرًا… بالنيابة عنك» receipt");
ok((App.reminderHistory["R-CAFE"] || []).length === 1, "reminder history records the send");

/* debtor asks for time → grace, no penalty, status becomes مؤجّل بالتراضي */
let gr = noThrow(() => App.debtorGrace("R-SULTAN"), "debtor «أحتاج وقت» → grace");
ok(/مؤجّل بالتراضي/.test(gr), "after grace: status «مؤجّل بالتراضي» (2:280, no penalty)");

/* debtor pays → KEPT */
let pd = noThrow(() => App.debtorSettle("R-CAFE"), "debtor «أسدّد الآن» → settle");
ok(/ذمّة محفوظة/.test(pd), "after settle: «ذمّة محفوظة — وُفِّي به»");

/* creditor forgives remainder → FORGIVEN */
let fg = noThrow(() => App.daftariForgive("R-ABD"), "creditor «أبرئ ما تبقّى» → forgive (صدقة)");
ok(/أُبرئ|إبراء/.test(fg), "after forgive: FORGIVEN state shown");

/* ---- القرض المفتوح · open-term loan screen ---- */
ok(!!sandbox.OpenLoan, "OpenLoan module attaches to window");
let ol = noThrow(() => App.go("open"), "go('open') renders the open-loan screen");
ok(/المتبقّي/.test(ol), "open screen shows the quiet «المتبقّي» panel");
ok(/متى ما تيسّر|مفتوح/.test(ol), "open screen says «متى ما تيسّر / مفتوح»");
ok(/اجعلها صدقة/.test(ol), "open screen offers the lender إبراء «اجعلها صدقة»");
ok(ol.indexOf("متأخّر") < 0 && ol.indexOf("مستحقّ") < 0 && ol.indexOf("القسط القادم") < 0, "open screen has NO due/overdue/countdown (the heart of the type)");
let olp = noThrow(() => App.openLoanPay(5000), "partial pay 5,000 via سريع");
ok(/15,000|سُدِّد جزء/.test(olp), "after partial pay: remaining drops, «سُدِّد جزءٌ منه»");
noThrow(() => App.openLoanForgivePartial(3000), "partial إبراء 3,000 (rest stays open)");
ok(App.OpenLoan.foldOpenLoan(App.openLoan).remainingMinor === App.engine.toMinor(12000), "remaining is exactly 12,000 after pay+partial-forgive");
let olf = noThrow(() => App.openLoanForgiveFull(), "full إبراء «أُبرئ كاملًا»");
ok(/أُبرئ/.test(olf), "after full إبراء: «أُبرئ — صدقةٌ من المُقرِض»");

/* ---- advanced Circle screen ---- */
ok(!!sandbox.CircleAdv, "CircleAdv module attaches to window");
let ca = noThrow(() => App.go("circle-adv"), "go('circle-adv') renders the advanced Circle screen");
ok(/بالأصناف/.test(ca), "shows the بالأصناف (by-item) split panel");
ok(/قِسْمة دائمة|الإيجار/.test(ca), "shows the recurring auto-post panel");
ok(/نجمع للهدف/.test(ca) && /شرعيّة/.test(ca), "mode-B pledge sketch carries the visible Shariah-review guard");
ok(/وثّقها كعهد/.test(ca), "graduation offers «وثّقها كعهد»");
let cg = noThrow(() => App.circleGraduate(), "graduate the share → witnessed عهد");
ok(/SEAL:|موثّقًا/.test(cg), "after graduation: a sealed عهد with provenance");
ok(App.circleAdvState.graduated && App.circleAdvState.graduated.term === "open", "graduated record is an open-term qard hasan «متى ما تيسّر»");

/* ---- create-عهد flow (riba linter gates the seal) ---- */
ok(!!sandbox.CreateAhd, "CreateAhd module attaches to window");
let cr = noThrow(() => App.go("create"), "go('create') renders the create-عهد flow");
ok(/أنشئ عهدًا/.test(cr) && /قرض/.test(cr), "create shows the form + قرض حسن");
ok(/النصّ سليم/.test(cr), "auto-drafted terms read CLEAN in the riba linter");
let crb = noThrow(() => App.createInjectRiba(), "inject a late-penalty clause");
ok(/✗/.test(crb) && /غرامة|تأخير/.test(crb), "linter BLOCKS the penalty clause with the reason + halal fix");
ok(/disabled/.test(crb), "seal button is disabled while the terms are blocked");
noThrow(() => App.createClearRiba(), "remove the offending clause");
let crs = noThrow(() => App.createSeal(), "seal the clean عهد (Nafath + SHA-256)");
ok(/SEAL:/.test(crs), "after seal: a witnessed record with a SHA-256 seal");
noThrow(() => App.createAddToDaftari(), "add the created عهد to دفتري");
ok(!!App.recordById("NEW-AHD-1"), "the created عهد is now a real record in دفتري (create→home loop)");

/* robustness */
noThrow(() => App.go("does-not-exist"), "unknown screen key is a safe no-op");
noThrow(() => App.openLoanPay("bad"), "open pay with bad amount is a safe op");

/* error-handling: a screen that throws is caught by the shell's try/catch fallback */
App.registerScreen({ key: "_boom", label: "x", render: function () { throw new Error("boom"); } });
let fb = noThrow(() => App.go("_boom"), "a throwing screen is CAUGHT by the shell (no crash)");
ok(/تعذّر العرض/.test(fb), "shell renders the offline fallback when a screen throws");
noThrow(() => App.go("home"), "recovers to a normal screen after a fallback");

/* accessibility: nav marks the current screen; دفتري tabs expose roles */
let acc = App.go("daftari");
ok(/aria-current="page"/.test(acc), "nav marks the active screen with aria-current");
ok(/role="tablist"/.test(acc) && /role="tab"/.test(acc) && /aria-selected/.test(acc), "دفتري tabs expose tablist/tab/aria-selected");
noThrow(() => App.daftariCompose("bad-id"), "compose with unknown id is a safe no-op");
noThrow(() => App.daftariTab("zzz"), "unknown tab is a safe no-op");

console.log("\n" + "=".repeat(56));
console.log("APP DOM SMOKE: " + passed + " passed, " + failed + " failed");
console.log("=".repeat(56));
process.exit(failed ? 1 : 0);
