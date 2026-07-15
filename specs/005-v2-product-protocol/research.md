# Research: V2 Product and Protocol

**Date:** 2026-07-14
**Scope:** Open-Witness five-property proof, approval-gated product mechanisms, canonical identity/state,
privacy-safe analytics, and a 21-route Arabic mobile twin.

## Decision: Split delivery into three independently testable tracks

**Rationale:** Protocol verification, governance-gated product behavior, and native mobile delivery have
different dependencies and exit gates. A single implementation sequence would allow a missing TSA, scholar
decision, Figma baseline, or Apple credential to block unrelated work. The coordinated Spec Kit package remains
the requirements authority, while detailed execution is split into protocol, product-gate, and mobile plans.

**Alternatives considered:** One big-bang implementation; a UI-only port before core parity. Both were rejected
because they hide dependencies and cannot produce independently reviewable increments.

## Decision: Extend the existing verifier additively

**Rationale:** `protocol/verify-ahd-seal.cjs` already reconstructs canonical content independently and verifies
content integrity, hash-link continuity, Ed25519 signatures, and RFC-6962-style Merkle inclusion using only
`fs` and `crypto`. The new profile dispatcher will make all mandatory properties explicit and return one result
for each property. Existing golden fixtures and v1 profiles remain immutable.

**Alternatives considered:** Rewrite the verifier; change golden canonicalization; describe the four-property
prototype as complete. All were rejected because they either create an unnecessary `OT-PATCH` migration or
overstate current evidence.

## Decision: Trusted time is an external proof over the sealed-seal bytes

**Rationale:** The current record `timestamp` is self-asserted canonical content, not trusted time. An RFC-3161
token must attest the raw bytes represented by the record's hexadecimal `sealed_seal`. Attaching or renewing a
timestamp therefore never changes canonical business content or the golden seal. The property reports
`valid`, `invalid`, `missing`, or `unsupported`; an issuance workflow may additionally use `provisional` while
a provider is unavailable, but a complete production proof cannot pass in that state.

The current Windows environment has no `openssl`, and Node.js exposes no complete RFC-3161/CMS verifier.
The verifier will consume a narrow `verifyTimestamp(input)` adapter. Selecting and pinning the production
adapter and accredited TSA is an explicit owner/security/vendor gate. ASN.1/CMS verification will not be
hand-written. A fixture adapter may prove orchestration but must be labelled non-evidentiary.

**Alternatives considered:** Hash live time into canonical data; trust the local clock; call an unapproved free
TSA; hand-write CMS parsing. These were rejected for determinism, evidentiary, or security reasons.

## Decision: Separate signature mechanics from issuer governance

**Rationale:** A valid Ed25519 signature proves possession of a key, not that the key belongs to an approved
issuer. A versioned issuer registry will bind issuer ID, verification method, algorithm, public key, environment,
effective interval, retirement, compromise, and supersession. Retirement stops new issuance but preserves
historical verification. Production issuance remains disabled until non-exportable HSM/KMS custody and approved
public metadata are recorded.

**Alternatives considered:** Continue defaulting to the embedded demo key; delete retired keys. Rejected because
the former does not establish issuer identity and the latter destroys backward verification.

## Decision: Persist conformance fixtures and add a clean-room second issuer

**Rationale:** Current signature, continuity, and Merkle tampering exists mostly as in-memory test mutations.
Other implementations need stable valid, missing, unsupported, and property-specific tampered packages. A second
implementation under `protocol/issuers/reference-2/` must not import `app/`, `demo/`, the generated engine, or the
first verifier. It will issue three records accepted by Ahd's reference verifier and verify three Ahd records.

**Alternatives considered:** Count `protocol/build-chain-fixture.cjs` as the second implementation; keep dynamic
fixtures only. Rejected because the builder imports Ahd code and dynamic mutations cannot be exchanged.

## Decision: Governance and licensing remain owner-gated

**Rationale:** Versioning, an algorithm/profile registry, conformance process, security contact, vulnerability
handling, errata, deprecation, and compatibility rules can be drafted now. Publication and any open-source claim
remain blocked until the owner chooses the specification and code licenses. Commercial white-label licensing is
a separate decision.

**Alternatives considered:** Publish without a license; silently choose a permissive or custom license. Rejected
because reuse rights and commercial consequences belong to the owner.

## Decision: Approval artifacts are deterministic activation inputs

**Rationale:** Consent, a feature flag, or `shariahReviewNeeded: true` does not prove qualified approval. A pure
approval evaluator will receive caller-supplied `asOf`, validate the exact authority, question, profile,
conditions, lifecycle, and source digest, then return a fail-closed activation. Missing, rejected, expired,
revoked, tampered, or profile-mismatched artifacts return an inert result with zero events, state changes, and
monetary moves. The mechanism function is never invoked while activation is inert.

