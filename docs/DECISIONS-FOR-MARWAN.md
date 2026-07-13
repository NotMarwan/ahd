# 🧭 DECISIONS FOR MARWAN — things I would not decide alone

> Per the overnight brief §5: anything touching the **spine** (bank role, qard-hasan model,
> no-riba/no-penalty, no-score), any **Shariah ruling** or genuinely-uncertain-halal feature,
> any **golden-pinned function / golden vector**, anything **irreversible**, any **new
> dependency/service/network call**, or anything I'm <90% sure about — gets written here with
> full context + options + my recommendation, then **skipped** so I move to safe work.
>
> **AI issues no fatwa.** Shariah questions cite scholars/standards and are flagged here, never ruled.

**Blocking items at session start: 0.** (Items appear below as I encounter them.)

---

## Standing items I already expect to surface (from `open-threads.md`, pre-existing)
These are not new — they are the round's known open threads that need a human/counsel, surfaced
here so they're in one place. I will NOT act on them autonomously.

- **OT-A1 — the one real Saudi demand voice** (relational-strain shard). Non-code; needs field input.
- **OT-A2 — "why Alinma not Al-Rajhi"** moat strategy. Strategy call, not code.
- **OT-VAL — pre-production validations:** Nafath-AES permission for interpersonal debt · Alinma
  Shariah-board sign-off on the fee + two-contract separation · accredited CSP/TSA. _Counsel only._
- **OT-CITE — exact Evidence-Law article numbers + M/8↔M/18 + 2024–25 court figures.** _Counsel-confirm._

---

## New items raised this session

### D-1 · «سجلّ وفائي» self-disclosure (دفتري Screen E) — DEFERRED, needs sign-off
**Context:** Agent-3's دفتري spec includes Screen E — Naif opting to *show his own* trust band to a new client ("here's that I keep my word"). The spec itself flags it `[v2]` and asks for a Shariah/privacy sign-off, because even owner-initiated disclosure of a reliability signal sits near the engine's hard rule that the trust signal is *own-history only, never exported, never underwrites*.
**What I built instead:** the rest of دفتري (home, tabs, reminders, grace/forgive/settle) — fully on-spine. I did **not** build Screen E.
**Options:** (a) build it strictly as owner-pushed, band-word-only, no third-party pull (my reading: defensible but wants a yes); (b) keep it out of v1 entirely; (c) reshape it (e.g. show only «جديد/وفّى» with no history detail).
**My recommendation:** (a) — but only after a one-line Shariah/privacy confirmation that owner-initiated band-word disclosure does not breach no-export. Until then it stays unbuilt.

### D-3 · Mode-B «نجمع للهدف» pooled collection — SKETCH only, needs Shariah review
**Context:** Agent-4's Circle has two modes. Mode A («أنا دفعتُ عن الجميع» — organizer paid, others owe her) is clean qard hasan and is fully built. **Mode B** («نجمع للهدف معًا» — everyone chips in toward a goal *before* the spend) risks a **pooled deposit held by the bank → أمانة/غرر** concerns. The spec itself defers it (`[v2]`, "يُترك للمراجعة الشرعيّة").
**What I built:** ONLY a **pledge sketch** — `pledgeSketch()` returns pledges with `poolHeldByBank: false`, `model: "pledge-then-pay-at-spend"`, `shariahReviewNeeded: true`, and the screen shows a visible ⚠️ "no pooled deposit — needs Shariah review" guard. I did **not** build any deposit-holding or fund-pooling.
**Options:** (a) ship the "pledge then pay at spend" model (each member pays at the moment of spend, converting to mode-A qard hasan — no pooled custody); (b) drop mode B from v1; (c) a custody model with a licensed escrow/أمانة structure (heaviest, needs board sign-off).
**My recommendation:** (a) — it's the cleanest on-spine path and avoids pooled custody entirely — **pending a Shariah-board confirmation** that pledge-then-pay-at-spend carries no غرر/أمانة issue. Until then, mode B stays a sketch.

