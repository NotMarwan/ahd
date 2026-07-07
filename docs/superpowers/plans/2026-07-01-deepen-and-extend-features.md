# Deepen + Extend Ahd — Implementation Plan

> **For agentic workers:** Tasks 1–3 are **independent** (disjoint file sets) and are executed by three
> parallel deep-dive agents. Tasks 4–5 (integration + verification) are executed by the integrator
> (Claude-D-3) after the three land. Steps use checkbox (`- [ ]`) syntax. TDD: failing test first.

**Goal:** Close the borrower-dignity loop and make mercy provable — add three new on-spine features
(«ما عليّ» borrower home, «سِجلّ المعروف» sealed good-faith trail, «سُلفة بالمعروف» standing qard) that also
deepen the thin creditor-first surfaces, without touching any existing feature/engine/demo file.

**Architecture:** Three new standalone UMD feature modules + three new screens + three new TDD suites.
Each new module reuses the golden engine + existing feature exports via DI/`require`; none edits an existing
module. The integrator wires the three into `app/app.js` (routes/state/actions), `app/screens/home.js`
(cards), and adds deterministic seed data.

**Tech Stack:** Vanilla ES5-style JS (dual Node `module.exports` / browser `window.*`), Node ≥18, zero
dependencies. Node test scripts under `tests/app/` auto-discovered by `run-app-tests.cjs`.

## Global Constraints (verbatim — apply to every task)

- **Never touch** `demo/index.html`, `app/engine.js`, or the golden functions' internals. Build additively
  in **new files** only. Tripwire SHA-256 `e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40`
  must stay unchanged.
- **Determinism:** no `Date.now` / `new Date` / `Math.random` / `Intl` / `.toLocaleString` / float money in
  live logic. Fixed `AS_OF`. Enforced by `tests/app/app-offline.test.cjs` + `determinism.test.cjs`.
- **Integer halalas** (1 SAR = 100) everywhere money is hashed/compared: `engine.toMinor`,
  `engine.minorToFixed2`, `engine.fmt`. SAR is a display projection only.
- **No riba / penalty / maysir / gharar.** No surcharge/penalty field may exist. Re-scheduling adds nothing
  (sum preserved exactly via `engine.respread`). Seals use golden `sha256`/`sealBlock`/`GENESIS`.
- **No credit score.** No number-as-reputation; the trust signal is never exported. Court-export of the
  **sealed record** is allowed; the trust band is not.
- **AI issues no fatwa.** Cite verses/standards; flag Shariah questions; never rule. Anything spine/
  Shariah/golden/counsel → `docs/DECISIONS-FOR-MARWAN.md`, don't decide it here.
- **Module pattern:** `(function(root,factory){ if(typeof module==="object"&&module.exports)
  module.exports=factory(require("../engine.js")); else root.NAME=factory(root.AHD); })(this, function(ENGINE){ "use strict"; … return {…}; });`
- **Screen pattern:** IIFE, `var App = window.AhdApp; if(!App) return; function render(app){ return "<...>"; }
  App.registerScreen({key,label,icon,render});` Use `App.esc`, `App.fmtN`, `App.flashHTML`.
- **Test pattern:** `const assert=require("assert"); const engine=require(path.join(__dirname,"..","..","app","engine.js"));`
  local `ok(cond,msg)` / `eq(a,b,msg)` counters; print a summary block; `process.exit(fail?1:0)`. Name it
  `*.test.cjs` so it's auto-discovered. Assert conservation explicitly.
- Run the app gate from `tests/`: `node app/run-app-tests.cjs`. Run one suite: `node app/<name>.test.cjs`
  (from `tests/`). Do **not** edit `run-app-tests.cjs` (auto-discovers new files).

---

## Task 1 — F1 «ما عليّ» borrower home + borrower-invokable grace/pay  (Agent A)

**Files:**
- Create: `app/features/borrower.js`
- Create: `app/screens/borrower.js`
- Test: `tests/app/borrower.test.cjs`

