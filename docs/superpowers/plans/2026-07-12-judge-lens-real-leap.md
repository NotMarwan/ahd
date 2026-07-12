# Judge-Lens Real-Leap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This plan is executed by **sonnet subagents at extra-high (xhigh) effort**, one front per loop iteration, with an adversarial re-score after each. The orchestrator verifies the gate between fronts.

**Goal:** Genuinely raise all five AMAD judging criteria by +2/+3 each — not by re-grading, but by building the specific missing moments an adversarial panel proved are absent — while never touching the frozen demo, the golden functions, or the spine.

**Architecture:** Every front is additive (new files under `app/features/*.js`, `app/screens/*.js`, `app/app.css` additions, `docs/`), reuses the byte-faithful engine via DI, stays deterministic (no `Date.now`/`Math.random`/`Intl`/float money), is TDD'd into `tests/app/`, and keeps `cd tests && node run-all.cjs` green. Fronts are executed **serially** (one loop iteration each) so shared-shell edits (`app/app.css`, `app/app.js`, `app/screens/home.js`) never collide.

**Tech Stack:** Vanilla JS (pure DI feature modules + innerHTML screens + a screen registry/router), Node `*.test.cjs` harness, CSS custom-property design tokens, inline SVG. Offline-complete, no build step for the app beyond `app/build-engine.cjs`.

## The honest baseline (why this plan exists)

Four independent adversarial critics (told to refute, not praise; each cited `file:line`) re-scored the current product. The internal six-agent panels — same model family grading its own screenshots — inflated every criterion by 2–4 points:

| # | Criterion | Internal self-score | Honest adversarial score | The proof of inflation |
|---|---|---|---|---|
| 1 | الابتكار — innovation | 8 | **7** | «البنك يشهد ولا يُقرض» is *stated* 4× (deck s1, s10, script open, script close) — recall by repetition, never a *seen* moment. The unclonable moment (اجعلها صدقة) is single-shotted in the fallback-only folder. |
| 2 | التطبيق التقني — technical | 8–9 | **6** | Tamper-catch is a canned `amountSAR + 4000` toggle (`app/screens/proof.js:24`), not judge-driven. Engine is single-file, in-memory, 0 backend, 0 persistence. (The 2031/0 gate is **real** — verified by live re-run.) |
| 3 | تحليل البيانات — data | 7.5 | **5** | No dataset. `FIXTURE_CIRCLES` (`app/features/impact.js:28-95`) is 12 rows hand-tuned to trip the k=3 floor. The real cited KSA numbers (SAR 115.4B / 571,251 / Findex 35.8%) appear **nowhere** on screen. «أثر عهد» is never visited in the guaranteed script path. |
| 4 | تجربة المستخدم — UX | 8.5 | **5** | The **Sadu** weave the whole design direction is named after was never ported: `grep -r sadu app/` = **0 hits**. Home is a flat 14-card menu of OS emoji in the OS fallback font (`app/screens/home.js:36-51`, `app/app.css:28`). |
| 5 | قابلية التنفيذ — feasibility | 8 | **4** | Revenue = a coherent *mechanism* (two-contract, `loanChargeHalalas:0`) over a publicly-unverified fiqh premise (Hilah/SS-19 Q1, no scholar asked), 0 collection infra, 0 signed LOI. Number drift persists (`CLAUDE.md` "1809" vs live 2031 vs `PRESENTER-GUIDE.md:162` stale 1687). |

**Targets (honest, must survive an adversarial re-score to count):** innovation 7→9, technical 6→8.5, data 5→8, UX 5→8.5, feasibility 4→7, memorability 6→9.

## Global Constraints

