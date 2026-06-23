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
const FILES = ["engine.js", "features/daftari.js", "features/open-loan.js", "features/circle-adv.js", "features/create.js", "features/request.js", "features/settlement.js", "features/circle.js", "features/timeline.js", "features/proof.js", "features/dispute.js", "features/settings.js", "app.js", "screens/home.js", "screens/daftari.js", "screens/open-loan.js", "screens/circle-adv.js", "screens/create.js", "screens/request.js", "screens/settlement.js", "screens/circle.js", "screens/timeline.js", "screens/proof.js", "screens/dispute.js", "screens/settings.js"];
noThrow(() => { for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(APP, f), "utf8"), sandbox, { filename: f }); }, "all app scripts load into one realm");

const App = sandbox.AhdApp;
ok(!!App, "window.AhdApp is defined");
ok(!!sandbox.AHD && !!sandbox.Daftari, "engine (AHD) + Daftari attach to window");
let booted = noThrow(() => App.boot(), "App.boot() initialises (nav + default screen)");
ok(/عهد/.test(booted) && /دفتري/.test(booted), "boot lands on the home front door (brand + feature cards)");
var navKeys = []; App.navHTML().replace(/AhdApp\.go\('([^']+)'\)/g, function (_, k) { navKeys.push(k); return _; });
ok(JSON.stringify(navKeys) === JSON.stringify(["home", "create", "daftari", "timeline", "open", "circle", "circle-adv", "settle"]), "nav pills render in product-flow order (8 primary, NAV_ORDER-driven; tidy 2 rows)");
ok(navKeys.indexOf("settings") < 0, "settings is CONTEXTUAL (reached from home), not a nav pill — keeps nav to 2 rows");
let hh = noThrow(() => App.go("home"), "go('home') renders the front door");
ok(/قرضٌ حسن/.test(hh) && /لك عند الناس/.test(hh), "home shows the spine tagline + live دفتري summary");

/* دفتري home renders */
let h = noThrow(() => App.go("daftari"), "go('daftari') renders the creditor home");
ok(/لك عند الناس/.test(h), "home shows «لك عند الناس» tile");
ok(/عليك للناس/.test(h), "home shows «عليك للناس» tile");
ok(/مقهى الحي|سلطان/.test(h), "home lists Naif's debtors (لي tab default)");
ok(/عليه وعدٌ متأخّر/.test(h), "overdue row shows the amber «عليه وعدٌ متأخّر» chip");

/* دفتري is the HUB: grouped sections, net balance, the ask, filter chips */
ok(/متأخّرة — بالمعروف/.test(h) && /محفوظة ✓/.test(h), "ledger is grouped into dignified sections (متأخّرة/محفوظة)");
ok(/محلّ خلاف — عهدٌ يشهد ولا يحكم/.test(h), "a disputed عهد is isolated in its own neutral section");
ok(/صافي ما لك/.test(h), "a reconciling NET balance line is shown (money, not a score)");
ok(/اطلب عهدًا/.test(h), "the ask (طلب عهد) is reachable from دفتري (hub entry)");
ok(/class="fchip"|fchip/.test(h), "filter chips render");
let hOverdue = noThrow(() => App.daftariFilter("overdue"), "filter to «متأخّرة»");
ok(/متأخّرة — بالمعروف/.test(hOverdue) && !/محفوظة ✓/.test(hOverdue), "overdue filter shows only the overdue section");
App.daftariFilter("all");

/* tab switch to «عليّ» shows what Naif owes */
let hon = noThrow(() => App.daftariTab("on"), "switch to «عليّ» tab");
ok(/فهد/.test(hon), "«عليّ» tab shows فهد (Naif owes his brother)");
ok(/سجلّ وفائك/.test(hon) && /وفّى بعهوده/.test(hon), "«عليّ» tab shows Naif's OWN trust band (word, never a number)");
ok(hon.indexOf("%") < 0 && !/\b\d{1,3}\s*٪/.test(hon), "the band is a word — no percentage/score on screen");
/* a SENT طلب عهد surfaces as a pending row in «عليّ» (not yet in any total) */
App.requestSend();
let honPending = App.daftariTab("on");
ok(/بانتظار القبول/.test(honPending), "a sent طلب عهد shows as a pending row in «عليّ»");
App.requestState = { sent: false, accepted: null, flash: null };   // restore for later request-screen assertions
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

