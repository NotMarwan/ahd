# Tasks: Ahd Product System Improvement Portfolio

**Input**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, and `quickstart.md`

**Scope rule**: Do not rebuild requirements already proved `BUILT`. First add traceability and
assurance. Implement only declared gaps. A decision-gated or external-gated task stops until the
named evidence exists.

**TDD rule**: Every behavior change starts with a focused failing test. Documentation-only tasks
name an exact validation command. Existing assertions may not be weakened.

**Constitution binding**: Every task preserves the Ahd spine and the modular boundaries among the
frozen demo, offline app, localhost demo server, independent verifier, and future production ports.

**Universal stop conditions**:

- any change to `demo/index.html`, golden function internals, or pinned vectors;
- any interest, delay penalty, loan-linked increase, scoring, Ahd verdict, or AI fatwa;
- any real user data in fixtures or the local JSONL server;
- any `DECISION-GATED` or `EXTERNAL-GATED` status promoted without attributable evidence; or
- any focused/full gate regression.

## Format

`[ID] [P?] [Story] description — requirement IDs — exact files — validation or gate`

`[P]` means the task can run in parallel with adjacent tasks because it owns different files.

## Phase 1: Specification Control Foundation

**Purpose**: Make the master specification and live registries machine-checkable before feature work.

- [ ] T001 [US8] Write a failing uniqueness/status test that parses normative table rows and expects exactly 142 distinct IDs with one allowed lifecycle status in `tests/app/master-spec-contract.test.cjs` — FR-001, DR-013 — run `node tests/app/master-spec-contract.test.cjs` and confirm red.
- [ ] T002 [US8] Implement a zero-dependency Markdown requirement parser in `project/spec-tools/master-spec.cjs` and make T001 green without hard-coding requirement prose — FR-001, DR-013 — run the focused test.
- [ ] T003 [P] [US8] Extend `tests/app/master-spec-contract.test.cjs` to require family counts `FR=50`, `SR=18`, `NFR=20`, `DR=15`, `PR=15`, `SEC=14`, `JR=10` and status counts derived from the spec — DR-013, JR-004 — no static gate total outside the spec contract test.
- [ ] T004 [US8] Add `project/spec-tools/build-traceability.cjs` to emit `specs/001-ahd-product-system/traceability.json` from requirement rows and explicit evidence mappings, then verify deterministic byte output in `tests/app/master-spec-contract.test.cjs` — DR-013, NFR-001.
- [ ] T005 [P] [US8] Write a failing registry-drift test in `tests/app/product-inventory-drift.test.cjs` comparing scripts loaded by `app/index.html`, screen registration keys, `AhdApp.NAV_ORDER`, feature files, navigator units, and the 21-screen spec table — DR-014, FR-001.
- [ ] T006 [US8] Repair `project/mcp/packages/ahd-navigator/scripts/generate-map.ts` so generated feature/screen/test/layer mappings come from active files and no count constant can regress them — DR-014 — run the navigator package tests and T005.
- [ ] T007 [US8] Replace weak lower-bound inventory assertions in the navigator test files under `project/mcp/packages/ahd-navigator/src/__tests__/` with exact registry-derived assertions and a Home-without-feature case — DR-014 — do not hard-code 29 or 34.
- [ ] T008 [P] [US8] Add active-path exclusions for `.git`, `.worktrees`, archives, caches, generated media, and retired research to the Graphify refresh configuration or documented refresh command in `graphify-out/GRAPH_REPORT.md` without deleting historical sources — DR-014 — validate a refreshed graph does not use archive nodes as primary architecture starts.
- [ ] T009 [P] [US8] Update `_meta/INDEX.md` so `spec.md` is the product requirement authority, generated traceability is the evidence index, and registries remain capability-count authority — FR-001, DR-013, DR-014 — validate links with `rg` and `git diff --check`.
- [ ] T010 [US8] Run `git diff --check -- specs/001-ahd-product-system project/spec-tools project/mcp/packages/ahd-navigator tests/app` and focused tests T001–T007; commit only intended specification-control files — NFR-014, JR-004.

**Checkpoint**: Requirement IDs, lifecycle statuses, capability inventory, and evidence mappings are
derived and drift-detected.

## Phase 2: Shared Domain, Security, and Decision Foundations

**Purpose**: Establish cross-story contracts without changing the golden engine.

