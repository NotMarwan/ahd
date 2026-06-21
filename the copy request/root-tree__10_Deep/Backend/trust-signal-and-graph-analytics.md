---
title: "عهد · Ahd — Trust Signal + Graph Analytics (the /01 Data layer)"
tags: [ahd, backend, data, trust-signal, graph, analytics, deep]
owner: Claude-Backend (PROMPT 2 — Deepen the Data & Back-end)
status: spec-v1 (reference in ref/ahd-ref.mjs; vectors in test-vectors.md)
updated: 2026-06-19
---

# 📊 The Data layer — a non-credit trust signal + circle graph analytics

> This is the substance behind the **/01 Data** criterion: two real, specified, testable
> computations. **(A)** A per-person **trust signal** — a windowed, time-decayed *kept-ratio*
> over the user's **own** sealed history — engineered to be **structurally incapable of becoming
> a credit score**. **(B)** A **circle/graph analytics** layer over the social-debt graph: cycle
> detection that feeds Muqassa, settlement-efficiency metrics, and **anonymised aggregate**
> insights a bank can act on. Reference: `ref/ahd-ref.mjs`; vectors: [[test-vectors]].

---

# Part A — The trust signal

## A1. Definition

For a person `u`, let `Eᵤ` be the **matured obligations from u's own sealed Ahd history** — each
an event `{ t: "YYYY-MM", kept: bool }`, where `kept` = settled on time. Fix a deterministic
evaluation epoch `AS_OF` (never `Date.now()` — determinism is required for reproducibility and
for the demo). With a window `W` months and a decay half-life `λ` months:

```
age(e)      = months_between(e.t, AS_OF)
in_window   = 0 ≤ age(e) < W
weight(e)   = 0.5 ^ (age(e) / λ)            # exponential time-decay
kept_ratio  = Σ_{e ∈ window} weight(e)·[e.kept] / Σ_{e ∈ window} weight(e)
window_count= |{ e : e ∈ window }|
```

Config (pinned): `AS_OF = 2026-06`, `W = 24`, `λ = 12`. A 2019 default contributes almost
nothing; a recent one dominates. The **output is a 3-band qualitative mirror**, plus a separate
**current-state** flag `open_overdue` (a vow now past due) kept distinct from historical lateness:

```
band =
  count < 3              → "new"      (cold-start — never penalise)
  open_overdue           → "overdue"  (currently past-due)
  kept_ratio ≥ 0.85      → "kept"     ("وفّى بعهوده باستمرار")
  kept_ratio ≥ 0.60      → "mixed"
  else                   → "overdue"  (chronic low kept-ratio)
```

The internal `ratio_pct` exists **only** to drive the ring-fill geometry and band threshold; it
is **not a value the product surfaces as a number** (see A3). Reference: `trustSignal()`.

## A2. Why it is structurally NOT a credit score

This is the moat *and* the compliance shield. The signal cannot become a credit score because of
**four structural properties enforced in code and contract** ([[contracts|S9]]):

1. **No cross-party inference.** It is computed *only* from `u`'s **own** sealed obligations.
   There is no model that infers `u`'s reliability from *other* people, from social-graph
   position, or from non-Ahd transactions. (A credit bureau's defining move — pooling
   third-party data — is absent by construction.)
2. **No default-probability semantics.** It is a *descriptive* windowed ratio of past kept vows,
   not a *predictive* PD/score. It carries no calibration to a future-default likelihood and is
   never trained against repayment outcomes.
3. **No bureau semantics / no export.** It is **never** sent to SIMAH or any bureau, **never**
   aggregated cross-bank, **never** sold. It lives inside the dyad and is **private by default**.
4. **No underwriting use.** It **never** prices or approves any product. Using it to underwrite
   would make Ahd a lender — banned by the spine. The reference object carries the guard flags
   `used_in_underwriting:false, sent_to_bureau:false, is_number_exported:false,
   cross_party_inference:false` as machine-checkable assertions for callers/tests.

> It is a **trust *mirror* for two people**, shown to a prospective counterparty *at the moment
> they consider an ahd* — not a **trust *score* for the system**. A PDPL "automated decision with
> legal effect" cannot arise because no decision is automated and no legal effect attaches.

## A3. Display contract (and a flag for Claude Design)

Per [[contracts|S9]] the signal is a **3-band qualitative mirror**, **never a number/percentile**.

> ⚠️ **Hand-off to Claude Design (visual, not mine):** the current prototype renders the
> reputation ring with a numeric **`%` label** (`Math.round(ratio*100)%`). A *percentage shown as
> a trust indicator is exactly the "number" S9 forbids.* My back-end change makes the ring-fill a
> **genuinely computed** windowed kept-ratio (was a hardcoded fraction), but **removing/replacing
> the `%` text with a band word** ("وفّى بعهوده" / "جديد" / "عليه وعدٌ متأخّر") is a styling change
> — handed to Claude Design. The engine already returns `band` ready to drop in.

## A4. Failure modes (honest)

| Failure mode | Mitigation |
|---|---|
| **Cold-start bias** (few events) | `count < 3` → `"new"`, never a low score; new users are not punished for lack of history. |
| **Small-sample noise** | the band thresholds are coarse (3 bands), not a brittle number; one event can't swing a band the way it could swing a score. |
| **Gaming via wash agreements** | only **settled-on-rail** matured obligations count; circular net-zero rings raise an AML flag, not the signal ([[muqassa-deep|§9]]). |
| **Decay-parameter sensitivity** | `λ`, `W` are explicit, documented constants; changing them is a governance decision, version-stamped, not a silent tuning knob. |
| **Survivorship / selection** | the signal describes *kept history*, makes no claim about people with no history (they read `"new"`). |
| **Fairness** | no demographic, geographic, or inferred features — only the user's own kept/late events; nothing a protected attribute could leak through. |
| **Privacy** | dyad-only, private by default; revocable for *display* (optional processing) without erasing the underlying sealed records (legal-claim basis, [[contracts|S15]]). |

