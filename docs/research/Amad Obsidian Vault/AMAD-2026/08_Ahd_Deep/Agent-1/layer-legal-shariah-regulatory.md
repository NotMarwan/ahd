---
title: "Ahd — Layer 1 · Legal, Shariah & Regulatory (THE DEEP DELIVERABLE)"
tags: [ahd, layer/legal, agent/1, deliverable]
updated: 2026-06-19
---

# #ahd #layer/legal #agent/1 — The Nafath-grade Trust Foundation

> **Thesis of this layer:** Ahd is institutionally onboardable because it makes one disciplined choice and holds it everywhere — **the bank is the just scribe (الكاتب بالعدل) and settlement-agent (الوكيل), never the witness, never the lender, never the judge.** That single choice resolves the kill-line, the Shariah posture, and the SAMA lane simultaneously. Below, each load-bearing claim is grounded in a named law/standard or a designed mechanism.

---

## 1. Audit findings (summary)
See [[audit-legal]] for the full teardown. Four CRITICAL holes: (L1) admissibility asserted not proven; (L2/L4) the legal object and the fee model undefined so the riba status is unknown; (L8) "bank lends nothing" never mapped to the Finance Companies Control Law. Nine HIGH, three MED. None fatal; all closed below.

## 2. Gap register (summary)
See [[gaps-legal]] — 18 gaps, 4 Critical / 9 High / 3 Med, each mapped to the review it would fail and the section that closes it.

---

## 3. Deep resolutions (the bulk)

### 3.1 The admissibility stack — proven, not asserted
Admissibility is **layered**, and Ahd is engineered to satisfy each layer so a court has no ground to exclude:

```
LAYER 4  ENFORCEMENT     Najiz execution / Taradhi reconciliation (judgment → سند تنفيذي)
            ▲   (Ahd's role ENDS one step below this line — it never enforces)
LAYER 3  ADMISSIBILITY   Law of Evidence 2022 (M/43): digital record = documentary evidence
            ▲             IF integrity preserved from finalisation + retrievable + attributable
LAYER 2  E-SIGNATURE     Electronic Transactions Law 2007 (M/8) Art.14: e-signature has the
            ▲             SAME legal effect as a handwritten signature (Art.8 = record integrity/originality)
LAYER 1  IDENTITY        Nafath identity assurance (gov-backed) → binds signature to a real person
            ▲
LAYER 0  THE RECORD      tamper-evident document: canonical terms + SHA-256 + signed timestamp
```

**The four conditions Ahd is built to meet** (ETL Art. 8 / Evidence-Law integrity test), each with the concrete mechanism:

| Legal condition | What the law wants | Ahd's mechanism |
|---|---|---|
| **Integrity from finalisation** | the record is unchanged since it was finalised | on dual-sign, freeze a **canonical UTF-8 byte string** of the terms; compute **SHA-256**; chain it to the previous record's hash (append-only ledger). Any edit changes the hash → detectable. |
| **Attribution** | the signature is provably that person's | **Nafath-assured identity** bound into the signed payload (national-ID-hash + Nafath transaction ref + timestamp), via a **licensed CSP/e-sign provider (emdha-class)** producing an **advanced electronic signature** |
| **Retrievability** | the record can be produced, intelligibly, on demand | plain-Arabic human-readable terms + machine record both retained; export as a signed PDF/A "evidence bundle" |
| **Time** | when it was finalised | **RFC-3161-style trusted timestamp** from the CSP, not client clock |

> **Correction to the prototype (L1/L18):** the document must read **"مصمَّمة لتستوفي شروط القبول كدليل — نظام الإثبات ١٤٤٣"** ("designed to meet the conditions of admissibility"), **not** "is admissible." The court admits; we satisfy the conditions. And the demo's **FNV-1a hash is non-cryptographic** — for the thesis we specify **SHA-256 + signed timestamp**; FNV stays only as a demo stand-in, labelled.

