# _meta/OPEN-ITEMS.md — everything still unresolved (consolidated 2026-07-01)

> Supersedes `_meta/deep-work/ledger/open-threads.md` as the live open-items list. That file's OT-IDs are
> the stable references used here; see it for the original P0–P2 prioritization rationale. This file
> merges it with `docs/DECISIONS-FOR-MARWAN.md`'s "Standing items" and marks resolved items done rather
> than deleting them, so IDs stay traceable.

## JL — judge-lens gaps (win items, freeze 15 July; see `docs/JUDGE-LENS.md`)

| ID | Item | Front | Status |
|---|---|---|---|
| **JL-1** | Pitch & demo kit — **built + 6-judge panel-reviewed + fix round applied 2026-07-07** (`docs/pitch/`: deck-content-v2 · script-ar · top6-cards · guide §2). Panel (pre-fix): innovation 7 · technical 7 · data 6.5 · UX 7 · feasibility 7 · memorability 6 — fixes: cold-open on the tamper moment, live-gate terminal flash, riba corpus named, honest-urgency close. **Residual to close:** rehearsal validating every click, .pptx build (blocked on B1 template + B2 team names), re-score before 15-July freeze | Front 1 | in review |
| **JL-2** | Premium UX pass: land the July-1 premium direction across all 12 screens — `app/app.css` + screen markup only, zero unstyled corners. **Panel priorities (UX lens 2026-07-07): ① proof-tampered screen ② riba-error hierarchy — both treated in the phase-5 commit (966bd87).** Phases 2–8 landed 2026-07-07 evening (motion · a11y · depth · nav · wordmark+watermark); **Phase 7 (emoji→SVG) deliberately skipped** (gate-adjacent diff, marginal 3-min payoff). Pixel reshoot of deck/fallback screenshots still pending (rehearsal) | Front 2 | styled — pending reshoot + re-score |
| **JL-3** | Data-analysis story: on-spine «أثر عهد» analytics screen (TDD) + evidence-brief data slide. **Panel blueprint (data lens 2026-07-07): k-anonymous netting-efficiency dashboard — (a) transfers-avoided-per-circle distribution, (b) total SAR moved vs net-settled (conservation), (c) circle-size distribution; k≥3 floor shown; fixture circles labeled «test circles» honestly; + an animated 9→2 compression visual in the app (today it exists only in the frozen demo)** — **built 2026-07-07** (`app/features/impact.js` + `app/screens/impact.js` + `tests/app/impact.test.cjs` 94/0; dom-smoke +17; suites 33/33; golden netting via DI) | Front 3 | built — pending JL-2 styling + re-score |
| **JL-4** | Judge-visible depth (only if it strengthens the demo; cut first on slippage): borrower-protections panel (OT-P1other) and/or proof-pack polish — **built 2026-07-08**: «الضمانات والحدود» guarantees-as-code panel (`app/features/bounds.js` + `app/screens/bounds.js` + `tests/app/bounds.test.cjs` 60/0; dom-smoke +14; suites 34/34; gate 1683/0) — three columns للمدين·للدائن·حدود المصرف, every بند names its real guard file and the suite fs.existsSync's each one; contextual (home card + chips on «ما عليّ»/«حافظة الإثبات», NAV_ORDER untouched); closes OT-P1other's panel ask + OT-DEPTH P15 | Front 4 | **scored 9 Jul (panel #3)** — helps technical/feasibility/UX, correctly parked below the climax for Q&A depth; done |
| **JL-5** | **Stage-dare gate risk (found live 9 Jul, twice):** the on-stage «شغّلها الآن أمامك» command `node run-all.cjs` bundles the agent-presence 45-min staleness check into the same red/green banner — a leftover `status:"active"` presence file turns the pitch's highest-stakes proof moment RED for a non-product reason (observed: `AHD GATE ❌ 1682/1` mid-review). Fix before 15-Jul freeze, without weakening any assertion: (a) pre-stage hygiene step in PRESENTER-GUIDE + morning-of-18 checklist («all presence files exited, then confirm green»), and/or (b) an additive stage command (product suites + tripwire, no meta/process checks) the script points at — decision on (b) is operator's since the script currently names `run-all.cjs` | Front 1 | **closed 2026-07-10 (stage-preflight.cjs + guide step ٤; run-all.cjs stays the stage command)** |

> **JL-3 depth (2026-07-11):** per-circle drill-down shipped — «أثر عهد» buckets now expand to
> anonymized per-circle rows (k-floor enforced structurally in `app/features/impact-drill.js`).
> Same round: neutral exhibit rendered on-screen (سِجلّ المعروف), bounds guards expandable with
> run commands, settlement preset tangles (judge-pokeable), circle-adv real stop/resume.
> Gate **1809/0**, suites 40/40. Re-score data criterion at the 14-Jul Gate-B panel; target ≥8 (was 7.5).

### Panel #3 fix queue (2026-07-09 six-lens re-score + skeptic verification — all items file/line-verified)

> **✅ APPLIED 2026-07-09 evening** — items 1–8 + 10 landed (plan: `docs/superpowers/plans/2026-07-09-panel3-fix-round.md`;
> commits `13588e3..`; TDD teeth added for items 5–6: +4 dom-smoke assertions, gate now **1687/0**; browser-verified
> incl. the digit toggle flipping both screens together). **Still open:** rehearsal + pptx build (JL-1 residuals) ·
> Gate B re-score 14 Jul. Item 9 (JL-5 row) **closed 2026-07-10** (stage-preflight.cjs + guide step ٤; run-all.cjs
> stays the stage command).

Scores: innovation 8= · technical **9→8** · data 7.5= · UX 8= · feasibility 8= (OT-VAL audit **clean**) · memorability 8=. Ordered by judge-impact; owners in brackets:

1. **Number sweep 1,603→1,683 / 1,405→1,485 / 33→34 suites** (cause of the technical drop — the script has the presenter SPEAK «١٬٦٠٣/٠» at 0:25 then RUN the gate at Q&A which prints **1683/0**): `docs/pitch/script-ar.md:66,79` · `deck-content-v2.md:13-14,98,174` · `PRESENTER-GUIDE.md:38,47,154` · `EVIDENCE-BRIEF.md:122` · `REBUTTAL-PLAYBOOK.md:9,118,202,207` · `top6-cards-ar.md:5` · `ملخص-الجديد-ببساطة.md:13` · `ARCHITECTURE.md:228` · `PUBLISHABLE-PRODUCT-SPEC.md:150` · `CLAUDE.md:23-24`. Front-loads the planned 12-July grep — file list is ready. [agent, text-only]
2. **Deck images: all 7 slots point at pre-premium dirs** (`deepening/`, root, `premium/`, `audit/` — every one still exists on disk, so the pptx build would silently embed pre-JL-2 visuals; each slot already carries `<!-- reshoot-after-JL-2 -->`): repoint to `app/screenshots/premium-after/` equivalents at `deck-content-v2.md:114,131,149,164,188-189,192`. [agent, text-only; gate: before pptx build 10–11 Jul]
3. **«أثر عهد» invisible on stage** (data 7.5 blocker): deck slot-8 narrates k-anonymous aggregates over a settlement image → swap `deck-content-v2.md:131` to `premium-after/11-impact-collapsed.png`; fill the `PRESENTER-GUIDE.md:50` Front-3 placeholder (pending since 7 Jul); add one `[+موسّع]` beat pressing settlement's existing «📊 أثر عهد» chip to the 5-min script ONLY (3-min is at ~370/390-word budget — no slack). [agent]
4. **Findex 35.8% 🟢 unintegrated** (primary-sourced, sits in `swarm/agent-3-official-stats/findings-claude.md`): merge into `EVIDENCE-BRIEF.md` + deck Khanah 5 — the honest non-survey demand substitute while OT-A1 stays open. Already planned as vault «دمج 10–11»; panel confirms it's the highest-value data add. [agent] — **integrated 2026-07-13 (D1+D2 data-rigor sweep):** new `EVIDENCE-BRIEF.md` §1 row D-11 (🟢, verbatim World Bank figures) + new MEASURED entry `app/features/sources.js` (`findex-borrow-family`, tested `tests/app/sources.test.cjs`) surfaced on the «أثر عهد» sources panel beside the synthetic-fixture caveat + `app-dom-smoke.cjs` on-screen assertion. **Deck Khanah-5 slide copy still NOT touched** (out of this pass's file scope) — residual if a judge-facing deck refresh follows.
5. **Nafath honesty tag gap** (feasibility, guaranteed 3-min path): `app/screens/create.js:49,55` seal button «اختم العهد عبر نفاذ» + post-seal «الوثيقة المختومة · نفاذ + SHA-256» carry no `(محاكاة)` marker — while `request.js:42` has one and the close asks for «تأكيد نفاذ» 90s later. One-line copy fix, mirrors existing pattern. [agent, additive copy]
6. **Digit-system split on the headline stat** (UX): `app/screens/settlement.js:35` renders raw Western `9 ⟶ 2` bypassing `App.digit()` while `impact.js:58` hardcodes literal «٩ ← ٢» — same stat, two numeral systems, adjacent screens on bars #2/#3. Two string edits. [agent]
7. **Close is a fade, not a mic-drop** (memorability): script's last stage direction is «عُد إلى الرئيسية» — recency lands on a generic home screen. Hold the proof-verified card (or 1-sec 9→2 flash) under «كلمتهم محفوظة، وعلاقتهم محميّة», logo-alone only for the final 2s. [agent, script line]
8. **Refusal-as-identity clause missing** (innovation): the close lists «لا رقم ائتمانيّ» inside a compliance clause; edition-1 calibration demands it argued as chosen identity (their panel rewarded credit scoring). Add ~8-word clause to the 2:40 close + mirror in Q-E4 opener (`REBUTTAL-PLAYBOOK.md`). [agent, copy]
9. **JL-5 stage-dare red risk** — see the JL-5 row above. [operator decision on command choice + agent for guide text] — **closed 2026-07-10 (stage-preflight.cjs + guide step ٤; run-all.cjs stays the stage command)**
10. **Commit the working tree**: `docs/pitch/fallback/{02,03,04,06}.png` verified byte-identical to their `premium-after/` counterparts (the stage safety net is already resynced — good) but uncommitted since the 8-Jul 15:40 regeneration; could be lost before freeze. [operator or agent: `git add docs/pitch/fallback && commit`]

