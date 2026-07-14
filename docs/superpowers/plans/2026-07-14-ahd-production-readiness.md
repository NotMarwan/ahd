# Ahd Production Readiness and External Gates Implementation Plan

> **Required execution mode:** Use `executing-plans` for the provider-neutral tasks. Stop at every
> `[EXTERNAL GATE]` step until attributable approval evidence exists. Fake adapters never authorize
> a real integration or launch.

**Goal:** Turn production ambition into fail-closed contracts, conformance tests, owner evidence, and
an executable launch blocker without changing the offline product or pretending providers are live.

**Architecture:** Keep the deterministic domain core isolated. Define CommonJS port contracts and
deterministic fakes under `production/`. Test them under `tests/contracts/`. Store owner evidence under
`docs/reviews/`. A zero-dependency readiness checker blocks launch unless every mandatory gate is
valid, scoped, current, and linked to passing conformance evidence.

**Tech stack:** Node.js CommonJS/built-ins only for contracts and checks; Markdown/JSON for evidence;
existing project test harness. Real vendor SDKs, databases, cloud, HSM, TSA, identity, and payment
rails are deliberately absent until approved.

**Source requirements:** FR-047–FR-050, NFR-016–NFR-020, DR-015, PR-001–PR-015,
SEC-001–SEC-014, JR-002, JR-010.

**Never do in this plan:** store a real national ID/biometric, choose a provider without authority,
claim legal/Shariah/regulatory approval, modify v1 canonical bytes, or send a network request.

---

## Task 1: Publish the Formal Threat and Control Model

**Files:**

- Create: `docs/security/THREAT-MODEL.md`
- Create: `docs/security/CONTROL-MATRIX.md`
- Create: `docs/security/DATA-POLICY-CLASSES.md`
- Create: `tests/app/security-doc-contract.test.cjs`

### Step 1: Write the failing static contract

The test reads all three files and requires:

```js
const requiredThreats = [
  "Spoofing", "Tampering", "Repudiation", "Information disclosure",
  "Denial of service", "Elevation of privilege", "Linkability",
  "Non-repudiation privacy harm"
];
const requiredBoundaries = [
  "Client", "Identity provider", "Signature provider", "API gateway",
  "Application service", "Event store", "HSM/KMS", "TSA",
  "Settlement rail", "Independent verifier", "Operator support", "Logs and analytics"
];
const requiredAbuseCases = [
  "forged consent", "unauthorized forgiveness", "unauthorized netting",
  "evidence enumeration", "trust-band export", "penalty injection",
  "riba normalization mismatch", "AI output represented as fatwa"
];
```

It also parses SEC-001 through SEC-014 from `spec.md` and requires one control-matrix row per ID.

### Step 2: Run red

```powershell
node tests/app/security-doc-contract.test.cjs
```

Expected: missing documents.

### Step 3: Author the threat model

For each trust boundary, document:

- assets and personal-data classes;
- entry/exit data;
- STRIDE threats;
- LINDDUN privacy harms;
- Ahd-specific spine abuse;
- preventive/detective/recovery controls;
- residual risk;
- requirement IDs; and
- evidence required to close it.

Do not mark mitigations implemented when only specified.

### Step 4: Author the control matrix

Columns:

```text
Control ID | Lifecycle | Threats | Owner class | Prevent | Detect | Recover | Test path | Evidence path | Failure behavior
```

Every control initially points to a gap or provider-neutral conformance test. `EXTERNAL-GATED` controls
remain external-gated.

### Step 5: Author data policy classes

Use R0 through R5 from `data-model.md`. State no exact retention duration. Include legal hold,
subject access, deletion refusal, backup expiry, key-destruction caveat, residency breadth, and
linkability of hashes/pseudonyms.

### Step 6: Verify and commit

