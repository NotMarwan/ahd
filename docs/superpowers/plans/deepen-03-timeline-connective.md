# Plan · Deepen-03 — سِجلّ الشهادة becomes the connective tissue

**Lane:** the witness timeline. **Mode:** additive pure logic + screen weave. **Spine:** the bank witnesses
(never judges/scores); late = amber; dispute neutral; no %/score; deterministic; integer halalas.

## Where it is now
A flat feed of significant witnessed events (sealed · reminder · grace · dispute · kept · إبراء), sorted by
due date + lifecycle stage, with a counts header. It is a nice list, but it is an island — no links out, one
event model, no per-عهد narrative.

## Deepen (pure logic — TDD first, `app/timeline-connect.test.cjs`)
1. **Richer event model** — add to the EV map (real engine events): `SETTLEMENT_SETTLED` (سُوِّي بالمقاصّة —
   ذمّة محفوظة) · `SETTLEMENT_INITIATED` (بدأت مقاصّةٌ بالتراضي) · `PARTIAL` (سدادٌ جزئيّ — المتبقّي ينقص، بلا
   أيّ زيادة). Existing fixtures don't use these, so the current 27-assertion suite stays green.
2. **`groupByAhd(entries)`** — fold the flat feed into one **story per عهد**: `{recordId, who, party, dir,
   amountSAR, amountMinor, dueAr, lender, borrower, entries[] (latest stage first), outcome, disputed, kept}`.
   Groups keep the feed's due-date order (first appearance). This is the witnessed narrative of each relationship.
3. **`ahdActions(group)`** — the CONNECTIVE links every story exposes: «وثيقة الإثبات» (→ proof), «في الدفتر»
   (→ daftari), and «تفاصيل الخلاف» (→ dispute) only when disputed. Pure data; the screen renders the buttons.

## Weave (the connective tissue, both directions)
4. Screen `screens/timeline.js`: a **story view** (grouped by عهد, default) with a toggle to the **flat feed**;
   each story card shows its mini-timeline + the connective action buttons (proof / record / dispute).
5. **Focus mode**: `app.timelineFocus` (a recordId) highlights one عهد's story + a «كل العهود» reset chip.
6. **دفتري → timeline** (reverse link): a per-row «السجل» action → `openTimelineFor(id)` (sets focus, opens
   the timeline on that عهد). Closes the loop: دفتري ↔ سجلّ ↔ إثبات/خلاف.

## Guards
- Existing `timeline.test.cjs` (27) stays fully green — no assertion weakened.
- New logic TDD'd in `timeline-connect.test.cjs`; DOM-smoke grown for the story view + links + focus.
- No golden touch; no number/score; amber-not-red; determinism + offline preserved.
- Real-browser: story view renders, links navigate, focus highlights, 0 console errors, Arabic correct.
