# Ahd medial-ha refinement — design specification

## Goal

Refine the user-selected people variant so its large central loop reads clearly and elegantly as the Arabic medial letter ha, `ـهـ`, without disturbing the bond or the giver/receiver story.

## Locked elements

- Preserve both simplified people exactly: teal giver above and amber receiver below.
- Preserve both outer teal loops, the horizontal silhouette, stroke weight, scale, palette, and warm off-white background.
- Preserve the over-under bond logic and the teal-to-amber covenant transition.
- Change only the geometry of the large central loop and the minimum adjacent crossing needed to construct `ـهـ`.

## Letter construction

- Build `ـهـ` from the existing center ribbon itself; do not place a separate typed character inside or on top of the mark.
- Use one clean internal counter and the characteristic medial-ha crossing/waist so an Arabic reader recognizes `هـ` at first glance.
- Keep the ribbon thickness consistent with the rest of the logo.
- Let teal enter the ha from the giver side and amber resolve through its lower covenant stroke toward the receiver.
- Avoid turning the letter into `م`, `ع`, `ة`, an eye, an infinity loop, or decorative calligraphy.

## Output

Create one non-destructive candidate:

```text
promo/public/logo/concepts/ahd-role-people-medial-ha.png
```

## Acceptance criteria

- The logo remains immediately recognizable as the selected people-and-bond variant.
- The center reads as `ـهـ` without explanation at presentation size.
- The letter remains plausible at 64 px and does not become visual noise.
- The giver, receiver, and continuing bond stay equal in emphasis and dignity.
- No text, labels, arrows, coins, documents, extra symbols, shadows, or 3D effects are introduced.

## Approved follow-up refinement

After reviewing the medial-ha candidate, the operator requested one isolated scale change: reduce both complete person symbols to about 70% of their previous size while keeping their centers on the same vertical axis. The head and shoulder stroke scale together; the bond, ha, palette, spacing system, canvas, and all other geometry remain unchanged.

The follow-up is saved non-destructively as:

```text
promo/public/logo/concepts/ahd-role-people-medial-ha-small-people.png
```
