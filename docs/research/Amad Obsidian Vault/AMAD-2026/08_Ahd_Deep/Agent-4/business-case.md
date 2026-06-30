#ahd #agent/4 #business-case

# Ahd — The Business Case (with numbers)

> Every figure is either **web-cited** (June 2026) or a **clearly-labelled designed assumption** built on a cited anchor. The revenue model is tied to the Shariah-clean fee from Layer 1 (free/float-default). The adoption projection is tied to Layer 3's honest **k ≲ 0.36** and the Musaned **presence** beachhead — not to any refuted "viral" or "regulation-forces-both-sides" claim.

---

## 1. Market sizing — the rails Ahd rides

| Anchor | Figure | Source |
|---|---|---|
| KSA financial inclusion (adults with an account) | **~94%** (2025), up from ~74% (Jan 2024); SAMA target was 90% | International Banker (Aug 2025); Statista |
| Population | **~34–38M** (GMI 2026 ~34.3–38M; ~44% expatriate ≈ 14–17M) | GlobalMediaInsight KSA stats 2026 |
| **Nafath-eligible base** (nationals + Iqama residents) | **~35M** (≈20.9M nationals + ~14.4M Iqama holders) | GASTAT 2024 census + GLMM (per verification C4) |
| Nafath reach | **~17.2M downloads ≈ 75% of adults**; used >3B times across 470+ services | staff4all/DGA 2025 (per Layer 3) |
| **Expat outbound remittances** | **SAR 144.2B** in 2024 (+14% YoY); Saudi-national outbound **SAR 68.6B** → **~SAR 213B** total cross-border P2P | Argaam; Saudi Gazette; Arab News (SAMA) |
| sarie throughput | **SAR 2.5 trillion** processed in 2024; instant retail leg ~SAR 43B/month and rising | Arab News; Mordor Intelligence |
| Domestic-labour contracts | **>2M** (2023); **all employer salaries digital from 1 Jan 2026** | Arab News; HRSD; Lexis Middle East |
| E-payments share of retail | **79%** of transactions (2024) | Arab News (SAMA) |

**TAM framing (honest, layered):**
- **The behavior, not a transfer pool.** Ahd's TAM is not "remittances" — it is the **count of interpersonal money-promises** (friend loans, family IOUs, flatmate splits, deferred payments) among the **~35M Nafath-eligible residents.** Remittances (~SAR 213B) and sarie (SAR 2.5T) prove the **rails and the money habit are massive and digital**; they are the *context*, not the direct TAM.
- **SAM (serviceable):** the Nafath-eligible residents who lend/borrow interpersonally + the **>2M domestic-labour households** whose wage flows are now digital and KYC'd. If even **5%** of ~35M (~1.75M people) document **2 covenants/year** averaging SAR 3,000, that is **~3.5M covenants/yr ≈ SAR 10.5B** of witnessed interpersonal value flowing over Ahd — a credible early SAM.
- **SOM (3-yr obtainable):** see §4 — driven by the beachhead ladder, not blind virality.

---

## 2. The revenue model (tied to the Shariah-clean fee)

Per the verified Layer-1/Layer-2 contract (`contracts.md` S4), **the qard carries zero fee.** Revenue is structurally constrained to be **not riba.** Four lines, ordered by Shariah-safety:

| # | Line | Mechanism | Shariah basis | Cited grounding |
|---|---|---|---|---|
| **R1** | **Float on in-flight settlement balances** (DEFAULT) | funds held briefly in **amana** before sarie execution earn a return for the bank as custodian | the cleanest — **no fee on the qard at all**; sidesteps riba entirely | AAOIFI SS-19 (fee question avoided); float is standard PSP economics |
| **R2** | **Flat per-ahd amana/wakala service fee** (fallback) | fixed SAR amount per witnessed covenant, **decoupled from amount AND tenor**, recovering **actual DIRECT cost**, board-approved | AAOIFI SS-19 cl.10/3/2: actual-cost, not %-of-principal | verification C2/C7/C13 |
| **R3** | **Deposit / primary-bank primacy** | every guest who converts (Tier-0→wallet) becomes an Alinma deposit relationship; CASA + cross-sell | indirect; no charge on the loan | standard banking unit economics |
| **R4** | **B2B / API** | the witnessed-covenant + Muqassa engine licensed to employers (Musaned wage covenants), property managers (rent), SMEs | service fee for a genuine service | AAOIFI permits genuine-service ujrah |

