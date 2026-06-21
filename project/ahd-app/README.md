# عهد · التطبيق — `ahd-app`

A small, offline, deterministic **Arabic (RTL)** web app for **Ahd (عهد)** — the interest‑free
(*qard hasan*) prototype where a bank **witnesses and seals** interpersonal loans but **never lends,
never judges, charges no interest, and keeps no credit score**.

This folder is the **parallel publishable surface**. It is **additive**: it reuses a parity‑tested copy
of the demo's engine and adds the three consumer screens the demo was missing. **The demo
(`project/ahd-demo/index.html`) is never touched** — it stays byte‑for‑byte frozen behind its tripwire.

---

## What it is

- A tiny **screen registry + router** (`app.js`, the `AhdApp` object) over:
  - a **byte‑faithful copy of the demo's pure logic** (`engine.js`, exposed as `window.AHD`), and
  - three **pure, dependency‑injected feature modules** (`features/*.js`) with their **render‑only**
    screens (`screens/*.js`).
- **Fully offline** — no network calls, no external assets, no build step to view it.
- **Deterministic** — fixed `AS_OF` (`"2026-06-21"`), integer money (halalas), civil‑days math; **no**
  `Date.now`, `Math.random`, `Intl`, or `toLocaleString` anywhere in live code.
- **On‑spine by construction** — late is **amber, never red**; reminders carry the original amount only;
  forgiveness (إبراء) is a first‑class action; disputes route to court‑export, never a verdict.

---

## How to run

**No dependencies, no build, no server required.**

- **Just open the file.** Double‑click `project/ahd-app/index.html` (or drag it into a browser). It runs
  fully offline — everything is local `<script>`/`<link>` with no network requests.
- **Or serve it statically** (any static server works), if you prefer a localhost origin:

  ```bash
  # from project/ahd-app/
  python -m http.server 8080        # then open http://localhost:8080/
  # or:  npx serve .                 # or any static file server
  ```

The app boots on `DOMContentLoaded`, opens the first registered screen, and renders into `#app`. If
JavaScript is disabled you get a graceful `<noscript>` notice.

> **Browser note:** opening via `file://` is sufficient because nothing is fetched. Use a static server
> only if your browser restricts something for `file://` origins — the behavior is identical either way.

---

## A tour of each screen

The app ships three screens (the nav buttons at the top, right‑to‑left):

- **«دفتري» (My Ledger)** — `screens/daftari.js` + `features/daftari.js`.
  The creditor's home: every عهد the viewer (نايف) is party to, split into **«لي»** (owed to me) and
  **«عليّ»** (I owe), each row showing the amount, what's left, the next due date or an **amber overdue
  chip**, and a status word reused from the engine (no new vocabulary). Rows sort deterministically —
  most‑overdue first, then due‑soon, then settled — against a fixed `AS_OF`. The headline feature is
  **«تذكيرٌ بالمعروف»**: when a debt is overdue, **Ahd (the neutral witness) sends a warm, scripture‑grounded
  reminder to the debtor on the creditor's behalf** — fixed templates, the original amount only, **no
  day‑counter shown to the debtor**, and every reminder carries the «أحتاج وقت» (grace) exit. A finite,
  merciful cadence ladder (Tier 1 → cooldown → Tier 2 → STOP → hand back) protects the debtor from
  over‑reminding. The creditor can also offer to reschedule (2:280), forgive the remainder (صدقة), or
  export the sealed record as court‑ready evidence.

- **«القرض المفتوح» (Open‑term loan · *متى ما تيسّر*)** — `screens/open-loan.js` + `features/open-loan.js`.
  A first‑class **open‑term** qard hasan: **no schedule, no due date, never overdue** — the heart of it.
  A deliberately quiet panel shows only **«المتبقّي»** (remaining), with no red and no countdown. The
  borrower can **pay any partial amount** anytime (clamped to remaining — no overpay); the lender owns
  **إبراء** (forgive full or partial → the rest stays open). Conservation is exact in every state
  (`paid + forgiven + remaining == principal`, integer halalas). It carries its **own** sealed record
  (`term=open / schedule=NONE / due=none`, basis `Quran:2:280`) sealed with the engine's golden
  primitives, plus a live **tamper‑verify** toggle that proves any change to the amount breaks the seal.

- **«الدائرة+» (Advanced Circle)** — `screens/circle-adv.js` + `features/circle-adv.js`.
  Four panels over a shared occasion: **بالأصناف** (split each item only among who ordered it, sum
  preserved exactly so no rounding invents riba); **قِسْمة دائمة** (recurring auto‑post over given cycle
  keys, payer excluded from owing, no `Date`); **تخريج قَيْد → عهد** (a circle debt gone serious
  **graduates into «القرض المفتوح»** — an open‑term witnessed عهد sealed with the golden primitives, with
  **provenance** linked back to the originating circle); and a mode‑B **«نجمع للهدف» pledge sketch** that
  is **deliberately not finalized** — the bank holds **no pooled deposit**, and the panel shows a visible
  ⚠️ Shariah‑review guard.

