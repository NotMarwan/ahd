# External validation packs

**Purpose:** turn every external dependency into a bounded question with evidence, permitted claims, blocked claims, and a change trigger. These packs request review; they do not announce approval.

## Common cover sheet

Every pack includes: product one-line description; architecture diagram; exact environment (prototype/staging/pilot); data categories; requested decision; owner; dated artifacts; and a response record signed or emailed by the reviewing body. Present only the response, not an assumed outcome.

## 1. Shariah scholar / board pack

| Include | Allowed after written response | Blocked until response | Needs-change trigger |
|---|---|---|---|
| qard-hasan flow; separate service-contract draft; mercy/deferment flow; fee and cost evidence; AAOIFI citations; unresolved questions | “Reviewed by [named body] on [date]” and only the exact written scope | “Shariah approved” or a fatwa claim | service charge tied to principal/time; required ancillary contract; unsupported netting/deferment treatment |

**Questions:** Is the proposed witness/seal/settlement role consistent with the submitted qard structure? Which fee, if any, is permissible under the reviewer’s conditions? What consent and disclosure must precede any netting or deferment feature?

## 2. Saudi legal and evidence pack

| Include | Allowed after written response | Blocked until response | Needs-change trigger |
|---|---|---|---|
| record schema; seal/verifier flow; audit trail; user terms; retention/deletion design; evidence-law research | “Counsel reviewed [specific use case]” | legal admissibility guarantee; court-enforceability guarantee | required signature/evidence format, retention duty, consumer disclosure, or jurisdictional restriction differs from design |

**Questions:** What legal characterization applies to a bank-witnessed interpersonal record? What evidence/signature conditions must be met for the intended use case? Which data, notice, and retention controls are mandatory?

## 3. SAMA / custody and payment-boundary pack

| Include | Allowed after written response | Blocked until response | Needs-change trigger |
|---|---|---|---|
| money-flow diagram showing no Ahd balance-sheet lending; settlement-confirmation design; safeguarding boundary; sandbox/path-to-production plan | “A regulatory discussion/sandbox process has begun” when documented | licence, sandbox acceptance, payment custody, or rail integration claim | any flow causes Ahd to hold, pool, direct, or automatically pull customer funds beyond approved scope |

**Questions:** Does the proposed role require a regulated payment/custody arrangement? What sandbox, entity, safeguarding, and consumer-protection steps apply? Which settlement confirmation patterns are permitted?

## 4. Nafath / approved identity-provider pack

| Include | Allowed after written response | Blocked until response | Needs-change trigger |
|---|---|---|---|
| identity sequence; minimal attributes; consent text; relying-party model; data-residency design; test environment request | “Identity-provider validation is in progress” | live Nafath integration, approved use case, or legally effective signature claim | provider cannot support private interpersonal records, data minimisation, or required consent/authentication level |

**Questions:** Is the intended private interpersonal use case permitted? Which attributes, consent language, relying-party controls, and audit records are required? Is a separate trust-service provider required for the claimed signature effect?

## 5. RFC 3161 timestamp-provider pack

| Include | Allowed after written response | Blocked until response | Needs-change trigger |
|---|---|---|---|
| non-production profile; request/response fixture; verifier plan; certificate-chain policy; data-minimised imprint specification | “Provider interoperability test completed” | trusted production timestamp, legal-time guarantee, or archival-validity claim | provider token is not RFC 3161-valid, chain cannot be verified, or data leaves approved residency/scope |

**Questions:** Can the provider return RFC 3161 tokens for SHA-256 imprints in a non-production environment? What certificate, revocation, retention, residency, and production onboarding requirements apply?

## Response ledger

Create one dated row per response in `_meta/deep-work/ledger/` with: pack version, reviewer organization/person, exact conclusion, approved scope, constraints, evidence location, expiry/review date, and code/docs affected. A no-response is a blocked claim, not an implicit approval.
