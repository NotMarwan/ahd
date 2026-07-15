# Adopt the Approved Ahd Logo — Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Make the approved paper-ribbon mark the single primary Ahd logo across the publishable app, promo renderer, GitHub repository front page, and project map without changing the frozen presenter demo.

**Architecture:** Keep one canonical checked-in PNG under `assets/brand/`, with byte-identical deployment copies inside the offline app and Remotion public roots. A contract test verifies identity, references, and the navigator manifest so later changes cannot silently drift.

**Tech Stack:** PNG assets, vanilla HTML/CSS/JS, Remotion/TypeScript, Node.js contract tests, JSON project manifest, Markdown.

---

### Task 1: Add the failing brand contract

**Files:**
- Create: `tests/app/brand-logo.test.cjs`

1. Assert that canonical, app, and promo assets exist and share the same SHA-256.
2. Assert that the app favicon/home, promo toggle, README, and project map reference the approved mark.
3. Run the test and confirm it fails before the deployment files exist.

### Task 2: Deploy the approved mark

**Files:**
- Create: `assets/brand/ahd-logo.png`
- Create: `app/assets/ahd-logo.png`
- Create: `promo/public/logo/ahd-mark.png`
- Modify: `app/index.html`
- Modify: `app/screens/home.js`
- Modify: `app/app.css`
- Modify: `promo/src/sadu.ts`
- Modify: `promo/public/logo/README.txt`
- Modify: `README.md`

1. Copy the approved concept byte-for-byte to all three runtime locations.
2. Replace the app's old inline emblem and favicon reference.
3. Enable the promo asset and add the canonical mark to the GitHub README.

### Task 3: Record the decision and map the asset

**Files:**
- Modify: `project/mcp/packages/ahd-navigator/src/project-map.json`
- Modify: `project/mcp/packages/ahd-navigator/src/__tests__/project-map.test.ts`
- Modify: `docs/DESIGN.md`
- Modify: `AmadHackathon/00 Home.md`
- Modify: `AmadHackathon/01 الخطة الرئيسة.md`
- Modify: `AmadHackathon/10 هوية الشعار.md`

1. Add the primary brand paths to the structured project map.
2. Mark the logo decision as approved and adopted in canonical documentation and the operator cockpit.
3. Score the judge-visible change against the five criteria; open no `JL-` item if every score is at least 8.

### Task 4: Verify and publish

1. Run the new contract test and navigator manifest test.
2. Run the complete Ahd gate and verify the demo tripwire.
3. Commit, push `codex/ahd-paper-logo`, open a ready pull request to `main`, and merge it after checks pass.
