# Ahd (عهد) — Architecture

> Ahd is an interest‑free (قرض حسن / *qard hasan*) prototype where a bank **witnesses and seals**
> interpersonal loans but **never lends, never judges, charges no interest, and keeps no credit score**.
> This document describes how the codebase is actually built: the frozen demo, the parallel app that
> reuses its logic, the determinism/offline guarantees, and the test layers that gate every change.

All paths below are real and relative to the repository root
(`C:\Users\PCD\Desktop\Amad Hackathon`). Nothing here is aspirational — it documents what exists.

---

## 1 · Two builds, one engine

There are **two** runnable surfaces. They share the **same pure computational core**, by construction.

| | **Demo** | **Parallel app** |
|---|---|---|
| Entry | `demo/index.html` | `app/index.html` |
| Status | **Frozen / read‑only** (tripwire SHA‑256 `e2f48467…d1b8be40`) | **Additive**, all new files |
| Shape | One self‑contained HTML file (logic + DOM + styling inline) | Multi‑file: `engine.js` + feature modules + screens + `app.css` |
| Logic source | The `AHD-LOGIC` region inside the HTML | `engine.js` — a **byte‑faithful copy** of that region |
| Screens shown | Witnessed record + tamper verify · Muqassa netting (9 IOUs → 2 transfers) · Circle G1–G4 | دفتري · القرض المفتوح · Advanced Circle |

Why two builds? The demo's correctness is pinned by a tripwire hash and a golden‑vector test suite.
There is **no way to add screens to `index.html` without changing its bytes**, which would trip the
tripwire and risk the golden path. So new product surface is grown in `app/`, which reuses
a **parity‑tested copy** of the demo's engine. The demo stays the safe presenter build; the app is
where the missing consumer features live.

---

## 2 · Engine extraction + the parity drift‑guard

The demo keeps **all pure, DOM‑free logic** inside one clearly fenced region of its HTML:

```
demo/index.html
  line 167:  /* ===AHD-LOGIC:BEGIN===  (pure, DOM-free, Node-testable …) */
   …          sha256 · canonical · sealBlock · verifyRecord · fold · netting ·
   …          ribaScan · trustSignal · makeCircle · foldCircle · …
  line 692:  /* ===AHD-LOGIC:END===   (everything below this line touches the DOM) */
```

Two consumers slice that exact region — **neither keeps its own copy of the logic**:

1. **`tests/load-logic.cjs`** — slices the bytes strictly between the two
   markers and evaluates them in an isolated `vm` context (`loadLogic()`), so the demo's tests run the
   *exact shipped bytes*. A copy could drift; a slice cannot.

2. **`app/build-engine.cjs`** — **reads** the demo HTML (via the same `extractPure` /
   `readHtml` from `tests/load-logic.cjs`), wraps the verbatim slice in a header + a dual‑export footer, and
   writes `app/engine.js`. It **never writes the demo**. Run with `node app/build-engine.cjs`.

`engine.js` is therefore **generated**, not hand‑authored — its banner says
`AUTO-GENERATED — DO NOT EDIT BY HAND`. Its footer exposes the same public surface (≈50 symbols) under
three module systems so the one file loads everywhere:

```js
;(function(){
  var __api = { sha256, canonical, sealBlock, recomputeSeal, verifyRecord, fold, netting,
                ribaScan, trustSignal, makeCircle, foldCircle, … };
  if (typeof module  === "object" && module.exports) module.exports = __api; // Node require()
  if (typeof window  !== "undefined") window.AHD     = __api;                // browser <script>
  if (typeof globalThis !== "undefined") globalThis.AHD = __api;
})();
```

### The drift‑guard

`tests/app/engine-parity.cjs` proves the copy can never silently diverge.
It runs three classes of check:

- **(a) Surface** — `engine.js` exposes every symbol in the expected API list.
- **(b) Golden behavioral parity** — the engine reproduces the demo's frozen outputs: same
  `SEALED.seal`, same `canonical_hash`, `verifyRecord(null).ok === true`, `verifyRecord(9999).ok === false`,
  identical `netting(IOUS)` (9 IOUs → exactly 2 transfers), identical `circleSeal(DEMO_CIRCLE)` and
  `circleSeal(STANDING_CIRCLE)`, `fmt(5000) === "5,000"`, a matching `respread(100001,3)` split, and
  `ribaScan("بلا فائدة").verdict === "clean"`.
