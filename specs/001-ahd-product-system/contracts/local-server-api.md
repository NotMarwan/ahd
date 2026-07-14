# Contract: Local Demonstration Server API

**Contract ID**: `ahd-local-demo-api-v0`

**Lifecycle**: `DEMO-ONLY`

**Base address**: `http://127.0.0.1:8225`

**Runtime**: Node built-ins only; localhost; no app dependency on this service

## Critical Boundary

This document describes the API that exists. It does not approve the API for internet exposure,
real obligations, production identity, or production storage. Authentication is present on mutation
routes; record-level authorization is not. The production API will be separately versioned.

## Authentication

Mutating routes require:

```http
Authorization: Bearer <payloadB64>.<hmacHex>
```

The HMAC token authenticates a local actor label and expiry. The router verifies the token but does
not pass an authorization decision to handlers. Any valid actor token can currently name unrelated
parties. This is acceptable only inside the controlled demonstration boundary and is a P0 risk if
exposed.

Public routes are `/verify`, `/list`, and `/health`. Public `/list` exposes all stored records and is
therefore prohibited as a production pattern.

## Routes

### `POST /create-loan`

Authentication: required.

Request:

```json
{
  "id": "NEW-1",
  "lender": "display name",
  "borrower": "display name",
  "amountSAR": 1200,
  "open": false,
  "months": 3,
  "start": { "y": 2026, "m": 7 },
  "timestamp": "2026-07-01T10:30:00+03:00",
  "purpose": "optional display text"
}
```

Required: string `id`, lender, borrower, and a positive coercible `amountSAR`. Scheduled agreements
require a positive integer month count when supplied. `MAIN` is reserved. Duplicate IDs return 409.

Success `201`:

```json
{
  "id": "NEW-1",
  "status": "DRAFT",
  "terms_ar": "derived Arabic terms",
  "riba": { "verdict": "clean" }
}
```

### `POST /seal`

Authentication: required.

Request:

```json
{ "id": "NEW-1" }
```

Success `200`:

```json
{
  "id": "NEW-1",
  "status": "WITNESSED",
  "seal": "64-hex",
  "canonical_hash": "64-hex",
  "statusAr": "localized derived label"
}
```

Re-sealing an already witnessed record returns the same evidence and `already: true`. Flagged terms
return 422 and are not sealed.

Implementation note: events include `ACTIVATED`, while the stored top-level status remains
`WITNESSED`. Consumers must not treat this demo field as the future canonical lifecycle projection.

### `POST /verify`

Authentication: public.

Request:

```json
{ "id": "MAIN", "amountSAR": 5000 }
```

Both fields are optional. Missing/`MAIN` ID verifies the frozen golden record. For a created record,
the ID must exist and be witnessed. `amountSAR` is a deliberate tamper input used by the stage proof.

Success `200`:

```json
{
  "id": "MAIN",
  "main": true,
  "ok": true,
  "sealed": "64-hex",
  "recomputed": "64-hex",
  "canonical_hash": "64-hex"
}
```

### `POST /net`

Authentication: required.

Request:

```json
{
  "edges": [
    { "from": "A", "to": "B", "amount": 100 }
  ]
}
```

`edges` is optional; omission runs the golden demonstration tangle.

Success `200`:

```json
{ "transfers": [], "count": 0 }
```

Actual transfers contain the golden engine's deterministic leg objects. This route proposes a
calculation; it does not move money.

### `GET /list`

Authentication: public in local demo only.

Success `200`:

```json
{
  "items": [
    {
      "id": "NEW-1",
      "lender": "display name",
      "borrower": "display name",
      "amountSAR": 1200,
      "status": "WITNESSED",
      "seal": "64-hex"
    }
  ],
  "count": 1
}
```

This is an enumeration and privacy leak outside a controlled fixture environment. There will be no
public production equivalent.

### `GET /health`

Authentication: public.

Success `200`:

```json
{ "ok": true }
```

The body is static and deterministic.

## Error Contract

| Status | Meaning | Examples |
|---:|---|---|
| 400 | Invalid local request | Missing fields, invalid JSON, reserved ID, invalid amount/months |
| 401 | Missing, malformed, invalid, or expired HMAC token | Mutating routes only |
| 404 | Unknown route or loan ID | Route/record lookup |
| 409 | State conflict | Duplicate ID or verification before seal |
| 422 | On-spine refusal | Riba-linter verdict is not clean |

Responses use JSON. Error text is demonstration-oriented and is not a stable production localization
or information-disclosure contract.

## Persistence Contract

- With a data directory, every `putLoan` appends a complete JSONL `PUT` snapshot and calls fsync.
- Replay uses last valid record per ID.
- A malformed/torn line is skipped.
- This provides durable append plus torn-tail-tolerant replay, not transactional atomicity.
- There is no encryption, authenticated replay, multi-process concurrency control, compaction,
  migration, backup, retention, deletion, legal hold, or subject-access workflow.
- The auth key and record data currently share the local data directory.

## Missing Internet Controls

The current binder has no TLS, reverse proxy, authorization, request-body limit, JSON-depth limit,
string/edge limit, rate limit, connection limit, timeout policy, pagination, record-scoped query,
idempotency key, token revocation, audit trail, monitoring, secret manager, real database, or Saudi
residency evidence. The Docker image remains an unverified convenience and binds loopback only.

## Production Prohibitions

- Do not expose `server/http.cjs` to the internet.
- Do not store real personal obligations in `server/data/`.
- Do not copy public `/list` into a future API.
- Do not treat HMAC actor authentication as party authorization or consent.
- Do not reuse decimal `amountSAR` as the production money contract.
- Do not describe the JSONL snapshots as an event-sourced production database.
- Do not mark FR-047 through FR-050 or PR-001 through PR-015 complete because this server runs.

## Verification

```powershell
node server/demo-bank-node.cjs
node server/smoke-live.cjs
cd tests
node app/server-parity.test.cjs
node app/server-auth.test.cjs
node app/server-persistence.test.cjs
node app/server-health.test.cjs
node run-all.cjs
```
