---
title: "نصير Naseer — the agent that fights for your money (Gauntlet · Arena 4)"
tags: [gauntlet, agent/4, concept, arena/agentic, sealed, track/customer-experience, req/ai, req/data, req/cx, score/89]
updated: 2026-06-18
---

# نصير · Naseer — your money's advocate
**Track:** 2 Customer Experience (alt: 1 GenAI) · **Requirements:** /02 AI + /01 Data + /03 CX · **Score: 89/100** · **SEALED**

## 1. One-liner
**"Naseer is an AI advocate that fights for your money you're quietly losing — it hunts silent renewals, duplicate and post-cancellation charges, and stealth price hikes, then cancels, disputes, and switches you to better halal terms — acting on the merchants, never on your outbox, and proving the savings before you grant it a single power."**

## 2. The category
**The money-advocate agent** — not a PFM that *shows* you spending (Drahim), not an assistant that *advises* (retired Rushd), not a duty-executor that pays your obligations *out* (Wakeel). An agent that acts **outward, against counterparties, to recover and defend money that's leaking** — and that only a *bank* can truly run, because only the bank holds the levers that win. "I've never seen a bank whose AI is *on my side against everyone overcharging me*."

## 3. Problem & proof
Money leaks silently, and people are too busy / too defeated by Arabic call-center bureaucracy to fight:
- Avg person wastes **$204/yr on forgotten subscriptions**; **89% underestimate** their subscription spend (~$86 guessed vs ~$219/mo actual — a 2.5× blind spot); **42%** have been charged for a sub they forgot entirely; **72%** are on auto-pay; **70%** have missed cancelling a free trial. *(CNET 2025; resubs/SubBuddy 2026.)*
- Dark patterns are now a **regulatory** target: the FTC won a **$2.5B** settlement over Amazon Prime's cancel-traps (Sep 2025); KSA has **SAMA Financial Consumer Protection rules + the MCI Consumer Protection Law** — a tailwind for a tool that *operationalizes* those rights. *(FTC; SAMA Rulebook; MCI.)*
- AI bill-fighters (DoNotPay, Trim) prove demand and that it *works* (documented telco discounts, cancellations, refunds) — **but they're US-only, chatbot-thin, hold no bank rails, and have inconsistent success** (the gap Naseer fills). *(TechTimes; 19pine.)*
**Why now (2026):** licensed **AIS** lets an agent *see* every recurring charge; the **bank's own rails** (block a recurring mandate, run a Mada/scheme **chargeback**) let it *win*; **ALLaM** drafts the Arabic disputes/negotiations. The three only coexist now, and only inside a bank.

## 4. Solution & mechanics
A **wakala-governed advocate** that works in three certainty tiers — the spine is *recover & defend money IN*:
- **Tier 1 — Detect & Stop (certain):** a "money-leak radar" reads AIS, finds **zombie subscriptions, trials about to convert, price-creep, duplicate/double charges, charges after you cancelled.** One tap → **the bank blocks the recurring mandate at the rail** (an app literally cannot do this) and issues the cancellation request.
- **Tier 2 — Dispute & Reclaim (high-certainty):** for wrong/duplicate/post-cancel charges, Naseer **auto-assembles the evidence and files the chargeback** on the bank's own dispute rail, and drafts the MCI/SAMA consumer-rights complaint in Arabic.
- **Tier 3 — Negotiate & Switch (best-effort, never overpromised):** drafts an Arabic negotiation for a telco/insurer bill; finds a better **halal** alternative and executes the switch on approval.
**The two sealing rules:** (1) **Recovers money IN / acts on merchants — never sends your money OUT without a one-tap approval** → no trust or regulatory wall. (2) **Proves the savings on a read-only first run before you grant any power** → no cold-start.
**Only-now/only-here element:** the *bank-held levers* (mandate-block + chargeback) turned into a consumer AI — uncopyable by DoNotPay or any app.

## 5. Architecture (modules under one spine)
One product — "your money's advocate" — three modules that each earn their place by closing a hole:
```
            ┌──────────────  نصير Naseer  ──────────────┐
AIS (read)→ │  Money-Leak Radar  (detection model = the Data core)        │
            │      │                                                       │
            │      ├─ Tier 1 Detect&Stop → bank mandate-block (rail lever) │
            │      ├─ Tier 2 Dispute → chargeback + Arabic complaint (rail)│
            │      └─ Tier 3 Negotiate/Switch → ALLaM draft + halal switch │
 Wakala  →  │  scope/consent layer (revocable; outbound = 1-tap approval)  │
            │  Advocate's Ledger (every riyal recovered, auditable)        │
            └─────────────────────────────────────────────────────────────┘
```
The radar (detection) is the brain; the rail-levers are the muscle only a bank has; wakala is the governance; the ledger is the proof.