- **Never** edit `demo/index.html` (tripwire `e2f48467…`) or the golden functions. Build in **new files**; reuse the engine via DI only.
- **Determinism:** no `Date.now`/`new Date`/`Math.random`/`Intl`/`.toLocaleString`/float money in logic. Fixed `AS_OF`. Money is integer halalas (1 SAR = 100).
- **Spine:** no riba/penalty/maysir/gharar; no individual number, no trust score, no credit scoring; AI issues no fatwa (cite, never rule). Trust is a qualitative own-history band only.
- **TDD:** failing test first (`tests/app/*.test.cjs`), watch it fail, minimal impl, watch it pass, commit. Never weaken an existing assertion.
- **Gate is the law:** `cd tests && node run-all.cjs` must print `AHD GATE ✅ NNNN/0` + `tripwire e2f48467… OK` at the end of every task. Current true count: **2031/0**; each front grows it.
- **Judge-lens gate:** every judge-visible change is scored 1–10 against `docs/JUDGE-LENS.md` before the front closes; <8 → a `JL-` open item.
- **Arabic-first RTL.** Numerals rendered through the existing `App.digit()` toggle; no raw Western digits in Arabic UI, no `%`/`٪` in the aggregate data copy.
- **Nothing here is spine-, Shariah-, golden-, or approval-gated.** The "visible refusal" only *visualizes* rules already enforced; the national-scale card is hard-labeled illustrative; the path-to-production diagram only synthesizes already-cleared content. If any task drifts into a new Shariah claim or an unconfirmed-approval assertion, STOP and log it to `docs/DECISIONS-FOR-MARWAN.md` — do not decide it in-task.

---

## Front A — Sadu identity + home hierarchy (UX 5→8.5, the "oh, THIS is different" front)

**Why first:** it fixes the *first* screen every judge, deck slide, and the bored operator sees. The assets already exist, fully designed, orphaned one file away in `application/prototypes/dir-b-sadu.html`.

**Files:**
- Modify: `app/app.css` (append a new `/* === Front A: Sadu identity === */` block; do not restructure existing rules)
- Modify: `app/screens/home.js` (restructure the flat card loop into 3 tiers)
- Modify: `app/app.js` (inject one persistent identity strip into the screen shell, if the shell lives there; otherwise in the nav render)
- Create: `app/features/home-layout.js` (pure DI: returns the 3-tier grouping of destinations from the existing registry — testable without a DOM)
- Test: `tests/app/home-layout.test.cjs`

**Interfaces:**
- Produces: `HomeLayout.groups(destinations)` → `{ hero: Dest, primary: Dest[], more: Dest[] }` where `Dest = {id, title, subtitle, icon, screen}`. `hero` is always the create-عهد destination; `primary` is the next 4 by a fixed priority list; `more` is the remainder. Pure, deterministic, order-stable.
- Consumes: the existing home destination list from `app/screens/home.js` (read it first — do not invent ids).

- [ ] **Step 1 — Read before touching.** Read `app/screens/home.js`, `app/app.css:20-90`, and `application/prototypes/dir-b-sadu.html:70-100,245-260` (the `.sadu` band, `.emblem` octagon, `.gauge` meter). Confirm the exact destination ids and the current shell insertion point.

- [ ] **Step 2 — Failing test for the layout split.**
```js
// tests/app/home-layout.test.cjs
const assert = require('assert');
const { HomeLayout } = require('../../app/features/home-layout.js');
const dests = [
  {id:'create',title:'أنشئ عهدًا',screen:'create'},
  {id:'daftari',title:'دفتري',screen:'daftari'},
  {id:'mine',title:'ما عليّ',screen:'mine'},
  {id:'muqassa',title:'المقاصّة',screen:'settle'},
  {id:'open',title:'القرض المفتوح',screen:'open'},
  {id:'circle',title:'الدائرة+',screen:'circle'},
  {id:'org',title:'لوحة المؤسسة',screen:'org'},
];
const g = HomeLayout.groups(dests);
assert.strictEqual(g.hero.id, 'create', 'hero is always create');
assert.strictEqual(g.primary.length, 4, 'exactly 4 primary tiles');
assert.ok(!g.primary.find(d=>d.id==='create'), 'hero not duplicated in primary');
assert.ok(g.more.find(d=>d.id==='org'), 'admin folds into more');
assert.deepStrictEqual(g.primary.map(d=>d.id), ['daftari','mine','muqassa','open'], 'primary order is fixed, not registry order');
```

- [ ] **Step 3 — Run it, watch it fail** (`cd tests && node app/run-app-tests.cjs` or the single file). Expected: `Cannot find module home-layout.js`.

