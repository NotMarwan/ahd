---
description: "Dependency-ordered judge readiness work"
---

# Tasks: Judge Readiness

## Phase 1: Setup

- [ ] T001 Confirm Wave 0 release manifest and inventory are approved before editing shared judge files
- [ ] T002 Capture current primary, extended, emergency, and fallback sequences in `docs/pitch/rehearsal-2026-07-15.md`
- [ ] T003 Record current Judge Lens scores and unresolved `JL-1`, `JL-2`, `JL-7`, `JL-9`, `JL-10`, `JL-11`, and `JL-12` evidence in the rehearsal file

## Phase 2: Foundational Contract

- [ ] T004 [P] Write failing label and sequence assertions in `tests/stage-path-contract.cjs` against `docs/pitch/script-ar.md`, `docs/PRESENTER-GUIDE.md`, and `app/screens/*.js`
- [ ] T005 [P] Write failing evidence-label assertions in `tests/stage-path-contract.cjs` for every numeric primary-path claim
- [ ] T006 Run `node tests/stage-path-contract.cjs` and capture the initial failures in `docs/pitch/rehearsal-2026-07-15.md`
- [ ] T007 Implement contract parsing and approved path metadata in `tests/stage-path-contract.cjs` without changing product behavior

## Phase 3: User Story 1 - Three-Minute Story (P1)

**Independent Test**: Three cold-start runs finish in 165-180 seconds with zero action or claim errors.

- [ ] T008 [P] [US1] Rewrite the primary beat table in `docs/pitch/script-ar.md` to use exact current labels, canned cold-open tamper, mercy-first settlement, one data insight, and the approved close
- [ ] T009 [P] [US1] Align solo-driving and emergency instructions in `docs/PRESENTER-GUIDE.md` with the same beat IDs and entry state
- [ ] T010 [US1] Move judge-typed tampering to the extended and question paths in `docs/pitch/script-ar.md` while keeping the field discoverable
- [ ] T011 [US1] Make the closing beat hold the verified proof or mercy-first settlement visual in `docs/pitch/script-ar.md` and `docs/PRESENTER-GUIDE.md`
- [ ] T012 [US1] Run `node tests/stage-path-contract.cjs`; fix every stale label or missing beat until green
- [ ] T013 [US1] Execute three timed cold-start rehearsals and record durations, misses, and corrective edits in `docs/pitch/rehearsal-2026-07-15.md`

## Phase 4: User Story 2 - Memorable Insight (P1)

**Independent Test**: Blind reviewers recall the bank-witness sentence and chosen insight after one hour.

- [ ] T014 [P] [US2] Write failing DOM assertions in `tests/app/app-dom-smoke.cjs` requiring measured Findex context, adjacent synthetic sensitivity label, and compact insight headline on the judge path
- [ ] T015 [P] [US2] Reduce disclosure density and strengthen hierarchy in `app/screens/impact.js`, `app/screens/settlement.js`, and `app/app.css` without changing analysis logic
- [ ] T016 [US2] Add or refine the memorable insight beat in `docs/pitch/deck-content-v2.md`, `docs/pitch/script-ar.md`, and `docs/evidence/EVIDENCE-BRIEF.md`
- [ ] T017 [US2] If an approved OFL Arabic font file is supplied, add it under `app/assets/fonts/`, document its license, wire fallbacks in `app/app.css`, and add an offline-asset assertion; otherwise record the gate as blocked
- [ ] T018 [US2] Run focused DOM tests and the full app suite; confirm synthetic and measured labels remain distinct
- [ ] T019 [US2] Run immediate and one-hour recall tests with at least ten blind reviewers; record anonymized results in `docs/pitch/rehearsal-2026-07-15.md`

## Phase 5: User Story 3 - Failure Recovery (P2)

**Independent Test**: App, terminal, projector, and time-cut failures recover in under 30 seconds.

- [ ] T020 [P] [US3] Re-capture all deck and fallback screenshots from the release manifest state into `app/screenshots/premium-after/` and `docs/pitch/fallback/`
- [ ] T021 [US3] Update `docs/pitch/deck-content-v2.md` image references and build the official deck after team names and template are supplied
- [ ] T022 [US3] Hash deck, screenshots, fallback media, and promo assets into the Wave 0 release manifest
- [ ] T023 [US3] Inject app, terminal, projector, and 90-second time-cut failures; record recovery time and exact fallback used in `docs/pitch/rehearsal-2026-07-15.md`
- [ ] T024 [US3] Fix any recovery over 30 seconds in `docs/PRESENTER-GUIDE.md` and repeat failure injection

## Final Phase: Judge Gate

- [ ] T129 [US2] Rebuild the public judge story in `README.md`, protect it with `tests/readme-judge-contract.cjs` and `tests/run-all.cjs`, record mirrors in `_meta/STATUS.md` and `AmadHackathon/00 Home.md`, then complete `specs/002-judge-readiness/tasks.md` through `_meta/freeze/2026-07-15-task-evidence.json` and `_meta/freeze/reviews/T129/review-001.json`

- [ ] T025 Run six-lens Judge Lens review plus tired-judge recall against the final app, deck, and script; record evidence in `_meta/OPEN-ITEMS.md`
- [ ] T026 Create or retain `JL-` items for every score below 8 with owner, next action, and human blocker
- [ ] T027 Run `node tests/stage-path-contract.cjs`, `node tests/app/app-dom-smoke.cjs`, and `cd tests && node run-all.cjs`
- [ ] T028 Update `_meta/STATUS.md`, `_meta/OPEN-ITEMS.md`, `AmadHackathon/00 Home.md`, `AmadHackathon/01 الخطة الرئيسة.md`, and the pitch cockpit note

## Dependencies

- Wave 0 approval blocks T002 onward.
- T004-T007 precede narrative edits.
- US1 and US2 can proceed in parallel by file only when ownership does not overlap.
- T020-T024 require stable product screens.
- T025-T028 require all selected judge-path work and rehearsals complete.
