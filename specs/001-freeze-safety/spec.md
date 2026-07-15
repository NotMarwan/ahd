# Feature Specification: Freeze Safety and Truth

**Feature Branch**: `codex/wave0-freeze-safety-main`
**Created**: 2026-07-14
**Status**: Approved for implementation on 2026-07-15
**Input**: Produce a safe, truthful, reproducible competition freeze while preserving all user work.

## Ahd Constitution Constraints

- The bank-role and Shariah spine remain unchanged.
- The frozen demo, generated engine, golden functions, and vectors are not modified.
- No product behavior changes belong in this package.
- Dirty user work is inventoried and preserved; release actions need named operator approval.
- Gate claims use live output; judge-visible records use the Judge Lens.
- Wave 0 remains the active Spec Kit package until its exit evidence passes.

### User Story 0 - Make Every Agent Follow the Active Wave (Priority: P1)

As project owner, I can dispatch any supported agent and know it will read the same authority chain,
claim one valid active-wave task, avoid path collisions, stop at human gates, and provide reviewable evidence.

**Why this priority**: A correct plan is ineffective if agents can silently select a later wave or edit the
same files concurrently.

**Independent Test**: Seed valid and invalid agent claims across active and later waves; the policy validator
accepts only the valid active-wave claim and rejects wrong-wave, invalid-task, missing-file, dependency, and
normalized path-overlap cases.

**Acceptance Scenarios**:

1. **Given** Wave 0 is incomplete, **When** a writer claims a later-wave task, **Then** the claim fails closed.
2. **Given** two path claims that differ only by case, slash direction, or ancestor depth, **When** the second
   writer claims them, **Then** the collision is rejected before either writer edits.
3. **Given** a checked or blocked task, **When** governance validation runs, **Then** dispatch, implementer,
   independent reviewer, re-review when needed, constitution result, owner, artifact, and review date are present.

## User Scenarios & Testing

### User Story 1 - Produce a Recoverable Freeze (Priority: P1)

As release owner, I can identify intended release content, isolate unrelated work, verify the full gate,
and create a recoverable release candidate without losing user changes.

**Why this priority**: Every other competition task depends on a trustworthy baseline.

**Independent Test**: Start from the current dirty worktree, produce an inventory and release manifest,
then reproduce the candidate in a clean checkout with the same gate and hashes.

**Acceptance Scenarios**:

1. **Given** tracked and untracked user work in an actively changing source worktree, **When** freeze preparation
   runs, **Then** that worktree is parked as one read-only non-candidate input while candidate paths are classified.
2. **Given** the release manifest, **When** a clean checkout is prepared, **Then** the gate and frozen-demo
   hash match the pinned candidate evidence without reading the parked source workspace.

### User Story 2 - Trust Current Documentation (Priority: P1)

As maintainer, I can read architecture, status, open items, and judge guidance without encountering
stale test counts, screen counts, server capabilities, or conflicting decision identifiers.

**Independent Test**: Compare each governed claim against live code and gate output; every mismatch is
fixed or explicitly marked historical.

**Acceptance Scenarios**:

1. **Given** live code and documentation, **When** drift checks run, **Then** no governed current-state
   claim contradicts the repository.
2. **Given** decision references, **When** identifiers are indexed, **Then** each identifier names one
   decision only.

### User Story 3 - Run Stage Preflight Reliably (Priority: P2)

As presenter, I can run one documented preflight and know the stage bundle, fallback media, terminal
commands, and app route are ready.

**Independent Test**: Run preflight twice from a fresh shell and compare the resulting checklist and
gate evidence.

**Acceptance Scenarios**:

1. **Given** a clean stage machine, **When** preflight runs, **Then** every required asset and command is
   verified without network access.
2. **Given** a failed preflight item, **When** the checklist reports it, **Then** the presenter receives a
   specific fallback action and does not continue silently.

### Edge Cases

- A release file contains unrelated user edits.
- Two agents claim `docs/` and `docs/ARCHITECTURE.md`, or equivalent paths with different case/separators.
- A default Spec Kit command resolves a later wave while Wave 0 remains incomplete.
- Generated media is large or intentionally excluded from version control.
- Windows lacks a Unix hashing command.
- A current-state document contains historical counts that must remain as history.
- The same decision identifier refers to the frozen demo and an innovation proposal.
- The remote branch changes after local verification but before release.

## Requirements

### Functional Requirements

- **FR-001**: The freeze process MUST inventory every path in the isolated candidate's base-to-candidate diff and
  every dependency-known Wave 0 output before candidate construction.
- **FR-002**: Every unique normalized candidate inventory path MUST have one disposition: release, generated,
  ignore, or owner decision.
- **FR-003**: The process MUST preserve pre-existing user work by treating every actively changing source worktree
  as one parked, read-only, non-candidate input. Wave 0 MUST NOT copy, stage, reset, clean, commit, merge, or
  overwrite its dirty files.
