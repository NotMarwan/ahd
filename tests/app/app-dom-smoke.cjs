/* ============================================================================
   app-dom-smoke.cjs — headless render smoke for app/ (the parallel
   publishable app). Loads engine.js + features + app.js + screens into ONE fake
   DOM (browser-global simulation) and drives the دفتري screen + its actions,
   asserting nothing throws and the right warm copy renders. Mirrors the demo's
   proven dom-smoke pattern (innerHTML strings + global action functions).
============================================================================ */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const APP = path.join(__dirname, "..", "..", "app");
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
const FILES = ["engine.js", "features/daftari.js", "features/open-loan.js", "features/circle-adv.js", "features/create.js", "features/request.js", "features/settlement.js", "features/impact.js", "features/circle.js", "features/timeline.js", "features/proof.js", "features/dispute.js", "features/settings.js", "features/borrower.js", "features/covenant-log.js", "features/standing-loan.js", "features/bounds.js", "app.js", "screens/home.js", "screens/daftari.js", "screens/open-loan.js", "screens/circle-adv.js", "screens/create.js", "screens/request.js", "screens/settlement.js", "screens/impact.js", "screens/circle.js", "screens/timeline.js", "screens/proof.js", "screens/dispute.js", "screens/settings.js", "screens/borrower.js", "screens/covenant.js", "screens/standing.js", "screens/bounds.js"];
noThrow(() => { for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(APP, f), "utf8"), sandbox, { filename: f }); }, "all app scripts load into one realm");

const App = sandbox.AhdApp;
ok(!!App, "window.AhdApp is defined");
ok(!!sandbox.AHD && !!sandbox.Daftari, "engine (AHD) + Daftari attach to window");
assert.strictEqual(
  App.flashHTML("رسالة تجربة", "createDismiss"),
  '<div class="flash" onclick="AhdApp.createDismiss()">رسالة تجربة <span class="x">×</span></div>',
  "flashHTML renders the exact prior inline markup"
);
assert.strictEqual(App.flashHTML("", "createDismiss"), "", "flashHTML is empty when there is no message");
assert.strictEqual(App.flashHTML(null, "createDismiss"), "", "flashHTML handles a null message");
let booted = noThrow(() => App.boot(), "App.boot() initialises (nav + default screen)");
ok(/عهد/.test(booted) && /دفتري/.test(booted), "boot lands on the home front door (brand + feature cards)");
var navKeys = []; App.navHTML().replace(/AhdApp\.go\('([^']+)'\)/g, function (_, k) { navKeys.push(k); return _; });
ok(JSON.stringify(navKeys) === JSON.stringify(["home", "create", "daftari", "timeline", "open", "circle", "circle-adv", "settle"]), "nav pills render in product-flow order (8 primary, NAV_ORDER-driven; tidy 2 rows)");
ok(navKeys.indexOf("settings") < 0, "settings is CONTEXTUAL (reached from home), not a nav pill — keeps nav to 2 rows");
let hh = noThrow(() => App.go("home"), "go('home') renders the front door");
ok(/قرضٌ حسن/.test(hh) && /لك عند الناس/.test(hh), "home shows the spine tagline + live دفتري summary");
ok(/صافي مركزك/.test(hh) && /سجلّ الشهادة/.test(hh) && /سجلّ وفائك/.test(hh), "home's standing strip surfaces net + witnessed-moments + the standing WORD (the deepened product at a glance)");
ok(/لحظة محفوظة/.test(hh) && !/\b\d{1,3}\s*[%٪]/.test(hh), "the witnessed-moments tally is a count (لحظة محفوظة), never a percentage/score");

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
let olpf = noThrow(() => App.openLoanForgivePartial(3000), "partial إبراء 3,000 (rest stays open)");
ok(App.OpenLoan.foldOpenLoan(App.openLoan).remainingMinor === App.engine.toMinor(12000), "remaining is exactly 12,000 after pay+partial-forgive");
ok(/رحلة السداد/.test(olpf) && /سُدِّد 5,000/.test(olpf) && /صدقة 3,000/.test(olpf), "open screen shows the «متى ما تيسّر» journey + the progress legend (paid · صدقة · باقٍ)");
ok(/ol-bar/.test(olpf) && /flex-grow/.test(olpf), "open screen shows the proportional progress bar (flex-grow)");
ok(olpf.indexOf("%") < 0, "the progress bar carries NO percentage text (no score)");
let olf = noThrow(() => App.openLoanForgiveFull(), "full إبراء «أُبرئ كاملًا»");
ok(/أُبرئ/.test(olf), "after full إبراء: «أُبرئ — صدقةٌ من المُقرِض»");

