# Contract: Arabic Mobile Parity v1

## Platform floor

- Expo SDK 57, React Native 0.86, React 19.2.3.
- Node.js 22.13 or newer.
- Android 7 or newer with SDK/API 36 target.
- iOS 16.4 or newer.
- Expo New Architecture only.

Compatible package versions are installed through `npx.cmd expo install`; transitive versions are not hand-pinned.

## Route registry

The authoritative mobile registry contains exactly the following 21 web keys:

```text
home, create, daftari, timeline, open, circle, circle-adv, settle,
mine, request, proof, maroof, dispute, standing, impact, bounds,
settings, refusal, shariah, plans, org
```

Tabs are exactly `home`, `create`, `daftari`, and `settle`. Every other key is a stack route. Every route is
reachable through an in-product action; no twenty-second “More” screen is introduced.

## Baseline coverage

Sadu partials `s01` through `s17` cover `home`, `create`, `settle`, `daftari`, `mine`, `proof`, `impact`,
`request`, `open`, `timeline`, `circle`, `circle-adv`, `standing`, `maroof`, `dispute`, `bounds`, and `settings`.
`refusal`, `shariah`, `plans`, and `org` require supplemental design approval. The application registers all 21
routes immediately but cannot claim full visual parity until all four baseline gaps pass review.

## Generated core

`application/ahd-mobile/scripts/sync-web-core.cjs` copies exact bytes from:

- `app/engine.js`
- the allow-listed `app/features/*.js` modules used by implemented journeys
- `application/design/tokens.json`

It writes `src/generated/source-manifest.json` containing source path, generated path, byte length, and lowercase
SHA-256. Check mode exits nonzero on drift and never edits files. TypeScript adapters may type or reshape outputs;
they may not reimplement canonicalization, sealing, netting, money conversion, consent, or conservation logic.

## Core journey fixture

```json
{
  "journey_id": "create-basic-v1",
  "as_of": "2026-06-21",
  "web_entry": "create",
  "mobile_entry": "/create",
  "input_fixture": {},
  "expected_canonical": "exact canonical bytes or null",
  "expected_seal": "exact seal or null",
  "expected_money_minor": {},
  "expected_state": {},
  "offline_behavior": "full",
  "accessibility_checks": []
}
```

Request, create, proof, ledger, grace, and settlement fixtures must match web outputs byte-for-byte where they
produce canonical content or seals and exactly for all integer money/state outputs.

## Offline state

Expo SQLite stores a versioned envelope: records, immutable events, explicit `AS_OF`, deterministic UI state, and
noncanonical outbox intents. A migration runs transactionally and retains a backward reader.

Offline behavior:

- Allowed: cold start, ledger/proof read, draft creation, riba scan, grace request, settlement preview.
- Not allowed to fake success: Nafath, external identity, TSA, issuer signature, remote checkpoint, or submission.
- External actions return `needs_connection`; sealed/canonical state does not change until evidence returns.

## RTL and visual system

- Arabic-only static RTL through the Expo localization config plugin.
- Approved IBM Plex Sans Arabic files and license are bundled through the Expo font config plugin.
- If weight 800 is unavailable, a recorded `FONT-02` decision maps it to 700; weight is never synthesized silently.
- Generated tokens are the only color/spacing/radius/type source.
- Components use start/end semantics, real safe areas, vector icons, and reduced-motion support.
- Product UI contains no emoji icons or simulated device chrome.

## Accessibility and device evidence

Automated checks cover labels, roles, state, hints, heading order, 44-point targets, route reachability, reduced
motion, contrast, 200% font scaling, and unclipped required actions.

Final evidence uses development builds on one physical iPhone and one physical Samsung/Android phone. Record model,
OS, width, normal/200% text, VoiceOver/TalkBack, RTL focus order, Android back, iOS swipe-back, reduced motion, and
airplane-mode cold start. Expo Go is technique evidence only and cannot satisfy the release gate.

## Completion boundary

Node parity, Expo export, screenshots, or one emulator cannot individually establish mobile completion. The route,
core-byte parity, six journey fixtures, native export, accessibility, baseline, and two-device gates must all pass.
