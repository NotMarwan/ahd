# Data Model: Freeze Safety and Truth

## ChangeInventoryItem

- `path`: exact repository-relative path from NUL-safe porcelain output
- `kind`: tracked-modified, tracked-added, tracked-deleted, untracked, generated, ignored, branch-only,
  planning-commit, or planned-wave-output
- `owner`: user, project, generated, agent identifier, unresolved
- `disposition`: release, park, generated, ignore, owner-decision; this top-level value governs the final
  candidate-path bijection
- `reason`: non-empty evidence-based explanation
- `raw_record_sha256`: SHA-256 of the exact NUL-terminated porcelain record, or `null` when the item has no source
  dirty record
- `source_content_sha256`: SHA-256 of observed worktree bytes, or `null` only for a tombstone/non-byte observation
- `source_size`: observed byte length, or `null` with null content hash
- `observation_ids`: non-empty append-only unique IDs for every baseline/delta observation mapped to this normalized
  path; the singular raw/content fields are the immutable baseline summary and are never overwritten by deltas
- `preservation`: for every byte-bearing dirty observation, exactly
  `{mode:"content-addressed-external", ref:"preservation/objects/sha256/<source_content_sha256>",
  must_match_sha256, read_only:true}`
- `collision`: `null`, or exactly `{status, selected_variant, preserved_variants}` where `status` is
  `byte-distinct-path` or `planned-path`
- `selected_variant`: exactly `observation_id` (nullable only for a future planned path), `source_ref`, `sha256`,
  `owner`, and `materialization_task`. For
  `byte-distinct-path`, `sha256` is 64 lowercase hex and `materialization_task` is `null`. For `planned-path`,
  `sha256` is `null`, `materialization_task` is the exact future Wave 0 task ID that owns the candidate bytes, and
  the top-level item kind is `planned-wave-output` with disposition `release`.
- `preserved_variants`: non-empty array; each entry has unique `observation_id` and `source_ref` + `sha256`, the
  source `raw_record_sha256`, `owner`, `preservation_disposition` (`park` or `owner-decision`), non-empty `reason`,
  `preservation_mode:"content-addressed-external"`, `preservation_ref` exactly
  `preservation/objects/sha256/<must_match_sha256>` relative to the dispatch root, and 64-lowercase-hex
  `must_match_sha256`
- `source_ref`: branch/commit/worktree when the item is not in the source checkout

There is exactly one top-level item per normalized repository path. When the source workspace and an approved
planning/candidate source contain byte-distinct content at that path, the top-level disposition describes only the
selected candidate path. The original source variant remains preserved in its untouched worktree/branch and is
recorded under `collision.preserved_variants`; it is never silently absorbed or emitted as a second manifest path.
`planned-path` never asserts byte identity or invents a future hash; it predeclares the candidate path and binds its
future materialization to one task while preserving the current source bytes immediately.
Every observation ID is accounted for exactly once through the inline tracked index and the matching top-level
path's append-only `observation_ids`; raw-record hashes may repeat across epochs. Before T002 completes, every
byte-bearing baseline observation is copied with create-new
semantics to the external content-addressed preservation root, rehashed, and made read-only; the external report
indexes it. Every later added/content-changed observation is preserved when its delta epoch is captured. Inventory
and candidate progression fail closed if any required object is missing, writable, or hash-mismatched.

## CaptureChain

- `baseline_epoch`: immutable `CaptureEpoch` with sequence `0`
- `delta_epochs`: append-only `CaptureEpoch` array; no prior epoch or observation is removed or rewritten
- `observations`: canonical tracked append-only `SourceObservation` index embedded in the inventory; this, not the
  external reference alone, is the clean-validator source
- `reconciliation`: `{status, owner_task, apply_task, covered_through_epoch}`; T002 writes
  `status:"pending"`, owner `T029`, apply task `T030`, and null coverage; candidate construction requires
  `status:"closed"` and exact final coverage

## CaptureEpoch

