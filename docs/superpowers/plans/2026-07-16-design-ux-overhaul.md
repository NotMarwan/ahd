# Design & UX Overhaul Implementation Plan — «يصوَّر كمنتج مشحون»

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans task-by-task.
> Steps use checkbox (`- [ ]`) syntax. Spec: `docs/superpowers/specs/2026-07-16-design-ux-experience-design.md`.

**Goal:** Raise every judge-reachable screen to "shipped Saudi fintech" quality — rhythm,
hierarchy, motion-that-clarifies, phone-first responsive shell — without touching identity
(Sadu tokens, teal/amber/gold), engine, or determinism.

**Architecture:** CSS-first. New token tiers + component classes in `app/app.css` and
`app/styles/sadu-tokens.css`; minimal HTML reordering inside screens; zero new JS logic
(only class toggles already driven by existing state). Every visual state must be reachable
in the deterministic render — no `:hover`-only information.

**Tech Stack:** Plain CSS (custom properties, grid/flex, `@media`, `prefers-reduced-motion`),
existing screen HTML, tests in `tests/app/` (class-presence assertions in smokes), manual
breakpoint screenshots via the browser pane.

## Global Constraints

- Red = tamper only. Late = amber. No countdowns, no numeric trust. (spine + DESIGN.md)
- Fonts: vendored IBM Plex Sans Arabic only. No CDN, no new families.
- `app.css` hardcoded `font-size:Npx` literal count stays ≤ 200 (sadu-tokens gate) — new sizes use `var(--sadu-type-*)`.
- Motion: `transform`/`opacity` only; durations via tokens; full `prefers-reduced-motion: reduce` fallback (everything still readable, zero motion).
- Never weaken a test. Gate after every task: `node tests/app/run-app-tests.cjs`; full `cd tests && node run-all.cjs` per phase.
- Branch `claude/design-ux-overhaul` (new worktree). NO merge to main without owner review.
- Judge-path order (effort priority): home → create(+review) → proof → settle → jamiya → daftari/mine → the rest.

---

### Task 0: Baseline audit (٣٠ دقيقة — لا كود)

- [ ] **Step 1:** Serve the worktree app; screenshot the seven judge-path screens at 320/768/1440 (browser pane, `resize_window`). Save findings (not files) as a checklist: overflow, cramped rows, inconsistent paddings, unstyled corners.
- [ ] **Step 2:** `grep -c "font-size" app/app.css` + list section classes per screen (`.cr-card`, `.bw-tile`, `.se-card`, `.jamiya-*`, `.nsx`, `.pc-*`, `.ji-*`) — inventory which use raw px paddings vs tokens.
- [ ] **Step 3:** Write the hit-list into the PR-notes section at the bottom of this file. Commit `docs: design baseline audit hit-list`.

### Task 1: Rhythm & spacing tokens (the invisible fix that makes everything look designed)

**Files:** Modify `app/styles/sadu-tokens.css` (add), `app/app.css` (apply).

- [ ] **Step 1:** Add spacing scale to sadu-tokens: `--sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:24px; --sp-6:32px; --sp-section:clamp(24px, 4vw, 40px)` + motion tokens `--dur-fast:150ms; --dur-normal:280ms; --ease-out:cubic-bezier(0.16,1,0.3,1)`.
- [ ] **Step 2:** Normalize card padding/margins across the judge path to the scale: every `.cr-card/.se-card/.bw-tile/.nsx/.ji-box/.pc-box/.jam-*` uses `--sp-4` padding, `--sp-3` internal gap, `--sp-5` between sections. One diff, mechanical.
- [ ] **Step 3:** Section rhythm: add `.screen > * + *`-style vertical spacing rule (or per-screen container gap) so no screen hand-rolls margins.
- [ ] **Step 4:** Gate + screenshots at 320/1440 — rhythm visibly even. Commit `feat(design): unified spacing/motion tokens + card rhythm`.

### Task 2: Hierarchy pass on the judge path (DocuSign lesson: one hero action per screen)

**Files:** Modify `app/app.css`; tiny HTML class additions in `app/screens/{home,create,proof,settlement,jamiya,daftari,borrower}.js`.

- [ ] **Step 1:** Define three visual tiers in CSS: `.tier-hero` (one per screen — bigger type via `--sadu-type-hero-num`, strongest surface), `.tier-card` (default), `.tier-quiet` (muted bg, smaller type). 
- [ ] **Step 2:** Apply per screen — home: hero tile is the only hero; create: the review/seal card; proof: the seal chain block; settle: the N→M compression figure; jamiya: the invitation card pre-seal, the grid post-seal; daftari: net-position line; mine: total-remaining tile.
- [ ] **Step 3:** Primary-action rule: exactly ONE `.primary` visually saturated button per screen view; other actions ghost/mini. Audit each judge-path screen and demote extras.
- [ ] **Step 4:** Update smokes: assert `tier-hero` present once (`(html.match(/tier-hero/g)||[]).length === 1`) on each judge-path screen. Gate. Commit `feat(design): three-tier hierarchy + one-hero-action rule on judge path`.

### Task 3: Motion that clarifies (the four moments)

**Files:** Modify `app/app.css` only.

