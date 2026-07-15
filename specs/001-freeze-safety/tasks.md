---
description: "Strictly ordered freeze-safety work with agent, release, and evidence gates"
---

# Tasks: Freeze Safety and Truth

## Execution Contract

- One writer task at a time. Read-only audits may run concurrently.
- Authority order is constitution, recorded human decisions/scoped approvals, portfolio, active package, spec,
  plan, tasks, live evidence, then mirrors. Conflict means stop and reconcile.
- Every writer dispatch cites the constitution, portfolio, active package, exact task ID, and exact files.
- T001-T010 run under one controller-owned exclusive bootstrap claim in the shared Git common directory. Root
  creates each dispatch and spawns its writer; agents never self-issue or self-claim. T010 completes under the
  bootstrap lock, which root then releases before separately issuing T011 through the tested helper.
- A task is checked only after focused evidence, append-only tracked review history, and a constitution result are
  recorded in `_meta/freeze/2026-07-15-task-evidence.json`. One independent batch review may cover adjacent tasks
  when it records an explicit verdict for each task; do not dispatch a separate reviewer for documentation-only
  micro-steps.
- `candidate`, `release`, `tag`, `push`, `overwrite`, and `cleanup` are distinct operations. Only `candidate` work is authorized in this plan.
- No task authorizes a tag, push, overwrite, cleanup, Shariah ruling, or substantive decision resolution.

## Phase 1: Inventory Before Mutation

- [x] T001 Capture NUL-safe `git status --porcelain=v1 -z --branch --untracked-files=all`, recent commits, worktrees, branch divergence, the live gate output, and direct demo hash in `_meta/freeze/2026-07-15-change-inventory.md`; preserve raw NUL-delimited evidence outside Git and run capture commands before writing the file
- [x] T002 Confirm the integrated master-planning delta is patch-equivalent to source commit `c08089061a0fa08ec8a78f6217be601f3558477e`, the active pointer remains Wave 0, and the isolated candidate worktree is clean; record the changing source worktree once as `park-whole-workspace` with `candidate_input=false`, then classify only every exact path in `ff2de0e..HEAD` plus dependency-known T003-T030 candidate outputs in `_meta/freeze/2026-07-15-change-inventory.md`; embed one canonical `ahd-freeze-inventory-v1` JSON block with one normalized candidate path per item and never copy or reconcile source dirty files
- [x] T003 Record live screen registrations, suite/assertion counts, server routes, the exact stage-asset set derived from `docs/PRESENTER-GUIDE.md`, `docs/pitch/script-ar.md`, and `tests/stage-preflight.cjs`, active Spec Kit package, candidate base, and demo hash in `_meta/freeze/2026-07-15-current-state.md`; expose exactly one machine-readable `approved_base_commit` equal to the reviewed `main@ff2de0e` base
- [x] T004 Validate T001-T003 against the constitution under the owner-directed single-agent rule; record conflicts, human gates, controller identity, and the temporary session-sync exception (owner, T036/2026-07-15 expiry, interim evidence artifact, T035 rollback/finalization) in `_meta/freeze/2026-07-15-task-evidence.json`

## Phase 2: Binding Agent Governance

