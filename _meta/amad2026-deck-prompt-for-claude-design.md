# Prompt for Claude Design — AMAD 2026 pitch deck, second independent copy

> Paste everything below into a fresh Claude Code session opened on this same project
> (`C:\Users\PCD\Desktop\Amad Hackathon`). It's written to be self-contained — no other context needed.

---

## Your task

Build a complete, submission-ready PowerPoint pitch deck for the **عهد (Ahd)** project's AMAD 2026
hackathon initial-judging submission. A first version already exists (built by another session) — **your
job is to produce an independent second version**, not a copy of it. Use your own judgment on wording,
which real screenshots to feature, and how to balance the content across the required slots. Where the
facts are concerned, though, do not diverge from what's verified below — this is a real competition
submission and it needs to hold up to scrutiny.

**Deadline: Thursday, 2 July 2026, 11:59 PM**, submitted via the team leader at
`https://tahkeem.tuwaiq.edu.sa/amad/space/`. Today is 1 July 2026 — this is due **tomorrow**. Treat this as
urgent.

## The required template — non-negotiable

The competition organizers were explicit: **"يُرجى الالتزام بالقالب المعتمد فقط"** (please adhere ONLY to
the approved template). You must fill in the existing template — not redesign it, not restructure its
slides, not change the slide count or dimensions (10" × 5.62", 14 slides).

- Template file: `C:\Users\PCD\Downloads\عروض الطلاب _ امد 2026.pptx` (also linked from Google Slides in
  the competition announcement — either source is the same template).
- Guide file (submission rules, schedule, logistics): `C:\Users\PCD\Downloads\الملف الإرشادي للمشاركين -
  امد النسخة الثانية -2.pdf`. Both filenames have Arabic characters that can trip up naive path handling —
  if a direct file read fails, copy the file to an ASCII-named path first (e.g. via PowerShell
  `Get-ChildItem`+`Copy-Item`, matching by `LastWriteTime`, rather than retyping the Arabic filename) before
  reading it.

