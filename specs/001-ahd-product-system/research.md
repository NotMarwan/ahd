# Research: Ahd Product System Planning Decisions

**Date**: 2026-07-14

**Method**: Graph-first architecture query, active-source verification, master-spec review,
constitution review, current gate execution evidence, and three read-only specialist reviews of
architecture, data/contracts, and security/privacy.

## Outcome

The current product is structurally strong enough to preserve. The planning problem is not a
rewrite; it is precise governance of multiple proof surfaces and honest closure of production
gaps. No generated technical-clarification marker remains. Shariah, legal, regulatory, vendor, and owner
questions remain explicit decision or external gates.

## Verified Baseline

| Fact | Evidence | Confidence |
|---|---|---|
| 21 registered screens: 8 primary and 13 contextual | `app/app.js`, screen registrations, navigator map | High |
| 34 feature files and 35 navigator units because Home has no feature file | `app/features/`, `project/mcp/packages/ahd-navigator/` | High |
| 142 normative requirements | `spec.md` ID scan | High |
| Status distribution: 80 built, 8 decision-gated, 2 demo-only, 11 planned, 23 external-gated, 4 out-of-scope | `spec.md` | High |
| Full gate snapshot: 2,869 passed, zero failed | `cd tests && node run-all.cjs` | High; live command remains authority |
| Frozen demo and app engine parity are enforced | tripwire and `tests/app/engine-parity.cjs` | High |
| Local server has HMAC authentication and durable JSONL replay but no resource authorization | `server/auth.cjs`, `router.cjs`, `store.cjs` | High |
| Open-Witness verification is independent | verifier source boundary and tests | High |

## Decision 1: Preserve Four Trust Boundaries

**Decision**: Keep the frozen demo, offline product app, local demonstration service, and
independent verifier separate.

**Rationale**:

- The demo supplies the pinned logic source and stage fallback.
- The app proves additive, usable, offline product behavior.
- The local service proves server-side reuse of the same engine.
- The verifier proves integrity without trusting Ahd runtime code.

**Alternatives considered**:

- Merge demo and app: rejected because the frozen tripwire would block product evolution or be lost.
- Connect app to server: rejected because it would violate the current offline contract.
- Import the engine into the verifier: rejected because verification would become circular.

**Binding consequence**: Integration between these surfaces is evidence and parity, not runtime
coupling.

## Decision 2: Treat `BUILT` as an Evidence Claim

**Decision**: A requirement can be `BUILT` only when named executable or inspectable evidence proves
its acceptance criteria.

**Rationale**: The repository contains stale prose counts and older architecture statements. Code,
registries, focused tests, and the live gate are stronger authorities.

**Alternative considered**: Let product documents declare current state manually. Rejected because
manual counts have already drifted.

**Binding consequence**: DR-013 and DR-014 receive automated traceability and inventory-drift tasks
before feature expansion.

## Decision 3: Keep Current Identifiers Opaque

**Decision**: `AhdIdV1` is an opaque, case-sensitive, byte-preserved string. The current profiles do
not expose or require an identifier-generation algorithm. Future production generation is server-side
and versioned, but its internal scheme is not parsed by consumers.

**Rationale**: IDs are inside sealed canonical content. Retrofitting a ULID, UUIDv7, tenant prefix, or
version prefix would change seals. Time-ordered schemes also expose unnecessary metadata.

**Alternatives considered**:

- ULID: rejected as a public contract because time semantics become observable.
- UUIDv7: rejected for the same reason and because it does not solve current sealed compatibility.
- Custom Base32 ID: rejected because no current requirement justifies another canonical scheme.

**Binding consequence**: New APIs refer to `ahd_id` as opaque. A future generator is an internal
implementation behind a new unsealed or versioned contract.

## Decision 4: Bind the Current State Vocabulary to the Golden Reducer

**Decision**: The current machine state enum is:

```text
DRAFT
PENDING_CONSENT
WITNESSED
ACTIVE
SETTLING
KEPT
DEFAULTED
DISPUTED
ESCALATED
FORGIVEN
DECLINED
EXPIRED
VOID
```

Grace is `ACTIVE` plus `graced=true`. `RESCHEDULED` is a localized presentation label. Open-term
`PARTIAL` is a feature projection, not a golden lifecycle state.

**Rationale**: `app/engine.js` is the binding current reducer. Earlier prose that modeled `GRACE` as a
state conflicted with executable behavior and has been corrected.

**Alternative considered**: Promote `GRACE` or `RESCHEDULED` to a stored enum now. Rejected because it
would fork current behavior and risk a golden migration.

**Binding consequence**: Production agreements lock `state_machine_version`. Future reducer changes
create new projections or profiles and never reinterpret old events silently.

## Decision 5: Version Contracts Independently

**Decision**: Track these version axes separately:

```text
api_version
record_profile
canonicalization_profile
seal_profile
event_schema_version
state_machine_version
evidence_bundle_version
```

