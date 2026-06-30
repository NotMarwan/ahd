# Robustness + Offline Failure-Proofing — Ahd prototype

**Target:** `project/ahd-demo/index.html` (logic/robustness only — no styling)
**Owner:** Claude-Hardening · **Date:** 2026-06-19
**Premise:** hour 70 of a hackathon, bad Wi-Fi, a tired presenter. Nothing may break on stage.

Every guard below is exercised by a re-runnable test (`test-harness/dom-smoke.cjs`, 21/21) and confirmed in real Chrome (`stability-report.md`).

---

## Failure modes found → guards applied

### F1. Orphaned timer writes to a detached / missing DOM — **FIXED** (the named bug class)
**Before:** `confirmPerson()` ran a `setInterval` whose completion did
`document.getElementById("record").innerHTML = …` and `card.querySelector("button").outerHTML = …`.
If the presenter navigated away mid-scan, `#record` / the button no longer exist → **`TypeError: Cannot set properties of null`** fires from a timer with no stack the presenter can see. The typing loop in step 1 had the same shape.
**Guard:**
- One **state machine `S`** owns every timer id (`S.timers.{L,B,type}`).
- `go()` calls **`clearTimers()` before every transition** — no timer outlives its screen.
- The interval body **null-guards the scan bar each tick** and bails if it's gone; completion null-guards the card and the button before touching them.
- The typing `setTimeout` is tracked in `S.timers.type` and cancelled on navigation; it already bailed via `document.body.contains(el)` and now also null-checks `el`.
**Proof:** dom-smoke "go() cleared all in-flight timers on navigation"; "a throwing screen is caught… (no crash)".

### F2. Double-tap / rapid re-click on a Nafath confirm — **FIXED**
**Before:** each click reset `_scanW[k]=0` and started **another** `setInterval`. Two intervals raced; both reached 100%; the second called `card.querySelector("button")` on an already-replaced button (`null.outerHTML`) **and** issued the record twice.
**Guard:** `confirmPerson()` **early-returns** if the party is already confirmed *or* a scan is already running (`S.conf[k] || S.timers[k]`); the record is issued **exactly once** via `S.recordIssued`.
**Proof:** dom-smoke "double-tap on a confirm is ignored (no second timer started)"; real Chrome flow stays clean.

### F3. Rapid navigation / back-forward / re-runs — **FIXED**
**Guard:** every step resets its own transient state on entry — step 2 resets `conf/scan/tamper/recordIssued`; step 3 resets `schedule.paid`; **`go(0)` runs a full `resetState()`**. Combined with F1's timer cancellation, re-entering any screen yields a clean, identical state.
**Proof:** dom-smoke drives `go(0..4)` repeatedly + clamp cases with no throw; reload determinism in real Chrome.

### F4. Landing on an unbuilt / out-of-range screen — **FIXED**
**Guard:** `go(n)` **clamps** `n` to `[0, TOTAL-1]`. Inline handlers only ever pass 0–4; the clamp is the backstop against any stray call.
**Proof:** dom-smoke `go(99)→step 4`, `go(-5)→step 0`, no throw; real Chrome `go(99)` lands on the last dot.

### F5. Any `getElementById` returning null mid-flow — **FIXED**
**Guard:** every DOM write is now null-guarded — `vbtn, tbtn, next1, next2, skip, sched, done3, gwrap, run, netout, record, docwrap, vout, terms, steps`. A missing node is a quiet no-op, never a thrown exception.

### F6. Uncaught render error — **FIXED (offline fallback)**
**Guard:** `go()` wraps `R[n]()` in `try/catch` → **`renderFallback()`** shows a clean, recoverable card (existing styles only, Arabic/RTL, a single "↺ إعادة من البداية" button) instead of a blank/broken page. A last-resort `window`‑`error` listener recovers only if `#app` is blank. **So even a total failure has a clean path** — the prompt's "offline fallback recording".
**Proof:** dom-smoke forces a throwing `R[2]` → caught, recovered, no crash.

### F7. Presenter aids (no new UI) — **ADDED**
- **Esc / Home → `go(0)`** clean reset (ignored while typing in the riba `textarea`/`input`, so it never hijacks input). Invisible; no styling change.
- The existing **"↺ من البداية"** control now performs a full deterministic `resetState()` via `go(0)`.
**Proof:** real Chrome "Escape resets to step 0".

---

## Offline proof — zero network in the demo path

`test-harness/offline-check.cjs` (9/9) statically proves, and real Chrome confirms:

| Check | Result |
|---|---|
| `<script src>` (external JS) | none — all inline |
| `<link href>` | only the **data:** SVG favicon (no `/favicon.ico` request) |
| remote `<img>` / `url(http…)` / `@import` | none |
| web fonts (Google Fonts / Typekit / `@font-face`) | none — system font stack |
| `fetch` / XHR / WebSocket / EventSource / Worker / `sendBeacon` | none |
| any http(s) URL | only the W3C **SVG namespace** (not a fetch) |

**Real-Chrome network trace:** exactly **1** request — `GET http://localhost:8123/` (the page). 0 external. (Works identically from `file://` by double-click.)

All four crypto/analytic claims run **identically offline**:
- **SHA-256** — from-scratch, in-page, no `crypto.subtle` (no secure-context dependency); NIST-verified.
- **The verifier** — pure `verifyRecord()` (recompute + compare); deterministic.
- **Muqassa** — pure integer netting; conservation + ≤P−1 bound proven.
- **Riba-linter** — pure, stateless regex engine; hits/misses pinned.

The rails that *cannot* be real offline — **Nafath, sarie, ALLaM, RFC-3161 TSA** — are explicit, clearly-labelled (`محاكاة`) **deterministic canned seams**; each returns the same result every run. No seam reaches the network.

---

## Known limitation (documented, intentionally NOT changed on demo day)

The riba linter is a keyword engine with **no negation handling**, so a legitimately *clean* phrase that contains a trigger word under negation is **over-blocked**:
`ribaScan("قرض حسن بلا فائدة") → block`, `ribaScan("دون أي زيادة") → block`.

- **Why left as-is:** the must-not-break case is the penalty clause **blocking**. Adding Arabic negation logic the day of the demo risks the one behavior that has to hold (the `+ غرامة تأخير ٥٪` chip must block). The **scripted path is fully locked**: empty → clean (sign enabled), penalty chip → block (sign disabled), clear → re-enabled — all tested in Node *and* real Chrome.
- **Pinned, not hidden:** these false-positives are asserted in `run-tests.cjs` §7 as `[known FP]`, so any future change is a conscious decision, not an accident.
- **Recommended fix (handed to product/Claude Design):** add a negation guard — skip a hit when the trigger is immediately preceded by `بلا|دون|بدون|من غير|بغير|عدم`. Low-risk to implement off-stage with the existing test vectors as the regression net.

> Per the guardrail, anything that would alter appearance is **not** applied here; this recommendation is logic/product and is handed off rather than changed under the demo-stability mandate.