/* ---- الدائرة (treasurer dashboard) screen ---- */
ok(!!sandbox.CircleDash, "CircleDash module attaches to window");
let cd = noThrow(() => App.go("circle"), "go('circle') renders the treasurer dashboard");
ok(/رحلة العلا/.test(cd) && /أمين الصندوق/.test(cd), "dashboard shows the occasion + treasurer");
ok(/جُمِع/.test(cd) && /ذمّة محفوظة/.test(cd), "dashboard shows progress + a member's dignified «ذمّة محفوظة»");
ok(/لا يُسمّى المتأخّر/.test(cd), "dashboard states the dignity rule (group reminder never names the late)");
ok(/ختم الدائرة/.test(cd), "the occasion shows ONE sealed proof (progress is amounts «جُمِع X من Y», not a score)");

/* ---- المقاصّة (Muqassa) screen ---- */
ok(!!sandbox.Settlement, "Settlement module attaches to window");
let se = noThrow(() => App.go("settle"), "go('settle') renders the Muqassa screen");
ok(/المقاصّة|أقلّ التحويلات/.test(se), "settle shows the Muqassa heading");
ok(/التزامًا/.test(se) && /تحويلان/.test(se), "settle shows the N→M transfer reduction (9→2)");
ok(/تدفع/.test(se), "settle lists the concrete minimal transfers");
ok(/برهان الحفظ/.test(se), "settle shows the conservation proof (Σ net = 0)");
ok(/مركز كلِّ عضوٍ/.test(se) && /نفسه قبل وبعد/.test(se), "settle proves every member's net is PRESERVED before & after (the strong proof)");
ok(/المال المتحرّك/.test(se), "settle shows the money-moved reduction (efficiency, no creation)");
ok(/حوالةٌ بالتراضي/.test(se), "settle frames each leg as consented novation (حوالةٌ بالتراضي)");
ok(se.indexOf("%") < 0 && !/\b\d{1,3}\s*٪/.test(se), "no percentage/score on the Muqassa screen");

/* ---- سِجلّ الشهادة (the witness timeline) ---- */
ok(!!sandbox.Timeline, "Timeline module attaches to window");
let tlh = noThrow(() => App.go("timeline"), "go('timeline') renders the witness timeline");
ok(/سِجلّ الشهادة/.test(tlh), "timeline shows the «سِجلّ الشهادة» header");
ok(/ذمّة محفوظة/.test(tlh), "timeline surfaces a «ذمّة محفوظة» (kept) moment");
ok(/يشهد ولا يحكم/.test(tlh), "a disputed عهد reads NEUTRAL «يشهد ولا يحكم» (bank shows, never judges)");
ok(/بالنيابة عنك/.test(tlh), "a bank-sent reminder appears «بالنيابة عنك»");
ok(/tone-amber/.test(tlh) && tlh.indexOf("tone-red") < 0, "reminders render AMBER on the feed, never red");
ok(tlh.indexOf("%") < 0 && !/\b\d{1,3}\s*٪/.test(tlh), "no score / percentage anywhere on the timeline");

/* the connective tissue: story-per-عهد view + links out, a flat toggle, and focus */
ok(/story-who/.test(tlh) && /story-steps/.test(tlh), "default view is the per-عهد STORY (each relationship's witnessed narrative)");
ok(/وثيقة الإثبات/.test(tlh) && /في الدفتر/.test(tlh), "every story links out to حافظة الإثبات + back to الدفتر");
ok(/تفاصيل الخلاف/.test(tlh), "a disputed عهد's story links to محلّ خلاف (connective tissue)");
let tlflat = noThrow(() => App.setTimelineView("flat"), "toggle to «حسب الوقت» (flat feed)");
ok(/tl-item/.test(tlflat) && /حسب الوقت/.test(tlflat), "flat view renders the time-ordered feed");
App.setTimelineView("story");
let tlfocus = noThrow(() => App.openTimelineFor("R-DISP"), "دفتري → «سجلّ هذا العهد» focuses one عهد's story");
ok(/كل العهود/.test(tlfocus) && (tlfocus.match(/story-who/g) || []).length === 1, "focus mode shows ONE story + a «كل العهود» reset");
App.timelineClearFocus();

