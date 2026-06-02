# Live Events & Seasonal Content — 12-Month Calendar

> Positive, magical, wondrous. **No fear-based or combat themes — ever.**
> Events encourage **exploration, creativity, and learning**, and keep the world of Lumina alive.

---

## 1. Cadence model

- **Seasons** ≈ 6–8 weeks, themed like a magical idol "era" (a **Comeback**). 6 seasons/year.
- **Weekly rhythm** inside every season:
  - **Mon–Fri:** Today's Adventure (fresh daily quest) + practice + pet care.
  - **Weekend:** **Comeback Concert** premiere (the week's featured song/performance).
- **Monthly tentpole:** one big festival each month (below).
- **Always-on:** core campaign, all districts, daily loop, Star Path.

**Forgiving by design:** events are *opt-in wonder*, never FOMO aimed at a child. **Limited content always returns** (event Star Pals within ~2 seasons; cosmetics within ~4). Nothing makes a child anxious about missing out.

## 2. The 12-month calendar

| Month | Season (era) | Monthly tentpole festival | New story | New Star Pals | Seasonal transformation/cosmetics |
|-------|--------------|---------------------------|-----------|---------------|-----------------------------------|
| **Jan** | **Debut Days** (onboarding era) | **Welcome Festival** (Friendship Plaza) | Ch.1 *Your Debut* | Twinkle, Bubbles (starters) | Trainee → Rising-Star debut outfits |
| **Feb** | Debut Days | **Friendship Festival** (kindness/SEL) | Ch.2 *Helping Hands* | Harmony (rare), Pairy | Heart-themed Concepts; team duet dances |
| **Mar** | **Rainbow Festival** (creativity era) | **Rainbow Festival** (Atelier, tentpole) | Ch.3 *Color the City* | Petal, Splatter | Aurora/rainbow Starlight-Idol looks |
| **Apr** | Rainbow Festival | **Bloom Day** (gardens/growth) | Ch.4 *Bloom Spring* | Vinea, Plusvine | Flower-crown Concepts; spring stages |
| **May** | **Big Concert Tour** (music era) | **Comeback Tour Kickoff** (Beat Boulevard) | Ch.5 *On Stage* | Sunny, Echofly (event) | Tour outfits; new songs + dance moves |
| **Jun** | Big Concert Tour | **Summer Sparkle Festival** | Ch.6 *Sunshine Squad* | Lumie, Disco | Beach/summer Concepts; sunny VFX |
| **Jul** | **Galaxy Explorers** (math & wonder era) | **Comet Count Carnival** (Starlight Station) | Ch.7 *To the Stars* | Comet, Starling (event) | Cosmic/galaxy transformations |
| **Aug** | Galaxy Explorers | **Stargazing Night** (calm wonder) | Ch.8 *Constellations* | Zero, Tally | Night-sky stages; firefly cosmetics |
| **Sep** | **Story Tide** (reading era) | **Story Tide Festival** (Harmony Harbor) | Ch.9 *Tales of Lumina* | Gully, Rhymee | Storybook Concepts; lyric VFX |
| **Oct** | Story Tide | **Lantern Night** (Echo Meadow, cozy) | Ch.10 *Memory Lane* | Wink Jr., Lantern | Lantern-glow cosmetics; cozy dances |
| **Nov** | **Friendship Forever** (SEL era) | **Gratitude Gathering** (kindness) | Ch.11 *Better Together* | Confetti, Cinder (story pal) | Warm-tone Concepts; group finale dance |
| **Dec** | **Starlight Winter** (cozy era) | **Winter Wonderlight Festival** | Ch.12 *Winter Wishes* | Frostbite, Mochi | Snow/holiday transformations + songs |

> **Anniversary** (around launch month each year) overlays any season: a huge **free** gift (a guaranteed Star Pal selector + a free Concept), a "best-of" song medley concert, and a **Fashion Show** of player-designed outfits. Pure celebration.

## 3. Recurring event templates (data-driven)

| Template | Pillar | Loop | Reward |
|----------|--------|------|--------|
| **Comeback Concert** (weekly) | Music | Practice a featured song all week → weekend "premiere" performance | exclusive outfit piece, Star Gems, a dance |
| **Festival** (monthly) | Exploration/Creativity | A district transforms; themed quests + decorations to discover | event Star Pal, cosmetics, story beat |
| **Friendship Celebration** (SEL) | Teamwork | Co-op-flavored "help a friend" stories | SEL sticker, clubhouse decor |
| **Skill Spotlight** (rotating) | Learning | Bonus rewards for practicing a chosen domain ("Math Week") | bonus Sparkles, a badge |
| **Companion Release** | Collection | A new Star Pal arrives via a gentle rescue questline | the new Star Pal |
| **Story Chapter** (monthly) | Narrative | A new voiced MV-cutscene + episode quests | transformation unlock, lore card |
| **Fashion Show** (seasonal/anniversary) | Creativity | Kids design outfits; everyone's looks parade (no voting/ranking of kids) | a Concept, Sparkles |

All authored in the LiveOps tool as data (`schemas/event.schema.json`) and shipped via **remote config — no app update** (see `unity-architecture.md`).

## 4. Seasonal transformations
Each season re-skins the world gently (lighting, decorations, weather) and adds **seasonal evolution looks** for heroes & the player avatar (earned through that season's learning), plus seasonal Star Pal forms. The city visibly "wears" the season — strong living-world wonder.

## 5. Live-event governance (kid-safe)
- **No combat, no peril, no scary imagery, no jump-scares** — even for "Halloween"-adjacent months we use **Lantern Night / Stargazing** (cozy, magical), not fright.
- **No leaderboards or child-vs-child competition.**
- **No FOMO pressure on children;** limited items return; missing an event is never punished.
- **No purchase pressure;** event cosmetics are mostly earnable, store items parent-gated.
- **Healthy pacing:** events fit the 5–15-min session; participation is celebrated, never demanded.

## 6. Why the calendar works
- **A fresh reason to return** every day (quest), week (concert), and month (festival) — without manipulation.
- **Marketing drumbeat:** each Comeback era = a launch moment (trailer, song, new looks) for UA and franchise content (see `franchise-bible.md`).
- **Content engine:** templates + data authoring let a small LiveOps team sustain the calendar indefinitely with new skills (spiral curriculum), pals, songs, and stories.