- `schema`: `ahd-source-epoch-v1`
- `sequence`: zero for baseline, otherwise previous sequence + 1
- `previous_epoch_sha256`: null for baseline, otherwise exact prior `epoch_payload_sha256`
- `captured_started_at`, `captured_completed_at`: caller-recorded explicit-offset timestamps
- `source_root_id`: stable non-secret identifier for the observed source worktree
- `branch`, `head_commit`: identical across the epoch's two reads
- `index_sha256`: SHA-256 of exact `git ls-files --stage -z` bytes, identical across both reads
- `status_ref`, `status_sha256`, `status_bytes`, `record_count`: external NUL-safe snapshot identity
- `observations_ref`: external canonical full `SourceObservation` array identity
- `observations_sha256`: SHA-256 of the ordered compact canonical observation-core array with
  `observation_id` omitted from every core
- `observation_ids`: derived ordered IDs for the epoch's inline tracked observations
- `epoch_payload_sha256`: SHA-256 of the compact canonical epoch core excluding this field and derived observation
  IDs; the core includes `observations_sha256`, so observation bodies are bound before IDs are derived
- `controller_attestation`: controller `signer`, dispatch ID, and dispatch payload SHA-256; this is task/review-bound
  provenance, not a cryptographic signature unless a separately approved key is used

An epoch is stable only when before/after branch, HEAD, index bytes, status bytes, and every observation's content
hash/size/layer identity match. Unsupported symlink, submodule, staged-layer, or path-shape cases fail closed unless
their exact layers are captured by the epoch contract.

## SourceObservation

- `observation_id`: SHA-256 of compact canonical JSON for the ordered array
  `[epoch_payload_sha256, normalized_path, layer, raw_record_sha256, source_content_sha256_or_"tombstone"]`;
  unique across the chain
- `epoch_sequence`, `path`, `layer`, `status_xy`, `raw_record_sha256`
- `source_content_sha256`, `size`: byte hash/length, or both null for a tombstone
- `kind`, `head_blob_oid`, `index_blob_oid`
- `preservation_ref`: required exact content-addressed object for byte-bearing dirty observations

Raw-record hashes may repeat across epochs when status text stays unchanged; observation IDs may not. Every inline
epoch observation ID maps exactly once to one top-level item's append-only `observation_ids`, and every top-level
observation ID resolves to exactly one inline observation for that same normalized path. Collision and preserved
variant records reference observation IDs rather than treating a raw-record hash as global identity.

## DeltaEpoch

A delta epoch is a `CaptureEpoch` plus deterministic sets for `added`, `removed`, `status_changed`,
`content_changed`, and `head_tree_changed` paths and before/after observation references. Same porcelain status with
changed bytes is `content_changed`. T029 captures and preserves the delta immediately. T030 may apply only an epoch
whose complete live source re-read is byte-identical; otherwise it releases its claim and returns to T029.

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

## BootstrapWriterLock

- `schema`: `ahd-bootstrap-writer-v1`
- `owner`: root controller identity
- `wave`: active package path
- `scope`: exactly two zero-padded task IDs forming a closed inclusive interval; `['T001','T010']` authorizes
  T001, T002, ..., T010 and is not an exact two-item allowlist
- `dispatch_root`: external brief/report directory
- `expires_at`: explicit-offset expiry
- `rollback`: release condition

The live lock is create-once controller state. Clarifying its interval semantics does not overwrite, delete, or
recreate it. T010 later proves fail-closed rejection outside the declared interval before root releases the lock.

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
- `artifact`: completed task-output path/hash; not used for a blocker
- `blocker_artifact`: required blocker/decision/evidence path when blocked
- `review_date`: required when blocked

Checked tasks require a complete evidence entry. Blocked tasks remain unchecked and require owner,
`blocker_artifact`, and review date. Every review artifact is repository-tracked under `_meta/freeze/reviews/`;
reviewer and implementer
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
- `capture_chain`: closed chain identity and `covered_through_epoch`
- `approved_base`: tracked T003 current-state path and SHA-256 containing the single machine-readable base value
- `assets`: path, SHA-256, kind, source root/path, and optional restore path
- `included_paths`: exact normalized `base_commit..candidate_commit` file diff and exact inventory `release` set
- `excluded_paths`: exact inventory non-release set, preserving every recorded disposition and reason
- nested collision variants: preservation evidence only; each byte-distinct unselected source variant must be
  `park` or `owner-decision` with source reference, hash, owner, and reason, and never enters `included_paths` or
  `excluded_paths` as a duplicate path
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