/* ---- advanced Circle screen ---- */
ok(!!sandbox.CircleAdv, "CircleAdv module attaches to window");
let ca = noThrow(() => App.go("circle-adv"), "go('circle-adv') renders the advanced Circle screen");
ok(/بالأصناف/.test(ca), "shows the بالأصناف (by-item) split panel");
ok(/كلُّ صنفٍ يُقسَّم بالهللة/.test(ca) && /محفوظ ✓/.test(ca), "بالأصناف shows the PER-ITEM conservation proof (each item conserves)");
ok(/قِسْمة دائمة|الإيجار/.test(ca), "shows the recurring auto-post panel");
ok(/نجمع للهدف/.test(ca) && /شرعيّة/.test(ca), "mode-B pledge sketch carries the visible Shariah-review guard");
ok(/وثّقها كعهد/.test(ca), "graduation offers «وثّقها كعهد»");
let cg = noThrow(() => App.circleGraduate(), "graduate the share → witnessed عهد");
ok(/SEAL:|موثّقًا/.test(cg), "after graduation: a sealed عهد with provenance");
ok(App.circleAdvState.graduated && App.circleAdvState.graduated.term === "open", "graduated record is an open-term qard hasan «متى ما تيسّر»");
let cgv = noThrow(() => App.circleGraduateView(), "graduation → «اعرض القرض المفتوح» opens the deepened open-loan view");
ok(App.current === "open" && /متى ما تيسّر|المتبقّي/.test(cgv) && /رحلة السداد|المتبقّي/.test(cgv), "the graduated عهد loads into the open-loan screen (seamless قَيْد→عهد→قرض مفتوح)");

/* ---- create-عهد flow (riba linter gates the seal) ---- */
ok(!!sandbox.CreateAhd, "CreateAhd module attaches to window");
let cr = noThrow(() => App.go("create"), "go('create') renders the create-عهد flow");
ok(/أنشئ عهدًا/.test(cr) && /قرض/.test(cr), "create shows the form + قرض حسن");
ok(/النصّ سليم/.test(cr), "auto-drafted terms read CLEAN in the riba linter");
ok(/اختم العهد عبر نفاذ \(محاكاة\)/.test(cr), "the Nafath seal button carries the (محاكاة) honesty tag on the guaranteed demo path");
let crb = noThrow(() => App.createInjectRiba(), "inject a late-penalty clause");
ok(/✗/.test(crb) && /غرامة|تأخير/.test(crb), "linter BLOCKS the penalty clause with the reason + halal fix");
ok(/disabled/.test(crb), "seal button is disabled while the terms are blocked");
ok(/cr-fields/.test(crb), "create screen keeps the summary card (cr-fields) when the linter blocks");
ok(/المُقرِض/.test(crb), "create screen still shows the lender label when the linter blocks");
noThrow(() => App.createClearRiba(), "remove the offending clause");
let crs = noThrow(() => App.createSeal(), "seal the clean عهد (Nafath + SHA-256)");
ok(/SEAL:/.test(crs), "after seal: a witnessed record with a SHA-256 seal");
ok(/نفاذ \(محاكاة\) \+ SHA-256/.test(crs), "the sealed-doc label states نفاذ (محاكاة) — no unconfirmed-integration claim (OT-VAL)");
noThrow(() => App.createAddToDaftari(), "add the created عهد to دفتري");
ok(!!App.recordById("NEW-AHD-1"), "the created عهد is now a real record in دفتري (create→home loop)");

