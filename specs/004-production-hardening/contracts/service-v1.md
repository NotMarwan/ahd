# Contract: Production Service v1

## Security envelope

- Private routes require an approved identity assertion mapped to an active principal.
- Authorization evaluates action, party role, record state, and explicit grants.
- Mutation routes require `Idempotency-Key` and `If-Match` record version.
- Rejections use stable reason codes and do not disclose unrelated record existence.
- Request bodies have route-specific byte and nesting limits.
- Public verification accepts only the minimum proof package.

## Route classes

| Class | Examples | Authorization | Rate policy |
|-------|----------|---------------|-------------|
| public-read | health, proof verification | none; minimized output | public-read |
| private-read | record, party ledger | record party or operator grant | private-read |
| mutation | create, seal, consent, settle | action-specific party role | mutation |
| operations | metrics, backup, audit | operator or auditor grant | operations |

## Mutation response

```json
{
  "record_id": "opaque-id",
  "version": 2,
  "status": "SEALED",
  "seal": "hex",
  "command_id": "opaque-id"
}
```

## Error contract

```json
{
  "error": "stable_reason_code",
  "correlation_id": "opaque-id",
  "retryable": false
}
```

No response includes secrets, raw identity-provider tokens, individual scores, or bank-lending fields.

