#ahd #layer/product #agent/4

# Ahd — Gap Register (Product / Modeling / Prototype)

> Each gap: what is missing/wrong · why it matters (which criterion/review it fails) · severity. Criteria refer to the scoring rubric (Innovation 20 / Technical 20 / Data 20 / UX 15 / Feasibility 25) and the named reviewers (Shariah board, SAMA, Nafath/legal).

| # | Gap (what is missing/wrong) | Why it matters / what it fails | Severity |
|---|---|---|---|
| G1 | **No `ahd` state machine** — code has a `step` counter, agreement has no `status`; lifecycle (`draft→witnessed→active→settling→kept/defaulted/disputed`) is unbuilt. | Technical + the entire "it's a governed object" defensibility. A judge asking for a defaulted/disputed agreement gets nothing. | **Critical** |
| G2 | **"Tamper-evident record" = one FNV-1a hash**, non-cryptographic, no chain, no event log, no signed payload — yet labeled "مقبولة كدليل · نظام الإثبات 2022". | Feasibility + legal review. This is the teardown kill-line ("admissibility asserted, not proven") sitting literally in the code. | **Critical** |
| G3 | **Riba-check is a hard-coded string**, inspects nothing; would pass a 10%-late-fee term. | Shariah review + Data + Technical. The whole qard-hassan claim rests on a badge that is theater. | **Critical** |
| G4 | **Muqassa over-claims "minimum transfers"** (greedy ≠ optimal; NP-hard) and **nets across non-consenting parties**, manufacturing obligations between strangers. | Data (the flagship moment) + Shariah/legal (you can't reassign counterparties without consent). A 4-node counterexample breaks the optimality claim live. | **Critical** |
| G5 | **Fee model unspecified** → riba/gharar status of the bank's cut is unknown. | Shariah + business. Named soft-spot. Must be a flat actual-cost fee, never % of principal (AAOIFI). | **Critical** |
| G6 | **Settlement schedule has no remainder/rounding handling**; non-divisible principals drift, borrower could overpay/underpay principal. | Shariah correctness (qard hassan = exactly principal) + Technical. | High |
| G7 | **Trust-capital reputation has no schema/algorithm/decay**, and no guard against becoming a credit score. | Data (the 15/20 soft spot) + SAMA (credit-bureau line) + the "never underwrite" promise. | High |
| G8 | **No data seed bank** — one agreement, one circle; demo can't show active/defaulted/disputed/recurring/group states. | Technical + UX robustness; demo fragility under any "make another one" question. | High |
| G9 | **No module map**; named modules (recurring, family-circle, kept-promises, guest onboarding) are unspecified surface. | The mandate (a) directly; Innovation reads as feature-soup not one spine. | High |
| G10 | **Nafath mock has no signed payload, no decline/timeout/abandon branch**, no document digest shown to signer. | Feasibility + Technical; "witnessing" is a CSS bar. | High |
| G11 | **Cold-start + "e-sign feels like distrust"** defused only by "framing," no product mechanism (soft-ahd / lender-issue-borrower-accept / tone defaults). | Adoption (UX 15 + real-world). Teardown Axis-1: "the product offends the relationship it serves." | High |
| G12 | **D1/D2/D3 cut-line not re-derived** against real definitions; "one feature that MUST work" only works as a slideshow today. | Build risk; could spend 72h on polish and ship no real mechanism. | Med |
| G13 | **"Dhimmah cleared" not engineered to land** (simultaneity, dignity, haptic). | UX; the emotional climax under-delivers. | Med |
| G14 | **Disputed path has no model** — what data the e-record exports to MoJ/Najiz/Taradhi, in what format. | Feasibility/legal; the "we escalate, not adjudicate" promise needs an actual export artifact. | Med |
