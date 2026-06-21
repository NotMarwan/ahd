---
title: "Layer 1 — Legal/Shariah/Regulatory · GAP REGISTER (v2)"
tags: [ahd, layer/legal, gaps, agent/1]
updated: 2026-06-19
---

# #ahd #layer/legal #agent/1 — GAP REGISTER

Severity: **Critical** = fails a review outright (Nafath/SAMA/board would reject) · **High** = examiner/judge presses hard · **Med** = needs an answer, survivable. Resolutions live in [[layer-legal-shariah-regulatory]] (§ refs).

| # | Gap (what is missing/wrong) | Why it matters (which review/criterion it fails) | Severity | Closed in § |
|---|---|---|---|---|
| L1 | Admissibility asserted with no legal architecture (which law, what integrity test, how met, who bears burden) | Feasibility 25/25; a real dispute would exclude the record | **Critical** | §3.1 Admissibility stack |
| L2 | "Witness" used loosely; the actual fiqh/legal object (kātib/scribe + kitābah) unnamed → theory looks incoherent | Shariah board + bank counsel; the kill-line itself | **Critical** | §3.2 Scribe doctrine |
| L3 | E-signature legal effect (ETL 2007 Art. 8) never invoked; Nafath-auth conflated with AES | Dispute weight; Nafath review | High | §3.1, §3.6 |
| L4 | Fee model unspecified; assumes any flat fee halal; qard and wakala contracts conflated | Shariah board (riba); Innovation/Feasibility | **Critical** | §3.3 Fee model |
| L5 | No halal late-deterrent / enforcement theory (no-penalty trap) | Board ("clean but unenforceable"); bank-ship case | **Critical** | §3.3.4 + §3.7 ladder |
| L6 | Fiqh edge cases unhandled (hibah/qard, 3-party set-off, death/tarikah, capacity, ikrāh, zakat, i'sar) | Shariah board cannot approve | High | §4 Fiqh edge-case table |
| L7 | "AI never issues a fatwa" not engineered (drafting vs ruling line undrawn) | Board; the operator's banned-fatwa line | High | §3.5 Fatwa firewall |
| L8 | SAMA fit not mapped to law: no proof against Finance Companies Control Law; float/stored-value lane unnamed | SAMA examiner; "is it lending?" kill | **Critical** | §3.4 SAMA classification |
| L9 | Nafath model = one word; CSP/e-sign route, assurance level, biometric handling, audit, consent missing | Nafath/DGA reviewer | High | §3.6 Nafath integration |
| L10 | "Guest Nafath" unvalidated; impossible for tourists (no Iqama) — cold-start premise partly false | Nafath reviewer + growth thesis | High | §3.6.3 Guest tiers |
| L11 | PDPL: lawful basis, minimization, residency, retention-vs-erasure conflict unaddressed | PDPL/SDAIA + Nafath | High | §3.8 PDPL design |
| L12 | Escalation path is an arrow, not a procedure + artifact; Najiz needs an enforcement instrument | Judge + consumer-protection; overclaim of "enforcement" | High | §3.7 Escalation procedure |
| L13 | Bank liability model (mis-settle, leak, forged consent) undiscussed | Bank counsel + SAMA | High | §3.9 Liability & limits |
| L14 | Brand "witness" vs legal "scribe" wording mismatch | Consumer-protection | Med | §3.2.4 wording rules |
| L15 | Muqassa Shariah validity (set-off / hawala) + per-party consent not established | Shariah board; Data (the netting must be lawful) | High | §4.2 Muqassa fiqh |
| L16 | Contracting locus ambiguous: does Ahd *host* the qard or *record* one made offline? (affects offer/acceptance) | Board + counsel | Med | §3.2.3 Locus |
| L17 | Adoption wound (asking a loved one to e-sign reads as distrust) has no graded-trust legal design | UX/Adoption; the deepest adoption hole | High | §3.2.5 Graded trust tiers |
| L18 | "Tamper-evident" overclaimed (FNV-1a non-crypto) | Technical credibility | Med | §3.1.3 |

**Tally:** 4 Critical · 9 High · 3 Med (18 gaps). Every Critical is a hard gate for one of the three required sign-offs (Nafath, SAMA, Shariah board). Residual (not-fully-closable in 72h) items flagged in [[layer-legal-shariah-regulatory]] §7 Residual risks.