- [ ] T011 [US1] Write a failing data-contract test in `tests/app/domain-contract.test.cjs` for opaque non-empty `AhdIdV1`, safe integer halalas, current `SAR`, distinct parties, and the exact golden reducer state vocabulary — NFR-015, SR-005, SEC-006.
- [ ] T012 [US1] Add `app/features/domain-contract.js` as a pure dependency-injected validator that calls current engine helpers where applicable and exports no new sealing or state-reducer implementation — NFR-004, NFR-015, SEC-006 — make T011 green.
- [ ] T013 [US1] Extend `tests/app/domain-contract.test.cjs` with a failing assertion that `GRACE_GRANTED` remains `ACTIVE` plus `graced=true` and `RESCHEDULED` is display-only — FR-010, NFR-015 — prove green using the golden reducer, not duplicate logic.
- [ ] T014 [P] [US10] Create `docs/security/THREAT-MODEL.md` from `contracts/production-seams.md`, covering all STRIDE, LINDDUN, trust-boundary, and Ahd-specific abuse cases — PR-008, SEC-014 — validate required headings with a new static test in `tests/app/security-doc-contract.test.cjs` written red first.
- [ ] T015 [P] [US10] Create `docs/security/CONTROL-MATRIX.md` mapping SEC-001–SEC-014 to threat, owner, lifecycle, evidence, test, and failure behavior — DR-013, SEC-001–SEC-014 — validate every control appears exactly once.
- [ ] T016 [P] [US10] Create `docs/security/DATA-POLICY-CLASSES.md` for R0–R5, field classifications, linkability caveat, and the prohibition on guessed retention periods — DR-015, PR-010, SEC-010, SEC-011 — validation: `node tests/app/security-doc-contract.test.cjs`.
- [ ] T017 [P] [US10] Add review-packet template `docs/reviews/DECISION-PACKET-TEMPLATE.md` with mechanic, actors, money flow, exact question, sources, options, recommendation, affected requirements, disable path, decision owner, signature, and date — PR-002 — validation: static required-field check.
- [ ] T018 [P] [US10] Add external-gate evidence template `docs/reviews/EXTERNAL-GATE-EVIDENCE-TEMPLATE.md` with authority, scope, issue/expiry dates, artifact locator, verification result, limitations, conformance tests, rollback, and owner — PR-001–PR-007, PR-012–PR-015 — validation: static required-field check.
- [ ] T019 [US10] Write a failing repository-hygiene assertion in `tests/structure-check.cjs` that rejects tracked `server/data/`, `loans.jsonl`, `auth.key`, and private-key patterns while allowing explicit public fixtures — SEC-009, SEC-013.
- [ ] T020 [US10] Add narrowly scoped ignore entries to `.gitignore` for local server data and secret-key artifacts, then make `tests/app/server-secret-hygiene.test.cjs` green without ignoring `protocol/fixtures/` or public keys — SEC-009, SEC-013.
- [ ] T021 [P] [US8] Update `docs/ARCHITECTURE.md`, `app/README.md`, `tests/README.md`, and root `README.md` to match 21 screens, current suite topology, server auth/health/live smoke, and durable-append wording — DR-008, DR-014, NFR-014 — validation: T005 plus `git diff --check`.
- [ ] T022 [US8] Run the full gate and record only its live banner in `_meta/STATUS.md`; if any documentation count differs, fix the document rather than weakening a test — DR-008, NFR-014, JR-003, JR-004.

**Checkpoint**: Shared contracts are explicit, security review has a home, decision evidence is
structured, and local secrets cannot be committed accidentally.

## Phase 3: User Story 1 — Write and Seal a Clear Qard Hasan (P1)

**Goal**: Preserve current creation/sealing proof and define the production attribution boundary.

**Independent test**: Create clean scheduled and open agreements, reject prohibited/invalid terms,
prove exact canonical/seal outputs, and show that fixture identity remains labelled simulation.

- [ ] T023 [P] [US1] Add malformed identifier, same-party, unsafe amount, excess precision, scientific-notation, mixed-currency, invalid month, and unknown-profile cases to `tests/app/domain-contract.test.cjs` before validator changes — FR-002, SR-005, SEC-006.
- [ ] T024 [US1] Implement minimal validation in `app/features/domain-contract.js`; keep `app/features/create.js` and golden canonical functions unchanged — FR-002, NFR-004, SEC-006 — focused test green.
- [ ] T025 [P] [US1] Extend `tests/app/create.test.cjs` with exact-content consent invalidation cases: any party, amount, term, schedule, profile, or action change requires new consent — FR-006, SEC-003.
- [ ] T026 [US1] Add a pure consent-envelope builder in `app/features/consent-contract.js` that binds party, action, covered digest, profile versions, supplied timestamp, and nonce; do not represent it as live Nafath evidence — FR-006, FR-047, SEC-003 — focused test green.
- [ ] T027 [P] [US1] Add assertions to `tests/app/create.test.cjs`, `tests/app/request.test.cjs`, `tests/app/riba-lint.test.cjs`, `tests/app/refusal.test.cjs`, and `tests/app/shariah-basis.test.cjs` proving prohibited terms block sealing, Ahd does not lend or judge, AI does not issue fatwa, and simulated identity/signing are never labelled production or approved — FR-003–FR-005, FR-047, SR-001–SR-004, SR-008, JR-002, JR-010.
- [ ] T028 [US1] Update `app/index.html` and `app/app.js` only as needed to call the new additive validators/envelope builder; write the integration assertion first and preserve canonical/verification outputs and offline behavior — FR-007, FR-008, NFR-002, NFR-004, NFR-013 — run create, parity, golden-vector, and offline tests.
- [ ] T029 [US1] Update the US1 rows in `specs/001-ahd-product-system/traceability.json` through the generator, then run `node tests/app/master-spec-contract.test.cjs` — DR-013.

**Checkpoint**: Existing qard creation remains byte-compatible, while future identity/consent claims
have an exact contract and cannot be confused with simulation.

## Phase 4: User Story 2 — Follow an Obligation With Dignity (P1)

