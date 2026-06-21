---
title: "08_Ahd_Deep — Cross-layer Contracts (shared interfaces & assumptions)"
tags: [ahd, contracts, deep-sprint]
updated: 2026-06-19
---

# 🔗 CONTRACTS — where the four layers must agree

> The single spine all four layers serve. Each layer surfaces NEW contract assumptions in its return; the integrator consolidates them here so the layers actually connect (e.g. consent spans legal + security; the record schema spans tech + legal; the fee model spans legal + product).

## The spine (do not drift)
**Ahd is the first bank-witnessed rail for money between people.** A loan to a friend / family IOU / deferred promise becomes a fair, plain-Arabic, **qard hasan** (interest-free) agreement that Alinma **witnesses** (Nafath e-sign), **records** (tamper-evident, admissible under نظام الإثبات / Evidence Law 2022), and **auto-settles** (sarie). Plus **Muqassa** (مقاصّة) debt-netting. **The bank lends nothing** — it is an **amana/wakala** record-keeper + settlement agent, **not an adjudicator** (disputes → MoJ/Najiz/Taradhi).

## Shared invariants (every layer must honor)
- **Legal role:** record-keeper + settlement agent (wakala/amana). NEVER adjudicator, NEVER lender, NEVER guarantor.
- **Shariah:** qard hasan / amana / wakala only. No riba, maysir, gharar. The AI **never issues a fatwa** — it drafts and flags, a human/board owns rulings.
- **Consent:** explicit, two-party, Nafath-bound, revocable-before-execution. PDPL-compliant, data-minimized.
- **The record:** tamper-evident, cryptographically verifiable, admissible evidence — escalates to MoJ, never self-adjudicates.
- **Demo integrity:** deterministic, offline, RTL, Nafath/sarie/ALLaM mocked behind labeled (`محاكاة`) seams. No live external call on stage.

## Consolidated cross-layer assumptions → SEALED below
> The per-layer "pending seal" placeholders are **superseded** by the post-verification **SEALED CONTRACTS S1–S15** section near the foot of this file, which reconciles all four layers' returned contracts *and* folds in the 15 verification verdicts ([[verification-ledger]]). Read S1–S15 as the binding set; the [[00_MASTER_DOSSIER]] and the demo cite it.

---

# 📐 CANONICAL DEFINITIONS (integrator-consolidated — the binding spine)
> Added 2026-06-19 (Claude-A). Every layer cites these instead of re-defining them. Grounded facts carry their source inline.

## C1. The bank's legal role (exact framing — use verbatim)
Alinma is, in precise order, **three things and nothing else**:
1. **أمين / Amīn (trustee · amana)** — custodian of the record and of in-flight funds. Holds, does not own.
2. **وكيل / Wakīl (agent · wakala)** — acts *for the two parties* to draft, capture consent, record, remind, and settle — for a fee (**ujrah**).
3. **شاهد بالوثيقة / witness-by-instrument** — produces and preserves the *evidence*; does **not** testify, judge, or enforce.

Explicitly **NOT**: lender, creditor, guarantor, adjudicator, debt-collector, or party to the qard. Disputes exit to **MoJ / Najiz / Taradhi**.

## C2. The `Ahd` object (shared data model — legal/tech/product/growth)
```
Ahd {
  ahd_id        // ULID, time-sortable, opaque
  type          // QARD_HASAN | SHARED_COST | DEFERRED_PAYMENT | PROMISE_GIFT
  parties       // [A,B]: {nafath_subject_id(hashed), display_name, role}
  principal     // {amount_halalas:int, currency:"SAR"}   // 1 SAR = 100 halalas; NO floats
  schedule      // [{seq, due_date, amount_halalas, status}]
  terms_ar      // FROZEN plain-Arabic clause set (ALLaM-drafted, human-confirmed) — the signed bytes
  riba_check    // {interest:false, late_penalty_to_lender:false, gharar_flags:[]}
  consent       // [{party, assurance_level, signed_at, sig_ref, ip_geo_hash}]
  record_seal   // {canonical_hash, prev_hash, chain_seq, tsa_token, alinma_sig}
  status        // see C4
  charity_clause?  // optional iltizām-bi-l-tabarruʿ — to charity, NEVER lender/bank
  muqassa_group?   // optional circle id
}
```

