# Contract: Release Attestation v1

The finalized manifest is committed **after** the immutable candidate-content commit it references. A draft
lives outside Git and may carry pending gate fields; it is never confused with final evidence.

Draft structure:

```json
{
  "schema": "ahd-release-attestation-v1",
  "candidate_id": "2026-07-15-freeze-rc1",
  "attestation_status": "draft",
  "base_commit": "40-hex-character integrated base",
  "approved_base": {
    "path": "_meta/freeze/2026-07-15-current-state.md",
    "sha256": "64-hex-character hash"
  },
  "candidate_commit": "40-hex-character current candidate",
  "branch": "codex/wave0-freeze-safety-main",
  "created_at": "2026-07-15T00:00:00+03:00",
  "operation": "candidate",
  "inventory": {
    "path": "_meta/freeze/2026-07-15-change-inventory.md",
    "sha256": "64-hex-character hash"
  },
  "gate": {
    "status": "pending",
    "command": "node tests/release-gate.cjs --manifest <manifest> --target <candidate-checkout> --attestation-root <attestation-checkout>",
    "inputs": null,
    "assertions": null,
    "failures": null,
    "duration_ms": null,
    "demo_ok": null,
    "controls": {
      "agent_governance": null,
      "manifest": null,
      "truth": null,
      "preflight": null,
      "product_gate": null
    }
  },
  "demo_sha256": "e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40",
  "checksum_source": {
    "path": "tests/fixtures/demo.sha256",
    "sha256": "64-hex-character hash"
  },
  "assets": [
    {
      "path": "demo/index.html",
      "sha256": "e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40",
      "kind": "candidate",
      "source": { "root": "candidate", "path": "demo/index.html" }
    }
  ],
  "included_paths": ["AGENTS.md"],
  "excluded_paths": [
    {
      "path": "relative/owner-file",
      "disposition": "owner-decision",
      "reason": "not approved for candidate"
    }
  ],
  "approvals": []
}
```

## Validation Interface

```powershell
node tests/release-manifest.cjs --manifest <repository-relative-manifest> --target <candidate-checkout> --attestation-root <attestation-checkout>
node tests/release-gate.cjs --manifest <repository-relative-manifest> --target <candidate-checkout> --attestation-root <attestation-checkout>
```

- `--manifest` is explicit. In draft precheck mode it may be an external absolute path. In final mode it MUST be a
  normalized repository-relative path resolved beneath `--attestation-root`; the filesystem bytes MUST equal the
  file tracked at that checkout's `HEAD`.
- `--target` is the checkout whose `HEAD` and bytes must equal `candidate_commit`.
- `--attestation-root` contains the finalized manifest's commit and any declared bundle sources. It may equal the
  development checkout for a draft precheck; final clean recovery uses a separate clean checkout of commit `B`.

## Validation Rules

### Identity and ancestry

- `attestation_status` is exactly `draft` or `final`.
- `base_commit` and `candidate_commit` are 40 lowercase hex, exist in the target repository, are unequal, and base
  is a strict ancestor of candidate.
- `approved_base.path` is the tracked T003 current-state record in the candidate tree. Its bytes hash correctly and
  its single machine-readable `approved_base_commit` value equals `base_commit`. A merely ancestral or caller-picked
  base is insufficient.
- Target `HEAD` equals `candidate_commit` for final validation.
- Final target and attestation roots have no tracked or staged changes. Untracked or ignored files never satisfy a
  governed input: validation reads every manifest, base record, inventory, candidate asset, bundle, checksum, and
  approval artifact through `git show <commit>:<path>`, and compares any checkout copy before use. Unexpected
  untracked shadows under governed paths fail; only exact declared `restore_to` outputs may exist in the target.
- A final manifest is read from an attestation checkout whose commit descends from, but is not equal to,
  `candidate_commit`. Its diff from candidate contains only the manifest, task/recovery metadata, and declared
  `attestation-bundle` source files, plus exact approval-evidence paths declared by non-candidate operations.
  Undeclared approval artifacts, declared paths absent from the delta, and paths used as both bundle and approval
  evidence fail.
- A draft may name target `HEAD` or an ancestor and is accepted only in explicit precheck mode.

### Inventory and paths

- The inventory file exists at the candidate commit, hashes correctly, and contains one canonical
  `ahd-freeze-inventory-v1` JSON block accounting for every stable-epoch observation ID exactly once in one
  normalized top-level item's append-only `observation_ids`.
- The inventory contains `capture_chain.baseline_epoch`, append-only `delta_epochs`, and `reconciliation`. T002 may
  finish with reconciliation `pending`; draft precheck may preserve that state, but candidate/final validation
  requires `closed`, exact `covered_through_epoch`, an unbroken sequence/previous-hash chain, and no rewritten or
  omitted observation.
- Every epoch is a stable content epoch: its two reads match for branch, HEAD, exact index bytes, exact NUL status
  bytes, and every dirty path's content hash/size and HEAD/index layer OIDs. Same status with changed content is a
  delta. Unsupported symlink, submodule, or staged-layer cases fail closed unless fully represented.
- The tracked inventory embeds the canonical append-only observation index used by clean final validation. External
  `observations_ref` artifacts are capture evidence, not the sole source. Each observation ID is derived from the
  epoch payload hash plus normalized path, layer, raw-record hash, and content hash/tombstone; it is globally unique
  and maps exactly once to the same path's top-level `observation_ids`. Raw-record hashes may repeat across epochs.
