# Front 3 — «أثر عهد» Impact Analytics Screen (JL-3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (inline). Steps use `- [ ]`.
> Blueprint source: the data-lens judge review (2026-07-07, recorded in `_meta/OPEN-ITEMS.md` JL-3).

**Goal:** The judges score تحليل البيانات explicitly and we sit at 6.5/10. Build the on-spine analytics
screen: a k-anonymous netting-efficiency dashboard over honestly-labeled deterministic test circles, plus
the animated 9→2 collapse (today it exists only in the frozen demo) — turning "we engineered one proof"
into "the engine finds insight across cohorts."

**Architecture:** Exactly the house pattern (mirror `app/features/settlement.js` + `app/screens/settlement.js`):
one pure DI feature module (Node-testable, no DOM), one innerHTML screen, contextual registration (NO
`NAV_ORDER` change — reachable via home card + a chip on the settle screen), TDD suite auto-discovered by
`tests/app/run-app-tests.cjs`, `project-map.json` entry (structure-check requires it).

**Tech:** Vanilla JS (ES5-style like siblings), integer halalas, inline SVG + CSS-only animation.

## Global Constraints (verbatim rules — violating any is a hard stop)
- **Determinism:** no `Date.now`/`new Date`/`Math.random`/`Intl`/`.toLocaleString`/float money in logic.
- **Golden functions are called, never modified.** Netting comes DI-style from the engine, as settlement.js does.
- **Spine:** aggregates only — NEVER an individual's number, name-with-number, score, or export. Honesty:
  fixture data is labeled «دوائر تجريبيّة (بيانات اختبار)» visibly on screen.
- **No percentage glyphs (`%`/`٪`) in any rendered text** (dom-smoke invariant): express reductions in
  absolute numbers and words («من ١٬٨٠٠ إلى ٩٠٠»، «النصف»). Bar widths may use inline styles.
- **Late/negative tones:** amber only; brick-red reserved for tamper. This screen should need neither.
- **Motion:** CSS-only, wrapped in `@media (prefers-reduced-motion: no-preference)`.
- **Never weaken a gate assertion; additions to dom-smoke are additive.**
- Gate must be green at the end: `cd tests && node run-tests.cjs && node offline-check.cjs && node dom-smoke.cjs && node structure-check.cjs && node app/run-app-tests.cjs` + tripwire `sha256sum -c _overnight/backup/demo.sha256`.

---

### Task 1: Pure feature module `app/features/impact.js` (TDD)

**Files:** Create `tests/app/impact.test.cjs` FIRST, then `app/features/impact.js`.

**Interfaces (exact contracts — screen and tests rely on these):**
```js
// module shape mirrors siblings: attaches to global/module.exports like features/settlement.js
Impact.K_FLOOR === 3
Impact.FIXTURE_CIRCLES  // >= 8 deterministic test circles, each:
// { id: "TC-01", label: "شقّة الرياض", size: 4, obligations: [{ from:"م١", to:"م٢", halalas: 25000 }, ...] }
// sizes spread over 3..8 so bucket distribution is non-trivial; all halalas integers; members are
// neutral codes (م١..م٨) — never real-looking names with amounts (spine).

Impact.computeCircleImpact(circle, settleFn)
// -> { id, size, obligationsCount, transfersAfter, transfersAvoided,
//      movedBeforeH, movedAfterH, savedH, conservationOk: true|false }
// settleFn = the engine netting used DI-style exactly as settlement.js consumes it;
// movedBeforeH = Σ obligations halalas; movedAfterH = Σ resulting transfer halalas;
// conservationOk = every member's net position identical before/after (integer compare).

Impact.computeImpact(circles, settleFn)
// -> { kFloor: 3, circlesCount, totals: { obligations, transfersAfter, transfersAvoided,
//      movedBeforeH, movedAfterH, savedH },
//      buckets: [ { size, count, avgTransfersAvoidedTenths } ... ]  // ONLY buckets with count >= kFloor
//      suppressedBuckets,   // integer — buckets hidden by the k-floor (honesty line on screen)
//      fixture: true }      // hard-wired label flag the screen must render
// avgTransfersAvoidedTenths: integer tenths (e.g. 17 == «1.7») — NO floats anywhere.

Impact.describeImpactAr(impact, fmtN) // -> { heroLine, totalsLines[], bucketLines[], honestyLine, conservationLine }
```

