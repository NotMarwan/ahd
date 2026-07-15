# Score-Leap Master Plan — عهد (Ahd) → 1st place, AMAD 18 July 2026

**Written:** 2026-07-12 by Claude-E (Fable), on branch `judge-lens-real-leap`.
**Executor:** any capable model/session. This document is self-contained — but read the *Read-first list* before touching anything.
**Days remaining:** 6 (Jul 12–17 work, Jul 18 judging).

---

## 0. Read-first list (mandatory, in order)

1. `CLAUDE.md` — spine, hard rules, gate commands. **The spine is non-negotiable; the frozen demo is untouchable.**
2. `docs/JUDGE-LENS.md` — the five criteria and scoring protocol.
3. `docs/عهد-تقرير-صارم-٢٠٢٦-٠٧-١٢.md` — the honest adversarial re-score that produced the baseline below. Understand *why* the echo chamber inflated scores before you score anything.
4. `_meta/OPEN-ITEMS.md` — residuals JL-6…JL-9.
5. `docs/DECISIONS-FOR-MARWAN.md` — do not decide Shariah-gated or irreversible things alone; add to this file instead.
6. `_meta/agent-presence/README.md` — register presence as your agent letter; real-clock heartbeats only.
7. Query `graphify-out/` for any architecture question instead of re-exploring files.

**Standing rules for every workstream below:** additive files only; TDD (failing test first); determinism (no `Date.now`/`Math.random`/`Intl`/float money); gate must be green after every front (`cd tests && node run-all.cjs`); sweep every judge-visible gate-number banner to the *live* count after tests change (lesson: the 1687/2031 drift bug); browser-verify every visible change; sync the Obsidian vault (`AmadHackathon/`) before ending any state-changing session; update `_meta/overnight-log.md`.

---

## 1. Verified baseline (adversarial, refute-mode, 2026-07-12)

| Criterion | Score | Verified gap |
|---|---|---|
| Innovation | 7 | No mechanism a judge hasn't seen; "witness not lender" is positioning, not yet a demonstrated novel mechanism |
| UX | 6 | Sadu identity is a thin strip, not a design language; no real Arabic display font; hierarchy improved but not distinctive |
| Technical | 6 | 0% backend; all client-side; tests strong but architecture story ends at the browser |
| Data | 6 | KSA numbers now cited on-screen, but the 54→18 ratio is synthetic (÷3); no primary data |
| Feasibility | 5 | Honest path-to-production exists but no gate actually moved: no backend, no scholar, no regulatory step |
| Memorability | 6.5 | Tamper cascade is a real moment; pitch not yet rehearsed around one unifying metaphor |

**Target:** Innovation 8, UX 8, Technical 7.5, Data 7.5, Feasibility 7, Memorability 8. That is a realistic winning profile against ~1000 teams, and every point below is bought with *real* work, not framing.

**Scoring integrity rule (anti-echo-chamber):** every re-score must use ≥3 independent critics *prompted to refute*, scoring against `docs/JUDGE-LENS.md` with screenshot/file evidence per claim. A critic that agrees without citing evidence is discarded. Never let panels grade their own output. Claimed deltas without a refute-mode re-score do not count.

---

## 2. Workstreams (ranked by ROI = judge-visible impact ÷ effort)

### W1 — Sadu design language, for real (UX 6→8, Memorability +0.5) — HIGHEST ROI
The design is *named* after Sadu weaving; make the app actually speak it. One unifying metaphor: **every loan is a thread; the ledger is the weave; tampering is a torn thread.** This metaphor also becomes the pitch spine (W5).

Tasks:
1. **Typography.** Bundle an OFL Arabic display+text pairing offline (candidates: Readex Pro / IBM Plex Sans Arabic / Noto Kufi Arabic for display, keep body highly legible). WOFF2 files vendored into `app/assets/fonts/` (offline rule — no CDN). Type scale: 3 sizes max, real hierarchy (hero numerals for amounts, distinct display for screen titles).
2. **Design tokens file** (`app/styles/sadu-tokens.css` or equivalent): Sadu palette (derived from `application/prototypes/dir-b-sadu.html` — that prototype is the canonical direction per project memory), spacing rhythm, radii, motion durations. Kill every hardcoded color that fights it.
3. **Sweep all 20 screens** to the tokens: consistent header pattern, woven-band usage with intention (section dividers, seal states, trust band) — not decoration on every pixel. The woven motif should *mean something*: e.g., a loan's lifecycle rendered as a thread being woven into the band; settled = woven in; tampered = torn/red thread (ties into the existing hash-cascade screen).
4. **States:** designed hover/focus/active/empty/error states (currently library-default in places).
5. **RTL + reduced-motion + contrast pass** (judges may check; cheap points).

