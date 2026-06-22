# Phase 2 — New feature-discovery sprint (design + prioritized backlog)

> Autonomous brainstorm (user asleep, explicitly: "brainstorm in plans/ledger, not interactively …
> decide a prioritized backlog and justify it"). The brainstorming approval-gate is overridden by
> that standing instruction; my judgment substitutes for it, justified here, and every feature still
> passes the hard gate (spine + green tests + real-browser verify).

## Context
The unified product (`project/ahd-app/`) has 7 screens: home, create (أنشئ عهدًا), دفتري,
القرض المفتوح, الدائرة (treasurer), الدائرة+, المقاصّة. The engine is the parity-proven golden copy.
What's MISSING is the connective tissue that makes it feel like a complete, witnessed product over
time — not just isolated feature screens.

## Selection criteria (each candidate scored on all six)
1. **On-spine** — expresses "witness/seal/settle/net; never lend/judge/charge/score"; no riba; dignity.
2. **Genuinely missing** — not a rebuild of the 7 screens.
3. **High value** — deepens a real persona need toward a publishable product.
4. **Filmable** — modular + cinematic, so Phase 3 can showcase it standalone.
5. **Modular/separable** — its own `features/*` module + `screens/*` screen, cleanly isolated.
6. **Deterministic-feasible** — buildable with no `Date.now`/`Math.random`/`Intl`/float money.

## Candidates considered (and why ranked where they are)
| Idea | On-spine | Missing | Value | Filmable | Verdict |
|---|---|---|---|---|---|
| **Witness timeline (سِجلّ الشهادة)** | ★ the bank *witnesses* → see it | ✓ | high | ★★★ events cascade | **BUILD #1** |
| **Proof-pack / evidence export (حافظة الإثبات)** | ★ witnessed = admissible (نظام الإثبات) | ✓ (only a stub flash today) | high | ★★★ seal locks, tamper turns red | **BUILD #2** |
| **Dispute pause (محلّ خلاف → تراضٍ/قضاء)** | ★★ proves "never judges" | ✓ (only a chip today) | high | ★★ record freezes, bank steps back | **BUILD #3** |
| **Settings + Arabic-Indic digits (D-2) [+Hijri]** | ✓ localization, resolves a logged decision | ✓ | med-high | ★★ digits/dates morph | **BUILD #4** |
| Onboarding / first-run | ✓ | ✓ | med | ★ | backlog |
| Borrower-side deepening | ✓ | partial (دفتري «عليّ» exists) | med | ★ | backlog |
| Search/filter in دفتري | neutral | ✓ | low (6 seed records) | ✗ | backlog |

YAGNI: dropped search/filter (no scale yet), and a separate borrower app (overlaps دفتري «عليّ»).

## The four features (design)

### F1 · سِجلّ الشهادة — Witness Timeline  ⟶ `features/timeline.js` + `screens/timeline.js`
**What:** one chronological feed of every witnessed event across all the user's عهود — sealed,
activated, a bank-sent gentle reminder (*on your behalf*), grace granted (٢٨٠, no penalty), settled
(ذمّة محفوظة), forgiven (إبراء — صدقة), disputed (paused, not judged). Each row: icon · warm Arabic
phrase · parties · amount · tone. **Late = amber. No score. No shaming. No invented clock** — order
is a deterministic synthetic sequence derived from record order + event order (newest first), labelled
with the عهد it belongs to and its `dueISO` where relevant.
**Why on-spine:** «المصرف يشهد» — the timeline literally *is* the witness made human.
**Pure core:** `buildTimeline(records, reminderHistory, engine, asOf) → [{icon, kind, ar, who, amountMinor, tone}]`.
Tones: `sealed | kept | mercy | amber | neutral`.

### F2 · حافظة الإثبات — Proof-pack (evidence export)  ⟶ `features/proof.js` + `screens/proof.js`
**What:** pick a sealed عهد → a formatted, exportable *evidence document*: the canonical content,
the **SHA-256 content hash**, the **block seal**, the **genesis→block hash-chain**, a **live
tamper-verify** (recompute + compare; a «اعبث بالمبلغ» toggle breaks the seal → ✗, restore → ✓), and
the «مقبولة كدليلٍ إلكتروني · نظام الإثبات» framing + a simulated «صدّر / شارك» action.
**Why on-spine:** the core promise — «كلمتك محفوظة». The proof stands on cryptography, **not** the
bank's judgment. Reuses the **golden** `sha256 / canonical / sealBlock / verifyRecord` (called, never
modified).
**Pure core:** `buildProofPack(record, engine) → {canonical, contentHash, seal, chain}` +
`verifyProof(record, engine, {tamperAmountMinor?}) → {ok, recomputed}`.