**Rationale**: Transport, semantics, canonical bytes, seals, and evidence can evolve at different
rates. One global version would either cause unnecessary breaks or hide incompatible changes.

**Alternative considered**: A single `v2` marker. Rejected because it cannot state what actually
changed and invites silent reinterpretation.

**Binding consequence**: Old verifiers remain available. Any canonical/seal change gets a new
profile and golden vectors. Transport idempotency metadata never enters sealed canonical content.

## Decision 6: Separate the Local API From Production API Design

**Decision**: Document the existing six-route API exactly as `DEMO-ONLY`. Do not use it as the base
production contract.

**Rationale**: It proves real HTTP, HMAC auth, durability, golden parity, and refusal of flagged terms,
but it has critical deliberate limits:

- authentication without record/action authorization;
- public `/list` exposing names and amounts;
- unversioned routes and decimal-SAR JSON numbers;
- no rate, request-size, depth, timeout, pagination, or concurrency limits;
- plaintext full snapshots and auth key in one local data area;
- no TLS, database transactions, migrations, backup policy, retention, revocation, PKI/TSA/HSM, or
  residency evidence.

A deterministic security probe showed that a token for an unrelated actor can create and seal an
agreement naming other people because handlers never receive an authorization decision.

**Alternative considered**: Gradually expose the local server as production. Rejected because the
demo contract's trust model and storage behavior are wrong for real obligations.

**Binding consequence**: Current server hardening may improve stage safety, but its lifecycle remains
`DEMO-ONLY`. Production work starts at versioned ports/adapters and deny-by-default authorization.

## Decision 7: Separate Authentication, Authorization, Consent, and Attestation

**Decision**: Model four distinct proofs:

1. authentication — who controls the active session;
2. authorization — whether that subject may perform this action on this resource;
3. consent — whether each affected party approved the exact content/action;
4. attestation — whether an approved external provider verifies identity, time, signature, payment,
   or bank operation.

**Rationale**: Conflating these concepts creates the current local-server authorization hole and can
turn an integrity proof into a false identity claim.

**Alternative considered**: Treat the HMAC actor or a `sig_ref` label as consent. Rejected because
neither binds all affected parties to exact content under an approved provider.

**Binding consequence**: Production mutations deny by default and require action-specific evidence.
Open verification is holder-supplied; record discovery is not public.

## Decision 8: Preserve the Golden Seal and Add External Attestations Around It

**Decision**: Do not alter the deterministic v1 seal. Future production evidence layers party
attestation references, a bank witness signature, and trusted time around a versioned attestation
digest.

**Recommended sequence**:

```text
canonical record
  -> deterministic golden seal
  -> exact-action party attestation references
  -> versioned evidence-attestation digest
  -> bank witness signature using approved HSM/KMS
  -> approved TSA token over that attestation digest
```

**Rationale**: The deterministic seal already proves covered-byte integrity. Identity, bank custody,
and accredited time are separate claims with separate failure and revocation semantics.

**Alternatives considered**:

- Replace v1 seal with PKI: rejected because it breaks golden compatibility and mixes integrity with
  external availability.
- Timestamp only terms hash: rejected because it does not bind the actual seal and later attestation
  references.
- Timestamp only the existing seal: better, but insufficient once party and bank attestations must be
  bound together.

**Binding consequence**: The project must resolve the current timestamp-target contradiction before
implementation. A later TSA token proves existence at its own time, never retroactive trusted time.

## Decision 9: Use Integer Money at New Contract Boundaries

**Decision**: New production write contracts accept bounded `amount_halalas` plus `currency: "SAR"`.
The current `amountSAR`/`amount_sar` fields remain v1 compatibility inputs only.

**Rationale**: Decimal JSON numbers, `Number(...)`, permissive `parseInt`, and scientific notation are
not acceptable monetary contracts.

**Alternative considered**: Standardize on decimal SAR strings. Rejected for the internal contract
because every operation would still need one exact conversion rule; integer halalas already match the
constitution and engine invariants.

**Binding consequence**: Decimal display is presentation only. Unsupported precision fails closed.

## Decision 10: Define Security Controls Before Selecting Production Vendors

**Decision**: Specify required control behavior and evidence without inventing provider names or
performance numbers.

**Threat-model methods**: STRIDE plus LINDDUN across client, identity provider, trust/signature provider,
API gateway, application service, event store, HSM/KMS, TSA, settlement rail, verifier, operators, logs,
and analytics.

**Required control families**:

- identity assurance;
- resource/action authorization;
- what-you-see-is-what-you-sign consent;
- replay protection and idempotency;
- non-enumerable verification;
- integer-money and schema validation;
- rate, body, depth, edge-count, timeout, and concurrency bounds;
- privacy-safe audit and monitoring;
- key separation, custody, rotation, and revocation;
- encryption and Saudi residency;
- retention, deletion, legal hold, and subject access;
- incident response, recovery, container, and supply-chain controls;
- linkability and non-repudiation privacy-harm analysis.

