# Prototype Design Directions (3 standalone) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build three STANDALONE 3-screen mobile prototype sets — «المخطوطة والختم» (Manuscript & Seal), «السدو» (Sadu Weave), «فجر الميسرة» (Dawn of Ease) — each a complete self-contained HTML file, published as its own artifact and cloud-DS card, so the operator picks a direction by looking, not imagining.

**Architecture:** Each direction is one self-contained HTML file in `application/prototypes/` (no shared CSS — standalone by explicit requirement, so deleting two losers costs nothing). All three keep the approved v2 interaction chrome: phone frame, cream bottom sheet + grab handle, rounded row cards with circular action buttons, ceremonial badge screens. Only the visual world (header scene, palette, texture, badge treatment) changes. A fourth chooser page shows all three side-by-side.

**Tech Stack:** Hand-written HTML+CSS (no JS, no network, CSS-drawn scenes only — no image assets), Artifact publishing, DesignSync to the «Ahd Design System» cloud project (projectId `93a7d1f6-1d2e-4175-a68c-0822b9a3c742`), group `Mobile / Directions`.

## Global Constraints

- **Spine (never violate):** no riba copy except negated in the linter demo · trust is a word, never a number · brick-red family reserved for the Shariah stop / tamper only · no `٪`/`%` glyphs · integer SAR («2,500 ريال», never decimals) · «(محاكاة)» on the Nafath button · Qur'anic text verbatim in ﴿﴾.
- **Content is FIXED across all three directions** — copy it verbatim from `application/prototypes/mobile-3screens.html` (v2): screen ① home (أهلًا نورة + 4 rows + verse), screen ② riba stop (terms with «غرامة» underlined, stop card, «البديل الحلال» fix, disabled seal button), screen ③ settlement (٩ ← ٢, 900 بدل 1,800, two transfer rows, conservation line). Directions differ ONLY in visual treatment.
- **Kept from v2 (the operator approved these):** 390×800 phone frame chrome · cream sheet `#faf3e8`-family + grab handle · `.rowc` row-card pattern with circular `.go` buttons · ceremonial badge circle on screens ②③ · stage page with 3 phones + labels.
- Static files: no JS, no external fonts/images (CSS gradients/shapes/text only — artifact CSP blocks external anyway).
- Each file ≤800 lines.
- Repo gate untouched: `cd tests && node run-all.cjs` → `AHD GATE ✅ 1687/0` after every commit (these are static files outside app/tests — any other result means scope escaped).
- Artifacts: one per direction, NEW file paths (new URLs — deliberate: three separate links to compare), favicon 📱, labels `dir-manuscript` / `dir-sadu` / `dir-dawn`.
- Cloud DS: each direction one card in group `Mobile / Directions` via the marker `<!-- @dsCard group="Mobile / Directions" … -->` + explicit register_assets (manifest self-check doesn't run from here).
- The v2 file `mobile-3screens.html` stays untouched (it's the current baseline + live artifact URL).

---

### Task 1: Direction A — «المخطوطة والختم» (Manuscript & Seal)

**Files:**
- Create: `application/prototypes/dir-a-manuscript.html`

**Design spec (standalone world):**
- Palette: aged-paper `#f0e6d2` page ground, deep ink `#2b241a`, gold-leaf `#b8892e`, seal-wax crimson kept ONLY for the riba stop `#8f2c14`; sealed-teal `#0e6b5c` for verified/ok.
- Header scene (replaces night sky): a written parchment world — CSS layered paper sheets with torn-edge feel (border-radius + box-shadow stacking), faint ruled lines (repeating-linear-gradient), an oversized calligraphic «عهد» in gold with an ink-bleed text-shadow, and a wax-seal disc (radial-gradient crimson circle with embossed inner ring) hanging bottom-corner of the scene.
- Badge screens: the ceremonial circle becomes a **wax seal** — radial-gradient disc, inner embossed ring (inset shadows), tiny «عهد» stamped in the center. Teal wax for ✓ (screen ③), reserved-red wax for the stop (screen ②).
- Sheet + rows: keep cream chrome; row icons sit on paper-tone `#efe3c8` squares; gold hairline dividers.
- Verse line rendered as the scene's caption in gold — this direction OWNS the ﴿فَاكْتُبُوهُ﴾ story: add it as the header scene's subtitle on screen ①.

- [ ] **Step 1:** Write the file: copy the v2 stage/phone/sheet skeleton, strip the night-sky block, build the paper header scene + wax badges per spec above, re-skin tokens. Content verbatim from v2.
- [ ] **Step 2:** Self-check against Global Constraints (grep the file: no `%` outside CSS values, `(محاكاة)` present, ﴿﴾ intact, no `<script`, no `http`).
- [ ] **Step 3:** Publish artifact: `Artifact(file_path: application/prototypes/dir-a-manuscript.html, favicon 📱, label dir-manuscript)`.
- [ ] **Step 4:** Commit:

```bash
git add application/prototypes/dir-a-manuscript.html
git commit -m "feat(design): direction A - manuscript & wax-seal world (standalone 3-screen prototype)"
```

---

### Task 2: Direction B — «السدو» (Sadu Weave)

**Files:**
- Create: `application/prototypes/dir-b-sadu.html`

**Design spec (standalone world):**
- Palette: sand `#e8dcc8` ground, Sadu terracotta `#a1442e` (decor only — the riba stop uses a DARKER distinct `#7a2410` with the standard stop-card structure so red-law reads), charcoal `#2e2a26`, off-white `#f6efe2`, teal `#177f6d` for ok/verified.
- Header scene: woven Sadu band — 3-4 horizontal strips of repeating-linear-gradient triangles/diamonds (classic شجرة/عين motifs approximated with CSS conic/linear gradients), slight texture noise via layered translucent stripes. The «عهد» wordmark sits on a charcoal band in sand-colored type.
- Netting story owned by this direction: on screen ③'s header, show 9 thin tangled threads (CSS lines, rotated spans) visually converging into 2 thick woven bands — the weave IS the muqassa.
- Badge screens: circular badge framed by a woven ring (conic-gradient dashes) — teal center ✓ / reserved-red center ✋.
- Sheet + rows: cream chrome kept; row icon tiles get a tiny woven top-border accent (2px gradient stripe).

- [ ] **Step 1:** Write the file (same skeleton discipline as Task 1, content verbatim from v2).
- [ ] **Step 2:** Same self-check greps as Task 1 Step 2.
- [ ] **Step 3:** Publish artifact (label `dir-sadu`).
- [ ] **Step 4:** Commit: `git commit -m "feat(design): direction B - Sadu weave world (standalone 3-screen prototype)"` (after `git add` of the file).

---

### Task 3: Direction C — «فجر الميسرة» (Dawn of Ease)

**Files:**
- Create: `application/prototypes/dir-c-dawn.html`

**Design spec (standalone world):**
- Palette: dawn gradient sky `#f7d9b8 → #e8a87c → #c97d63`, dune sand `#d9c19a` / `#b89a70`, ink `#3a2f28`, cream sheet kept, coral `#d96a55` inherits the approved button accent, teal `#177f6d` ok, reserved-red `#8f2c14` stop.
- Header scene: layered dune silhouettes (3 overlapping ellipse shapes, darker toward viewer), a rising sun disc with soft glow (radial-gradient), 2-3 palm silhouettes (CSS: trunk rect + fan of rotated leaf spans), a few birds (small CSS chevrons) — on screen ③ exactly TWO birds flying (the ٩←٢ echo).
- This direction OWNS the mercy story: ﴿فَنَظِرَةٌ إِلَىٰ مَيْسَرَةٍ﴾ as the header caption on screen ② — ease renders as light.
- Badge screens: sun-disc badge — warm glow rings (box-shadow stacks) around teal ✓ / reserved-red ✋.
- Sheet + rows: unchanged cozy chrome.

- [ ] **Step 1:** Write the file (content verbatim from v2).
- [ ] **Step 2:** Same self-check greps.
- [ ] **Step 3:** Publish artifact (label `dir-dawn`).
- [ ] **Step 4:** Commit: `git commit -m "feat(design): direction C - dawn-of-ease world (standalone 3-screen prototype)"`.

---

### Task 4: Chooser page + cloud DS sync + push

**Files:**
- Create: `application/prototypes/directions-chooser.html` — one page, three columns (A/B/C), each column: direction name AR/EN, one embedded phone (screen ① only, full markup inlined — standalone rule), 3 one-line rationale bullets (which Ahd story it owns), and its artifact link.
- Create: DS upload copies with `@dsCard` first-line markers (group `Mobile / Directions`): `DirAManuscript.html`, `DirBSadu.html`, `DirCDawn.html` (marker + cat of each dir file, same pattern as `Mobile3Screens.html`).

- [ ] **Step 1:** Build chooser page; publish as its own artifact (label `directions-chooser`, favicon 📱).
- [ ] **Step 2:** DesignSync to project `93a7d1f6-1d2e-4175-a68c-0822b9a3c742`: `finalize_plan` (localDir `application/prototypes`, writes `components/mobile-directions/**`, deletes `[]`) → `write_files` (3 files at `components/mobile-directions/<Name>/<Name>.html`) → `register_assets` (3 cards, group `Mobile / Directions`, viewport 1300×940).
- [ ] **Step 3:** Gate check `cd tests && node run-all.cjs` → `AHD GATE ✅ 1687/0`; commit chooser + DS copies; `git push origin main`.
- [ ] **Step 4:** Hand the operator the four artifact links + the DS location; operator picks. Loser files stay in git history; winner becomes the base for the next design iteration (and eventually the mobile skeleton's theme tokens).

---

## Notes

- Deliberately NO shared stylesheet across directions (standalone requirement) — duplication is the feature here, not a DRY violation.
- Judge-lens: prototypes are internal until one wins; score the WINNER against `docs/JUDGE-LENS.md` UX/memorability bars when it's promoted.
- Out of scope: JS interactivity, remaining 14 screens, mobile skeleton build (separate deferred plan), changing v2.
