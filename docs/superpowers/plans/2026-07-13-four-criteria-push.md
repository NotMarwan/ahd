# Four-Criteria Push — Technical · Data · Feasibility · Innovation

**Written:** 2026-07-13 (Claude-E / opus orchestrator). **Scope narrowed by owner:** push ONLY these 4;
UX + Memorability are out of focus (UX is font-ceilinged, Memorability is delivery-ceilinged — both parked).
**Executor:** opus orchestrates, sonnet-workers build at xhigh, 3 opus-4.8 refute-critics score each iteration.
≤4 agents/phase. TDD, gate-green, spine intact, commit-on-green. **Freeze:** Jul 17 12:00.

---

## 0. The reframe (why this plan exists)

The pre-freeze panel put these at **Technical 6.5 · Data 6.5 · Feasibility 6 · Innovation 7** and named the
ceilings as human-gated (scholar / survey / persistence / D-4 pick). That was half-right. Each ceiling has a
**real OFFLINE lever underneath it** that the earlier loop under-exploited by conflating "ceiling needs a human"
with "no offline work left." This plan attacks the offline levers hard, and flags the *genuinely* human-gated
residue honestly (no faking).

**Anti-inflation rule (unchanged):** a delta counts only if ≥3 opus refute-critics confirm with file evidence
against `docs/JUDGE-LENS.md`. No self-grading. Whole-app judge reality, not per-change credit. «لا نجامل».

**Spine (non-negotiable, every iteration):** bank witnesses/seals/settles — never lends/judges/scores/charges;
no riba/penalty/maysir/gharar; integer halalas; trust signal stays qualitative; AI issues no fatwa (cite, don't
rule); determinism (no Date.now/Math.random/Intl/float money in logic); demo/index.html + golden functions
byte-frozen (tripwire e2f48467…); offline (no CDN/network/deps beyond Node built-ins).

---

## 1. TECHNICAL 6.5 → target 8 — the biggest offline opportunity

Panel verdict: real byte-determinism + a thin server, but the server is in-memory/no-auth/judge-invisible, so
7.5+ "needs real persistence/auth/deploy." **All of that is offline-buildable** (Node built-ins only, no npm).

| # | Lever (offline) | Moves | Effort |
|---|---|---|---|
| **T1** | **Durable persistence** — replace `server/store.cjs`'s in-memory Map with an append-only JSONL event log + atomic rename (fsync). Survives restart; replayable; still deterministic (fixed AS_OF, no clock in logic). No native dep. | Tech + Feas | 1 iter |
| **T2** | **Real auth** — HMAC-signed session tokens (via the golden `sha256`, offline). Actors authenticated; bank still only witnesses. `/create-loan`/`/seal` require a valid actor token; unauth → 401. | Tech + Feas | 1 iter |
| **T3** | **Make the server JUDGE-VISIBLE** — an additive app screen («التحقّق الموثّق») that verifies a sealed record *through the local server* on the demo path, so a judge SEES "same seal, browser ⇆ server node." Currently the server never appears in the pitch. | Tech (judge-visibility) | 1 iter |
| **T4** | **Over-the-wire parity in CI** — promote `server/smoke-live.cjs` into the gate (ephemeral localhost port, deterministic vectors) so CI proves HTTP parity, not just the pure router. Meta-gate like tripwire. | Tech robustness | 0.5 iter |
| **T5** | **Deploy story** — a real `Dockerfile` + healthcheck endpoint + a one-command local run; honest README (localhost-hardened, not yet cloud). | Tech + Feas | 0.5 iter |

