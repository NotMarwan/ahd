# Front 1 — Pitch & Demo Kit Implementation Plan (JL-1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A championship 3-minute Arabic pitch + solo-choreographed live demo + org-template deck + hostile-Q&A kit — the surface the judges actually experience on 18 July.

**Architecture:** All artifacts live in a new `docs/pitch/` directory (content is versioned markdown; the .pptx is built from the org's mandatory 14-slot template per `_meta/amad2026-deck-prompt-for-claude-design.md`). The script drives BOTH builds (frozen demo → live app) exactly as `docs/PRESENTER-GUIDE.md` does today, re-choreographed for one person speaking while driving. Spec: `docs/superpowers/specs/2026-07-07-judge-lens-win-standard-design.md` (Front 1).

**Tech Stack:** Markdown (Arabic-first), anthropic-skills:pptx for the deck build, judge-panel review per `docs/JUDGE-LENS.md`.

## Global Constraints

- **Language:** Arabic-first (operator decision 2026-07-07). English only for technical terms where natural.
- **Stage crew:** ONE person pitches AND drives (operator decision 2026-07-07) — every beat must be speakable while clicking.
- **Honesty ceilings (verbatim from the deck prompt — never violate on any slide/line):** Nafath/Sarie/emdha are *designed against real spec, currently simulated*; court admissibility is *presumptive*; Shariah clearance *pending board*; adoption *is validation work ahead*. Never present a 🔴 stat as fact; never present US figures as Saudi.
- **Fresh numbers only:** test coverage = **core 184/0 + app 1,289/0 = 1,473/0 assertions** (recompute at build time: `node tests/app/run-app-tests.cjs` summed + core 184); internet penetration **99.0% (DataReportal 2025)** — the ~97%/GASTAT-2017 figure is RETIRED; court stats **58.6% of 571,251 cases · SAR 115.4B** labeled with their 2020–21 vintage (OT-CITE refresh pending); Najiz 43M+ (H1 2024); Nafith 800k+ سند (year 1).
- Spine + JUDGE-LENS govern all copy: no riba wording, no trust numbers, no fatwa claims; «البنك يشهد ولا يُقرض» is the one-sentence identity.
- Commit per task; structure-check green after each docs change.
- **Screenshot slots** in the deck are filled with current-best (`app/screenshots/audit/09+10` tamper pair, `03-daftari`, `ahd-settlement`, `deepening/ahd-home-capstone`, `premium/*`) and **re-shot after Front 2 (JL-2) lands** — mark each with `<!-- reshoot-after-JL-2 -->`.

## Operator inputs (blockers, requested 2026-07-07)

- **B1:** The org's mandatory 14-slot .pptx template file → place at `docs/pitch/template/amad-template.pptx` (blocks Task 2).
- **B2:** Team member names (as they should appear) + photos → `docs/pitch/team/` (blocks Task 2 slide 2; Task 1 uses `{TEAM}` markers ONLY for slots 1–2, resolved in Task 2).
- **B3 (nice-to-have):** Official pitch slot length if announced. Until then the kit ships 3-min primary + 5-min extended + 90-sec emergency cuts.

---

### Task 1: Deck content map — Arabic copy for all 14 template slots

**Files:**
- Create: `docs/pitch/deck-content-v2.md`

**Interfaces:**
- Consumes: slide narrative from `docs/DECK-DRAFT-AR.md` (9 slides), slot structure from `_meta/amad2026-deck-prompt-for-claude-design.md` (14 slots), graded numbers from `docs/evidence/EVIDENCE-BRIEF.md`.
- Produces: final Arabic copy per slot, consumed verbatim by Task 2 (pptx build) and Task 3 (script's data beat uses the same numbers).

- [ ] **Step 1: Write the slot map.** One section per template slot (1–14), each containing: final Arabic copy (headings, bodies, callouts), the screenshot assignment (exact repo path + `<!-- reshoot-after-JL-2 -->` marker), and a `Source:` line naming where each number/claim comes from. Slot-to-narrative mapping (from the digest — deviate only with a written reason in the file):
  1. Title → «عهد» + tagline «كلمتك محفوظة، وعلاقتك محميّة» + `{TEAM}` name
  2. Team → `{TEAM}` members (4 names + photos, resolved in Task 2)
  3. TOC → 7 items mirroring slots 4–13
  4. Problem & Solution → DECK-DRAFT slides ١+٣ (pain: shame/no-docs/riba anxiety → the witnessing bank «يَشهد لا يُقرض»)
  5. Data/evidence → 3 guiding Qs + 3 stat callouts: 58.6% of 571,251 execution cases (سندات لأمر, MoJ via Argaam, 2020–21) · SAR 115.4B (same vintage) · 99.0% internet penetration (DataReportal 2025). NO placeholder "0%" survives.
  6. Technologies → 3×2 grid: SHA-256 (WebCrypto, FIPS-vectors-verified) · deterministic netting engine (9→2, conservation-proved) · riba linter (0/60 adversarial corpus) · Nafath/Sarie seams (simulated, real-spec) · offline-first PWA-grade app · 1,473/0 automated assertions.
  7. Idea description → tagline + paragraph from DECK-DRAFT slide ٣ + phone-frame screenshot (`deepening/ahd-home-capstone.png`).
  8. How data obtained/used → the honest data story: MoJ/Najiz public figures + in-product deterministic analytics (netting compression, conservation) + demand-survey kit as the validation instrument (OT-A1 named as pending fieldwork, not fact).
  9. Alignment with theme → Alinma partner framing: qard-hasan witnessing = Islamic-bank core mission; hits Use-of-AI + Data-Analysis + CX requirements.
  10. Summary → the one-sentence identity + the 4 surfaces (دفتري · القرض المفتوح · الدائرة+ · المقاصّة).
  11. Testing/Validation → 1,473/0 assertions · byte-determinism · golden-vector drift guard · tamper vectors · real-Chromium 0-console-error pass; validation-ahead items named honestly (board sign-off, Nafath permission, demand survey).
  12. Demo/screenshots → tamper pair `audit/09-proof-verified.png` + `audit/10-proof-tampered.png` (the strongest visual moment) + `ahd-settlement.png`.
  13. Challenges & future → 3 boxes from DECK-DRAFT slide ٩ asks (Shariah board · regulatory confirms · pilot slice).
  14. Thank-you → tagline large, logo alone.

- [ ] **Step 2: Verify.** `grep -n "0%\|TBD\|placeholder\|TODO" docs/pitch/deck-content-v2.md` → only `{TEAM}` markers remain (slots 1–2). Confirm every stat line has a `Source:` and every 🔴-graded claim appears ONLY under validation-ahead framing. Run `cd tests && node structure-check.cjs` → 14/0.

- [ ] **Step 3: Commit.** `git add docs/pitch/deck-content-v2.md && git commit -m "feat(pitch): deck content map — all 14 org-template slots in Arabic (JL-1)"`

### Task 2: Build the .pptx from the org template ⛔ blocked on B1+B2

**Files:**
- Create: `docs/pitch/ahd-amad-deck.pptx`
- Consume: `docs/pitch/template/amad-template.pptx` (B1), `docs/pitch/team/` (B2), `docs/pitch/deck-content-v2.md`

- [ ] **Step 1:** Invoke `anthropic-skills:pptx`. Unpack the template, inventory shape IDs + hidden paragraphs per slot (the deck prompt warns of multi-paragraph runs).
- [ ] **Step 2:** Fill all 14 slots from `deck-content-v2.md`, resolving `{TEAM}` from B2. Insert screenshots at prescribed slots with `reshoot-after-JL-2` noted in speaker notes.
- [ ] **Step 3: Verify zero placeholders.** Re-extract ALL text from the built .pptx; grep for the template's original placeholder phrases (English + Arabic, listed in the deck prompt) → zero hits; grep for `{TEAM}` → zero hits.
- [ ] **Step 4:** Commit the .pptx + a `docs/pitch/deck-build-notes.md` recording shape-ID mapping (so the post-JL-2 reshoot pass is mechanical).

### Task 3: The solo script — 3-minute primary + 5-minute extended + 90-second emergency

**Files:**
- Create: `docs/pitch/script-ar.md`

**Interfaces:**
- Consumes: demo path from `docs/PRESENTER-GUIDE.md` (9-step golden path), numbers from Task 1 slot 5/11 (identical figures — one source of truth).
- Produces: the beat structure Task 5 (presenter guide) and Task 6 (judge panel) review.

- [ ] **Step 1: Write the 3-minute primary script** — full Arabic, word-for-word, 360–420 spoken words, as a choreography table `⏱ | قُل | افعل | الشاشة`, beats:
  - 0:00–0:20 hook: the human moment + court-scale numbers + «البنك يشهد ولا يُقرض»
  - 0:20–0:50 أنشئ عهدًا: riba-linter LIVE block (inject penalty clause → seal grays red → fix → seals) — the ورع moment
  - 0:50–1:20 the seal + on-stage tamper: change one digit → «✗ عبثٌ مكشوف» in red — the signature moment
  - 1:20–1:50 mercy: «أحتاج وقت» grace (zero added, 2:280) + «🤍 اجعلها صدقة» forgiveness
  - 1:50–2:20 المقاصّة ⭐: 9 tangled obligations → 2 transfers, conservation line spoken («كل ريال محفوظ — ١٬٨٠٠ صارت ٩٠٠ منقولة»)
  - 2:20–2:40 data beat: 58.6%/115.4B (vintage-labeled) + 1,473/0 assertions + 99.0% penetration
  - 2:40–3:00 Alinma close: two-contract model, the asks, tagline.
  Every `افعل` cell names a real screen id (`create`, `proof`, `daftari`, `open`, `settle`…) and the exact click. Solo rule: no beat requires speaking and navigating simultaneously for >3s; navigation happens on breath pauses.
- [ ] **Step 2: Write the 5-minute extended variant** — inserts دفتري bank-reminder beat + standing/borrower beat + Q&A-bait pauses; marked `[+2:00 EXTENDED]` blocks around the primary skeleton.
- [ ] **Step 3: Write the 90-second emergency cut** — hook → tamper → 9→2 → close; plus the **mishap playbook**: app is fully offline (no network dependency to fail), `Esc`/`Home` demo reset, static screenshot fallback path (`docs/pitch/fallback/` — copy the 6 key screenshots there).
- [ ] **Step 4: Verify.** Word-count the primary script (target 360–420); check every referenced screen id exists in `app/app.js`'s registry; numbers match Task 1 exactly. `cd tests && node structure-check.cjs` → 14/0.
- [ ] **Step 5: Commit.** `git commit -m "feat(pitch): solo Arabic script — 3min primary + 5min extended + 90s emergency (JL-1)"`

### Task 4: Rebuttal refresh + hostile-judge additions + presenter cards

**Files:**
- Modify: `docs/evidence/REBUTTAL-PLAYBOOK.md`
- Create: `docs/pitch/top6-cards-ar.md`

- [ ] **Step 1: Add the missing objections** (with sourced answers, same format as existing entries):
  - Q-H1 "أين تحليل البيانات؟" — the scored criterion: answer = in-product deterministic analytics (netting compression, conservation, aggregates) + MoJ-scale evidence + survey instrument ready (never fake a dataset).
  - Q-H2 "بنيتم هذا قبل الهاكاثون؟" — pre-built allowed (registration submitted the idea); the 72h are for integration/polish; every line is ours, gate-proven.
  - Q-H3 "لماذا نصدّق أرقام اختباراتكم؟" — live: run the gate on stage if challenged (`node tests/...` — deterministic, seconds).
  - Q-H4 "ما نموذج الربح إن لم تكن فائدة؟" — sharpen the existing Q-G1 answer to one breath: subscription/service-fee at cost per AAOIFI SS-19 + retention/CX value to Alinma (board-gated).
- [ ] **Step 2: Re-grade stale entries** — retire the 97%-smartphone figure wherever cited (99.0% DataReportal 2025); mark court figures' vintage; confirm the three "strongest answers" still open the file.
- [ ] **Step 3: Write `top6-cards-ar.md`** — the 6 most likely judge questions with ≤2-breath Arabic answers (Q-A1 demand, Q-A2 why-Alinma, Q-B4 default, Q-D2 Splitwise, Q-H1 data, Q-H4 revenue), formatted as printable cards.
- [ ] **Step 4: Commit.** `git commit -m "docs(evidence): rebuttal refresh + hostile-judge Q&A + top-6 presenter cards (JL-1)"`

### Task 5: Presenter guide rewrite for the solo choreography

**Files:**
- Modify: `docs/PRESENTER-GUIDE.md`

- [ ] **Step 1:** Replace the golden path with the Task 3 primary script's beat table (guide = the operational superset: setup, reset keys, both builds, per-beat fallbacks); keep the 5-min/90-sec variants referenced. Add the three newest screens (`borrower`, `maroof`, `standing`) to the "if a judge asks" appendix, and a marked slot: `[Front-3: أثر عهد analytics beat lands here — JL-3]`.
- [ ] **Step 2:** Verify + commit. `git commit -m "docs(pitch): presenter guide — solo choreography, variants, fallbacks (JL-1)"`

### Task 6: Judge-panel review round (the lens applied to the kit)

**Files:**
- Modify: `_meta/STATUS.md` (DONE line + scores), `_meta/OPEN-ITEMS.md` (JL-1 status + any new JL items)

- [ ] **Step 1:** Run the JUDGE-LENS procedure: six parallel reviewer agents (5 criteria + tired-judge memorability) over `deck-content-v2.md` + `script-ar.md` + the updated guide + (if built) the .pptx text. Each returns score/weakest-moment/one-fix.
- [ ] **Step 2:** Skeptic agent adversarially verifies findings; fix everything verified; re-score anything that changed.
- [ ] **Step 3:** Record scores in the STATUS DONE line (per the scoring protocol); JL-1 → `in review`/`done` in OPEN-ITEMS (below-8 residuals become new JL items).
- [ ] **Step 4:** Full `structure-check` + tripwire + commit + push.
