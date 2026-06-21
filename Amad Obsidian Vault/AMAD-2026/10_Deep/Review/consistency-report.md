---
title: "Ahd — Full Reviewer · Consistency & Correctness Report"
tags: [ahd, review, consistency, 10_Deep, agent/Claude-C]
updated: 2026-06-19
status: DONE
reviewer: Claude-C
rule: "FLAG, do not edit other owners' files. Each row gives the exact locus, the contradiction, and the correct resolution for the owner to apply."
---

# 🧭 CONSISTENCY & CORRECTNESS REPORT

> Internal contradictions, stale links, and citation drift found on a cold cross-read. **The dominant pattern: the verification ledger and the post-collision consistency sweep corrected the *dossier* and a few loci, but several corrections never propagated back to the *source layers* the dossier cites as authoritative.** So a judge who opens `layer-growth-adoption.md` or `layer-product-demo.md` finds the *refuted* version of a claim the dossier already fixed. These are the highest-value fixes here because they are cheap (a few words each) and they remove live contradictions.
>
> I did not edit any file. Each row is for its owner (`08_Ahd_Deep/**` = the layer/dossier authors; `project/ahd-demo/**` = Claude-Orchestrator).

---

## A. Refuted/corrected claims that never propagated to the source layers (the important set)

### X1 — Musaned "forces both sides / fixes k<1" — REFUTED (ledger C10), still live in the growth layer. 🔴 SERIOUS
- **Locus:** `08_Ahd_Deep/Agent-3/layer-growth-adoption.md`
  - §3.5: *"Forced-adoption wedge (Musaned…): regulation **mandates the second side** … This seeds the network"* and *"the **forced-adoption seed that fixes k<1**."*
  - §3.7 rung 1: *"**Regulation forces both sides.**"*
  - §8 objection-killer line: *"We **seed both sides with a regulation that already forces it**."*
- **Contradiction:** Ledger **C10 = refuted**: the mandate is **one-sided (employer→closed WPS wallet)**; it does **not** create a two-sided interpersonal rail or solve k<1. The dossier (§4.3, §10.4), objection-killer (K15), and business-case (§4) all carry the *corrected* form. Only the source growth layer still asserts the refuted version.
- **Why it matters:** This is the single biggest correction in the whole project (the ledger itself calls C10 "the single biggest correction"). A judge who reads the *layer* gets the claim the team already knows is false. It directly threatens Feasibility (25%) and the team's hard-won honesty credibility.
- **Resolution (for Agent-3 owner):** Rewrite §3.5/§3.7/§8 to the C10 form: *"The mandate guarantees mass employer+worker wallet/KYC presence by 1 Jan 2026 — lowering onboarding friction for an adjacent witnessed-covenant product — but it is a one-sided employer→wallet rail and does NOT by itself create a two-sided interpersonal rail or fix k<1; that needs a separate GTM."* (Copy the wording already in objection-killer K15.)

### X2 — "each party settles exactly once" — REFUTED (ledger C15), still live in the product layer §7 & §8. 🔴 SERIOUS
- **Locus:** `08_Ahd_Deep/Agent-4/layer-product-demo.md`
  - §7 residual table: *"we claim the **provably-true 'each party pays/receives once'**, and bound it ≤ P−1."*
  - §8 objection-killer: *"We claim **each party settles exactly once**, which is provably true…"*
