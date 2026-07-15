# Wave 0 Recovery Drill

This runbook restores and validates one immutable candidate without using the parked source workspace.

## Two-commit lifecycle

1. Candidate-content commit `A` contains every reviewed release path except the final attestation.
2. Attestation commit `B` descends from `A` and adds only the final manifest and declared attestation metadata.
3. A clean detached checkout of `A` is the validation target.
4. A separate clean detached checkout of `B` supplies the tracked manifest and any declared bundle sources.
5. Wave 0 does not tag, push, release, overwrite, or clean up external state.

## Canonical interface

```powershell
node tests/release-gate.cjs --manifest _meta/freeze/2026-07-15-release-manifest.json --target <candidate-A-checkout> --attestation-root <attestation-B-checkout>
```

`--manifest` is repository-relative for final validation and resolves only beneath the attestation checkout.

`--target` must be a clean checkout whose `HEAD` equals candidate commit `A`.

`--attestation-root` must be a clean checkout whose `HEAD` equals attestation commit `B`, which strictly descends from `A`.

An external absolute draft manifest is accepted only while its status is `draft`; it cannot authorize release or final attestation.

## Recovery procedure

1. Read `A` and `B` from the finalized manifest and attestation history; never infer either from the parked source workspace.
2. Create separate detached worktrees for exact commits `A` and `B`.
3. Verify both worktrees have no tracked or staged changes and that their resolved `HEAD` values match the manifest identities.
4. Read governed inputs through their Git trees. Reject an untracked shadow or checkout byte mismatch.
5. Restore only assets declared as `attestation-bundle`, only from their tracked source paths under `_meta/freeze/bundles/`, and only to exact declared `restore_to` paths. If none are declared, restore nothing.
6. Run the canonical command once and require every focused control plus the full product gate to pass.
7. Record the resolved `A`, `B`, manifest blob SHA-256, exact gate output, and elapsed time. The elapsed recovery must be below 15 minutes.

## Evidence record

| Field | Result |
|---|---|
| Candidate `A` | `e308749f7453617e3e37f2a0793abd5964403a7c` |
| Attestation `B` | `86cda05f53b911b7dd70946f91801942a24e16ec` |
| Manifest blob SHA-256 | `bfd20eefdb9e482adea39907762f178f0a70c1238a67dc8d1826793d2ae58d64` |
| Restored outputs | none; the manifest declares no `attestation-bundle` assets |
| Release gate | `2979/0`; all five controls true; exact A/B identities matched |
| Elapsed recovery | `1.513 minutes` (`90,791 ms`), below 15 minutes |
| Two normalized stage preflights | byte-identical; SHA-256 `6d7c4532962cc58622ca2169bc987e0e70ca9fa00aa5cafa0ec7381c707a27d1` |
| Frozen demo and generated engine | demo `e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40`; engine `52bc6921ad7df9638b2ce0cf0b9f04d871f9bce3fc5f453804503c50c102bb65`; source/tree/checkout equal |

No tag, push, release, overwrite, cleanup, Shariah ruling, or substantive owner decision is authorized by this drill.
