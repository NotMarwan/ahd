# Phase 3 — Remotion promo of the NEW features (plan)

> Brief: a high-end, smooth, **fast-paced** 60fps motion film showcasing the **Phase-2 NEW**
> features, with an **animated Arabic caption per feature**. Reuse the app's exact look; port screens
> to animatable Remotion components (not flat screenshot pans). **HARD: verify Arabic renders
> correctly on a real frame BEFORE the full render.** No voiceover; captions only; late=amber never
> red; no score/number on screen.

## Target
- 1080×1920, **60fps**, H.264 mp4 → `project/ahd-promo/out/ahd-new-features.mp4`.
- A single cohesive film of the 4 new features, reusing the existing motion system + Phone frame +
  Caption + theme from `ahd-promo` (extend, don't rebuild).

## Beat structure (fast pace; one `PACE` constant)
1. **Cold open** (~2s): brand «عهد» + «كلمتك محفوظة، وعلاقتك محميّة».
2. **F1 سِجلّ الشهادة** (~3.5s): the feed cascades in — sealed / kept (🤍) / dispute (neutral ⚖️)
   entries stagger up the phone. Caption: **«سِجلّ الشهادة» / «كلُّ عهدٍ — موثَّقٌ، ومحفوظ»**.
3. **F2 حافظة الإثبات** (~5s, the hero beat): the evidence doc assembles, the hash "computes"
   (scramble→settle), the seal **locks** → «✓ سليمة»; then a tamper attempt flips it «✗ عبثٌ مكشوف»
   (red = integrity alert, not a person), then restores ✓. Caption: **«حافظة الإثبات» / «وثيقةٌ
   مختومة، تُقبَل دليلًا — والعبث يُكشَف»**.
4. **F3 محلّ خلاف** (~3.5s): the record **pauses** (⏸️), the bank steps back, the two paths
   (تراضٍ encouraged · قضاء) reveal. Caption: **«عند الخلاف» / «عهدٌ يشهد، ولا يحكم»**.
5. **F4 الإعدادات** (~3.5s): digits morph ٠←0 across an amount; the «ما لا نفعله» cards stagger in
   (لا نُقرض · لا نحكم · لا نأخذ زيادة · لا نُصنّف). Caption: **«بأرقامك، وبشروطك» / «لا ربا، ولا
   غرامة، ولا تصنيف»**.
6. **Close** (~2.5s): brand + «نشهد، ونحفظ — ولا نُقرض، ولا نحكم» + the verses (2:282 · 2:280).

Total ≈ 20s. Captions are concise, on-spine, invent no off-spine claims, show no score/number.

## Motion language (reuse the existing system)
Custom eases/springs, a floating device frame with depth, staggered element reveals, the data ALIVE
(entries settle, the hash scrambles→locks, the tamper flips, digits morph). Snappy: short dwell,
quick transitions, tuned by the single `PACE` constant.

## Arabic/RTL — the make-or-break (do FIRST)
1. Determine how the existing promo loads Arabic (bundled .ttf via `@remotion/fonts`/`staticFile`,
   `@remotion/google-fonts`, or a system font). If it relies on a system font, **bundle a real
   Arabic webfont** (e.g. Noto Naskh Arabic / IBM Plex Sans Arabic / Tajawal) so headless Chromium
   shapes it correctly and identically everywhere.
2. `direction: rtl` on every text container; correct font-family.
3. **Render ONE still frame** of an Arabic-heavy beat (`npx remotion still …`), open the PNG, and
   VERIFY: letters joined/shaped correctly, not reversed, not boxes/tofu. Only then render the film.

## Build order
1. (await the ahd-promo structure map) → confirm font strategy; fix fonts if needed.
2. Write `beats/BeatTimeline`, `BeatProof`, `BeatDispute`, `BeatSettings` reusing Phone+Caption+motion+theme.
3. New `<Composition>` (e.g. `AhdNewFeatures`) sequencing ColdOpen → 4 beats → Close.
4. **Still-frame Arabic check** (open + verify). Fix until perfect.
5. Full render → `out/ahd-new-features.mp4`. Confirm it plays, is smooth/fast, Arabic correct,
   captions present, key moments animate. Commit + push the project + the mp4.
