#ahd #layer/product #agent/4

# Ahd — Savage Product/Modeling/Prototype Audit (Agent 4)

> Posture: audit like an enemy. No flattery. Every line below is a thing that is *missing, wrong, hand-waved, or merely asserted* in the product/modeling/prototype layer as it stands today (`concept-ahd.md` F+E, `champion.md`, `project/ahd-demo/index.html` + README). The teardown already named the kill-line; my job is to find the holes *inside my own layer* before a judge does.

---

## A. The prototype is a 5-step linear slideshow, not a product

1. **No state machine exists.** The README and concept both claim an `ahd` lifecycle (`draft → witnessed → active → settling → kept / defaulted / disputed`). The code has **none of it**. `index.html` has a global `step` integer (0–4) and a hard-coded `AG` object whose only mutable state is `schedule[i].paid`. There is no `status` field on the agreement at all. The single most defensible part of the concept — that an *ahd* is an object with a governed lifecycle — is **completely unbuilt**. A judge who asks "show me a defaulted agreement" gets nothing.

2. **The "hash-chain / tamper-evident record" is a single FNV-1a hash, not a chain.** `AG.hash = fnv(...)`. FNV-1a is a **non-cryptographic** hash designed for hash-table bucketing; it has trivial collisions and is not preimage-resistant. Calling its 8-hex-digit output "tamper-evident" and pairing it with "مقبولة كدليل · نظام الإثبات 2022" on screen is the *exact* move the teardown flagged: **admissibility asserted, not engineered.** There is no chain, no prior-hash link, no event log, no signature payload. "Hash-chain record integrity" in the build plan is vaporware.

3. **The riba-check is a hard-coded `innerHTML` string, not a check.** Step 1 types fixed Arabic terms then unconditionally writes `✓ خالٍ من الربا`. It does not *inspect* anything. If a malicious or careless user entered "plus 10% if late," the badge would still say "riba-free." The concept sells an "AI riba/penalty checker" as a real built feature (build plan E); in code it is **theater**. This is the single most dangerous gap because the whole Shariah claim rests on it.

4. **The settlement schedule is computed but trivially and with a known bug class.** `installment = amount / months` = 1000.00 exactly for the seed, so no rounding problem *shows*. But there is no remainder handling: 5000/3 = 1666.666… would silently drift and never reconcile to the principal. For a *qard hassan* product where the borrower must not pay one halala more than principal, an unhandled rounding remainder is a **Shariah correctness bug**, not a cosmetic one.

5. **Nafath is mocked as a progress bar with no payload and no failure path.** `confirmPerson` runs a `setInterval` that fills a bar to 100% and flips a flag. There is no concept of *what is being signed* (no document digest presented to the signer), no decline, no timeout, no "second party never signs" branch. The "witnessing" — the heart of the pitch — is a CSS animation.

---

## B. The modeling claims in the concept are under-specified to the point of being unfalsifiable

6. **"Trust capital / agreements-kept reputation" has no data model and no algorithm.** Concept F promises an "aggregate agreements-kept reputation per person." There is no schema, no formula, no decay, no handling of partial/late/disputed, no guard against it becoming a de-facto credit score (which would breach the "Ahd never underwrites" promise *and* potentially trip SAMA credit-bureau rules). It is a sentence, not a mechanism. The teardown scored Data 15/20 precisely here.

7. **The Muqassa netting is real but shallow, and its correctness claim is overstated.** The greedy debtor↔creditor algorithm in `netting()` is genuinely computed and genuinely reduces 9→2 on the seed. Good. **But:** (a) it is sold as "minimum transfers" — greedy min-cash-flow does **not** guarantee the true minimum number of transfers (that's NP-hard / partition-equivalent); the demo collapses to 2 *because the seed was curated to net to 2 creditors and 2 debtors*, not because the algorithm is optimal. Claiming "least number of transfers" is **mathematically false** and a sharp judge can break it with a 4-person counterexample. (b) There is no consent model: netting "you→Ali→Sara→you" silently reassigns *who pays whom*, which changes the **legal counterparties** of each debt — you cannot net a debt across people who never agreed to it. The netting engine, as conceived, **manufactures obligations between strangers**. That is a real Shariah + legal hole hiding inside the "data wow."

8. **No data seeds beyond two personas and one curated circle.** A deterministic demo needs a *seed bank* (multiple agreement types, an active loan mid-schedule, a defaulted one, a disputed one, a recurring one, a group). There is exactly one agreement and one IOU circle. The moment a judge says "create a different one," the demo has nothing.

9. **Module map does not exist.** The mandate asks for a feature set + module map with each module justified by the gap it closes. The current artifacts list features in prose (riba-checker, netting, trust-capital, guest onboarding, recurring, family-circle) but **never map them, never justify each, never cut any.** Several (recurring agreements, family-circle, kept-promises reputation, guest onboarding) are named once and never specified — pure surface.

---

## C. Honest concessions (where the concept already admits weakness but didn't fix it)

10. **Two-sided cold-start + the "asking a loved one to e-sign reads as distrust" wound** (teardown Axis-1) is named as a risk and then *waved away with "framing flips it."* Framing is not a mechanism. There is no product surface that actually defuses the distrust (no "soft ahd," no lender-only issuance with a gentle accept, no non-coercive default tone). This is an **adoption-layer product gap**, and it lives in my layer because it is solved by *modes and defaults*, not by a pitch sentence.

11. **The "dhimmah cleared" beat is admitted to be quiet / may underwhelm.** Fine — but no design decision was made to make the *quiet* land (haptic, the dignity of the Arabic, the both-parties-see-it-simultaneously moment). It is asserted to be emotional without being engineered to be.

12. **D1/D2/D3 cut-line is copied from the concept and is not honest about #2/#3 above.** The stated "one feature that MUST work" (create → witnessed → auto-settle → kept) currently *works only as a slideshow*; under the real definitions (state machine, real integrity record, real riba-check) it is **not built**. The cut-line needs re-deriving against the deepened spec.

---

## D. Verdict

The prototype is a *beautiful, deterministic, zero-error, RTL slide deck* — genuinely good as a stage artifact — sitting on top of a product whose three load-bearing mechanisms (governed lifecycle, integrity record, riba-check) are **mocked or absent**, and whose flagship data moment (Muqassa) makes **two false claims** (optimality + cross-party nettability) that a hostile judge can puncture. The fixes are all *buildable in the existing single-file, offline, deterministic constraint* — that is what `layer-product-demo.md` does.
