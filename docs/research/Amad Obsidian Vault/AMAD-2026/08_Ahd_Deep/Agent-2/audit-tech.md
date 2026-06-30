#ahd #layer/tech #agent/2

# Agent-2 · Technical & Security — SAVAGE AUDIT (no flattery)

> Posture: audit my own layer like an enemy Nafath/SAMA/Shariah/security reviewer. Every finding is a thing a hostile judge would say out loud. The prototype (`project/ahd-demo/index.html`) and the concept docs are the corpus. I am not here to praise the FNV demo — I am here to find where "witnessed money" is theater.

---

## A. The headline kill: "tamper-evident" is currently a marketing word, not a scheme

The concept says "tamper-evident record" and "hash-chained record store." The prototype computes **`fnv()` — a 32-bit FNV-1a non-cryptographic hash** (`index.html:124`). This is the single most embarrassing technical hole in the layer:

- **FNV is not collision-resistant.** It is a hash-table mixer, ~4 billion outputs, trivially collidable by birthday attack in seconds. Anyone can forge a different `ahd` that produces the same 8-hex "بصمة الوثيقة". The on-screen `#${AG.hash}` is **security theater**.
- There is **no chain**. The doc shows a single hash of `lender|borrower|amount|type|months|2:282`. Nothing links record N to record N-1. "Hash-chained record store" is asserted in the concept and **does not exist** in the build.
- There is **no signature**. A hash proves nothing about *who* issued it or *when*. The bank's authorship and the moment of sealing are unproven — so the record is **repudiable** ("the bank fabricated this", "I never agreed to those numbers").
- There is **no timestamp authority**. The record claims "نظام الإثبات ٢٠٢٢" (admissible under Evidence Law 2022) but carries **no trusted time** — and admissibility leans heavily on integrity + a credible time of creation.
- The Nafath confirm is a CSS progress bar (`confirmPerson`, `index.html:228`). **Nothing from the signing identity is bound into the hash.** The "witnessed record" binds to no witness.

**Verdict:** the entire value proposition ("the bank WITNESSES, RECORDS, AUTO-SETTLES") rests on a record object whose integrity, attribution, non-repudiation, and timestamp are all currently **absent**. This is the gap that, unclosed, lets a judge say "it's Splitwise with a fake hash."

## B. Admissibility is asserted, not engineered

The teardown already flagged this and it is correct: the screen literally prints *"موثّقة ومقبولة كدليل · نظام الإثبات ٢٠٢٢"* (`issueRecord`, `index.html:243`). **Saying a record is admissible does not make it admissible.** Saudi Evidence Law (in force 23 June 2022) admits digital evidence *provided it meets prescribed standards of integrity* and is "unequivocally clear and devoid of doubt" — so admissibility is a *consequence of an integrity scheme*, not a label you paint on a div. My layer must produce the integrity scheme that *earns* the label, and must be honest that final admissibility is a court's determination, not the app's.

## C. The bank's legal role is technically ambiguous — and that ambiguity is in the data model

"The bank WITNESSES (Nafath e-sign)" vs "the bank is an amana/wakala record-keeper, NOT an adjudicator" are in tension, and the **data model doesn't encode which one it is.** A witness attests to an event it observed; a record-keeper stores what parties assert. These have different liabilities. The `ahd` object currently has no field distinguishing *what the bank attests to* (that two Nafath-authenticated identities sealed this exact byte-string at this time — provable) from *what the bank does NOT attest to* (that the money was actually handed over, that the terms are fair, that nobody was coerced). Without that boundary in the schema, the bank is exposed to "you witnessed it, so you're liable for it."

## D. No threat model exists at all

The concept's risk register (section J) lists four *business* risks. There is **zero** adversarial/security analysis. Missing entirely: coercion-to-sign, fabricated agreements, repudiation, money-mule/laundering, Muqassa collusion, replay, account takeover, malicious-lender term inflation. For a product whose output is *legal evidence between people who may later be adversaries*, having no abuse-case table is disqualifying. Evidence systems are attacked by their own users, not just outsiders — that is the threat model that's missing.

## E. The Muqassa algorithm is real but under-proven and under-specified

Credit where due: `netting()` (`index.html:144`) is a genuine greedy debtor↔creditor reduction, deterministic, and it really collapses 9 IOUs → 2. But for the "/01 Data centerpiece" it is naked:

- **No complexity statement, no correctness proof, no invariant.** A judge asking "how do you know every person's net position is preserved?" gets no answer.
- **Greedy min-transfer is NOT optimal** — minimizing the number of settlement transfers is the NP-hard "minimum number of transactions" / subset-sum-partition problem. The demo's "أقل عدد من التحويلات" (fewest transfers) is an **overclaim**. The honest claim is "at most n−1 transfers," not "the minimum."
- **No edge cases:** disconnected sub-circles, a single dominant creditor, a pure 3-cycle, floating-point residue (the code uses `1e-6` epsilons but never argues why that's safe with halalas).
- **It's also a legal landmine nobody flagged:** netting A→B and B→C into A→C **substitutes the counterparty of a debt without both debtors' consent**. That is a *hawala / novation* event with its own fiqh and contract-law requirements. Netting is presented as a UI tap; it is actually a multi-party legal operation. No consent capture exists for it.

## F. Trust signal: undefined, and one careless field from being an illegal credit score

The concept says "trust capital (non-credit)" and "agreements kept reputation per person." **It is never computed.** There is no definition of what it sums, what it refuses, or how it avoids becoming a shadow credit score — which, if shared with a lender to make a lending decision, would drag Ahd into SAMA credit-bureau (SIMAH) territory and PDPL profiling. Right now it is a promise with a footgun attached.

## G. PDPL / consent / revocation: hand-waved

"Explicit two-party consent (PDPL)" is one phrase. Missing: what personal data is stored vs not, minimization, retention, lawful basis, and — critically — **revocation semantics**. Can a party "withdraw consent" on a sealed evidentiary record? (No — and the system must explain why that's PDPL-compatible: the lawful basis for a sealed financial record is *contract + legal claim*, not revocable consent. That nuance is absent.)

## H. Smaller but real

1. The demo has **no `agreed_terms_hash` shown to each signer before they sign** — they could sign a different byte-string than they saw (the WYSIWYS / "what you see is what you sign" problem). Critical for non-repudiation.
2. sarie is invoked as "auto-settle" with **no awareness of the SAR 20,000 per-transaction cap** — a 50,000 SAR family loan installment plan must be designed around it.
3. **Pull vs push:** sarie is a credit-push rail. "Auto-settle the installment" implies the app can *pull* from the borrower. It can't, without a standing mandate (Open Banking PIS / future direct-debit). The settlement model is hand-waved as automatic when it requires a pre-authorized payment consent.
4. No **idempotency / replay** thinking on the settlement or sign events.
5. Numbers are rendered with `toLocaleString` but money is stored as floating SAR (`AG.amount/AG.months` = 1000.0) — fine here, but a real ledger must be integer halalas.

**Bottom line:** the layer's *concept* is sound and the netting is genuinely real, but four things are currently bare assertion — the tamper-evident scheme, admissibility, the threat model, and the trust signal — and one thing (Muqassa) is real but overclaimed and legally under-modeled. The deep deliverable closes all five.
