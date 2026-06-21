---
title: "Ahd — Full Reviewer · Gap Register"
tags: [ahd, review, gaps, 10_Deep, agent/Claude-C]
updated: 2026-06-19
status: DONE
reviewer: Claude-C
severity_key: "FATAL = loses the round / breaks the thesis · SERIOUS = a panelist lands a real hit, needs an answer · COSMETIC = polish"
---

# 🕳️ GAP REGISTER — every gap, severity, why it matters, suggested fix

> A review that finds nothing is a failed review. Below are the gaps I found on a cold read, grouped by category. Each: **what it is · why it matters (which review/criterion it threatens) · severity · suggested fix.** I flag; I do not edit other owners' files. Consistency-only items (stale citations, dangling links, drift) are itemised separately in [[consistency-report]]; this register focuses on substance + the red-team "sealed-that-isn't" cross-check.
>
> **Count:** 7 SERIOUS-or-worse build/logic gaps · 6 SERIOUS grounding/economics gaps · 5 red-team cross-check flags · plus the consistency set in [[consistency-report]]. None fatal-and-unfixable.

---

## A. Logic / build correctness (the prototype's code vs the docs' claims)

### G1 — The event-sourced state machine is described but **not built**. 🔴 SERIOUS
- **What:** Product layer §3.2 + dossier §9 ("Real (built): data model + state machine") describe a `fold(events)` FSM (DRAFT→WITNESSED→ACTIVE→SETTLING→KEPT | DEFAULTED | DISPUTED → ESCALATED | VOID). The prototype implements navigation as `let step=0; const TOTAL=5` — a **slide counter**. `AG` has no `status`, no event log, no fold, no DEFAULTED/DISPUTED. This is the *exact* flaw the product audit (§1) said it had closed.
- **Why it matters:** Technical-implementation (20%) + the red-team A3 ratio attack ("the depth is in markdown, not code"). It also leaves **K20 ("show me a defaulted/disputed agreement — one seeded click") with no backing in the running artifact** — a judge who asks cannot be shown it.
- **Fix:** Either (a) build a minimal real FSM with a seeded DEFAULTED + DISPUTED ahd that folds from events (see [[proposed-additions]] #2), or (b) downgrade dossier §9 / product §3.2 from "Real (built)" to "specified; prototype demonstrates the spine (hash-chain + settle + netting)."

### G2 — Muqassa runs **without the consent step** the fiqh argument depends on. 🔴 SERIOUS
- **What:** `runMuqassa()` computes the netting and shows the conservation table — there is **no per-member consent card / Nafath approval** before the (simulated) settlement. Yet "consented Muqassa" is claimed as built (dossier §9, S8, product §3.6b), and demo-v2 Beat 5 narrates "each member taps a consent card."
- **Why it matters:** The consent is the **legal/Shariah validity keystone of netting** — without it you are "netting debts between people who never agreed" (objection-killer's own listed attack; the answer is "opt-in, Nafath-consented per member"). A Shariah/legal judge asks this; the demo would narrate a consent that the code does not perform. Real-world feasibility (25%) + Data wow integrity.
- **Fix:** Add the one-tap consent card per affected party before the "after" graph commits (see [[proposed-additions]] #3). Low–medium build.

### G3 — The reputation rings render a numeric **`%`** — violating the trust-signal contract. 🔴 SERIOUS
- **What:** `nodeSVG()` line 347 draws `${Math.round(ratio*100)}%` over **each friend's head**. The binding contract S9 says **"Forbidden: number/percentile"**; tech §3.6 says **"never a number"**; consumer C8, demo-v2 (C8), and embrace-additions #8 all say **drop the % rings.** None of that reached the code.
- **Why it matters:** The product's signature compliance claim is *"structurally incapable of being a credit score."* The running prototype displays exactly a numeric per-person score (87%, 92%…). A judge can point at the screen and refute K13/S9 live. UX (15%) + Data (20%) + the "not a credit score" legal promise, all at once. (Consumer-soul flagged the *feeling*; the deeper point is it **breaks a written contract**.)
- **Fix:** Replace the % with a 3-band qualitative glyph (🌿/—/⚠) shown self-facing only; or remove ring labels entirely. Low build, high payoff (see [[proposed-additions]] #1).

### G4 — The riba-linter is **keyword-presence**, so it false-blocks benign negated clauses. 🔴 SERIOUS
- **What:** `ribaScan` flags any text containing `فائدة|ربا|غرامة|نسبة|٪|عمولة|زيادة|ربح`. It cannot distinguish **"فائدة" (interest, bad)** from **"بلا فائدة / دون زيادة / بلا غرامة" (no interest / without increase — halal reassurance).** Typing a perfectly halal clause that *names* the prohibited thing in order to *negate* it → wrongly **BLOCKED**. (Note: the seeded `terms_ar` itself contains "دون أيّ زيادة أو فائدة… غرامة تأخير" — it would fail its own linter if scanned.)
- **Why it matters:** This is the **single strongest Shariah moment** in the demo ("watch it refuse a haram term"). A sharp judge does the inverse — types a halal clause with a negation — and the centerpiece **fails on stage**, turning the proof point into an own-goal. Innovation + Technical + Shariah credibility.
- **Fix:** Add negation handling (a leading `بلا|دون|بدون|عدم|لا` within N chars flips to clean) and only flag *asserted increases*; or constrain the linter to structured fields, not free text. Low build (see [[proposed-additions]] #4).

### G5 — The trust signal is a **hardcoded table**, not "genuine windowed computation." 🟠 SERIOUS
- **What:** `REP = {"نورة":[12,12], …}` is a static seed; the ring is `kept/total` of those constants. Dossier §4.2 and tech §3.6 sell it as "the /01 Data depth as **genuine computation**" / "a windowed, decayed ratio over the user's own sealed history."
- **Why it matters:** Part of the Data (20%) case rests on the trust signal being *computed*. As-built it is display data — if a judge asks "computed from what?", there is no event history behind it (compounding G1: there is no event log to compute from).
- **Fix:** Derive the kept-count from the (to-be-built) event log of the seeded ahds; even 4–5 seeded closed ahds per person makes it a real fold, not a literal. Pairs with G1 (see [[proposed-additions]] #1/#2).

### G6 — The "SEAL" in the prototype is **~3 of its 5 specified properties**. 🟠 SERIOUS
- **What:** Tech §3.1 specifies 5 properties (canonicalize **JCS/RFC-8785** → SHA-256 → **signer-bind Nafath assertions** → **RFC-3161 timestamp** → **chain + bank-sig + Merkle checkpoint**). The prototype implements: a **bespoke** canonical string (not JCS), SHA-256, consent `sig_ref`s embedded in the canonical bytes (a partial signer-bind), and a **single-block** chain (genesis→1). **Missing:** RFC-3161 token, an explicit bank signature over the envelope, the Merkle checkpoint, and any **multi-record** chain.
- **Why it matters:** The "tamper-evident, court-admissible" claim is the differentiator over a free Splitwise + a screenshot (red-team A4). "Hash-chain" implies ≥2 links; the artifact has one. A technical judge inspecting the code sees less than the SEAL diagram promises.
- **Fix:** Chain ≥2 ahd records + add a labeled mock RFC-3161 token and a `bank_sig` field into the canonical bytes & verifier (see [[proposed-additions]] #8/#9). Medium build. (Or state honestly that the prototype shows the integrity link and the rest are labeled seams.)

### G7 — Prototype **step 0 still shows unlabeled US stats**, contradicting the fixup + demo-v2. 🟠 SERIOUS
- **What:** Step 0 renders `~50% / 1 من 6 / ~30%` with no "US-illustrative · KSA pending" label. The fixup pass relabeled these in the dossier/layers and demo-v2 Beat 0 *replaces* them with the KSA سند-لأمر anchor — but the **running prototype's opening screen was not updated**.
- **Why it matters:** If the team runs the real prototype on stage, the **opening screen re-commits the exact sin the red-team's A1 names** (US stats presented as fact) and contradicts the new demo-v2 hook. First impression + the #1 open risk.
- **Fix:** Update step 0 to lead with the KSA anchor + label any illustrative figure (one-line copy change to match demo-v2 Beat 0). Low build.

---

## B. Data depth, legal/Shariah grounding, security

### G8 — Primary demand evidence (the red-team A1 void). 🟠 SERIOUS → now LARGELY CLOSED by the parallel Arsenal lane
- **What (as of the 08/09 docs I was asked to review):** Every demand stat in the dossier/layers/09_Finish was US-sourced or a scale proxy (remittances/sarie/Najiz). Nothing in *those* docs showed a *Saudi* wants a P2P loan **witnessed**.
- **UPDATE (parallel 10_Deep/Arsenal lane):** A sibling lane has since built **KSA-primary** demand evidence — promissory notes = **58.6% of 571,251 execution-court requests / SAR 115.4B over 11 months** (Argaam, 2020–21), Nafith **800k digital سند**, 43M+ Najiz e-services, SAMA's consumer-سند restriction (see [[../Arsenal/demand-evidence-ksa]] / [[../Arsenal/ARSENAL-INDEX]] D-1…D-7). **This substantially closes A1**: the *documentation demand* is now KSA-primary, not US-proxy. What remains 🔴 is the **relational-strain primary shard** (D-9: a KSA survey/interviews on "% who don't document / lost a relationship over money") — the Arsenal flags it honestly with a 3-tier primary-data plan.
- **Why it matters:** Still the foundation under Track-2 CX; now mostly evidenced. The residual is a *nice-to-have warmth proof*, not the existential void the red-team described.
- **Fix:** Adopt the Arsenal's demand pack into the deck; gather the one relational-strain shard (15–20 interviews / Arabic Splitwise complaints) to close D-9. (See [[proposed-additions]] #6.)

### G9 — The firm-specific moat (Al Rajhi, A2) is **aspirational**. 🔴 SERIOUS (round-decider)
- **What:** The differentiator is religious-category, shared by Al Rajhi/Albilad. The "answer" is a plan: own the name «عهد», lock an exclusive distribution partner (HRSD/Musaned or a property manager) that **does not yet exist**, and build circle network-lock-in.
- **Why it matters:** "Why you, not the bigger Islamic bank?" ends the round if unanswered. A plan is better than silence, but it is not a moat.
- **Fix:** Pick one *concrete, nameable* Alinma wedge and a realistic path to one exclusive partnership; demonstrate circle-lock-in as a real product property (see [[proposed-additions]] #7). The parallel Arsenal lane has a rehearsed **concede-then-wedge** A2 answer ([[../Arsenal/rebuttal-playbook]] A2), correctly graded 🟡 (contingent on execution) — use it, but it remains a *rebuttal*, not a realized moat.

### G10 — No costed acquisition engine behind the 3-yr projection. 🟠 SERIOUS
- **What:** business-case §4 seeds 150k→600k→1.8M with **no CAC, no named contracted channel, no budget**; the 1.57× multiplier is applied to a black-box seed.
- **Why it matters:** Feasibility (25%): "how do you get the first million, through what channel, at what cost?" has no answer. The float worked-example (~SAR 1.15M/yr at SAM) actually undercuts "float monetises the free layer."
- **Fix:** State a pilot CAC, a named first channel (the A2 partnership), and lead the economics with deposit-primacy not float (business-case already half-admits this — make it explicit).

### G11 — Nafath/TSP **permission** to witness a private interpersonal debt is assumed (A9). 🟠 SERIOUS
- **What:** C9/C14 verified the *mechanics* (Nafath=auth, emdha=signature). Nobody verified SDAIA/the TSP would *approve* issuing AES for a friend-loan acknowledgment — a novel, non-institutional purpose.
- **Why it matters:** A Nafath/NCDC integration reviewer's first question. The whole identity spine depends on it.
- **Fix:** Name it as a pre-production validation item (go-no-go already does, at P2 — keep it and never assert the permission on stage).

### G12 — Coercion/duress (threat T1) is design-only; not in the data model or prototype. 🟡 COSMETIC→SERIOUS
- **What:** The threat model's dominant adversary is the *insider party*; T1 (coercion) is mitigated by "a cooling-off window + an 'I signed under pressure' flag → routes to Taradhi." None of that exists in the schema or the prototype.
- **Why it matters:** For an *evidence* product whose dominant adversary is an insider, "the bank attests the event, never voluntariness" is the right posture — but the **mechanism that makes that safe (the duress flag + cooling-off)** is unbuilt. A security judge probes it.
- **Fix:** Add a `signed_under_pressure` flag + a cooling-off state to the (to-be-built) FSM (see [[proposed-additions]] #11). Low build.

### G13 — Tourist/non-resident scope honestly cut, but the **demo never says it**. 🟡 COSMETIC
- **What:** Growth is correctly re-scoped to ~35M Nafath-eligible residents (C4); tourists cap at T1. Right call, but the demo/dossier hero ("money between people") still reads universal.
- **Why it matters:** Minor — only if a judge probes "what about the 30M pilgrims/year?" Have the one-line answer ready ("scoped to Nafath-eligible residents; tourist tier is a thin fallback").
- **Fix:** One reassurance line in the deck appendix.

### G14 — "30% never repay" still asserted as a flat figure in places. 🟡 COSMETIC
- **What:** Growth §3.2 and prototype step 0 use "≈30% never fully repay"; the dossier residual #7 and the salvage note say handle as a **range** (32% / 47–73%). Already labeled US-illustrative in most places, but the single-number form persists.
- **Why it matters:** Low — a stats-savvy judge could nitpick a precise % from a US survey presented near KSA framing.
- **Fix:** Use the range or drop the number; lead with the KSA anchors (already the agreed posture).

---

## C. Demo logic

### G15 — demo-v2 describes a prototype that **doesn't fully exist yet**. 🟠 SERIOUS
- **What:** demo-v2's wow beats assume **C1 gift-receipt screen** (Beat 2), **C2 يُسر safety net** (Beat 4), **no `%` rings** (Beat 5/C8), and the **KSA hook** (Beat 0) — none of which is in the current `index.html`. The fallback section honestly says "narrate over a static mock / keep single-device but flip the copy," so it degrades gracefully — but as written, demo-v2 cannot run end-to-end on today's build.
- **Why it matters:** If the team rehearses demo-v2 but ships today's prototype, Beats 0/2/4/5 mismatch what's on screen. UX + the whole "warmth" re-weight that the final-verdict says wins Track 2.
- **Fix:** Build C1 + C2 + the % removal + the step-0 copy (all in [[proposed-additions]], all demo-now) so the script and the artifact converge. This is exactly go-no-go's P0 #3 — keep it P0.

### G16 — Three competing demo scripts coexist. 🟡 COSMETIC (consistency)
- **What:** dossier §6 (7 beats, US-stat hook), Agent-4/demo-3min (the original), and demo-v2 (KSA hook, supersedes). dossier §6's hook still uses "Half of us never write it down. One in six lose a friendship" (US framing).
- **Why it matters:** A reader cross-referencing the dossier vs demo-v2 sees two different opening lines. Minor, but the dossier is the "fused thesis."
- **Fix:** Point dossier §6 at demo-v2 as the live script, or update the §6 hook to the KSA anchor. (Owner: dossier author — flagged, not edited.)

---

## D. Red-team "sealed-that-isn't" cross-check (the prompt asked for this explicitly)

### G-RT1 — A6 (initiator stigma) marked **SEALED**, but its seal (C1) is **unbuilt** and **unvalidated**. 🟠 SERIOUS
- final-verdict §1 marks A6 "SEALED by Consumer C1+C4+C3." But C1 is a *designed* screen (go-no-go P0 to build), and the seal is a **copy reframe** ("كل قرض صدقة") that the red-team's whole point was: *asserted to dissolve a bidirectional stigma, with no evidence it does.* **Status: addressed-in-design, not sealed.** Fix: build C1; ideally test the reframe on ≥1 real Saudi (ties to G8).

### G-RT2 — A10 (dunning vs warmth) marked **SEALED**, but C2 is **unbuilt** and the Najiz-export machinery still ships. 🟠 SERIOUS
- final-verdict marks A10 "SEALED by Consumer C2." C2 is unbuilt (go-no-go P0). And the reputational tension — *a warm bank that also arms courts with admissible evidence against kin* — is reframed in copy, but the **export-to-Najiz affordance remains**. **Status: addressed-in-design.** Fix: build C2's يُسر/grace path as real state logic so default→ease is shown, not just narrated (see [[proposed-additions]] #10).

### G-RT3 — A2 (Al Rajhi) marked **ANSWERED**, but the answer is a **plan to build** a moat. 🔴 (mislabeled severity-down)
- See G9. "ANSWERED here (§2)" overstates a strategy whose exclusive-partnership leg does not exist. Honestly re-listed as go-no-go P0, so the team isn't fooled — but the disposition word "ANSWERED" should read "answered with a strategy; the moat is to be built."

### G-RT4 — A3 (thin build) "partially mitigated" understates the gap. 🟠 SERIOUS
- The final-verdict's "the SHA-256 chain, the tamper-verifier, the netting and now the live riba-linter genuinely run" is **true** — but the same paragraph implicitly leans on dossier §9's "state machine (Real)," which is **not** built (G1), and on "consented Muqassa" (G2) and a "computed trust signal" (G5) that aren't either. **The running novelty is the four things named — and *only* those four.** Fix: be precise in the deck about what runs; build G1/G2 to make the list longer.

### G-RT5 — AGENT-2 DONE-line claims the سند-لأمر anchor "directly blunts A1." 🟡 COSMETIC (overstatement)
- The fixup itself is honest (it relabels US stats and adds KSA scale). But "blunts the demand-premise-unvalidated attack" overstates it — the red-team explicitly says re-sourcing *scale* is not *demand proof*. Fix: in any summary, frame the KSA anchors as "documentation *habit* + *scale* evidence," not "demand validation."

---

## E. Pointers to the consistency set
The following are **corrections that the verification ledger made but that never propagated to the source layers** — they are full-detailed with exact loci + resolutions in [[consistency-report]], because they are "two files say different things" issues rather than missing substance:
- C10 (Musaned "forces both sides") still live in growth §3.5/§3.7/§8 → **SERIOUS**.
- C15 ("each party settles exactly once") still live in product §7/§8 → **SERIOUS**.
- C1 (ETL Art. 14 vs Art. 8) still wrong in legal §3.1 → **SERIOUS**.
- C8/C15 ("minimum transfer set") still in legal §4.2 → **SERIOUS**.
- "in force 23 June 2022" + "unequivocally clear and devoid of doubt"-as-statute still in tech §3.1/§5 → **MODERATE**.
- `ahd_id` type (ULID vs UUIDv7 vs base32 vs the prototype's string) and the state-name vocabulary (C4 vs S5 vs tech vs product) disagree → **MODERATE**.
- Dangling link `contracts.md:74 [[../Agent-2/layer-tech]]` → **MINOR**.

---

## Addendum (2026-06-19) — reconciliation with the parallel 10_Deep/Arsenal lane
After writing the above I found a sibling lane, `10_Deep/Arsenal/` (exclusive owner: "Arsenal"), that post-dates 09_Finish and directly addresses two of my round-deciders:
- **G8 (demand)** — substantially closed by the Arsenal's KSA-primary demand pack (see updated G8 above).
- **G9 (Al Rajhi)** — has a rehearsed concede-then-wedge rebuttal (still 🟡).
- It also **independently confirms** my consistency findings X3 (ETL signature-equivalence = **Art. 14**, not Art. 8) and X10 (ETL decree resolved to **M/18** official) — which *sharpens* those flags: the **source legal layer is now the lone outlier** still carrying the wrong citations, while two 10_Deep files have it right.
My build/logic findings (G1–G7, G12) and consistency findings (X1–X18) are **unaffected** — they concern the source layers + the prototype, which the Arsenal did not modify.

---
## Links
- [[full-review]] · [[proposed-additions]] · [[consistency-report]]
- Parallel lane: [[../Arsenal/ARSENAL-INDEX]] · [[../Arsenal/demand-evidence-ksa]] · [[../Arsenal/rebuttal-playbook]]