## 6. Track + requirements
**Track 2 — Customer Experience** (a categorically new consumer relationship: the bank as your advocate). **/02 AI** (detection + Arabic drafting agent) + **/01 Data** (the leak-detection model) + **/03 CX**. (Alt track: 1 GenAI.)

## 7. 72h build plan
- **Stack:** Arabic-RTL app; AIS read (Alinma OB sandbox + synthetic statements); a **recurring/anomaly detection engine** (real); ALLaM seam (deterministic) for dispute/negotiation drafts; mandate-block + chargeback **executed against mocked rails behind a labelled seam**; the Advocate's Ledger.
- **Built (real):** the **money-leak radar** (recurring-charge grouping, zombie/trial/price-creep/duplicate/post-cancel detection), the one-tap stop/dispute flows, the wakala scope grant, the ledger, the found-money tally.
- **Mocked (labelled `محاكاة`):** live merchant cancellation APIs, the actual scheme chargeback, live ALLaM. Real bank rails (mandate-block, chargeback) are *bank-internal* and demoed on the sandbox.
- **The ONE feature that must work:** connect → the **radar surfaces real found-money from the data** (e.g., "SAR 1,240/yr leaking") → one tap **stops a renewal + files a duplicate-charge dispute** → both land in the ledger.
- **Day cut-line:** D1 detection engine on synthetic/sandbox statements; D2 stop+dispute flows + wakala scope + ledger; D3 Arabic UX + the negotiation/switch draft + deterministic offline demo.
- Deterministic · offline-fallback · Arabic-RTL throughout.

## 8. Data story (earns the Data 20)
The radar **is** the data: from a real-looking statement it (a) clusters recurring charges, (b) flags **zombies** (paid, unused-pattern), (c) predicts **trial→paid conversions** before they hit, (d) detects **price-creep** (same merchant, rising amount), (e) catches **duplicate / post-cancellation** charges. Shown live: a ranked **"leak radar"** with SAR/yr impact per finding and a confidence — analysis that *acts*, not a pie chart.

## 9. UX
Arabic-first. The hero moment: the **radar reveal** — "أنت تخسر ١٬٢٤٠ ر.س سنويًا" with the leaks ranked, each with a single green **"أوقفه"** (stop it) / **"استرجع"** (reclaim). Calm, powerful, on-your-side — the opposite of a guilt-trip PFM. The Advocate's Ledger turns recovered money into a running, satisfying total.

## 10. 3-minute demo
1. **0:00 — the truth (20s):** "You're losing money right now to subscriptions you forgot and charges you never checked. You're too busy to fight. Naseer isn't."
2. **0:20 — the radar (50s):** connect (read-only) → **SAR 1,240/yr leaking** appears: 3 zombie subs, a free-trial converting *tomorrow*, a duplicate SAR 300 charge, a streaming price hike. *No power granted yet — value already proven.*
3. **1:10 — it acts (60s):** one tap → the bank **blocks the trial's recurring mandate** + cancels 2 zombies; the duplicate charge is **auto-disputed** (chargeback packet shown); an Arabic telco-negotiation draft is ready. Each lands in the Ledger.
4. **2:10 — the guardrail (25s):** a "switch to a cheaper halal plan — moves SAR 800" action **asks for one tap** (anything touching your outflow needs you). "Naseer fights outward; it never spends your money without you."
5. **2:35 — the leap (25s):** "DoNotPay is a chatbot in America. Naseer is your **bank** — the only one who can actually block the charge and win the dispute. An advocate that fights for your money, the halal way."
- **Live-failure fallback:** deterministic seeded account; the radar + actions run from a recorded fixture offline.

## 11. Business / Alinma-ship case
- **Retention & primary-account gravity:** the bank that *saves you money and fights for you* becomes the account you can't leave; saved money **stays as deposits**.
- **Premium tier:** a flat-fee "Naseer Advocate" subscription (the anti-subscription that pays for itself) — clean recurring revenue.
- **Cost/risk:** fewer angry call-center disputes (structured, evidenced); strengthens Alinma's **consumer-protection** posture with SAMA.
- **On-strategy:** ships into the Alinma app + **iz** youth base; runs on the OB sandbox + ALLaM/watsonx stack.
- **The conflict-of-interest flip:** "why would a bank help you cancel things?" → because the bank that's *on your side* wins the whole relationship; and only the bank can pull the rail levers — so it's the *natural* owner, not a conflicted one.