- [ ] **Step 1: write the failing tests** — `tests/app/impact.test.cjs`, AAA style, house harness format
  (look at `tests/app/settlement-conserve.test.cjs` for the assert helper + banner conventions). Cover at
  minimum (aim ≥ 50 assertions):
  - every fixture obligation amount `Number.isInteger` and > 0; every circle size 3..8; ≥ 8 circles
  - `computeCircleImpact`: for each fixture circle — `conservationOk === true`; `transfersAfter <= size-1`;
    `movedAfterH <= movedBeforeH`; `savedH === movedBeforeH - movedAfterH`; all outputs integers
  - determinism: `JSON.stringify(computeImpact(...)) ` twice → identical strings
  - k-floor: build a synthetic circles list where one size-bucket has count 2 → that bucket absent from
    `buckets`, `suppressedBuckets === 1`; with count 3 → present
  - totals equal the sum of per-circle values (integer equality)
  - `avgTransfersAvoidedTenths` integer; a hand-computed example matches (pick one bucket, compute by hand)
  - `fixture === true`; `describeImpactAr` lines contain «دوائر تجريبيّة» and contain NO `%`/`٪` char
  - purity: calling with the same inputs after mutating nothing → same output; module has no reference to
    `Date`/`Math.random` (read the file text in the test and assert the strings are absent, mirroring
    how `app-offline.test.cjs` scans)
- [ ] **Step 2: run** `node tests/app/run-app-tests.cjs` → the new suite FAILS (module missing).
- [ ] **Step 3: implement `app/features/impact.js`** to the contracts above, mirroring settlement.js's DI
  and module-export idioms. Netting: reuse the exact engine function settlement.js uses (read how it
  injects; do the same — do NOT reimplement netting).
- [ ] **Step 4: run the app suite** → new suite green, all 33 suites green.
- [ ] **Step 5: commit** `feat(app): impact analytics feature — k-anon netting-efficiency aggregates (JL-3, TDD)`

### Task 2: Screen `app/screens/impact.js` + wiring + animated collapse

**Files:** Create `app/screens/impact.js`; Modify `app/index.html` (script tag), `app/screens/home.js`
(one card), `app/screens/settlement.js` (one link chip «📊 أثر عهد»), `app/app.css` (append `.im-*` block),
`project/mcp/packages/ahd-navigator/src/project-map.json` (feature entry).

- [ ] **Step 1:** screen registers `{ key: "impact", label: "أثر عهد", icon: "📊" }` (contextual — do NOT
  touch `NAV_ORDER`). Sections in order:
  1. honesty banner: `«تحليلاتٌ حتميّةٌ من دوائر تجريبيّة — مجاميع مجهّلة فقط، ولا رقمَ فردٍ أبدًا»` +
     k-floor note `«لا يُعرَض تجميعٌ لأقلّ من ٣ دوائر»` (+ suppressed count when > 0)
  2. **the collapse visual**: inline SVG — 5 member dots, 9 tangled lines → button `«شاهد الانهيار ٩ ← ٢»`
     toggles a class; CSS transitions fade the 9 lines out and draw 2 bold lines (reduced-motion-guarded;
     zero JS animation; the toggle just flips a class). Under it: `«تسع التزاماتٍ — تحويلان. المالُ
     المتحرّك: من ١٬٨٠٠ إلى ٩٠٠ ريال، والمراكزُ محفوظة»` (numbers taken from the same demo tangle the
     settle screen shows — reuse its computed values, don't hardcode independently if avoidable)
  3. totals cards from `computeImpact(FIXTURE_CIRCLES, ...)`: obligations vs transfers, moved before/after
     (via engine `fmtN`), `savedH` as «وفّرت المقاصّةُ تحريكَ …»
  4. distribution: one row per bucket — `«دوائر من N أعضاء (العدد C): متوسّط التحويلات الموفَّرة X٫Y»`
     (tenths rendered with Arabic decimal separator from integer tenths — string math, no floats) + a CSS
     bar sized via inline style (width from integer ratio; no % TEXT rendered)
  5. conservation line: `«في كلّ دائرة: صافي كلّ عضوٍ قبل المقاصّة = صافيه بعدها — بالهللة»` + chip linking
     to `settle`
- [ ] **Step 2: additive dom-smoke assertions** (`tests/app/app-dom-smoke.cjs`, mirror existing per-screen
  blocks): impact renders; contains «دوائر تجريبيّة»; contains «أثر عهد»; contains NO `%`/`٪`; home card
  present; settle chip present; `im-collapse` svg block present.
- [ ] **Step 3:** run FULL gate (all five commands) + tripwire → green; fix forward until green.
- [ ] **Step 4: commit** `feat(app): «أثر عهد» impact screen — collapse visual + cohort distribution (JL-3)`

### Task 3: Record + release

- [ ] Append to `_meta/STATUS.md` a DONE line (house format): what was built, suite count (now 33), gate
  numbers, JL-3 → "built, pending premium styling (JL-2) + judge re-score".
- [ ] Update `_meta/OPEN-ITEMS.md` JL-3 row status to `built — pending JL-2 styling + re-score`.
- [ ] Commit `docs(meta): JL-3 impact analytics DONE line`. Do NOT push (the operator session pushes).
