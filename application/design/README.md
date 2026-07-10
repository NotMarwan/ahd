# application/design

Single source of truth for the RN app's design tokens.

## Single-source rule

`tokens.json` mirrors the `:root` block of `application/prototypes/dir-b-sadu.html`
(v5, contrast-fixed). The prototype's hex values are canonical — `tokens.json`
is a derived copy, never the other way around.

## Change protocol

1. Edit `tokens.json` first (or the prototype `:root`, whichever changed).
2. Sync the other side by hand.
3. Run `node application/design/check-tokens.cjs` — must print
   `tokens ↔ prototype in sync` and exit 0.
4. When the RN skeleton lands, `tokens.ts` imports `tokens.json` directly —
   re-run check-tokens after any future edit to either file.

## px ≈ pt 1:1

The prototype's phone frame is 375px wide, matching a 375pt RN device width
(iPhone base). Copy `space`/`radius`/`type.size` values straight from CSS px
into RN pt — do not scale twice.

## Dark mode: deferred

v1 ships light-only as a brand-committed single theme (sand/paper identity,
`--ground`/`--card`). Revisit post-hackathon; not a technical blocker, a
scope decision.

## See also

`application/design/RN-MAPPING.md` — binding CSS→RN property mapping.
