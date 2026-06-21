---
title: "Rushd — Architecture + 72h Build Plan"
tags: [agent/3, deliverable, architecture, buildplan, track/genai]
updated: 2026-06-18
---

# 🏗️ Rushd — Architecture + 72h Build Plan
> Turns [[rushd-v2-sharpened|Rushd v2]] from concept into a demo-able build. Pre-build the scaffold *before* the 72h (allowed: auth, UI shell, CI, data) so the event is spent on the Tayyib-Score logic + demo.

## System architecture
```
┌─────────────────────────────────────────────────────────────┐
│  Arabic-first RTL client (Next.js/React or Flutter)          │
│  • Home: Tayyib Score + zakat-due + purified chips           │
│  • Drill-down charts • explainability cards • voice mode      │
└───────────────▲───────────────────────────┬─────────────────┘
                │ REST/WS                     │
┌───────────────┴─────────────────────────────▼───────────────┐
│  Orchestration API (FastAPI / Node)                          │
│  • Agent loop (LangGraph-style) + tool router                │
│  • Tayyib Score service (composite index)                    │
│  • Zakat engine (nisab + hawl, ZATCA Zakaty method)          │
│  • Purification detector                                      │
└──┬───────────────┬───────────────┬───────────────┬──────────┘
   │               │               │               │
┌──▼───┐   ┌───────▼──────┐  ┌─────▼───────┐  ┌────▼──────────┐
│ALLaM │   │Shariah classi-│  │ RAG store   │  │ Mock core/OB  │
│ via  │   │fier (merchant │  │ (rulings +  │  │ APIs (SAMA OB │
│watsonx│  │→cat→status)   │  │ product     │  │ Lab / Alinma  │
│/Azure│   │ rules + ML    │  │ catalog)    │  │ sandbox +     │
└──────┘   └───────────────┘  └─────────────┘  │ synthetic gen)│
                                               └───────────────┘
```

## Tool contracts (the agent's real surface)
| Tool | Input | Output | Built/Mocked |
|---|---|---|---|
| `classify_shariah(txn)` | merchant, MCC, amount, memo | status + reason + ruling_id + confidence | **Built** (rules + RAG + ALLaM) |
| `tayyib_score(account)` | txn history + holdings | 0–100 + sub-scores + drivers | **Built** |
| `compute_zakat(account)` | assets snapshot, dates | zakat due, nisab/hawl basis | **Built** |
| `detect_purification(txns)` | txn stream | flagged non-compliant income | **Built** |
| `purify(amount, charity)` | amount, beneficiary | confirmation | Built logic / **mocked** transfer |
| `move_to_pot(amount, structure)` | amount, Murabaha pot | confirmation + structure shown | Built logic / **mocked** transfer |
| `explain(ruling_id)` | ruling id | plain-Arabic text + citation | **Built** (RAG) |
| `escalate_to_scholar(q)` | question | ticket id ("pending review") | **Mocked** (stub + canned ruling) |

## Build vs mock matrix (be honest in the pitch)
- **Genuinely built:** the agent + tool-calling; the Shariah classifier (merchant→category→status via curated rules + RAG, not a hard-coded lookup — must classify *unseen* merchants live); the Tayyib Score composite + drill-down; the zakat engine; the purification detector; the explainability cards w/ citations; Arabic RTL UX; 3 working actions; optional voice.
- **Credibly mocked:** core-banking + OB calls (SAMA OB Lab / Alinma sandbox mock data + synthetic generator); Nafath login screen; the human-scholar escalation; live money movement (logic real, settlement stubbed).
- **Explicitly out of scope:** real-time settlement, full board-ratified score weights, every zakat edge case (waqf, complex equities).

## Data plan
- **Real:** KAPSARC/SAMA **POS-by-sector-and-city** (CSV) → merchant categories for realistic spend + Shariah classification.
- **Synthetic generator** seeds the deterministic demo account with: a planted non-compliant merchant (triggers Wow #1), an erroneous-interest credit (triggers Wow #2), a surplus + zakatable assets (triggers Wow #3). *Determinism = demo safety.*
- **RAG corpus:** a curated set of ~30–50 real Shariah rulings (AAOIFI / common fiqh positions) + the Alinma product catalog, chunked + embedded.

## Hour-by-hour 72h backlog (team of 4–5: 2 eng, 1 AI/data, 1 design, 1 PM/pitch)
**Day 1 — Foundations (the score must light up)**
- H0–4: repo + scaffold up (pre-built); load KAPSARC data; synthetic generator producing the deterministic demo account.
- H4–12: Shariah classifier (rules + RAG) classifying real categories; ALLaM/watsonx (or Azure) wired with a dev-model fallback.
- H12–20: Tayyib Score service + sub-scores; Arabic RTL home screen showing the live number.
- H20–24: explainability card + cited ruling on tap. **Checkpoint: score + drill-down render off seeded data.**

**Day 2 — The three wows**
- H24–32: live transaction stream → score reacts → Wow #1 (non-compliant flag + alternative).
- H32–40: zakat engine (nisab/hawl) → "zakat due" chip; purification detector → Wow #2 (quarantine + charity).
- H40–48: agentic actions (`move_to_pot` with Murabaha structure shown) → Wow #3; voice mode behind a flag. **Checkpoint: all 3 wows fire end-to-end.**

**Day 3 — Harden + pitch**
- H48–56: demo polish, RTL/Arabic copy review (Shariah-board tone check), edge-case guards, confidence-gated actions.
- H56–64: **record the full fallback video**; cache all LLM responses; rehearse the 3-min path twice.
- H64–72: deck finalize ([[rushd-demo-and-deck]]), analyst/P&L slide numbers, 2× full dress rehearsals with a timer. **Freeze 4h before pitch.**

**The one feature that must work:** the live **Tayyib Score + "halal? why? cited ruling"** on a streamed transaction. If everything else slips, this single loop still wins the room.

## Demo-failure mitigations (hour-70 insurance)
| Failure | Mitigation |
|---|---|
| LLM hallucinates a ruling on stage | Cached, board-verified responses for all demo paths; confidence floor → "let me check with a scholar" path. |
| Voice misfires | Voice flagged off by default; typed-command fallback; recorded clip of the voice moment. |
| Network / sandbox down | 100% local: synthetic feed + mocked APIs; zero live external dependency. |
| Wrong classification of a seeded txn | Deterministic seed + pinned classifier outputs for the demo account. |
| Timer overrun | Slides 1–4 are 60s max; demo is rehearsed to 3:00 with a 15s buffer. |

## Pre-build checklist (do before the 72h — allowed)
- [ ] Scaffold (Next.js RTL + FastAPI) + CI + deploy target.
- [ ] Alinma OB sandbox dev account registered (`developer-ob-sb.alinma.com`).
- [ ] ALLaM access path confirmed (watsonx trial or Azure AI Foundry) + dev fallback model.
- [ ] KAPSARC POS dataset downloaded + cleaned; synthetic generator written.
- [ ] RAG corpus of rulings curated + embedded.

## Links
- [[rushd-v2-sharpened]] · [[rushd-demo-and-deck]] · [[concept-rushd-shariah-copilot]] · [[saudi-fintech-terrain]]
