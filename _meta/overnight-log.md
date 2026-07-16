# 🌙 OVERNIGHT-LOG — Ahd autonomous deepening

> Running log of the overnight session. Newest batch at the **top of the log section**.
> Maintained continuously. Harness numbers pasted are **real command output**, not claims.

---

## 2026-07-16 · Competitive capability adoption — benchmark features, gate 3175 → 3380

Branch `claude/competitive-features-plan-50ab83` (worktree; **NOT merged to main — awaiting
owner review**, توجيه المالك). Source: the seven benchmark dossiers (Zirtue, Splitwise,
Hakbah, MoneyFellows, ناجز, DocuSign, سُلفة) — capabilities adopted **قدرةً قدرةً**, every
rejected pattern (custody, fees, execution, scoring, auto-fatwa) stayed rejected.

**Nine new pure DI feature modules** (each TDD — failing test first — with its own suite):
- `next-step.js` — «وش الوضع؟» agreed/happened/next strip + عهد-XXXX reference (Zirtue G1 + ناجز G3); wired into home, daftari & borrower rows, proof header.
- `review-gate.js` — frozen «راجع قبل الختم» summary + absent-list + preview fingerprint before create/request seals (ناجز + DocuSign G2).
- `pay-confirm.js` — «تصديق السداد»: claim with مؤيد → creditor accepts (balance moves ONLY then, via payWhatEased) or rejects with fixed-enum reason opening «محلّ خلاف» (ناجز G4).
- `split-modes.js` — exact/percent/shares splitting, halala-conserving, Arabic validate + preview-before-save in اليومي (Splitwise G5).
- daftari feature: additive `peopleOf`/`filterByPerson` + person chips composing with status filter (Splitwise G6).
- `jamiya-invite.js` — per-member invitation cards with ALL terms + absent-list; unanimous RECORDED acceptances gate the seal, one decline re-locks it (Hakbah G7).
- `jamiya-changes.js` — append-only numbered change log (consented swap re-seals a new version, payments replay) + verify() (Hakbah G8).
- `jamiya-goal.js` — descriptive goal + progress with fixed «لا وعد مالي» line + scenario compare before inviting (MoneyFellows G9, adapted).
- `drafts.js` — recurring circle-adv cycles propose DRAFTS; publish only on explicit approval (Splitwise G10).
- `settle-consent.js` — per-leg interactive consent (both parties) gating «اعتماد المقاصّة» (G11).

**Tone (G12, توجيه المالك «عصري معتدل»):** front-door hero speaks plain Arabic (بلا فوائد،
بلا غرامات، بلا تصنيف); the verse strip became one quiet «الأساس الشرعي» link — verses stay
in their semantic homes (shariah-basis, forgiveness, proof citation). Identity tagline untouched.

**Gate (real output):** `AHD GATE ✅ 3380/0` — core 184/0 + structure 14/0 + app 3,182/0
(94 suites) + tripwire OK (`e2f48467…`). Banners swept everywhere (README, deck, script,
evidence, vault, CLAUDE.md); project-map +9 features; drift + readme contracts green.
Live browser verification on the worktree app (port 8125): all seven new surfaces render,
zero console errors.

**Docs:** spec `docs/superpowers/specs/2026-07-16-competitive-capability-adoption-design.md`,
plan `docs/superpowers/plans/2026-07-16-competitive-capability-adoption.md` (13 tasks, all done).