**Alternative considered**: Put guessed limits/provider choices in the master spec. Rejected because
load, pilot, legal, bank, and vendor evidence is absent.

**Binding consequence**: Contracts state fail-closed behavior and evidence needed to choose values.
Production startup fails when required controls are unconfigured.

## Decision 11: Use Data Policy Classes Without Guessing Retention Durations

**Decision**: Define policy classes now, but leave exact duration to counsel/regulatory approval:

| Class | Content | Current rule |
|---|---|---|
| R0 Ephemeral | Request bodies, temporary verification input, rate-limit state | Minimize and expire |
| R1 Rebuildable | Derived projections, caches, previews | Rebuild from authoritative evidence |
| R2 Sealed evidence | Canonical records, consents, seals, events | Retention/legal hold policy required |
| R3 Sensitive support | Hardship, dispute, reminders, export audit | Strict access and shorter justified policy required |
| R4 Aggregate/source | Privacy-safe metrics and citations | Licence, reproducibility, and privacy rules apply |
| R5 Security | Keys, tokens, revocation, key metadata | Separate custody and destruction policy |

**Rationale**: Exact periods would be legal guesses. Hashes and pseudonyms may remain linkable and are
not automatically anonymous.

**Alternative considered**: Choose a common financial-record duration. Rejected because Ahd's role,
evidence obligations, user rights, and legal holds have not been confirmed.

**Binding consequence**: Local JSONL is demo data only. No real obligation enters it.

## Decision 12: Protect the Shariah and Owner Boundary With Packets

**Decision**: D-1, D-3, D-6, D-7, and D-8 become review packets containing exact mechanic, actors,
money flow, conditions, cited sources, unresolved question, options, recommendation, test evidence,
and rollback/disable behavior. No AI answer closes a packet.

**Rationale**: These are not missing code. Implementing first would disguise an unresolved product or
Shariah choice.

**Alternative considered**: Select the safest-looking option autonomously. Rejected under the
constitution and project guide.

**Binding consequence**: Affected UI remains proposal/sketch/qualified or unavailable until attributable
approval is recorded.

## Decision 13: Generate Inventories and Traceability From Active Sources

**Decision**: Add structural checks that compare loaded app scripts, screen registration keys, feature
files, navigator units, master-spec inventory, and requirement-to-evidence mappings.

**Rationale**: Current contradictions include:

- `app/README.md` describing three screens and eight suites;
- `tests/README.md` describing nine app suites;
- old `docs/ARCHITECTURE.md` sections claiming no auth/health and optional socket smoke;
- navigator generator constants lagging current feature counts, empty `layers`, and weak `>=29` tests;
- server durability wording that can overstate atomicity.

**Alternative considered**: Periodic manual cleanup. Rejected because drift has recurred and the live
registries are machine-readable.

**Binding consequence**: The first implementation slice is a failing drift test and generator repair,
then documentation sync.

## Decision 14: Prioritize Stage Reliability Before External Integration

**Decision**: Before 18 July, prioritize truthful inventory, current fallbacks, full-gate reliability,
clear production boundaries, and rehearsal over new vendor integrations.

**Rationale**: External integration needs authority and can introduce demo risk. The current product
already demonstrates technical depth through determinism, parity, verification, server reuse, and
explicit refusal behavior.

**Alternative considered**: Mock additional production integrations for visual completeness. Rejected
because it would weaken evidence honesty and consume freeze time.

**Binding consequence**: Production adapter implementation starts only after the competition-critical
assurance lane and named approvals.

## Recommended Delivery Order

1. Add inventory and traceability drift tests.
2. Repair navigator generation metadata and living documentation.
3. Publish current surface, protocol, local API, and production-seam contracts.
4. Add a formal threat model and local-demo body/abuse safety tasks without changing lifecycle status.
5. Prepare D-1/D-3/D-6/D-7/D-8 and external-gate evidence packets.
6. Rehearse and freeze the judge path.
7. After the hackathon, select approved production adapters and implement them via TDD.

## Research Risks Carried Forward

| Risk | Status | Where controlled |
|---|---|---|
| Public local `/list` leaks all demo records if exposed | Known, demo-only | local API contract and hardening tasks |
| HMAC actor is not authorized against agreement parties | Known, demo-only | threat model and production authz contract |
| `server/data/` and key files can be accidentally committed | Known | immediate repository-hygiene task |
| TSA target differs across historical documents | Unresolved design gate | production-seam contract; must close before implementation |
| Docker loopback bind does not work like a normal published port | Known | documentation; no stage reliance without verification |
| Production retention and residency policy absent | External-gated | PR-007, PR-010, DR-015 |
| Current Shariah/commercial decisions absent | Decision-gated | D-1, D-3, D-6, D-7, D-8 |
| Graph includes archive noise | Known tooling issue | active-path verification and future graph refresh/exclusions |
