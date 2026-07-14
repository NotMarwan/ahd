# Quickstart: Review and Validate the Ahd Master Specification

**Audience**: Product, engineering, Shariah, legal, privacy, operations, and judge-package reviewers

**Prerequisites**: Windows PowerShell, Node.js 18 or newer, repository root as current directory

## 1. Read the Source-of-Truth Chain

Review in this order:

1. `.specify/memory/constitution.md`
2. `specs/001-ahd-product-system/spec.md`
3. `specs/001-ahd-product-system/clarity-review.md`
4. `specs/001-ahd-product-system/plan.md`
5. `specs/001-ahd-product-system/research.md`
6. `specs/001-ahd-product-system/data-model.md`
7. `specs/001-ahd-product-system/contracts/`
8. `specs/001-ahd-product-system/tasks.md`
9. `docs/DECISIONS-FOR-MARWAN.md`
10. `docs/JUDGE-LENS.md`

Use the live repository and gate to verify `BUILT` claims. Use the decision register and evidence
files to verify gated claims. Do not resolve a Shariah question by inference.

## 2. Validate Specification Hygiene

From repository root:

```powershell
git diff --check -- specs/001-ahd-product-system
$markers = @('NEEDS' + ' CLARIFICATION', '[' + 'FEATURE' + ']', '[' + 'DATE' + ']', '[' + '###', 'TO' + 'DO', 'T' + 'BD')
Get-ChildItem specs/001-ahd-product-system -Recurse -File | Select-String -SimpleMatch -Pattern $markers
```

Expected:

- `git diff --check` prints nothing and exits 0.
- `Select-String` finds no generated placeholder, unfinished-work marker, or unresolved
  technical-clarification marker.

## 3. Inspect the Offline Product

Start the app in Terminal A:

```powershell
node app/_serve-app.cjs
```

Open:

```text
http://localhost:8124
```

Verify:

- Arabic RTL layout renders.
- Primary navigation has eight entries.
- Contextual paths make all 21 registered screens reachable through the product flow.
- Creating an agreement shows simulated identity/consent status honestly.
- A riba or penalty term blocks sealing.
- Changing digit style or privacy masking does not change sealed evidence.
- Open-term loans show no due date or overdue state.
- Dispute pauses actions and produces no Ahd verdict.
- Fees and organization behavior remain visibly proposed/decision-gated.
- The browser network panel shows no product API calls.

Stop Terminal A with `Ctrl+C` after review.

## 4. Verify Open-Witness Independently

Run the intact fixtures:

```powershell
node protocol/verify-ahd-seal.cjs protocol/fixtures/main-record.json
node protocol/verify-ahd-seal.cjs protocol/fixtures/new1-record.json
```

Expected: each prints `VALID` and exits 0.

Run the tampered fixture:

```powershell
node protocol/verify-ahd-seal.cjs protocol/fixtures/main-record-tampered.json
```

Expected: prints `TAMPERED` and exits 1. This non-zero exit is the correct result.

Optional multi-block check:

```powershell
node protocol/verify-ahd-seal.cjs protocol/fixtures/chain-3block.json
node protocol/verify-ahd-seal.cjs protocol/fixtures/chain-3block-tampered.json
```

Check the actual profile support and expected exit behavior in the verifier output; the pinned MAIN
and NEW-1 fixtures remain the master-spec compatibility minimum.

## 5. Run the Local Bank Walkthrough

```powershell
node server/demo-bank-node.cjs
```

Expected sequence:

1. real localhost server starts with durable JSONL store and HMAC auth enabled;
2. unauthenticated mutation is rejected;
3. a local actor token is issued;
4. `NEW-1` is created and sealed;
5. server `/verify` reproduces the seal and catches a changed amount; and
6. the independent verifier validates the exported result.

This proves a local technical slice. It does not prove resource authorization, production identity,
TSA, HSM/KMS, TLS, cloud deployment, residency, or regulatory approval.

## 6. Run a Direct Live HTTP Smoke

```powershell
node server/smoke-live.cjs
```

Expected: real-socket golden verification and static health check pass. The test uses an ephemeral
port and exits; it does not expose the fixed localhost server to the internet.

## 7. Run the Authoritative Quality Gate

```powershell
cd tests
node run-all.cjs
```

Expected: one green Ahd gate banner with zero failures, including:

- frozen demo tripwire;
- golden core logic;
- offline and DOM checks;
- structure checks;
- app feature suites;
- engine parity;
- Open-Witness independence and golden vectors;
- local-server auth, persistence, health, parity, and live HTTP smoke; and
- drift/meta checks.

The printed count is authoritative. Do not hard-code it into a release claim without rerunning the
command.

Return to repository root:

```powershell
cd ..
```

## 8. Review Decision and External Gates

For every `DECISION-GATED` requirement, confirm:

- it points to D-1, D-3, D-6, D-7, or D-8;
- the feature is absent, disabled, proposal-only, or qualified as required;
- no AI-authored conclusion is recorded as approval; and
- the review packet identifies the affected actors, money flow, options, and rollback behavior.

For every `EXTERNAL-GATED` requirement, confirm:

- the required attestation is named;
- the owner class is named;
- evidence is attributable, dated, and scoped;
- missing/invalid/expired/revoked evidence fails closed; and
- the project does not claim production readiness while any mandatory gate is open.

## 9. Judge Lens Review

Score judge-visible changes from 1 to 10 for:

1. innovation;
2. technical implementation;
3. data analysis;
4. user experience; and
5. feasibility.

Record one evidence line per score. Also answer:

> Will a tired judge remember that Ahd is the bank that witnesses but does not lend?

Any score below 8 requires a `JL-` item in `_meta/OPEN-ITEMS.md`. The Judge Lens never overrides the
Ahd spine.

## 10. Completion Rule

The specification package is ready for gated implementation only when:

- requirements are uniquely identified and status-labelled;
- no critical spec/plan/task contradiction remains;
- contracts preserve surface isolation and golden compatibility;
- tasks use exact paths and test-first order;
- all decision/external gates remain honest;
- specification hygiene checks pass; and
- the full quality gate is green.