```powershell
node tests/app/security-doc-contract.test.cjs
git diff --check -- docs/security tests/app/security-doc-contract.test.cjs
git add docs/security tests/app/security-doc-contract.test.cjs
git commit -m "docs(security): define Ahd threat and control model"
```

---

## Task 2: Build the Provider-Neutral Port Contract Harness

**Files:**

- Create: `production/ports/contract.cjs`
- Create: `production/ports/result.cjs`
- Create: `production/README.md`
- Create: `tests/contracts/port-contract.test.cjs`

### Step 1: Write failing contract-result tests

Create `tests/contracts/port-contract.test.cjs` with these exact behaviors:

```js
const Result = require("../../production/ports/result.cjs");
const Contract = require("../../production/ports/contract.cjs");

ok(Result.valid({ ref: "A-1" }).status === "VALID", "valid result is explicit");
ok(Result.invalid("expired").status === "INVALID", "invalid result is explicit");
ok(Result.unavailable("provider unavailable").status === "UNAVAILABLE", "unavailable is explicit");
throws(function () { Contract.requireMethod({}, "verify"); }, /verify/, "missing adapter method fails closed");
throws(function () { Contract.requireValid(Result.unavailable("down")); }, /UNAVAILABLE/,
  "unavailable evidence cannot be treated as valid");
```

### Step 2: Run red

```powershell
node tests/contracts/port-contract.test.cjs
```

### Step 3: Implement fail-closed results

`production/ports/result.cjs`:

```js
"use strict";

function make(status, detail) {
  return Object.freeze(Object.assign({ status: status }, detail || {}));
}

module.exports = {
  valid: function (detail) { return make("VALID", detail); },
  invalid: function (reason) { return make("INVALID", { reason: String(reason) }); },
  unavailable: function (reason) { return make("UNAVAILABLE", { reason: String(reason) }); }
};
```

`production/ports/contract.cjs`:

```js
"use strict";

function requireMethod(adapter, method) {
  if (!adapter || typeof adapter[method] !== "function") {
    throw new Error("adapter method required: " + method);
  }
  return adapter[method].bind(adapter);
}

function requireValid(result) {
  if (!result || result.status !== "VALID") {
    throw new Error("external evidence is not VALID: " + (result && result.status || "MISSING"));
  }
  return result;
}

module.exports = { requireMethod: requireMethod, requireValid: requireValid };
```

### Step 4: State the fake boundary

`production/README.md` must say:

- this directory is provider-neutral contract scaffolding;
- it contains no production service;
- fakes use synthetic opaque references only;
- passing tests does not close PR/SEC external gates;
- the offline app and local demo do not import it; and
- real adapters require a separate approved implementation plan.

### Step 5: Verify and commit

```powershell
node tests/contracts/port-contract.test.cjs
git diff --check -- production tests/contracts
git add production/ports production/README.md tests/contracts/port-contract.test.cjs
git commit -m "test(production): add fail-closed port contracts"
```

---

## Task 3: Implement Deterministic Fake Identity, Authorization, and Consent Ports

**Files:**

- Create: `production/ports/identity.cjs`
- Create: `production/ports/authorization.cjs`
- Create: `production/ports/consent.cjs`
- Create: `production/fakes/identity.cjs`
- Create: `production/fakes/authorization.cjs`
- Create: `production/fakes/consent.cjs`
- Create: `tests/contracts/identity-port.contract.cjs`
- Create: `tests/contracts/authorization-port.contract.cjs`
- Create: `tests/contracts/consent-port.contract.cjs`

### Step 1: Write failing identity cases

Cases: valid opaque subject; missing assertion; wrong assurance; expired; revoked; raw biometric field;
raw national-ID field; provider unavailable. Invalid/unavailable fail closed.

Expected valid result shape:

```json
{
  "status": "VALID",
  "subject_ref": "subj-pairwise-001",
  "assurance": "approved-test-assurance",
  "provider_ref": "fake-provider",
  "transaction_ref": "fake-txn-001"
}
```

### Step 2: Write failing authorization matrix

