---
title: "ضيف Dayf — the Guest of God's financial companion (FORTRESS 1)"
tags: [gauntlet, agent/3, arena/invisible-underserved, concept/dayf, sealed, track/customer-experience, score/87]
updated: 2026-06-18
---

# 🕋 ضيف · Dayf — "We take their wallet. We never protected their trust."
> Arena: The Invisible & Underserved. Direction: the **transient** invisible — foreign pilgrims as guests of the Kingdom. Goes *further than Dhimmah*: Dhimmah serves the **Saudi's** one-time pre-Hajj conscience; Dayf serves the **foreign guest's** real daily financial life in-Kingdom.

## 1. One-liner
**Dayf gives every foreign pilgrim a "guest of God" financial companion for their days in the Kingdom — a fair-FX wallet, ritual payments they can *verify were actually performed* (the hady sacrifice, fidyah), scam protection in their own language, and a one-tap way to turn leftover riyals into verified sadaqah before they fly home.**

## 2. The category
**The pilgrim-guest's financial *protector*** — not a payments wallet (Nusuk is that). The dignity + verification + FX-fairness layer for the largest recurring religious migration on earth. The "never seen this": *ritual-payment verification* + *guest-FX-fairness* + *multilingual scam-shield* fused into one companion for people the Saudi financial sector treats as transactions, not guests.