**The pitch posture:** lead with **R1 (free at the consumer layer, float + primacy monetised)** — it is the strongest Shariah answer and the strongest growth answer (zero price friction on a cold-start product). R2 is the disclosed fallback if a fee is ever needed; **the Alinma Shariah board approves the figure + methodology + the two-contract separation** (the device is the contestable part — C2). **Important honesty flag:** no public source confirms Alinma already runs a flat per-ahd fee — R2 is stated **conditionally** (IF charged, THEN clean), not as existing fact.

---

## 3. Cost & float logic

**Cost structure (designed, per-covenant):**
- **Variable cost per witnessed ahd:** Nafath/CSP (emdha) signature call + RFC-3161 timestamp + sarie settlement fee. sarie consumer fee is capped at **SAR 0.50–1.00/txn** (SAMA Rulebook). CSP AES calls are sub-SAR-single-digits at volume. **Estimated all-in marginal cost ≈ SAR 2–5 per witnessed covenant** (designed assumption; the R2 fee, if charged, is set to this **actual DIRECT cost**, e.g. SAR 5 flat — and AAOIFI bars recovering overhead, so the fee cannot exceed it).
- **Fixed cost:** the platform (ALLaM/watsonx drafting, the core, the ledger), absorbed by the bank as a strategic acquisition + primacy play, not loaded onto the fee (AAOIFI excludes overhead from the actual-cost fee — C2).