Use synthetic records with roles. Required decisions:

| Action | Allowed subject |
|---|---|
| create draft | initiating affected party or bounded operator |
| seal | both required party consents plus witness operator |
| forgive | lender only |
| pay | borrower/payer or verified rail actor |
| replace terms | both affected parties |
| commit netting | every affected party |
| export evidence | affected party or approved lawful authority |
| view trust band | subject themselves only |

Every other case denies. Authentication alone never allows.

### Step 3: Write failing consent cases

Bind:

```text
party_ref | action | covered_digest | record_profile | state_machine_version | nonce | supplied_time
```

Changing any field invalidates the fake signature reference. Duplicate nonce/replay is rejected.

### Step 4: Implement pure ports and fakes

Ports validate required input and delegate through `requireMethod`. Fakes use fixed maps and Node
`crypto` only for deterministic test references. They perform no network call and contain no real
identity data.

### Step 5: Verify

```powershell
node tests/contracts/identity-port.contract.cjs
node tests/contracts/authorization-port.contract.cjs
node tests/contracts/consent-port.contract.cjs
node tests/app/app-offline.test.cjs
```

Expected: all green; offline app does not import `production/`.

### Step 6: Commit

```powershell
git add production/ports production/fakes tests/contracts
git commit -m "feat(production): specify identity authorization consent ports"
```

---

## Task 4: Implement Deterministic Fake Command, Evidence, and Schema Ports

**Files:**

- Create: `production/ports/command.cjs`
- Create: `production/ports/evidence.cjs`
- Create: `production/ports/schema.cjs`
- Create: `production/fakes/command.cjs`
- Create: `production/fakes/evidence.cjs`
- Create: `tests/contracts/command-port.contract.cjs`
- Create: `tests/contracts/evidence-port.contract.cjs`
- Create: `tests/contracts/schema-port.contract.cjs`

### Step 1: Write failing command cases

Require idempotency key, expected record version, command nonce, actor authorization result, and
exact payload digest. Same key and digest returns the same result; same key with different digest is a
409 conflict; version mismatch creates no event.

### Step 2: Write failing evidence cases

Verification accepts a holder-supplied bundle or non-enumerable capability. It has no list/search
method. Unknown/unauthorized record responses must be indistinguishable at the contract boundary.

### Step 3: Write failing schema cases

Reject:

- unsafe or non-integer `amount_halalas`;
- non-`SAR` currency;
- mixed-currency netting;
- same lender/borrower;
- unknown required profile;
- malformed 64-hex digests;
- `GRACE` as a stored state;
- transport metadata inside canonical v1 fields; and
- unbounded strings/arrays.

### Step 4: Implement minimal pure contracts

Use `data-model.md` and no external schema dependency. Keep error codes stable and content-neutral.

### Step 5: Verify and commit

```powershell
node tests/contracts/command-port.contract.cjs
node tests/contracts/evidence-port.contract.cjs
node tests/contracts/schema-port.contract.cjs
node tests/app/golden-vectors.test.cjs
git add production/ports production/fakes tests/contracts
git commit -m "feat(production): specify command evidence schema ports"
```

---

## Task 5: Implement Fake Security and Operations Ports

**Files:**

- Create: `production/ports/abuse.cjs`
- Create: `production/ports/audit.cjs`
- Create: `production/ports/signing.cjs`
- Create: `production/ports/residency.cjs`
- Create: `production/ports/data-policy.cjs`
- Create: `production/ports/operations.cjs`
- Create: `production/ports/release.cjs`
- Create: matching deterministic fakes under `production/fakes/`
- Create: matching `tests/contracts/*-port.contract.cjs` suites

### Step 1: Write tests first

Required contract behaviors:

