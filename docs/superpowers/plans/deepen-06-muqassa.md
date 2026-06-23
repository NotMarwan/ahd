# Plan · Deepen-06 — المقاصّة: a rigorous conservation proof

**Lane:** Muqassa (settlement). **Mode:** additive pure logic + screen surfacing. **Spine:** reuse the GOLDEN
netting/balancesOf (never alter); «لا ريال يُخلق ولا يضيع، ولا فائدة»; consent before execution; integer SAR.

## Where it is now
`settlementView` projects the golden netting → 9→2 transfers + consent legs + a thin «Σ net = 0» check.

## Deepen (TDD first, `app/settlement-conserve.test.cjs`)
1. **`conservationProof(ious, engine)`** — the rigorous claim: netting MINIMISES transfers but PRESERVES every
   member's net position EXACTLY. Compute `balancesOf(before)` and `balancesOf(after)` and prove per-member
   `netBefore === netAfter` (`netsPreserved`), plus `Σ net = 0` (`conserved`), the transfer reduction
   (`transfersBefore → transfersAfter`, `saved`), and the money-moved reduction (`moneyMovedBefore/After`).
   A 3-cycle (ring of equal debts) must net to ZERO transfers.

## Surface (the screen)
2. `screens/settlement.js`: a per-member **net-preservation table** («نورة يدفع صافيًا 900 — نفسه قبل وبعد ✓»),
   the **money-moved reduction** line, the conservation proof (now Σ=0 AND nets-preserved), and the legs framed
   as **consented novation** («حوالةٌ بالتراضي يوافق عليها قبل التنفيذ»).

## Out of scope (logged, not faked)
- The circle→مقاصّة data hand-off: the circle and IOU shapes differ; a real mapping is a separate piece. A
  hollow "settle the circle" button would mislead, so it is deferred and noted, not stubbed.

## Guards
- Existing `settlement.test.cjs` (10) stays green. New logic TDD'd; DOM-smoke grown for the proof.
- Golden netting/balancesOf/muqassaLegs reused, never altered. No number/score; integer SAR; determinism.
- Real-browser: the 9→2 story, per-member preservation, money-moved, consent legs render; 0 console errors.
