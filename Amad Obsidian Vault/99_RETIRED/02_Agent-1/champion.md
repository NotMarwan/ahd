---
title: Agent 1 — Champion · Tadfuq (red-teamed)
tags: [agent/1, champion, status/finalist, track/open-banking, score/90]
updated: 2026-06-18
---

# 👑 Agent 1 Champion — [[concept-tadfuq|Tadfuq · Cash-Flow Credit Engine]] (90/100)
> Crowned only after surviving its own red team (below).

## Why it wins (one sentence)
It is the single concept that lands all five judge criteria at once **and** answers criterion 5 — "Alinma could ship this next quarter" — better than anything else, because it's built on the exact rails (licensed open banking + ZATCA + Alinma's IBM API stack) that just matured in 2026, aimed at the SAR-0.5-trillion problem the bank most wants solved.

---

## 🔴 RED TEAM — attack before crowning

### Per-criterion: "why might judges score this LOW?"
1. **Innovation (17):** *Attack* — "Cash-flow lending isn't new; India did it." *Truth* — the **OB×ZATCA fusion + Shariah explainability** is the novel, KSA-specific wedge; lean the pitch on the ZATCA ground-truth moat, not on "cash-flow lending" generically.
2. **Technical (17):** *Attack* — "It's a model wrapper; the hard part (a real risk model) is faked." *Truth* — partly fair. *Fix* — show feature engineering + explainability + a synthetic back-test so it reads as real engineering, and be explicit about what's prototype vs production.
3. **Data analysis (19):** *Attack* — "Sandbox/synthetic data isn't real proof." *Fix* — seed synthetic data to realistic Saudi SME distributions; cite SAMA Lab corporate mock data; show the *method* is sound even if the data is simulated.
4. **UX (13):** *Attack* — "B2B underwriting tools are ugly/boring; CX-lane concepts will out-pretty us." *Fix* — invest in one genuinely beautiful Arabic-first decision card + consent flow; the <15s reveal is the emotional beat.
5. **Feasibility (24):** *Attack* — "Banks can't deploy a credit model from a hackathon." *Truth* — they deploy the *capability/architecture*, not the weights. Frame as "the deployable engine + the proof it works on Alinma's rails," not "a finished risk model."

### Single most likely reason it loses
**It out-thinks the room on data/feasibility but under-delivers on the 3-minute emotional wow** vs a flashier consumer-facing GenAI demo (Agent 3's lane). → *Mitigation:* the **<15s consent→explained-limit reveal** + the **freelancer-then-SME range flip** must be rehearsed to feel magical, not technical.

### What a skeptical bank exec objects to in the first 30 seconds
"Revenue can be inflated; how do you trust the numbers?" → **This is exactly why ZATCA is in the architecture** — lead the depth section with "we cross-check bank inflows against government-verified invoices; divergence is a fraud flag." Turn the objection into the moat.

### What breaks in the live demo + fallback
- OB sandbox/ZATCA endpoint flakiness or >15s latency → **fallback:** pre-recorded screen capture of the exact flow + local synthetic dataset so it runs fully offline.
- Model returns a weird limit live → **fallback:** fixed demo profiles with vetted outputs; "explore mode" only on the safe profiles.

### Fixed vs disclosed
- **Fixed:** explainability + synthetic back-test (technical credibility); offline fallback (demo risk); ZATCA-as-fraud-check framing (the 30s objection); a polished RTL card (UX gap).
- **Disclosed honestly:** the risk model is a prototype trained on synthetic/sandbox data, not a production-calibrated scorecard; Tawarruq is shown structurally, not executed.

**Verdict:** survives its red team → **crowned.** The fixes are all inside 72h scope.

## Open questions to validate at enrichment (5–16 July)
- **Data access:** exact OB Lab / Alinma sandbox endpoints + ZATCA sample-invoice formats actually reachable during the event? (Confirm at the **12 Jul "AI financial experiences"** and **13 Jul "Data analytics"** sessions.)
- **Shariah:** is Tawarruq the right structure to showcase, or does Alinma prefer Murabaha/Wakala for working capital? (Ask a mentor.)
- **Judging weight:** do judges weight working-demo or business-case higher? Tune the 3-min split accordingly.
- **Pitch craft:** rehearse against the **15 Jul "from idea to investment pitch"** session.

## Links
- [[concept-tadfuq]] · [[concept-nabd]] · [[concept-misnad]] · [[wildcard]] · [[research]] · [[master-scoreboard]] · [[00_Index]]
