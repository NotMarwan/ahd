---
title: "Pitch package — حصين Haseen (deck + 3-min script + Q&A)"
tags: [agent/2, pitch, deck, track/regtech]
updated: 2026-06-18
---

# 🎤 Haseen — Pitch Package (the "deck" half of "demo + deck")

> Pairs with the working demo `prototypes/haseen-demo.html`. Final judging (18 Jul) is a 3-min live pitch + demo to bank execs + technologists. This is built to win that room.

## Deck outline (7 slides, one idea each)
1. **Title / hook.** حصين · Haseen. One line: *"We stop the scam before the money leaves."* Logo + the number: **Saudis lost ~$81.5M to scams they authorized themselves.**
2. **The problem (the gap nobody owns).** sarie is instant + irreversible. The bank's fraud engine sees an *authenticated, customer-approved* transfer and lets it through. The loss is at the **human layer**. Show the asymmetry: back-office scoring (Mozn) vs. the moment of authorization (empty).
3. **The insight / only-now.** KSA has **no Confirmation of Payee** (UK runs 2B+/yr). Open banking is now licensed (Mar 2026). **SAMA Counter-Fraud Requirements are mandatory 13 Apr 2026** (real-time monitoring + customer warnings). The lock is pickable now.
4. **The product (live demo cue → switch to prototype).** Three engines on "Send": CoP name-match · scam-pattern classifier · GenAI Arabic circuit-breaker. *Run the demo here.*
5. **The data + AI.** First-party Alinma signals (beneficiary-add, sarie metadata, personal baseline, mule-graph) → live risk score with visible feature contributions → ALLaM/watsonx Arabic intervention. Not a black box.
6. **Why Alinma ships it (the feasibility slide — worth 25/100).** Operationalizes the SAMA mandate they must meet anyway · avoids the coming APP-reimbursement liability · intra-Alinma CoP ships next quarter on existing core · Shariah-affirmative (*hifz al-mal*) · runs on the existing OB sandbox + IBM stack.
7. **Close / platform.** *"This is the SAMA mandate, shipped — and the reimbursement bill Alinma never pays. Pillar one of Alinma's AI money layer: Protect."* (Know · **Protect** · Grow · Fund — see [[portfolio-synthesis]].)

## The 3-minute spoken script (mapped to the prototype)
- **[0:00-0:20] Hook.** "Last year Saudis lost about eighty-one million dollars to scams they authorized themselves. The bank watched it happen and couldn't stop it. We can. Watch." (Open `haseen-demo.html`, scam scenario.)
- **[0:20-1:00] The scam in motion.** "Noura gets a call from someone claiming to be bank security. 'Your account is compromised, move your money to this safe account, now.' She opens Alinma and starts a fifty-thousand-riyal transfer." (Show the transfer screen + the scenario note.) "Her bank's fraud engine sees a logged-in customer making an approved transfer. Green light."
- **[1:00-2:00] The interception.** Tap **تحويل**. "Haseen fires in under a second." (Gauge climbs to 92, features light up.) "Confirmation of Payee — the name she typed doesn't match the account holder. That single check is the highest-signal scam tell, and Saudi Arabia doesn't have it yet." (Circuit-breaker.) "It names the scam type and asks three questions, in Arabic." (Tap the answers.) "Her answers confirm it."
- **[2:00-2:35] The save.** (Verdict → cancel.) "The money never leaves. We protected fifty thousand riyals." (Saved counter ticks; analyst panel: mule account flagged network-wide, SAMA event logged.) "And it logs straight into the Counter-Fraud report Alinma must file from April."
- **[2:35-3:00] The discriminator + close.** (Switch to legit scenario, tap send → passes cleanly.) "It doesn't block real payments — a normal transfer to a known payee passes instantly. This is the SAMA mandate, shipped; the reimbursement bill Alinma never pays; and pillar one of Alinma's AI money layer. Protect."

## Demo fallback (never depend on the network at hour 70)
- Primary: the local single-file prototype (no network, no build) — runs offline by design.
- If the laptop/projector fails: a screen-recording of the same flow on the phone.
- Never demo against a live sandbox endpoint on stage; the prototype is deterministic.

## Judge Q&A battery (anticipate the hard ones)
- **"Doesn't Mozn already do fraud?"** → "Mozn scores transactions in the back office and sees an authenticated, approved transfer — it structurally can't stop a scam the legitimate customer authorized. We own the moment of authorization. We'd happily consume Mozn's score as one input." (Pre-empt this in the first 45s.)
- **"Won't you block legitimate transfers and annoy customers?"** → (You already showed the legit scenario passing.) "It's friction plus a question, not a hard block — the customer can always override, and overrides are logged to tune sensitivity. We reduce friction versus a blunt decline."
- **"Confirmation of Payee needs every bank — you can't do that in a hackathon."** → "Intra-Alinma name-match ships today on Alinma's own core, zero new infrastructure. Cross-bank needs a sector registry — which the April SAMA mandate makes likely, and we're first-mover when it lands."
- **"Is the model real or is this synthetic?"** → "The demo is on synthetic typologies. In production it trains on data Alinma already owns: beneficiary-add events, sarie metadata, personal transaction baselines, dispute history, settlement-graph mule clusters. The method is what we're proving."
- **"Shariah angle?"** → "Protecting wealth is *hifz al-mal*, a maqasid of Shariah. For an Islamic bank this is affirmative, not just neutral. No interest mechanic anywhere."
- **"What's the business case?"** → "Prevented losses, avoided future reimbursement liability, retention of scammed customers, and you have to do the real-time monitoring for SAMA regardless. We turn a compliance cost into customer protection."

## Pre-event checklist (enrichment, 5-16 Jul)
- Confirm Alinma sandbox exposes beneficiary-name data for an on-us CoP demo; else lock the synthetic plan (12-13 Jul sessions).
- Ask Fintech Saudi (14 Jul) whether CoP / APP-reimbursement is on SAMA's roadmap — either answer strengthens the pitch.
- Validate the Arabic intervention tone + ALLaM/watsonx path (12 Jul AI-UX session).
- Rehearse the 3-min script against the 15 Jul pitch-craft session.

See [[concept-haseen]] · [[champion]] · [[portfolio-synthesis]].
