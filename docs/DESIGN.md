# عهد · Ahd — Design System

> **Current consolidated reference:** [Ahd full application design](AHD-FULL-DESIGN.md). This file remains the historical design-system foundation; the consolidated reference resolves the live screen, Sadu, responsive-layout, density, and mobile-portability state.

> The visual identity of an interest-free banking prototype: dignity-first, Arabic-native,
> Shariah-aligned, and deterministically rendered.

## Primary brand mark

The approved mark depicts two linked people around a paper-ribbon medial **haa**: a teal circular giver above and an amber triangular receiver below. Their separate curves follow the protected bond without merging into the letter. The canonical repository asset is `assets/brand/ahd-logo.png`; the offline app and promo renderer carry byte-identical deployment copies.

---

## 1 · فلسفة التصميم · Design Philosophy

### Dignity-first (الكرامة أولاً)
Every visual decision starts with the question: *does this preserve the dignity of both parties?*
- "Late" is **amber** — warmth and attention, not alarm. Red is reserved for structural failures
  (tamper detection, critical errors), never for a person's financial state.
- No countdowns, no shaming day-counters, no red badges on overdue amounts.
- The debtor never sees a number counting days since due. The reminder is a gentle nudge, not a demand.

### Witness, not judge
The bank's visual language is **neutral, observant, archival** — like a notary or registrar.
- The seal metaphor (SHA-256 hash) is the central visual motif: something witnessed, locked, and provable.
- Dispute screens are visually calm — no verdict iconography, no winner/loser framing.
- The proof-pack opens as a **neutral exhibit** («دليلٌ محايد»), not an accusation.

### Arabic-first, RTL-native
- Arabic is the source language. English translations are secondary annotations.
- Layout flows right-to-left at the system level: nav, cards, text alignment, reading order.
- Arabic-Indic digits are available as a user toggle (not a design default, to preserve engine byte-identity).

### Anti-score
- Trust status is expressed as a **word** («وفّى بعهوده», «جديد», «متأخّر»), never a number, percentage, or grade.
- Progress is shown with **proportional bars** (flex-grow, no percentage text) + exact amounts.
- The trust ring visualization uses filled arc segments to show kept-promise ratio, but **no numeric label**
  — the ring is a qualitative signal, not a metric.

### Deterministic rendering
- No animations driven by `Date.now` or random seeds.
- Every layout is fixed against a single `AS_OF` date. What you see at load is what any viewer sees.

---

## 2 · Color Palette

### Primary: Trust Teal
| Role | Hex | Usage |
|---|---|---|
| Primary | `#1A7A6B` | Headings, brand mark, primary buttons, active states |
| Primary light | `#E8F5F3` | Subtle backgrounds, hover states, active card borders |
| Primary dark | `#0D4F44` | Text on light backgrounds, footer |

Teal was chosen for its associations with trust, reliability, and calm — without the
conventional "Islamic green" cliché or the coldness of corporate blue.

### Accent: Dignified Amber
| Role | Hex | Usage |
|---|---|---|
| Amber | `#C8953B` | Overdue status, gentle reminders, attention calls |
| Amber light | `#FEF5E7` | Overdue row backgrounds, reminder banners |

Amber signals *attention needed* without triggering alarm. It is warm, not urgent.
Overdue is **never red**.

### Neutral: The Observer
| Role | Hex | Usage |
|---|---|---|
| Background | `#FAFAF8` | Page background, cards |
| Surface | `#FFFFFF` | Card surfaces, modals |
| Border | `#E2E0DC` | Card borders, dividers |
| Text primary | `#1A1A1A` | Body text |
| Text secondary | `#6B6B6B` | Labels, metadata, amounts |
| Text muted | `#A0A0A0` | Placeholder, disabled |

### Semantic
| Role | Hex | Usage |
|---|---|---|
| Success (kept) | `#2E7D5B` | Fully repaid, إبراء completed |
| Dispute neutral | `#7B7B7B` | Dispute status — impartial |
| Danger (structural) | `#C44E4E` | Tamper detected, error states **only** |
| Shariah review | `#B8860B` | Mode-B pledge ⚠️ guard |

**Red is used only for structural/system failures** (broken SHA-256 seal, data integrity loss).
It is never used for a person's financial state.

---

## 3 · Typography

### Arabic: Noto Naskh Arabic
Primary Arabic face. Chosen for its excellent readability at body sizes, authentic
Naskh calligraphy roots, and strong Arabic script support (joining, ligatures, diacritics).

| Size | Weight | Use |
|---|---|---|
| 28px / 1.4 | Bold | Screen titles (صفحة الرئيسية) |
| 20px / 1.4 | Bold | Section headings (لي, عليّ) |
| 16px / 1.5 | Regular | Body text, row content |
| 14px / 1.5 | Regular | Labels, metadata, amounts |
| 13px / 1.4 | Regular | Chips, badges, helper text |

### Latin companion: Inter
Clean, geometric sans-serif for English annotations, code, and technical references.

### RTL typography rules
- Line length: 60–75 characters per line (Arabic reads wider than Latin at the same px size)
- Leading: 1.5× for body, 1.4× for headings (Arabic needs slightly more interline space than Latin)
- Text alignment: right-aligned body, left-aligned numbers in RTL tables (to preserve digit order)
- Font rendering: `-webkit-font-smoothing: antialiased` for Arabic clarity on all screens

---

## 4 · Spacing & Layout

### Grid
4px base unit. Layout uses a 16px × 16px rhythm:
- 16px: tight spacing (icon to text, chip padding)
- 24px: card padding
- 32px: section spacing, card gaps
- 48px: major section breaks

