---
title: "Concept — صوت Sawt (the bank with no screen)"
tags: [agent/2, leap, status/finalist, vector/invisible-saudis, track/genai, req/ai, req/cx, score/83]
updated: 2026-06-18
---

# 🎙️ صوت · Sawt — "A bank you talk to. No screen. No reading."

**Segment (Invisible Saudis):** the blind, the motor-impaired, and the millions who can *bank but not read a screen* — especially **elderly** parents. (Saudi bank apps all fail WCAG 2.1; 7.78% of the population has a disability.)
**Track:** 1 — Generative AI for FinTech · **Requirements:** /02 AI + /03 CX
**Score:** **83 / 100**

## A. One-liner
*A complete bank that has no app to learn and nothing to read: you speak to it in your own Khaleeji Arabic, and it listens, answers, and acts — built for the Saudis every banking app quietly excludes.*

## B. Problem
Saudi banking has gone fully digital — and in doing so **locked out** the blind, the low-literacy elderly, and anyone who can't navigate a dense RTL screen. Every top-3 bank app **fails WCAG 2.1**. An 80-year-old who built this country cannot check his balance without his son; a blind professional cannot pay a bill privately. Dignity and independence are the unmet need, and "accessibility mode" bolted onto a visual app has never solved it.

## C. Solution
A **voice-native** banking surface (not an accessibility setting — the *primary* interface). ALLaM understands natural spoken Gulf Arabic ("وش رصيدي؟", "حوّل لولدي خمسمية"), confirms intent aloud, and executes via OB/sarie. Secure by **Nafath + voice biometrics**; every action read back and confirmed before it runs; an optional "trusted child" who can be looped in with the parent's spoken consent (dignity preserved — the parent is in control, not managed). Works on a basic phone call line too, for those with no smartphone at all.
- **Only-now/only-here:** a **sovereign Arabic LLM (ALLaM)** finally makes robust spoken-Khaleeji banking real; before 2026 the Arabic ASR/intent quality wasn't there.

## D. Mapping
Track 1 (GenAI). /02 AI (the voice agent) + /03 CX (the entire point is a humane, independent experience). Touches /04 Sustainability (long-term inclusion).

## E. 72h build plan
**Built:** the voice loop (speech-in → ALLaM intent → confirm-aloud → act) for 4–5 core intents (balance, history, pay a bill, transfer to a saved person, "talk to my son"); read-back confirmation; an accessible large-type/high-contrast *companion* view for partial-sight.
**Mocked:** real voice-biometric enrolment, telephony line, core-banking (synthetic accounts via sandbox). ALLaM behind a seam (deterministic transcripts for the demo).
**Must-work:** speak "حوّل خمسمية ريال لأحمد" → it confirms aloud → executes → confirms done, with zero screen interaction.

## F. Data story
Synthetic accounts + an intent/transaction log; live, the demo shows the spoken request parsed into a structured, confirmed action and the resulting transaction — plus an "accessibility audit" overlay scoring the flow against WCAG criteria the incumbent apps fail.

## G. Demo script (3 min)
Blindfold the presenter (or close their eyes). Hand them a phone. They *speak* the whole session — balance, pay the electricity bill, send money to a son — and never look at the screen. Then: an elderly persona does the same with a "loop in my daughter" consent beat. Close: "Every other bank made an app. We made a bank you can use with your eyes closed."

## H. Alinma-ship case (Shariah-clean)
Vision 2030 disability-inclusion + an underserved, loyal, high-trust segment; differentiates Alinma as the **accessible** Islamic bank; deployable on ALLaM/watsonx (its stack) + OB/sarie. **Shariah-clean:** it's an *interface* over the customer's own money — no contract issue at all. PDPL + Nafath consent; spoken confirmation before every action.

## I. Differentiation
vs SAB voice-guidance ATMs / special-needs branches (point solutions, still screen/branch-bound) and vs "accessibility settings" on visual apps (afterthoughts that still fail). Sawt is **voice-first as the primary product**, in real Khaleeji Arabic. Distinct from the kill-list entirely.

## J. Risk register
1. **Voice/ASR accuracy in dialect + noisy Hajj-season environments.** → Constrain to high-confidence intents with mandatory read-back + confirm; degrade gracefully to "let me connect you."
2. **Security of voice auth.** → Nafath as the spine; voice biometric as a second factor; spoken-confirm every transaction.
3. **Demo realism.** → Deterministic transcripts + offline fallback; live mic optional.

## K. Score — **83 / 100**
| Criterion | Wt | Pts | Why |
|---|---|---|---|
| Innovation | 20 | **16** | Voice-first-as-primary in Khaleeji Arabic is fresh for KSA; accessibility itself is a known frontier (caps the surprise). |
| Technical | 20 | **16** | Voice loop + intents + confirm buildable; ASR robustness is the real risk. |
| Data | 20 | **14** | Intent parsing + transaction execution; lighter on heavy analytics. |
| UX | 15 | **15** | The product *is* UX/dignity; the eyes-closed demo is unforgettable. |
| Feasibility | 25 | **22** | Strong inclusion mandate, on Alinma's stack, trivially Shariah-clean; ASR quality is the watch-item. |

**Gates:** ✅ 72h-demoable · ✅ leap (dignity + a category shift to voice-native) · ✅ Shariah-clean (pure interface) · ✅ not kill-list · ✅ PDPL/Nafath · ✅ one track + reqs.

Siblings: [[concept-dhimmah]] (champion) · [[concept-wasiyyah]].
