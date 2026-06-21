---
title: "عهد · Ahd — Back-end Architecture (services, data model, state machine, seams, APIs)"
tags: [ahd, backend, architecture, state-machine, api, deep]
owner: Claude-Backend (PROMPT 2 — Deepen the Data & Back-end)
status: spec-v1
updated: 2026-06-19
---

# 🏗️ Ahd back-end architecture

> One product, one spine. The bank is **amīn / wakīl / kātib** — record-keeper + settlement
> agent, **never lender, guarantor, or adjudicator** ([[contracts|C1]]). This document specifies
> the services, the **append-only** data model (immutable header + event log, status DERIVED by
> fold), the **complete** state machine (every transition + guard + emitted event), the four
> integration seams with sequence flows, the **exact trust boundary**, and the APIs. It is the
> production form behind the prototype's seams. Crypto details: [[seal-scheme-spec]]; netting:
> [[muqassa-deep]]; data layer: [[trust-signal-and-graph-analytics]].

---

## 1. Service decomposition

```
                       ┌──────────────────────────────────────────────┐
   client (RTL web/app)│                API Gateway                    │  authN/Z, rate-limit, idempotency
                       └───────────────┬──────────────────────────────┘
        ┌────────────────┬─────────────┼───────────────┬───────────────┬───────────────┐
        ▼                ▼             ▼               ▼               ▼               ▼
  Identity/Nafath   Drafting svc   Sealing svc     Ledger svc     Settlement svc   Muqassa engine
  connector         (ALLaM +       (canon→hash→    (append-only    (sarie conn. +   (netting +
  (auth assertions, template store chain→TSA→      event store +   mandate store +  consent saga)
   pairwise sub)    + riba linter) Merkle)         immutable hdr)  idempotency)
        │                                │               │               │
        └─────► Checkpoint svc ◄─────────┘        Trust/Analytics svc   Dispute/Export svc   Notification svc
               (periodic signed                  (kept-ratio + graph)   (evidence bundle →    (rail-sends-only,
                Merkle roots)                                            Taradhi/Najiz)        ease-toned)
```

| Service | Responsibility | Refuses to |
|---|---|---|
| **API Gateway** | authN/Z, per-request idempotency keys, rate limiting, request canonicalization | hold business state |
| **Identity/Nafath connector** | obtain Nafath auth assertions `{sub,acr,auth_time,txn_id}`; map to **pairwise pseudonymous sub**; invoke the TSP for the AES/QES signature | store raw biometrics or National ID ([[contracts|S15]]) |
| **Drafting svc** | render plain-Arabic terms from **board-approved templates** (ALLaM-assisted); run the **deterministic riba linter** (R1–R4) | issue a fatwa / accept free-form terms with a markup field |
| **Sealing svc** | JCS canonicalize → SHA-256 → bind Nafath assertions → RFC-3161 TSA → chain leaf + bank HSM signature | seal without dual assertions |
| **Ledger svc** | the **append-only event store** + the **immutable header**; serve `status = fold(events)` | mutate or delete a sealed event |
| **Settlement svc** | sarie credit-push with idempotency key `ahd_id‖schedule_index`; standing-mandate store; auto-split > SAR 20,000; degrade to confirm-to-push | silently pull funds |
| **Muqassa engine** | per-currency greedy netting + consent saga ([[muqassa-deep]]) | net unsealed/cross-currency debts; execute unconsented legs |
| **Trust/Analytics svc** | windowed kept-ratio (dyad-only) + k-anonymous circle aggregates | produce a number/score, export to a bureau, underwrite |
| **Checkpoint svc** | publish + sign periodic RFC-6962 Merkle roots | rewrite history |
| **Dispute/Export svc** | assemble the verifiable evidence bundle for MoJ/Najiz/Taradhi | adjudicate or enforce |
| **Notification svc** | rail-sends-only, frequency-capped, ease-toned reminders | let the friendship be the collector |

---

## 2. Data model — immutable header + append-only event log

**Principle ([[contracts|S5]]):** the header is written once and never changes; everything that
*happens* is an **append-only event**; the visible `status` is a pure **fold over the events**.
This is what makes the record an auditable *iqrār* — there is no UPDATE statement that could
silently alter a sealed obligation.

### 2.1 Immutable header (`AhdHeader`)

```
AhdHeader {
  ahd_id          ULID            # time-sortable, opaque, idempotency anchor
  kind            enum            # QARD_HASAN | SHARED_COST | DEFERRED_PAYMENT | PROMISE_GIFT
  created_at      RFC3339
  parties         [ { role, nafath_sub(hashed), display_name } ]
  principal       { amount_halalas:int64, currency }     # integer halalas, no floats
  genesis_ref     sha256          # the tenant chain genesis
}                                  # IMMUTABLE after creation
```

