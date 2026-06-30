# 🤝 HANDOFF #1 — Agent 2 (Lane 2: RegTech / Risk / Fraud)

**Date:** 2026-06-18 · **From:** Agent 2 · **Event:** AMAD 2026 hackathon (Alinma × Tuwaiq) · **Prize:** 1st = 250,000 SAR
**For:** the operator, or any future session/agent picking up this lane.

> Read this top-to-bottom and you can continue my work without re-deriving anything. Everything I produced is listed with exact paths.

---

## 1. Who I am / my mandate
I am **Agent 2**, owner of **Lane 2 — RegTech / Risk / Fraud** (Tracks **3** Financial Regulations + **1** GenAI; requirement combo **/02 AI + /01 Data**, champion also lands **/03 CX**). Job: produce winning-grade fintech concepts, judged against the 5 official criteria, red-teamed, documented, and pushed toward a buildable 72h demo. Four agents run in parallel, one per lane, into one shared Obsidian vault.

## 2. Status: what is DONE
- ✅ Phase 1 recon (12 live web searches, deep in lane) — fraud/AML/RegTech/open-banking terrain mapped + verified.
- ✅ Phase 2 diverge — 20 raw concepts.
- ✅ Phase 3 converge — 3 finalists.
- ✅ Phase 4 validate & score — full A–K briefs for all 3.
- ✅ Phase 5 red team — champion attacked and crowned.
- ✅ Wildcard (out-of-lane).
- ✅ **Cross-agent portfolio synthesis + honest normalized re-judging** (after Agents 1/3/4 finalized).
- ✅ **Working interactive prototype** of the champion (built + JS syntax-validated).
- ✅ **Pitch package** (deck outline + 3-min script + judge Q&A) — the "deck" half of "demo + deck".
- ✅ Champion **v2 hardening** (fixed feasibility + data-story weaknesses, added ROI math).

## 3. My concepts at a glance
| Concept | What it is | Self-score | Normalized |
|---|---|---|---|
| 👑 **حصين Haseen** | In-app circuit breaker that stops an instant, irreversible **sarie** scam transfer **before the money leaves** (CoP name-match + scam classifier + GenAI Arabic interrogation). | 90 | **87** |
| رقيب Raqib | Open-banking **consent-fraud firewall** for the new licensed OB regime (consent-risk scoring + rogue-TPP detection). | 82 | — |
| بصيرة Baseera | GenAI **AML investigation copilot** + auto-drafts STR + auto-generates the mandatory **SAMA quarterly Counter-Fraud report**. | 81 | — |
| 🎴 درع Dir' (wildcard) | Pay-as-you-earn Shariah **micro-takaful** for gig workers (out-of-lane; insurance is untouched by the portfolio). | — | — |

**Champion one-liner:** *Haseen owns the human/APP-fraud layer that Mozn's back-office scoring structurally can't touch, operationalizes the SAMA Counter-Fraud Requirements (mandatory 13 Apr 2026), and is Shariah-affirmative (hifz al-mal).*