Acceptance: refute-panel confirms persistence survives a restart (test), auth rejects forged tokens (test),
the server is reachable on the demo path (screen + test), CI proves over-the-wire parity, gate green, spine intact.
**Human gate:** none for T1–T5. (Real cloud deploy + Nafath/TSA remain post-hackathon — flag, don't fake.)

---

## 2. INNOVATION 7 → target 8 — one offline lever + one human decision

Positioning won't move it; a demonstrated novel *mechanism* will. Two tracks:

- **I1 (offline-safe, DO NOW): Open-Witness protocol.** Publish the Ahd seal as an independently-verifiable
  open standard: a spec (`docs/specs/open-witness-v1.md`) + a **standalone reference verifier**
  (`protocol/verify-ahd-seal.cjs`, zero-dep) that any third party can run to verify a sealed record **without Ahd**.
  Compounds with T3's server parity → the story becomes "a protocol, not an app; the seal is portable and
  bank-independent." On-spine (bank still only witnesses), no fiqh ruling needed, fully offline. → +0.5–1.
- **I2 (human-gated): the memorable new mechanism.** The biggest Innovation leap (e.g. **ميراث الدَّين** /
  debt-at-death, the master plan's rec) touches inheritance fiqh → **INN-D4 is the owner's decision** (log in
  `docs/DECISIONS-FOR-MARWAN.md`, don't decide alone). Prep the SPEC as a *proposal* (not wired into the app) so
  it's build-ready the moment D-4 lands. Building it also needs a scholar (Shariah-gated).

Acceptance (I1): a fresh machine with only Node can verify a real sealed record via the reference verifier;
refute-panel confirms it's genuinely independent (not calling Ahd's own app) and on-spine. **Owner action: pick D-4.**

---

## 3. DATA 6.5 → target 7.5 — offline rigor now, survey later

Panel verdict: honest labeling improved, but the evidence base is unchanged (1 stale stat + 12 synthetic
fixture circles ÷3). Offline levers that raise *rigor* without a new survey:

- **D1: Sensitivity band, not a point.** Replace the single ÷3 with a modeled *range* — run the golden netting
  over many plausible circle structures (seeded, deterministic) and show the compression ratio's distribution
  (p10–p90), honestly labeled «نطاق توضيحيّ حتميّ». A defensible band beats a fabricated-precision point.
- **D2: Integrate the real cited stats already in-repo.** `swarm/agent-3-official-stats/` has primary-sourced
  numbers (Findex 35.8% et al., OPEN-ITEMS item 4) sitting un-integrated. Merge into `EVIDENCE-BRIEF.md` +
  the impact surface with source+year. Real primary data, already collected.
- **D3: Ground the fixtures.** Re-derive the 12 fixture circles from a cited KSA household/loan-size
  distribution so they read as "modeled on real distributions," not "reverse-engineered to ÷3." Label honestly.

Acceptance: refute-panel finds zero fabricated-precision, every number cited or band-labeled, the sensitivity
model deterministic + tested. **Human gate:** a real primary survey (n≥150, OT-A1) still caps 7.5→8+ — flag.

---

## 4. FEASIBILITY 6 → target 7.5 — the backend + a concrete roadmap

Panel verdict: readiness artifact, no external gate moved. Offline levers:

- **F1: The real backend (T1/T2/T5) directly lifts Feasibility** — "deployable, persistent, authenticated
  node" is a concrete feasibility jump from "localhost toy."
- **F2: Concrete regulatory + integration roadmap** — flesh `PATH-TO-PRODUCTION.md` with the *specific* steps:
  SAMA regulatory-sandbox application checklist, Nafath-AES integration interface (what the API needs), an
  RFC-3161 TSA integration point, data-residency. Cited, honest, sequenced — not vague.
- **F3: Unit economics** — a cost/revenue model for the qard-fund pilot (the LOI exists), showing the service-fee
  (two-contract) economics are viable without riba. Numbers deterministic + sourced.

Acceptance: refute-panel confirms the roadmap is concrete + honest (no overclaim), the backend is real, the
economics are sourced. **Human gate:** actual scholar sign-off + a signed pilot still cap 7→8 — flag.

---

## 5. Execution order (ROI-ranked; the loop runs these as iterations)

1. **T1 persistence** → 2. **T2 auth** → 3. **I1 Open-Witness protocol + verifier** → 4. **T3 server judge-visible**
→ 5. **D1+D2 data rigor** (sensitivity band + integrate swarm stats) → 6. **F2 roadmap + F3 economics**
→ 7. **T4 CI parity + T5 deploy** → 8. **D3 grounded fixtures** → 9. **full 4-criteria refute-panel re-score**.

Each: one sonnet-worker (xhigh) builds TDD + gate-green; three opus-4.8 refute-critics score against JUDGE-LENS
with evidence; commit-on-green checkpoint; update `_meta/score-leap-loop-state.md` + close/annotate the JL/OT item.
Cut order if time-pressed: T5 → T4 → D3 first. Never cut the spine check or the re-score.

## 6. Human-gated residue (surfaced, not faked — owner unblocks)
- **INN-D4**: pick the Innovation mechanism (recommend ميراث الدَّين) → unlocks I2 (Innovation → 8).
- **Scholar**: Hilah + D-1/D-3/D-7 → Feasibility → 8.
- **Survey** (n≥150, OT-A1) → Data → 8.
- **Font woff2 / real cloud deploy** → out of these 4's focus (UX / post-hackathon).

## 7. Definition of done (this push)
- [ ] Technical: persistent + authenticated + judge-visible + CI-wire-tested backend, deploy config. Panel ≥ 7.5.
- [ ] Innovation: Open-Witness spec + independent verifier shipped; INN-D4 proposal ready. Panel ≥ 7.5 (8 on INN-D4).
- [ ] Data: sensitivity band + real cited stats integrated + grounded fixtures. Panel ≥ 7.
- [ ] Feasibility: concrete roadmap + unit economics + the real backend. Panel ≥ 7.
- [ ] Gate green (+ new tests), spine PASS, tripwire intact, every count drift-checked, all committed on branch.
