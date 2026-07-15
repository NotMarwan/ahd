# Ahd (عهد) — Publishable Product Spec · v1.0

> **Ahd (عهد)** — *"your word, written and witnessed, with dignity."*
> An interest‑free (قرض حسن · *qard hasan*) prototype where a bank **witnesses, seals, and settles**
> interpersonal loans — and never lends its own money, never judges, charges no interest or penalty, and
> keeps no credit score. The product is **Arabic‑first and RTL**; Arabic terms below carry English
> glosses.

This spec describes the **v1.0 ship surface** as actually built across the frozen demo
(`demo/index.html`) and the parallel app (`app/`). It is deliberately honest
about what is shipped, what is v2, and what needs sign‑off before it can ship at all.

---

## 1 · What Ahd is (and is not)

Ahd is a **witness and a ledger**, not a lender. When two people make a قرض حسن, Ahd:

1. drafts the plain‑Arabic terms (علّام / ALLaM, simulated) and screens them for ربا (riba),
2. takes both parties' consent, **seals** the record with real SHA‑256 into an append‑only hash‑chain,
3. tracks the agreement's life by **folding an append‑only event log** (no silent edits to a sealed
   obligation), and
4. helps people **settle** — directly, by netting mutual debts (Muqassa), or by gentle, dignified
   reminders.

Ahd is **not** a debt collector, a credit bureau, a lender, or a judge. Those exclusions are encoded, not
just promised (see §4).

---

## 2 · The v1.0 ship surface

### 2.1 Witnessed record + tamper verify — *the foundation* · **demo**

Every عهد becomes a **canonical, line‑joined record** (`canonical`) hashed with a real, offline,
synchronous SHA‑256 into an append‑only chain:
`seal = sha256(prev_hash + canonical_hash + seq)`, from a fixed `GENESIS`. The main demo record's golden
seal is **`6c9410b9…`**. A live **tamper‑verify** proves any change to the amount breaks the seal
(`verifyRecord(intact).ok === true`, `verifyRecord(tampered).ok === false`). The record cites
**`basis=Quran:2:282`** ("write down the debt") and explicitly records `riba=interest:false;
late_penalty_to_lender:false; gharar:none`.

### 2.2 المقاصّة · Muqassa (debt netting) — **demo**

Real greedy **min‑transfer netting** over a ربع's mutual IOUs, with a **conservation invariant** (the sum
of balances is preserved exactly; integer halalas, deterministic tie‑break by fixed node order). The
showcase reduces **9 IOUs → 2 transfers**. Each affected party consents to their **new** leg before
commit (novation). In the build, the 9 golden IOUs are themselves the **union of the circles people
actually made**, so netting's source is real, not hardcoded.

### 2.3 الدائرة · Circle — *the everyday on‑ramp* — **demo (G1–G4)** + **app (advanced)**

A Circle is a **thin parent over N bilateral qard‑hasan shares** born from one event (a trip, shared
rent, a group gift). The bank witnesses each share as its own عهد — **no new financial primitive**, just
an aggregation with a per‑halala split that preserves the sum exactly. Status is **derived** from the
shares' folds (CIRCLE_DRAFT → CIRCLE_OPEN → CIRCLE_PARTIAL → CIRCLE_KEPT). Dignity is preserved:
organizer‑only status, group reminders, grace, generous إبراء, and **no number or score**.

The parallel app adds the **advanced** Circle:
- **بالأصناف** (by‑item split) — each item split only among who ordered it; Σ shares == Σ items exactly.
- **قِسْمة دائمة** (recurring auto‑post) — deterministic posts over given cycle keys (no `Date`); the
  payer is excluded from owing.
- **تخريج قَيْد → عهد** (graduation) — a circle debt gone serious **graduates into «القرض المفتوح»** (an
  open‑term witnessed عهد), sealed with the golden primitives, **provenance** linked back to the circle.

### 2.4 «دفتري» · My Ledger — *the creditor's home* — **app**

The retention spine the event‑driven demo lacked. Every عهد the viewer is party to, split into **«لي»**
(owed to me) and **«عليّ»** (I owe), each with amount, remaining, next‑due or an **amber overdue chip**,
and an engine status word (no new vocabulary). Deterministic sort: most‑overdue → due‑soon → settled,
against a fixed `AS_OF`.

Its headline is **«تذكيرٌ بالمعروف»** (*a reminder, kindly*): when a debt is overdue, **Ahd — the neutral
witness — sends a warm, scripture‑grounded reminder to the debtor on the creditor's behalf**, so the
creditor never has to be the bad guy. Guardrails are structural:
- sent **by Ahd**, not by the creditor;
- the **original amount only** — there is no field where a surcharge could exist;
- **no day‑counter shown to the debtor** (no shaming clock);
- every reminder ships with the **«أحتاج وقت»** (grace) exit;
- a **finite, merciful cadence ladder** — Tier 1 → cooldown (7 days) → Tier 2 → **STOP** → hand back to
  the creditor with three non‑punitive choices: keep waiting · forgive · export.

