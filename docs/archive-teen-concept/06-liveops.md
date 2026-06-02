# 06 — LiveOps

## 1. Cadence model: the "Comeback" Season (≈6 weeks)

Every Season is themed like a K-pop **comeback**: a new title track (theme song), MV cutscene, new Concept line, 1–2 new Resonants, a campaign chapter, and an event arc. This gives marketing a drumbeat and players a fresh reason to return.

```
Week 1  Comeback launch: new chapter, new Resonant banner, Tour Pass, MV reveal
Week 2  Showcase (rhythm) event + leaderboard
Week 3  Discord Raid (new boss) — Label co-op push
Week 4  Mid-season feature event (story side-story + Concept drop)
Week 5  Spotlight ranked climax + returning/old-banner rerun
Week 6  Finale event + Season leaderboard payout → soft reset → tease next Comeback
```

## 2. Event types (reusable templates)

| Template | Pillar | Loop | Reward focus |
|----------|--------|------|--------------|
| **Showcase** | Rhythm/Action | Score runs on a song, climb leaderboard | Cosmetics, Stage Coins, Echo Shards |
| **Discord Raid** | Co-op/Social | 3-player boss, weekly tiers | Gear, Echo Shards, mats |
| **Spotlight** | Ranked PvE | Async curated waves, ladder | Cosmetic frames, currency, titles |
| **Story Side-Event** | Narrative | Limited campaign w/ unique stages | Free SR/SSR unit, Concept |
| **Login/Check-in** | Retention | Daily claim arc | Starlight, tickets, cosmetic |
| **Collection Rush** | Collection | Farm tokens → event shop | Unit shards, mats, Concept |
| **Fashion Week** | Monetization | Cosmetic-forward festival, voting, photo contests | Concept sales + UGC virality |

Each template is **data-driven** (see `schemas/event.schema.json`): start/end, stages, drop tables, shop, leaderboard config, reward mail — authored in the LiveOps tool, shipped via remote config, **no client update required.**

## 3. Annual calendar skeleton (8–9 Comebacks/yr)

- New player onboarding evergreen always live.
- Tentpoles: **Anniversary** (huge free SSR selector + Fashion Week), **Summer** (beach/festival Concepts), **Winter Holiday**, **Halloween-equivalent (Eclipse Festival)**.
- **Reruns guaranteed:** any limited Resonant returns within **≤2 Seasons**; any limited Concept returns within **≤4 Seasons** (FOMO-but-fair).

## 4. LiveOps tooling & governance

- **Remote config + content CMS:** events, banners, drop tables, shop SKUs, balance tunables, feature flags — all server-driven (09 §5).
- **A/B framework** for FTUE, store layout, reward pacing (never for power-selling).
- **Segmentation:** new/returning/core/lapsed/payer-cosmetic — targeted offers & missions (cosmetic/convenience only).
- **Cosmetics-only audit gate** (mandatory): every event/banner/SKU passes the checklist *"no money→power path"* before publish. CI lint on content data flags any combat-affecting reward attached to a paid SKU.
- **Live balance hotfix** via tunables without app store resubmission.
- **Kill-switch** feature flags for any event misbehaving in production.

## 5. KPIs LiveOps owns
- Event participation %, completion %, leaderboard depth.
- Concept attach rate & try-on→buy funnel.
- Season retention (D1-of-season, season-completion).
- Goodwill signals: review sentiment, social/photo-mode share volume.

## 6. Community & creators
- In-game **photo mode & MV share** seeds organic UA.
- Creator program: cosmetic codes (never power), early Concept previews.
- Transparent **odds & rerun calendar** published → trust is the brand moat for a fair F2P.
