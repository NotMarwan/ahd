# Design-review notes — 2026-07-10 (observations only, animation-work session)

Captured after adding the screen-enter transition; these are honest weaknesses spotted in the
existing UI, not fixed in this pass (out of scope — animation-only budget).

- **Nav bar overflow/clipping**: the leftmost nav button ("السجلّ") is cut off at the 390px
  viewport edge on every screen (see 01-home.png, 05-impact.png) — the nav row doesn't scroll or
  wrap, it just clips. Needs horizontal scroll affordance or icon-only compaction on narrow widths.
- **Home screen has a large dead zone**: after the hero card and "أنشئ عهدًا" prompt, ~65% of the
  viewport height is empty background (01-home.png). Feels unfinished rather than intentionally
  spacious.
- **Flat card hierarchy**: `.hcard`/`.im-card` surfaces on impact/daftari/settle mostly share the
  same border-radius, border color, and shadow weight — nothing pulls the eye to the single most
  important number per screen (e.g. impact's 2,470 vs 7,400 sit at equal visual weight).
- **Icon language is inconsistent**: nav icons mix emoji-style glyphs (🏠 📖 🗂) with no shared
  stroke weight or optical size — reads as placeholder iconography rather than a designed set.
- **Typography scale is narrow**: most body copy across screens sits in a tight 12–13.5px band;
  there's limited contrast between "headline," "supporting stat," and "caption" tiers, so dense
  screens (impact, settle) read as one long paragraph of similar-weight text.
- **Color is used almost entirely for state (teal=good, gold=amount, amber=warning)** and rarely
  for structure — section boundaries rely on borders/backgrounds of nearly identical lightness,
  so scanning a long screen (impact) takes real effort.
- **Button hierarchy is soft**: primary actions (e.g. "شاهد الانهيار 9 ← 2") and secondary chips
  use similar pill shapes/sizes; a first-time user has to read the label to know which action is
  "the" action on the screen.
- **The network diagram on impact (12-node graph) has no legend or axis** — degree of trust in
  its own visual metaphor is unclear without the caption block beneath it doing all the work.

Screens captured @2x, 390×844 viewport: `01-home.png`, `02-create.png`, `03-daftari.png`,
`04-settle.png`, `05-impact.png`, `06-bounds.png`.
