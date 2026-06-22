# Plan · Deepen-02 — دفتري becomes the product hub

**Lane:** دفتري (creditor/borrower home). **Mode:** additive pure logic + screen weaving (no reshape of the
golden engine). **Spine:** amber never red; mercy always attached; trust signal is a WORD not a number; a net
balance in riyals is *money* (factual), not a score. Deterministic; integer halalas; no Date/Math.random.

## Where دفتري is now
- `buildLedger` (owedToMe/iOwe, sorted overdue→due-soon→closed), `summaryTiles`, `rowFor`, reminder ladder,
  `selfBand`. Row sheet already wires **حافظة الإثبات** (وثيقة الإثبات) and **محلّ خلاف** (تفاصيل الخلاف) as
  first-class actions. So 2 of the 3 new features are already woven.
- **Gaps for "the hub":** the list is flat (no dignified grouping/filter); no net reconciliation; **طلب عهد
  (the ask) is unreachable from دفتري** and a *sent-but-unaccepted* request is invisible in the ledger.

## Deepen (pure logic — TDD first, new file `app/daftari-hub.test.cjs`)
1. **`groupLedger(rows)`** → ordered sections, empty ones omitted, each `{key,label,note,rows}`:
   `overdue` («متأخّرة — بالمعروف», note «تذكيرٌ لطيف، لا مطالبة»), `disputed` («محلّ خلاف — عهدٌ يشهد ولا يحكم»),
   `active` («قائمة وقادمة»), `closed` («محفوظة ✓»). Preserves buildLedger's sort within each section. Dignified
   labels only — overdue is amber, never punitive.
2. **`netPosition(ledger, engine)`** → `{meMinor,onMinor,netMinor,meSAR,onSAR,netSAR,side}` where
   `side ∈ {lak, alayk, balanced}`. **Reconciles exactly** in integer halalas (`netMinor === meMinor − onMinor`,
   summed over LIVE rows only — closed excluded, matching the tiles). It's a money balance, not a trust score.
3. **`filterRows(rows, filter)`** → `filter ∈ {all, overdue, active, disputed, kept}`. Pure, total over inputs.

## Weave the ask (طلب عهد) into دفتري + lifecycle
4. App state: a **pending request** (sent, not yet accepted) shows as a synthetic, clearly-labelled row in the
   «عليّ» side («بانتظار قبول {lender} — لم يُختَم بعد»), never counted in the reconciling totals (it is not a
   sealed عهد). On accept it becomes a real sealed record (existing `acceptToRecord`) and the pending row clears.
5. Screen: a دفتري header action **«＋ اطلب عهدًا»** → `go('request')`; grouped sections with counts; a filter
   chip row; the net-position line. Keep proof/dispute/reminder/grace/forgive row actions intact.

## Guards
- Existing `daftari.test.cjs` (123) stays **fully green** — no assertion weakened.
- New behaviour is TDD'd in `daftari-hub.test.cjs`. DOM smoke + offline + determinism stay green.
- The pending request is **never** added to `summaryTiles`/`netPosition` (it is unsealed) — asserted.
- Real-browser check: دفتري renders grouped sections, the ask is reachable, 0 console errors, Arabic correct,
  no number/score (net balance is money, shown like the existing tiles).