- **Contradiction:** **Self-contradiction inside the same file.** §3.6 was patched (by the consistency sweep) to say *"A single party may still appear in more than one transfer, so we never claim 'settles in exactly one transfer'"* — but §7 and §8 still assert the refuted "exactly once / pays-or-receives once." Ledger **C15** gives the counterexample ([+1,+2,+3,+4,−5,−5] → the largest debtor appears in 3 transfers).
- **Why it matters:** "Muqassa minimizes transfers? Counterexample" is a named teardown attack (objection-killer #3/K11). If a judge reads §8's residual-objection-killer line, they get the *exact wrong claim* the team built a counterexample against. Technical (20%) + Data (20%).
- **Resolution (for Agent-4 owner):** In §7 and §8 replace "each party settles/pays/receives **exactly once**" with the §3.6 truth: *"each party ends on **one side** (pays-only XOR receives-only) after netting to a single balance; total transfers **≤ P−1**; a party may still appear in >1 transfer."*

### X3 — ETL signature-equivalence cited as **Art. 8**, should be **Art. 14** (ledger C1) — still wrong in the legal layer. 🔴 SERIOUS
- **Locus:** `08_Ahd_Deep/Agent-1/layer-legal-shariah-regulatory.md`
  - §3.1 LAYER-2 diagram: *"Electronic Transactions Law 2007 (M/8) **Art.8**: e-signature has the SAME legal effect as a handwritten signature."*
  - §5 proof note: *"…**Art. 8** — e-record conditions; e-signature has the **same legal effect as a handwritten signature**."*
- **Contradiction:** Ledger **C1 + the synthesis note**: signature handwritten-equivalence is **ETL Art. 14**; **Art. 8 is the record-originality/integrity test.** The dossier (§4.1) and the sealed contract **S2** carry the corrected citation map ("signature equivalence = ETL Art. 14; record integrity = ETL Art. 8, imported by M/43 Art. 57"). The legal *layer* still conflates them.
- **Why it matters:** A Nafath/NCDC or legal reviewer who knows the statute spots a wrong article on the headline legal claim — it undermines the "we did the legal homework" credibility that is the layer's whole point. Feasibility (25%).
- **Resolution (for Agent-1 owner):** In §3.1 and §5, attribute **signature equivalence to Art. 14** and **integrity to Art. 8 (imported by M/43 Art. 57)**, matching S2. (The consistency sweep already noted the ASCII diagram is fragile — at minimum fix the §5 prose.)

### X4 — Muqassa called the **"minimum transfer set"** — refuted (C8/C15), still in the legal layer §4.2. 🔴 SERIOUS
- **Locus:** `08_Ahd_Deep/Agent-1/layer-legal-shariah-regulatory.md` §4.2: *"the greedy debtor↔creditor min-transfer reduction (already built) computes the **minimum transfer set**."* Also §4.2: *"Complexity **O(n log n)**"* (the sealed figure is **O(E + n log n)** / **O(E + P log P)**).
- **Contradiction:** Ledger **C8/C15**: the true minimum is **NP-hard**; greedy is **≤ P−1**, *not* the minimum. S8 says claim "≤ P−1," never "minimal." The tech layer, dossier, and demo-v2 all use the corrected form; the legal layer's fiqh section still says "minimum."
- **Why it matters:** Same NP-hardness counterexample attack as X2; the legal layer is the one place that still hands a judge the overclaim. (Lower visibility than §8, but it's the binding fiqh-of-netting section.)
- **Resolution (for Agent-1 owner):** "computes a settlement set of **≤ P−1 transfers** preserving every net (not the provable minimum — NP-hard); **O(E + P log P)**."

---

## B. Internal data-model / spec contradictions (binding spine disagrees with itself)

### X5 — `ahd_id` type is specified four different ways. 🟠 MODERATE
- **Loci:** contracts **C2** → `ahd_id // ULID`; tech `layer-tech-security.md` §3.1 table → `ahd_id | UUIDv7`; product `layer-product-demo.md` §3.1 → `id: "AHD-" + base32(seq)`; prototype `index.html` → `ahd_id:"AHD-01HZ-NOURA-SARA"` (a hand-written string).
- **Why it matters:** The `ahd` object is explicitly the "shared data model across legal/tech/product/growth" (C2). Four ID schemes is the kind of thing a careful technical judge notices when cross-reading the layers. Low stakes, but it's the *canonical* object.
- **Resolution (for contracts owner):** Pick one in C2 (ULID is fine — time-sortable, opaque, matches the "ULID" already in C2) and have the tech/product layers cite C2 instead of re-specifying. Note the prototype value can stay illustrative if labeled.

### X6 — The lifecycle **state names** disagree across the canonical files. 🟠 MODERATE
- **Loci:**
  - **C4** (canonical): `DRAFT → PENDING_CONSENT → ACTIVE → (SETTLING⇄ACTIVE) → FULFILLED`, plus `EXPIRED / DECLINED / DISPUTED → ESCALATED / DEFAULTED / FORGIVEN`.
  - **S5** (sealed): `DRAFT → WITNESSED → ACTIVE → SETTLING → KEPT | DEFAULTED | DISPUTED → ESCALATED | VOID`.
  - tech §3.1: `draft → sealed → settling → kept → disputed`.
  - product §3.2: `DRAFT → WITNESSED → ACTIVE → SETTLING → KEPT / DEFAULTED / DISPUTED → ESCALATED / VOID` (matches S5).
- **Contradiction:** **C4 and S5 — both in the *same* contracts file — use different vocabularies** (PENDING_CONSENT/FULFILLED/EXPIRED/DECLINED/FORGIVEN vs WITNESSED/KEPT/VOID). The tech layer uses a third, shorter set (`sealed`). FORGIVEN (إبراء) appears as a "first-class state" in C4 but is absent from S5.
- **Why it matters:** This is *the* shared state machine; four files, three vocabularies. If the FSM is built (proposed-additions P2), it needs one canonical enum — and FORGIVEN matters for the borrower-release addition (P8).
- **Resolution (for contracts owner):** Declare **S5 the binding enum** (the file already says "read S1–S15 as the binding set"), explicitly map C4's names onto S5 (PENDING_CONSENT→the DRAFT→WITNESSED transition; FULFILLED→KEPT; DECLINED/EXPIRED→VOID), and **decide whether FORGIVEN/إبراء is a state** (recommended: yes — it's needed for P8). Have tech/product cite S5.

### X7 — The trust signal: **numeric 0–100 score** (product) vs **"no number, 3-band"** (tech / S9). 🟠 SERIOUS
- **Loci:** product §3.8 → `score = clamp(50 + Σweights, 0..100)` (a number); tech §3.6 → "a **3-band qualitative** signal … **never a number**"; **S9** → "Forbidden: **number/percentile**." Prototype → renders `%` (see [[gap-register]] G3).
- **Contradiction:** The product layer *defines* a 0–100 score (then says it's displayed as a count); the tech layer and the binding S9 forbid any number; the prototype shows a percentage. Three different positions on the *same* signal — and one of them (S9) is binding.
- **Why it matters:** The "structurally incapable of being a credit score" claim is load-bearing for both the Shariah/SAMA story and the Data criterion. The spec must not contain a 0–100 score, and the prototype must not show `%`.
- **Resolution:** Make S9 binding everywhere: **no internal 0–100 score** (or if one is computed, never surfaced and never persisted as a number); display = 3-band qualitative only. Reconcile product §3.8 down to S9; fix the prototype per P1.

---

## C. Citation drift (counsel-pending or stale sources)

### X8 — "Evidence Law in force 23 June 2022" — flagged wrong, still in the tech layer. 🟠 MODERATE
- **Loci:** `Agent-2/layer-tech-security.md` §3.1 (*"Saudi Evidence Law (in force 23 June 2022)"*) and §5 (*"in force 23 Jun 2022"*).
- **Contradiction:** The consistency sweep corrected Agent-1 §5 to **"in force 7 July 2022"** (published 7 Jan 2022; 180-day vacatio) and flagged "23 June" as unsupported — but only fixed Agent-1. The tech layer still says 23 June in two places. The dossier/contracts use 7 Jul; product §3.5 uses 8 Jul. So the in-force date now appears as **23 Jun / 7 Jul / 8 Jul** across files.
- **Resolution (for Agent-2 owner + a date-standardisation pass):** Change the tech layer to "in force ~7 July 2022 (counsel to confirm 7 vs 8)" and pick one form project-wide (the sweep recommends 7–8 July).

### X9 — "unequivocally clear and devoid of doubt" presented as **statute**, is law-firm **commentary** (ledger C5). 🟠 MODERATE
- **Loci:** `Agent-2/layer-tech-security.md` §3.1 (*"…admits digital records/signatures when integrity is demonstrable and the evidence is 'unequivocally clear and devoid of doubt'"*) and §5 (same phrase as the standard).
- **Contradiction:** Ledger **C5**: that phrase is **Al Tamimi commentary, not statutory text** — cite **ETL Art. 8 (integrity) imported by M/43 Art. 57 + Arts. 55–59** instead. The dossier/S2 use the statutory citation; the tech layer still quotes the commentary as if it were the law.
- **Resolution (for Agent-2 owner):** Replace the quoted "standard" with the statutory citation map from S2; keep the law-firm phrase only as attributed commentary if at all.

### X10 — ETL decree number **M/8 vs M/18** (genuine source disagreement). 🟡 MINOR (counsel item, already flagged)
- **Loci:** contracts C7, legal §5 (now carry the "M/18 per BoE; M/8 per MCIT/WIPO — confirm w/ counsel" note); objection-killer A.#2 still says "ETL 2007 **M/8**" plainly; legal §3.1 ASCII diagram still shows "(M/8)".
- **Status:** This is a *real* documented source disagreement (BoE laws.boe.gov.sa = M/18; MCIT/WIPO = M/8), already flagged honestly for counsel by the sweep and the fixup. Not an error to "fix," but the **objection-killer and the legal §3.1 diagram** still use the bare "M/8" without the variant note.
- **Resolution:** Add the same "(M/8 per MCIT/WIPO; M/18 per BoE — counsel to confirm)" note to objection-killer A.#2 and the legal §3.1 diagram so every instance carries the flag, not just contracts/§5.

---

## D. Dangling / stale links & sources

### X11 — Dangling wikilink in the binding contract. 🟡 MINOR
- **Locus:** `08_Ahd_Deep/00_Shared/contracts.md` C6 (≈line 74): `(Proof: [[../Agent-2/layer-tech]].)` → the file is `layer-tech-security.md`. Flagged by the fixup log; still unfixed because the fixup author didn't own contracts.
- **Resolution (for contracts owner):** Change to `[[../Agent-2/layer-tech-security]]`.

### X12 — Dead source still cited: `staff4all.org` (404). 🟡 MINOR
- **Loci:** `Agent-3/layer-growth-adoption.md` §3.1 ("Nafath ~17.2M downloads, ~75% of adults — **staff4all/DGA, 2025**"), §5 proof note, and `business-case.md` §1 ("staff4all/DGA 2025").
- **Contradiction:** Ledger **C9** notes the claim's cited basis **staff4all.org → 404.** The Nafath-reach figure may still be defensible via DGA/OECD-OPSI, but the *cited* source is dead in three places.
- **Resolution (for Agent-3 / business-case owners):** Re-anchor the Nafath-reach figure to a live source (DGA / OECD-OPSI / a dated press item) and drop staff4all, or label it "(source pending re-confirmation)."

### X13 — Three demo scripts; the dossier's own §6 still uses the US-stat hook. 🟡 MINOR (consistency)
- **Loci:** `00_MASTER_DOSSIER.md` §6 (hook: *"Half of us never write it down. One in six lose a friendship over it"* — US framing) vs `09_Finish/FINAL/demo-v2.md` Beat 0 (KSA سند-لأمر anchor, which "supersedes" demo-3min) vs `Agent-4/demo-3min.md`.
- **Why it matters:** The dossier is the "fused thesis," yet its demo hook contradicts the superseding demo-v2 and the fixup's relabel-US-stats decision.
- **Resolution (for dossier owner):** Either point §6 at demo-v2 as the canonical live script, or update the §6 hook to the KSA anchor.

---

## E. Prototype ↔ docs contradictions (for the prototype owner, Claude-Orchestrator)
*(These are the build-vs-claim items; full detail and fixes are in [[gap-register]] A and [[proposed-additions]] T1. Listed here as consistency rows so the prototype owner has the cross-references.)*

| # | Doc says | Prototype does | Resolution |
|---|---|---|---|
| X14 | "Real (built): state machine" (dossier §9); FSM (product §3.2) | `step=0` slide counter; no `status`/events/fold | Build FSM (P2) **or** soften §9 to "specified; spine built" |
| X15 | "consented Muqassa" built (dossier §9, S8); "each member taps a consent card" (demo-v2 B5) | netting runs with no consent step | Build consent (P3) **or** drop "consented" from the built-claims until then |
| X16 | trust signal "3-band, no number" (S9, tech §3.6) | renders `%` per person | Remove `%` / 3-band it (P1) |
| X17 | riba-linter is the earned-badge proof (K5) | keyword-only; false-blocks "بلا فائدة" | Negation-handling (P4) |
| X18 | step 0 / hook = KSA anchor (demo-v2 B0; fixup relabel) | step 0 = unlabeled US stats | Update step 0 copy (P5) |

---

## Summary for the owners (who fixes what)
- **Agent-3 (growth) owner:** X1 (Musaned C10 — **highest**), X12 (staff4all).
- **Agent-4 (product) owner:** X2 ("exactly once" C15 — **highest**).
- **Agent-1 (legal) owner:** X3 (ETL Art. 14 — **high**), X4 ("minimum" netting).
- **Agent-2 (tech) owner:** X8 (date), X9 ("devoid of doubt" as statute).
- **Contracts owner / integrator:** X5 (ahd_id), X6 (state enum + FORGIVEN), X7 (trust-signal number), X10 (M/8 note everywhere), X11 (dangling link), X13 (dossier §6 demo hook).
- **Prototype owner (Claude-Orchestrator):** X14–X18 (build to match the docs, or have the docs match the build).

> The cheapest, highest-value half-hour the team can spend before the pitch is **X1, X2, X3** — three small text edits that remove three live, judge-catchable contradictions between the dossier (correct) and the layers it cites (still wrong).

---

## Addendum (2026-06-19) — the parallel 10_Deep/Arsenal lane *sharpens* X3, X4, X8, X10
A sibling lane (`10_Deep/Arsenal/`) independently re-grounded the legal citations and **agrees with the corrected forms**, which makes the source-layer outliers stand out more, not less:
- **X3 (ETL Art. 14 vs Art. 8):** Arsenal **L-2 = "Art.14 = signature equivalence; Art.8 = integrity"** — confirms the ledger's C1 and my flag. Now **three documents** (S2, verification-ledger, Arsenal L-2) say Art. 14, while **only the legal layer §3.1/§5 still says Art. 8.** The fix is unambiguous.
- **X10 (M/8 vs M/18):** Arsenal **L-2 resolves it: official = M/18 (27 Mar 2007 per laws.boe.gov.sa); M/8 = legacy/secondary variant.** So the "genuine source disagreement" can now be downgraded to "official M/18, with M/8 noted as a legacy citation" — the objection-killer A.#2 and legal §3.1 diagram bare-"M/8" should adopt this.
- **X4 (Muqassa "minimum"):** Arsenal rebuttal **E2** handles the counterexample correctly (🟢) — reinforcing that legal §4.2's "minimum transfer set" is the lone outlier.
- **X8 (Evidence-Law date):** Arsenal still has the date among its 🔴 counsel items — consistent with my flag; standardise project-wide.

**Net:** the Arsenal did *not* edit the source layers, so every X-row above still stands as a needed fix in `08_Ahd_Deep/**`. The Arsenal simply provides the **correct target text** to copy.

---
## Links
- [[full-review]] · [[gap-register]] · [[proposed-additions]]
- Audit trail: [[../../08_Ahd_Deep/00_Shared/verification-ledger]] · [[../../08_Ahd_Deep/00_Shared/consistency-sweep-Claude-Workflow]]
