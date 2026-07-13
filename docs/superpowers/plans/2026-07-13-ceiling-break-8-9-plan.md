# Ceiling-Break Plan — Innovation · Data · Technical → 8 / 8.5 / 9

**Written:** 2026-07-13 (Claude-E, research-and-strategy session — opus orchestrator + 4 deep-research subagents).
**Scope:** research-grounded strategy ONLY. This session touched no code, ran no gate, and created only this plan
plus new items in `_meta/OPEN-ITEMS.md`. It **extends** `docs/superpowers/plans/2026-07-13-four-criteria-push.md`
beyond the 7.5–7.6 ceiling those levers reach, for three criteria: **Innovation · Data · Technical**.
**Concurrent build session** is on `judge-lens-real-leap`; everything here is a proposal for that session to build
and adversarially verify — **this plan scores nothing itself.**

## The mandate this plan obeys (owner, verbatim)
> لا تجامل، ولا ترفع، ولا تقعد تمدح — نبغى شي حقيقي، واقعي، صارم جداً.

No flattery, no score inflation, no praise-padding. Every lever below is real, feasible, and honestly caveated.
Where a lever needs a human (scholar, survey fielding, permission, vendor, budget), it is **flagged as gated**, never
pretended done. A proposed score target is a *target for the build session's refute-critics to verify*, not a self-grade
(the loop's iron rule: a delta counts only if ≥3 opus refute-critics cite file/screen evidence — `_meta/score-leap-loop-state.md`).

## Spine guard (non-negotiable — any lever violating it is dead on arrival)
Bank witnesses/seals/settles/nets — never lends, judges, scores, or charges on the loan. No riba/penalty/maysir/gharar.
Integer halalas, never float money. Trust signal stays a qualitative own-history band — never a number, never exported,
never underwrites. AI issues **no fatwa** — cite scholars/AAOIFI/verses, flag Shariah questions, never rule. Determinism
(no wall-clock/random/`Intl`/float in logic). `demo/index.html` + golden functions byte-frozen (tripwire `e2f48467…`).
Every mechanism below was prior-art-checked and spine-checked before it earned a place here.

## How the three criteria stand now (committed, opus-refute-verified — the honest floor)
| Criterion | Committed floor | The ceiling that stops 8 |
|---|---|---|
| **Innovation** | **7.6** | Open-Witness + "witness-not-lender" is *positioning + a portability feature*, not a demonstrated novel **mechanism** a tired judge retells. The pre-freeze panel refuted it: *"the panel restates, doesn't demonstrate."* |
| **Data** | **6.5** | One primary stat + 12 synthetic ÷3 fixture circles + no primary demand voice (OT-A1). The `M-8` market size is a hand-wave, not a modeled band. |
| **Technical** | **7.6** | SEAL is ~3/5 properties (OT-SEAL5: missing multi-block chain + RFC-3161 TSA + bank-signature + Merkle), no written threat model, no deploy story, no over-the-wire CI parity. Two *new* verified gaps: no rate-limiting; bank-repudiation unmitigated. |

**The reframe this plan adds:** each ceiling still has **offline levers underneath it the earlier loop under-exploited** —
a genuinely novel *mechanism* for Innovation (mercy-in-the-clearing), a real bottom-up *market model* + a decade of
directly-queried primary data for Data, and the *entire 5-property seal + threat-model + deploy + CI* for Technical, almost
all Node-built-ins-only. The genuinely human-gated residue (scholar, survey fielding, vendor TSA/HSM, SAMA sandbox, D-4)
is named per-lever, not hidden.

---

## 1 · INNOVATION 7.6 → 8 / 8.5 / 9

### 1.1 Why it is stuck at 7.6
The prior-art check (Appendix A) is unambiguous: **none of Ahd's three primitives is novel in isolation.** A bank that
doesn't lend exists (narrow banking). Portable, issuer-independent cryptographic attestation is exactly what W3C Verifiable
Credentials, OpenAttestation/TradeTrust, and C2PA already deliver — and eNote/MERS already digitizes *debt* instruments.
Multilateral obligation netting is ancient (hawala) and a mature research field (Fleischman/Dini/Littera 2020; Byppay 2026;
Ripple; Trustlines; Splitwise for the interpersonal case). So the current Innovation score rests on *synthesis + framing*,
which a judge correctly hears as "well-positioned," not "I haven't seen this before." **The leap requires a demonstrated
mechanism that is defensibly un-precedented.** The prior-art sweep found exactly two such twists, plus one high-wow gated one.

### 1.2 Ranked ceiling-breaker levers

**I-L1 — رِفْق: mercy-first clearing** *(the strongest leap-per-riyal; OFFLINE; on-stage-demonstrable)*
Turn "mercy-by-design" from a slogan into a named, verifiable **mechanism**: a debtor who self-declares hardship (مُعسِر),
co-witnessed by the creditor, is **excluded from forced set-off** and their obligations deferred/re-prioritized in the
netting — the grace written into the seal as a first-class event. Netting optimizes liquidity **subject to a
debtor-protection constraint**, not despite it.
- **Why it's novel (evidence):** every netting system in the literature — Fleischman/Dini/Littera (25%/50% debt reduction on
  Sardex data), Byppay (path-based, 53.9% relief), Splitwise "Simplify Debts," Ripple rippling, Trustlines — optimizes
  *purely for liquidity/transaction-count.* **None encodes debtor-in-hardship protection as an algorithmic constraint.**
  That is clean whitespace (Appendix A, Lane 3+4).
