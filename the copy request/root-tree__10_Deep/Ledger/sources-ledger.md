---
title: "عهد · Ahd — SOURCES & EVIDENCE LEDGER (every source/stat/citation/test-vector + confidence)"
tags: [ahd, ledger, sources, evidence, vectors, 10_Deep, agent/Claude-Ledger]
owner: Claude-Ledger (PROMPT 5)
status: sealed-v1
updated: 2026-06-19
---

# 📚 SOURCES & EVIDENCE LEDGER — find any piece of evidence instantly

> Every web source, citation, statistic, and machine-checkable test vector any agent used this round (and
> the round-08 grounding it builds on), with the claim it supports and a confidence flag.
> **🟢 SOLID** (official/primary or authoritative-secondary, dated) · **🟡 PROXY/MODEL** (use but label) ·
> **🔴 PENDING** (needs primary data / counsel). Links are exactly as the agents recorded them.

---

## 1. Demand evidence — KSA-primary (Arsenal P3, `demand-evidence-ksa.md`)

| ID | Claim it supports | Figure | Conf | Source |
|---|---|---|---|---|
| D-1 | Saudis already document personal debt (closes red-team A1) | Promissory notes = **58.6% of 571,251** execution-court requests · **SAR 115.4B / 11 mo** (2020–21) | 🟢 | Argaam — argaam.com/ar/article/articledetail/id/1483475 |
| D-2 | Digital-justice scale / documentation habit | **43M+** Najiz e-services, H1 2024 | 🟢 | Arab News /node/2551501 · SPA /en/N2140615 |
| D-3 | Digital سند adoption | Nafith **800k** digital سند / 370k beneficiaries (yr 1) | 🟢 | SPA /w1579948 |
| D-4 | The blunt tool (سند) is abuse-prone → Ahd's fairer instrument | SAMA bars finance firms demanding سند from consumers (credit-card) | 🟢 | SAMA Rulebook (not-request-promissory-notes…) |
| D-5 | Interpersonal money movement / TAM | **SAR 213B** remittances (2024) | 🟢 | Argaam/SAMA — /en/article/articledetail/id/1788759 |
| D-6 | Beachhead segment | **2.25M+** freelancers (Sep 2024); SAR 72.5B / 2% GDP | 🟢 | Global Business Outlook |
| D-7 | Differentiation | Splitwise has **no Arabic** | 🟢 | Spliteroo blog (KSA alternatives) |
| D-8 | Relational strain (warmth axis) | US: 1-in-6 ruined; 55% bad outcome | 🟡 US | LendingTree · Bankrate — **relabel "illustrative, KSA pending"** |
| D-9 | KSA "% don't document / lost a relationship over money" | — | 🔴 | *primary-data plan* (15–20 interviews / survey / Arabic-Splitwise review mining) |

---

## 2. Market & macro arsenal (Arsenal P3, `market-and-stats-arsenal.md`)

| ID | Claim | Figure | Conf | Source |
|---|---|---|---|---|
| M-1 | Addressable population | 35.3M; expat 44.4% (~15.7M) | 🟢 | GASTAT / Argaam /en/…/1787903 |
| M-2 | Identity rail reach | Nafath 17.2M dl / ~75% adults; **23.5M users** | 🟢 | OECD-OPSI (nafath-app) |
| M-3 | Cashless behaviour | **79%** retail non-cash (2024, ↑ from 70%) | 🟢 | SAMA / SPA /en/N2299224 |
| M-4 | Account ownership | ~74% (Findex 2021) | 🟢 | World Bank Findex |
| M-5 | Settlement rail constraint | sarie ≤ **SAR 20k**/txn, 24/7, alias IDs | 🟢 | SAMA (Sarie) |
| M-6 | Vision-2030 fit | 80% non-cash by 2030 | 🟢 | Vision 2030 FinTech Strategy |
| M-7 | Sector momentum | FSDP fintech target 525 by 2030 (224 by Q2-24) | 🟢 | SPA N2185748 |
| M-8 | Regulatory path | SAMA Sandbox: 50 permitted, 19 active (Sep-24); incl. P2P | 🟢 | SAMA news-784 |
| M-9 | Device reach | smartphone ~97% | 🟡 | DataReportal 2024 (refresh pre-pitch) |
| M-10 | TAM/SAM/SOM | sizing arithmetic | 🟡 MODEL | derived; inputs cited |

---

