# Quickstart: V2 Product and Protocol Validation

Run commands from the repository root unless a section changes directory. This guide describes the post-
implementation validation contract; execution plans define the TDD sequence.

## Prerequisites

- Node.js 22.13 or newer; the current planning environment is Node.js 24.15.0.
- Owner-approved protocol license/governance record before publication.
- Approved timestamp adapter/TSA and issuer HSM/KMS profile before production claims.
- Unique decision IDs and real approval artifacts before enabling protective mechanisms.
- Completed Sadu/Figma baseline and mobile dependency approval before native UI claims.
- Windows uses `npm.cmd` and `npx.cmd` because the local PowerShell policy blocks `npm.ps1`.

## 1. Verify legacy compatibility

```powershell
node protocol/verify-ahd-seal.cjs --record protocol/fixtures/main-record.json --json
node protocol/verify-ahd-seal.cjs --record protocol/fixtures/new1-record.json --json
```

Expected: exit `0`; legacy integrity remains valid and the golden main seal is unchanged.

## 2. Verify a five-property package and localized tampering

```powershell
node protocol/verify-ahd-seal.cjs --package protocol/fixtures/conformance/valid-five-property.json --json
node protocol/verify-ahd-seal.cjs --package protocol/fixtures/conformance/tampered-trusted-time.json --json
node tests/app/open-witness-conformance.test.cjs
```

Expected: the valid package exits `0` with five `valid` properties. The tampered package exits `1`, reports
`trusted_time: invalid`, and leaves the other independently testable properties localized. Conformance tests pass.

## 3. Verify a chain package through the explicit chain CLI

```powershell
node protocol/verify-ahd-seal.cjs --chain protocol/fixtures/chain-3block.json --json
```

Expected: exit `0`; all sequence values are contiguous and every previous-seal link validates. Passing a top-level
array without `--chain` exits `2` with a usage/schema diagnostic.

## 4. Run the cross-issuer exchange

```powershell
node protocol/conformance/run-conformance.cjs --json
```

Expected: exit `0`; Ahd verifies three `reference-2` records and `reference-2` verifies three Ahd records. Results
are written under `protocol/conformance/results/` and contain no shared app/engine dependency.

## 5. Prove approval gates and protective behavior

```powershell
node tests/app/approval-artifact.test.cjs
node tests/app/rifq-approval.test.cjs
node tests/app/circle-mode-b.test.cjs
node tests/app/borrower-release.test.cjs
node tests/app/duress.test.cjs
node tests/app/collusion-signal.test.cjs
node tests/app/identity-state.test.cjs
node tests/app/analytics-privacy-v2.test.cjs
```

Expected: every suite passes missing, tampered, expired, revoked, condition-mismatch, exact-profile, conservation,
rollback, and backward-reader cases. Test approvals can activate only test profiles. No production capability is
enabled by repository fixtures.

## 6. Check the Sadu source baseline

```powershell
node application/prototypes/build-prototype.cjs --check
node application/design/check-tokens.cjs
node application/design/contrast-check.cjs
```

Expected: generated prototype bytes match the 17 source partials, tokens are in sync, and all checked contrast
pairs pass. The four supplemental route baselines have recorded review evidence before full visual-parity claims.

## 7. Validate mobile source, logic, and native export

```powershell
Set-Location application/ahd-mobile
node scripts/sync-web-core.cjs --check
node tests/run-mobile-tests.cjs
npm.cmd test -- --runInBand
npx.cmd tsc --noEmit
npx.cmd expo-doctor@latest
npx.cmd expo export --platform android
npx.cmd expo export --platform ios
```

Expected: source hashes, golden seal, API surface, netting, riba negation, six journey fixtures, 21-route
reachability, offline migrations, RTL, tokens, accessibility contracts, TypeScript, Expo health, and both native
bundles pass.

## 8. Run physical-device acceptance

Use development builds, not Expo Go, on the recorded iPhone and Samsung/Android devices. Complete the matrix in:

```text
application/ahd-mobile/design-evidence/device-matrix.json
application/ahd-mobile/design-evidence/accessibility-report.md
application/ahd-mobile/design-evidence/offline-report.md
```

Expected: all six core journeys remain reachable in Arabic at normal and 200% text, VoiceOver/TalkBack order is
correct, gestures/back work, reduced motion is honored, and airplane-mode behavior matches the contract.

## 9. Run the repository gate and tripwire

```powershell
Set-Location tests
node run-all.cjs
```

Expected: the current full gate reports zero failures and the frozen-demo SHA-256 tripwire remains intact. Use the
live banner count rather than a count copied into documentation.

## 10. Apply the Judge Lens

Score every judge-visible web/mobile/protocol surface against `docs/JUDGE-LENS.md`. Any criterion below `8/10`
creates a `JL-*` item in `_meta/OPEN-ITEMS.md`. Prototype, synthetic, fixture, approved, and production claims remain
visibly distinct.