- The inventory has exactly one top-level item per normalized path. If byte-distinct source and candidate variants
  collide at that path, `collision.status` is `byte-distinct-path`; `selected_variant` contains exact `source_ref`,
  observation ID, 64-lowercase-hex SHA-256, owner, and `materialization_task:null`. If the candidate path is only a predeclared
  future Wave 0 output, `collision.status` is `planned-path`; `selected_variant.sha256` is `null`,
  `selected_variant.observation_id` is `null`, `materialization_task` is its exact owning task ID, and the top-level item is a `planned-wave-output` with
  disposition `release`. No other null selected hash is valid. In both cases the non-empty `preserved_variants`
  array contains unique observation IDs and source-ref/hash pairs with raw-record SHA-256, owner,
  `preservation_disposition` equal to `park` or
  `owner-decision`, non-empty reason, `preservation_mode:"content-addressed-external"`, traversal-free relative
  `preservation_ref` exactly `preservation/objects/sha256/<must_match_sha256>` beneath the controller dispatch root,
  and matching 64-lowercase-hex `must_match_sha256`. The top-level disposition governs the selected candidate path.
  Nested variants are preservation evidence, not additional manifest paths.
- T002 creates an external preservation object for every byte-bearing baseline dirty observation with create-new
  semantics, proves its bytes equal `must_match_sha256`, makes it read-only, and leaves the source worktree/branch
  untouched. T029 does the same immediately for every added or content-changed delta variant. Inventory and
  candidate progression fail closed if a required object is missing, writable, or hash-mismatched.
- `included_paths` is the exact normalized file set returned by `git diff --name-only base_commit..candidate_commit`.
- The mapping is an exact two-way bijection: every inventory item appears once in included or excluded paths; every
  included/excluded path exists in the inventory; every included path has inventory disposition `release`; every
  excluded path preserves the inventory disposition and non-empty reason. Extra paths, double disposition,
  omission, and disposition mismatch fail.
- Excluded disposition is exactly `park`, `generated`, `ignore`, or `owner-decision`, with a non-empty reason.
- Observation IDs and collision preservation references are unique and complete; a tracked observation mapped to
  two paths, missing from its path item, absent from the inline index, or referenced by the wrong path fails.
- At candidate validation, every `planned-path` materialization task is complete in reviewed task evidence and its
  path exists exactly once in `included_paths`; the validator hashes the candidate Git blob live. An incomplete
  task, absent/extra path, or non-release top-level disposition fails without inventing or backfilling T002 data.
- T030 can close reconciliation only when a fresh live source read is byte-identical to T029's reviewed epoch. It
  appends delta provenance/observations, adds every new normalized path, retains removals as tombstone evidence,
  resolves collisions, regenerates the external draft manifest, reruns precheck/review, and records the final
  inventory hash. Any drift returns to T029; it never widens the epoch silently.
- Paths are repository-relative, slash-normalized, traversal-free, unique, and compared case-insensitively on
  Windows. Included/excluded exact or ancestor/descendant overlap fails.
- Included paths are files, not directory shortcuts. An asset may legitimately equal an included file.

### Assets and hashes

- Asset kind is exactly `candidate` or `attestation-bundle`.
- `candidate` source is `{root:"candidate", path:<asset path>}`; the file is tracked at `candidate_commit`, its
  `git show` bytes equal the clean target bytes, and it hashes to the asset hash.
- `attestation-bundle` source is `{root:"attestation", path:"_meta/freeze/bundles/..."}` and supplies
  `restore_to` equal to the asset path. The source is tracked at attestation `HEAD`; its `git show` bytes equal the
  clean checkout bytes and hash to the declared asset hash before and after restoration.
- Workstation-only absolute paths, URLs, network retrieval, missing sources, and hash mismatches fail.
- The tracked checksum source is read from the candidate Git tree, equals its clean target bytes, hashes correctly,
  and pins the exact demo hash.

### Gate evidence

- Command is exactly `node tests/release-gate.cjs --manifest <manifest> --target <candidate-checkout> --attestation-root <attestation-checkout>`.
- Draft status requires `gate.status: pending`, null result fields, null controls, operation `candidate`, and empty
  approvals. `gate.inputs` is null. Pending evidence can validate schema but cannot authorize final attestation or
  any external action.
- Final status requires `gate.status: verified`, positive integer assertion/duration values, zero failures,
  `demo_ok: true`, and every control true. `gate.inputs` exactly records `manifest_path`, `base_commit`,
  `candidate_commit`, `target_role:"candidate-clean-tree"`, and `attestation_role:"attestation-clean-tree"`.
  The wrapper rejects any mismatch between these identities and its resolved arguments/commits and emits the
  resolved attestation commit plus the tracked manifest blob hash in its final evidence. Evidence is produced
  against exact `candidate_commit` after it exists.

### Operations and approvals

- `operation` is exactly `candidate`, `release`, `tag`, `push`, `overwrite`, or `cleanup`.
- Empty approvals are valid only for `operation: candidate`.
- Every other operation needs an approval matching exact scope and candidate commit, with non-empty approver,
  explicit-offset approval time, and a traversal-free evidence path tracked at attestation `HEAD`; its Git-tree
  bytes MUST equal the clean checkout bytes.
- Wrong scope/target, empty approver, invalid time, missing evidence, duplicates, and conflicting approvals fail.
- Every approval-evidence path is declared exactly once and is part of the permitted attestation delta; undeclared,
  extra, mismatched, or shadowed approval artifacts fail.

Validation is read-only. It never moves, deletes, restores, stages, commits, tags, pushes, or overwrites files.

## Two-Commit Example

1. Commit `A`: reviewed candidate content.
2. Commit `B`: final manifest and optional declared bundle sources naming `A`.
3. Clean checkout `B` supplies manifest/bundles; separate clean checkout `A` is the validated target.
4. Any future release tag targets `A` only after a separate scoped approval. Wave 0 creates neither tag nor push.
