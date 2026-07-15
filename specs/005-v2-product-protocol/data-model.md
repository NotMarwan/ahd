# Data Model: V2 Product and Protocol

**Date:** 2026-07-14
**Money rule:** every monetary field is an integer halala.
**Time rule:** logic receives fixed ISO-8601 strings; it never reads a clock.

## SealProofPackage

Represents one independently verifiable proof envelope without changing the golden canonical record.

| Field | Type | Validation |
|---|---|---|
| `schema` | string | Exactly `open-witness-proof-package-v1` |
| `protocol_version` | string | Strict SemVer; unsupported major fails closed |
| `profile_id` | string | Present in `ProtocolProfileRegistry` |
| `canonical_record` | object | Existing versioned record; bytes remain unchanged |
| `chain` | `ChainBlock[]` | Ordered, contiguous sequence; links to the previous sealed seal |
| `timestamp_attestation` | object/null | External token, imprint algorithm, trust profile, provider ID |
| `issuer_proof` | object/null | Issuer ID, method ID, cryptosuite, signature, signed-at evidence |
| `merkle_proof` | object/null | Leaf, root, path, leaf index, tree size, checkpoint signature |
| `verification_result` | `VerificationResult` | Derived output; never part of canonical content |

Relationships: one package selects one protocol profile, one issuer profile, zero or one trusted-time
attestation, and zero or one Merkle checkpoint. A complete production profile requires all five properties.

## ChainBlock

| Field | Type | Validation |
|---|---|---|
| `seq` | integer | Starts at declared profile origin and increments by one |
| `previous_seal` | 64-char lowercase hex | Genesis for first block; prior block `sealed_seal` otherwise |
| `canonical_hash` | 64-char lowercase hex | Recomputed independently |
| `sealed_seal` | 64-char lowercase hex | Recomputed from previous seal, canonical hash, and sequence |
| `canonical_record` | object | Envelope sequence must equal canonical sequence where present |

State transition: a block is immutable after issuance. A replacement creates a new block or proof package; it
does not edit history.

## VerificationResult

| Field | Type | Validation |
|---|---|---|
| `ok` | boolean | True only when every mandatory property is `valid` |
| `profile_id` | string | Echoes the selected supported profile |
| `properties` | object | Exactly `integrity`, `continuity`, `trusted_time`, `issuer_signature`, `merkle_inclusion` |
| `failed_at` | string/null | First mandatory non-valid property in normative order |
| `diagnostics` | object | Stable codes only; no secrets or raw private material |

Each property contains `{ status, code, detail? }`; `status` is `valid`, `invalid`, `missing`, or `unsupported`.
The issuance workflow may expose `provisional` before packaging, but conformance verification never treats it as
valid.

## ProtocolProfileRegistry

| Field | Type | Validation |
|---|---|---|
| `registry_version` | string | SemVer |
| `profiles` | object | Keyed by immutable profile ID |
| `mandatory_properties` | string[] | Subset of the five fixed property names |
| `canonical_profile` | string | Existing v1 values remain registered |
| `allowed_algorithms` | string[] | Explicit allow-list; no implicit defaults |
| `lifecycle` | string | `active`, `issuance_disabled`, or `verification_only` |
| `superseded_by` | string/null | New profile ID; never deletes historical support |

Transition: `active -> issuance_disabled -> verification_only`. Verification support cannot be removed by an
ordinary rollback.

## IssuerProfile

| Field | Type | Validation |
|---|---|---|
| `issuer_id` | string | Stable issuer-scoped identifier |
| `verification_method` | string | Unique within issuer |
| `cryptosuite` | string | Exact allow-listed algorithm |
| `public_key_pem` | string | Public material only |
| `environment` | string | `fixture`, `staging`, or `production` |
| `effective_from` | string | Caller-compared ISO timestamp |
| `retired_at` | string/null | Stops new issuance; preserves historical verification |
| `compromised_at` | string/null | Requires policy-specific diagnostics and superseding evidence |
| `superseded_by` | string/null | Replacement verification method |