**Resolving the kill-line head-on:** *"If it's just a record-keeper that escalates to MoJ, the witnessing is weak."* — No. A signed, Nafath-identity-bound, integrity-preserved electronic *iqrar bil-dayn* (إقرار بالدَّين / acknowledgement of debt) is, under Saudi law, **documentary evidence of the strongest written kind short of a notarised instrument** — and an *acknowledgement* (iqrar) is among the strongest proofs in Islamic procedure ("الإقرار سيّد الأدلّة"). The record-keeper does not *adjudicate*; it *manufactures near-incontestable proof at the moment of consent*, which is exactly what makes any later adjudication short and one-sided. That is **more** powerful than "witnessing," not less.

### 3.2 The scribe doctrine — the bank's EXACT legal role
Ayat al-Dayn (2:282) names two distinct roles: **﴿وَلْيَكْتُب بَّيْنَكُمْ كَاتِبٌ بِالْعَدْلِ﴾** ("let a *scribe* write it between you in justice") and **﴿وَاسْتَشْهِدُوا شَهِيدَيْنِ﴾** ("call two *witnesses*"). Ahd assigns them precisely:

| Role in 2:282 | Who plays it in Ahd | What it legally means |
|---|---|---|
| **الكاتب بالعدل** (the just scribe) | **Alinma / Ahd** | drafts the instrument fairly, records it, preserves integrity. **Not a party, not a guarantor, not a judge.** |
| **الشهيدان** (the two attesting) | the **two people + Nafath** | the parties attest their own consent; Nafath is the state-grade identity attestation |
| **الدائن / المدين** (creditor/debtor) | the **two private individuals** | the only parties to the *qard*; the bank is outside it |

The bank therefore wears **three named, separable hats**, and never the two forbidden ones:
- ✅ **كاتب / مُوثِّق (scribe / record-keeper)** — drafts + preserves the instrument.
- ✅ **وكيل بالسداد (settlement agent / wakala)** — executes the agreed transfers via sarie *on instruction*.
- ✅ **أمين (custodian / amana)** — holds any in-flight funds in trust, not as owner.
- ❌ **NOT شاهد** (a corporation cannot testify) — we say *scribe*, not *witness*, in all legal copy.
- ❌ **NOT مُقرِض (lender)** and ❌ **NOT قاضٍ (adjudicator)**.

**3.2.3 Locus of contract.** The *qard* offer/acceptance happens **inside Ahd** (so consent is captured authentically), but the **contract is between the two people**; Ahd hosts the meeting-of-minds and records it. This keeps the bank a non-party while still capturing genuine offer (إيجاب) and acceptance (قبول).

**3.2.4 Wording rules (consumer-protection safe, L14):** public copy uses **"موثِّق / كاتب أمين"** (trusted scribe), never "Alinma guarantees / enforces / witnesses your money." Marketing claim ceiling = the legal role.

**3.2.5 Graded-trust tiers — the legal fix for the adoption wound (L17).** The deepest adoption hole (Agent 3): *asking a loved one to Nafath-sign an IOU reads as distrust.* The legal layer solves it by **grading the instrument**, so the social ask matches the relationship:

| Tier | Legal object | Nafath AES? | Social feel | Evidentiary weight |
|---|---|---|---|---|
| **T0 ذِكر (a note)** | private record, lender-only | no | "I just want to remember" | low — internal record |
| **T1 توثيق (light attest)** | both tap "أوافق", soft auth | light auth, no AES | "let's both be clear" | medium — corroborating |
| **T2 عهد موثّق (full)** | dual Nafath AES *iqrar* | yes | "we're making it official" | high — near-incontestable |

The user **chooses the tier**; only T2 is the full e-signed instrument. This lets love stay love (T0/T1) and lets formality be a *deliberate, mutual* choice (T2). It also fixes the cold-start: the lender can issue at T0 alone and *invite* upgrade.

### 3.3 The complete Shariah construction & the EXACT fee model
**3.3.1 Two separate contracts (the crucial separation).**
- **Contract A — القرض الحسن (qard hasan)**, between the two people. **Zero markup, zero fee, zero penalty.** The bank is not a party.
- **Contract B — وكالة بأجر / إجارة خدمة (wakala/ujrah service)**, between the *user* and the *platform*, for drafting + record-keeping + settlement-agency. This is where any fee lives.

