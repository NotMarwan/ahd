---
title: "Operation Ahd — Finish Line · AGENT 2 Fix-up & Hardening Log"
tags: [ahd, finish, fixup, agent/2]
updated: 2026-06-19
---

# 🔧 FIX-UP & HARDENING LOG — Agent 2
### Lane: KSA stats · live riba-linter · housekeeping. Sole editor of the §3 files this round.

> Scope discipline: I edited **only** the files listed in my mandate + my own `09_Finish/Fixup/` folder. I did **not** touch RedTeam/, Consumer/, the dossier prose (only stat lines), or any shared file I don't own (e.g. `contracts.md` — flagged below, not edited).

---

## JOB 1 — Re-source the lending-pain stats to KSA data ✅
**Problem:** the headline pain stats (~31% owed / ~50% never write it down / ~30% never repay / 1-in-6 ruined a relationship) were **US LendingTree/Bankrate proxies**, flagged everywhere as needing KSA validation.

**What I did:** web-researched KSA-native data, then **led the problem case with defensible KSA facts** and **relabeled the US figures as "illustrative — KSA figure pending."** No clean KSA *survey* % exists for "never write it down / never repay," so those stay illustrative (honest), but the **scale and behavior are now KSA-grounded.**

**New KSA-grounded anchors (now leading the pain case):**
1. **سند لأمر (promissory note) is "among the most widely used legal documents in the Kingdom,"** directly enforceable via **Najiz** (debtor gets 20 days to settle). → Saudis *already* document personal debt — the documentation habit exists; what's missing is a *fair, structured, qard-hasan-clean, settling* instrument. (Also weakens the "documenting feels cold" objection.)
2. **SAMA had to bar finance firms from demanding promissory notes** from individual consumers → the سند لأمر is so widespread it needed curbing; appetite for a fairer instrument is real.
3. **Ministry of Justice delivered 43M+ Najiz e-services in H1 2024** — enforcement, documentation, and **acknowledgment (إقرار)** among the categories → enormous debt/documentation traffic.
4. **SAR ~213B** interpersonal cross-border remittances (2024, SAMA) + **SAR 2.5T** sarie throughput → the money-between-people flow is massive and digital. *(already in the dossier; reaffirmed)*

**Sources (links):**
- Promissory note ubiquity + Najiz enforcement: https://rhn-group.net/en/سند-لأمر-في-السعودية/ · https://ahysp.com/how-promissory-notes-are-regulated-and-enforced-in-saudi-arabia/ · https://al-mashora.com/en/enforcement-instrument-and-their-procedures-under-saudi-law/
- SAMA curb on promissory notes from consumers: https://rulebook.sama.gov.sa/en/not-request-promissory-notes-individual-consumers-when-offering-credit-card-financing-products
- 43M+ Najiz e-services H1 2024: https://www.arabnews.com/node/2551501 · https://www.spa.gov.sa/en/N2140615
- Remittances (context, already cited): SAMA via Argaam / Saudi Gazette / Arab News.

**Files edited (stat lines + sources only — prose untouched):**
- `08_Ahd_Deep/00_MASTER_DOSSIER.md` §2 (replaced the US-only bullet with 3 KSA-led bullets + US-illustrative) and §10 residual note #7.
- `08_Ahd_Deep/Agent-3/layer-growth-adoption.md` §3.2 line ~67 + the §5 proof note line ~218.
- `08_Ahd_Deep/Agent-4/business-case.md` §6 residual note line ~91.

---

## JOB 2 — Live riba-linter toggle in the prototype ✅
**Problem (handoff-13 §B4):** the dossier advertises an *interactive* riba-linter, but the demo shipped a **static ✓ badge** that inspected nothing.

**What I built** (`project/ahd-demo/index.html`, step 1): a real **deterministic clause linter** — a textarea + a 4-rule engine (`RIBA_RULES` / `ribaScan`) that, the instant the user types an interest/penalty/percentage/commission term, **flags it in Arabic, names the violation, shows the qard-hasan-clean rewrite, and DISABLES the Nafath/sign button** ("التوثيق متوقّف — أزِل البند المخالف") until it's removed — then clears to ✓ and re-enables. Two one-tap stage chips: **「＋ غرامة تأخير ٥٪」** (injects a violation → RED) and **「↩ امسح」** (clears → green). Offline, deterministic, RTL. The label is programmatically linked (`for="clause"`).

**Rules:** R1 فائدة/ربا · R2 غرامة/عقوبة تأخير · R3 نسبة/٪/% · R4 عمولة/زيادة/ربح — each with a halal rewrite (e.g. غرامة → *نظرة إلى ميسرة* / إلتزام بالتبرّع; نسبة → *أجرة خدمة ثابتة منفصلة عن القرض*).