**Interfaces — Produces (later tasks/integrator rely on these exact names):**
- `makeBorrowerView(records, viewer, engine, asOf) -> { rows:[...], summary:{owedCount,totalRemainingMinor,inGraceCount} }`
- `borrowerObligations(records, viewer, engine, asOf) -> [ { record, remainingMinor, statusKey, urgencyRank, inGrace } ... ]`
  sorted by `urgencyRank` (overdue=0 → due-soon=1 → open/on-track=2 → settled=3), stable within a rank by
  record id.
- `GRACE_REASONS` → frozen array of `{key,ar}` for keys `salary_delay`,`medical`,`urgent_obligation`,`unspecified`.
- `graceRequest(record, reasonKey, asOf) -> event` — an `ev("GRACE_REQUESTED",{reasonKey,atISO:asOf})`;
  `reasonKey` falls back to `"unspecified"` if not in `GRACE_REASONS`. Adds **no** amount.
- `payWhatEased(record, amountSAR, engine) -> event` — `ev("PRINCIPAL_PAID",{amountMinor:min(toMinor(amt),remaining)})`,
  clamped to the record's remaining (no overpay); returns a no-op-safe event for bad input.
- `borrowerSummary(records, viewer, engine, asOf) -> {owedCount,totalRemainingMinor,inGraceCount}` (integers only).
- Consumes: `engine` (toMinor/minorToFixed2/fmt/fold/statusLabel/ev/respread), optionally `require("./daftari.js")`
  for `rowFor`/remaining if it eases reuse (do not edit daftari.js).

- [ ] **Step 1 — Write the failing test** `tests/app/borrower.test.cjs`. Assertions (write them all):
  - a viewer with debts owed BY them (`record.borrower===viewer`) yields obligations; debts owed TO them are excluded.
  - obligations are sorted overdue-first; a settled debt sorts last; ties broken by record id (deterministic across runs).
  - `GRACE_REASONS` has the 4 keys; `graceRequest(rec,"salary_delay",asOf).type==="GRACE_REQUESTED"` and carries `reasonKey`; an unknown key becomes `"unspecified"`.
  - `graceRequest` adds **no** amount field / does not change remaining (fold before == fold after for principal).
  - `payWhatEased(rec, huge)` clamps `amountMinor` to the remaining; two pays never drive remaining below 0; conservation holds (paid+remaining==principal-forgiven) in integer halalas.
  - `borrowerSummary` returns integers; `totalRemainingMinor` equals the sum of row remainings; **no key named** `band`/`score`/`percent`/`rating` appears anywhere in `JSON.stringify(makeBorrowerView(...))` (regex scan).
  - determinism: two `makeBorrowerView(...)` calls are deep-equal.
- [ ] **Step 2 — Run it, verify it FAILS:** `cd tests && node app/borrower.test.cjs` → FAIL (module not found).
- [ ] **Step 3 — Implement** `app/features/borrower.js` (UMD; mirror `open-loan.js`/`daftari.js` idiom).
  Compute remaining via the same fold the ledger uses (installment records → `engine.fold`/`statusLabel`;
  open-term records → reuse `OpenLoan.foldOpenLoan` if the record is open). Urgency uses a pure civil-days
  compare vs `asOf` (no `Date`). Grace reasons frozen. Copy dignified, amber-not-red, no day-counter.
- [ ] **Step 4 — Run tests, verify PASS:** `cd tests && node app/borrower.test.cjs` → PASS.
- [ ] **Step 5 — Implement the screen** `app/screens/borrower.js` (route `mine`, label «ما عليّ», icon `🫱`).
  Render the obligations as dignified rows (amber overdue chip, remaining via `App.fmtN`, status word), each
  with actions calling `AhdApp.borrowerPay(id, amt)`, `AhdApp.borrowerAskGrace(id, reasonKey)`,
  `AhdApp.openProof(id)`. A summary strip (owed count + total remaining, **no score**). Empty state if none.
  (The `AhdApp.*` handlers are added by the integrator in Task 4 — the screen only references them.)
