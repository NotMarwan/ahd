# Rehearsal, typography, and capture checklist

## Before timing

- Open `app/index.html` from local disk; disconnect network.
- Confirm IBM Plex Sans Arabic appears on the home, proof, settlement, and impact screens.
- In browser DevTools, reload once and confirm Console has zero errors and Network has zero remote font requests.

## Timed run

- Run the three-minute script start to finish twice; record each elapsed time.
- Keep the cold-open tamper, 9→2 settlement, and close on their listed screens; no new navigation path.
- Run `cd tests && node stage-preflight.cjs`, then `node run-all.cjs` before stage.

## Screenshot handoff

- Capture home, proof-verified, proof-tampered, settlement, impact, and open-forgiveness at the presentation viewport.
- Verify Arabic joins, RTL alignment, no fallback glyphs, no clipped seals, and no browser chrome/console visible.
- Record the capture date, viewport, and zero-console result beside the deck handoff.
