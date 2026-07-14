# Ahd Giver/Receiver Markers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce three Ahd logo candidates that preserve the selected bond while making giver, receiver, and connection readable without diacritic-like floating dots.

**Architecture:** Use the user's selected close-refinement PNG as a high-fidelity edit target. Generate one separate PNG per marker system and reject any output that redesigns the horizontal bond. Validate each candidate at full size and 64 px before presenting them.

**Tech Stack:** Built-in OpenAI image editing, PNG assets, local thumbnail inspection.

## Global Constraints

- Preserve the horizontal two-loop bond, central over-under weave, teal-to-amber center, stroke weight, palette, scale, and warm off-white background.
- Remove the old floating teal circle and amber diamond.
- No text, arrows, labels, coins, currency, handshake, document icon, literal parcel, new emblem, or extra loop.
- Giver and receiver must have equal dignity; neither may look dominant, judged, scored, or shamed.
- Save each output non-destructively under `promo/public/logo/concepts/`.

---

### Task 1: Variant A — Simplified People

**Files:**
- Create: `promo/public/logo/concepts/ahd-role-people.png`

**Interfaces:**
- Consumes: `C:/Users/wasan/clipboard-pastes/paste-20260715-001154-606.png` as the edit target.
- Produces: one square PNG with upper giver and lower receiver human cues.

- [ ] **Step 1: Generate the candidate**

```text
Use case: precise-object-edit
Asset type: Ahd logo role-marker refinement, Variant A
Input image: Image 1 is the edit target. Preserve the interwoven bond exactly; change only the floating circle and diamond.
Primary request: replace the upper teal circle with a minimal giver figure made from a tiny round head, short shoulder arc, and one open downward-facing gesture. Replace the lower amber diamond with an equally minimal receiver figure made from a round head, short shoulder arc, and a cupped upward-facing gesture. Both figures are abstract single-color vector glyphs and equal in visual weight.
Composition: same centered square mark, same scale and padding, same warm off-white background.
Constraints: no free-floating dot or diamond; people must read as people at first glance; no facial details; preserve every pixel-level relationship of the bond as closely as possible.
Avoid: redesigning the bond, text, arrows, emoji, detailed bodies, handshake, coins, document, gradients, shadows, 3D, watermark.
```

- [ ] **Step 2: Inspect and persist**

Reject if either figure resembles a letter dot, punctuation, gender icon, or decorative ornament. Save the accepted output to the exact path above.

### Task 2: Variant B — Giving and Receiving Hands

**Files:**
- Create: `promo/public/logo/concepts/ahd-role-hands.png`

**Interfaces:**
- Consumes: the same selected edit target independently.
- Produces: one square PNG with upper giving hand and lower receiving hand.

- [ ] **Step 1: Generate the candidate**

```text
Use case: precise-object-edit
Asset type: Ahd logo role-marker refinement, Variant B
Input image: Image 1 is the edit target. Preserve the interwoven bond exactly; change only the floating circle and diamond.
Primary request: replace the upper teal circle with one minimal flat open-hand glyph angled downward as a giving gesture. Replace the lower amber diamond with one minimal flat cupped-hand glyph facing upward as a receiving gesture. The two glyphs use the same restrained stroke language and equal visual weight. Let the existing amber center imply what passes between them; do not add an object.
Composition: same centered square mark, same scale and padding, same warm off-white background.
Constraints: hands must be simplified enough for a logo but still recognizable; no floating dot or diamond; preserve the bond geometry and colors unchanged.
Avoid: arrows, parcel, coin, currency, handshake, realistic fingers, emoji, redesigning the bond, text, gradient, shadow, 3D, watermark.
```

- [ ] **Step 2: Inspect and persist**

Reject if the hands are too detailed, look religious, or overpower the bond. Save the accepted output to the exact path above.

### Task 3: Variant C — Roles Integrated into Bond Endpoints

**Files:**
- Create: `promo/public/logo/concepts/ahd-role-integrated.png`

**Interfaces:**
- Consumes: the same selected edit target independently.
- Produces: one square PNG with no floating markers and role cues inside the left/right openings.

- [ ] **Step 1: Generate the candidate**

```text
Use case: precise-object-edit
Asset type: Ahd logo role-marker refinement, Variant C
Input image: Image 1 is the edit target. Preserve the bond, center weave, palette, and horizontal silhouette with maximum fidelity.
Primary request: remove both floating markers completely. Integrate a tiny simplified giver profile into the negative space at the left opening of the bond and an equal receiver profile into the negative space at the right opening. The left profile has a subtle open/releasing gesture toward the center; the right profile has a subtle cupped/receiving gesture toward the center. The amber center flows continuously between them and remains the covenant.
Composition: same centered square mark, same scale and padding, same warm off-white background.
Constraints: do not add anything above or below the mark; role cues must be cut from or nested into the existing endpoint negative space; preserve the overall outer silhouette almost exactly; readable at 64 px.
Avoid: floating dots, diamonds, arrows, text, faces with features, gender icons, hands with detailed fingers, extra loops, new emblem, gradient, shadow, 3D, watermark.
```

- [ ] **Step 2: Inspect and persist**

Reject if the endpoints stop reading as the original bond or if the human cues disappear entirely at 64 px. Save the accepted output to the exact path above.

### Task 4: Validation and Presentation

- [ ] **Step 1: Validate files and thumbnails**

Confirm all three PNGs exist, have matching square dimensions, preserve the bond, remove the diacritic-like reading, and remain distinct at 64 px.

- [ ] **Step 2: Run the project gate**

```powershell
node tests/run-all.cjs
```

Expected: all assertions green and the frozen demo tripwire unchanged.

- [ ] **Step 3: Present the candidates**

Show all three images inline with concise labels and a recommendation. Do not replace an approved logo until the user selects a candidate.
