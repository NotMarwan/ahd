# UI Premium-Polish Implementation Plan — «عهد» app

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (inline). Steps use `- [ ]`.
> Synthesized from two independent deep-dive audits (visual-craft + UX/motion/RTL/a11y/sustainability),
> which converged on the same top findings. Goal per the operator: **more sustainable, smooth, and
> appropriate for a 500,000 SAR competition.**

**Goal:** Elevate the app's UI from a clean baseline to tournament-grade — fix the broken screens, add
smoothness (motion), make it sustainable (tokens), and premium (depth, type, icons) — **without** touching
logic, the spine, the golden engine, determinism, or the gate.

**Architecture:** Almost everything is `app/app.css` (a design system with CSS custom properties). Screens are
innerHTML in `app/screens/*.js`; router in `app/app.js`. Changes are CSS + light class/string tweaks only.

**Tech:** Vanilla CSS/HTML, RTL Arabic, offline. No build step, no dependencies, no framework.

## Global Constraints (every task honors these — copied verbatim from CLAUDE.md + both audits)
- **Offline/deterministic:** NO network, NO CDN. Any font/icon is self-hosted/inline (base64 or local file
  served by `app/_serve-app.cjs`). NO `Date.now`/`new Date`/`Math.random`/`Intl`/`.toLocaleString` anywhere.
- **Spine:** trust signal is a QUALITATIVE WORD, never a number/score/percentage/gauge. Money is integer
  halalas; don't touch `fmt`. Late = **AMBER, never red**; brick-red stays reserved ONLY for cryptographic
  tamper-FAIL on proof/settle.
- **Scope:** `app/app.css` + light markup/class tweaks in `app/screens/*.js` (+ each screen's `icon:` field,
  + optionally `app/index.html <head>` and `app/fonts/`). NO `app/features/**`, NO `app/engine.js`, NO
  `app/build-engine.cjs`, NO `demo/`. No new deps/build steps.
- **Never rename a gate-asserted selector/markup.** `tests/app/app-dom-smoke.cjs` asserts *copy + specific
  structural classes*, NEVER the absence of styles → adding rules is safe. Preserve: `NAV_ORDER`'s 8 keys +
  `aria-current`; `role="tablist"`/`role="tab"`/`aria-selected`; `cr-fields`, `fchip`, `story-who`/
  `story-steps`, `tl-item`, `pf-verify`(+`bad`), `ol-bar`, the `flash`/`x` markup, `tone-amber` and the
  no-`tone-red` / no-`%`/no-`٪` invariants.
- **Motion is REQUIRED to be `prefers-reduced-motion`-guarded** and CSS-driven (clock-independent).
- **Verification per phase:** (1) full gate green — `cd tests && node run-tests.cjs && node offline-check.cjs
  && node dom-smoke.cjs && node structure-check.cjs && node app/run-app-tests.cjs`; (2) tripwire
  `e2f48467…` unchanged; (3) **real-Chromium render of every touched screen: 0 console errors + a
  before/after screenshot** (CSS quality can't be unit-tested — visual + regression is the acceptance
  evidence, matching how this app was verified before). Commit per phase.

---

## Phase 0 — Baseline capture & safety net
**Files:** none edited. **Deliverable:** before-screenshots + confirmed-green gate.
- [ ] Confirm gate green at start (core 184/0, structure 14/0, app 32/32, tripwire `e2f48467…`).
- [ ] Start `node app/_serve-app.cjs` (:8124). Real-Chromium screenshot ALL 15 screens into
  `app/screenshots/premium-before/` — **especially borrower/covenant/standing** (currently no screenshots
  exist; capture the broken state as the before).
- [ ] Record 0-console-errors baseline.

## Phase 1 — CRITICAL: style the 3 unstyled screens (`ما عليّ` · `سِجلّ المعروف` · `سُلفة`)
**Why first:** highest risk in the app. `bw-*` (25 refs), `cv-*` (21), `st-*` (28) have **0 rules** in
`app.css` (verified) → they render as raw unstyled divs; home links straight to them. Pure additive CSS.
**Files:** `app/app.css` (append 3 new sections). No markup change.
- [ ] Read the exact class list emitted by `app/screens/borrower.js`, `covenant.js`, `standing.js`.
- [ ] Add `.bw-*` block — mirror `.row`/`.tile`/`.chip`/`.selfband`; `.bw-row.overdue{border-inline-start:3px
  solid var(--amber)}`; grace block like `.set-*`. (Full sketch in the visual audit R1 / UX audit R1.)
- [ ] Add `.cv-*` block — mirror the timeline "story" dashed rail + the dark seal-doc for `.cv-seal`; tamper
  step uses the reserved brick-red (not amber), consistent with proof.
