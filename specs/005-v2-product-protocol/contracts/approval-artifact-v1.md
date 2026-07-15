# Contract: Approval Artifact and Protective Capability v1

## Approval artifact

```json
{
  "schema": "ahd-approval-artifact-v1",
  "approval_id": "DEC-SHARIAH-RIFQ-CONSENT-V1",
  "legacy_ids": ["D-8"],
  "capability_id": "rifq_grace",
  "authority": {
    "name": "Named reviewer",
    "role": "Qualified reviewer",
    "organization": "Recorded organization",
    "authority_type": "shariah"
  },
  "exact_question": "Does the recorded consent profile authorize this capability?",
  "decision": "APPROVED",
  "enabled_profile": "creditor_consent_required",
  "conditions": [
    { "key": "blanket_consent_allowed", "operator": "eq", "value": false }
  ],
  "source_ref": "docs/evidence/approvals/recorded-artifact.pdf",
  "source_digest": "64-lowercase-hex-characters",
  "effective_from": "2026-07-14T00:00:00Z",
  "expires_at": null,
  "revoked_at": null,
  "supersedes": [],
  "artifact_digest": "64-lowercase-hex-characters"
}
```

The example describes shape only; it is not an actual approval. Test artifacts live under test fixtures, use
`authority_type: "fixture"`, and can activate only `environment: "test"` profiles.

## Pure interface

```js
validateApprovalArtifact(artifact, expected, asOf, sha256) -> ValidationResult
compileApprovalRegistry(artifacts, expectations, asOf, sha256) -> ApprovalRegistry
resolveActivation(registry, capabilityId, requestedProfile, requirements, context) -> ActivationResult
runApproved(activation, input, execute) -> CapabilityResult
```

`expected` supplies the schema, decision-ID registry, authority-type allow-list, source digest, environment, and
required condition keys. `requirements` is an array of exact `{ approval_id, enabled_profile }` pairs. `context`
contains deterministic values needed to evaluate conditions. Unknown conditions fail closed.

## Inert contract

Any missing, rejected, expired, revoked, tampered, superseded, wrong-environment, profile-mismatched, or
condition-mismatched approval returns:

```json
{
  "outcome": "INERT",
  "reason": "APPROVAL_MISSING",
  "capability_id": "rifq_grace",
  "enabled_profile": null,
  "approval_refs": [],
  "events": [],
  "stateChanges": [],
  "monetaryMoves": []
}
```

`execute` is never called for an inert activation. Inputs remain byte-identical.

## Capability matrix

| Capability | Required approvals | Permitted behavior |
|---|---|---|
| `rifq_grace` | `DEC-SHARIAH-NETTING-V1` and `DEC-SHARIAH-RIFQ-CONSENT-V1` | Call existing Rifq primitive under exact creditor-consent profile |
| `circle_mode_b` | `DEC-SHARIAH-CIRCLE-MODE-B-V1`; custody profile also requires legal/regulatory/provider/custody artifacts | Pledge-at-spend or licensed external custody; never Ahd pooled custody |
| `borrower_release` | New owner-approved unique decision plus lender consent | Request, decline, withdraw, or consented partial/full forgiveness |
| `duress_hold` | New legal/product unique decision | Neutral signal and approved protective hold only |
| `collusion_review_hold` | New privacy/legal unique decision | Structural signal and human review hold; no score or verdict |

No runtime code may invent the missing decision identifiers or treat these rows as approval.

## Consent and conservation

- Approval authorizes a mechanism profile; party consent authorizes a specific action. Both are required where
  the profile says so.
- Original principal is immutable. Monetary fields are integer halalas.
- Borrower release consent is bound to record, lender, borrower, remaining principal, and consent amount.
- Consent amount cannot exceed remaining principal.
- Duress/collusion outputs contain no `score`, `probability`, `risk`, `fraud`, `guilt`, `rating`, or underwriting
  result fields.

## Decision identifiers

New artifacts use `DEC-<DOMAIN>-<SLUG>-V<NUMBER>`. A checked alias registry preserves historical `D-*` references.
The two meanings currently called `D-4` must map to different canonical identifiers before any v2 activation.
Alias collision or conflicting remap is a hard error.

## Rollback

- Approval revocation stops future activation only.
- Existing Rifq grace evidence remains verifiable and is not automatically netted.
- Unspent Circle pledges may be cancelled; converted mode-A agreements survive.
- Pending borrower requests may be cancelled; consented forgiveness remains final.
- Neutral hold evidence remains; active holds require an authorized release event.
- Identity bindings and old state readers remain available.
- Analytics rollback restores the prior safe aggregate schema and never reveals suppressed rows.

Each capability declares `schema_version`, `backward_reader`, `disable_path`, and `irreversible_effects`.
