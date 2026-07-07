# JUDGE-LENS — the competitive gate · عدسة التحكيم

**Mission: 1st place at AMAD Hackathon 2026.** Judging **18 July 2026** — a pitch + live demo in front
of the panel at Tuwaiq Academy, Riyadh. 1st prize **250,000 SAR** (pool 500k: 250/150/100). ~**1000
competing projects**. «نصف مليون في انتظار الأفضل».

This file is the project's **fifth gate**. The four technical gate commands prove the product is
*correct*; this one asks whether it **wins**. Every session that touches anything a judge can see runs
its work through this lens before exiting. Being good is the entry fee — the bar is *unforgettable*.

## The five bars (from the published criteria — dossier §4)

| # | Criterion | First-place bar — the work is NOT done until… |
|---|---|---|
| 1 | **الابتكار والإبداع** — innovation | A judge who has seen 60 projects today says "I haven't seen this before" AND can retell it in one sentence: «البنك يشهد ولا يُقرض». |
| 2 | **التطبيق التقني** — technical | One live moment makes an engineer-judge nod: tamper a sealed record on stage; the seal catches it. Depth (1,200+ automated assertions, byte-determinism, integer halalas, offline-complete) is *stated in numbers, not narrated*. |
| 3 | **تحليل البيانات** — data analysis | A real dataset + insight narrative ON SCREEN: in-product analytics (netting compression, conservation proof, k-anonymous cohort aggregates) + the KSA market/court numbers from `docs/evidence/EVIDENCE-BRIEF.md`. **Never an individual's number, never a trust score — aggregates only** (spine). |
| 4 | **تجربة المستخدم** — UX | Every screen a judge can reach photographs like a shipped Saudi fintech product. Arabic-first RTL typography, motion that clarifies, zero unstyled corners. The demo path feels choreographed, not clicked-through. |
| 5 | **قابلية التنفيذ الفعلي** — feasibility | "Alinma could ship this": two-contract model, Shariah framing, integration path — with honest caveats. **Never assert unconfirmed approvals on stage** (OT-VAL/OT-CITE). |

## The memorability question

Every review ends by answering, in writing: **"Does this make a tired judge remember us an hour
later?"** If the honest answer is a shrug, the work is not done — find the moment, sharpen it.

## Judge-visibility rule

Effort is prioritized by what the panel experiences, in order:
**① the 3-minute pitch → ② the demo-path screens → ③ evidence/data shown on screen → ④ everything else.**
Internal excellence a judge cannot perceive is *maintenance*, not *progress*, until 18 July.
Slippage rule: cut from the bottom of the four fronts, never from the pitch.

## Scoring protocol

Any session touching a judge-visible surface scores it **1–10 per criterion** with one line of evidence
each, in its STATUS/handoff note. Any judge-visible surface **below 8** becomes an open item in
`_meta/OPEN-ITEMS.md` with a `JL-` id. Don't self-grade generously: the panel won't.

## Judge-panel review (repeatable procedure)

Run at the end of every front and before the 15-July freeze:
1. **Six parallel reviewer agents**: one per criterion + one "tired judge" (has seen 60 projects,
   scores only memorability). Each receives the demo path (screens/flow), the deck, and the script.
2. Each returns: score 1–10 · the single weakest moment · one concrete fix.
3. A skeptic agent adversarially verifies findings before they consume build time.
4. **Pass bar: every judge-visible surface ≥ 8, memorability ≥ 8.** Below bar → `JL-` item + fix round.

## Spine guard (non-negotiable)

The lens never overrides the spine. No riba, no penalty, no maysir/gharar, no trust numbers, no
credit scoring, no fatwa-issuing; the demo stays frozen (`e2f48467…`); golden functions are called,
never modified. Winning cannot compromise the soul. Any conflict between this lens and the spine goes
to `docs/DECISIONS-FOR-MARWAN.md` — it is Marwan's call, never a session's.

## Where the sprint lives

Spec: `docs/superpowers/specs/2026-07-07-judge-lens-win-standard-design.md` (four fronts + schedule).
Open gaps: `_meta/OPEN-ITEMS.md` (`JL-` ids). Deadline structure: **freeze 15 July**, onsite 16–18.