## 12. Shariah
**Wakala** (you appoint Naseer as your agent to recover/defend your rights — *recovering what's wrongfully taken is `adl`/justice, Shariah-positive*). Fee is a **flat wakala/subscription fee, never a contingency % of recoveries** (avoids gharar/uncertainty in the fee). **No riba, no maysir, no lending.** It switches you only to **halal** alternatives. The AI drafts disputes/negotiations — it **never issues a fatwa**.

## 13. ⭐ OBJECTION-KILLER TABLE
| Vector | Worst credible attack | Sealed answer (built-in) |
|---|---|---|
| **Innovation** | "It's DoNotPay/Trim — exists." | Those are US **chatbots with no bank rails**. Naseer is **bank-native** (mandate-block + chargeback an app *can't* do) + Arabic + a real detection model + wakala/flat-fee. New category in KSA, structurally bank-only. |
| **Technical** | "AI negotiating telcos in 72h is fantasy." | The **certain tiers (detect/stop/dispute) are fully built**; negotiation/switch is explicitly **best-effort, drafted not promised**. The demo's must-work path uses only the buildable tiers. |
| **Data** | "Detecting a sub is just grouping payments." | The model also predicts **trial→paid conversion, price-creep, duplicate & post-cancel charges**, ranked by SAR impact with confidence — a real anomaly/forecast layer, the strongest vector. |
| **UX** | "Another ignored notifications app." | It's **read-only-proven value on first open** (a number, not a nudge) + one-tap wins; the Ledger's growing recovered-total is a habit loop, not noise. |
| **Feasibility** | "A bank won't help you cancel / conflict of interest." | The bank that fights *for* you wins retention + deposits; **only the bank holds the winning levers** → it's the natural owner. SAMA consumer-protection tailwind. |
| **Shariah** | "Contingency fee / 'threatening' merchants = gharar/unethical?" | **Flat wakala fee** (no contingency → no gharar); recovering rights is **`adl`**; switches only to halal; no riba/maysir; AI issues **no fatwa**. |
| **Moat** | "OB makes recurring-detection commodity; any PFM copies it." | Detection is table-stakes; **winning the dispute/blocking the mandate is the moat — rail access only a bank has.** A PFM can show the leak; only Naseer plugs it. |
| **Demo** | "The recovery can't be shown live/deterministically." | The **detection + the stop + the dispute-packet** are deterministic and shown live; the uncertain negotiation outcome is *not* the demo's wow (the radar + one-tap stop is). |
| **Adoption** | "Why grant account access? trust." | First run is **read-only AIS**; it shows found-money **before any power is granted** → the value *is* the onboarding. Outbound actions always need a tap. |
| **So-what** | "SAR 17/mo of waste — too small." | It's **SAR 1,000–2,000+/yr per user** (subs + wrong charges + price-creep + better switches), recovered automatically, **forever** — and it's *found* money, the most emotionally potent kind. |

## 14. Risk register
- **Technical (merchant cancellation variance):** rely on the bank's **mandate-block** (universal) for Tier 1 rather than per-merchant flows; per-merchant cancellation is additive. 
- **Regulatory:** outbound/switch actions are **opt-in per action**; consumer-protection-aligned; PDPL consent = the wakala grant.
- **Adoption:** read-only proof-first; flat fee framed as "pays for itself or it's free this month."
- **Demo:** deterministic seeded fixture; offline fallback.

## 15. Score & comparison
| Criterion | Wt | Score |
|---|---|---|
| Innovation | 20 | **17** |
| Technical | 20 | **17** |
| Data | 20 | **18** |
| UX | 15 | **14** |
| Feasibility | 25 | **23** |
| **Total** | **100** | **89** |

**Beats the portfolio incumbent it critiques (Wakeel, 87):** Naseer picks the **safe, self-justifying direction of autonomy** Wakeel didn't — it recovers money *in* (no reg/trust wall) and **proves value before scope** (no cold-start), while earning the **Data** criterion Wakeel cedes. Same "agentic" wow, none of Wakeel's three fatal holes.

## Links
- [[teardown]] · [[attacks]] · [[concept-mudabbir]] · [[concept-wakeel]] (incumbent it surpasses) · [[master-scoreboard]]
