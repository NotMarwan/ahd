# Data Model: V2 Product and Protocol

## SealProofPackage

- `protocol_version`: semantic version
- `canonical_record`: versioned canonical content
- `chain`: ordered blocks and previous hashes
- `timestamp_attestation`: provider token, certificate chain, status
- `issuer_proof`: algorithm, public key reference, signature, rotation metadata
- `merkle_proof`: root, leaf, path, checkpoint
- `verification_result`: property-specific outcomes

## ApprovalArtifact

- `approval_id`: globally unique decision ID
- `authority`: named scholar, counsel, owner, vendor, or regulator
- `question`: one exact question
- `answer`: approved, rejected, conditional, expired
- `conditions`: machine-checkable prerequisites where possible
- `artifact_digest`: integrity link to written source
- `effective_from`, `expires_at`: governance lifecycle

## ProtectiveAction

- `record_id`, `action_type`: hardship defer, borrower release request, duress hold, collusion review hold
- `requester`, `required_consents`, `observed_consents`
- `original_principal_minor`: immutable integer amount
- `status`: requested, active, declined, released, superseded
- `neutral_evidence`: no guilt or score conclusion

## CanonicalIdentity

- `ahd_id`: selected canonical format
- `legacy_ids`: old identifier mappings
- `entity_type`: record, event, proof, principal, circle
- `state_vocab_version`: binding state enum version
- `created_by`, `integrity_digest`: provenance

## ProtocolImplementation

- `implementation_id`, `issuer_id`, `version`
- `fixture_set`, `algorithms`, `conformance_result`
- `license`, `security_contact`, `known_limits`

## MobileJourneyBaseline

- `journey_id`, `web_entry`, `mobile_entry`
- `inputs`, `expected_canonical`, `expected_seal`, `expected_money_totals`
- `accessibility_checks`, `offline_behavior`, `device_evidence`

