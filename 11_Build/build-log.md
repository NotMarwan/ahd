---
title: "عهد · Ahd — THE BUILD ROUND log (close every P0/P1 gap; make the build match the paper)"
owner: Claude (single session, single owner)
date: 2026-06-19
status: DONE
scope: logic / state / flows / Arabic copy only — NO visual redesign
---

# 🏗️ Build-round log — «عَهد» (the build now tells the truth about itself)

One session, one owner. Closed every P0/P1 build gap from `10_Deep/Ledger/open-threads.md`
(B1–B8). The prototype's **logic + Arabic copy** were edited; **no restyle/relayout/recolor**.
The 92-assertion harness was kept green throughout and **grown to 145** (53 net-new assertions;
no passing assertion was deleted or weakened).

## Files I own and edited this round
- `project/ahd-demo/index.html` — B1–B7 (logic + copy).
- `10_Deep/Hardening/test-harness/{run-tests.cjs, dom-smoke.cjs, load-logic.cjs}` — **added** assertions + exposed the new pure functions (the harness exists to be grown; no golden re-pin).
- `Amad Obsidian Vault/AMAD-2026/08_Ahd_Deep/Agent-3/layer-growth-adoption.md` — B8 (C10).
- `…/Agent-4/layer-product-demo.md` — B8 (C15).
- `…/Agent-1/layer-legal-shariah-regulatory.md` — B8 (C1).

## Harness — green the whole way
| File | Baseline | Now |
|---|---|---|
| `run-tests.cjs` (pure logic) | 62 | **108** |
| `offline-check.cjs` (no-network invariants) | 9 | **9** |
| `dom-smoke.cjs` (render + robustness) | 21 | **28** |
| **Total** | **92** | **145 · 0 failed** |

Run: `cd 10_Deep/Hardening/test-harness && node run-tests.cjs && node offline-check.cjs && node dom-smoke.cjs`
Golden vectors (`golden-vectors.json`) **unchanged** — seal `6c9410b9…`, content `f8d11335…`, GENESIS
`f80fcd62…`, netting `9→2` are byte-identical to pre-build (verified live in Chrome: doc shows
`#6C9410B95BA4`). **Patch B / JCS-SEAL deliberately NOT applied** (it would change those hashes).

---

## 🔴 P0 — the round-deciders

### B1 · C1 «وصلتك بسلامة» — gift-receipt invite screen  ✅
- **What/why:** the borrower's receiving moment had no screen (they were a card tapped on the
  lender's device). Built a new **step 2** — the screen flips to the borrower's phone and frames
  the deed as **care, not accusation** (seals red-team A6 — initiator stigma).
- **Spec:** `09_Finish/Consumer/embrace-additions.md §1` (C1). Deed first → protections explicit →
  obligation last; accept (`أكّد استلامي بسلامة` → «وصلتك بسلامة 🤍 — عهدٌ موثّق») and a face-saving
  `عندي ملاحظة` path; flows into the dual-Nafath seal. 2:280 grace stated up front.
- **Build:** new `R[2]` render thunk; flow restructured to 6 steps (`TOTAL=6`: 0 problem · 1 create ·
  **2 C1** · 3 seal · 4 settle · 5 muqassa). Step indices shifted (old R[2/3/4] → R[3/4/5]); all
  `go()` targets + pill numbers + the step-1 button (`أرسِل العهد إلى سارة`) updated.
- **Verify:** dom-smoke "R[2] (C1) renders"; live Chrome — accept reveals the warm ack, 0 console
  errors, RTL clean. Screenshots: `build-01-c1-invite.png`, `build-01-c1-accepted.png`.

### B2 · C2 «متى ما تيسّر» — يُسر grace / safety net  ✅
- **What/why:** "what if I can't pay?" had no home (settle always paid perfectly). Built a
  borrower-invokable `🌿 أحتاج وقت` on the settle screen (seals red-team A10 — dunning-vs-warmth).
- **Spec:** `embrace-additions.md §2` (C2) + `backend-architecture.md §3` (GRACE_GRANTED → ACTIVE).
- **Build:** `graceReschedule()` re-spreads the **remaining** principal over +2 months via the pure,
  testable `respread(totalMinor,count)` — **Σ preserved exactly ⇒ no penalty (penalty would be riba)**.
  Appends `GRACE_GRANTED`; status → **«مؤجّل بالتراضي»** (never «متأخّر»); lender informed with
  face-saving copy («…يحتاج مهلة بسيطة — وهذا من المعروف»). Reassurance line shown at signing.
