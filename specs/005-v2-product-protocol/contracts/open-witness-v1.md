# Contract: Open-Witness and Gated Features v1

## Proof properties

1. Canonical content digest matches declared record version.
2. Every block links to the prior block and sequence.
3. RFC-3161 or approved equivalent attests the canonical digest externally.
4. Issuer signature verifies against an approved public-key lifecycle.
5. Merkle proof links the record to a published checkpoint.

Verification returns one status per property: `valid`, `invalid`, `missing`, or `unsupported`.
Overall success requires all mandatory properties for the declared profile.

## Independence

The reference verifier may use platform file and cryptographic primitives. It may not import the Ahd app,
demo, generated engine, or server code.

## Gated feature activation

```text
feature_id | required_approval_id | approval_digest | conditions | enabled_profile
```

- Missing, rejected, expired, or condition-mismatched approval keeps the feature inert.
- Approval never changes original principal or creates an interest/penalty field.
- Duress and collusion features may hold or flag; they may not determine guilt.
- Circle funding follows the exact approved custody/pledge model.

## Compatibility

- Minor versions add optional fields or profiles without breaking existing verification.
- Major versions require explicit migration and must never silently downgrade.
- Old fixtures remain part of conformance tests.