**Alternatives considered:** Developer flags; parsing decision prose at runtime; inferring approval from visible
badges. Rejected because none establishes exact scope, integrity, or lifecycle.

## Decision: Preserve Rifq and Circle prototypes behind approval adapters

**Rationale:** `app/features/rifq.js` already preserves principal, requires strict affected-creditor consent,
seals grace evidence, and calls golden netting unchanged. It remains a prototype primitive. A new
`rifq-approved.js` adapter requires both the multilateral-netting and Rifq-consent approval profiles before
calling it. `circle-adv.js#pledgeSketch` also remains a proposal primitive. Executable mode B activates exactly
one approved profile: `pledge_then_pay_at_spend` or `licensed_external_custody`; Ahd never holds pooled deposits.

**Alternatives considered:** Treat the conservative prototypes as self-approved; modify existing primitives;
implement both Circle profiles before a decision. Rejected because the decision register remains open.

## Decision: Borrower release is request-only until lender consent

**Rationale:** A borrower may request release, withdraw the request, or receive a decline without monetary effect.
Only lender consent bound to the record and remaining principal may create `PARTIAL_FORGIVEN` or `FORGIVEN`.
Consent cannot exceed the remaining principal. A dedicated uniquely identified decision must be approved before
the execution path is enabled.

**Alternatives considered:** Automatic borrower-triggered forgiveness; inferred consent; reuse the grace event.
Rejected because they alter lender rights or conflate respite with forgiveness.

## Decision: Duress and collusion create neutral signals and protective holds

**Rationale:** A duress report or structural collusion signal may request a time-bounded protective hold and
human review. Neither module may emit guilt, fraud, probability, rating, underwriting, or a verdict. Withdrawal,
dispute, release, and supersession are append-only events. Each capability needs its own legal/product or
privacy/legal decision identifier before activation.

**Alternatives considered:** Extend the generic dispute event; automatic fraud scores; Ahd adjudication.
Rejected because the bank witnesses and protects but does not judge or score.

## Decision: Canonical identity is an issuer-scoped URN with additive legacy binding

**Rationale:** Current IDs are inconsistent and sometimes include names. Logic cannot generate UUIDv7 or ULID
without time or randomness. New IDs therefore use:

```text
urn:ahd:1:<issuer-key>:<entity-kind>:<26-char-crockford-base32>
```

The opaque suffix is supplied by an approved boundary. A deterministic migration suffix is derived from issuer,
entity kind, legacy scheme/value, and original canonical hash. Old records are never rewritten; a hashed binding
maps each legacy reference to exactly one canonical ID and conflicting remaps fail closed.

**Alternatives considered:** UUIDv7; ULID; keep arbitrary strings; rewrite old IDs. Rejected for nondeterminism,
privacy, collision, or seal-compatibility reasons.

## Decision: State vocabularies remain domain-specific and versioned

**Rationale:** Agreement, grace, Circle, and protective actions have different lifecycles. Versioned registries
preserve those boundaries. Legacy `RESCHEDULED` maps to agreement `ACTIVE` plus grace `GRANTED`; it does not
become a new golden engine state. Unknown histories fail migration and Arabic labels remain presentation only.

**Alternatives considered:** One mega-enum; make `RESCHEDULED` canonical; parse Arabic labels. Rejected because
they blur domain meaning or change golden behavior.

## Decision: Analytics expose only privacy-safe aggregates

**Rationale:** Public analytics must suppress cohorts smaller than `K_FLOOR = 3`, expose a fixed aggregate key
set, and never return IDs, names, trust bands, scores, or agreement history. Existing per-circle helpers remain
internal. Synthetic sensitivity bands remain labelled modelled, not measured.

**Alternatives considered:** One-record anonymized totals; numeric collusion/risk scores. Rejected because small
cohorts are re-identifiable and individual scoring violates the spine.

## Decision: Decision IDs become namespaced and legacy aliases remain historical

**Rationale:** `D-4` currently names both frozen-demo fate and an inheritance proposal. New artifacts use
`DEC-<DOMAIN>-<SLUG>-V<NUMBER>`, for example `DEC-OPS-DEMO-FATE-V1` and
`DEC-SHARIAH-INHERITANCE-V1`. Historical documents retain `legacy_ids`; there is no destructive global rename.
Borrower release, duress, and collusion receive owner-approved unique IDs before activation.

**Alternatives considered:** Rename only one occurrence; rely on file context; assign another flat `D-*` number.
Rejected because collisions would recur and machine validation would remain ambiguous.

## Decision: Rollback disables future actions and never rewrites witnessed history

**Rationale:** Approval revocation stops new actions but cannot erase evidence, revive forgiven principal, release
an active hold without authority, or reseal an old record. Each feature declares its schema version, backward
reader, disable path, irreversible effects, and rollback test. Golden migration remains the separate `OT-PATCH`
compatibility release.