- **Verify:** run-tests `respread` Σ-preservation assertions; dom-smoke "grace reschedule renders";
  live Chrome — 5,000 ر.س re-spread 5→7 installments (~714 each), no penalty, status badge flips.
  Screenshot: `build-03-c2-grace.png`.

---

## 🟠 P1 — make the prototype tell the truth about itself

### B3 · Real event-sourced state machine  ✅  (OT-FSM)
- **What/why:** dossier §9 claimed "state machine = built" but it was a `step` counter. Built a real
  **append-only `events[] → fold() → status`** model for the *agreement* lifecycle (the UI `S.step`
  navigation counter is separate and stays).
- **Spec:** `backend-architecture.md §2–3` (immutable log; status DERIVED by fold; full state enum).
- **Build (pure region):** `ev()`, `fold()`, `STATE_AR`, `statusLabel()`; states DRAFT · PENDING_CONSENT ·
  WITNESSED · ACTIVE · SETTLING · KEPT · DEFAULTED · DISPUTED · ESCALATED · FORGIVEN (إبراء) · … plus the
  graced **«مؤجّل بالتراضي»** projection. The main ahd is event-sourced: seal appends LENDER_SIGNED→
  …→ACTIVATED, settlement appends ALL_SETTLED→KEPT, grace appends GRACE_GRANTED. **Seeded `SEED_AHDS`:
  a DEFAULTED, a DISPUTED, and a FORGIVEN agreement** with real event logs — surfaced on the record
  screen via `📂 اعرض عهودًا في حالاتٍ أخرى` (answers red-team A3/K20 "show me a defaulted agreement").
  DEFAULTED label states **«بلا غرامة»** (no penalty — spine).
- **Verify:** 15 run-tests fold/seed assertions (each seed folds to its terminal state; grace→ACTIVE+
  graced; determinism); dom-smoke lifecycle + seeded render. Screenshot: `build-02-fsm-seeded-states.png`.

### B4 · Muqassa per-member consent step  ✅  (OT-CONSENT)
- **What/why:** "consented Muqassa" was claimed/narrated but the consent cards didn't exist.
- **Spec:** `muqassa-deep.md §8` (consent as novation/hawala) + `§7.3` all-or-nothing safer default.
- **Build:** pure `muqassaLegs()` projects SETTLE into per-party legs (net-zero parties washed out →
  only نورة/خالد/فهد need consent). Consent gate before the "after" graph commits: each party sees
  their new leg («بدل أن تسدّد لدائنيك المتفرّقين، ستدفع إلى: خالد 600، فهد 300»), `✅ وافِق على الكل`
  batch-approves in one tap; **commit is gated until all consent**; a decline keeps that party's debts
  **bilateral** (clear message). The conservation proof runs unchanged on the consented set.
- **Verify:** run-tests `muqassaLegs` assertions (3 legs, نورة pays exactly 900, single-sided);
  dom-smoke consent render; live Chrome — cards render, commit disabled until all approve, then 9→2
  proof. Screenshot: `build-05-muqassa-consent.png`.

### B5 · Patch A — computed, non-`%` trust signal  ✅  (OT-PCT)
- **What/why:** the rings showed the exact `%` credit-score the thesis denies.
- **Spec:** `prototype-compute-patch.md` Patch A + `trust-signal-and-graph-analytics.md` (S9 band, not number).
- **Build:** applied Patch A **exactly** — replaced the hardcoded `REP` table with the computed,
  windowed, time-decayed `trustSignal()` + `TRUST` table (AS_OF 2026-06, W=24, λ=12). Then the explicit
  **`%`→band-word swap (S9 logic/contract fix, mine to do):** `nodeSVG()` now renders `TRUST_BAND_AR[band]`
  — «وفّى بعهوده» / «جديد» / «عليه وعدٌ متأخّر» (+ «وفّى بأغلب عهوده» for mixed) — **never a number**.
- **Result (verified live):** نورة/سارة/ليلى/فهد → «وفّى بعهوده»; خالد → «عليه وعدٌ متأخّر»; ratios
  100/100/90/100/86; **no `%` anywhere in the SVG**. 16 run-tests assertions incl. a regex guard that
  `nodeSVG` renders no numeric percentage. Screenshot: `build-04-band-rings.png`.

