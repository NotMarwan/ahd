---
title: "Ahd — Full Reviewer · Proposed Additions (substance / logic / back-end only)"
tags: [ahd, review, additions, 10_Deep, agent/Claude-C]
updated: 2026-06-19
status: DONE
reviewer: Claude-C
note: "These are SUBSTANCE additions — new mechanisms, modules, defenses, data angles, logic, arguments. NOT visual/layout. Ranked by impact; each gives need · depth/strength added · where it slots · build difficulty · demo-now/v2."
---

# ➕ PROPOSED ADDITIONS — what would make Ahd materially stronger

> Ranked by **impact** (does it move a judging criterion or close a round-decider?), with a secondary read on **effort**. The first cluster is "make the prototype tell the truth about itself" — each of these *simultaneously* closes a build gap ([[gap-register]]), a consistency gap ([[consistency-report]]), and a red-team hole, which is why they rank highest. The second cluster deepens the case. Difficulty: **Low** (hours) · **Medium** (≤1 day) · **High** (multi-day / external).

---

## TIER 1 — highest impact (build-now; each closes a gap + a claim + a red-team hit)

### P1 — Make the trust signal a **computed 3-band qualitative** mirror; kill the `%` rings. ⭐ HIGHEST
- **Need:** The prototype renders a numeric `%` over each friend (G3) — violating S9 ("no number/percentile"), tech §3.6 ("never a number"), and consumer C8; and the signal is a **hardcoded table** (G5), not the "genuine computation" the Data case claims.
- **Depth/strength added:** Converts the *single most self-contradicting* surface into a defensible one. It defuses K13/S9 *on screen* (a judge can no longer point at a per-person score), and turns a literal into a real fold once it reads from the event log (P2). One change fixes a UX wound, a Data overclaim, and a written-contract violation.
- **Where it slots:** `nodeSVG()` (drop the `%` text; show a self-facing 🌿/—/⚠ band) + tech §3.6 / product §3.8 (reconcile the 0–100 `clamp` down to the 3-band spec).
- **Difficulty:** Low. **Demo-now.**

### P2 — Build the **real event-sourced state machine** + a seeded DEFAULTED and DISPUTED ahd. ⭐ HIGHEST
- **Need:** The FSM is markdown-only; the prototype is a `step` counter (G1). Dossier §9 lists it as "Real (built)" — false. K20 ("show me a defaulted/disputed agreement — one click") has no backing.
- **Depth/strength added:** Directly answers the red-team A3 ratio attack ("the depth is in markdown, not code") with running code; makes "status = fold(events)" demonstrable; unlocks K20 live; and gives P5/P10/P11 a substrate (events to fold). This is the highest-leverage *technical-implementation* (20%) addition.
- **Where it slots:** Prototype core — add an append-only `events[]` per ahd + a `fold(events)→status` function; seed `AHD-002` (DEFAULTED-then-cured) and `AHD-003` (DISPUTED→export) per product §3.11.
- **Difficulty:** Medium. **Demo-now** (it is the thing that makes "state machine" true).

### P3 — Add the **per-member consent step** to Muqassa (consented novation). ⭐ HIGH
- **Need:** `runMuqassa()` nets and displays with no consent (G2); "consented Muqassa" is claimed built and demo-v2 narrates consent cards that don't exist.
- **Depth/strength added:** Restores the **fiqh/legal validity keystone** of netting (each leg = a consented hawala/novation). Without it, the netting is the "you net debts between strangers" attack; with it, it is a witnessed *ahd-of-ahds*. Real-world feasibility (25%) + the Data wow's legitimacy.
- **Where it slots:** Between the "before" and "after" graphs in step 4 — a one-tap consent card per affected party; only on all-consent does the "after" commit; a decline → bilateral fallback.
- **Difficulty:** Low–Medium. **Demo-now.**

### P4 — Harden the **riba-linter against negation** (semantic-ish, false-positive-proof). ⭐ HIGH
- **Need:** The linter is keyword-presence (G4): "بلا فائدة / دون زيادة / بلا غرامة" → wrongly BLOCKED. The centerpiece can be made to fail live.
- **Depth/strength added:** Removes a *demonstrable own-goal* on the strongest Shariah moment. Makes the "earned badge" genuinely robust — a judge typing a halal-with-negation clause now correctly passes, which is a *stronger* proof than the current happy-path.
- **Where it slots:** `ribaScan` — detect a negator (`بلا|دون|بدون|عدم|لا|ليس`) immediately preceding the keyword → treat as clean; only flag *asserted* increases/penalties. Add 2–3 of these as the new stage chips (a halal clause that *survives*).
- **Difficulty:** Low. **Demo-now.**