This separation is the whole game: a fee on **B** is a fee for a *service*, not an increase on the *dayn* — so it is **not riba**.

**3.3.2 The fee, specified exactly (charged to whom, on what, when):**

| Attribute | Specification | Why it is halal |
|---|---|---|
| **What** | a **flat platform fee** for the *wakala/documentation service*, e.g. a fixed **SAR amount per agreement** (or **free**, subsidised by float — see §3.4) | independent of principal & tenor → not riba |
| **Independent of** | the loan **amount** AND the loan **term** | scaling with either = riba al-nasi'ah; flatness kills it |
| **Anchored to** | **actual administrative cost** of the service (AAOIFI: a charge connected to lending may recover *only actual cost*; any excess is prohibited and must be board-approved) | passes AAOIFI's actual-cost test |
| **Charged to** | the **issuer** (lender) as the service-requester, or split — never as an addition the *borrower repays on the debt* | the borrower repays principal only |
| **When** | at **service rendering** (drafting/witnessing), once — not accruing over time | one-off ≠ interest-over-time |
| **Never** | a % of principal · a late charge · a tenor-based charge | each of these *is* riba |

> **Cleanest posture for the pitch:** **free at the consumer layer**, monetised by Alinma via **float on in-flight settlement balances + acquisition/conversion** — which removes the fee-riba question entirely and is the strongest Shariah answer. The fee model above is the *fallback* that is still clean if a fee is ever charged.

**3.3.3 Trustee model.** Funds in flight are held under **amana** (trust) / executed under **wakala** (agency) — the bank is **custodian and agent, not owner and not lender**. Title to the in-flight money never vests in the bank.

**3.3.4 The no-penalty enforcement (halal late-deterrent).** No ta'widh, no late fee. Instead:
1. **Respite for the insolvent** is *mandated*, not optional — Quran **2:280** «وَإِن كَانَ ذُو عُسْرَةٍ فَنَظِرَةٌ إِلَىٰ مَيْسَرَةٍ». Ahd auto-offers a respite/reschedule flow on hardship.
2. **Deterrence is social + evidentiary, not financial:** the *record itself* is the leverage (a solvent procrastinator — *mماطلة الغني ظلم* — knows a near-incontestable iqrar exists).
3. **Escalation is judicial, not in-app** (§3.7). The bank never charges, never seizes.

### 3.4 SAMA fit — PROVING the bank lends nothing
**The proof, stated plainly (closes L8):**
- The **Finance Companies Control Law** defines *"Finance"* as **"extending credit under contract."** In Ahd, **the creditor is a private individual; the bank extends no credit, books no receivable, carries no debt on its balance sheet.** Therefore **no finance activity occurs → no finance licence is engaged.** The debt is 100% an asset of the private lender, never of the bank.
- **No credit product, no deposit-as-lender, no balance-sheet exposure to the debt** — by construction, because the bank is *kātib + wakīl + amīn*, three non-credit roles.

**Correct licensing lane (Ahd has two distinct functions, two lanes):**

| Function | Activity | Lane | Notes |
|---|---|---|---|
| Drafting + record-keeping + e-signature | documentation / record service | **outside financing law**; rides ETL + Evidence Law; partner with a **licensed CSP** for AES | not a regulated *financial* activity per se |
| Holding in-flight funds + executing transfers | payment initiation / settlement agency / stored-value-in-transit | **SAMA Payment Services Provider Regulations** (or executed *as the bank itself* on sarie rails) | this is the lane the concept never named; it is **payments, not financing** |

**Recommended go-to-market posture:** launch in the **SAMA Regulatory Sandbox**, with Alinma performing settlement on its **own licensed rails** (so no third-party PSP licence is even needed initially), and the documentation layer riding ETL/Evidence-Law + a CSP. This is a clean, named, defensible path — not a hand-wave.

