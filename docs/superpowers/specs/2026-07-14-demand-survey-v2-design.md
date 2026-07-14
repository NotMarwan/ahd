# Ahd Demand Survey v2 Design

## Purpose

Build a short Arabic Google Form that produces honest, judge-grade directional evidence about interpersonal qard-hasan behavior in Saudi Arabia. Product-learning is secondary and appears only after the problem measures.

The survey does not estimate national prevalence, market size, creditworthiness, or individual risk. It does not close `OT-A1`; survey-only evidence can move it to `SUPPORTED-DIRECTIONAL` when the preregistered thresholds and sample-quality rules pass.

## Current v1 findings

- The schema contains 17 fields; delayed-repayment respondents see 17 and other eligible respondents see 14, including the recruitment code. This is longer than the stated 11–12-question path.
- The analyzer counts voluntary forgiveness with avoidance. Mercy and agreed grace must remain analytically separate from reluctance to ask.
- The H3 low-documentation base includes only “no documentation,” while the preregistration also intends WhatsApp and personal notes.
- Age, nationality, amount, and two attitude scales add burden without affecting the current decision rule.
- Consent and eligibility are branching questions in the same Google Forms section. Each branch decision needs its own section.
- The builder creates a Form but not the promised linked response Sheet.
- The tracked live-links file includes the editor URL. Tracked output should contain public distribution URLs only; editor and response-Sheet URLs stay private.

## Design principles

- Ask past behavior before attitudes or the product concept.
- Ask one concept per question using plain, neutral Arabic.
- Keep ordinal response scales ordered; do not randomize them.
- Give respondents comfortable rejection, uncertainty, and privacy options.
- Put the product concept last and label its results exploratory.
- Use forced single-choice answers because every metric needs one unambiguous denominator.
- Pretest wording and routing before field collection.

These choices follow Pew Research Center guidance on neutral wording, question order, exhaustive non-overlapping choices, and pretesting, plus CDC guidance on empirical question evaluation and response-error reduction.

## Respondent flow

Google Forms sections are fixed in this order:

1. `consent`: decline submits immediately; accept routes to eligibility.
2. `eligibility`: ineligible respondents submit immediately; eligible respondents continue.
3. `behavior`: experience role and delayed-repayment question.
4. `delay_experience`: shown only when delayed repayment is “yes.”
5. `documentation_and_fit`: documentation, reminder, written-agreement preference, exploratory product priority, and prefilled source code.

The delayed path contains 12 visible questions including the prefilled source code. The non-delayed path contains 9. Target completion time is 2–3 minutes.

## Exact instrument

### Q1 — `consent`

Required. “No” submits the form.

> هل توافق على المشاركة الطوعية في هذا الاستبيان المجهول واستخدام إجاباتك بصورة مجمعة لأغراض هذا المشروع البحثي؟

- نعم
- لا

### Q2 — `eligible`

Required. “No” submits the form.

> هل عمرك 18 سنة أو أكثر وتقيم حاليًا في المملكة العربية السعودية؟

- نعم
- لا

### Q3 — `experience_12m`

Required. H1 uses respondents who do not select the privacy option.

> خلال آخر 12 شهرًا، أيٌّ من الآتي حدث لك مع شخص تعرفه، دون فائدة؟

- أقرضت شخصًا فقط
- اقترضت من شخص فقط
- أقرضت واقترضت
- لم يحدث أي منهما
- أفضل عدم الإجابة

### Q4 — `delayed_repayment`

Required. Only “yes” routes through the delay-experience section.

> هل سبق أن تأخر شخص تعرفه في إعادة مبلغ أقرضته له؟

- نعم
- لا
- لم أقرض شخصًا
- لا أتذكر
- أفضل عدم الإجابة

### Q5 — `asking_awkwardness`

Required only on the delay path. The last two substantive choices form the H2 awkwardness numerator.

> في آخر مرة تأخر فيها السداد، كيف كان شعورك عند طلب المبلغ؟

- غير محرج إطلاقًا
- غير محرج نوعًا ما
- لا هذا ولا ذاك
- محرج نوعًا ما
- محرج جدًا
- أفضل عدم الإجابة

### Q6 — `first_action`

Required only on the delay path. H2 avoidance includes hinting, postponing, and not asking to protect the relationship. Agreed grace and voluntary forgiveness are excluded.

