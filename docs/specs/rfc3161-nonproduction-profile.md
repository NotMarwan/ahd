# RFC 3161 timestamp profile — non-production interoperability only

**Status:** proposed test profile. It is not connected to the demo, app, live localhost server, or current seal-validity decision.

## Scope and invariant

A timestamp token is an additive external receipt created **after** the existing golden `sealBlock` result. The timestamp request never changes the canonical object, `sealed_seal`, chain fixture, or independent verifier’s current validity result.

## Message imprint

1. Produce `sealed_seal` with the existing engine/protocol path.
2. Canonical timestamp input is UTF-8 bytes of its lowercase, 64-character hexadecimal string; no prefix, newline, JSON wrapper, actor, remote address, or token.
3. Compute `SHA-256` of those UTF-8 bytes.
4. Send that digest as RFC 3161 `messageImprint` with SHA-256 algorithm identifier.
5. Store response as a detached timestamp envelope: `record_id`, `sealed_seal`, `imprint_algorithm`, `imprint_hex`, `tsa_url_identifier`, `token_der_base64`, and `verification_status`.

The stored `record_id` is lookup metadata only; verification binds the response to `sealed_seal` through the stated imprint, never through metadata.

## Test procedure

1. Use a provider-designated non-production endpoint and non-production credentials delivered through environment injection.
2. Submit one known seal, retain the raw request/response fixture outside demo assets, and verify: token signature, message imprint equality, TSA certificate chain, policy OID, nonce behavior, and returned generation time.
3. Repeat with a one-character altered seal. Verification must reject the token/seal pairing.
4. Record provider, certificate identifiers, timestamp, policy, and verifier output in the response ledger.
5. Keep external tokens and service credentials out of git, screenshots, app bundles, and presenter scripts.

## Non-production exclusions

- No TSA token is represented as an official or legally effective timestamp.
- No demo or fixture uses a production signing/TSA key.
- No token is appended into the golden chain or used to claim a fifth SEAL property.
- Production activation waits for timestamp-provider, legal, residency, key-management, and retention validation packs.