- [ ] **Step 6 — Re-run the whole app gate** `cd tests && node app/run-app-tests.cjs` → all green (your new
  suite included; nothing else regressed). Report the pass/fail line.

**Do NOT:** edit `app.js`, `home.js`, or any existing feature/screen/test. Do NOT run git. Use ABSOLUTE
paths under the worktree for every read/write.

---

## Task 2 — F2 «سِجلّ المعروف» sealed good-faith / mercy trail  (Agent B)

**Files:**
- Create: `app/features/covenant-log.js`
- Create: `app/screens/covenant.js`
- Test: `tests/app/covenant-log.test.cjs`

**Interfaces — Produces:**
- `buildCovenantLog(record, reminderHistory, engine, asOf) -> [ {kind, atISO, amountMinor, ar, canonical} ... ]`
  ordered by the record's event order then reminderHistory order. `kind` ∈
  `sealed|reminder|grace_requested|grace_granted|paid|forgiven_partial|forgiven_all|settled|dispute`.
  Reminder entries carry the **original amount only** and **no day-count**.
- `covenantEntryCanonical(entry, record, engine) -> string` (array joined by `\n`; stable).
- `sealCovenantLog(log, record, engine) -> { entries:[{...,seq,canonical_hash,seal}], head }` — chain
  `seal_i = engine.sealBlock(prev, engine.sha256(canonical_i), i)` from `engine.GENESIS`, `prev` starts at
  `GENESIS`, `head` = last seal.
- `verifyCovenantLog(sealed, record, engine, tamperIndex?) -> { ok, firstBrokenAt }` — recompute the chain;
  if `tamperIndex` given, mutate that entry's amount before recompute and expect a break at/after it.
- `exhibitFor(sealed, record, engine) -> { parties:{lender,borrower}, termsHash, timeline:[{kind,atISO,amountFixed2,seal}], finalStatus, head }`
  — **contains no trust band / score / number-reputation** (parties + amounts + seals + status only).
- Consumes: `engine` (sha256/sealBlock/GENESIS/toMinor/minorToFixed2/fmt/ev/fold/statusLabel).

- [ ] **Step 1 — Write the failing test** `tests/app/covenant-log.test.cjs`. Assertions:
  - a record with `[RECORD_SEALED, reminder×2 (from reminderHistory), GRACE_REQUESTED, GRACE_GRANTED, PRINCIPAL_PAID, FORGIVEN]` builds a log whose kinds are in that canonical order.
  - reminder entries expose the **original amount** and **no** `days`/`daysOverdue`/day-count field (scan keys).
  - `sealCovenantLog` is deterministic (same input → identical `head` across two runs); each entry's `seal` differs from its neighbor.
  - `verifyCovenantLog(sealed,...).ok === true`; `verifyCovenantLog(sealed,...,1).ok === false` and `firstBrokenAt <= ` later indices (tamper at 1 breaks the chain).
  - `exhibitFor(...)`: `JSON.stringify(exhibit)` contains **none** of `/(score|band|rating|percent|٪|reputation|كفاءة|تصنيف)/` and DOES contain the parties + `head` + a `termsHash`.
  - conservation/amount honesty: no entry's `amountMinor` exceeds the record principal; amounts are integers.
- [ ] **Step 2 — Run it, verify FAIL:** `cd tests && node app/covenant-log.test.cjs` → FAIL.
- [ ] **Step 3 — Implement** `app/features/covenant-log.js` (UMD; reuse golden seal primitives exactly like
  `open-loan.js` does). Build the ordered entries from `record.events` + `reminderHistory[record.id]`.
  Canonical lines stable and integer-halala. Exhibit strips everything but parties/terms-hash/timeline/status.
- [ ] **Step 4 — Run tests, verify PASS.**
- [ ] **Step 5 — Implement the screen** `app/screens/covenant.js` (route `maroof`, label «سِجلّ المعروف»,
  icon `🕊️`). Render the sealed معروف timeline (each entry: dignified Arabic line + short seal), a live
  tamper toggle (`AhdApp.covenantTamperToggle()`) that shows the chain breaking, and a «صدّر كبيّنة محايدة»
  export action (`AhdApp.covenantExport()`). Reachable as a contextual screen (integrator wires the entry
  points from `daftari`/`dispute`). Empty state if the record has no معروف events yet.