### P5 — Update **step 0 to the KSA demand anchor** + label all illustrative figures. ⭐ HIGH
- **Need:** Step 0 shows unlabeled US stats (G7), contradicting the fixup relabeling and demo-v2 Beat 0; it re-commits red-team A1 on the opening screen.
- **Depth/strength added:** Aligns the *running artifact* with the strongest demand framing (سند-لأمر ubiquity + 43M Najiz e-services + the documentation *habit*), so the first impression is a KSA fact, not an American statistic. Converges the prototype with demo-v2 (G15).
- **Where it slots:** `R[0]` copy — lead with the KSA anchor; keep any US figure only as a labeled "تقدير توضيحي (بيانات سعودية قيد التحقّق)."
- **Difficulty:** Low. **Demo-now.**

---

## TIER 2 — high impact (the round-deciders; mostly non-code, mostly pre-pitch)

### P6 — A **primary-demand artifact** (the one thing the ledger never tested). ⭐ HIGHEST-by-stakes
- **Need:** Red-team A1 / G8. **UPDATE:** the parallel 10_Deep/Arsenal lane has already built the *macro/structural* demand pack ([[../Arsenal/demand-evidence-ksa]]: سند-لأمر = 58.6% of execution-court requests, Nafith 800k digital سند, etc.) — so A1's "documentation demand" half is now KSA-primary. **What still remains** is the *relational-strain* shard (D-9): one piece of real KSA voice that people *lose relationships over undocumented loans* and would welcome a warm, fair instrument.
- **Depth/strength added:** *One* real Saudi voice on the warmth axis beats the remaining US relational stat (D-8). Converts the last 🔴 in the demand story into 🟢. Pairs the Arsenal's hard numbers with a human quote.
- **Where it slots:** The "who asked for this" deck beat (alongside the Arsenal numbers) + a one-line on-screen quote in the demo hook. Sources: 15–20 informal interviews; Arabic Splitwise/wallet App-Store complaint mining; a tiny survey (the Arsenal's §5 primary-data plan).
- **Difficulty:** Low effort, real-world (not code). **Pre-pitch.**

### P7 — A **firm-specific Al-Rajhi answer with a concrete wedge**, not a narrative. ⭐ HIGH
- **Need:** A2 (FATAL) / G9 — the moat is religious-category, shared by Al Rajhi; the current "answer" is a plan.
- **Depth/strength added:** Turns the fatal "why you" into a reason to move. Three substance moves: (a) name a *real* Alinma-specific wedge (e.g. its digital/SME positioning or speed-to-Sandbox); (b) make **circle network-lock-in a demonstrable product property** — show that moving a circle means moving *everyone's* covenants (a real switching cost a fast-follower can't instantly copy); (c) sketch one realistic exclusive distribution path (HRSD/Musaned wage-covenant or a property-manager rent pilot) and say "category land-grab — move now *because* Al Rajhi will otherwise."
- **Where it slots:** business-case §5 + demo-v2 Beat 6 close + a circle-lock-in micro-demo in step 4.
- **Difficulty:** Medium (strategy + a small product demo). **Demo-now for (b); pre-pitch for (a)/(c).**

