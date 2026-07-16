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
const FILES = ["engine.js", "features/home-layout.js", "features/refusal.js", "features/hash-diff.js", "features/daftari.js", "features/next-step.js", "features/review-gate.js", "features/pay-confirm.js", "features/open-loan.js", "features/circle-adv.js", "features/create.js", "features/request.js", "features/settlement.js", "features/settle-presets.js", "features/sources.js", "features/impact.js", "features/impact-drill.js", "features/impact-national.js", "features/impact-band.js", "features/market-model.js", "features/data-rigor.js", "features/rifq.js", "features/circle.js", "features/timeline.js", "features/proof.js", "features/dispute.js", "features/settings.js", "features/borrower.js", "features/care.js", "features/covenant-log.js", "features/exhibit-view.js", "features/standing-loan.js", "features/bounds.js", "features/bounds-detail.js", "features/billing.js", "features/fee-receipt.js", "features/org.js", "app.js", "screens/home.js", "screens/refusal.js", "screens/daftari.js", "screens/open-loan.js", "screens/circle-adv.js", "screens/create.js", "screens/request.js", "screens/settlement.js", "screens/impact.js", "screens/circle.js", "screens/timeline.js", "screens/proof.js", "screens/dispute.js", "screens/settings.js", "screens/borrower.js", "screens/covenant.js", "screens/standing.js", "screens/bounds.js", "screens/plans.js", "screens/org.js"];
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
ok(/وش الوضع؟/.test(hh) && /عهد-/.test(hh), "home's next-step strip answers وش الوضع؟ with a reference chip (Zirtue G1 + Najiz G3)");
ok(/المتفق عليه/.test(hh) && /ما حدث/.test(hh) && /التالي/.test(hh), "next-step strip carries the three questions: agreed / happened / next");
ok(/لحظة محفوظة/.test(hh) && !/\b\d{1,3}\s*[%٪]/.test(hh), "the witnessed-moments tally is a count (لحظة محفوظة), never a percentage/score");
/* Front A — the front door has hierarchy + the Sadu identity, not a flat menu */
ok(/sadu-band/.test(hh), "Front A: the woven Sadu identity strip renders in the shell (every screen)");
ok(/home-hero-tile/.test(hh) && /أنشئ عهدًا/.test(hh), "Front A: one dominant hero tile carries أنشئ عهدًا");
ok((hh.match(/class="hgrid[^"]*"/g) || []).length >= 1, "Front A: primary destinations render in a grid, not a flat list");
ok(/class="hmore"/.test(hh) && /المزيد/.test(hh), "Front A: secondary destinations fold into a «المزيد» disclosure");
ok(/home-emblem/.test(hh) && /src="assets\/ahd-logo\.png"/.test(hh) && !/class="oct"/.test(hh),
   "Front A: the approved primary logo marks the front door");
ok(/أثر عهد/.test(hh) && /الأجرة والخطط/.test(hh) && /لوحة المؤسسة/.test(hh), "Front A: every destination stays reachable (folded into المزيد, still in the DOM)");
/* W5 spine regression: the weave's «tamper» red is reserved for a live tampered
   seal ONLY — an overdue thread is always amber, never red (2:280 grace) */
ok(/hw-thread amber/.test(hh), "W5 spine: an overdue عهد's thread renders amber in the weave");
ok(!/hw-thread tamper/.test(hh) && !/hw-lg tamper/.test(hh), "W5 spine: with nothing tampered, the weave carries NO tamper/red thread or legend entry");
/* Front B — the refusal is SEEN (block-and-explain), not merely spoken */
let rf = noThrow(() => App.go("refusal"), "go('refusal') renders «ما لا يفعله عهد»");
ok(/لا يُقرض/.test(rf) && /لا يُقيّم/.test(rf) && /لا يحكم/.test(rf), "Front B: all three refusals render");
ok((rf.match(/rf-card/g) || []).length === 3, "Front B: exactly three block-and-explain refusal cards");
ok(/rf-ctl/.test(rf) && /معطّل/.test(rf), "Front B: each refusal greys out the bank control it refuses");
ok(/rf-charity/.test(rf) && /صدقة/.test(rf), "Front B: the charity beat (اجعلها صدقة) is a celebrated hero card, not a fallback");
ok(/app\/features\/(bounds|daftari|dispute)\.js/.test(rf), "Front B: refusals cite their real guard files on screen");
ok(/ما لا يفعله عهد/.test(App.go("home")), "Front B: the refusal screen is reachable from home");
ok(/rf-do/.test(rf) && /القرض المفتوح/.test(rf), "Front B+: the charity beat is an actionable DOORWAY to the real إبراء flow, not just a poster");
/* W5 refusal beat: a strong, quotable on-screen pull-quote leads the screen */
ok(/rf-quote/.test(rf) && new RegExp(sandbox.Refusal.QUOTE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(rf), "W5: the quotable pull-quote («what we refuse to do IS the product») renders on screen");
ok(rf.indexOf("rf-quote") < rf.indexOf("rf-head"), "W5: the pull-quote leads the screen, ahead of the heading");

/* دفتري home renders */
let h = noThrow(() => App.go("daftari"), "go('daftari') renders the creditor home");
ok(/لك عند الناس/.test(h), "home shows «لك عند الناس» tile");
ok(/عليك للناس/.test(h), "home shows «عليك للناس» tile");
ok(/مقهى الحي|سلطان/.test(h), "home lists Naif's debtors (لي tab default)");
ok(/row-next/.test(h) && /عهد-/.test(h), "daftari rows carry a per-row next-step line + reference (Zirtue G1)");
ok(/dperson/.test(h) && /الكل/.test(h), "daftari offers person-filter chips (Splitwise G6)");
let hPerson = noThrow(() => App.daftariPerson("سلطان"), "filter the ledger by one person");
ok(/class="who">سلطان</.test(hPerson) && !/class="who">مقهى الحي</.test(hPerson), "person filter keeps only that person's rows (chips still list everyone)");
noThrow(() => App.daftariPerson("الكل"), "person filter resets with «الكل»");
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
ok(/راجع قبل الختم/.test(cr), "create offers the review step FIRST — nothing seals unreviewed (Najiz/DocuSign G2)");
let crv = noThrow(() => App.createOpenReview(), "open the fixed review before sealing");
ok(/هذا ما سيُختَم/.test(crv) && /ما ليس في هذا العهد/.test(crv), "review card shows the frozen summary + the absent list (لا فائدة/لا غرامة/لا حيازة)");
ok(/بصمة المعاينة/.test(crv) && /أكّد واختم العهد عبر نفاذ \(محاكاة\)/.test(crv), "review carries a preview fingerprint + the confirm-seal button with the (محاكاة) honesty tag");
noThrow(() => App.createBackFromReview(), "step back from review to edit");
let crb = noThrow(() => App.createInjectRiba(), "inject a late-penalty clause");
ok(/✗/.test(crb) && /غرامة|تأخير/.test(crb), "linter BLOCKS the penalty clause with the reason + halal fix");
ok(/disabled/.test(crb), "seal button is disabled while the terms are blocked");
ok(/cr-fields/.test(crb), "create screen keeps the summary card (cr-fields) when the linter blocks");
ok(/المُقرِض/.test(crb), "create screen still shows the lender label when the linter blocks");
noThrow(() => App.createClearRiba(), "remove the offending clause");
let crs = noThrow(() => App.createSeal(), "seal the clean عهد (Nafath + SHA-256)");
ok(/SEAL:/.test(crs), "after seal: a witnessed record with a SHA-256 seal");
ok(/نفاذ \(محاكاة\) \+ SHA-256/.test(crs), "the sealed-doc label states نفاذ (محاكاة) — no unconfirmed-integration claim (OT-VAL)");
/* Phase A revenue: the fee receipt surfaces AT the seal moment — the money story, spine-clean */
ok(!!sandbox.Billing && !!sandbox.FeeReceipt, "Billing + FeeReceipt modules attach to window");
ok(/الزيادة على القرض/.test(crs) && /أجرة توثيقٍ ثابتة/.test(crs), "the seal moment surfaces the TWO-LINE fee receipt (الزيادة على القرض · أجرة توثيقٍ ثابتة)");
ok(/0\.00 ر\.س/.test(crs) && /5\.00 ر\.س/.test(crs), "the receipt shows 0.00 on the قرض + a flat 5.00 أجرة — two separate lines, never summed (spine)");
ok(/قيد المراجعة الشرعيّة/.test(crs), "the seal receipt carries the honest «قيد المراجعة الشرعيّة» badge (D-6)");
ok(crs.indexOf("%") < 0 && !/\b\d{1,3}\s*٪/.test(crs), "the seal receipt adds no percentage/score glyph");
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

/* ---- «رِفْق» mercy-first clearing (I-L1) — contextual toggle on the Muqassa screen ---- */
ok(!!sandbox.Rifq, "Rifq module attaches to window");
ok(/رِفْق/.test(se) && se.indexOf("rifq-panel") < 0, "the رِفْق toggle renders OFF by default (button only, no panel yet)");
let seOn = noThrow(() => { App.rifqToggle(); return App.go("settle"); }, "rifqToggle() then go('settle') does not throw");
ok(/rifq-panel/.test(seOn), "رِفْق panel renders once the toggle is flipped ON");
ok(/أعلنت العُسر/.test(seOn) && /شهد دائنوها/.test(seOn), "the panel names the declared+witnessed hardship (never inferred)");
ok(/مؤجَّلٌ بالمعروف/.test(seOn) || /لا التزامَ على/.test(seOn), "the panel honestly shows either deferred obligations or that none exist");
ok(/برهان الحفظ يصمد مع رِفْق أيضًا/.test(seOn), "the panel proves conservation holds WITH رِفْق too");
ok(/السلسلة الذهبيّة/.test(seOn), "the panel names the grace event as sealed into the golden chain");
ok(seOn.indexOf("%") < 0 && !/\b\d{1,3}\s*٪/.test(seOn), "no percentage/score anywhere in the رِفْق panel");
noThrow(() => App.rifqToggle(), "rifqToggle() back OFF does not throw");
let seOff = noThrow(() => App.go("settle"), "go('settle') after toggling back off");
ok(seOff.indexOf("rifq-panel") < 0, "toggling رِفْق back OFF removes the panel (additive, non-sticky)");

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
/* W5 signature moment: the cascade is sharpened — BOTH the content-hash link and
   the seal link break (not just the endpoint), genesis (a fixed root) stays calm,
   and the connecting arrow visibly tears — narratable in one breath. */
ok(/ch-content broken/.test(pft) && /ch-seal broken/.test(pft), "W5: tamper cascades — both the content-hash link and the seal link break, not just the endpoint");
ok(/ch-link tear/.test(pft), "W5: the arrow connecting the two broken links visibly tears (red)");
ok(/class="ch"><span>genesis/.test(pft), "W5: genesis stays a plain, untouched root — it never derives from the tampered text");
ok(/pf-tear-note/.test(pft) && /خيط.*يتمزّق/.test(pft), "W5: a one-breath caption ties the cascade to the ONE metaphor (the thread tears)");
ok(/pf-weave-link/.test(pft) && /نسيج عهودك/.test(pft), "W5: a live doorway from the tamper cascade to the home weave payoff");
/* W5 metaphor payoff: the SAME live tamper state tears exactly ONE thread on the home weave */
let homeTorn = noThrow(() => App.go("home"), "W5: follow the tamper state to the home weave");
ok(/hw-thread tamper/.test(homeTorn), "W5: the home weave renders the tampered record's thread torn/red");
ok((homeTorn.match(/hw-thread tamper/g) || []).length === 1, "W5: ONLY the one tampered thread turns red — every other thread keeps its normal tone");
ok(/hw-lg tamper/.test(homeTorn) && /عبثٌ مكشوف/.test(homeTorn), "W5: the weave legend explains the live tear (shown only while a tamper is active)");
noThrow(() => App.go("proof"), "back to the proof screen");
noThrow(() => App.proofTamperToggle(), "tamper toggle OFF (restore)");
ok(/سليمة/.test(App.go("proof")), "restored record verifies ✓ again");
let homeRestored = noThrow(() => App.go("home"), "W5: after restore, the weave carries no torn thread");
ok(!/hw-thread tamper/.test(homeRestored) && !/hw-lg tamper/.test(homeRestored), "W5: red disappears from the weave once the tamper is fixed — it is a LIVE state, never sticky");
noThrow(() => App.go("proof"), "back to proof for the remaining Front C assertions");
/* Front C — the judge types their OWN tamper amount; full-hash nibble diff */
ok(/pf-try/.test(App.go("proof")) && /اعبث بنفسك/.test(App.go("proof")), "Front C: the proof screen invites the judge to type their own tamper amount");
let pcSet = noThrow(() => App.proofTamperSet(String(App.recordById("R-CAFE").amountSAR + 1)), "proofTamperSet(+1) applies a judge-chosen tamper");
ok(/عبثٌ مكشوف/.test(pcSet) && /hexfull/.test(pcSet), "Front C: a judge-typed amount breaks the seal and renders the FULL hash");
ok(/<span class="d">/.test(pcSet), "Front C: the diverging hex nibbles are highlighted (the avalanche is SEEN, not narrated)");
let pcSame = noThrow(() => App.proofTamperSet(String(App.recordById("R-CAFE").amountSAR)), "proofTamperSet(original) — the same amount");
ok(/سليمة/.test(pcSame), "Front C: typing the ORIGINAL amount is not tampering → still ✓ سليمة");
noThrow(() => App.proofTamperSet(""), "proofTamperSet('') clears the judge tamper cleanly");
/* Front D — the national compression scenario is ON the guaranteed settle screen */
let seD = App.go("settle");
ok(/se-nat/.test(seD) && /حجم المشكلة الوطنيّة/.test(seD), "Front D: the national scenario card renders on the settle screen");
ok(/571|٥٧١/.test(seD), "Front D: the cited 571,251 execution-request figure is on screen");
ok(/توضيحيّ/.test(seD) && /لا رقمٌ مُقاس/.test(seD), "Front D: the scenario is hard-labelled illustrative, not measured");
ok(/محاكم التنفيذ/.test(seD) && /EVIDENCE-BRIEF/.test(seD), "Front D: the D-1 source is cited on screen");
ok(/من كلّ ١٠٠/.test(seD), "Front D: the share reads «من كلّ ١٠٠» — no % glyph");
/* data-honesty fix (Loop 2): the ratio must never be called "measured" (مقاسة),
   the national projection must be rounded (not a spurious 6-figure literal), and
   the synthetic-circle caveat must live ON this card, not only on the impact
   screen's collapsed sources panel */
ok(!/مقاسة/.test(seD), "Front D: the card never calls the ratio «مقاسة» (measured) — contradicted its own «لا رقمٌ مُقاس» label");
ok(!/١٩٠٬٤١٧|190,417|١٩٠،٤١٧/.test(seD), "Front D: the projected settlements figure is NOT the spurious 6-figure literal");
ok(!/٣٨٠٬٨٣٤|380,834|٣٨٠،٨٣٤/.test(seD), "Front D: the avoided-claims figure is NOT the spurious 6-figure literal");
ok(/se-nat-caveat/.test(seD) && /دائرةَ اختبارٍ/.test(seD), "Front D: an on-card caveat states the ratio is computed over synthetic test circles");
ok(/بيانات تجريبيّة/.test(seD), "Front D: the on-card caveat plainly says «test data», not real usage");
/* D1 gate-coverage fix: features/impact-band.js is now in the DOM-smoke FILES
   list (window.ImpactBand is defined), so the settle screen's Front D card
   renders the p10-p50-p90 SENSITIVITY BAND, not the old single-point fallback
   (see screens/settlement.js: bandLine is only "" when window.ImpactBand is
   undefined). Assert the BAND-specific text renders and the old fallback's
   headline text does NOT — proving this suite exercises the real, current
   render path, not a stale one silently masked by a missing FILES entry. */
ok(!!sandbox.ImpactBand, "ImpactBand module attaches to window (now loaded in the DOM smoke)");
ok(/نطاق توضيحيّ حتميّ/.test(seD), "Front D (D1): the sensitivity-band label renders on the settle screen");
ok(/نسبةُ الانضغاط تتفاوت بتفاوت شكل الدائرة/.test(seD), "Front D (D1): the band's own headline sentence renders (replaces the fragile single-point ratio)");
ok(/دائرةَ اختبارٍ توليديّة/.test(seD) && /200/.test(seD), "Front D (D1): the band names its 200 generative test circles");
ok(!/نسبةُ الضغط في دوائر عهد التجريبيّة/.test(seD), "Front D (D1): the OLD single-point fallback headline is gone now that ImpactBand is loaded (no silent double-render)");
ok(/نقطةُ عهد الأصليّة/.test(seD), "Front D (D1): the old single point is kept only as a labelled reference value shown to sit inside the band, never the headline");
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
ok(/راجع قبل الإرسال/.test(rq), "request offers the review step FIRST (Najiz/DocuSign G2)");
let rqv = noThrow(() => App.requestOpenReview(), "open the fixed review before sending");
ok(/هذا ما سيُرسَل/.test(rqv) && /أكّد وأرسِل الطلب/.test(rqv), "request review shows the frozen summary + confirm-send");
let rqs = noThrow(() => App.requestSend(), "send the request");
ok(/بانتظار موافقة/.test(rqs), "after send: «أُرسل — بانتظار موافقة {lender}»");
let rqa = noThrow(() => App.requestAccept(), "lender accepts (محاكاة) → seals the عهد");
ok(/أُضيف إلى دفترك|خُتم العهد/.test(rqa), "after accept: the sealed عهد is added to دفتري");
ok(!!App.recordById("REQ-NAIF") && App.recordById("REQ-NAIF").borrower === "نايف", "the accepted request is a real record with borrower=you → it lands in «عليّ»");

/* ---- تصديق السداد (Najiz G4): claim → confirm/reject-with-reason, no silent balance change ---- */
ok(!!sandbox.PayConfirm, "PayConfirm module attaches to window");
/* measure via the BORROWER projection (partial payments knock remainingMinor there;
   the daftari rowFor projection counts whole installments only) */
const pcRemOf = (id) => App.Borrower.borrowerObligations(App.records, App.viewer, App.engine, App.AS_OF)
  .filter(o => o.record.id === id)[0].remainingMinor;
const pcRemBefore = pcRemOf("R-FAHD");
let bwPc = noThrow(() => App.go("mine"), "go('mine') renders the borrower screen with the confirm-payment ask");
ok(/اطلب تصديقها/.test(bwPc), "borrower row offers «سجّلت دفعة — اطلب تصديقها»");
let bwClaim = noThrow(() => App.pcClaim("R-FAHD", 100, "حوالة مصرفية — مرجع 55821"), "record a payment claim with a مؤيد");
ok(/بانتظار تصديق/.test(bwClaim), "after the claim: a pending-confirmation chip, no balance move yet");
ok(pcRemOf("R-FAHD") === pcRemBefore, "the claim does NOT move the balance — no silent change (درس ناجز)");
noThrow(() => App.pcAccept("PC-1"), "the counterparty accepts (محاكاة) → the payment seals via payWhatEased");
ok(pcRemOf("R-FAHD") === pcRemBefore - 10000, "the balance moves ONLY on acceptance (100 ر.س = 10000 هللة)");
noThrow(() => App.pcClaim("R-FAHD", 50, "نقدًا أمام شاهد"), "a second claim");
let pcRejFlash = noThrow(() => App.pcReject("PC-2", "notReceived"), "the counterparty rejects with a fixed-enum reason");
ok(/لم يصلني/.test(pcRejFlash), "the rejection flash carries the enum reason");
ok(pcRemOf("R-FAHD") === pcRemBefore - 10000, "a rejected claim never moves the balance");
/* creditor side: a debtor's claim lands in دفتري's «دفعات بانتظار تصديقك» box */
App.payConfirmState = sandbox.PayConfirm.claim(App.payConfirmState, { recordId: "R-CAFE", amountMinor: 5000, evidenceAr: "حوالة — مرجع 90144", byAr: "سالم" });
App.daftariState.tab = "me"; App.daftariState.filter = "all";   // arrange: the creditor side
let dfPc = noThrow(() => App.go("daftari"), "daftari renders the pending-confirmation box");
ok(/دفعات بانتظار تصديقك/.test(dfPc) && /90144/.test(dfPc), "pc-box lists the debtor's claim with its evidence");
ok(/ارفض بسبب/.test(dfPc) && /لم يصلني/.test(dfPc), "pc-box offers accept + the fixed reject-reason enum");
noThrow(() => App.pcReject("PC-3", "amount"), "creditor rejects the café claim (amount mismatch)");
ok(/افتح محلّ خلاف/.test(App.go("daftari")), "a rejected claim offers opening «محلّ خلاف» — both records kept");

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
ok(!!sandbox.DataRigor && !!sandbox.MarketModel, "impact dependencies load into the browser realm");
ok(/dr-ladder/.test(im), "impact renders the evidence-ladder container");
ok(/dr-details/.test(im), "impact keeps detailed evidence behind a readable disclosure");
ok(/سلّم الدليل/.test(im) && /GASTAT/.test(im) && /TAM/.test(im) && /نافذ/.test(im), "impact renders the source-bounded evidence ladder");
ok(/ليست توزيعًا لقروض الأفراد/.test(im) && /دوائر تجريبيّة/.test(im), "impact separates GASTAT context from synthetic fixtures");
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

/* ---- «المصادر والمنهجيّة» (W3, data criterion) — every external/aggregate
   figure named with its year + measured-vs-illustrative flag, one collapsed
   tap away on the impact screen; ties the honest label to a real dataset. ---- */
ok(!!sandbox.Sources, "Sources module attaches to window");
ok(/im-sources/.test(im) && /المصادر والمنهجيّة/.test(im), "impact screen renders the «المصادر والمنهجيّة» expandable section");
ok(/٥٧١٬٢٥١/.test(im) && /٢٠٢٠–٢١/.test(im), "the sources section names the real D-1 figure (571,251) with its year (2020–21)");
ok(/🟢 مقاسٌ ومُوثَّق/.test(im) && /🟡 توضيحيّ/.test(im), "the sources section visibly flags at least one MEASURED and one ILLUSTRATIVE entry");
ok(/أولي|ثانوي|نموذج/.test(im), "the sources section visibly states primary, secondary, or model provenance");
ok(/im-src-grade/.test(im), "each source provenance appears in a dedicated grade badge");
/* D2 (data-rigor): the real, primary-sourced Findex demand figure is visible beside
   the synthetic-fixture caveat — a judge SEES a real KSA demand signal, not just D-1 */
ok(/٣٥٫٨/.test(im) && /World Bank/.test(im), "the sources section surfaces the real Findex demand figure (35.8%) with its World Bank citation");
ok((im.match(/im-src-row/g) || []).length === sandbox.Sources.SOURCES.length, "every dataset entry renders exactly one source row (no drift between the data and the screen)");
ok(/دوائر تجريبيّة/.test(im.split("im-sources")[1] || ""), "the sources section itself names the fixture circles as test data (ties the JL-8 gap to a citation)");

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

/* ---- «الأجرة والخطط» (Phase A revenue) — CONTEXTUAL (home card), spine-clean ---- */
ok(!!App.screens.plans, "the plans screen registered over the Billing engine");
ok(navKeys.indexOf("plans") < 0, "«الأجرة والخطط» is CONTEXTUAL — a home card, not a nav pill (nav stays 8)");
ok(/الأجرة والخطط/.test(App.go("home")), "home surfaces the «الأجرة والخطط» revenue card");
let plans = noThrow(() => App.go("plans"), "go('plans') renders the revenue page");
ok(/أجرة على الخدمة، لا على القرض/.test(plans) && /القرض مجاني/.test(plans), "plans states the thesis + «القرض مجانيٌّ للأبد»");
ok(/الزيادة على القرض/.test(plans) && /0\.00 ر\.س/.test(plans) && /5\.00 ر\.س/.test(plans), "plans shows the live two-line fee receipt (0.00 on the قرض / flat 5.00 أجرة)");
ok(/2,900/.test(plans) && /250,000/.test(plans), "plans shows the institutional + white-label flat prices");
ok(plans.indexOf("%") < 0 && plans.indexOf("٪") < 0, "the revenue page carries no percentage/score glyph");
noThrow(() => App.go("home"), "return home after plans");

/* ---- «لوحة المؤسسة» (Phase B) — CONTEXTUAL; the first paying customer's surface ---- */
ok(!!sandbox.Org, "Org module attaches to window");
ok(!!App.screens.org, "the org screen registered over the Org + Billing engines");
ok(navKeys.indexOf("org") < 0, "«لوحة المؤسسة» is CONTEXTUAL — a home card, not a nav pill (nav stays 8)");
ok(/لوحة المؤسسة/.test(App.go("home")), "home surfaces the «لوحة المؤسسة» card");
let orgv = noThrow(() => App.go("org"), "go('org') renders the institution dashboard");
ok(/لوحة المؤسسة · صندوق قرض حسن/.test(orgv), "org shows the «لوحة المؤسسة · صندوق قرض حسن» header");
ok(/صندوق البِرّ للقرض الحسن/.test(orgv) && /بيانات اختبار/.test(orgv), "org names the (honestly-labelled) test fund");
ok(/17,300/.test(orgv) && /5,650/.test(orgv), "org shows aggregate money (17,300 disbursed · 5,650 outstanding ر.س)");
ok(/360\.00 ر\.س\/شهر/.test(orgv), "org shows the FLAT monthly SaaS invoice (360.00 ر.س/شهر, from Billing)");
ok(/نسبةٌ من قروض الأعضاء/.test(orgv) && /0\.00 ر\.س/.test(orgv), "org states «نسبةٌ من قروض الأعضاء 0.00» — the fee never scales with member loans");
ok(/لا يحتفظ الصندوق بمالٍ مجمَّع/.test(orgv), "org guard: the fund holds NO pooled money (spine)");
ok(/لا رقمَ فردٍ/.test(orgv) && /لا تصنيف/.test(orgv), "org guard: aggregates only, no per-person number/score");
ok(/قيد المراجعة الشرعيّة/.test(orgv), "org's invoice carries the honest «قيد المراجعة الشرعيّة» badge");
ok(orgv.indexOf("%") < 0 && orgv.indexOf("٪") < 0, "the institution dashboard carries no percentage/score glyph");
ok(!/C-\d\d/.test(orgv), "aggregates only — no covenant id (C-01…) leaks onto the dashboard");
noThrow(() => App.go("home"), "return home after org");

console.log("\n" + "=".repeat(56));
console.log("APP DOM SMOKE: " + passed + " passed, " + failed + " failed");
console.log("=".repeat(56));
process.exit(failed ? 1 : 0);
