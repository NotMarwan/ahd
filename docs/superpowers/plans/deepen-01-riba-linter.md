# Plan · Deepen-01 — The riba linter (the centerpiece): "genuinely hard to fool"

**Lane:** `أنشئ عهدًا` + the riba linter. **Mode:** additive layer + guarded reshape of `create`/`request` usage.
**Spine:** the linter flags suspected riba and *suggests* a halal alternative + cites the principle —
**it issues no fatwa, it rules nothing.** Late = amber. No number/score. Deterministic, no Date/Math.random/float.

## Why this lane first
The brief names the linter "the centerpiece — make it genuinely hard to fool." The golden `engine.ribaScan`
(4 regex rules + an *immediate-preceding-negation* guard) is byte-pinned (demo parity) and **must not be
modified**. So we **build on top** in a new file and route `create`/`request` through it (a guarded reshape).

## The two real defects in the golden linter (both demonstrable)
1. **False NEGATIVE — negated negation lets real riba through.** `«ليست بلا فائدة»` (= "is *not* without
   interest" → riba). Golden sees `بلا` immediately before `فائدة` → clears it. **Real riba passes.**
2. **False POSITIVE — distributed negation over a list wrongly blocks a clean clause.**
   `«بلا فائدةٍ أو غرامةٍ أو زيادة»` (= "without interest *or* penalty *or* increase" → clean). Golden's guard
   only checks the word *immediately* before each trigger, so `غرامة`/`زيادة` (preceded by `أو`) are flagged.
   **An honest user is blocked.**
Plus broad **gaps**: synonyms (عائد/مردود/غُنم/مكسب/ريع/علاوة/بدل), disguised fees tied to the loan
(رسوم/مصاريف/أتعاب/تأمين «على القرض»), conditional benefit (قرض جرّ نفعًا — «بشرط/على أن … هدية/منفعة»),
classical جاهلية («أنظِرني أزِدك» / «إن أخّرت زدتُ»), and "repay more than taken" («يردّ ١١٠٠ مقابل ١٠٠٠»).

## Design — `features/riba-lint.js` (pure, DI, dual-module)
A SUPERSET linter that **reuses golden `engine.ribaScan` as the authoritative base** and adds:
- **`EXT_RULES`** — extra trigger patterns the golden 4 miss, each `{re, why, fix, category, severity}`.
  Every `fix` is a concrete halal alternative; copy stays "flag + suggest + cite", never a ruling.
- **A negation-aware analyzer** that understands:
  - **distributed negation** across `و/أو/ولا/،` lists → clears genuinely-clean list clauses (fixes defect 2),
  - **negated negation** (`ليس/ليست + بلا/دون/بغير …`) → re-blocks real riba (fixes defect 1).
- **`scan(text, engine)`** → `{ verdict:"clean"|"block", hits:[{why,fix,category,severity,source}] }`
  combining golden + ext hits, deduped, run through the analyzer. Returns ALL hits (screen shows each).
- Back-compat shape: `verdict` + `hits[]` with `why`/`fix` (so existing screen code keeps working).

### Safety invariants (tested)
- **Superset of golden true-positives:** any genuinely-riba clause golden catches, the layer catches too.
- **Only documented clean exceptions** where layer=clean but golden=block: the distributed-negation list
  clauses (each individually asserted clean, with rationale).
- **No regression on app copy:** `scan(draftTermsAr(scheduled))` and `scan(draftTermsAr(open))` stay **clean**;
  `circleTermsAr` untouched (circle keeps using golden directly).
- **Golden untouched:** `engine.ribaScan` and `engine.js` bytes unchanged → `engine-parity` + `golden-vectors`
  stay green. The layer never mutates a golden function.
- Determinism/offline preserved; integer halalas only (the linter never touches money).

## Reshape (guarded)
- `features/create.js`: `ribaCheck(text, engine)` → delegate to `RibaLint.scan(text, engine)` (DI;
  falls back to golden if the layer is absent, so nothing can break offline).
- `features/request.js`: `requestRibaCheck` → same delegation.
- `screens/create.js`: render **all** hits (count + per-hit fix), keep the seal gate, add a second
  "try a sneaky/ambiguous clause" demo button to show the deeper catch. No number/score on screen.

## TDD order (tests first, harness must stay ≥ green and grow)
1. `app/riba-lint.test.cjs` — the new layer: defect-1, defect-2, every EXT category, the negation analyzer,
   the superset-of-golden property, the app-copy regression guards, determinism. **Write red first.**
2. Extend `app/create.test.cjs` + `app/request.test.cjs` for the delegated linter (new behavior asserted).
3. `app/new-features-edge.test.cjs` (or a focused edge file) — adversarial corpus rows (vetted by me;
   any Shariah-debatable row → `DECISIONS-FOR-MARWAN.md`, never a test assertion).
4. DOM smoke: create screen renders all hits, 0 console errors, Arabic correct.

## Out of scope / to the decision queue
- Any clause whose riba status is genuinely debatable (the corpus `uncertain` bucket) → logged, not asserted.
- No change to the golden function, the golden vectors, or the netting. No new dependency.
