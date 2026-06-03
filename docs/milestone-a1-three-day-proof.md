# Milestone A1 — Three-Day Proof (build notes + how to test)

> **Narrowed scope** (per founder call): build **3 days**, not 7. The real risk is whether **Day 2 and Day 3** earn the return — if they don't, D7 never matters.
> **Success question:** *Do children voluntarily return for Day 2 and Day 3, and do parents feel good about saying yes?*
> Built on the Harmony Harbor base. Live: `https://xolacreator.github.io/Revi-Star/` · Files: `index.html` + `a1.js` + `a1.css`.

## What's in the build
- **Avatar creation** (skin / hair / color) — the child's own Star Hunter, which grows alongside Rumi.
- **Data-driven activity system** (the content-pipeline seed): templates `soundMatch · firstSound · wordPicture · blend`, fresh items per day, **no repeats**.
- **3 distinct days**, each 5–10 min:
  - **Day 1** — Letter sounds · meet Rumi · find Twinkle · **Rumi → Rising Star** transformation.
  - **Day 2** — Sight words (new template) · **avatar earns a hat** · **Twinkle evolution hint** · new reading objective.
  - **Day 3** — Blending (third type) · **mini story beat** (keeper's note) · **Twinkle evolves → Glimmerfox** · **avatar cape** · post-test.
- **No-fail adaptive** activities (Hear-it / Hint / model-after-2-misses), instrumented per item.
- **Daily progression + reward + "tomorrow" tease**; harbor blooms gray→color.
- **Pre/Post "Star Check"** (6 transfer items, hint-free, <3 min) before Day 1 and after Day 3.
- **Parent dashboard** (behind a 3-7-1 parental gate): Reading + Confidence bars, 3 streak dots, **"here's what your child practiced today,"** pre/post Stars, **data export**.
- **Real day-gating:** one day per calendar day; natural return required.

## How to run the test
- **Normal play:** open the link, sound on. The child plays one day, then sees "See you tomorrow!" Returning on a new calendar day unlocks the next day.
- **Moderator shortcuts** (don't use during the real return test):
  - `?day=1|2|3` — jump to a specific day.
  - `?observe=1` — show the **Observer bar** to timestamp **Time-to-Delight** (first smile / first "wow!").
  - `?reset=1` — wipe local test data.
  - In the **Parent panel** (👪 → tap 3-7-1): **Simulate next day**, **Reset**, and **⬇️ Export data** (downloads `state` + full event log as JSON).

## New metrics wired in
- **Time-to-Delight:** auto-captures `first_interaction` (first voluntary tap) and `first_reward` (first sparkle/correct); Observer bar logs `delight_smile` / `delight_excited` (ms from launch).
  - 🟢 first delight <60s / first exploration <90s · 🟡 60–120 / 90–180 · 🔴 >120 / >180.
- **Parent Re-Engagement Intent:** after Day 3, the parent panel asks *"If your child asked to play again tomorrow, would you encourage it?"* → logged `parent_reengage{yes|maybe|no}`.
  - 🟢 ≥80% Yes · 🟡 60–79% · 🔴 <60%.

## 3-Day Proof success gate (expand to full Week-One if green across all)
**D1 retention · D3 retention · Learning gain (pre→post) · Parent value perception · Time-to-Delight.**
Green on all → authorize the full 7-day Week-One Loop. (Thresholds: see `week-one-loop-spec.md` §8.)

## Analytics captured (exportable JSON)
`app_open, avatar_created, day_start, activity_start, activity_item{skillId,correct,hints,modeled,firstTry}, hint_used, first_interaction, first_reward, delight_smile, delight_excited, rumi_evolve, twinkle_evolve, day_complete, starcheck_item/done{phase,score}, dashboard_view, parent_reengage{value}.`
Derive D1/D3 return, hint-usage trend, independent-attempt rate, modeled rate, pre→post gain, time-to-delight, re-engagement intent.

## Honest caveats
- I can't run WebGL in this environment — validated by syntax + Three.js API smoke tests, not a live render. **Please confirm it loads on a device.**
- Audio uses the device's built-in voice (Web Speech API); quality varies. Production = recorded VO.
- Day-gating uses local device date/localStorage (no accounts) — fine for a moderated 3-day test; a real at-home study would add lightweight accounts/cloud.