/* ---- الدائرة (treasurer dashboard) screen ---- */
ok(!!sandbox.CircleDash, "CircleDash module attaches to window");
let cd = noThrow(() => App.go("circle"), "go('circle') renders the treasurer dashboard");
ok(/رحلة العلا/.test(cd) && /أمين الصندوق/.test(cd), "dashboard shows the occasion + treasurer");
ok(/جُمِع/.test(cd) && /ذمّة محفوظة/.test(cd), "dashboard shows progress + a member's dignified «ذمّة محفوظة»");
ok(/لا يُسمّى المتأخّر/.test(cd), "dashboard states the dignity rule (group reminder never names the late)");
/* the group reminder, previewed live — and it names NO member */
let cdr = noThrow(() => App.circleReminderToggle(), "treasurer «ذكّر الدائرة بلطف» previews the group reminder");
ok(/جماعيّ/.test(cdr) && /ميسرة/.test(cdr), "the group reminder is collective + carries the 2:280 mercy («ميسرة»)");
ok(App.engine.DEMO_CIRCLE.members.every(m => App.CircleDash.groupReminder(App.engine.DEMO_CIRCLE, App.engine).ar.indexOf(m.name) < 0), "the group reminder names NO member (the late is never exposed)");
App.circleReminderToggle();
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

/* ============================================================================
   NEW FEATURES — F1 «ما عليّ» borrower home · F2 «سِجلّ المعروف» sealed mercy
   trail · F3 «سُلفة بالمعروف» standing qard. Three CONTEXTUAL screens over new
   pure modules; nav stays 8 pills (asserted above). Renders must not throw and
   must carry the spine (no score/percentage; sealed + tamper-evident; 2:280).
============================================================================ */
/* ---- ما عليّ (borrower home): the debtor's own obligations + grace/pay (2:280) ---- */
ok(!!sandbox.Borrower, "Borrower module attaches to window");
ok(navKeys.indexOf("mine") < 0, "«ما عليّ» is CONTEXTUAL — a home card, not a nav pill");
ok(/ما عليّ/.test(App.go("home")), "home surfaces the «ما عليّ» borrower card");
let mine = noThrow(() => App.go("mine"), "go('mine') renders the borrower home");
ok(/ما عليّ|التزامات/.test(mine), "borrower home shows «ما عليّ / التزاماتي»");
ok(/فهد/.test(mine), "borrower home lists what Naif owes (فهد)");
ok(mine.indexOf("%") < 0 && !/\b\d{1,3}\s*٪/.test(mine), "borrower home shows NO percentage/score");
let mg = noThrow(() => App.borrowerAskGrace("R-FAHD", "salary_delay"), "borrower «أطلب مهلة» → a borrower-INITIATED grace request");
ok(/ميسرة|مهلة/.test(mg), "grace request shows dignified 2:280 copy (no penalty)");
ok((App.recordById("R-FAHD").events || []).some(e => e.type === "GRACE_REQUESTED"), "the grace request is recorded as a GRACE_REQUESTED event on the record");
noThrow(() => App.borrowerPay("R-FAHD", 500), "borrower «سدِّد ما تيسّر» — a partial payment (clamped)");
ok((App.recordById("R-FAHD").events || []).some(e => e.type === "PRINCIPAL_PAID"), "the partial payment is recorded as a PRINCIPAL_PAID event (integer halalas)");

