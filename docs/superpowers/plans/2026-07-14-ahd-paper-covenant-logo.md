# Ahd Paper-Covenant Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce three materially different, bank-grade Ahd logo concepts that read as paper covenants rather than a DNA helix.

**Architecture:** Use the supplied logo board as the edit target and conceptual anchor, but generate each concept as a separate square image with one centered symbol. Keep all three on the same warm off-white background, scale, palette, and flat vector-like presentation so selection is based on geometry. Persist the three candidates under `promo/public/logo/concepts/` without overwriting any approved logo asset.

**Tech Stack:** Built-in OpenAI image generation, local visual inspection, PNG assets.

## Global Constraints

- The symbol represents two people joined by a written, witnessed covenant.
- Remove smooth sinusoidal waves and bilateral double-helix symmetry.
- Use explicit paper cues: flat-cut ends, angular folds, document corners, or folded sheet geometry.
- Use deep trust teal, supporting teal, dignified amber/gold, and warm off-white.
- Flat vector-like construction only: no 3D, shadows, gradients, mockups, watermark, captions, Latin letters, coins, crescents, bank pillars, chain links, or biological imagery.
- One centered symbol per square image with generous padding; no wordmark at this comparison stage.
- Preserve the project spine: the logo must not imply that Ahd lends, judges, scores, penalizes, or issues religious rulings.

---

### Task 1: Generate Concept A — Folded-Paper Bond

**Files:**
- Create: `promo/public/logo/concepts/ahd-paper-covenant-a.png`

**Interfaces:**
- Consumes: supplied logo board at `C:/Users/wasan/clipboard-pastes/paste-20260714-233724-020.png` as the edit target and conceptual anchor.
- Produces: a square PNG candidate with one centered folded-paper bond symbol.

- [ ] **Step 1: Generate the concept**

Use the built-in image generation edit flow with the following prompt:

```text
Use case: logo-brand
Asset type: Ahd logo refinement, Concept A
Input images: Image 1 is the existing logo board and edit target; preserve its core idea of two parties meeting at a covenant, but redesign the symbol geometry.
Primary request: refine the existing interlocking mark into two distinct folded paper ribbons approaching from opposite sides, overlapping once, and meeting at one small amber covenant fold or seal in the center.
Style/medium: premium flat vector logo mark; minimal; bank-grade; strong silhouette.
Composition/framing: one centered symbol only, square canvas, generous equal padding, warm off-white background.
Color palette: deep trust teal, supporting muted teal, dignified amber/gold, warm off-white.
Constraints: make paper unmistakable through flat-cut ends, angular folds, and restrained negative space; preserve the two-parties-one-covenant idea; use asymmetry and straight segments to remove any DNA or infinity reading; legible at 24 px; no text.
Avoid: DNA helix, sine waves, infinity symbol, chain links, generic technology icon, 3D, gradients, shadows, mockups, watermark, coins, crescents, bank pillars, decorative scene.
```

- [ ] **Step 2: Inspect against the acceptance criteria**

Confirm that the mark reads first as two folded paper ribbons, has one visual center, does not resemble DNA/infinity, and remains plausible when mentally reduced to favicon size.

- [ ] **Step 3: Persist the candidate**

Copy the generated PNG to `promo/public/logo/concepts/ahd-paper-covenant-a.png` without replacing `promo/public/logo/ahd-mark.png` if it exists.

### Task 2: Generate Concept B — Two Witnessed Documents

**Files:**
- Create: `promo/public/logo/concepts/ahd-paper-covenant-b.png`

**Interfaces:**
- Consumes: supplied logo board as the conceptual anchor; does not depend on Concept A's pixels.
- Produces: a square PNG candidate with two equal document forms and one shared seal.

- [ ] **Step 1: Generate the concept**

Use the built-in image generation edit flow with the following prompt:

```text
Use case: logo-brand
Asset type: Ahd logo refinement, Concept B
Input images: Image 1 is the existing logo board and edit target; preserve only the meaning of two parties joined by a covenant, not its wave geometry.
Primary request: redesign the mark as two minimal document sheets facing one another and partially interlocking at the center; their inward folded corners create one small amber diamond seal in negative space.
Style/medium: premium flat vector logo mark; minimal; neutral institutional confidence; strong compact silhouette.
Composition/framing: one centered symbol only, square canvas, generous equal padding, warm off-white background.
Color palette: deep trust teal and supporting muted teal for the two equal documents, dignified amber/gold only at the shared covenant seal.
Constraints: equal visual weight for both documents to express a neutral witness; obvious paper corners and folds; distinct from a chain, book, heart, or handshake; legible at 24 px; no text.
Avoid: DNA helix, sine waves, infinity symbol, chain links, generic document stock icon, 3D, gradients, shadows, mockups, watermark, coins, crescents, bank pillars, decorative scene.
```

- [ ] **Step 2: Inspect against the acceptance criteria**

Confirm that both documents have equal weight, the shared covenant is visually central, and the geometry does not collapse into a generic file or chain icon.

- [ ] **Step 3: Persist the candidate**

Copy the generated PNG to `promo/public/logo/concepts/ahd-paper-covenant-b.png`.

### Task 3: Generate Concept C — Geometric Arabic Paper Covenant

**Files:**
- Create: `promo/public/logo/concepts/ahd-paper-covenant-c.png`

**Interfaces:**
- Consumes: supplied logo board as the conceptual anchor; does not depend on the pixels of Concepts A or B.
- Produces: a square PNG candidate with two folded strokes and a subtle Arabic «ع» in negative space.

- [ ] **Step 1: Generate the concept**

Use the built-in image generation edit flow with the following prompt:

```text
Use case: logo-brand
Asset type: Ahd logo refinement, Concept C
Input images: Image 1 is the existing logo board and edit target; preserve its teal-and-amber covenant meaning while creating a materially different compact emblem.
Primary request: build one geometric emblem from two folded paper strokes; their meeting creates a subtle Arabic letter «ع» in negative space and a small amber central covenant fold.
Style/medium: premium flat vector logo mark; minimal; Arabic-native; distinctive app-icon silhouette.
Composition/framing: one centered compact symbol only, square canvas, generous equal padding, warm off-white background.
Color palette: deep trust teal, supporting muted teal, one restrained dignified amber/gold center.
Constraints: the Arabic «ع» must be subtle rather than illustrated calligraphy; flat paper ends and angular folds must remain visible; no mirrored wave structure; legible at 24 px; no added text.
Avoid: DNA helix, sine waves, infinity symbol, chain links, Latin letters, calligraphy clutter, generic technology icon, 3D, gradients, shadows, mockups, watermark, coins, crescents, bank pillars, decorative scene.
```

- [ ] **Step 2: Inspect against the acceptance criteria**

Confirm that the emblem is materially different from A and B, the paper construction survives, the Arabic reference is subtle, and the silhouette remains clear at small size.

- [ ] **Step 3: Persist the candidate**

Copy the generated PNG to `promo/public/logo/concepts/ahd-paper-covenant-c.png`.

### Task 4: Final Comparison and Project Record

**Files:**
- Modify: `AmadHackathon/00 Home.md`
- Modify: `AmadHackathon/01 الخطة الرئيسة.md`
- Modify: `AmadHackathon/09 نقل التصميم إلى Figma.md`

**Interfaces:**
- Consumes: the three candidate PNGs.
- Produces: a concise project-state note and a user-facing three-way selection.

- [ ] **Step 1: Compare the three candidates consistently**

Review each candidate for DNA avoidance, paper clarity, central covenant clarity, 24 px silhouette, monochrome plausibility, project palette consistency, distinctiveness, and judge-stage memorability.

- [ ] **Step 2: Record project state additively**

Append a dated note to the existing Obsidian pages without replacing or reverting their current content. Record that three paper-covenant logo candidates were created for selection and link to this plan, the design specification, and the three PNG paths.

- [ ] **Step 3: Present the candidates**

Show all three PNGs inline, label them A/B/C outside the images, give one short trade-off per concept, and ask the user to select one for the final wordmark and production variants.