- **(c) Byte‑faithful** — it asserts the on‑disk `engine.js` **literally contains the exact demo slice**
  (`engineSrc.includes(extractPure(readHtml()))`).

> **Consequence:** if anyone ever edits the demo's logic, `engine-parity.cjs` fails until `engine.js` is
> regenerated. "The app uses the same engine as the demo" is therefore a **test**, not a promise.

---

## 3 · The feature‑module → screen‑registry → shell pattern

The parallel app mirrors the demo's *proven* pattern (screens render `innerHTML` strings; actions are
global methods invoked from inline `onclick`), but splits **pure logic** from **rendering** so the logic
is dependency‑injected and Node‑testable.

### Three layers per feature

```
features/<name>.js   PURE logic. No DOM. Engine passed in by DI (the `engine`/`ENGINE` arg).
                     Deterministic: fixed AS_OF, integer halalas, civil-days math (no Date).
                     Dual module: Node require(...) AND browser window.<Name>.
        │  (consumed by)
        ▼
screens/<name>.js    PURE render. Builds an innerHTML string from the feature's outputs.
                     Calls AhdApp.* methods from onclick. Registers itself via
                     App.registerScreen({ key, label, icon, render }).
        │  (registered into)
        ▼
app.js  (AhdApp)     The shell: a tiny screen registry + router + the action methods that
                     mutate deterministic state and re-render. Holds the seed data.
```

- **Feature modules** (`app/features/daftari.js`, `app/features/open-loan.js`, `app/features/circle-adv.js`) contain
  *only* business logic and receive the engine by injection — e.g. `rowFor(record, viewer, engine, asOf)`,
  `foldOpenLoan(loan)`, `byCategorySplit(items, members, engine)`. They never reference `document` or
  `window.AHD` directly when running under Node; the UMD‑style wrapper hands them `require("./engine.js")`
  in Node and `root.AHD` in the browser. This is what makes them unit‑testable in plain Node.

- **Screen modules** (`app/screens/*.js`) are render‑only. Each ends with
  `App.registerScreen({ key:"daftari", label:"دفتري", icon:"📔", render })`. They read `AhdApp` state and
  the feature outputs, and emit strings. No business rule lives here.

- **The shell** (`app/app.js`, the `AhdApp` object) is ~150 lines and does four things:
  - **Registry**: `registerScreen(def)` records `{key → def}` and append‑orders keys for the nav.
  - **Router**: `go(key)` renders `navHTML() + <main>render(this)</main>` into `#app`; `boot()` opens the
    first registered screen on `DOMContentLoaded`; `rerender()` re‑runs the current screen.
  - **Actions**: methods such as `daftariCompose`, `daftariSend`, `openLoanPay`, `openLoanForgiveFull`,
    `circleGraduate` — each mutates deterministic state then calls `rerender()`. Bad input is a clean
    no‑op (e.g. `openLoanPay` rejects non‑finite/≤0 amounts).
  - **Seed**: `seedRecords()` builds Naif's real ledger (café 2,500 overdue · سلطان 1,200 overdue ·
    عبدالله 600 on‑track · ريم kept · ماجد disputed · owes فهد 3,000) as sealed event logs; plus the
    seeded open loan (`منيرة → ماجد`, 20,000, *لتجهيز عربة القهوة*) and the advanced‑circle share.

### Load order (it matters)

`app/index.html` loads scripts in dependency order — engine first, then feature logic, then the shell, then
screens:

```html
<script src="engine.js"></script>          <!-- window.AHD -->
<script src="features/daftari.js"></script> <!-- window.Daftari -->
<script src="features/open-loan.js"></script>
<script src="features/circle-adv.js"></script>
<script src="app.js"></script>              <!-- window.AhdApp, registers nothing yet -->
<script src="screens/daftari.js"></script>  <!-- registers the screens into AhdApp -->
<script src="screens/open-loan.js"></script>
<script src="screens/circle-adv.js"></script>
```

A screen registers itself only if `window.AhdApp` exists; the shell boots only after the DOM is ready.

---

## 4 · Determinism & offline guarantees

Both builds are **fully offline and deterministic** — the same inputs produce byte‑identical outputs on
every machine, every run, with **no network**. The invariants (self‑checked every batch in
`OVERNIGHT-LOG.md`):