/* ---- حافظة الإثبات (proof-pack) — a CONTEXTUAL screen, reached from دفتري ---- */
ok(!!sandbox.Proof, "Proof module attaches to window");
ok(navKeys.indexOf("proof") < 0, "proof is CONTEXTUAL — no nav pill (keeps the nav clean)");
let pf = noThrow(() => App.openProof("R-CAFE"), "openProof('R-CAFE') navigates to the proof screen");
ok(App.current === "proof", "openProof sets the current screen to proof");
ok(/حافظة الإثبات/.test(pf) && /canonical/.test(pf), "proof shows the evidence doc (canonical content)");
ok(/content hash:/.test(pf) && /genesis/.test(pf) && /block #1/.test(pf), "proof shows the content hash + the genesis→content→seal chain");
ok(/سَنَد العهد/.test(pf) && /نفاذ/.test(pf), "proof shows the PROVENANCE (سَنَد): parties, schedule, التوثيق (نفاذ)");
ok(/2:282|فاكتبوه/.test(pf), "proof cites the basis verse (write the debt)");
ok(/سليمة/.test(pf), "untouched record verifies ✓ «سليمة»");
let pft = noThrow(() => App.proofTamperToggle(), "tamper toggle ON");
ok(/عبثٌ مكشوف/.test(pft) && /pf-verify bad/.test(pft), "tampering breaks the seal → ✗ «عبثٌ مكشوف» (bad)");
ok(/الحقل المتغيّر/.test(pft) && /المبلغ/.test(pft), "tamper shows the PRECISE changed field (المبلغ) + diverging seals");
noThrow(() => App.proofTamperToggle(), "tamper toggle OFF (restore)");
ok(/سليمة/.test(App.go("proof")), "restored record verifies ✓ again");
noThrow(() => App.proofBack(), "proofBack returns to دفتري");
ok(App.current === "daftari", "proofBack lands on دفتري");
noThrow(() => App.openProof("does-not-exist"), "openProof with a bad id is a safe no-op");

/* ---- محلّ خلاف (dispute pause) — a CONTEXTUAL screen, the bank never judges ---- */
ok(!!sandbox.Dispute, "Dispute module attaches to window");
ok(navKeys.indexOf("dispute") < 0, "dispute is CONTEXTUAL — no nav pill");
let dp = noThrow(() => App.openDispute("R-DISP"), "openDispute('R-DISP') navigates to the dispute screen");
ok(App.current === "dispute", "openDispute sets the current screen to dispute");
ok(/محلّ خلاف/.test(dp) && /يشهد ولا يحكم/.test(dp), "dispute screen states «محلّ خلاف» + «عهدٌ يشهد ولا يحكم»");
ok(/تراضٍ/.test(dp) && /قضاء/.test(dp), "dispute screen offers BOTH paths (تراضٍ + قضاء)");
ok(/بلا غرامة/.test(dp) && /بلا أيّ زيادة/.test(dp), "dispute screen states NO penalty, no زيادة");
ok(dp.indexOf("tone-red") < 0 && dp.indexOf("%") < 0, "dispute screen: no red-shaming, no score");
/* the interconnection: dispute → proof opens as the NEUTRAL EXHIBIT, back returns to الخلاف */
let pfx = noThrow(() => App.openProofAsExhibit("R-DISP"), "dispute → proof opens as the neutral exhibit");
ok(App.current === "proof" && /دليلٌ محايد/.test(pfx), "the proof reframes as «دليلٌ محايد» when arrived from الخلاف");
ok(/رجوع إلى الخلاف/.test(pfx), "the exhibit's back button returns to الخلاف (not دفتري)");
noThrow(() => App.proofBack(), "proofBack from the exhibit");
ok(App.current === "dispute", "proofBack from the exhibit lands back on محلّ خلاف");
let dpg = noThrow(() => App.disputeGrace("R-DISP"), "dispute «اقترِح إعادة جدولة» (صلح) applies grace + returns to دفتري");
ok(App.current === "daftari", "after disputeGrace, the app lands back on دفتري");
noThrow(() => App.openDispute("does-not-exist"), "openDispute with a bad id is a safe no-op");

/* ---- الإعدادات (settings) — Arabic-Indic digit toggle (D-2), app-wide & display-only ---- */
ok(!!sandbox.Settings, "Settings module attaches to window");
let seth = noThrow(() => App.go("settings"), "go('settings') renders the settings/about screen");
ok(/نظام الأرقام/.test(seth) && /ما لا يفعله/.test(seth), "settings shows the digit toggle + the «ما لا نفعله» manifesto");
ok(/لا نُقرض/.test(seth) && /لا نحكم/.test(seth) && /لا نُصنّف/.test(seth), "manifesto states the spine (no lending / judging / scoring)");
ok(App.fmtN(5200) === "5,200", "default (western): App.fmtN(5200) → 5,200");
let homeSealBefore = App.Proof.buildProofPack(App.records[0], App.engine).seal;
noThrow(() => App.setDigitMode("arabic"), "switch to Arabic-Indic digits");
ok(App.fmtN(5200) === "٥,٢٠٠", "arabic mode: App.fmtN(5200) → ٥,٢٠٠ (app-wide display map)");
ok(/[٠-٩]/.test(App.go("daftari")), "arabic mode renders Arabic-Indic digits on a money screen (دفتري)");
ok(App.Proof.buildProofPack(App.records[0], App.engine).seal === homeSealBefore, "digit mode is DISPLAY-ONLY — the engine seal is unchanged");
noThrow(() => App.setDigitMode("western"), "switch back to western (restore)");
ok(App.fmtN(5200) === "5,200", "western restored: App.fmtN(5200) → 5,200");
/* privacy «إخفاء المبالغ» — display-only mask, app-wide, byte-safe */
ok(/إخفاء المبالغ/.test(seth) && /ما يفعله عهد/.test(seth), "settings shows the privacy toggle + the «ما يفعله» counterpart");
noThrow(() => App.setPrivacy(true), "turn on «إخفاء المبالغ»");
ok(App.fmtN(5200) === "•••", "privacy on: amounts mask to «•••» (no digit leaks)");
let daftHidden = App.go("daftari");
ok(/•••/.test(daftHidden) && !/5,200|٥/.test(daftHidden), "privacy hides amounts app-wide (دفتري shows no figure)");
ok(App.Proof.buildProofPack(App.records[0], App.engine).seal === homeSealBefore, "privacy is DISPLAY-ONLY — the engine seal is unchanged (byte-safe)");
noThrow(() => App.setPrivacy(false), "turn privacy back off (restore)");
ok(App.fmtN(5200) === "5,200", "privacy off: amounts shown again");

/* ---- اطلب عهدًا (borrower-initiated request) — CONTEXTUAL, reached from a home card ---- */
ok(!!sandbox.RequestAhd, "RequestAhd module attaches to window");
ok(navKeys.indexOf("request") < 0, "request is CONTEXTUAL — from a home card, not a nav pill");
ok(/اطلب عهدًا/.test(App.go("home")), "home surfaces the «اطلب عهدًا» ask card");
let rq = noThrow(() => App.go("request"), "go('request') renders the ask flow");
ok(/اطلب عهدًا/.test(rq) && /النصّ سليم/.test(rq), "request shows the ask + riba-clean terms");
ok(/أرسِل الطلب/.test(rq), "request offers «أرسِل الطلب»");
let rqs = noThrow(() => App.requestSend(), "send the request");
ok(/بانتظار موافقة/.test(rqs), "after send: «أُرسل — بانتظار موافقة {lender}»");
let rqa = noThrow(() => App.requestAccept(), "lender accepts (محاكاة) → seals the عهد");
ok(/أُضيف إلى دفترك|خُتم العهد/.test(rqa), "after accept: the sealed عهد is added to دفتري");
ok(!!App.recordById("REQ-NAIF") && App.recordById("REQ-NAIF").borrower === "نايف", "the accepted request is a real record with borrower=you → it lands in «عليّ»");

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