## 3. Legal & Shariah citations (Arsenal P3 `legal-shariah-citations.md` + ledger C1/C5/C12/C14)

| ID | Authority / claim | Conf | Source | Resolves |
|---|---|---|---|---|
| L-1 | Law of Evidence **M/43** (2022): digital evidence; burden on challenger (Art. 58) | 🟢 | Al Tamimi · QHM (digital-evidence-law) | C1, C5, C12 |
| L-2 | ETL = **M/18** (27 Mar 2007); **Art. 14 = signature equivalence**; Art. 8 = integrity | 🟢 | BOE M/18 (laws.boe.gov.sa) · emdha | **Resolves the Art.8→Art.14 + M/8↔M/18 drift** (ledger C1/C12; Review X3/X10) |
| L-3 | emdha = CST-licensed, DGA-regulated, WebTrust TSP (AES/QES + timestamp) | 🟢 | emdha.sa/about-us · Cloud Signature Consortium | C14 |
| L-4 | AAOIFI SS-19: service fee = actual DIRECT cost, not linked to amount (cl.10/3/2); Hilah test (cl.7/8) | 🟢 | aaoifi.com (ss-19) · SBP Compendium | C2, C7, C13 |
| L-5 | Finance Companies Control Law: "finance = extending credit" → bank books none | 🟢 | SAMA Rulebook PDF | C3 |
| L-6 | SAMA Sandbox = time-boxed permission + exit plan | 🟢 | SAMA Sandbox (rulebook §1368) | C3 |
| L-7 | PDPL: in force 14 Sep 2023, enforceable **14 Sep 2024**; SDAIA | 🟢 | Morgan Lewis (2024/09) | — |
| L-8 | Qur'an **2:282** (scribe/witness) + **2:280** (respite) | 🟢 | mushaf | the spine + halal grace |
| L-9 | Nafath-AES permission for *private* interpersonal debt | 🔴 | red-team A9 — validation step | — |
| L-10 | Final admissibility verdict | 🔴 | a judge's call by design | claim ceiling "engineered to meet conditions" |

---

## 4. Round-08 grounding facts (BUILD-LOG + coordination salvage)

| Claim | Figure | Conf | Source |
|---|---|---|---|
| Musaned mandatory e-salary for ALL domestic workers | from **Jan 2026** (one-sided employer→WPS wallet — see C10) | 🟢 | Arab News 2627040 · HRSD WPS · Gulf News/Khaleej Times |
| Friend-loan: owed by a loved one | ~31% | 🟡 US | LendingTree |
| Never write the loan down | **49.9%**; set no repayment date **49.5%** | 🟡 US | FinanceBuzz/LendingTree |
| Borrowers who never repay (in full) | range **32% / 47.4–73%** (cite the range, not "30%") | 🟡 US | LendingTree · JG Wentworth |
| Evidence Law = Royal Decree M/43, effective ~8 Jul 2022; e-sig = digital evidence, valid unless disproven (burden shifts) | — | 🟢 | Bureau of Experts; cross-checked by L-1/L-2 |
| Cross-border interpersonal flows | ~SAR 144.2B expat + ~SAR 68.6B Saudi ≈ **SAR 213B/yr** | 🟢 | Argaam/SAMA (= D-5) |
| Behavioral anchors | loss aversion λ≈2.25; written-commitment ~18% no-show drop | 🟡 | Kahneman–Tversky; Cialdini / NN/g |

---

## 5. Cryptographic / compute test vectors (Backend P2 — reproducible) 🟢

> All emitted by `10_Deep/Backend/ref/generate-vectors.mjs` and pinned in `Backend/test-vectors.md`.
> Reproduce: `node 10_Deep/Backend/ref/generate-vectors.mjs`.

**SHA-256 conformance (NIST FIPS 180-4):**
- `""` → `e3b0c442…7852b855` · `"abc"` → `ba7816bf…f20015ad` · 56-byte multi-block → `248d6a61…19db06c1`. `selfTestSha256()` = PASS.

