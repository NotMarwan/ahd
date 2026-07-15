# Quickstart: V2 Product and Protocol

## Protocol

```powershell
node protocol/verify-ahd-seal.cjs protocol/fixtures/main-record.json
node protocol/verify-ahd-seal.cjs protocol/fixtures/chain-3block.json
node tests/app/seal-properties.test.cjs
node tests/app/open-witness-conformance.test.cjs
```

Expected: valid fixtures pass; each tampered fixture fails one localized property.

## Gated features

```powershell
node tests/app/borrower-release.test.cjs
node tests/app/duress.test.cjs
node tests/app/collusion-signal.test.cjs
node tests/app/circle-mode-b.test.cjs
node tests/app/identity-state.test.cjs
```

Expected before approvals: every gated behavior remains inert. Expected after fixture approvals: only exact
approved profiles activate.

## Mobile

```powershell
Set-Location application/ahd-mobile
node tests/run-mobile-tests.cjs
npx tsc --noEmit
npx expo-doctor
```

Then run the approved journey set on one iOS and one Android device. Finally run the repository full gate.

