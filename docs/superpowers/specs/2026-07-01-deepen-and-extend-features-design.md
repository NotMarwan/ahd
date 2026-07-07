# Deepen + Extend Ahd — Design Spec (2026-07-01)

> Author: Claude-D-3 (Opus 4.8), acting autonomously under the operator's "just act, don't ask"
> directive. This spec is **self-approved** on the operator's behalf (they delegated the design call and
> asked not to be asked). Every choice is checked against the spine and `docs/DECISIONS-FOR-MARWAN.md`;
> nothing here touches a Shariah-gated or sign-off item.

## 1 · The customer insight (why these, and not others)

Two independent code maps of the app converged on one finding: **Ahd is almost entirely creditor-first.**
`دفتري` is literally "the creditor's home"; the reminder ladder runs creditor → bank → debtor; the
borrower — the person Qur'an **2:280** is *about* («وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة») — has no home, no
voice, and no proof that mercy was extended. `settlement`, `settings`, `circle`, `dispute`, `proof` are
thin. This is both the biggest product gap and the most on-brand one (the soul is «كلمتك محفوظة، وعلاقتك
محميّة» — the *relationship* protected, which is inherently two-sided).

I put on three real consumer personas and let their unmet needs pick the features:

| Persona | Who | Today's pain | The feature it demands |
|---|---|---|---|
| **نورة** | a struggling borrower, salary late, ashamed | can only *wait* for the creditor to act; no dignified way to say "I need time"; no home for what she owes | **F1 · «ما عليّ» borrower home + borrower-invokable grace/pay** |
| **خالد** | a lender who wants his money without becoming "the bad guy" | reminds gently, grants grace, forgives — but none of it is *provable*; if it ever reaches a dispute, his good faith is invisible | **F2 · «سِجلّ المعروف» sealed good-faith / mercy trail** |
| **أبو فهد** | an employer paying a domestic worker under Musaned mandatory e-salary (Jan 2026) | occasionally advances interest-free money; must hand-create each عهد; no notion of a *standing* interest-free arrangement | **F3 · «سُلفة بالمعروف» standing/recurring two-party qard hasan** |

