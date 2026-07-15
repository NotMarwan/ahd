# Competitive Capability Adoption Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adopt the highest-value capabilities from the seven benchmark apps (Zirtue, Splitwise, Hakbah, MoneyFellows, Najiz, DocuSign, Sulfah) into `app/`, plus a moderate-modern tone pass — per spec `docs/superpowers/specs/2026-07-16-competitive-capability-adoption-design.md`.

**Architecture:** Every capability is a NEW pure DI feature module in `app/features/` (UMD factory, Node-testable, no DOM), wired into existing screens via `app/app.js` actions and screen HTML. The golden engine is called, never modified. Screens re-render deterministically (second render byte-identical).

**Tech Stack:** Plain ES5-style JS (UMD factories), Node test scripts in `tests/app/` (auto-discovered `*.test.cjs`), no deps.

## Global Constraints

- NEVER touch `demo/index.html`, `app/engine.js` internals, or golden functions (`sha256, canonical, sealBlock, recomputeSeal, verifyRecord, netting core, fmt, respread`). Call only.
- Determinism: no `Date.now` / `new Date` / `Math.random` / `Intl` / `.toLocaleString` / float money. Fixed `AS_OF = "2026-06-21"`. Integer halalas.
- TDD: failing test first. Gate after every task: `node tests/app/run-app-tests.cjs` (84+ suites green), full: `cd tests && node run-all.cjs` (3175+).
- Never weaken an existing assertion. Tone changes update test strings 1:1, structure intact.
- No riba/penalty/custody/payments/credit-score/auto-fatwa. Rejected benchmark features stay rejected.
- Branch `claude/competitive-features-plan-50ab83` only. No merge to main.
- Feature-module pattern (copy exactly):
```js
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ModuleName = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  /* ... */
  return { api: api };
});
```
- Test-file pattern (copy exactly):
```js
const path = require("path");
let M;
try { M = require(path.join(__dirname, "..", "..", "app", "features", "file.js")); }
catch (e) { console.log("NAME RED: " + e.message); process.exit(1); }
let passed = 0, failed = 0;
const ok = (c, n) => c ? (passed++, console.log("  ✓ " + n)) : (failed++, console.log("  ✗ " + n));
/* asserts */
console.log(`\nNAME: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
```

---

### Task 1: NextStep feature — «المتفق عليه / ما حدث / التالي» (Zirtue G1 + Najiz G3)

**Files:**
- Create: `app/features/next-step.js`
- Test: `tests/app/next-step.test.cjs`

**Interfaces:**
- Consumes: a daftari ROW (output of `Daftari.rowFor`): `{ id, role, counterparty, amountSAR, remainingSAR, statusKey, isOverdue, graced, nextDueLabel, daysOverdue }`. No engine dependency.
- Produces: `NextStep.fromRow(row) -> { ref, agreedAr, happenedAr, nextAr, tone }` and `NextStep.refOf(id) -> "عهد-XXXX"`. `tone` ∈ `"ok"|"warm"|"attention"`.

- [ ] **Step 1: Write the failing test** `tests/app/next-step.test.cjs`:

```js
const path = require("path");
let NS;
try { NS = require(path.join(__dirname, "..", "..", "app", "features", "next-step.js")); }
catch (e) { console.log("NEXTSTEP RED: " + e.message); process.exit(1); }
let passed = 0, failed = 0;
const ok = (c, n) => c ? (passed++, console.log("  ✓ " + n)) : (failed++, console.log("  ✗ " + n));

ok(NS.refOf("R-CAFE") === "عهد-CAFE", "refOf strips R- prefix into عهد-");
ok(NS.refOf("NEW-1") === "عهد-NEW-1", "refOf keeps ids without R- prefix whole");

