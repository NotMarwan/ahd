---
description: "Dependency-ordered production hardening work"
---

# Tasks: Production Hardening

## Phase 1: Setup and Decision Gates

- [ ] T001 Record `D-PROD-1` dependency approval for PostgreSQL 16 and pinned `pg` client in `docs/DECISIONS-FOR-MARWAN.md`
- [ ] T002 Record hosting, KSA residency, TLS, identity-provider, backup, and secret-custody gates in `docs/DECISIONS-FOR-MARWAN.md`
- [ ] T003 Confirm competition freeze is complete and create a separate production branch or worktree before code changes

## Phase 2: Foundational Threat and Test Harness

- [ ] T004 [P] Write STRIDE and LINDDUN threat inventory with assets, boundaries, threats, mitigations, residuals, and owners in `docs/security/threat-model.md`
- [ ] T005 [P] Write privacy data-flow, retention, deletion, export, and incident rules in `docs/security/privacy-model.md`
- [ ] T006 [P] Add reusable fixed-clock, authenticated-principal, and isolated-store fixtures in `tests/app/helpers/server-fixtures.cjs`
- [ ] T007 Run the existing server suites and full gate to pin pre-hardening behavior before implementation

## Phase 3: User Story 1 - Authorized Access (P1)

**Independent Test**: Authorization matrix passes owned, counterparty, unrelated, revoked, and expired cases.

- [ ] T008 [P] [US1] Write failing authorization matrix tests in `tests/app/server-authorization.test.cjs`
- [ ] T009 [P] [US1] Write failing public-proof minimization tests in `tests/app/server-privacy.test.cjs`
- [ ] T010 [US1] Implement principal, party, action, state, and grant evaluation in `server/authorization.cjs`
- [ ] T011 [US1] Integrate authorization into `server/router.cjs` and `server/handlers.cjs` without modifying seal or netting code
- [ ] T012 [US1] Minimize public verification responses in `server/handlers.cjs` until T009 passes
- [ ] T013 [US1] Run focused authorization/privacy tests and confirm forged, unrelated, revoked, and enumeration probes fail safely

## Phase 4: User Story 2 - Durable Recovery (P1)

**Independent Test**: Restart, retry, concurrency, backup, and restore preserve one ordered logical history.

- [ ] T014 [P] [US2] Write failing idempotency and conflicting-key tests in `tests/app/server-idempotency.test.cjs`
- [ ] T015 [P] [US2] Write failing multi-process version-conflict tests in `tests/app/server-concurrency.test.cjs`
- [ ] T016 [P] [US2] Write failing restart, backup, truncated-write, and restore tests in `tests/app/server-recovery.test.cjs`
- [ ] T017 [US2] Add versioned database migrations under `server/migrations/` for principals, parties, commands, events, audit, limits, and backup metadata
- [ ] T018 [US2] Implement transactional event append and replay in `server/store-postgres.cjs` behind the existing store interface
- [ ] T019 [US2] Implement idempotency receipts and payload-conflict rejection in `server/idempotency.cjs`
- [ ] T020 [US2] Add optimistic record versions to mutation handling in `server/router.cjs`
- [ ] T021 [US2] Add backup, restore, and integrity verification commands under `server/runbooks/` and make T016 pass
- [ ] T022 [US2] Retain `server/store.cjs` as explicit demo storage; select production adapter only through approved configuration

## Phase 5: User Story 3 - Abuse Containment (P1)

**Independent Test**: Abuse suite causes zero unauthorized state changes and records minimal audit evidence.

- [ ] T023 [P] [US3] Write failing fixed-window route-limit tests with injected clock in `tests/app/server-rate-limit.test.cjs`
- [ ] T024 [P] [US3] Write failing byte, nesting, malformed JSON, and timeout tests in `tests/app/server-request-limits.test.cjs`
- [ ] T025 [P] [US3] Write failing secret-redaction and audit-chain tests in `tests/app/server-audit.test.cjs`
- [ ] T026 [US3] Implement deterministic fixed-window policies in `server/rate-limit.cjs`
- [ ] T027 [US3] Implement route-specific body, nesting, parsing, and timeout guards in `server/request-limits.cjs`
- [ ] T028 [US3] Implement minimal chained JSON audit events in `server/audit.cjs` without record payloads or secrets
- [ ] T029 [US3] Wire abuse guards before mutations in `server/http.cjs` and verify focused suites pass
- [ ] T030 [US3] Update `docs/security/threat-model.md` with test evidence and remaining external risks

## Phase 6: User Story 4 - Safe Operations (P2)

**Independent Test**: Isolated deployment supports health, smoke, rotation, restore, and rollback procedures.

- [ ] T031 [P] [US4] Write failing health, readiness, parity, structured-log, and shutdown tests in `tests/app/server-operations.test.cjs`
- [ ] T032 [US4] Implement readiness, correlation, metrics summary, and graceful shutdown in `server/observability.cjs` and `server/http.cjs`
- [ ] T033 [US4] Harden `server/Dockerfile`, `.dockerignore`, and `deploy/compose.pilot.yml` for pinned non-root, read-only filesystem, tmpfs, healthcheck, and mounted secrets
- [ ] T034 [US4] Document deploy, rollback, backup, restore, secret rotation, and incident response in `server/runbooks/` and `docs/security/incident-response.md`
- [ ] T035 [US4] Deploy to an approved isolated KSA-region environment behind TLS and store evidence in `deploy/README.md`
- [ ] T036 [US4] Execute rollback, restore, and secret-rotation drills; attach timings and outcomes to `deploy/README.md`

## Final Phase: Production Gate

- [ ] T037 Run all focused security/recovery suites, `node server/smoke-live.cjs`, and `cd tests && node run-all.cjs`
- [ ] T038 Perform independent security review; block exposure on any unresolved critical finding
- [ ] T039 Update `docs/ARCHITECTURE.md`, `docs/evidence/PATH-TO-PRODUCTION.md`, `_meta/OPEN-ITEMS.md`, `_meta/STATUS.md`, and `AmadHackathon/` cockpit with exact built/not-built state
- [ ] T040 Obtain named operator approval before production data migration or public exposure

## Dependencies

- T001-T003 block every dependency, provider, and migration action.
- T004-T007 establish acceptance baseline.
- US1 authorization precedes private production use.
- US2 and US3 may proceed in parallel after shared fixtures, but overlap in router/http files requires ownership sequencing.
- US4 requires US1-US3 green.
- T037-T040 block public exposure.
