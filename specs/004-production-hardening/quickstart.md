# Quickstart: Production Hardening

## Approval gates

Before installing dependencies or creating external resources, record approval for database/client,
hosting region, TLS boundary, identity provider, backup location, and secret custody.

## Focused validation

```powershell
node tests/app/server-authorization.test.cjs
node tests/app/server-rate-limit.test.cjs
node tests/app/server-idempotency.test.cjs
node tests/app/server-concurrency.test.cjs
node tests/app/server-recovery.test.cjs
node tests/app/server-privacy.test.cjs
node tests/app/server-operations.test.cjs
```

## Full validation

```powershell
node server/smoke-live.cjs
Set-Location tests
node run-all.cjs
```

## Operational acceptance

1. Deploy isolated release behind TLS.
2. Run authorization and abuse probes.
3. Kill process during writes; verify committed-state recovery.
4. Back up, destroy isolated data, and restore.
5. Rotate credential and secret material.
6. Trigger failed rollout and complete rollback.
7. Confirm no critical threat-model finding remains before public exposure.

