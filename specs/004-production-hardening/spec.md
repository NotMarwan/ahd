# Feature Specification: Production Hardening

**Feature Branch**: `judge-lens-real-leap`  
**Created**: 2026-07-14  
**Status**: Ready for planning  
**Input**: Convert the localhost proof slice into a secure, durable, observable, recoverable service.

## Ahd Constitution Constraints

- Production infrastructure never adds lending, judging, penalties, scoring, or AI rulings.
- The frozen demo and golden engine remain unchanged; server behavior consumes the existing engine.
- Money remains integer halalas and business outcomes remain deterministic.
- External dependencies, hosted services, identity providers, and irreversible migrations need approval.
- Security and privacy claims require adversarial verification and operational evidence.

## User Scenarios & Testing

### User Story 1 - Access Only Authorized Records (Priority: P1)

As a lender, borrower, or authorized operator, I can perform only permitted actions on records I am
entitled to access, while public verification reveals no private record content.

**Why this priority**: Current proof authentication does not provide production authorization or privacy.

**Independent Test**: Exercise every role and endpoint against owned, counterparty, unrelated, revoked,
expired, and tampered credentials.

**Acceptance Scenarios**:

1. **Given** an unrelated authenticated user, **When** a private record is requested, **Then** access is denied
   without revealing whether the record exists.
2. **Given** a public verification artifact, **When** it is verified, **Then** integrity is confirmed without
   exposing private parties or terms.

### User Story 2 - Survive Failure Without Losing State (Priority: P1)

As operator, I can restart, deploy, back up, restore, and recover the service without losing acknowledged
events or corrupting sealed history.

**Independent Test**: Inject process termination, concurrent writes, duplicate requests, truncated writes,
storage loss, and restore operations; verify state and seals afterward.

**Acceptance Scenarios**:

1. **Given** an acknowledged sealed record, **When** the service restarts, **Then** the record and seal remain intact.
2. **Given** a repeated request, **When** the same idempotency identity is supplied, **Then** one logical event exists.

### User Story 3 - Detect and Contain Abuse (Priority: P1)

As security operator, I can detect rate abuse, oversized requests, credential misuse, repudiation attempts,
and privacy threats, then contain them without changing financial state.

**Independent Test**: Run the formal abuse suite and verify limits, audit evidence, alerts, and safe failure modes.

**Acceptance Scenarios**:

1. **Given** repeated mutating requests beyond policy, **When** the threshold is exceeded, **Then** further writes
   are rejected consistently without affecting existing records.
2. **Given** a security event, **When** it is audited, **Then** the record contains no secret or unnecessary personal data.

### User Story 4 - Deploy and Operate Safely (Priority: P2)

As platform operator, I can deploy a pinned build behind encrypted transport, observe health and service
levels, rotate secrets, and roll back using documented procedures.

**Independent Test**: Deploy to an isolated environment, run smoke and failure tests, rotate a credential,
restore a backup, and roll back to the prior release.

**Acceptance Scenarios**:

1. **Given** a new release, **When** health or parity checks fail, **Then** rollout stops and rollback is available.
2. **Given** a secret rotation, **When** the overlap window ends, **Then** old credentials fail and active records remain valid.

### Edge Cases

- Two processes write the same record concurrently.
- A client retries after the server committed but before receiving the response.
- A request body is large, malformed, or deeply nested.
- A token is valid but the party relationship changed.
- Backup contains valid data but an older schema.
- Audit logging fails while a mutating request is in progress.
- Network time is unavailable while deterministic record logic runs.

## Requirements

### Functional Requirements

- **FR-001**: Every private operation MUST enforce authenticated party and role authorization.
- **FR-002**: Public verification MUST disclose only the minimum artifact required for integrity checking.
- **FR-003**: Mutating requests MUST support idempotency and conflict detection.
- **FR-004**: Acknowledged events MUST survive process restart and storage replay.
- **FR-005**: Concurrent writers MUST NOT create duplicate or contradictory state transitions.
- **FR-006**: The service MUST enforce request size, structure, rate, and timeout limits.
- **FR-007**: Security and privacy threats MUST be documented with mitigations, owners, and residual risk.
- **FR-008**: Audit records MUST be tamper-evident, access-controlled, and free of secrets.
- **FR-009**: Backup and restore MUST preserve seals, ordering, and authorization state.
- **FR-010**: Deployment MUST use encrypted transport, least privilege, non-root execution, and protected secrets.
- **FR-011**: Health, readiness, parity, error, and capacity signals MUST be observable.
- **FR-012**: Release rollout MUST stop on failed health, parity, migration, or recovery checks.
- **FR-013**: External services and dependencies MUST have approval, fallback, and exit plans.
- **FR-014**: Business logic MUST continue to reuse the golden engine without reimplementation.
- **FR-015**: Privacy retention, deletion, export, and incident handling MUST be documented and testable.
- **FR-016**: Operational procedures MUST cover deploy, rollback, backup, restore, rotation, and incident response.

### Key Entities

- **Principal**: Authenticated person or service, roles, party relationships, status, and credential state.
- **Authorization Grant**: Principal, record scope, allowed actions, conditions, issuance, and revocation.
- **Idempotent Command**: Request identity, actor, payload digest, result, and conflict status.
- **Durable Event**: Ordered state transition, record reference, actor, integrity proof, and commit state.
- **Audit Event**: Security-relevant action, outcome, minimal context, and integrity linkage.
- **Release**: Build identity, configuration, migration, health evidence, and rollback target.
- **Backup Set**: Scope, schema, integrity evidence, retention, restore test, and recovery point.

## Success Criteria

### Measurable Outcomes

- **SC-001**: The authorization matrix passes 100% of owned, counterparty, unrelated, revoked, and expired cases.
- **SC-002**: Restart and replay recover 100% of acknowledged events with identical seals.
- **SC-003**: Concurrent and retried writes produce zero duplicate logical events in the acceptance suite.
- **SC-004**: Abuse tests produce zero unauthorized state changes.
- **SC-005**: Formal threat review has zero unresolved critical findings before production exposure.
- **SC-006**: Backup restore meets a 15-minute recovery-point objective and 60-minute recovery-time objective.
- **SC-007**: A failed rollout returns to the prior healthy release in under 10 minutes.
- **SC-008**: Operational smoke, parity, health, and recovery checks run automatically for every release.

## Assumptions

- Production technology selection occurs only after dependency and hosting approval.
- Nafath, accredited timestamping, and hardware key custody remain external gates.
- A localhost demonstration may remain available separately from production infrastructure.
- Production hardening begins after the competition freeze unless a stage-critical vulnerability is found.