/* ---- سِجلّ المعروف (covenant trail): sealed, tamper-evident, neutral exhibit ---- */
ok(!!sandbox.CovenantLog, "CovenantLog module attaches to window");
ok(navKeys.indexOf("maroof") < 0, "«سِجلّ المعروف» is CONTEXTUAL — no nav pill");
App.go("daftari"); App.daftariTab("me");
let dsheet = noThrow(() => App.daftariOpenSheet("R-SULTAN"), "open the دفتري row sheet for R-SULTAN (a live record)");
ok(/سِجلّ المعروف/.test(dsheet), "the دفتري row sheet offers «سِجلّ المعروف» → openCovenant (per-record reachable)");
noThrow(() => App.daftariCloseSheet(), "close the دفتري sheet");
let cov = noThrow(() => App.openCovenant("R-CAFE"), "openCovenant('R-CAFE') navigates to the covenant trail");
ok(App.current === "maroof", "openCovenant sets the current screen to maroof");
ok(/سِجلّ المعروف/.test(cov), "covenant screen shows «سِجلّ المعروف»");
ok(/السلسلة سليمة/.test(cov), "the sealed معروف chain verifies intact ✓");
ok(cov.indexOf("%") < 0 && !/\b\d{1,3}\s*٪/.test(cov), "covenant screen shows no percentage/score");
let covt = noThrow(() => App.covenantTamperToggle(), "covenant tamper toggle ON");
ok(/عبثٌ مكشوف|انكسر الختم/.test(covt), "tampering an entry breaks the seal chain (live)");
noThrow(() => App.covenantTamperToggle(), "covenant tamper toggle OFF (restore)");
let cove = noThrow(() => App.covenantExport(), "export as a neutral exhibit");
ok(/بيّنة محايدة/.test(cove), "export prepares the NEUTRAL court exhibit (the record, never a score)");
noThrow(() => App.covenantBack(), "covenantBack returns to دفتري");

/* ---- سُلفة بالمعروف (standing qard): Musaned wedge + honest counsel seam ---- */
ok(!!sandbox.Standing, "Standing module attaches to window");
ok(navKeys.indexOf("standing") < 0, "«سُلفة بالمعروف» is CONTEXTUAL — a home card");
let stg = noThrow(() => App.go("standing"), "go('standing') renders the standing qard");
ok(/سُلفة/.test(stg) && /قرضٌ حسن/.test(stg), "standing screen shows «سُلفةٌ بالمعروف — قرضٌ حسنٌ قائم»");
ok(/أبو فهد/.test(stg) && /راميش/.test(stg), "standing shows the two fixed parties (employer → worker)");
ok(/أُثبِت/.test(stg) && /باقٍ/.test(stg), "standing shows the conservation ledger (posted · repaid · outstanding)");
ok(/المراجعة الشرعيّة/.test(stg) && /OT-VAL/.test(stg), "standing carries the VISIBLE counsel seam note (wage-linkage pending sign-off)");
ok(stg.indexOf("%") < 0 && !/\b\d{1,3}\s*٪/.test(stg), "standing shows no percentage/score");
let stgt = noThrow(() => App.standingTamperToggle(), "standing tamper toggle ON");
ok(/عبثٌ مكشوف/.test(stgt), "tampering the standing amount breaks its seal (live)");
noThrow(() => App.standingTamperToggle(), "standing tamper toggle OFF (restore)");

/* ---- «أثر عهد» impact analytics (JL-3) — CONTEXTUAL (home card + settle chip):
   k-anonymous netting-efficiency aggregates over honestly-labeled test circles
   + the animated 9→2 collapse (CSS-only toggle). Spine: aggregates only, no
   percentage glyph, no individual's number. ---- */
ok(!!sandbox.Impact, "Impact module attaches to window");
ok(navKeys.indexOf("impact") < 0, "«أثر عهد» is CONTEXTUAL — a home card + settle chip, not a nav pill");
ok(/أثر عهد/.test(App.go("home")), "home surfaces the «أثر عهد» analytics card");
ok(/أثر عهد/.test(App.go("settle")), "the settle screen offers the «أثر عهد» chip (contextual bridge)");
let im = noThrow(() => App.go("impact"), "go('impact') renders the impact analytics screen");
ok(/أثر عهد/.test(im), "impact shows the «أثر عهد» heading");
ok(/دوائر تجريبيّة/.test(im) && /بيانات اختبار/.test(im), "impact honestly labels its data «دوائر تجريبيّة (بيانات اختبار)»");
ok(/لا يُعرَض تجميعٌ لأقلّ من/.test(im), "the k-anonymity floor is stated on screen (no bucket under 3 circles)");
ok(im.indexOf("%") < 0 && im.indexOf("٪") < 0, "impact renders NO percentage glyph anywhere (absolute numbers + words only)");
ok(/im-collapse/.test(im) && /<svg/.test(im) && /شاهد الانهيار/.test(im), "the animated 9→2 collapse block renders (inline SVG + CSS-only class toggle)");
const seSrcDigits = fs.readFileSync(path.join(APP, "screens", "settlement.js"), "utf8");
const imSrcDigits = fs.readFileSync(path.join(APP, "screens", "impact.js"), "utf8");
ok(/App\.digit\(v\.beforeCount\)/.test(seSrcDigits) && /App\.digit\(v\.afterCount\)/.test(seSrcDigits),
  "settlement headline counts route through App.digit (one numeral system, user-toggled)");
