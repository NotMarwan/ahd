---
title: "عهد · Ahd — REBUTTAL PLAYBOOK (the judge-question war-room)"
subtitle: "كل سؤال صعب وإجابته القصيرة + دليله ودرجته"
status: consolidation-v1
created: 2026-06-21
owner: Evidence-Consolidation pass (read-only; no existing file modified)
companion: "docs/evidence/EVIDENCE-BRIEF.md"
based_on: "Arsenal/rebuttal-playbook.md (K1–K21) · red-team-report.md (A1–A12), re-graded after web verification 2026-06-21"
refreshed: "2026-07-15 — gate counts recomputed live: core 184/0 + app 2,869/0 (73 suites) + structure 14/0 = 3,067/0 via `cd tests && node run-all.cjs`. Single source of truth is that live banner, not this string. Earlier: 2026-07-13 رِفْق mercy-clearing lever, I-L1 (then-live 2,670/0); 2026-07-13 T4/T5 technical push + D1 gate-coverage fix (then-live 2,586/0); 2026-07-13 D1+D2 data-rigor gate-drift sweep (then-live 2,575/0); 2026-07-13 D1+D2 data-rigor sweep, first pass (then-live 2,574/0); 2026-07-13 T3 bank-node live-demo gate-drift sweep (then-live 2,517/0); 2026-07-13 I1 Open-Witness protocol gate-drift sweep (then-live 2,516/0); 2026-07-13 T2 real-auth gate-drift sweep (then-live 2,495/0); 2026-07-13 T1 durable-persistence gate-drift sweep (then-live 2,469/0); 2026-07-13 real-leap gate-drift sweep (then-live 2,452/0); 2026-07-13 data-honesty sweep (then-live 2,436/0); 2026-07-09 panel #3 fix round (Q-E4 opener reframed as identity; then-live 2,072/0); 2026-07-07 JL-1 Task 4 (Q-H1..Q-H4 appended; court figures vintage-labelled 2020–21; internet 99.0% DataReportal 2025)"
---

# 🛡️ REBUTTAL PLAYBOOK — Ahd (عهد)

> **How to use.** When a judge attacks, answer in **one breath** (the 30-second answer), then — only if pressed —
> offer the evidence ref. Each entry carries its **grade** and, where the answer leans on an unverified claim, a
> **⚠️ NEEDS THE GAP CLOSED** flag pointing at the specific 🔴 in `EVIDENCE-BRIEF.md` §5.
>
> **Grade legend (of the *answer*, not just the fact):**
> - 🟢 the answer rests on a cited / web-verified fact;
> - 🟡 the answer rests on a defensible design or inference (label it as such out loud);
> - 🔴 the answer concedes an open item honestly **and names the validation step** (candor scores; bluffing loses).
>
> **Two rules that win the room:** (1) **never present a 🔴 as a 🟢** — a sharp judge punishes a bluff far harder
> than a named gap; (2) **no fatwa** — for Shariah, cite AAOIFI / Qur'an / "your board signs it," never rule.

---

## 🥇 The two you memorize cold (round-deciders)