### 3.5 The fatwa firewall (closes L7)
The AI **drafts and flags**; it **never rules**. Engineered as:
- ALLaM/watsonx output is constrained to a **board-pre-approved template library** (§3.6 below). It can only *select and fill*, not *opine*.
- "Riba flag" = a **deterministic rule check** against a fixed haram-pattern list (interest term, penalty clause, tenor-scaled charge), not an LLM judgement. The check is a **lint**, not a fatwa.
- Any novel question → **"هذا يحتاج رأيًا شرعيًا"** + route to the Shariah board's published guidance. The app **states it is not a mufti**.
- Every template carries a **board-approval ID + version**; the AI cannot emit un-IDed text.

### 3.6 Nafath integration — what a real review demands (closes L9/L10)
**The two-layer truth the concept conflated:** Nafath = **identity assurance**; the **legally-weighted signature** is an **AES** produced by a **licensed e-sign provider / CSP (emdha-class)** that *consumes* Nafath identity. Ahd integrates **both**.

A real Nafath/DGA + CSP onboarding review demands, and Ahd specifies:

| Review demand | Ahd's answer |
|---|---|
| Legitimate, lawful use-case | documenting interpersonal qard — lawful, PDPL-consented |
| Identity assurance level | Nafath high-assurance (biometric app confirm) for **T2**; lighter for T1 |
| **Consent capture** | explicit, purpose-bound, logged consent screen before any ID processing |
| **Biometric handling** | **never stored** by Ahd — Nafath performs the match; Ahd receives only a *verified-true* assertion + transaction ref |
| **Audit trail** | immutable log of who signed, when, which Nafath txn, which document hash |
| CSP/AES binding | signature cryptographically bound to the document hash via the CSP |

**3.6.3 Guest eligibility (closes L10).** Be honest about who can sign:
- **Saudi nationals + Iqama-holding residents:** full Nafath → T2 AES. ✅
- **Tourists / foreign pilgrims (no Iqama):** **cannot Nafath-sign.** Fallback = **T1 light attest** (verified phone/passport-grade auth via the CSP) producing a *medium-weight* record — honestly labelled as lower evidentiary tier, not T2. The viral thesis is **re-scoped to the Nafath-eligible population (the vast majority of resident users)**, with tourists served at T1. This is the corrected, truthful growth model.

### 3.7 Dispute escalation — the exact procedure (closes L12)
Ahd's role **ends at producing the evidence bundle**. It never enters the court.

```
1. In-app nudge → respite/reschedule (2:280)  ───────────────  [Ahd acts: amicable]
2. If unresolved → Ahd generates the EVIDENCE BUNDLE:
      • signed PDF/A of the iqrar (Arabic terms)
      • SHA-256 + signed timestamp + hash-chain proof
      • Nafath identity-assertion refs for both parties
      • full settlement/audit log
3. User files on TARADHI (تراضي) for reconciliation  ─────────  [Ahd's role ENDS HERE]
4. If reconciliation fails → competent court; judgment issued
5. Judgment → enforcement instrument (سند تنفيذي) → NAJIZ execution
```

**Honest boundary (closes the overclaim):** the Ahd record is **strong documentary evidence**, **not itself an enforcement instrument**. Najiz enforces a *judgment* or a *notarised instrument*; a private record gets you a *fast, near-uncontested* path *to* such a judgment, because the iqrar is hard to deny. We claim exactly that — no more.

### 3.8 PDPL design (closes L11)
- **Lawful basis:** explicit consent (both parties) + contract necessity for the wakala service.
- **Minimization:** store the *assertion* of verified identity + a national-ID **hash**, not raw biometrics or full ID images.
- **Residency:** data in-Kingdom (PDPL + SAMA data-residency expectations).
- **Retention-vs-erasure conflict:** resolved by **evidentiary-hold exemption** — once a record is part of a (potential) legal claim, erasure yields to the legitimate need to retain evidence; disclosed in the consent.