### F3 · محلّ خلاف — Dispute Pause  ⟶ `features/dispute.js` + `screens/dispute.js`
**What:** a disputed عهد (DISPUTE_RAISED, seed `R-DISP` / ماجد) → the bank **pauses**: no reminders,
**no penalty**, status «محلّ خلاف»; the sealed record is preserved as a **neutral exhibit for both
sides**; two dignified paths — **تراضٍ** (reconcile, the encouraged path) and **قضاء** (the courts),
each able to export the proof-pack. Headline: **«عهد يشهد ولا يحكم»**.
**Why on-spine:** the only screen that *demonstrates* "never judges disputes," a spine pillar with no
current UX.
**Pure core:** `disputeView(record, engine) → {paused:true, noPenalty:true, neutralExhibit, paths:[…]}`.

### F4 · الإعدادات — Settings + Arabic-Indic digits (resolves D-2) [+ Hijri if budget]
⟶ `features/settings.js` + `screens/settings.js`
**What:** a settings/about screen. Headline: the **Arabic-Indic digit toggle** (٠١٢٣٤ ↔ 01234) — a
pure deterministic display map, applied app-wide — which **resolves logged decision D-2 by making it
the user's choice** rather than my unilateral call. Optional **Hijri date** toggle (Umm-al-Qura
*tabular* conversion — pure integer arithmetic, no `Intl`/`Date`). Plus a dignified **«ما لا نفعله»**
panel (we don't lend / judge / charge / score).
**Why on-spine:** localization for a Saudi product; turns a deferred decision into a user setting.
**Pure core:** `toArabicDigits(s)`, `applyDigits(s, mode)`; (Hijri) `gregToHijri(yyyy,mm,dd) → {y,m,d}`.

## Build order & rationale
**F1 → F2 → F3 → F4**, each fully (TDD → real-browser verify → commit → push) before the next.
F1/F2 are the most cinematic and most on-message (best Phase-3 material); F3 proves a unique spine
pillar; F4 resolves D-2. Stop adding features when the budget needs to be reserved for a quality
Phase-3 promo; remaining ideas stay in the backlog above. Each feature is independently filmable.

## Cross-cutting rules (every feature)
- New files only; reuse the golden engine (call, never modify). Integer halalas; no float money.
- Determinism: no `Date.now`/`Math.random`/`Intl`/`.toLocaleString`. Fixed `AS_OF`.
- TDD: failing Node test first (`app/<feature>.test.cjs`, auto-discovered), then implement.
- Escape all interpolated strings (XSS) like the existing screens.
- Real-browser verify (Chromium): renders, 0 console errors, Arabic/RTL correct, no score/%. Screenshot.
- Grow the gate; never weaken an assertion. Commit + push per feature. Update log + ledger.

## Test strategy
Each feature: a Node unit suite over the pure module (invariants: conservation where money moves,
tones/labels correct, no penalty ever, determinism on re-run) + new dom-smoke assertions for the
screen (renders the right Arabic, no score/%, amber-not-red). Targets are relative-determinism +
absolute golden pins for any new seal bytes (mirroring `golden-vectors.test.cjs`).