**Goal**: Bind lifecycle projections and exact conservation across scheduled and open obligations.

**Independent test**: Replaying the same ordered events produces the same state, grace remains an
attribute, payment/forgiveness never exceed remaining, and open-term loans never become overdue.

- [ ] T030 [P] [US2] Expand `tests/app/domain-contract.test.cjs` with every current reducer state and unknown-event compatibility case — FR-009, FR-010, NFR-015, PR-011.
- [ ] T031 [P] [US2] Add property cases to `tests/app/properties.test.cjs` for `principal = paid + forgiven + remaining` across scheduled and open-term event prefixes, with forgiveness only by the lender — FR-017–FR-019, SR-005, SR-010.
- [ ] T032 [US2] Add `app/features/state-contract.js` as a registry/projection wrapper over the injected golden reducer; it may name versions but must not reimplement transitions — FR-010, NFR-004, NFR-015.
- [ ] T033 [US2] Wire state/evidence-contract assertions into `tests/app/daftari.test.cjs`, `tests/app/borrower.test.cjs`, `tests/app/open-loan.test.cjs`, `tests/app/timeline.test.cjs`, `tests/app/dispute.test.cjs`, and `tests/app/proof.test.cjs` before any integration adjustment; preserve append-only dispute pause, neutral export, and no-verdict behavior — FR-011, FR-012, FR-016–FR-019, FR-029–FR-031.
- [ ] T034 [P] [US2] Add checks in `tests/app/app-offline.test.cjs` ensuring no `GRACE` persisted enum and no open-term `overdue` branch appears outside display/projection documentation — FR-018, NFR-015.
- [ ] T035 [US2] Refresh lifecycle sections in `docs/ARCHITECTURE.md` and `docs/PUBLISHABLE-PRODUCT-SPEC.md` to match the golden reducer and open-term projection — DR-014, NFR-014 — validate with domain-contract and doc-contract tests.

**Checkpoint**: One current state vocabulary and one conservation rule govern all present surfaces.

## Phase 5: User Story 3 — Remind Without Becoming a Collector (P1)

**Goal**: Prove finite, neutral, private reminder behavior and define the production notification seam.

**Independent test**: Cooldown, final stop, dispute stop, closure stop, grace path, and open-term exclusion
all work without added money or public naming.

- [ ] T036 [P] [US3] Add boundary cases for cooldown equality, repeated final tier, disputed records, closed records, open-term records, missing history, and no monetary increase to `tests/app/daftari.test.cjs` — FR-013–FR-015, FR-018, SR-009.
- [ ] T037 [P] [US3] Add Circle group-message cases to `tests/app/circle.test.cjs` proving no member name, amount, state, or trust signal identifies the late member — FR-021, NFR-010.
- [ ] T038 [US3] Implement only the minimal reminder guard changes in `app/features/daftari.js` and `app/features/circle.js` required by failing cases; no clock reads or message-provider call — NFR-003, FR-014.
- [ ] T039 [P] [US3] Create `specs/001-ahd-product-system/contracts/notification-port.md` defining neutral template input, finite cadence, privacy fields, provider receipt, stop conditions, and fail-closed behavior — NFR-018, SEC-008, SEC-010.
- [ ] T040 [US3] Add a provider-agnostic conformance test skeleton in `tests/contracts/notification-port.contract.cjs` that uses a fake adapter and fixed supplied dates; do not select or call a vendor — NFR-003, SEC-008.
- [ ] T041 [US3] Update `specs/001-ahd-product-system/traceability-source.json` and run `tests/app/daftari.test.cjs`, `tests/app/circle.test.cjs`, `tests/app/app-offline.test.cjs`, `tests/app/app-dom-smoke.cjs`, and `tests/app/master-spec-contract.test.cjs`, including the recoverable-rendering assertion — DR-013, NFR-011, NFR-014.

**Checkpoint**: Current reminders remain dignified and a future provider cannot weaken their rules.

## Phase 6: User Story 4 — Settle a Network With Consent (P1)

**Goal**: Preserve deterministic conservation and prevent a proposal from becoming committed without
all affected-party consent.

**Independent test**: For fixed single-currency edges, net positions are identical, ordering is stable,
revoked/missing consent blocks commit, and mercy deferral requires explicit creditor consent.

- [ ] T042 [P] [US4] Add consent-set completeness, changed-plan digest, duplicate consent, revocation-before-commit, and unrelated-party cases to `tests/app/settlement.test.cjs` — FR-026–FR-028, SEC-003, SEC-004.
- [ ] T043 [P] [US4] Add randomized deterministic integer-halala conservation properties to `tests/app/properties.test.cjs` without `Math.random`; use the existing seeded generator pattern — FR-026, SR-005, NFR-001.
- [ ] T044 [US4] Implement any missing plan-envelope validation in `app/features/settlement.js`; call the golden netting core and tiebreak unchanged — FR-026, NFR-004.
- [ ] T045 [P] [US4] Create `docs/reviews/D-7-multilateral-netting.md` from the decision template with technical mechanism, bilateral-source limits, exact scholarly question, options, and disable/qualification behavior — SR-014, PR-002 — do not record an AI ruling.
- [ ] T046 [P] [US4] Create `docs/reviews/D-8-mercy-first-consent.md` with declaration/creditor-consent mechanics, privacy risk, conservation proof, exact question, and options — FR-028, SR-015, PR-002.
- [ ] T047 [US4] [GATE: D-7 and D-8] After attributable qualified review exists, record the decisions in `docs/DECISIONS-FOR-MARWAN.md`, update only affected lifecycle wording, and rerun settlement/rifq/full gates — SR-014, SR-015, PR-002. Stop if evidence is absent.
- [ ] T048 [US4] Update `specs/001-ahd-product-system/traceability-source.json` with current mechanics and decision evidence; never change `DECISION-GATED` status from a draft packet alone — DR-013, JR-002.