- [ ] Add `.st-*` block — parties row, 3-cell `.st-ledger`, per-cycle `.st-post` chips, dark `.st-verify`
  seal surface, amber `.st-seam` Shariah note (mirror `.ca-warn`).
- [ ] Verify: gate green; real-Chromium render all 3 screens → 0 console errors + screenshots into
  `premium-after/`; confirm they now visually match the دفتري family.
- [ ] Commit: `fix(ui): style borrower/covenant/standing screens (were unstyled) `.

## Phase 2 — Sustainable foundation (tokens + RTL-logical + de-duplication)
**Why second:** the "sustainable" ask; later phases build on these tokens. Pure CSS, no visual change intended.
**Files:** `app/app.css`.
- [ ] Add spacing/radius/type token scales to `:root` (4px spacing base; radius 10/13/16/20/pill; type floor
  12px) — per UX audit R7. Keep existing color tokens.
- [ ] Convert physical→logical: `border-right`→`border-inline-start` on `.tl-item*`/`.story*`/`.set-no`/
  `.set-yes`; stray `.ol-seal .mini{margin-left}`→`margin-inline-start`; `#app` padding→`padding-inline`
  (UX R6). Rendered result identical in RTL, future-proof.
- [ ] Consolidate the repeated dark "sealed-doc" block into a shared grouped selector /`.seal-doc`/`.mono-ltr`
  base without renaming existing classes (UX R9 / visual R10). One place to tune the seal aesthetic.
- [ ] Verify: gate green; Chromium diff shows **no visual regression** (this phase is invisible by design).
- [ ] Commit: `refactor(ui): spacing/radius/type tokens + logical props + seal-doc consolidation`.

## Phase 3 — Motion layer (delivers "smooth")
**Why:** the app has 1 transition + 0 keyframes; the operator explicitly wants "smooth." All CSS, guarded.
**Files:** `app/app.css`.
- [ ] Add `@media (prefers-reduced-motion: no-preference){…}` with: `@keyframes ahd-rise`/`ahd-fade`;
  `.screen{animation:ahd-rise}` (fires on every `go()` innerHTML swap — no JS hook); universal `:active`
  press-scale on buttons/cards/chips/tabs; capped `.list .row`/`.story` nth-child stagger. (UX audit R2.)
- [ ] Add the two "hero reveal" beats: `.cr-lint`/`.pf-verify`/`.se-proof` fade-in; a brief non-looping
  `ahd-flag` shake on tamper `.bad`; `.ol-bar .ol-seg` grow-in. (UX audit R3.)
- [ ] Add the global `@media (prefers-reduced-motion: reduce){ *{animation/transition ~0} }` kill-switch (REQUIRED).
- [ ] Verify: gate green; **offline scan confirms no `Date`/`Math.random` introduced**; Chromium: transitions
  smooth, and with reduced-motion emulation ON everything is static.
- [ ] Commit: `feat(ui): CSS motion layer — screen entrance, press feedback, seal/linter reveals`.

## Phase 4 — Accessibility & touch
**Files:** `app/app.css` (+ `app/index.html` head unaffected).
- [ ] Global `:focus-visible{outline:2px solid var(--teal);outline-offset:2px}` + light ring on dark seal
  surfaces (UX R4). Currently there are **zero** focus styles.
- [ ] Tap targets ≥44px where cheap: `.dots` 44×44, `.navbtn` min-height, `.fchip`/`.tab` min-height (UX R5).
- [ ] Legibility: raise sub-12px labels to the 12px type floor; nudge small-grey/gold contrast (UX R8).
- [ ] Safe-area insets: `#app` bottom `max(40px, env(safe-area-inset-bottom))`, `.nav` top inset (UX R10).
- [ ] Verify: gate green; Chromium keyboard-tab shows rings; render at 360px + 430px, no overflow.
- [ ] Commit: `feat(ui): focus-visible rings, 44px tap targets, legibility + safe-area insets`.

## Phase 5 — Depth & surface system (kills card monotony)
**Files:** `app/app.css`.
- [ ] Shadow scale `--shadow-sm/-/-lg`; lift `.hero` (+ optional 1px gold inner hairline), settle
  `.row`/`.tile` lower, `.hcard:hover` raise (visual R5).
- [ ] Semantic surface accents: gold `border-inline-start` on "sealed/mercy" cards (`.pf-prov`, `.cd-note`,
  `.selfband`) — mirrors the working `.set-*` idiom.
- [ ] Widen amber↔gold separation (`--amber:#a9571a`, warmer, still firmly non-red); DO NOT touch tamper-red
  (visual R6). Keep late=amber.