### 2.2 Append-only event log (`AhdEvent[]`)

```
AhdEvent {
  ahd_id          ULID
  seq             int             # per-ahd monotonic
  type            EventType       # see §3.2
  at              RFC3339
  actor           nafath_sub | "system" | "bank"
  payload         object          # type-specific (e.g. RECORD_SEALED carries the SEAL)
  prev_event_hash sha256          # intra-ahd tamper-evidence
}                                  # APPEND-ONLY; never updated/deleted
```

The **SEAL artifacts** ([[seal-scheme-spec]]) attach to the `RECORD_SEALED` event payload:
`{ terms_hash, assertions[], tsa_token, envelope_hash, chain_seq, prev_chain_hash, leaf, bank_sig }`.
Other entities (`Schedule`, `Mandate`, `Settlement`, `MuqassaPlan`, `Circle`, `TrustEvent`,
`ChainCheckpoint`) are projections/aggregates built from events; none are independently mutable.

### 2.3 Derived status

```
status(ahd) = fold(events_of(ahd), reducer)   # pure function; any state is reproducible from the log
```

So "rewind to any state" is just folding a prefix of the log — exactly how the prototype seeds
any screen with one click, and how an auditor reconstructs history.

---

## 3. The lifecycle state machine (complete)

Unifies [[contracts|C4]] and [[contracts|S5]] into one canonical machine. `KEPT` ≡ `FULFILLED`
(«ذِمّة محفوظة»); `WITNESSED` is the transient post-seal state that auto-advances to `ACTIVE`.

### 3.1 States

`DRAFT · PENDING_CONSENT · WITNESSED · ACTIVE · SETTLING · KEPT · DEFAULTED · DISPUTED ·
ESCALATED · FORGIVEN · DECLINED · EXPIRED · VOID`

```
 DRAFT ──lender signs──► PENDING_CONSENT ──counterparty signs+seal──► WITNESSED ──auto──► ACTIVE
   │                          │                                                            │
   │ riba-block               │ invite lapses → EXPIRED                                    │ due tick
   │ (stay DRAFT)             │ counterparty refuses → DECLINED                            ▼
   ▼                          ▼                                                         SETTLING ⇄ ACTIVE
 (edit)                    re-draft after a signature → VOID                               │   │
                                                                                all settled│   │ fail/grace
                                                                                           ▼   ▼
                                                                                         KEPT  (retry / GRACE_GRANTED)
   ACTIVE/SETTLING ──matured & unpaid past grace──► DEFAULTED   (NO penalty; tone+export only)
   ACTIVE/SETTLING ──party flags coercion/repudiation──► DISPUTED ──evidence handed over──► ESCALATED
   ACTIVE/SETTLING ──creditor waives (إبراء)──► FORGIVEN
```

### 3.2 Transition table (transition · guard · emitted event)

| From | To | Trigger | Guard | Event |
|---|---|---|---|---|
| — | DRAFT | create ahd | valid kind + parties | `AHD_DRAFTED` |
| DRAFT | DRAFT | edit terms | riba linter **passes** to enable signing | `TERMS_FROZEN` / `RIBA_FLAGGED` |
| DRAFT | PENDING_CONSENT | lender signs first | lender Nafath `acr ≥ substantial`; terms riba-clean | `LENDER_SIGNED`, `COUNTERPARTY_INVITED` |
| PENDING_CONSENT | WITNESSED | counterparty signs | **both** assertions bound to same `h`; mandate optional | `COUNTERPARTY_SIGNED`, `RECORD_SEALED` |
| PENDING_CONSENT | EXPIRED | invite window lapses | now > invite_expiry, unsigned | `EXPIRED` |
| PENDING_CONSENT | DECLINED | counterparty refuses | explicit decline | `DECLINED` |
| DRAFT/PENDING_CONSENT | VOID | re-draft after a signature | a prior signature exists | `VOIDED` (prior consent void, [[contracts|C5]]) |
| WITNESSED | ACTIVE | auto | seal verified | `ACTIVATED` |
| ACTIVE | SETTLING | due tick | matured installment; mandate valid **or** confirm-to-push | `SETTLEMENT_INITIATED` |
| SETTLING | ACTIVE | settled (more remain) | sarie ack; idempotency-key fresh | `SETTLEMENT_SETTLED` |
| SETTLING | ACTIVE | settle fails | sarie fail (limit/funds); same key on retry | `SETTLEMENT_FAILED` |
| ACTIVE/SETTLING | ACTIVE | reschedule (يُسر) | both consent; 2:280 grace, **no** penalty | `INSTALLMENT_RESCHEDULED`, `GRACE_GRANTED` |
| SETTLING/ACTIVE | KEPT | last installment settles | `Σ settled == principal` | `ALL_SETTLED` (→ «ذِمّة محفوظة») |
| ACTIVE/SETTLING | DEFAULTED | matured & unpaid past grace | grace exhausted | `DEFAULT_MARKED` (no penalty; export unlocked) |
| ACTIVE/SETTLING | DISPUTED | a party flags | coercion / repudiation / "signed under pressure" | `DISPUTE_RAISED` |
| DISPUTED | ESCALATED | hand over evidence | export requested | `ESCALATION_EXPORTED` (Ahd stops) |
| ACTIVE/SETTLING/DEFAULTED | FORGIVEN | creditor waives | إبراء by creditor | `FORGIVEN` |

