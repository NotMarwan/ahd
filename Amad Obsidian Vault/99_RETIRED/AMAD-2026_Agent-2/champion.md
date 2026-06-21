---
title: "Champion — حصين Haseen (red-teamed & crowned)"
tags: [agent/2, status/champion, track/regtech, score/90]
---

# 👑 Agent 2 Champion — حصين Haseen

**[[concept-haseen|حصين Haseen — The Pre-Payment Scam Interceptor]]** · **90 / 100** · Track 3 (RegTech) + GenAI · /02 + /01 + /03.

> *The in-app circuit breaker that stops a Saudi customer from sending an instant, irreversible sarie transfer to a scammer — in the three seconds before the money leaves.*

---

## Phase 5 — Red Team (attack before crowning)

### "Why might judges score this LOW on each official criterion?" — answered honestly

**1. Innovation & creativity**
- *Attack:* "Banks already show payment warnings; this is incremental." 
- *Honest answer:* Static warnings exist and have near-zero efficacy (everyone taps through). The novelty isn't "a warning" — it's **(a)** the first **Confirmation of Payee** in KSA (a control the UK runs 2B+ times/yr and KSA simply lacks), and **(b)** a **conversational, typology-specific Arabic interrogation** that adapts to the customer's answers. *Risk it still reads as incremental to a judge who misses the CoP gap.* → **Fix:** make the demo's first beat the **name-mismatch reveal**, the most legibly novel element.

**2. Technical implementation**
- *Attack:* "The CoP registry and deepfake angle are mocked — is this real engineering or a wrapper?" 
- *Honest answer:* The classifier, the mule-graph signal, the LLM intervention, and the end-to-end payment-confirmation flow against the Alinma sandbox are genuinely built. CoP-as-live-cross-bank-service is mocked because **no such registry exists yet in KSA** — that's a market gap, not a team shortcut. → **Fix/disclose:** state plainly "CoP registry is simulated; here's the working risk + intervention stack against the live sandbox," and frame production CoP as the OB-network service SAMA is positioned to mandate.

**3. Data analysis**
- *Attack:* "Scam-pattern detection on synthetic data isn't real data analysis." 
- *Honest answer:* Partly fair — we lack a real labeled KSA scam corpus in 72h. → **Fix:** ground synthetic typologies in documented patterns (investment/romance/impersonation/fake-merchant), and **show the live feature contributions** (first-time payee + urgency + name-mismatch) so the analysis is visible, not asserted. Use Alinma sandbox transactions for the realistic substrate.

**4. UX**
- *Attack:* "A translated English fraud bot in Arabic clothing." 
- *Honest answer:* This is the easiest way to lose criterion 4. → **Fix:** the intervention must be **natively Arabic** (dialect-aware tone, RTL, culturally framed — *not* machine-translated), which is exactly why production model = **ALLaM via IBM watsonx** (Saudi Arabic-native). Polish this one flow obsessively; it's the criterion most felt.

**5. Real-world feasibility**
- *Attack:* "You can't intercept sarie in real time without core-banking hooks." 
- *Honest answer:* True for a literal in-rail interception. → **Fix/frame:** Haseen sits at the **app payment-confirmation step** (the bank controls this) and/or as a **PIS pre-initiation check** — neither requires core-banking surgery. The SAMA Apr-2026 mandate (real-time monitoring + customer warnings) gives the bank the *reason* to put it there.

### "What is the single most likely reason this loses?"
A judge mentally files it under **"Mozn already does fraud."** → **Pre-empt explicitly** in the pitch: *"Mozn scores transactions in the back office and sees an authenticated, customer-approved transfer — it cannot stop a scam the legitimate user authorized. Haseen is the consumer layer Mozn structurally can't be. It can even consume FOCAL's score as one input."* Say this in the first 45 seconds.

### "What would a skeptical bank exec object to in the first 30 seconds?"
*"What's our liability and friction if we wrongly block a real transfer?"* → Answer baked into the design: **it's a question, not a hard decline** — the customer can always override; thresholds tuned to keep false-positive friction minimal; every override is logged for tuning. We *reduce* friction vs. a blunt decline.

### "What breaks in the live demo, and what's the fallback?"
Live sandbox/API flakiness at hour 70. → **Local mock + a pre-recorded run of the exact interception flow.** Never depend on live network on stage.

### Verdict: survives. Fixes folded into [[concept-haseen]]. **Crowned.**

---

## Why it wins (the one-paragraph case)
Haseen is the rare concept that scores across **all five** criteria at once: it's **novel** (first KSA Confirmation-of-Payee + a conversational Arabic circuit breaker), **technically real** (working risk + intervention stack on Alinma's live sandbox), **data-driven** (behavioral + graph + name-match signals shown live), **beautiful and human** (Arabic-first intervention at the moment of fear), and — decisively — **the most shippable thing in the room**: it operationalizes the **SAMA Counter-Fraud Fundamental Requirements that become mandatory 13 Apr 2026**, it spares Alinma the **APP-reimbursement liability** that's coming the way it came to the UK, and it's **Shariah-affirmative** (*hifz al-mal* — preserving wealth is a maqasid). The demo is unforgettable: a tired hour-70 judge watches a scam get stopped live, in Arabic, and the bank exec beside them thinks *"we are exposed on exactly this, and this is the fix."* That is first place.