## 3. Problem & proof
- **~1.67M Hajj + ~18–20M Umrah pilgrims/yr**, with the Vision-2030 **Pilgrim Experience Program targeting 30M Umrah pilgrims/yr.** [Saudi Vision 2030 — Pilgrim Experience Program](https://www.vision2030.gov.sa/en/explore/programs/doyof-al-rahman-program)
- The foreign guest arrives and is **financially defenseless**: gouged by airport/street FX, can't open a local account, can't read Arabic, and is a **prime fraud target** (fake charities, fake-vendor QR codes, and the infamous **hady scandal** — you pay for a sacrifice and *never know if it was performed or who received it*).
- **Nusuk Wallet (SNB)** gives pilgrims *payments* — but **no FX-fairness, no ritual *verification*, no scam protection.** The single largest underserved financial segment on earth is served as a wallet, not a guest.
- **Why now:** Nusuk digital pilgrim identity + licensed e-money wallet rails + **Adahi** (the official IsDB sacrifice project, already digitized + voucher-issuing) + ALLaM multilingual = all 2026 KSA infrastructure.

## 4. Solution & mechanics (one spine: *protect & dignify the guest's money*)
1. **Instant guest wallet** — onboard from the **Nusuk visa/passport** the pilgrim already holds; no local account needed.
2. **Fair-FX** — load home currency, spend at the **real spot rate**, see the SAR saved vs the street exchanger (transparent, halal spot).
3. **Verified ritual payments** — pay hady/udhiyah/fidyah through **Adahi (licensed)** → receive a **verified receipt**: proof it was performed + which needy family received the meat. *This closes the hady trust gap.*
4. **Multilingual scam-shield** — at the moment of a risky payment (fake charity QR, unlicensed vendor), ALLaM warns **in the pilgrim's language**. (A guest-protection feature, not a standalone fraud product.)
5. **Leftover → sadaqah** — at departure, one tap converts the leftover balance to **verified sadaqah** (or repatriates it).
- **Only-possible-now/here:** Nusuk identity + Adahi digitized sacrifice + multilingual ALLaM + licensed wallet rails — and **only an Islamic bank in the land of the Two Holy Mosques** can credibly own *ikrām al-ḍayf* (honoring God's guest).

## 5. Architecture (modules under one spine)
```
            ضيف Dayf — "protect & dignify the guest"
   ┌───────────┬───────────────┬──────────────┬───────────────┐
   │ Wallet+FX │ Ritual-Pay    │ Scam-Shield  │ Exit-Sadaqah  │
   │ (fair spot)│ (Adahi-verified)│ (multilingual)│ (leftover→good)│
   └───────────┴───────────────┴──────────────┴───────────────┘
   one identity (Nusuk) · one balance · one hero demo (the verified hady receipt)
```
Each module earns its place by closing a hole Nusuk leaves open. Demo shows **one** flow.

## 6. Track + requirements
- **Track (one):** **2 — Customer Experience.** *(Alt: 5 — Open Banking, the wallet rail.)*
- **Requirements:** **/03 CX** (the guest's dignified experience) + **/02 AI** (multilingual scam-shield + guidance) + **/01 Data** (FX-fairness + fraud signals).

## 7. 72h build plan
- **Stack:** multilingual + Arabic-RTL app → wallet ledger (synthetic) → **FX engine** (real spot-rate table → savings delta) → **Ritual-Pay with verified-receipt** flow (mock Adahi API returning a receipt + recipient family) → **scam-shield** (rules + ALLaM seam, multilingual) → exit-sadaqah.
- **Built for real:** wallet + FX transparency (the savings number), the **verified ritual receipt**, the scam flag in a chosen language, the leftover-to-sadaqah conversion.
- **Mocked (labeled):** Nusuk onboarding, the live Adahi API, real settlement, live ALLaM (deterministic seam).
- **The ONE feature that must work:** **pay for the hady → receive a *verified* receipt (performed + given to family X).**
- **Day cut-line:** D1 wallet + FX engine + synthetic pilgrim; D2 verified Ritual-Pay + scam-shield; D3 exit-sadaqah + multilingual polish + offline fallback recording. Deterministic, offline, RTL.

## 8. Data story (live)
- **FX-fairness:** real spot-rate vs a street-rate benchmark → "you kept **SAR 142** the airport would have taken" (a live computed delta).
- **Verified sacrifice:** the receipt with proof + recipient — the data moment that *is* the trust. Depth beyond a chart: FX delta + fraud-signal scoring + verified-distribution record.

## 9. UX
Pilgrim's **home language + Arabic**, banking-illiteracy-proof (one-time visitors), calm and reverent. The wow: the **verified hady receipt** — the first time a pilgrim *knows* their sacrifice was real.

## 10. 3-minute demo
1. **0:00** — "Twenty million guests come to worship. We hand them a wallet and leave them prey to FX gougers and fake-sacrifice scams. Watch us protect one." 
2. **0:30** — Budi from Indonesia loads rupiah → spends at the real rate → "**you kept SAR 142** the street would have taken." 
3. **1:20** — He pays for his **hady** → a **verified receipt**: *performed + given to the Al-Harbi family*. (The wow — he finally *knows*.) 
4. **2:10** — A fake-charity QR → Dayf warns **in Bahasa** before he pays. 
5. **2:40** — Departing, SAR 80 left → one tap → **verified sadaqah.** Close: "We took the guest's wallet. **Dayf protects the guest's trust** — and only the bank of the Two Holy Mosques can."

## 11. Business / Alinma-ship case
- **Revenue:** seasonal **massive-volume FX + interchange** + B2B2C fees (Nusuk/Adahi integration) on a **Vision-2030 national-priority funnel (30M target).**
- **Brand:** "the bank that protects God's guests" — an uncopyable, globally-resonant moat tied to the Two Holy Mosques.
- **Funnel, not LTV:** the guest leaves, but the funnel **re-fills every season**, pilgrims **return for Umrah**, and **refer family**; leftover-to-sadaqah + a good experience converts a share into Alinma relationships. (This is how Dayf seals the "they leave" hole — see §13/5.)
- **Compliance:** licensed e-money wallet (Nusuk-wallet precedent), SAMA-aligned, PDPL consent.

## 12. Shariah
Clean *and positive*: **ikrām al-ḍayf** (honoring the guest); **spot FX** (halal, no riba); **verified, licensed** sacrifice + charity (no gharar); no maysir. Ritual rulings come from official sources (Adahi/authorities); **the AI never issues a fatwa.**

## 13. ⭐ OBJECTION-KILLER TABLE (every vector sealed)
| # | Worst credible attack | Sealed answer (built into the design) |
|---|---|---|
| 1 Innovation | "Nusuk already gives pilgrims a wallet." | Dayf is **not** a wallet — it's the **verification + protection + FX-fairness** layer Nusuk lacks. The **Adahi-verified hady receipt** is net-new and closes an infamous trust gap. |
| 2 Technical | "Verified sacrifice is faked." | **Adahi** (official IsDB sacrifice project) is *already* digitized and voucher-issuing in production; Dayf integrates that real rail (mocked in-demo, real in prod). |
| 3 Data | "Thin." | Real **spot-FX savings delta** (live number) + fraud-signal scoring + the verified-distribution record — concrete, computed, shown live. |
| 4 UX | "Another wallet UI." | Multilingual, banking-illiteracy-proof, one-time-visitor-optimized; the hero is a **receipt of trust**, not a balance. |
| 5 Feasibility | "They leave → no LTV." | It's a **funnel product, not an LTV product**: seasonal high-volume FX/interchange + B2B2C on a Vision-2030 pillar; the funnel re-fills each season; Umrah-return + family-referral + exit-sadaqah convert a share. |
| 6 Shariah | "FX/charity edge cases." | Spot FX (halal), licensed-verified sacrifice + charity (no gharar), no riba/maysir; rulings from official authorities; AI issues none. |
| 7 Moat | "SNB/Nusuk could copy it." | The **verified-ritual + multilingual-shield + guest-FX** composite, the **Adahi/Nusuk integrations**, and the **"Islamic bank that protects God's guests"** brand — first-mover on the verification gap; brand is uncopyable. |
| 8 Demo | "What breaks live?" | Fully seeded + offline; the verified receipt + FX delta are deterministic; **no network dependency.** |
| 9 Adoption | "Why would a pilgrim install it?" | **Distribution via Nusuk** (the near-mandatory pilgrim app/visa) + points of entry; the FX saving + hady-trust are *immediately felt* on arrival — acute need, zero cold-start. |
| 10 So-what | "Nice-to-have?" | The **largest underserved financial segment on earth**, uniquely Saudi, on a **national-priority funnel**; the hady-trust gap is a real, recurring, painful scandal. |

## 14. Risk register
- **Nusuk/Adahi integration dependency** → standalone wallet works without them; they're distribution/verification *upside* and both exist in production.
- **Regulatory (guest e-money)** → Nusuk-wallet precedent proves the path; SAMA-aligned e-money license.
- **Demo** → fully offline/deterministic; recorded fallback.

## 15. Score & comparison
**Innovation 18 · Technical 16 · Data 16 · UX 15 · Feasibility 22 = 87/100** (honest).
**Beats Dhimmah in the same pilgrim space:** Dhimmah serves the **Saudi's one-time conscience** (no LTV, data mostly invisible to OB, a once-in-a-lifetime campaign). Dayf serves the **foreign guest's real daily financial life** (high-volume, real FX/ritual/fraud data, a funnel that re-fills every season) — sealing Dhimmah's two kill-vectors (frequency + thin data) while owning a bigger, uniquely-Saudi prize.

## Links
- [[concept-waqar]] (my fortress 2) · [[teardown]] · [[attacks]] · [[critique-notes]] · vs [[concept-dhimmah]] (A2)
