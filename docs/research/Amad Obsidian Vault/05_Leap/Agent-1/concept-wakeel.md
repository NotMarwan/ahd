---
title: "Concept — وكيل Wakeel · your digital wakil (wakala-governed money agent)"
tags: [agent/1, leap, concept, status/finalist, lane/agentic-money, track/agentic, score/87]
updated: 2026-06-18
---

# ⭐ وكيل Wakeel — your digital *wakil*
**Track:** 1 · Generative AI (the agentic brain) · **Requirements:** /02 AI + /03 CX + /01 Data · **Score: 87/100**
> The leap: not an assistant that *advises* (retired Rushd), not a budgeting autopilot that *optimizes* (Cleo). A **digital wakil** that **acts on your money to fulfil your duties** — governed by a 1,400-year-old Islamic agency contract the rest of the world is only now trying to invent.

## A. One-liner
**"Wakeel is your digital *wakil* — you grant it a revocable Islamic agency mandate, and it autonomously keeps your money's promises: your mother's support arrives every month, nothing is ever paid late, your zakat is set aside, your Friday sadaqah is given — all within a scope you set, all on Shariah's own contract for delegation."**

## B. Problem (the human truth)
A practising Saudi carries a quiet weight of **financial duties**, not just expenses: supporting parents (**birr al-walidayn — a binding duty, not charity**), paying what's owed on time, setting aside **zakat**, the **sadaqah** they always *intend* to give, commitments to family. Life is busy; balances move; a transfer is forgotten, a due date slips, the intention never becomes an action. Existing tools either *show you a dashboard* (PFM) or *optimize your spending* (Cleo) — **none of them carry your obligations for you.** The feeling isn't "I want better budgeting." It's "**I don't want to fail the people and the duties I'm responsible for.**"

**Why now / why here:** for the first time (2026) the three pieces exist at once in KSA — **PIS** lets an agent *act* (initiate payments), **ALLaM** lets it understand Arabic intention, and **wakala** gives it a Shariah-clean governance contract. None of these existed together a year ago.