## C3. Fee model (riba-safe by construction) — grounded
- Revenue is **ujrah for the wakala/amana service**, not a charge on the qard (bank isn't a party to the loan).
- **Allowed:** flat fixed per-agreement fee OR flat subscription, sized to **actual cost of service**, independent of principal & tenor.
- **Forbidden:** any % of principal; any fee scaling with duration; any late fee to lender/bank. (All = riba.)
- **Late deterrent (halal, board-gated):** `charity_clause` — fixed pledged donation to a registered charity (Ehsan) on inexcusable lateness; never enriches lender/bank. *Source: AAOIFI Shariah Standard No. 19 (Qard) — admin fee must be actual-cost, not %-of-principal.*

## C4. Lifecycle state machine (shared by all layers)
```
DRAFT → PENDING_CONSENT → ACTIVE → (SETTLING ⇄ ACTIVE) → FULFILLED ("ذِمّة محفوظة")
        ↘ EXPIRED        ↘ DECLINED          ↘ DISPUTED → ESCALATED(MoJ)
                                              ↘ DEFAULTED (record sealed, escalation offered)
                                              ↘ FORGIVEN (إبراء — creditor waives; first-class state)
```
Only **two-party Nafath consent** moves DRAFT→ACTIVE. Re-drafting after a signature **voids** prior consent (C5).

## C5. Identity & consent assurance (shared)
`NAFATH_BIOMETRIC` > `NAFATH_OTP` > `GUEST_NAFATH` (non-customer, **still Nafath-eligible resident/citizen**). Below Nafath ⇒ **not admissible-grade** (offered only as a clearly-labelled unwitnessed note). Tourists (no Iqama) cannot Nafath-sign. Consent is **per-version**: term changes re-trigger consent.

## C6. Muqassa contract (shared tech/product)
Input: bilateral, ACTIVE, same-currency, consenting debts in an opted-in circle. Output: a **minimal settlement set** that preserves every member's net position to the halala; **no new debt without that pair's fresh consent**; deterministic. (Proof: [[../Agent-2/layer-tech]].)

## C7. Rails & their REAL limits (never claim past these) — grounded
| Rail | Role | Hard limit / reality |
|---|---|---|
| Nafath | identity + e-sign consent | citizens + Iqama residents; e-sign via CST-licensed TSP (emdha) |
| sarie (IPS) | instant settlement | **SAR 20,000 / txn**, 24/7 → larger qard chunks or standard transfer |
| Evidence Law 2022 (M/43, eff. 7 Jul 2022) | admissibility | digital record/sig admissible on **integrity + relevance**; challenger bears burden |
| Electronic Transactions Law 2007 (M/18 per BoE laws.boe.gov.sa; cited M/8 by MCIT/WIPO — decree-no. variant, confirm w/ counsel; 1428H) | legal effect of e-sign | underpins signature validity (Art. 8 e-record conditions) |
| ALLaM / watsonx | Arabic drafting | assist only — **never a fatwa**; human-confirmed before seal |
| MoJ / Najiz / Taradhi | dispute escalation | external; Ahd hands over the sealed record |
| PDPL | data protection | consent, minimization, KSA data residency |

## C8. Terminology lock
عَهد Ahd · ذِمّة dhimmah · بَراءة الذِّمّة (discharge) · قرض حسن qard hasan · مقاصّة Muqassa · أمانة amana · وكالة wakala · أُجرة ujrah · إبراء ibrāʾ (waiver) · إلتزام بالتبرّع iltizām bi-l-tabarruʿ · آية الدَّين Ayat al-Dayn (2:282).

---

# 🔒 SEALED CONTRACTS — post-verification (integrator, 2026-06-19)
> The four deep layers are written and independently verified (see `verification-ledger.md`). The definitions above (C1–C8) stand; the entries below **reconcile every layer's returned contracts**, fold in the verification corrections, and are the binding set the dossier/demo/business-case cite. Where a verification verdict was `partial`/`refuted`, the contract is stated in its **corrected, defensible** form.

## S1. Legal object = electronic *iqrar bil-dayn* (acknowledgement of debt)
Treat the artifact as an **iqrar**, not a "witness statement." Copy ceiling = **scribe** (الكاتب بالعدل, 2:282); never "Alinma witnesses/guarantees/enforces your money." **Evidence is presumptive/rebuttable** (M/43 Arts. 57–59) — strong proof of debt, not an irrebuttable instrument; admissibility is the court's call.

## S2. Admissibility stack the record store MUST satisfy
Per `ahd`: **RFC-8785 canonical bytes → SHA-256** (NOT FNV) → **Nafath assertions** {sub,acr,auth_time,txn_id,sig} bound into the envelope → **RFC-3161** trusted timestamp → **append-only hash chain + signed Merkle checkpoint + bank signature.**
- **Citation map (corrected):** signature equivalence = **ETL Art. 14**; record originality/integrity = **ETL Art. 8**, imported by **M/43 Art. 57**; digital-evidence weight = **M/43 Arts. 55–59**; judicial determination = **Arts. 4, 58, 61, 62.**
- **Accreditation caveat (C5/C14):** to land in **Art. 57(1)**, the bank's signing key + the TSA must rest on **accredited PKI / a licensed CSP.** Cryptographic integrity alone ≠ certified-signature status.
- **On-screen claim ceiling:** "designed to meet the conditions of admissibility" — never "is admissible."

## S3. Signature reality (Nafath ≠ the signature)
Nafath = **authentication**; the legally-weighted **AES/QES** is issued by a **CST-licensed, DGA-supervised TSP (emdha-class)** invoked via Nafath. **Tier-0** guest = Nafath-auth → **presumptive evidence**; add a CSP signature layer for binding strength. Counterparty must already hold an **activated Nafath/Absher identity**; Alinma needs a **registered Nafath service-provider account.**

## S4. Two-contract Shariah separation + the fee (corrected)
- **A — qard hasan** (two people): zero fee/markup/penalty; bank not a party.
- **B — wakala/ujrah service** (user ↔ platform): the only place a fee lives.
- **Fee shape:** `{flat_halalas, basis:"actual_direct_cost"}` — flat, **decoupled from amount AND tenor**, **actual DIRECT cost only** (overhead excluded), **board-approved figure + methodology.** Never a % of principal; never in the repayment schedule.
- **Contestable element (C2):** the separation is safe only if the service is **genuine and independent**, never a precondition of the qard (AAOIFI SS-19 cl.7/8, Hilah doctrine).
- **Basis = amana/wakala (agency/custody), not a qard service charge.** **Default posture: free at consumer layer, float-monetised** (sidesteps the riba question). Alinma-specific premise is **unverified** → state conditionally.

## S5. `ahd` object schema — immutable header + append-only event log; `status` DERIVED by fold(events)
(See C2 above for fields.) **Integer halalas, floats banned.** Status enum: **DRAFT → WITNESSED → ACTIVE → SETTLING → KEPT | DEFAULTED | DISPUTED → ESCALATED | VOID.** Remainder distributed so `Σ schedule == principal` exactly.

## S6. Bank attestation boundary (verbatim across all layers)
**Attests:** "Two Nafath-authenticated identities (acr ≥ substantial) sealed *this exact byte-string* at *this RFC-3161 time*; unaltered." **Does NOT attest:** cash moved · terms fair/Shariah-final · absence of coercion · truth of any underlying fact → those escalate to MoJ/Najiz/Taradhi.

## S7. Settlement contract (sarie — corrected)
**Credit-push only** (no silent pull). Auto-settle needs a **borrower standing mandate at signing**; else **degrade to confirm-to-push.** **Auto-split installments > SAR 20,000.** Banks set per-customer daily limits. **Idempotency key = `ahd_id ‖ schedule_index`.** In-flight funds = **Safeguarded Funds** (PSP-grade duties); run **as agent on the bank's own licensed rails** via the **time-boxed SAMA Sandbox.**

## S8. Muqassa contract (corrected)
Net only **matured, same-currency, qard-type, dual-sealed** debts. **Per-party consent** before any transfer (each leg = consented novation/hawala); batch-approve in one tap; decline → **bilateral fallback.** **Claim ceiling: "≤ P−1 transfers" (each iteration zeroes ≥1 party)** — NOT "each party once," NOT "minimum." **O(E + P log P).** UI: "few/efficient transfers."

## S9. Trust signal contract (NOT a credit score)
Windowed, time-decayed **kept-ratio / kept-count** over the user's **own** sealed history; **3-band qualitative mirror / count** to a counterparty. **Forbidden:** number/percentile · underwriting/pricing · SIMAH export · non-Ahd inference. **Private by default.**

## S10. Graded-trust tiers (cultural-wound fix)
**T0 عهد ودّي** (note, no sign) · **T1 توثيق** (light auth, presumptive) · **T2 عهد موثّق** (dual-Nafath AES). Default the social-ask to the lightest tier that meets intent. **Tourists cap at T1.** Growth scoped to the **~35M Nafath-eligible residents.**

## S11. Funnel ordering — lender signs FIRST
draft → **initiator Nafath-signs** → invite → counterparty reads (web, no install) → counterparty guest-Nafath-signs. No inversion to borrower-initiated. The invite is a **gift-receipt, not a demand.**

## S12. Reminder choreography
**Rail-sends-only**, ease-toned ("متى ما تيسّر"), frequency-capped, board-reviewed. Auto-settle removes most reminders. The friendship is never the collector.

## S13. Escalation boundary
Ahd ends at **producing the evidence bundle** for Taradhi/Najiz. **DEFAULTED carries NO penalty** (penalty = riba) — changes reminder tone + unlocks export. The iqrar is **strong evidence, not a سند تنفيذي.** Never adjudicate, never enforce.

## S14. Fatwa firewall
AI **drafts & flags**, never rules; constrained to a **board-pre-approved template library** (version + approval ID). "Riba flag" = **deterministic clause linter** (R1 sum ≤ principal · R2 no late penalty · R3 qard+riba block · R4 keyword scan → human review). Novel question → "هذا يحتاج رأيًا شرعيًا."

## S15. PDPL design
Lawful basis: **contract performance + legal-claim establishment** (sealed `ahd` not erasable on demand; optional processing revocable). Store pairwise `sub` + ID hash, **never raw biometrics**; **in-Kingdom residency**; key-destruction shred after the limitation period (chain keeps leaf hash without personal data).

## Reconciliation notes (where layers named the same thing differently)
- **"minimal settlement set" (C6) is superseded by S8:** claim **≤ P−1 transfers**, not "minimal" — the true minimum is NP-hard (C8/C15 verified).
- **`charity_clause` late-deterrent (C3):** retained as an *optional, board-gated* halal deterrent, but the **primary posture is no penalty at all** (S13) — DEFAULTED simply changes tone + unlocks export. Use the charity pledge only if the Shariah board prefers an active deterrent.
- **Fee (C3 → S4):** the canonical basis is **amana/wakala (agency)**, not a "qard service charge," and **actual DIRECT cost** (overhead excluded). Default to **free/float-monetised.**
- **sarie (C7 → S7):** add the **Safeguarded-Funds / PSP-grade** obligation and the **standing-mandate-or-confirm-to-push** reality — both were under-stated in C7.