- **No nondeterministic primitives** anywhere in live logic: no `Date.now`, `new Date`, `Math.random`,
  `Intl.*`, or `toLocaleString`. Day math uses a **pure civil‑days algorithm** (Howard Hinnant's
  `daysFromCivil`) against a **fixed `AS_OF`** (`"2026-06-21"`); thousands‑grouping is a hand‑rolled
  `fmt()` (not `toLocaleString`, whose output depends on the runtime's ICU build).
- **Integer money** — values are minor units (**halalas**, `1 SAR = 100`). Every value‑bearing
  computation that gets hashed (principal/installment) and every Muqassa netting runs on integers; SAR is
  a *display projection only*. No binary‑float money, so no epsilon and no rounding that could invent a
  phantom halala (i.e. no rounding‑riba). `respread()` splits a total across N so the **sum is preserved
  exactly**.
- **Stateless rule engine** — `RIBA_RULES` use **no `/g` flag**, so there is no `RegExp.lastIndex`
  carry‑over between calls (the classic "works once, wrong the second time" bug). `ribaScan` sweeps by
  slicing and applies a negation guard so "بلا فائدة" reads **clean** while "فائدة" is **blocked**.
- **Pure logic separated from DOM** — the whole `AHD-LOGIC` region (demo) and every `app/features/*.js`
  is DOM‑free, which is exactly why it can be sliced/required and tested headlessly.
- **No network seams** — the demo path is statically proven to contain zero `fetch`/`XHR`/`WebSocket`;
  the app source is scanned the same way (see §5).

These are not stylistic preferences — they are what let an auditor reconstruct any record's seal and any
agreement's status from first principles.

---

## 5 · Test‑harness layers — and how they gate

Tests live in `tests/`. There are **two tiers**, both zero‑dependency
(Node ≥ 18), both CI‑friendly (exit `0` green / `1` on any failure).

### Tier 1 — Core (guards the frozen demo)

Run from the tests directory:

```bash
node tests/run-tests.cjs      # logic assertions: SHA-256 NIST vectors, seal, tamper, Muqassa, riba …
node tests/offline-check.cjs  # offline invariants: zero network seams in the demo path
node tests/dom-smoke.cjs      # headless render of the whole demo <script> under a fake DOM
```

These slice the **real** logic out of `demo/index.html` on every run (via `tests/load-logic.cjs`) and check it
against `golden-vectors.json`. If a hash input, the netting, or a riba rule changes and the output moves,
they fail. Current core total: **184 assertions, 0 failures** (135 + 9 + 40).

> **Note on the harness README:** `tests/README.md` documents an earlier core total
> (62 + 9 + 21 = 92) from before the Circle work landed; the authoritative current core count is **184**
> (see `OVERNIGHT-LOG.md`). The README also predates the `tests/app/` suites below.

### Tier 2 — App (additive; grows with the parallel app)

Run from `tests/app/`:

```bash
node tests/app/run-app-tests.cjs   # auto-discovers and runs every app suite, aggregates, exits 0 iff all green
```

`run-app-tests.cjs` discovers files matching `(.test|-parity|-smoke).cjs`, runs each in its own Node
process, and aggregates. The **8 suites** (≈283 assertions, all green):

| Suite | Proves |
|---|---|
| `engine-parity.cjs` | `engine.js` is a faithful copy of the demo slice — surface + golden parity + byte‑identical slice (§2). |
| `daftari.test.cjs` | دفتري ledger logic: roles, remaining, overdue vs fixed `AS_OF`, deterministic sort, reminder cadence gate. |
| `open-loan.test.cjs` | Open‑term qard hasan: never overdue, partial pay clamps to remaining, full/partial إبراء, **conservation** (`paid + forgiven + remaining == principal`) in every state, own canonical sealed with the golden primitives. |
| `circle-adv.test.cjs` | بالأصناف split (sum‑preserving), recurring auto‑post, graduation قَيْد→عهد (reuses القرض المفتوح + golden seal), mode‑B pledge sketch flagged for review. |
| `determinism.test.cjs` | Reload determinism: two independent `require`s of `engine.js` (cache busted) yield byte‑identical golden snapshots; pins the absolute seal + netting cardinality. |
| `app-offline.test.cjs` | Static scan of every `.js` under `app/` (comments stripped first) for the forbidden primitives — `fetch(`, `XMLHttpRequest`, `WebSocket`, `Date.now`, `new Date`, `Math.random`, `Intl.`, `.toLocaleString`. |
| `properties.test.cjs` | Property‑style invariants over many seeded‑LCG inputs: `respread` sum‑preservation, circle conservation + OPEN→KEPT, open‑loan conservation / `remaining ≥ 0` / never DEFAULTED. |
| `app-dom-smoke.cjs` | Headless render of the whole app (engine + features + shell + screens) under a fake DOM; drives screen actions; asserts nothing throws and the right warm copy renders. |

**How they gate:** the two tiers are independent. Tier 1 keeps the frozen demo correct and unchanged;
Tier 2 keeps the parallel app correct *and* keeps it provably in lock‑step with the demo (via
`engine-parity.cjs`) and provably offline/deterministic (via `app-offline.test.cjs` +
`determinism.test.cjs`). Combined (recomputed live 2026-07-14; single source of truth is the `run-all.cjs` banner, re-run rather than trust this number): **core 184 + app 2,781 (69 suites) + structure 14 = 2,979 assertions, all green** — one command: `cd tests && node run-all.cjs`.

---

## 6 · The data flow (text diagram)

### Layered view

```
                         ┌──────────────────────────────────────────────┐
   demo/                 │  index.html  (FROZEN — tripwire e2f48467…)    │
                         │  ┌──────────────────────────────────────────┐ │
                         │  │  AHD-LOGIC region (pure, DOM-free)        │ │ ◀── single source of truth
                         │  │  sha256 · canonical · sealBlock · fold ·  │ │
                         │  │  netting · ribaScan · trustSignal · circle│ │
                         │  └──────────────────────────────────────────┘ │
                         │  + demo DOM/screens (record · Muqassa · Circle)│
                         └───────────────┬───────────────┬──────────────┘
                       extractPure()     │               │   extractPure()
              (read-only slice)          │               │   (read-only slice)
                                         ▼               ▼
    tests/                      load-logic.cjs      build-engine.cjs   app/
                  loadLogic() in vm  ◀──┘               └──▶  writes engine.js (byte-faithful copy)
                         │                                          │
                         ▼                                          ▼
               ┌──────────────────┐                  ┌──────────────────────────────────┐
    TESTS      │ Tier-1 core      │   engine-parity  │  engine.js  (window.AHD)          │
               │ run-tests/offline│ ◀──────────────▶ │  ▲ DI                              │
               │ /dom-smoke (184) │   proves copy    │  │                                 │
               └──────────────────┘   == demo        │  features/*.js  (pure logic)      │
               ┌──────────────────┐                  │  ▲ outputs                         │
               │ Tier-2 app (283) │ ───────────────▶ │  │                                 │
               │ parity·daftari·  │   exercise app   │  screens/*.js → AhdApp (app.js)    │
               │ open-loan·circle·│                  │  → #app innerHTML  (RTL Arabic)    │
               │ determinism·…    │                  └──────────────────────────────────┘
               └──────────────────┘
```

### Seal flow — record → seal → verify

```
   record (AG fields: lender, borrower, principal_minor, schedule, terms_hash, consent, ts)
        │
        ▼   canonical(amt)          → deterministic line-joined bytes ("AHD-RECORD-v1\n…")
        ▼   sha256(canonical)       → canonical_hash
        ▼   sealBlock(prev, ch, seq)= sha256(prev_hash + canonical_hash + String(seq))
        ▼                              prev = GENESIS = sha256("AHD-CHAIN-GENESIS-ALINMA-2026"), seq = 1
   SEALED.seal  =  6c9410b9…   (the golden seal pinned by the tests)

   verifyRecord(amt):  recompute canonical(amt) → sha256 → sealBlock → compare to SEALED.seal
        intact amount  → seal matches      → { ok: true  }   ("الوثيقة سليمة — مطابقة للختم")
        tampered amount→ seal differs       → { ok: false }   ("عبثٌ مكشوف — الختم لا يطابق")
```

The same primitives are reused — never re‑implemented — by every feature: the open loan has its *own*
`openLoanCanonical` (`term=open / schedule=NONE / due=none`, basis `Quran:2:280`) but seals it with the
engine's golden `sha256` / `sealBlock` / `GENESIS`; a Circle has one `circleCanonical` / `circleSeal`;
graduation قَيْد→عهد produces an open‑loan seal with provenance back to the originating circle.

### Status flow — events → fold → status

```
   append-only event log (never an in-place UPDATE of a sealed obligation):
     AHD_DRAFTED → LENDER_SIGNED → COUNTERPARTY_SIGNED → RECORD_SEALED → ACTIVATED
                 → SETTLEMENT_SETTLED* → ALL_SETTLED / GRACE_GRANTED / DEFAULT_MARKED
                 → DISPUTE_RAISED / FORGIVEN / …
        │
        ▼   fold(events)         → { status, graced, settled, total, sealed }   (pure reducer)
        ▼   statusLabel(events)  → Arabic label  (a graced ACTIVE shows «مؤجّل بالتراضي»)
   e.g. WITNESSED → ACTIVE → KEPT («ذمّة محفوظة — وُفِّي به»)   |   DEFAULTED carries NO penalty (riba)

   open loan: foldOpenLoan(loan) folds PRINCIPAL_PAID / PARTIAL_FORGIVEN / FORGIVEN / ALL_SETTLED
              on integer halalas → { statusKey, paidMinor, forgivenMinor, remainingMinor }
              invariant: paid + forgiven + remaining == principal, and statusKey is never DEFAULTED.

   circle:    foldCircle(circle) folds each share through the SAME fold()
              → CIRCLE_DRAFT → CIRCLE_OPEN → CIRCLE_PARTIAL → CIRCLE_KEPT (or CIRCLE_VOID)
```

Status is **derived** by folding the log, never stored mutably — so any state is reproducible from a
prefix of the log, which is how the demo seeds every screen and how an auditor reconstructs history.

---

## 7 · The spine (non‑negotiable, enforced in code)

The bank's role is encoded, not just asserted in copy:

| Spine rule | Where it lives in code |
|---|---|
| **Lends nothing** | No primitive moves bank principal; records are *between people*. The app only indexes/witnesses. |
| **Judges nothing** | Disputes become a `DISPUTE_RAISED` event → `DISPUTED` («محلّ خلاف — للقضاء»); the path is court‑export, never a verdict. |
| **Charges no interest/penalty** | `RIBA_RULES` block interest/late‑penalty/percentage/commission terms; `DEFAULTED` is explicitly «متعثّر — بلا غرامة»; reminders carry the **original** amount only (no field exists for a surcharge). |
| **No credit score** | `trustSignal` is a windowed, time‑decayed kept‑ratio from a person's **own** sealed history; the UI shows a 3‑band **qualitative word** (`TRUST_BAND_AR`), never a number — own‑history only, never exported, never underwrites. |
| **Basis** | `canonical` cites `basis=Quran:2:282` (write the debt); the open‑term type cites `2:280` (grace). |
| **AI issues no fatwa** | علّام/ALLaM only drafts plain‑Arabic terms (simulated); `ribaScan` is a deterministic rule engine; no ruling is generated. |

The mode‑B pooled‑deposit «نجمع للهدف» is deliberately built only as a **pledge sketch**
(`pledgeSketch(...)` returns `poolHeldByBank: false`, `shariahReviewNeeded: true`) — the bank holds no
pooled deposit, and it is flagged for Shariah review rather than shipped.

---

## 8 · File map

```
demo/
  index.html                  FROZEN demo (logic in the AHD-LOGIC region, lines 167–692)

app/
  index.html                  shell host; loads engine → features → app.js → screens (RTL Arabic)
  engine.js                   AUTO-GENERATED byte-faithful copy of the demo's logic (window.AHD)
  build-engine.cjs            reads the demo, writes engine.js (never writes the demo)
  app.js                      AhdApp shell: registry + router + actions + Naif's seed
  app.css                     RTL Arabic baseline styling (late = amber, never red)
  features/
    daftari.js                pure: ledger rows, overdue sort, reminder cadence gate
    open-loan.js              pure: open-term qard hasan, fold, conservation, إبراء, own seal
    circle-adv.js             pure: بالأصناف split, recurring, graduation, pledge sketch
  screens/
    daftari.js                render + registerScreen("daftari", "دفتري", 📔)
    open-loan.js              render + registerScreen("open", "قرضٌ مفتوح", ♾️)
    circle-adv.js             render + registerScreen("circle-adv", "الدائرة+", 🔁)

tests/
  load-logic.cjs              slices the demo's AHD-LOGIC region for the core tests
  run-tests.cjs / offline-check.cjs / dom-smoke.cjs   Tier-1 core (184)
  app/
    run-app-tests.cjs         Tier-2 runner (auto-discovers suites)
    engine-parity.cjs         drift-guard: engine.js == demo slice
    daftari.test.cjs · open-loan.test.cjs · circle-adv.test.cjs
    determinism.test.cjs · app-offline.test.cjs · properties.test.cjs · app-dom-smoke.cjs
    server-parity.test.cjs    server-side seal parity proof (§9) — same golden engine, over HTTP handlers

server/
  engine.cjs                  THIN ADAPTER: re-exports app/engine.js unmodified (one require path)
  store.cjs                   durable append-only JSONL event log + replay (opt-in dataDir; §9) — not a real DB
  handlers.cjs                pure route handlers: (body, ctx) -> { status, body }; call the golden
                               engine + app/features/create.js + app/features/riba-lint.js only
  router.cjs                  pure dispatcher: route(method, pathname, body, ctx) -> { status, body }
  http.cjs                    LIVE Node http binder (localhost only) wiring router.cjs to a real socket
  smoke-live.cjs               OPTIONAL manual real-socket check — NOT part of the deterministic gate
```

---

## 9 · The server slice — proving the engine runs server‑side too (2026‑07)

The demo and the app (§1–8) are both **client‑side**: the engine runs in a browser or in Node‑as‑test‑
runner, but nothing ever answered an HTTP request. `server/` is a small, additive, **thin** slice that
closes that gap for one purpose: prove the exact same golden engine — the same `sha256`, `canonical`,
`sealBlock`, `recomputeSeal`, `verifyRecord`, netting core, and the app's `create.js`/`riba-lint.js`
feature layers over it — produces **byte‑identical seals** whether it runs in a browser tab or behind an
HTTP endpoint. **The seal is the API**: a client can seal a record locally (browser) or ask the server to
seal it, and get literally the same hash either way.

### What is real here

- **`server/engine.cjs`** does not reimplement anything — it is `module.exports = require("../app/engine.js")`,
  the identical module instance the app uses. `tests/app/server-parity.test.cjs` asserts this by reference
  equality (`engine === AppEngine`), not just by output equality.
- **`server/handlers.cjs`** calls **only** golden primitives (via the engine) and the already‑tested
  `app/features/create.js` (`makeDraft`, `draftTermsAr`, `createSeal`, `verifyCreated`) and
  `app/features/riba-lint.js` (`ribaCheck`/`ribaScan`). No handler computes a hash, a seal, or a netting
  result itself.
- **`POST /verify`** with no `id` (or `id:"MAIN"`) calls `engine.verifyRecord()` on the single frozen demo
  agreement (نورة→سارة, 5000 SAR / 5 months) baked into the engine at module load, and returns
  `sealed: "6c9410b9…"` — **the project's one pinned golden main seal**, reproduced through an HTTP
  request‑handler with zero reimplementation. This is the core parity proof.
- **`POST /create-loan` → `POST /seal`** for the exact same vector `golden-vectors.test.cjs` pins
  (`id: NEW-1`, أنت→سلطان, 1200 SAR / 3) reproduces **that suite's** pinned seal
  (`0463553997c8…`) exactly — proving server‑side sealing of a **brand‑new** record, not just the frozen
  one, is byte‑identical to the app path.
- **On‑spine by construction**: `POST /seal` refuses (`422`) to witness any draft whose terms the riba
  linter flags — the bank never seals an interest/penalty clause, mirroring the spine in code, not just in
  copy. There is no lending primitive (no money ever moves inside the server), no dispute‑judging
  endpoint, and no credit‑score field anywhere in a response.
- **Deterministic and offline**: `server/*.cjs` contains no `Date.now`/`new Date`/`Math.random`/`Intl`/
  `.toLocaleString`/`fetch`/`XMLHttpRequest`/`WebSocket` — checked by a static scan inside
  `server-parity.test.cjs` (mirroring `tests/app/app-offline.test.cjs`'s method). Node built‑ins only
  (`http`); zero npm dependencies; `server/http.cjs` binds `127.0.0.1` only.
- **The parity test never opens a socket.** `server/router.cjs`'s `route(method, pathname, body, ctx)` is
  a pure function — the exact one `server/http.cjs` wires to a real `http.createServer` — so
  `tests/app/server-parity.test.cjs` calls it directly (mock request, real logic) and stays inside the
  fast, deterministic gate. A **separate, optional** script, `server/smoke-live.cjs`, opens a real socket
  and makes a real HTTP round‑trip to `POST /verify`; it is not named to match the auto‑discovery pattern
  and is not invoked by `run-all.cjs`, so it can never make the gate flaky. Run it by hand:
  `node server/smoke-live.cjs`.
- **Durable persistence (T1, 2026‑07‑13)**: `server/store.cjs` is an append‑only JSONL event log, not a bare
  `Map`. Every `putLoan` (draft create, seal) appends one JSON line via `fs.openSync(..., "a")` +
  `fs.writeSync` (one syscall, whole line) + `fs.fsyncSync` before close — durable, atomic‑append. On
  startup the store **replays** the log to rebuild state; a torn/truncated tail line (a simulated crash
  mid‑write) is parsed defensively and skipped, never loaded as a record. `server/http.cjs` (the live
  process) opts into this by default at `server/data/` (override via `AHD_DATA_DIR`); `Store.createStore()`
  with no `dataDir` stays the old ephemeral, in‑memory‑only shape (used by `server-parity.test.cjs`, which
  needs a fresh, isolated store per assertion). Proved by `tests/app/server-persistence.test.cjs`: create+seal
  through one store instance, construct a **fresh** instance reading the same log file (a real simulated
  restart), and the record — including the pinned golden seal — is still there.

### What is NOT real — explicit, not hidden

This is a **hackathon proof slice**, not a production backend. Specifically absent, all left as residual
gaps:

- **No authentication or authorization** — any caller can create/seal/verify/list any loan; there is no
  session, token, Nafath integration, or per‑party access control.
- **No real database engine** — `server/store.cjs` is a durable append‑only log + in‑memory replay, not a
  relational/document DB. No transactions, no indexes, no query language, no migrations, no compaction of
  superseded records (a loan's draft line is never removed once its seal line is appended — the log only
  grows), no backup/replication story.
- **No concurrency control** — writes are not safe under multiple concurrent processes sharing one log file
  (only Node's single‑threaded event loop within one process is assumed); there is no file locking, no
  optimistic concurrency, no idempotency key beyond the simple "id already exists" 409 check.
- **No rate limiting, no request size limits, no TLS** — `server/http.cjs` is a bare `http.createServer`,
  offline‑only, meant to be run on `localhost` for a demo, not exposed to the internet.
- **No deployment story** — no process manager, no container, no environment config, no health checks
  beyond "the process is listening."
- **No pagination, filtering, or auth‑scoped listing** on `GET /list` — it returns every loan in the
  in‑memory store.
- **PKI/TSA are still seams** (unchanged from the demo/app): the hashing is real; a licensed timestamp
  authority and each party's real Nafath signature are simulated, exactly as documented in §2 of
  `app/engine.js`'s header comment.

### Endpoints (thin, on‑spine)

| Method | Path | Calls | Notes |
|---|---|---|---|
| `POST` | `/create-loan` | `app/features/create.js: makeDraft, draftTermsAr, ribaCheck` | writes a DRAFT (unsealed); `id:"MAIN"` reserved |
| `POST` | `/seal` | `create.js: createSeal` (golden `sha256`/`sealBlock`/`GENESIS`) | 422 if riba‑flagged; idempotent re‑seal |
| `POST` | `/verify` | no `id` → golden `engine.verifyRecord`; else `create.js: verifyCreated` | tamper‑evidence both ways |
| `POST` | `/net` | golden `engine.netting` | defaults to the golden 9‑IOU demo tangle |
| `GET` | `/list` | `store.listLoans` | every loan in the process‑local store |

Run the live server for manual inspection: `node server/http.cjs` → `http://127.0.0.1:8225` (offline). Run
its deterministic proof as part of the gate: `cd tests && node run-all.cjs` (the suite is
`tests/app/server-parity.test.cjs`, auto‑discovered by `tests/app/run-app-tests.cjs`).