- [x] T005 Write failing cases in `tests/agent-governance.test.cjs` for the wrong active package, missing authority order, invalid task IDs, later-wave writers, a second disjoint writer, concurrent cross-worktree lock acquisition, missing/off-task/protected files, missing/unissued/field-mismatched/hash-mismatched controller dispatch, exact/prefix/case-insensitive path collisions, unchecked dependencies, self-review, deletion or mutation of prior reviews, rejection without a superseding approval, evidence-free checkoffs, interrupted review/evidence-before-checkbox completion, incomplete blocked metadata, and every exact/prefix protection in `project/agent-control/protected-paths.json` including the T015-only checksum exception
- [x] T006 Run `node tests/agent-governance.test.cjs` and record the expected RED evidence before implementation
- [x] T007 Implement and validate the tracked exact/prefix contract in `project/agent-control/protected-paths.json`, then implement controller-only dispatch/claim invocation, exclusive global writer claim, audit claim, append-only tracked review artifacts, safe task completion, release, and read-only validation in `project/agent-control/claim.cjs` and `tests/agent-governance.cjs`; store runtime state under `git rev-parse --git-common-dir`, require caller-supplied explicit-offset timestamps, bind claims to dispatch hashes, make completion atomically write the review artifact and approved evidence before atomically changing the checkbox, and own the focused GREEN result for `node tests/agent-governance.test.cjs`
- [x] T008 Track and align `AGENTS.md`, `CLAUDE.md`, and `_meta/agent-presence/README.md` on one authority order, active-wave protocol, claim protocol, review/checkoff rules, and human stop gates
- [x] T009 Re-prove the focused GREEN result without changing governance implementation, prove needs-fix reviews remain in tracked history after superseding approval, and add the already-green policy check as an uncounted mandatory meta-step in `tests/run-all.cjs`; this task owns only the harness integration plus evidence/control files
- [x] T010 Under the bootstrap lock validate accumulated reviewed evidence for T001-T009, prove invalid, unissued, mismatched, concurrent, protected-path, or colliding helper requests fail closed, record and check T010 through the bootstrap completion procedure, then have root release only its owned bootstrap lock; after T010 is complete, root separately issues the first controller-self dispatch/claim for T011 under the owner-directed no-subagent rule

## Phase 3: Release-Control Teeth

- [x] T011 Write failing cases in `tests/release-manifest.test.cjs` for missing keys, base unequal to the T003 approved-base record, base equal to candidate, bad ancestry, self-reference, incomplete or extra base-to-candidate diff paths, one-way inventory mapping, inventory omission/double disposition/disposition mismatch, exact/prefix overlap, invalid asset kind/source/restore hash, untracked or shadowed final manifest/candidate asset/bundle/checksum/approval evidence, dirty tracked/staged roots, unexpected governed-path shadows, undeclared/extra/mismatched attestation-delta approval artifacts, bad pending/verified gate evidence, canonical-command or structured-input mismatch, wrong demo hash, invalid operations, missing approvals, wrong scope/target, empty approver, invalid/no-offset time, traversal/missing evidence, and conflicting approvals
- [x] T012 Run `node tests/release-manifest.test.cjs` and record the expected RED evidence before implementation
- [x] T013 Implement the read-only manifest validator in `tests/release-manifest.cjs` until T011 passes
- [x] T014 Extend `tests/app/tripwire-portability.test.cjs` to require a tracked checksum source and prove a clean checkout works without `_overnight/backup/demo.sha256`; record RED
- [x] T015 Add the tracked checksum source and update `tests/tripwire.cjs` plus governed instructions until the portability suite passes; never edit `demo/index.html`
- [x] T016 Write failing live-truth cases in `tests/release-truth-check.test.cjs` for architecture, status, agent guides, screen count, suite count, authentication, routes, live smoke, deployment, stale source comments, and globally duplicated active decision identifiers
- [x] T017 Run `node tests/release-truth-check.test.cjs` and record the expected current mismatches before implementation
- [x] T018 Write failing stage-preflight cases in `tests/stage-preflight.test.cjs` for offline-only app launch, fallback media, terminal proof, exact gate command, stale presence, wrong demo hash, 30-second budget, timeout cleanup, and volatile evidence normalization
- [x] T019 Run `node tests/stage-preflight.test.cjs` and record the expected RED evidence before implementation
- [x] T020 Extend `tests/stage-preflight.cjs` with bounded read-only execution, cleanup, actionable failures, and normalized evidence until T018 passes

## Phase 4: Current Truth and Decision Identity

- [ ] T021 Correct stale current-state claims in `docs/ARCHITECTURE.md`, `_meta/STATUS.md`, `_meta/score-leap-loop-state.md`, `AGENTS.md`, `CLAUDE.md`, and governed source comments without rewriting historical entries
- [ ] T022 Resolve the identifier collision mechanically by reserving `D-4` for the frozen-demo decision and namespacing the separate innovation note as `INN-D4`; preserve its pending-Marwan substance and record that no approval was inferred
- [ ] T023 Verify or close stale `OT-13`, `OT-14`, and `OT-LINKS` claims with exact evidence in `_meta/OPEN-ITEMS.md`
- [ ] T024 Implement live-source parsing in `tests/release-truth-check.cjs` until every T016 case passes
- [ ] T025 Run `node tests/release-truth-check.test.cjs`, the agent policy check, and `node tests/run-all.cjs` so gate-drift receives its authoritative environment; record zero current-state mismatches

