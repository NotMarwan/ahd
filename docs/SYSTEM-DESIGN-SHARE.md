# Ahd (عهد) — Full System Design (share-ready, self-contained)

> One-file description of the whole project, written to be pasted into any AI chat or shared
> with an outside reader. No other file is required to understand the system.

---

## 1 · What the product is

**Ahd (عهد)** is a Saudi Islamic-finance prototype built for the AMAD Hackathon 2026. It is a bank-run
service that **witnesses, seals, settles, and nets** interest-free interpersonal loans
(**قرض حسن / qard hasan**) — but the bank **never lends its own money, never judges disputes, never
charges interest or penalty, and never keeps a credit score**.

Religious basis: Qur'an **2:282** ("write down the debt") and **2:280** ("if the debtor is in hardship,
postponement until ease"). Brand soul: «كلمتك محفوظة، وعلاقتك محميّة» — *your word is preserved, your
relationship is protected.*

When two people make a qard hasan, Ahd:

1. drafts plain-Arabic terms (ALLaM / علّام, simulated) and screens them for riba,
2. takes both parties' consent and **seals** the record with real SHA-256 into an append-only hash chain,
3. tracks the agreement's life by **folding an append-only event log** (never editing a sealed record),
4. helps people **settle** — directly, by netting mutual debts (المقاصّة / Muqassa), or by dignified
   bank-sent reminders («تذكيرٌ بالمعروف»).

Ahd is **not** a lender, debt collector, credit bureau, or judge — and those exclusions are enforced in
code, not just promised (see §7).

---

## 2 · High-level architecture — two surfaces, one engine

```
demo/index.html  (FROZEN presenter demo — single self-contained HTML file)
   └─ AHD-LOGIC region (pure, DOM-free JS: sha256 · canonical · sealBlock ·
      verifyRecord · fold · netting · ribaScan · trustSignal · circle …)
              │  read-only byte slice (extractPure)
              ├──────────────► tests/load-logic.cjs  → Tier-1 core tests run the EXACT shipped bytes
              └──────────────► app/build-engine.cjs  → writes app/engine.js (byte-faithful copy)

app/  (the publishable app, 23 registered screens, RTL Arabic, fully offline)
   engine.js (auto-generated copy of demo logic; window.AHD)
   features/*.js  — pure business logic, engine injected by DI, Node-testable
   screens/*.js   — render-only innerHTML builders; registerScreen({key,label,icon,render})
   app.js (AhdApp) — screen registry + router + action methods + deterministic seed data

server/  (thin HTTP proof slice — same engine over HTTP, localhost only)
protocol/ (verify-ahd-seal.cjs — standalone zero-dependency reference verifier)
tests/   (3,380 assertions across two tiers; one command: node tests/run-all.cjs)
```

**Why two builds?** The demo's correctness is pinned by a tripwire SHA-256
(`e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40`) and golden-vector tests. Its bytes
can never change, so all new product surface grows in `app/`, which reuses a **parity-tested copy** of
the demo's engine. `tests/app/engine-parity.cjs` proves three things every run: (a) the engine exposes
every expected symbol, (b) it reproduces the demo's frozen golden outputs (main seal `6c9410b9…`,
9-IOU netting → 2 transfers, riba verdicts, formatting), and (c) `engine.js` **literally contains the
exact demo byte slice**. "Same engine" is a test, not a promise.

### App layering (per feature)

```
features/<name>.js  PURE logic. No DOM. Engine passed in as argument (dependency injection).
                    Deterministic: fixed AS_OF date, integer halalas, civil-days math (no Date).
screens/<name>.js   PURE render. Builds innerHTML string; wires onclick → AhdApp methods;
                    self-registers via App.registerScreen(...).
app.js (AhdApp)     Shell: registry + router (go/boot/rerender) + action methods that mutate
                    deterministic state and re-render + seeded demo ledger.
```

Script load order in `app/index.html`: engine → features → app.js → screens.

---

## 3 · Core cryptographic model — the seal

```
record (lender, borrower, principal_minor, schedule, terms_hash, consent, timestamps, basis=Quran:2:282)
   → canonical(record)            deterministic line-joined bytes ("AHD-RECORD-v1\n…")
   → sha256(canonical)            canonical_hash
   → sealBlock(prev, ch, seq) =   sha256(prev_hash + canonical_hash + String(seq))
       prev = GENESIS = sha256("AHD-CHAIN-GENESIS-ALINMA-2026"), seq = 1
   → SEALED.seal (golden main seal: 6c9410b9…)

verifyRecord(amount): recompute canonical → sha256 → sealBlock → compare.
   intact   → { ok: true }   «الوثيقة سليمة — مطابقة للختم»
   tampered → { ok: false }  «عبثٌ مكشوف — الختم لا يطابق»
```