**Checkpoint**: Technical netting stays proved; public Shariah framing stays qualified until reviewed.

## Phase 7: User Story 5 — Manage a Circle Without Public Shame (P2)

**Goal**: Preserve private shares, exact allocation, recurring provenance, and the no-pooled-custody boundary.

**Independent test**: Share totals conserve, self-debt is impossible, cycles are distinct, group reminders
do not identify a person, and graduation creates a new separately consented agreement.

- [ ] T049 [P] [US5] Add item-allocation remainder, empty assignment, duplicate member, self-payer, and cycle-collision properties to `tests/app/circle-adv.test.cjs` and `tests/app/standing-loan.test.cjs` — FR-020–FR-024, SR-005.
- [ ] T050 [US5] Implement minimal validation in `app/features/circle-adv.js` and `app/features/standing-loan.js`, reusing golden `respread` and seal helpers — NFR-004, FR-022–FR-024.
- [ ] T051 [P] [US5] Add assertions to `tests/app/circle.test.cjs`, `tests/app/org.test.cjs`, `tests/app/settings.test.cjs`, `tests/app/bounds.test.cjs`, `tests/app/refusal.test.cjs`, and `tests/app/shariah-basis.test.cjs` proving group privacy, own-history qualitative trust, presentation-only digits/masking, refusal boundaries, and sourced-versus-unresolved Shariah framing — FR-021, FR-032–FR-035, SR-007, DR-005.
- [ ] T052 [P] [US5] Create `docs/reviews/D-3-collect-before-spend.md` with the current `poolHeldByBank:false` sketch, custody/money-flow diagrams, pledge-then-pay option, drop option, licensed-custody option, and qualified-review question — FR-025, SR-012, SR-016, PR-002.
- [ ] T053 [US5] [GATE: D-3] Enable no collect-before-spend behavior. After attributable Shariah approval, create `specs/001-ahd-product-system/extensions/collect-before-spend/spec.md` and `tests/app/circle-collect-before-spend.test.cjs` before any implementation — FR-025, SR-012. Stop while D-3 is open.
- [ ] T054 [P] [US5] Create `docs/reviews/D-1-trust-disclosure.md` defining owner-push versus third-party-pull, linkability, coercion, revocation, recipient, no-third-party lookup, and no-underwriting constraints — SR-011, SR-017, SEC-014.
- [ ] T055 [US5] [GATE: D-1] Keep trust disclosure unavailable until privacy and Shariah approvals both exist; then write `specs/001-ahd-product-system/extensions/owner-trust-disclosure/spec.md` and `tests/app/owner-trust-disclosure.test.cjs` without changing the own-history/non-score invariant — SR-006, SR-007, SR-011.

**Checkpoint**: Circle remains a private collection of bilateral shares, not pooled custody or a social score.

## Phase 8: User Story 6 — Verify Evidence Independently (P2)

**Goal**: Make Open-Witness profile support, compatibility, and external-attestation boundaries explicit.

**Independent test**: Independent code reproduces MAIN and NEW-1, rejects tamper/unknown profiles, and
does not import Ahd runtime code.

- [ ] T056 [P] [US6] Write a failing profile-registry test in `tests/app/open-witness-registry.test.cjs` for profile name, schema version, canonicalization version, seal version, supported fixtures, and verifier module — FR-042, PR-011.
- [ ] T057 [US6] Add `protocol/profile-registry.cjs` containing metadata only; do not move formulas out of the canonical standard or import the engine — FR-042, NFR-005, PR-011.
- [ ] T058 [P] [US6] Add manifest hashes for published fixtures in `protocol/fixtures/manifest.json` and deterministic verification in `tests/app/open-witness-registry.test.cjs` — NFR-005, NFR-013.
- [ ] T059 [P] [US6] Extend `tests/app/open-witness.test.cjs` with malformed UTF-8-equivalent input, missing fields, wrong sequence, unsupported algorithm, and mismatched profile cases — NFR-005, SEC-006.
- [ ] T060 [US6] Make `protocol/verify-ahd-seal.cjs` fail closed for any uncovered failing cases while keeping Node built-ins only and reproducing pinned seals — FR-042, NFR-005, NFR-012.
- [ ] T061 [P] [US6] Reconcile timestamp targets in `docs/evidence/PATH-TO-PRODUCTION.md`, `_meta/deep-work/backend/seal-scheme-spec.md`, and `docs/specs/open-witness-v1.md` by recording one proposed attestation-digest target as `PLANNED`; do not alter v1 or claim TSA approval — FR-048, PR-005, PR-011.
- [ ] T062 [US6] [GATE: PR-005/PR-006] Implement bank-signature or TSA adapters only after approved providers, target digest, custody design, and conformance evidence exist; begin with failing intact/tampered/expired/revoked tests under `tests/contracts/` — SEC-009, PR-005, PR-006.
- [ ] T063 [US6] Run `tests/app/open-witness.test.cjs`, `tests/app/golden-vectors.test.cjs`, `tests/app/engine-parity.cjs`, and `protocol/verify-ahd-seal.cjs`; update `specs/001-ahd-product-system/traceability-source.json` with exact evidence — DR-013, NFR-014.