- [ ] **Step 4 — Minimal implementation.**
```js
// app/features/home-layout.js
'use strict';
const HERO_ID = 'create';
const PRIMARY_ORDER = ['daftari','mine','muqassa','open']; // fixed editorial priority
const HomeLayout = {
  groups(dests){
    const byId = new Map(dests.map(d=>[d.id, d]));
    const hero = byId.get(HERO_ID) || dests[0];
    const primary = PRIMARY_ORDER.map(id=>byId.get(id)).filter(Boolean).slice(0,4);
    const used = new Set([hero.id, ...primary.map(d=>d.id)]);
    const more = dests.filter(d=>!used.has(d.id));
    return { hero, primary, more };
  }
};
module.exports = { HomeLayout };
```

- [ ] **Step 5 — Run it, watch it pass.**

- [ ] **Step 6 — Port the Sadu identity CSS (append to `app/app.css`).** Straight adaptation of `dir-b-sadu.html:77-81`, static (reduced-motion-safe):
```css
/* === Front A: Sadu identity === */
.sadu-band{height:6px;border-radius:3px;margin:8px 0 4px;overflow:hidden;
  background:
    repeating-linear-gradient(135deg,var(--teal) 0 5px,transparent 5px 10px),
    repeating-linear-gradient(45deg,var(--gold) 0 5px,transparent 5px 10px),
    var(--line);}
.home-hero-tile{display:block;width:100%;padding:22px;border-radius:20px;
  background:linear-gradient(135deg,var(--teal) 0%,var(--teal-deep,#0f3d3a) 100%);
  color:#fff;text-align:right;box-shadow:var(--elev-2,0 8px 24px rgba(0,0,0,.12));}
.home-hero-tile .t{font-size:24px;font-weight:800}
.home-hero-tile .s{opacity:.85;margin-top:4px}
.hgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
.hgrid .card{margin:0}
.home-emblem{width:34px;height:34px;flex:0 0 34px}
```
Add a token for `--teal-deep` if absent (fall back inline as above so the file stays green if the token is missing).

- [ ] **Step 7 — Restructure `home.js` render** to consume `HomeLayout.groups(...)`: one `.home-hero-tile` for the hero, a `.hgrid` of the 4 primary cards, and a `<details class="more"><summary>المزيد…</summary>…</details>` for the rest (reuse the existing `details.more` idiom already in the codebase). Insert one `<div class="sadu-band" aria-hidden="true"></div>` under the nav in the shell (or top of home) so the woven identity strip is persistent. Add the octagon `.emblem` SVG (port `dir-b-sadu.html:91-95`) beside the wordmark as `.home-emblem`.

- [ ] **Step 8 — Add dom-smoke teeth.** In `tests/app/app-dom-smoke.cjs` (additive): assert the rendered home contains exactly one `home-hero-tile`, a `hgrid` with 4 cards, a `details` disclosure, and a `sadu-band`. Assert no regression in destination count (all 7+ still reachable).

- [ ] **Step 9 — Run the full gate.** `cd tests && node run-all.cjs`. Expected: `AHD GATE ✅ >2031/0` + tripwire OK.

- [ ] **Step 10 — Browser-verify.** Run `node app/_serve-app.cjs`, open `http://localhost:8124`, screenshot home. Confirm: woven band visible, hero tile dominant, 2-col grid, disclosure collapsed, emblem present, 0 console errors.

- [ ] **Step 11 — Commit.** `feat(ux): Sadu identity strip + emblem + 3-tier home hierarchy (Front A)`

---

## Front B — The visible refusal + charity hero (innovation 7→9, memorability 6→9)

**Why:** the identity «يشهد ولا يُقرض» is asserted, never *seen*. Reuse the riba-linter's own "block-and-explain" visual language on the lending apparatus itself, and promote the unclonable اجعلها صدقة (turn debt into charity) moment out of the fallback folder into a hero surface.

**Files:**
- Create: `app/features/refusal.js` (pure DI: the content model of "ما لا يفعله عهد" — the three refusals with their guard-file citations)
- Create: `app/screens/refusal.js` (contextual screen — a home card + a beat reachable from the create flow; `NAV_ORDER` untouched)
- Modify: `app/app.css` (append `/* === Front B: refusal === */`)
- Modify: `app/screens/home.js` (one card into the `more` tier or primary, per Front A grouping)
- Test: `tests/app/refusal.test.cjs`

