---
title: "Layer 1 — Legal/Shariah/Regulatory · SAVAGE AUDIT (v2, web-grounded)"
tags: [ahd, layer/legal, audit, agent/1]
updated: 2026-06-19
---

# #ahd #layer/legal #agent/1 — SAVAGE AUDIT (no flattery)

Posture: a Nafath/DGA integration reviewer, a SAMA examiner, and a skeptical Shariah board read `concept-ahd.md` (A–K), the teardown, and the prototype. Every load-bearing legal claim is presumed **unproven until a mechanism or a citation backs it.**

## A. Admissibility — the headline claim is asserted, not proven
1. **"Admissible under Evidence Law 2022" cites no article, no test, no mechanism.** A court does not admit "a hash." It admits a *digital document* (دليل رقمي) that meets an **integrity-from-finalisation** standard and an **attributable signature**. The concept never states (a) which provisions, (b) what the integrity test requires, (c) how Ahd's record satisfies it, (d) who bears the burden. As written a judge could exclude it. The Law of Evidence (Royal Decree M/43, in force **23 June 2022**) does recognise digital records/signatures as documentary evidence — but only when the record's integrity is preserved from finalisation and it is retrievable, mirroring **Electronic Transactions Law (M/8, 2007) Art. 8.** The concept invokes neither condition, so it cannot show it meets them.
2. **The prototype self-certifies admissibility.** It prints «مقبولة كدليل · نظام الإثبات ٢٠٢٢» on the document. **Courts decide admissibility, not issuers.** This is an overclaim bordering on misleading and must become "designed to meet the conditions of admissibility," not "is admissible."
3. **"Witness" is used loosely and dangerously.** In fiqh a *shāhid* testifies; in Saudi procedure a witness is examined. A corporation is **neither**. Ayat al-Dayn (2:282) actually names two *distinct* roles — a **kātib (scribe/كاتب)** who writes, and **shuhadā' (witnesses)** who attest. The strongest, most defensible reading — **the bank is the just scribe the verse commands ("وليكتب بينكم كاتبٌ بالعدل")**, and the two parties + Nafath are the attestation — is left on the table. CRITICAL.

## B. Shariah — clean in slogan, unspecified in mechanism
4. **The fee model is undefined → its riba/gharar status is literally unknown.** "Flat fee or free" is a shrug, not a structure. If the fee is a % of principal, or scales with tenor, or is a late charge → **riba**. Worse, the concept assumes any flat fee is automatically halal. **It is not.** AAOIFI's position on lending-institution service charges: a charge connected to a *qard* may recover **only actual administrative cost**, must be **Shariah-board-approved**, and **any excess over actual cost is prohibited**. The concept also never separates the *qard* contract (between the two people, zero markup) from a *separate wakala/ujrah service* contract (with the platform). Conflated, the whole thing reads as "fee on a loan." CRITICAL.
5. **The no-penalty trap is unanswered.** Qard hasan forbids any increase, so a late borrower faces **no financial consequence** — yet the concept offers no halal deterrent and no enforcement theory. Clean-but-unenforceable is a real hole. The halal answer (no ta'widh; respite for the insolvent per **2:280**; escalate to judiciary; record-as-leverage) exists but is not formalised. CRITICAL.
6. **Fiqh edge cases are entirely absent:** hibah-vs-qard ambiguity, three-party set-off (is Muqassa valid muqassa/hawala?), death/inheritance of an open *dayn* (it becomes part of the *tarikah*), capacity (*ahliyyah*), coercion (*ikrāh* voids consent), zakat on receivables, insolvency (*i'sar*). Any one, asked by the board, has no answer on the page. HIGH (collectively a gate).
7. **"The AI never issues a fatwa" is stated but not engineered.** What stops ALLaM from effectively *ruling* when it "flags riba" and "suggests halal phrasing"? The drafting-vs-ruling line is undrawn. HIGH.

## C. Regulatory (SAMA / Nafath / PDPL) — fit asserted, not demonstrated
8. **"The bank lends nothing" is right but never mapped to the actual law.** The proof is one sentence away and the concept omits it: the **Finance Companies Control Law** defines "Finance" as *"extending credit under contract"*; in Ahd the **creditor is a private individual and the bank extends no credit**, so **no finance licence is engaged.** Leaving it implicit lets a SAMA-minded judge wonder whether holding in-flight funds + scheduling repayments looks credit-like. Separately, **holding in-flight settlement funds touches payment-services / stored-value rules** (a *different* lane: SAMA Payment Services Provider Regulations) — never named. HIGH.
9. **Nafath integration is one word.** The concept conflates **Nafath authentication (identity assurance)** with a **legally-weighted advanced electronic signature (AES) on a document**. In market reality AES runs through a **licensed e-sign provider / CSP (e.g. emdha)** that *uses* Nafath for identity assurance and binds the signature to the document under ETL 2007. No assurance level, no consent capture, no biometric-handling rule (you don't get to store Nafath biometrics), no audit-trail design. HIGH.
10. **"Guest Nafath for non-customers" — the entire viral thesis — is unvalidated, and partly false for tourists** (a foreign pilgrim has no Iqama, cannot Nafath-sign). The growth engine depends on a feature never designed. HIGH.
11. **PDPL is name-dropped.** Two-party consent ≠ PDPL compliance. No lawful basis, minimization, residency, or the **retention-vs-erasure conflict** (you must *keep* the record as evidence, which collides with erasure rights). HIGH.
12. **Dispute escalation "→ MoJ/Taradhi" is a dead-end arrow.** Najiz enforcement requires an **enforcement instrument (سند تنفيذي)**; a private app record is generally **not** one absent a judgment or notarised instrument. The concept implies one-tap enforcement it cannot deliver. What artifact does Ahd hand over, in what format, and where does its role *end*? Undrawn. HIGH.

## D. Cross-cutting
13. **Bank liability when it's wrong** (mis-settles, leaks, a forged consent slips through) — undiscussed, yet the first question bank counsel asks. MED→HIGH.
14. **Brand vs legal-role mismatch:** marketing "Alinma witnesses your money" while legally being "a just scribe that records consent" is exactly the wording a consumer-protection lens flags. MED.
15. **Tamper-evidence overclaim:** the prototype hash is **FNV-1a (non-cryptographic)**. Real tamper-evidence needs ≥ SHA-256 + a signed/anchored timestamp. Flag honestly. MED.

> **Verdict:** the legal/Shariah/regulatory story is *directionally correct and genuinely strong*, but as written it is **a set of confident assertions with the mechanisms missing.** Four CRITICAL holes, several HIGH. None fatal; all closable. See [[gaps-legal]] → [[layer-legal-shariah-regulatory]].

## Sources consulted (grounding)
- Saudi Law of Evidence 2022 (M/43) digital-evidence recognition — Al Tamimi; Ghazzawi; QHM Law.
- Electronic Transactions Law (M/8, 2007) Art. 8 e-record conditions / e-signature handwritten-equivalence — MCIT; Latham & Watkins; Lexology.
- Nafath + AES via licensed e-sign provider (emdha) — Zoho Sign KB; SignIt; SDAIA/Nafath.
- sarie SAR 20,000 per-transaction cap — SAMA; ClearingPost; Lightspark.
- AAOIFI: qard service charge limited to actual cost, board-approved — AAOIFI standards summaries; EUDL comparative study.
- Finance Companies Control Law "Finance = extending credit under contract" — SAMA Rulebook.
- Najiz enforcement instrument + Taradhi reconciliation — Al Tamimi; my.gov.sa.