**Checkpoint**: Open verification remains truly independent; production identity/time/signature claims remain separate.

## Phase 9: User Story 7 — Inspect Claims and Impact Honestly (P2)

**Goal**: Make every visible claim reproducible, privacy-bounded, and correctly graded.

**Independent test**: Every displayed number resolves to source/model/fixture metadata; unsafe cohorts
are suppressed; no individual history or trust band is exported.

- [ ] T064 [P] [US7] Add a failing claim-registry test in `tests/app/evidence-trace.test.cjs` that extracts visible quantitative claims from active impact/market modules and requires source, period, geography, grade, and limitation — FR-038, DR-001, DR-002.
- [ ] T065 [US7] Add `app/features/evidence-registry.js` or extend `app/features/sources.js` as the single active claim metadata source, then make T064 green without upgrading grades — FR-038, DR-001–DR-003.
- [ ] T066 [P] [US7] Add privacy-floor boundary cases and no-row-after-suppression assertions to `tests/app/impact-drill.test.cjs` — FR-037, DR-004, DR-005.
- [ ] T067 [P] [US7] Add low/base/high range and category-mismatch assertions to `tests/app/market-model.test.cjs` and `tests/app/impact-national.test.cjs` — FR-039, DR-006, DR-007.
- [ ] T068 [US7] Implement only failing evidence/privacy corrections in `app/features/impact*.js`, `market-model.js`, `data-rigor.js`, and `sources.js`; keep fixtures labelled — FR-036–FR-039.
- [ ] T069 [P] [US7] Execute the approved `docs/evidence/DEMAND-SURVEY-KIT.md` only with owner ethics/privacy approval; store de-identified aggregate output and method under `docs/evidence/field/` — FR-050, DR-010, DR-011. Stop if approval or real data is absent.
- [ ] T070 [US7] [GATE: OT-A1/PR-012] Upgrade no demand/traction claim until sample, consent, method, limitations, and an approved `docs/evidence/field/demand-report.md` exist; then update `specs/001-ahd-product-system/traceability-source.json` through review — FR-050, DR-010, PR-012.
- [ ] T071 [US7] Update `specs/001-ahd-product-system/traceability-source.json` and rerun `tests/app/impact.test.cjs`, `tests/app/market-model.test.cjs`, `tests/app/data-rigor.test.cjs`, `tests/app/app-dom-smoke.cjs`, and `tests/run-all.cjs` — DR-013, NFR-014.

**Checkpoint**: Judges can distinguish measurement from model and Ahd leaks no individual score or history.

## Phase 10: User Story 8 — Demonstrate the Product Under Challenge (P2)

**Goal**: Freeze a truthful, memorable, three-minute path with current fallbacks.

**Independent test**: A presenter completes the primary story within three minutes, triggers tamper
detection, explains mercy and consented netting, and handles failure without a stale or inflated claim.

- [ ] T072 [P] [US8] Create `docs/pitch/rehearsal-log.md` with date, operator, build commit, path, elapsed time, observed failures, fallback used, gate banner, and Judge Lens scores — JR-006, JR-008.
- [ ] T073 [P] [US8] Add `tests/app/stage-artifact-drift.test.cjs` that verifies every referenced fallback image/video exists, carries a state label in its manifest, and matches the current primary screen key — FR-045, DR-009, JR-005.
- [ ] T074 [US8] Create or refresh `docs/pitch/stage-artifact-manifest.json` from current judge-visible assets and record any approved design-transfer baseline in `docs/design-transfer/baseline-manifest.json`; do not regenerate media unless T073 proves it stale — FR-046, DR-009, JR-005.
- [ ] T075 [US8] Rehearse `docs/pitch/script-ar.md` against the live app and `server/demo-bank-node.cjs`, record actual elapsed time and failures, and keep claims inside evidence grades — JR-001, JR-002, JR-006.
- [ ] T076 [P] [US8] Run `node tests/app/app-dom-smoke.cjs`, `node tests/app/app-offline.test.cjs`, `node tests/stage-preflight.cjs`, and `node tests/run-all.cjs`; verify Arabic/RTL, presentation-only digits, keyboard/touch accessibility, and reduced motion before correcting any drift in `docs/PRESENTER-GUIDE.md` — NFR-006–NFR-009, JR-003, JR-004.
- [ ] T077 [US8] Score innovation, technical, data, UX, feasibility, and tired-judge memorability in `docs/pitch/rehearsal-log.md` with one evidence line each — JR-008, JR-009.
- [ ] T078 [US8] Add or update a `JL-` item in `_meta/OPEN-ITEMS.md` for every score below 8; do not close it until a new rehearsal proves the fix — JR-009.
- [ ] T079 [US8] [GATE: JR-007] Insert official team names/templates/files only from owner or organizer artifacts recorded in `docs/pitch/official-assets-register.md`; never infer missing details — JR-007, JR-010.
- [ ] T080 [US8] Freeze the primary path only after T072–T079 and the full gate are green; record commit and rollback artifact in `_meta/STATUS.md` and `AmadHackathon/` — JR-005, JR-006.