### D-4 · The frozen demo's fate after the merge — KEPT (safe path taken), confirm when you wake
**Context:** Tonight's brief lifts the "demo frozen" rule and asks for ONE unified product. The
cleanest target is **`app/` = THE product** (it already supersets the demo). That leaves
`demo/index.html` (the byte-pinned presenter build) needing a fate: retire it, move it to
`legacy/`, or keep it in place and relabel.
**What I did (safe path):** I **kept `demo/index.html` exactly where it is, byte-for-byte
untouched** (tripwire still `e2f48467…`), and only **relabelled** it as a frozen/legacy presenter
reference in its README + the new root README. I did **not** delete or move it, because (a) deletion
is irreversible and (b) moving it breaks the tripwire path `_overnight/backup/demo.sha256`.
**Options for you:** (a) keep as-is — a safe, known-good presenter fallback that still runs the
golden path live (my recommendation); (b) retire it into `legacy/` and re-point/remove the tripwire
(reversible but touches the safety net — your call); (c) delete it entirely (irreversible — I will
not do this alone).
**My recommendation:** (a). One product to ship (`app`), one safe fallback to demo from. Nothing
is lost; the merge reads as one product because `app` is the single front door.

### D-2 · Digit system for Arabic numerals — ✅ ADDRESSED (now a user setting)
The دفتري reminder/amount copy renders **Western digits with grouping** (`2,500`) to stay byte-consistent with the engine's golden `fmt()`. The Agent-3 spec's illustrative copy used Arabic-Indic (`٢٬٥٠٠`). Both are deterministic; this is a Design-layer choice.
**Resolution (Phase 2 · F4):** rather than decide it unilaterally, I shipped an **Arabic-Indic digit toggle** in the new **الإعدادات** screen — a pure, deterministic DISPLAY map (`٠١٢٣ ↔ 0123`) applied app-wide on top of the golden `fmt()`. **The engine bytes never change** (seals are computed on content, not glyph shape — verified in a test), so it's safe. **Default stays Western** (engine-consistent), and the user flips it if they prefer. If you'd rather the DEFAULT be Arabic-Indic, that's a one-line change (`digitMode: "arabic"`). No longer blocking — it's now your/users' choice in-app.

### D-5 · The deepened riba linter — two on-spine judgement calls (FYI; my reading is below)
**Context (Deepen sprint):** I deepened the riba linter from the golden 4 rules to an **additive layer** (`features/riba-lint.js`) that wraps the golden `ribaScan` (golden untouched, parity green) and catches far more disguised riba (synonyms عائد/مردود/ريع/مكسب، payment-for-time، rollover، disguised fees، قرض جرّ نفعًا، classical جاهلية) plus the negation/«أو» edge cases (distributed negation reads CLEAN; negated-negation «ليست بلا فائدة» re-BLOCKS). Validated against a **multi-agent adversarial corpus** (0/60 block-misses). Two calls I made, surfaced for your awareness — neither weakens the spine (both favour catching riba):
1. **Conservative percentage/أرباح in a loan clause.** Any «٪» or «أرباح» inside a عهد clause is flagged **even when arithmetically unrelated** to the money (e.g. «نسبة إنجاز المشروع ٨٠٪», «أرباح مشروعٍ منفصل»). I chose to keep flagging (safer than risking a real «٪» slipping through). Cost: a rare false-positive on a contrived clause; the user just rephrases. **Option** if you prefer fewer FPs: clear «نسبة X» when X is a known non-money noun. My reading: keep conservative.
2. **Four genuinely-debatable corpus clauses** (e.g. an UNCONDITIONAL gift after repayment «هديةٌ تقديريةٌ غير مشروطة», «شكرًا للمقرض ... وإن لم يَشترط») are **Shariah-debatable** — voluntary-gift-after-loan vs. customary-expectation riba. **AI issues no fatwa**, so these are **NOT asserted** in the test corpus and **NOT hard-blocked by structure**; they need a scholar's read. Listed here, ruled by no one. (The linter still flags them only if an explicit trigger/condition appears.)
**Nothing here touches the golden functions, the vectors, or the netting.** The golden `ribaScan` is reused as an authoritative *floor* (when it blocks and there is no negation, the layer blocks too).

