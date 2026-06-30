---
title: "عهد · Ahd — Muqassa Netting Engine (algorithm, proofs, edge cases, vectors)"
tags: [ahd, backend, muqassa, netting, algorithm, deep]
owner: Claude-Backend (PROMPT 2 — Deepen the Data & Back-end)
status: spec-v1 (reference in ref/ahd-ref.mjs; vectors in test-vectors.md)
updated: 2026-06-19
---

# ⚖️ Muqassa — multilateral debt netting, specified and proven

> **مقاصّة (muqāṣṣah)** is a classical Islamic settlement act: mutually offsetting debts are
> discharged against each other. Ahd computes the offset for a *circle* of sealed bilateral
> qard-hasan debts and executes it as a **consented multilateral settlement** — never a silent
> counterparty swap ([[contracts|S8]]). This document gives the formal model, proves the three
> load-bearing invariants, characterises optimality **honestly** (the true minimum is NP-hard),
> and specifies the real-world cases the demo glosses: partial payments, multi-currency, a node
> defaulting mid-cycle, and consent-revocation rollback. Reference: `ref/ahd-ref.mjs`; vectors:
> [[test-vectors]].

---

## 1. The model

Let the circle be a set of parties `P` and a multiset of **matured, same-currency, dual-sealed,
qard-type** bilateral debts (an edge `from → to : amount_halalas > 0` means *from owes to*).
Eligibility is strict ([[contracts|S8]]): only debts that are matured (due), in one currency,
of a netting-eligible kind, and **already sealed by both parties** enter the graph — *you cannot
net a debt nobody co-signed* (closes the Muqassa-collusion vector T5).

Define each party's **net position** (integer halalas):

```
net[p] = Σ_{e: e.to = p} e.amount  −  Σ_{e: e.from = p} e.amount
```

`net[p] > 0` ⇒ **creditor** (owed); `net[p] < 0` ⇒ **debtor** (owes); `net[p] = 0` ⇒ settled.

> **Goal.** Produce a transfer set `T` (each `from → to : amount`) that (a) leaves every party's
> net exactly zero, (b) preserves every party's net position to the halala, and (c) uses **few**
> transfers. We claim **≤ P−1**, *not* "the minimum" (§4).

A settlement uses only `net[·]`, never the individual edges: any circle with the same net vector
settles identically. This is the netting insight — the tangle of edges collapses to a single
balance vector.

---

## 2. The algorithm (greedy max-debtor / max-creditor)

```
1. net[p] = Σ incoming − Σ outgoing                          # O(E)
2. C = { (p, net[p])  : net[p] > 0 }  as a max-heap by amount  # creditors
   D = { (p, −net[p]) : net[p] < 0 }  as a max-heap by amount  # debtors
   (deterministic tie-break: amount desc, then party-id asc)
3. while C and D non-empty:
     d = max debtor;  c = max creditor
     m = min(d.amount, c.amount)        # integer halalas
     emit transfer  d.p → c.p : m
     d.amount −= m;  c.amount −= m
     drop d if d.amount == 0;  drop c if c.amount == 0
4. return transfers
```

**Complexity.** Building balances is `O(E)`; each loop iteration zeroes ≥ 1 party, so there are
≤ `P − 1` iterations, each `O(log P)` on the heaps ⇒ **`O(E + P log P)`**. For a friend circle
(`P ≤ ~12`) this is microseconds. Reference: `greedyNetting()`.

**Determinism.** Integer halalas + a total tie-break order ⇒ the same circle always yields the
same plan (a property the consent flow and the audit log depend on).

---

## 3. Correctness — the three invariants, proven

### 3.1 Conservation (net-preservation)

**Claim.** After settlement every party's net is exactly zero, and no party moves more cash than
their *own* net obligation.

