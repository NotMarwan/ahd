---
title: "Concept — حصين Haseen (Pre-Payment Scam Interceptor)"
tags: [agent/2, status/finalist, track/regtech, track/genai, req/ai, req/data, req/cx, score/90]
---

# 🛡️ حصين · Haseen — The Pre-Payment Scam Interceptor

> *Haseen (حصين) = "fortified / well-protected."* The in-app circuit breaker that stops a Saudi customer from sending an instant, irreversible **sarie** transfer to a scammer — in the three seconds **before the money leaves**.

**Track:** 3 — Financial Regulations (RegTech) *(secondary: 1 — Generative AI)*
**Requirements:** **/02 Use of AI + /01 Data Analysis + /03 Improve CX** (3 of 4)
**Score:** **90 / 100** — [[champion]]

## A. One-liner
*A real-time, Shariah-framed "circuit breaker" inside the bank app that catches authorized-push-payment scams the moment a customer tries to send money — name-matches the payee, reads the behavioral red flags, and interrogates the customer in Arabic before the irreversible transfer goes through.*

## B. Problem
**Authorized Push Payment (APP) fraud is the fastest-growing, least-solved fraud in KSA — and it lives in the one place bank fraud engines can't reach: the customer's own authorized decision.**
- KSA APP-fraud losses **~$81.5M** and climbing; sarie payments are **instant + irreversible** — once sent, neither the victim nor the bank can claw the money back.
- Scams are exploding: **+300% AI-driven scams** YoY, **+600% deepfakes** in KSA (Q1 2024). Fake-bank-officer, fake-investment, voice-clone "your relative needs money," and fake-merchant scams all end the same way: the customer is *socially engineered into authorizing the transfer themselves*.
- The bank's back-office monitoring (incl. Mozn/FOCAL) sees an **authenticated, customer-approved** transaction and passes it — the fraud is invisible to transaction-scoring because the *legitimate account holder* clicked send.
- **Why now:** SAMA's **Counter-Fraud Fundamental Requirements** become **mandatory 13 Apr 2026**, explicitly requiring **real-time monitoring + customer warnings**. The UK already mandates **APP reimbursement** (£85k cap, split 50/50 sender/receiver) — KSA is on the same trajectory, which converts every prevented scam into avoided bank liability.