Terminal states: `KEPT, FORGIVEN, ESCALATED, EXPIRED, DECLINED, VOID` (and `DEFAULTED` is
quasi-terminal — reversible to `SETTLING` if the borrower later pays).

### 3.3 Muqassa sub-machine (per [[muqassa-deep|§7–8]])

`MUQASSA_PLANNED → (per leg) MUQASSA_LEG_CONSENTED → MUQASSA_EXECUTED` with `MUQASSA_REVOKED` /
compensation on revoke/default. Each executed leg is a **novation**: it appends settlement events
to the affected ahd records (their schedules show the netted discharge).

---

## 4. Integration seams + sequence flows

Four external seams, each provider-agnostic and labelled `محاكاة` in the prototype:
**Nafath** (auth assertion), **TSP** (AES/QES signature, emdha-class), **sarie** (SAMA IPS
settlement), **RFC-3161 TSA** (trusted time).

### 4.1 Creation → dual e-sign → seal

```
Lender App     Drafting     Identity/Nafath   TSP        Sealing      Ledger     Borrower App
   │ draft ──────►│                                                                  │
   │              │ template + riba-lint                                             │
   │ show C+h ◄───┼──────────────── canonical terms, h ─────────────────────────────│
   │ sign ───────────────►│ auth(h) (biometric)                                      │
   │              │        │ assertion{sub,acr,auth_time,txn} ──► TSP sig over h      │
   │              │                                    invite ──────────────────────►│
   │              │        │◄───────────── auth(h) ─── show C+h ──────────────────────│
   │              │        │ assertion ──► TSP sig over h                             │
   │              │                                   │ h ──► TSA: RFC-3161 token     │
   │              │                                   │◄── token                      │
   │              │                                   │ leaf=H(seq,prev,e); bank HSM sig
   │              │                                   │ RECORD_SEALED ──► append ─────►│
   │  SEALED ◄────┴───────────────────────────────────────────────────────────► SEALED
```

### 4.2 Scheduled auto-settlement (sarie)

```
Scheduler     Settlement      Mandate store     sarie (IPS)        Ledger
  │ due tick ────►│                                                  │
  │               │ standing mandate valid? ──►│ yes/no              │
  │               │ if amount > SAR 20,000 → auto-split              │
  │               │ credit-push (idem-key ahd_id‖idx) ──► IPS        │
  │               │◄──────────── settled / failed ──────────────────│
  │               │ SETTLEMENT_SETTLED / _FAILED ──► append ────────►│
  │               │ if Σ settled == principal → ALL_SETTLED (KEPT)   │
```
No mandate ⇒ degrade to a one-tap confirm-to-push (never a silent pull).

### 4.3 Muqassa (consent saga) — [[muqassa-deep|§7.3]]

```
plan (per currency) → collect ALL leg consents → atomic batch execute over sarie (idem-keys)
                    → on any default/revoke: abort-to-bilateral (pre-exec) or compensate (post-exec)
```

### 4.4 Dispute export

```
DISPUTED → Dispute/Export assembles { header, full event log, SEAL (terms_hash, assertions,
           tsa_token, leaf, bank_sig), Merkle inclusion proof + signed checkpoint root,
           the attestation boundary string } → hand to Taradhi/Najiz → ESCALATED → Ahd stops.
```

---

## 5. The trust boundary — exactly what the bank vouches for vs refuses