## Phase 5: Candidate Construction

- [ ] T026 Generate an ignored external draft manifest at `.superpowers/sdd/2026-07-15-release-manifest.draft.json` from the reviewed candidate inventory; set `attestation_status=draft`, the parked-source exclusion, T003 approved-base path/hash, exact base/diff/inventory bijection, pending gate results, deterministic asset sources, exclusions, and empty approvals
- [ ] T027 Create `_meta/freeze/2026-07-15-recovery-drill.md` with the two-commit lifecycle and explicit `--manifest`, `--target`, and `--attestation-root` interfaces; tag/push remain blocked
- [ ] T028 Implement `tests/release-gate.cjs` as the one-command wrapper over focused controls plus `tests/run-all.cjs`; require the canonical explicit manifest/target/attestation interface, accept external draft-pending only in precheck mode, require clean tracked/staged state and final governed inputs from tracked Git-tree bytes while allowing only exact declared restore outputs, bind structured input roles to resolved commits and manifest blob, and prove focused self-tests while the writer claim is active
- [ ] T029 Release the writer claim, run the draft precheck from a claim-free shell, prove no source-worktree path is a candidate input or staged path, then run one independent constitution, Judge Lens, inventory, and intended-path review; record results outside Git before reacquiring a writer claim
- [ ] T030 Reacquire a controller dispatch/claim, record T029 evidence, stage only reviewed isolated-candidate paths, prove no parked-source path was copied or reconciled, obtain an independent review of the actual `git diff --cached`, create candidate-content commit `A`, and record its full SHA without tagging or pushing

## Phase 6: Attestation and Clean Recovery

- [ ] T031 Reject any parked-source candidate input; under a scoped claim update the external draft to T030's exact candidate SHA, release the claim, run candidate controls claim-free against immutable candidate A, then reacquire a manifest-only dispatch/claim, populate verified candidate evidence plus the canonical command and structured input roles, independently review the final bytes and their strict approved base/diff/inventory bijection, parked-source exclusion, ancestry, hashes, operation=`candidate`, and empty approvals, create `_meta/freeze/2026-07-15-release-manifest.json` in attestation commit B without claiming final validation yet, and release the claim
- [ ] T032 Under a recovery-only scoped claim, create separate clean attestation-B and candidate-A checkouts and restore only declared generated assets inside the disposable A target; release the claim, then run `node tests/release-gate.cjs --manifest _meta/freeze/2026-07-15-release-manifest.json --target <A-checkout> --attestation-root <B-checkout>` claim-free, require emitted A/B/manifest-blob identities to match and all final inputs to come from their Git trees, and record exact output plus recovery time under 15 minutes outside Git for T035
- [ ] T033 With no writer claim active, run two fresh-shell stage preflights against the candidate commit, normalize volatile fields, require byte-identical evidence, and record both results outside Git before the next writer claim
- [ ] T034 Verify `git diff -- demo/index.html app/engine.js` is empty in source and clean checkout; record both hashes and the tracked checksum source
- [ ] T035 Reacquire a scoped writer claim; record recovery/preflight evidence and update `_meta/OPEN-ITEMS.md`, `_meta/STATUS.md`, `AmadHackathon/00 Home.md`, `AmadHackathon/01 الخطة الرئيسة.md`, and the topical cockpit note; complete the temporary session-sync exception, commit, release the claim, and rerun truth/release gates claim-free
- [ ] T036 Reacquire a final scoped claim to record `complete` or `blocked` with owner/artifact/review date, commit and release it, then run the release gate and independent review claim-free; confirm no tag, push, overwrite, cleanup, Shariah ruling, or substantive Marwan decision occurred

## Dependencies

- T001-T004 precede all Wave 0 implementation edits.
- T005-T010 are sequential and establish enforcement for every later writer.
- T011-T020 are sequential red-green slices; tests always precede implementation.
- T021-T025 require T010 and the corresponding RED evidence.
- T026-T030 require every focused control green and no unresolved owner-decision in an included path.
- T031-T034 require the immutable T030 candidate-content commit.
- T035-T036 require successful clean recovery and both normalized preflights.
- Later portfolio waves remain blocked until T036 records Wave 0 complete.