> في آخر مرة تأخر فيها السداد، ماذا فعلت أولًا؟

- طلبت المبلغ مباشرة
- لمّحت بدل أن أطلب مباشرة
- انتظرت وأجلت الطلب
- اتفقنا على مهلة جديدة
- أبرأت الدين أو سامحت به برغبتي
- لم أطلب حفاظًا على العلاقة
- أفضل عدم الإجابة

### Q7 — `relationship_effect`

Required only on the delay path. The two negative choices form the H2 strain numerator.

> بعد تلك التجربة، كيف تأثرت علاقتك بالشخص؟

- تحسنت
- لم تتأثر
- تأثرت سلبًا بدرجة بسيطة
- تأثرت سلبًا بدرجة واضحة
- أفضل عدم الإجابة

### Q8 — `documentation_method`

Required. H3 low-documentation choices are WhatsApp, personal note, and no documentation.

> عند الإقراض أو الاقتراض بين المعارف، كيف توثّق الاتفاق عادة؟

- اتفاق مكتوب يوضح المبلغ والشروط
- تحويل بنكي مع مرجع
- محادثة عبر واتساب
- ملاحظة شخصية
- لا أوثّق
- لم يسبق لي التعامل
- أفضل عدم الإجابة

### Q9 — `reminder_preference`

Required. H3’s numerator is automatic-neutral or trusted-third-party reminder. “I do not know” and the privacy option are excluded from the metric denominator.

> إذا تأخر السداد، ما طريقة التذكير الأكثر راحة لك؟

- أطلب مباشرة بنفسي
- تذكير آلي ومحايد
- تذكير من شخص ثالث موثوق
- أفضل عدم التذكير
- لا أعرف
- أفضل عدم الإجابة

### Q10 — `agreement_preference`

Required. This is a descriptive product-fit measure, not a pass/fail hypothesis.

> عند قرض جديد بينك وبين شخص تعرفه، أي خيار يجعلك أكثر اطمئنانًا؟

- اتفاق مكتوب وواضح
- اتفاق شفهي فقط
- لا فرق لدي
- يعتمد على الشخص أو المبلغ
- لا أعرف
- أفضل عدم الإجابة

### Q11 — `product_priority`

Optional and exploratory. It appears only after all H1–H3 inputs. Its result cannot validate the problem.

> تخيّل خدمة تحفظ اتفاق القرض، وترسل تذكيرًا متفقًا عليه، وتثبت السداد، دون أن تقرض المال أو تفرض فائدة أو غرامة أو تحكم بين الطرفين. ما الخيار الأكثر قيمة لك؟

- توثيق الاتفاق
- التذكير المحايد
- إثبات السداد
- طلب مهلة أو إبراء الدين
- لا أرى قيمة في الخدمة
- لا أعرف
- أفضل عدم الإجابة

### Q12 — `source_group`

Required and prefilled through five distribution URLs. It remains visible because Google Forms does not provide a trustworthy hidden-field control.

> رمز مجموعة النشر — اتركه كما هو

- G1
- G2
- G3
- G4
- G5

## Preregistered analysis

### H1 — observed interpersonal lending/borrowing

- Base: eligible respondents answering Q3 with a substantive option.
- Numerator: lent only, borrowed only, or both.
- Pass threshold: at least 35%.

### H2 — delayed-repayment relational pain

- Base: respondents answering “yes” to Q4 and a substantive answer to each relevant conditional item.
- Awkwardness numerator: “somewhat awkward” or “very awkward”; threshold 50%.
- Avoidance numerator: hinting, postponing, or not asking to protect the relationship; threshold 30%.
- Strain numerator: either negative relationship-effect option; threshold 20%.
- H2 passes only when all three components pass.

### H3 — preference for a neutral reminder among low-documenters

- Base: respondents selecting WhatsApp, personal note, or no documentation at Q8 and giving a substantive Q9 answer.
- Numerator: automatic-neutral or trusted-third-party reminder.
- Pass threshold: at least 40%.

### Descriptive outputs

- Written versus verbal agreement preference.
- Product-priority distribution, reported separately as exploratory.
- “No value” share reported explicitly; it is never hidden inside neutral answers.
- Counts, integer percentages, and denominator `n` for every published metric.