Tests: extend DOM-smoke suites for token presence, font loading offline, no-CDN assertion. Browser-verify at 375px and 1280px.
Acceptance: refute-mode critic shown before/after screenshots concedes "distinctive, intentional, specific to Sadu" on ≥15 screens. Effort: 1.5–2 focused sessions.

### W2 — Thin real backend (Technical 6→7.5, Feasibility +1)
Not a rewrite — a **thin, honest slice** that proves the engine runs server-side and the architecture story extends past the browser.

Tasks:
1. `server/` (new dir): Node HTTP server, zero deps or minimal, reusing the **byte-faithful engine copy** mechanism (extend `app/build-engine.cjs` pattern — never fork engine logic). Endpoints: create loan, seal, verify, net, list. JSON file or SQLite persistence. Integer halalas everywhere.
2. **Parity test**: same golden vectors through HTTP round-trip must produce the golden main seal `6c9410b9…`. This is the demo-worthy claim: *"the same sealed record verifies identically in browser and server — the seal is the API."*
3. **Sync story**: app screen (additive) showing local-first → server-witnessed status ("sealed locally, witnessed by bank node"), even if the demo runs both on localhost.
4. `docs/ARCHITECTURE.md` addendum + update `docs/PATH-TO-PRODUCTION` marking this gate honestly moved (from 0% → thin slice, say exactly that).

Timebox hard: 1 session build + half session polish. If it threatens the gate or the schedule, ship endpoints create/verify only. Never let this touch demo or app engine files.
Acceptance: `tests/app/server-parity.test.cjs` green in gate; curl demo scripted; critic concedes "real server-side execution exists."

### W3 — Real data (Data 6→7.5)
Kill the synthetic ÷3. Two prongs:

1. **Primary data — run the survey.** The kit already exists (`docs/evidence/` demand-survey kit). Marwan distributes today (WhatsApp/uni networks); target N≥30 by Jul 15. Build an additive results screen: real N, real % who lent informally, % who lost money/relationships, willingness-to-use. Label method honestly ("عينة ميسّرة، N=…"). Judges reward primary data violently at hackathons; almost nobody has it.
2. **Secondary data hardening.** Every on-screen number gets a source + year footnote (571,251 court cases, SAMA stats, etc.). Replace the ÷3 illustrative ratio: either derive a defensible range from the survey ("of X respondents who documented loans, dispute rate was Y% vs Z% undocumented") or keep the illustration but shrink its visual weight and grow the *real* numbers.

Tests: data screen determinism (numbers from a checked-in `survey-results.json`, not fetched), citation-present assertions.
Acceptance: zero uncited numbers on any judge-visible surface; critic cannot find a number he can call fabricated. Effort: 0.5 session build + Marwan's distribution (starts TODAY — longest lead time, so trigger first).

### W4 — Shariah depth (Feasibility +1, Innovation support)
1. **Scholar touch.** Marwan contacts one qualified person (university Shariah dept / SAMA-listed advisor / even a documented email exchange) on the Hilah question + D-1/D-3. A single dated, named response — even preliminary — converts "we think it's halal" into "we asked." If no response by Jul 16: fallback memo.
2. **Fallback/parallel memo** (`docs/evidence/shariah-basis.md`): map each product mechanic to AAOIFI Shariah Standard No. 19 (Qard) clauses + Qur'an 2:282/2:280 + the specific open questions, phrased as questions (AI issues no fatwa — spine rule). One app screen ("الأساس الشرعي") already partially exists via refusal screen — link the memo's citations there additively.
Acceptance: judge asking "who validated the Shariah?" gets a named process, not a shrug. Effort: 0.5 session + external dependency (trigger TODAY).

### W5 — Pitch & memorability (Memorability 6.5→8) — cheap, decisive
1. **One metaphor everywhere:** the Sadu thread/weave (from W1). Open the pitch with a physical Sadu textile if obtainable (Marwan), or the woven screen: "كل قرض خيط، والسجل نسيج" → tamper demo = torn thread → «كلمتك محفوظة، وعلاقتك محميّة» as the close.
2. **3-minute script v2** in `docs/PRESENTER-GUIDE.md`: cold open (571k court cases), live demo path (create → seal → judge-typed tamper cascade → settle/net), survey number (W3), refusal screen ("what we refuse to do is the product"), close. Every criterion gets one deliberate beat.
3. **Rehearse ×5** with timer; script the demo click-path and a failure fallback (screenshots deck appendix if wifi/laptop dies).
4. **Deck final pass** (`docs/DECK-DRAFT-AR.md`): numbers = live gate count, screenshots = post-W1 UI (re-shoot AFTER W1 lands; use JS eval for capture — deck screenshots hang, per project memory).
Effort: 1 session + rehearsal time. Acceptance: dry-run recorded; critic scores the recording, not the intention.