**Proof.** Let `Φ = Σ_{p∈P} net[p]`. Initially `Φ = 0`: every edge contributes `+amount` to one
party and `−amount` to another, so the edge sum telescopes to 0. Each emitted transfer of `m`
decrements one debtor's deficit by `m` and one creditor's surplus by `m`, i.e. it adds `+m` to a
negative `net` and `−m` to a positive `net` — leaving `Φ` invariant at 0. A party is removed only
when its residual reaches **exactly** 0 (integer arithmetic ⇒ no `ε`-residue). The loop ends only
when `C` or `D` is empty; since `Φ = 0` throughout, *one* empty side forces the other empty too
(a non-zero remaining surplus with no deficit would make `Φ ≠ 0`). Hence at termination every
`net[p] = 0`. Finally, a debtor `p` only ever *sends*, and the sum it sends telescopes to exactly
`|net[p]|` (it leaves the heap when its residual hits 0); symmetrically a creditor only receives
exactly `net[p]`. ∎

**Mechanised check.** `conservation()` recomputes, per party, `net_before − cash_moved` and
asserts it is 0 for all, and that `Σ paid == Σ received`. Demo: see §6.

### 3.2 The `≤ P − 1` transfer bound

**Claim.** Greedy emits at most `P − 1` transfers (where `P` counts parties with non-zero net;
trivially ≤ total parties − 1).

**Proof.** Let `k = |{p : net[p] ≠ 0}|`. Because `Φ = 0`, `k ≠ 1`. Every iteration removes **at
least one** party from a heap (the one whose residual hits 0; when `m = d.amount = c.amount`,
*two* are removed). After the second-to-last removal only one non-zero party could remain — but
`Φ = 0` forbids a lone non-zero party, so the final transfer removes the last **two**. Thus the
number of transfers ≤ `k − 1 ≤ P − 1`. ∎

> On-screen copy ceiling: **"أقل تحويلات ممكنة عمليًا"** (fewest practical transfers) /
> "≤ P−1", **never** "the minimum" and **never** "each party pays once" (a star circle refutes
> the latter — §5).

### 3.3 Single-sided participation

**Claim.** In the greedy plan each party is **either** a payer **or** a payee, never both.

**Proof.** A party enters exactly one heap, determined by the sign of `net[p]` (or neither, if
0). A debtor's residual only ever decreases toward 0; it never becomes a creditor. So a debtor
appears only as a transfer *source* and a creditor only as a *sink*. ∎ (This is why the demo can
truthfully say "كلٌّ إمّا يدفع فقط أو يقبض فقط".)

---

## 4. Optimality — the honest characterisation

### 4.1 The true minimum is NP-hard

The **minimum number of transactions** that settles a balance vector is

```
min_transfers = (#non-zero parties) − (max # of disjoint non-empty zero-sum subsets of the balances)
```

Maximising the number of disjoint zero-sum subsets is the **set/number-partition** problem — it
contains SUBSET-SUM and 3-PARTITION as special cases — and is therefore **NP-hard**. So no
polynomial algorithm computes the exact minimum for arbitrary circles unless P = NP. **We do not
claim to.**

### 4.2 What greedy guarantees, and when it is exact

- Greedy is **`≤ P−1`** (§3.2) and runs in `O(E + P log P)`.
- Greedy is **exactly optimal whenever the balances contain no proper non-empty zero-sum subset**
  (the common friend-circle case): then `min_transfers = k − 1`, which greedy achieves.
- When proper zero-sum subsets exist, greedy is **near-optimal** but can miss a partition.

### 4.3 A concrete worst-case (greedy > optimal), machine-verified

Our generator searches a deterministic LCG stream of balance vectors for the first instance where
greedy exceeds the exact optimum. It finds (`ref/generate-vectors.mjs`):

```
balances:  P0=−2  P1=+4  P2=−5  P3=+2  P4=+1     (Σ = 0)

greedy  → 4 transfers:  P2→P1:4  P2→P3:1  P0→P3:1  P0→P4:1     (valid ✓)
optimal → 3 transfers:  P2→P1:4  P0→P3:2  P2→P4:1               (valid ✓)
```

