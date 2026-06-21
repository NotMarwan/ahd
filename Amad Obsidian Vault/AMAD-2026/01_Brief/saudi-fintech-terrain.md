---
title: Saudi Fintech Terrain (shared, append-only)
tags: [terrain, shared]
---

# 🗺️ Saudi Fintech Terrain — Shared Intel (APPEND-ONLY)

> All agents append live-verified findings here so the team cross-pollinates. Cite sources. Don't delete others' entries.

## Seeded by Agent 2 (Lane 2 — RegTech / Risk / Fraud) · 2026-06-18

### Regulatory ground (verified live, June 2026)
- **Open Banking is now a LICENSED activity** as of **26 Mar 2026** — moved out of SAMA's sandbox into a full supervised licensing regime. **AIS** (account info), **PIS** (payment initiation), **CAF** (confirmation of funds). Security = **FAPI** (mTLS, signed request objects, strict consent lifecycle). A pilot/bilateral deal is no longer sufficient — you need a SAMA licence. *(Clyde & Co, Lexology, Lean Tech, Mar 2026.)*
- **SAMA Counter-Fraud Fundamental Requirements** become **mandatory 13 Apr 2026** — replaces the old Anti-Fraud Rules for Finance Companies. Baseline standards across **banks, fintechs, payment providers, finance companies**. **Quarterly compliance reports to SAMA required since end of Q3 2025.** Mandates **real-time transaction monitoring + MFA + customer warnings**. *(SAMA Rulebook; getfocal.ai.)* → A concept that *operationalizes* this mandate reads as instantly shippable.
- **PDPL + explicit, informed, revocable consent** is the hard data constraint. OB rules: customer must control *which* data types are shared and revoke any time; banks/TPPs must run an **analytical fraud tool**. *(openbanking.sa; SAMA OB policy.)*
- **SAMA Open Banking Lab** (launched 2023): simulates a real bank's OB APIs with **mock data** + **conformance suites** to certify against the framework — *free prototyping surface*. *(openbanking.sa.)*

### Alinma-specific (the "could-they-ship-it" anchor)
- **Alinma developer portal / OB sandbox is live**: `developer-ob-sb.alinma.com` exposes **account, payments, transactions, authentication** APIs with **mock data** + sample code. *Register a dev account; prototype directly against rails Alinma already exposes.* *(alinma.com/en/Retail/Digital-Channels/Open-Banking.)*
- Stack: **IBM API Connect + Cloud Pak for Integration + Red Hat OpenShift + DataPower** (IBM case study). Modern microservices + GenAI-managed API lifecycle.

### Fraud / risk market (the P&L pain)
- KSA **fraud detection & prevention market**: ~**$470M (2025) → ~$1.99B (2034)**, CAGR ~17.4%. *(market reports.)*
- **APP (authorized push payment) fraud**: KSA losses **~$81.5M**; global ~$7B by 2026 across 6 markets incl. KSA. Push payments are **instant + irreversible** — neither victim nor bank can claw back. *(ACI Worldwide.)*
- **AI scams +300% YoY** targeting Saudi consumers; gov announced **SAR 13.3B** investment in AI cyber-defence incl. deepfake detection (Apr 2025).
- **Deepfakes in KSA +600% YoY (Q1 2024)**; a **$35M UAE voice-clone heist**; voice clone ~85% accuracy from 3–5 sec audio. *(AGBI, Group-IB, Gizmodo.)*
- **AML pain**: ~**95% false-positive** rate on legacy transaction monitoring; **~$274B/yr** global AML compliance spend; up to **22 hrs per alert** to investigate; predictive models cut false positives up to 40%. *(silenteight, Hawk AI, retailbankerinternational.)*
- **Mule accounts**: dormant → tester-payment → high-risk spike pattern; best caught via **network-graph + behavioral** analysis; APP-fraud × AML convergence is the 2026 theme. *(LexisNexis, Feedzai, BioCatch, Group-IB META.)*

### Competitor / white-space map (don't rebuild these)
- **Mozn / FOCAL** (Saudi-built, founded 2017) is the gorilla: unified **FRAML** (fraud + AML in one), Arabic+Latin name-matching vs 1,300+ sanctions/PEP lists, **agentic AI** autonomous case investigation, dynamic risk scoring, **"Payment Intelligence"** real-time payment fraud; up to **90% fraud reduction** at large EMI clients. **→ Sells B2B back-office. Do NOT rebuild sanctions screening / transaction-scoring.** White space = the **consumer/human layer** (APP-scam interception), the **new OB consent-fraud surface**, and **explainable Shariah-aware** angles.
- Other RegTechs: **Fintor** (AML/KYC automation), **STAMP** ($2M pre-seed, licensing/incorporation), plus GCC players EastNets, Opus, RecFaces.
- **KSA gap vs UK**: UK has **mandatory APP reimbursement (since 7 Oct 2024, up to £85k, split 50/50 sender/receiver PSP)** + **Confirmation of Payee** (~400 PSPs, **2B+ name-match checks/yr**). **KSA has NEITHER yet.** sarie confirms account *details* but does **NOT name-match payee to intended beneficiary** → APP fraud surface wide open. *(PSR; sarie/IBAN sources.)*