## 4. File map (exact paths)
**Vault root:** `Amad Obsidian Vault\AMAD-2026\`
- My lane: `02_Agent-2\research.md` · `raw-ideas.md` · `concept-haseen.md` · `concept-raqib.md` · `concept-baseera.md` · `champion.md` (incl. red-team + **v2 hardening addendum**) · `wildcard.md` · `pitch-haseen.md`
- Shared (append-only, do NOT overwrite other agents): `00_Coordination\lanes.md` · `00_Coordination\master-scoreboard.md` (incl. my **External-judge normalized ranking** block) · `01_Brief\hackathon-brief.md` · `01_Brief\saudi-fintech-terrain.md`
- My synthesis: `03_Synthesis\portfolio-synthesis.md`

**Prototype (project root, NOT vault):** `prototypes\haseen-demo.html` — single-file, offline, Arabic RTL. Open by double-clicking. Two scenarios: "سيناريو احتيال" (intercepted) and "تحويل اعتيادي" (passes cleanly). JS syntax-validated (Node, clean). **Not yet driven in a live browser — verify + screenshot is a pending next step.**

**Source dossier:** `AMAD_HACKATHON_2026_FULL_DOSSIER.md` (project root).

## 5. Honest portfolio state (all four lanes)
After normalizing the inflated self-scores as an external judge, the top is a **near four-way tie**:

| Champion | Agent / Lane | Normalized |
|---|---|---|
| تدفّق Tadfuq (OB×ZATCA cash-flow credit) | 1 / OB | **88** |
| رُشد Rushd (Shariah-conscience co-pilot) | 3 / GenAI CX | **88** |
| حصين Haseen (scam interceptor) | 2 / RegTech | **87** |
| نَماء Namaa (halal savings game) | 4 / Gamification | **86** |

**Key truths:**
- The flat rubric does **not** crown a winner. The 3-min-pitch objective does: demo-wow favors Haseen/Namaa; uncopyable moat favors Rushd/Namaa; hard-money feasibility favors Tadfuq/Namaa.
- **Agent 3 adopted my calibration** and a **cross-agent flagship emerged: "Tadfuq-inside-Rizq" (~88)** — Agent 1's credit engine inside Agent 3's freelancer CX front-end. This matches the platform thesis below.
- **Platform thesis (my synthesis):** the four concepts are pillars of one AI-native Islamic-banking layer — **Know** (Rushd) · **Protect** (Haseen) · **Grow** (Namaa) · **Fund** (Tadfuq). Build ONE pillar deep for 72h; the pitch can close on the platform vision.

## 6. Key decisions + rationale (so you don't re-litigate)
1. **Champion = Haseen, not Raqib/Baseera.** Most visceral demo, most differentiated from Mozn, strongest "only-now + Alinma-ships-it." Baseera overlaps Mozn's agentic-investigation; Raqib's consent-fraud is less visceral.
2. **Do NOT rebuild Mozn/FOCAL** (sanctions screening, transaction scoring, network analysis). That fails the differentiation gate. White space = the consumer/human layer.
3. **Wildcard pivoted** jam'iyyah → micro-takaful, because jam'iyyah collides with Hakbah (1.3M users) AND Agent 4's savings lane. Insurance/takaful is unclaimed.
4. **Production GenAI model = ALLaM via IBM watsonx** (Alinma's actual stack; Arabic-native), per cross-agent intel.
5. **Honest re-scoring:** I dropped my own Haseen hardest (90→86, then 87 after hardening). Good faith signal; the self-scores across all lanes were inflated.

## 7. Coordination notes (IMPORTANT for a future agent)
- ⚠️ **The vault has TWO folder trees.** Agents 1 & 3 wrote under root `02_Agent-N\`; Agents 2 & 4 under `AMAD-2026\02_Agent-N\`. Shared coordination files exist in BOTH trees (partially cross-contaminated). Obsidian wikilinks resolve globally. **A final synthesis must reconcile the two trees** — do not try to "fix" by moving others' files (collision risk).
- **Append, never overwrite** shared files. I appended my claims/scores; others did too.
- De-confliction confirmed: Haseen (fraud) has **no collision** with Rushd (CX), Namaa (gamification), or Tadfuq (credit). My finalist Raqib mildly overlaps OB (Lane 1) but is not my champion.

## 8. Open questions — validate at enrichment (5–16 Jul)
- **14 Jul (Fintech Saudi):** Is **Confirmation of Payee** / **APP-reimbursement** on SAMA's roadmap? Either answer strengthens Haseen.
- **12–13 Jul (AI-UX / Data sessions):** Does the Alinma OB sandbox expose beneficiary-name data for an on-us CoP demo? Is **ALLaM via watsonx** the sanctioned model path inside Alinma? Any labeled APP-scam/mule data to train on?
- **Shariah-board read:** confirm fraud-interception friction is unambiguously *hifz al-mal* (it is) to pre-empt "you're delaying my halal transaction."
- **15 Jul (pitch craft):** rehearse the 3-min script.

## 9. Next actions (prioritized, for whoever continues)
1. **Drive `prototypes\haseen-demo.html` in a real browser + screenshot** (true visual verification; currently only syntax-validated).
2. **Write the "Protect pillar" integration spec** — how Haseen plugs into the emerging Tadfuq-inside-Rizq flagship (the portfolio's best single shot).
3. **Render the deck** (`pitch-haseen.md`) as an actual slide file, or build prototypes for Raqib/Baseera to the same bar.
4. **Adversarial judge dry-run** against the 3-min script; tighten.
5. If registering: lock the team (3–5) and submit the initial idea **before 26 Jun 2026** (hard gate).

## 10. The five facts that win the Haseen pitch (memorize)
1. KSA APP-scam losses **~$81.5M**; sarie is **instant + irreversible**.
2. **No Confirmation of Payee exists in KSA** (UK runs 2B+/yr). sarie confirms account details, not the payee name.
3. **SAMA Counter-Fraud Requirements mandatory 13 Apr 2026** (real-time monitoring + customer warnings) — Alinma must do this anyway.
4. **Mozn scores the back office** and can't stop a transfer the legitimate customer authorized — Haseen owns the moment of authorization.
5. **Intra-Alinma CoP ships next quarter** on Alinma's own core (zero new infrastructure); cross-bank is v2 when the registry lands.

---
*Handoff #1 by Agent 2. Next handoff → `handoffs\handoff-2.md`.*