Both plans are checked by `verifyPlan()` to clear every net. Greedy splits the `{P0=−2, P3=+2}`
pair across two transfers because magnitude-matching sent `P2` to `P3` first; the optimum spots
the exact `−2/+2` cancellation. **Honest claim: greedy is `≤ P−1`, optimal in the common case,
and never worse than `P−1`; the exact minimum needs the solver below.**

### 4.4 Exact solver for small circles

For `P ≤ ~15` we offer an **exact minimiser** (`minTransfersExact()`, DFS over sign-opposite
cancellations with a perfect-cancel cut). It is exponential in the worst case but trivial at
friend-circle sizes, and lets the product *offer* the true minimum when a circle is small and the
saving matters. Greedy remains the default (deterministic, fast, provably `≤ P−1`).

---

## 5. Edge cases (all reproduced in test-vectors)

| Case | Input | Behaviour | Vector |
|---|---|---|---|
| **Pure equal cycle** | A→B→C→A, all 1,000 | every net = 0 ⇒ **0 transfers** (fully washed) | `pure_cycle = 0` |
| **Single dominant creditor (star)** | A,B,C each → D 100 | `P−1` transfers, all → D | `star = 3` |
| **Owes & is owed equally** | A→B 500, B→A 500 | both nets 0, both drop out | `{A:0,B:0}` |
| **Disconnected sub-circles** | two independent groups | nets are global ⇒ independent transfer clusters, no special-casing | (general) |
| **Floating residue** | — | impossible: integer halalas ⇒ exact, no `ε` | (by construction) |

---

## 6. The demo circle — worked, in halalas

Nine IOUs among five friends (amounts shown in SAR; engine runs halalas):

```
نورة→سارة 200  سارة→خالد 200  نورة→ليلى 250  ليلى→فهد 250  نورة→خالد 400
نورة→فهد 50   سارة→ليلى 150  ليلى→خالد 150  خالد→سارة 150
```

Balances (halalas): `نورة −90000, سارة 0, خالد +60000, ليلى 0, فهد +30000` (Σ = 0 ✓).
Greedy plan:

```
نورة → خالد : 60000 halalas (600 SAR)
نورة → فهد  : 30000 halalas (300 SAR)
```

- **9 IOUs → 2 transfers.** Conservation: `allZero = true`, `sumZero = true`, Σ paid = Σ received
  = 90000 halalas (900 SAR). نورة pays exactly her 900 net; خالد/فهد receive exactly 600/300.
- **Efficiency metrics** (`efficiency()`): transfer-reduction `1 − 2/9 = 0.778`; cash-reduction
  `1 − 90000/180000 = 0.500`; directed cycles detected feeding the wash = **2**.
- Greedy = exact = 2 here (no proper zero-sum subset beyond the trivial wash).

---

## 7. Real-world cases the demo glosses (specified)

### 7.1 Partial payments

A debt may be partly settled before netting. The engine nets the **outstanding matured** amount,
not the original principal:

```
outstanding(debt) = Σ_{i: schedule[i] matured ∧ status≠settled} schedule[i].amount_halalas
```

Only `outstanding > 0` matured legs become edges. A partially-paid installment is split: the paid
portion is gone; the unpaid remainder is an edge. Because amounts are integer halalas, partial
sums never drift.

### 7.2 Multi-currency

**Net per currency, independently. Never cross-net currencies.** Cross-currency offset would
require the bank to set an FX rate — a *pricing/trading* act outside the amana/wakala posture and
a gharar risk. The engine partitions edges by `currency` and runs §2 per partition:

```
input:  A→B 30000 SAR, B→A 20000 SAR, A→C 10000 USD
output: SAR → [A→B : 10000],   USD → [A→C : 10000]      (two independent plans)
```

A party with positions in two currencies appears in two independent plans and consents to each
leg separately. Reference: the `multi_currency` vector.

### 7.3 A node defaulting / dropping out mid-cycle

