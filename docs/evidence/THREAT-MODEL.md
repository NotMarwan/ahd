# Ahd server threat model — route-level STRIDE/LINDDUN

**Status:** implementation-bound security model; not a production-security certification.  
**Applies to:** `server/http.cjs`, `server/router.cjs`, `server/auth.cjs`, `server/store.cjs`, and the standalone verifier.  
**Does not apply to:** the frozen presenter demo, browser app, a cloud deployment, or any unapproved identity/payment integration.

## Assets and trust boundaries

| Asset | Boundary | Required protection |
|---|---|---|
| Sealed record and `sealed_seal` | caller → HTTP binder → router → store | canonical data is verified before presentation; mutation is detectable |
| HMAC session key and bearer token | secret injection/storage → HTTP binder | never logged, embedded in client code, or added to a seal |
| Ed25519 demonstration key and proof | local protocol fixture → verifier | demonstration-only; never represented as a production key hierarchy |
| Append-only JSONL store | router → local filesystem | restricted process account, durable volume, backup/restore test |
| Client socket address | TCP peer → rate limiter | use `req.socket.remoteAddress`; do not trust forwarding headers on localhost |
| Presenter terminal and local browser | operator → local server | treat as an untrusted display environment; no secrets in scripts or screenshots |
| Future cloud edge | public client → TLS terminator → private service | authenticated proxy identity, TLS, rate-limit policy, redacted observability |

## Route inventory and controls

| Route | Purpose | Auth | Availability control | Main threats / current control |
|---|---|---|---|---|
| `POST /create-loan` | create draft record | HMAC bearer in live server | 30/min/socket | spoofed actor: HMAC; tampered input: handler validation; flood: fixed window |
| `POST /seal` | seal a draft | HMAC bearer in live server | 30/min/socket | replay/repeated request: store state rejects invalid transitions; tamper: recomputation proof |
| `POST /net` | calculate settlement | HMAC bearer in live server | 30/min/socket | expensive-input flood: fixed window; integrity: golden engine path |
| `POST /verify` | independently check a record | public | 120/min/socket | public DoS: fixed window; disclosure: response contains only requested record result |
| `GET /list` | list local server records | public in prototype | no current limit | privacy exposure before production: must become actor/tenant-authorized before any real-user use |
| `GET /health` | liveness signal | public | unlimited | no record data, token data, timestamp, or uptime metadata; safe for orchestrators |

## STRIDE review

| Threat | Surface | Current mitigation | Residual / production gate |
|---|---|---|---|
| Spoofing | mutating routes | HMAC bearer verification before handler | rotate keys; bind session issuance to approved identity provider |
| Tampering | record, seal, JSONL | golden seal verification; append-only write path; standalone verifier | encrypted durable store and signed audit retention are not yet deployed |
| Repudiation | create/seal/net actor | HMAC proves possession of a server-issued secret, not legal non-repudiation | approved identity + qualified signature/timestamp validation required |
| Information disclosure | `/list`, logs, terminal | local-only bind; no token in seal; no raw secret in normal response | tenant authorization, redacted logs, retention/deletion policy required |
| Denial of service | public `/verify`, mutating routes | deterministic fixed windows: 120/min and 30/min per socket; health exempt | process-local limiter is insufficient for multi-instance/cloud deployment |
| Elevation of privilege | headers/proxy/auth | socket address only; forwarded headers ignored; auth gate precedes handler | trusted-proxy allowlist only after a deployed ingress attests client identity |

## LINDDUN review

| Privacy threat | Surface | Current mitigation | Required before real-user pilot |
|---|---|---|---|
| Linkability | loan IDs, list results | local prototype scope; no analytics SDK | per-tenant authorization and minimised identifiers |
| Identifiability | lender/borrower fields | local-only demo data | data classification, minimisation, access review, deletion workflow |
| Non-repudiation | HMAC actor/token | token is operational authentication only, not a legal claim | validate identity/signature evidence with counsel and approved provider |
| Detectability | health and verification endpoints | `/health` returns only `{ok:true}`; verify is rate limited | edge-level abuse monitoring without retaining unnecessary client data |
| Disclosure | JSONL, terminal, backups | no demo keys in docs; local path documented | encryption at rest, scoped backups, redacted logs, restore drill |
| Unawareness | future consent/data handling | no claim that prototype has production consent workflow | plain-language notice and consent records before pilot |
| Non-compliance | Saudi data/financial ecosystem | validation packs define unanswered questions | legal, SAMA/custody, identity, and data-residency sign-offs |

## Security invariants and incident response

1. No secret, token, remote address, or rate-limit counter enters the canonical record or seal.
2. A client-supplied `X-Forwarded-For`/`Forwarded` header never changes a limiter bucket in the localhost binder.
3. A `429` is deterministic for an injected monotonic clock and includes an integer retry interval.
4. Health remains available during rate-limit exhaustion and contains no sensitive diagnostics.
5. Any suspected key exposure: stop presenter/server process, rotate injected HMAC key, preserve redacted evidence, and validate affected records through the independent verifier. Do not alter the frozen demo or rewrite historical seals.

## Explicit non-claims

- This document does not certify the localhost prototype for internet exposure, production custody, legal admissibility, or regulatory approval.
- The limiter is intentionally process-local. A cloud rollout must replace or coordinate it with a shared, trusted edge control.
- The prototype does not make decisions about people or loans; these controls protect service integrity and availability only.
