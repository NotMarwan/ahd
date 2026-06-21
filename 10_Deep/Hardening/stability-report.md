# Stability Report — Ahd prototype

**Owner:** Claude-Hardening · **Date:** 2026-06-19
**Claim:** professional, robust, deterministic, stage-stable — identical every run, zero console errors, fully offline. Every claim below is backed by a re-runnable test.

---

## The evidence

### Same every run
- `run-tests.cjs` produces **byte-identical** output on consecutive runs (`diff` clean).
- The sealed record reproduces the **same hashes after a full browser reload**: content `F8D11335…`, genesis `F80FCD62…`, seal `6C9410B9…` — matching the frozen golden vectors and the README.
- `netting` is identical across **100 runs**; `recomputeSeal` across **50**; a fresh re-evaluation of the sliced logic yields identical seal/netting/sha (`run-tests.cjs` §3, §6, §9).
- No `Math.random`, no `Date.now`/`new Date`, no `Intl`/`toLocaleString` in the logic region (source-scan asserts it). Money is integer halalas; sorts are tie-broken deterministically.

### Zero console errors
- Real Chrome (Playwright MCP): **0 errors, 0 warnings** on load and after the entire flow (dual confirm, verify, tamper, settle, Muqassa, linter, clamps, keyboard reset).

### Offline-clean
- `offline-check.cjs`: **9/9** — no external script/style/font/image, no `fetch`/XHR/WebSocket/Worker, favicon is an embedded `data:` SVG.
- Real-Chrome network trace: exactly **1** request (`GET /` — the page itself). Works the same from `file://` by double-click.
- SHA-256, the verifier, Muqassa, and the riba-linter all run **identically offline** (pure functions; rails are deterministic canned seams labelled `محاكاة`).

### Robust (can't break on stage)
- All in-flight timers are cancelled on every navigation; every DOM write is null-guarded; double-taps are ignored; the record issues exactly once; out-of-range navigation is clamped; a thrown render is caught by a clean offline fallback. **21/21** in `dom-smoke.cjs`, confirmed in real Chrome.

**Totals: 92 automated assertions, 0 failures + a clean real-Chrome pass.** See `test-results.md`.

---

## Reset-to-clean control (for re-demoing)

- **Esc** or **Home** at any moment → full deterministic `resetState()` → screen 0 (ignored while typing in the clause box, so it never interrupts input).
- The on-screen **«↺ من البداية»** does the same full reset.
- Every fresh page load boots through `go(0)` → guaranteed clean slate. So the demo is identical the 1st time and the 50th.

---

## Exact presenter click-path (do not wander off this line)

> Open: double-click `project/ahd-demo/index.html` *(offline, no server needed)*. You land on **Screen 0**, clean.

1. **Screen 0 — the problem.** Click **«لنبدأ — قرضٌ بين صديقتين ←»**.
2. **Screen 1 — create the agreement.** The Arabic terms type in live; the riba badges show ✓. The sign button enables once the clause box is empty.
   - *Optional wow:* click **«＋ غرامة تأخير ٥٪»** → it's flagged مخالف and the sign button disables; click **«↩ امسح»** → re-enabled.
   - Click **«تأكيد الطرفين عبر نفاذ ←»**.
3. **Screen 2 — witness + verify.** Click **«📱 تأكيد ببصمة نفاذ»** on **both** cards (نورة, then سارة). After both scans complete (~½s each), the **witnessed record** appears.
   - Click **«🔎 تحقّق الآن»** → ✓ **سليمة**.
   - Click **«🧪 جرّب العبث بالمبلغ»** → ✗ **عبثٌ مكشوف** (the seal flips, tampering exposed). *(Click again to restore the original.)*
   - Click **«المتابعة إلى السداد ←»**.
4. **Screen 3 — auto-settlement.** Click **«⏭️ تخطَّ الزمن — سوّ القسط التالي»** **five** times → **ذمّة محفوظة**. Click **«والآن… دائرة كاملة من الديون ←»**.
5. **Screen 4 — Muqassa.** Click **«⚡ شغّل المقاصّة»** → graph collapses, **9 → 2** transfers, conservation table, **Σ = 900 = 900**, every net **٠ ✓**.
6. **Reset for the next run:** click **«↺ من البداية»** (or press **Esc**).

**Safety rails baked in:** you cannot reach an unbuilt screen (navigation is clamped); double-tapping a confirm is harmless; if anything ever throws, a clean **«تعذّر عرض هذه الخطوة»** card appears with a one-tap reset. Bad Wi-Fi is irrelevant — nothing touches the network.

---

## What changed vs. not

- **Changed (logic/robustness only):** deterministic `fmt`, integer-minor money, tie-broken integer netting, named pure `sealBlock`/`verifyRecord`, relocated stateless riba engine, a single state machine with timer cancellation, exhaustive null-guards, an offline fallback, a keyboard reset, and the test markers.
- **Not changed:** any visual styling, CSS, layout, copy, colors, or rendered markup. The witnessed-record, tamper, and conservation screens are pixel-for-pixel as designed (see `evidence/`). Every hash/balance/verdict the user sees is byte-identical to the pre-hardening build (golden-pinned). Anything that would alter appearance was handed off, not applied.