- [ ] **Step 1:** Base transitions: nav pills, cards, buttons get `transition: transform var(--dur-fast) var(--ease-out), box-shadow …` — hover/active lift `translateY(-1px)` + shadow step. Focus-visible rings (teal, 2px offset) everywhere interactive.
- [ ] **Step 2:** Seal moment: `.ol-seal, .pf-doc` get a one-time `@keyframes seal-in` (opacity+scale 0.98→1, `--dur-normal`) triggered on render (CSS animation on mount is deterministic — same every load).
- [ ] **Step 3:** Accept/تصديق moment: `.flash` slides down (`translateY(-6px)→0` + fade); `.pc-claim.rejected` gets amber pulse-once. Muqassa: `.se-big` numbers get `seal-in`; weave threads get staggered `scaleY` draw-in via `nth-child` delays (pure CSS, ≤ 600ms total).
- [ ] **Step 4:** `@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important } }` (scoped to our animated classes, not literally `*` — list them).
- [ ] **Step 5:** Gate + browser check (reload judge path, confirm no layout shift; read_console clean). Commit `feat(design): clarifying motion — seal/accept/muqassa/weave moments + reduced-motion`.

### Task 4: Phone-first shell (AHD-FULL-DESIGN §7.1)

**Files:** Modify `app/app.css`; `app/app.js` (nav render only — additive bottom-bar markup behind a media-query class, same `NAV_ORDER` data).

- [ ] **Step 1:** `@media (max-width: 480px)`: nav becomes a fixed bottom bar with FIVE slots — الرئيسية، أنشئ، دفتري، السجل، «المزيد» (opens the existing nav row as a sheet/`<details>`). Desktop/tablet keep the pill row (no behavior change ≥ 481px).
- [ ] **Step 2:** Phone card rules: full-width cards, `--sp-3` gutters, `.home-stats` stacks, tables (`.jamiya-grid`) scroll inside their own `overflow-x:auto` container (page never scrolls horizontally).
- [ ] **Step 3:** Tap targets ≥ 44px on all `.mini/.fchip/navbtn` at ≤480px.
- [ ] **Step 4:** Smoke: assert bottom-bar markup exists in nav HTML (class present) + existing nav assertions still pass (pills unchanged data). Gate. Screenshots 320/375. Commit `feat(design): phone-first bottom nav + mobile card rules`.

### Task 5: Benchmark visual transfers (one small pass each, from the theme boards)

**Files:** `app/app.css` + touched screens.

- [ ] **Step 1 (Splitwise):** consistent lak/alayk semantics — `.amt-lak{color:var(--teal)} .amt-alayk{color:var(--amber)}` + a direction glyph (↙/↗) so color is never the only signal; apply in daftari rows, home stats, daily rows.
- [ ] **Step 2 (Hakbah):** success states become human — unify `.ca-ok/.flash` success into one `.warm-ok` style (gold-soft bg, short sentence, no exclamation stacking).
- [ ] **Step 3 (MoneyFellows):** goal/progress visuals — `.progress` bars get rounded track + animated width transition (`--dur-normal`); hero numerals use `--sadu-type-hero-num` consistently (jamiya receive amount, mine total, settle N→M).
- [ ] **Step 4 (ناجز):** proof/reference language visual — `.nsx-ref`, `pv-row` refs, seal hashes all share one mono chip style (already close; unify class).
- [ ] **Step 5 (DocuSign):** the review card (`.rv-card`) becomes the document-frame moment: slightly larger radius, framed border, subtle paper tint — the screenshot moment of create.
- [ ] **Step 6:** Gate + smokes additively assert the new classes where meaningful. Commit `feat(design): benchmark visual transfers — lak/alayk, warm-ok, progress, ref-chip, doc-frame`.

### Task 6: A11y + RTL correctness sweep

- [ ] **Step 1:** Contrast: verify amber-on-amber-soft and mut-on-card meet 4.5:1 (compute; adjust token shades if not — tokens only).
- [ ] **Step 2:** Keyboard: every interactive element reachable + visible focus; `<details>` summaries styled for focus; nav has `aria-current` (exists) + bottom bar mirrors it.
- [ ] **Step 3:** RTL audit: no leaked `left/right` physical properties in new CSS (use logical `inline-start/end`); numbers/hashes keep `direction:ltr` islands where needed.
- [ ] **Step 4:** Gate. Commit `feat(design): contrast, focus, logical-properties sweep`.

### Task 7: Choreographed demo path + judge-panel review

- [ ] **Step 1:** Walk the exact pitch path (script-ar.md order) in the browser at 1440 + 375; fix any seam (state left over from a previous screen, jarring jump, missing empty-state).
- [ ] **Step 2:** Run the JUDGE-LENS panel procedure: six parallel reviewer agents (one per criterion + tired-judge memorability) on screenshots + flow description; skeptic verifies findings.
- [ ] **Step 3:** Fix round for anything < 8; re-run panel on fixed surfaces.
- [ ] **Step 4:** Full gate + tripwire. Update `_meta/overnight-log.md`, vault (Home + note 14), banners if counts moved. Final commit. Leave branch for owner review — NO merge.

## PR-notes (Task 0 hit-list lands here)

_(populated during Task 0)_