## C. Solution
A lightweight layer that fires in the **payment-confirmation moment** of the bank app (or as an open-banking **PIS** pre-initiation check). Three engines run in <1s on "Send":
1. **Confirmation of Payee (CoP) — the thing KSA doesn't have.** Name-match the customer's *intended* beneficiary against the destination account's registered name (via OB/sandbox registry). A mismatch ("you typed *Mohammed Trading Est.*, this account is *Abdullah K.*") is the single highest-signal scam tell — and no KSA bank currently shows it.
2. **Scam-pattern classifier** — a model scoring the transaction *context*, not just the amount: new/never-paid beneficiary, payment to a known-mule cluster (graph signal), off-hours, round-number "invest now" amount, velocity, a beneficiary account that is itself young/dormant-then-spiking (mule pattern), device/session anomalies.
3. **GenAI Shariah-framed "circuit breaker"** — when risk crosses a threshold, an **Arabic conversational** intervention fires. Not a generic "are you sure?" — it *names the detected scam typology* and asks 2–3 targeted questions: «هل طلب منك أحدهم تحويل هذا المبلغ بشكل عاجل؟» / «هل وعدك أحد بأرباح من هذا المبلغ؟» / «هل تعرف المستفيد شخصياً وتأكدت من اسمه؟». Based on answers it either **releases**, adds **delayed-settlement friction** ("we'll hold this 30 min — call your relative directly"), or **warns hard** with the specific scam script. The customer can always override (it's a question, not a hard block — protects against false-positive friction).

**Only-possible-now:** GenAI makes the intervention *contextual and conversational* (typology-specific Arabic dialogue) instead of a static modal that everyone clicks past; the **licensed OB layer** makes cross-bank CoP feasible; the **Apr-2026 mandate** makes it required.

## D. Mapping
- **Track (one):** 3 — Financial Regulations (RegTech: fraud detection). *(GenAI is the mechanism, but RegTech is the home track — the win-case is "operationalizes SAMA Counter-Fraud.")*
- **Requirements:** **/02 Use of AI** (the conversational interceptor + scam classifier), **/01 Data Analysis** (behavioral + graph + CoP signals turned into a live decision), **/03 Improve CX** (protects the customer in their own language at the moment of risk).

## E. 72h build plan
**Architecture:** Arabic-first RTL app shell (React/Next or Flutter) → payment-confirmation hook → risk API (FastAPI/Node) running (a) CoP name-match against Alinma sandbox mock accounts, (b) a scam classifier (gradient-boosted model on synthetic+labeled features) + a small mule-graph lookup, (c) an LLM for the Arabic circuit-breaker dialogue with the risk context injected — production model = **ALLaM via IBM watsonx** (Alinma's actual GenAI stack; a Saudi-built Arabic-native model reads as on-strategy and on-dialect), with a strong general model as dev fallback. Analyst/back-office view shows the saved-loss tally.
**Built for real:** the end-to-end "Send → intercept → dialogue → block/release" flow; the CoP mismatch UI; the LLM Arabic intervention; the live risk-feature panel.
**Mocked/faked credibly:** live sarie settlement, the cross-bank name registry (use **Alinma OB sandbox** `developer-ob-sb.alinma.com` mock accounts + synthetic data), real deepfake-audio detection (out of scope — design the hook, don't depend on it).
**Day-by-day:** D1 — sandbox auth + transaction flow + synthetic scam dataset + CoP mock. D2 — scam classifier + mule-graph + LLM dialogue wired into the confirm step; Arabic UX polish. D3 — the *one* demo flow hardened, fallback recording, analyst dashboard, deck.
**The one feature that MUST work:** the live interception — a scam payment gets stopped on screen with the typology named in Arabic.
> 🛠️ **Working prototype already built:** `prototypes/haseen-demo.html` (offline, single-file, Arabic RTL). Runs the full interception (risk gauge → CoP mismatch → Arabic circuit-breaker → save → bank-analyst + SAMA log) **plus a clean "legitimate transfer" scenario** that passes without friction — the on-screen answer to "won't this block real payments?". This is the 72h scaffold; see hardening in [[champion]].

## F. Data story
- **Datasets/APIs:** Alinma OB sandbox (account/payments/transactions); **synthetic transaction generator** seeded with KSA scam typologies (investment, romance, impersonation, fake-merchant) + labeled mule rings; SAMA OB Lab mock data as backup.
- **The insight:** "73% of the loss is concentrated in *first-time-payee + urgency + name-mismatch* transactions" — show the feature contributions live as the risky payment is scored.
- **On screen:** a real-time risk gauge climbing as the user types the transfer, the CoP name-mismatch flag, and the saved-loss counter incrementing when the scam is blocked.

## G. Demo script (3 min)
1. **0:00 — The hook.** "Last year Saudis lost ~$81.5M to scams they *authorized themselves*. Their bank watched it happen. Watch us stop one." (One sentence, then straight to the phone.)
2. **0:25 — The scam in motion.** On screen: a customer gets a (deepfake-flavored) "Alinma security" call, is told to move 50,000 SAR to a "safe account." They open the app and start the transfer.
3. **1:00 — The interception.** On "Send," Haseen fires: CoP shows the name mismatch, the risk gauge spikes, and the Arabic circuit-breaker asks the three questions. The customer's answers ("yes, urgent / yes, someone called me") confirm the scam.
4. **2:00 — The save.** Haseen warns with the exact typology, holds the payment; the money never leaves. The saved-loss counter ticks up.
5. **2:30 — The bank's view + close.** Flip to the analyst dashboard: the mule account is flagged network-wide; the SAMA Counter-Fraud report auto-logs the prevented event. Close: **"This is the SAMA Counter-Fraud mandate, shipped — and the reimbursement bill Alinma never has to pay."**

## H. Bank-ship case (why Alinma deploys)
- **Revenue / cost / risk:** prevents the **coming APP-reimbursement liability**; protects retention (scam victims churn and erode trust); a prevented scam = a quantifiable avoided payout.
- **Compliance:** directly operationalizes the **SAMA Counter-Fraud Fundamental Requirements** (real-time monitoring + customer warnings, **mandatory 13 Apr 2026**); auto-produces evidence for the **mandatory SAMA quarterly compliance report**.
- **Shariah:** *hifz al-mal* — preservation of wealth is a **maqasid of Shariah**; protecting customers from fraud is Shariah-affirmative, not merely neutral. No interest mechanic anywhere. A differentiator framing for an Islamic bank.
- **PDPL/consent/SAMA:** runs on the customer's own transaction + explicit OB consent; data stays in-bank; the intervention is transparent to the user — clean on consent and SAMA security standards.
- **On-strategy:** extends the existing **Alinma OB sandbox** and slots into the **iz** consumer app channel.

## I. Differentiation
- **vs Mozn / FOCAL:** FOCAL scores transactions in the **back office** and sees an authenticated, customer-approved transfer — it cannot stop a scam the *legitimate user* authorized. Haseen owns the **consumer/human layer at the moment of authorization**. Complementary, not competitive (could even consume FOCAL's risk score as one input).
- **vs sarie today:** sarie confirms account *details* but does **NOT name-match the payee** — there is **no Confirmation of Payee in KSA**. Haseen brings the single most effective UK anti-APP control (2B+ checks/yr) to KSA first.
- **vs generic bank warnings:** static "are you sure?" modals have near-zero efficacy (everyone clicks through). The wedge is the **contextual, typology-specific, conversational Arabic intervention** triggered by real behavioral signals.

## J. Risk register
1. **Technical — "no real cross-bank name registry to do CoP."** → Mitigate: demo CoP against Alinma sandbox mock + synthetic accounts; frame production CoP as an OB-network service SAMA is positioned to mandate (as the UK did). Don't claim it's live cross-bank.
2. **Regulatory/UX — wrongly blocking a legitimate transfer.** → Mitigate: it's *friction + a question, not a hard decline*; user can always override; tune thresholds to keep false-positive friction low; log overrides for tuning.
3. **Demo-failure — live sandbox flakiness on stage.** → Mitigate: local mock + a pre-recorded fallback of the exact interception flow; never depend on live network at hour 70.

## K. Score — **90 / 100**
| Criterion | Wt | Pts | Why |
|---|---|---|---|
| Innovation | 20 | **18** | First KSA Confirmation-of-Payee + a conversational, typology-specific Arabic circuit breaker; owns a layer Mozn structurally can't. |
| Technical | 20 | **17** | Full end-to-end flow buildable in 72h on the Alinma sandbox; real classifier + LLM, not slideware. (−3: CoP registry is mocked.) |
| Data | 20 | **17** | Behavioral + graph + CoP signals → live decision with visible feature contributions; synthetic + sandbox data. |
| UX | 15 | **14** | The product *is* the UX — Arabic-first, RTL, intervenes in the user's language at the moment of risk. |
| Feasibility | 25 | **24** | Operationalizes the Apr-2026 SAMA mandate; avoids reimbursement liability; Shariah-native; runs on rails Alinma already exposes. The strongest "Alinma ships this" case in the portfolio. |

**Gates:** ✅ demo-able live in 72h · ✅ differentiated (CoP + human layer vs Mozn) · ✅ Shariah-compliant (no riba; *hifz al-mal*) · ✅ PDPL/consent/SAMA-aligned · ✅ one track (3) + 3 requirements.

→ Crowned champion in [[champion]]. See also [[concept-raqib]], [[concept-baseera]], [[saudi-fintech-terrain]].
