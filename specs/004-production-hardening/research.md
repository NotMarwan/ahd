# Research: Production Hardening

## Decision: PostgreSQL event store after approval

**Rationale**: Transactional append, uniqueness, authorization joins, migrations, backups, and concurrency are
required for production. The current JSONL log remains ideal for deterministic demos, not multiple processes.  
**Alternatives considered**: Extend JSONL locks; SQLite; document database. Rejected for operational or
concurrency fit. Dependency gate: `D-PROD-1`.

## Decision: Party-and-role authorization

**Rationale**: Authentication alone proves a token, not entitlement to a record. Authorization must combine
principal status, party relationship, action, record state, and explicit operator grants.  
**Alternatives considered**: Global authenticated access; endpoint-only roles. Rejected as insufficient.

## Decision: Database-backed idempotency and optimistic versioning

**Rationale**: Clients retry after uncertain responses. Unique actor/key constraints return the original result;
record versions reject stale concurrent transitions.  
**Alternatives considered**: In-memory cache; ID-only conflict check. Rejected across restarts and multi-process use.

## Decision: Deterministic fixed-window abuse limit

**Rationale**: The policy is easy to test with an injected clock, stores no money state, and can use the shared
database in production.  
**Alternatives considered**: Token bucket; external Redis service. Rejected initially for complexity/dependency.

## Decision: Structured minimal audit and metrics

**Rationale**: Security events need correlation and integrity without secrets or full record payloads. Basic JSON
logs and health metrics avoid a mandatory telemetry dependency; exporters can be added later.  
**Alternatives considered**: Full OpenTelemetry stack immediately. Deferred until provider approval.

## Decision: Provider-managed TLS in a KSA region

**Rationale**: Public exposure requires TLS, secret management, backups, and residency review. Container config
alone is not deployment proof.  
**Alternatives considered**: Direct Node TLS; public localhost tunnel. Rejected for production.