**The template's 14 slides, in order, and what each expects** (verified by unpacking the actual .pptx —
don't guess from a generic hackathon-template assumption):
1. Title — اسم المشروع (project name) + اسم الفريق (team name)
2. أعضاء الفريق (Team members) — 4 name slots + 4 circular photo placeholders
3. المحتويات (Table of contents) — 7 numbered items (already sensible, minimal changes needed)
4. المشكلة وحلّها (Problem & Solution) — intro paragraph + 3 icon/header/body rows. **Note: this row's
   English placeholder text ("Utilize technology and customer feedback...", "Innovative solutions", "Stay
   ahead of trends", "Seasonal spikes") is leftover from an unlocalized base template — it must be fully
   replaced, not just the Arabic prompts.**
5. البيانات المستخدمة (Data/evidence used) — intro + 3 guiding questions to answer + 3 stat callouts
   (currently placeholder "0%" / "1st quarter" etc. — also unlocalized leftover text)
6. التقنيات المستخدمة (Technologies used) — 3 rows × 2 columns of tech facts (currently the same
   generic sentence duplicated 6×)
7. وصف الفكرة (Idea description) — small tagline + paragraph + picture slots (a nested "phone-shaped"
   image at roughly 0.425 aspect ratio, and a larger background frame behind it)
8. كيفية توفير هذه البيانات وكيفية استخدامها (How data was obtained/used) — heading + paragraph +
   picture slots (a background frame + a roughly-square overlapping image)
9. مواءمة الفكرة (Idea's alignment with the competition theme) — heading + paragraph + background image
10. ملخص (Summary) — heading + paragraph + background image
11. الاختبار/التحقق (Testing/Validation) — heading + one paragraph
12. العرض التوضيحي/اللقطات/الفيديوهات/المحاكاة (Demo/screenshots/video/simulation) — heading + a note.
    **The note currently says (paraphrased) "remember: show whether ~30% of the project is done" — this is
    an instruction to the filler, not real content; replace it with an actual caption.** The template has
    NO picture placeholder here at all — you'll need to add your own screenshot(s) into the empty space.
13. التحديات والخطط المستقبلية (Challenges & future plan) — 3 boxes: what help you need / challenges /
    future roadmap (the template's own instruction mentions "covering 70% progress, next two weeks" — a
    prompt to the filler, reframe honestly rather than quoting it verbatim)
14. شكراً (Thank you) — simple closer

**Before you touch content**, unpack the template and inspect its exact shape IDs / paragraph-and-run
structure yourself (`python-pptx`, iterating `shape.text_frame.paragraphs[i].runs[j]`) — several text boxes
have MULTIPLE paragraphs or runs where only one is visually obvious from a naive text dump, and the rest
are empty or contain a second half of the original prompt that's easy to miss and leave dangling behind
your replacement. This bit two real bugs in the first pass (a leftover sentence fragment on the
testing-slide, and a duplicate-paragraph collision on the data-methodology slide) — both were only caught
by re-extracting text from the output and grepping for known original phrases. Do the same: after filling
the deck, re-extract all text and grep for distinctive substrings of the ORIGINAL template's placeholder
prose to confirm nothing survived.

If you have the `pptx` skill available, use it (`editing.md` covers the unpack → edit → clean → pack
workflow). LibreOffice (`soffice`) may not be installed in a fresh environment — install it via
`winget install --id TheDocumentFoundation.LibreOffice -e --silent` if you want to render slides to images
for visual QA (recommended — do this with fresh eyes, ideally via a subagent, per the pptx skill's QA
section).

## About عهد (Ahd) — what you're pitching

**One line:** An Islamic-finance prototype — a bank that **witnesses and seals** interest-free
interpersonal loans (قرض حسن / qard hasan). It never lends its own money, never judges disputes, never
charges interest or a penalty, and never issues a credit score. Basis: Qur'an 2:282 (write the debt down) +
2:280 (grace for the struggling). Spirit: **«كلمتك محفوظة، وعلاقتك محميّة»** (your word is kept, your
relationship is protected).

**The problem:** Lending between friends/family is the single most common financial transaction, yet no
bank product serves it. Asking for repayment feels like an accusation, so people either damage the
friendship by asking or silently lose the money. There's no record, no witness, and people who want to
lend interest-free worry about accidentally structuring something that becomes ribا (interest) through a
hidden penalty clause.

**The solution — four steps:** أنشئ (create the terms, an "علّام" assistant drafts clear Arabic wording
and a riba-linter blocks any interest/penalty clause) ← أَشهِد واختِم (both parties confirm identity via
نفاذ/Nafath, the record gets sealed with a SHA-256 hash chain — tamper-evident, not just tamper-claimed) ←
سَوِّ (repay via سريع/Sarie; if struggling, "أحتاج وقت" reschedules with **zero** added charge, direct
application of Qur'an 2:280) ← قاصِص (Muqassa/netting: when debts tangle across several people, compute the
*minimum* number of transfers that settles everyone — the flagship demo collapses 9 obligations into 2
transfers, with a mathematical proof that every person's net position is preserved).

**Four surfaces built on one shared engine:** «دفتري» (creditor home — bank sends the reminder on your
behalf so you never have to be "the one asking"), «القرض المفتوح· متى ما تيسّر» (open-term loan, no due
date, so it's never "overdue" — lender can convert to صدقة/forgiveness with one tap), «الدائرة» (shared
group expenses, e.g. a shared apartment — one-tap splitting, a group reminder that **never names who's
late**), «الدائرة المتقدّمة» (event/occasion version — N members' shares become N sealed عهود, managed
from one dashboard).

**What's real vs. mocked (say this precisely, don't overclaim):** SHA-256 hashing (real, NIST-vector
tested), the netting/settlement algorithm (real, deterministic, conservation-proven), the riba-linter
(real, tested against 60+ adversarial clauses). **Nafath, emdha/TSP, Sarie, and RFC-3161 timestamping are
explicitly mocked/simulated** in the current build — designed against the real specs, not yet integrated
live. Say "designed against the real specification, currently simulated" — never imply live integration.

**Real, current test numbers (verified by running the suite just now — use these, don't reuse older
numbers you might see cited elsewhere in project docs):** core logic gate **184/0** assertions
(deterministic: SHA-256 NIST vectors, seal/tamper-detection, Muqassa conservation, riba-linter rule
coverage), app gate **29/29 suites** (1000+ assertions) covering 12 live screens, plus a newly-added
structure-integrity check. Zero `Math.random`, zero `Date.now`, zero network calls in the logic — same
inputs always produce the same output, checked automatically. The demo's tamper-evidence is a live,
clickable moment: change one character in a sealed record → the hash breaks → "✗ عبثٌ مكشوف" (tampering
exposed) appears immediately, not a canned animation.

**Tech stack, honestly described:** plain JavaScript + HTML, zero frameworks, zero build step, zero
external dependencies — a deliberate choice for full determinism and offline operation, not a limitation.
Real screenshots exist at `app/screenshots/` (also `app/screenshots/audit/` and
`app/screenshots/deepening/`) — use these instead of stock photography wherever the template has a
content-relevant image slot; they're more convincing than generic imagery for a technical-execution
judging criterion. Particularly strong ones: `audit/09-proof-verified.png` +
`audit/10-proof-tampered.png` (the verified→tampered pair, a strong visual moment), `ahd-settlement.png`
(the 9→2 netting view), `deepening/ahd-home-capstone.png`, `audit/03-daftari.png`.

**Evidence base — grade honestly, never invent a number.** Full detail in
`docs/evidence/EVIDENCE-BRIEF.md` (read it — it grades every claim 🟢 verified / 🟡 supporting-but-unconfirmed
/ 🔴 needs counsel-or-field-confirmation, and explicitly says which numbers are NOT to be cited as Saudi
facts). Key ones safe to cite directly:
- Evidence Law (نظام الإثبات, Royal Decree M/43): 129 articles, in force 7 July 2022, digital records are
  documentary evidence, and the burden of proof shifts to whoever *contests* a digital record (🟢 substance
  verified; exact article number for this specific point is 🔴 — say "engineered to meet the law's
  conditions," never "is admissible," since a judge admits, Ahd only satisfies conditions).
- نفاذ/Nafath: 17.2M+ downloads, 23.5M+ users, 3B+ logins (🟢, web-verified) — real reach, though whether
  Nafath-AES is *specifically* sanctioned for private interpersonal-debt witnessing (vs. the
  government/enterprise use cases it's provisioned for) is 🔴 unconfirmed — a validation step, name it as
  one.
- Internet penetration: ~99% (DataReportal 2025) — **do not** use "~97% smartphone" (that figure traces to
  stale 2017 data; the evidence brief flags and corrects this explicitly).
- AlinmaPay (SAMA-licensed digital wallet since 2020) + Alinma's VC arm + Alinma Digital Fund's
  Shariah-fintech investments (Wadaie) + an IBM-built API/fintech-marketplace platform — this is the
  concrete, citable reason "why Alinma specifically," not just "they're an Islamic bank" (🟢 web-verified).
- **The single biggest acknowledged gap:** no Saudi-specific survey/interview evidence yet exists for the
  *relational* claim (e.g., "X% of Saudis don't document a loan between friends"). Never present a US
  statistic as a Saudi fact — the evidence brief is explicit that this is still open (🔴, tracked as OT-A1).
  If you want a demand angle, the *documentation-habit/scale* argument is well-evidenced instead: Saudi
  execution courts see promissory notes as one of the largest debt-enforcement categories, and Nafith
  (Saudi's digital promissory-note platform) already issued 800,000+ digital سند in its first year — Saudis
  already accept a fully digital, court-linked debt instrument; Ahd extends a trusted pattern, not a foreign
  behaviour.

**Existing prose deck draft** (Arabic, 9-slide narrative form, richer than the template's 14-slot
structure): `docs/DECK-DRAFT-AR.md`. Read it for the full pitch narrative, phrasing, and the designer notes
already written per section — it's a good source for tone and framing even though you'll need to
re-organize its content into the template's fixed 14 slots (they don't map 1:1; the template is more of a
structured-judging-criteria format, the draft is more of a persuasive narrative).

**Competition alignment:** partner is **مصرف الإنماء (Alinma Bank)** — the competition's terms explicitly
restrict submissions to ideas usable by Alinma specifically in the financial/banking sector, which Ahd
already targets natively. Relevant hackathon tracks per the guide: generative AI in fintech (the
term-drafting assistant + riba-linter), customer experience (dignified reminders), regulatory/compliance
tech, open banking.

**Shariah honesty — do not issue a fatwa, ever.** The deck should cite Qur'an 2:282/2:280 and AAOIFI
Shariah Standard No. 19 (qard) as grounding, and should explicitly name what's still pending Shariah-board
sign-off (the self-disclosure trust-band feature, and the "pool contributions toward a goal" group-savings
mode) rather than claiming full Shariah clearance already exists.

## Team and members — now known, use these

The team is a family. Team name (confirmed by the user): **مجد جازان**. The four members, in the order
given by the user (place rightmost-to-leftmost in the slide's RTL reading order, i.e. member 1 in the
rightmost/first-read photo slot):
1. مروان صلاح محمد
2. سمية صلاح محمد
3. مصعب صلاح محمد
4. وسن صلاح محمد

No photos were supplied — leave the circular photo placeholders as the template's default generic
silhouette icon rather than inventing or sourcing stock photos of specific people.

## What "independent second version" means in practice

Don't just re-run the same content through the template mechanically. Make your own calls on:
- Which of the 4 product surfaces to lead with in slide 5's stat callouts and slide 6's tech grid
- Whether to pull a different pair of real screenshots for slides 7/8/12
- Your own phrasing throughout — the goal is genuine variety for the user to compare or combine, not a
  duplicate file
- Whether the 3 challenge/future-plan points in slide 13 should emphasize the Shariah-board conversation,
  the field-research gap, or the legal-citation gap first — your judgment, all three are real and current

Keep the honesty discipline non-negotiable throughout: no invented statistics, no unlabeled US data
presented as Saudi fact, no claiming Nafath/Sarie integration is live, no Shariah ruling asserted as
settled. That part isn't a style choice — it's this project's whole ethos, and a hackathon judged partly on
legitimacy will notice if it slips.

## Before you finish

1. Re-extract all text from your filled `.pptx` and grep for distinctive original-template phrases —
   confirm zero leftover placeholder content (English or Arabic).
2. Convert to images and visually inspect every slide (subagent with fresh eyes, per the pptx skill) for
   overflow, overlap, and contrast issues — text you wrote may be longer than the placeholder it replaced.
3. Confirm file size is under 50MB and the format is `.pptx` or `.pdf` per the submission rules.
4. Tell the user clearly: this is ready to submit **except** the team-name/member-name placeholders, which
   they must fill in themselves before uploading to `tahkeem.tuwaiq.edu.sa/amad/space/` by **Thursday 2
   July, 11:59 PM**.