### Saudi rails to design against
- **Nafath** (national digital ID/KYC), **Mada** (cards), **sarie** (instant payments, live Feb 2021, 24/7; aliases via mobile/national-ID; quick transfers ≤ SAR 2,500 without adding beneficiary), **SIMAH** (credit bureau), **ZATCA** (e-invoicing), **Absher**.
- Data for a live story: `open.data.gov.sa`, SAMA statistics, Alinma/SAMA sandbox mock data, World Bank Findex, **synthetic transaction generation** for demo volume.
- Consumer-protection context: NCA **"Kafalah"** awareness program; OTP-sharing warnings; cybercrime reporting via my.gov.sa.

> Agents 1 / 3 / 4: append your terrain below this line.
---

## Seeded by Agent 4 (Lane 4 — Literacy × Gamification / Behavioral) · 2026-06-18

### The savings & literacy gap (the spine of any behavior concept)
- **Household savings rate ≈ 1.6%** vs ~10% global minimum. Vision 2030 target 6%→10%. **SAMA National Savings & Financial Literacy Strategy** exists specifically to fix this — a regulator-blessed tailwind. *(Strategy& / KPMG / Argaam.)*
- **Adult financial literacy ≈ 38%** (2023, up from 30% in 2021); 62% lack basics. MoE added a mandatory school "Financial Knowledge" course (2023) — today's adults missed it. **Financial Literacy Entity (FLE)** under FSDP.

### Shariah crux (affects EVERY lane touching savings / returns / rewards — reuse this)
- **Prize-linked / prize-draw savings (Premium Bonds, Long Game, lottery) = near-unanimously HARAM** (maysir + gharar). Never propose a chance-based reward draw for Alinma.
- **Halal reward = hibah (discretionary gift)** — valid only if the reward is **NOT a contractual condition** and the bank isn't obliged to pay (precedent: ADIB "Ghina"). Safe design = guaranteed tiers + skill/effort + merchant-funded cashback, **no chance**. *(IslamQA, Islamic Knowledge, Adl Advisory.)*

### Behavioral mechanics with field evidence (reusable)
- **SMarT (Save More Tomorrow):** pre-commit future income → savings **3.5%→13.6%** over 40 months; 78% join. Localize: "save more next payday / next gig." *(Thaler & Benartzi, JPE.)*
- Gamified savings → **+30% savings** (younger users), Qapital savers **+20%**. ⚠️ Effects **decay on discontinuation** → tie rewards to *real* money outcomes, not points. *(Wiley Financial Planning Review; Marketing Science.)*

### KSA competitive map for education/gamification/savings (don't rebuild)
- Group savings/jam'iyah → **Hakbah** (1.3M users, 70% youth, CNBC Top Fintech 2025). Teen card → **Cashee** (ANB), **ZakiPay**. PFM/budgeting → **Drahim**, **Malaa** (Shariah, auto-zakat). Round-up → **STC Bank**. Gamified engagement → **Alinma Fantasy** (sports predict-and-win — NOT tied to real money/behavior = the gap).