## Evidence status and privacy

- Fewer than 80 valid responses: exploratory; no headline percentage.
- 80–149: directional pilot.
- 150–250: strong directional convenience evidence.
- Normal stop: 250. Optional absolute stretch: 384 only if recruitment diversity remains acceptable.
- Public subgroup result requires `n >= 20`.
- Suppress aggregate cells with `n < 10`.
- Flag possible duplicates for manual review; never delete automatically.
- Raw Form responses, timestamps, editor URL, and Sheet URL remain private and uncommitted.
- Commit only the public Form URL, prefilled G1–G5 links, preregistration, and aggregate results.
- Never claim national representativeness, causal effects, market size, external approval, or individual-level insight.

## Sampling and pretest

1. Conduct cognitive pretests with 5–8 adults. Ask each participant what they thought every question meant and which answer was difficult to select.
2. Correct comprehension or routing defects, increment the schema version, regenerate the Form, and discard pretest responses.
3. Soft-launch to 20 valid responses. Check branch completion, missing fields, source codes, and actual completion burden.
4. If wording changes after the soft launch, create a new Form version and exclude prior responses from final analysis.
5. Recruit through five unrelated seed groups, with at least 10 valid responses per group and no group above 40% of the valid sample.
6. Target 150 valid responses; stop normally at 250.

## Builder and data architecture

### Canonical schema

`docs/evidence/survey/form-spec.json` remains the single source of truth and moves to version `2.0.0`. It defines sections, questions, options, routing targets, confirmation text, privacy settings, hypotheses, and sample rules.

### Renderer

`tools/survey/render-google-form.cjs` becomes schema-driven. It loops through sections and questions rather than hardcoding question-ID arrays or Arabic routing strings. It validates every referenced section and branch target before emitting the Apps Script.

### Generated Apps Script

`tools/survey/build-google-form.gs` creates:

- the v2 Form;
- a private linked response spreadsheet;
- separate consent, eligibility, behavior, delay-experience, and common sections;
- G1–G5 prefilled distribution links.

The script logs editor and Sheet URLs for the owner’s private use. Those URLs must never enter tracked live-link files.

### Analyzer

The public interface remains:

```text
loadResponses(csvText)
validateResponse(row)
summarize(rows, { kFloor: 10, minPublicGroup: 20 })
renderMarkdown(summary)
```

Validation accepts v2 column IDs only. The analyzer reports separate denominators for H1 and every H2/H3 component, excludes privacy/unknown choices from those denominators, and never treats grace or forgiveness as avoidance.

### Live-form migration

- Preserve the current v1 Form and any responses as a pilot artifact.
- Create a new v2 Form and Sheet; do not rewrite v1 in place.
- If v1 has responses, do not combine them with v2 because wording and analytical categories changed.
- Replace public distribution links only after the v2 pretest passes.
- Remove the tracked editor URL from the v1 live-links artifact; retain only public distribution URLs.

## Testing and acceptance

- Schema test proves exactly 12 fields, exact order, exact Arabic options, and 9/12 path lengths.
- Routing test proves consent and eligibility occupy separate sections and decline/ineligible answers submit.
- Routing test proves only delayed-repayment “yes” enters the three-question pain section.
- Builder test proves a linked response Sheet is created and private URLs are excluded from tracked artifacts.
- Privacy test rejects personal-data fields, free-text money fields, login/email collection, and committed editor/Sheet URLs.
- Analyzer test proves voluntary forgiveness and agreed grace do not count as avoidance.
- Analyzer test proves WhatsApp, personal note, and no documentation enter the H3 base.
- Denominator tests prove privacy/unknown answers are excluded without invalidating an otherwise eligible response.
- Suppression, duplicate-flag, source-distribution, CSV quoting, and preregistered-threshold tests remain green.
- Full project gate and frozen-demo tripwire must pass unchanged.

## References

- Pew Research Center, “Writing Survey Questions”: https://www.pewresearch.org/writing-survey-questions/
- CDC CCQDER, “Question Evaluation”: https://www.cdc.gov/nchs/ccqder/question-evaluation/index.html
- Government Analysis Function, “Questionnaire Design Guidance”: https://analysisfunction.civilservice.gov.uk/policy-store/questionnaire-design-guidance/
