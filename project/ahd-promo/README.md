# عهد — App Feature Promo (Remotion)

A **high-end motion-design film** of the new Ahd app's features (`project/ahd-app/`), each
feature shown with its animated **Arabic caption**. This is the v2 redo: faster and far more
alive than the first cut — one consistent motion language, real spring easing (settles with
weight, slight overshoot), a floating device with depth (layered shadow, parallax, a specular
sweep), staggered cascades, continuous micro-motion so nothing is ever dead-static, and the two
hero moments genuinely animated — the **riba-linter blocking a penalty clause live** and the
**Muqassa 9→2 collapse** (the tangle physically unravels to the centre, then two clean transfers
draw out). Screens are **rebuilt as Remotion components** from the real app (exact `app.css`
palette — cream/teal/gold, amber-for-late — RTL Arabic), so everything is vector-crisp and the
data is alive (numbers count up, the linter blocks, the bar fills, the graph collapses).

No voiceover. No on-screen text beyond the approved captions.

## Output

| File | Resolution | Length | FPS | Codec | Audio |
|------|-----------|--------|-----|-------|-------|
| `out/ahd-app-promo.mp4` | **1080 × 1920** (vertical) | **~32.4 s** (1944 frames) | **60** | H.264 (crf 18) | silent |

> Pace is intentionally snappy (~1.5× a normal demo — the brief's dominant directive: "shorter
> dwell, energetic, never draggy"). To stretch toward a longer ~38–45 s cut, raise `PACE` (see
> below) — e.g. `PACE = 1.18` ≈ 38 s. That adds a little calm dwell at the end of each beat
> (the beats stay alive via the float/breathe/glow, so it reads premium, not static).

## The sequence (7 beats — captions are the approved §6 copy, typeset, not rewritten)

1. **Cold open** — the «عهد» wordmark (Reem Kufi display face) springs in; a seal ring **stamps**
   onto it with an impact ripple; a gold rule draws; the tagline rises.
2. **أنشئ عهداً (HERO)** — the form assembles; a «غرامة تأخير ٥٪» clause **writes into the terms
   live → the linter shakes + flashes BLOCKED** (seal button disables, a lock snaps in); the halal
   alternative «نظرة إلى ميسرة» slides in; «أزل الشرط» strikes & removes the clause; the banner
   flips clean green; then it **seals (SHA‑256 · نفاذ)** with the lock closing.
3. **دفتري** — the لك/عليك tiles **count up**, the trust-band word «وفّى بعهوده» clip-reveals
   (a word, never a number), the ledger rows cascade with spring overshoot, amber-late chips
   settle with a pulse (amber, never red).
4. **القرض المفتوح** — the quiet «المتبقّي» panel; a partial payment **drops 20,000 → 15,000**
   (a «−٥٬٠٠٠» delta rises out of the number), the 2:280 ayah glows, the «اجعلها صدقة» إبراء button.
5. **الدائرة** — the treasurer dashboard: the progress bar **fills** in sync with the count,
   member states settle in (gold/teal, never red), the dignity note + circle seal-hash land.
6. **المقاصّة (CLIMAX)** — the **9-IOU tangle** draws in and holds, then **unravels to the centre**
   (per-edge stagger, a cancellation flash) as **2 clean transfers draw out**; the «٩ → ٢» counter
   ticks (the ٢ pops with overshoot); the conservation proof resolves «المجموع = صفر».
7. **Close** — the «عهد» wordmark + «كلمتك محفوظة، وعلاقتك محمية» resolve, then a calm fade.

## Re-render

```bash
cd "project/ahd-promo"
npx remotion render src/index.ts Promo out/ahd-app-promo.mp4 --codec=h264 --crf=18
# or: npm run render
# preview interactively:  npm run dev   (remotion studio)
```

## Change the speed (one dial)

Open `src/theme.ts` and set **`PACE`** (default `1`):

```ts
export const PACE = 1;     // 1 = the snappy ~32s default. 1.18 ≈ 38s. 0.85 = faster.
```

`PACE` scales every beat duration + the transition overlap uniformly; total length auto-recomputes
in `Promo.tsx`. To retime a single beat, edit its frame count in `DUR` (same file).

## Add music (optional — silent by default, your call)

Drop an mp3 into `public/` and uncomment two lines in `src/Promo.tsx` (the import + the `<Audio>`):

```tsx
import { Audio, staticFile } from "remotion";
<Audio src={staticFile("music.mp3")} volume={0.55} />
```

## Structure

```
src/
  index.ts            registerRoot
  Root.tsx            the Promo composition (1080×1920 @ 60fps)
  Promo.tsx           TransitionSeries chaining the 7 beats (RTL push + fade, PACE-scaled)
  theme.ts            palette (from app.css) · IBM Plex Sans Arabic + Reem Kufi · PACE · DUR · BACKDROP
  motion.ts           the one motion language: springs (settle/snap/pop), rise, count, breathe, draw, shake, clip-reveal
  components/
    Phone.tsx         device frame — layered shadow, float + parallax, specular sweep, the app nav
    Caption.tsx       kinetic Arabic caption (title clip-wipe + gold rule + line), RTL-aware
    ui.tsx            app primitives from app.css (Card, Chip, Tile, Avatar, Bar, Btn, Nav, SealPanel) + SVG icons (Check/Cross/Lock)
  beats/
    ColdOpen · BeatCreate · BeatDaftari · BeatOpenLoan · BeatCircle · BeatSettlement · Close
```

## Fonts (the #1 risk — handled)

The app uses a system Arabic stack (Segoe UI / Noto Naskh) a headless renderer can't be trusted to
have, so the promo loads two **render-blocking** web fonts via `@remotion/google-fonts`:
**IBM Plex Sans Arabic** (body/UI) and **Reem Kufi** (the «عهد» wordmark only). Verified on stills
before rendering: Arabic shapes + joins correctly, RTL — not reversed, not broken.

## Verification done before the final render
- **Arabic confirmed** on stills across the densest beats (riba block, Muqassa graph, دفتري,
  the wordmark) — the mandated check.
- **Device presence** fixed: the backdrop is a touch deeper than the app's cream screen so the
  device always reads as a complete floating object, never dissolving into the background.
- **Both hero moments** verified animating in the final mp4 (the live block; the readable 9→2 unravel).
- On-spine: reuses the app's exact palette; **late is amber, never red**; the trust band is a
  **word, never a number**; **no credit-score number** anywhere on screen.
```
