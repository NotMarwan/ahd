# Trust Weave Mobile Design

**Date:** 2026-07-16
**Status:** Approved by direct owner instruction
**Surface:** `application/ahd-mobile`

## Decision

Replace the mobile application's original Sadu/rust visual layer with the approved Trust Weave system. The product app remains real and interactive; the HTML previews remain reference-only and stay isolated from runtime imports.

Canonical references, in order:

1. `docs/research/related-apps/vibe-preview-trust-weave-v2.html` — Home, Open Loan, Settlement.
2. `docs/research/related-apps/vibe-preview-trust-weave-b2.html` — Create/Review, Daftari, Proof.
3. Local `vibe-preview-trust-weave-b3.html` artifact — Mine, Maroof, Jamiya.

Rejected references: `reference-color-three-screen.html`, `three-screen-preview.html`, and the Sadu prototype.

## Visual grammar

- Primary cobalt `#2456F6`; never use deep navy as the default surface.
- Warm paper `#F6F2E9`, white cards, near-black ink `#16222C`.
- Gold `#B9862F` means kept/fulfilled/mercy.
- Amber `#C77E1E` means waiting/late without penalty.
- Red `#C2402A` is reserved for tamper or prohibited terms only.
- The weave is literal: thread bands, rails, knots, seal chips, and before/after netting paths.
- Controls are at least 48 px; standard rows are at least 56 px; radii are 20/14/10.
- Arabic is primary. Money, references, and hashes use isolated Latin tabular digits.
- The official logo asset is preserved. In dense headers it is cropped inside a small neutral mark beside the Trust Weave wordmark; it is never redrawn.

## Component boundaries

- Theme tokens own all semantic color, spacing, radius, and type scales.
- Shared primitives own paper, cards, buttons, chips, header, woven bands, seal chips, meters, and the netting visual.
- Screens compose primitives around live store/engine data. No business calculation moves into rendering.
- Existing accessibility labels and journey actions remain stable unless a test-first behavior change requires otherwise.

## Screen mapping

- Batch 1: `HomeScreen`, `OpenLoanScreen`, `SettlementScreen`.
- Batch 2: `CreateAhdScreen`, `DaftariScreen`, `ProofScreen`.
- Batch 3: `MineScreen`, `MaroofScreen`, `JamiyaScreen`.
- Remaining routes inherit the shared system, then receive screen-specific compositions in three-screen review batches.

## Acceptance

- No old Sadu palette remains in the mobile theme.
- All 24 destinations render without horizontal overflow at 360, 394, and 480 px.
- Every primary control remains at least 44 px, targeted at 48 px.
- Semantic colors are enforced by tests; red is not a generic error/accent.
- The existing journey, core parity, and deterministic money behavior remain unchanged.
- Each delivery shows three live screenshots at 394×878 before the next batch.

## Constitution check

Pass. The frozen demo, generated engine, vectors, money logic, Shariah boundaries, and external claims are untouched. This is additive presentation work over the real offline-capable mobile surface.