## C. Solution
You grant Wakeel a **wakala mandate** — an explicit, Arabic, scoped, revocable delegation (the digital form of appointing a *wakil*):
- *"Support my mother SAR 2,000 on the 1st. Never let a bill go late. Set aside my zakat. Give SAR 100 sadaqah every Friday. Keep SAR 5,000 untouched. Anything above SAR 1,000 outside this — ask me first."*
Wakeel then **acts autonomously within that scope**, executing via **PIS** on SARIE:
- **Obligation sequencing engine** (the data core): reads your accounts (AIS), and each period sequences and executes your duties in priority order, **guaranteeing the obligations clear** before discretionary money is freed. If a duty is at risk (mom's transfer won't cover), it **reshuffles from reserve/discretionary** — it never asks you to borrow (no credit, ever).
- **Human-in-the-loop by contract:** anything outside the granted scope **escalates** for a one-tap approval (the wakil's authority is *limited by design* — this is a wakala condition, not a bolted-on setting).
- **The Wakil's Ledger:** a beautiful, auditable record of every duty kept on your behalf — "this month your wakil honoured your parents, paid 6 dues on time, set aside your zakat, gave 4 sadaqات." Proof you lived up to your responsibilities.

**The only-now/only-here element:** wakala turns the global agentic-money trust problem into a *solved* one. The West is bolting consent protocols onto AI agents (AP2 Intent Mandates, Mastercard Agentic Tokens); **Wakeel runs on the agency contract Islam codified 1,400 years ago** — scoped, revocable, permissible-only, fiduciary (*amana*), principal stays owner. Only an Islamic bank can credibly own this.

## D. Mapping
- **Track (one):** **1 — Generative AI** (the agentic Arabic brain is the heart). *Alt: Open Banking, since PIS is the rail.*
- **Requirements:** **/02 AI** (the agent) + **/03 CX** (a profoundly new, emotional experience) + **/01 Data** (the obligation-sequencing/affordability engine). 3 of 4.

## E. 72-hour build plan
- **Architecture:** Arabic-RTL app → **ALLaM (watsonx) seam** parses the spoken/typed mandate into a **structured scope object** → a **deterministic mandate/guardrail engine** (the wakala rules: scope, caps, permissible-only, escalation) → an **executor** that calls **PIS** (Alinma OB sandbox, mock) to initiate transfers/payments → the **Wakil's Ledger** UI.
- **Built vs mocked:** *Built* — the mandate parser→scope object, the guardrail/sequencing engine (real logic: it genuinely decides + orders + protects duties from synthetic balances), the PIS-execution flow, the Ledger. *Mocked (labelled)* — live ALLaM (deterministic seam), live bank rails (sandbox + synthetic household data), real settlement.
- **The ONE feature that must work:** **grant a wakala in Arabic → watch the agent autonomously execute a parent-support transfer + an on-time bill + a Friday sadaqah, each as a scoped, signed mandate entry, with one out-of-scope action escalating for approval.**
- **Day cut-line:** D1 mandate→scope parser + guardrail engine on synthetic accounts; D2 PIS-execution + the obligation sequencing + escalation; D3 the Wakil's Ledger + the Arabic grant UX + offline deterministic demo.

## F. Data story (shown live)
The obligation-sequencing engine *is* the data: from a real-looking household cash-flow, Wakeel computes affordability, **sequences duties**, detects a shortfall risk for the parent-support transfer, and **reshuffles to protect the duty** — shown live as a decision, with the reasoning ("mom's SAR 2,000 protected by moving SAR 600 from discretionary; zakat accrual on track"). Depth beyond a dashboard: it doesn't *report* the money — it *decides and acts*.

## G. Demo script (3 min)
1. **0:00 — the weight (25s):** "Every month a Saudi means to send money to his mother, give his sadaqah, pay on time. Life gets busy. The intention doesn't become the action." 
2. **0:25 — the grant (45s):** In Arabic, the user **appoints his wakil**: support mom SAR 2,000/1st, no late bills, weekly sadaqah, keep SAR 5,000, ask above SAR 1,000. The scope appears as a signed **wakala mandate**.
3. **1:10 — the act (60s):** Fast-forward the month. Watch Wakeel **autonomously execute** (sandbox PIS): mom's transfer goes out on the 1st; a bill is paid the day before it's due; Friday's sadaqah is given. Each lands in the **Wakil's Ledger** with its mandate reference.
4. **2:10 — the guardrail (30s):** A SAR 3,000 unscoped request appears → Wakeel **stops and asks** (one tap). "The wakil's authority is limited — by contract, not by a setting."
5. **2:40 — the leap (20s):** "An AI that fulfils your Islamic duties with your own money, governed by wakala — the agency contract Islam has had for 1,400 years. The world is inventing trust frameworks for AI agents. **Alinma already has one.** This is exportable to two billion Muslims."

## H. Alinma-ship case
- **Deepest brand fit:** only a **Shariah bank** can credibly issue a *wakala* mandate; this is Alinma's identity as a product. Runs on its **OB sandbox (PIS) + ALLaM/watsonx** stack.
- **P&L:** primary-account stickiness (the wakil lives on your main account); deposit gravity (reserves/intention pots); a defensible premium "digital wakil" tier; **acquisition** of the practising mainstream.
- **Vision ceiling:** Alinma defines the **Islamic governance standard for AI financial agents** (see sibling [[concept-tawkeel-protocol]]) — exportable region-/world-wide.
- **Compliance (uncontested by design):** **wakala = consensus-permissible**; the agent acts only on the user's **own money** → **no lending, no Tawarruq, no riba, no maysir/gharar**; permissible-subject-matter enforced; **PDPL** consent *is* the mandate; **SAMA** PIS-licensed rails; human-in-the-loop + full audit trail answer the autonomous-finance oversight bar head-on.

## I. Differentiation (incl. distinct-from-kill-list)
- **vs Cleo / Western autopilots:** they *optimize spending* for an individual; Wakeel *fulfils obligations* (family, faith, dues) under a faith-native trust contract. Different axis entirely.
- **vs retired Rushd (Shariah-conscience score):** Rushd *judged* how halal your money was (advisory). Wakeel **acts** to fulfil duties (executor). Judgment vs agency — a different category. No purification, no score.
- **vs retired Tadfuq/Namaa:** no credit, no lending, no savings-game/hibah. Wakeel never lends; it moves *your own* money to keep *your own* promises.
- **vs PFM (Drahim/SANAM):** they categorize and show; Wakeel decides and executes within a mandate.
- **Unfair edge:** the **wakala framing** is uncopyable by a conventional bank and unavailable to Western agentic-money players — and it's the *answer* to the trust problem they're all stuck on.

## J. Risk register
1. **"Would anyone let an AI move their money?"** (the category's #1 objection) → *mitigation:* the entire design is **scope-limited + revocable + human-in-the-loop by contract**; start with low-stakes, high-trust duties (a recurring transfer to mom the user already makes); the Ledger makes every action reversible-in-confidence and auditable.
2. **Demo/regulatory:** autonomous PIS execution is sensitive → *mitigation:* sandbox + synthetic only; show the mandate + escalation prominently; frame production as phased (notify→approve→auto within scope).
3. **ALLaM agentic depth unproven in 72h** → *mitigation:* ALLaM parses intent into a **structured scope**; a **deterministic** engine does the acting (safer + Shariah-faithful: the wakil acts only within explicit scope, never free-roams). Honest label.
4. **Shariah nuance of an *autonomous* wakil** → *mitigation:* scope + revocability + permissible-only are wakala's own conditions; pitch invites a Shariah-board read (it strengthens, not threatens, the concept).

## K. Score — 87/100
| Criterion | Wt | Score | Why |
|---|---|---|---|
| Innovation & creativity | 20 | **19** | Wakala-governed agentic money + duty-fulfilment is a genuine new category; "I've never seen this." |
| Technical implementation | 20 | **16** | Mandate parser + guardrail/sequencing engine + PIS execution genuinely buildable in 72h; autonomy is rule-bounded (honest). |
| Data analysis | 20 | **16** | The obligation-sequencing/affordability engine is real decision-data, shown live (not just a chart). |
| User experience (UX) | 15 | **14** | Arabic-first; the wakala grant + the Wakil's Ledger are emotionally resonant and novel. |
| Real-world feasibility | 25 | **22** | Shariah-clean by design (wakala, no contested contract); on Alinma's identity + stack + PIS rails; autonomous-finance oversight answered by the contract — minor reg caution keeps it below max. |

**Gates:** ☑ 72h-demoable · ☑ **leap (surprise + category + emotion)** · ☑ **Shariah-clean by design** (wakala consensus-permissible; no lending/maysir/gharar) · ☑ not on kill-list (executor, not score/credit/game) · ☑ PDPL/consent/SAMA · ☑ 1 track + 3 reqs → **ALL PASS.**

## Links
- [[champion]] (red-team) · [[research]] · [[raw-ideas]] · [[concept-majlis]] · [[concept-tawkeel-protocol]] · [[wildcard]] · [[master-scoreboard]] · [[00_Index]]
