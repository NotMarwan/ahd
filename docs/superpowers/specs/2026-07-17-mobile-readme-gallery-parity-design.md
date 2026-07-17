# Mobile README Gallery Parity Design

**Date:** 2026-07-17

**Status:** Owner-approved design, pending written-spec review

**Target:** Android-first Expo / React Native mobile app and the repository `README`

## Outcome

Replace the complete Sadu-era mobile gallery with twenty new judge-ready image assets captured from the real React Native application. The twenty assets must cover all twenty-four registered mobile screens, use the Web App as the canonical showcase-data and copy reference, and explain the benefit of each feature without relying on the capability catalog alone.

The Web App remains a separate desktop section in the repository. It is a content reference for the mobile fixtures, not a visual substitute for the mobile screenshots.

## Existing State

- The public `README` references twenty Sadu-era files under `app/screenshots/readme/`.
- The old directory contains one additional unreferenced Sadu capture. All old Sadu gallery files and references are removed as part of this work.
- The mobile registry contains twenty-four screens: five primary tabs and nineteen contextual capabilities.
- The current mobile showcase fixture uses a different Noura/Layla story. That story is replaced by the Web App's canonical narrative.

## Canonical Showcase Story

The mobile fixture must preserve the Web App's identities, amounts, dates, and explanations wherever the same feature exists.

- Viewer: `نايف العتيبي`, a clearly labeled pseudonymous showcase account.
- Urgent covenant: Naif lent Sultan `1,200 SAR`, due `2026-05-15`, with no recorded payment and `37` days late.
- Compassion rule: lateness is amber, never red; no interest and no late fee. The next actions are a kind reminder or a respite request.
- Ledger summary: `5,200 SAR` owed to Naif, `3,000 SAR` owed by Naif, `800 SAR` fully repaid, and the word-only signal `وفّى بعهوده`.
- Ledger records: neighborhood café `2,500`, Sultan `1,200`, Abdullah `600`, Reem `800` repaid, Majed `900` disputed, and Fahd `3,000` owed by Naif.
- Proof story: `عهد-CAFE`, amount `2,500 SAR`, with verified and tampered states generated from the real sealing and verification path.
- Settlement story: the exact five-person, nine-obligation fixture from the Web App, totaling `1,800 SAR`, reduced by the real engine to two transfers: Noura to Khalid `600 SAR` and Noura to Fahd `300 SAR`.
- Jamiya story: `جمعية أهل الحي`, six members, `1,000 SAR` per month, `6,000 SAR` per turn, with the third turn visibly under collection.
- Standing support: Abu Fahd to Ramesh, `800 SAR` monthly across four disclosed cycles; two are paid and `1,600 SAR` remains.
- Open loan: Munira to Majed, `20,000 SAR`, repay when able, with no mandatory installment and no increase.

All numerals in captured states use Western digits. Every synthetic screen visibly says `بيانات تجريبية` or `عرض تجريبي`. Rendering fixtures never writes to local storage, and real local data always takes precedence.

## Twenty Replacement Assets

Each numbered item below produces one final image asset. A paired asset places two related 394×878 phone captures on one neutral, high-resolution board; single assets contain one phone capture with no fake browser chrome.

1. Home.
2. Create Ahd + Refusal (`ما لا يفعله عهد`).
3. Daftari + Timeline.
4. Proof verified + Proof tampered.
5. Settlement `9→2`.
6. More capability catalog.
7. Open loan.
8. Mine (`ما عليّ`).
9. Request Ahd.
10. Standing support.
11. Circle.
12. Circle+.
13. Jamiya.
14. Daily.
15. Maroof record.
16. Dispute.
17. Impact.
18. Bounds + Shariah.
19. Plans + Organization.
20. Settings.

This mapping covers every screen in `SCREEN_REGISTRY` exactly once. The Proof screen contributes two meaningful verification states inside one asset.

## Mobile Presentation Rules

- Capture the actual React Native app on an Android phone viewport at 394×878 or the device-pixel equivalent.
- Keep Arabic RTL hierarchy, Western digits, at least 48 dp touch targets, and one obvious value proposition in the first viewport.
- Prefer a concise result card over a long explanatory paragraph. Amount, parties, state, and next action must be visually separable.
- Do not shrink a complete desktop layout into a phone. Adapt the Web App narrative to the existing mobile components and navigation.
- Do not use Web App screenshots inside the mobile gallery. If a mobile screen fails to explain its feature, improve that screen or its fixture before capture.
- Capture deterministic final states. Disable transient animation, keyboards, loading indicators, debug overlays, status notifications, and emulator chrome.
- Use consistent crop, background, scale, and file compression across all twenty assets.

## README Structure

- Remove every reference to the old Sadu gallery.
- Replace the current three-step and feature-tour images with the twenty numbered mobile assets.
- Preserve the explanatory story groups, but update captions to describe the actual React Native screen and Web App-aligned fixture.
- Keep the separate four-image desktop Web App section and its live link unchanged.
- Update the README contract test to require the new asset manifest and reject old Sadu paths.

## Implementation Boundaries

- Do not edit `demo/index.html`, golden vectors, generated core logic, or floating-point money.
- Keep settlement computation on the existing exact engine path.
- Keep proof states on the existing real seal/verify path.
- Centralize canonical showcase values in the mobile showcase module; screens consume derived records rather than duplicating literals.
- Do not persist fixtures during render or navigation.
- Preserve the user's modified APK files until the implementation has passed source, screenshot, and delivery verification.

## Testing and Review

Implementation follows red-green TDD.

1. Add failing fixture-parity tests for the Web App story, Western digits, honest showcase labels, and zero writes on render.
2. Add a failing gallery-manifest test requiring exactly twenty final assets, complete 24-screen coverage, and no Sadu references.
3. Implement the minimal mobile data and presentation changes needed to pass.
4. Capture all raw states and assemble the twenty final assets.
5. Review each asset at repository display size for legibility, data truthfulness, feature clarity, crop consistency, and duplicated storytelling.
6. Run focused mobile tests, full mobile tests, typecheck, lint, boundary checks, the README contract, and `node tests/run-all.cjs`.

## Acceptance Criteria

1. The public README contains twenty new mobile gallery assets and no Sadu gallery reference.
2. All twenty-four registered mobile screens are represented by the approved mapping.
3. Every captured synthetic state is visibly labeled and uses Western digits.
4. Repeated mobile/Web App features use the same canonical parties, amounts, dates, and status meanings.
5. The Sultan, proof, settlement, Jamiya, standing-support, and open-loan stories are understandable from the image and caption without opening the app.
6. No fixture persists on render, real data wins, and the golden seal and settlement paths remain unchanged.
7. All required mobile and repository gates pass before any publish action.