**Alternatives considered:** Delete events; reverse forgiveness; auto-release holds; rewrite IDs or seals.
Rejected because rights and witnessed facts are append-only.

## Decision: Target Expo SDK 57 with a clean product scaffold

**Rationale:** As verified on 2026-07-14, Expo SDK 57 targets React Native 0.86, React 19.2.3, Node 22.13 or newer,
the New Architecture, Android 7+/API 36, and iOS 16.4+. The existing `application/design/proof-go/` is an SDK 56
throwaway device proof and must remain historical evidence rather than product seed code. Create the product with
the SDK 57 Router template.

**Alternatives considered:** Promote the SDK 56 proof; keep the stale `54+` plan; use bare React Native. Rejected
for drift, reproducibility, or native-build risk. Primary references: [Expo SDK matrix](https://docs.expo.dev/versions/latest/),
[Expo Router](https://docs.expo.dev/router/introduction/), and
[New Architecture](https://docs.expo.dev/guides/new-architecture/).

## Decision: Preserve all 21 web keys with four mobile tabs and stack routes

**Rationale:** The web registry has 21 screens, while its primary navigation has eight entries. Eight bottom tabs
are not usable on small screens. The mobile registry preserves all 21 keys exactly, exposes `home`, `create`,
`daftari`, and `settle` as judge-path tabs, and reaches the other 17 through typed stack routes and in-product
links. This adds no twenty-second “More” screen.

The Sadu partials cover 17 screens. `refusal`, `shariah`, `plans`, and `org` require a supplemental baseline
approval before full visual-parity claims. All 21 routes are registered and reachability-tested from day one.

**Alternatives considered:** Eight tabs; a new More screen; one monolithic screen. Rejected for reachability,
inventory drift, or loss of native routing.

## Decision: Generate a byte-faithful mobile core and typed adapters

**Rationale:** A sync script copies `app/engine.js`, required pure `app/features/*.js`, and
`application/design/tokens.json` into `application/ahd-mobile/src/generated/`, then records SHA-256 source hashes.
TypeScript adapters consume the generated CommonJS modules; screens contain no business logic. Native export
tests prove Metro/Hermes compatibility in addition to Node parity.

**Alternatives considered:** Import outside the Metro root; rewrite engine/features in TypeScript; reimplement
features around an engine-only copy. Rejected for EAS packaging or logic/seal drift.

## Decision: Use versioned Expo SQLite state and honest offline boundaries

**Rationale:** Expo SQLite 57 persists across restarts and provides an official key-value API without another
runtime dependency. Persist records, deterministic UI state, an explicit `AS_OF`, and noncanonical outbox intents.
Offline drafts, scans, ledger/proof reads, grace requests, and settlement previews may work. Nafath, TSA, issuer
signature, or external identity actions return `needs_connection` and never fake a sealed/canonical transition.

**Alternatives considered:** AsyncStorage; filesystem JSON; server-first state. Rejected for dependency,
atomicity/migration, or offline-core reasons. Reference: [Expo SQLite](https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/).

## Decision: Configure static RTL, licensed Arabic fonts, and device accessibility gates

**Rationale:** Use the Expo localization plugin with Arabic-only RTL flags, bundle approved IBM Plex Sans Arabic
font files via the Expo font config plugin, import generated tokens, use start/end layout semantics, real safe
areas, vector icons, and reduced-motion support. No emoji or simulated phone chrome ships in the product.
Final evidence requires development builds on one physical iPhone and one physical Samsung/Android phone with
VoiceOver/TalkBack, 200% text, RTL focus order, gestures/back behavior, and airplane-mode cold start.

**Alternatives considered:** Runtime `forceRTL()`; system font and emoji; Expo Go screenshots as final evidence.
Rejected for restart behavior, visual drift, or insufficient accessibility proof. References:
[Expo localization](https://docs.expo.dev/guides/localization/),
[Expo fonts](https://docs.expo.dev/versions/v57.0.0/sdk/font/),
[React Native accessibility](https://reactnative.dev/docs/accessibility), and
[IBM Plex license](https://github.com/IBM/plex/blob/master/LICENSE.txt).

## External gates carried into execution

- Owner-approved Open-Witness specification/code licenses and governance authority.
- Accredited TSA plus an approved, pinned RFC-3161/CMS adapter.
- Non-exportable HSM/KMS issuer-key custody and lifecycle metadata.
- Unique decision IDs and signed approvals for every gated mechanism.
- Completed Figma/Sadu baseline evidence; supplemental designs for four uncovered routes.
- Approved IBM Plex Sans Arabic files, weights, and license copy.
- Apple/Google build credentials, one physical iPhone, and one physical Samsung/Android device.

These gates are resolved as delivery preconditions, not replaced with synthetic approvals or prototype evidence.
