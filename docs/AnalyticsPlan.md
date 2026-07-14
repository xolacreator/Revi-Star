# Analytics Plan — Analytics Director Design
_2026-07-14 · live build v88 · principles: local-first, COPPA-safe, zero PII,
zero third-party trackers. Everything below uses the existing `log()` →
localStorage → parent-gate export pipeline._

## What we already capture (keep)
`activity_start/activity_item` (skillId, correct, hints, modeled, firstTry, ms) ·
`day_complete` (stars, stages) · `shop_open/shop_buy` · `first_interaction` /
`first_reward` (time-to-delight ms) · observer smile/wow marks · launch counts ·
voice pref · full `state.history` per item.

## Gaps → new events (implementation-ready)
| Event | Fields | Question it answers |
|---|---|---|
| `session_end` (fire on daygate + visibilitychange) | dur_s, items_done, hints, stars_earned, props_tapped, npc_taps | Real session length; explore vs lesson split |
| `lesson_pace` (every 7th item) | idx, avg_ms_last7, hints_last7 | Where the 21-item run flags (validates mid-set celebrations) |
| `skill_mastery` (rollup on day_complete) | per-skill: attempts, acc, trend | Feeds adaptive picker + parent chips |
| `funnel` (auto milestones) | launch→start→first_correct→7th→14th→day_complete timestamps | Where children drop within day 1 |
| `shop_view_item` / `shop_deny` | item_id, stars_at_time | Price tuning; is 8⭐ aspirational or discouraging? |
| `idle_stall` (>20s no input in explore) | where (pos), recovered_by (tap/hint/twinkle) | Objective-clarity failures |
| `vo_missing` (say() with no clip) | clip_id | Voice coverage debt, live from the field |

## Derived metrics (computed at export, not stored)
- **Time-to-delight:** first_interaction & first_reward (target <60s / <3min).
- **Success rate per skill:** target band 75–85% (bible's ZPD ~80%); outside
  band = difficulty mis-tuned, flag in export.
- **Hint dependency:** hints per correct, trending down per skill = learning.
- **Return cadence:** completedDays date deltas (streak honesty vs streak UI).
- **Economy health:** stars earned vs spent per session; days-to-first-purchase.

## Parent-facing (dashboard additions)
1. Per-skill chips from `skill_mastery`: "Letter sounds — strong ⭐" /
   "Rhyming — growing 🌱" (never negative framing).
2. "This week": sessions, minutes, new skills touched, favorite activity.
3. Keep raw export button (founder testing) — add the derived metrics to it.

## Founder testing view
The existing `?observe=1` bar + export already supports live sessions. Add the
funnel + session_end to the export JSON so a single file tells the whole story
of a playtest. No dashboards to build — the founder reads one JSON or hands it
to an AI session for analysis.

## Privacy stance (restate every time analytics changes)
All data stays on-device in localStorage. Export is a manual parent-gated
button producing a local file. No network beacons, no IDs, no PII, no third
parties. If cloud sync ever arrives, it is opt-in, parent-gated, anonymized.
