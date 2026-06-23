# Plan · Deepen-08 — الدائرة: a group reminder that never names the late

**Lane:** treasurer dashboard. **Mode:** additive pure logic + screen action. **Spine:** «ذمّة المناسبة
محفوظة»; the reminder is collective and NEVER names/exposes a late member; mercy (2:280); no زيادة; no score.

## Where it is now
`circleDashboard` projects the golden circle engine (member states + occasion progress + one seal). The screen
only *describes* the dignity rule in a note — there is no actual group reminder.

## Deepen (TDD first, `app/circle-reminder.test.cjs`)
1. **`groupReminder(circle, engine)`** → `{ar, pendingCount, collective, namesAnyone}`. THE DIGNITY GUARANTEE:
   the reminder text contains **NO member name** (`namesAnyone === false`; asserted directly that every member
   name is absent from `ar`). It addresses the whole circle, carries the 2:280 mercy + the «احتاج وقتًا» exit,
   states no زيادة, and uses no shaming/مطالبة language. `pendingCount` is a dignified tally, never a named list.

## Surface (the screen)
2. `screens/circle.js`: a **«ذكّر الدائرة بلطف 🤍»** action (`AhdApp.circleReminderToggle`) that previews the
   group reminder card («تذكيرٌ جماعيّ (لا يُسمّى أحد)») + a foot line tallying who it reaches without naming.
   The treasurer still sees each member's private dignified state; only the *outgoing* reminder names no one.

## Guards
- Existing `circle.test.cjs` (14) stays green. New logic TDD'd; DOM-smoke grown (the reminder names no member).
- Golden circle engine reused, untouched. No number/score; integer halalas; determinism + offline preserved.
- Real-browser: the reminder previews and contains NO member name; 0 console errors; Arabic correct.
- The Shariah-gated mode-B pooled deposit (D-3) is NOT touched here.
