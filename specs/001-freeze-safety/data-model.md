# Data Model: Freeze Safety and Truth

## ChangeInventoryItem

- `path`: exact repository-relative path from NUL-safe porcelain output
- `kind`: tracked-modified, tracked-added, tracked-deleted, untracked, generated, ignored, branch-only,
  planning-commit, or planned-wave-output
- `owner`: user, project, generated, agent identifier, unresolved
- `disposition`: release, park, generated, ignore, owner-decision
- `reason`: non-empty evidence-based explanation
- `collision`: normalized path or hunk overlap with another owner
- `source_ref`: branch/commit/worktree when the item is not in the source checkout

## AgentClaim

- `schema`: `ahd-agent-claim-v1`
- `agent_id`: stable non-empty identifier
- `dispatch_id`: controller-issued immutable dispatch identifier
- `dispatch_sha256`: hash of the exact dispatch record
- `issued_by`: controller identity
- `wave`: active package path; must equal `.specify/feature.json`
- `task_id`: real unchecked task in the active `tasks.md`
- `mode`: writer or audit
- `files`: normalized repository-relative paths; required for writers, empty for audits
- `created_at`: caller-supplied explicit-offset operational ISO timestamp; never generated from wall-clock APIs
- `status`: active or released

The controller writes immutable dispatch records and invokes claim creation before spawning the writer. The
controller operation exclusively creates one global `writer.lock` under the Git common directory, validates the
dispatch while holding that lock, and writes the claim into the lock. Cooperative writers never self-issue or
self-claim; the hash proves byte integrity and field consistency, not same-user operating-system authentication.
Every worktree shares it, so a second writer fails even for disjoint files. Windows comparison is case-insensitive;
separators normalize to `/`; claims must be within the dispatch/task-authorized set and cannot include protected
paths. Audit claims are read-only and separate.

## ProtectedPathContract

- `schema`: `ahd-protected-paths-v1`
- `rules`: exact or prefix repository-relative paths, rationale, owner, and `allowed_task_ids`
- exact: `demo/index.html`, `app/engine.js`, `.specify/memory/constitution.md`, `tests/golden-vectors.json`,
  `_meta/archive/the copy request/root-tree__10_Deep/Hardening/test-harness/golden-vectors.json`, and
  `tests/fixtures/demo.sha256`
- prefix: `protocol/fixtures/`
- only Wave 0 exception: `tests/fixtures/demo.sha256` permits `T015`

Rules are slash-normalized and case-insensitive on Windows. An empty `allowed_task_ids` denies every task; an
exception authorizes only that exact task/path pair and does not weaken prefix or sibling protections.

## TaskEvidence

- `task_id`: active-wave task identifier
- `dispatch_id`: dispatch linked to the implementation
- `implementer`: writer identity
- `controller`: issuer/coordinator identity
- `status`: complete or blocked
- `commands`: focused command, exit code, relevant result, and RED/GREEN classification when applicable
- `commit_range`: implementation range or `none` for verified read-only work
- `reviews`: append-only tracked entries containing `review_id`, `reviewer`, `audit_claim_id`, `artifact_path`,
  `artifact_sha256`, `reviewed_commit`, `verdict`, `created_at`, and `supersedes`
- `constitution`: pass or named conflict
- `owner`: required when blocked
- `artifact`: required blocker/decision/evidence path when blocked
- `review_date`: required when blocked

Checked tasks require a complete evidence entry. Blocked tasks remain unchecked and require owner, artifact, and
review date. Every review artifact is repository-tracked under `_meta/freeze/reviews/`; reviewer and implementer
must differ. Review entries are never deleted or mutated. `needs-fix` remains in history and requires a later
`approved` entry whose `supersedes` points to the latest review before checkoff.
The completion validator reads the prior evidence from `HEAD`; its `reviews` array must be an exact prefix of the
new array. Review artifact paths use create-once semantics, so prior artifacts cannot be overwritten or removed.

The controller's completion transition writes an approved evidence record through temp-file + atomic rename before
it writes the checkbox through temp-file + atomic rename. An interruption may leave approved evidence for an
unchecked task, which is safe and resumable; the inverse state is invalid and cannot be produced.

## ReleaseManifest

- `schema`: `ahd-release-attestation-v1`
- `candidate_id`: stable release-candidate label
- `attestation_status`: draft or final
- `base_commit`: full 40-hex integrated candidate base; must equal the immutable T003 approved-base record and
  differ from `candidate_commit`
- `candidate_commit`: full 40-hex commit created before this final attestation
- `branch`: source branch
- `created_at`: operator-recorded ISO timestamp; operational metadata, never product logic
- `operation`: candidate, release, tag, push, overwrite, or cleanup
- `gate`: status (`pending` or `verified`), canonical command, structured input roles/identities, assertions,
  failures, duration_ms, demo_ok, focused-control results
- `demo_sha256`: full pinned hash
- `checksum_source`: tracked repository-relative checksum path and its own hash
- `inventory`: tracked path and SHA-256 for the reviewed inventory
- `approved_base`: tracked T003 current-state path and SHA-256 containing the single machine-readable base value
- `assets`: path, SHA-256, kind, source root/path, and optional restore path
- `included_paths`: exact normalized `base_commit..candidate_commit` file diff and exact inventory `release` set
- `excluded_paths`: exact inventory non-release set, preserving every recorded disposition and reason
- `approvals`: approver, scope, target_commit, approved_at, and evidence

A draft manifest lives outside Git, may name the then-current content commit, and uses `gate.status: pending`.
The final manifest lives in an attestation commit after `candidate_commit`, sets `attestation_status: final`, and
uses verified gate output bound to that exact candidate. It never records its own commit. Empty approvals are valid
only for `operation: candidate`.

## GateEvidence

- `command`: exact canonical command with manifest, candidate-target, and attestation-root roles
- `inputs`: exact manifest path, base/candidate commits, and target/attestation roles; final wrapper output also
  records resolved attestation commit and tracked manifest blob hash
- `assertions`: live product assertion total
- `failures`: zero for progression
- `duration_ms`: measured operational duration
- `demo_ok`: exact hash comparison result
- `controls`: agent policy, manifest, truth, preflight, product gate results
- `environment`: clean checkout or source worktree
- `normalized_evidence_sha256`: hash excluding volatile time/duration fields

## DocumentationClaim

- `claim_key`: stable name such as `app_suite_count`
- `document`: repository-relative path
- `classification`: current or historical
- `expected_source`: live command or code location
- `observed_value`: parsed document value
- `status`: match, mismatch, exempt-history

## DecisionReference

- `id`: globally unique identifier
- `title`: one decision only
- `authority`: Marwan, scholar, counsel, vendor, operator
- `status`: open, approved, rejected, superseded
- `dependencies`: task or feature identifiers

`D-4` is reserved for the frozen-demo decision. `INN-D4` names the separate innovation note without changing
or approving its substance.

## State Transitions

`inventory-draft -> inventory-reviewed -> controls-green -> candidate-content-committed -> attested -> clean-recovery-green -> preflight-green -> wave0-complete`

Any failure returns to `controls-green` or `candidate-content-committed` as applicable. `release`, `tag`, `push`,
`overwrite`, and `cleanup` never occur automatically and require their own matching approval.
