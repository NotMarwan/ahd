# Debt at death v1 — gated specification

**Status:** disabled pending Shariah and Saudi legal approval. This is a boundary specification, not a product workflow.

## Permitted record states after approval

`DEATH_REPORTED` → `DEATH_VERIFIED` → `ESTATE_EVIDENCE_EXPORTED` → `ESTATE_SETTLEMENT_RECORDED`

No action is enabled until both approvals exist and the representative's authority is proven for the relevant estate.
No estate code, UI, routing, or automatic event emission is enabled in this version.

## Estate boundaries

- A deceased lender's receivable belongs to the lender's estate. Only a proven, authorized estate representative may request evidence export or record a settlement. Kinship alone never grants that authority.
- A deceased borrower's liability is an estate matter only. Heirs do not assume personal liability merely through inheritance.
- Ahd may witness evidence and a recorded settlement only. It does not accelerate or mature a debt automatically, calculate inheritance or shares, waive a debt, decide a dispute, score anyone, or issue a fatwa.

Any Shariah question is referred to qualified scholars; any legal authority question is referred to the applicable Saudi legal process.
