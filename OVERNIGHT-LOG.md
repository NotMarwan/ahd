# 🌙 OVERNIGHT-LOG — Ahd autonomous deepening

> Running log of the overnight session. Newest batch at the **top of the log section**.
> Maintained continuously. Harness numbers pasted are **real command output**, not claims.

---

## ⭐ READ ME FIRST (morning summary)

**Status as of last update:** 🟢 Demo safe · harness green (**core 184/0 + app 399/0 = 583 assertions, 12 app suites**) · independently **code-reviewed** (0 critical; 5 findings applied) · work isolated on `overnight/deepening` (24 commits) · demo `main` untouched.

**Most valuable thing produced so far:** all **three missing consumer features** now built, tested, and on-spine — **«دفتري»** (creditor home + bank-sent gentle reminder), **«القرض المفتوح»** (open-term qard hasan + إبراء), and **Advanced Circle** (بالأصناف split · recurring auto-post · graduation قَيْد→عهد which composes into القرض المفتوح · a mode-B pledge *sketch* flagged for Shariah review). All in a parallel publishable app (`project/ahd-app/`) on a faithful, parity-tested copy of the demo engine — the demo itself is byte-for-byte untouched.

- **Your demo is untouched.** `project/ahd-demo/index.html` is byte-for-byte identical to when you went to sleep (tripwire SHA-256 `e2f48467…d1b8be40`, re-checked every batch). All night's work is **additive, in new files**, on a separate git branch.
- **Two new things you should know about (transparency, not blockers):**
  1. **Git was initialized.** The project had no git. To give you the "review-and-merge-later branch" the brief asked for, I ran `git init` (non-destructive, reversible via `rm -rf .git`). Branch **`main`** = your exact baseline (demo + harness + ledger, 184/0 green). Branch **`overnight/deepening`** = all my work. Review with `git diff main..overnight/deepening`. Nothing auto-merges into `main`.
  2. **New parallel app at `project/ahd-app/`.** Because there is no way to add screens to `index.html` without changing its bytes (which would break the demo's tripwire + risk the golden path), the *only* way to honor "demo exactly intact" is to build in new files. So the publishable surface grows in `project/ahd-app/`, reusing a **faithful, parity-tested copy** of the demo's engine. The demo stays the safe presenter build.
  3. **⚠️ The frozen demo does NOT contain the new features.** `ahd-demo/index.html` (the presenter build) has the witnessed-record + Muqassa + Circle G1–G4. The new features (create, دفتري, القرض المفتوح, Advanced Circle) live in the **new app** `project/ahd-app/` (open `index.html`, or `node project/ahd-app/_serve-app.cjs` → `localhost:8124`). To show the new features live, load the ahd-app build. Both are on the same branch; neither replaces the other. See `docs/PRESENTER-GUIDE.md` for a 9-step golden path across both builds.
- **Needs your decision:** see `DECISIONS-FOR-MARWAN.md` (currently **D-1 دفتري self-disclosure**, **D-3 mode-B pooled deposit** — both Shariah-gated; D-2 digit-system is FYI).
- **Verified in a real browser:** all 4 ahd-app screens render with 0 app console errors — screenshots in `project/ahd-app/screenshots/`.

---

## 📦 WHAT WAS BUILT (deliverables index)

**A complete, parallel, publishable app at `project/ahd-app/`** (open `index.html`, or `node project/ahd-app/_serve-app.cjs` → `localhost:8124`) — 6 screens, reusing a parity-tested copy of the demo engine:
| Screen | What it is | Spine highlight |
|---|---|---|
| 🏠 **الرئيسية** | front door: brand, live summary, feature cards, 2:282/2:280 basis | bank witnesses, never lends/judges/charges/scores |
| ➕ **أنشئ عهدًا** | create a عهد with the **live riba linter** | blocks any penalty/interest clause, offers the halal fix, gates the seal |
| 📔 **دفتري** | creditor home (لي/عليّ) + bank-sent gentle reminder | amber-not-red overdue, no shaming day-counter, finite merciful ladder |
| ♾️ **القرض المفتوح** | open-term qard hasan + إبراء | no due ⇒ **never overdue**; conservation exact |
| 🔁 **الدائرة+** | بالأصناف split · recurring · graduation قَيْد→عهد | mode-B pledge sketch has a visible ⚠️ Shariah-review guard |
| 🔗 **المقاصّة** | the tangle → fewest transfers (9→2) + consent legs + conservation | reuses the golden netting; «لا ريال يُخلق ولا يضيع، ولا فائدة» |

**Supporting deliverables:**
- **Tests:** `10_Deep/Hardening/test-harness/app/` — 12 suites, **399 app assertions** (+ the demo's **184** core, untouched). Includes `golden-vectors.test.cjs` (absolute drift-guard) + `edge-cases.test.cjs` (degenerate inputs). `node app/run-app-tests.cjs`. **Independently code-reviewed** (subagent): 0 critical; 5 findings fixed + regression-guarded.
- **Docs:** `docs/ARCHITECTURE.md`, `project/ahd-app/README.md`, `docs/PUBLISHABLE-PRODUCT-SPEC.md`, root `CLAUDE.md`, `docs/DESIGN-NOTES-FOR-CLAUDE-DESIGN.md`.
- **Pitch:** `docs/DECK-DRAFT-AR.md` (9-slide Arabic deck draft), `docs/evidence/` (`EVIDENCE-BRIEF.md` + `REBUTTAL-PLAYBOOK.md` graded 🟢/🟡/🔴 web-verified, + `DEMAND-SURVEY-KIT.md` to close the OT-A1 demand gap), `docs/PRESENTER-GUIDE.md` (9-step golden path).
- **Proof:** `project/ahd-app/screenshots/` — real-Chromium renders (incl. the riba linter blocking live), 0 app console errors.
- **Plans:** `docs/superpowers/plans/` — one per feature (brainstorm→plan→TDD trail).

## ▶️ HOW TO REVIEW (in the morning)
1. **See the diff:** `git diff main..overnight/deepening` (or `git log main..overnight/deepening --oneline` — 24 commits, each green).
2. **Run the app:** `node project/ahd-app/_serve-app.cjs` → open `http://localhost:8124` (fully offline).
3. **Run the gate:** from `10_Deep/Hardening/test-harness/`: `node run-tests.cjs && node offline-check.cjs && node dom-smoke.cjs && node app/run-app-tests.cjs` → 184 core + 399 app, all green.
4. **Confirm the demo is untouched:** `sha256sum -c _overnight/backup/demo.sha256` → OK (`e2f48467…`).
5. **Decide:** `DECISIONS-FOR-MARWAN.md` (D-1 self-disclosure, D-3 mode-B pooled deposit — both Shariah-gated; D-2 digits FYI). **Nothing auto-merges into `main`** — the merge is yours.

## ✅ Final verification snapshot (2026-06-21, fresh)
`tripwire OK · AHD-LOGIC markers 2 · run-tests 135/0 · offline 9/0 · dom-smoke 40/0 · app 12/12 (399/0) · 24 commits · 0 uncommitted · main = baseline b2458ee untouched`

## Protected-core invariants (self-checked every batch)
- `project/ahd-demo/index.html` SHA-256 == `e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40` (tripwire).
- Harness `node run-tests.cjs && node offline-check.cjs && node dom-smoke.cjs` ≥ **184/0**, all exit 0.
- Golden-pinned functions never modified internally (sha256, canonical, sealBlock, recomputeSeal, verifyRecord, netting core, fmt, respread, netting tiebreak).
- Determinism: no float money / Math.random / Date.now / new Date / Intl in new logic; integer halalas; pure logic separated from DOM.

---

## LOG (newest first)

### Batch 13 · Independent code-review applied — ✅ DONE
A code-reviewer subagent reviewed all of `project/ahd-app/` against the spine/determinism/escaping/golden-core criteria: **0 critical**, determinism clean, golden-core clean, no riba/score surfaced. 5 high/med findings — **all applied + regression-guarded**: `selfBand` now returns only `{band,word}` (was leaking the numeric ratio — spine); `rowFor` prefers the explicit schedule length; `daysOverdue` escaped; `recurringPosts` accepts an injected engine (DI); the settlement screen uses correct Arabic plural. App 12/12. Commit `4ac8898`.

### Batch 12 · Edge-case robustness + survey kit + design notes — ✅ DONE
- `app/edge-cases.test.cjs` (21): degenerate-input invariants across every feature module (empty ledger/tiles, settled-loan clamps, empty/no-member splits, empty Muqassa tangle, empty terms clean) — all graceful, no bugs surfaced.
- **Lane C survey kit (subagent):** `docs/evidence/DEMAND-SURVEY-KIT.md` — the honest way to close **OT-A1**: 15 non-leading survey items + 15 interview prompts, pre-registered hypotheses + validate/invalidate thresholds, a non-leading firewall (product never named), an honest CLOSED-NEGATIVE path, all targets as placeholders. H2 (asking-back-is-painful) = make-or-break.
- **Lane E design notes:** `docs/DESIGN-NOTES-FOR-CLAUDE-DESIGN.md` — baseline decisions + deferred polish + per-screen hand-offs + hard constraints (visual work → Claude Design's lane, per the brief). Root `CLAUDE.md` added.

### Batch 11 · المقاصّة (Muqassa) screen — ✅ DONE
`features/settlement.js` + `screens/settlement.js`: a thin view-model over the **golden** `netting`/`balancesOf`/`muqassaLegs` (reused untouched) — the 9-IOU tangle → **2 transfers**, per-member consent legs (consented novation), and the conservation proof «Σ net = 0». Completes the app's parity with the demo's signature screen. Real-Chromium verified (`screenshots/ahd-settlement.png`). settlement 10, dom-smoke 77. Commits `d782f12`, `70a0e28`.

### Batch 10 · Golden-vector drift-guard — ✅ DONE
`app/golden-vectors.test.cjs` (11): pins the new features' **absolute** seals/splits (open-loan `b080f79e`, create `0463553`, app-seed create `866304d`, graduation `5fb4dad`, بالأصناف halalas, recurring) — matching the demo's `golden-vectors.json` philosophy. The feature suites prove *relative* determinism; this proves the bytes never silently drift. Commit `e6d3b92`.

### Batch 9 · دفتري own trust-band + presenter guide — ✅ DONE
- **Own trust band (Agent-3 Screen E.1):** the «عليّ» tab now shows Naif's OWN qualitative band («وفّى بعهوده») via the engine's `trustSignal`/`TRUST_BAND_AR` — **a word, never a number, own-history only, never shared**. The *sharing* half stays deferred (D-1, Shariah/privacy). `selfBand` (TDD) + seed + render + dom-smoke proof there's no % / score on screen. daftari 48, dom-smoke 71.
- **Lane D presenter guide (subagent):** `docs/PRESENTER-GUIDE.md` — 9-step golden path across both builds + an "if a judge asks" table. Flagged 5 presenter-accuracy nuances (Muqassa cast is نورة/سارة/خالد/ليلى/فهد not Naif; the honest 9→2 path; the app's riba moment is the 🧪 button which sidesteps the known negation FP on stage).

### Batch 8 · §4-E polish — error-handling fallback + accessibility — ✅ DONE
Shell `try/catch` fallback proven (a throwing screen is caught, renders «تعذّر العرض», recovers); nav `aria-current`, دفتري tabs `role=tablist/tab/aria-selected`. dom-smoke +5. Commit `ef1824f`.

### Batch 7 · Stale harness README fix + create-flow browser evidence — ✅ DONE
Corrected the harness README run section (core 184, not the pre-Circle 92) + documented the app/ suites; `screenshots/ahd-create-riba-blocked.png` proves the riba linter blocks live. Commit `bbbfa80`.

### Batch 6 · Create-عهد flow + Lane C graded evidence — ✅ DONE
**Built (TDD, all new files):** `features/create.js` (logic), `screens/create.js`; wired into shell + home card + nav. **Completes the standalone product** — you can now create → seal → it appears in دفتري.
- The **riba linter is the star**: type a penalty/interest clause and عهد **BLOCKS the seal** + offers the halal alternative; remove it → seal enabled. Reuses the **golden `ribaScan`** (untouched). Spine note: auto-drafted terms negate each trigger *directly* («بلا فائدةٍ، وبلا غرامة») to work around the linter's known after-«أو» FP — without touching the golden function.
- Seal via golden `sha256`/`sealBlock`; witnessed record + tamper-verify; «أضِفها إلى دفتري» pushes a real record (create→home loop).
- **Lane C (parallel subagent):** `docs/evidence/EVIDENCE-BRIEF.md` + `docs/evidence/REBUTTAL-PLAYBOOK.md` — graded 🟢9/🟡24/🔴7, web-verified (smartphone 97%→**99%** corrected; Evidence-Law 129 arts/2022; Nafath; the **Alinma wedge** upgraded with real assets). Honestly flags **OT-A1 (no KSA-primary relational demand)** as the #1 gap — a field/team item, not code. No fabrication.
- **Harness (fresh):** core `184/0`; app **9/9 = 332/0** (dom-smoke 64 · offline 44 · create 25 · circle-adv 26 · daftari 44 · determinism 28 · parity 37 · open-loan 35 · properties 29). Demo tripwire OK.

### Batch 5 · Docs + Arabic deck draft + real-browser evidence — ✅ DONE
- **Docs (subagent):** `docs/ARCHITECTURE.md`, `project/ahd-app/README.md`, `docs/PUBLISHABLE-PRODUCT-SPEC.md` — accurate, path-cited; caught that the harness `README.md` is stale (says 92, pre-Circle; real core 184).
- **Deck (subagent):** `docs/DECK-DRAFT-AR.md` — 9-slide Arabic judging-deck draft; used only dossier-verified figures, marked the rest `[للتحقّق]`, fabricated nothing.
- **Real-browser verification:** served `ahd-app` and drove Chromium — all 4 screens (home/دفتري/قرض مفتوح/الدائرة+) render correctly with **0 app console errors** (only a favicon 404). Screenshots in `project/ahd-app/screenshots/`. The دفتري overdue sort, amber chips, and the mode-B Shariah guard all render as specced. Commit `d1e98b3`.

### Batch 4 · Unified home front door — ✅ DONE
`screens/home.js`: brand + spine tagline + live دفتري summary + feature cards + how-it-works + Quranic basis; registered first → default screen. Makes the app one coherent product. App suites 8/8 (dom-smoke 52); core 184/0. Commit `89bb9aa`.

### Batch 3 · Advanced Circle + Lane B test-deepening — ✅ DONE
**Built (TDD, all new files):** `features/circle-adv.js` (logic), `screens/circle-adv.js`; wired into shell.
- **بالأصناف** (by-item split): each item split via `respread` among only its assignees → Σ conserved exactly (no phantom halala/riba).
- **Recurring auto-post**: deterministic posts over given cycle keys (no `Date`); payer excluded from owing; conserved.
- **Graduation قَيْد→عهد**: a circle debt that gets serious **graduates into القرض المفتوح** (open-term witnessed عهد), sealed with the golden primitives, **provenance** linked back to the circle. Beautiful cross-feature composition.
- **Mode-B «نجمع للهدف»**: built only a **pledge sketch** (no pooled deposit held by the bank) with a visible Shariah-review guard → routed to `DECISIONS-FOR-MARWAN.md` (D-3). NOT finalized.
- **Lane B (parallel subagent):** +3 harness suites — property-style (respread/circle/open-loan invariants), reload-determinism, and a static offline/determinism scan of all app source. Confirmed my new files are offline+deterministic-clean.
- **Harness (fresh):** core `184/0`; app **8/8 suites = 283/0** (dom-smoke 49 · offline 35 · circle-adv 26 · daftari 44 · determinism 28 · parity 37 · open-loan 35 · properties 29). Demo tripwire OK. Commits `5984cac` (Lane B), `<this>` (Batch 3).

### Batch 2 · «القرض المفتوح · متى ما تيسّر» (open-term qard hasan) — ✅ DONE
**Built (TDD, all new files):** `features/open-loan.js` (logic), `screens/open-loan.js`; wired into shell.
- A first-class **open-term** type: no schedule, no due, **never overdue** (the heart). Own `openLoanCanonical` (term=open/schedule=NONE/due=none) sealed with the **golden** `sha256`/`sealBlock` (reused, not modified) — seal `b080f79e…`.
- Amount-aware `foldOpenLoan`: partial payments (clamped, no overpay), lender-owned **إبراء** full/partial → FORGIVEN. **Conservation exact** (`principal == paid+forgiven+remaining`) in every state, integer halalas.
- Quiet «المتبقّي» panel (no red, no countdown) + إبراء sheet + sealed-record tamper verify.
- **Harness (fresh):** core `184/0`; app `parity 37 + daftari 44 + open-loan 35 + dom-smoke 40 = 156/0`. Demo tripwire OK. Commit `ee885a9`.

### Batch 1 · «دفتري» creditor home + «تذكيرٌ بالمعروف» — ✅ DONE
**Built (TDD, all new files):** `project/ahd-app/features/daftari.js` (pure logic), `screens/daftari.js`, `app.js`, `app.css`, `index.html`.
- Ledger split لي/عليّ over a deterministic seed of Naif's real debts (café 2,500 overdue · سلطان 1,200 overdue · عبدالله 600 · ريم محفوظة · ماجد خلاف · owes فهد 3,000).
- Overdue computed against fixed AS_OF via a **pure civil-days algorithm** (no `Date`). Deterministic sort: most-overdue → due-soon → settled.
- «تذكيرٌ بالمعروف»: bank-as-sender templates (Tier 1/2), **no day-counter to the debtor**, both debtor buttons (سداد / مهلة), finite merciful cadence ladder (Tier1 → cooldown → Tier2 → STOP → hand back). Grace/forgive/settle route through the engine's existing fold states.
- Amber-not-red overdue chip reuses `TRUST_BAND_AR.overdue` (no new vocabulary).
- **Harness (fresh):** core `135 + 9 + 40 = 184/0`; app `parity 37 + daftari 44 + dom-smoke 27 = 108/0`. Demo tripwire `e2f48467…` OK. Commits `b73ceb7`, `0c36c6e`.
- Deferred to DECISIONS: Screen E «سجلّ وفائي» self-disclosure (`[v2]`, needs Shariah/privacy sign-off).

### Batch 0 · Orientation + isolation + baseline — ✅ DONE
**Planned:** read state, establish isolation (no git existed), confirm baseline green, scaffold the parallel app + extract a parity-tested engine copy.
- ✅ Read state: open-threads, STATUS boards, Circle build-log, harness README, full engine logic region (`index.html` 167–692).
- ✅ Baseline harness BEFORE any change: **135 + 9 + 40 = 184 passed, 0 failed** (exit 0/0/0). Pasted output retained.
- ✅ Demo backed up to `_overnight/backup/index.html.golden`; tripwire hash recorded.
- ✅ Git initialized; `main` baseline committed (382 files); working on `overnight/deepening`.
- ⏳ Next: scaffold `project/ahd-app/`, extract engine (parity test first — TDD), re-run harness, commit.

_Backlog (from brief §4, priority order):_
1. **«دفتري»** creditor home + «تذكيرٌ بالمعروف» nudge (Agent-3) — high value, missing.
2. **«القرض المفتوح — متى ما تيسّر»** open-term qard hasan + إبراء/صدقة (Agent-2).
3. **Advanced Circle**: recurring auto-post, graduation-to-عهد, بالأصناف split (Agent-4/1 v2). _(mode-B pooled deposit → `DECISIONS-FOR-MARWAN.md`, Shariah review.)_
4. **Lane B:** deepen tests (property-style respread/fold, new-screen dom-smoke, determinism re-audit).
5. **Lane C/D/E:** evidence arsenal, architecture/README/deck docs, additive hardening.