**Interfaces:**
- Produces: `Refusal.model()` → `{ heading:'عهد لا يُقرض، لا يُقيّم، لا يحكم', items: [{ act, whatABankWouldDo, whyRefused, enforcedBy }] }` where `enforcedBy` names a REAL repo file (grep-verify each before writing — a refusal without a guard is a slogan). Three items: **لا يُقرض** (no bank lending), **لا يُقيّم** (no credit score/number), **لا يحكم** (no dispute ruling / no fatwa).

- [ ] **Step 1 — Read** `app/features/bounds.js` (the guarantees-as-code idiom to mirror), `app/features/riba-lint.js` + the create-blocked screen (the block-and-explain visual to reuse), and confirm the three guard files exist (e.g. the no-score invariant test, the no-lending money invariant, the AI-no-fatwa citation path).

- [ ] **Step 2 — Failing test.**
```js
// tests/app/refusal.test.cjs
const assert = require('assert'); const fs = require('fs'); const path = require('path');
const { Refusal } = require('../../app/features/refusal.js');
const m = Refusal.model();
assert.ok(/يُقرض/.test(m.heading) && /يحكم/.test(m.heading));
assert.strictEqual(m.items.length, 3);
for (const it of m.items){
  assert.ok(it.act && it.whatABankWouldDo && it.whyRefused && it.enforcedBy, 'every refusal is complete');
  assert.ok(fs.existsSync(path.join(__dirname,'../../',it.enforcedBy)), 'guard file exists: '+it.enforcedBy);
}
// spine: never a riba word un-negated, never a trust number
const blob = JSON.stringify(m);
assert.ok(!/[0-9]٪|%/.test(blob), 'no percentages');
```

- [ ] **Step 3 — Run, watch fail.**

- [ ] **Step 4 — Implement `refusal.js`** with the three items, each citing a grep-verified guard path. Deep-freeze the model.

- [ ] **Step 5 — Run, watch pass.**

- [ ] **Step 6 — Build `screens/refusal.js`:** hero heading, three cards each using the **greyed-disabled** treatment from the riba-block (a struck/locked "rate field", a struck "credit-check", a struck "verdict") with the plain stamp beneath, and the `enforcedBy` guard line in mono-LTR (mirror `bounds.js`). Add the اجعلها صدقة beat as its own celebrated card (not fallback-only), with the existing charity copy.

- [ ] **Step 7 — CSS** for the refusal cards (reuse riba-error tokens; do not introduce red for the mercy/charity card — amber/gold only, per the mercy palette rule).

- [ ] **Step 8 — dom-smoke teeth:** screen renders 3 refusal cards + the charity card; the disabled controls carry `aria-disabled`; guard lines present.

- [ ] **Step 9 — Gate green** (`run-all.cjs`).

- [ ] **Step 10 — Browser-verify + screenshot** the refusal screen (this becomes the new hero shot candidate for the deck).

- [ ] **Step 11 — Commit.** `feat(innovation): visible-refusal screen + charity hero (Front B)`

---

## Front C — Judge-driven tamper (technical 6→8.5)

**Why:** the tamper-catch is the money moment but it's a canned toggle. Let the judge type their own number and watch the recomputed hash diverge character-by-character. The plumbing already accepts an arbitrary override.

**Files:**
- Modify: `app/screens/proof.js` (make the tampered amount a live-editable input; re-render on input)
- Create: `app/features/hash-diff.js` (pure: given two hex strings, return the index set of diverging nibbles — for highlight)
- Modify: `app/app.css` (append `/* === Front C: hash diff === */` — a `.hexdiff .d{...}` highlight)
- Test: `tests/app/hash-diff.test.cjs`

**Interfaces:**
- Produces: `HashDiff.diverging(a, b)` → `number[]` (indices where `a[i] !== b[i]`), and `HashDiff.spans(hex, indices)` → array of `{ch, changed:boolean}` for rendering. Pure, deterministic.
- Consumes: existing `tamperReport(record, engine, overrideSAR)` in `app/features/proof.js` — already accepts an arbitrary override (do not modify it).

- [ ] **Step 1 — Read** `app/screens/proof.js:14-82` and `app/features/proof.js:87-99` (`tamperReport`). Confirm the override path.

