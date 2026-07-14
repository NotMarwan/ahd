# Contract: Stage Path v1

Each path must declare:

```text
id | maximum_seconds | entry_screen | ordered_beats | exit_screen | fallback_path
```

Each beat must declare:

```text
time_window | exact_spoken_line | exact_action | expected_visible_text | evidence_key | failure_action
```

Rules:

- Primary maximum is 180 seconds; target range is 165-180.
- Exact action labels must exist in current screen source.
- Numeric claims require evidence keys.
- Modeled or synthetic claims require adjacent visible labels.
- Manual typing is prohibited in the primary cold open unless rehearsal evidence proves no timing regression.
- Every primary beat has a no-app or no-terminal fallback.
- The close holds proof or mercy, never a generic home view.

