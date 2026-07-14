# Cloud/TLS deployment profile — future production baseline

**Status:** design profile only. Current server remains localhost-only and is not a cloud deployment.

## Required architecture

1. Public DNS terminates TLS at an approved ingress/load balancer; service-to-service traffic is authenticated and encrypted.
2. Application instances run private; only the TLS ingress can reach them. Do not expose Node directly to the internet.
3. HMAC keys, database credentials, and provider credentials are injected from a managed secret service at runtime. Never build them into image layers, environment dumps, fixtures, logs, or presenter scripts.
4. Durable records use an approved, encrypted, in-Kingdom storage service with least-privilege service identity and documented retention/deletion controls.
5. Rate limits move to a shared trusted-edge/store control. Client identity may use a forwarded address only when the ingress strips external headers and writes a verified replacement.
6. `/health` stays minimal and unauthenticated for liveness. A separate authenticated readiness/diagnostic endpoint is required before production; do not add secrets or storage details to `/health`.

## Operational controls

| Control | Baseline |
|---|---|
| HMAC/session key | managed-secret injection, rotation runbook, revoke/rotate after suspected exposure |
| TLS | modern approved policy, certificate renewal alarm, no plaintext public listener |
| Storage | append durability verified against chosen store, encryption at rest, restricted backups |
| Backup/restore | encrypted backup, restore drill to isolated environment, integrity verification using independent verifier |
| Logging | structured, access-controlled, redacted; exclude bearer tokens, secrets, raw sensitive bodies, and full identity attributes |
| Rate limiting | shared route policy: mutating 30/min/client, `/verify` 120/min/client, health unlimited; alert on sustained 429s |
| Monitoring | health, error rate, limiter rejects, storage durability failures, certificate expiry, backup/restore status |
| Incident response | contain, rotate keys, preserve redacted evidence, validate records independently, notify per approved legal/privacy process |

## Promotion gates

- External validation packs completed for legal, Shariah, custody/payment, identity provider, and timestamp provider as applicable.
- Threat-model residuals accepted by accountable owners; data residency and retention controls evidenced.
- Load, backup/restore, secret-rotation, TLS-renewal, and multi-instance rate-limit tests pass in the target environment.
- No production/demo key reuse. No claim of cloud readiness before these gates are evidenced.