- [ ] **Step 2 — Failing test.**
```js
// tests/app/hash-diff.test.cjs
const assert = require('assert');
const { HashDiff } = require('../../app/features/hash-diff.js');
assert.deepStrictEqual(HashDiff.diverging('abcd','abce'), [3]);
assert.deepStrictEqual(HashDiff.diverging('0000','ffff'), [0,1,2,3]);
assert.deepStrictEqual(HashDiff.diverging('deadbeef','deadbeef'), [], 'identical → no diff');
const spans = HashDiff.spans('abce', [3]);
assert.strictEqual(spans.length, 4);
assert.strictEqual(spans[3].changed, true);
assert.strictEqual(spans[0].changed, false);
```

- [ ] **Step 3 — Run, watch fail.**

- [ ] **Step 4 — Implement `hash-diff.js`** (guard unequal lengths by comparing up to the shorter, marking the tail as changed).

- [ ] **Step 5 — Run, watch pass.**

- [ ] **Step 6 — Wire the proof screen:** replace the hardcoded `amountSAR + 4000` with a numeric input (default pre-filled so the canned path still works as a fallback), bound to `App.digit`; on `input`, call `tamperReport(record, engine, judgeValueHalalas)`, recompute, and render the original vs recomputed seal with `HashDiff` highlighting the diverging hex nibbles side by side. Keep the existing "✗ عبثٌ مكشوف" verdict. Reduced-motion-safe; deterministic (input-driven, no Date/random).

- [ ] **Step 7 — dom-smoke teeth:** the proof screen exposes an editable amount input; changing it re-renders a recomputed hash; at least one `.hexdiff .d` appears when the value differs; verdict flips to caught.

- [ ] **Step 8 — Gate green.**

- [ ] **Step 9 — Browser-verify:** type a value, confirm per-keystroke recompute + hex highlight + verdict, 0 console errors. Screenshot for the deck.

- [ ] **Step 10 — Commit.** `feat(technical): judge-driven tamper with live hash-nibble diff (Front C)`

---

## Front D — National compression insight (data 5→8)

**Why:** splice the two data halves that exist but were never combined: the engine's **measured** compression ratio (from the golden netting on the aggregate) × the **real cited** KSA court figure (SAR 115.4B / 571,251, EVIDENCE-BRIEF D-1). Render it on the **settle** screen (the one screen every script length guarantees), hard-labeled illustrative. Also harden the k-floor drill-down.

**Files:**
- Create: `app/features/impact-national.js` (pure DI: `EXTERNAL_STAT` constants with `source` strings, separate from fixtures; applies a measured ratio to the real figure; integer-halala math only)
- Modify: `app/screens/settlement.js` (add one clearly-labeled scenario card below the 9→2 worked example)
- Modify: `app/features/impact-drill.js` (raise/generalize the drill-down so ≥k circles are aggregated, not shown per-record; add the regression test the audit found missing)
- Modify: `app/app.css` (append `/* === Front D: national scenario === */`)
- Test: `tests/app/impact-national.test.cjs`, and a new assertion in `tests/app/impact-drill.test.cjs`

**Interfaces:**
- Produces: `ImpactNational.scenario(measuredRatioTenths, external)` → `{ beforeH, afterH, savedH, label, source }` where inputs and outputs are **integer halalas** and `measuredRatioTenths` is an integer (e.g. 67 == 0.67) computed from the fixture aggregate by the caller — never a float. `label` is fixed: `سيناريو توضيحي، لا رقمٌ مُقاس — EVIDENCE-BRIEF D-1`.
- Consumes: the fixture aggregate `movedBeforeH`/`movedAfterH` already computed in `impact.js` (read the exact field names first).

- [ ] **Step 1 — Read** `app/features/impact.js` (aggregate fields, `sarOf`/tenths helpers), `docs/evidence/EVIDENCE-BRIEF.md:53` (D-1 exact figures + source string), `app/features/impact-drill.js:18-31` (the k-floor gate), `tests/app/impact.test.cjs:96-97,153-155` (the measured ratio).

