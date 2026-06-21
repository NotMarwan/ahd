# Handoff 20 — Operation Ahd · PROMPT 2 (Deepen the Data & Back-end)

**Date:** 2026-06-19 (~14:05 +03:00)
**Agent:** Claude-Backend (senior back-end + data engineer lane)
**Project:** `C:\Users\PCD\Desktop\هاكاثون امد\`
**My namespace (exclusive):** `10_Deep/Backend/**` + a DONE line in `10_Deep/STATUS.md`
**Continues:** the `10_Deep/` round (handoff-19 = Claude-Hardening / PROMPT 4).

---

## 1. TL;DR

Took Ahd's data + back-end from "sound concept, proof partly missing" to **implementation depth,
backed by a runnable reference engine and reproducible test vectors**. Five specs + a Node
reference engine + a ready-to-apply prototype patch. Everything computed is reproducible with one
command (`node 10_Deep/Backend/ref/generate-vectors.mjs`) and was independently cross-checked in
real Chrome (Node ≡ Chrome, byte-identical).

**I did NOT edit `project/ahd-demo/index.html`** — Claude-Hardening had just frozen its logic
behind a 92-assertion golden-vector harness, so my (depth-additive) compute upgrades are handed off
as a patch rather than force-applied on demo day. No clobber anywhere.

---

## 2. Deliverables (`10_Deep/Backend/`)

| File | What |
|---|---|
| `muqassa-deep.md` | Formal netting model; **proofs** (conservation, ≤P−1 bound, single-sided); **honest optimality** (min-transfers NP-hard) with a **machine-found worst-case** (greedy 4 vs optimal 3, both plans verified) + exact solver; real-world cases: partial payments, **multi-currency** (net per-currency, never cross-net), **mid-cycle default** (2-phase-commit / saga + compensation), **consent-revocation rollback**. |
| `seal-scheme-spec.md` | The SEAL to implementation depth: **RFC-8785 JCS** rules (+ conformance vectors), the **exact preimage of every seal** (terms→h, Nafath binding, TSA, envelope, leaf, bank-sig, with domain-separation `_t` tags), **RFC-6962 Merkle checkpoint** + a worked **inclusion proof**, and a **machine-checkable verification procedure** that localises the first broken property. Vectors: intact / single-field tamper / reorder / key-reorder(control) / replay. |
| `trust-signal-and-graph-analytics.md` | The **non-credit trust signal**: windowed, time-decayed kept-ratio over the user's own history; a 4-point **structural proof it cannot become a credit score**; failure modes. Plus **graph analytics**: cycle detection (feeds Muqassa), settlement-efficiency metrics, **k-anonymous** bank aggregates. |
| `backend-architecture.md` | Services; **append-only** data model (immutable header + event log, `status = fold(events)`); the **complete state machine** (every transition · guard · emitted event); the four seams (Nafath/TSP/sarie/RFC-3161) with sequence flows; the **exact trust boundary** (vouches-for vs refuses); the **APIs**. |
| `test-vectors.md` | Every computed claim, reproducible; the reproduce command; cross-engine note. |
| `prototype-compute-patch.md` | Ready-to-apply, logic-only drop-in for `index.html`: **Patch A** computed trust signal (replaces static `REP`), **Patch B** JCS-depth SEAL. Expected vectors + integration notes for Hardening's integer-money code. |
| `ref/ahd-ref.mjs`, `ref/generate-vectors.mjs`, `ref/vectors.json`, `ref/index.html.orig` | The runnable reference engine + generated vectors + a pre-edit snapshot of the prototype. |

---

## 3. Verification evidence

- **Reference engine (Node):** `node ref/generate-vectors.mjs` → SHA-256 NIST self-test **PASS**;
  every vector regenerates; Merkle inclusion proves + rejects forgery; verification
  intact/tamper/reorder/replay behave correctly; Muqassa conservation holds; worst-case
  greedy>optimal found and both plans `verifyPlan`-checked; trust bands compute.
- **Real Chrome (read-only, integrated demo):** **0 console errors**; demo computes seal
  `6c9410b9…`, balances نورة−900/خالد+600/فهد+300, netting 9→2, tamper caught.
- **Cross-engine proof:** the JCS-SEAL injected into the live page via *its own* from-scratch
  SHA-256 reproduced the documented vectors **byte-identical** (`terms_hash ceedb1e9…`,
  `leaf f7999f87…`, `bank_sig 8f1d28a5…`, `MATCHES_VECTORS:true`). Node ≡ Chrome.

---

## 4. Coordination (multi-agent, no clobber)

- Registered `Claude-Backend`; partitioned `index.html` by function-region with Claude-Hardening
  in `coordination_notes.md`. Hardening **exited 13:52** having delivered integer-halalas money +
  exact-integer Muqassa (two of my three planned compute edits) and a frozen test harness.
- Decision: **hand off** the remaining JCS-SEAL + computed-trust-signal as a patch rather than edit
  the freshly-frozen build (would change demo-verified hashes + break golden vectors). Documented.

---

## 5. Open items / next actions

1. **Apply `prototype-compute-patch.md`** post-demo if desired (Patch A = Data-criterion ring is a
   real computed windowed ratio; Patch B = SEAL at RFC-8785 JCS depth). One mechanical apply +
   re-pin Hardening's golden vectors to the new seal value (`f7999f87…`).
2. **Claude Design (S9):** swap the reputation ring's numeric `%` for the qualitative band word
   (`TRUST[name].band`) — a trust *signal* must not be a number.
3. **Riba-linter false-positive** (blocks "بلا فائدة") already flagged by Hardening to product;
   patch sketch in `10_Deep/Hardening/robustness-report.md`.
4. Doc consistency (from Claude-C's review, not my lane): layer files still say Musaned "fixes
   k<1" / Muqassa "minimum" / ETL Art. 8 — owners to align with the corrected dossier.

---

## 6. Bottom line

The Data + Back-end is now **deep, correct, and defensible**: real algorithms with proofs, real
cryptographic preimages with a working verifier, a non-credit signal that is *structurally* not a
credit score, and a full architecture — all reproducible from one script and cross-checked in
Chrome. The prototype's on-screen compute is already correct/deterministic (Hardening); the
JCS-depth + computed-trust upgrades are a clean, verified, one-step patch away.

*— End of handoff 20 (Claude-Backend).*
