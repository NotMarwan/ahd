# design-sync NOTES — Ahd

- 2026-07-09 · First sync (Claude-E). Repo is vanilla JS — **outside the converter envelope**; layout hand-authored per the skill's off-script clause. `_ds_bundle.css` = verbatim copy of `app/app.css` (sha12 recorded below) — **re-copy it whenever app.css changes**, then re-upload the changed files.
- No `_ds_sync.json` anchor was uploaded (storybook-shape recipe not applicable; omission is the documented honest choice) — every future sync re-verifies and re-uploads what changed. Fine at this scale (8 cards).
- No JS bundle (`_ds_bundle.js`) shipped — no React components exist to compile; shipping a reimplementation would violate the skill's core principle. The design agent styles via `styles.css` closure + conventions README + cards.
- Vocabulary validation is scripted: every class/token named in README/conventions greps against `_ds_bundle.css` (ran clean 2026-07-09). Re-run after any conventions edit.
- app.css sha12 at sync time: `10ee20f30cb1` (from `sha256sum app/app.css`).
- Scope decision: mini brand kit (8 cards) — deliberate, AMAD deadline 18 July. Full screen-by-screen kit only if the deck work demands it.
