# Sadu v3 — iOS-grade polish (plan)

**Goal:** Rebuild `application/prototypes/dir-b-sadu.html` (7 screens) to read as a real iPhone app per Apple HIG, keeping the chosen Sadu identity.

**HIG rules applied (from platform-design-ios):**
- Large-title navigation pattern (34px title, small eyebrow, inline on ceremony screens) — Rule 2.3
- Inset-grouped lists: rows merged into single cards with hairline separators, ≥44pt rows — Rule 7.4
- Thumb zone: primary actions pinned toward the sheet bottom — Rule 1.3
- 8pt grid spacing everywhere; touch targets ≥44pt — Rules 1.1/1.5
- One accent (terracotta) for ALL interactive elements; semantic grouped-background hierarchy (sand ground / paper cards) — Rules 4.6/4.7
- Color never alone: stop/ok states carry icon + text — Rule 4.3
- Status bar (٩:٤١) + home indicator chrome; no content under notch — Rule 1.2
- Type hierarchy by size/weight, 11px minimum, tabular numerals — Rules 3.5/3.6

**Kept:** Sadu band signature, SVG 9→2 weave, all Arabic content + spine rules, same file path (artifact URL + DS card update in place).

**Steps:** rewrite file → self-review vs HIG checklist (layout/nav/type/color) → republish artifact → DS sync → gate 1687/0 → commit/push.