The same primitives are **reused, never re-implemented** by every feature: the open-term loan has its own
canonical form (`term=open / schedule=NONE / due=none`, basis Quran:2:280) but seals with the same golden
`sha256`/`sealBlock`/`GENESIS`; Circles have `circleCanonical`/`circleSeal`; graduation قَيْد→عهد produces
an open-loan seal with provenance back to the originating circle.

**Status is derived, never stored:** an append-only event log
(`AHD_DRAFTED → LENDER_SIGNED → COUNTERPARTY_SIGNED → RECORD_SEALED → ACTIVATED →
SETTLEMENT_SETTLED* → ALL_SETTLED / GRACE_GRANTED / DEFAULT_MARKED / DISPUTE_RAISED / FORGIVEN …`)
is folded by a pure reducer `fold(events) → { status, graced, settled, total, sealed }`. Any state is
reproducible from a prefix of the log. `DEFAULTED` carries **no penalty** (penalty = riba).

**Open-Witness v1** (spec `docs/specs/open-witness-v1.md`): any sealed record is independently
verifiable by `protocol/verify-ahd-seal.cjs` — a standalone Node script using only `crypto`, which never
imports the app or demo. It also carries a bank Ed25519 signature over each sealed block (fixed demo
keypair) and an RFC-6962 Merkle inclusion proof over batches.

---

## 4 · Determinism & offline guarantees (enforced by static tests)

- **Fully offline** — zero network. Demo and app statically scanned: no `fetch` / `XMLHttpRequest` /
  `WebSocket`.
- **Deterministic** — no `Date.now`, `new Date`, `Math.random`, `Intl.*`, `.toLocaleString` anywhere in
  live logic. Day math is a pure civil-days algorithm against fixed `AS_OF = "2026-06-21"`;
  thousands-grouping is hand-rolled `fmt()`. Same inputs → byte-identical outputs on every machine.
- **Integer money** — all values in **halalas** (1 SAR = 100). Everything hashed and every netting runs
  on integers; SAR is a display projection. `respread()` splits totals with the **sum preserved exactly**
  — no rounding ever invents a phantom halala ("no rounding-riba").
- **Stateless rule engine** — riba regexes use no `/g` flag (no `lastIndex` carry-over); a negation guard
  keeps «بلا فائدة» (without interest) clean while «فائدة» is blocked.

---

## 5 · Product surface (what a user sees)

### Demo (frozen presenter build)
1. **Witnessed record + live tamper-verify** — the foundation.
2. **المقاصّة / Muqassa netting** — greedy min-transfer netting over a group's mutual IOUs with an exact
   conservation invariant and deterministic tie-break; showcase: **9 IOUs → 2 transfers**, each affected
   party consents to their new leg (novation).
3. **الدائرة / Circle (G1–G4)** — a thin parent over N bilateral qard-hasan shares born from one event
   (trip, shared rent, group gift). No new financial primitive; per-halala sum-preserving split; status
   derived from the shares' folds (`CIRCLE_DRAFT → OPEN → PARTIAL → KEPT`).

### App (23 registered screens; key capabilities)
4. **«دفتري» / My Ledger** — the creditor's home: everything owed to me («لي») and by me («عليّ»), with
   remaining, next-due, amber (never red) overdue chips, deterministic sort. Headline feature
   **«تذكيرٌ بالمعروف»**: Ahd — the neutral witness — sends a warm, scripture-grounded reminder to the
   debtor on the creditor's behalf. Guardrails: original amount only (no field for a surcharge exists),
   no day-counter shown to debtor, every reminder carries the «أحتاج وقت» (grace) exit, finite merciful
   cadence ladder (Tier 1 → 7-day cooldown → Tier 2 → STOP → hand back to creditor with three
   non-punitive choices: keep waiting · forgive · export).
5. **«القرض المفتوح» / Open-term loan** («متى ما تيسّر») — no schedule, no due date, **never overdue**;
   partial payments clamp to remaining; lender owns إبراء (full or partial forgiveness); exact
   conservation `paid + forgiven + remaining == principal` in every state; own sealed record (basis 2:280).
6. **Advanced Circle** — by-item split (بالأصناف, each item split among who ordered it, Σ preserved),
   recurring auto-post over deterministic cycle keys, and **graduation قَيْد → عهد** (a circle debt gone
   serious becomes an open-term witnessed loan, sealed, provenance-linked).
7. **الجمعية الموثّقة (sealed ROSCA / jamiya)** — payout order is consensual (no lottery → no maysir),
   every contribution/payout round is a sealed event, funds never pass through the bank; conservation
   proven in integer halalas across the full cycle.
