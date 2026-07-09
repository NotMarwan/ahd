# Ahd (عهد) — design conventions for the design agent

Ahd is an Arabic-first, RTL Saudi Islamic-finance product: a bank that **witnesses** interest-free
interpersonal loans (قرض حسن) — it never lends, judges, scores, or charges on the loan. Every design
must read as a shipped Saudi fintech surface, warm and dignified.

## Wrapping and setup

- Root: `<html dir="rtl" lang="ar">`, content inside `<div id="app">` (430px column, warm `--bg` background). Without `#app` you lose the column width and padding.
- Font stack is set on `body` by the stylesheet ("Segoe UI", "Noto Naskh Arabic", Tahoma) — do not override; hashes/code use `--mono` and MUST be `direction:ltr`.
- All component CSS arrives via `styles.css` (`@import`s `_ds_bundle.css` — the app's real stylesheet, copied verbatim). Read it before styling anything.

## Styling idiom — tokens + existing classes, never invented ones

Token vocabulary (CSS custom properties on `:root`, all real):
- Surfaces: `--bg` `--card` `--line` `--ink` `--mut`
- Semantic colors: `--teal`/`--teal-soft` (primary action, "owed to you"), `--gold`/`--gold-soft` (bank/covenant/"you owe"), `--amber`/`--amber-soft` (**lateness — never red**), `--bad`/`--bad-soft` (**RESERVED: cryptographic tamper-fail only**), `--mute`/`--mute-soft` (neutral)
- Sealed-document theme: `--seal-bg` `--seal-ink` `--seal-lbl` `--seal-hash` `--seal-well` + `--mono`
- Scales: spacing `--s-1..--s-6`, radius `--r-sm..--r-xl` + `--r-pill`, type `--t-xs..--t-hero`, elevation `--shadow-sm` `--shadow` `--shadow-lg`

Component classes are scoped — pair child with parent exactly as shipped:
`.hero`>`.brand`/`.tag`/`.sub` · `.hcards`>`.hcard`>`.hico`/`.ht`/`.hs` · `.tiles`>`.tile`>`.tl`/`.tv`/`.tc` ·
`.tabs`>`.tab(.on)` · `.dfilter`>`.fchip(.on)` · `.selfband` · `.net.lak|.alayk|.bal` · `.flash` · `.hsummary` · `.hbasis` ·
`.navbtn(.on)`>`.navico` · `.dask` · buttons: `.cr-act .primary`, `.ol-act .primary|.ghost`, `.cr-trybar .ghost`, `.ol-seal .mini` ·
seal: `.ol-seal`>`.sl`/`.sh`/`.sv.ok|.bad`. There is **no** generic `.btn`/`.card` class — do not invent one.

## Hard content rules (the product's spine — violating them is a broken design)

1. **No riba imagery/copy**: no interest, penalties, late fees — mercy framing only (﴿فنظرةٌ إلى ميسرة﴾).
2. **No numeric trust**: the trust signal is a word band («وفّى بعهوده») — never a score, percentage, ranking, or stars.
3. **Red law**: brick-red = tamper-fail ONLY. Late is amber. Debtors are never shamed.
4. **No percentage glyphs** (٪/%) in product stats — write fractions in words/numbers («7 من 9»).
5. Simulated integrations (Nafath/sarie) carry «(محاكاة)» in the label — keep it.
6. Money = integer SAR with grouping (2,500) — never decimals/floats.
7. Qur'anic text uses ﴿﴾ brackets, verbatim, never paraphrased.

## Where the truth lives

`styles.css` → `_ds_bundle.css` (the entire real system, ~690 lines) · per-component `components/<group>/<Name>/<Name>.prompt.md` · previews are real product markup.

**Before designing anything, read `guidelines/anti-slop.md`** — the binding taste charter (banned
defaults, required Editorial-Luxury texture, self-check). `guidelines/brand.md` holds the brand lines.

## Idiomatic snippet

```html
<div id="app">
  <div class="ol-seal" style="padding:16px">
    <div class="sl">الوثيقة المختومة · نفاذ (محاكاة) + SHA-256</div>
    <div class="sh">SEAL: 6c9410b9e4a0…</div>
    <div class="sv ok">✓ سليمة — مطابقة للختم</div>
  </div>
  <div class="cr-act"><button class="primary">اختم العهد عبر نفاذ (محاكاة)</button></div>
</div>
```