### Real-leap re-score residuals (2026-07-12 — 3 Opus adversarial critics, told to REFUTE)

> Honest verified re-scores on the UPDATED product (baseline = the adversarial baseline, NOT the inflated internal 8s):
> UX **5→6** · innovation **7→7 (refuted — the panel restates, doesn't demonstrate)** · technical **6→6** · data **5→6** ·
> feasibility **4→5 (communication only; 0 external gates moved)** · memorability **6→6.5**. Spine audit: **PASS (all 6 axes).**
> Gains were ~+1 on three criteria, NOT the +2/+3 hoped — the deeper ceilings below are the real work. Full report:
> `docs/عهد-تقرير-صارم-٢٠٢٦-٠٧-١٢.md`.

| ID | Item | Type | Notes |
|---|---|---|---|
| **JL-6** | **No-drift gate test** — assert the count printed on every judge surface (deck/script/guide/brief/rebuttals/README) equals the live `run-all.cjs` banner; red on mismatch | Test, recommended | The number regrew 2031→2072 this session and re-split the surfaces; I swept them by hand to 2,072/0 but the drift keeps recurring (memory: gate-number-drift). A test is the durable fix — **BUILT 2026-07-13** (`tests/gate-drift-check.cjs`, wired as run-all.cjs step 6; scans ASCII **and** Arabic-Indic digits; 12 fixture self-teeth prove both catch+exclude directions; caught 3 real pre-existing drifts live [deck:100,176 · rebuttal:118]; meta-excluded from the product total so it never self-inflates). **CLOSED.** |
| **JL-10** | **Data evidence ceiling** — primary Findex series + bounded GASTAT context + model/secondary labels shipped 2026-07-14; still no Saudi primary demand survey or pilot traction | Data | Conservative Judge Lens: 7.5/10. Keep fixtures synthetic; acquire interviews/survey before claiming relational demand. |
| **JL-11** | **Judge scanability / Arabic type** — compact evidence headline shipped, but reviewer still scored UX 7.0 for dense disclosure and system-font ceiling | UX | Needs approved OFL Arabic display font and live rehearsal. |
| **JL-12** | **External feasibility proof** — scholar/regulatory review and pilot remain absent | Feasibility | Conservative Judge Lens: 7.0/10. Do not imply approval, integration, or traction. |
| **JL-7** | **Sadu design-language port** — carry the FULL `dir-b-sadu.html` language (large titles, poetic separators, grouped sections) + a distinctive Arabic display font into `app/` | Design, UX ceiling | Front A ported only the thinnest signifier (6px band + emblem); `app/app.css:28` still uses the OS `Segoe UI` stack — the root of "looks templated" |
| **JL-8** | **Real dataset for «أثر عهد»** (= OT-A1) — replace the 12 reverse-engineered fixture circles with a real survey (n≥150) or real circle data; harden `impact-drill.js` k-floor (aggregate, don't reveal per-record once a bucket clears k) + add the missing no-leak regression test | Data, data ceiling | The national scenario is honest but the ratio is a synthetic ÷3; the drill-down currently reveals per-record detail once k passes (harmless on fixtures, unsafe on real data). **k-floor HARDENED 2026-07-13**: `impact-drill.js` rewritten aggregate-only past `K_FLOOR` (`bucketAggregate()` returns one object — size/count/ranges/total — never per-record id/label, any bucket size) + no-leak regression test (proven fail-before via git-stash → pass-after, on a 3-circle AND a synthetic 50-circle bucket). **÷3 single-point fragility PARTIALLY ADDRESSED 2026-07-13 (D1 data-rigor sweep):** new `app/features/impact-band.js` replaces the settle screen's single projected number with a deterministic p10/p50/p90 SENSITIVITY BAND over 200 seeded synthetic circles (three archetypes read off the existing 12-fixture set's own proportions: balanced/star/tangle), golden netting reused via DI, tested `tests/app/impact-band.test.cjs` (54/54: determinism, monotonicity, integer-only, brackets the old point). **Still synthetic — not measured usage.** **Data-sourcing half (real survey n≥150 = OT-A1) still open — human-gated; the band raises rigor about a known-synthetic ratio, it does not manufacture real data.** |
| **JL-9** | **Judge-driven tamper in the SCRIPT** — the scripted cold-open still fires the canned `+4000` toggle; point it at the new judge-typed input so a passive judge sees the real path | Pitch copy | Front C built the interaction; the governing `script-ar.md` beat-1 still presses the canned «جرّب العبث بالمبلغ 🧪». **Assessed 2026-07-13: choreography-gated, NOT a clean autonomous fix.** Forcing judge-typing into the 25-second cold-open risks a fumble + blows the 390-word ceiling (script is AT budget). The judge-typed path is built and available; **recommend offering it in Q&A / the [+موسّع] beat, keeping the canned button for the timed cold-open (stage safety).** Owner decides whether to promote it to the default path — same class as the weave-tear-on-default-path call. |

## Genuinely still open

| ID | Item | Type | Notes |
|---|---|---|---|
| **OT-A1** | One real Saudi demand voice (relational-strain shard) — interviews/survey | Non-code, field | Team item, pre-pitch |
| **OT-A2** | "Why Alinma, not Al Rajhi" moat strategy | Strategy | Rebuttal exists; moat is a strategy to build, not yet realized |
| **OT-VAL** | Pre-production validations: Nafath-AES permission, Alinma Shariah-board fee sign-off, accredited CSP/TSA | Counsel-only | Never assert these on stage until confirmed |
| **OT-CITE** | Counsel-confirm exact Evidence-Law article numbers + M/8-vs-M/18 + refresh 2024-25 court figures | Counsel-only | |
| **OT-PATCH** | Apply the JCS-depth SEAL patch (`_meta/deep-work/backend/prototype-compute-patch.md`) + re-pin golden vectors | Post-demo, mechanical | Not yet applied - tripwire is still the pre-patch hash |
| **OT-SEAL5** | Complete the SEAL to a full 5-property chain (multi-block + TSA + bank-sig + Merkle) | v2 | ~3/5 properties today |
| **OT-DEPTH** | v2 mechanisms - **partially addressed**: dispute-export (P12) roughly built via F2 proof-pack screen; recurring-covenant (P13) roughly built via Circle-adv recurring auto-post; on-screen attestation-boundary panel (P15) **done 2026-07-08** via the «الضمانات والحدود» bounds panel (JL-4 — the «حدود المصرف» column states witnesses/never-lends/never-judges/no-fee/no-score/AI-no-fatwa, each with its guard test). **Still unbuilt:** duress/coercion flag (P11), AML/collusion signal (P14) | v2 | |
| **OT-P1other** | Borrower-side asks - **partially addressed**: grace ("يُسر") real state logic done; standalone borrower-protections panel **done 2026-07-08** (JL-4 «الضمانات والحدود» — the «للمدين» column, guarantees-as-code; describes existing guarantees only, zero semantics changed). **Still open:** borrower-invokable إبراء (shipped as lender-owned only, not borrower-invokable — D-gated, `docs/DECISIONS-FOR-MARWAN.md`) | Product | |
| **OT-IDSTATE** | Reconcile the `ahd_id` type (ULID/UUIDv7/base32/string) and declare one binding state-name enum | Needs verification | Status unclear - the app's event-sourced fold() now uses one consistent state vocabulary in practice; hasn't been checked whether `ahd_id` generation was ever reconciled against the original ULID/UUIDv7 question |
| **OT-13** | A second, divergent handoff series reportedly exists outside this repo at a separate local path | Unverifiable from here | Outside this repo/working directory - needs the operator to confirm whether that path still exists |
| **OT-14** | Possible duplicate Agent-1 legal layer files inside the research vault | Unverified, low priority | Vault content - out of scope per this consolidation's non-goals (no physical vault merge); confirm the duplicate still exists before acting |
| **OT-LINKS** | A dangling wikilink, a dead source citation, and a stale dossier demo-hook, all inside the research vault (`contracts.md`, the growth layer, dossier section 6) | Unverified, low priority | Vault content - out of scope per this consolidation's non-goals (no physical vault merge); confirm still relevant before acting |

### Ceiling-break research items (2026-07-13 — deep-research session; full rationale + sources in `docs/superpowers/plans/2026-07-13-ceiling-break-8-9-plan.md`)

> Research-backed levers to break the 7.6/6.5 ceiling on Innovation · Data · Technical. Each marked OFFLINE-buildable-now
> or the named human/vendor gate. Proposals for the `judge-lens-real-leap` build session to build + adversarially verify;
> no score is self-assigned. Spine-checked. Prior-art/standards-checked.

| ID | Item | Front | Offline-now vs gate |
|---|---|---|---|
| **OT-RIFQ** | **رِفْق mercy-first clearing** — a hardship-declared (مُعسِر), creditor-co-witnessed debtor is excluded from *forced* set-off and deferred in the netting; grace written into the seal as a first-class event. Netting optimizes liquidity *subject to* a debtor-protection constraint. Prior-art whitespace: no netting system in the literature (Fleischman/Dini/Littera 2020, Byppay 2026, Splitwise, Ripple, Trustlines) encodes debtor protection. **Must WRAP, never modify** golden netting/`sealBlock`/tiebreak. Biggest offline Innovation mover + a memorability beat. | Innovation | **OFFLINE** (constraint layer); LIGHT gate — scholar confirm muqāṣṣa consent condition → `DECISIONS-FOR-MARWAN` |
| **OT-STD1** | **Open-Witness as a published open standard** — version + open license + a multi-issuer interop demo (4/5 standard artifacts already on disk). Claim only *"first registry-free, chain-free open seal for interpersonal benevolent debt"* (not "first issuer-independent attestation" — VC/OA/C2PA own that). Foil: eNote/MERS keeps the registry; Ahd removes it. | Innovation | **OFFLINE** (spec/verifier/vectors exist); LIGHT gate — owner licensing/governance decision |
| **OT-FINDEX25** | **Integrate the full Findex 2011–2024 series** (direct World Bank API `source=28`, 🟢) incl. the fresh 2024 figure (family/friend borrowing 30.4%; emergency-backstop reliance *rose* to 38.0%) with the "formalize, don't replace" trend narrative on screen. Supersedes the single 2021 cell. | Data | **OFFLINE** (public API) |
| **OT-MKT** | **Bottom-up market-sizing band** (TAM/SAM/SOM LOW/BASE/HIGH) = adults 24.6M × Findex prevalence 30.4–35.8% × avg loan size, every input sourced, assumptions stated. Retires the `M-8` hand-wave. | Data | **OFFLINE** (one input ⚪ illustrative → OT-LOANSIZE) |
| **OT-LOANSIZE** | **Average informal interpersonal loan size (SAR)** — the *one* unsourced model input; exists in no KSA/GCC publication (confirmed). Proxy band landed: **LOW ~1,000 / BASE ~5,000 / HIGH ~18,000** (GASTAT HIES "transfers paid" ~841/household/mo 🟢, Hakbah avg جمعية ~5,000 🟡, SDB official qard-hasan floor 18,000 🟢). Framing caveat: anchor to *per-event* proxies (Hakbah/SDB); household-flow proxies dilute per-event size — sanity-check only. Precise median = survey Q4. | Data | Proxy band **OFFLINE** (done); precise number = **survey gate (OT-A1)** |
| **OT-MOJ** | **Execution-court total financial-claims / promissory-note caseload** — behind the MoJ Power BI dashboard (`moj.gov.sa/ar/OpenData`) that would not render via fetch or browser automation. The primary enforcement-scale number. | Data | **HUMAN GATE** — working browser session or MoJ `/OpenData/Request` form |
| **OT-RATELIMIT** | **No rate-limiting anywhere in `server/`** (grep-verified) on `/create-loan`, `/seal`, `/verify` — the DoS row of the threat model. Deterministic token-bucket/fixed-window, Node built-ins. | Technical | **OFFLINE** |
| **OT-THREATMODEL** | **Written threat model** — STRIDE table (Repudiation + DoS marked UNMITIGATED honestly) + LINDDUN privacy rows (Linking via `nafath_sub` reuse; non-repudiation-as-privacy-harm). Closes the "no formal threat model" gap. | Technical | **OFFLINE** |
| **OT-BANKSIG** | **Real bank signature** — Ed25519 via Node built-in `crypto` (zero-dep), shipped as a W3C-VC-Data-Integrity-shaped `DataIntegrityProof`. Closes the Repudiation threat (today's `bank_sig`, even in the aspirational spec, is a SHA-256 *mock*). SEAL property 4 of OT-SEAL5. | Technical | **OFFLINE** crypto; production key custody = **HSM/KMS gate** |
| **OT-TSA** | **RFC-3161 trusted timestamp** — token stored as an external attestation, never hashed into logic (determinism kept). SEAL property 3 of OT-SEAL5. A live freeTSA.org call from `demo-bank-node.cjs` is a judge-visible moment (pre-fetch a fallback token). | Technical | **OFFLINE** demo-grade (freeTSA); evidentiary = **accredited TSA (emdha) gate** |
| **OT-DEPLOY** | **Deploy story** — Dockerfile (distroless `nodejs20 :nonroot`) + Node-`http` healthcheck + hardening checklist (read-only fs + tmpfs, secrets mounted) + honest "localhost-hardened, not yet cloud" README line; + over-the-wire CI parity (boot + `wait-on` + `curl`/`jq` black-box). | Technical | **OFFLINE** config/CI; real cloud + TLS = **post-hackathon gate** |

> **Annotations to existing items:** **D-4** — prior-art confirms ميراث الدَّين's novelty is the *productization* (no digital witness product operationalizes debt-at-death), not the fiqh (classical/settled); still HARD-gated (owner + scholar فرائض, minority view on deferred-debt auto-maturity). **OT-A1** — a runnable 13-question bilingual survey instrument + sampling frame + consent + analysis plan now exists (plan Appendix B); the gate is *fielding* it (named human, ~24h start for a directional pilot n≈80–150). **OT-SEAL5** — now split into offline parts (multi-block chain, Merkle inclusion, Ed25519 signature crypto) vs vendor-gated parts (accredited TSA, HSM key custody); see OT-BANKSIG/OT-TSA.

## Resolved (kept for traceability - do not re-open without new evidence)
- **OT-SOUL, OT-FSM, OT-CONSENT, OT-PCT, OT-RIBA, OT-STEP0, OT-X1, OT-X2, OT-X3** - closed 2026-06-19,
  see `_meta/archive/11-build-round/STATUS.md` (items B1-B8). OT-RIBA further deepened (not just closed) by
  `app/features/riba-lint.js` (0/60 adversarial-corpus misses in its own test corpus).
- **OT-RIBA-NOW** - resolved as permanent architecture, not a temporary demo-day call: the golden
  `ribaScan`'s negation false-positive is a permanent property of the frozen `demo/index.html` (golden
  functions are never modified - see `CLAUDE.md`); the real fix lives only in `app/`'s additive layer.
- **OT-M9** - closed: smartphone-penetration figure corrected 97%->99% during the evidence-brief pass
  (`docs/evidence/EVIDENCE-BRIEF.md`).
- **OT-01** (round split across two `10_Deep` trees) - addressed by this very consolidation effort
  (`docs/superpowers/specs/2026-07-01-meta-information-architecture-design.md`); `_meta/deep-work/ledger/
  00_LEDGER.md` remains the canonical cross-reference for that historical split.
- **OT-04** (two SEAL schemes coexist) - not a bug, by design; tracked via OT-PATCH above.
- **OT-12** (round-08 provenance mixed) - accepted resolution: `00_LEDGER.md` + the verification-ledger
  are canonical for that history; nothing further to do.
- **OT-15** (dossier overstated "built" features) - substance resolved: the features it referenced (state
  machine, consented Muqassa, computed trust) are now actually built and tested. Whether the dossier's own
  wording was ever updated to match hasn't been separately verified - low stakes since the underlying gap
  is closed either way.

## Links
`_meta/deep-work/ledger/open-threads.md` (original, full source rationale) · `docs/DECISIONS-FOR-MARWAN.md`
(decisions needing sign-off, distinct from open work items) · `_meta/deep-work/ledger/00_LEDGER.md`

## Roadmap-closure review (2026-07-14)

| ID | Item | Front | Status |
|---|---|---|---|
| **JL-13** | Prove the one-sentence innovation retell: an independent judge must restate “the bank witnesses, does not lend” and the distinguishing proof mechanism after the demo. | Innovation | open — conservative score 7.8 |
| **JL-14** | Collect and analyze real Saudi survey responses under the published privacy/preregistration rules. Until then OT-A1 is **SUPPORTED-DIRECTIONAL only**, not a result or closed demand evidence. | Data | open — conservative score 7.2. Survey v2 toolchain ready: 9/12 path, private linked Sheet, deterministic analyzer, and pretest checklist. Still open until real responses are collected and analyzed. |
| **JL-15** | Independent Arabic UX rehearsal with current screenshots and zero-console-error proof on the judge path. | UX | open — conservative score 7.8 |
| **JL-16** | Obtain external written validation where applicable: scholar, Saudi legal, SAMA/custody, Nafath, timestamp provider, and partner/pilot. | Feasibility | open — conservative score 7.3; no approval claimed |
| **JL-17** | Run a live, timed 3-minute rehearsal and capture whether the final proof/closing remains memorable after a judge has seen many projects. | Memorability | open — conservative score 7.6 |