## A5. Worked vectors (the five personas + one per band)

Computed by `trustSignal()` at `AS_OF 2026-06`, `W=24`, `λ=12`:

| Person | history | `band` | `ratio_pct` | `window_count` |
|---|---|---|---|---|
| نورة | 12/12 kept | `kept` | 100 | 12 |
| سارة | 18/19 kept | `kept` | 100 | 18 |
| خالد | 7/8 kept, **open overdue now** | `overdue` | 90 | 8 |
| ليلى | 22/23 kept (older) | `kept` | 100 | 16¹ |
| فهد | 5/6 kept | `kept` | 86 | 6 |

¹ ليلى's window_count is 16, not 23 — older events fell **outside** the 24-month window. That is
the windowing working as specified (recency matters), not a bug.

Standalone band demonstrations (one clean example each):

| Band | history | `ratio_pct` |
|---|---|---|
| `new` | 2 recent kept (count < 3) | 100 |
| `kept` | 10/10 | 100 |
| `mixed` | 7/10 | 76 |
| `overdue` (chronic) | 4/10 | 47 |
| `overdue` (open) | 10/10 but currently past-due | 100 |

---

# Part B — Circle / graph analytics (the social-debt graph)

## B1. The graph

`G = (V, E)`: vertices = circle members, directed weighted edges = sealed bilateral debts
(`from → to : amount_halalas`). All analytics below are **pure functions of `G`**, deterministic,
and computed from sealed data only.

## B2. Cycle detection → feeds Muqassa

A **directed cycle** in `G` is debt that circulates and can be **washed entirely** — it
contributes `0` to every party's net. We enumerate simple cycles with a DFS that only reports a
cycle whose **minimum-index vertex is the start** (Johnson-style de-duplication), so each cycle is
found once. Reference: `findCycles()`.

- **Why it matters:** by flow decomposition, any debt configuration = (a sum of directed cycles)
  + (a set of source→sink paths). The **cycle component nets to zero** and is pure waste — it is
  precisely what Muqassa removes. Cycle detection both *explains* the netting ("these 2 loops
  cancel") and bounds the achievable reduction.
- **Demo:** the 9-IOU circle contains **2** directed cycles; netting collapses 9 → 2 transfers.

## B3. Settlement-efficiency metrics

Computed by `efficiency(edges, transfers)` — the bank-facing measures of how much friction
Muqassa removes:

```
transfer_reduction = 1 − |transfers| / |edges|
cash_reduction     = 1 − Σ transfer_amount / Σ edge_amount
liquidity_peak     = max single transfer amount         (the largest float a settlement needs)
```

Demo circle: `transfer_reduction = 1 − 2/9 = 0.778`; `cash_reduction = 1 − 90000/180000 = 0.500`;
`liquidity_peak = 60000 halalas` (600 SAR). Interpretation: the circle settles with **half the
cash movement** and **78% fewer transfers** — fewer sarie hops (each capped at SAR 20,000), less
in-flight float, fewer reminders.

## B4. Anonymised aggregate insights for the bank

The bank may compute **portfolio-level** statistics **without** identifying individuals or
exposing per-person amounts — k-anonymity by aggregation threshold:

```
report only over groups of ≥ k circles (default k = 20); suppress any cell backed by < k circles
```

Defensible aggregates (each a function over many circles' efficiency/graph stats):

| Aggregate | Use to the bank | Privacy posture |
|---|---|---|
| Distribution of `transfer_reduction` across circles | sizing the settlement-rail load Muqassa saves | aggregate only, ≥ k circles |
| Mean transfers **saved** per circle | quantifying the product's settlement value | aggregate only |
| `liquidity_peak` distribution | sizing safeguarded-funds float buffers | aggregate only |
| Circle-size distribution / density | where Muqassa amplification is strongest (dense circles) | counts only, no identities |
| Share of debt that is **cyclical** (washable) | how much interpersonal debt is pure circulation | aggregate ratio |

**Forbidden** (would breach the spine): per-person scoring, ranking individuals, cross-party
inference, any output that re-identifies a person, anything fed to underwriting or a bureau.

## B5. Test surface

| Function | Demo output (vector) |
|---|---|
| `balances(parties, edges)` | `نورة −90000, خالد +60000, فهد +30000, سارة/ليلى 0` |
| `findCycles(parties, edges)` | `2` cycles |
| `efficiency(edges, transfers)` | `{transfer_reduction:0.7778, cash_reduction:0.5, edges:9, transfers:2}` |
| `trustSignal(events, opts)` | per-persona bands (A5) |

Reproduce: `node ref/generate-vectors.mjs`. Every figure above is emitted by that script and
pinned in [[test-vectors]].

---

## C. How this scores the Data criterion (honestly)

- **Real computation, not a chart:** windowed time-decayed ratios, directed-cycle enumeration,
  flow-decomposition-grounded efficiency metrics, k-anonymous aggregation — all specified and
  reproducible.
- **Defensible by construction:** the trust signal *cannot* drift into a credit score; the graph
  analytics *cannot* re-identify a person.
- **Bounded claims:** the trust signal is descriptive (not predictive); greedy netting is
  `≤ P−1` (not minimal — [[muqassa-deep|§4]]); aggregates are suppressed below `k`. The honesty
  is the point — it is what makes the Data depth *win* a 70th-hour judge rather than charm one.
