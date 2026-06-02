# 01 — Game Design: Core Loop, Modes & Retention

## 1. Design goals

1. **Two-minute fights, two-second restarts.** Combat is snackable for mobile and commute play.
2. **Collect-to-express, not collect-to-win.** Depth comes from squad-building and fashion, not whales out-statting players.
3. **Skill ceiling without skill floor.** Auto-battle is viable everywhere except the top 5% of content; manual + Encore timing is rewarded but never mandatory.
4. **A reason to log in daily and a reason to stay for an hour.** Daily loop (10 min) nests inside a session loop (45 min) nests inside a seasonal loop (6 weeks).

## 2. The three nested loops

### 2.1 Core combat loop (30–120 s)
`Pick Lineup → Enter Stage → Auto/Manual fight → Tap active skills & Encore ults → Win → Rewards → Power-up or next stage`

### 2.2 Daily session loop (10–45 min)
```
Login → Claim idle/AFK rewards → Daily missions (3–5) →
Spend Stamina on: Campaign push / Resource dungeons / Event stage →
Upgrade a Resonant (level, gear, skills) →
Optional: 1 co-op Raid, 1 ranked Showcase →
Recruit pull if currency available → Logout
```

### 2.3 Seasonal "Comeback" loop (≈6 weeks)
```
New Comeback Season drops → New campaign chapter + new Resonant(s) +
new Concept (cosmetic) line + Battle Pass →
Weekly event rotation (Showcase rhythm / Raid boss / Ranked) →
Mid-season feature event → Finale event + leaderboard payout →
Season wraps, ranks soft-reset, next Comeback teased
```

## 3. Game modes

| Mode | Pillar | Cadence | Energy | Multiplayer | Purpose |
|------|--------|---------|--------|-------------|---------|
| **Story Campaign** | Story | Always-on, chapters drop per Season | Stamina | Solo (+1 friend support) | Onboarding, lore, baseline progression |
| **Resource Dungeons** | Progression | Daily rotation (XP / Gold / Gear / Ascension mats by weekday) | Stamina | Solo | Targeted farming |
| **Showcase (Rhythm)** | Action/Live | Weekly event + evergreen practice | Tickets | Solo, async score | Skill expression, cosmetic-earning, leaderboard |
| **Discord Raids** | Social/Action | Weekly boss, 3-day windows | Raid Pass | Co-op 3 players, async or live | High-end gear, Label coordination |
| **Spotlight (Ranked PvE)** | Action | Season ladder | Free attempts ×N/day | Async (your Lineup vs scripted/curated waves) | Mastery, ranked rewards (cosmetic + currency) |
| **Encore Tower** | Progression | Persistent, resets monthly | Free | Solo | Endgame check, prestige |
| **Backstage (Hub)** | Social/Collection | Always-on | — | Shared instances optional | Roster, dress-up, photo mode, Label hall |

> **No PvP combat at launch.** "Competition" is async leaderboard score (Showcase/Spotlight), which keeps the no-pay-to-win promise unassailable (you compete on execution & roster *built over time*, not on wallet). Direct PvP is a post-launch evaluation, gated behind a strict matchmaking + roster-power normalization study.

## 4. Stamina & energy economy (gates, not walls)

- **Stamina** regenerates 1 per 5 min (cap 180, raises with account level). Used by Campaign + Dungeons.
- **Showcase Tickets**: 3/day, used for scored rhythm runs (practice mode is free, unscored).
- **Raid Pass**: 1/day + Label-shared pool.
- **Spotlight attempts**: 5/day free.
- Overflow protection: idle/AFK rewards accrue offline up to 12 h so lapsed players return to a reward, not a punishment.

Full sources/sinks tuning in [`04-economy-monetization.md`](04-economy-monetization.md).

## 5. First-Time User Experience (FTUE)

Target: **player wins their first fight in < 60 s, owns 3 Resonants in < 5 min, sees the fantasy (a full Encore ultimate cutscene) in < 3 min.**

| Beat | Time | Teach |
|------|------|-------|
| Cold open cutscene: the Hush silences a district | 0:00 | Stakes & tone |
| Guided first fight (scripted, can't lose) | 0:30 | Tap-to-skill, auto toggle |
| First Encore ultimate (forced perfect Encore) | 1:30 | The power fantasy |
| Free recruit ×10 (guaranteed a 5★ starter pick) | 3:00 | Collection hook |
| Build first Lineup of 3, affinity hint | 4:00 | Squad pillar |
| Dress-up teaser: equip a free Concept | 5:00 | Fashion/monetization seed |
| Hand off to Backstage hub | 6:00 | Open the loop |

FTUE is **skippable after account level 5** for returning/known players (detected via device + login).

## 6. Progression spine (account-level pacing)

| Account Lvl | Unlocks | Day (median) |
|-------------|---------|--------------|
| 1–5 | Campaign Ch.1, basic upgrades | D0 |
| 6 | Resource Dungeons | D0–1 |
| 10 | Showcase (Rhythm), Concepts/dress-up | D1 |
| 15 | Labels (guild), friend supports | D2 |
| 20 | Discord Raids (co-op) | D3–4 |
| 25 | Spotlight (ranked), Battle Pass full | D5–7 |
| 30 | Encore Tower endgame | D10–14 |
| 40+ | Ascension cap raises per Season | ongoing |

## 7. Retention & engagement design

- **D1 hook:** finish Ch.1, full free 10-pull, first Concept equipped.
- **D7 hook:** unlock co-op Raids + first Battle Pass cosmetic milestone.
- **D30 hook:** first full Comeback Season completed; a "limited" Concept set FOMO-but-fair (re-runs guaranteed within 2 seasons).
- **Daily compulsion:** dailies + idle claim + 1 Raid + Showcase ticket spend = a clean 10-minute "did my dailies" ritual.
- **Lapsed-player win-back:** offline accrual cap raised for absent players; "Welcome Back" mission line grants current-meta-relevant resources to re-close the power gap (anti-churn, since power is earnable).

## 8. Accessibility & comfort (also see 05)

- Full **auto-battle** + **2× speed** + **skip** for cleared content.
- **One-handed portrait** play is the default; rhythm Showcase supports portrait *and* landscape.
- Colorblind-safe affinity icons (shape + color, never color alone).
- No twitch reflex required to *progress*; rhythm timing windows are generous (Good/Great/Perfect) and only affect *score/bonus*, never *clear/fail* in campaign.
