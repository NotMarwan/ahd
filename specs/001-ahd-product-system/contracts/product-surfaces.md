# Contract: Ahd Product Surfaces v1

**Contract ID**: `ahd-product-surfaces-v1`

**Status**: Current prototype contract

**Authority**: `spec.md`, live app registry, frozen tripwire, server router, Open-Witness tests

## Purpose

Define what each Ahd surface proves, what it may call, and what it must never imply. This is a
product-boundary contract, not a network API.

## Surface Isolation

| Surface | Lifecycle | May depend on | Must not depend on or claim |
|---|---|---|---|
| `demo/index.html` | `DEMO-ONLY` frozen reference | Its embedded assets and logic | Any edit, new feature, live provider, production state |
| `app/` | `BUILT` offline product prototype | Generated engine, local feature/screen modules, bundled assets | Network, server, production identity/time/rail, silent golden changes |
| `server/` | `DEMO-ONLY` localhost proof | App engine adapter, current feature helpers, Node built-ins | App runtime use, internet exposure, production authz/storage/security claim |
| `protocol/` | `BUILT` independent verifier | Node `crypto`, published profile and fixtures | App, engine, demo, private Ahd runtime step |
| `docs/evidence/` and pitch artifacts | `BUILT` evidence package | Cited sources and labelled current outputs | Upgrading evidence grade, inventing approval, hiding fixture/model status |
| Production service | `EXTERNAL-GATED` | Approved adapters and evidence | Activation while any mandatory gate is missing |

## App Registry Contract

The live registry in `app/app.js` and screen registration calls are authoritative. The inventory on
2026-07-14 is:

| Key | Surface label | Reachability | Current contract |
|---|---|---|---|
| `home` | Home | Primary | Product promise, current summary, and entry points |
| `create` | Create agreement | Primary | Draft, screen, simulated consent, deterministic seal |
| `daftari` | My ledger | Primary | Viewer-relative obligations and dignified actions |
| `timeline` | Witness timeline | Primary | Ordered significant events |
| `open` | Open-term loan | Primary | No due/overdue state; partial payment and forgiveness |
| `circle` | Circle | Primary | Individually attributable shares and private states |
| `circle-adv` | Advanced Circle | Primary | Item split, recurrence, graduation, gated no-custody sketch |
| `settle` | Settlement | Primary | Deterministic proposal, consent, conservation, mercy constraint |
| `refusal` | What Ahd refuses | Contextual | Visible no-lend/no-score/no-judge boundary |
| `request` | Request agreement | Contextual | Borrower-initiated dignified request |
| `impact` | Ahd impact | Contextual | Labelled aggregates, sources, market ranges, privacy floor |
| `proof` | Evidence proof | Contextual | Covered content, recomputation, judge-controlled tamper test |
| `dispute` | Dispute | Contextual | Neutral pause, reconciliation/court paths, no verdict |
| `settings` | Settings | Contextual | Display digits, masking, product-boundary controls |
| `mine` | What I owe | Contextual | Borrower-only obligations, grace request, eased payment |
| `maroof` | Good-faith record | Contextual | Neutral sealed covenant events and export |
| `standing` | Standing qard hasan | Contextual | Repeated bilateral cycles with explicit identifiers |
| `bounds` | Guarantees and limits | Contextual | Actor guarantees, proof, and explicit limits |
| `shariah` | Shariah basis | Contextual | Cited mechanic basis and unresolved questions; no AI fatwa |
| `plans` | Fees and plans | Contextual | Proposal only; no charging; D-6 remains pending |
| `org` | Organization dashboard | Contextual | Demonstration only; restricted data; program authority pending |

Adding, removing, or renaming a screen requires an inventory-drift test update and master-spec
review. A prose count alone is never sufficient.

## Behavior Ownership

| Concern | Owner path | Rendering path | Executable evidence |
|---|---|---|---|
| Create, terms, seal, riba screen | `app/features/create.js`, `riba-lint.js` | `app/screens/create.js` | create/riba/golden suites |
| Ledger, reminders, borrower, grace | `daftari.js`, `borrower.js` | matching screens | daftari/borrower suites |
| Open-term conservation | `open-loan.js` | `open-loan.js` screen | open-loan/property suites |
| Circle shares and recurrence | `circle.js`, `circle-adv.js`, `standing-loan.js` | matching screens | Circle/standing suites |
| Netting and mercy constraint | `settlement.js`, `settle-presets.js`, `rifq.js` | settlement screen | netting/rifq/property suites |
| Timeline, dispute, covenant proof | `timeline.js`, `dispute.js`, `covenant-log.js` | matching screens | timeline/dispute/covenant suites |
| Independent evidence | `proof.js`, `hash-diff.js`, `protocol/` | proof screen and CLI | Open-Witness and seal-property suites |
| Data/evidence rigor | `impact*.js`, `sources.js`, `market-model.js`, `data-rigor.js` | impact screen | data/impact/market suites |
| Refusal, bounds, Shariah | `refusal.js`, `bounds*.js`, `shariah-basis.js` | matching screens | focused and DOM suites |
| Fee/org proposals | `billing.js`, `fee-receipt.js`, `org.js` | plans/org screens | focused suites plus decision labels |

Business rules belong in pure feature modules. Screens render. `app/app.js` coordinates navigation,
fixture state, and actions; new domain rules must not accumulate in the shell.

## Cross-Surface Invariants

- Golden behavior is called, never reimplemented.
- The same valid canonical input produces the same v1 hash and seal.
- Current app journeys work with all network APIs unavailable.
- Presentation masking and digit changes do not alter sealed bytes.
- Money uses integer halalas in logic and conserves exactly.
- No surface turns a proposal, fixture, model, or pending gate into a production claim.
- No surface exports an individual numeric trust result or uses trust for underwriting.
- No surface issues an Ahd verdict or AI fatwa.
- Any judge-visible fallback identifies the product state it represents.

## Surface Verification

```powershell
node app/_serve-app.cjs
node server/demo-bank-node.cjs
node protocol/verify-ahd-seal.cjs protocol/fixtures/main-record.json
cd tests
node run-all.cjs
```

The app, server walkthrough, and verifier are separate demonstrations. Starting one is not a
prerequisite for the others except where a specific manual walkthrough says so.