const active = { id: "R-CAFE", role: "lender", counterparty: "سالم", amountSAR: 500, remainingSAR: 300, statusKey: "ACTIVE", isOverdue: false, graced: false, nextDueLabel: "١٥ يوليو", daysOverdue: 0 };
const a = NS.fromRow(active);
ok(a.ref === "عهد-CAFE", "active row carries ref");
ok(a.agreedAr.indexOf("500") >= 0 && a.agreedAr.indexOf("سالم") >= 0, "agreed line names party + amount");
ok(a.happenedAr.indexOf("200") >= 0, "happened line shows paid so far (500-300)");
ok(a.nextAr.indexOf("١٥ يوليو") >= 0, "next line points to next due");
ok(a.tone === "ok", "active tone ok");

const overdue = Object.assign({}, active, { isOverdue: true, daysOverdue: 9, statusKey: "ACTIVE" });
const o = NS.fromRow(overdue);
ok(o.tone === "attention" && o.nextAr.length > 0, "overdue gets attention tone + concrete next step");
ok(o.nextAr.indexOf("غرامة") < 0 && o.nextAr.indexOf("عقوبة") < 0, "no penalty language ever");

const graced = Object.assign({}, active, { graced: true });
ok(NS.fromRow(graced).tone === "warm", "graced tone warm");
const kept = Object.assign({}, active, { statusKey: "KEPT", remainingSAR: 0 });
const k = NS.fromRow(kept);
ok(k.nextAr.length > 0 && k.tone === "ok", "kept has a closing next step");
const disputed = Object.assign({}, active, { statusKey: "DISPUTED" });
ok(NS.fromRow(disputed).nextAr.indexOf("خلاف") >= 0, "disputed points to محل خلاف");

const two = NS.fromRow(active);
ok(JSON.stringify(two) === JSON.stringify(a), "deterministic: same row → identical output");