### P8 — Make **«براءة الذمة» a borrower-invokable release**, and surface the borrower's protections as *their* dashboard. ⭐ HIGH
- **Need:** Red-team A11 — the borrower's reason to sign is thin/free-able; ذِمّة محفوظة is a lender-only UI state, zero-riba is a term not an enforceable right, "witnessed settlement" is reproducible with a screenshot.
- **Depth/strength added:** Gives the *growth-critical second side* a standalone reason: a borrower can **request** a discharge (إبراء) the lender signs, producing a real release the borrower holds; a borrower-facing panel shows "your protections: no interest, no penalty, mandated grace, a clean kept-word receipt." Strengthens the honest k (if the borrower's reason is real, k≈0.36 is conservative, not optimistic).
- **Where it slots:** FSM (a FORGIVEN/DISCHARGED event the borrower can initiate) + a borrower view; growth §3.2 incentive list.
- **Difficulty:** Low–Medium. **Demo-now (pairs with P2).**

### P9 — Build the **يُسر / grace beat as real state logic** (not narrated). ⭐ HIGH
- **Need:** Consumer C2 / red-team A10 / G-RT2 — the default→ease path is the deepest "has my back" beat and the seal for A10, but it's unbuilt; today's settle screen always pays perfectly.
- **Depth/strength added:** Seals A10 *in the build*, not just in design: tap `🌿 أحتاج وقت` → the remaining installments **re-spread with the integer-remainder invariant preserved**, **no penalty appears**, state → **«مؤجّل بالتراضي»** (never «متأخر»). It is simultaneously the warmest CX beat (Track 2) and a *correctness* demonstration (the schedule still sums to principal exactly).
- **Where it slots:** Settle step + the FSM (a `RESCHEDULE` event) + the deterministic `buildSchedule` remainder logic already specified in product §3.4.
- **Difficulty:** Medium. **Demo-now (it is demo-v2 Beat 4).**

---

## TIER 3 — solid depth (build if hours remain / v2)

### P10 — Complete the **SEAL** to a true multi-block chain + labeled RFC-3161 + bank-sig. 🟢 MEDIUM
- **Need:** The prototype SEAL is ~3/5 properties; "hash-chain" is a single link (G6).
- **Depth/strength added:** Makes "append-only hash-chain" literally true (chain ≥2 ahds + a signed checkpoint); adds the two missing court-needs (time via a labeled mock TSA token; non-repudiation via a `bank_sig` field) **into the canonical bytes and the verifier**, so tampering any of them also fails. Defuses red-team A3/A4 for the technical judge.
- **Where it slots:** `SEALED` object → an array of blocks; `recomputeSeal` → verify the chain; add `tsa_token` + `bank_sig` to `canonical()`.
- **Difficulty:** Medium. **Demo-now if time; else v2.**

### P11 — A **coercion/duress mechanism** in the data model (threat T1 made real). 🟢 MEDIUM
- **Need:** The dominant adversary is the insider party; the T1 defense (cooling-off + "signed under pressure" flag → Taradhi) is design-only (G12).
- **Depth/strength added:** Lets the demo *show* "the bank attests the event, never voluntariness" with a real flag and a cooling-off state — security depth a SAMA/threat-model judge probes. Reinforces the attestation-boundary claim with a built affordance.
- **Where it slots:** `consent` schema (`signed_under_pressure:bool`) + a cooling-off state in the FSM + a route-to-DISPUTED.
- **Difficulty:** Low–Medium. **v2.**

### P12 — A **deterministic dispute-export bundle** (the JSON + Arabic PDF stub), as a real button. 🟢 MEDIUM
- **Need:** Product §3.7 specifies the export; it is not in the prototype. K20/S13 ("record-keeper, not adjudicator; export to Najiz/Taradhi") would be *shown*, not asserted.
- **Depth/strength added:** Embodies "our role ends at producing admissible evidence." Pairs with P2's DISPUTED seed — one click produces the bundle (header + event log + chain root + signing events + integrity proof).
- **Where it slots:** A DISPUTED→ESCALATED action in the FSM that serialises the (now-real) event log.
- **Difficulty:** Medium. **v2 (Low if P2 done).**

### P13 — A **recurring-covenant object** demonstrated (salary/rent), not just a `type` flag. 🟢 MEDIUM
- **Need:** Retention (the 4→18 events/yr argument) and the Musaned/flatmate beachhead rest on recurring covenants; the prototype only shows a one-off 5-installment loan.
- **Depth/strength added:** Makes the *retention* and *beachhead* claims tangible — a monthly salary/rent covenant that generates repeated settlement touchpoints. Supports the business-case projection's recurring-hook assumption with a visible mechanism.
- **Where it slots:** A seeded recurring ahd (`AHD-004`) + a "this month's payment kept" touchpoint.
- **Difficulty:** Medium. **v2.**

### P14 — An **AML / Muqassa-collusion signal** stub (threat T4/T5 made visible). 🟢 LOW-MED
- **Need:** Threat model T4/T5 (money-muling, fake circular IOUs to wash funds/inflate trust) is design-only.
- **Depth/strength added:** A small "this net-zero ring moved no real cash → flagged" indicator shows the relationship graph *is* an AML signal — answers a SAMA examiner's "how is this not a laundering rail?" with a built check.
- **Where it slots:** A flag in the netting result when a ring nets to ~0 with no settlement legs.
- **Difficulty:** Low–Medium. **v2.**

### P15 — A one-screen **"what Alinma actually attests"** panel (the boundary, on-screen). 🟢 LOW
- **Need:** S6's attestation boundary (the four things the bank refuses to vouch for) is the kill-line answer to "so the bank is liable" — but it lives only in prose.
- **Depth/strength added:** Showing the boundary *in the record* ("attests: these two identities sealed these bytes at this time; does NOT attest: cash moved / fairness / voluntariness / underlying truth") makes the liability defense tangible and pre-empts the question.
- **Where it slots:** The witnessed-record card (step 2) — a compact "يشهد / لا يشهد" block.
- **Difficulty:** Low. **Demo-now.**

---

## Impact × effort summary (read top-down)

| # | Addition | Impact | Effort | When | Closes |
|---|---|---|---|---|---|
| P1 | Computed 3-band trust signal; kill `%` | ⭐⭐⭐ | Low | now | G3, G5, S9, C8 |
| P2 | Real FSM + DEFAULTED/DISPUTED seed | ⭐⭐⭐ | Med | now | G1, A3, K20 |
| P3 | Muqassa per-member consent | ⭐⭐⭐ | Low–Med | now | G2, fiqh validity |
| P4 | Negation-proof riba-linter | ⭐⭐⭐ | Low | now | G4 (live own-goal) |
| P5 | KSA anchor on step 0 | ⭐⭐ | Low | now | G7, A1-on-screen |
| P6 | Primary demand artifact | ⭐⭐⭐ (stakes) | Low (research) | pre-pitch | A1/G8 (#1 open) |
| P7 | Concrete Al-Rajhi wedge + circle lock-in | ⭐⭐⭐ | Med | now/pre-pitch | A2/G9 (FATAL) |
| P8 | Borrower-invokable براءة الذمة | ⭐⭐ | Low–Med | now | A11/G-RT |
| P9 | يُسر grace as real state | ⭐⭐ | Med | now | A10/C2/G-RT2 |
| P10 | Complete the SEAL (chain≥2, TSA, bank-sig) | ⭐⭐ | Med | now/v2 | G6, A3/A4 |
| P11 | Coercion/duress flag | ⭐ | Low–Med | v2 | G12, T1 |
| P12 | Dispute-export bundle button | ⭐ | Med | v2 | S13, K20 |
| P13 | Recurring-covenant object | ⭐ | Med | v2 | retention/beachhead |
| P14 | AML / collusion signal stub | ⭐ | Low–Med | v2 | T4/T5 |
| P15 | On-screen attestation boundary | ⭐ | Low | now | S6 liability defense |

**If the team can do only five before the build:** P1, P2, P3, P4, P5 — they make the prototype *truthful about itself* and convert three red-team partials into running code, for ~1.5–2 build-days. **If only two before the pitch (non-code):** P6 (the remaining demand shard) + P7 (Al Rajhi) — the two round-deciders.

---

## Addendum (2026-06-19) — relation to the parallel 10_Deep/Arsenal lane
The Arsenal lane already delivers the *evidence/argument* additions (the KSA demand pack, the market arsenal, the counsel-grade legal/Shariah citations, and the A2 concede-then-wedge rebuttal). So **P6 and P7 here are now mostly "adopt + extend the Arsenal," not "build from zero."** Everything in **Tier 1 (P1–P5)** and the build-depth tiers (**P8–P15**) is *additive to* the Arsenal — they are **back-end / prototype** mechanisms the Arsenal (a documents lane) does not touch. The highest unique value of this Review remains making the **running prototype** match its own claims (P1–P4) and giving the second side a real reason to sign (P8) + a built grace path (P9).

---
## Links
- [[full-review]] · [[gap-register]] · [[consistency-report]]
- Parallel lane: [[../Arsenal/ARSENAL-INDEX]]