- [ ] Verify: gate green (esp. no `tone-red`/`%` regressions); Chromium screenshots show hierarchy/depth.
- [ ] Commit: `feat(ui): elevation scale + semantic surface accents + amber/gold separation`.

## Phase 6 — Navigation refinement
**Files:** `app/app.css` (+ maybe a class in `app/app.js` `navHTML`, keeping `NAV_ORDER`+`aria-current`).
- [ ] 8-pill wrap (2–3 rows, ~28px targets) → **single horizontal-scroll row** (`flex-wrap:nowrap;
  overflow-x:auto; scrollbar-width:none`) with a trailing fade mask; keep all 8 keys + `aria-current` +
  roles (asserted). Optional `@supports (backdrop-filter)` blur for premium (visual R4 / UX R5,R11).
- [ ] Verify: gate green (nav-order + tablist assertions intact); Chromium at 360/390/430px → one tidy row.
- [ ] Commit: `feat(ui): single-row scrollable nav (was 2–3 wrapping rows)`.

## Phase 7 — Iconography (emoji → inline SVG)
**Files:** each `app/screens/*.js` `icon:` field + `home.js` hero-card icons; `app/app.css` (`.navico svg`/
`.hico svg`). ~12 icons.
- [ ] Define a minimal inline-SVG set (24×24, single-stroke `currentColor`) from an OFL/MIT source (Lucide/
  Feather path data inlined — no dependency): create/plus, request/hands, daftari/book, open/infinity,
  circle/users, circle-adv/repeat, settle/merge, mine/hand-coin, standing/calendar-repeat, maroof/dove,
  home, settings/gear. `currentColor` so `.navbtn.on` (white) still works (visual R3).
- [ ] Swap emoji strings for the SVG strings in the existing `.navico`/`.hico` hooks (text/labels unchanged →
  gate-safe).
- [ ] Verify: gate green; offline scan clean; Chromium: consistent monochrome icons, `.on` state white.
- [ ] Commit: `feat(ui): replace emoji with a consistent inline-SVG icon set`.

## Phase 8 — Premium identity (DECISION-GATED — see below)
**Files:** `app/app.css` (+ `app/fonts/` + `app/_serve-app.cjs` mime for woff2, if font chosen; `home.js`).
- [ ] **(If font approved)** Self-host ONE OFL Arabic display face (e.g. Reem Kufi / Amiri, subset to used
  glyphs) as local woff2 (or base64) — `@font-face` + `--display`; apply to `.hero .brand` + headers. NO CDN.
  ~15–40KB. Biggest "expensive" lever (visual R2). Fallback if skipped: pure-CSS wordmark upgrade (larger,
  letter-spacing, subtle gold flourish).
- [ ] Hero depth: low-opacity inline-SVG Islamic-geometry watermark on `.hero` (data-URI, offline), gold
  inner hairline (visual R9).
- [ ] Home hierarchy: promote `create` (filled hero action) + `request` (strong outline); demote the other
  ~8 into a 2-col tile grid under an «الأدوات» divider — keep every asserted card label (visual R11).
- [ ] Verify: gate green; offline scan confirms font is local (no network); Chromium: wordmark + hero premium.
- [ ] Commit: `feat(ui): premium wordmark/type + hero geometry + home hierarchy`.

## Phase 9 — Final verification & handoff
- [ ] Full gate green; tripwire `e2f48467…`; real-Chromium 0-console across all 15 screens; before/after
  screenshot set saved.
- [ ] `_meta/STATUS.md` DONE line; `_meta/agent-presence` note (release claim).
- [ ] Present the `overnight/deepening → main` push + tag **v0.1.2** (D-3's 3 features + this polish) for the
  operator's go.

---

## Decisions for the operator (before Phase 8)
1. **Scope/depth:** Core (Phases 1–5: broken screens + tokens + motion + a11y + depth — high-ROI, zero binary
   assets, safest) vs Full (Phases 1–8: also nav + icons + font/geometry/home-hierarchy — the fuller premium
   overhaul).
2. **Embedded Arabic display font (Phase 8):** Yes (biggest premium lever, adds a ~20–40KB self-hosted OFL
   font, offline-safe) vs No (keep system fonts, do the lighter pure-CSS wordmark upgrade instead).

## Self-Review
- **Coverage:** both audits' High/Med items are mapped to a phase; both "do-not-touch" lists are encoded in
  Global Constraints. The one CRITICAL bug (3 unstyled screens) is Phase 1.
- **Sequencing:** foundation (tokens) before the phases that consume it; broken-screens first (risk);
  decision-gated/binary-asset work last.
- **Risk posture:** every phase is CSS/markup-class only, gate-guarded, reversible, real-browser-verified. No
  spine/determinism/golden exposure. CSS quality isn't unit-testable → acceptance = gate-green + Chromium visual.
