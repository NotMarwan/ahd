# Overnight — External Representation log

One line per iteration. Format: `[Iter N] <surface> → <change> | JL <before>→<after> | <evidence>`.
Scoreboard: `docs/JUDGE-LENS.md` (five bars, 1–10). Surfaces a judge/outsider sees only.

<!-- MORNING BRIEFING gets prepended above this line on the final pass. -->

## ☀️ MORNING BRIEFING — 2026-07-12 (external-representation night, 7 iterations)

**One-line verdict:** every judge-visible number is now *truthful and identical everywhere* — the pitch stopped lying to the live gate. Gate is GREEN **2031/0** (core 184 + app 1,833 + structure 14, 44 app suites, 4.9s offline, demo sealed `e2f48467…`).

**What got better (ranked by judge impact):**
1. **The "run it yourself" moment is now honest.** The deck slide 11, the spoken script (2:15), and the Q-H3 rebuttal all dared a judge to run `node run-all.cjs` — while showing **1,687 / 1,809** (stale). Live prints **2031/0**. That contradiction at the highest-credibility moment is *gone*: deck, README, script, rehearsal checklist, judge cards, deck-source, EVIDENCE-BRIEF, REBUTTAL-PLAYBOOK, PRESENTER-GUIDE + the operator vault (Home/status/stage) — **all unified on 2031/0**, verified against a live run.
2. **Deck title slide no longer shows a raw `{TEAM}` template token** (it rendered literally on the judge's FIRST slide — no JS substitution existed). Now a single fillable constant, graceful default «فريق عَهد».
3. **Data slide is audit-clean:** all four figures (35.8% Findex · 58.6% of 571,251 · 115.4B SAR · 99.0% DataReportal) match the graded EVIDENCE-BRIEF exactly; added «تحديثها جارٍ» so the slide *owns* the one stale-vintage number (2020-21 court data) and pre-empts the "your data is old" attack.
4. **Q-E4 «why refuse credit scoring» verified airtight** (the make-or-break question — edition-1 judges rewarded scoring). Reframes refusal as identity + structural-incapability + guard flags. No change needed.
5. **Memorability moment de-risked:** all three tamper-seal proof screenshots load live (200/png).

**JUDGE-LENS scoreboard (deltas this night):**
| bar | before | after | note |
|---|---|---|---|
| technical | 7 | **8.5** | numbers truthful + consistent, no live contradiction |
| feasibility | 7 | **8** | rebuttal/credibility hardened |
| data | 6.5 | **7.5** | audit-clean + vintage owned |
| UX (cover) | 6 | **8.5** | {TEAM} token fixed |
| memorability | 6 | **6.5** | moment de-risked; deeper lift is delivery-level |
| innovation | 7 | 7 | unchanged — needs the retell-line landing, not text |

**Decisions / open items raised (operator's call — NOT decided alone):**
- **(a) Fee-receipt moment:** the mission names a "tamper-seal + *fee-receipt*" pair for the first 60s; the deck shows tamper+settle but **no fee-receipt visual** proving the two-contract riba-free model on-screen. Candidate build (the app already has the fee-receipt at seal-time per vault 05:50) — surface it in the deck; **label «قيد المراجعة الشرعيّة»** if built.
- **(b) Team names (B2):** still open; deck degrades gracefully to «فريق عَهد» — drop real names into the one `TEAM` constant in `presentation.html`.
- **(c) Screenshot reshoot (JL-2 residual):** `app/screenshots/premium-after/` images load fine and are current-enough; only reshoot if the app restyled since.

**THE 3 THINGS TO REVIEW FIRST (60 seconds):**
1. **Deck** `docs/pitch/presentation.html` slides 1 / 6 / 11 — confirm «فريق عَهد» + 2,031/0 read right to you.
2. **Script** `docs/pitch/script-ar.md` 2:15 spoken «٢٬٠٣١ تأكيدًا» + the Q-H3 «run it yourself» rebuttal in `REBUTTAL-PLAYBOOK.md` — the number you say must equal the banner.
3. **The fee-receipt-moment decision** (item a) — the one net-new judge-first-60s lever left.

*Harness left GREEN. Nothing committed — all changes staged for your review. Scratchpad `root-serve.cjs` + a `.claude/launch.json` `ahd-root` entry (:8130) were added to preview the deck; harmless, delete if unwanted. Per-iteration detail below.*

---

[Iter 1] Deck cover (`docs/pitch/presentation.html` slides 1–2) → raw `{TEAM}` token rendered literally on the judge's FIRST slide (no JS substitution existed); added a single fillable `TEAM` constant with an honest graceful default «فريق عَهد» + `.replace(/{TEAM}/g,…)` in `paint()`; dropped redundant "فريق:" prefix on slide 1. Invents no name (B2 still open — real names slot into one constant). | JL UX(cover) 6→8.5 · memorability 6→7 | browser read_page: slide 1 = "فريق عَهد"; JS eval across all 14 slides `renderedHasToken:false`, slide2 h2="فريق عَهد".
[Iter 2] Deck gate number (`presentation.html` slides 6 & 11) → GATE was stale "1,809/0" (dated 07-11) while the LIVE `node run-all.cjs` the slide 11 dares judges to run now prints 2031/0 — an on-stage numeric contradiction at the proof moment; ran the gate for ground truth (2031/0 = core 184 + app 1,833 + structure 14, 5.0s offline), updated GATE + slide-6 breakdown 1,611→1,833. | JL technical 7→8 (removed live-contradiction failure mode) | gate run: `AHD GATE ✅ 2031/0`; JS eval: GATE="2,031/0", slides 6+11 show 2031, zero stale 1,809/1,611. NOTE: README.md still stale (1192+/29 suites) — queued.
[Iter 3] README.md (Quality Gate + Project Map — outsider/GitHub cold-read face) → gate numbers badly stale + undersold: "1192+ assertions, 29 suites, app 29 files", omitted the structure-check gate, and contradicted the deck's 2031; ran run-all.cjs (2031/0) + run-app-tests (44/44, 1,833) for ground truth, rewrote Quality Gate to canonical gate (adds structure-check) + one-command `node run-all.cjs` banner = 2031/0, fixed map to 44 suites + structure/run-all rows. Also corrected the deck's own comment "(40 suites)"→44. Now deck=README=live all say 2031. | JL technical(README) 6→8.5 · cross-surface consistency restored | grep: zero stale tokens (1192/1008/29), truth 2031/1,833/44 present; gate GREEN 2031/0.
[Iter 4] Pitch kit gate number — script-ar.md (SPOKEN live), rehearsal-checklist.md, top6-cards-ar.md, deck-content-v2.md (deck source of truth) → all still cited the OLDEST stale value 1,687/0 (app 1,489, 34 suites); worst: at 2:15 the presenter SAYS «١٬٦٨٧ تأكيدًا» aloud then dares judges «شغّلها الآن أمامك» → `node run-all.cjs` which prints 2031/0 — a spoken-vs-live contradiction at the proof-moment dare. Propagated the one true fact 1,687→2,031 (app 1,489→1,833, 34→44 suites) across 9 spots in 4 files, incl. Arabic-Indic ٢٬٠٣١. | JL technical(script proof moment) 7→8.5 · feasibility(credibility) 7→8 · full pitch-kit consistency (deck HTML=README=script=rehearsal=cards=deck-src all 2031) | grep: zero residual 1,687/1,489/34-suite; live gate GREEN 2031/0.
[Iter 5] Deck data slide 5 (lowest JL bar — data 6.5) → audited all 4 figures vs graded EVIDENCE-BRIEF.md: 35.8%/13.7% (M-13 🟢), 58.6%/571,251 + 115.4B (D-1 🟡 stale 2020-21), 99.0%/33.9M (M-9 🟢) — ALL match exactly, zero number drift. Gap found: script says the court data is «تحديثها جارٍ» but the slide didn't; added the refresh flag to the D-1 source line so the slide OWNS the 2020-21 vintage on-screen (preempts «your court data is 5 yrs old» rebuttal + script↔deck consistency). | JL data 6.5→7.5 · feasibility(honesty) +0.5 | JS eval slide5: d1_has_refresh true, vintage true, Findex+DataReportal 🟢 render, 35.8%/115.4B present. RESIDUAL: deeper data-bar lift = add an insight-narrative (not just 4 stat cards) — bigger, flagged not forced.
[Iter 6] Evidence kit — REBUTTAL-PLAYBOOK.md (5 spots) + EVIDENCE-BRIEF.md X-1 (Q&A prep, judge-facing) → audited Q-E4 «why refuse credit scoring»: already MODEL-GRADE 🟢 («رفض التصنيف هويّتنا لا قصور» + structural-incapability + guard flags is_number_exported:false…), no change needed; weak rebuttals Q-F2/Q-F3 correctly left honestly-flagged (spine honesty). REAL defect: evidence dir never swept for the gate number — Q-H3 «hand you the laptop, run `node run-all.cjs`» rebuttal coached the presenter to say `AHD GATE ✅ 1687/0` while live prints 2031/0 = self-inflicted on-stage contradiction the instant a judge takes the dare. Propagated 1687→2031 (app 1,489→1,833, 34→44 suites, ~4s→~5s) across 6 spots; kept one labelled «superseded» history note. | JL feasibility/credibility(rebuttal) 7→8.5 · tech consistency | grep: zero live-stale, 2031 in playbook×4 + brief×1; Q-E4 verified airtight. NUMBER-HYGIENE NOW COMPLETE across deck+README+pitch-kit+evidence-kit.
[Iter 7] Deck slide 12 — the tamper-seal MEMORABILITY beat (#1 memorable moment) → VERIFIED all 3 proof screenshots load live (05-proof-verified 200/png/161KB, 06-proof-tampered 200/181KB, 09-settle 200/198KB) — no broken image on the slide that must land. Captions already sharp («غيّرنا حرفًا واحدًا» + «ختمٌ يُحسَب فعلًا، لا صورة»); no forced edit on working copy. | JL memorability 6→6.5 (moment de-risked; deeper lift is delivery-level, not a text fix) | fetch probe: 3× status 200 image/png. FLAG for operator (not built — net-new + Shariah-adjacent fee framing): mission names a «fee-receipt moment» but deck shows tamper+settle only, no separated service-fee-receipt visual proving the two-contract riba-free model on-screen → candidate JL-/DECISION, label «قيد المراجعة الشرعيّة» if built.
[Iter 8 · FINAL PASS] Harness re-run GREEN `AHD GATE ✅ 2031/0` (4.9s, demo sealed e2f48467). Demo path (app/index.html) renders clean at :8130 — 8-screen nav + hero + spine line, zero console errors. Deck re-confirmed (slide 1 «فريق عَهد», GATE 2,031/0, no {TEAM} token, slide-12 images load). SYNCED operator vault: Home (dated 12-Jul entry + date), 05 status + 03 stage (live banners 1687→2031/0 + dates). Caught + fixed one more judge-adjacent stale banner: PRESENTER-GUIDE.md:38 (1687→2031). Wrote MORNING BRIEFING atop this log. Internal superpowers/plans/*.md still say "keep gate 1687" — OBSOLETE (gate legitimately grew to 2031 via sadu+revenue work) but OUT OF SCOPE (internal, not judge-visible) — left untouched, flagged here. Loop STOP.
