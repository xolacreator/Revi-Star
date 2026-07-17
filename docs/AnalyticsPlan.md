# Analytics Plan — Analytics Director Design
_Rev. 2 · 2026-07-15 · principles unchanged: local-first, COPPA-safe, zero
PII, zero third-party trackers. Evidence this rev: a real captured event
stream from the scripted Day-1 session._

## Ground truth (captured from an actual session)
15 events: `hero_model_loaded → app_open → tutorial_done → starcheck_item ×7
(skillId + correct ✅) → starcheck_done → day_start → dashboard_view`.
Confirms: per-item skill data is rich and correctly shaped; **and the gaps are
real** — no session_end, no explore telemetry (0 events between day_start and
dashboard_view despite 6 minutes of world time), no funnel milestones, and
`hero_model_loaded` fires before `launchT` (rel:null) while logging junk node
names ("RootNode" — QA Q9).

## What we already capture (keep)
`activity_start/activity_item` (skillId, correct, hints, modeled, firstTry,
ms) · `starcheck_item/done` (phase, skillId, correct) · `day_start/complete` ·
`shop_open/buy` · `tutorial_done` · `dashboard_view` · first_interaction /
first_reward delight ms · observer smile/wow · launch counts · full
`state.history`.

## Gaps → new events (implementation-ready; all through existing log())
| Event | Fields | Question it answers |
|---|---|---|
| `session_end` (daygate + `visibilitychange→hidden`) | dur_s, items_done, hints, stars_earned, props_tapped, npc_taps, shop_visits | True session length; explore↔lesson split (currently a 6-min blind spot — proven above) |
| `explore_ping` (throttled 60s while free-roaming) | pos_zone, moving | Where children actually spend world time |
| `lesson_pace` (every 7th item) | idx, avg_ms_last7, hints_last7 | Where the 21-item run flags (validates celebrations) |
| `skill_mastery` (rollup at day_complete) | per-skill attempts/acc/trend | Adaptive picker (Learning L3) + parent chips |
| `funnel` milestones | launch→start→first_correct→7th→14th→day_complete ts | Day-1 drop points |
| `shop_view_item` / `shop_deny` | item_id, stars_at_time | Price tuning: aspirational vs discouraging |
| `idle_stall` (>20s no input in explore) | pos, recovered_by | Objective-clarity failures; feeds Twinkle helper |
| `vo_missing` (say() with no clip) | clip_id | Live voice-coverage debt (would have caught the silent `extra` batch months earlier) |
| Fix | `hero_model_loaded`: fire after launchT, log clean names | Q9 |

## Derived metrics (computed at export)
Time-to-delight (<60s / <3min targets) · per-skill success in the 75–85% ZPD
band · hint dependency trending down = learning · return cadence from
completedDays deltas · economy health (earn vs spend, days-to-first-purchase)
· NEW: explore ratio (world-time ÷ session-time — the "is it a game or a
quiz" number, target ≥ 35%).

## Parent-facing (dashboard)
Per-skill chips ("Letter sounds — strong ⭐ / Rhyming — growing 🌱", never
negative) · "This week": sessions, minutes, skills touched, favorite activity
· raw export keeps everything + derived metrics appended.

## Founder testing view
`?observe=1` bar + export unchanged. Export gains: funnel, session summaries,
explore ratio — one JSON tells a playtest's whole story; hand it to an AI
session for analysis. Q7 (`?day=N`) also unblocks cohort-style testing of
week-2 content.

## Privacy stance (restated, unchanged)
All data on-device (localStorage). Manual, parent-gated export to a local
file. No beacons, no IDs, no PII, no third parties. Cloud sync, if ever, is
opt-in + parent-gated + anonymized.
