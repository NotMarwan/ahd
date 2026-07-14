# Data Model: Production Hardening

## Principal

- `principal_id`: opaque internal identifier
- `identity_provider`: approved issuer
- `provider_subject_hash`: privacy-preserving stable reference
- `status`: active, suspended, revoked
- `roles`: participant, operator, auditor, service
- `created_at`, `revoked_at`: operational timestamps outside canonical record hashes

## RecordParty

- `record_id`: Ahd record identifier
- `principal_id`: linked principal
- `party_role`: lender, borrower, witness, authorized-operator
- `valid_from`, `valid_to`: authorization interval
- Unique constraint: one active principal/role relation per record

## CommandReceipt

- `principal_id`, `idempotency_key`: composite unique key
- `payload_digest`: detects conflicting reuse
- `record_id`, `record_version`: target and expected version
- `status`: started, committed, rejected
- `response_status`, `response_body_digest`: stable replay result

## DurableEvent

- `event_id`: ordered immutable identifier
- `record_id`, `record_version`: unique monotonic pair
- `event_type`: allowed state transition
- `payload`: validated integer-money event
- `actor_id`: authorized principal
- `canonical_hash`, `seal`: integrity evidence
- `committed_at`: operational timestamp outside canonical payload

## AuditEvent

- `audit_id`, `correlation_id`: trace identifiers
- `principal_id_hash`: minimized actor reference
- `action`, `resource_class`, `outcome`, `reason_code`
- `previous_audit_hash`, `audit_hash`: tamper-evident link
- No tokens, secrets, full terms, or unnecessary party data

## RateWindow

- `scope_key`: principal, IP, or service class hash
- `route_class`: public-read, private-read, mutation, authentication
- `window_start`, `count`: operational limit state
- Unique constraint: scope/route/window

## BackupRecord

- `backup_id`, `schema_version`, `created_at`
- `event_high_watermark`, `integrity_digest`
- `encrypted_location`, `retention_class`
- `restore_tested_at`, `restore_result`