**The SEAL — demo record (Noura→Sara, 5,000 SAR qard hasan; JCS scheme):**
| artifact | value |
|---|---|
| chain genesis | `f82c6b59…04458cd6` |
| `sub` نورة | `cd8a0006…81e8` · `sub` سارة | `b5b63ded…27c1` |
| **terms_hash `h`** | `ceedb1e9…02db94a5` |
| lender / borrower binding `sig` | `a01e96e0…21227940` / `1185ff46…b952195c` |
| `tsa_token` (RFC-3161 seam) | `e010c8ed…d7b6cd39` |
| **envelope_hash `e`** | `9df50855…d3e36fb0` |
| **chain leaf** | `f7999f87…94813e41` |
| **bank_sig** | `8f1d28a5…8740bd22` |
| canonical terms | **1059 bytes** UTF-8 |

**Verification vectors:** intact → `intact:true` (7 checks); tamper 500000→900000 halalas → `integrity` fail (`h'=90e00c83…`); schedule reorder → `integrity` fail; key-reorder (control) → **intact** (JCS sorts keys); replay at seq=2 → `chain-continuity` fail.

**Merkle (RFC-6962, 4-record batch):** L0=`f7999f87…` … ROOT=`363296376…`; inclusion proof for L1 verifies `true`; forged leaf → `false`.

**Muqassa demo circle (9 IOUs, 5 friends):** balances نورة −90000 · خالد +60000 · فهد +30000 (Σ=0) → **2 transfers** (نورة→خالد 60000, نورة→فهد 30000); conservation `allZero/sumZero=true`, Σ=90000; transfer_reduction 0.7778, cash_reduction 0.5, **2 cycles**. Worst-case (machine-found): balances [−2,+4,−5,+2,+1] → greedy **4** vs optimal **3** (both `verifyPlan`✓; min is NP-hard).

**Trust signal (AS_OF 2026-06, W=24, λ=12):** نورة kept/100/12 · سارة kept/100/18 · خالد **overdue**/90/8 · ليلى kept/100/16 · فهد kept/86/6. Guard flags on every output: `is_number_exported:false · used_in_underwriting:false · sent_to_bureau:false · cross_party_inference:false`.

---

## 6. Hardening test evidence (Hardening P4 — reproducible) 🟢

> `10_Deep/Hardening/test-harness/` — slices the *real shipped* logic from `index.html`.

- **`run-tests.cjs` → 62/62**; **`offline-check.cjs` → 9/9**; **`dom-smoke.cjs` → 21/21**. **Total 92, 0 fail**, byte-identical run-to-run.
- **Frozen golden invariants** (the *shipped* demo's custom-canonical scheme — note: different from the Backend JCS scheme in §5): GENESIS `f80fcd62…`, content hash `f8d11335…`, **block seal `6c9410b9…`**, tampered seal `0b4c5d6d…`, terms_hash `94572857…`; net positions نورة −900/خالد +600/فهد +300; 9 IOUs → 2 transfers, Σ=900.
- **Real Chrome (Playwright MCP):** 0 console errors/warnings; **1** network request (the page); seal `6C9410B9…` identical across reload; tamper caught; Muqassa Σ=900. Evidence: `evidence/ahd-hardening-0{1,2,3}-*.png`.

> ⚠️ **The two hash sets are intentional, not a discrepancy.** §6 = the *shipped/frozen* demo (custom newline
> canonical → seal `6c9410b9…`). §5 = the Backend *spec/patch* (RFC-8785 JCS → leaf `f7999f87…`). Applying
> `prototype-compute-patch.md` would migrate the demo from §6 to §5 and require re-pinning the golden vectors.
> (See [[open-threads]] OT-04.)

---

## 7. The 🔴 PENDING set (own these; never over-claim) — from `ARSENAL-INDEX §4`
1. **KSA-primary demand shard** (D-9) — interviews/survey/court-refresh → closes A1 fully.
2. **Nafath-AES permission** for private interpersonal debt (L-9) — red-team A9 pre-production validation.
3. **Alinma Shariah-board sign-off** on the fee figure + two-contract separation (L-4 application).
4. **Accredited CSP/TSA** binding so the SEAL reaches certified-signature weight (L-10 / C5).
5. **Exact Evidence-Law article numbers + publication date** + final M/8↔M/18 reconcile (counsel).
6. **Refresh the 2024–25 court promissory-note breakdown** (D-1 is 2020–21 vintage).

---

## Links
- [[00_LEDGER]] · [[change-log]] · [[decisions-register]] · [[open-threads]]
- Full evidence files: `Arsenal/{demand-evidence-ksa,market-and-stats-arsenal,legal-shariah-citations,ARSENAL-INDEX}.md` · `Backend/test-vectors.md` · `Hardening/test-results.md`
