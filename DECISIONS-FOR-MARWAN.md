# 🧭 DECISIONS FOR MARWAN — things I would not decide alone

> Per the overnight brief §5: anything touching the **spine** (bank role, qard-hasan model,
> no-riba/no-penalty, no-score), any **Shariah ruling** or genuinely-uncertain-halal feature,
> any **golden-pinned function / golden vector**, anything **irreversible**, any **new
> dependency/service/network call**, or anything I'm <90% sure about — gets written here with
> full context + options + my recommendation, then **skipped** so I move to safe work.
>
> **AI issues no fatwa.** Shariah questions cite scholars/standards and are flagged here, never ruled.

**Blocking items at session start: 0.** (Items appear below as I encounter them.)

---

## Standing items I already expect to surface (from `open-threads.md`, pre-existing)
These are not new — they are the round's known open threads that need a human/counsel, surfaced
here so they're in one place. I will NOT act on them autonomously.

- **OT-A1 — the one real Saudi demand voice** (relational-strain shard). Non-code; needs field input.
- **OT-A2 — "why Alinma not Al-Rajhi"** moat strategy. Strategy call, not code.
- **OT-VAL — pre-production validations:** Nafath-AES permission for interpersonal debt · Alinma
  Shariah-board sign-off on the fee + two-contract separation · accredited CSP/TSA. _Counsel only._
- **OT-CITE — exact Evidence-Law article numbers + M/8↔M/18 + 2024–25 court figures.** _Counsel-confirm._

---

## New items raised this session

### D-1 · «سجلّ وفائي» self-disclosure (دفتري Screen E) — DEFERRED, needs sign-off
**Context:** Agent-3's دفتري spec includes Screen E — Naif opting to *show his own* trust band to a new client ("here's that I keep my word"). The spec itself flags it `[v2]` and asks for a Shariah/privacy sign-off, because even owner-initiated disclosure of a reliability signal sits near the engine's hard rule that the trust signal is *own-history only, never exported, never underwrites*.
**What I built instead:** the rest of دفتري (home, tabs, reminders, grace/forgive/settle) — fully on-spine. I did **not** build Screen E.
**Options:** (a) build it strictly as owner-pushed, band-word-only, no third-party pull (my reading: defensible but wants a yes); (b) keep it out of v1 entirely; (c) reshape it (e.g. show only «جديد/وفّى» with no history detail).
**My recommendation:** (a) — but only after a one-line Shariah/privacy confirmation that owner-initiated band-word disclosure does not breach no-export. Until then it stays unbuilt.

### D-2 · Digit system for Arabic numerals (low-stakes, FYI)
The دفتري reminder/amount copy renders **Western digits with grouping** (`2,500`) to stay byte-consistent with the engine's golden `fmt()`. The Agent-3 spec's illustrative copy used Arabic-Indic (`٢٬٥٠٠`). Both are deterministic; this is a Design-layer choice. **My pick:** keep engine-consistent Western for now; flip to Arabic-Indic app-wide if you prefer (a pure, safe display map). Not blocking.