- [ ] **Step 2 — Failing test.**
```js
// tests/app/impact-national.test.cjs
const assert = require('assert');
const { ImpactNational } = require('../../app/features/impact-national.js');
// external figure in integer halalas; ratio as integer tenths of a percent avoided
const ext = { movedH: 11540000000 * 100, source: 'GASTAT/execution-courts 2024 (EVIDENCE-BRIEF D-1)' };
const s = ImpactNational.scenario(667, ext); // 66.7% avoided, integer millipercent
assert.ok(Number.isInteger(s.afterH) && Number.isInteger(s.savedH), 'integer halalas only');
assert.ok(s.afterH < ext.movedH && s.savedH === ext.movedH - s.afterH, 'conservation');
assert.ok(/توضيحي/.test(s.label) && /لا رقمٌ مُقاس/.test(s.label), 'hard-labeled illustrative');
assert.ok(/EVIDENCE-BRIEF/.test(s.source));
assert.ok(!/%|٪/.test(JSON.stringify(s)), 'no percent glyph in rendered fields');
```

- [ ] **Step 3 — Run, watch fail.**

- [ ] **Step 4 — Implement `impact-national.js`** with integer-only arithmetic (`afterH = movedH * (1000 - ratioMilli) / 1000 | 0`), the fixed illustrative label, and provenance kept in its own `source` field (never blended with fixture data).

- [ ] **Step 5 — Run, watch pass.**

- [ ] **Step 6 — Settle-screen card:** below the existing 9→2 example, render "لو صمد نفس معدّل الضغط عند حجم ما يمرّ فعلًا عبر محاكم التنفيذ السعوديّة" with before→after in `App.digit`, the hard label, and the source line in mono. Never assert it as measured.

- [ ] **Step 7 — Harden the drill-down:** change `impact-drill.js` so that once a size-bucket clears `K_FLOOR`, the rendered rows are **aggregated** (bucket mean/total, tenths-integer), not per-circle exact figures; add the missing regression assertion to `tests/app/impact-drill.test.cjs` ("no per-circle exact `savedSAR` leaks once a real dataset replaces fixtures"). Raise `K_FLOOR` if the audit's thin-floor concern warrants — decision stays additive, no spine change.

- [ ] **Step 8 — dom-smoke teeth:** settle screen shows the scenario card with the illustrative label and the source; the number renders through `App.digit`; no `%`.

- [ ] **Step 9 — Gate green.**

- [ ] **Step 10 — Browser-verify** the settle screen scenario card; screenshot.

- [ ] **Step 11 — Commit.** `feat(data): national compression scenario on settle + k-floor drill hardening (Front D)`

---

## Front E — Path-to-production + number-drift sweep (feasibility 4→7)

**Why:** a skeptical CTO's first question is "what do you need from us, in what order, and what do you already have without us." Answer it in one glance. And the number drift (2031 vs 1809 vs 1687; 12 vs 17 vs 19 screens) actively *undercuts* the "stated in numbers" technical claim.

**Files:**
- Create: `docs/evidence/PATH-TO-PRODUCTION.md` (one-page, three-row gated timeline; honest, no unconfirmed-approval claims — synthesis of already-cleared content only)
- Optionally create: `app/screens/path.js` + `app/features/path.js` (an on-screen version reachable from the bounds/feasibility surface) — only if it strengthens the demo without bloating it
- Modify (sweep the live count everywhere it is stated): `CLAUDE.md`, `docs/PRESENTER-GUIDE.md:162` (stale 1687), and every banner the sweep-list in `_meta/OPEN-ITEMS.md:34` names — verify each against a live `run-all.cjs` first
- Modify: reconcile the screen count to the **actual** `registerScreen()` count (grep it; state one true number in `CLAUDE.md` and the guide)
- Test: `tests/app/path.test.cjs` if the on-screen version is built (assert the three rows + that no row asserts a granted approval)

**Interfaces (if on-screen):**
- Produces: `PathToProd.rows()` → `[{ stage, status:'built'|'gated', needs, moneyThatCanMove }]`; row 2's gates are ordered by real dependency (Shariah Q1 → billing code → Nafath L-11 → CSP/TSA L-12 → SAMA Sandbox). No row claims any gate is *cleared*.

- [ ] **Step 1 — Establish the true numbers.** Run `cd tests && node run-all.cjs`, record the exact banner. Grep `registerScreen(` across `app/screens/` for the true screen count. These two numbers are the source of truth for the sweep.