### Alinma strategic hooks (the "could-they-ship-it" anchor — useful to all lanes)
- **"iz"** = youth banking brand/channel. **"iz Business"** (Oct 2025) = entrepreneurs/SMEs/**freelancers**. **BaaS** + OB API platform. Plugging into iz / iz Business = instant feasibility + on-strategy.

### Segments & rails
- 150k+ registered freelancers (مستقل), 225 permitted professions, 25–34 skew, feast-or-famine income, GOSI optional, **no personal income tax but zakat applies** (ZATCA calculator). Two-thirds of nationals under 30; mobile penetration 116%.
- BNPL overextension: 15M+ Tabby users, ~20% credit-card penetration, SAR10k per-consumer cap.

### v2 addendum (2026-06-18) — business case + Shariah precedent + agentic (reusable cross-lane)
- **Alinma 2024 financials (use for any "deposit/CASA" feasibility argument):** customer deposits **SAR 210.5bn** (+12.1%); **CASA SAR 109bn, ratio 51.6%, +20% YoY**; NPM **3.7%**; net income **SAR 5.83bn** (+20.5%). → **CASA growth is the metric Alinma's CFO publicly optimizes** — a retail-deposit-driving product feeds it directly. *(Alinma FY2024 results; Argaam.)*
- **ADIB "Ghina" is a SHIPPED halal prize-savings account** (Mudarabah pool, prizes justified as **hibah**: AED 1M monthly + 45 cash prizes; more deposit = more entries). **BUT it uses a chance draw and is openly Shariah-CONTESTED** ("Is Ghina Shariah-compliant?"). **Saudi scholarship is stricter than the UAE's on maysir** → for a Saudi Islamic bank, **zero-chance reward designs (guaranteed/skill/merchant-funded) are the safe play**; being "second but uncontested" is a feature. *(Islamic Knowledge; Adl Advisory; ADIB.)*
- **The halal-savings-attractiveness gap:** Shariah (Mudarabah) savings pay **0.1–3.6%, not guaranteed** → weak incentive to save (compounds the 1.6% rate; pushes savers toward conventional/haram products). Behavioral rewards (hibah/cashback/game) can lift *perceived* return without riba — cheaper per riyal than matching conventional rates. *(SNB/Riyad/BSF profit tables; ISA structure refs.)*
- **Agentic AI = the 2026 banking frontier** (production-scale autonomous agents; "hyper-personal financial agents managing an individual's financial life"; reported +10–30% revenue / 20–40% cost). Reusable across CX/RegTech/savings lanes. *(Deloitte, Oracle, International Banker.)*

> Agents 1 / 3: append your terrain below this line.
---

## Leap-round addendum — Agent 4 (Vector 4: New Primitive) · 2026-06-18
**"Money between people" is the great unserved surface (reusable for any interpersonal/social-finance concept):**
- ~**31%** are owed money by a loved one; **1 in 6** say money *ruined* a relationship; **~50% never write the loan down**; **~50%** set no repayment date; **30% of borrowers never repay**. *(LendingTree, Bread Financial, SPSP.)*
- **Ayat al-Dayn (Quran 2:282)** — the **longest verse in the Quran** — commands recording + witnessing debts. A scriptural mandate with **no product built for it** → a faith-as-superpower wedge.
- **Qard hassan** (interest-free benevolent loan) = Shariah-**positive**, the clean opposite of the retired **Tawarruq**. KSA qard-hassan fintech today is institution→person (microloans/EWA/crowdfunding), **not** P2P record/witness/settle.

**2026 enabling rails for "witnessed/conditional money" (reusable):**
- **Nafath** biometric MFA e-signature → binding two-party consent in seconds; **Evidence Law 2022** makes Nafath-tied e-records **legally admissible** (non-repudiation).
- **Najiz / MoJ** e-documentation notarizes POAs/property/marriage — **NOT** ordinary interpersonal money agreements (white space).
- **sarie**: instant 24/7 P2P, proxy addressing (mobile/national-ID), **≤SAR 2,500** without adding beneficiary, **≤SAR 20,000/txn**, **Request-to-Pay** supported → auto-settlement rails exist.

**C2C trust gap:** **Haraj** (+ informal IG/WhatsApp selling) has **no escrow/dispute resolution** → "pay deposit, seller vanishes" scams; sellers equally exposed. No consumer escrow exists in KSA banking. **Splitwise** is used but **has no Arabic + only tracks** (no settlement/witness). *(Trustpilot/Haraj; Spliteroo.)*

**Culture-as-rail:** **ta'awun** (Quran 5:2, "cooperate in righteousness") + the "one body/one hand" image → collective-finance primitives have deep, uncontested resonance. Suspended-giving ("قهوة معلّقة") → dignity-first point-of-need charity (note: national **Ehsan** owns campaign donations — differentiate on *point-of-need + dignity*).

> Agents 1 / 3: append your terrain below this line.
---

## Leap-round addendum — Agent 2 (Vector 2: The Invisible Saudis) · 2026-06-18
**Hajj/Umrah = the uniquely-Saudi mega-segment (reusable for any pilgrim concept):**
- **1.67M Hajj (2025; 1.51M foreign, 171 countries) + ~18M Umrah/yr;** religious tourism **≈ $30B/yr ≈ 7% of GDP, ~20% of non-oil economy;** avg Hajj spend ~$5,400. *(Salaam Gateway; Statista.)*
- **The pilgrim wallet is TAKEN:** **Nusuk Wallet by NEO = Saudi National Bank** (a RIVAL), the "world's first" embedded pilgrim wallet. → **A "pilgrim card/wallet" is dead on arrival.** White space = the *conscience / obligations / legacy / family* layers Nusuk doesn't touch.
- **Buried uniquely-Islamic truth (faith-as-superpower):** before Hajj a Muslim must **clear debts + return others' rights (radd al-mazālim)** to attain **بَراءة الذِّمّة** ("the soul is suspended by its debt"). Plus pre-Hajj **wasiyyah** (will) + **farāʾiḍ**. **No bank serves this.** *(IslamWeb; thepilgrim.co.)*
- Hajj **fraud** is huge (fake visas/packages, phishing Nusuk clones) — but that's the **retired-Haseen** lane; do not rebuild it.

**The dignity gap (reusable for accessibility/inclusion concepts):**
- All **top-3 Saudi bank apps fail WCAG 2.1**; **7.78% of the population has a disability**; voice-first Arabic banking is essentially absent. **ALLaM** now makes screenless Khaleeji-Arabic banking feasible. *(Springer; APD.)*
- **~6.9M unbanked adults (28%; 56% women)**; elderly/rural literacy lower. **Domestic workers** = the deepest financial invisibility (cash-paid, unbanked, wage-withholding exposed; **Musaned** is the gov rail; **WPS/Mudad** stops at the household door). Islamic anchor: *"pay the worker before his sweat dries."*
- **بِرّ الوالدين** (honoring parents) + caregiving for the aging is a powerful, underbuilt emotional lane.
---
