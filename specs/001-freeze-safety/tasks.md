---
description: "Dependency-ordered freeze safety work"
---

# Tasks: Freeze Safety and Truth

## Phase 1: Setup

- [ ] T001 Capture `git status --short --branch`, recent commits, and live gate output in `_meta/freeze/2026-07-15-change-inventory.md` without changing files
- [ ] T002 Classify every tracked and untracked path in `_meta/freeze/2026-07-15-change-inventory.md` as release, park, generated, ignore, or owner-decision
- [ ] T003 Record current screen registrations, suite count, server routes, and demo hash in `_meta/freeze/2026-07-15-current-state.md`

## Phase 2: Foundational Controls

- [ ] T004 [P] Write failing release-manifest validation cases in `tests/release-manifest.test.cjs` for missing keys, overlapping paths, bad gate, wrong hash, and approval-free publish
- [ ] T005 Run `node tests/release-manifest.test.cjs` and confirm failure before implementation
- [ ] T006 Implement read-only manifest validation in `tests/release-manifest.cjs` until T004 passes
- [ ] T007 [P] Write failing current-claim drift cases in `tests/release-truth-check.cjs` for architecture, status, screen count, suite count, auth, and live-smoke claims
- [ ] T008 Run `node tests/release-truth-check.cjs` and confirm current documentation produces the expected failures

## Phase 3: User Story 1 - Recoverable Freeze (P1)

**Independent Test**: Reproduce candidate and gate from a clean checkout.

- [ ] T009 [US1] Generate `_meta/freeze/2026-07-15-release-manifest.json` from the approved inventory and validate it with `tests/release-manifest.test.cjs`
- [ ] T010 [US1] Add SHA-256 entries for every stage asset to `_meta/freeze/2026-07-15-release-manifest.json`
- [ ] T011 [US1] Create a clean-checkout recovery procedure in `_meta/freeze/2026-07-15-recovery-drill.md`
- [ ] T012 [US1] Execute the recovery drill, run `cd tests && node run-all.cjs`, and append exact evidence to `_meta/freeze/2026-07-15-recovery-drill.md`
- [ ] T013 [US1] Verify `git diff -- demo/index.html app/engine.js` is empty and record both hashes in the manifest
- [ ] T014 [US1] Stop for named operator approval before any tag, push, overwrite, or cleanup; record approval in the manifest

## Phase 4: User Story 2 - Current Documentation (P1)

**Independent Test**: `node tests/release-truth-check.cjs` reports zero mismatches.

- [ ] T015 [P] [US2] Correct stale screen, suite, authentication, live-smoke, deployment, and endpoint claims in `docs/ARCHITECTURE.md`
- [ ] T016 [P] [US2] Reconcile live gate and scorecard state in `_meta/STATUS.md` and `_meta/score-leap-loop-state.md` without rewriting historical entries
- [ ] T017 [US2] Resolve the `D-4` identifier collision across `docs/DECISIONS-FOR-MARWAN.md`, `_meta/OPEN-ITEMS.md`, and score-loop notes using a new non-colliding innovation ID approved by Marwan
- [ ] T018 [P] [US2] Verify or close stale `OT-13`, `OT-14`, and `OT-LINKS` claims with evidence in `_meta/OPEN-ITEMS.md`
- [ ] T019 [US2] Implement live-source parsing in `tests/release-truth-check.cjs` and make all T007 cases pass
- [ ] T020 [US2] Run `node tests/release-truth-check.cjs` and `node tests/gate-drift-check.cjs`; record zero mismatches

## Phase 5: User Story 3 - Stage Preflight (P2)

**Independent Test**: Two fresh-shell preflights return identical success evidence.

- [ ] T021 [P] [US3] Write failing preflight cases in `tests/stage-preflight.test.cjs` for missing app, fallback media, terminal proof, stale presence, and wrong demo hash
- [ ] T022 [US3] Extend `tests/stage-preflight.cjs` with read-only asset and command checks until T021 passes
- [ ] T023 [US3] Update `docs/PRESENTER-GUIDE.md` with exact preflight order, failure messages, and fallback actions
- [ ] T024 [US3] Run two fresh-shell preflights and store results in `_meta/freeze/2026-07-15-release-manifest.json`

## Final Phase: Portfolio Gate

- [ ] T025 Run `cd tests && node run-all.cjs`; require 2,869/0 or update all governed counts through the live no-drift mechanism
- [ ] T026 Update `_meta/OPEN-ITEMS.md`, `_meta/STATUS.md`, `AmadHackathon/00 Home.md`, `AmadHackathon/01 الخطة الرئيسة.md`, and a topical cockpit note with Wave 0 results
- [ ] T027 Stage only Wave 0 files from the approved inventory and review `git diff --cached` before committing

## Dependencies

- T001-T003 precede all edits.
- T004-T008 establish test teeth before implementation.
- T009-T014 block release progression.
- T015-T020 may run in parallel by file after T008.
- T021-T024 require a stable candidate from T014.
- T025-T027 require every selected story complete.