**Checkpoint**: The stage path is current, timed, evidence-backed, and recoverable.

## Phase 11: User Story 9 — Operate a Controlled Local Bank Walkthrough (P3)

**Goal**: Keep the real HTTP proof reliable and safe inside its declared localhost boundary.

**Independent test**: Authenticated create/seal, public holder verification, persistence, tamper detection,
and static health succeed; internet-oriented limits remain explicitly absent or safely bounded.

- [ ] T081 [P] [US9] Add a passing authorization-gap characterization test to `tests/app/server-auth.test.cjs` showing a valid unrelated actor token can currently name other parties, plus a failing production-profile test that rejects treating this behavior as SEC-002 compliance — SEC-002, FR-043.
- [ ] T082 [P] [US9] Add failing request-body byte, JSON-depth, string-length, edge-count, and timeout boundary tests in `tests/app/server-limits.test.cjs` using the pure router/binder seams — PR-009, SEC-007.
- [ ] T083 [US9] Implement configurable conservative demo limits in a new `server/limits.cjs` and integrate them into `server/http.cjs`/`router.cjs`; defaults must preserve the stage vectors — PR-009, SEC-007.
- [ ] T084 [P] [US9] Add rejection assertions to `tests/app/server-auth.test.cjs` and `tests/app/server-persistence.test.cjs` proving no JSONL `PUT`, no seal, and no partial business state — SEC-004, SEC-007.
- [ ] T085 [P] [US9] Add a failing source/behavior test that production mode cannot start with public `/list`; keep current default localhost demo behavior stable — SEC-005.
- [ ] T086 [US9] Add an explicit `AHD_SERVER_PROFILE=local-demo` startup contract and reject any attempted production profile in `server/http.cjs` until a separate service exists — FR-043, FR-049, SEC-005.
- [ ] T087 [P] [US9] Correct `docs/ARCHITECTURE.md` and root `README.md` for auth-versus-authorization, public-list risk, loopback Docker behavior, durable-not-atomic append, and required live smoke — NFR-014, JR-002.
- [ ] T088 [US9] Do not retrofit production identity into `server/auth.cjs`; document the future port in `contracts/production-seams.md` and keep server status `DEMO-ONLY` — FR-043, FR-044, FR-047.
- [ ] T089 [US9] Run `tests/app/server-parity.test.cjs`, `tests/app/server-auth.test.cjs`, `tests/app/server-persistence.test.cjs`, `tests/app/server-health.test.cjs`, `tests/app/app-offline.test.cjs`, and `tests/run-all.cjs`; update `specs/001-ahd-product-system/traceability-source.json` with results — NFR-014, DR-013.

**Checkpoint**: The local proof is safer and clearer, but still cannot be mistaken for production.

## Phase 12: User Story 10 — Progress to Production Through Explicit Gates (P3)

**Goal**: Build provider-agnostic controls and evidence gates, then integrate only after approvals.

**Independent test**: Missing/invalid/expired/revoked evidence fails closed; every mutation is authorized,
idempotent, bounded, auditable, and versioned; launch stays blocked until all mandatory evidence exists.

### Provider-Agnostic Contract Harnesses

- [ ] T090 [P] [US10] Create failing fake-adapter conformance tests for identity assertion verification in `tests/contracts/identity-port.contract.cjs` — FR-047, PR-004, SEC-001.
- [ ] T091 [P] [US10] Create failing authorization matrix tests in `tests/contracts/authorization-port.contract.cjs` for create, seal, forgive, replace, net, reconcile, export, and operator actions — SEC-002.
- [ ] T092 [P] [US10] Create failing what-you-see-is-what-you-sign tests in `tests/contracts/consent-port.contract.cjs` — FR-047, SEC-003.
- [ ] T093 [P] [US10] Create failing idempotency/replay/version-precondition tests in `tests/contracts/command-port.contract.cjs` — NFR-020, SEC-004.
- [ ] T094 [P] [US10] Create failing holder-supplied verification and non-enumeration tests in `tests/contracts/evidence-port.contract.cjs` — FR-042, SEC-005.
- [ ] T095 [P] [US10] Create failing schema/integer-money tests in `tests/contracts/schema-port.contract.cjs` — SR-005, SEC-006.
- [ ] T096 [P] [US10] Create failing rate/body/depth/edge/page/timeout/concurrency tests in `tests/contracts/abuse-port.contract.cjs` — PR-009, SEC-007.
- [ ] T097 [P] [US10] Create failing privacy-safe audit tests in `tests/contracts/audit-port.contract.cjs`, including forbidden secret, trust, hardship, and raw identity fields — SEC-008.
- [ ] T098 [P] [US10] Create failing key metadata/rotation/revocation/history tests in `tests/contracts/signing-port.contract.cjs` using a fake non-production signer — NFR-019, PR-006, SEC-009.
- [ ] T099 [P] [US10] Create failing residency/encryption/subprocessor evidence tests in `tests/contracts/residency-port.contract.cjs` using evidence fixtures only — NFR-017, PR-007, SEC-010.
- [ ] T100 [P] [US10] Create failing retention/legal-hold/access/export/deletion-outcome tests in `tests/contracts/data-policy-port.contract.cjs` — PR-010, SEC-011.
- [ ] T101 [P] [US10] Create failing incident/restore/RTO/RPO/degraded-mode evidence tests in `tests/contracts/operations-port.contract.cjs` — NFR-016, PR-014, SEC-012.
- [ ] T102 [P] [US10] Create failing release-manifest, secret-exclusion, dependency/base-image pin, provenance, and least-privilege tests in `tests/contracts/release-port.contract.cjs` — SEC-013.
- [ ] T103 [P] [US10] Create a privacy-harm abuse-case suite in `tests/contracts/privacy-harm.contract.cjs` covering linkability, coercive disclosure, trust reuse, hardship exposure, and cross-context IDs — SEC-014.