**Verification (Chromium via chrome-devtools, isolated context):**
- **10/10 scripted behavior checks PASS:** empty→clean→sign enabled · penalty→block→sign **disabled** · violation text + halal-fix shown · clear→re-enabled · فائدة٣٪ flagged · نسبة١٠٪ flagged · benign "يُسدَّد خلال ثلاثة أشهر" passes.
- **0 console errors.** (Remaining console noise: **3 pre-existing accessibility advisories** — `[issue] No label associated with a form field` — on the original decorative `.field` labels in step 1; *not* introduced by the linter, *not* errors. My linter's own field is now properly labeled.)
- **Evidence:** `project/ahd-demo/screenshots/verify-05-riba-linter.png` (the RED/blocked state).
- **Bonus hardening:** verification surfaced a latent fragility (navigating away *mid* the step-1 typing animation left an orphaned `setTimeout` chain that, on completion, called `buildLinter()` against a now-gone DOM → a thrown `null.innerHTML`). Added two null-guards (`document.body.contains(el)` in the typing loop; an early-return in `buildLinter`). Re-verified: the same adversarial rapid-navigation now runs **error-free**, full flow (steps 1→2→3→4) intact, **0 console errors**.

---

## JOB 3 — Housekeeping ✅
1. **Agent-1 duplicate layer file — already resolved.** Only `Agent-1/layer-legal-shariah-regulatory.md` exists (the `layer-legal.md` orphan is gone; confirmed by `00_Shared/consistency-sweep-Claude-Workflow.md`). No action needed beyond the link fix below.
2. **BUILD-LOG layer table — aligned to canonical filenames.** All four rows were stale (`layer-legal.md` / `layer-tech.md` / `layer-growth.md` / `layer-product.md`) → updated to `layer-legal-shariah-regulatory.md` / `layer-tech-security.md` / `layer-growth-adoption.md` / `layer-product-demo.md`. (`08_Ahd_Deep/00_Shared/BUILD-LOG.md` lines 15–18.)
3. **Muqassa overclaim in `Agent-4/layer-product-demo.md` §3.6 — already corrected** (by the Claude-Workflow consistency sweep): line ~125 now reads "…بما لا يتجاوز (عدد الأطراف − ١) تحويلًا — كل طرفٍ إمّا يدفع فقط أو يقبض فقط، لا الاثنين معًا," with an explicit note that one party may appear in >1 transfer. No edit needed.
4. **Citation-drift flag for counsel (flag, don't resolve):** the e-sign decree is cited inconsistently as **Royal Decree M/8** (WIPO Lex; MCIT) vs **M/18** (BOE) — likely a م/٨ ↔ م/١٨ transcription variance; and the **Evidence Law (M/43)** in-force date appears as **23 Jun / 6 Jul / 8 Jul 2022** across docs. **Substance is solid** (digital records admissible; integrity test; burden-shift). **Action for counsel:** confirm the exact decree number + Hijri/Gregorian in-force date before the pitch; do not invent article numbers.

### ⚠️ Flagged, NOT edited (out of my lane)
- `08_Ahd_Deep/00_Shared/contracts.md:74` has a **dangling wikilink** `[[../Agent-2/layer-tech]]` → should be `[[../Agent-2/layer-tech-security]]`. `contracts.md` is a shared file **I don't own this round**, so I did not edit it. → **for the contracts owner / Agent 4 integrator.**

---

## Files touched this round (diff list)
| File | Change |
|---|---|
| `project/ahd-demo/index.html` | replaced static badge with live riba-linter (rule engine + textarea + chips + sign-gating); linked label |
| `08_Ahd_Deep/00_MASTER_DOSSIER.md` | §2 stat bullets → KSA-led; §10 residual note #7 updated |
| `08_Ahd_Deep/Agent-3/layer-growth-adoption.md` | §3.2 + §5 stat lines → US-illustrative + KSA anchors |
| `08_Ahd_Deep/Agent-4/business-case.md` | §6 residual note → US-illustrative + KSA anchors |
| `08_Ahd_Deep/00_Shared/BUILD-LOG.md` | layer table rows 15–18 → canonical filenames |
| `project/ahd-demo/screenshots/verify-05-riba-linter.png` | new evidence screenshot |
| `09_Finish/Fixup/fixup-log.md` | this file |

*Agent 2 — Fix-up & Hardening. KSA-grounded, linter-real, files clean. Lane respected; nothing outside it touched.*