console.log(`\nNEXTSTEP: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Run to verify it fails.** `node tests/app/next-step.test.cjs` → `NEXTSTEP RED: Cannot find module`.
- [ ] **Step 3: Implement** `app/features/next-step.js` (UMD pattern above, `root.NextStep`):

```js
  function refOf(id) {
    var s = String(id || "");
    return "عهد-" + (s.indexOf("R-") === 0 ? s.slice(2) : s);
  }
  var NEXT = {
    ACTIVE_LENDER: "انتظر الموعد، أو أرسل تذكيرًا لطيفًا من دفتري.",
    ACTIVE_BORROWER: "سدّد قسطك قبل الموعد، أو اطلب مهلة إن ضاق الوقت.",
    OVERDUE_LENDER: "تواصل بلطف — تذكير، مهلة، أو جدولة جديدة. لا غرامة هنا.",
    OVERDUE_BORROWER: "سجّل دفعة، أو اطلب مهلة بكرامة — التأخر ليس جريمة.",
    GRACED: "في مهلة متفق عليها — لا خطوة مطلوبة الآن.",
    DISPUTED: "راجع «محلّ خلاف» — عهد يعرض السجل ولا يحكم.",
    KEPT: "اكتمل — يمكنك إغلاقه في سجلّ المعروف.",
    FORGIVEN: "أُبرئ — أثره محفوظ في سجلّ المعروف."
  };
  function fromRow(row) {
    var paid = Math.round((row.amountSAR - row.remainingSAR) * 100) / 100;
    var agreed = (row.role === "lender" ? "أقرضت " : "استلفت من ") + row.counterparty + " " + row.amountSAR + " ر.س";
    var happened = paid > 0 ? ("سُدّد " + paid + " ر.س، وبقي " + row.remainingSAR + " ر.س") : "لم تُسجَّل دفعات بعد";
    var next, tone;
    if (row.statusKey === "DISPUTED") { next = NEXT.DISPUTED; tone = "attention"; }
    else if (row.statusKey === "KEPT") { next = NEXT.KEPT; tone = "ok"; happened = "اكتمل السداد كاملًا"; }
    else if (row.statusKey === "FORGIVEN") { next = NEXT.FORGIVEN; tone = "warm"; }
    else if (row.graced) { next = NEXT.GRACED; tone = "warm"; }
    else if (row.isOverdue) { next = NEXT[row.role === "lender" ? "OVERDUE_LENDER" : "OVERDUE_BORROWER"]; tone = "attention"; }
    else { next = row.nextDueLabel ? ("الموعد القادم: " + row.nextDueLabel + ". " + NEXT[row.role === "lender" ? "ACTIVE_LENDER" : "ACTIVE_BORROWER"]) : NEXT[row.role === "lender" ? "ACTIVE_LENDER" : "ACTIVE_BORROWER"]; tone = "ok"; }
    return { ref: refOf(row.id), agreedAr: agreed, happenedAr: happened, nextAr: next, tone: tone };
  }
  return { fromRow: fromRow, refOf: refOf, NEXT: NEXT };
```

- [ ] **Step 4: Run test → PASS.** Then `node tests/app/run-app-tests.cjs` → all green (suite count +1).
- [ ] **Step 5: Commit** `feat: next-step feature — agreed/happened/next model (Zirtue G1, Najiz G3)`.

### Task 2: Wire NextStep into home + daftari + borrower + proof

**Files:**
- Modify: `app/index.html` (add `<script src="features/next-step.js">` beside other features)
- Modify: `app/app.js` (expose `NextStep` on App like other features, e.g. `App.NextStep = window.NextStep`)
- Modify: `app/screens/home.js` (status strip), `app/screens/daftari.js` + `app/screens/borrower.js` (per-row next line + ref), `app/screens/proof.js` (ref + last action line)
- Modify tests: `tests/app/app-dom-smoke.test.cjs` and affected screen smokes — ADD assertions (never remove).

**Interfaces:** Consumes `NextStep.fromRow(row)` + `Daftari.rowFor/buildLedger` already on app.

- [ ] **Step 1:** Extend home: after the `.hstanding` strip, render `وش الوضع؟` card for the single most-urgent row (first overdue, else first active): ref chip + three lines (المتفق عليه/ما حدث/التالي) + a button `AhdApp.go('daftari')`. CSS: add `.nsx` block to `app/app.css` (card + `.nsx.attention` amber border + `.nsx-ref` mono chip). Amber only, never red.
- [ ] **Step 2:** daftari + borrower rows: one-line `nextAr` under each live row + `ref` chip. proof: header line `المرجع: عهد-XXXX · آخر إجراء: <statusLabel>`.
- [ ] **Step 3:** Update smokes: home smoke asserts `وش الوضع؟` present + ref chip `عهد-`; daftari smoke asserts a `nextAr` string appears; second-render determinism still asserted.
- [ ] **Step 4:** `node tests/app/run-app-tests.cjs` green. **Step 5: Commit** `feat: status+next-step strips on home/daftari/borrower/proof`.

### Task 3: ReviewGate — مراجعة ثابتة قبل الختم (Najiz+DocuSign G2)

**Files:**
- Create: `app/features/review-gate.js`
- Test: `tests/app/review-gate.test.cjs`

**Interfaces:**
- Consumes: create draft `{ lender, borrower, amountMinor, months, open }` + terms string.
- Produces: `ReviewGate.build(draft, termsAr) -> { lines: [{k,v}], absentAr: [..3 items], fingerprint }`; `ReviewGate.fingerprint(str) -> 8-hex deterministic (djb2, NOT crypto — labeled بصمة معاينة)`.

- [ ] **Step 1: Failing test:**

```js
const draft = { lender: "نايف", borrower: "سالم", amountMinor: 50000, months: 5, open: false };
const r = RG.build(draft, "شروط تجريبية");
ok(r.lines.length >= 4, "summary has parties/amount/schedule lines");
ok(r.lines.some(l => l.v.indexOf("500") >= 0), "amount rendered in SAR from integer halalas");
ok(r.absentAr.length === 3 && r.absentAr.join("").indexOf("فائدة") >= 0, "absent list names لا فائدة/لا غرامة/لا زيادة");
ok(/^[0-9a-f]{8}$/.test(r.fingerprint), "fingerprint is 8 hex chars");
ok(RG.build(draft, "شروط تجريبية").fingerprint === r.fingerprint, "deterministic fingerprint");
ok(RG.build(draft, "شروط أخرى").fingerprint !== r.fingerprint, "different terms → different fingerprint");
const open = RG.build(Object.assign({}, draft, { open: true }), "x");
ok(open.lines.some(l => l.v.indexOf("مفتوح") >= 0), "open loan shows مفتوح schedule");
```

- [ ] **Step 2: RED run.** **Step 3: Implement** (djb2 over UTF-16 codes, `(h >>> 0).toString(16).padStart(8, "0")`; lines: المُقرِض/المقترض/المبلغ/السداد/النص; absentAr fixed 3 strings: `"لا فائدة ولا زيادة مشروطة"`, `"لا غرامة تأخير"`, `"لا خصم آلي ولا حيازة أموال"`). **Step 4: PASS + suite green.** **Step 5: Commit** `feat: review-gate fixed summary before seal`.

### Task 4: Wire ReviewGate into create + request

**Files:**
- Modify: `app/index.html`, `app/app.js` (state `createState.reviewing`; actions `createOpenReview()`, `createBackFromReview()`; `createSeal()` unchanged but now invoked from the review card's confirm button), `app/screens/create.js`, `app/screens/request.js`
- Modify tests: create/request screen smokes — add review-step assertions.

- [ ] **Step 1:** create.js: when clean & not sealed & `!st.reviewing` → primary button becomes `راجع قبل الختم` calling `AhdApp.createOpenReview()`. When `st.reviewing` → render review card: lines table + «ما ليس في هذا العهد» absent list + `بصمة المعاينة: <fingerprint>` + buttons `أكّد واختم` (calls `AhdApp.createSeal()`) / `عدّل` (back). Riba check still gates before review.
- [ ] **Step 2:** request.js: same two-step before the lender-accept simulation.
- [ ] **Step 3:** smokes assert `راجع قبل الختم` and, after `createOpenReview()`, `ما ليس في هذا العهد`. Determinism assertions intact.
- [ ] **Step 4: Gate green. Step 5: Commit** `feat: review-before-seal step in create/request`.

### Task 5: PayConfirm — تصديق السداد برد الطرف (Najiz G4)

**Files:**
- Create: `app/features/pay-confirm.js`
- Test: `tests/app/pay-confirm.test.cjs`

**Interfaces:**
- Produces:
  - `PayConfirm.makeState() -> { claims: [], seq: 0 }`
  - `PayConfirm.claim(state, { recordId, amountMinor, evidenceAr, byAr }) -> newState` (status `"pending"`, id `"PC-<seq>"`; throws on non-positive/non-integer amount or empty evidence)
  - `PayConfirm.accept(state, claimId) -> { state, accepted }` (status `"accepted"`)
  - `PayConfirm.reject(state, claimId, reasonKey) -> { state, rejected }` (status `"rejected"`, `opensDispute: true`; reasonKey must be in `PayConfirm.REASONS`)
  - `PayConfirm.REASONS = { amount: "المبلغ لا يطابق", notReceived: "لم يصلني", duplicate: "دفعة مكررة", other: "سبب آخر مذكور" }`
  - `PayConfirm.pendingFor(state, recordId)` / `PayConfirm.byId(state, id)`
- Immutable: every transition returns a new state object; original untouched.

- [ ] **Step 1: Failing test:** claim happy path (pending, id PC-1, evidence kept), claim validation throws (amount 0, empty evidence), accept transitions + immutability (`old state still pending`), reject with `notReceived` sets reasonAr + opensDispute true, reject with unknown reason throws, double-accept throws `"لا يمكن تصديق دفعة مغلقة"`, determinism (same ops → deep-equal states).
- [ ] **Step 2: RED. Step 3: Implement** (pure copies via `slice`/`Object.assign`; seq counter in state — no randomness). **Step 4: PASS + suite green. Step 5: Commit** `feat: pay-confirm claim/accept/reject-with-reason state machine`.

### Task 6: Wire PayConfirm into borrower + daftari + dispute

**Files:**
- Modify: `app/index.html`, `app/app.js` (state `payConfirm`; actions `pcClaim(recordId)`, `pcAccept(id)`, `pcReject(id, reasonKey)`; on accept ALSO apply the existing borrower-pay path so balance moves only on تصديق), `app/screens/borrower.js` (claim form: amount + evidence text), `app/screens/daftari.js` (pending claims box with accept / reject-reason select), `app/screens/dispute.js` (when arriving from a rejection, show both records: claim + reason)
- Modify tests: borrower/daftari smokes.

- [ ] **Step 1:** borrower row action `سجّلت دفعة — اطلب تصديقها` → deterministic inline form (amount prefilled = next installment, evidence textarea) → `pcClaim`. Status chip `بانتظار تصديق <counterparty>`.
- [ ] **Step 2:** daftari: box `دفعات بانتظار تصديقك` listing pending claims: `صدّق (يُختم الحدث)` / reason select + `ارفض`. Reject → flash + link `افتح محلّ خلاف ←` (`AhdApp.go('dispute')`).
- [ ] **Step 3:** No silent balance change: assert in smoke that before accept, remaining unchanged; after `pcAccept`, remaining drops (reuse existing pay action semantics).
- [ ] **Step 4: Gate green. Step 5: Commit** `feat: payment confirmation flow — claim, accept, reasoned reject into dispute`.

### Task 7: SplitModes + person filter (Splitwise G5+G6)

**Files:**
- Create: `app/features/split-modes.js`; Test: `tests/app/split-modes.test.cjs`
- Modify: `app/features/daftari.js` — ADD `filterByPerson(rows, name)` + `peopleOf(rows)` (additive exports); Test: append cases to a NEW `tests/app/daftari-person-filter.test.cjs`
- Modify: `app/screens/daily.js` (mode select + gated save), `app/screens/daftari.js` (person chips)

**Interfaces:**
- `SplitModes.make({ mode, totalMinor, payer, participants, values }) -> { totalMinor, payer, participants, shares, qaidDrafts, mode }` — same shape as `Split.makeSplit` + mode. `values`: exact → minor amounts aligned to participants; percent → integers; shares → positive integer weights. Unused for equal (delegates to `Split.makeSplit`).
- `SplitModes.validate(spec) -> { ok: true } | { ok: false, errorAr }` — never throws.

- [ ] **Step 1: Failing test:** exact conserves (sum must equal total, else `errorAr` says `المجموع لا يساوي الأصل`); percent 100-check + largest-remainder halala conservation on 33/33/34 of 10001; shares weights 1/2/3 of 6000 → 1000/2000/3000; payer excluded from qaidDrafts in all modes; equal delegates (same output as `Split.makeSplit`); validate returns Arabic error not exception; determinism.
- [ ] **Step 2: RED. Step 3: Implement** (reuse `require("./split.js")` for equal; largest-remainder identical policy: leftover to earliest). **Step 4: PASS.**
- [ ] **Step 5:** daily.js: mode `<select>` (متساوٍ/مبالغ محددة/نسب/حصص) + per-participant value inputs when mode ≠ equal + live validate: save button `disabled` until `ok`, error line shows `errorAr`. Smoke asserts select present + disabled-until-valid behavior.
- [ ] **Step 6:** daftari feature: `peopleOf(rows)` unique counterparties sorted; `filterByPerson(rows, name)`; screen renders person chips row (الكل + names) composing WITH existing status filter. New test file asserts composition (person+status). Smoke updated.
- [ ] **Step 7: Gate green. Commit** `feat: split modes (exact/percent/shares) + person filter in daftari`.

### Task 8: JamiyaInvite — بطاقة دعوة بكل الشروط (Hakbah G7)

**Files:**
- Create: `app/features/jamiya-invite.js`; Test: `tests/app/jamiya-invite.test.cjs`
- Modify: `app/screens/jamiya.js`, `app/app.js` (actions `jamInviteAccept(name)`, `jamInviteDecline(name)`)

**Interfaces:**
- `JamiyaInvite.build(jamiyaSpec) -> { termsAr: [{k,v}], absentAr: [..], perMember: [{name, roundLabel}] }` (consumes the same spec `makeJamiya` takes: members, monthlyAmountMinor, startMonth, order)
- `JamiyaInvite.makeState(members) -> { decisions: {} }`; `accept(state, name)` / `decline(state, name, reasonAr)` immutable; `allAccepted(state, members) -> bool`; `summaryAr(state, members)`.

- [ ] **Step 1: Failing test:** build lists amount/duration/order/your-round + absent (`لا رسوم`, `لا حيازة`, `لا سند تنفيذي`); accept/decline immutability; allAccepted only when every member accepted; decline keeps reason; re-accept after decline allowed (change of mind before seal); determinism.
- [ ] **Step 2: RED. Step 3: Implement. Step 4: PASS.**
- [ ] **Step 5:** jamiya.js: replace the single `الكل وافق على الترتيب` checkbox with per-member invite cards (terms + دورك + قبول/اعتذار buttons); seal button enabled only when `allAccepted`. Update `tests/app/jamiya-screen-smoke` accordingly (assert cards + gated seal; keep existing assertions that don't reference the checkbox — the checkbox assertion is REPLACED by a stronger per-member one, structure preserved).
- [ ] **Step 6: Gate green. Commit** `feat: jamiya per-member invitation cards with full terms before seal`.

### Task 9: JamiyaChanges + JamiyaGoal (Hakbah G8 + MoneyFellows G9)

**Files:**
- Create: `app/features/jamiya-changes.js`, `app/features/jamiya-goal.js`; Tests: `tests/app/jamiya-changes.test.cjs`, `tests/app/jamiya-goal.test.cjs`
- Modify: `app/screens/jamiya.js` (change log under the board; goal header + scenario compare before create)

**Interfaces:**
- Changes: `makeLog() -> {entries:[], seq:0}`; `swapRounds(log, jamiya, nameA, nameB) -> {log, orderAfter}` (requires both names exist; entry `{id:"JC-n", type:"swap", detailAr, bothConsent:true}`); `withdraw(log, jamiya, name, reasonAr)`; entries append-only; `verify(log)` recomputes seq chain.
- Goal: `describe(goalAr, jamiya) -> { goalAr, progress: {done, total, pct}, promiseFreeAr }` (pct integer 0..100 from rounds completed; `promiseFreeAr` fixed: `"هدف وصفي — لا وعد مالي ولا عائد"`); `scenarios(amountMinor, monthsOptions) -> [{months, perRoundMinor, totalMinor}]` integer math.
- [ ] **Step 1–4:** RED→GREEN both features (swap immutability + order actually swapped; withdraw marks member; append-only verify fails after splice; goal pct math 3/10→30; scenarios conserve total).
- [ ] **Step 5:** Wire: board footer `سجل التغييرات` list + demo swap button (both-consent wording); create form header goal input + two-scenario compare table before invite. Smoke updated additively.
- [ ] **Step 6: Gate green. Commit** `feat: jamiya change log + descriptive goal and scenario compare`.

### Task 10: Drafts queue — المتكرر مسودة لا التزام (Splitwise G10)

**Files:**
- Create: `app/features/drafts.js`; Test: `tests/app/drafts.test.cjs`
- Modify: `app/screens/circle-adv.js` + `app/app.js` (recurring posts route through drafts)

**Interfaces:**
- `Drafts.makeState()`; `propose(state, item) -> state` (id `"DR-n"`, status `"proposed"`); `approve(state, id) -> { state, item }`; `decline(state, id, reasonAr) -> state`; `pending(state)`.
- [ ] **Step 1–4:** RED→GREEN (propose/approve/decline immutable; approve returns the item exactly once; double-approve throws Arabic error; pending filter).
- [ ] **Step 5:** circle-adv: `CircleAdv.recurringPosts(...)` output goes into `Drafts.propose` per post; UI lists `مسودات بانتظار اعتمادك` with اعتمد/أهمل; only approved posts reach the ledger. Smoke: recurring tick produces drafts, not posts; approve moves one through.
- [ ] **Step 6: Gate green. Commit** `feat: recurring posts become approvable drafts, never auto-commitments`.

### Task 11: SettleConsent — أرجل مقاصّة تفاعلية (G11)

**Files:**
- Create: `app/features/settle-consent.js`; Test: `tests/app/settle-consent.test.cjs`
- Modify: `app/screens/settlement.js`, `app/app.js` (action `scConsent(legIndex, party)`)

**Interfaces:**
- Consumes `Settlement.settlementView(...).legs` (each leg has from/to/amount).
- `SettleConsent.makeState(legs) -> { legs: [{from,to,amountMinor,consents:{}}] }`; `consent(state, i, party) -> state` (party must be leg.from or leg.to); `legReady(leg)` both consented; `allReady(state)`; `impactAr(leg, member)` one-line effect on that member's net.
- [ ] **Step 1–4:** RED→GREEN (consent by stranger throws; both-parties → ready; allReady gates; impact line contains amount; immutability + determinism).
- [ ] **Step 5:** settlement.js: each leg renders a card (from→to, amount, impact line per party, two consent buttons); the `اعتماد المقاصّة` action disabled until `allReady`; conservation proof stays rendered before/after. Smoke asserts gating.
- [ ] **Step 6: Gate green. Commit** `feat: per-leg interactive consent gating settlement`.

### Task 12: Tone pass — عصري معتدل (G12)

**Files:**
- Modify: `app/screens/home.js`, `create.js`, `daily.js`, `daftari.js`, `settings.js` (chrome copy only)
- Modify matching test strings 1:1 in affected smokes.

Rules (from spec §2/P7): identity lines stay (`قرضٌ حسن — مكتوبٌ ومشهود، بكرامة`); verses stay in `shariah-basis` + forgiveness actions; general strips lose repeated preaching; buttons/labels lose heavy تشكيل; language plain modern Arabic. NO screen-key/label changes (nav labels are test keys).

- [ ] **Step 1:** Inventory: `grep -n "﴿" app/screens/*.js` + list every button/strip string in the five screens. Produce a two-column change table in the commit body (قبل → بعد) — every changed string must appear there.
- [ ] **Step 2:** Apply. Example class of change: home how-it-works step `وثّق عهدك عبر نفاذ ليُختم بشهادة المصرف` → `وثّق اتفاقك بدقيقة — عهد يختمه ويحفظه لك`. Quranic strip on home collapses into a small `الأساس الشرعي ←` link line (verse itself lives in shariah-basis).
- [ ] **Step 3:** Update the exact same strings in smokes. Run gate; every suite green; assertion count not reduced.
- [ ] **Step 4: Commit** `feat: moderate-modern tone pass on primary screens (strings table in body)`.

### Task 13: Final gate + judge lens + housekeeping

- [ ] **Step 1:** `cd tests && node run-tests.cjs && node offline-check.cjs && node dom-smoke.cjs && node structure-check.cjs && node app/run-app-tests.cjs && node run-all.cjs` — one green banner; record the new assertion total.
- [ ] **Step 2:** `node tests/tripwire.cjs` — demo untouched.
- [ ] **Step 3:** Judge-lens score (docs/JUDGE-LENS.md, five criteria 1–10 with evidence) for the changed surfaces; any <8 → `JL-` item in `_meta/OPEN-ITEMS.md`.
- [ ] **Step 4:** Update `_meta/overnight-log.md` (deliverables index + how-to-review) and the Obsidian vault (`AmadHackathon/` Home + plan checkboxes + topical note with `source:` pointers).
- [ ] **Step 5:** Final commit. NO merge to main — leave branch for owner review.

## Self-Review

- Spec coverage: G1→T1-2, G2→T3-4, G3→T1-2, G4→T5-6, G5→T7, G6→T7, G7→T8, G8→T9, G9→T9, G10→T10, G11→T11, G12→T12. All twelve gaps covered. Rejected features: none present. ✓
- Placeholders: task 5/7-11 test steps describe exact cases rather than full listings — each names concrete inputs, expected Arabic errors, and invariants; implementer has the two copy-exact patterns in Global Constraints. ✓
- Type consistency: `fromRow` row shape = `Daftari.rowFor` output (verified against source); `SplitModes.make` output shape = `Split.makeSplit` + mode; states all immutable-copy pattern. ✓