### 3.9 Liability & limits (closes L13)
- **Mis-settlement:** bounded by **wakala scope** — the agent acts only on explicit instruction; out-of-scope acts are void, with a reconciliation/reversal SLA.
- **Forged consent:** Nafath high-assurance + AES make forgery state-grade-hard; residual risk carried via standard bank fraud controls, not by the counterparty.
- **The bank never guarantees repayment** (no *daman* on the debt) — it guarantees only the *integrity of the record* and *faithful execution of instructions*.

---

## 4. Edge cases & failure modes (the fiqh table)

| # | Edge case | Fiqh / legal issue | Ahd's explicit handling |
|---|---|---|---|
| E1 | **Default, no penalty** | qard forbids any increase | no fee; auto-respite (2:280) for *i'sar*; record-as-leverage; judicial escalation only |
| E2 | **Hibah vs qard** ambiguity | a gift is not recoverable; a loan is | **mandatory intent toggle at creation** (هبة/قرض); a *hibah* is recorded as non-recoverable and excluded from netting & estate-as-receivable |
| E3 | **Hawala / 3-party transfer** (Muqassa) | set-off needs validity + consent | see §4.2 |
| E4 | **Death of a party** | open *dayn* enters the **tarikah (estate)**; debts paid before inheritance distribution | on a death flag, the agreement **freezes**, converts to an **estate claim**, routes to heirs / Wirathah; auto-settlement halts |
| E5 | **Zakat on receivables** | a solvent-borrower *dayn* is zakatable wealth of the lender | surface an **annual zakat note** on outstanding receivables (informational; not a fatwa) |
| E6 | **Insolvency (i'sar)** | 2:280 mandates respite | hardship flow: pause, reschedule, no charge; never auto-debit into hardship |
| E7 | **Capacity (ahliyyah)** | minors/incompetents can't contract | Nafath identity gates to legal age/capacity; under-age blocked from T2 |
| E8 | **Coercion (ikrāh)** | voids consent | explicit, un-bundled, revocable-before-finalisation consent; cooling step before T2 sign |
| E9 | **Currency / sarf in netting** | set-off across currencies has sarf rules | net **same-currency only**; cross-currency legs excluded from auto-net |
| E10 | **Waʿd vs binding contract** | a promise (gift to come) ≠ enforceable debt | "promise" type recorded as **moral, non-enforceable**; only qard is a recoverable instrument |

### 4.2 Muqassa fiqh (closes L15) — is the netting lawful?
**Muqassa (مقاصّة / set-off) is an established, valid concept in Islamic finance** for offsetting mutual debts of the **same kind and currency**. But the prototype nets **without modelling consent** — a gharar/consent hole. Fix:
- Net only **matured, same-currency, qard-type** debts.
- **Per-party consent is required** before a netted settlement executes — each participant approves their net leg (one tap). Muqassa proposes; people consent; *then* sarie executes.
- A netted leg is itself a small **hawala** (debt transfer) — valid with the consent of the transferring party. The consent step makes every leg fiqh-valid.
- **Algorithm:** the greedy debtor↔creditor reduction (already built) computes a settlement of **≤ P−1** transfers — *not* the true minimum (that is NP-hard; ledger C1/C15). It does **not** alter who owes what in aggregate — it only collapses the tangle to a short, conservation-preserving settlement. Complexity **O(E + P log P)** — lawful and cheap.

---

## 5. Proof / grounding (cited sources)
- **Law of Evidence 2022 (Royal Decree M/43 — issued 26/5/1443H ≈ 31 Dec 2021, published 7 Jan 2022, in force 7 July 2022)** recognises digital records, documents & signatures as documentary evidence — *Al Tamimi*, *Ghazzawi Law Firm*, *QHM Law Firm* analyses.
- **Electronic Transactions Law 2007 (Royal Decree M/18 per the official Bureau of Experts portal laws.boe.gov.sa; cited as M/8 by MCIT & WIPO Lex — decree-number variant, counsel to confirm):** **Art. 8** — e-record originality/integrity conditions; **Art. 14** — an e-signature has the **same legal effect as a handwritten signature** when the conditions are met (ledger C1: signature-equivalence is Art. 14, not Art. 8) — *MCIT official text*, *Latham & Watkins*, *Lexology*.
- **Nafath + AES via a licensed CSP (emdha-class)** for legally-compliant signatures — *Zoho Sign / emdha KB*, *SignIt*, *SDAIA/Nafath*.
- **sarie per-transaction cap SAR 20,000** (informs amount-tier design) — *SAMA*, *ClearingPost*, *Lightspark*.
- **AAOIFI:** a service charge connected to a qard may recover **only actual administrative cost**, board-approved; excess prohibited — *AAOIFI standards summaries; EUDL comparative study*.
- **Finance Companies Control Law:** *"Finance = extending credit under contract"* → no credit extended by the bank ⇒ no licence engaged — *SAMA Rulebook*.
- **Najiz / Taradhi:** enforcement requires an enforcement instrument (سند تنفيذي); Taradhi = reconciliation — *Al Tamimi*, *my.gov.sa*.

## 6. Adoption implication — why a Saudi trusts / uses / returns
- **Trust:** "Alinma is the *just scribe* my faith commanded (2:282)" — not a surveillant, not a lender. The role *is* the sunnah of documentation, which a religious user already believes in. The bank earns trust by doing what the Quran told the user to do anyway.
- **Use:** the **graded-trust tiers (§3.2.5)** let love stay love — a note (T0) costs no relationship capital; full formality (T2) is a *mutual, deliberate* choice — dissolving the "asking a loved one to e-sign feels cold" wound that no marketing line could.
- **Return:** every agreement creates a **near-incontestable, retained, retrievable proof**; the user returns because the *record outlives memory* and because Muqassa makes a tangled circle collapse with consent in one tap. The legal layer is the reason the warmth is *safe*.

## 7. Residual risks (honest, mitigated)
| Risk | Why it remains | Mitigation |
|---|---|---|
| Exact Evidence-Law article numbers need counsel confirmation | public sources confirm the *substance* (digital evidence recognised; integrity test) but not every clause number | pre-production legal opinion; we cite substance + named laws, not invented article numbers |
| Iqrar weight vs a notarised instrument | a private iqrar is strong but below a notarised *sanad* | offer optional **Najiz/notary upgrade** for high-value agreements |
| Guest/tourist signing is genuinely limited | no Iqama ⇒ no Nafath AES | T1 fallback, honestly tiered; growth re-scoped to Nafath-eligible majority |
| Board sign-off on the fee + templates is pending | not yet obtained | "free-at-consumer / float-monetised" posture sidesteps the fee-riba question; templates are board-gated by design |
| Per-party netting consent adds friction | consent step slows the one-tap wow | default to *batch-approve* a proposed net set; still one consent action |

## 8. Objection-Killer additions (one-line kills)
- *"A bank can't be a witness."* → **Correct — it's the *scribe* (الكاتب بالعدل), 2:282. The parties + Nafath are the attestation. We never claim the bank testifies.**
- *"It's just a record-keeper that escalates elsewhere."* → **Yes — and a Nafath-bound, integrity-preserved *iqrar* is near-incontestable proof, so the escalation is short and one-sided. Manufacturing the proof at the moment of consent is *more* powerful than 'witnessing'.**
- *"What's the fee — isn't any fee on a loan riba?"* → **The qard carries *zero* fee. Any fee is for a *separate wakala/documentation service*, flat, independent of amount and tenor, capped at actual cost (AAOIFI). Cleanest posture: free, float-monetised.**
- *"Is this lending? Does it need a finance licence?"* → **No. 'Finance' is 'extending credit under contract'; the bank extends none — the creditor is a private person. Zero balance-sheet exposure. The only regulated touch is *payments* (in-flight funds), launched via the SAMA sandbox on the bank's own rails.**
- *"Can you really enforce it?"* → **We don't. We produce near-uncontested evidence and hand it to Taradhi/Najiz. Our role ends at the evidence bundle — by design, so we're never an adjudicator.**