### W6 — Innovation mechanism (7→8) — needs a Marwan decision TODAY (track as INN-D4)
Positioning won't move this; a demonstrated novel *mechanism* will. Pick ONE (recommendation order):

- **A. ميراث الدَّين — debt-at-death protocol (recommended).** On a party's death, the sealed record becomes an heir-facing proof: outstanding qard surfaces to executors *before* inheritance division (settling debts precedes inheritance in fiqh — direct hadith basis). Bank still only witnesses. Emotionally unforgettable, deeply Islamic, no competitor will have it, and it's a natural extension of the sealed chain (a "final knot" in the weave). Buildable as one additive screen + engine-consuming module + tests in ~1 session.
- **B. Circle netting (الجمعية).** ROSCA circles are massive in KSA; the netting core already exists and specs live in `docs/specs/`. Bigger market story, less emotional spike, more build risk.
- **C. Open Witness protocol.** Publish the seal format as a standard any bank can verify. Cheapest, but abstract on stage.

Whichever is chosen: TDD, additive, spine-check (bank never judges/lends), one pitch beat in W5, refute-mode re-score.

---

## 3. Schedule (Jul 12–18)

| Day | Work | External triggers |
|---|---|---|
| **Jul 12 (today)** | Marwan: launch survey (W3), contact scholar (W4), decide INN-D4 innovation pick. Model: W1 tokens+fonts groundwork, W5 script v1 | Survey + scholar have the longest lead — fire first |
| **Jul 13** | W1 full screen sweep + browser verify + re-score | Survey collecting |
| **Jul 14** | W2 backend slice (build + parity test) · W3 secondary-data hardening | Nudge survey |
| **Jul 15** | W6 innovation mechanism build · W3 survey-results screen (freeze N whatever it is) | Scholar follow-up |
| **Jul 16** | W4 memo + screen link · integration polish · **full refute-mode re-score, all six criteria** · fix worst finding | Scholar deadline |
| **Jul 17** | **Feature freeze 12:00.** W5: re-shoot screenshots, deck final, rehearse ×5, failure fallback, vault + log sync, final gate + tripwire + gate-number sweep | Print/obtain Sadu textile |
| **Jul 18** | Judging. Arrive with offline laptop + deck PDF + screenshot appendix | — |

Slack: half of Jul 16 is buffer. If behind, cut order: W2 polish → W6 scope → never W1/W5.

---

## 4. Risks

| Risk | Mitigation |
|---|---|
| Gate breaks mid-sweep | Run `node run-all.cjs` after each front; never weaken an assertion; tripwire check `sha256sum -c _overnight/backup/demo.sha256` |
| Gate-number drift (repeat of 1687 bug) | After ANY test-count change, grep all judge surfaces for stale counts; single source = live `run-all.cjs` banner |
| Echo-chamber re-inflation | Refute-mode critics only, evidence-cited, per §1 integrity rule |
| Survey N too small | Report honestly ("N=17 عينة أولية") — honest small data beats synthetic big data with these judges |
| Scholar silent | W4 fallback memo; frame as "process started, question documented" |
| Backend eats schedule | Hard timebox; create/verify endpoints minimum viable slice |
| Font/licensing | OFL fonts only, vendored offline |
| Demo-day tech failure | Fully offline app (already), screenshot appendix, rehearsed fallback narration |

---

## 5. Definition of done (Jul 17, 12:00)

- [ ] Gate green, one banner, tripwire sealed, all judge surfaces show the live count
- [ ] Refute-mode re-score ≥ targets in §1 (or JL- items filed with honest deltas)
- [ ] All six workstreams either landed or consciously cut per §3 cut order
- [ ] `docs/DECISIONS-FOR-MARWAN.md` has zero silently-decided items
- [ ] Vault (Home + plan + topical note), `_meta/overnight-log.md`, `_meta/OPEN-ITEMS.md` synced
- [ ] Graphify refreshed (`graphify . --update`, AST-only, no LLM subagents — إسراف rule)
- [ ] Presenter rehearsed ×5, fallback ready, close lands on «كلمتك محفوظة، وعلاقتك محميّة»