### Additive Ports and Fakes

- [ ] T104 [US10] Implement provider-neutral port interfaces and deterministic fake adapters under `production/ports/` and `production/fakes/` solely to satisfy T090–T103; no network calls, real identities, or provider branding — FR-047–FR-049, SEC-001–SEC-014.
- [ ] T105 [US10] Add `production/README.md` stating that passing fake conformance tests does not close any external gate or constitute a production service — JR-002, PR-015.
- [ ] T106 [US10] Add the contract harness to `tests/app/run-app-tests.cjs` or the appropriate auto-discovery boundary without weakening offline checks — NFR-012, NFR-014.

### Decision and External Evidence

- [ ] T107 [P] [US10] Create `docs/reviews/D-6-fee-model.md` from the decision template, covering payer and organization authority, separate service, direct-cost basis, zero link to principal/time/delay, free core, disclosures, accounting, and refunds — FR-040, FR-041, SR-013, SR-018, PR-013.
- [ ] T108 [US10] [GATE: D-6] Keep all charging disabled until attributable Shariah, legal, accounting, and commercial approvals exist; then create `specs/001-ahd-product-system/extensions/approved-fee-model/spec.md` and `tests/app/approved-fee-model.test.cjs` — FR-040, SR-013, PR-013.
- [ ] T109 [P] [US10] Create evidence-register rows under `docs/reviews/external-gates/` for PR-001 through PR-007 and PR-012 through PR-015 using the template, all initially `MISSING` unless a real artifact is verified — PR-001–PR-015.
- [ ] T110 [US10] [GATE: PR-004] Select and implement `production/adapters/identity-provider.cjs` only after `docs/reviews/external-gates/PR-004.md` contains approved private-debt use-case evidence and conformance criteria — FR-047, PR-004, SEC-001–SEC-003.
- [ ] T111 [US10] [GATE: PR-005] Select and implement `production/adapters/trusted-time.cjs` only after `docs/reviews/external-gates/PR-005.md` defines the timestamp target, accredited provider, retention, certificate, expiry, and revocation behavior — FR-048, PR-005.
- [ ] T112 [US10] [GATE: PR-006] Implement `production/adapters/witness-signing.cjs` only after `docs/reviews/external-gates/PR-006.md` approves the HSM/KMS design and key ceremonies — PR-006, SEC-009.
- [ ] T113 [US10] [GATE: PR-007/PR-010] Implement `production/adapters/record-store.cjs` and `production/adapters/operations.cjs` only after `docs/reviews/external-gates/PR-007.md` and `docs/reviews/external-gates/PR-010.md` approve residency, access, backup, retention, deletion, legal hold, monitoring, and incident evidence — FR-049, PR-007, PR-010, SEC-010–SEC-012.
- [ ] T114 [US10] [GATE: PR-012] Enable `production/adapters/pilot-gate.cjs` only after `docs/reviews/external-gates/PR-012.md` approves the cohort, consent, support, incident, success, and stop criteria — FR-050, PR-012.
- [ ] T115 [US10] [GATE: PR-001/PR-003] Make no external-launch, legal-effect, legal-article, or court-volume claim until `docs/reviews/external-gates/PR-001.md` and `docs/reviews/external-gates/PR-003.md` are verified — DR-012, PR-001, PR-003, JR-010.
- [ ] T116 [US10] Build `project/spec-tools/check-launch-readiness.cjs` to fail unless every mandatory gate has valid, attributable, in-scope, unexpired evidence and passing conformance tests — PR-015, SEC-001–SEC-014.

**Checkpoint**: Fakes can prove interfaces, but only real evidence can unlock real providers or launch.

## Phase 13: Final Cross-Artifact Analysis and Release Gate

