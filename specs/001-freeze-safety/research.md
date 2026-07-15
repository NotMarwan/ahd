# Research: Freeze Safety and Truth

## Decision: Inventory before mutation

**Rationale**: The source checkout contains tracked user edits, untracked artifacts, and active branch work.
Classification is safer than cleanup and supports explicit ownership. NUL-safe porcelain with
`--untracked-files=all` is required; collapsed directory status cannot prove 100% classification.
**Alternatives considered**: Stash everything; clean untracked files; clone only HEAD. Rejected because each can
hide or lose intended release work.

## Decision: Integrated main is the candidate base

**Rationale**: `main` at `ff2de0e` already contains the reviewed safety, evidence, product, actor-boundary,
font, protocol, and clean-archive integrations. The older planning branch omits 14 main-only commits.
**Alternatives considered**: Build from `judge-lens-real-leap`; merge partial roadmap branches. Rejected because
the first is stale and the second duplicates or reintroduces superseded work.

## Decision: Pin the active package and enforce atomic writer claims

**Rationale**: The prior feature pointer selected Wave 4 while Wave 0 was incomplete, and soft worktree-local
presence arrays could not prevent normalized prefix collisions or races. One controller dispatch plus one
exclusive writer lock under the Git common directory makes the active plan visible across every worktree.
**Alternatives considered**: Rely on dispatch prose; permit concurrent writers with voluntary path lists. Rejected
because both fail silently when context is stale or paths differ by case, separators, or ancestor depth.

T001-T010 bootstrap under one controller-created global lock because the helper does not exist yet. The exception
has a named owner, T010 expiry, and replacement path. Interim subagent reports/task evidence also carry a temporary
session-sync exception through T035 so parallel reviewers never collide on shared status mirrors.

Task completion is evidence-first: approved evidence is atomically installed before the tasks checkbox changes.
If interrupted, the task remains unchecked and can safely resume. The reverse state is rejected.

## Decision: Live sources govern current-state claims

**Rationale**: `tests/run-all.cjs`, screen registrations, server routes, and Git state are reproducible. Current
documentation contains stale historical descriptions.
**Alternatives considered**: Manual number sweep. Rejected because drift recurs.

## Decision: Use a tracked portable checksum source

**Rationale**: The current tripwire reads `_overnight/backup/demo.sha256`, which is ignored and absent from a
clean worktree. A tracked checksum file makes the constitutional gate reproducible without Unix tools or local
backup state.
**Alternatives considered**: Embed only a JavaScript constant; unignore the entire backup directory. Rejected
because a tracked one-line fixture is independently inspectable and avoids publishing unrelated backups.

## Decision: Namespace decision identifiers

**Rationale**: `D-4` identifies the frozen-demo fate in the decision register and a separate innovation note in
score-loop material. `D-4` remains the decision; `INN-D4` becomes only the innovation-note identifier. This
clerical namespace does not approve or change the note's pending-Marwan substance.
**Alternatives considered**: Infer meaning from file context. Rejected because cross-document tasks lose context.

## Decision: Separate candidate content from its attestation

**Rationale**: A commit cannot contain its own hash. Candidate commit `A` is created first; later attestation
commit `B` contains the manifest naming `A`. Clean recovery uses one checkout of `B` as explicit manifest/bundle
input and a separate checkout of `A` as the validation target.
**Alternatives considered**: Placeholder hash amended repeatedly; manifest that records only the starting base;
uncommitted external manifest. Rejected as self-referential, unreproducible, or non-durable.

## Decision: One release wrapper and normalized preflight evidence

**Rationale**: Product assertions alone do not prove agent claims, manifest validity, current documentation, or
stage readiness. `tests/release-gate.cjs` composes those focused controls with the existing product gate. Two
preflights compare normalized evidence that excludes volatile time and duration fields.
**Alternatives considered**: Wire stage preflight directly into the developer gate. Rejected because active
development claims intentionally make stage readiness red while agents are working.

## Decision: Operator owns irreversible release actions

**Rationale**: Release, tag, push, delete, cleanup, and overwrite affect external or irreversible state. Approval
must match the exact operation and candidate commit. Candidate construction is authorized; those other operations
remain blocked.
**Alternatives considered**: Automatic release after a green gate. Rejected by project governance.