- [ ] **Step 6 — Re-run the whole app gate** → all green. Report the line.

**Do NOT:** edit `app.js`, `home.js`, `proof.js`, `dispute.js`, `timeline.js`, or any existing test. No git.
Absolute worktree paths only.

---

## Task 3 — F3 «سُلفة بالمعروف» standing/recurring two-party qard hasan  (Agent C)

**Files:**
- Create: `app/features/standing-loan.js`
- Create: `app/screens/standing.js`
- Test: `tests/app/standing-loan.test.cjs`

**Interfaces — Produces:**
- `makeStanding(spec) -> { id, lender, borrower, perCycleMinor, cycleKeys:[...], purpose, timestamp, events:[...] }`
  (`perCycleMinor = toMinor(spec.perCycleSAR)`; `cycleKeys` a fixed string array like `["2026-01",...]`; no `Date`).
- `standingPosts(standing, engine) -> [ { cycleKey, ahdId, principalMinor, canonical, canonical_hash, seal } ... ]`
  — one post per cycle key; `ahdId = standing.id + ":" + cycleKey`; each `seal = sealBlock(GENESIS, sha256(canonical), i+1)`.
- `standingCanonical(standing, engine) -> string` — `arrangement=standing`, per-cycle amount, cycle count,
  `riba=interest:false;late_penalty_to_lender:false;gharar:none`, `basis=Quran:2:280`.
- `standingSeal(standing, engine) -> {canonical_hash, seal}`; `verifyStanding(standing, engine, tamperSAR?) -> {ok,...}`.
- `standingLedger(standing, engine, repaidCycleKeys?) -> { postedMinor, repaidMinor, outstandingMinor, cycleCount }`
  (integers; `repaidCycleKeys` optional array; conservation: posted == repaid + outstanding).
- `standingTermsAr(standing, engine) -> string` (interest-free, ribaScan-clean).
- `WAGE_LINKAGE_SEAM = Object.freeze({ musanedIntegration:false, needsCounselSignOff:true })`.
- Consumes: `engine` (toMinor/minorToFixed2/fmt/sha256/sealBlock/GENESIS/ev/ribaScan). May read
  `app/features/circle-adv.js` to mirror its cycle-key recurring pattern (do not edit it).

- [ ] **Step 1 — Write the failing test** `tests/app/standing-loan.test.cjs`. Assertions:
  - `makeStanding({perCycleSAR:800, cycleKeys:["2026-01","2026-02","2026-03"], ...})` → `perCycleMinor===toMinor(800)`, 3 cycle keys.
  - `standingPosts(...)` returns 3 posts; ids `<id>:2026-01`…; **deterministic** (two runs deep-equal, seals identical).
  - each post's `principalMinor===perCycleMinor`; `verifyStanding(standing,engine).ok===true`; `verifyStanding(...,9999).ok===false`.
  - `standingCanonical` contains `arrangement=standing` and `riba=interest:false`; `engine.ribaScan(standingTermsAr(...))` verdict is **clean** (no riba vocabulary).
  - `standingLedger` conservation: `postedMinor === repaidMinor + outstandingMinor`; with `repaidCycleKeys=["2026-01"]`, `repaidMinor===perCycleMinor` and `outstandingMinor===2*perCycleMinor`; all integers.
  - `WAGE_LINKAGE_SEAM.musanedIntegration===false && WAGE_LINKAGE_SEAM.needsCounselSignOff===true`.
  - no float: `perCycleMinor % 1 === 0`, every posted amount is an integer.
- [ ] **Step 2 — Run it, verify FAIL.**
- [ ] **Step 3 — Implement** `app/features/standing-loan.js` (UMD; reuse golden seal primitives + the
  deterministic cycle-key pattern). Posts iterate `cycleKeys` (index-based seq); ledger folds posted vs a
  repaid set. Terms Arabic must be ribaScan-clean (say «قرض حسن … بلا أيّ زيادةٍ أو فائدةٍ أو غرامة»).
