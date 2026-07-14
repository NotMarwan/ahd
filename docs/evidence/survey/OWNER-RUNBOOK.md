# Anonymous demand survey v2 — owner runbook

This is a directional convenience survey, never a nationally representative study. It contains no free text and collects no name, email, phone, national ID, bank/account data, or IP address.

## Build

1. Run `node tools/survey/render-google-form.cjs` and confirm `node tests/app/survey-form.test.cjs` passes.
2. Paste `tools/survey/build-google-form.gs` into a new Google Apps Script project and run `buildAhdDemandSurveyV2`.
3. Keep the logged editor and response-Sheet URLs private. Copy the complete logged JSON only to `private/survey/v2-build-log.json`.
4. Do not edit or replace the v1 Form. Never combine v1 and v2 responses because wording and analytical categories differ.

## Pretest and launch

5. Complete `PRETEST-CHECKLIST.md` with 5–8 adults. Discard those responses.
6. Correct any comprehension or routing defect in `form-spec.json`, increment the schema version, regenerate the script, and create a fresh Form.
7. Soft-launch the frozen wording to 20 valid responses. If wording changes, create another Form and exclude the earlier responses.
8. After the pretest passes, publish sanitized links with:
   `node tools/survey/export-public-links.cjs private/survey/v2-build-log.json docs/evidence/survey/live-links.json docs/evidence/survey/live-links.md 2.0.0 pretest-passed-active`
9. Use five unrelated seed groups. Seek at least 10 valid responses per group and stop distributing to a group before it exceeds 40% of valid responses.
10. Hard minimum: 80 valid responses. Target: 150. Normal stop: 250. Use the optional 384 stretch only while recruitment diversity remains acceptable.

## Private analysis

11. Keep the linked Sheet private. Export raw CSV only to `private/survey/responses-v2.csv`; never commit raw rows, timestamps, screenshots of rows, editor URLs, Sheet URLs, or contact data.
12. Run `node tools/survey/analyze-responses.cjs private/survey/responses-v2.csv > docs/evidence/survey/aggregate-results.md`.
13. Review duplicate candidates manually; never auto-delete them. Publish no subgroup below `n = 20` and suppress metric bases below `n = 10`.
14. Below 80 valid responses, publish no headline percentage. At 80–149 label evidence a directional pilot; at 150–250 label it strong directional convenience evidence.
15. Survey-only evidence can be `SUPPORTED-DIRECTIONAL` only when H1, all three H2 components, H3, and source-distribution rules pass. It never closes OT-A1 or establishes Saudi national representativeness.
16. Report the concept question separately as exploratory. It cannot prove that the underlying problem exists.
