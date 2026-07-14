# Ahd giver/receiver markers — design specification

## Goal

Refine the selected close Ahd bond mark so the two parties read as a giver and a receiver, not as an Arabic letter with a dot above and a diamond below.

## Locked logo geometry

- Preserve the current horizontal two-loop bond, central over-under weave, palette, stroke weight, proportions, and warm off-white background.
- Preserve the teal-to-amber covenant transition through the center.
- Change only the two role cues and, where required, a small directional cue in the amber segment.
- Do not add text, labels, arrows, coins, currency, a handshake, a document icon, or a literal parcel.
- Keep the result minimal and credible as a Saudi fintech mark.

## Variant A — simplified people

Replace the floating circle and diamond with two unmistakable but minimal human figures. The upper figure is the giver: a small head-and-shoulder silhouette with one open, downward-facing gesture. The lower figure is the receiver: a mirrored head-and-shoulder silhouette with a subtle cupped, upward-facing gesture. The figures use the existing teal and amber roles and remain subordinate to the bond.

This is the most human and narrative direction, but it carries the greatest small-size complexity.

## Variant B — giving and receiving hands

Replace the floating shapes with two single-stroke hand glyphs. The upper teal hand releases toward the covenant; the lower amber hand cups upward to receive. A tiny separated amber lozenge may sit inside the central bond only if required to make the transfer legible; it must not float like a diacritic.

This is the clearest transactional story at presentation size, but it may need simplification for the app icon.

## Variant C — roles integrated into the endpoints

Remove all floating marks. Build the giver cue into the left opening of the bond and the receiver cue into the right opening, using minimal person-profile or open/cupped-end negative space. The amber center subtly flows from giver to receiver. The outer silhouette remains almost unchanged.

This is the recommended direction because it cannot be mistaken for Arabic dots, keeps the logo compact, and scales best.

## Output

Generate three separate square PNG candidates on the same warm off-white background, with matching scale and padding:

```text
promo/public/logo/concepts/ahd-role-people.png
promo/public/logo/concepts/ahd-role-hands.png
promo/public/logo/concepts/ahd-role-integrated.png
```

## Acceptance criteria

- Every candidate remains immediately recognizable as the current Ahd bond mark.
- The old circle-above/diamond-below diacritic reading is removed.
- A viewer can infer two parties, transfer, and continuing connection without a caption.
- The giver and receiver are equal in dignity; neither appears dominant, judged, scored, indebted, or shamed.
- The bank remains the witnessing bond, not a lender or judge.
- Each variant is materially different and remains legible when reduced to 64 px.