- **FR-004**: A finalized release attestation MUST record the base commit, an earlier immutable candidate-content
  commit, branch, creation timestamp, gate command/count/failures/duration, demo hash, inventory hash, asset hashes,
  and the tracked parked-source exclusion record.
- **FR-005**: A clean environment MUST reproduce the candidate-content commit by reading an explicit manifest and
  bundle root from the later attestation checkout, without relying on ignored or workstation-only files.
- **FR-006**: Governed documentation MUST match live screen count, suite count, server capability, and gate output.
- **FR-007**: Historical claims MUST be labeled historical instead of rewritten as current state.
- **FR-008**: Decision identifiers MUST be unique or explicitly namespaced.
- **FR-009**: Stage preflight MUST verify app launch, demo fallback, gate command, terminal proof, and media fallbacks.
- **FR-010**: Release, tag, push, overwrite, and cleanup operations MUST each require a scoped named approval
  with approver, target commit, time, and evidence; candidate construction MUST NOT imply those approvals.
- **FR-011**: Any failed freeze criterion MUST block release progression.
- **FR-012**: Canonical status, open items, architecture, agent guides, governed source comments, and cockpit
  mirrors MUST be synchronized without rewriting historical entries.
- **FR-013**: `.specify/feature.json` MUST select Wave 0 until its recorded exit gate passes.
- **FR-014**: Every writer agent MUST use a controller-issued dispatch and one exclusive claim under the shared
  Git common directory, binding a real active-wave task and normalized authorized files; a second writer,
  later-wave, invalid, off-task, protected-file, unissued, missing, field-mismatched, hash-mismatched, case, or
  ancestor/descendant conflict MUST fail closed. The controller creates dispatches and invokes claim creation;
  cooperative same-user agents never self-issue or self-claim.
- **FR-015**: All agent guides and dispatches MUST use the same authority order: constitution, recorded human
  decisions, portfolio, active package, spec, plan, tasks, live evidence, then mirrors.
- **FR-016**: A task MUST NOT be checked off without dispatch/claim identity, focused evidence, an append-only
  tracked review history, a reviewer distinct from its implementer, an approved review that supersedes every
  rejection without deleting it, and constitution result; a blocked task MUST name owner, `blocker_artifact`, and
  review date, while `artifact` remains reserved for completed task output.
- **FR-017**: The candidate-content commit MUST precede the finalized manifest attestation, preventing an
  impossible self-referential commit hash.
- **FR-018**: Agent policy, explicit manifest input, target checkout, attestation bundle root, truth, tripwire,
  preflight, and product gates MUST be available through one mandatory release command with zero failures required.

### Key Entities

- **Change Inventory Item**: Isolated candidate path, owner, disposition, rationale, and supplying commit/task.
- **Parked Source Workspace**: Read-only branch/status observation explicitly excluded from candidate inputs.
- **Release Manifest**: Immutable description of candidate inputs, hashes, gate evidence, and approvals.
- **Gate Evidence**: Command, result, count, duration, and frozen-demo verification.
- **Documentation Claim**: Claim text, authority, source of truth, and historical/current label.
- **Decision Reference**: Unique identifier, title, owner, status, and dependent work.
- **Agent Claim**: Agent, active wave, task, mode, normalized files, dependencies, and lifecycle.
- **Task Evidence**: Task, focused commands/results, append-only tracked reviews, constitution result, commit range,
  and blockers.
- **Candidate Attestation**: A later metadata commit that identifies and verifies an earlier candidate commit.

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of dirty-worktree items receive a documented disposition.
- **SC-002**: A clean checkout reproduces the full green gate with zero failures.
- **SC-003**: The frozen-demo hash matches the pinned value in both source and clean checkout.
- **SC-004**: Automated drift checks find zero current-state count or capability contradictions.
- **SC-005**: Every active decision reference maps to one unambiguous decision.
- **SC-006**: Two consecutive stage preflights complete with identical successful results.
- **SC-007**: Recovery to the last candidate can be completed in under 15 minutes.
- **SC-008**: No unrelated user change is deleted, overwritten, staged, or committed.
- **SC-009**: Agent-governance validation reports zero wrong-wave, invalid-task, missing-evidence, or path-collision findings.
- **SC-010**: The finalized attestation references an earlier candidate commit and a clean checkout of that exact
  commit reproduces all release-gate results without any ignored checksum dependency.

## Assumptions

- Current branch is the candidate source; remote publishing remains an operator action.
- The release candidate is built from `main` at `ff2de0e` plus reviewed planning commits; partial roadmap
  branches are evidence for the inventory, not additional merge sources.
- Existing generated assets may remain untracked when the manifest records them and fallbacks exist.
- The live gate banner is authoritative; embedded historical counts may remain when labeled.
- Release safety takes precedence over cosmetic work until Wave 0 passes.
