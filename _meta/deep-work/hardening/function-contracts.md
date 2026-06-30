# Function Contracts + Code Structure — Ahd prototype

**Owner:** Claude-Hardening · **Date:** 2026-06-19

The logic is now cleanly split into a **pure, DOM-free region** (deterministic computation) and a **render/UI region** (DOM + a single state machine). The two are separated by inert comment markers so the test harness can slice and run the *exact shipped* pure code in Node:

```
// ===AHD-LOGIC:BEGIN===   ← pure, no DOM, Node-testable
   … sha256, money, agreement, seal/verify, Muqassa, riba engine …
// ===AHD-LOGIC:END===     ← everything below touches the DOM
   … state machine S, go(), R[0..4], render helpers, boot …
```

## Pure functions (no DOM, no I/O, deterministic)

| Function | Contract |
|---|---|
| `sha256(str) → hex64` | UTF-8 encode → 32-byte SHA-256, lowercase hex. Pure. NIST-verified. |
| `sha256bytes(Uint8Array) → hex64` | Same, over raw bytes. |
| `short(hex, n) → HEX` | First `n` (default 16) hex chars, uppercased. Display helper, pure. |
| `fmt(n) → string` | Round to integer, comma-group thousands. **No Intl** → identical on every engine. |
| `toMinor(sar) → int` | SAR → integer halalas (`×100`). |
| `minorToFixed2(minor) → "x.xx"` | Integer halalas → 2-dp SAR string. No float. |
| `canonical(amt?) → string` | Deterministic serialization of the agreement. `amt==null` ⇒ true principal; a value ⇒ recompute under a tampered principal. Bytes are frozen (golden-pinned). |
| `sealBlock(prev, contentHash, seq) → hex64` | The chain seal primitive: `H(prev + contentHash + seq)`. Pure. |
| `recomputeSeal(amt?) → {canonical_hash, seal}` | Recompute content hash + seal from (possibly tampered) data. |
| `verifyRecord(amt?) → {ok, sealed, recomputed, canonical_hash}` | Named verifier: recompute & compare to the sealed value. `ok` is the integrity verdict. |
| `balancesOf(edges) → {name: netSAR}` | Net position per party (`>0` creditor, `<0` debtor). Integer SAR. |
| `netting(edges) → [{from,to,amount}]` | Greedy min-transfer settlement on an **integer-halala core**, deterministic tiebreak by `NODES` index. Output amounts are whole SAR. Guarantees: conservation (every net preserved) and `≤ P−1` transfers. |
| `ribaScan(text) → {verdict:"clean"\|"block", hits}` | Stateless rule engine (no `/g`). `block` if any riba/penalty/percentage rule matches. |

## Render / UI region (DOM)

- **`S`** — the single mutable-state object: `{ step, conf{L,B}, scanW{L,B}, timers{L,B,type}, tampered, recordIssued }`. No stray demo state on `window`.
- **`clearTimers()` / `resetState()`** — cancel all timers / return to a guaranteed-clean slate.
- **`go(n)`** — the only state transition: clamp `n`, cancel timers, (on 0) full reset, render `R[n]` inside `try/catch` → `renderFallback`.
- **`R[0..4]`** — pure-ish render thunks per screen; each reads from the pure layer and resets its own transient state.
- **`renderDoc` / `runVerify` / `confirmPerson` / `settleNext` / `runMuqassa` / `buildLinter`** — thin DOM wrappers that call the pure functions; all DOM access is null-guarded.
- **`renderFallback(err)`** — clean recoverable screen (existing styles only).
- **Public API** — only `window.go` and `window.confirmPerson` are exposed (required by inline `onclick=`); everything else stays module-scoped (no global leakage).

## Compute vs render-trigger separation

Computation (hashing, sealing, verifying, netting, linting, formatting) lives entirely above the marker and is side-effect-free. The render layer never computes a hash or a balance inline — it calls the named pure function and injects the result. This is what lets the Node harness prove every claim against the *same bytes* the browser ships.
