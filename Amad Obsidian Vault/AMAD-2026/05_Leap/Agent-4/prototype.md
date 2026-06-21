---
title: "Leap · Agent 4 — Ahd prototype (built + browser-verified)"
tags: [agent/4, leap, build, prototype]
updated: 2026-06-18
---

# 🛠️ عهد Ahd — working prototype (browser-verified)

**Code:** `project/ahd-demo/index.html` — single-file, offline, deterministic, Arabic-RTL. Run by double-click, or `node project/_serve.cjs` → `http://localhost:8123/`. Docs: `project/ahd-demo/README.md`.

## What it demonstrates (the champion [[concept-ahd]] live)
1. The problem + **Ayat al-Dayn (2:282)**.
2. Create a **qard-hassan** agreement (Noura→Sara, 5,000 SAR) → **ALLaM-style Arabic terms** typed live + **riba-clean check**.
3. **Dual Nafath confirm** → **witnessed record** with a computed hash + "مقبولة كدليل · نظام الإثبات 2022".
4. **Auto-settle via sarie** → **ذمّة محفوظة**.
5. **Muqassa netting** — **9 IOUs → 2 transfers**, real greedy algorithm run live (the data wow).

## Built vs mocked (honest)
- **Really computed + deterministic:** document hash (FNV), settlement schedule, Muqassa greedy netting. No `Date.now`/`Math.random`.
- **Mocked behind labeled seams (`محاكاة`):** Nafath, sarie, ALLaM. Real integrations drop in.

## Verification — browser, not just authored
Served over HTTP, loaded in **Chrome via Playwright**. **Zero JS console errors** (only favicon 404). RTL correct, Arabic clean. Muqassa verified live: 9 → 2 (نورة→خالد 600, نورة→فهد 300). Screenshots: `project/ahd-demo/screenshots/ahd-01-problem.png`, `ahd-02-record.png`, `ahd-04-netting.png`.

## Status vs handoff next-actions
- ✅ **#1 prototype** — DONE + verified (this note).
- ⏳ #2 deck / 3-min script · #3 Shariah+legal validation · #4 deepen the data viz (trust-network) — still open.

## De-confliction (updated post-A2-finalize)
⚠️ **Agent 2's Leap champion is [[concept-dhimmah|ذِمّة Dhimmah]]** (clear *existing* debts/returned-rights/zakat → براءة الذِّمّة, pre-Hajj). My Ahd uses "ذمّة محفوظة" wording but is a **different primitive**: Dhimmah = *closure of what you already owe* (a settlement/clearance ledger); **Ahd = the rail to create + witness + settle *new* money agreements between two specific people.** Complementary (A2 agrees). To avoid brand overlap, Ahd leads on **"عهد / witnessed agreement"**, not on "dhimmah."

## Links
- [[concept-ahd]] · [[champion]] (leap) · [[research]] · [[master-scoreboard]]
