# Advanced Circle Implementation Plan

> REQUIRED SUB-SKILL: superpowers:test-driven-development.

**Goal:** The advanced Circle layer (Agent-1 v2 + Agent-4 v2): **بالأصناف** by-item split, **recurring auto-post**, **graduation قَيْد→عهد**, and a **mode-B pledge sketch** (NOT finalized — pooled deposit → DECISIONS for Shariah review).

**Architecture:** New pure module `project/ahd-app/features/circle-adv.js` (DI: engine + OpenLoan). Reuses `respread` (sum-preserving), `makeCircle`/`foldCircle`/`circleToIous`, and the golden seal. Graduation reuses the **القرض المفتوح** module — a circle debt that gets serious becomes an open-term witnessed عهد (most on-spine for a friend debt). Screen `screens/circle-adv.js` demonstrates each on a seeded circle.

## Global Constraints
- No edits to demo/engine internals (golden funcs CALLED only). New files; app.js gets small additive wiring.
- Determinism: integer halalas; `respread` for all splits (no phantom halala/riba); fixed cycle keys passed in (no `Date`).
- **Spine:** every share is qard hasan (no riba/penalty); graduation stays qard hasan; reminders never name the late member; **mode B is a pledge sketch only — NO pooled deposit held by the bank**, flagged for Shariah review.

---

### Task 1: circle-adv pure logic (TDD)
**Files:** Create `features/circle-adv.js` · Test `app/circle-adv.test.cjs`
**Produces:**
- `byCategorySplit(items, members, engine)` → `{shares:{name:minor}, totalMinor, conserved}` (each item split via respread among its assignees; Σ exact).
- `recurringPosts(template, cycleKeys)` → `[{cycleKey, payer, totalMinor, payerShareMinor, owed:{member:minor}}]` (payer excluded from owing; Σowed+payerShare == amount).
- `graduateShare(share, circle, engine, OpenLoan)` → `{lender, borrower, principalMinor, term:"open", loan, seal, canonical_hash, provenance:{circleId,shareName,circleName}}` (reuses القرض المفتوح + golden seal).
- `pledgeSketch(goal, members, engine)` → `{pledges, totalMinor, poolHeldByBank:false, model:"pledge-then-pay-at-spend", shariahReviewNeeded:true}`.

### Task 2: advanced-circle screen (dom-smoke)
**Files:** Create `screens/circle-adv.js` · extend `app/app-dom-smoke.cjs`
Demonstrate a بالأصناف dinner, a recurring rent (3 cycles), graduate a big share → open عهد, and a pledge-sketch panel that visibly says "needs Shariah review — no pooled deposit." Register as a screen.

## Self-Review
- Covers Agent-1 §4C (recurring), §6 (graduation), Agent-4 §3G1 (بالأصناف), §8 (mode-B caution → pledge sketch + DECISIONS). Equal/custom splits already shipped in the demo's makeCircle.
