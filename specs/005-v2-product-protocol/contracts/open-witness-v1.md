# Contract: Open-Witness Proof Package v1

## Supported input

The verifier accepts either one legacy record or one explicit proof package. A top-level array is accepted only
with `--chain` and is normalized into a proof package before verification.

```json
{
  "schema": "open-witness-proof-package-v1",
  "protocol_version": "1.1.0",
  "profile_id": "ahd-five-property-v1",
  "canonical_record": {},
  "chain": [],
  "timestamp_attestation": {
    "format": "rfc3161-der",
    "imprint_target": "sealed_seal_raw_bytes",
    "token_base64": "...",
    "trust_profile_id": "fixture-tsa-v1"
  },
  "issuer_proof": {},
  "merkle_proof": {}
}
```

`imprint_target` is normative: decode the 64-character hexadecimal `sealed_seal` to 32 raw bytes and attest
those bytes. Do not timestamp the ASCII hex text, the canonical JSON text, or a wall-clock-derived value.

## Five proof properties

1. `integrity`: canonical content digest and sealed seal recompute under the declared legacy-compatible profile.
2. `continuity`: block sequence is contiguous and every block links to the prior block's sealed seal.
3. `trusted_time`: the external token's message imprint, CMS signature, TSA certificate chain, policy, and trust
   profile validate.
4. `issuer_signature`: signature verifies against the declared approved issuer/key lifecycle at the attested time.
5. `merkle_inclusion`: leaf/path/root verify and the checkpoint is authenticated by its declared log profile.

## Verification output

```json
{
  "ok": false,
  "profile_id": "ahd-five-property-v1",
  "properties": {
    "integrity": { "status": "valid", "code": "OK" },
    "continuity": { "status": "valid", "code": "OK" },
    "trusted_time": { "status": "missing", "code": "TIMESTAMP_MISSING" },
    "issuer_signature": { "status": "valid", "code": "OK" },
    "merkle_inclusion": { "status": "valid", "code": "OK" }
  },
  "failed_at": "trusted_time",
  "diagnostics": {}
}
```

Property status is exactly `valid`, `invalid`, `missing`, or `unsupported`. Overall success requires every
mandatory property for the declared profile to be `valid`. The verifier never silently downgrades an unsupported
major version or skips a missing mandatory property.

## CLI

```text
node protocol/verify-ahd-seal.cjs --record <path> [--json]
node protocol/verify-ahd-seal.cjs --package <path> [--json]
node protocol/verify-ahd-seal.cjs --chain <path> [--json]
```

Exit codes:

- `0`: all mandatory properties valid.
- `1`: supported input but one or more properties are non-valid.
- `2`: usage, parse, schema, or unsupported-major error.

`--json` writes exactly one JSON document to stdout. Human diagnostics go to stderr.

## Timestamp adapter

```js
async function verifyTimestamp(input) {
  return {
    status: "valid",
    code: "OK",
    genTime: "2026-07-14T00:00:00Z",
    tsaKeyId: "fixture-tsa-v1"
  };
}
```

Input contains `tokenDer`, `expectedImprint`, `trustProfile`, and `asOf`. The adapter must validate imprint,
signed attributes, CMS signature, certificate chain, certificate purpose, policy allow-list, and lifecycle.
Production use requires the approved pinned adapter and accredited trust profile. Fixture adapters and keys are
labelled `fixture` and cannot satisfy a production profile.

## Issuer lifecycle

The declared `verification_method` and `cryptosuite` must match an issuer registry entry. New issuance is allowed
only while the key is active. Retirement is issuance-only and does not invalidate a signature made during the
effective interval. Compromise returns a stable diagnostic and follows the profile's superseding-evidence rule;
it never rewrites an old seal.

## Independence

The reference verifier may use platform file/cryptographic primitives and the approved timestamp adapter. It may
not import `app/`, `demo/`, `app/engine.js`, server code, or a producer implementation. The clean-room issuer may
not import the first verifier.

## Compatibility

- Existing `ahd-main-v1`, `ahd-create-v1`, and `ahd-chain-block-v1` profiles remain verifiable.
- Minor versions may add optional fields or new profiles without changing existing profile meaning.
- Major versions require an explicit migration and fail clearly when unsupported.
- Rollback disables new issuance under the new profile; it does not remove historical verification support.
- Golden fixtures remain immutable. Canonical/golden change belongs only to separately approved `OT-PATCH`.

## Conformance exchange

Each implementation produces at least three records and verifies at least three records from the other
implementation. Persistent fixtures cover content, continuity, trusted time, issuer signature/lifecycle, Merkle
proof/checkpoint, missing evidence, unsupported version, and tampering. Results are stored as machine-readable
JSON under `protocol/conformance/results/`.