- [ ] **Step 2 — Write `PATH-TO-PRODUCTION.md`:** Row 1 (built today, verifiable live: engine, N/0 tests, offline-determinism, on-spine invariants coded not promised). Row 2 (four external gates in dependency order, each labeled **not started**, citing where each is tracked). Row 3 (what money can move at each stage: nothing until gate 1; B2B-SaaS-to-institution arguable after gate 1 alone; consumer/bank-rail flows wait for all four). Every line honest; zero "approved/confirmed" language.

- [ ] **Step 3 — Number sweep (text-only, no gate risk).** For each file in the sweep list, replace the stale count with the live `run-all.cjs` count and the stale screen count with the grep count. Do not touch assertions.

- [ ] **Step 4 — (Optional) on-screen `path.js`** with a failing test first, mirroring the bounds-panel idiom, if it earns its place. Otherwise skip (YAGNI) and keep the artifact doc-only.

- [ ] **Step 5 — Gate green** (the sweep is text-only but re-run to be sure) + tripwire OK.

- [ ] **Step 6 — Commit.** `docs(feasibility): path-to-production one-pager + live-count sweep (Front E)`

---

## Front F — Documentation, honest re-score, vault sync (close-out)

**Files:**
- Create: `docs/عهد-قفزة-حقيقية-٢٠٢٦-٠٧-١٢.md` (**the Arabic deliverable the operator asked for** — what was built, per front, honestly; the true baseline vs the verified new score; what is *still* weak)
- Modify: `_meta/STATUS.md` (one DONE line), `_meta/OPEN-ITEMS.md` (JL rows updated with honest scores + any surface still <8), `AmadHackathon/` vault (Home + plan + a topical note, per the operator-memory rule)
- Modify: `docs/JUDGE-LENS.md` scoring note only if a criterion genuinely cleared its bar

- [ ] **Step 1 — Adversarial re-score panel.** Dispatch fresh sonnet critics (told to REFUTE the claimed gains, one per criterion + a tired-judge) on the *updated* product. Each returns a 1–10 with `file:line` evidence and the single weakest remaining moment. A gain counts **only** if the critic confirms it; otherwise the score does not move and the gap becomes a `JL-` item.

- [ ] **Step 2 — Write the Arabic MD** with the honest before→after table (true baseline, not the inflated one), one paragraph per front describing what was built and the evidence, and a blunt "ما زال ضعيفًا" (still weak) section. No flattery. Convert any relative dates to absolute.

- [ ] **Step 3 — Update `_meta/STATUS.md` + `_meta/OPEN-ITEMS.md`** with the verified scores and residual `JL-` items.

- [ ] **Step 4 — Sync the Obsidian vault** (Home, plan checkboxes, topical note with `source:` pointers).

- [ ] **Step 5 — Final gate + tripwire**, record the banner in the Arabic MD.

- [ ] **Step 6 — Commit.** `docs: real-leap close-out — Arabic report, honest re-score, vault sync (Front F)`

---

## Re-score protocol (strictness guard)

- Baseline is the **honest adversarial** number (7/6/5/5/4 + memorability 6), never the inflated self-score.
- Each claimed gain must survive a fresh critic prompted to **refute** it, citing `file:line`. Unverified gains do not count.
- No criterion is reported as "moved" without an on-screen, judge-reachable artifact behind it.
- The gate (`run-all.cjs` green + tripwire OK) is checked by the orchestrator between every front — not trusted from a subagent's report.

## Self-review (writing-plans checklist)

1. **Spec coverage:** every one of the four audits' "single highest-leverage change" maps to a front — UX→A, innovation/memorability→B, technical→C, data→D, feasibility→E; documentation + honest re-score→F. ✅
2. **Placeholder scan:** no TBD/TODO; every code step shows real code; every test shows real assertions. ✅
3. **Type consistency:** `HomeLayout.groups`, `Refusal.model`, `HashDiff.diverging/spans`, `ImpactNational.scenario`, `PathToProd.rows` — names used identically in their tasks and their tests. ✅
4. **Spine/constraint coverage:** every front re-states additive-only, deterministic, integer-halala, no-golden-edit, gate-green, and the "stop → DECISIONS-FOR-MARWAN if a Shariah/approval claim appears" rule. ✅