### 2.5 «القرض المفتوح» · Open‑term loan (*متى ما تيسّر*) — **app**

A first‑class **open‑term** qard hasan: **no schedule, no due date, never overdue** — the classical,
authentic shape of a loan (repaid whenever eased). A deliberately **quiet** panel shows only
**«المتبقّي»** (remaining) — no red, no countdown. The borrower pays **any partial amount** anytime
(clamped to remaining; no overpay); the lender owns **إبراء** (forgive full, or partial with the rest
left open). **Conservation is exact** in every state (`paid + forgiven + remaining == principal`, integer
halalas). It carries its **own** sealed record (`term=open / schedule=NONE / due=none`, basis
**`Quran:2:280`** — grace) sealed with the engine's golden primitives, with a live tamper‑verify.

---

## 3 · On‑spine guarantees — checklist

The bank's constraints are enforced in code, not merely stated in copy:

- [x] **The bank lends nothing.** No primitive moves bank principal. Records are *between people*; the app
      indexes and witnesses them.
- [x] **The bank judges nothing.** A dispute becomes a `DISPUTE_RAISED` event → state `DISPUTED`
      («محلّ خلاف — للقضاء»). The path is **court‑export of the sealed record**, never a verdict.
- [x] **The bank charges no interest and no penalty.** `RIBA_RULES` block interest / late‑penalty /
      percentage‑of‑principal / commission terms; the defaulted state is explicitly
      **«متعثّر — بلا غرامة»** (defaulted — *no penalty*); reminders carry only the original amount.
- [x] **No credit score.** `trustSignal` is a windowed, time‑decayed kept‑ratio computed from each
      person's **own** sealed history; the UI shows a **3‑band qualitative word** (`TRUST_BAND_AR` —
      «وفّى بعهوده» / «وفّى بأغلب عهوده» / «عليه وعدٌ متأخّر» / «جديد»), **never a number**. Own‑history
      only, never exported, never underwrites.
- [x] **Mercy is built in.** Grace (2:280) re‑spreads a remaining balance with **the sum preserved
      exactly** (rescheduling adds *nothing*); forgiveness (إبراء) is a first‑class action; the reminder
      ladder **ends in mercy**, not punishment.

---

## 4 · Shariah guarantees — checklist

- [x] **No ربا (riba).** Interest, late penalty (penalty = riba), percentage‑of‑loan, and commission are
      blocked by a deterministic rule engine (`ribaScan` over `RIBA_RULES`). A negation guard keeps
      *"بلا فائدة"* (without interest) clean while *"فائدة"* is blocked.
- [x] **No ميسر / no غرر (gharar).** Amounts are fixed and known (integer halalas; no chance, no
      speculation). For the **open‑term** loan, an unspecified repayment time does **not** create gharar:
      a قرض حسن is a contract of *tabarru'* (benevolence), in which leaving the term open is permitted —
      indeed encouraged (إنظار / granting respite).
- [x] **Basis in Qur'an.** Records cite **2:282** ("write down the debt"); the open‑term type is founded
      on **2:280** ("if the debtor is in hardship, then postponement until ease"). إبراء invokes
      **﴿وأن تصدّقوا خيرٌ لكم﴾**.
- [x] **AI issues no fatwa.** علّام/ALLaM only **drafts** plain‑Arabic terms (simulated); `ribaScan` only
      **flags** riba vocabulary. No religious ruling is produced by the app.

---

## 5 · Determinism, offline & seal guarantees

- [x] **Fully offline.** Both builds run with **zero network**. The demo path is statically proven to
      contain no `fetch`/`XHR`/`WebSocket`; the app source is scanned the same way.
- [x] **Deterministic.** No `Date.now`, `new Date`, `Math.random`, `Intl.*`, or `toLocaleString` in live
      logic. Day math is a pure civil‑days algorithm against a **fixed `AS_OF`**; thousands‑grouping is a
      hand‑rolled `fmt()` (so output never depends on the runtime's ICU build). The same inputs produce
      **byte‑identical** outputs on every machine, every run.
- [x] **Integer money.** Values are **halalas** (`1 SAR = 100`); everything hashed and every netting runs
      on integers; SAR is a display projection only. `respread()` splits a total so the **sum is preserved
      exactly** — no rounding ever invents a phantom halala (no rounding‑riba).
- [x] **Real seals, tamper‑evident.** SHA‑256 is genuine and synchronous; seals form an append‑only chain
      from a fixed `GENESIS`; the verifier recomputes from (possibly tampered) data and compares. The
      demo's golden seal **`6c9410b9…`** is pinned by tests; the same primitives are reused (not
      re‑implemented) by the open loan, the circle, and graduation.
