# Contract: Open-Witness v1 Compatibility

**Contract ID**: `open-witness-v1-compat`

**Status**: Current published integrity profile

**Canonical standard**: [`docs/specs/open-witness-v1.md`](../../../docs/specs/open-witness-v1.md)

This contract does not duplicate the canonical serialization formulas. The linked standard is the
authority; the purpose here is to define product compatibility, governance, and production seams.

## Supported Profiles

| Profile | Current purpose | Compatibility status |
|---|---|---|
| `ahd-main-v1` | Frozen MAIN reference record | Pinned and supported |
| `ahd-create-v1` | Current create/open/scheduled record profile | Pinned and supported |

Other feature-specific seals may reuse golden primitives but are not automatically Open-Witness
profiles. Publishing one requires a named profile, field schema, canonical byte rules, fixtures,
tamper cases, and independence tests.

## Golden Compatibility

| Record | Expected seal | Required evidence |
|---|---|---|
| MAIN | `6c9410b95ba4715a3c2b174ff70aa2d7ab88fa0294868a41354d2f9e60f7fd18` | Frozen engine vector plus independent verifier |
| NEW-1 | `0463553997c80d77e65d1a411acc0e0bd9d4bef67a92dc96af045dfa24a2b8f8` | Create vector plus independent verifier |

The verifier must also reject the paired tampered fixtures.

## Verification Contract

A conforming verifier:

1. selects a known profile explicitly;
2. validates required fields and types;
3. reconstructs all derived canonical fields defined by that profile;
4. preserves exact UTF-8, field order, separators, newlines, and array order;
5. recomputes the canonical hash and seal using standard SHA-256;
6. compares the recomputed seal with the claimed sealed value;
7. returns `INTACT` only on exact agreement;
8. returns `TAMPERED` on a validly shaped record whose covered bytes differ; and
9. fails closed on an unknown profile, malformed data, inconsistent chain, or unsupported algorithm.

The verifier may explain the failing class but must not expose secrets or claim who caused a change.

## Independence Contract

`protocol/verify-ahd-seal.cjs` must not import:

- `app/engine.js`;
- any file under `app/`;
- `demo/index.html` or logic extracted from `demo/`; or
- an Ahd network service.

It may use Node built-in `crypto` and the published schema. Tests must inspect the dependency boundary,
not merely compare one output.

## Integrity Claim Boundary

Open-Witness v1 proves that covered bytes reproduce the claimed deterministic seal under the named
profile. It does not alone prove:

- the legal identity of either party;
- that a named party actually consented;
- accredited or external time;
- bank-key custody or non-repudiation;
- legal admissibility or factual truth;
- payment execution; or
- Shariah approval of a future structure.

Those claims require separate verified attestations in a versioned evidence bundle.

## Versioning Rules

- Existing profile names and byte rules are immutable.
- A new field that changes canonical bytes creates a new profile.
- A new seal or canonicalization algorithm creates a new profile and new golden vectors.
- Old profile verifiers remain available for old evidence.
- Transport/API versions never alter canonical bytes implicitly.
- Identifier bytes are opaque and preserved exactly.
- Multi-block, Merkle, bank-signature, and TSA extensions must declare their own version and downgrade
  behavior.

## External Attestation Extension

Production evidence should wrap, not replace, the v1 deterministic seal. The recommended attestation
digest binds:

- v1 profile and deterministic seal;
- exact party-action attestation references;
- sequence and previous reference;
- bank witness-signature reference; and
- explicit evidence-bundle version.

An approved TSA token then covers that attestation digest. The TSA target must be settled in one
canonical production specification before implementation because historical project documents differ.

## Required Regression Evidence

```powershell
node protocol/verify-ahd-seal.cjs protocol/fixtures/main-record.json
node protocol/verify-ahd-seal.cjs protocol/fixtures/new1-record.json
node protocol/verify-ahd-seal.cjs protocol/fixtures/main-record-tampered.json
cd tests
node app/open-witness.test.cjs
node app/seal-properties.test.cjs
node run-all.cjs
```

The intact commands exit 0. The tampered command intentionally exits 1 after printing `TAMPERED`.
The full gate is authoritative for the complete profile and independence checks.
