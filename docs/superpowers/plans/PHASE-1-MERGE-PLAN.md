# Phase 1 — Merge into ONE clean, unified product (plan)

> Overnight brief Phase 1: stop having two things (`ahd-demo/` + `ahd-app/`). Produce **one**
> clean, cohesive, publishable product with a single navigation, one design language, no dead
> code, no confusing duplication, Arabic/RTL correct everywhere, test gate green throughout.

## Decision: the cleanest target
**`project/ahd-app/` becomes THE product.** It already mirrors the demo's full surface (witnessed
record via *create*, Muqassa via *settle*, Circle via *circle*/*circle-adv*) **plus** the four new
consumer features (دفتري, القرض المفتوح, الدائرة treasurer, الدائرة+) — 7 screens, one shell, one
router, one engine, one CSS. It is already structurally one product.

**`project/ahd-demo/index.html` is kept as a clearly-labelled FROZEN / legacy presenter reference —
NOT deleted, NOT moved.** Rationale (logged as **D-4** in `DECISIONS-FOR-MARWAN.md`): deleting or
moving the demo is irreversible and would break the tripwire path
(`_overnight/backup/demo.sha256` pins `project/ahd-demo/index.html`). The brief's own guidance for
irreversible calls is "keep, don't delete." So we relabel, not remove.

## Audit findings (real-browser, mobile 440px) — what actually makes it feel "stitched"
1. **Nav overflows** — 7 labelled pills = 718px in a 397px viewport → the whole document scrolls
   horizontally. The single biggest "two parts bolted together" smell. **(critical)**
2. **Build-order, not product-order** — nav order is `home, daftari, open, circle-adv, create,
   settle, circle` (the order features were built), not a coherent product flow.
3. **favicon 404** — the one console error; blocks the "0 console errors" bar.
4. RTL/lang/Arabic shaping: **correct**. Design language: clean, dignified, consistent — **keep**
   (no redesign in this phase; visual polish is incremental).

## Work items (each TDD where testable; gate stays green)
- [x] **W1 — nav order = product flow.** Explicit `NAV_ORDER` in `app.js`, sorted once in `boot()`:
  `home → create → daftari → open → circle → circle-adv → settle`. Test-first: dom-smoke asserts
  `App.order` equals the product flow after boot. (Boot still lands on `home`.)
- [x] **W2 — nav no longer overflows.** `app.css` `.nav{flex-wrap:wrap}` (+ tidy sizing) so all 7
  are visible with zero horizontal document overflow. Verified in-browser (scrollWidth==clientWidth).
- [x] **W3 — favicon → 0 console errors.** Inline SVG data-URI `rel="icon"` in `index.html` (no
  network request). Verified in-browser (console errors == 0).
- [x] **W4 — relabel the demo as legacy.** Update `project/ahd-demo/README.md` (NOT `index.html` —
  never touched) + a root `README.md` that names the ONE product and how to run it.
- [x] **W5 — dead-code / duplication sweep.** Confirm the engine copy is intentional+parity-tested
  (keep), no dangling references after the promo refactor, no orphan files.
- [x] **W6 — verify all 7 screens in a real browser:** render, 0 console errors, Arabic correct;
  screenshot each. Re-run the full gate (≥ 609 assertions). Commit + push.

## Guardrails
- Demo `index.html` byte-frozen (tripwire). Golden engine functions called, never modified.
- No `Date.now`/`Math.random`/`Intl`/float money in any new logic. Integer halalas.
- Never weaken or delete a passing assertion. Red + one failed revert → revert, log, switch.
