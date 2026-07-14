# Feature Specification: Freeze Safety and Truth

**Feature Branch**: `judge-lens-real-leap`  
**Created**: 2026-07-14  
**Status**: Ready for planning  
**Input**: Produce a safe, truthful, reproducible competition freeze while preserving all user work.

## Ahd Constitution Constraints

- The bank-role and Shariah spine remain unchanged.
- The frozen demo, generated engine, golden functions, and vectors are not modified.
- No product behavior changes belong in this package.
- Dirty user work is inventoried and preserved; release actions need named operator approval.
- Gate claims use live output; judge-visible records use the Judge Lens.

## User Scenarios & Testing

### User Story 1 - Produce a Recoverable Freeze (Priority: P1)

As release owner, I can identify intended release content, isolate unrelated work, verify the full gate,
and create a recoverable release candidate without losing user changes.

**Why this priority**: Every other competition task depends on a trustworthy baseline.

**Independent Test**: Start from the current dirty worktree, produce an inventory and release manifest,
then reproduce the candidate in a clean checkout with the same gate and hashes.

**Acceptance Scenarios**:

1. **Given** tracked and untracked user work, **When** freeze preparation runs, **Then** every item is
   classified as release, parked, generated, or unresolved without deletion.
2. **Given** the release manifest, **When** a clean checkout is prepared, **Then** the gate and frozen-demo
   hash match the source workspace.

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
- Generated media is large or intentionally excluded from version control.
- Windows lacks a Unix hashing command.
- A current-state document contains historical counts that must remain as history.
- The same decision identifier refers to the frozen demo and an innovation proposal.
- The remote branch changes after local verification but before release.

## Requirements

### Functional Requirements

- **FR-001**: The freeze process MUST inventory every tracked modification and untracked item.
- **FR-002**: Every inventory item MUST have one disposition: release, park, generated, ignore, or owner decision.
- **FR-003**: The process MUST preserve all pre-existing user changes.
- **FR-004**: The release manifest MUST record commit, branch, gate result, demo hash, asset hashes, and timestamp.
- **FR-005**: A clean environment MUST reproduce the release candidate from the manifest.
- **FR-006**: Governed documentation MUST match live screen count, suite count, server capability, and gate output.
- **FR-007**: Historical claims MUST be labeled historical instead of rewritten as current state.
- **FR-008**: Decision identifiers MUST be unique or explicitly namespaced.
- **FR-009**: Stage preflight MUST verify app launch, demo fallback, gate command, terminal proof, and media fallbacks.
- **FR-010**: Release, tag, push, or overwrite actions MUST require named operator approval.
- **FR-011**: Any failed freeze criterion MUST block release progression.
- **FR-012**: Canonical status, open items, architecture, and cockpit mirrors MUST be synchronized.

### Key Entities

- **Change Inventory Item**: Path, ownership, disposition, rationale, and collision status.
- **Release Manifest**: Immutable description of candidate inputs, hashes, gate evidence, and approvals.
- **Gate Evidence**: Command, result, count, duration, and frozen-demo verification.
- **Documentation Claim**: Claim text, authority, source of truth, and historical/current label.
- **Decision Reference**: Unique identifier, title, owner, status, and dependent work.

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

## Assumptions

- Current branch is the candidate source; remote publishing remains an operator action.
- Existing generated assets may remain untracked when the manifest records them and fallbacks exist.
- The live gate banner is authoritative; embedded historical counts may remain when labeled.
- Release safety takes precedence over cosmetic work until Wave 0 passes.

