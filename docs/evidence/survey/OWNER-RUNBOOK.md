# Anonymous demand survey — owner runbook

This is a directional convenience survey, never a nationally representative study. It contains no free text and collects no name, email, phone, ID, account data, or IP address.

1. Generate Google Apps Script: `node tools/survey/render-google-form.cjs`.
2. Paste `tools/survey/build-google-form.gs` into a new Apps Script project, run `buildAhdDemandSurvey`, and copy the logged prefilled links for G1–G5.
3. Keep Google Form email collection, login requirement, one-response limit, and IP collection off. Keep the response Sheet private.
4. Distribute only through five unrelated seed groups. Record only source code G1–G5. Stop a source group if it exceeds 40% of valid responses; seek at least 10 valid responses per seed group.
5. Store raw CSV/Sheet exports only under `private/survey/` (gitignored). Never commit raw responses, contact data, screenshots with row data, or personal identifiers.
6. Export aggregate-only results: `node tools/survey/analyze-responses.cjs private/survey/responses.csv > docs/evidence/survey/aggregate-results.md`. Review duplicate candidates manually; the tool never deletes them.
7. Do not report subgroup results with fewer than 20 respondents or any cell with base under 10. Report base n and whole-number percentages. Below 80 valid responses is exploratory; 80–149 is a directional pilot; 150–250 is strong directional convenience evidence.
8. Survey-only evidence may be labelled `SUPPORTED-DIRECTIONAL` only when H1, H2, and H3 pass at n≥80. It never closes OT-A1 or establishes national representativeness.
