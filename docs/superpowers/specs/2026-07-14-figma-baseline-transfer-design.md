# Ahd Figma Baseline Transfer Design

**Status:** approved by the owner on 2026-07-14.

**Decision:** build a frozen visual baseline first, then permit a separate V2 redesign. Never redesign while transferring.

## 1. Objective

Create a Figma file that reproduces the current Sadu HTML prototype faithfully, preserves all Arabic/RTL context, and becomes the stable visual handoff for the later Expo implementation. The transfer must be reviewable without repeatedly spending model tokens on full-screen visual comparisons.

This design does not change product logic, the frozen presenter demo, Shariah posture, Arabic copy, or the golden engine.

## 2. Source-of-truth order

When sources disagree, use this order during the baseline phase:

1. `application/prototypes/src/head.html` and `application/prototypes/src/s01-home.html` through `s17-settings.html` define rendered structure, CSS, copy, and screen inventory.
2. `application/prototypes/dir-b-sadu.html` is the generated whole-board artifact. It must be regenerated from the partials before capture.
3. `application/design/tokens.json` supplies named values only when it agrees with the rendered prototype.
4. `application/design/RN-MAPPING.md` defines later native-platform normalization, not baseline visual changes.
5. `app/screens/*.js` and `app/features/*.js` may resolve semantics or missing copy. They never authorize invented Arabic copy.
6. The approved Figma baseline becomes the visual source for Expo.
7. V2 may change the approved baseline only in a separate page, branch, and review ledger.

`demo/index.html` is never a transfer source and is never edited.

## 3. Three locked phases

### Phase A: Baseline

- File name: `Ahd — Baseline v1 — Sadu`.
- Reproduce all 17 Sadu screens at 375 × 800.
- Preserve current hierarchy, spacing, palette, Arabic copy, density, status language, and visible phone chrome.
- Use reusable Figma variables and components, but do not use componentization as permission to alter pixels.
- Keep a locked HTML reference image behind each Figma screen.
- Record every accepted mismatch in the exception ledger.

### Phase B: Expo judge flow

- Begins only after the baseline gate passes.
- Uses the existing mobile skeleton plan at `docs/superpowers/plans/2026-07-10-mobile-app-skeleton.md`, revised to consume the approved Figma baseline.
- Implements four judge-visible surfaces first: home, create/riba-stop, sealed proof/tamper, and Muqassa settlement.
- Removes simulated phone chrome and adopts real safe areas.
- Reuses the golden engine and existing feature modules; no business-logic rewrite.

### Phase C: V2

- Begins only after Phase A is approved and Phase B has one device-verified critical flow.
- Lives on a separate Figma page named `20_V2_WORKBENCH`.
- Every change is framed as a deliberate delta from baseline: problem, hypothesis, changed component, expected judge/user benefit, evidence, and rollback path.
- Baseline pages remain locked and untouched.

## 4. Figma file architecture

Pages, in fixed order:

1. `00_README`
2. `01_FOUNDATIONS`
3. `02_COMPONENTS`
4. `03_BASELINE_17`
5. `04_JUDGE_FLOW`
6. `90_HTML_REFERENCES`
7. `99_EXCEPTIONS`
8. `20_V2_WORKBENCH` — locked until baseline approval

Component prefix: `AHD/Baseline/v1/`.

Screen frame prefix: `B01` through `B17`.

Variable collections:

- `AHD/Primitive`
- `AHD/Semantic`
- `AHD/Layout`
- `AHD/Typography`
- `AHD/Motion`

## 5. Baseline transfer rules

- Copy Arabic strings verbatim. No spelling cleanup, shortening, or tone revision.
- Preserve RTL reading order and use start/end semantics.
- Keep money as displayed in the source. Do not convert values or localize digits during transfer.
- Preserve qualitative trust language. Never introduce scores, percentages, or underwriting signals.
- Late states remain amber-family. Red remains structural/Shariah stop or tamper only.
- No interest, penalty, lending-by-bank, dispute judgment, or AI fatwa language.
- Do not detach component instances merely to force a local pixel match. Fix the component or record a justified exception.
- Do not create V2 alternatives inside baseline pages.

## 6. Known normalization boundaries

Baseline means rendered HTML fidelity, not native-platform fidelity.

- `FONT-01`: the HTML currently prioritizes `Segoe UI` while `tokens.json` names IBM Plex Sans Arabic for native delivery. Baseline uses the actual HTML render. Expo uses the bundled IBM Plex font and records the expected typography reflow as a platform normalization.
- `CHROME-01`: baseline includes the simulated device shell for comparison. Expo deletes it and uses real status/navigation safe areas.
- `EMOJI-01`: baseline preserves current emoji. Expo replaces them through one vector-icon component because emoji differ by platform.
- `SHADOW-01`: browser and Figma shadow rasterization may differ. Numeric values must match; visible spread may differ by at most 2 px.

No other exception is implicit. New exceptions require an ID, source screen, measured delta, reason, approver, and date.

## 7. Matching gate

Each screen passes four independent checks:

1. **Inventory:** correct screen ID, title, source partial, 375 × 800 frame, and source hash.
2. **Structure:** correct sections, order, component variants, RTL direction, and state.
3. **Visual overlay:** HTML capture behind Figma at identical coordinates. No unlogged geometry delta over 2 px; 1 px maximum for dividers and strokes.
4. **Copy/spine:** Arabic copy exact; no spine violation; no numeric trust signal.

Approval is cached against both the source-partial SHA-256 and `tokens.json` SHA-256. If neither changes, the screen is not re-reviewed. If a shared component changes, only dependent screens are invalidated.

## 8. Token-efficiency policy

Use high reasoning only for:

- freezing source precedence;
- component taxonomy;
- classifying mismatches and exceptions;
- baseline final gate;
- V2 design decisions.

Use medium reasoning for:

- creating variables and components from exact specifications;
- assembling screens from approved components;
- linking prototype interactions;
- porting approved components to Expo.

Use low-cost deterministic execution only for:

- builds, hashes, captures, exports, file naming, manifest checks, test runs, and unchanged-screen verification.

Low-cost workers must never alter Arabic copy, visual hierarchy, tokens, component taxonomy, or exception policy.

The runtime cannot switch models autonomously. The controller or owner performs model changes at the task boundaries stated in the implementation plan.

## 9. Deliverables

- Approved Figma baseline file with all pages and 17 screens.
- Repository manifest mapping every Figma screen to its HTML source.
- Deterministic HTML reference captures.
- Figma exports for approved screens.
- Review ledger with source hashes and exception IDs.
- Baseline gate report.
- Updated mobile-plan handoff naming the approved Figma file and four-screen judge flow.
- Vault summary pointing back to canonical docs.

## 10. Exit conditions

Phase A is complete only when:

- all 17 screens are approved;
- the automated baseline gate exits zero;
- no exception lacks an ID and rationale;
- the demo tripwire and full project gate remain green;
- the judge lens scores the transferred surface at least 8/10 or a `JL-` item is filed;
- baseline pages are locked before V2 begins.