```
        ┌────────────────────────── BANK VOUCHES FOR (in the bytes) ──────────────────────────┐
        │ • two Nafath-authenticated identities (acr ≥ substantial) sealed THIS exact          │
        │   byte-string … (terms_hash, assertions)                                             │
        │ • … at THIS RFC-3161 time (tsa_token)                                                 │
        │ • the record is UNALTERED since (chain leaf + bank sig + Merkle checkpoint)           │
        │ • settlement transfers it executed as agent, on rail, idempotently (settlement log)  │
        └──────────────────────────────────────────────────────────────────────────────────────┘
        ┌──────────────────────── BANK REFUSES TO VOUCH FOR (named in record) ─────────────────┐
        │ ✗ that cash actually changed hands   ✗ that the terms are fair / Shariah-final        │
        │ ✗ the absence of coercion            ✗ the truth of any underlying fact               │
        │                       → all of these escalate to MoJ / Najiz / Taradhi                │
        └──────────────────────────────────────────────────────────────────────────────────────┘
```

The boundary is **encoded in the sealed `attestation` field** ([[seal-scheme-spec|§5]]), not just
asserted in a pitch — so "you witnessed it, so you're liable" is refuted by the record itself.

---

## 6. APIs (the seams, defined)

REST/JSON; all money integer halalas; all writes idempotent on `Idempotency-Key`.

| Method · Path | Purpose | Key request → response |
|---|---|---|
| `POST /v1/ahd` | create a draft | `{kind, parties, principal, schedule?, terms_intent}` → `{ahd_id, status:"DRAFT", terms_ar, terms_hash, riba_check}` |
| `POST /v1/ahd/{id}/terms:lint` | run riba linter on a clause | `{clause_ar}` → `{verdict:"clean"|"block", hits:[{rule,why,fix}]}` |
| `POST /v1/ahd/{id}/sign` | capture a Nafath assertion + TSP sig (lender first) | `{role, nafath_auth_ref}` → `{status, assertion:{sub,acr,auth_time,txn_id}}` |
| `POST /v1/ahd/{id}/seal` | finalize once both signed | (server-side) → `{status:"WITNESSED", seal:{terms_hash,tsa_token,leaf,bank_sig,chain_seq}}` |
| `GET /v1/ahd/{id}` | fetch derived state | → `{header, status, schedule, seal}` |
| `GET /v1/ahd/{id}/verify` | run the verification procedure | → `{intact:bool, failedAt, steps[]}` ([[seal-scheme-spec|§6]]) |
| `GET /v1/ahd/{id}/events` | the append-only log | → `[AhdEvent…]` |
| `POST /v1/ahd/{id}/settle` | trigger/confirm a settlement | `{schedule_index}` (idem-key) → `{status, settlement_ref}` |
| `POST /v1/ahd/{id}/reschedule` | يُسر grace (no penalty) | `{schedule_index, new_due}` (both consent) → `{status:"ACTIVE"}` |
| `POST /v1/ahd/{id}/forgive` | إبراء (creditor waives) | → `{status:"FORGIVEN"}` |
| `POST /v1/circles/{cid}/muqassa:plan` | compute netting plan | `{currency}` → `{plan_id, transfers[], conservation, efficiency}` |
| `POST /v1/muqassa/{plan_id}/consent` | consent to your leg(s) | `{accept:bool}` → `{plan_status}` |
| `POST /v1/muqassa/{plan_id}/execute` | fire the consented batch | (idem) → `{executed[], compensations[]}` |
| `GET /v1/trust/{sub}/signal` | dyad-only trust mirror | → `{band, window_count}` (**no number exported**, [[trust-signal-and-graph-analytics|A2]]) |
| `GET /v1/ahd/{id}/export` | evidence bundle for dispute | → `{header, events, seal, merkle_proof, attestation}` |

---

## 7. Non-functional posture

- **Determinism:** every computed artifact (hashes, schedule, netting, trust) is a pure function
  of inputs — no `Date.now()`/random in the sealed path (timestamps are *inputs* from Nafath/TSA).
- **Idempotency:** all settlement + seal writes keyed (`ahd_id‖…`); retries never double-act.
- **Data residency / PDPL:** in-Kingdom; pairwise `sub` + ID hash, never raw biometrics; sealed
  records retained for the legal-claim limitation period then key-shredded (chain keeps the leaf
  hash without personal data) ([[contracts|S15]]).
- **Safeguarded funds:** in-flight money handled as **safeguarded funds** on the bank's own
  licensed rails, via the time-boxed SAMA Sandbox ([[contracts|S7]]).
- **Auditability:** the signed Merkle checkpoint makes silent history rewrite detectable, **even
  by the bank** ([[seal-scheme-spec|§4]]).
