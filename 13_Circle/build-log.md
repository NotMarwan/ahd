# 13_Circle · Build Log — «الدائرة» (the unified Circle)

**Owner:** single session (no parallel agents on `index.html`) · **Date:** 2026-06-20
**File edited:** `project/ahd-demo/index.html` (logic + screens + Arabic copy only — no visual restyle)
**Spine held:** Alinma = scribe + wakīl + amīn; never lends, never judges, never charges on the loan. The Circle is just **N parallel qard-hasan عهود born from one event** — no new financial primitive.

---

## What was built

سعود's **Standing Circle** (Agent-1) and لُجين's **Occasion Circle** (Agent-4) were **unified into ONE `Circle` object with a `mode`** (`"standing"` | `"occasion"`). Same engine, same dashboard, same Muqassa hand-off — a `mode` flag plus a couple of mode-specific affordances.

### New pure logic (ABOVE `// ===AHD-LOGIC:END===`, Node-testable)
A thin parent over an array of shares, folded the same way the existing `fold()` folds an عهد:

| New symbol | What it does | Reuses |
|---|---|---|
| `CIRCLE_STATE_AR` | DRAFT → OPEN → PARTIAL → KEPT / VOID (mirrors the event-sourced state map) | the `STATE_AR` philosophy |
| `shareEvents(kind)` | one share's append-only event log (a 1-installment qard hasan) | `ev`, the exact event vocabulary `fold()` already knows |
| `makeCircle(spec)` | build a circle; **equal split = `respread()`** over integer halalas ⇒ Σ preserved exactly | **`respread`**, `toMinor` |
| `circleTermsAr(circle)` | علّام (محاكاة) drafts ONE circle terms paragraph | checked by **`ribaScan`** (reads CLEAN via the negation guard) |
| `foldCircle(circle)` | derives circle status + progress from its shares' `fold()`s | **`fold`** |
| `circleShares` / `circleToIous` / `circleBalances` | the debt shares · open shares → IOU edges · self-contained net positions | — |
| `circleCanonical` / `circleSeal` | ONE tamper-evident SHA-256 summary for the whole occasion | **`sha256`**, `minorToFixed2` |
| `DEMO_CIRCLE` | seeded showcase occasion «رحلة العلا» (لُجين + 4, equal 8,000→1,600) | — |
| `STANDING_CIRCLE` | seeded household «شقة الملقا» (سعود + تركي + عبدالله, 600) | — |
| `MUQASSA_CIRCLES` + `CIRCLE_IOUS` | 4 ربع circles whose open shares **ARE the demo's frozen 9-IOU tangle** | feeds the **existing `netting`** |

### New screens (BELOW the marker), routed by **string key** through `go()`
Routing circle screens as `go('G1'..'G4')` keeps the numeric main-deck clamp (`0..5`) and its pinned tests **untouched** — the Circle is a parallel flow off the existing deck.

| Screen | Spec | Reuses |
|---|---|---|
| **G1 · أنشئ دائرة** | occasion/amount/members, split switch (بالتساوي via `respread`, Σ-preserved badge), payer switch (mode A = clean qard hasan; mode B flagged `[v2]`), علّام terms + riba-clean badges, preview «ستُنشئ N عهودًا حسنة…» | `respread`, `circleTermsAr`, `ribaScan`, `.field/.terms/.badge` |
| **G2 · وصلك نصيبك 🤍** | the member receives their share as a gift; 3 actions — **أؤكّد نصيبي** (Nafath seal), **نصيبي غير صحيح** (DISPUTED), **🌿 أحتاج وقت** (2:280, zero penalty) | the C1 «وصلتك بسلامة» pattern, `fold` states, `.ayah` |
| **G3 · لوحة أمين الصندوق** (the heart) | progress ring (reuses `ring-fg`/`ring-bg`), **organizer-only** per-member badges (وافق · سدّد ✓ · بانتظار · أحتاج وقت 🌿 · محلّ خلاف · أُبرئ), **ذكّر الدائرة بلطف** (group, no shame), **أبرئ نصيبًا** (FORGIVEN), **أضف عضوًا**, **سدّد بقيّة الأنصبة**, one sealed circle summary, close state «🤝 ذمّة المناسبة محفوظة» | `foldCircle`, `circleSeal`, `.inst/.badge/.doc/.cleared` |
| **G4 · إلى المقاصّة** | open shares across the ربع's circles → **9 IOUs** → «اجمع الدوائر وسوِّها مقاصّةً» → `go(5)` (the **existing** Muqassa: `netting` + `showMuqassaConsent` + conservation proof) | `CIRCLE_IOUS`, the whole existing Muqassa screen |