- [x] **Proven, not promised.** The demo is frozen behind a tripwire SHA‑256 (`e2f48467…d1b8be40`). The
      app's engine is a **byte‑faithful copy** of the demo's logic, enforced by a parity test. Test
      coverage (recomputed live 2026-07-15; single source of truth is the `run-all.cjs` banner): **core 184 + app 2,977 (84 suites) + structure 14 = 3,175 assertions, all green** (Node ≥ 18, zero deps; one command: `cd tests && node run-all.cjs`).

> **Note:** SHA‑256 hashing is real here, as is the bank's own Ed25519 signature over each sealed block
> (`protocol/bank-key-demo.cjs` — a FIXED demo keypair, NOT production custody) and an RFC‑6962 Merkle
> inclusion proof over a batch of sealed blocks (`protocol/verify-ahd-seal.cjs`). Still-unwired
> production seams: both parties' own Nafath/PKI signatures (WYSIWYS attribution) and an RFC‑3161
> timestamp from a licensed TSP — documented integration points, not yet wired in this prototype.

---

## 6 · Honest status — demo‑now vs v2 vs needs sign‑off

| Capability | Status | Notes |
|---|---|---|
| Witnessed record + tamper verify | **demo‑now ✅ (shipped)** | Real SHA‑256, append‑only chain, golden seal `6c9410b9…`. |
| Muqassa netting (9 IOUs → 2 transfers) | **demo‑now ✅ (shipped)** | Conservation invariant; per‑leg consent (novation). |
| Circle G1–G4 (occasion + standing) | **demo‑now ✅ (shipped)** | Derived status; dignity‑preserving; no score. |
| «دفتري» creditor home + «تذكيرٌ بالمعروف» | **demo‑now ✅ (shipped, in `ahd-app`)** | Bank‑sent reminder; amber‑not‑red; finite merciful ladder. |
| «القرض المفتوح» (open‑term) + إبراء | **demo‑now ✅ (shipped, in `ahd-app`)** | Never overdue; exact conservation; own golden seal. |
| Advanced Circle — بالأصناف split | **demo‑now ✅ (shipped, in `ahd-app`)** | Sum‑preserving per item; no phantom riba. |
| Advanced Circle — recurring auto‑post | **demo‑now ✅ (shipped, in `ahd-app`)** | Deterministic over cycle keys; no `Date`. |
| Advanced Circle — graduation قَيْد→عهد | **demo‑now ✅ (shipped, in `ahd-app`)** | Composes into «القرض المفتوح»; provenance to the circle. |
| Production signing seams (Nafath/PKI + RFC‑3161 TSA) | **v2** | Hashing is real; signature/timestamp authorities are integration seams. |
| Auto‑reminder cadence + escalation ladder (set‑and‑forget) | **v2** | Manual ladder ships now; consent‑first automation is v2 (default OFF). |
| «دفتر العائلة» / «أمانة الورثة» (estate clarity for open loans) | **v2** | Sealed records persist; inheritance flow is future work. |
| Borrower‑initiated loan request ("اطلب قرضًا حسنًا") | **v2** | Reverse‑invitation direction; not built. |
| **Self‑disclosure trust badge — «سجلّ وفائي»** | **NOT shipped — needs Shariah/privacy sign‑off** | Owner‑initiated disclosure of one's own band word only; **no counterparty lookup** is built (that would breach no‑export). Deferred pending privacy review. |
| **Mode‑B pooled‑deposit «نجمع للهدف»** | **NOT shipped — needs Shariah sign‑off** | Built only as a **pledge sketch**: `poolHeldByBank: false`, `shariahReviewNeeded: true`, visible ⚠️ guard. The bank holds **no** pooled deposit (أمانة/غرر concerns); pledges would convert to mode‑A qard hasan at the moment of spend. |

---

## 7 · Boundaries we keep (so the product stays honest)

- **The bank never pulls anyone's reliability.** The only reliability signal is what a person **chooses to
  show about themselves** (the v2 self‑disclosure badge), and even that is gated for sign‑off. There is no
  "check his score before you lend" anywhere in the build.
- **Late is never a crime.** It is shown in **amber**, never red; it never triggers a fee, a penalty, or
  an automatic escalation. The open‑term loan cannot even *produce* a "late" state.
- **The bank holds no pooled money.** The only pooling concept (mode‑B) is a pledge sketch with no bank
  deposit, explicitly flagged for Shariah review and not shipped.
- **Everything is reproducible.** Any seal and any agreement status can be reconstructed from first
  principles (the canonical bytes and the event log) — which is why determinism and integer money are
  non‑negotiable, not stylistic.

---

*Ahd v1.0 — قرضٌ حسنٌ مكتوبٌ ومشهود، بكرامة.*
