# Create-عهد Flow Implementation Plan

> REQUIRED SUB-SKILL: superpowers:test-driven-development.

**Goal:** Complete the standalone app: create a new عهد (scheduled or open), with the live **riba linter** (the piety-solver — reuses the golden `ribaScan` + negation guard), seal it (golden `sha256`/`sealBlock`), verify/tamper, and drop it into دفتري (the create→home loop).

**Architecture:** New pure module `project/ahd-app/features/create.js` (DI engine) with a generic canonical (scheduled OR open) sealed by the golden primitives. The riba check is `engine.ribaScan` (unchanged). `toDaftariRecord` yields a دفتري-compatible record so a created عهد appears on the home. Screen `screens/create.js`.

## Global Constraints
- No edits to demo/engine internals (golden `ribaScan`/`canonical`/`sealBlock`/`sha256` CALLED only).
- Determinism: integer halalas; fixed start/timestamp; no `Date`/`Intl`/`Math.random`.
- Spine: the linter BLOCKS any riba/penalty clause and offers the halal `fix`; a created عهد is qard hasan (no interest/penalty); negation («بلا فائدة») reads clean.

---

### Task 1: create pure logic (TDD)
**Files:** Create `features/create.js` · Test `app/create.test.cjs`
**Produces:** `makeDraft(input)`, `draftSchedule(draft,engine)`, `draftTermsAr(draft,engine)`, `ribaCheck(text,engine)`, `createCanonical(draft,engine,overrideMinor?)`, `createSeal(draft,engine)`, `verifyCreated(draft,engine,tamperSAR?)`, `toDaftariRecord(draft,engine)`.

### Task 2: create screen (dom-smoke)
**Files:** Create `screens/create.js` · extend `app/app-dom-smoke.cjs`
Seeded draft + live riba banner + a «جرّب: أضِف شرط غرامة» toggle that flips the linter to BLOCKED (with reason + halal fix) and disables seal · «اختم العهد» → witnessed record (seal + verify + tamper) · «أضِفها إلى دفتري» appends to `app.records`. Register screen; add to home cards + nav.

## Self-Review
- Demonstrates the riba linter (piety), the seal/verify (proof), and the create→دفتري loop. Reuses the golden ribaScan/seal. No new states.
