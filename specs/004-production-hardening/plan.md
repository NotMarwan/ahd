# Implementation Plan: Production Hardening

**Branch**: `judge-lens-real-leap` | **Date**: 2026-07-14 | **Spec**: [spec.md](spec.md)

## Summary

Preserve the golden engine behind an adapter while adding production authorization, transactional event
storage, idempotency, concurrency control, abuse limits, structured audit, privacy controls, backup/restore,
release health, and TLS deployment. All new dependencies and providers require recorded approval first.

## Technical Context

**Language/Version**: Node.js 20.11.1+ CommonJS  
**Primary Dependencies**: Proposed PostgreSQL 16 and pinned `pg` client after D-PROD-1 approval; Node built-ins otherwise  
**Storage**: PostgreSQL append-only events and authorization tables; encrypted backups  
**Testing**: Node unit/contract/integration tests, real HTTP smoke, concurrency, recovery, security probes  
**Target Platform**: Linux container, non-root, KSA-region hosting behind TLS after provider approval  
**Project Type**: Web service plus operational tooling  
**Performance Goals**: Core actions visibly complete within 2 seconds at pilot load; health checks under 1 second  
**Constraints**: No golden reimplementation; integer halalas; deterministic business logic; no public exposure before security gate  
**Scale/Scope**: Pilot-scale production service, one primary region, recoverable event history

## Constitution Check

- [x] Server remains witness/seal/settle infrastructure; no lending, judging, fee-on-loan, or scoring.
- [x] Frozen demo and golden engine imported unchanged.
- [x] Deterministic business outputs and integer money preserved; operational timestamps stay outside hashes.
- [x] TDD, full gate, adversarial probes, and recovery tests planned.
- [x] Judge work is unaffected; deployment starts after freeze.
- [x] New dependencies, providers, migrations, and public exposure require owner approval.

## Project Structure

```text
server/
├── auth.cjs
├── authorization.cjs
├── rate-limit.cjs
├── request-limits.cjs
├── idempotency.cjs
├── audit.cjs
├── observability.cjs
├── store.cjs
├── store-postgres.cjs
├── migrations/
├── http.cjs
└── runbooks/
tests/app/
├── server-authorization.test.cjs
├── server-rate-limit.test.cjs
├── server-idempotency.test.cjs
├── server-concurrency.test.cjs
├── server-recovery.test.cjs
├── server-privacy.test.cjs
└── server-operations.test.cjs
deploy/
├── Dockerfile
├── compose.pilot.yml
└── README.md
docs/security/
├── threat-model.md
├── privacy-model.md
└── incident-response.md
```

**Structure Decision**: Keep pure route handlers and golden adapter. Add explicit middleware-like modules by
responsibility. Preserve the JSONL store for demo use; production selects the transactional adapter explicitly.

## Phase 0 Research

See [research.md](research.md). Recommended choices are PostgreSQL transactional event storage, role and
party authorization, database-backed idempotency, deterministic fixed-window limits, structured JSON audit,
container deployment behind provider-managed TLS, and explicit KSA residency. Each external choice is a gate.

## Phase 1 Design

- Data model: [data-model.md](data-model.md)
- API/security contract: [contracts/service-v1.md](contracts/service-v1.md)
- Validation: [quickstart.md](quickstart.md)

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| New PostgreSQL adapter | Transactional concurrency, idempotency, backup, and recovery | JSONL cannot provide multi-process locking or transactional constraints |
| Hosted TLS boundary | Required before external exposure | Bare localhost HTTP is explicitly demo-only |

Both require explicit dependency/provider approval before implementation.

