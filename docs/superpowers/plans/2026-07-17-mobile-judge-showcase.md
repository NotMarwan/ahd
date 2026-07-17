# Mobile Judge Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the fresh mobile build into a complete, labeled judge showcase: one uniform nineteen-tool grid, plain `التسوية` language, a five-person geometric 9-to-2 result, prefilled forms, rich read-only empty-store fallbacks, and a refreshed APK.

**Architecture:** Add one pure deterministic showcase fixture module and one shared notice component. Screens choose real local data when present, otherwise derive read-only display data from the fixture; rendering never writes. Keep all settlement computation on `ahdCore.buildSettlement`, all monetary values in integer halalas, and all existing mutation paths behind explicit user actions.

**Tech Stack:** Expo 57, React Native 0.86, Expo Router, React Native SVG, TypeScript, Jest, Testing Library, Android Gradle build.

## Global Constraints

- Never edit `demo/index.html`, golden logic, generated vectors, or float money.
- Use fixed IDs and dates; do not call current time, randomness, locale formatting, or network runtime APIs.
- Put `بيانات تجريبية` or `عرض تجريبي` beside every synthetic result.
- Real local records and circles always suppress the showcase fallback.
- No fixture persists on render; Save/Create remains explicit.
- Keep touch targets at least 48 dp and preserve RTL text/layout behavior.
- Begin each behavior slice RED, finish GREEN, then run the complete mobile and repository gates.

---

### Task 1: Register and lock T139

**Files:**
- Create: `docs/superpowers/specs/2026-07-17-mobile-judge-showcase-design.md`
- Create: `docs/superpowers/plans/2026-07-17-mobile-judge-showcase.md`
- Modify: `specs/002-judge-readiness/tasks.md`

- [x] Record the approved design and exact owned paths.
- [x] Issue the hashed T139 dispatch with `owner_single_agent_override=true`.
- [x] Acquire the shared writer lock after validation.

### Task 2: Lock the catalog, terminology, icon, and visual in failing tests

**Files:**
- Modify: `application/ahd-mobile/src/screens/__tests__/more-screen.test.tsx`
- Modify: `application/ahd-mobile/src/screens/__tests__/settlement-demo.test.tsx`
- Create: `application/ahd-mobile/src/components/__tests__/netting-visual.test.tsx`
- Create: `application/ahd-mobile/src/components/__tests__/tab-icon.test.tsx`
- Create: `application/ahd-mobile/src/architecture/__tests__/mobile-copy-contract.test.ts`
- Modify: `application/ahd-mobile/src/navigation/__tests__/screen-registry.test.ts`

- [ ] Require exactly nineteen `more-feature-*` cards in one wrapping grid and reject `الأهم الآن`, recent cards, and catalog `mark` properties.
- [ ] Require all five participant names and the light geometric network; reject the old crossed-curve title and scale path.
- [ ] Scan production mobile source for the banned stem assembled as `['الم','قاص'].join('')`, so the test does not match itself.
- [ ] Run focused Jest and capture the expected RED failures before implementation.

Expected catalog contract:

```ts
expect(view.getAllByTestId(/^more-feature-/)).toHaveLength(19);
expect(view.queryByText('الأهم الآن')).toBeNull();
expect(view.getByTestId('more-tools-grid')).toHaveStyle({ flexWrap: 'wrap' });
```

Expected visual contract:

```tsx
<NettingVisual
  beforeCount={9}
  afterCount={2}
  participants={['نورة', 'سارة', 'خالد', 'ليلى', 'فهد']}
/>
```

### Task 3: Implement the uniform More grid and mobile terminology

**Files:**
- Modify: `application/ahd-mobile/src/screens/more-feature-catalog.ts`
- Modify: `application/ahd-mobile/src/screens/MoreScreen.tsx`
- Modify: `application/ahd-mobile/src/components/tab-icon.tsx`
- Modify: `application/ahd-mobile/src/app/(tabs)/_layout.tsx`
- Modify: `application/ahd-mobile/src/navigation/screen-registry.ts`
- Modify: `application/ahd-mobile/src/screens/HomeScreen.tsx`
- Modify: all claimed screens containing mobile-facing settlement copy.

- [ ] Remove `mark`, `BENTO_MORE_FEATURES`, `RECENT_MORE_FEATURES`, and the diagonal hero thread.
- [ ] Render every filtered feature through one card component using category color and text only.
- [ ] Change every user-facing occurrence to `التسوية`; retain English internal names.
- [ ] Replace the scale path with a circular two-way transfer glyph.
- [ ] Run the terminology, registry, tab icon, and More tests until GREEN.

Card geometry:

```ts
featureGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: spacing.x3 },
featureCard: { width: '48%', minHeight: 164, borderRadius: radii.large },
```

### Task 4: Build the five-person 9-to-2 settlement presentation

**Files:**
- Modify: `application/ahd-mobile/src/components/netting-visual.tsx`
- Modify: `application/ahd-mobile/src/screens/SettlementScreen.tsx`

- [ ] Replace the dark stats rectangle with light count chips and a warm bordered graph card.
- [ ] Position five labeled participant nodes around a pentagon/ring.
- [ ] Draw the before state as non-crossing perimeter segments and the after state as two clean direct paths.
- [ ] Keep the exact immutable nine-edge input and actual `ahdCore.buildSettlement` output.
- [ ] Keep demo save/consent controls absent and real-data consent unchanged.
- [ ] Run visual and settlement tests until GREEN.

### Task 5: Add deterministic showcase fixtures and prefill all input tools

**Files:**
- Create: `application/ahd-mobile/src/showcase/showcase-data.ts`
- Create: `application/ahd-mobile/src/components/showcase-notice.tsx`
- Modify: `application/ahd-mobile/src/components/index.ts`
- Modify: Create, Jamiya, Daily, Request, Dispute, Proof, Bounds, Circle+, and Settings screens.
- Create: `application/ahd-mobile/src/screens/__tests__/showcase-experience.test.tsx`
- Modify: any claimed screen test whose old contract required blank values.

- [ ] Build three valid sealed records through `prepareDraft`, `sealPrepared`, and `buildProof`; never hand-forge seals.
- [ ] Build one five-member active Jamiya and one exact 9-to-2 receipt from integer-halalah transfers.
- [ ] Export fixed form values for every input-driven screen.
- [ ] Initialize form state from those values while leaving stores empty until explicit submission.
- [ ] Verify rendering several fresh screens performs zero repository writes.

Fixture shape:

```ts
export const SHOWCASE_CREATE = {
  lender: 'نورة', borrower: 'ليلى', amountSarText: '4800',
  purpose: 'مصاريف علاج طارئة', monthsText: '6',
  firstDueMonth: '2026-08', agreementDate: '2026-07-17',
} as const;
```

### Task 6: Replace empty result screens with real-first read-only showcase data

**Files:**
- Modify: Daftari, Open Loan, Mine, Timeline, Maroof, Standing, Circle, Circle+, Jamiya, Dispute, Org, Impact, and related claimed screens.

- [ ] Select `real.length > 0 ? real : SHOWCASE_*` on each screen.
- [ ] Render `ShowcaseNotice` only on the fallback branch.
- [ ] Hide or redirect mutation/detail controls that require a persisted fixture ID.
- [ ] Confirm one real record/circle removes the fixture banner and names.
- [ ] Run all affected screen tests until GREEN.

Real-first rule:

```ts
const isShowcase = state.records.length === 0;
const visibleRecords = isShowcase ? SHOWCASE_RECORDS : state.records;
```

### Task 7: Verify, visually inspect, and refresh Android delivery

**Files:**
- Modify: `application/ahd-mobile/artifacts/ahd-pilot-v1.apk`
- Modify: `application/ahd-mobile/artifacts/ahd-pilot-v1.apk.sha256`

- [ ] Run focused Jest, full Jest, TypeScript, generated parity, boundary check, and lint.
- [ ] Export/render representative More, Settlement, Create, Daftari, Jamiya, and Impact states and inspect at a phone viewport.
- [ ] Build the release APK from the completed source using the existing deterministic Android delivery path.
- [ ] Replace the committed APK and checksum only after package verification.
- [ ] Run `node tests/run-all.cjs` and confirm the frozen demo SHA-256 remains `e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40`.

### Task 8: Record evidence and close T139 atomically

**Files:**
- Modify: `.superpowers/sdd/progress.md`
- Modify: `_meta/STATUS.md`
- Modify: `_meta/OPEN-ITEMS.md`
- Modify: `AmadHackathon/00 Home.md`
- Modify: `_meta/freeze/2026-07-15-task-evidence.json`
- Create: `_meta/freeze/reviews/T139/review-001.json`
- Modify: `specs/002-judge-readiness/tasks.md`

- [ ] Record RED/GREEN evidence, exact gate totals, visual findings, APK size/hash, frozen hash, and Judge Lens scores.
- [ ] Keep `JL-18` open for real aggregate evidence and real-device jank; synthetic fixtures do not close either item.
- [ ] Commit implementation, perform controller validation, and use `completeTask` for evidence plus checkbox.
- [ ] Commit governance evidence and release the writer lock.
