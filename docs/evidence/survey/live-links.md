# Live Google Form & Distribution Links

Here are the live URLs for the anonymous demand survey created on **2026-07-14**:

- **Google Form Edit URL (Owner only):**  
  [Edit Form](https://docs.google.com/forms/d/14GW0PKNiuA0DC7pcyqY0Gy4Sdwo8H7y4YTzf6hY0PbI/edit)

- **Google Form Published URL:**  
  [Published Form](https://docs.google.com/forms/d/e/1FAIpQLScGXB-db-4SlDzQUMaDzI7arj2Giv8eVYAEpL4RkcoFPgn3VQ/viewform)

## Seed Group Distribution Links (Prefilled)

Distribute the following prefilled links to five unrelated seed groups. According to the [Owner Runbook](file:///C:/Users/wasan/Downloads/Amad%20Hackathon%20Worktrees/roadmap-integration/docs/evidence/survey/OWNER-RUNBOOK.md):
- Keep Google Form email collection, login requirement, one-response limit, and IP collection off.
- Keep the response Sheet private.
- Seek at least **10 valid responses** per seed group.
- Stop a source group if it exceeds **40% of valid responses**.

| Code | Label | Prefilled Link |
|---|---|---|
| **G1** | مجموعة نشر 1 | [Prefilled Link G1](https://docs.google.com/forms/d/e/1FAIpQLScGXB-db-4SlDzQUMaDzI7arj2Giv8eVYAEpL4RkcoFPgn3VQ/viewform?usp=pp_url&entry.886087108=G1) |
| **G2** | مجموعة نشر 2 | [Prefilled Link G2](https://docs.google.com/forms/d/e/1FAIpQLScGXB-db-4SlDzQUMaDzI7arj2Giv8eVYAEpL4RkcoFPgn3VQ/viewform?usp=pp_url&entry.886087108=G2) |
| **G3** | مجموعة نشر 3 | [Prefilled Link G3](https://docs.google.com/forms/d/e/1FAIpQLScGXB-db-4SlDzQUMaDzI7arj2Giv8eVYAEpL4RkcoFPgn3VQ/viewform?usp=pp_url&entry.886087108=G3) |
| **G4** | مجموعة نشر 4 | [Prefilled Link G4](https://docs.google.com/forms/d/e/1FAIpQLScGXB-db-4SlDzQUMaDzI7arj2Giv8eVYAEpL4RkcoFPgn3VQ/viewform?usp=pp_url&entry.886087108=G4) |
| **G5** | مجموعة نشر 5 | [Prefilled Link G5](https://docs.google.com/forms/d/e/1FAIpQLScGXB-db-4SlDzQUMaDzI7arj2Giv8eVYAEpL4RkcoFPgn3VQ/viewform?usp=pp_url&entry.886087108=G5) |

## Data Analysis & Pipeline

1. Export responses from the linked Google Sheet as a CSV file.
2. Store the raw CSV file in `private/survey/responses.csv` (gitignored).
3. To analyze and export aggregate-only results, run:
   ```bash
   node tools/survey/analyze-responses.cjs private/survey/responses.csv > docs/evidence/survey/aggregate-results.md
   ```