Private keys never appear in this entity or the repository.

## ApprovalArtifact

| Field | Type | Validation |
|---|---|---|
| `schema` | string | Exactly `ahd-approval-artifact-v1` |
| `approval_id` | string | Matches `DEC-<DOMAIN>-<SLUG>-V<NUMBER>` and is globally unique |
| `legacy_ids` | string[] | Historical aliases; collisions rejected |
| `capability_id` | string | Exact capability allow-list entry |
| `authority` | object | Name, role, organization, and authority type are all non-empty |
| `exact_question` | string | Non-empty; one bounded question |
| `decision` | string | `APPROVED` or `REJECTED` only |
| `enabled_profile` | string | Exact mechanism profile; empty when rejected |
| `conditions` | object[] | Machine-checkable key/operator/value triples |
| `source_ref` | string | Stable path or evidence reference |
| `source_digest` | 64-char lowercase hex | Digest of the referenced written source |
| `effective_from` | string | ISO-8601 supplied to pure evaluator |
| `expires_at` | string/null | Expiry is lifecycle, not a decision value |
| `revoked_at` | string/null | Stops future activation |
| `supersedes` | string[] | Prior approval IDs |
| `artifact_digest` | 64-char lowercase hex | SHA-256 of the canonical artifact excluding this field |

Computed lifecycle: `pending`, `active`, `rejected`, `expired`, `revoked`, `tampered`, or `superseded`.

## ActivationResult

```text
ACTIVE -> the exact mechanism function may be called
INERT  -> no mechanism function call and zero events/stateChanges/monetaryMoves
```

Fields: `outcome`, `reason`, `capability_id`, `enabled_profile`, `approval_refs`, `events`, `stateChanges`, and
`monetaryMoves`. An inert result always carries empty arrays for the last three fields.

## ProtectiveAction

| Field | Type | Validation |
|---|---|---|
| `schema` | string | `ahd-protective-action-v1` |
| `action_id` | CanonicalIdentity | Entity kind `event` |
| `record_id` | CanonicalIdentity | Entity kind `record` |
| `action_type` | string | `rifq_grace`, `borrower_release`, `duress_hold`, or `collusion_review_hold` |
| `requester_id` | string | Party reference; not an inferred identity |
| `reason_category` | string | Allow-listed neutral category |
| `required_consents` | string[] | Defined by the approved profile |
| `observed_consents` | object[] | Each bound to actor, scope, amount, and event |
| `original_principal_minor` | integer | Immutable and non-negative |
| `requested_amount_minor` | integer/null | Never exceeds current remaining principal |
| `status` | string | Uses `protective-action-state-v1` |
| `approval_refs` | string[] | All required active approvals |
| `neutral_evidence` | object[] | No guilt, probability, score, or verdict fields |

Transitions:

```text
REQUESTED -> ACTIVE | DECLINED | WITHDRAWN
ACTIVE -> DISPUTED | RELEASED | SUPERSEDED
DISPUTED -> RELEASED | SUPERSEDED
```

Forgiveness-specific events are append-only: `PARTIAL_FORGIVEN` and `FORGIVEN` cannot be rolled back into
principal. Revoking approval disables future actions only.

## CanonicalIdentityBinding

| Field | Type | Validation |
|---|---|---|
| `schema` | string | Exactly `ahd-identity-binding-v1` |
| `canonical_id` | string | `urn:ahd:1:<issuer-key>:<entity-kind>:<26-char-crockford-base32>` |
| `entity_kind` | string | `record`, `event`, `proof`, `principal`, `circle`, or `approval` |
| `legacy_refs` | object[] | Scheme, legacy value, and original canonical hash |
| `approval_ref` | string | Approval authorizing the binding policy |
| `binding_hash` | string | SHA-256 of canonical binding fields |

One legacy `(scheme,value,canonical_hash)` tuple maps to one canonical ID. A conflicting remap fails closed.
Historical canonical bytes remain untouched.

## StateVocabularyRegistry

Registries are immutable by version:

- `agreement-state-v1`: `DRAFT`, `PENDING_CONSENT`, `WITNESSED`, `ACTIVE`, `SETTLING`, `KEPT`, `DEFAULTED`,
  `DISPUTED`, `ESCALATED`, `FORGIVEN`, `DECLINED`, `EXPIRED`, `VOID`.
- `grace-state-v1`: `NONE`, `REQUESTED`, `GRANTED`.
- `circle-state-v1`: `CIRCLE_DRAFT`, `CIRCLE_OPEN`, `CIRCLE_PARTIAL`, `CIRCLE_KEPT`, `CIRCLE_VOID`.
- `protective-action-state-v1`: `REQUESTED`, `ACTIVE`, `DISPUTED`, `WITHDRAWN`, `DECLINED`, `RELEASED`,
  `SUPERSEDED`.

Legacy display state `RESCHEDULED` maps to agreement `ACTIVE` plus grace `GRANTED`. Unknown/empty histories fail
migration. Arabic labels are presentation data and are never parsed as canonical state.

## AggregateImpactResult

| Field | Type | Validation |
|---|---|---|
| `outcome` | string | `AGGREGATE` or `SUPPRESSED` |
| `reason` | string/null | `K_FLOOR` when suppressed |
| `cohort_size` | integer | Count only; never a subject identifier |
| `k_floor` | integer | Exactly `3` for v1 |
| `totals_minor` | object/null | Integer aggregate totals only |
| `claim_label` | string | `measured`, `modelled`, `synthetic`, or `estimated` |

Suppressed output contains no totals. Public output contains no record IDs, names, trust bands, ratings, or scores.

## MobileScreenRegistryEntry

| Field | Type | Validation |
|---|---|---|
| `key` | string | One of the 21 web registry keys |
| `route` | string | Unique Expo Router path |
| `surface` | string | `tab` or `stack` |
| `baseline_id` | string/null | Sadu partial ID or null for four supplemental designs |
| `journey_ids` | string[] | Reachability mapping |
| `offline_capability` | string | `full`, `draft`, `read_only`, or `needs_connection` |

Exactly four entries are tabs: `home`, `create`, `daftari`, `settle`. All 21 keys are unique and reachable.

## MobileJourneyBaseline

| Field | Type | Validation |
|---|---|---|
| `journey_id` | string | Stable fixture ID |
| `web_entry` | string | Existing web screen key |
| `mobile_entry` | string | Registered native route |
| `input_fixture` | object | Deterministic; includes fixed `as_of` |
| `expected_canonical` | string/null | Exact bytes when the journey seals |
| `expected_seal` | string/null | Exact golden-compatible seal |
| `expected_money_minor` | object | Integers only |
| `expected_state` | object | Versioned domain states |
| `offline_behavior` | string | Explicit outcome; external success is never faked |
| `accessibility_checks` | string[] | Labels, roles, focus order, scaling, target size |

The six core fixtures are request, create, proof, ledger, grace, and settlement.

## MobileStoreEnvelope

| Field | Type | Validation |
|---|---|---|
| `schema_version` | integer | Monotonic migration number |
| `as_of` | string | Explicit fixed application time |
| `records` | object[] | Canonical records and immutable events |
| `ui_state` | object | Noncanonical deterministic presentation state |
| `outbox_intents` | object[] | Noncanonical external actions with `needs_connection` state |

Migration runs inside one SQLite transaction. Rollback changes the active reader/default but never deletes records,
bindings, witnessed events, or old schema readers.

## ConformanceResult

| Field | Type | Validation |
|---|---|---|
| `implementation_id` | string | Stable independent implementation ID |
| `implementation_version` | string | SemVer |
| `fixture_id` | string | Stable fixture reference |
| `protocol_version` | string | Version actually evaluated |
| `properties` | object | Five property results |
| `ok` | boolean | All mandatory properties valid |
| `incompatibilities` | string[] | Stable machine-readable codes |

At least three Ahd fixtures and three reference-2 fixtures are exchanged. A verifier cannot mark its own issuer
builder as an independent second implementation.
