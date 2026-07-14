# Feature Specification: V2 Product and Protocol

**Feature Branch**: `judge-lens-real-leap`  
**Created**: 2026-07-14  
**Status**: Ready for planning  
**Input**: Deliver approved deferred product mechanisms, complete the seal protocol, and prepare mobile use.

## Ahd Constitution Constraints

- Every Shariah-adjacent mechanism remains disabled until its exact decision gate is approved.
- The frozen demo and golden engine remain unchanged unless a separately approved migration executes `OT-PATCH`.
- Protocol extensions are additive and independently verifiable.
- No feature may create interest, penalty, bank lending, dispute judgment, credit scoring, or AI fatwa.
- Mobile and analytics preserve integer money, deterministic logic, privacy floors, and claim labels.

## User Scenarios & Testing

### User Story 1 - Verify a Complete Open Seal (Priority: P1)

As an independent verifier, I can validate canonical content, chain continuity, timestamp evidence, issuer
signature, and Merkle inclusion without importing Ahd application code or trusting a central registry.

**Why this priority**: It completes the protocol moat while preserving issuer-independent verification.

**Independent Test**: Verify valid and separately tampered fixtures for each property using the reference
verifier in an isolated environment.

**Acceptance Scenarios**:

1. **Given** a complete valid proof package, **When** independent verification runs, **Then** all five properties pass.
2. **Given** one property is tampered, **When** verification runs, **Then** the failing property is localized precisely.

### User Story 2 - Use Approved Protective Mechanisms (Priority: P1)

As borrower, lender, or Circle member, I can use only approved deferred features: hardship protection,
borrower-requested release, safe Circle funding, duress reporting, and collusion safeguards.

**Independent Test**: Enable each mechanism separately after its approval artifact exists and verify its
state, consent, evidence, conservation, privacy, and rollback behavior.

**Acceptance Scenarios**:

1. **Given** no approval artifact, **When** a gated mechanism is requested, **Then** no state or money changes.
2. **Given** valid approval and consent, **When** the mechanism executes, **Then** original principal,
   conservation, neutral evidence, and non-judgment boundaries remain intact.

### User Story 3 - Use Ahd on Mobile (Priority: P2)

As a Saudi mobile user, I can complete the core request, create, verify, ledger, grace, and settlement
journeys with the same deterministic outcomes and Arabic-first design as the web product.

**Independent Test**: Run the mapped core journeys on supported iOS and Android devices and compare seals,
money totals, labels, accessibility, and offline fallback with the web baseline.

**Acceptance Scenarios**:

1. **Given** the approved baseline, **When** the same record is created on web and mobile, **Then** canonical
   output and seal match.
2. **Given** a small mobile screen, **When** the core journey runs, **Then** Arabic content remains readable
   and every required action remains reachable.

### User Story 4 - Govern an Interoperable Standard (Priority: P2)

As another issuer or implementer, I can adopt a versioned, licensed Open-Witness specification, exchange
fixtures, and verify conformance without Ahd-specific code.

**Independent Test**: A second implementation produces a fixture accepted by the reference verifier and
accepts Ahd's fixture under the same published conformance rules.

**Acceptance Scenarios**:

1. **Given** a supported protocol version, **When** two issuers exchange fixtures, **Then** both independently verify.
2. **Given** an incompatible future version, **When** verification runs, **Then** it fails clearly without silently downgrading.

### Edge Cases

- Timestamp provider is unavailable or returns an invalid token.
- Production signing key is rotated, revoked, or compromised.
- Scholar approval adds conditions not represented by the proposed state model.
- Circle funding approval permits pledges but not custody.
- A duress report is malicious, disputed, or later withdrawn.
- Identity format changes while old records remain verifiable.
- Mobile is offline during signing or external identity confirmation.
- Two protocol versions use different canonical fields.

## Requirements

### Functional Requirements

- **FR-001**: The protocol MUST verify canonical content, multi-block continuity, trusted time evidence,
  issuer signature, and Merkle inclusion as separate properties.
- **FR-002**: The independent verifier MUST NOT import Ahd application, demo, or engine code.
- **FR-003**: Protocol fixtures MUST include valid and property-specific tampered cases.
- **FR-004**: Timestamp and issuer-key production use MUST remain gated by accredited providers and key custody.
- **FR-005**: Every deferred product mechanism MUST require its named approval artifact before enablement.
- **FR-006**: Mercy-first settlement MUST preserve original amounts and require the approved consent rule.
- **FR-007**: Circle mode B MUST implement only the approved custody or pledge model.
- **FR-008**: Borrower-invokable release MUST not forgive lender rights without the approved consent model.
- **FR-009**: Duress and collusion safeguards MUST record signals and protective holds without judging guilt.
- **FR-010**: A canonical identifier format and binding state vocabulary MUST support old-record migration.
- **FR-011**: Any golden-engine migration MUST execute as a separate approved compatibility project.
- **FR-012**: Core mobile journeys MUST reproduce web canonical outputs and integer money totals.
- **FR-013**: Mobile design MUST use the approved baseline, Arabic accessibility, and offline-safe flows.
- **FR-014**: Open-Witness MUST publish versioning, license, governance, conformance, and security considerations.
- **FR-015**: Multi-issuer interoperability MUST be proven by two independent implementations.
- **FR-016**: Advanced analytics MUST remain aggregate, anonymity-protected, and free of individual scores.
- **FR-017**: Decision identifiers MUST be unique; the current collision around `D-4` MUST be resolved before execution.
- **FR-018**: Every v2 feature MUST include rollback, migration, and backward-verification behavior.

### Key Entities

- **Seal Proof Package**: Canonical record, chain proofs, time evidence, issuer proof, Merkle proof, and version.
- **Protocol Version**: Schema, canonical rules, algorithms, compatibility, governance, and lifecycle.
- **Approval Artifact**: Authority, exact question, answer, conditions, date, and permitted behavior.
- **Protective Hold**: Record, reason category, consent, evidence boundary, state, and resolution path.
- **Canonical Identity**: Identifier, type, issuer, lifecycle, migration mapping, and privacy classification.
- **Conformance Result**: Implementation, fixture, properties tested, outcome, and incompatibilities.
- **Mobile Journey Baseline**: Screen mapping, inputs, expected state, seal, accessibility, and fallback.

## Success Criteria

### Measurable Outcomes

- **SC-001**: The independent verifier passes every valid fixture and rejects every property-specific tamper.
- **SC-002**: Two independent implementations exchange and verify at least three conforming records each.
- **SC-003**: 100% of gated mechanisms remain inert without their approval artifact.
- **SC-004**: Approved protective mechanisms preserve exact principal conservation in all acceptance cases.
- **SC-005**: Old records remain verifiable after identifier, state, or protocol migration.
- **SC-006**: Core web and mobile journeys produce identical canonical outputs and seals.
- **SC-007**: Supported mobile journeys pass accessibility checks on one iOS and one Android device class.
- **SC-008**: Protocol governance documents contain zero unresolved ownership, license, or compatibility placeholders.

## Assumptions

- Accredited timestamping, hardware key custody, and external identity confirmation require vendor agreements.
- The existing four-property demo work remains a prototype until production credentials exist.
- Figma baseline transfer precedes mobile implementation; V2 visual redesign follows parity.
- Closed historical backlog items are verified for regression but are not rebuilt.

