# Ahd Role-Marker Curves Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the two small person markers so the upper giver has a circular teal head, the lower receiver has a softly rounded orange square head, both curves are correctly oriented, and both markers sit closer to the unchanged bond.

**Architecture:** Use the current approved PNG as a precise edit target. Change only the two person markers, save a new sibling candidate, inspect it at full size and 64 px, then update the brand-status note without replacing any approved application asset.

**Tech Stack:** Built-in OpenAI image editing, PNG asset, PowerShell `System.Drawing` validation, project test gate.

## Global Constraints

- Preserve the central medial ha, outer loops, crossings, ribbon width, palette transition, canvas, warm off-white background, padding, and border exactly.
- Keep both role markers at their current reduced scale and on the same vertical axis.
- Move both complete markers toward the adjacent ribbon by roughly one quarter of their current gap while retaining a visible separation.
- The upper marker uses a circular head and downward-opening teal shoulder arch.
- The lower marker uses a softly rounded square head and upward-opening amber-orange shoulder arch.
- The head and shoulder curve of each person use one coherent local color treatment.
- Save non-destructively as `promo/public/logo/concepts/ahd-role-people-medial-ha-refined-roles.png`.
- Do not modify `demo/index.html` or any approved application logo asset.

---

### Task 1: Generate the Refined Role-Marker Candidate

**Files:**
- Consume: `promo/public/logo/concepts/ahd-role-people-medial-ha-small-people.png`
- Create: `promo/public/logo/concepts/ahd-role-people-medial-ha-refined-roles.png`

**Interfaces:**
- Consumes: one 1254×1254 square PNG edit target.
- Produces: one square PNG candidate with only the two role markers changed.

- [x] **Step 1: Inspect the edit target**

Open the source PNG at original detail and confirm the bond and role-marker geometry before editing.

- [x] **Step 2: Generate one precise edit**

Use the built-in image editor with this specification:

```text
Use case: precise-object-edit
Asset type: Ahd logo role-marker refinement
Input image: Image 1 is the exact edit target.
Primary request: Change only the two small person markers. Upper marker: circular head above a smooth downward-opening shoulder arch, both in a saturated teal sampled from the adjacent upper ribbon. Lower marker: softly rounded square head below a smooth upward-opening shoulder arch, both in a clearly distinct saturated amber-orange sampled from the adjacent lower ribbon. Keep both markers at their current reduced size and centered on the same vertical axis. Move each complete marker toward the central bond by about one quarter of its current gap, leaving a small visible separation and no contact.
Constraints: preserve the central Arabic medial ha, both outer loops, crossings, ribbon geometry, stroke weight, gradients, background, border, canvas size, padding, and every non-marker element exactly.
Avoid: redrawing the bond, touching markers, letter-dot appearance, sharp lower-head corners, extra hues, outlines, text, arrows, shadows, glow, watermark, crop, or added symbols.
```

- [x] **Step 3: Persist the candidate**

Copy the generated image into the exact output path without overwriting the source or any earlier candidate.

### Task 2: Validate the Candidate

**Files:**
- Validate: `promo/public/logo/concepts/ahd-role-people-medial-ha-refined-roles.png`

**Interfaces:**
- Consumes: the generated square PNG.
- Produces: visual and project-gate evidence for delivery.

- [x] **Step 1: Verify file dimensions**

Run a `System.Drawing` check and require a square image with the expected 1254×1254 dimensions.

- [x] **Step 2: Inspect at full size**

Confirm the top head is circular, the bottom head is a softly rounded square, the shoulder arches are oppositely oriented, colors are clearly teal versus amber-orange, markers are closer without touching, and the bond remains unchanged.

- [x] **Step 3: Inspect at 64 px**

Create a temporary 64×64 thumbnail, verify both roles remain distinct, then remove the temporary file from inside the worktree.

- [x] **Step 4: Run the project gate**

```powershell
node tests/run-all.cjs
```

Expected: `AHD GATE ✅ 2869/0` and the frozen demo tripwire remains unchanged.

### Task 3: Record and Commit the Candidate

**Files:**
- Modify: `AmadHackathon/00 Home.md`
- Modify: `AmadHackathon/01 الخطة الرئيسة.md`
- Modify: `AmadHackathon/10 هوية الشعار.md`
- Modify: `docs/superpowers/plans/2026-07-15-ahd-role-marker-curves.md`

**Interfaces:**
- Consumes: the validated candidate and gate evidence.
- Produces: a traceable brand candidate and project-state update.

- [x] **Step 1: Update project status**

Record the new candidate path, the approved circle-versus-rounded-square distinction, the closer spacing, and the fact that no approved app or demo asset was replaced.

- [x] **Step 2: Run final checks**

```powershell
git diff --check
node tests/run-all.cjs
```

Expected: no whitespace errors, `2869/0`, and the frozen demo tripwire unchanged.

- [x] **Step 3: Commit**

```powershell
git add -- 'promo/public/logo/concepts/ahd-role-people-medial-ha-refined-roles.png' 'AmadHackathon/00 Home.md' 'AmadHackathon/01 الخطة الرئيسة.md' 'AmadHackathon/10 هوية الشعار.md' 'docs/superpowers/plans/2026-07-15-ahd-role-marker-curves.md'
git commit -m "design(brand): refine giver and receiver markers"
```