### Card anatomy
```
┌──────────────────────────────┐  ← 1px border (#E2E0DC), 8px border-radius
│  [status chip]  [menu ⋯]     │  ← 24px padding all sides
│                              │
│  ر.س 2,500                   │  ← amount, left-aligned in LTR context
│  café · استحق 2026-03-15     │  ← metadata row
│                              │
│  [تذكير] [سداد] [مهلة]       │  ← action buttons, right-aligned
└──────────────────────────────┘
```

### Navigation
- **MAX 2 rows** of nav pills (8 pills at most)
- Contextual screens (proof, dispute, settings, request) have **no nav pill** — they're reached
  in-flow via action buttons and return to caller
- Nav wraps cleanly on mobile (flex-wrap, no horizontal overflow)

### Section grouping
- **Bento-style** grouped sections with section headers (amber chip + count for overdue)
- Sections: «متأخّرة — بالمعروف» (amber), «محلّ خلاف» (neutral/grey), «قائمة وقادمة», «محفوظة» (teal)

---

## 5 · Iconography & Visual Language

### Seal motif
The SHA-256 seal is the central visual metaphor. Represented as:
- A **hex fingerprint** displayed in monospace with the first 8 chars only (e.g. `6c9410b9…`)
- A **broken chain** ⛓️ visual when tampered (the two diverging seals side by side)
- A **locked ✓** vs **unlocked ✗** state for verified/tampered

### Trust ring (not a score bar)
A circular ring with filled arc segments proportional to the kept-promise ratio.
- **No numeric label** — the ring is a qualitative signal
- Accompanied by the trust WORD («وفّى بعهوده») below the ring
- Colored in primary teal with amber tint for overdue component

### No alarm iconography
- No red exclamation marks on people
- No skulls, warning triangles, or stop signs for overdue
- The dispute icon is a neutral scale ⚖️ or document, not a gavel
- The reminder icon is 🤍 (gentle), not 🔔 (demanding)

### The witness motif
An open scroll / كتاب metaphor for the bank's role: the record-keeper, not the judge.
Used on the home screen and proof-pack.

---

## 6 · Motion

### Remotion promos
- Exported at **1080×1920, 60fps, H.264**
- Narrative arc: ask → witnessed → provable → fair even in conflict → yours
- Arabic captions animated per feature
- Deterministic frame rendering (seeded, no random)

### In-app motion
- Minimal, purposeful transitions (screen entrances)
- **No animations driven by `Date.now`** — all timing is deterministic
- Hover states: subtle opacity shifts (no scaling or color transitions that could be
  confused with state changes)

---

## 7 · RTL & Arabic

### Baseline rules
- `direction: rtl` on the `<html>` element
- `text-align: right` as default for body content
- Navigation pills: right-to-left, home is rightmost
- Amounts: use Unicode LRM markers where needed to preserve digit order in RTL context

### Arabic-Indic digit toggle (الإعدادات)
- User preference stored in `settings.digitMode` (`"western"` | `"arabic"`)
- Applied as a **display-only map** over the engine's golden `fmt()` output
- Seals are computed on content bytes, not glyph shapes — the toggle is byte-safe
- Default: Western digits (engine-consistent)

### Arabic shaping
- All Arabic text must render in **joined (متصلة)** form — test after every screen change
- Diacritics (حركات) are used sparingly, only where disambiguation is needed
- Tatweel (تطويل) is not used in UI text

---

## 8 · Accessibility

- `aria-current="page"` on active nav pills
- `role="tablist"` / `role="tab"` / `aria-selected` on دفتري filter tabs
- Minimum color contrast: **4.5:1** for body text, **3:1** for large text (WCAG AA)
- All interactive elements are keyboard-navigable (Tab, Enter, Esc)
- Error fallback screen: «تعذّر العرض» — never a raw stack trace
- The privacy mask (`إخفاء المبالغ`) hides amounts behind `•••` — display-only, no byte effect

---

## 9 · Visual Components

### Cards
- Border: 1px solid `#E2E0DC`
- Border-radius: 8px
- Background: `#FFFFFF`
- Padding: 24px
- Shadow: none (flat, clean — no floating cards)
- Hover: subtle background shift to `#FAFAF8`

### Buttons
| Type | Style | Use |
|---|---|---|
| Primary | Filled teal (`#1A7A6B`) → white text | Create, confirm, seal |
| Secondary | Ghost (no fill, teal text + border) | Edit, cancel, back |
| Danger | Ghost, muted text + border | Structural actions only |
| Icon | 24×24px, no label | Overflow menus, nav extras |
| Disabled | Opacity 0.4, no pointer | When seal is blocked by linter |

### Chips & Badges
- Border-radius: 12px (pill shape)
- Padding: 4px 12px
- Types:
  - **Overdue** (`#C8953B` bg, `#7B5E00` text) — متأخّر
  - **Dispute** (`#E8E8E8` bg, `#5A5A5A` text) — خلاف
  - **Current** (`#E8F5F3` bg, `#1A7A6B` text) — قائم
  - **Kept** (`#E8F5F3` bg, `#2E7D5B` text) — محفوظة

### Progress Bars
- **Proportional flex-grow layout** (no percentage text)
- Segments: paid (teal `#1A7A6B`), forgiven/gold (amber `#C8953B`), remaining (light grey `#E2E0DC`)
- Height: 8px, border-radius: 4px
- Legend below bar shows exact amounts («سُدِّد 5,000 · صدقة 3,000 · باقٍ 12,000 · من 20,000 ر.س»)

### Tables (Ledgers)
- No grid lines — subtle row separation via `1px solid #F0EFEC`
- Amounts: right-aligned in RTL context
- Status word + chip in the leftmost column (RTL: rightmost)
- Sortable rows: most-overdue first (deterministic)
