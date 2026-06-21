---
title: "عهد · Ahd — 11_Build STATUS"
updated: 2026-06-19
---

# 11_Build — STATUS

**DONE — THE BUILD ROUND (single session, single owner).** Closed every P0/P1 gap from
`10_Deep/Ledger/open-threads.md`; the build now matches the ~92 paper (as-built ~80 → ~91).
Logic + Arabic copy only — NO visual redesign. Harness kept green throughout: **145/145 pass**
(was 92), golden vectors unchanged, Patch B/JCS-SEAL deferred (post-demo).

| ID | Item | Status |
|---|---|---|
| B1 · OT-SOUL | C1 «وصلتك بسلامة» gift-receipt invite (new step 2) | ✅ DONE |
| B2 · OT-SOUL | C2 «متى ما تيسّر» يُسر grace / safety net (no penalty) | ✅ DONE |
| B3 · OT-FSM | Event-sourced `events→fold→status` + seeded defaulted/disputed/forgiven | ✅ DONE |
| B4 · OT-CONSENT | Muqassa per-member consent (novation) before commit | ✅ DONE |
| B5 · OT-PCT | Patch A computed trust signal + `%`→band-word (S9) | ✅ DONE |
| B6 · OT-RIBA | Negation-proofed riba-linter (must-block intact) | ✅ DONE |
| B7 · OT-STEP0 | Step 0 leads with KSA demand; US figure labelled توضيحي | ✅ DONE |
| B8 · OT-X1/X2/X3 | Propagated C10 / C15 / C1 into growth / product / legal layers | ✅ DONE |

**Evidence:** `11_Build/build-log.md`. Harness: `run-tests 108 · offline 9 · dom-smoke 28`.
Browser: 0 console errors, RTL clean, seal == golden. Screenshots: `project/ahd-demo/screenshots/build-0*.png`.

**Left for others:** Claude Design — visual polish on the 4 new screens (band-ring label fit, C1
phone-flip, card rhythm). Post-demo — Patch B/JCS-SEAL + re-pin golden vectors (OT-PATCH).