8. **عهد اليومي (daily lite ledger)** — a personal unsealed قيد (explicitly labelled «غير مختوم»),
   upgradable to a sealed ahd; offline WhatsApp confirm link (`confirm.html#<base64url(JSON)>`,
   deterministic accept code = first 12 hex of `sha256(canonical + ":ACCEPT")`); dignified reminders;
   largest-remainder bill split that conserves every halala.
9. **Trust signal** — `trustSignal` computes a windowed, time-decayed kept-ratio from a person's **own**
   sealed history; UI shows a **3-band qualitative Arabic word** («وفّى بعهوده» / «وفّى بأغلب عهوده» /
   «عليه وعدٌ متأخّر» / «جديد») — **never a number, never exported, never underwrites**.

The full app layer is now **~48 pure feature modules and 23 registered screens** — beyond the core
capabilities above it includes: proof/exhibit views (court-export), dispute flow, settlement +
settle-consent presets, timeline, riba-lint UI, impact analytics (personal band → national model),
bounds panel (what the bank refuses and why), refusal screen, Shariah-basis screen, covenant log,
organizer tools, billing/fee receipt (service fee model — never on the loan), settings, and a
2026-07-16 competitive-capability wave of nine benchmark modules (documented in
`docs/CAPABILITIES-STRUCTURE.md`), all on the same DI feature-module → screen → registry pattern.

**Mobile (Expo React Native, `application/ahd-mobile`) — the local-first Pilot MVP:** a real,
installable Arabic-first RTL client for one or two pilot customers, ~26 screens (Home, CreateAhd,
Daftari, OpenLoan, Settlement, Proof, Mine, Maroof, Jamiya, Daily, Circle/CircleAdv, Timeline, Dispute,
Bounds, Refusal, Shariah, Impact, Standing, Org, Request, Plans, Settings, More, RecordDetail, Welcome).
Key properties:

- **Local-first persistence** — SQLite (`expo-sqlite`) with five versioned slices (profile, journey,
  daily, jamiya, settings); serialized writes, snapshot-before-mutate, corrupt/future versions fail
  closed into a recovery screen; delete-all and deterministic versioned JSON export
  (`ShareEnvelopeV1` for sealed-record sharing).
- **Honest pilot disclosure** — first launch is a mandatory Arabic `/welcome`: data stays on device,
  not a banking service, not Shariah/legal approval, display names only (national ID / phone / bank
  account / credentials / analytics forbidden by design and by test), zero network.
- **Product boundary enforced by tests** — only `application/ahd-mobile` is client runtime; the root
  `app/` engine feeds it via byte-pinned generated domain modules (sync script), never direct imports.
- **Feature hub + settlement teaching demo (2026-07-17)** — the More tab is a hybrid hub (outcome-led
  hero, recent-tools strip, category chips, bento cards, searchable full catalog); Settlement shows real
  local records first, and when empty renders the frozen 9-obligation golden netting tangle as a
  clearly-labelled non-persisted example (`بيانات تجريبية`) with the 9 inputs and 2 computed transfers.
- **Delivered Android pilot APK** — <100 MB gate, SHA-256 checksum, automated Maestro emulator-journey
  evidence, RTL/safe-area/launcher fixes; financial invariants enforced (integer money kept out of the
  screen layer).

### Visual design system — Trust Weave (canonical; the earlier Sadu direction was rejected)

The approved design language across the mobile app makes the "weave of trust" literal — thread bands,
rails, knots, seal chips, and before/after netting paths as UI primitives:

- **Palette (semantic, enforced by theme-token tests):** primary cobalt `#2456F6`; warm paper surface
  `#F6F2E9` with white cards and near-black ink `#16222C`; gold `#B9862F` = kept/fulfilled/mercy;
  amber `#C77E1E` = waiting/late-without-penalty; red `#C2402A` reserved **only** for tamper or
  prohibited (riba) terms — never a generic error/accent color.
- **Type & digits:** Arabic primary; money, hashes, and references in isolated Latin tabular digits
  (one mono style).
- **Ergonomics:** controls ≥48 px, rows ≥56 px, radii 20/14/10; all destinations render without
  horizontal overflow at 360/394/480 px.
- **Structure:** theme tokens own all semantic color/spacing/radius/type; shared primitives own paper,
  cards, buttons, chips, headers, woven bands, seal chips, meters, and the netting visual; screens only
  compose primitives around live store/engine data — no business math in rendering.
- Canonical references: `docs/research/related-apps/vibe-preview-trust-weave-v2.html` (+ b2/b3 batches);
  design specs in `docs/superpowers/specs/2026-07-16-trust-weave-mobile-design.md`.

---

## 6 · The server slice (proof, not production)

`server/` proves the exact same golden engine produces **byte-identical seals over HTTP**:

- `server/engine.cjs` is literally `module.exports = require("../app/engine.js")` (reference-equality
  asserted in tests).
