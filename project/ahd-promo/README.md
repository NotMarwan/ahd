# Ahd — Promo Video (Remotion)

A **purely visual** navigation video through the real Ahd app screens. No voiceover,
no narration, no added captions/titles/subtitles — the only Arabic on screen is the
copy that already lives inside the app screens themselves. No audio track.

The screens are rebuilt as React/Remotion components ported 1:1 from
`../../Arabic settlement design decisions/Ahd Directions.dc.html` — same palette,
gradients, radii, RTL Arabic, the same Google Fonts (Amiri / IBM Plex Sans Arabic /
Reem Kufi), the same phone frame, and the same Muqassa SVG graph.

## What was rendered

| File | Direction | Resolution | Length | Codec | Audio |
|------|-----------|------------|--------|-------|-------|
| `out/ahd-promo-d2.mp4` | **2 — Dignified & Documentary** (primary) | 1080×1920 (vertical) | 46.5 s · 1395f @ 30fps | H.264 | none |
| `out/ahd-promo-d1.mp4` | 1 — Warm & Human | 1080×1920 (vertical) | 46.5 s · 1395f @ 30fps | H.264 | none |

## The sequence (no text added)

1. The Ahd phone frame fades + scales up (calm entrance).
2. **Screen A «وصلتك بسلامة»** — the SAR 5,000 «قرض حسن» gift-receipt; the amount rises, the protection points settle in one by one.
3. A tap-accept micro-moment — the «أكّد استلامي بسلامة» button presses (ripple).
4. The witnessed-record beat — the «خُتِم العهد» seal draws in (brass seal + check).
5. **Screen B «متى ما تيسّر»** — the 2:280 verse, the grace flow; state shifts from «قيد السداد» to «مؤجّل بالتراضي» (3×1,000 → 5×600, no penalty).
6. **Screen C — the Muqassa settlement circle (climax)** — the 5-friend graph appears with the trust bands («وفّى بعهوده» …), then the tangle collapses: 9 IOUs → 2 transfers, the counter ticks 9→2, the legend settles.
7. Close — a calm final frame on the «عَهد» wordmark.

## Re-render

```bash
npm install
npm run render        # Direction 2 (primary) -> out/ahd-promo-d2.mp4
npm run render:d1     # Direction 1           -> out/ahd-promo-d1.mp4
npm run render:d2     # Direction 2           -> out/ahd-promo-d2.mp4
```

Equivalent raw command (note `--muted` → guarantees no audio track):

```bash
npx remotion render AhdPromoD2 out/ahd-promo-d2.mp4 --muted
```

Preview interactively: `npm run dev` (Remotion Studio).

## Switching direction

Two ready compositions exist: `AhdPromoD2` (default) and `AhdPromoD1`.

To change the **default** everywhere, flip one constant in `src/theme.ts`:

```ts
export const DIRECTION: 1 | 2 = 2;   // <- set to 1 for warm, 2 for documentary
```

The `direction` prop on `<AhdPromo>` (wired through `src/Root.tsx`) is what each
composition passes down; the whole palette, phone bezel, header style, and graph
colours swap from the single `THEMES` table in `src/theme.ts`.

## Structure

```
src/
  index.ts          registerRoot
  Root.tsx          the two compositions (1080×1920 @ 30fps)
  AhdPromo.tsx      orchestrator: phone intro/float/outro + the screen-stack timeline
  PhoneFrame.tsx    phone bezel + notch (native 392×850, scaled to canvas)
  theme.ts          DIRECTION constant + both palettes (ported from the HTML)
  fonts.ts          Amiri / IBM Plex Sans Arabic / Reem Kufi (Arabic subset)
  parts.tsx         shared UI (headers, status bar, verse card, brand, icons)
  anim.ts           easing + cross-fade/segment helpers + Arabic-digit util
  screens/
    ScreenA.tsx     «وصلتك بسلامة» (default + sealed)
    ScreenB.tsx     «متى ما تيسّر» (before + after grace)
    ScreenC.tsx     Muqassa settlement circle + 9→2 collapse
```