F1 + F2 close the borrower-dignity loop (the explicit open item **OT-P1other**); F3 captures the dossier's
strongest KSA growth wedge (Musaned). All three **deepen** existing thin features as a side effect (F1
deepens `daftari`'s creditor-only projection; F2 deepens `proof`/`dispute`/`timeline` from single-عهد to a
sealed multi-event exhibit; F3 generalizes `circle-adv`'s recurring-post concept to two fixed parties).

## 2 · Architecture (mirrors the existing app exactly)

Three **new, standalone** UMD feature modules + three **new** screens + three **new** TDD test files. Each
new module **reuses** engine + existing feature exports via DI/`require`; **none edits an existing feature
or screen file** — maximal isolation, zero regression risk to the 30 existing suites. The only shared files
touched (`app/app.js` router registration, `app/screens/home.js` cards, deterministic seed data) are edited
**by the integrator (me), not the feature agents**, so the three agents work on fully disjoint file sets.

```
app/features/borrower.js       (NEW)  ── reuses engine + Daftari + OpenLoan
app/features/covenant-log.js   (NEW)  ── reuses engine seal/fold primitives
app/features/standing-loan.js  (NEW)  ── reuses engine + circle-adv's cycle-key pattern
app/screens/borrower.js        (NEW)  route "mine"     · «ما عليّ · التزاماتي»
app/screens/covenant.js        (NEW)  route "maroof"   · «سِجلّ المعروف»
app/screens/standing.js        (NEW)  route "standing" · «سُلفة بالمعروف»
tests/app/borrower.test.cjs        (NEW)
tests/app/covenant-log.test.cjs    (NEW)
tests/app/standing-loan.test.cjs   (NEW)
app/app.js, app/screens/home.js    (INTEGRATOR-ONLY edits: register + seed + wire)
```

Every module is a dual Node/`window` UMD file `(function(root,factory){…})(…, function(ENGINE){…})`,
pure and deterministic (no `Date.now`/`new Date`/`Math.random`/`Intl`/`toLocaleString`/float money),
integer halalas via `toMinor`/`minorToFixed2`/`fmt`, seals via golden `sha256`/`sealBlock`/`GENESIS`,
canonical = array joined by `\n`. Screens are IIFEs that grab `window.AhdApp`, define `render(app)`
returning an innerHTML string, and call `App.registerScreen({key,label,icon,render})`.

## 3 · The three features

### F1 · «ما عليّ» borrower home + borrower-invokable grace/pay  (`features/borrower.js`)
- `borrowerObligations(records, viewer, engine, asOf)` → the viewer's **«عليّ»** debts as dignified rows,
  deterministically sorted (overdue → due-soon → open-term → settled), **amber not red, no day-counter
  exposed to the borrower**. Reuses `Daftari.rowFor`/status where available.
- `graceRequest(record, reasonKey, asOf)` → a deterministic **`GRACE_REQUESTED`** event initiated **by the
  borrower**, carrying `reasonKey` from a **fixed enum** (`salary_delay`/`medical`/`urgent_obligation`/
  `unspecified` — an enum, never free text, to stay deterministic + safe). It does **not** change any
  amount; a later lender **`GRACE_GRANTED`** re-spreads the remaining balance sum-preserving (the existing
  path — grace adds nothing, **no riba**).
- `payWhatEased(record, amountSAR, engine)` → borrower-initiated partial payment **clamped to remaining**
  (no overpay), integer halalas; conservation exact.
- `borrowerSummary(records, viewer, engine, asOf)` → `{ owedCount, totalRemainingMinor, inGraceCount }` —
  integers only, **no score, no band, no number-as-reputation**.
- Copy is dignified; **no penalty field can exist** (asserted in tests).

### F2 · «سِجلّ المعروف» sealed good-faith / mercy trail  (`features/covenant-log.js`)
- `buildCovenantLog(record, reminderHistory, engine, asOf)` → an **ordered** list of معروف events:
  reminders sent (by *Ahd*, **original amount only**, **no day-counter**), grace requested/granted, partial
  payments, إبراء, settlement, dispute — each with a stable canonical line.
- `sealCovenantLog(log, engine)` → **chains** each entry `seal_i = sealBlock(prev, sha256(canonical_i), i)`
  from `GENESIS` (golden primitives reused) → tamper-evident.
- `verifyCovenantLog(log, engine, tamperIndex?)` → recompute + compare; mutating entry *i* breaks the chain
  from *i* onward (live tamper demo, same UX as the other seals).
- `exhibitFor(log, engine)` → a **neutral court-exhibit** projection (parties, terms hash, the sealed
  معروف timeline, final status). **On-spine:** court-export of the *sealed record* is explicitly allowed;
  the trust signal is not. The exhibit **must contain no trust band / score / number-reputation** — a test
  regex-scans the serialized exhibit for forbidden tokens.

### F3 · «سُلفة بالمعروف» standing/recurring two-party qard hasan  (`features/standing-loan.js`)
- `makeStanding(spec)` → a standing arrangement between **two fixed parties** with a per-cycle amount + a
  **fixed list of cycle keys** (e.g. `["2026-01","2026-02",…]`) — **no `Date`**, deterministic.
- `standingPosts(standing, engine)` → deterministically projects **one sealed عهد per cycle key** (reusing
  the cycle-key pattern), each **interest-free**, each with its own canonical + seal via golden primitives;
  the payer is the lender — **no bank money, no fee, no penalty**.
- `standingLedger(standing, engine)` → running `{ postedMinor, repaidMinor, outstandingMinor }`, integer
  halalas, conservation exact, **no score**.
- `standingCanonical`/`standingSeal`/`verifyStanding` → own canonical (`arrangement=standing`,
  `riba=interest:false;…`), sealed + tamper-verify.
- **Honest seam** (mirrors how Nafath/PKI/TSA are handled): a visible const
  `WAGE_LINKAGE_SEAM = { musanedIntegration:false, needsCounselSignOff:true }`; the screen shows a ⚠️
  note that any wage-linkage / Musaned regulatory tie is a documented integration seam pending counsel
  (**OT-VAL**) — **nothing here asserts a regulatory integration** (keeps it on-spine + honest; AI issues
  no fatwa).

## 4 · Spine & DECISIONS-FOR-MARWAN compliance (checked per feature)

- **No riba / penalty / maysir / gharar.** F1 grace re-spread adds nothing; F1 has no surcharge field; F3
  posts are interest-free (ribaScan-clean terms). Integer halalas throughout; conservation asserted.
- **No score, never exported.** F1 summary is counts+integers only; F2 exhibit is test-guarded to exclude
  any trust/band/score token; F3 has no reputation at all.
- **Bank lends/holds nothing.** F3 is party-to-party; no pooled deposit (steers clear of **D-3**). F1/F2
  only index + witness.
- **Not D-1 self-disclosure.** F1 shows the borrower *their own* obligations; F2 exports the *sealed
  record* (court path), not a reliability signal to a counterparty. Neither builds counterparty lookup.
- **AI issues no fatwa.** F3's wage-linkage is flagged as a counsel seam, not asserted. Demo/golden
  functions and `engine.js` are never touched (tripwire `e2f48467…`).

## 5 · Verification

TDD per feature (failing test first). Full gate must stay green after integration: demo core **184/0** +
`structure-check`, app suites (now **32** with the 3 new files, auto-discovered), tripwire `e2f48467…`
unchanged, `app-offline`/`determinism` scanners clean. A code-review pass over the new modules (spine,
determinism, conservation, bugs) before merge to `overnight/deepening`.

## 6 · Out of scope (deliberately)

localStorage/multi-device sync (breaks determinism), witness co-sign / QR / good-standing export (D-1 +
production signing seams), pooled-deposit mode-B (D-3), any counsel-only assertion (OT-VAL/OT-CITE). These
stay for the operator/Marwan.
