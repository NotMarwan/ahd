# 🤝 HANDOFF #12 — Agent 4 · Leap (Vector 4: A New Primitive)

**Date:** 2026-06-18 · **From:** Agent 4 · **Event:** AMAD 2026 (Alinma × Tuwaiq) · 1st = 250,000 SAR
**Supersedes** [[handoff-8]] (adds the built+verified prototype). Read this, and you can continue cleanly.

---

## 1. Mandate
Agent 4, **Vector 4 — "A New Primitive"** in the RESET & LEAP round (all four Round-1 champions retired). Invent a genuinely new, **Shariah-clean**, *surprising* money **mechanism** — not a cleaner clone.

## 2. Current state — DONE
- ✅ Full leap cycle: recon → 22 raw ideas (safe-3 discarded) → 3 finalists scored → champion red-teamed → wildcard → scoreboard + terrain.
- ✅ **Champion prototype BUILT + browser-verified** (the headline of this handoff).
- ⏳ Open: deck/script, Shariah+legal validation, deepen data viz (see §6).

## 3. Champion: عهد · Ahd — Witnessed Money (85/100)
**The first money rail for money *between people*.** Track 2 CX · /03+/02+/04(+/01).
*Turn a loan to a friend / IOU / promise into a fair, plain-Arabic, interest-free (**qard hassan**) agreement that Alinma **witnesses** (Nafath e-sign, admissible under Evidence Law 2022), records, and **auto-settles** via sarie — exactly as the Quran's verse of debt (2:282) commands: "write it down." Plus **Muqassa** debt-netting that collapses a circle's tangled IOUs in one tap.*
**Why it's a leap:** names a category the sector forgot — *money between people* — on the literal command of the Quran's longest verse; uncontested-clean (qard hassan/amana, never Tawarruq); emotional; viral (two-sided); a brand moat only an Islamic bank can own.

| Finalist | Score | The primitive |
|---|---|---|
| 👑 **عهد Ahd** | 85 | witnessed/auto-settled interpersonal money ("Ayat al-Dayn as a product") |
| **أمانة Amana** | 83 | conditional "trust-money" / escrow — restores *yadan-bi-yad* for C2C/Haraj/freelance |
| **تكاتف Takatuf** | 80 | *ta'awun* as a primitive — governed collective pools (bulk-buys, mutual-aid, goals) |
| 🃏 **مُعلّق Mu'allaq** (wildcard) | — | suspended giving (cross-lane → Vector 3; handed to A3) |

## 4. 🛠️ The prototype (built + verified — the key new asset)
- **Code:** `project/ahd-demo/index.html` — single-file, **offline, deterministic, Arabic-RTL**. Run by double-click, or `node project/_serve.cjs` → `http://localhost:8123/`. Docs: `project/ahd-demo/README.md`.
- **5 screens:** problem+ayah → create qard-hassan agreement (live Arabic terms + riba-clean check) → dual Nafath confirm → witnessed record (computed hash) → auto-settle → ذمّة محفوظة → **Muqassa netting**.
- **Really computed + deterministic:** doc hash (FNV), settlement schedule, **Muqassa greedy netting**. **Mocked behind labeled (`محاكاة`) seams:** Nafath, sarie, ALLaM.
- **Verification (Chrome via Playwright):** **0 JS console errors** (only favicon 404); RTL clean; **Muqassa reduced 9 IOUs → 2 transfers live**. Evidence: `project/ahd-demo/screenshots/ahd-0{1,2,4}-*.png`.

## 5. File map (exact)
- **Leap workspace:** `Amad Obsidian Vault\AMAD-2026\05_Leap\Agent-4\` → `research.md` · `raw-ideas.md` · `concept-ahd.md` (champion A–K) · `concept-amana.md` · `concept-takatuf.md` · `champion.md` (red-team + why-it-leaps) · `wildcard.md` · `prototype.md` (build+verify note).
- **Code:** `project\ahd-demo\` (+ `screenshots\`, `README.md`); helper `project\_serve.cjs`.
- **Shared (append-only):** `AMAD-2026\00_Coordination\master-scoreboard.md` (my Round-2 section) · `lanes.md` (Vector-4 claim + Phase-0 log) · `01_Brief\saudi-fintech-terrain.md` (my Leap addendum).
- **Retired Round-1:** `99_RETIRED\02_Agent-4\` (concepts) · `99_RETIRED\README.md` (kill-list) · build quarantined at `project\99_RETIRED_DO-NOT-OPEN\tadfuq-rizq\`.

## 6. Open threads (next actions, prioritized)
1. **3-min deck + shot-by-shot script** — lead with the *relationship* stakes + the scripture (emotion first), close on "Alinma = the trusted witness of money between people."
2. **Shariah-board + legal validation** — qard-hassan-clean term templates + amana/wakala (flat/no) fee; confirm "bank witnesses & settles, does NOT adjudicate" role (Evidence Law 2022 admissibility + MoJ/Taradhi dispute escalation).
3. **Deepen the data viz** — add a trust-network graph; **Data (15) is the champion's lightest criterion** — over-invest here.
4. (Optional) guest Nafath e-sign for non-customers (cold-start) + the "trust receipt" reputation surface (keep it social, NOT a credit score — that's retired Thiqa/Tadfuq turf).

## 7. Coordination / de-confliction
- ⚠️ **vs A2 [[concept-dhimmah|ذِمّة Dhimmah]]** (clear *existing* debts/rights pre-Hajj): complementary — Dhimmah = *closure of what you owe*; Ahd = *rail to create new* agreements. **Ahd leads on "عهد", not "dhimmah"** to avoid brand overlap.
- ⚠️ **vs A3 [[concept-yusr|Yusr]]** (community qard-hasan pool): Yusr = communal lending pool; Ahd = dyadic witnessed-agreement rail. Different bet.
- Distinct from A1 (Agentic Money). My Mu'allaq wildcard defers to A3's faith-positive lane.
- **Vault has TWO trees** (A1/A3 root `02_Agent-N/`; A2/A4 `AMAD-2026/`); Obsidian wikilinks resolve globally; append—never overwrite—shared files; don't move others' files.

## 8. Pitch facts that win Ahd (memorize)
1. **~50% never write a loan down; 1 in 6 friendships die over money; 30% of borrowers never repay.**
2. **Ayat al-Dayn (Quran 2:282)** — longest verse — commands recording + witnessing debts. **No product exists for it.**
3. Rails are real & 2026: **Nafath e-sign + Evidence Law 2022 (admissible) + sarie auto-settle + ALLaM**.
4. **The bank lends nothing** — it is an **amana/wakala** record-keeper + settlement agent, NOT an adjudicator (disputes → MoJ/Taradhi). Kills the two biggest objections.
5. Uncontested Shariah: **qard hassan + amana — never Tawarruq/maysir/gharar.**

## 9. 🚫 Kill-list (never revive, even renamed)
Tadfuq (OB×ZATCA credit/Tawarruq) · Haseen (scam/APP interceptor) · Rushd/Tayyib (halal-money score) · Namaa (hibah/prize savings) · all Round-1 finalists. Build repo quarantined — do not reopen.

---
*Handoff #12 by Agent 4. Champion artifact lives at `project/ahd-demo/` (verified). All briefs in `Amad Obsidian Vault\AMAD-2026\05_Leap\Agent-4\`.*
