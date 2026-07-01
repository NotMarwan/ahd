> ## ⏸️ LEGACY / FROZEN PRESENTER BUILD — not the product
> **The product is now the unified app at [`../app/`](../app/).** It supersets this demo
> (witnessed record · Muqassa · Circle) **plus** the consumer features (create · دفتري · القرض
> المفتوح · الدائرة treasurer · الدائرة+) in one cohesive 7-screen product.
>
> This single-file demo is **kept, byte-for-byte frozen** (tripwire SHA-256 `e2f48467…d1b8be40`),
> as a known-good offline presenter fallback that runs the golden hash-chain + netting path live.
> **`index.html` here is never edited.** Run the product instead: `node ../app/_serve-app.cjs`
> → http://localhost:8124. See the root [`README.md`](../../README.md) and decision **D-4**.

# عهد · Ahd — prototype (deepened)

Single-file, **offline**, deterministic, **Arabic-RTL** prototype of the champion concept
([[concept-ahd]]): the witnessed-money rail for money *between people*.

This build deepens the original to seal two Gauntlet teardown attacks and over-invest in the
weakest judging criterion (Data). Built to the shared canonical model
(`08_Ahd_Deep/00_Shared/contracts.md` — the `Ahd` object C2, fee model C3, lifecycle C4, Muqassa C6).

## Run
- **Simplest:** double-click `index.html` (works from `file://`, no server, no network).
- **Via a server** (only needed for tools that block `file://`, e.g. Playwright):
  `node ../_serve.cjs` → open `http://localhost:8123/` (Node ≥18; serves this folder).

## The flow (5 screens)
1. **The problem** — the stats + Ayat al-Dayn (2:282).
2. **Create the agreement** — Noura lends Sara 5,000 SAR *qard hassan*; **ALLaM-style** Arabic terms typed live + **riba-clean check** (✓ no interest / ✓ no late penalty).
3. **Dual Nafath confirm → the witnessed record + a LIVE tamper-evident verifier.**
   The record is sealed with a **real SHA-256 hash-chain** (content hash → `prev_hash` chain → block seal). Press **«تحقّق الآن»** to recompute and confirm integrity; press **«جرّب العبث بالمبلغ»** to mutate the amount (5,000→9,000) and watch the seal **fail** — tampering is exposed on screen. *This is what "مقبولة كدليل · نظام الإثبات 2022" means, demonstrated, not asserted.*
4. **Auto-settlement via sarie** — installments tick off → **ذمّة محفوظة** (sarie's SAR 20,000/txn limit noted).
5. **Muqassa netting** — a **trust-network graph** of 9 tangled IOUs among 5 friends (each ringed with a **kept-promises** reputation — a social signal, **explicitly not a credit score**) collapses to **2 transfers**, with a **conservation proof** table: every party's net position is preserved to the halala, and Σ paid = Σ received (900 = 900).

## Built vs mocked (honest)
- **Really computed:**
  - the **record integrity**: a from-scratch **SHA-256** (verified against NIST test vectors) over a canonical serialization, chained `genesis → block` as `seal = SHA256(prev_hash + content_hash + seq)`;
  - the **live verifier + tamper detection** (recompute-and-compare);
  - the **settlement schedule**;
  - the **Muqassa netting** (greedy debtor↔creditor reduction, `O(E + n log n)`) **and** its conservation invariant.
  - All **deterministic** — no `Date.now`, no `Math.random`.
- **Mocked behind clear seams** (labeled `محاكاة` in the UI): **Nafath** biometric confirm + the production PKI signature, **sarie** settlement, **ALLaM** term drafting, and the RFC-3161 trusted-timestamp token. Real integrations drop into these seams; the hashing/chain/netting do not change.

## Why the SHA-256 is in-page (not Web Crypto)
A from-scratch synchronous SHA-256 keeps the prototype **double-click-offline and deterministic** with zero dependency on `crypto.subtle`'s secure-context rules — and lets the demo show the *exact bytes → exact hash* relationship live. Production uses the platform/HSM hash + a licensed TSP signature; the construction is identical.

## Verification (browser, not just authored)
Served over HTTP, loaded in **Chrome via Playwright**.
- **0 JS console errors** (favicon now embedded — no 404).
- **0 horizontal overflow**; all 5 graph nodes measured within the card.
- **SHA-256** matches NIST vectors (`""`, `"abc"`, multi-block) + stable on Arabic input.
- **Verifier:** valid record → ✓ "سليمة"; tamper 5,000→9,000 → seal changes (`6c9410b9…` → `0b4c5d6d…`) → ✗ "عبثٌ مكشوف".
- **Muqassa:** 9 IOUs → 2 transfers; conservation holds (نورة −900 pays 900; خالد +600, فهد +300 receive; Σ paid = Σ received = 900; all nets → 0).
- Evidence: `screenshots/ahd-02-record.png` (sealed + verified) · `ahd-03-tamper.png` (tamper caught) · `ahd-04-netting.png` (graph + conservation proof) · `ahd-05-network.png` (the tangled before-state) · `ahd-01-problem.png`.

## Files
- `index.html` — the whole prototype (HTML/CSS/JS in one file).
- `screenshots/` — browser-verified captures.
- `../_serve.cjs` — tiny static server (only for `file://`-blocking tools).