- **Fiqh grounding (cite, don't rule):** Qur'an 2:280 (فَنَظِرَةٌ إِلَىٰ مَيْسَرَةٍ); AAOIFI Shariah Standard No. 19 (no
  penalty on default, waiver permitted) 🟢; classical مقاصّة (muqāṣṣa / set-off) conditions *support* it — a not-yet-due or
  hardship-deferred debt cannot be forcibly offset, so mercy is fiqh-*consistent*, not a bolt-on.
- **On-spine proof:** no riba/penalty (grace only), no maysir/gharar, integer money untouched, deterministic, **no scoring**
  (hardship is *declared + witnessed*, never inferred), bank still only witnesses/settles. **Must WRAP, never modify** the
  golden `sealBlock`/netting/tiebreak (spine rule 1) — a constraint layer *around* the frozen core.
- **On-stage moment:** a hardship flag flips and the netting *visibly spares* that debtor while still compressing the rest —
  a memorable, screenshot-able demonstration of the mercy the whole product is named for. Feeds Memorability, not just Innovation.
- **Target:** Innovation → **8** (build session verifies). Build cost **S–M**.
- **Gate:** LIGHT scholar confirm — do the muqāṣṣa conditions require creditor consent to defer one node's debt? Direction is
  squarely on-spine; log the question to `docs/DECISIONS-FOR-MARWAN.md`, build the *declared+consented* variant now.

**I-L2 — Open-Witness as a published open STANDARD** *(near-free positioning leap; OFFLINE)*
Elevate I1 from an app feature to a versioned, openly-licensed **spec that other banks can adopt**, so a debt sealed by
Bank A verifies at Bank B without either trusting the other. Every credible "verify-without-the-issuer" system ships the
same five artifacts (data model, canonicalization, hash/signature scheme, public reference verifier, open test vectors);
**Ahd already has four on disk** (`docs/specs/open-witness-v1.md`, `protocol/verify-ahd-seal.cjs`, `protocol/fixtures/*.json`).
The missing fifth move is *versioning + an open license + a multi-issuer interop demo.*
- **Why it's credible (evidence):** the pattern is proven — W3C VC 2.0 (W3C Recommendation, 2025), OpenAttestation/TradeTrust
  (GovTech Singapore, open-sourced, covers transferable debt-like records), C2PA/Content Credentials (CISA-recommended 2025).
- **The differentiators to claim (and only these):** *purpose-built for the interpersonal benevolent-debt (qard) receipt* and
  **chain-free / registry-free** — verifiable offline with a hash function alone, **no blockchain** (unlike OpenAttestation)
  and **no central registry** (unlike eNote/MERS). Do **not** claim "first verifiable-without-issuer attestation" — VC/OA/C2PA
  own that; Ahd owns *"first registry-free, chain-free open seal for interpersonal benevolent debt."*
- **The deck line (ready to use):** *"Open-Witness is to a qard receipt what C2PA is to a photograph and Verifiable Credentials
  are to a diploma — an open, adopt-anywhere standard for proving a promise, minus the blockchain and minus the registry."*
  The foil: *"eNotes made debt digital but kept the registry; Open-Witness removes the registry."*
- **Target:** Innovation → **8** (compounds with I-L1). Build cost **S** (spec polish + license) + **M** (interop demo).
- **Gate:** LIGHT — owner decision on open-licensing + any "invite other banks / SAMA" governance framing
  (`docs/DECISIONS-FOR-MARWAN.md`). The spec/verifier/vectors themselves are offline and shipped.

**I-L3 — ميراث الدَّين: debt-at-death handling** *(highest wow, HARD-gated; roadmap not sprint — this is D-4)*
On a witnessed death event, sealed debts of the deceased are flagged and routed to **estate (تركة) settlement before
distribution**; heirs are offered one-tap **voluntary** إبراء (waive) or قضاء (pay), recorded as إحسان; the creditor may waive.
- **Honest novelty read:** the *fiqh is classical and settled* (debt paid from estate before distribution; deferred debt
  matures at death per jumhūr; heirs not liable beyond the estate unless they volunteer — IslamWeb 397480 🟡). The novelty is
  that **no digital witness product operationalizes debt-at-death** — not the ruling, the *productization.*
- **On-spine proof:** bank still only witnesses/records/settles; it *routes*, does not adjudicate the estate; no lending,
  charge, or scoring; waiver is creditor-elective.
- **Target:** Innovation → **8.5 / 9** *if* landed live (memorable, deeply Islamic, unseen in fintech). Build cost **M**.
- **Gate:** **HARD** — touches فرائض (inheritance law) + KSA probate + a minority-view fiqh point (does a deferred qard
  *auto-mature* at death? forcing maturity can harm heirs). **Do not ship "auto-mature on death" without a scholar ruling.**
  This is decision **D-4** (owner) + scholar. Prep the proposal spec now (build-ready, not wired into the app); build on D-4.

**I-L4 — third-party voluntary قضاء** *(light, fully on-spine add; OFFLINE)*
A friend may volunteer to settle another's *sealed* debt, recorded as إحسان — no bank money, no obligation, no pooling, so
no spine risk. A small, warm, memorable addition that pairs naturally with I-L1/I-L3. **Avoid any bank-organized pooled
backstop** — that drifts toward lending/pooling and trips the spine. Build cost **S**. Gate: none.

### 1.3 Offline-now vs human-gated
| Lever | Offline-buildable now | Human gate (named) |
|---|---|---|
| I-L1 رِفْق mercy-clearing | ✅ constraint layer around golden netting | LIGHT — scholar confirm muqāṣṣa consent condition |
| I-L2 Open-Witness standard | ✅ spec + verifier + vectors exist; add version/license/interop | LIGHT — owner licensing/governance decision |
| I-L3 ميراث الدَّين | ⚠️ proposal spec only (build-ready) | **HARD — D-4 owner + scholar (فرائض)** |
| I-L4 third-party قضاء | ✅ | none |

### 1.4 Score path
**8** = I-L1 + I-L2 built and live (both offline). **8.5** = add I-L3 with D-4 + scholar sign-off. **9** = all three live
*and* the Open-Witness standard demonstrated verifying across two independent issuers (interop), so the judge sees a *protocol,
not an app.*

---

## 2 · DATA 6.5 → 8 / 8.5 / 9

### 2.1 Why it is stuck at 6.5
The honesty labeling is good, but the *evidence itself* is thin: one primary stat foregrounded, 12 reverse-engineered fixture
circles behind the headline compression ratio, and no primary Saudi demand voice (OT-A1 / D-9, graded the single most
dangerous attack in the red-team). The market size (`M-8`) is an order-of-magnitude frame, not a defensible model. The judge
bar (JUDGE-LENS criterion 3) wants *a real dataset + an insight narrative on screen* — aggregates only, never an individual's
number. The research pass turned the base from thin to genuinely strong; the survey remains the one true human gate.

### 2.2 Ranked ceiling-breaker levers

**D-L1 — the full Findex decade series, directly queried** *(OFFLINE; the biggest rigor jump)*
The World Bank API (`api.worldbank.org/.../SAU/indicator/...?source=28`) returns the **complete 2011–2024 time series** 🟢,
including the fresh 2025-wave (2024 fieldwork) figures — not just the single 2021 stat currently shown. Family/friend
borrowing: 37.3% (2014) → 33.5% (2017) → 35.8% (2021) → **30.4% (2024)**; account ownership 74.3% → 78.8%; **emergency-fund
reliance on family/friends *rose* 33.3% → 38.0%** (2021→2024). Put the *trend* on screen with the honest narrative:
**informal interpersonal lending is not disappearing — it is persisting alongside formalization (still ~1-in-3 adults every
year), and the family/friend safety-net is growing.** That is exactly Ahd's thesis — *formalize it, don't replace it with
interest-bearing credit* — and a decade of directly-queried primary data is a materially different rigor class than one cell.
- **Target:** Data → **7.2**. Gate: none (already public; integrate into `EVIDENCE-BRIEF.md` + the impact surface).

**D-L2 — a real bottom-up market-sizing model (a band, not a point)** *(OFFLINE; retires the M-8 hand-wave)*
Model = Adults(15+ ≈ **24.6M**, from GASTAT 2022 census 32.18M × adult share) × prevalence (**30.4–35.8%**, the actual observed
Findex range as LOW/HIGH bookends — not an invented range) × average loan size. TAM/SAM/SOM as a **LOW/BASE/HIGH band** with
every input sourced and every assumption stated (Appendix B). This replaces "SAR-hundreds-of-billions, trust us" with a
defensible, judge-interrogable model — and it *foregrounds its own single weak input* rather than hiding it.
- **The one input with no direct source — now proxy-anchored, not guessed:** average informal loan size is unsourced in any
  KSA/GCC publication (confirmed a real, field-wide gap). The proxy hunt (OT-LOANSIZE) anchored a band to real stand-ins:
  **LOW ~SAR 1,000 / BASE ~SAR 5,000 / HIGH ~SAR 18,000** (Hakbah جمعية contribution + GASTAT HIES "transfers paid" 🟢;
  Hakbah average-user figure 🟡; SDB official qard-hasan floor 🟢 — Appendix B). *A proxy-anchored band beats both a guess and
  false precision*; a measured median still needs survey Q4 (D-L5).
- **Target:** Data → **7.5**. Gate: none for the model; the *precise* loan-size number is survey-gated (D-L5).

**D-L3 — ground the fixtures + sensitivity band** *(OFFLINE; = D1+D3 of the four-criteria push, now sourced)*
Re-derive the 12 fixture circles from the **GASTAT 2023 HIES** income/household distribution (avg Saudi household disposable
income SAR 18,056/mo; 8.17M households) 🟢 so they read as "modeled on real distributions," and replace the single ÷3 with a
deterministic p10–p90 compression band (label «نطاق توضيحيّ حتميّ»). Zero fabricated precision; every number cited or band-labeled.
- **Target:** hardens Data toward **7.5–8**. Gate: none.

**D-L4 — Nafith growth as a witnessed-debt demand proxy** *(OFFLINE; on-screen)*
Digital promissory notes (سند لأمر) on the MoJ Nafith platform grew **160k (2020) → 526k (2021) → 5.5M (2024)** — ~34× in four
years 🟡 (news-of-official; primary MoJ dashboard is behind a Power BI wall — see OT-MOJ). This is the closest official proxy
for "Saudis want a neutral party to witness debt," and its *slope* is the story. State the caveat honestly: Nafith covers
commercial + interpersonal notes, and only counts (not SAR value or the P2P share) are public.
- **Target:** contributes to Data → **8**. Gate: none to *cite*; the P2P-share breakdown is MoJ-gated (OT-MOJ).

**D-L5 — the primary demand survey** *(HUMAN-GATED — the fielding; the instrument is designed)*
The runnable instrument now exists (Appendix B): 13 substantive bilingual questions (incidence, amount, repayment friction,
the write-it-down awkwardness barrier for 2:282, willingness to use a neutral witness, grace-period value for 2:280, the
qualitative trust-band test), a sampling frame, consent/ethics-lite, and an analysis plan mapping each question to what it
proves. **Q4 fills the exact avg-loan-size gap D-L2 flags.**
- **Honest timeline caveat:** judging is 2026-07-18 — 5 days out. A from-scratch n≥150 survey must start fielding within ~24h
  to leave time for analysis, and will realistically yield **n≈80–150 convenience/quota** sample, **not** a probability
  sample. Report the *achieved* n and its real margin of error; label it *directional pilot evidence*, never a definitive
  market study. One real Saudi voice still beats every US proxy.
- **Target:** Data → **8.5 / 9** (a real primary demand signal is the one thing re-sourcing scale cannot substitute).
- **Gate:** **HUMAN** — a named person must own translation QA, distribution, and same-day tabulation. This is OT-A1.

### 2.3 Offline-now vs human-gated
| Lever | Offline-buildable now | Human gate (named) |
|---|---|---|
| D-L1 Findex decade series + 2024 figure | ✅ direct WB API, public | none |
| D-L2 bottom-up market band | ✅ (one input ⚪ illustrative until D-L5) | precise loan-size = survey |
| D-L3 grounded fixtures + sensitivity band | ✅ GASTAT-anchored | none |
| D-L4 Nafith growth proxy | ✅ cite counts | P2P-share = MoJ dashboard (OT-MOJ) |
| D-L5 primary demand survey | ⚠️ instrument designed | **HUMAN — field it (OT-A1); named owner + 24h start** |

### 2.4 Score path
**8** = D-L1 + D-L2 + D-L3 + D-L4 all built and on screen (all offline: decade of primary data + a real sourced model band +
grounded fixtures + the demand-slope proxy). **8.5** = a fielded pilot survey (n≥150) replacing the illustrative loan-size input
with a measured median and adding one real Saudi demand voice. **9** = survey + the MoJ execution-court primary caseload
unlocked (OT-MOJ), giving a fully primary-sourced demand *and* enforcement-scale picture.

---

## 3 · TECHNICAL 7.6 → 8 / 8.5 / 9

### 3.1 Why it is stuck at 7.6
The seal is ~3/5 properties (OT-SEAL5). The `protocol/verify-ahd-seal.cjs` verifier proves only content-hash integrity + a
naive chain-continuity check. There is no written threat model, no deploy story, and CI proves the *pure router*, not
over-the-wire HTTP. The research surfaced two **new, verified** gaps beyond OT-SEAL5: **(a)** grep of `server/` found **no
rate-limiting anywhere** on mutating routes; **(b)** **bank-repudiation is unmitigated** — there is no real asymmetric bank
signature (even the aspirational `_meta/deep-work/backend/seal-scheme-spec.md` `bank_sig` is a SHA-256 *mock*, not a private-key
signature). Good news: nearly the entire path to 8 is Node-built-ins-only and offline.

### 3.2 Ranked ceiling-breaker levers

**T-L1 — complete the 5-property SEAL** *(the headline lever; splits cleanly into offline + gated parts — Appendix C)*
| Property | Construction | Offline-now? | Gate |
|---|---|---|---|
| 1. SHA-256 canonical hash | shipped | ✅ done | — |
| 2. Multi-block chain | `seal=SHA256(prev+canonical_hash+seq)`, `prev`=prior block's seal; formula already in the spec, needs a **real 2nd/3rd-block golden vector** pinned | ✅ | — |
| 3. RFC-3161 TSA | timestamp `canonical_hash` via a TSA; token stored as an **external attestation, never hashed into logic** (determinism kept) | ✅ **demo-grade** (freeTSA.org — no account, one HTTPS call) | evidentiary weight = **accredited TSA (emdha)**, contract |
| 4. Bank signature | real Ed25519 via Node built-in `crypto` (zero-dep); ship as a W3C-VC-Data-Integrity-shaped `DataIntegrityProof` `{cryptosuite, verificationMethod, proofValue}` — closes the Repudiation threat | ✅ **crypto is offline** | production **key custody = HSM/KMS** |
| 5. Merkle inclusion | RFC-6962 recursion (`SHA256(0x00‖leaf)`, `SHA256(0x01‖l‖r)`) **implemented directly** — *not* `merkletreejs` default (documented second-preimage footgun on unbalanced trees); publish + sign the root, hand out per-leaf audit paths | ✅ | — |
- **Assembled proof a verifier receives:** `{record, canonical_hash, chain{prev,seq}, tsa_token, bank_proof{cryptosuite,
  verificationMethod, proofValue}, merkle{leaf_index, audit_path, tree_size, signed_root}}`. **Independent verification order:**
  integrity → chain continuity → TSA → bank signature → Merkle inclusion; the first failing step tells you *what kind* of
  tampering occurred (content edit vs reorder/replay vs rewritten log) — a real improvement over today's single-property check.
- **Target:** Technical → **8** (the offline four of five properties + a live TSA moment). Build cost **M**.

**T-L2 — written threat model (STRIDE + LINDDUN)** *(OFFLINE; closes the "no formal threat model" gap)*
A STRIDE table for the witness-seal service (Appendix C) that honestly marks status: Tampering **mitigated today** (tamper
vectors caught); Elevation-of-Privilege **mitigated** (401 on unauth mutating route, live in `demo-bank-node.cjs`); **Repudiation
UNMITIGATED** (no real bank sig — closed by T-L1 prop 4); **DoS UNMITIGATED** (no rate-limiting — closed by T-L5). Add LINDDUN
privacy rows: *Linking* (does `nafath_sub` reuse let an observer correlate a person's full borrow/lend graph — an open design
question) and *Non-repudiation-as-privacy-harm* (permanent proof cuts both ways; the retain-then-key-shred policy is the named
mitigation). Build cost **S**. Gate: none.

**T-L3 — deploy story** *(OFFLINE for the config; real cloud gated)*
A real `Dockerfile` (distroless `nodejs20 :nonroot`), a Node-`http` `HEALTHCHECK` (distroless has no shell/curl), a hardening
checklist (read-only root fs + tmpfs for the durable-log dir, secrets via mounted env not baked, TLS at a reverse proxy), and an
honest README line: *localhost-hardened, not yet cloud-deployed.* Build cost **S**. Gate: real cloud deploy + TLS cert =
post-hackathon (named, not faked).

**T-L4 — over-the-wire CI parity** *(OFFLINE; = T4 of the four-criteria push, sharpened)*
Boot the real server as a background CI step, `wait-on /list`, then assert with `curl`+`jq` **from outside any Node process** —
a true black-box HTTP check, distinct from `demo-bank-node.cjs` (which is real HTTP but orchestrated inside one Node script).
Meta-gate it like the tripwire. Build cost **S**. Gate: none.

**T-L5 — rate-limiting on mutating routes** *(OFFLINE; closes the new DoS gap)*
A deterministic token-bucket / fixed-window limiter (Node built-ins, no clock in the *hashed* logic) on `/create-loan`, `/seal`,
`/verify`. Build cost **S**. Gate: none.

**T-L6 — live freeTSA notarization moment** *(OFFLINE-ish; judge-visible)*
Add a real RFC-3161 call to `freetsa.org` inside the existing `server/demo-bank-node.cjs` terminal surface: *"an independent
global timestamp authority just notarized this hash, right now"* — zero cost, zero account, directly hits the Technical bar
("one live moment makes an engineer-judge nod"). **Pre-fetch a fallback token** for judging-day network flake. Build cost **S**.
Gate: none (network is the only risk; fallback covers it).

**T-L7 — regulatory-integration interface design** *(design OFFLINE; integration gated — overlaps Feasibility F2)*
Document the concrete integration seams: SAMA Regulatory Sandbox lifecycle (4 eligibility criteria → Application 60d →
Operational-Readiness 120d "LoA" → Testing 6–12mo → Exit; always-open intake since 2022); Nafath (identity, SDAIA) **+ a
CST-licensed TSP (emdha)** for AES/QES signing — Nafath alone is identity-only, signing needs the TSP; and **Nafith** (naming
correction — there is *no* "e-SANAD"; the real MoJ digital-promissory-note rail is Nafith, launched 19 Apr 2020) for
registering a sealed obligation as an enforceable instrument. Build cost **S** (doc). Gate: every *integration* is institutional
(SAMA admission, Nafath onboarding, emdha contract, MoJ integration) — design now, integrate post-hackathon.

### 3.3 Offline-now vs human/vendor-gated (the consolidated table)
| Lever | Offline-buildable now | Vendor / human gate (named) |
|---|---|---|
| T-L1 props 2 (chain) + 5 (Merkle) | ✅ | none |
| T-L1 prop 4 bank signature | ✅ Ed25519 crypto | production key custody = HSM/KMS |
| T-L1 prop 3 RFC-3161 TSA | ✅ demo-grade (freeTSA) | evidentiary = accredited TSA (emdha) |
| T-L2 threat model | ✅ | none |
| T-L3 deploy config | ✅ Dockerfile/healthcheck/hardening | real cloud + TLS cert |
| T-L4 CI wire-parity | ✅ | none |
| T-L5 rate-limiting | ✅ | none |
| T-L6 live freeTSA moment | ✅ (network) | none (fallback token) |
| T-L7 regulatory interface | ✅ design | SAMA sandbox / Nafath / emdha / Nafith integration |

### 3.4 Score path
**8** = T-L1 (props 2,4,5 offline + prop-3 freeTSA demo-grade) + T-L2 + T-L3 config + T-L4 + T-L5 + T-L6, all offline. **8.5** =
real cloud deploy + a real bank-key in an HSM + a live accredited-TSA (emdha) timestamp. **9** = emdha AES/QES bank signatures +
SAMA sandbox admission + a Nafith registration integration — a genuinely production, independently-auditable, regulator-facing
system (all institutional gates, honestly post-hackathon).

---

## 4 · Cross-cutting

**One on-stage moment per criterion (memorability compounding).** Innovation: a hardship flag flips and the netting *visibly
spares* that debtor (رِفْق, I-L1). Technical: the judge tampers a sealed record and the seal catches it, *then* freeTSA
notarizes the real hash live (T-L6). Data: the Findex decade trend + the sourced market band on one screen with the
"formalize, don't replace" line (D-L1/D-L2). Each is a *demonstration*, which is what moved these criteria from "well-argued"
to "unforgettable."

**Sequencing (extends the four-criteria-push execution order).** The build session's order is sound; insert the new offline
levers where they compound: **I-L1 (mercy-clearing)** early — it's the single biggest Innovation mover and doubles as a
memorability beat; **T-L1 props 4+5 + T-L2 + T-L5** as one "harden the seal + close the two new gaps" block; **D-L1→D-L4** as
one "data rigor" block; **T-L6 freeTSA** last (cheap, high-visibility). Gated items (I-L3, D-L5, T-L7 integrations) are prepped
as build-ready specs now and executed the moment their human unblocks.

**Consolidated human-gate register (surfaced, not faked).**
| Gate | Unlocks | Owner / action | By |
|---|---|---|---|
| **D-4** pick ميراث الدَّين | Innovation → 8.5/9 (I-L3) | Owner + scholar (فرائض) | pre-freeze |
| Scholar — muqāṣṣa consent condition | Innovation I-L1 clean confirm | Scholar | pre-freeze |
| Scholar — Hilah + D-1/D-3/D-7 | Feasibility → 8 (separate criterion) | Scholar | pre-freeze |
| **Survey fielding** (OT-A1) | Data → 8.5/9 (D-L5) | Named team member, 24h start | 15 Jul |
| emdha TSA/AES contract | Technical → 8.5/9 (real TSA + AES) | Owner/BD + vendor | post-hackathon |
| Bank-key HSM/KMS | Technical → 8.5 (real custody) | Infra | post-hackathon |
| SAMA sandbox admission | Technical/Feasibility → 9 | Owner/legal | post-hackathon |
| MoJ Power BI / open-data request | Data → 9 (execution-court caseload) | Team member (browser or `/OpenData/Request`) | opportunistic |
| Open-Witness open-license + governance | Innovation I-L2 "standard" framing | Owner | pre-freeze |

---

## Appendix A · Innovation — prior-art & fiqh sources
Grades: 🟢 primary/authoritative · 🟡 secondary/inferred.

**Qard-hasan / interest-free platforms** — Qarz al-Hasaneh Mehr Iran Bank (*lends* from pooled deposits) [en.wikipedia.org/wiki/Qarz_Al-Hasaneh_Mehr_Iran_Bank] 🟡 · Kiva (P2P, platform intermediates money) [kiva.org/about/how] 🟢 · Qardus UK ("Islamic P2P" but charges arrangement fee + profit rate — not pure qard) [fintechfutures.com] 2021 🟡 · Blossom/Ammana Indonesia (profit-sharing mudarabah, OJK-licensed) [blossomfinance.com] 🟡 · QardHasana.com (donation/gift portal, no seal/netting) 🟡.
**ROSCA / جمعية** — **Hakbah (Saudi, nearest neighbor: 2M+ users, SAMA sandbox, ~$6bn KSA ROSCA market)** [menabytes.com; semafor.com 2026] 🟢 · MoneyFellows (Egypt, 8.5M users — **uses credit scores to match**, which Ahd forbids) [techcrunch.com, May 2025] 🟢.
**Multilateral netting / obligation clearing** — Hawala (centuries-old obligation netting) 🟡 · **Fleischman, Dini & Littera, "Liquidity-Saving through Obligation-Clearing and Mutual Credit," MDPI JRFM 13(12):295, 2020** (~25% clearing / ~50% +mutual-credit debt reduction on Sardex data) [mdpi.com/1911-8074/13/12/295] 🟢 · **de la Rosa & Madugula, "Byppay," arXiv 2606.26126, 2026** (path-based 53.9% vs cycle-only 21.0% relief; *no* grace/hardship provision) 🟢 · Splitwise "Simplify Debts" (interpersonal, NP-hard, greedy/max-flow) [blog.splitwise.com, 2012] 🟢 · Ripple/XRPL rippling [xrpl.org/docs/concepts/tokens/fungible-tokens/rippling] 🟢 · Sardex/WIR mutual credit (*grants* credit lines) [eprints.lse.ac.uk/67135] 🟡 · Trustlines Network / Circles (interpersonal bilateral IOUs with set-off — closest to Ahd's netting; blockchain money-as-debt, no mercy layer) [trustlines-network.github.io/faq.html] 🟢. **Across the field's leading work, none encodes debtor-in-hardship protection as a clearing constraint — the whitespace I-L1 occupies.**
**Portable issuer-independent attestation** — eNote + MERS eRegistry (*requires* trusting a central registry — the foil) [snapdocs.com/what-is-an-enote; ice.com MERS brochure] 🟡 · **W3C Verifiable Credentials 2.0** (W3C Rec, 2025) [w3.org/press-releases/2025/verifiable-credentials-2-0] 🟢 · **OpenAttestation/TradeTrust** (GovTech Singapore, open-sourced, transferable records; anchors on a public blockchain) [openattestation.com; oecd-opsi.org] 🟢 · **C2PA/Content Credentials** (open, tamper-evident, CISA-recommended 2025) [c2pa.org; spec.c2pa.org] 🟢.
**Anchors** — Narrow banking (a bank need not lend) [en.wikipedia.org/wiki/Narrow_banking] 🟡 · **AAOIFI Shariah Standard No. 19 — Qard** (no penalty on default; waiver permitted; only actual-cost service fee) [aaoifi.com/ss-19-loan-qard/?lang=en] 🟢 · Islamic inheritance-of-debt fiqh (estate settles debt before distribution; deferred debt matures at death per jumhūr; heirs not liable beyond estate; creditor may waive) [islamweb.net/ar/fatwa/397480] 🟡 · Qur'an 2:282 (write/witness the debt), 2:280 (respite for the insolvent).

## Appendix B · Data — primary sources, market model, survey

**Findex time series, Saudi Arabia (direct World Bank API, `source=28`, lastupdated 2025-10-06)** 🟢 — [worldbank.org/en/publication/globalfindex]:
| Metric (age 15+) | 2014 | 2017 | 2021 | 2024 |
|---|---|---|---|---|
| Account ownership | 69.4% | 71.7% | 74.3% | 78.8% |
| Borrowed any money | 56.5% | 54.3% | 59.7% | 55.7% |
| Borrowed from a formal institution | 17.4% | 21.1% | 32.4% | 30.1% |
| **Borrowed from family or friends** | 37.3% | 33.5% | **35.8%** | **30.4%** |
| Emergency-fund main source = family/friends | — | — | 33.3% | **38.0%** |
| Saved any money | 45.4% | 44.2% | 63.0% | 57.1% |
*(2024 = the 2025 Findex wave; KSA fieldwork ~23 Jun–22 Jul 2024, 1,018 telephone interviews, ±3.4%. 2021: 1,019, 5–20 Sep 2021.)*

**GASTAT** 🟢 — 2022 Census: population **32,175,224** (Saudi 18.8M / 58.4%), **8,174,674 households**, Saudi households ~4.2M @ 4.8 persons [spa.gov.sa/w1911463]. HIES 2023 (sample 122,325 households) [stats.gov.sa HIES-2023 PDF]: avg household disposable income/mo **SAR 11,839** (Saudi 18,056 / non-Saudi 5,428); avg consumption expenditure/mo **SAR 10,884**; per-capita income/mo SAR 3,195. *HIES captures a "lending/gifts/transfers" COICOP category but publishes no isolated informal-P2P-lending incidence or amount — the survey's reason to exist.*

**SAMA** — consumer bank loans **SAR 479.8bn** (Q1 2025, +6.4% YoY) [sama.gov.sa Key Economic Developments Q1 2025] 🟢 · household debt **12.3% of GDP (~$134bn)**, Dec 2024 [SAMA via ceicdata.com] 🟡 · BNPL installment value **SAR 24.8bn (+164%)**, GMV 36.6bn, ~42% consumer usage, 2024 [Fintech Saudi/SAMA Annual Fintech Report, ~Sep 2025] 🟡 (42% likely market-research-origin — treat with caution) · 62 finance companies (end-2024) 🟡 · SAR/USD peg 3.75 (fixed 1986) 🟢.

**Nafith (نافذ) digital promissory notes, MoJ** 🟡 (news-of-official; MoJ primary dashboard blocked) — >160k by Dec 2020 (launched 19 Apr 2020) [alqiyady.com] · >526k / ~242k users ~2021 [alqiyady.com] · 700k in Q1 2022 alone [saudigazette.com.sa/article/621652] · **>5.5M in 2024**, 4,100+ companies / ~760k individuals [alyaum.com/articles/6578917, 12 Feb 2025]. ~34× growth 2020→2024. *Counts only — no SAR value, no P2P share (OT-MOJ).*

**Market-sizing model (bottom-up; band, not point).** Adults 15+ ≈ **24.6M** (32.18M × 76.6% adult share) × prevalence (30.4–35.8% Findex range) × avg loan size:
| | LOW | BASE | HIGH |
|---|---|---|---|
| Borrowers/year | 7.48M (30.4%) | 8.14M (33.1%) | 8.81M (35.8%) |
| Avg loan size — **proxy-anchored** (OT-LOANSIZE; no direct source exists) | SAR 1,000 🟡 | SAR 5,000 🟡 | SAR 18,000 🟢 |
| **TAM (annual witnessed-addressable)** | **SAR 7.5bn** (~$2.0bn) | **SAR 40.7bn** (~$10.9bn) | **SAR 158.6bn** (~$42.3bn) |
| × banked 78.8% → **SAM** | SAR 5.9bn | SAR 32.1bn | SAR 125.0bn |
| × capture 0.5/1.5/4% ⚪ (founder judgment) → **SOM** | SAR 29M | SAR 481M | SAR 5.0bn |
Stated assumptions: Findex prevalence is already "past 12 months" so no frequency multiplier is stacked (conservative); banked×informal independence is flagged, not resolved; capture rate is judgment, not data; a household-based parallel model was *not* built (unit-mixing would create false precision).
**Avg loan size (the one input with no direct source) is proxy-anchored, not guessed:** LOW ~SAR 1,000 (Hakbah min جمعية contribution ~300/mo + GASTAT HIES 2023 "transfers paid" ~SAR 841/household/mo 🟢 + Hisab al-Muwatin min 400/mo); BASE ~SAR 5,000 (Hakbah self-reported average-user figure 🟡 — the closest KSA cultural analog, a جمعية "hand" *is* a rotating interpersonal loan); HIGH ~SAR 18,000 (Saudi Social Development Bank official qard-hasan floor, recurring across marriage/family/Kanaf products 🟢 — a graduation point above which a formal interest-free channel exists). **Critical framing caveat:** the model needs "average size of one loan *conditional on a loan happening*" → anchor to the *per-event* proxies (Hakbah, SDB); the *household-flow* proxies (GASTAT transfers-paid, Hisab al-Muwatin) are averaged across all households/months (most lend nothing that month) and therefore *dilute* per-event size — use them only as low-end sanity checks, never as the primary estimate. Conflating the two framings (as the original SAR 2,000/6,000/20,000 placeholder silently risked) is the biggest mis-sizing risk. A measured median still requires survey Q4 (OT-A1). Loan-size proxy sources: [SDB Marriage/Kanaf financing 🟢](https://www.sdb.gov.sa/en/individual-financing/marriage-financing) · [GASTAT HIES 2023 PDF 🟢](https://www.stats.gov.sa/documents/20117/2067012/Household+Income+and+Consumption+Expenditure+Survey+Publication+2023+AR.pdf) · [Hakbah جمعية range 🟡](https://millieme.info/2025/05/30/) · [Ehsan avg donation ~SAR 33 🟢 (floor check)](https://www.arabnews.com/node/2633251/saudi-arabia).

**Survey instrument (designed, unrun — OT-A1).** n≥150 target (±8.0pp at 50% proportion; stretch n=384 → ±5.0pp), quota-stratified by nationality/region/income (convenience, *not* probability — stated as a limitation). 13 substantive bilingual (AR/EN) questions: S1 screen; Q1 lend-incidence; Q2 borrow-incidence (mirrors Findex fin22b for cross-validation); Q3 frequency; **Q4 amount-band (fills the loan-size gap)**; Q5 purpose; Q6 repayment friction; Q7 documentation gap (2:282); Q8 write-it-down awkwardness (1–5); **Q9 core demand — willingness to use a free neutral bank witness (1–5)**; Q10 grace-period value (2:280, 1–5); Q11 channel; Q12 trust-band-not-a-score willingness test; Q13 open-text worry; + 6 demographics. Consent/ethics-lite screen (voluntary, skippable, anonymized aggregate-only, no national-ID/account/full-name, contact for complaints). **Honest gate:** 5-day clock → directional pilot n≈80–150; a named human must own translation QA + distribution + same-day tabulation; report achieved n and real margin, never round up to target.

**Unresolved data gaps:** (1) avg informal loan size — nowhere in KSA/GCC published data (OT-LOANSIZE + survey Q4); (2) MoJ execution-court total financial-claims caseload — behind a Power BI dashboard that would not render even via browser automation (OT-MOJ); (3) an IMF "~11% formal borrowing 2017" figure contradicts the direct Findex pull (21.1%) — prefer the directly-queried number.

## Appendix C · Technical — standards & production sources
**Seal properties** — RFC 3161 Time-Stamp Protocol [datatracker.ietf.org/doc/html/rfc3161] 🟢; free/no-account TSAs freetsa.org, timestamp.digicert.com, timestamp.sectigo.com 🟡; pure-JS `pdf-rfc3161` [github.com/mingulov/pdf-rfc3161] · RFC 5816 (ESSCertIDv2, SHA-256 signer-cert) 🟢 · **RFC 6962 Certificate Transparency** (Merkle `MTH`: `SHA256(0x00‖leaf)`, `SHA256(0x01‖l‖r)`; inclusion/consistency proofs) [rfc-editor.org/rfc/rfc6962.html] 🟢 · RFC 8785 JSON Canonicalization [rfc-editor.org/rfc/rfc8785] 🟢 · Sigstore Rekor / Trillian (pattern; Trillian now maintenance → Tessera) [docs.sigstore.dev/logging/overview] 🟡 · sigsum (minimalist witness-cosigned log) [git.sigsum.org] 🟡 · merkletreejs (**default config second-preimage footgun — do not adopt as-is**) [github.com/miguelmota/merkletreejs] 🟡 · @openzeppelin/merkle-tree (double-hash leaf domain-separation idea; Keccak/ABI heritage, wrong hash for JSON) 🟡.
**Signature envelope** — **C2PA 2.4** (portable signed manifest: Assertions→Claim→Claim-Signature, COSE/X.509) [spec.c2pa.org/.../2.4] 🟢 · **W3C VC Data Integrity 1.1** + `eddsa-jcs-2022`/`ecdsa-jcs-2019` (signs over RFC-8785 JCS bytes — closest existing standard to Open-Witness; the shape to adopt for the bank signature) [w3c.github.io/vc-data-integrity] 🟢 · Node.js built-in `crypto` Ed25519/ECDSA (real asymmetric sign/verify, zero-dep) [nodejs.org/api/crypto.html] 🟢.
**Deploy / CI / threat-model** — distroless `nodejs20-debian12 :nonroot` [github.com/GoogleContainerTools/distroless] 🟡 · distroless Node healthcheck pattern [mattknight.io/blog/docker-healthchecks-in-distroless-node-js] 🟡 · GitHub Actions boot-and-poll integration pattern [freecodecamp.org/news/how-to-run-integration-tests-with-github-service-containers] 🟡 · STRIDE [en.wikipedia.org/wiki/STRIDE_model] 🟡 · LINDDUN privacy threat modeling (KU Leuven) [linddun.org] 🟢.
**Regulatory** — **SAMA Regulatory Sandbox** (4 eligibility criteria; Application 60d → Operational-Readiness 120d "LoA" → Testing 6–12mo → Exit; always-open since 2022) [rulebook.sama.gov.sa/en/regulatory-sandbox-lifecycle] 🟢 · Nafath (identity, SDAIA) **+ emdha** (CST-licensed/DGA-regulated/WebTrust TSP for AES/QES; markets a Timestamp Service but does **not** explicitly cite RFC-3161 — confirm before relying) [emdha.sa/digital-signature; cloudsignatureconsortium.org/member/emdha-trust-service-provider-tsp] 🟡 · **Nafith** (naming correction — there is *no* "e-SANAD"; the real MoJ digital-promissory-note rail is Nafith, launched 19 Apr 2020) [tamimi.com/law-update-articles/the-nafith-platform-and-digital-promissory-notes-in-ksa] 🟡 · Saudi Evidence Law RD M/43 (digital record admissible when integrity is demonstrable; burden on the contesting party) [lexology.com] 🟡.
**In-repo grounding** — `docs/specs/open-witness-v1.md` (shipped v1 canonical/chain), `protocol/verify-ahd-seal.cjs` (standalone verifier, 1 property today), `_meta/deep-work/backend/seal-scheme-spec.md` (aspirational RFC-8785/3161/6962 design — its `bank_sig` is a SHA-256 **mock**), `server/auth.cjs` (HMAC session tokens only — no asymmetric signing), OT-SEAL5. **Two new verified gaps:** no rate-limiting anywhere in `server/` (grepped); bank-repudiation unmitigated.

## Appendix D · New OPEN-ITEMS entries (added this session — see `_meta/OPEN-ITEMS.md`)
Innovation: **OT-RIFQ** (mercy-first clearing, offline, light scholar gate) · **OT-STD1** (Open-Witness open-license + multi-issuer interop, owner gate) · D-4 annotated (prior-art confirms novelty is productization, not the fiqh). Data: **OT-FINDEX25** (integrate full 2011–2024 Findex series + 2024 figure, offline) · **OT-MKT** (bottom-up market band, offline) · **OT-LOANSIZE** (avg informal loan size — proxy hunt + survey Q4) · **OT-MOJ** (execution-court caseload behind Power BI, human gate) · OT-A1 annotated (instrument designed). Technical: OT-SEAL5 annotated (5-property offline/gated split) · **OT-RATELIMIT** (no rate-limiting in server/, offline) · **OT-THREATMODEL** (STRIDE+LINDDUN doc, offline) · **OT-DEPLOY** (Dockerfile/healthcheck/hardening offline; cloud gated) · **OT-BANKSIG** (real Ed25519 bank signature, offline crypto / HSM gated) · **OT-TSA** (RFC-3161: freeTSA offline demo / emdha evidentiary gated).
