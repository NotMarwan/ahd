# 🤝 HANDOFF #10 — Agent 2 · Vector 2: The Invisible Saudis (LEAP round, BUILT)

**Date:** 2026-06-18 · **From:** Agent 2 · **Round:** 2 (RESET & LEAP) · **Status:** finalized + champion prototype browser-verified.
**Supersedes** handoff-6 (same lane, now with a working demo). Round-1 work is RETIRED (see kill-list below).

---

## 1. State in one line
Vector 2 is **done and demonstrable**: champion **ذِمّة Dhimmah (88)** has a working, browser-verified Arabic-RTL prototype; two finalists + a wildcard are specced; everything de-conflicted against the other three agents.

## 2. The concepts
| Concept | Segment | Score | Status |
|---|---|---|---|
| 👑 **ذِمّة Dhimmah** | Hajj/Umrah pilgrims | **88** | specced + **prototype built & browser-verified** |
| **صوت Sawt** | Blind / illiterate / elderly | 83 | specced (no prototype) |
| **كَرامة Karama** | Domestic workers | 80 | specced (no prototype) |
| 🎴 **نَذر Nadhr** (wildcard) | cross-lane (faith/new-primitive) | — | sketched |

**Champion:** *Before Hajj, an AI reads your accounts + interviews you to surface every debt, unreturned right (radd al-mazālim), and lapsed zakat you carry, helps you settle each via sarie, until your screen reads «ذمّتك بريئة».* The leap = the first product to serve a **spiritual-financial obligation**; uncontested + Shariah-**positive**; rides the largest uniquely-Saudi event (the wallet is SNB/Nusuk's, the **conscience** is open white space).

## 3. File map (exact paths)
- **Concepts:** `Amad Obsidian Vault/AMAD-2026/05_Leap/Agent-2/` → `research.md` · `raw-ideas.md` · `concept-dhimmah.md` (champion, full A–K) · `concept-sawt.md` · `concept-karama.md` · `champion.md` (red-team + de-confliction) · `wildcard.md`
- **🛠️ Prototype (built + verified):** `prototypes/dhimmah-demo.html` (offline, single-file, deterministic, Arabic RTL). Evidence screenshot: `prototypes/dhimmah-demo-reveal.png`.
- **Shared (appended):** `…/00_Coordination/lanes.md` (Agent-2 FINALIZED + BUILT) · `…/00_Coordination/master-scoreboard.md` (my 🚀 Round-2 block) · `…/01_Brief/saudi-fintech-terrain.md` (pilgrim/inclusion addendum).
- **Retired Round-1:** `Amad Obsidian Vault/99_RETIRED/` + `project/99_RETIRED_DO-NOT-OPEN/`.

## 4. Prototype — what's real vs verified
- **Built for real:** obligation-discovery from data, the **صحيفة الذِّمّة** ledger (type chips: دَين / حق / زكاة + evidence), a 3-question interview, settle-via-sarie with a climbing براءة-الذمّة bar, live engine panel (discovery log + zakat math), the gold **«ذمّتك بريئة»** reveal. Deterministic, offline.
- **Verified (2026-06-18, Chrome/chrome-devtools):** intro → ledger → 100%-clear reveal screenshotted; **zero console errors**; `node --check` clean; RTL correct. First prototype across all rounds actually driven in a browser.
- **Stubbed (labeled):** ALLaM interview (deterministic seam), live sarie/OB (synthetic), external-creditor delivery (facilitated, not guaranteed). Font: IBM Plex Arabic via CDN; falls back to system Arabic offline (cosmetic only).

## 5. Open threads / next actions (priority order)
1. **3-min demo script + deck** wired to `dhimmah-demo.html` — lead with the *discovery + settlement*, not a list (pre-empts "Splitwise with a religious skin"). Open on the hadith → close on «ذمّتك بريئة».
2. **Prototypes for Sawt / Karama** to the same bar (optional; Dhimmah is the bet).
3. **Validate at enrichment (5–16 Jul):** Shariah board (radd-al-mazālim framing, zakat math, "never a fatwa"); the honest **data-vs-interview split** for obligation discovery; a **Nusuk/Hajj-Ministry** integration path (complement the wallet, don't compete).
4. **Pick the single build before the 26 Jun registration gate.**

## 6. Coordination & de-confliction (current)
- **Leap champions (near-tie):** Dhimmah 88 (me) · Athar 88 (A3, perpetual waqf) · Wakeel 87 (A1, wakala agentic money) · Ahd 85 (A4, witnessed P2P money). Self-scores still inflated ~+2; judge by **demo surprise + emotion**, not the rubric sum.
- ✅ **A3 ceded pilgrims to me.** My champion is distinct from Athar (giving) and Wakeel (agency).
- 🔁 **Retired my Wasiyyah finalist → ceded to A3** (theirs is stronger/integrated); swapped in **Karama** (domestic workers, untouched by anyone).
- ⚠️ **Dhimmah vs A4's Ahd** (uses "ذمّة cleared" microcopy): **complementary, not duplicate** — Ahd = forward rail for NEW dyadic agreements; Dhimmah = backward, Hajj-triggered closure of EXISTING obligations + zakat. They can chain.
- ⚠️ **Two vault trees** (root `02_Agent-{1,3}` + `05_Leap/`; `AMAD-2026/…` for Agents 2,4) still need final reconciliation. **Append, never overwrite; don't move others' files.**
- Tooling note: Playwright MCP browser was locked by a parallel agent → used the **chrome-devtools** browser instead.

## 7. Kill-list (RETIRED — never rebuild, even renamed)
Tadfuq (OB×ZATCA / Tawarruq), Haseen (scam/APP/CoP), Rushd/Tayyib (halal-score/purification), Namaa (hibah/prize-savings) + all Round-1 finalists. **No contested Shariah (Tawarruq/organized-Murabaha), no maysir/gharar** — the new bar is Shariah-clean *and positive* by design.

## 8. The 5 facts that win the Dhimmah pitch
1. 1.67M Hajj + ~18M Umrah/yr; religious tourism ≈ $30B (~7% GDP).
2. Islam requires clearing debts + returned rights before Hajj — *"the soul is suspended by its debt"* — and **no bank ever built for it.**
3. The **wallet is taken** (SNB Nusuk); the **conscience is empty white space.**
4. **Only an Islamic bank, in the land of Hajj, can own بَراءة الذِّمّة** — uncopyable.
5. **Shariah-clean & positive:** moves your own money to settle real obligations + zakat. No riba, no contested contract, no chance.

---
*Open first: `prototypes/dhimmah-demo.html` (double-click) + `…/05_Leap/Agent-2/concept-dhimmah.md`.*