Netting executes as a **two-phase commit (saga)**, never a fire-and-forget batch:

```
Phase 0 — PLAN:    compute the greedy (or exact) plan from current balances.
Phase 1 — CONSENT: every party in the plan re-confirms their new leg(s) (novation, §8).
                   Each leg is a NEW bilateral obligation replacing the old ones.
Phase 2 — EXECUTE: fire all legs over sarie with idempotency keys, as one atomic batch.
```

If a node **defaults or its account is unfundable at Phase 2**:

- **Not yet executed (Phase 0/1):** abort the *whole* plan; fall back to the original sealed
  bilateral debts. No party is worse off (no leg fired). The defaulter remains liable on the
  *original* edges, exactly as before netting — Muqassa never *created* their liability.
- **Partially executed (Phase 2):** because each novated leg is independent and idempotent,
  legs that completed stand; the failed leg triggers **compensation** — the creditor who would
  have received from the defaulter is reverted to holding the *original* bilateral claim against
  the original debtor(s) for that slice, and any over-collected cash is returned by a reverse
  credit-push (sarie is credit-push, so "undo" = an explicit return transfer, idempotency-keyed).
  Invariant preserved: **no party ends having paid more than their pre-netting net.**

> Safer default for high-value circles: require **all** Phase-1 consents *and* a solvency
> pre-check before *any* Phase-2 leg fires (true all-or-nothing). Independent-cluster partial
> execution is an opt-in for large circles where one bad node shouldn't block everyone.

### 7.4 Consent-revocation rollback

Consent is **revocable before execution** ([[contracts|invariants]]).

- **Revoke during Phase 1:** the plan is voided. Options: recompute the plan **excluding** the
  revoker's legs (they keep their original bilateral debts) and re-consent the rest, or fall back
  fully to bilateral. The revoker is never forced into a novated counterparty.
- **Revoke after Phase 2 began:** treated as §7.3 partial-execution compensation — completed
  idempotent legs stand; nothing further fires; reverse transfers restore any party who moved
  more than their net. The append-only event log records `MUQASSA_REVOKED` with the compensating
  entries, so the audit trail shows the full path (no silent rewrite — see [[seal-scheme-spec|§4]]).

---

## 8. Consent as novation (the legal correctness step)

Netting changes *who-pays-whom*. Each new leg is a **consented novation / hawala**: the old
bilateral obligation is discharged and replaced by the new one **only with the affected parties'
fresh consent** ("instead of paying سارة, you'll pay خالد 600 — confirm"). Batch-approve in one
tap; a decline drops to bilateral fallback for that leg ([[contracts|S8]]). This closes the
unconsented-counterparty-swap correctness hole (T5b) and keeps Muqassa a *multilateral
settlement the parties agreed to*, not an operation done *to* them.

---

## 9. Abuse resistance (netting-specific)

| Vector | Defence |
|---|---|
| **Wash-trading to inflate trust / launder** (fake circular IOUs) | net only **sealed, dual-signed, on-rail** debts; a net-zero ring with no real settlement transfer is an **AML signal**, not a clean trust boost; the trust signal counts **settled-on-rail** obligations only ([[trust-signal-and-graph-analytics]]). |
| **Unconsented counterparty swap** | every novated leg re-confirmed (§8). |
| **Replay of a settlement** | idempotency key `ahd_id ‖ schedule_index`; reverse transfers also keyed. |
| **Currency-mixing manipulation** | cross-currency netting refused (§7.2). |

---

## 10. Reproduce

```
node ref/generate-vectors.mjs            # human-readable
node ref/generate-vectors.mjs --json     # machine-readable (ref/vectors.json)
```
Functions: `balances`, `greedyNetting`, `conservation`, `findCycles`, `efficiency`,
`minTransfersExact`, `greedyCountFromBalances`, `verifyPlan`. Every number in §4–§6 is emitted by
that script and pinned in [[test-vectors]].