### Q-A1 — "Did you talk to a single Saudi who would use this? Where's the demand?" 🟢 (with a 🔴 tail)
**30-sec answer:** *"Saudis already document money between people at the scale of a **national problem** — they just use a blunt, abuse-prone tool. **Promissory notes are 58.6% of the Kingdom's execution-court enforcement requests — SAR 115.4 billion across 571,251 cases (MoJ data, 2020–21 vintage).** The Ministry of Justice ran **43 million Najiz e-services in one half-year**, and the e-promissory platform Nafith issued **800,000 digital notes** in its first year. The habit and the instrument exist; the **fair, interest-free, structured** version doesn't. That's the measured gap — not an assumption. The relational percentages you may have seen are US surveys — illustrative only; our Saudi proof is the **court data**, and we're backing it with primary interviews."*
- **Evidence:** `EVIDENCE-BRIEF.md` D-1 ([Argaam](https://www.argaam.com/ar/article/articledetail/id/1483475) — MoJ execution-court data, **2020–21 vintage**; 2024–25 refresh pending, OT-CITE), D-2 ([Arab News](https://www.arabnews.com/node/2551501/saudi-arabia)/[SPA](https://www.spa.gov.sa/en/N2140615)), D-3 ([SPA Nafith](https://www.spa.gov.sa/w1579948)). Promissory-note enforcement mechanism **web-confirmed today** ([ahysp.com](https://ahysp.com/how-promissory-notes-are-regulated-and-enforced-in-saudi-arabia/)).
- **Grade:** 🟢 for the *scale/documentation* half. **⚠️ NEEDS THE GAP CLOSED** for the *relational-warmth* half (D-9 / OT-A1, 🔴): there is still **no KSA-primary survey or interview** proving Saudis want this *witnessed*. Do not claim "Saudis told us…" until that shard exists. The honest version: *"the court data is Saudi and hard; the warmth evidence is the interviews we are running."*

### Q-A2 — "Why Alinma and not Al-Rajhi? A bigger Islamic bank copies this in a month." 🟡 (the FATAL one — concede, then wedge)
**30-sec answer:** *"You're right that the rails are copyable and 'Islamic-ness' is shared — which is exactly why this is a **land-grab, not a feature.** But Alinma isn't starting from zero 'Islamic-ness'; it's starting from a **real fintech platform**: **AlinmaPay**, a SAMA-licensed digital wallet that already moved **SAR 2.4 billion**, a **venture-capital arm** investing directly in Shariah-compliant fintech like **Wadaie**, and an **open-API marketplace** built to plug fintech products in. Ahd ships as a feature of **that** stack. The durable moat is three things Alinma must take now: **(1)** own the category and the name «عهد» + the 2:282 association; **(2)** at least one **exclusive distribution partner** — a wage-covenant channel or a property-manager for rent; **(3)** **circle network-lock-in** — move one covenant and you move the whole circle, because Muqassa nets across it. Al-Rajhi can copy the rails — which is **precisely** why Alinma must define the category first."*
- **Evidence:** `EVIDENCE-BRIEF.md` M-11 — **web-verified today:** [AlinmaPay SAMA-licensed wallet](https://www.alinma.com/en/about-the-bank/the-bank/news/2020/09/sama-licenses-alinmapay-as-a-digital-wallet), [Alinma×Wadaie 2025](https://www.alinma.com/en/About-the-Bank/The-Bank/News/2025/9/Wadaie), [Alinma×IBM API platform](https://thefintechtimes.com/saudis-alinma-bank-taps-ibms-cloud-and-ai-technology-to-launch-api-platform/). Al-Rajhi scale (world's largest Islamic bank, ~SAR 895B assets) corroborated ([Wikipedia](https://en.wikipedia.org/wiki/Alrajhi_Bank)).
- **Grade:** 🟡. The *real-asset half* (Alinma already has wallet + VC + API platform) is now **web-verified 🟢** — a genuine upgrade over the project files. But the *durable moat* is firm-specific **only if Alinma executes** the category/distribution/lock-in wedge; the tech alone is not a moat. **⚠️ PARTIALLY NEEDS THE GAP CLOSED** (OT-A2 strategy half, 🔴): name the concrete exclusive distribution partner. Say the contingency plainly — candor here reads as strategic clarity, not weakness.

---

## 🕌 The Shariah board

### Q-B1 — "Isn't any fee on a benevolent loan riba?" 🟢
**30-sec:** *"The qard carries **zero** fee, markup, or penalty — the bank isn't a party to it. Any fee lives on a **separate wakala/amana service** contract: **flat, decoupled from amount and tenor, actual *direct* cost only** — AAOIFI SS-19 cl. 10/3/2 forbids linking the charge to the amount lent. Our **default and safest posture is free at the consumer layer, monetised on float** — which removes the question entirely. The figure and the separation are for **your board** to ratify."*
- **Evidence:** `EVIDENCE-BRIEF.md` L-5 ([AAOIFI SS-19](https://aaoifi.com/ss-19-loan-qard/?lang=en), [SBP Compendium](https://www.sbp.org.pk/ifpd/compendium/Compendium.pdf)).
- **Grade:** 🟢 on the standard; **no fatwa issued** — the application is board-gated (OT-VAL). The free/float default makes this answer robust even if the board rejects any fee.

### Q-B2 — "The two-contract split is just a *hilah* — relabelled interest." 🟢
**30-sec:** *"SS-19 cl. 7/8 — the Hilah doctrine — is the **test we honour, not the one we fail.** The service must be **genuine and independent, never a precondition** of the loan. The qard stands alone, fee-free; the documentation/settlement service is a real, separately-valuable act. And our safest default — **free/float** — means there's no fee to relabel."*
- **Evidence:** `EVIDENCE-BRIEF.md` L-5 (SS-19 cl. 7/8).
- **Grade:** 🟢 (standard cited) / board-gated application.

### Q-B3 — "A bank can't be a witness — and if it witnesses, it's liable for the debt." 🟢
**30-sec:** *"Correct, and we never claim it. Ayat al-Dayn (2:282) names **two roles**: the **scribe (كاتب بالعدل)** and the **witnesses (شهيدان)**. Alinma is the **scribe** — it drafts and preserves. The **parties + Nafath** are the attestation. A corporation can't testify, so we say *scribe*, never *witness*. The record even names the **four things the bank refuses to vouch for** — that cash moved, fairness, voluntariness, the underlying truth — so it attests the **signing event**, never the debt. **Zero balance-sheet exposure.**"*
- **Evidence:** `EVIDENCE-BRIEF.md` L-6 (Qur'an 2:282); L-7 (no receivable booked).
- **Grade:** 🟢.

### Q-B4 — "What about default? A late penalty would be riba." 🟢
**30-sec:** *"**DEFAULTED carries no penalty** — a hard rule, not a kindness. It only changes the reminder tone and unlocks evidence export. For genuine hardship, **respite is mandated, not optional** — Qur'an **2:280**, *'and if the debtor is in difficulty, then grant him time.'* Deterrence is **social and evidentiary** (a near-incontestable iqrar already exists), never financial. The only escalation is an **optional, board-gated charity pledge** — to Ehsan, never to the lender or bank, never on the insolvent (AAOIFI SS-3) — and it's opt-in."*
- **Evidence:** `EVIDENCE-BRIEF.md` L-6 (2:280); `legal-shariah-citations.md` §2 (SS-3); built يُسر flow.
- **Grade:** 🟢. *(Watch the brand tail — see Q-A10.)*

### Q-B5 — "Will the AI issue a fatwa / draft a haram term?" 🟢
**30-sec:** *"Never. The AI is constrained to a **board-approved template library** — it can only select and fill, never opine. The riba check is a **deterministic lint** against a fixed haram-pattern list (interest, %, penalty, commission), not an LLM judgement — add a 10% late charge and the badge goes **red and disables the sign button**, live. Novel questions route to a human with **«ليست فتوى»** on screen."*
- **Evidence:** built riba-linter (`OVERNIGHT-LOG.md`; `09_Finish/Fixup/verify-05-riba-linter.png`).
- **Grade:** 🟢. **⚠️ One honest internal caveat:** the project's own open-threads (OT-RIBA) note the Arabic **negation FP** — a leading `بلا/دون/بدون` can flip a hit (e.g. `بلا فائدة` wrongly blocked), deliberately left in for demo-day safety and patched off-stage. If a judge types a negation, acknowledge it as a known, fix-staged edge case — don't claim the linter is perfect.

---

## ⚖️ The legal / regulatory reviewer (SAMA / Nafath / SDAIA)

### Q-C1 — "Is the e-record *really* admissible? Saying so doesn't make it so." 🟢 (with a 🔴 tail)
**30-sec:** *"We engineer the **integrity, not the verdict** — the on-screen claim is literally *'designed to meet the conditions of admissibility.'* The SEAL gives a court no easy ground to exclude: **SHA-256** (integrity) + **Nafath-bound assertions** (attribution) + **RFC-3161 timestamp** (time) + **hash-chain & bank signature** (non-repudiation). Under the **Law of Evidence (M/43, 2022), the burden shifts to the party who contests** the digital evidence. We volunteer the caveat: full certified-signature weight presumes the bank key + timestamp sit on an **accredited CSP** — a named validation step."*
- **Evidence:** `EVIDENCE-BRIEF.md` L-1 — **burden-shift web-corroborated today** ([Ghazzawi](https://www.ghazzawilawfirm.com/insights/major-provisions-and-changes-in-saudi-arabias-law-of-evidence/) confirms Art. 58; law = 129 articles, in force 7 Jul 2022). L-3 (emdha TSP, RFC-3161).
- **Grade:** 🟢 on the *substance* (burden-shift, digital-evidence-as-documentary, in-force date). **⚠️ NEEDS THE GAP CLOSED:** (a) **exact article numbers** for "digital = documentary" / "e-signature" are **not primary-verified** (OT-CITE, 🔴) — don't recite an article number you can't source; (b) the **accredited-CSP** layer (L-12, 🔴) is procurement-pending; (c) red-team A4: "admissible" is *presumptive/rebuttable, judge's-discretion* — say "near-incontestable conditions," not "guaranteed."

### Q-C2 — "Is this lending? Does it need a finance licence + carry balance-sheet risk?" 🟢
**30-sec:** *"No. The Finance Companies Control Law defines finance as **'extending credit under contract'** — the **creditor is a private individual**, the bank books **zero receivable**, so no finance activity occurs. The only regulated touch is **payments**: in-flight funds are **Safeguarded Funds** handled **as agent on Alinma's own licensed rails**, launched via the **time-boxed SAMA Sandbox** with an exit plan."*
- **Evidence:** `EVIDENCE-BRIEF.md` L-7 ([Finance Companies Control Law](https://www.sama.gov.sa/en-US/Laws/FinanceRules/Implementing_Regulation_of_the_Finance_Companies_Control_Law.pdf)), L-8 ([SAMA Sandbox](https://rulebook.sama.gov.sa/en/entiresection/1368)).
- **Grade:** 🟢 (in-file sources; not re-fetched today — graded 🟡 in the brief on that technicality, but the legal logic is sound).

### Q-C3 — "ETL — is it M/8 or M/18? Your own docs disagree." 🟢
**30-sec:** *"The official Bureau of Experts publishes it as **Royal Decree M/18, 27 March 2007.** 'M/8' is a legacy citation variant in some older secondary sources, not a second law. We cite **M/18 per laws.boe.gov.sa** and have flagged the variant for counsel to sweep. Signature equivalence is **Article 14**; record integrity is **Article 8** — the licensed TSP emdha itself cites Art. 14-1."*
- **Evidence:** `EVIDENCE-BRIEF.md` L-2 ([BOE M/18 PDF](https://laws.boe.gov.sa/Files/Download/?attId=758143f9-52ec-4a6f-92c8-adbb011cf516), [emdha](https://www.emdha.sa/)).
- **Grade:** 🟢 on the M/18 resolution. **⚠️ minor GAP:** the project still has stray "M/8" references in the legal layer/objection-killer (OT-X3) — finish that sweep so the deck doesn't contradict itself live.

### Q-C4 — "Will SDAIA/Nafath even permit Nafath-AES for *private interpersonal debt*?" 🔴 (concede honestly)
**30-sec:** *"That permission is **assumed, not yet confirmed** — it's our single most honest open item, and it's a **validation step, not a redesign.** The architecture is data-minimised and PDPL-compliant by design — consent + contract basis, an identity *assertion* + ID-**hash**, no biometric storage, in-Kingdom. What's pending is a use-case sign-off, which we'd secure in pre-production."*
- **Evidence:** `EVIDENCE-BRIEF.md` L-11 (red-team A9); L-9 PDPL ([Morgan Lewis](https://www.morganlewis.com/pubs/2024/09/saudi-arabia-personal-data-protection-law-transition-period-ends-september-14)).
- **Grade:** 🔴 — **rests on an unverified permission. ⚠️ NEEDS THE GAP CLOSED (L-11 / OT-VAL).** I found **no public source** confirming interpersonal-debt-witnessing is a sanctioned Nafath/TSP use-case. Concede it cleanly; do not assert it on stage.

---

## 🤝 The demand / "so what" challenger (CX panel)

### Q-D1 — "Isn't this just a notarized PDF / a fancier سند لأمر?" 🟢
**30-sec:** *"A bare سند is **term-less and abuse-prone** — no qard-hasan structure, no schedule, no settlement, and prone enough to misuse that **SAMA restricted finance firms from demanding it from consumers.** Ahd adds the four things the سند lacks: **fair AI-drafted interest-free terms, a payment schedule, auto-settlement over sarie, and a Shariah-clean construction** — plus the lender signs *first*, so the borrower receives a **gift-receipt, not a demand.** It's not a PDF; it's the instrument the سند should have been."*
- **Evidence:** `EVIDENCE-BRIEF.md` D-4 ([SAMA Rulebook](https://rulebook.sama.gov.sa/en/instructions-creditors-dealing-promissory-notes), web-confirmed today).
- **Grade:** 🟢 (scope-honest: the SAMA restriction is credit-card/financing-entity-specific, not a blanket ban).

### Q-D2 — "Isn't this just Splitwise? Why does anyone need a bank?" 🟢
**30-sec:** *"Splitwise **only counts** — no Arabic, no settlement, no witness, no enforceable record, and KSA users complain it has no Arabic. sarie **moves money but records no terms.** Najiz notarizes property, not casual interpersonal money. **No one produces a Nafath-bound, integrity-sealed, court-conditions-met iqrar that auto-settles over sarie** — and only an *Islamic* bank can credibly own the amana/wakala/qard-hasan/2:282 category. Splitwise is a calculator; Ahd is a witnessed, settling, Shariah-clean instrument."*
- **Evidence:** `EVIDENCE-BRIEF.md` D-7 ([Spliteroo](https://www.spliteroo.app/blog/6-best-splitwise-alternatives-for-managing-group-expenses-in-saudi-arabia)).
- **Grade:** 🟢 on the differentiation logic; D-7 source is a secondary blog (🟡) — lead with the *capability* difference (witness + settle + admissible), not the blog. **⚠️ red-team A7 tail:** a **T0 soft note with no Nafath** *is* basically Splitwise — so anchor the comparison on the **full witnessed tier**, not the lightweight one.

### Q-D3 — "Most interpersonal money is small and trust-based — nice-to-have, not a rail." 🟢
**30-sec:** *"The beachhead isn't casual small loans — it's **recurring, high-frequency** money (salaries, rent, installments) **plus** the **high-stakes family loan** where the pain is real. Recurring covenants turn ~4 events/year into ~18. And the court data shows interpersonal debt isn't trivial — it's **SAR 100B+ of enforcement traffic (2020–21 court vintage).**"*
- **Evidence:** `EVIDENCE-BRIEF.md` D-1 (SAR 115.4B enforcement, 2020–21 vintage); recurring-covenant logic.
- **Grade:** 🟢. **⚠️ red-team A7 honesty:** the *adoptable* use-case (rent / paying a worker) is the *unemotional* one; the *emotional* hero (lending someone you love) is the *taboo-to-formalize* one. Reconcile by framing the warm-and-viable overlap (a worker's salary covenant as **dignity**; flatmates as **friendship-preserving**).

---

## 💻 The technical / data judge

### Q-E1 — "Your hash is theatre — and most of the value chain is mocked." 🟢 (with honesty)
**30-sec:** *"The hash is **real SHA-256 via WebCrypto, offline**, with a live verifier and a tamper toggle that **fails in red** when you edit a field — not the FNV demo stand-in. We're honest that **Nafath, the TSP signature, sarie, the LLM drafting, and the RFC-3161 timestamp are integration mocks** — the deep novelty is **legal/conceptual** (the SEAL, the scribe doctrine, graded tiers). For a 72-hour build we shipped the cryptographic spine real and the integrations stubbed, and we say exactly which is which."*
- **Evidence:** `EVIDENCE-BRIEF.md` X-2 (SHA-256 conformance vectors; Playwright real-Chrome run); harness green, 0 failures — live count at `EVIDENCE-BRIEF.md` X-1 (don't duplicate the number here, it drifts).
- **Grade:** 🟢 on what's built. **⚠️ red-team A3 tail:** don't oversell the *ratio* — a hostile judge will note the running artifact is "SHA-256 + a schedule + greedy netting + a linter." Own it: the moat is the **legal architecture**, demonstrated by a faithful spine.

### Q-E2 — "Muqassa 'minimizes' transfers? I can give you a counterexample." 🟢
**30-sec:** *"We **don't** claim the minimum — that's NP-hard, and we disclose a counterexample where greedy gives 4 and optimal is 3. We claim **≤ P−1 transfers** (each iteration zeroes at least one party), **O(E + n log n)**, **net-preserving** (every party settles their exact net). We also **don't** claim 'each party pays once' — a star pattern refutes it. The demo's conservation table proves **before == after** (9 IOUs → 2 transfers, Σ=0)."*
- **Evidence:** `EVIDENCE-BRIEF.md` X-1/X-2; `sources-ledger.md` §5 (machine-found worst case [−2,+4,−5,+2,+1] → greedy 4 vs optimal 3).
- **Grade:** 🟢 — strongest when you concede the counterexample first.

### Q-E3 — "You net debts between people who never agreed — that's gharar." 🟢
**30-sec:** *"Every netted leg executes only as a **consented novation** — each affected party re-confirms with one tap before any sarie transfer; a decline falls back to bilateral settlement. That's classical **مقاصّة**, a witnessed *ahd-of-ahds* — consent removes the gharar."*
- **Evidence:** `legal-shariah-citations.md` §2 (muqāṣṣa); consent step.
- **Grade:** 🟢 in design. **⚠️ build honesty:** the project's open-threads (OT-CONSENT) flag that the *per-member consent card* is specified but was a build gap — confirm it's actually in the build you demo, or narrate it as "the consent step is the keystone; here's where it sits."

### Q-E4 — "Your trust signal is an illegal credit score." 🟢
**30-sec:** *"**Refusing to score is our identity, not a limitation — we deliberately won't turn kindness into a rating.** And structurally it's **incapable** of being one: a windowed, decayed **kept-ratio over the user's own sealed history only**, shown as a **3-band qualitative mirror — no number, no ranking, never underwrites, never sold, never reaches SIMAH, never leaves the dyad.** Every output even carries guard flags: `is_number_exported:false`, `used_in_underwriting:false`, `sent_to_bureau:false`. It's a private reflection, not a score."*
- **Evidence:** `sources-ledger.md` §5 (trust-signal guard flags).
- **Grade:** 🟢. **⚠️ red-team tail (OT-PCT):** the project itself flags that any **numeric %** ring *would* look like a score — make sure the build shows the **3-band glyph**, not a percentage, or this answer contradicts the screen.

### Q-E5 — "sarie can't silently pull funds — so 'auto-settle' is a lie." 🟢
**30-sec:** *"Correct — sarie is **push-only.** True auto-settle needs a **standing mandate captured at signing**; absent that, it's an **honest confirm-to-push.** Installments over **SAR 20,000** auto-split to respect the per-transaction cap. We never claim a silent pull."*
- **Evidence:** `EVIDENCE-BRIEF.md` L-10 / M-6 ([SAMA sarie](https://www.sama.gov.sa/en-US/payment/pages/Sarie.aspx)).
- **Grade:** 🟢.

---

## 📈 The growth / adoption skeptic

### Q-F1 — "Is it viral? The two-party requirement usually kills you." 🟡
**30-sec:** *"We **don't** claim viral. Organic **k ≈ 0.10–0.36** — app-invite links are the lowest-converting referral class, and we say so. Growth is honest: the organic loop, **amplified inside dense circles** by Muqassa (local k>1), and **on-ramped** by the mass wallet/KYC presence a 2026 wage mandate creates. **Honest correction:** that mandate is a **one-sided employer→wallet rail** — it lowers onboarding friction, it does **not** by itself create a two-sided interpersonal rail or fix k<1. The two-sided go-to-market is separate work, reported separately from organic k."*
- **Evidence:** `rebuttal-playbook.md` F1 (verification C10/C11).
- **Grade:** 🟡 — defensible and *stronger for the honesty*. **⚠️ red-team A5 tail:** the costed acquisition engine (named channel + CAC + budget) is still a black box — if pushed on "how do you get the first million, through what channel, at what cost," concede it's the GTM work to be done, and point at the Alinma distribution assets (Q-A2 / M-11).

### Q-F2 — "Asking a loved one to e-sign reads as distrust." 🟡
**30-sec:** *"That's the one fatal feeling — so we turn it into the product's core. The instrument is **graded** (T0 private note / T1 light / T2 full), and the **lender signs FIRST and gives**: the invite arrives as *'Noura honoured her word and gave you 5,000, zero interest — confirm receipt'* — a **gift-receipt, not an accusation.** Documentation becomes **obedience to 2:282**, not suspicion. Both parties end at **ذِمّة محفوظة.**"*
- **Evidence:** tiers + built gift-receipt screen (`OVERNIGHT-LOG.md`; Consumer C1).
- **Grade:** 🟡. **⚠️ red-team A6 — the sharpest unpatched cultural hole:** "lender signs first" fixes the *borrower's* feeling but **the lender still has to *propose* a legal instrument to someone they love** — that initiation is culturally loud, and it's currently *asserted away, not solved*. Don't claim it's solved; frame it as "we minimize the sting from both sides and re-anchor it on the verse," and let the gift-receipt screen carry the emotional proof.

### Q-F3 — "The borrower has no reason to join — they could just take the cash." 🟢 (contested)
**30-sec:** *"The borrower gets what a verbal IOU never gives: the **right to be finally, witnessed-ly settled**, with an **iron guarantee of zero riba and zero penalty.** Signing protects the **borrower** more than the lender — it caps their obligation and proves it was a qard hasan, not a disguised interest loan."*
- **Evidence:** objection-killer K17; built إبراء/«ذِمّة محفوظة» release (`OVERNIGHT-LOG.md` Batch 2).
- **Grade:** 🟡 (the brief grades the *claim* defensible-but-contested). **⚠️ red-team A11:** pressure-tested, this is weaker than it sounds — "zero-riba is the lender's term choice," "settled" is a UI state unless the lender marks it, and a screenshot is free. Strengthen by making **«ذِمّة محفوظة» a borrower-invokable release (إبراء)** and surfacing borrower protections as **their** feature — which the overnight build (open-loan إبراء) partly does. Lead with that built release, not the abstract "right."

### Q-F4 — "Used twice a year — no retention." 🟢
**30-sec:** *"Salaries, rent, and installments are **monthly** — the recurring-covenant object turns ~4 events/year into **~18**, roughly tripling D30. The covenant ledger plus a private kept-word reflection are the return hooks; the emotional one is the dignity of watching a **ذمّة close.**"*
- **Evidence:** recurring-covenant + «دفتري» creditor home (`OVERNIGHT-LOG.md` Batches 1, 3).
- **Grade:** 🟢 on the mechanism (built); retention *numbers* (D1/D7/D30) are illustrative model figures (🟡) — don't present them as measured.

---

## 💰 The business / "show me the money" exec

### Q-G1 — "Where's the revenue if there's no interest? Float is thin — this is a cost centre." 🟡
**30-sec:** *"Five ways, **none of them interest**: **float** on in-flight balances (amana); **near-zero-CAC viral acquisition** (every ahd needs a second person → guest-Nafath); **deposit & primary-bank primacy** (a frequent trust product → halal cross-sell); an optional **flat B2B record-API fee** (HR/payroll, charity qard funds — never % of principal); and an **uncopyable brand moat.** It monetises **posture and presence**, not lending — on a TAM anchored in **SAR 213B** remittances and **SAR 115B+** of documented debt (2020–21 court vintage). And Alinma already runs the wallet + API rails this sits on."*
- **Evidence:** `EVIDENCE-BRIEF.md` M-12 (streams, illustrative); D-5/D-1 (TAM floors); M-11 (Alinma rails, web-verified).
- **Grade:** 🟡 **MODEL** — every figure is board-gated/illustrative; the *mechanisms* are real and Shariah-clean, the *numbers* need Alinma's data. Say "illustrative" out loud.

### Q-G2 — "Too religious / too niche for a national rail." 🟢
**30-sec:** *"Ayat al-Dayn (2:282) is the **Qur'an's longest verse** — it commands **every** Muslim to write debts down. Ahd lets 35 million people obey it in one tap. The faith layer isn't a limit — it's the **distribution** and the moat a conventional bank can never copy. And the rails are universal: **99.0% internet penetration (DataReportal Digital 2025)**, 23.5M Nafath users, 79% cashless."*
- **Evidence:** `EVIDENCE-BRIEF.md` L-6 (2:282); M-7 (Nafath), M-9 (**99.0%** internet, DataReportal Digital 2025, web-verified — replaces the retired ~97%-smartphone / GASTAT-2017 figure), M-2 (79% cashless).
- **Grade:** 🟢.

---

## 🔥 The brand / reputational landmine (don't get ambushed)

### Q-A10 — "When a loan defaults, a *bank* is nudging people about debts to loved ones and arming courts against family. Doesn't that betray the warmth thesis?" 🔴 (no clean answer yet)
**30-sec:** *"That tension is real and we take it seriously. Our design pushes the other way: **no penalty ever**, **mandated respite** (2:280), reminders sent in the bank's gentle voice with **no day-counter shown to the debtor**, a finite merciful cadence that **stops and hands back** rather than escalating, and evidence export only as a last-resort right the **lender** can invoke — never an automatic dunning machine. The goal is **وبقيت المودّة**: protect the relationship by removing ambiguity, not weaponize it."*
- **Evidence:** built «تذكيرٌ بالمعروف» (bank-as-sender, no debtor day-counter, finite cadence → STOP) and يُسر grace (`OVERNIGHT-LOG.md` Batch 1); L-6 (2:280).
- **Grade:** 🔴 — **this is a NEW HOLE in the red-team (A10) that no document fully seals.** The mitigations are real and built, but the underlying reputational risk (a bank associated with intra-family debt evidence) is **not eliminated, only softened**. **⚠️ NEEDS THE GAP CLOSED:** treat as a deliberate product-ethics stance, not a solved problem; have the merciful-cadence + no-penalty + lender-only-export design ready to show on screen so the answer is demonstrated, not asserted.

---

## 🏟️ The hackathon-floor round (appended 2026-07-07 · JL-1 Task 4)

> The four questions the AMAD panel itself is most likely to ask at the booth — the scored data criterion,
> provenance, verifiability, and revenue-in-one-breath. Same two rules: one breath first, evidence only if
> pressed, never present a 🔴 as a 🟢.

### Q-H1 — «أين تحليل البيانات؟» — "Where's the data analysis?" (a *scored* criterion) 🟢 (with a 🔴 tail)
**30-sec answer:** *"Three honest layers. **On screen, in-product:** deterministic analytics — Muqassa compresses **9 tangled obligations into 2 transfers** and proves conservation live: **money-moved falls 1,800 → 900 SAR while every party's net stays exactly zero** — computed, verifiable, re-runnable, not a decorated chart; the next layer is **k-anonymous cohort aggregates**, and by spine rule **never an individual's number, never a trust score**. **Behind it, public scale:** promissory notes are **58.6% of 571,251 execution-court requests — SAR 115.4B** (MoJ via Argaam, **2020–21 vintage**). **Ahead, the honest path:** a ready, non-leading **demand-survey instrument** (`docs/evidence/DEMAND-SURVEY-KIT.md`) to acquire the numbers we don't yet have. We would rather show you a named gap than a faked dataset."*
- **Evidence:** `docs/JUDGE-LENS.md` criterion 3 (تحليل البيانات — aggregates only, spine); `EVIDENCE-BRIEF.md` D-1 (court data, 2020–21 vintage) + X-1/X-2 (netting conservation, harness-proved: 9 IOUs Σ=1,800 SAR gross → 2 transfers, 900 SAR moved, all nets exact); `docs/evidence/DEMAND-SURVEY-KIT.md` (instrument only — reports no findings by design).
- **Grade:** 🟢 for what exists — the netting analytics are built and harness-proved; the court figures are cited and vintage-labelled. **⚠️ NEEDS THE GAP CLOSED** for the survey (D-9 / OT-A1, 🔴): the instrument is ready but has **zero findings until fieldwork runs**, and the k-anonymous cohort aggregates are **planned, not yet on screen** — say both plainly. Never present the instrument as data; never fake a dataset.

### Q-H2 — «بنيتم هذا قبل الهاكاثون؟» — "You built this before the hackathon?" 🟢
**30-sec answer:** *"Yes — proudly, and inside the program's own structure. The idea was **submitted at registration** (the 26 June hard gate: initial idea + team), and the organisers' **enrichment program runs 5–16 July — twelve days explicitly before the onsite days (16–18)** — designed so teams arrive stronger. We used that runway the way it was designed to be used. The **72 onsite hours are for integration and polish**, not for pretending to start from zero. And every line is **ours and provable**: the full git history is open, and the whole claim is machine-checkable — **3,067/0 automated assertions** in a deterministic, offline gate anyone on this panel can run in seconds (Q-H3)."*
- **Evidence:** `docs/research/AMAD_HACKATHON_2026_FULL_DOSSIER.md` §7 timeline (البرنامج الإثرائي **5–16 يوليو**; hackathon days **16–18 يوليو**) and FAQ; registration hard gate 26 June with initial idea (`docs/research/AMAD_2026_Agent_Prompt.md`); the repo's own git log; gate counts per Q-H3.
- **Grade:** 🟢 — the timeline and the provenance are documented; the posture is confidence, not apology. If the judge means *"is that within the rules?"*: the published structure itself presupposes pre-hackathon work (an idea at registration, a 12-day preparation program) — and nothing in this build is imported that isn't in our history.

### Q-H3 — «لماذا نصدّق أرقام اختباراتكم؟» — "Why should we believe your test numbers?" 🟢
**30-sec answer:** *"Don't believe us — **run them**, one command: `cd tests && node run-all.cjs`. The gate is **deterministic and fully offline** — no `Date.now`, no `Math.random`, no network, fixed `AS_OF` — so it prints the **same banner on any machine in ~6 seconds**: **`AHD GATE ✅ 3067/0`** — core 184/0 (135 logic + 9 offline + 40 DOM-smoke), app 2,869/0 (73 suites), structure 14/0, **plus the SHA-256 tripwire proving the presenter demo is byte-frozen** (`e2f48467…`). These aren't slide numbers; they're a command — we'll hand you the laptop."*
- **Evidence:** `tests/run-all.cjs` (the wrapper) over the harness itself (`tests/run-tests.cjs`, `tests/offline-check.cjs`, `tests/dom-smoke.cjs`, `tests/structure-check.cjs`, `tests/app/run-app-tests.cjs`); determinism enforced by `tests/app/app-offline.test.cjs`; counts **recomputed live 2026-07-15** (2,869 app across 73/73 green suites).
- **Grade:** 🟢 — the strongest kind of claim: self-verifying. **⚠️ keep it fresh:** re-run the gate the morning of 18 July and update this line if the counts move — a stale number here would turn our best answer into a bluff.

### Q-H4 — «ما نموذج الربح إن لم تكن فائدة؟» — "What's the revenue model if not interest?" (the ONE-breath form of Q-G1) 🟡 (board-gated)
**30-sec answer (one breath):** *"A **service/subscription fee at direct cost** — AAOIFI **SS-19** forbids linking any charge to the loan amount, and we never do — **plus what Ahd buys Alinma strategically: retention, daily relevance** through «دفتري» and «الدائرة», **and the qard-hasan CX wedge no competitor owns**; the fee methodology itself is **the Shariah board's to ratify**."*
- **Evidence:** `EVIDENCE-BRIEF.md` L-5 ([AAOIFI SS-19](https://aaoifi.com/ss-19-loan-qard/?lang=en) cl. 10/3/2 — charge at actual *direct* cost only, never linked to amount); M-11 (Alinma platform assets, web-verified); Q-G1 above (the five-stream expansion) and Q-B1 (the free-at-consumer-layer default this stays consistent with).
- **Grade:** 🟡 (board-gated) — say "board-gated" out loud and never quote a figure: the *mechanism* is standard-cited, the *pricing* is Alinma's board's. If pressed past one breath, expand into Q-G1 — float, near-zero-CAC acquisition, deposit primacy, flat B2B record-API fee, brand moat — all labelled illustrative.

---

## 🎤 The 30-second close (when they ask for the one-liner)
> *"Ahd is the **just scribe** of the Qur'an's longest verse, built on the Saudi Arabia that exists in 2026 — Nafath identity, sarie settlement, a licensed e-signature, and the 2022 Evidence Law where **the denier bears the burden.** It writes your word, witnesses it with a record engineered to meet the conditions of admissibility, settles it interest-free, and — because the lender gives first — it spreads without ever feeling like distrust. Promissory notes are already **59% of the Kingdom's enforcement courts** (2020–21 data); we make the fair, interest-free version. **Only an Islamic bank could own it — and Alinma, which already runs the wallet and the fintech rails, must define the category before Al-Rajhi copies it.**"*

---

## Quick-reference: which answers rest on an open 🔴 (rehearse the concession)

| Q | Topic | The 🔴 it leans on | What to say |
|---|---|---|---|
| **Q-A1 (tail)** | KSA relational demand | D-9 / OT-A1 | "Court data is hard Saudi proof; warmth evidence is the interviews we're running." |
| **Q-A2** | why Alinma not Al-Rajhi | OT-A2 (strategy half) | Real assets verified (AlinmaPay/VC/Wadaie); the durable moat is execution — name the distribution wedge. |
| **Q-C1 (tail)** | exact admissibility | OT-CITE + L-12 | Don't recite an unsourced article number; "near-incontestable conditions," accredited-CSP pending. |
| **Q-C4** | Nafath-AES for private debt | L-11 / A9 | Concede: assumed, a validation step, not a redesign. |
| **Q-F1 (tail)** | costed acquisition | A5 | GTM channel/CAC is the work to do; point at Alinma distribution. |
| **Q-F2 / Q-F3** | initiator stigma / borrower reason | A6 / A11 | Soften, don't claim solved; lead with the built gift-receipt + إبراء release. |
| **Q-A10** | default/dunning brand risk | A10 (new hole) | Show the merciful-cadence + no-penalty design; it's a stance, not a solved problem. |
| **Q-B5 (caveat)** | riba linter | OT-RIBA | Arabic negation FP is a known, off-stage-patched edge case. |
| **Q-H1 (tail)** | pending demand survey / planned k-anon aggregates | D-9 / OT-A1 | "The survey instrument is ready and non-leading; it reports nothing until fieldwork runs — name the gap, never fake a dataset." |

---

## Links
- Evidence base (graded rows + GAPS): `docs/evidence/EVIDENCE-BRIEF.md`
- Source war-room: `Amad Obsidian Vault/AMAD-2026/10_Deep/Arsenal/rebuttal-playbook.md` (K1–K21)
- Red-team (A1–A12, the attacks these answer): `…/09_Finish/RedTeam/red-team-report.md`
- Open threads (the 🔴 owners): `_meta/deep-work/ledger/open-threads.md`