ok(!/شاهد الانهيار ٩/.test(imSrcDigits) && /شاهد الانهيار ' \+ App\.digit\(/.test(imSrcDigits),
  "impact collapse button digits route through App.digit (no hardcoded Arabic-Indic glyphs)");
ok(/المالُ المتحرّك/.test(im) && /1,800/.test(im) && /900/.test(im), "the collapse caption reuses the settle screen's computed values (1,800 → 900 SAR)");
noThrow(() => App.impactCollapse(), "the collapse toggle flips a class (no rerender, no throw)");
ok(/متوسّط التحويلات الموفَّرة/.test(im) && /٫/.test(im), "distribution rows render integer-tenths averages (Arabic decimal separator, no floats)");
ok(/flex-grow/.test(im), "distribution bars are sized via integer flex-grow inline styles (no % text)");
ok(/وفّرت المقاصّةُ تحريكَ/.test(im), "totals carry the saved-movement line «وفّرت المقاصّةُ تحريكَ …»");
ok(!/م[١٢٣٤٥٦٧٨]/.test(im), "aggregates only — no individual member code (م١..م٨) appears anywhere on screen");

/* ---- «الضمانات والحدود» (JL-4) — CONTEXTUAL (home card + chips on «ما عليّ» and
   «حافظة الإثبات»): guarantees-as-code, every بند naming its real guard file. ---- */
ok(!!sandbox.Bounds, "Bounds module attaches to window");
ok(navKeys.indexOf("bounds") < 0, "«الضمانات والحدود» is CONTEXTUAL — a home card + chips, not a nav pill");
ok(/الضمانات والحدود/.test(App.go("home")), "home surfaces the «الضمانات والحدود» card");
ok(/الضمانات والحدود/.test(App.go("mine")), "«ما عليّ» offers the bounds chip (what protects the debtor)");
let pfBounds = noThrow(() => App.openProof("R-SULTAN"), "open a proof to reach its bounds chip");
ok(/الضمانات والحدود/.test(pfBounds), "«حافظة الإثبات» offers the bounds chip (the guarantees behind the seal)");
let bd = noThrow(() => App.go("bounds"), "go('bounds') renders the guarantees panel");
ok(/للمدين/.test(bd) && /للدائن/.test(bd) && /حدود المصرف/.test(bd), "bounds shows the three columns (للمدين · للدائن · حدود المصرف)");
ok(/يحرسه:/.test(bd) && /riba-lint-corpus\.test\.cjs/.test(bd), "every guarantee names its guard — an enforcedBy file is visible on screen (يحرسه: …)");
ok(/settlement-conserve\.test\.cjs/.test(bd) && /app-dom-smoke\.cjs/.test(bd), "the lender conservation + amber-not-red guards are named on screen");
ok(/cd tests && node run-all\.cjs|cd tests &amp;&amp; node run-all\.cjs/.test(bd), "the printed run-command invites the judge to run the whole gate");
ok(bd.indexOf("%") < 0 && bd.indexOf("٪") < 0, "bounds renders NO percentage glyph anywhere");
ok(/اطلب تشغيله/.test(bd) && /دون إنترنت/.test(bd), "the footer states the guards run offline + invites «اطلب تشغيله»");
ok(!/tone-red/.test(bd), "bounds carries no red tone (amber-not-red spine)");

console.log("\n" + "=".repeat(56));
console.log("APP DOM SMOKE: " + passed + " passed, " + failed + " failed");
console.log("=".repeat(56));
process.exit(failed ? 1 : 0);
