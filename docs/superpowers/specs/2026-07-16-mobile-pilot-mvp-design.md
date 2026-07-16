# Ahd Mobile Pilot MVP Design

**Date:** 2026-07-16
**Status:** Approved by direct owner instruction
**Branch:** `codex/mobile-pilot-mvp`
**Product surface:** `application/ahd-mobile`

## Objective

Turn the real Expo client into a local-first Pilot for one or two customers. The Pilot must support a
complete create-to-proof journey, survive process restarts, expose honest recovery controls, and build
as an installable Android APK. It is not a prototype, a bank service, a Shariah approval, or a legal
attestation.

## Product boundary

Only `application/ahd-mobile` is client runtime source. The following trees are presentation or design
references and must never be imported by client code:

- `application/prototypes`
- `application/design/proof-go`
- `docs/pitch`
- `docs/handoff`
- root `app/`

The root `app/` tree may feed byte-pinned generated domain modules through the existing sync script.
Direct runtime imports across that boundary are forbidden and tested.

## Pilot disclosure

The first launch opens `/welcome`. It states, in Arabic, that the Pilot:

- stores data locally on this device;
- is not a banking service;
- is not Shariah or legal approval;
- collects display names only and does not ask for national ID, phone, bank account, or credentials;
- has no analytics, tracking, cloud sync, or live external connection.

Acceptance is stored locally. Until hydration completes, no product route is mounted.

## Local data model

SQLite stores five versioned slices in one table keyed by slice name:

```text
profile
journey
daily
jamiya
settings
```

`profile` stores Pilot acceptance and an optional display name. `journey` stores locally created Ahd
records, their deterministic seals, proof results, and the current route state. `daily` stores local
qaids and reminders. `jamiya` stores a local circle and its consent/payment events. `settings` stores
display preferences and Pilot flags.

Display names, terms, amounts, and generated proof material are allowed because they are the Pilot's
local product data. National ID, phone number, bank account, device token, credentials, and analytics
identifiers are forbidden. No slice is sent over a network.

Writes are serialized. A new snapshot is persisted before in-memory state changes. Corrupt or future
versions fail closed into a local recovery screen. Delete-all clears every slice before resetting
memory. Export produces a deterministic, versioned JSON envelope rather than a raw database file.

## Persistence runtime

Native Android uses `expo-sqlite`. The root provider opens the database, runs idempotent migrations,
hydrates both Pilot slices and the Ahd journey, then mounts the router. Tests use an in-memory
repository with the same interface. Web preview may use the Expo SQLite web implementation when
available; any fallback is labeled preview-only and must not weaken the Android build.

## Share and import

The sealed record share format is `ShareEnvelopeV1`:

```text
format
version
record
proof
exported_at
```

Sharing uses the native `Share` API. Import accepts a pasted/shared envelope, validates its schema,
recomputes proof locally with the golden adapter, rejects unknown versions, and makes tamper failure
visible without changing any balance.

## External boundary

Nafath, bank witness, timestamp, network transfer, or other external actions return
`needs_connection`. They must not alter a balance, seal, consent, or settlement result. The Pilot has
no server connection, analytics SDK, tracking event, or background sync.

## Screen delivery

Screens ship continuously in nine batches of three, with 394×878 screenshots after each batch. Every
screen must have a real local action or a clearly labeled read-only purpose. Fake seed data, demo-tour
controls, silent no-op buttons, and unlabelled simulated claims are rejected.

## Android delivery

The Android package is `sa.ahd.mobile`. GitHub Actions builds a preview release APK, installs it on an
Android emulator, runs the primary customer journey, checks `logcat`, measures cold/warm launch and
route transitions, and publishes the APK plus SHA-256. No store release, tag, or merge to `main` is
authorized.

## Performance gates

- Three-run mean cold start below 2.5 seconds.
- Warm start below 1 second.
- Route transition below 300 milliseconds.
- Main-path jank below 5 percent.
- No ANR, crash, or fatal `logcat` entry.
- APK below 100 MB.
- Local save/load below 100 milliseconds.

Measurements are native-only. Web development timings are reported separately.

## Constitution check

Pass. The frozen demo, golden algorithms, fixed-halalah money, Shariah boundaries, and external claim
status remain unchanged. This design replaces a client shell and adds local persistence; it does not
approve external integration, legal effect, Shariah rulings, release to a store, or a production key
profile.