### Wiring changes (render region)
- `go()`: added a **string-key branch** for `G1..G4` (unknown key → safe no-op); numeric path unchanged.
- `S.circle` added to state + cleared in `resetState()` (so `go(0)` returns a clean slate).
- R[0] gained one ghost entry button: «أو ابدأ من «الدائرة» — مصاريف الأسبوع ←» → `go('G1')`.
- New module-scoped helpers: `cloneCircle`, `ensureCircle`, `setShareKind`, `firstOpenShare`, `progressRingSVG`, `memberBadge`, `memberListHtml`, `closeStateHtml`, and the instant actions `circleConfirmShare/DisputeShare/GraceShare/Remind/Forgive/AddMember/SettleRest`. No new globals beyond the existing `window.go` (strings flow through it).

---

## The highest-wow connection (G4)
The 4 seeded ربع circles (عشاء الخميس · رحلة البحر · هديّة جماعية · عيديّة) have **open shares whose union reproduces the exact net positions of the demo's hardcoded 9 IOUs** — so the existing `netting()` collapses them to the **same 2 transfers (9→2)**, conservation intact. Muqassa's source is no longer "from the void": it's **the circles you actually made**. Proven by assertion, not asserted by hand.

---

## Discipline / guardrails honored
- **No golden-pinned function touched** — `sha256/canonical/sealBlock/verifyRecord/netting core/fmt/respread` are **called, never modified**. Golden seal/content/net/9→2 all still pass.
- **No passing assertion deleted or weakened.** The pinned `go(99)→step 5` and `go(-5)→step 0` clamp tests still pass *because* circle screens route by string, not by extending the numeric clamp.
- **Money in integer halalas; equal split via `respread`** ⇒ Σ preserved exactly (no phantom riba). No floats / `Math.random` / `Date.now` / `Intl` in the logic region (source-scan green).
- **Offline:** the only `http(s)` string added is the W3C SVG namespace on the progress ring (the allowed one). No external resources. Offline check green.
- **Dignity:** per-member status is organizer-only; members see only group progress; reminders are group-level and name no one; 2:280 grace per share; generous إبراء; **no number / no credit score** (the ring shows a money-collection %, not a trust score).
- **Shariah:** mode A (دفعتُ عن الجميع) = clean qard hasan, built. Mode B (نجمع للهدف) = **[v2]**, flagged for Shariah review (pledge-then-pay-at-spend, never a pooled deposit). No interest, no penalty, no gharar (shares known + consented before sealing), ALLaM issues no fatwa.

---

## Harness result (after the change)

| Suite | Before | After | Δ |
|---|---|---|---|
| `run-tests.cjs` | 108 | **135** | +27 Circle assertions |
| `offline-check.cjs` | 9 | **9** | — |
| `dom-smoke.cjs` | 28 | **40** | +12 Circle screen/action smokes |
| **TOTAL** | **145 / 0** | **184 / 0** | **+39, none removed** |

```
RESULT: 135 passed, 0 failed   (run-tests)
OFFLINE CHECK: 9 passed, 0 failed
DOM SMOKE: 40 passed, 0 failed
exit codes: 0 / 0 / 0
```

New assertions added (run-tests §10): equal-split Σ-preservation across a circle; `foldCircle` DRAFT/OPEN/PARTIAL/KEPT/VOID + إبراء-closes-ذمّة; `circleToIous` open-only; circle terms riba-clean; `circleBalances` conservation; **`CIRCLE_IOUS` reproduce golden BAL and net 9→2**; `circleSeal` deterministic + tamper-evident; standing-mode Σ. New smokes (dom-smoke): G1–G4 render, group reminder, add member, إبراء, settle-rest → `CIRCLE_KEPT`, unknown-key no-op, `go(0)` clears the live circle.

---

## Screenshots (verified in real Chrome, 0 console errors)
- `13_Circle/screenshots/G1-create.png` — أنشئ دائرة (preview «ستُنشئ 4 عهودًا حسنة»)
- `13_Circle/screenshots/G2-receive.png` — the member's dignified share-receipt
- `13_Circle/screenshots/G3-dashboard.png` — treasurer dashboard (ring 25٪, all badges, sealed summary)
- `13_Circle/screenshots/G3-close-kept.png` — close state «ذمّة المناسبة محفوظة» (ring 100٪)
- `13_Circle/screenshots/G4-muqassa-handoff.png` — 9 open shares → existing Muqassa

---

## Handed to Claude Design (visual only — logic + copy are done)
- Occasion-type icons (رحلة / زواج / هديّة / عشاء / standing household).
- Progress-ring treatment + member-list density on mobile; the circle icon in the header.
- A visual language that makes a standing **قَيْد feel lighter than a witnessed عهد** (Agent-1's two-tier read).
- The «دوائري» home surface as the new front door (loan flow demotes to a path inside a circle).

## Left for [v2]
- Mode B «نجمع للهدف» (pledge-then-pay-at-spend, Shariah review first — **not** a pooled deposit).
- «بالأصناف» split; recurring «قِسْمة دائمة»; graduation قَيْد→عهد; **automatic** cross-circle netting (today G4 hands the conceptual tangle into the existing Muqassa; full auto-conversion of arbitrary member sets through `netting` is v2 since `netting` is pinned to the 5-node demo cast).