- abuse: endpoint/tenant/subject/network/resource budgets; 429 plus retry; no event on rejection;
- audit: forbid secrets, tokens, raw identity, trust band, hardship narrative, and unnecessary terms;
- signing: key ID/version, separate domain, rotation, revocation, historical verification;
- residency: evidence covers primary, backups, logs, telemetry, DR, support, subprocessors;
- data policy: R0–R5, legal hold, access/export, deletion outcome, backup expiry;
- operations: incident severity/owner/escalation, reconciliation, restore, RTO/RPO evidence;
- release: pinned manifest, secret exclusion, provenance, least privilege, dependency/base-image scan.

### Step 2: Implement deterministic fakes

Fakes return fixed evidence records. They must never call a clock; timestamps are supplied by tests.
They must never be named after a real provider.

### Step 3: Run all contract suites

```powershell
Get-ChildItem tests/contracts -Filter *.contract.cjs | Sort-Object Name | ForEach-Object {
  node $_.FullName
  if ($LASTEXITCODE -ne 0) { throw "contract suite failed: $($_.Name)" }
}
```

### Step 4: Prove isolation

Add an offline/static assertion that no file under `app/`, `demo/`, or `protocol/` imports
`production/`. Open-Witness stays independent.

### Step 5: Commit

```powershell
git add production/ports production/fakes tests/contracts tests/app/app-offline.test.cjs
git commit -m "feat(production): add security operations conformance fakes"
```

---

## Task 6: Create Decision Packets and External Evidence Register

**Files:**

- Create: `docs/reviews/DECISION-PACKET-TEMPLATE.md`
- Create: `docs/reviews/EXTERNAL-GATE-EVIDENCE-TEMPLATE.md`
- Create: `docs/reviews/D-1-trust-disclosure.md`
- Create: `docs/reviews/D-3-collect-before-spend.md`
- Create: `docs/reviews/D-6-fee-model.md`
- Create: `docs/reviews/D-7-multilateral-netting.md`
- Create: `docs/reviews/D-8-mercy-first-consent.md`
- Create: `docs/reviews/external-gates/register.json`
- Create: `tests/app/review-evidence-contract.test.cjs`

### Step 1: Write failing required-field tests

Decision packets require:

```text
Decision ID
Affected requirements
Current disabled/qualified behavior
Actors and authority
Money/data flow
Exact question
Cited sources and limitations
Options
Recommendation
Rollback/disable behavior
Owner
Decision status
Decision artifact/signature/date
```

External rows require:

```json
{
  "id": "PR-004",
  "status": "MISSING",
  "owner_class": "identity-and-trust-provider owner",
  "authority": "approved provider and bank owner",
  "scope": "private interpersonal qard identity and exact-action signature",
  "artifact": null,
  "issued_on": null,
  "expires_on": null,
  "verification": "NOT_VERIFIED",
  "conformance_tests": ["tests/contracts/identity-port.contract.cjs", "tests/contracts/consent-port.contract.cjs"],
  "limitations": ["No public confirmation currently closes this use case"]
}
```

### Step 2: Author packets without rulings

Copy the exact known mechanics and open questions from `docs/DECISIONS-FOR-MARWAN.md`. The packet status
remains `PENDING`. Do not add a scholar, regulator, counsel, or provider answer.

### Step 3: Complete register rows

Include PR-001 through PR-007 and PR-012 through PR-015. Use `MISSING` unless an attributable artifact
is inspected. Drafts and agent summaries do not become `VALID`.

### Step 4: Verify and commit

```powershell
node tests/app/review-evidence-contract.test.cjs
git diff --check -- docs/reviews
git add docs/reviews tests/app/review-evidence-contract.test.cjs
git commit -m "docs(readiness): structure decisions and external gates"
```

---

## Task 7: Build the Launch Readiness Blocker

**Files:**

- Create: `project/spec-tools/check-launch-readiness.cjs`
- Create: `tests/app/launch-readiness.test.cjs`
- Modify: `docs/reviews/external-gates/register.json`

### Step 1: Write failing fixture-based tests

Use temporary registers. Required cases:

- all `MISSING` exits 1 and lists all blockers;
- `VALID` with missing artifact path exits 1;
- expired evidence exits 1;
- valid artifact but missing conformance suite exits 1;
- decision packet pending exits 1;
- a complete synthetic fixture register exits 0;
- output never says production-ready when any mandatory gate is not valid.

### Step 2: Implement checker rules

For each mandatory gate:

1. status is exactly `VALID`;
2. owner and authority are non-empty;
3. artifact path exists inside the repository or an approved external locator is recorded with hash;
4. issue date is present;
5. expiry is absent or after an injected `AS_OF` argument;
6. verification is `VERIFIED`;
7. every named conformance test exists and has a recorded passing result; and
8. limitations do not exclude the intended launch scope.

The checker accepts `--as-of YYYY-MM-DD` and never reads wall-clock time.

### Step 3: Run red current state

```powershell
node project/spec-tools/check-launch-readiness.cjs --as-of 2026-07-14
```

Expected: non-zero with honest blockers. This is success for the current project state.

### Step 4: Run test fixtures

```powershell
node tests/app/launch-readiness.test.cjs
```

Expected: green; current real register remains blocked.

### Step 5: Commit

```powershell
git add project/spec-tools/check-launch-readiness.cjs tests/app/launch-readiness.test.cjs docs/reviews/external-gates/register.json
git commit -m "feat(readiness): fail closed on external launch gates"
```

---

## Task 8: Integrate One Real Adapter at a Time [EXTERNAL GATE]

Do not execute this task in the current state.

Required order after evidence exists:

1. identity use-case and exact-action signature provider — PR-004, SEC-001–SEC-003;
2. approved record/event storage and Saudi residency — PR-007, PR-010, SEC-010–SEC-011;
3. HSM/KMS witness signing — PR-006, SEC-009;
4. canonical TSA target and approved timestamp provider — PR-005;
5. settlement receipt/rail — approved regulatory and operations path;
6. notification provider — privacy/residency/cadence policy; and
7. pilot — PR-012.

For each adapter:

- create a separate specification and writing plan;
- copy the provider-neutral contract suite;
- add invalid, unavailable, expired, revoked, replay, and rollback cases first;
- keep deterministic domain logic independent;
- record provider/version/evidence references;
- run security, privacy, recovery, full gate, and Judge Lens review; and
- leave launch blocked until the full register passes.

No vendor is named in this plan because none is approved.

---

## Task 9: Final Verification

### Step 1: Run all provider-neutral suites

```powershell
node tests/app/security-doc-contract.test.cjs
node tests/app/review-evidence-contract.test.cjs
node tests/app/launch-readiness.test.cjs
Get-ChildItem tests/contracts -Filter *.contract.cjs | Sort-Object Name | ForEach-Object {
  node $_.FullName
  if ($LASTEXITCODE -ne 0) { throw "contract suite failed: $($_.Name)" }
}
```

### Step 2: Confirm real launch remains blocked

```powershell
node project/spec-tools/check-launch-readiness.cjs --as-of 2026-07-14
```

Expected now: non-zero because external approvals are missing.

### Step 3: Run full gate

```powershell
cd tests
node run-all.cjs
cd ..
```

Expected: zero project-test failures. A blocked launch checker is not a project-test failure; it is the
correct product state until evidence closes.

### Step 4: Update traceability and status

Mark provider-neutral contracts as implemented evidence. Do not move external requirements to `BUILT`.
Record missing gates explicitly.

## Completion Criteria

- All 14 SEC controls have threats, owners, tests, evidence needs, and failure behavior.
- Provider-neutral ports and fakes pass without network or real data.
- Identity, authorization, consent, and attestation remain separate.
- External decisions/evidence are structured but not fabricated.
- Current real readiness checker fails closed.
- Offline app, golden engine, and independent verifier remain isolated.
- No production lifecycle status is inflated.