- [ ] T117 [P] [US8] Run specification hygiene: `git diff --check -- specs/001-ahd-product-system` and a placeholder scan limited to delivered artifacts — DR-013.
- [ ] T118 [P] [US8] Run the SpecKit cross-artifact analysis against `.specify/memory/constitution.md`, `specs/001-ahd-product-system/spec.md`, `specs/001-ahd-product-system/plan.md`, `specs/001-ahd-product-system/contracts/`, and `specs/001-ahd-product-system/tasks.md`; resolve every critical conflict before implementation — SC-013, DR-013.
- [ ] T119 [US8] Run all focused suites added by completed tasks, then run `node tests/run-all.cjs`; zero failures required — NFR-014, JR-003.
- [ ] T120 [US8] Re-run the frozen-demo tripwire and independent verifier commands from `specs/001-ahd-product-system/quickstart.md` through `protocol/verify-ahd-seal.cjs`; any drift blocks release — NFR-005, NFR-013.
- [ ] T121 [P] [US8] Score the resulting judge-visible artifacts in `docs/pitch/rehearsal-log.md`; create `JL-` items for scores below 8 — JR-008, JR-009.
- [ ] T122 [US8] Update `_meta/INDEX.md`, `_meta/STATUS.md`, `_meta/OPEN-ITEMS.md`, `_meta/overnight-log.md`, and the relevant `AmadHackathon/` notes with source pointers and live results — DR-008, NFR-014.
- [ ] T123 [US8] Verify `git status --short` and stage only paths owned by the completed slice listed in `specs/001-ahd-product-system/tasks.md`; preserve unrelated user and concurrent-agent work — NFR-014.
- [ ] T124 [US8] Commit the completed slice with requirement/story references and record the commit in `specs/001-ahd-product-system/traceability-source.json` — DR-013.

## Dependencies and Execution Order

### Phase Dependencies

```text
Phase 1 specification controls
  -> Phase 2 shared foundations
     -> US1, US2, US3 assurance (P1)
     -> US4 and US5 decision packets
     -> US6 protocol governance
     -> US7 evidence rigor
     -> US8 stage readiness
     -> US9 local-demo hardening
     -> US10 production contracts and external gates
        -> Phase 13 release analysis
```

- Phase 1 blocks all implementation because requirement/inventory drift must be visible first.
- Phase 2 blocks production-port work and supplies decision/evidence templates.
- US1–US3 can proceed independently after Phase 2 when file ownership does not overlap.
- US4 and US5 technical assurance can proceed; gated enablement tasks T047, T053, and T055 cannot.
- US6 registry work can proceed; real signature/TSA work T062 cannot.
- US7 current evidence assurance can proceed; real field-claim upgrade T069–T070 cannot without approval/data.
- US8 is competition-critical and should precede post-freeze server/production work.
- US9 hardening remains local-demo-only and does not unblock production.
- US10 fake contract harnesses can proceed; provider tasks T110–T115 cannot proceed without evidence.

### Parallel Opportunities

| Parallel set | Safe because |
|---|---|
| T014, T015, T016, T017, T018 | Separate security/review documents and one shared static test coordinated before merge |
| US2, US3, US5, US7 assurance | Distinct feature/test files after shared foundation |
| T045, T046, T052, T054, T107 | Separate decision packets; none enables behavior |
| T056–T059 | Registry, manifest, and verifier tests use separate initial files |
| T072–T074 | Rehearsal log, drift test, and asset manifest are separate |
| T090–T103 | One contract file per port/control family |
| T109 evidence rows | One file per external gate under `docs/reviews/external-gates/` |

Tasks that touch `app/app.js`, `app/index.html`, `docs/ARCHITECTURE.md`, `tests/structure-check.cjs`,
or shared test runners are not parallel unless ownership is explicitly serialized.

## Requirement Coverage Summary

| Requirement family | Primary task coverage |
|---|---|
| FR-001–FR-050 | T001–T009 and story phases US1–US10 |
| SR-001–SR-018 | universal stop rules, T023–T055, T095, T107–T108 |
| NFR-001–NFR-020 | Phase 1/2, state/protocol assurance, T093, T101, final gate |
| DR-001–DR-015 | traceability foundation, US7, retention/evidence tasks |
| PR-001–PR-015 | threat model, production ports, evidence register, launch checker |
| SEC-001–SEC-014 | T014–T020, T090–T116 |
| JR-001–JR-010 | US8 and Phase 13 |

The generated `traceability.json`, not this summary range table, must prove one-to-one coverage.

## MVP and Delivery Strategy

### Competition-Safe MVP Before Freeze

Complete:

1. Phase 1 specification controls;
2. Phase 2 documentation/hygiene work that does not risk the stage path;
3. US1/US2/US6 assurance with no visible redesign;
4. US8 rehearsal and fallbacks; and
5. Phase 13 analysis and gate.

Defer behavior-changing server limits and production fakes until after the competition freeze unless
a failing stage-critical issue requires them.

### Post-Freeze Increment

Execute US3–US7 remaining assurance, US9 local-demo hardening, then US10 provider-neutral contract
harnesses. Decision packets can be reviewed in parallel by their human owners.

### Production Increment

Only after external evidence closes: implement one adapter at a time, begin with its failing contract
tests, preserve deterministic domain behavior, and keep launch blocked until T116 passes.

## Completion Definition

A task is complete only when its focused test/validation passes, requirement evidence is updated,
no lifecycle status is inflated, no unrelated changes are staged, and the relevant checkpoint is green.
The portfolio is not production-complete until every mandatory external gate is closed; documentation
and fake adapters alone never satisfy that condition.