Styling lives in `app.css` (a clean RTL Arabic baseline — warm palette, amber for late, never red). Fine
visual polish is intentionally left as a separate concern; the app is real and demoable as‑is.

---

## How the engine is reused (and why the demo is never touched)

The demo keeps all of its pure, DOM‑free logic in one fenced region of its HTML, between
`// ===AHD-LOGIC:BEGIN===` and `// ===AHD-LOGIC:END===` (lines 167–692 of
`project/ahd-demo/index.html`).

`engine.js` is **generated**, not hand‑written. `build-engine.cjs` **reads** the demo HTML (via the
harness's `load-logic.cjs`), inserts that exact slice **verbatim (byte‑for‑byte)**, and wraps it with a
dual‑export footer so the one file loads under Node `require()`, browser `window.AHD`, and `globalThis`.
The generator **never writes the demo** — it only reads it.

```bash
# regenerate engine.js from the (read-only) demo slice
node build-engine.cjs
```

Because the demo's bytes never change, its tripwire SHA‑256 (`e2f48467…d1b8be40`) and its golden‑vector
test suite stay intact. The faithfulness of the copy is enforced by a test (see `engine-parity.cjs`
below), so "this app uses the same engine as the demo" is a **proven invariant**, not a claim. The
feature modules receive the engine by **dependency injection** (the `engine`/`ENGINE` argument), which is
exactly what lets them run and be tested in plain Node.

---

## Tests — exact commands and what each proves

Zero dependencies; needs only **Node ≥ 18**. Each suite exits `0` on all‑green, `1` on any failure.

### Run the whole app suite

```bash
cd 10_Deep/Hardening/test-harness/app
node run-app-tests.cjs
```

`run-app-tests.cjs` auto‑discovers every `*.test.cjs` / `*-parity.cjs` / `*-smoke.cjs` file, runs each in
its own Node process, aggregates, and exits `0` iff all are green. Current app total: **8 suites,
≈283 assertions, all green.**

### Run an individual suite

```bash
cd 10_Deep/Hardening/test-harness/app
node engine-parity.cjs     # engine.js IS a faithful copy of the demo slice:
                           #   surface + golden parity (same seal, netting 9→2, fmt, respread,
                           #   ribaScan) + byte-identical slice. The drift-guard.
node daftari.test.cjs      # دفتري ledger: roles, remaining, overdue vs fixed AS_OF,
                           #   deterministic sort, the reminder cadence/cooldown ladder.
node open-loan.test.cjs    # open-term qard hasan: never overdue, partial pay clamps to remaining,
                           #   full/partial إبراء, conservation (paid+forgiven+remaining==principal)
                           #   in EVERY state, own canonical sealed with the golden primitives.
node circle-adv.test.cjs   # بالأصناف split (sum-preserving), recurring auto-post, graduation
                           #   قَيْد→عهد (reuses القرض المفتوح + golden seal), mode-B pledge sketch.
node determinism.test.cjs  # reload determinism: two independent requires of engine.js (cache busted)
                           #   give byte-identical golden snapshots; pins the seal + netting count.
node app-offline.test.cjs  # static scan of every .js under project/ahd-app/ (comments stripped):
                           #   NO fetch/XHR/WebSocket/Date.now/new Date/Math.random/Intl/toLocaleString.
node properties.test.cjs   # property-style invariants over many seeded-LCG inputs: respread sum,
                           #   circle conservation + OPEN→KEPT, open-loan conservation / never DEFAULTED.
node app-dom-smoke.cjs     # headless render of the WHOLE app (engine+features+shell+screens) under a
                           #   fake DOM; drives the screen actions; asserts nothing throws.
```

### The core (frozen demo) suite — for completeness

The app suite is **additive**; the original demo harness is separate and unchanged. To run it:

```bash
cd 10_Deep/Hardening/test-harness
node run-tests.cjs      # demo logic assertions (SHA-256 NIST, seal, tamper, Muqassa, riba)
node offline-check.cjs  # zero network seams in the demo path
node dom-smoke.cjs      # headless render of the whole demo <script>
```

Current core total: **184 assertions, 0 failures** (135 + 9 + 40). Combined with the app suite:
**core 184 + app 283 = 467 assertions, all green.**

> The harness's own `README.md` still lists an earlier core total (92) from before the Circle work; the
> authoritative current number is **184** (see `13_Circle/STATUS.md` and the repo‑root `OVERNIGHT-LOG.md`).
