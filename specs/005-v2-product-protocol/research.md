# Research: V2 Product and Protocol

## Decision: Trusted time remains an external attestation

**Rationale**: RFC-3161 evidence must not enter deterministic canonical business logic. Verification checks the
token separately against the canonical digest.  
**Alternatives considered**: Hash live time into the seal; trust local clock. Rejected.

## Decision: Production Ed25519 requires managed custody

**Rationale**: Node crypto proves signature mechanics; production non-repudiation depends on protected keys,
rotation, revocation, and audit.  
**Alternatives considered**: Commit demo private key; treat SHA-256 mock as signature. Rejected.

## Decision: Open-Witness uses explicit version and conformance

**Rationale**: An open standard needs license, governance, fixtures, algorithm registry, compatibility, and two
implementations. A repository document alone is not interoperability.  
**Alternatives considered**: Ahd-only verifier; claim broad standard status immediately. Rejected.

## Decision: Approval artifacts are runtime build inputs

**Rationale**: Gated product behavior must remain inert unless an exact qualified decision authorizes it. An AI
cannot infer approval from prose.  
**Alternatives considered**: Feature flag set by developer; conservative autonomous interpretation. Rejected.

## Decision: Mobile parity before redesign

**Rationale**: Existing Figma/Sadu baseline and RN mapping reduce product and token drift. Byte-faithful engine sync
keeps seals identical.  
**Alternatives considered**: Redesign during port; port golden logic to another language. Rejected.

## Decision: `OT-PATCH` stays separate

**Rationale**: Re-pinning golden vectors changes the project trust root. It requires explicit migration design,
compatibility fixtures, rollback, and operator approval.  
**Alternatives considered**: Include it with protocol cleanup. Rejected by constitution.