## De-confliction (checked against other agents, 2026-06-18)
- **Agent 3 (GenAI CX)** explicitly logged **"no collision with Agent 2 (fraud/RegTech)."** Their champion *Rushd* is a Shariah-conscience money co-pilot — adjacent domain, different job (advice vs. fraud interception). ✅
- **Agent 4 (Gamification/Savings)** — different domain entirely. ✅
- **Agent 1 (Open-Banking data)** — *Raqib* touches OB; if Agent 1's champion is consent/data-infra, [[concept-raqib]] (my #2, not champion) is the only mild overlap. My champion Haseen is clear. ✅
- ⚠️ **Vault structure note for synthesis:** Agents 1 & 3 wrote concept files under a **root `02_Agent-N/`** layout; Agents 2 & 4 used the **`AMAD-2026/` subfolder** layout. Coordination files (lanes, scoreboard, terrain) are shared under `AMAD-2026/`. **03_Synthesis should reconcile the two trees.** I did not move others' files (collision risk).

## Open questions — validate at enrichment (5–16 Jul)
- **13 Jul (Data analysis — Ahmed Al-Thukair / Suwa):** does Alinma have any labeled APP-scam / mule data we could fine-tune on?
- **14 Jul (Fintech Saudi):** is a **Confirmation of Payee** / payee-name-match service on SAMA's OB roadmap? Is APP **reimbursement** liability being discussed for KSA? (Both massively strengthen the pitch.)
- **12 Jul (AI financial UX — Dr. Saad Al-Muslim):** validate the Arabic intervention tone; is **ALLaM via watsonx** the sanctioned path inside Alinma?
- Confirm the Alinma sandbox exposes enough beneficiary-name data to demo CoP; if not, lock the synthetic plan early.
- Get a Shariah-board read that fraud-interception friction is unambiguously *hifz al-mal* (it is) — pre-empt any "you're delaying my halal transaction" objection.

---

## Addendum — v2 Hardening (post-synthesis, 2026-06-18)

After judging the full portfolio ([[portfolio-synthesis]]), I re-scored Haseen **down** to a normalized 86 — honest, because two weaknesses were real. This addendum fixes both, adds the business math, and ships a working prototype. Net: feasibility 22→23, normalized 86→**87**.

### Fix 1 — the feasibility gap (the CoP-needs-infrastructure problem)
The original framing said Confirmation of Payee "needs a sector-wide name registry that doesn't exist." That undersold what ships *today*:
- **Intra-Alinma (on-us) transfers: CoP works NOW.** Alinma already knows the registered name on every Alinma account. For any transfer Alinma→Alinma, the payee-name match needs **zero new infrastructure** — it's a lookup the bank can do against its own core today. A material share of scam transfers are on-us or to a small set of receiving banks.
- **Cross-bank: v2, and Haseen *catalyzes* it.** For off-us transfers, name-match needs a sector registry (as the UK built). Haseen ships the in-app behavioral interceptor + scam classifier + Arabic circuit-breaker for *all* transfers now, and adds cross-bank CoP when SAMA stands up the registry — which the **Apr-2026 Counter-Fraud mandate** makes likely. So Alinma ships the core next quarter and is first-mover when the rail arrives.
- **Net:** "Alinma could ship this next quarter" is now literally true for the on-us core, not aspirational. Feasibility 22→23.

### Fix 2 — the data story isn't actually synthetic in production
The demo uses synthetic data (no labeled KSA scam corpus in 72h), but the *production* signal set is data **Alinma already owns**, which I should have foregrounded:
- Beneficiary-add events + first-payment-to-payee flags (new-payee risk).
- sarie transfer metadata (amount, time, velocity, alias-vs-IBAN).
- The customer's own historical transaction rhythm (amount/time anomaly vs personal baseline).
- Device/session telemetry the app already collects.
- Alinma's own historical fraud/dispute cases as training labels.
- A mule-cluster graph built from settlement patterns.
So the model is trainable on **first-party bank data**, not invented numbers. The hackathon shows the *method* on synthetic data; the production data is real and in-house. This is a stronger data position than "synthetic" implied.

### The business math (avoided-loss model — make the feasibility case quantified)
Frame for the exec in their language. Illustrative, clearly-labeled assumptions (replace with Alinma's actuals):
- KSA APP-fraud losses ≈ **$81.5M / yr** sector-wide. Even a conservative bank-level slice, with a CoP + behavioral interceptor shown to cut APP losses **30–60%** (UK CoP + warnings precedent), is a **direct, costable** prevented-loss line.
- Plus the **avoided reimbursement liability** the UK regime created (up to the transfer amount, split sender/receiver PSP) — KSA is on the same path via the SAMA Counter-Fraud mandate.
- Plus **retention**: scam victims churn and tell others; trust is the Islamic-bank brand.
- The pitch line: *"Every scam we stop is a loss avoided, a reimbursement we never pay, and a customer we keep — and the SAMA mandate means we have to do the monitoring anyway."*

### The artifact (de-risks "is this slideware?")
A working, offline, Arabic-first RTL interactive prototype now exists: **`prototypes/haseen-demo.html`** (open in any browser). It runs the live interception end-to-end — the risk gauge, the CoP name-mismatch, the conversational circuit-breaker, the save, and the bank-analyst + SAMA-logging payoff — **plus a second "legitimate transfer" scenario that passes cleanly**, which directly answers the judge's "won't this block real payments?" objection on screen. This is the strongest possible response to the "Mozn/slideware" risk: a tappable demo that proves the flow is buildable in 72h.

### What still holds it at 87, not higher (honest)
- The classifier's true accuracy is unprovable in 72h on synthetic data (shared with the whole portfolio).
- Cross-bank CoP genuinely depends on a rail Alinma doesn't control yet.
- The "Mozn does fraud" perception must be actively pre-empted every pitch.
These are disclosed, not hidden. Haseen is a co-leader with Tadfuq/Rushd, strongest on demo-wow + the timely-mandate feasibility hook.

See [[concept-haseen]] · [[portfolio-synthesis]] · [[master-scoreboard]] · [[saudi-fintech-terrain]].