- Endpoints (Node built-ins only, zero npm deps, binds 127.0.0.1):
  `POST /create-loan` (draft, riba-linted) · `POST /seal` (golden seal; **422 refuses any riba-flagged
  terms**) · `POST /verify` (tamper-evidence; no-id returns the pinned golden main seal `6c9410b9…`) ·
  `POST /net` (golden netting) · `GET /list` · `GET /health`.
- Durable append-only JSONL event store with fsync, crash-torn-tail-safe replay; HMAC bearer sessions on
  mutating routes; deterministic fixed-window rate limits; minimal Dockerfile.
- **Explicitly NOT production**: no real DB, no multi-process concurrency control, no Nafath identity,
  no TLS/hosting, no pagination. PKI party signatures and RFC-3161 timestamps are documented seams —
  hashing is real, the authorities are simulated.
- `server/demo-bank-node.cjs` is a one-command judge-facing terminal walkthrough: live server seals a new
  record, verifies via its own `/verify`, then the independent `protocol/verify-ahd-seal.cjs` re-verifies.

---

## 7 · The spine — non-negotiable constraints, enforced in code

| Rule | Enforcement |
|---|---|
| Bank lends nothing | No primitive moves bank principal; records are between people. |
| Bank judges nothing | Disputes → `DISPUTE_RAISED` event → «محلّ خلاف — للقضاء»; path is court-export of the sealed record, never a verdict. |
| No interest / penalty | `RIBA_RULES` block interest, late-penalty, percentage, commission terms; defaulted state is «متعثّر — بلا غرامة»; reminders carry the original amount only. Server refuses to seal riba-flagged drafts (422). |
| No credit score | Trust band is a qualitative word from own history only; never a number, never exported. |
| No maysir / gharar | Fixed known integer amounts; jamiya payout order consensual (no lottery); open term is permitted tabarru' (benevolence), not gharar. |
| AI issues no fatwa | ALLaM only drafts terms (simulated); `ribaScan` only flags vocabulary; no ruling generated. |
| Mercy built in | Grace (2:280) re-spreads with sum preserved exactly; إبراء first-class; reminder ladder ends in mercy. |

Gated (not shipped, pending Shariah/privacy sign-off): self-disclosure trust badge («سجلّ وفائي») and the
mode-B pooled deposit («نجمع للهدف» — built only as a pledge sketch with `poolHeldByBank: false`,
`shariahReviewNeeded: true`).

---

## 8 · Test harness (the gate)

Zero-dependency, Node ≥ 18, exit 0/1. **3,380 assertions, all green** — one command:
`cd tests && node run-all.cjs`.

- **Tier 1 — core (184)**: slices the real demo bytes each run; SHA-256 NIST vectors, golden seal,
  tamper, netting, riba rules (`run-tests.cjs`), offline scan (`offline-check.cjs`), headless DOM render
  (`dom-smoke.cjs`), structure check (14).
- **Tier 2 — app (3,182 across 94 suites)**: engine parity drift-guard, per-feature logic suites,
  reload determinism, static offline/determinism scan of all app JS, property-style invariants over
  seeded-LCG inputs (conservation, `remaining ≥ 0`, never-DEFAULTED), headless full-app DOM smoke,
  server parity + persistence (torn-write replay).
- **Tripwire**: `node tests/tripwire.cjs` pins the frozen demo's SHA-256.

Development rules: never edit the demo or the golden functions; build additively in new files; TDD
(failing test first); no nondeterministic primitives; anything touching the spine or a Shariah question
goes to a human decision log, never decided by an agent alone.

---

## 9 · Repository map

```
demo/index.html          frozen presenter demo (logic fenced in AHD-LOGIC region)
app/                     publishable app: engine.js (generated) + features/ + screens/ + app.js + app.css
  build-engine.cjs       regenerates engine.js from the demo (never writes the demo)
  _serve-app.cjs         local static server → http://localhost:8124 (fully offline)
server/                  thin HTTP proof slice (engine adapter, JSONL store, handlers, router, http)
protocol/                verify-ahd-seal.cjs standalone verifier + golden/tampered fixtures
tests/                   Tier-1 core + tests/app/ Tier-2 + run-all.cjs (single-command gate)
docs/                    ARCHITECTURE.md · PUBLISHABLE-PRODUCT-SPEC.md · CAPABILITIES-STRUCTURE.md ·
                         JUDGE-LENS.md · specs/ (open-witness-v1, jamiya-v1, daily-v1 …) · pitch/
project/mcp/             3 stdio MCP servers (17 tools) for AI-agent project navigation
promo/                   Remotion motion promos
application/ahd-mobile/  Expo React Native pilot client (SQLite local-first, Trust Weave theme, APK)
```

---

*Ahd v1.0 — قرضٌ حسنٌ مكتوبٌ ومشهود، بكرامة. (A goodly loan, written and witnessed, with dignity.)*
