# Ahd role-marker curve refinement — design specification

## Goal

Refine the two small role markers around the approved medial-ha bond so they read as two distinct people: a giver above and a receiver below. Preserve the bond as the dominant visual element.

## Approved direction

Use a balanced mirrored treatment:

- The upper giver uses a circular head above a natural shoulder arch.
- The lower receiver uses a softly rounded square head below an inverted shoulder arch.
- Both markers remain centered on the existing vertical axis and retain their current reduced scale.
- Move both complete markers closer to the adjacent ribbon by roughly one quarter of their current gap. Equalize the optical gaps while retaining a small visible separation; neither marker may touch the bond.

## Curve construction

- The upper shoulder curve is a smooth downward-opening arch beneath the circular head.
- The lower shoulder curve mirrors it vertically as a smooth upward-opening arch above the rounded-square head.
- Use the same stroke weight, terminal rounding, width, and visual density for both shoulder curves.
- Keep each head optically centered on its shoulder curve.
- The lower head must read as a square at presentation size but use a light corner radius so it belongs to the rounded ribbon language.

## Color hierarchy

- Sample the upper marker from the teal family of the ribbon directly beneath it, with enough saturation to remain distinct on the warm off-white background.
- Sample the lower marker from the amber-orange family of the ribbon directly above it, with slightly stronger saturation so the giver and receiver are immediately distinguishable.
- Keep each marker internally coherent: head and shoulder curve use the same local color treatment.
- Do not introduce a third hue, outline, shadow, glow, or label.

## Locked elements

- Preserve the central Arabic medial ha, both outer loops, crossings, ribbon width, palette transition, canvas, background, padding, and border exactly.
- Preserve the current overall scale of the two person markers; only their head geometry, shoulder-curve precision, local color clarity, and distance to the bond may change.
- Do not add arrows, hands, coins, documents, text, facial features, or additional symbols.

## Output

Create one non-destructive PNG candidate:

```text
promo/public/logo/concepts/ahd-role-people-medial-ha-refined-roles.png
```

## Acceptance criteria

- At first glance, the upper role reads as a teal person with a circular head and the lower role as an orange person with a rounded-square head.
- Each shoulder curve is correctly oriented for its marker and the two curves feel like one designed family.
- The role markers sit closer to the bond without touching it or becoming letter dots.
- The teal and orange roles remain distinguishable at 64 px.
- The bond and medial ha remain visually unchanged and dominant.

## Superseding operator refinement

The operator's annotated follow-up supersedes the rounded-square receiver head and short shoulder arcs. The upper and lower shoulder curves must be long and completely separate from the medial ha, with a narrow uniform off-white gap, while precisely paralleling its corresponding outer curve. Keep the upper head circular, change the lower head to a small rounded amber-orange triangle pointing toward its curve, and move both heads closer to their curves. Save the follow-up non-destructively as:

```text
promo/public/logo/concepts/ahd-role-people-medial-ha-long-separated-curves-triangle.png
```
