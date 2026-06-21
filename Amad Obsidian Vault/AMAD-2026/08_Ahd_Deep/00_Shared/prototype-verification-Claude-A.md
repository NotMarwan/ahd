---
title: "Ahd — Independent Prototype Verification (Claude-A, integrator)"
tags: [ahd, verification, prototype, agent/integrator]
updated: 2026-06-19
---

# 🔬 INDEPENDENT PROTOTYPE VERIFICATION
### Evidence, not assertion — the deepened `project/ahd-demo/` actually runs

> The parallel run produced the four layer docs, the master dossier, the consolidated shared files, and a rebuilt prototype. As integrator I did the one thing that must be *evidenced*: I **independently ran the deepened prototype** — its computational core headless in Node, and the full UI in a real Chromium — and applied the honesty fixes the legal/product layers mandated. This file is the evidence trail.

## 1. Headless verification of the computational core (Node 24, deterministic)
Extracted the exact SHA-256 + canonical-serialization + hash-chain + Muqassa logic from the shipped `index.html` and ran known-answer + invariant checks. **14/14 PASS:**

| Check | Result |
|---|---|
| SHA-256("") = NIST empty-string vector (`e3b0c442…b855`) | ✅ |
| SHA-256("abc") = NIST vector (`ba7816bf…15ad`) | ✅ |
| `canonical_hash` is a full 64-hex SHA-256 digest | ✅ |
| `seal = SHA-256(prev ‖ canonical_hash ‖ seq)` reproducible | ✅ |
| Verifier on **untampered** data → seal **matches** (valid) | ✅ |
| Verifier on **tampered** amount (5,000→9,000) → seal **differs** (tamper caught) | ✅ |
| Muqassa seed = 9 IOUs → collapses to **2** transfers | ✅ |
| All settlement transfers positive | ✅ |
| Transfers (2) ≤ parties−1 (4) bound holds | ✅ |
| **Conservation invariant**: each party's net preserved exactly (Σ pre-net = cash moved) | ✅ |
| Total cash moved (900) = conserved net debt | ✅ |
| **Each party is purely a payer OR a receiver, never both** (single-sided) | ✅ |
| Finding probe: a net-debtor pays multiple creditors (maxOut = 2) | ✅ (see §4) |

> The hard part — the cryptographic integrity claim and the netting correctness — is now **proven against NIST vectors and a conservation invariant**, not asserted. The pure-JS SHA-256 (synchronous, offline) is the right call over async `crypto.subtle` for a deterministic, file://-safe demo.

## 2. Browser verification (Chromium via chrome-devtools, served over HTTP)
Loaded `http://localhost:8123/` in a fresh **isolated** browser context (so the parallel agent's tabs were untouched) and drove the full flow via script:
- **Console: 0 messages** across the entire flow (problem → record → verify → tamper → Muqassa). The previous lone `favicon.ico` 404 is **eliminated** (inline data-URI icon added).
- **RTL Arabic renders correctly** (verified via the a11y snapshot + screenshots).
- **Record screen**: corrected admissibility wording present (`مهيّأة كدليل`), old overclaim (`مقبولة كدليل · نظام`) absent, verifier shows **سليمة (valid)**.
- **Tamper toggle**: alters the amount → verifier shows **✗ عبثٌ مكشوف (tamper exposed)**, doc shows the altered ٩٬٠٠٠ — live, on screen.
- **Muqassa**: conservation proof table present (`برهان الحفظ`), 9→2, net-zero per party, corrected intro (`يدفع فقط أو يقبض فقط`).

**Evidence (browser-captured):** `project/ahd-demo/screenshots/verify-01-problem.png` · `verify-02-record.png` · `verify-03-tamper-caught.png` · `verify-04-muqassa.png`.

## 3. Honesty fixes applied to the prototype (aligning the artifact to the sealed thesis)
The rebuilt prototype contradicted two corrections its own layer docs mandated. Fixed in `index.html`:
1. **Admissibility overclaim → designed-to-meet** (3 spots: verifier hint, seal status, tamper-FAIL message). `مقبولة كدليل` ("is admissible") → `مهيّأة لاستيفاء شروط القبول كدليل … القبول تقدير القاضي` ("designed to meet the admissibility conditions — the judge decides"). *Per [[../Agent-1/layer-legal-shariah-regulatory|legal §3.1.3]] + [[../Agent-4/layer-product-demo|product §3.3]] + dossier §9 ("a judge's call, not ours").*
2. **Muqassa "minimum transfers" overclaim → honest framing.** `بأقل عدد من التحويلات` (the minimum — NP-hard, false) → "few transfers (≤ parties−1), each party only pays or only receives." *Per product §3.6.*
3. **favicon 404 eliminated** — inline data-URI icon → literally 0 console errors on stage.

## 4. 🚩 FINDING — empirically confirmed; already corrected in the dossier; one residual
**The claim "each person pays once" is FALSE for the shipped Muqassa seed.** نورة is the sole net-debtor (owes 900 net) and pays **two** creditors (600 to خالد, 300 to فهد) → she transacts **twice**. Greedy min-cash-flow does **not** guarantee one-transaction-per-person (true min-transfer is NP-hard). My headless probe proves it: `maxOut = 2`.

**Status across the docs (re-checked at end of session):**
- ✅ **`00_MASTER_DOSSIER.md` (sealed-v2): already corrected** — §4.2 now reads "bounded **≤ P−1**, … explicitly **not** 'each party pays once' (**a star pattern refutes it**)." My `maxOut=2` result *is* that star-pattern counterexample — **independent corroboration** of the parallel integrator's fix.
- ✅ **`Agent-4/demo-3min.md`: corrected** — "≤ عدد الأطراف − ١," never "أقل عدد."
- ✅ **Prototype UI:** never made the false claim (it states "2 transfers" + the ≤n−1 bound, both true); I additionally corrected its intro line to "each party only pays **or** only receives."
- ⚠️ **Residual:** `Agent-4/layer-product-demo.md` §3.6 line 125 still reads *"كل طرفٍ يدفع أو يقبض مرّةً واحدة فقط"* (each party pays/receives **once**) — false. It's a *source-layer* doc, superseded by the corrected dossier, so the **pitch is safe**, but for full consistency that one line should change to *"كل طرفٍ يدفع فقط أو يقبض فقط"* (each party only pays **or** only receives). Left for the Agent-4 owner (not overwritten here).

**The TRUE, verified, still-impressive claim:** *"From 9 tangled IOUs to 2 one-way transfers, every net balance preserved to the halala, and no one both pays and receives."*

## 5. Verdict
The deepened prototype is **genuinely real, runnable, and now honest**: cryptographic integrity proven, tamper-detection live, netting proven correct + conserving, zero console errors, RTL clean. It does on screen exactly what the dossier claims — and no more. The one residual is a prose overclaim in the dossier (§4), flagged for a one-line fix, not a code change.

*Verified by Claude-A (integrator), 2026-06-19. Headless: Node 24. Browser: Chromium (chrome-devtools MCP), isolated context.*
