# 🎨 Design notes for Claude Design — `app/`

> The overnight work built a **functional baseline** UI for the new app, not a finished visual design.
> Per the brief, visual polish is **Claude Design's lane** — this doc hands off the decisions made,
> what's intentionally minimal, and the per-screen polish to take further. **Do not change logic or
> copy without checking the feature specs + the spine** (`CLAUDE.md`); style only.

## The baseline I established (in `app.css`) — keep or evolve
- **RTL, Arabic-first.** `dir="rtl"`, `lang="ar"`. Mobile-width column (`max-width:430px`).
- **Palette (warm, dignified, Islamic-finance):** cream bg `#f7f4ee`, deep teal `#0e6b5c` (primary/trust), gold `#9a7b27` (kept/grace/ayah), **amber `#9a5a1e` for "late" — never red** (late is not a crime; this is a spine choice, keep it).
- **Components:** pill nav, soft cards with a subtle shadow, status chips (teal/gold/amber/mute), the dark-teal "hero" + "sealed record" panels. One-tap action sheets.
- **Numbers:** Western digits with grouping (`2,500`) to match the engine's golden `fmt()`. Arabic-Indic (`٢٬٥٠٠`) is a valid alternative — see `DECISIONS-FOR-MARWAN.md` D-2; if chosen, do it as a pure display map, app-wide.

## Intentionally minimal (take these further)
- **Typography:** system stack only. A real Arabic display/text pairing (e.g. a Naskh for body, a stronger display face for the hero «عهد») would lift it a lot.
- **Iconography:** emoji placeholders (📔 ♾️ 🔁 🔗 ➕ 🏠). Replace with a custom line-icon set; the per-feature specs request type-specific icons (occasion types, etc.).
- **Motion:** none. Gentle, calm micro-transitions (sheet open, flash dismiss, the seal "stamping") fit the dignity tone — nothing flashy.
- **The reminder card** (دفتري) should *read like a message from a kind third party*, visually distinct from a banking alert — warm, BCQ/ayah family, not transactional (Agent-3 hand-off).

## Per-screen hand-offs (from the feature specs + as-built)
- **🏠 home:** the hero «عهد» wants the strongest type moment. The feature cards + the live «لك عند الناس / عليك للناس» summary are the hooks.
- **➕ create:** the **riba-linter block state** is the signature moment (red-tinted card + the halal alternative + the disabled seal). Make the clean→blocked transition feel meaningful. Keep the 🧪 "try it" affordance (it's button-driven on purpose — sidesteps a known linter edge case on stage).
- **📔 دفتري:** overdue rows **amber, never red**; a soft overdue dot on the nav entry (Agent-3). The own trust-band banner on «عليّ» is a word, never a number — keep it humble (a mirror, not a score pedestal).
- **♾️ القرض المفتوح:** the «المتبقّي» panel is **deliberately quiet** — large, calm, **no red, no countdown, no due date, ever**. Keep that restraint.
- **🔁 الدائرة+:** the mode-B «نجمع للهدف» card carries an ⚠️ Shariah-review guard — keep that warning visible and honest (it's not shipped).
- **🔗 المقاصّة:** the «9 ⟶ 2» reduction + the conservation proof are the wow; make the before→after legible (a small graph, like the demo's SVG, would be ideal — reuse the demo's `graphSVG` idea).

## Hard constraints for the design pass (non-negotiable)
- **Do not touch `demo/index.html`** (the frozen presenter demo) or `engine.js`.
- Keep **amber-not-red** for late; keep the trust band a **word, never a number/%**; keep the open-loan panel **due-less and countdown-less**; keep the mode-B Shariah guard visible.
- The app is **offline + deterministic** — no web fonts/CDNs that break offline (bundle any font locally) and no analytics/network.
- Re-run the harness after any structural change (`node app/run-app-tests.cjs`); style-only changes shouldn't touch it, but the dom-smoke asserts key copy is present — don't remove the asserted strings.
