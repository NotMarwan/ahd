# Overnight UI perfection loop — log

Goal: take app prototype screens from ~10% to 100%. Direction: concise, simple minimalism (Apple design principles). Cut explanatory/study-like text — UI should invite use, not teach a subject. Never touch demo/. Keep tests green (`cd tests && node run-all.cjs` if logic touched; pure HTML prototypes don't need it).

Primary target: application/prototypes/dir-b-sadu.html ONLY (owner narrowed scope — siblings out of scope; dir-a round 2 landed before narrowing, kept).

## Rules for workers
- Minimalism = hierarchy + restraint, not emptiness. Every element earns its place.
- Cut long explanatory paragraphs; replace with short labels / progressive disclosure.
- Typography: tighten large headings (negative tracking), body line-height ~1.5, weight for hierarchy.
- Spacing rhythm intentional, not uniform. Respect RTL/Arabic.
- Buttons: instant :active feedback (scale 0.97). prefers-reduced-motion respected.
- Do NOT change engine logic, golden functions, demo/. Prototypes are standalone HTML — safe to edit.
- Log every round below.

## Reference research (round 1)
16 rules distilled (fintech minimalism, Arabic RTL, Apple HIG, Saudi neobanks):
- Buttons 2–3 words max; paragraphs → 1-line label + disclosure. Arabic expands ~25–30%.
- One primary action per screen (48px+, highest contrast); secondary 44px. Headlines: -.02em tracking, 600–700 weight.
- Trust band («وفّى بعهوده») = qualitative badge, never numeric. Seal: checkmark + "خُتم قبل ساعتين" inline under amount. Tabular/monospace numerals.
- RTL: mirror nav + icons + progress direction; trust signals on card right edge; labels right of inputs.
- Loan card = compact two-liner (counterparty + amount + seal); tap to expand hash/verse/witness. No pre-expanded explanations.
- Spacing scale 4–8–16, section breaks 24–32px; never uniform. Amounts bold, centered, 1.5 line-height.
- Empty states: sample skeleton + inviting CTA («ابدأ سجلّك»), not blame. First record = 4 fields only; extras post-record.
- Status: pending = soft icon + "بانتظار الطرف الآخر", no red. Show AS_OF ("حُدّث قبل ٥ دقائق"), never "real-time".
- Color: neutral base, one primary action color, WCAG AA (4.5:1 body, 3:1 large). Green sealed / gray pending / amber at-risk.
- Implementation order: copy cuts → hierarchy → RTL flow → spacing → progressive disclosure.

## Rounds
(workers append here)

### Round 1 — dir-b-sadu.html

**Audit.** Longest explanatory/study-like blocks found: screen ⑬ سُلفة بالمعروف full legal-Arabic إقرار paragraph (~60 words) + the amber OT-VAL musanedIntegration/needsCounselSignOff dev-note; screen ⑯ الضمانات والحدود — every guarantee cell had a full sentence *and* a monospace `.bd-guard` file/test path always visible; screen ⑰ الإعدادات — "ما يفعله/لا يفعله" list had a full sentence per row, plus a long "عقدان منفصلان…" fee-model paragraph; screen ⑭ سِجلّ المعروف — long "البيّنة المحايدة تحوي…" footnote enumerating exactly what's exported.

**Cut / moved behind progressive disclosure** (new `<details class="more">` + `؟` badge summary, offline, no JS):
- ⑬: quote card now shows one short confident line ("قرضٌ حسن: 800 ريال كلّ دورة، بلا أيّ زيادة — يشهد المصرف ويختم") with the full إقرار text collapsed under "نصّ الإقرار الكامل"; the OT-VAL callout collapses its technical detail under "التفاصيل".
- ⑯: each guarantee cell kept its short claim only; the `app/…js · tests/…cjs` guard path moved under a "يحرسه" disclosure; the closing "كلّ بند يحرسه اختبار…" + `cmd` block moved under "كيف تتحقّق بنفسك".
- ⑰: "ما يفعله/لا يفعله" rows cut from full sentences to 3–4 word `.c-s` labels; the "عقدان منفصلان" fee-model paragraph moved under "نموذج الأجرة".
- ⑭: the البيّنة enumeration footnote moved under "ما تحويه البيّنة".

**Polish.**
- `.lg-title` and `.cer-h` got tighter `letter-spacing:-.02em/-.01em` (large-title tracking, Apple-style).
- `.btn:active{transform:scale(.97)}` added (instant thumb feedback), with a `prefers-reduced-motion: reduce` override that disables the transition/transform.
- New reusable `details.more` pattern (small "؟" chip summary, 12–12.5px collapsed body) for any future progressive-disclosure need — reuse this class instead of inline paragraphs.
- Body line-height already 1.6 (kept — Arabic script reads better slightly looser than 1.5; not changed).

**Deliberately kept as-is** (short, load-bearing, not "study text"): all `.verse` Qur'an citations, `.official-line` closer, `.stopcard`/`.verify` (riba-stop and tamper-evidence messages — these are the spine's safety copy, must stay visible not collapsed), `.banner` one-liners on screens ①③④⑤⑦⑧⑨⑩⑪⑫⑮ (already single confident sentences, not paragraphs), the `.sub` large-title subtitles (already ≤1 line each).

