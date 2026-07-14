# Ahd Medial-Ha Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the selected logo's central loop into a clear, elegant Arabic medial ha, `ـهـ`, while preserving the people and bond.

**Architecture:** Use the user's selected PNG as a precise edit target and change only the center loop. Persist the result as a new candidate, inspect it at full size and 64 px, and keep all prior candidates untouched.

**Tech Stack:** Built-in OpenAI image editing, PNG asset, local thumbnail inspection.

## Global Constraints

- Preserve both simplified people, both outer loops, all colors, stroke weight, scale, padding, and background.
- Build `ـهـ` from the center ribbon itself, not from typed text or a separate overlay.
- Preserve the over-under bond and teal-to-amber covenant transition.
- Avoid `م`, `ع`, `ة`, an eye, an infinity loop, extra symbols, text, arrows, shadows, gradients, and 3D effects.
- Save non-destructively as `promo/public/logo/concepts/ahd-role-people-medial-ha.png`.

---

### Task 1: Generate the Medial-Ha Candidate

**Files:**
- Create: `promo/public/logo/concepts/ahd-role-people-medial-ha.png`

**Interfaces:**
- Consumes: `C:/Users/wasan/clipboard-pastes/paste-20260715-003512-524.png` as the edit target.
- Produces: one square PNG candidate.

- [ ] **Step 1: Generate the targeted edit**

```text
Use case: precise-object-edit
Asset type: Ahd logo medial-ha refinement
Input image: Image 1 is the exact edit target. Preserve every element except the large central loop.
Primary request: reshape only the large center ribbon loop into a clean Arabic medial letter ha, «ـهـ», constructed from the same continuous ribbon. The ha must have a clear internal counter and characteristic medial-ha waist/crossing, readable to an Arabic reader at first glance. Keep the existing over-under relationship. Teal enters the ha from the upper giver side; amber resolves through the lower covenant stroke toward the receiver.
Constraints: keep both people, both outer loops, colors, stroke width, spacing, scale, canvas, background, and all non-center geometry unchanged. The letter must feel drawn by the bond itself, not pasted on.
Avoid: typed text overlay, isolated ه, ة, م, ع, eye symbol, infinity symbol, extra loop, extra dot, arrow, coin, document, gradient, shadow, 3D, watermark.
```

- [ ] **Step 2: Inspect and iterate once if required**

Reject if the center does not read as `ـهـ` or if the people/outer bond drift. If necessary, perform one targeted edit that changes only the ha counter or waist.

- [ ] **Step 3: Persist the candidate**

Copy the accepted PNG to the exact output path without replacing any prior candidate.

### Task 2: Validate and Present

- [ ] **Step 1: Inspect at 64 px**

Confirm the people, bond, and ha remain distinct when reduced to 64 px.

- [ ] **Step 2: Run the project gate**

```powershell
node tests/run-all.cjs
```

Expected: all assertions green and the frozen demo tripwire unchanged.

- [ ] **Step 3: Present the candidate**

Show the new PNG inline and state that it is a candidate pending user approval; do not replace the approved logo asset.