**Judge-lens (five bars, this branch's surfaces):** Innovation 8 — consent-everywhere
(invites, legs, تصديق) is a visible differentiator; Feasibility 9 — everything runs offline,
one command proves it; Impact 8 — the daily-use loop (split modes, person filter, next-step)
makes the app habitual, not ceremonial; Presentation 8 — every new control is clickable in
the demo path with محاكاة honesty tags; Alignment 9 — every benchmark rejection enforced in
code and stated on-screen. No bar <8 → no new JL- item.

## 2026-07-14 · Master Spec Kit specification and planning — approved for gated implementation

- Queried the existing Graphify graph, then reviewed current app registration, the 35-unit
  navigator map, tests, server, Open-Witness protocol, evidence, decisions, open items, and
  Judge Lens.
- Found and corrected specification drift: the current app registers **21 screens**, while
  older prose still cites three, 12, 14, or 20.
- Added Ahd constitution v1.0.0 and synchronized Spec Kit templates.
- Created `specs/001-ahd-product-system/spec.md`: 10 user stories, 142 unique normative
  requirements, 13 success criteria, 21 entities, lifecycle statuses, decisions, dependencies,
  evidence mapping, transitions, and exclusions.
- Added a 24/24 passed specification checklist, a 47/47 passed formal reviewer checklist, and a
  clarity review with 13 evidence-backed findings and improvements.
- Added plan, research, 21-entity data model, four boundary contracts, quickstart, and 124
  dependency-ordered TDD tasks. Direct task references cover 142/142 requirements with no duplicate,
  invalid, pathless, or constitution-unbound task.
- Added four detailed execution plans for specification governance, local-server safety,
  production readiness, and stage readiness under `docs/superpowers/plans/`.
- Cross-artifact analysis: zero critical conflicts, zero untraced requirements, zero missing
  decision mappings, and zero unchecked plan gates.
- Gate investigation found `structure-check.cjs` traversing an independent nested Git
  worktree. TDD proof failed first; minimal fix excludes `.worktrees` while retaining rogue
  status-file detection.
- Fresh full gate: **AHD GATE ✅ 2869/0**; drift meta-check 12/0; frozen demo tripwire OK;
  intact Open-Witness fixtures valid, tampered fixture rejected, and live HTTP smoke green.
- No product, golden function, golden vector, or Shariah ruling changed.

Review entry: `specs/001-ahd-product-system/clarity-review.md`.

## 🌌 DEEPEN SPRINT (newest — depth, not breadth; reshapes guarded, adds none)

**📦 Repo (pushed):** **https://github.com/NotMarwan/ahd** · branch `overnight/deepening` · HEAD `ecacb11`.
Token gitignored, never printed. Pushed after every lane; remote always holds the latest green state.

### ⭐ READ ME FIRST — what the deepening did (8 lanes, every one TDD'd + real-browser-verified + pushed)
**Mission:** take every existing feature to a deeper level, weave the 5 newest natively, reshape where it
genuinely helps — spine inviolable, gate green throughout. **No new features added; existing ones deepened.**

| # | Feature | What got deeper |
|---|---|---|
| 01 | **أنشئ عهدًا · riba linter** (the centerpiece) | additive `riba-lint.js` over the golden scan — now catches synonyms/disguised-fees/قرض-جرّ-نفعًا/جاهلية, fixes the negation/«أو» edge cases, **0/60 adversarial-corpus misses**. Independently **code-reviewed**, findings applied (Deepen-01b). |
| 02 | **دفتري** | now the **hub**: grouped/dignified sections · a reconciling **net** balance (exact halalas) · filter chips · the **ask (طلب عهد)** woven in (a sent request shows as a pending row). |
| 03 | **سِجلّ الشهادة** | the **connective tissue**: a per-عهد **story** view, links out to **إثبات/خلاف/الدفتر**, focus mode + a دفتري→سجلّ reverse link. |
| 04 | **حافظة الإثبات ↔ محلّ خلاف** | **interconnected**: provenance (سَنَد), a **precise tamper diff** (the changed field + diverging seals), and the proof opens from الخلاف as the **neutral exhibit**. |
| 05 | **الإعدادات** | beyond the digit toggle: **«إخفاء المبالغ» privacy** (display-only, byte-safe) · «ما يفعله عهد» · the two-contract **model note**. |
| 06 | **المقاصّة** | a rigorous, judge-convincing **conservation proof** — every member's net **preserved** (9→2, money-moved 1,800→900). |
| 07 | **القرض المفتوح** | the **«متى ما تيسّر» journey**: a paid·صدقة·باقٍ progress bar (no %) + a dotted payment history. |
| 08 | **الدائرة** | a real **group reminder that never names the late** (a tested dignity guarantee). |
| 09 | **الرئيسية** (cross-cutting front door) | a live **standing strip** surfacing the deepened product at a glance — **صافي مركزك** (net, exact halalas) · **سجلّ الشهادة** (witnessed-moments count) · **سجلّ وفائك** (the standing WORD, never a number) — each a tappable shortcut. |
| 10 | **الدائرة+** | a **per-item conservation proof** for بالأصناف (each صنف's shares sum to its cost exactly — «بلا كَسْر، لا ربا») + a **seamless قَيْد→عهد→قرض مفتوح** weave (a graduated share opens in the deepened open-loan view). Mode-B (D-3) untouched. |

**🟢 Gate (fresh, real output):** core **184/0** (135+9+40) · app **29/29 suites = 1008/0** · **1192 total**
(was 817 at sprint start) · demo tripwire `e2f48467… OK` · **0 console errors** across all 12 screens (real Chromium).
**Every feature — the centerpiece, all 5 new, and every core feature — is now deepened.**

**🔍 Final code-review** (fresh subagent, spine + determinism sweep of all 7 new pure-logic files): timeline /
proof / settlement / settings / circle came back **clean**; one real **float-accumulation** bug found in
`daftari.summaryTiles` (pre-existing; summed SAR floats) → **fixed** to accumulate integer halalas (+regression
test: `0.10 + 0.20 == 0.30`). No spine leaks, no golden mutation, no Date/Math.random/Intl anywhere.

**🖼️ New screenshots:** `project/ahd-app/screenshots/deepening/` (linter · دفتري hub · timeline stories · proof
exhibit · settings · muqassa · open-loan · circle reminder).

**🧭 Needs your decision:** `DECISIONS-FOR-MARWAN.md` — **D-5** (the linter's two on-spine judgement calls: a
deliberately-conservative ٪/أرباح flag + 4 genuinely-debatable corpus clauses left to a scholar — no fatwa
issued). Standing **D-1/D-3** (Shariah-gated) untouched. Nothing auto-merges to `main`.

**💎 Single most valuable deepening:** the **riba linter** — it went from a 4-rule string-match (easily fooled)
to a layer that catches disguised riba across the adversarial corpus (0/60 misses) AND stops wrongly blocking
honest clauses (the negation/«أو» edge cases), while never touching the golden function. It's the product's
Shariah conscience, and it's now genuinely hard to fool.

**▶️ How to review:** `git log main..overnight/deepening --oneline` · run the app
(`node app/_serve-app.cjs` → http://localhost:8124) · run the gate from
`tests/`: `node run-tests.cjs && node offline-check.cjs && node dom-smoke.cjs && node app/run-app-tests.cjs`.

### ✅ Deepen-01 — the riba linter (the centerpiece) is now genuinely hard to fool
**What got deeper.** The golden `engine.ribaScan` is just 4 regex rules + an *immediate-preceding-negation*
guard — easily fooled (synonyms, disguised fees, conditional benefit, classical جاهلية) and it has two real
defects: it **lets «ليست بلا فائدة» (= with interest) through**, and it **wrongly blocks «بلا فائدةٍ أو
زيادة»** (distributed negation). Since `ribaScan` is golden/parity-pinned, I built an **additive layer**
`project/ahd-app/features/riba-lint.js` that *wraps* it (golden untouched) and adds:
- a **normalize pass** (strips harakat/tatweel, folds letter variants) → defeats «فـائـدة»-style obfuscation;
- **extended triggers** the golden 4 miss — يield synonyms (عائد/مردود/غُنم/ريع/مكسب/علاوة), payment-for-time
  & rollover (مقابل المهلة، كلّما طال الأجل زاد، يتراكم/يكبر), disguised fees tied to the loan (رسوم تأجيل،
  تأمين على القرض، أتعاب عن كل ألف، مصاريف ما دام الدين قائمًا)، قرض جرّ نفعًا، «يردّ أكثر ممّا أخذ»،
  per-principal-unit charges، liquidated late penalty (بدل إخلال);
- a **negation-aware analyzer**: distributed negation across أو/و lists (incl. multi-word items & noun+adjective
  «من غير فائدةٍ ربويةٍ») reads **CLEAN**; negated negation «ليست بلا فائدة» and litotes «غير معفيٍّ من الغرامة»
  / «لا يخلو من فائدة» re-**BLOCK**; «بـ» re-asserts («وبغرامة») unless itself negated («لا بزيادة»).
- **Golden reused as an authoritative FLOOR** — when golden blocks and there is no negation present, the layer
  blocks too. So the layer is a strict **superset** of golden's true-positives; the only golden-blocks it clears
  are genuine negation cases.

**Reshape (guarded).** `features/create.js` + `features/request.js` now route the linter through `RibaLint.scan`
(DI, with a golden fallback so the seal gate can never break offline). `screens/create.js` now shows **ALL**
violations (a count + each one's halal alternative), plus a second demo button «🧪 صياغة ملتبسة (مموّهة)» that
injects a disguised clause to prove the deeper catch live.

**Validated by a multi-agent adversarial corpus.** An 8-agent fan-out (7 attacker angles + a synthesiser)
generated 96 labelled Arabic clauses the naive linter mishandles. The hardened layer now scores **0/60
block-misses** and the only remaining "false-positives" are **intentional conservative blocks** (any ٪/أرباح
in a loan clause — see `DECISIONS-FOR-MARWAN.md` **D-5**). 4 genuinely-debatable clauses → D-5 (no fatwa).

**Tests (TDD, all written first).** `app/riba-lint.test.cjs` (54 — both defects, every category, the analyzer,
the superset property, app-copy regression, determinism) + `app/riba-lint-corpus.test.cjs` (89 — the vetted
adversarial corpus, self-contained). **The golden function, vectors, and netting are untouched** (parity green).

**Real-browser verified** (Chromium, localhost:8124): create screen renders the disguised clause as **2 hits**
with halal fixes, seal disabled, **0 console errors**, Arabic correct (RTL, joined, not reversed), no number/score.
Screenshot: `project/ahd-app/screenshots/deepening/ahd-riba-linter-deepened.png`.

**Code-reviewed (Deepen-01b).** A fresh adversarial subagent reviewed the linter; valid findings applied
(TDD, +9 assertions): the golden **floor can no longer be silenced by a stray unrelated negation** (it only
trusts the negation shortcut when the layer actually saw+cleared a trigger); **«لا يُشترط … فائدة» now reads
CLEAN** (verb-negation + conditional-benefit guard); input capped at 4000 chars. The float-money note on the
pre-existing record shape (`amountMinor/100`) is logged, not changed (out of this lane).

**Gate after Deepen-01(+b):** core **184/0** · app **21/21 = 779/0** · demo tripwire unchanged · 0 console errors.

### ✅ Deepen-02 — دفتري is now the product HUB
**What got deeper.** دفتري was a flat list. It now reads like a home base, with the 5 new features woven in:
- **Grouped, dignified sections** (`groupLedger`): «متأخّرة — بالمعروف» (amber, «تذكيرٌ لطيف، لا مطالبة») ·
  «محلّ خلاف — عهدٌ يشهد ولا يحكم» (isolated, neutral) · «قائمة وقادمة» · «محفوظة ✓» — each with a count.
- **A reconciling NET balance** (`netPosition`): «صافي ما لك/عليك … ر.س» computed **exactly in integer
  halalas** (`netMinor === meMinor − onMinor`, live rows only). It's a money balance, not a score.
- **Filter chips** (`filterRows`: الكل/متأخّرة/قائمة/خلاف/محفوظة) — only the present categories show.
- **The ask (طلب عهد) woven into the hub**: a header «＋ اطلب عهدًا», and a **sent-but-unaccepted request
  surfaces as a pending row** in «عليّ» («بانتظار قبول {lender} — لم يُختَم بعد، فليس في ميزانك حتى يُقبل»),
  never counted in totals until sealed. (حافظة الإثبات + محلّ خلاف were already first-class row actions.)

**Reshape (guarded).** `screens/daftari.js` render rebuilt around sections; `features/daftari.js` gained 3 pure
functions; `app.js` gained `daftariFilter` + a `filter` state. No golden touch; the trust signal stays a word.

**Tests (TDD).** `app/daftari-hub.test.cjs` (35 — grouping order/coverage/no-dupe, exact net reconciliation in
halalas, all filters, determinism) + DOM-smoke grown (+8: sections, net, ask, filter, pending row). Existing
`daftari.test.cjs` (123) stays fully green — no assertion weakened.

**Real-browser verified** (Chromium): grouped sections render with counts, net «صافي ما لك 2,200 ر.س»
(reconciles 5200−3000), filters work, the sent request shows as a pending row, **0 console errors**, Arabic
correct, amber-not-red, no number/score. Screenshot: `project/ahd-app/screenshots/deepening/ahd-daftari-hub.png`.
Plan: `docs/superpowers/plans/deepen-02-daftari-hub.md`.

**Gate (Deepen-02):** core **184/0** · app **22/22 = 831/0** · **1015 total** · demo tripwire unchanged · 0 console errors.

### ✅ Deepen-03 — سِجلّ الشهادة is now the CONNECTIVE TISSUE
**What got deeper.** The witness timeline was a flat feed — a pretty island. It is now the spine that links the
features together:
- **Richer event model**: added real engine events — `SETTLEMENT_SETTLED` (سُوِّي بالمقاصّة — ذمّة محفوظة) ·
  `SETTLEMENT_INITIATED` (بدأت مقاصّةٌ بالتراضي) · `PARTIAL` (سدادٌ جزئيّ — المتبقّي ينقص، بلا أيّ زيادة).
- **A per-عهد STORY view** (`groupByAhd`, default): each relationship's witnessed narrative as one card —
  header (who/amount/أجل) + a mini-timeline of its moments (latest first) + a terminal outcome. A toggle flips
  to the flat «حسب الوقت» feed.
- **Connective links** (`ahdActions`): every story links out to **حافظة الإثبات** (proof) and back to **الدفتر**,
  and a disputed story links to **محلّ خلاف** — so the timeline ties proof/dispute/ledger together.
- **Focus mode + the reverse link**: a per-row **«سجلّ هذا العهد 📜»** action in دفتري opens the timeline
  focused on that one عهد (with a «← كل العهود» reset). The loop closes: دفتري ↔ سجلّ ↔ إثبات/خلاف.

**Reshape (guarded).** `screens/timeline.js` rebuilt around stories; `app.js` gained `timelineState` +
`setTimelineView`/`openTimelineFor`/`timelineClearFocus`/`timelineToDaftari`; دفتري row sheet gained the «السجل»
link. No golden touch; amber-not-red; no number/score.

**Tests (TDD).** `app/timeline-connect.test.cjs` (25 — new event types, grouping coverage/order/no-dupe, outcome,
disputed/kept flags, the connective links, determinism) + DOM-smoke grown (+6: story view, links, flat toggle,
focus). Existing `timeline.test.cjs` (27) stays fully green.

**Real-browser verified** (Chromium): 6 per-عهد stories render with their links, the disputed story shows
«تفاصيل الخلاف», the flat toggle + focus mode work, دفتري→timeline reverse link works, **0 console errors**,
Arabic correct, no score. Screenshot: `project/ahd-app/screenshots/deepening/ahd-timeline-stories.png`.
Plan: `docs/superpowers/plans/deepen-03-timeline-connective.md`.

**Gate (Deepen-03):** core **184/0** · app **23/23 = 863/0** · **1047 total** · demo tripwire unchanged · 0 console errors.

### ✅ Deepen-04 — حافظة الإثبات ↔ محلّ خلاف are now interconnected
**What got deeper.** The proof-pack was a thin doc; the dispute linked to it but the proof didn't reframe as the
neutral exhibit. Now:
- **Provenance** (`proof.provenance`): a structured **سَنَد العهد** — parties · principal (integer halalas) ·
  type · full schedule · status · التوثيق (نفاذ + SHA-256) · the basis verse (2:282) · the riba-free flags.
- **A precise tamper report** (`proof.tamperReport`): names the **exact changed field** (المبلغ 900→4,900) and
  shows the **two diverging seals** — «تغيّر رقمٌ واحد ⇒ تغيّر الختمُ كلّه». Far more convincing than before.
- **A clearer hash-chain**: genesis → المحتوى (SHA-256) → الختم (block #1), with the block node visibly
  **broken** when tampered. (Golden sha256/sealBlock/GENESIS reused, never altered.)
- **The interconnection**: from محلّ خلاف, the proof opens as the **NEUTRAL EXHIBIT** (`openProofAsExhibit`) —
  a banner «هذه الوثيقة دليلٌ محايد — تُقدَّم للطرفين وللقضاء عند الحاجة»، and the back button returns to الخلاف
  (not دفتري). «عهدٌ يشهد ولا يحكم» made unmistakable.

**Reshape (guarded).** `screens/proof.js` rebuilt (provenance + chain + precise diff + exhibit framing);
`screens/dispute.js` opens the proof as an exhibit; `app.js` gained `openProofAsExhibit` + a context-aware
`proofBack`. No golden touch; amounts are money (no score); amber-not-red.

**Tests (TDD).** `app/proof-provenance.test.cjs` (27 — provenance shape + integer halalas + basis, the precise
tamper report, golden-seal reuse, determinism) + DOM-smoke grown (+9: provenance, chain, precise diff, the
exhibit framing + back-to-dispute round-trip). Existing `proof.test.cjs` + `dispute.test.cjs` stay green.

**Real-browser verified** (Chromium): dispute→proof reframes as the exhibit, provenance/chain/precise-diff
render, tamper shows the changed field + broken seal, back returns to الخلاف, **0 console errors**, Arabic
correct, no score. Screenshot: `project/ahd-app/screenshots/deepening/ahd-proof-exhibit.png`.
Plan: `docs/superpowers/plans/deepen-04-proof-dispute.md`.

**Gate (Deepen-04):** core **184/0** · app **24/24 = 898/0** · **1082 total** · demo tripwire unchanged · 0 console errors.

### ✅ Deepen-05 — الإعدادات (the 5th new feature) deepened beyond the digit toggle
**What got deeper.** Settings was just the digit toggle. Now (all on-spine, deterministic, byte-safe):
- **«إخفاء المبالغ» privacy** (`settings.maskAmount` → `App.fmtN`): when you show your screen to someone, every
  amount becomes «•••» app-wide. **Display-only** — the engine bytes and every seal are computed from content,
  never from a masked string (asserted: the proof seal is identical privacy on/off). The digit toggle stays.
- **«ما يفعله عهد»** (the positive counterpart to «ما لا نفعله»): the four verbs of the spine — نكتب ونشهد ·
  نحفظ الوثيقة · نُسوّي بالتراضي · نُذكّر بالمعروف · نُيسّر عند العُسر.
- **The model note** (what a Shariah judge looks for): «عقدان منفصلان — قرضٌ حسن بلا أيّ زيادة بينكما، وأجرةُ
  خدمةٍ ثابتةٌ للمصرف على التوثيق والحفظ (لا نسبةٌ من المبلغ، ولا تزيد بالتأخير). فصلٌ تامّ بين القرض والأجرة.»

**Reshape (guarded).** `App.fmtN` gained a privacy gate (single point); `app.js` gained `privacy` + `setPrivacy`;
`screens/settings.js` rebuilt. The digit toggle + golden `fmt()` untouched; the trust signal stays a word.

**Tests (TDD).** `app/settings-deepen.test.cjs` (13 — the mask is digit-safe + deterministic, byte-safety via
an identical seal, the «يفعله» content on-spine) + DOM-smoke grown (+8: privacy masks دفتري/home, seal stable,
restore). Existing `settings.test.cjs` (13) stays green.

**Real-browser verified** (Chromium): privacy hides amounts on دفتري + home (→ «•••») and restores; the seal is
byte-stable; «ما يفعله»/«ما لا يفعله»/model render; **0 console errors**; Arabic correct.
Screenshot: `project/ahd-app/screenshots/deepening/ahd-settings-deepened.png`.
Plan: `docs/superpowers/plans/deepen-05-settings.md` (see commit). **All 5 new features now woven + deepened.**

**Gate (Deepen-05):** core **184/0** · app **25/25 = 918/0** · **1102 total** · demo tripwire unchanged · 0 console errors.

### ✅ Deepen-06 — المقاصّة: a rigorous, judge-convincing conservation proof
**What got deeper.** The Muqassa showed «9→2» + a thin «Σ net = 0». Now the proof is rigorous and visible
(golden netting/balancesOf reused, never altered):
- **`conservationProof`**: the strong claim — netting MINIMISES transfers but **PRESERVES every member's net
  position EXACTLY** (`balancesOf(before) === balancesOf(after)` per member). The screen shows a per-member
  table: «نورة يدفع صافيًا 900 — نفسه قبل وبعد ✓ · خالد يقبض 600 ✓ · فهد 300 ✓ · سارة/ليلى متوازن ✓».
- **The money-moved reduction**: «المال المتحرّك: 1,800 ر.س لو سُدِّدت منفردةً ⟶ 900 ر.س بالمقاصّة — حركةٌ أقلّ،
  ومراكزُ محفوظة» — efficiency without creating or destroying a riyal.
- **Consent/novation framing**: each leg is «حوالةٌ بالتراضي يوافق عليها قبل التنفيذ».
- A clean **3-cycle** (everyone owes 100 in a ring) nets to **ZERO** transfers — a perfect مقاصّة (tested).

**Reshape (guarded).** `features/settlement.js` gained `conservationProof`; `screens/settlement.js` rebuilt to
surface it. Golden netting untouched; no number/score (amounts are money).

**Tests (TDD).** `app/settlement-conserve.test.cjs` (20 — nets preserved, Σ=0, 9→2, money-moved, 3-cycle→0,
golden reuse, determinism) + DOM-smoke grown (+5). Existing `settlement.test.cjs` (10) stays green.

**Real-browser verified** (Chromium): the 9→2 story, the per-member net-preservation (5 members), the
money-moved 1,800→900, the consent legs all render; **0 console errors**; Arabic correct; no score.
Screenshot: `project/ahd-app/screenshots/deepening/ahd-muqassa-conservation.png`.
Plan: `docs/superpowers/plans/deepen-06-muqassa.md` (see commit). _Note: the circle→مقاصّة data hand-off is
deferred (the circle/IOU shapes differ — a real mapping, not a hollow button); logged, not faked._

**Gate (Deepen-06):** core **184/0** · app **26/26 = 942/0** · **1126 total** · demo tripwire unchanged · 0 console errors.

### ✅ Deepen-07 — القرض المفتوح: the «متى ما تيسّر» journey made visible
**What got deeper.** The open-term loan showed only «المتبقّي». Now its easing-over-time story is visible
(golden seal reused, untouched; no due/countdown; إبراء stays the lender's صدقة):
- **`openLoanProgress`**: a three-segment breakdown (paid · صدقة · باقٍ) with **exact conservation**
  (`paid + forgiven + remaining === principal`) → a **proportional bar** (flex-grow, NO % text) + a legend in
  amounts («سُدِّد 5,000 · صدقة 3,000 · باقٍ 12,000 · من 20,000 ر.س»).
- **`openLoanHistory`**: the «متى ما تيسّر» **journey** — sealed → partial payment(s) → إبراء — as a dotted
  mini-timeline with dignified copy (teal for السداد, gold for الصدقة). A 3-cycle/full-إبراء close cleanly.

**Reshape (guarded).** `features/open-loan.js` gained `openLoanProgress` + `openLoanHistory`;
`screens/open-loan.js` rebuilt to surface the bar + journey while keeping the quiet, no-countdown heart. Golden
seal/canonical untouched; no number/score (proportional bar, amounts are money).

**Tests (TDD).** `app/open-loan-progress.test.cjs` (24 — exact conservation, fractions sum to 1, the journey
kinds + copy, full-إبراء close, determinism) + DOM-smoke grown (+3, incl. the no-% guard). Existing
`open-loan.test.cjs` (35) stays green.

**Real-browser verified** (Chromium): the bar (paid/صدقة/باقٍ), the legend, and the dotted journey render after
pay + partial-إبراء; **0 console errors**; Arabic correct; no %/score.
Screenshot: `project/ahd-app/screenshots/deepening/ahd-openloan-progress.png`.
Plan: `docs/superpowers/plans/deepen-07-open-loan.md`.

**Gate (Deepen-07):** core **184/0** · app **27/27 = 969/0** · **1153 total** · demo tripwire unchanged · 0 console errors.

### ✅ Deepen-08 — الدائرة: a group reminder that never names the late
**What got deeper.** The treasurer dashboard only *described* the dignity rule. Now it lives:
- **`groupReminder`**: a real collective reminder for the whole circle that — **as a tested guarantee — names
  NO member** (`namesAnyone === false`; every member name asserted absent from the text). It carries the 2:280
  mercy + the «احتاج وقتًا» exit, states no زيادة, and uses no shaming/مطالبة. `pendingCount` is a dignified
  tally («يصل 3 من بقيت مساهمتُهم — بلا تمييز ولا إحراج»), never a named list.
- The screen gains a **«ذكّر الدائرة بلطف 🤍»** action previewing the card «تذكيرٌ جماعيّ (لا يُسمّى أحد)». The
  treasurer still sees each member's private dignified state; only the OUTGOING reminder names no one.

**Reshape (guarded).** `features/circle.js` gained `groupReminder`; `app.js` gained `circleState` +
`circleReminderToggle`; `screens/circle.js` gained the preview. Golden circle engine untouched; the
Shariah-gated mode-B (D-3) is not touched.

**Tests (TDD).** `app/circle-reminder.test.cjs` (13 — the no-name guarantee, collective + mercy + no-زيادة copy,
the tally, determinism) + DOM-smoke grown (+3, incl. a live no-member-name assertion). Existing `circle.test.cjs`
(14) stays green.

**Real-browser verified** (Chromium): the reminder previews, contains **NO member name** (verified against all
5 members), tallies «يصل 3»; **0 console errors**; Arabic correct; no score.
Screenshot: `project/ahd-app/screenshots/deepening/ahd-circle-group-reminder.png`.
Plan: `docs/superpowers/plans/deepen-08-circle-reminder.md`.

**Gate (fresh, real output):** core **184/0** (135+9+40) · app **28/28 suites = 985/0** · **1169 total** (was
817) · demo tripwire unchanged · 0 console errors. **All core + all 5 new features now deepened.**

---

## 🌙 2026-06-22 — MERGE → SPRINT → REMOTION (historical — see "DEEPEN SPRINT" above for the latest)

**📦 Repo (pushed):** **https://github.com/NotMarwan/ahd** — private · branch `overnight/deepening`.
The PAT (`github.txt`) is gitignored and verified **404 on the remote** (never leaked). Pushed after
every batch.

**Mission (this run):** stop having two builds; make ONE clean publishable product → a new
feature-discovery sprint → Remotion promos of the new features. The "demo frozen" rule is lifted for
the merge, but the **spine is inviolable**, the **gate stays green**, and irreversible/Shariah calls
still go to `DECISIONS-FOR-MARWAN.md`.

**Phase status:**
- ✅ **Phase 0 — GitHub safety net.** Token gitignored; baseline committed; private repo created;
  both branches pushed; token confirmed absent from remote.
- ✅ **Phase 1 — ONE clean product.** `project/ahd-app/` is now **THE product** (7 screens, one
  shell/router/engine/design). The demo is **kept, byte-frozen, relabelled LEGACY** (D-4, safe
  path — not deleted). Fixed the real "two-parts" smells: nav now product-flow order + wraps to a
  tidy 2 rows (was overflowing the viewport), favicon → **0 console errors**. New root `README.md`
  names the one product. Real-browser verified (Chromium, mobile): all 7 render, 0 errors, Arabic
  correct. Evidence: `project/ahd-app/screenshots/audit/`.
- ✅ **Phase 2 — new feature sprint.** **5 new modular features shipped** (each TDD'd,
  real-browser-verified, on-spine, independently filmable):
  **F1 سِجلّ الشهادة** (witness timeline) · **F2 حافظة الإثبات** (proof-pack / live tamper-verify) ·
  **F3 محلّ خلاف** (dispute pause — proves "never judges") · **F4 الإعدادات** (settings +
  Arabic-Indic digit toggle — **resolves D-2**) · **F5 اطلب عهدًا** (borrower-initiated request —
  dignifying the *ask*, the deck's core insight). Independently **code-reviewed** (both review
  rounds: 0 determinism/spine issues; findings applied) + **edge-hardened**. IA stays clean: 8 nav
  pills / 2 rows; proof + dispute + settings + request are contextual.
- ✅ **Phase 3 — Remotion promo of the NEW features.** Rendered: **`project/ahd-promo/out/ahd-new-features.mp4`**
  — 1080×1920 · **60fps** · H.264 · ~25s · 11 MB. A fast-paced film of **all 5 new features** with a
  narrative arc: the **ask** (اطلب عهدًا) → **witnessed** (timeline) → **provable** (proof-pack, live
  hash-compute + tamper-caught) → **fair even in conflict** (dispute-pause) → **yours** (settings/
  digit-morph + manifesto). Reuses the app's exact palette/motion system; an **animated Arabic caption
  per feature**. **Arabic HARD-verified before each render** (stills opened + checked; encoded-frame
  re-checked). New composition `AhdNew`; render via `cd project/ahd-promo && npm run render:new`.

### 🎬 WHERE THE MP4s ARE
- **`project/ahd-promo/out/ahd-new-features.mp4`** ← tonight's NEW-features promo (the deliverable).
- `project/ahd-promo/out/ahd-app-promo.mp4` ← the earlier original-features promo (kept).

**Gate (fresh, real output):** core `184/0` (135+9+40) · app `19/19 suites = 633/0` · **817 total** ·
demo tripwire `e2f48467… OK`. 0 console errors across all screens (real Chromium).

**Most valuable thing so far tonight:** one cohesive, publishable app (single front door, product-flow
nav, 0 console errors) **plus 4 genuinely-new on-spine features** (witness timeline · proof-pack with
live tamper-verify · dispute-pause · settings/Arabic-Indic digits) — all recoverable on GitHub, gate
green, code-reviewed. Phase 3 (Remotion film) next.

**Needs your decision:** `DECISIONS-FOR-MARWAN.md` — **D-4** (demo kept/frozen vs retire — I took the
safe "keep" path) + standing **D-1** / **D-3** (Shariah-gated). **D-2 is now resolved** (shipped as a
user toggle).

**▶️ How to review tonight's work**
1. **Clone/pull:** `https://github.com/NotMarwan/ahd` → branch `overnight/deepening`.
2. **Run the app:** `node project/ahd-app/_serve-app.cjs` → http://localhost:8124 — try: *أنشئ عهداً*
   (riba linter), *السجلّ* (timeline), *دفتري → ⋯ → وثيقة الإثبات* (proof-pack, press «جرّب العبث»),
   *دفتري → ماجد → تفاصيل الخلاف* (dispute), home footer → *الإعدادات* (digit toggle).
3. **Watch the film:** `project/ahd-promo/out/ahd-new-features.mp4`.
4. **Run the gate:** from `10_Deep/Hardening/test-harness/`:
   `node run-tests.cjs && node offline-check.cjs && node dom-smoke.cjs && node app/run-app-tests.cjs`
   → core 184/0 + app 575/0.
5. **Diff:** `git log main..overnight/deepening --oneline` (this run's commits). Nothing auto-merges to `main`.

**✅ Final verification snapshot (2026-06-22, fresh):**
`repo pushed (token 404 on remote) · core 135+9+40=184/0 · app 19/19=633/0 · 817 total · demo tripwire
e2f48467… OK · 0 uncommitted · 5 new features code-reviewed + edge-hardened · promo 1080×1920/60fps/h264 21s Arabic-verified`

---

## ⭐ READ ME FIRST (previous night's summary — kept for history)

**Status as of last update:** 🟢 Demo safe · harness green (**core 184/0 + app 425/0 = 609 assertions, 13 app suites**) · independently **code-reviewed** (0 critical; 5 findings applied) · work isolated on `overnight/deepening` (26 commits) · demo `main` untouched. **The app now mirrors the demo's full surface + all new features (7 screens).**

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
| 👥 **الدائرة** | treasurer dashboard (Agent-4 G3): progress + dignified member states + one sealed proof | group reminder never names the late; «ذمّة المناسبة محفوظة» |
| 🔁 **الدائرة+** | بالأصناف split · recurring · graduation قَيْد→عهد | mode-B pledge sketch has a visible ⚠️ Shariah-review guard |
| 🔗 **المقاصّة** | the tangle → fewest transfers (9→2) + consent legs + conservation | reuses the golden netting; «لا ريال يُخلق ولا يضيع، ولا فائدة» |

**Supporting deliverables:**
- **Tests:** `10_Deep/Hardening/test-harness/app/` — 13 suites, **425 app assertions** (+ the demo's **184** core, untouched). Includes `golden-vectors.test.cjs` (absolute drift-guard) + `edge-cases.test.cjs` (degenerate inputs). `node app/run-app-tests.cjs`. **Independently code-reviewed** (subagent): 0 critical; 5 findings fixed + regression-guarded.
- **Docs:** `docs/ARCHITECTURE.md`, `project/ahd-app/README.md`, `docs/PUBLISHABLE-PRODUCT-SPEC.md`, root `CLAUDE.md`, `docs/DESIGN-NOTES-FOR-CLAUDE-DESIGN.md`.
- **Pitch:** `docs/DECK-DRAFT-AR.md` (9-slide Arabic deck draft), `docs/evidence/` (`EVIDENCE-BRIEF.md` + `REBUTTAL-PLAYBOOK.md` graded 🟢/🟡/🔴 web-verified, + `DEMAND-SURVEY-KIT.md` to close the OT-A1 demand gap), `docs/PRESENTER-GUIDE.md` (9-step golden path).
- **Proof:** `project/ahd-app/screenshots/` — real-Chromium renders (incl. the riba linter blocking live), 0 app console errors.
- **Plans:** `docs/superpowers/plans/` — one per feature (brainstorm→plan→TDD trail).

## ▶️ HOW TO REVIEW (in the morning)
1. **See the diff:** `git diff main..overnight/deepening` (or `git log main..overnight/deepening --oneline` — 26 commits, each green).
2. **Run the app:** `node project/ahd-app/_serve-app.cjs` → open `http://localhost:8124` (fully offline).
3. **Run the gate:** from `10_Deep/Hardening/test-harness/`: `node run-tests.cjs && node offline-check.cjs && node dom-smoke.cjs && node app/run-app-tests.cjs` → 184 core + 425 app, all green.
4. **Confirm the demo is untouched:** `sha256sum -c _overnight/backup/demo.sha256` → OK (`e2f48467…`).
5. **Decide:** `DECISIONS-FOR-MARWAN.md` (D-1 self-disclosure, D-3 mode-B pooled deposit — both Shariah-gated; D-2 digits FYI). **Nothing auto-merges into `main`** — the merge is yours.

## ✅ Final verification snapshot (2026-06-21, fresh)
`tripwire OK · AHD-LOGIC markers 2 · run-tests 135/0 · offline 9/0 · dom-smoke 40/0 · app 13/13 (425/0) · 26 commits · 0 uncommitted · main = baseline b2458ee untouched`

## Protected-core invariants (self-checked every batch)
- `project/ahd-demo/index.html` SHA-256 == `e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40` (tripwire).
- Harness `node run-tests.cjs && node offline-check.cjs && node dom-smoke.cjs` ≥ **184/0**, all exit 0.
- Golden-pinned functions never modified internally (sha256, canonical, sealBlock, recomputeSeal, verifyRecord, netting core, fmt, respread, netting tiebreak).
- Determinism: no float money / Math.random / Date.now / new Date / Intl in new logic; integer halalas; pure logic separated from DOM.

---

## LOG (newest first)

### Phase 3 · Remotion promo of the NEW features — ✅ DONE
`project/ahd-promo/out/ahd-new-features.mp4` (1080×1920 · 60fps · H.264 · ~21s · 8.6 MB). New
composition **`AhdNew`** (`src/NewPromo.tsx`) = brand bookends (ColdOpen/Close) + 4 new beats, reusing
the existing motion system (`motion.ts`), Phone frame, Caption, and the exact app palette.
- **BeatTimeline** — the witness feed cascades in (sealed/reminder/mercy/neutral/kept); amber not red,
  dispute neutral, no score; Arabic-Indic amounts.
- **BeatProof** (hero) — canonical doc reveals, SHA-256 "computes" (deterministic scramble→lock), the
  seal locks, then a tamper is **caught** (✗ عبثٌ مكشوف, principal flips red) and **restored** (✓ سليمة).
  Real golden hash; render-safe SVG marks (no emoji).
- **BeatDispute** — the calm «عهدٌ يشهد ولا يحكم» stance, reminders paused, two paths (تراضٍ الأحبّ · قضاء).
- **BeatSettings** — digits morph ٠←0 (toggle crossfade), the «ما لا نفعله» manifesto cascades.
- **Arabic/RTL — HARD-verified BEFORE full render** (per brief): rendered 3 stills
  (timeline/proof/settings @ frames 250/560/1000), opened + confirmed correct shaping/joining, captions
  present, key moments animate. Then full render 1262/1262 frames, ffprobe-confirmed 1080×1920/60fps/h264.
- No voiceover; one animated Arabic caption per feature; no score/number on screen; «late»=amber.
  Commit `62943c2`. (Render: `cd project/ahd-promo && npm run render:new`.)

### Phase 2 · New feature-discovery sprint — ✅ 4 features DONE
Autonomous brainstorm → prioritized backlog (`docs/superpowers/specs/2026-06-22-phase2-feature-sprint-design.md`)
→ each built via TDD (failing test first) → real-browser-verified → committed/pushed. All on-spine,
deterministic, modular (own `features/*` + `screens/*`), independently filmable.
- **F1 سِجلّ الشهادة** (witness timeline): one feed of the significant witnessed moments across all
  the viewer's عهود (sealed · bank-sent reminder · grace · kept · إبراء · dispute=neutral). Late=amber,
  dispute=neutral, no red, no score. `timeline.test.cjs` 27/0. Commit `d00c487`.
- **F2 حافظة الإثبات** (proof-pack/export): the canonical content + SHA-256 + genesis→block chain +
  a LIVE tamper-verify («جرّب العبث» → seal breaks ✗; «أصلِح» → ✓). Reuses golden sha256/sealBlock.
  `proof.test.cjs` 19/0 + 2 golden pins. Contextual screen (from دفتري). Commit `2649f8a`.
- **F3 محلّ خلاف** (dispute pause): proves "the bank never judges" — pause, NO penalty, the sealed
  record as a NEUTRAL exhibit, two paths (تراضٍ encouraged · قضاء). `dispute.test.cjs` 19/0.
  Contextual. Commit `a3b9c72` (also applied the F1/F2 code-review fixes).
- **F4 الإعدادات + Arabic-Indic digits** (resolves **D-2**): an app-wide digit toggle as a
  display layer over the golden fmt() (engine bytes unchanged; default western → gate byte-identical)
  + the «ما لا نفعله» manifesto. `settings.test.cjs` 13/0. Commit `863447a`.
- **F5 اطلب عهدًا** (borrower-initiated request): dignifying the *ask* — the deck's core insight
  («asking back is painful»). You compose a riba-checked request → (محاكاة) the lender accepts → a
  sealed عهد in your «عليّ». Reuses the GOLDEN create seal **byte-identically** (no new crypto).
  `request.test.cjs` 15/0. Contextual (home card). Commit `f5642a2`.
- **Independent code-review** (two subagent rounds — F1+F2, then F3+F4): both verdict fix-then-ship;
  0 determinism/spine issues, golden core untouched, proof tamper-logic correct, digit toggle
  display-only. Findings applied (XSS-hardening esc()s + a null-guard); one false-positive rejected
  with rationale (settings is reachable via the home footer). Plus `new-features-edge.test.cjs` (26)
  degenerate-input hardening across all 5.
- **Gate after Phase 2 (fresh):** core `184/0` · app `19/19 suites = 633/0` · **817 total** · demo
  tripwire `e2f48467… OK`. Pushed each feature.

### Phase 0 + Phase 1 · GitHub safety net + merge into ONE product — ✅ DONE
- **Phase 0:** `github.txt` gitignored (+ `.env`/`*.token`); baseline commit `f8813ed` (incl. WIP
  promo refactor so nothing is lost); created private repo **NotMarwan/ahd**; clean remote (no token
  in config, pushed via env-var credential helper); pushed `main` + `overnight/deepening`; **verified
  `github.txt` is 404 on the remote.**
- **Phase 1:** decided `ahd-app` = THE product (already supersets the demo). Audit-first in a real
  browser found the genuine "stitched" smells → fixed: (1) nav was **build-order** → explicit
  product-flow `NAV_ORDER` sorted in `boot()` (TDD: dom-smoke red→green, +1 assertion); (2) 7-pill
  nav **overflowed** the viewport (718px in 397px) → `flex-wrap` to a tidy 2 rows, 0 horizontal
  overflow; (3) favicon **404** → inline base64 SVG brand mark → **0 console errors**. Demo
  relabelled **LEGACY/FROZEN** (README banner only; `index.html` untouched, tripwire OK) — kept not
  deleted (**D-4**). New root `README.md`. Real-browser (Chromium, 440px): all 7 screens render, 0
  errors, Arabic shaping/RTL correct, no score/% on screen. Evidence `screenshots/audit/`.
- **Gate:** core 184/0 · app 13/13 (426) · **610 total** · tripwire `e2f48467… OK`. Commits
  `f8813ed`, `e354a14`. Pushed.


### Batch 14 · الدائرة treasurer dashboard — ✅ DONE
`features/circle.js` + `screens/circle.js`: the treasurer view (Agent-4 G3) over the **golden** `foldCircle`/`circleSeal`/`statusLabel` (reused) — occasion progress (amounts, never a score), per-member dignified states, the dignity rule (group reminder never names the late), and one sealed proof; «ذمّة المناسبة محفوظة» on full collection. circle 14, dom-smoke 83. The app now mirrors the demo's full surface (witnessed record via *create*, Muqassa via *settle*, Circle via *circle* + *circle-adv*) **plus** all four new consumer features. Commit `bbb4602`.

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
## 2026-07-14 — Figma baseline transfer planning

- Approved architecture: baseline first, Expo judge flow second, V2 redesign third.
- Added the canonical design spec and an implementation-ready 11-task transfer plan.
- Token-efficiency rule: deterministic hashes/captures first; high-reasoning visual review only at architecture and final gates; approved screens are cached by source/token SHA-256.
- Graph-backed sources: Sadu prototype partials, design tokens, RN mapping, Expo proof, golden engine, create/proof/settlement feature paths.
- No implementation started. Next action is Task 1 in `docs/superpowers/plans/2026-07-14-figma-baseline-transfer.md`.

## 2026-07-14 — full-roadmap survey and safety delivery

- Final gate: **2979/0**; app **2781 assertions / 69 suites**. Clean `git archive` rerun also passed **2979/0**. Frozen demo SHA unchanged: `e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40`.
- Delivered: survey generator/analyzer (no raw data committed), security/rate-limit lane, validation packs, TSA/cloud profiles, multi-issuer verification, local Arabic type/rehearsal material, gift-only settlement, actor-bound forgiveness/duress, and estate spec only.
- Morning truth: **no survey responses, no external approvals, no pilot**. OT-A1 is SUPPORTED-DIRECTIONAL only after planned field thresholds; it is not closed today.
- Conservative review: Innovation 7.8 · Technical 8.0 · Data 7.2 · UX 7.8 · Feasibility 7.3 · tired judge 7.6. Next human work: JL-13..JL-17 in `_meta/OPEN-ITEMS.md`.
- Detail: `docs/session-report-2026-07-14-full-roadmap-survey.md`.

## 2026-07-15 — Claude-E: mobile app full screens (feat/mobile-screens)
- Fixed settlement demo root cause (engine NODES-only netting); now engine.IOUS tangle 9->2, conserved.
- Tab icons (SVG), 56px bar, home leftmost under RTL, logo lowered, More hub tab.
- Ported all 18 contextual screens (23 total, parity with web app); registry-route parity guard test.
- Guided demo walkthrough + demo quick-fill.
- Gate: app 28 suites/56 tests green, tsc clean, expo lint 0 errors, tripwire OK. 10 commits on feat/mobile-screens (unmerged; owner decides merge).
- Verified live via react-native-web (375x812): more hub, shariah, circle, demo banner all render, no console errors.
