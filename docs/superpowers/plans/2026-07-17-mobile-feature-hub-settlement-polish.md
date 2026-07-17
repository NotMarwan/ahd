# Mobile Feature Hub and Settlement Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a searchable hybrid More hub, rich honest Settlement demo fallback, balanced Android launcher icon, and compact active-tab treatment.

**Architecture:** Keep route metadata in a pure catalog derived from the canonical screen registry. Keep the Settlement demo fixture immutable and display-only while routing real records through the existing consented persistence path. Limit launcher work to Android adaptive-icon configuration and a padded foreground asset.

**Tech Stack:** Expo 57, React Native 0.86, Expo Router, React Native SVG, Jest, Testing Library.

## Global Constraints

- Never edit `demo/index.html`, generated golden logic, or vectors.
- Money remains integer halalas.
- Demo content must be labeled `بيانات تجريبية` and never persist or imply measured usage.
- Existing local-record settlement requires explicit consent.
- Preserve bottom safe-area handling and hand-authored RTL-on-LTR layout.
- Use RED/GREEN TDD and finish with `node tests/run-all.cjs` from repository root.

---

### Task 1: Register the owner-scoped active-wave task

**Files:**
- Create: `docs/superpowers/specs/2026-07-17-mobile-feature-hub-settlement-polish-design.md`
- Create: `docs/superpowers/plans/2026-07-17-mobile-feature-hub-settlement-polish.md`
- Modify: `specs/002-judge-readiness/tasks.md`

- [ ] Add unchecked `T138` with every implementation, test, evidence, and mirror path.
- [ ] Issue a hashed controller dispatch for `T138` and acquire the shared writer lock.

### Task 2: Specify More hub behavior with failing tests

**Files:**
- Create: `application/ahd-mobile/src/screens/__tests__/more-screen.test.tsx`
- Create: `application/ahd-mobile/src/screens/more-feature-catalog.ts`
- Modify: `application/ahd-mobile/src/screens/MoreScreen.tsx`

**Interfaces:**
- Produces: `MORE_FEATURES`, `MORE_CATEGORIES`, and `filterMoreFeatures(query, category)`.
- Consumes: `CONTEXTUAL_SCREENS` as the canonical route list.

- [ ] Write tests requiring nineteen catalog entries, every route in the full list, Arabic search, category filtering, and hero navigation.
- [ ] Run the test and confirm failure because the catalog, search field, chips, and hero do not exist.
- [ ] Implement the immutable catalog and hybrid hub.
- [ ] Run the focused test until green.

### Task 3: Specify the honest Settlement demo fallback with a failing test

**Files:**
- Modify: `application/ahd-mobile/src/screens/__tests__/settlement-demo.test.tsx`
- Modify: `application/ahd-mobile/src/screens/SettlementScreen.tsx`

**Interfaces:**
- Consumes: `ahdCore.buildSettlement(SettlementTransfer[])`.
- Preserves: `settle(recordIds, consentConfirmed)` for real local records only.

- [ ] Replace the empty-ledger assertion with requirements for `بيانات تجريبية`, counts `9` and `2`, nine inputs, two outputs, no save control, and a real-create CTA.
- [ ] Run the test and confirm it fails on the current empty state.
- [ ] Add the exact immutable golden nine-edge fixture in integer halalas and render both sides of the result.
- [ ] Run both Settlement tests and confirm the real consent path remains green.

### Task 4: Specify launcher and tab corrections with a failing test

**Files:**
- Create: `application/ahd-mobile/assets/images/ahd-launcher-foreground.png`
- Modify: `application/ahd-mobile/app.json`
- Modify: `application/ahd-mobile/src/app/(tabs)/_layout.tsx`
- Modify: `application/ahd-mobile/src/architecture/__tests__/android-delivery.test.ts`

- [ ] Add assertions requiring the dedicated foreground path, a real 1024px PNG, no full-item active background, and a compact active icon pill.
- [ ] Run the test and confirm failure against the full-bleed logo and full-height fill.
- [ ] Generate the padded foreground from the approved transparent mark without redrawing it.
- [ ] Update configuration and tab rendering while preserving safe-area inset logic.
- [ ] Run the delivery test until green.

### Task 5: Verify and close evidence

**Files:**
- Modify: `.superpowers/sdd/progress.md`
- Modify: `_meta/STATUS.md`
- Modify: `_meta/OPEN-ITEMS.md`
- Modify: `AmadHackathon/00 Home.md`
- Modify: `specs/002-judge-readiness/tasks.md`
- Modify: `_meta/freeze/2026-07-15-task-evidence.json`
- Create: `_meta/freeze/reviews/T138/review-001.json`

- [ ] Run focused Jest, TypeScript, generated parity, client boundaries, lint, and diff checks.
- [ ] Capture fresh mobile web or emulator screenshots and inspect the supplied failure areas.
- [ ] Run `node tests/run-all.cjs` from repository root.
- [ ] Record controller validation, constitution result, Judge Lens score, evidence, and mirror updates.
- [ ] Mark `T138` complete only after approved review evidence exists, then release the writer lock.