- [ ] **Step 4 — Run tests, verify PASS.**
- [ ] **Step 5 — Implement the screen** `app/screens/standing.js` (route `standing`, label «سُلفة بالمعروف»,
  icon `🔁`). Render the arrangement (two parties, per-cycle amount, cycle list), the ledger
  (posted/repaid/outstanding via `App.fmtN`), the per-cycle posts each with a short seal + tamper toggle
  (`AhdApp.standingTamperToggle()`), and a **visible ⚠️ seam note** (from `WAGE_LINKAGE_SEAM`) that
  wage-linkage/Musaned is a documented integration seam pending counsel (OT-VAL) — assert nothing.
- [ ] **Step 6 — Re-run the whole app gate** → all green. Report the line.

**Do NOT:** edit `app.js`, `home.js`, `circle-adv.js`, or any existing test. No git. Absolute worktree paths.

---

## Task 4 — Integration (integrator / Claude-D-3 only)

**Files:** Modify `app/app.js` (require the 3 modules, add state + actions + register 3 screens + NAV),
`app/screens/home.js` (add 3 cards), add deterministic seed data.

- [ ] Register the 3 screens (import `window.Borrower`/`window.CovenantLog`/`window.Standing`; the modules
  set these). Add `mine` + `standing` to `NAV_ORDER`; keep `maroof` contextual (reached from daftari/dispute).
- [ ] Add `AhdApp` handlers: `borrowerPay(id,amt)`, `borrowerAskGrace(id,reasonKey)` (push the events onto
  the record, flash dignified copy, rerender); `openCovenant(id)` / `covenantTamperToggle()` /
  `covenantExport()`; standing state + `standingTamperToggle()`. Mirror the existing action idiom
  (mutate deterministic state → `rerender()`; bad input = clean no-op).
- [ ] Seed: a standing arrangement (e.g. employer «أبو فهد» → worker «راميش», 800/شهر × 3 cycle keys); the
  borrower view reuses the existing `R-FAHD` (Naif owes فهد) + at least one overdue «عليّ»; the covenant log
  reuses `R-CAFE` + its reminder history.
- [ ] Wire entry points: a «سِجلّ المعروف» button from the daftari row sheet and from the dispute screen
  → `AhdApp.openCovenant(id)`; a «ما عليّ» + «سُلفة بالمعروف» card on home.
- [ ] Run the FULL gate (see Task 5). Green before proceeding.

## Task 5 — Verification + review + merge (integrator only)

- [ ] `cd tests && node run-tests.cjs && node offline-check.cjs && node dom-smoke.cjs && node structure-check.cjs` → demo core 184/0 + structure green.
- [ ] `cd tests && node app/run-app-tests.cjs` → all app suites green (now 32).
- [ ] Tripwire: `sha256sum -c _overnight/backup/demo.sha256` → `demo/index.html: OK`.
- [ ] Real-browser smoke of the 3 new screens if feasible (0 console errors); else rely on dom-smoke.
- [ ] Dispatch a code-review pass over the 3 new modules (spine, determinism, conservation, bugs); fix findings; re-run gate.
- [ ] Commit the branch, merge `feat/deepen-extend-features` → `overnight/deepening` (coordinate with the
  sibling via coordination_notes), re-run the gate on the merged branch.
- [ ] Update `_meta/STATUS.md` (a DONE line) after coordinating; write the Arabic report to the Downloads folder.

## Self-review (done)
Spec coverage: F1→T1, F2→T2, F3→T3, deepenings via new screens + integrator wiring (T4), spine checks in
Global Constraints + each test. No placeholders (each task has concrete signatures + assertions). Type
consistency: `makeBorrowerView`/`buildCovenantLog`/`sealCovenantLog`/`standingPosts`/`standingLedger` names
are used identically in tests + integrator. Reason enum keys fixed. Seal chain formula identical across F2/F3.