### B6 · Negation-proof the riba-linter  ✅  (OT-RIBA)
- **What/why:** the centerpiece over-blocked its own clean terms («بلا فائدة» → wrongly BLOCKED).
- **Spec:** `robustness-report.md` (negation guard) — extended to `بلا|بدون|دون|من غير|بغير|عدم|لا`
  (+ optional leading «و» for «ولا», + filler «أيّ»).
- **Build:** `RIBA_NEG` + `ribaHit()` skip a trigger immediately preceded by a negation particle at a
  word boundary; `RIBA_RULES` keep **no `/g`** (statelessness invariant preserved — swept by slicing).
  The must-block penalty path (`+ غرامة تأخير ٥٪`) still BLOCKS.
- **Verify:** the two pinned `[known FP]` tests **flipped to assert clean** (+5 new must-block/negation
  assertions incl. «مثلاً» ≠ particle «لا»). Live Chrome: «بلا فائدة ولا غرامة» → ✓ clean / sign enabled;
  penalty chip → blocked / sign disabled; empty → enabled. Screenshot: `build-06-riba-negation-clean.png`.

### B7 · Step 0 leads with KSA demand  ✅  (OT-STEP0)
- **What/why:** opening screen showed unlabeled US stats (re-committing red-team A1).
- **Spec:** `Arsenal/demand-evidence-ksa.md §2.1–2.2`.
- **Build:** replaced the US figures with the **KSA-primary anchor** — **58.6%** of execution-court
  requests are سندات لأمر · **115.4 مليار ر.س** over **571,251** requests in 11 months · **43 مليون**
  Najiz e-services (H1-2024), with an honest source caption (FY2020–21 court data, being refreshed).
  The one US figure kept (1-in-6 relationships) is now labelled **«توضيحي — رقم سعودي قيد الإعداد»**.
- **Verify:** live Chrome render, 0 console errors. Screenshot: `build-00-step0-ksa.png`.

### B8 · Three source-layer text fixes  ✅  (OT-X1/X2/X3) — a judge can open these
- **C10** (`layer-growth-adoption.md` §3.5/§3.7/§8, lines 128/164/170/216/236): Musaned reframed from
  "forces both sides / fixes k<1" → **one-sided employer→wallet presence on-ramp** that lowers
  onboarding friction but does **not** create a two-sided rail or fix k (k ≲ 0.36; needs separate GTM).
- **C15** (`layer-product-demo.md` §7/§8, lines 265/276): "each party settles exactly once" → **≤ P−1;
  single-sided (pays *xor* receives); a party may appear in >1 transfer** (true minimum is NP-hard).
- **C1** (`layer-legal-shariah-regulatory.md` §3.1/§5/§4.2, lines 31/203/197): ETL signature-equivalence
  **Art. 8 → Art. 14** (Art. 8 = record integrity); §4.2 "minimum transfer set" → **≤ P−1 (NP-hard)**.
- Edited only those lines; surrounding prose untouched. Re-grep confirms no residual refuted claim.

---

## Handed to Claude Design (visual polish only — logic/copy is done)
- **Band-word rings (B5):** «عليه وعدٌ متأخّر» is longer than «87%`; the `.rlbl` labels fit but are
  tight under the nodes. Design may reposition/space them, or adopt embrace-#8's "private leaf only"
  treatment (show the band to a counterparty, the quiet `🌿 سجلّ وفاء` to oneself). Logic exposes
  `TRUST[name].band` ready for any visual.
- **C1 / C2 / consent / seeded-states panels (B1–B4):** built with existing tokens/classes only
  (`.card .field .badge .doc .vbox .ayah`). No new CSS. Visual refinement (spacing, the "phone-frame"
  flip animation for C1, card rhythm on the consent step) is Design's call.
- The C1 invite could get the embrace's micro-dua touches (#4/#6) — copy hooks are in place.

## Deliberately NOT done (per guardrails)
- **Patch B / JCS-SEAL** — post-demo only; would change the golden hashes the demo is verified against.
- Any restyle/relayout/recolor; no sub-agents; no penalty in grace; no number in the trust display.

## Verify evidence
- Headless: `run-tests 108 · offline 9 · dom-smoke 28 = 145 / 0 failed` (exit 0 each).
- Real Chrome (`http://localhost:8123` via `project/_serve.cjs`): full click-path 0→5 walked,
  **0 console errors/warnings**, no horizontal overflow (`scrollW === innerW`), RTL clean, seal hash
  on screen == golden. Screenshots in `project/ahd-demo/screenshots/build-0*.png` (8 files).