**Suggested next-round targets:**
- Screen ⑨ (قرضٌ مفتوح) `.banner.plain` — "لا موعد، لا تذكير منك، لا حرج. حين ييسّر الله…" is two sentences stacked; could tighten to one.
- Screen ⑫ (الدائرة+) has four stacked `.quote`/`.sec-h` mini-sections in one phone — consider tabs or accordion between "تقسيم بالأصناف / قِسمة دائمة / تخريج / نجمع للهدف" rather than all four always visible.
- Screen ⑮ (محلّ خلاف) `.cell` "🤝 تراضٍ" and "⚖️ قضاء" both carry a full explanatory `.c-s` sentence — candidates for the same `.c-s` → short-label + `details.more` treatment used in ⑯/⑰.
- Consider auditing `.footnote` usage stage-wide: several screens still stack 2 footnotes back-to-back in `.actions` (e.g. ②, ⑦, ⑩) — check if one can be cut or merged.

### Round 2 — dir-a-manuscript.html

**Audit.** This prototype is already compact (3 phones, 243 lines) — no `.stopcard`/`.fixcard`/`.badge-s` copy runs long. The one study-like block: screen ② `.termsq` quoted the full legal إقرار text inline ("أقرّ أنا خالد بأنّ في ذمّتي لنورة مبلغ 2,500 ريال قرضًا حسنًا، وأرُدُّه في أجله، وإن تأخّرتُ فعليّ غرامة 50 ريالًا") — same pattern as dir-b's ⑬.

