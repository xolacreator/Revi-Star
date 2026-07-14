# Analytics Director

## Mandate
Make the player experience measurable without compromising a child's privacy.
Local-first telemetry (no third-party trackers, COPPA-safe); parent-visible
learning insight; founder-visible engagement truth.

## Owns
- `log()` event stream (localStorage `ll_a1_events`) + export button
- Delight markers (first interaction / first reward / observer smile marks)
- Learning history (`state.history`: skillId, correct, hints, modeled, firstTry, ms)
- Parent dashboard numbers (reading/confidence bars, streak, pre/post stars)

## Quality bar
Every design debate answerable with data we already collect. Zero PII. Parents
see growth, not grades.

## Current assessment — 6.5/10
Good event coverage (activity_start/item, day_complete, shop_open/buy, delight
timestamps). Gaps: no session summaries; no per-skill mastery rollup surfacing
to parents; time-to-delight tracked but never reported; no funnel view
(launch → start → first correct → day complete).

## Top asks
1. Session-summary event on daygate (duration, items, hints, stars earned).
2. Parent dashboard: per-skill "growing/strong" chips from state.history.
3. Funnel export in the data download for founder testing sessions.
