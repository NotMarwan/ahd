# Mobile Judge Showcase Design

## Outcome

The fresh Android build must open into a convincing, self-explanatory product showcase instead of empty forms. The More screen becomes one consistent searchable two-column catalog, Settlement becomes the plain Arabic `التسوية`, and the 9-to-2 example uses five people around a geometric network with no crossed-line motif.

## Decisions

- Keep all nineteen contextual tools equal in one wrapping two-column grid. Remove recent tools, `الأهم الآن`, letter marks, and the diagonal hero thread.
- Keep search and category filters. Each card uses only category color, category label, title, one-line outcome, and an optional badge.
- Use `التسوية` for every mobile-facing label. Keep internal English identifiers such as `settlement` and `netting` unchanged.
- Replace the scale tab glyph with a compact circular transfer glyph.
- Show five named people around a pentagonal/ring network. The before view uses perimeter segments and the after view uses two clean direct paths; no crossing curves and no dark-blue block.
- Use deterministic, integer-halala showcase fixtures. Every synthetic surface says `بيانات تجريبية` or `عرض تجريبي` on the same screen.
- Never persist fixtures on render. Real local records, profile data, circles, requests, and receipts always take precedence.
- Prefill input-driven tools so a judge can act immediately. A deliberate Save/Create press is still required before anything reaches local storage.

## Showcase Coverage

- Create Ahd: Noura lends Layla SAR 4,800 for emergency treatment, six monthly payments from 2026-08.
- Daftari, open, mine, timeline, maroof, standing, and impact: deterministic sealed local-shaped examples appear only as read-only fallbacks.
- Jamiya, circle, and circle+: five members, SAR 1,000 monthly, recorded organizer attestations, sample payments, and a 9-to-2 receipt.
- Daily, request, dispute, bounds, proof, and settings: meaningful fixed values are present at first render; the current store remains untouched until the user explicitly submits.
- Settlement: the existing exact nine-obligation fixture remains the computation source, now presented around Noura, Sara, Khalid, Layla, and Fahd.

## Mobile Design Checkpoint

- Platform: Android primary, Expo Router React Native, with iOS/web-compatible components.
- Touch targets remain at least 48 dp; cards use readable Arabic RTL hierarchy and bounded two-column widths.
- Long content remains inside the existing shared scrolling shell; the catalog is a bounded nineteen-item wrap, avoiding nested virtualized lists.
- SVG geometry is fixed and lightweight, with no gestures or continuous animation.
- Fresh-state screenshot risk is removed through labeled read-only fallbacks, not hidden persistence.

## Safety and Constitution

- `demo/index.html`, golden logic, vectors, and netting semantics remain untouched.
- All money uses integer halalas and all dates and IDs are fixed.
- Synthetic claims are visibly labeled and never presented as traction, approval, or real customer data.
- The Shariah decision boundary is unchanged; this is terminology and presentation only.

## Acceptance

1. More renders exactly nineteen uniform cards and no recent, priority, or letter tile.
2. Production mobile source contains no user-facing `المقاص` stem.
3. Settlement renders five participants and 9-to-2 without crossed curves or a dark-blue results block.
4. Every screen that previously opened blank now shows labeled showcase content or prefilled values.
5. Rendering an empty store causes zero writes; real data suppresses the fallback.
6. Focused Jest, full mobile gates, the repository gate, and frozen-demo hash pass.
7. The committed APK hash is refreshed from the completed implementation.
