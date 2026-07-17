# Mobile Feature Hub and Settlement Polish Design

**Date:** 2026-07-17
**Status:** Owner-approved through the instruction to execute the recommended approach without further questions
**Active package:** `specs/002-judge-readiness`

## Goal

Turn the flat More index and empty Settlement state into judge-ready, customer-readable mobile surfaces while preserving the Pilot's offline, deterministic, and honest-data boundaries. Correct the Android launcher safe zone and reduce the oversized active-tab treatment shown in the supplied device captures.

## Chosen approach

Use the requested hybrid feature hub: one outcome-led hero, a recent-tools strip, horizontal category chips, a small mobile bento group, then a searchable compact list containing every contextual route. This is preferred over a pure grid, which makes nineteen tools visually equal, and over a plain searchable list, which repeats the existing dull hierarchy.

Settlement keeps real local records as the primary path. When no connected records exist, it renders the frozen nine-obligation demonstration tangle as a clearly labeled, non-persisted teaching example. The example may be explored but cannot be saved as customer data or presented as measured usage.

## UI structure

### More

- Outcome-led header and Arabic search field.
- Recommended hero for Settlement with a compact `9 to 2` preview.
- Four recent/relevant tools in a horizontal strip.
- Horizontally scrollable category chips.
- Two bento cards for proof/bounds and local impact.
- Full filtered list with icon, title, one-line outcome, optional state badge, and route action.
- Every contextual screen in `CONTEXTUAL_SCREENS` remains reachable.

### Settlement

- Real connected local records always override the example.
- Empty local ledger shows the exact nine-edge golden demonstration fixture.
- Same screen shows the nine input obligations and the two computed output transfers.
- Visible `بيانات تجريبية` label explains that no ledger or balance is changed.
- Demo CTA creates a real Ahd; real-record flow retains explicit consent and local-save behavior.

### Launcher and tabs

- Android adaptive foreground uses a 1024px transparent asset whose mark stays inside the central safe zone.
- iOS/legacy icon remains unchanged.
- Active tab uses a compact icon pill plus tint, not a full-height rectangular fill.
- Existing bottom safe-area inset remains mandatory.

## Data and safety

- Demo amounts use integer halalas only.
- No date, locale, random, network, billing, transfer, or external-state claim is added.
- Demo data is immutable presentation data and is never written through `settle()`.
- Golden engine and `demo/index.html` remain untouched.
- No Shariah conclusion changes; current pending-review language remains.

## Testing

- More catalog coverage, search, chip filtering, and route navigation.
- Settlement RED/GREEN regression proving the empty ledger renders labeled `9 to 2` demo data without consent/save controls.
- Existing real-record consent regression remains green.
- Static Android delivery regression pins the safe foreground asset and compact tab treatment.
- Typecheck, focused Jest, client-boundary check, lint, and repository gate.

## Judge Lens target

Innovation 8, technical 9, data 7, UX 9, feasibility 9, memorability 8. Data remains below 8 because the demonstration is explicitly synthetic; no UI polish can replace real aggregate evidence.