### D-6 · نموذج الأجرة (fee model) — كيف يربح عهد دون مساس بالقرض — NEEDS SHARIAH SIGN-OFF before saying it as a promise
**Context (2026-07-11, owner-lessons round):** Marwan asked honestly how the project makes money. The answer already sketched in the Sadu prototype (`application/prototypes/src/s17-settings.html` footnote) is **two separate contracts**: the qard hasan itself carries ZERO charge forever (spine), while documentation/custody/netting is a **flat service fee (أجرة)** — never a percentage of the loan, never growing with delay, contractually separate. `docs/OWNER-LESSONS.ar.md` §4 develops this into 5 revenue paths (flat seal fee, circle subscription, exhibit-export fee, B2B white-label licensing, Musaned/payroll wedge).
**The decision that is YOURS + a scholar's:** whether the two-contract separation (قرض حسن + أجرة توثيق ثابتة) is clean enough to state publicly as the business model. Classical basis exists (ujrah on real work; notary-fee analogy), and the fee never touches the loan — but «كل قرض جرّ نفعًا» arguments about lender-side services need a real Shariah body's reading. **Until signed off: pitch it as "our planned model, pending Shariah board review" — never as a settled fact.** No code depends on this decision; nothing is built that charges anyone.

### D-6a · Phase-A revenue SURFACES built (2026-07-12) — the numbers are DISPLAYED (badged pending), still nobody is charged
**Context:** Following the revenue-readiness plan (`docs/superpowers/plans/2026-07-12-revenue-readiness-plan.md`, built by three deep-dive agents), Phase A shipped the spine-safe revenue surfaces so the money story is *visible* to a judge before 18 July: a pure flat-fee engine (`app/features/billing.js`), a two-line seal receipt (`app/features/fee-receipt.js`) surfaced at the moment of seal, and a plans/paywall page (`app/screens/plans.js`). **What is built is DISPLAY only — no billing, no charge, no rail.** Every paid tier and every fee object carries `shariahReviewNeeded:true` and renders the visible «قيد المراجعة الشرعيّة» badge; the seal receipt shows «الزيادة على القرض: 0.00» beside «أجرة توثيقٍ ثابتة: 5.00» as two contractually-separate, never-summed lines. Harness green (1954/0); frozen demo untouched (tripwire `e2f48467…`).
**Numbers now shown on-screen (all proposed, none approved):** flat seal أجرة **5.00 ر.س**; دفتري بلس **12 ر.س/شهر**; الدائرة **19 ر.س/شهر** (paid by the organizer); المؤسسة/الوقف **2,900–9,900 ر.س/شهر** or **4 ر.س/مقعد**; white-label bank licence **250k–1M ر.س/سنة**. Any of these said on stage is a promise → must stay labelled «مقترح، قيد المراجعة الشرعيّة».
**The questions that are YOURS + a Shariah board's (do not state as settled fact until answered):**
1. **[the #1 question]** Is the two-contract separation (قرض حسن at zero + a flat, actual-direct-cost, tenor-independent documentation أجرة on a separate wakala contract) clean of the Hilah / «كل قرض جرّ نفعًا» objection under **AAOIFI SS-19** (cl. 10/3/2 no-linkage-to-principal, cl. 7/8 no-bundling), so it can be stated **publicly** rather than only "pending review"?
2. **Institution-SaaS path** (new, arguably cleaner): a flat monthly software أجرة paid by an *organization* running a qard-hasan fund — payer is a kian buying software, not a borrower charged on a loan. Does an org-side software fee on a qard-facilitation tool raise any «جرّ نفعًا» concern?
3. **The approved flat figure + methodology** (≤ actual direct cost ≈ 2–5 ر.س, overhead excluded, tenor-independent). Is 5 ر.س defensible, and by what cost basis?
4. **Who pays the fee** — lender, borrower, or third-party institution — and is that choice Shariah-material? (An institution paying is materially safer than charging the borrower.)
5. **Float / custody return** on briefly-held in-flight **amana** settlement balances — permissible revenue, and under what custody/consent structure? (riba-adjacent.)
6. **[extends D-3] Institutional pooling** — may an institutional Circle / charity qard-fund ever **hold pooled money in custody**, or must it stay strictly pledge-then-pay-at-spend?
7. **Consumer free/premium boundary** — confirm documenting/sealing/settling/the neutral evidence bundle for a قرض stay **free forever**; «دفتري بلس» may only sell **non-loan** convenience features. Approve exactly which features sit behind the paywall.
8. **Value-added referrals** (takaful / wasiyyah) — clean only if the referred product is itself Shariah-compliant and the referral is **not tied to or conditioned on the loan**.
9. **White-label licence spine-clause** — the licence to any third-party bank/fintech must **contractually forbid** the licensee bolting on riba, penalty, delay-charges, or credit-scoring/trust-number export. Approve the spine-preservation clause before licensing.
**My posture:** nothing above is decided; the code embodies the *questions* honestly (badged, never asserted). No billing code exists and none should before this signs off (blocks Phase B). Full analysis + fiqh notes: the revenue-readiness plan §3 (fiqh guardrails) + §7 (these items) and `_meta`-adjacent scratch reports.

### D-7 · Multilateral netting/settlement — does bilateral مقاصّة/حوالة fiqh extend to N-way? — NEW question, needs a scholar (2026-07-13, W4 feasibility pass)
**Context:** Building `docs/evidence/shariah-basis.md` (mechanic-by-mechanic Shariah citations, feasibility-gate work), I mapped عهد's settlement/netting screen (`app/features/settlement.js`, `app/screens/settlement.js`) to its fiqh basis: **المقاصّة (set-off)** — offsetting mutual same-kind, same-currency debts, valid with consent — and **الحوالة (transfer of debt)**, which the settlement screen already frames each leg as («حوالةٌ بالتراضي» — consented novation). Both concepts are well-established in classical fiqh **for two parties**. عهد's actual netting engine, however, is **multilateral**: it collapses obligations across an entire Circle (N parties) into a minimal set of transfers in one pass (the 9→2 compression shown on stage), preserving every member's net position.
**The question that is a scholar's, not mine:** does the bilateral fiqh of مقاصّة/حوالة extend cleanly, with the same conditions, to a **multi-party, single-pass network settlement** — or does simultaneously netting more than two parties' claims introduce an additional consent/gharar condition that bilateral حوالة never required? **No fatwa is issued here** — I did not find an AAOIFI standard number in the project's own vetted arsenal (`legal-shariah-citations.md`) that pins a multilateral case specifically, so I did **not** invent one; the mechanic is cited to the general (bilateral-established) مقاصّة/حوالة concepts only, graded honestly, and this extension question is flagged, not answered.
**What I built:** nothing new in the engine — this is a **citation-mapping and honesty exercise only** (`docs/evidence/shariah-basis.md` §ج + the on-app «الأساس الشرعي» screen, `app/features/shariah-basis.js`). The netting engine itself is unchanged (golden functions untouched).
**My recommendation:** ask whoever reviews D-6a's Hilah question to also confirm this in the same sitting — it is a natural extension of the same review, not a separate blocking item, since the netting logic doesn't change based on the answer (only the *framing on stage* would, if a scholar flags an additional condition).