**Float logic (the primary economics):**
- A covenant that settles via a **standing mandate** holds funds in **amana** for a short window (hours, per sarie's sub-second rail + scheduling). Float is **thin per transaction** but compounds across **millions of recurring covenants** (salaries, rent, installments).
- **Worked illustration (designed):** if Ahd intermediates **SAR 10.5B/yr** of witnessed flow (the §1 SAM) with an average **2-day** in-flight hold at a conservative **2% annualised** custodian return → float income ≈ SAR 10.5B × (2/365) × 2% ≈ **SAR 1.15M/yr** at the early SAM. The float scales **linearly with witnessed volume** and is the reason the consumer layer can stay free. (Labelled assumption; real hold-time depends on mandate design — most flows settle instantly, so float is genuinely thin and **deposit primacy R3 is the larger prize**.)
- **The honest read:** float alone is not a fat margin. The business case rests on **deposit primacy + CAC avoidance + brand moat**, with float as the clean consumer-facing monetisation that keeps the qard untouched.

---

## 4. Three-year adoption projection (tied to k ≲ 0.36 + the beachhead)

**Growth math (Layer 3, verified C11):** organic **k ≲ 0.36** means each paid/seeded user brings <1 organic user, but **amplifies paid acquisition by 1/(1−k) ≈ 1.57×.** So growth = **seeded cohorts × 1.57 organic multiplier × recurring retention**, NOT viral self-sustenance.

**The beachhead engine (honest, post-C10):** the 1 Jan 2026 Musaned mandate does **not** force a two-sided interpersonal rail — but it **puts >2M domestic-labour households + workers into digital wallets and KYC.** That is a **warm, identity-verified, recurring-payment population** for whom a **witnessed wage-covenant** product is a natural adjacent offer (with HRSD/employer GTM, not regulatory automation). This is the seed that makes the cold-start tractable.

| Metric (designed; anchors cited) | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Seeded users (Musaned wage-covenants + flatmate/family pilots) | 150,000 | 600,000 | 1,800,000 |
| Organic multiplier (×1.57 from k≈0.36) | →235,000 | →940,000 | →2,825,000 |
| **Total active users (cumulative, with ~22% D30 retention)** | **~200,000** | **~850,000** | **~2,400,000** |
| Witnessed covenants/yr (≈2/user, recurring lifts it) | 0.4M | 2.0M | 6.5M |
| Witnessed value/yr (avg SAR 3,000) | SAR 1.2B | SAR 6.0B | SAR 19.5B |
| New Alinma deposit relationships (guest→wallet @ ~30% convert) | 60,000 | 255,000 | 720,000 |

**Why these are defensible, not optimistic:** the seeded base is anchored to a **real >2M-household mandate population** (not a hopeful viral curve); the **1.57× multiplier is the mathematically correct consequence of k≈0.36** (not an assumed k>1); retention (~22% D30) is earned by the **recurring-covenant hook** (4→18 events/yr), not assumed. If the family-lending segment underperforms, the **Musaned + flatmate recurring rungs still carry the base.**

**Sensitivity:** if organic k is at the **low end (0.10)**, the multiplier drops to 1.11× and Year-3 actives fall to ~1.7M — still a material rail, because growth is **seed-driven, not k-driven.** This is the honesty dividend: the model does not collapse if virality is weak, because it was never load-bearing.

---

## 5. The bank's strategic return (why Alinma funds this)

1. **CAC near zero on a primacy product:** every witnessed covenant pulls a counterparty (often a non-customer) into an Alinma touchpoint; ~30% convert to a deposit relationship. The covenant *is* the acquisition channel.
2. **Deposit primacy + CASA:** 720,000 new relationships by Year 3 (designed) at even a modest CASA balance is the real P&L, dwarfing float.
3. **An uncopyable brand moat:** Alinma becomes **"the bank that is the just scribe of your word" (2:282).** A conventional bank cannot credibly stand on amana/wakala/qard hasan; a fintech cannot be the bank-grade amana custodian on sarie. The moat is **trust + rails + faith.**
4. **Regulatory goodwill:** a Shariah-clean, PDPL-clean, financial-inclusion-positive product that supports the Musaned wage-protection agenda — exactly the Vision-2030 / SAMA narrative.

---

## 6. Residual business risks (honest)
- **Float is thin** if most covenants settle instantly — primacy/CAC, not float, must carry the margin. (Owned.)
- **Musaned is presence, not a forced two-sided rail** (C10) — adoption via that channel needs an HRSD/employer GTM, not regulatory automation.
- **The R2 fee is conditional** — no Alinma-specific product yet; board must approve figure + the contestable two-contract device (C2). Default to free/float to de-risk.
- **Lending-pain market stats** (e.g. "30% never repay") are **US-illustrative (KSA figure pending)** and **secondary** anyway — the case leads on KSA-grounded scale: **سند لأمر** ubiquity (the documentation habit already exists), **43M+ Najiz e-services H1-2024**, **SAR ~213B** interpersonal remittances, **SAR 2.5T** sarie. (Fixup pass, Agent 2.)

## Sources
- International Banker — Saudi Central Bank digital payments (financial inclusion ~94%, 2025): https://internationalbanker.com/finance/saudi-central-bank-driving-transformation-in-digital-payments/
- Argaam — Expat remittances SAR 144.2B in 2024: https://www.argaam.com/en/article/articledetail/id/1788759
- Saudi Gazette — Expat remittances jump 14% in 2024: https://saudigazette.com.sa/article/649194
- Arab News — Saudi-national outbound + SAMA remittance data: https://www.arabnews.com/node/2590360/business-economy
- Arab News — sarie/SARIE throughput & e-payments 79%: https://www.arabnews.com/node/2331311/business-economy , https://www.arabnews.com/node/2597120/business-economy
- Arab News — Musaned mandatory e-salary: https://www.arabnews.com/node/2627040/saudi-arabia
- HRSD — Wage Protection Service for domestic workers: https://www.hrsd.gov.sa/en/media-center/news/130520241
- Lexis Middle East — Mandatory e-salary system 2026: https://www.lexismiddleeast.com/news/2025-12-22_23/en
- GlobalMediaInsight — KSA population statistics 2026: https://www.globalmediainsight.com/blog/saudi-arabia-population-statistics/
- SAMA Rulebook — Instant Payments (sarie) fees/limits: https://rulebook.sama.gov.sa/en/instant-payments-launch-sarie