**Cut / moved behind progressive disclosure.**
- ②: `.termsq` now shows one short line ("قرضٌ حسن 2,500 ريال من خالد لنورة — بشرطِ غرامة تأخير 50 ريالًا") with the full إقرار wording collapsed under a new `details.more` "نصّ الإقرار الكامل".
- Added the `details.more` pattern verbatim (copied from dir-b-sadu.html, recoloured to this direction's gold/mut palette: summary `var(--gold-deep)`, chip `var(--gold-soft)`, body `var(--mut)`).

**Polish.**
- `.wordmark .w` (56px logo mark): `letter-spacing:1px` → `-.02em` (large-title tracking).
- `.sh-title` (bottom-sheet title): added `letter-spacing:-.02em`.
- `.badge-h` (ceremonial seal headline): added `letter-spacing:-.01em`.
- Added `:active{transform:scale(.97)}` feedback to `.go` (row nav buttons) and `.actbar .primary/.ghost` (this direction has no `.btn` class), each with its own `prefers-reduced-motion: reduce` override that disables the transition/transform.

**Deliberately kept as-is:** both `.verse` Qur'an citations, `.stopcard`/`.fixcard` riba-stop and halal-alternative copy (safety copy, spine-critical, stays visible), `.badge-s`/`.dots-q`/`.footline` one-liners (already short), `.simnote`, `.stage-foot` meta footer (outside the phone chrome).

**Verification:** tag balance checked via Node script — `details` 1/1, `div` 76/76, `span` 33/33 (open/close match).

**Suggested next-round targets:**
- dir-c and mobile-3screens prototypes haven't had this pass yet — audit for the same explanatory-block pattern.
- directions-chooser.html — check if its comparison copy per direction is already short-label style or needs the same treatment.

### Round 2b — dir-b-sadu.html follow-up

- ⑨ `.banner.plain`: two stacked sentences ("لا موعد... حين ييسّر الله، يردّ...") tightened into one confident line.
- ⑨ `.actions`: cut the footnote ("السداد: متى ما تيسّر...") — fully redundant with the banner + lg-title already on screen.
- ⑫ الدائرة+: the four stacked `.sec-h`/`.quote` mini-sections converted to a native `<details class="acc">` accordion (no JS), first section ("تقسيم بالأصناف") open by default; added `.acc` CSS (chevron rotates, no default marker) alongside existing `.more` pattern.
- ⑮ محلّ خلاف: `.cell` "🤝 تراضٍ" and "⚖️ قضاء" now show a short label + `details.more` for the explanatory sentence (matches ⑯/⑰ pattern); "﴿والصلح خير﴾" kept visible as the disclosure summary since it's a verse fragment, not explanatory prose.
- Stage-wide footnote audit: ② footnote ("الختم متوقّف حتى يصفو النصّ...") cut — fully restates `.cer-s` above it; ⑦ footnote shortened, dropping the clause duplicating `.sub` ("مجاميع دوائر لا أفراد..."). Checked ④/⑤/⑩/⑪ repeats of the "لا أحمر، لا تشهير، لا غرامة" footnote — each carries unique info on its own screen, left as-is (Shariah/safety-essential, not redundant).
- Verified: `<details>`/`<div>`/`<span>` tag counts balanced (19/19, 515/515, 315/315). RTL, Sadu identity, verses, and riba-stop copy untouched.

### Round 3 — hierarchy & actions

**Primary-action audit (per screen).** Scanned all `.btn.prominent/.tinted/.plain` usage stage-wide: every screen already has at most ONE `.btn.prominent` (or none, for pure info/audit screens ⑬⑯⑰) — no screen had 2+ equal-weight competing CTAs, so no demotions were needed. Confirms rounds 1–2b already got hierarchy right structurally; this round's fixes were narrower:
- ① primary = "أنشئ عهدًا جديدًا"; ② primary = "اختم عبر نفاذ" (disabled while riba-stop active), secondary tinted "أزِل الشرط"; ⑤ primary = "سدّد ما تيسّر", secondary tinted "أحتاج وقتًا"; ⑥ primary = "صدّر سند القاضي"; ⑧ primary = "أرسِل الطلب بالمعروف"; ⑨ primary = "سدِّد جزءًا الآن"; ⑫ primary = "وثّقها كعهد"; ⑭ primary = "صدِّرها كبيّنة محايدة"; ⑪ has only a tinted "ذكّر الدائرة بلطف" (deliberately not `.prominent` — reminder is a soft nudge, not a hard conversion action, correct as-is); ⑬/⑮/⑯/⑰ are read/audit/settings screens with only secondary or no buttons — correct, no forced primary invented.

**Copy cut.** ② secondary button "أزِل الشرط وأعد الصياغة" (4 words) → "أزِل الشرط" (2 words) — "وأعد الصياغة" was redundant with what the action already does.

**Spacing rhythm fix.** `.col` (main content stack, used on all 17 screens) had a uniform 16px gap between every child regardless of relationship. Changed to a real two-tier rhythm:
- `.col{gap:16px}` → `gap:24px` (true section breaks: banner→group, group→group, etc.).
- `.sec-h{margin-bottom:-8px}` → `-16px` (compensates the wider gap so a section header still sits 8px from the group/content it labels — nested-header-to-body relationship preserved at the tighter spacing called for in the reference research).
- Left `.actions{gap:10px}` (button-to-button, already close to the 8px "related items" band) and inline nested spacings (`.c-s margin-top:1px`, `.sealdoc.compact .sl margin-bottom:5px`, etc.) untouched — already correctly tight.

**Amounts/seal check.** `.amt b` (16px/700), `.st .v` (25px/800), `.tile b` (22px/800) were already the strongest visual weight on their cards with `font-variant-numeric:tabular-nums` from round-1/2 work — no change needed. Seal/status captions (`.c-s`) already sit inline directly under the title beside the amount on every loan cell (④⑤⑬⑩). Confirmed no regressions.

**Verification.** Tag balance re-checked after edits: `details` 19/19, `div` 515/515, `span` 315/315, `button` 26/26 (open/close match). Visual identity, RTL, verses, riba-stop/safety copy untouched — only the two CSS rules and one button label above were edited.

**Remaining ideas for final polish round:**
- ⑨ button "سدِّد جزءًا الآن (٥٬٠٠٠)" — the parenthetical shows the loan's original total (5,000), not the partial-payment amount being submitted; worth a copy-clarity fix (e.g. drop the parenthetical or make it the payment amount) next round.
- ⑫ "الدائرة+" accordion: only the first `<details class="acc" open>` is expanded by default — worth confirming this reads as intentional (not "broken/collapsed") on first glance, maybe a one-word "الافتراضي" cue.
- Consider whether ⑬/⑯/⑰ (no primary button) would benefit from one clear "next step" link even though they're read-only screens, vs. leaving them as pure reference — a UX call, not a hierarchy bug.

### Round 4 — final polish

**Round 3 remaining ideas, executed:**
- ⑨ button copy-clarity: "سدِّد جزءًا الآن (٥٬٠٠٠)" → "سدِّد جزءًا الآن" — the parenthetical was the loan's original total (5,000), not the partial-payment amount being submitted, so it was misleading; dropped rather than guessed at a false payment figure.
- ⑫ accordion default-open cue: first `<details class="acc" open>` summary now carries a small `.chip.gold` badge "الأحدث" next to the section title — signals *why* this one is expanded (most recent activity), not "broken/collapsed" on first glance. Uses the existing `.chip` pattern, no new component.
- ⑬/⑰ next-step links: ⑬ (سُلفة بالمعروف) gained a `.btn.tinted "📒 افتح دفتري"` before its existing plain audit button; ⑰ (الإعدادات) gained a `.btn.tinted "🏠 الرئيسيّة"` — both were dead-ends with only a destructive/read-only action. ⑯ (الضمانات والحدود) was **skipped** — it already has a `.row-2` with two tinted/plain nav links ("ما عليّ" / "حافظة الإثبات"), so the next-step affordance was already present from an earlier round; no duplicate added.

**Consistency sweep (`details.more`, `.acc`).** All `.more` instances (⑬×2, ⑭×1, ⑮×2, ⑯×9, ⑰×1 = 15, plus 4 `.acc` on ⑫) share one summary style (`؟` chip + terra text), one collapsed-body size (12.5px/1.85), and the same `.more-body` class — no divergent inline overrides found. `.acc` styling (chevron-rotate summary, no marker) intentionally mirrors `.more`'s "hidden until asked" restraint but stays visually distinct (section-header weight vs. small link) since accordion sections are primary content, not footnotes — correct as designed, no change needed.

**Contrast check.** Computed WCAG ratios (Node, sRGB relative-luminance) for every body-text-on-background pair in the stylesheet: ink/ink2/ink3 on ground+card, terra/teal-text/gold-text/stop/amber on their `-soft` fills, seal-lbl/seal-ink/seal-hash on `--seal-bg`, amber chip text. **All 15 pairs clear 4.5:1** (lowest: `.banner.plain` ink2-on-plain-soft at 4.70:1; highest ink-on-ground 14.6:1). The one sub-4.5 value found (`--gold` #a8863f on white, 3.42:1) is the emblem's decorative SVG stroke, never body text — no fix needed. No palette changes made.

**Micro-typography.** `.amt`, `.st .v`, `.tile b`, `.status` already had `font-variant-numeric:tabular-nums` from earlier rounds. Added it to `.chip` (missing — chips show counts like "٥ موثّق", "٩ ← ٢"). Checked all `letter-spacing` uses: only on large titles (`.lg-title -.02em`, `.cer-h -.01em`) and decorative Latin/monospace elements (`.stage-head .k`, `.status .r`, `.doc-id .ds` serial) — no negative tracking on small Arabic body text; none found needing removal.

**Verification.** Tag balance after all edits: `details` 19/19, `div` 515/515, `span` 316/316, `button` 28/28 (2 new buttons, 1 new span from this round accounted for). RTL, verses, riba-stop/safety copy, demo/ untouched.

**READY FOR FINAL REVIEW.**

## Final review (orchestrator, Claude-E)

Verdict: **PASS — ready for owner review.**

- 4 worker rounds landed on dir-b-sadu.html (copy cuts → disclosure pattern → hierarchy/spacing → craft polish). dir-a got one pass before scope narrowed.
- Static verification: tags balanced (details 19/19, div 515/515, button 28/28); 15 `details.more` + 4 `.acc` accordion disclosures; `:active` scale feedback + `prefers-reduced-motion` + `tabular-nums` + large-title negative tracking all present.
- Only 2 visible text blocks >120 chars remain outside disclosures: one Qur'an verse pair and one sealed-record spine line — both deliberately kept (safety/identity copy, per rules).
- Contrast: all 15 text pairs >=4.5:1 (worker-computed, lowest 4.70:1).
- Browser screenshot review skipped: browser pane unresponsive overnight (2x timeout). Owner should open dir-b-sadu.html visually in the morning; no structural risk detected.
- demo/ untouched; no engine/logic files changed; nothing committed.
