# 04 — Economy & Monetization (Cosmetics-Only, No Pay-to-Win)

## 1. The ethical model in one diagram

```
        EARN (play)                         PAY (real money)
   ┌────────────────────┐              ┌────────────────────────┐
   │ Stamina/energy play │             │  Glow (premium cosmetic │
   │ Campaign / Dungeons │             │       currency)         │
   │ Raids / Showcase    │             └───────────┬─────────────┘
   │ Events / dailies    │                         │  buys ONLY
   └─────────┬───────────┘                         ▼
             │ yields                     ┌────────────────────────┐
             ▼                            │  CONCEPTS (cosmetics):  │
   ┌────────────────────┐                 │  outfits, hair, stages, │
   │ Starlight, shards, │                 │  emotes, choreos, MV    │
   │ gold, XP, gear      │                 │  themes, namecards,     │
   │ → RESONANTS & POWER │                 │  photo-mode props       │
   └────────────────────┘                 └────────────────────────┘
   Power is 100% earnable.        Money never touches power, ever.
```

**Hard rules (enforced in code & store review):**
1. Real money → **Glow** and direct **Concept**/Battle-Pass purchases **only**.
2. **No Resonant, no copy/Echo Shard, no stat, gear, level, or combat-affecting item is ever purchasable** with money or with Glow.
3. The **Recruit (gacha) banner pulls Resonants using `Starlight`/tickets that are NOT purchasable.** (You cannot buy pulls. You earn them.)
4. **Battle Pass premium track contains cosmetics + non-power convenience only** (e.g., extra loadout slots, a stamina-overflow buffer, a photo-mode frame) — nothing that increases combat power.

> This makes the game *provably* not pay-to-win: there is no money→power edge anywhere in the graph.

## 2. Currency catalog

| Currency | Type | Earned? | Bought? | Spends on |
|----------|------|---------|---------|-----------|
| **Gold** | Soft | ✅ | ❌ | Leveling, gear upgrade |
| **XP Mats** | Soft | ✅ | ❌ | Resonant levels |
| **Ascension/Skill Mats** | Soft | ✅ | ❌ | Ascension, skills |
| **Echo Shards** | Collection | ✅ | ❌ | Resonance Ranks, unit unlock |
| **Starlight** | Premium-soft | ✅ (earnable) | ❌ | **Recruit pulls**, convenience |
| **Recruit Tickets** | Pull token | ✅ | ❌ | Single/10-pull recruit |
| **Event Tokens** | Event | ✅ | ❌ | Event shops (units, mats, cosmetics) |
| **Glow** | **Premium (paid)** | small free trickle | ✅ | **Concepts / cosmetics only** |
| **Stage Coins** | Cosmetic-soft | ✅ | ❌ | Rotating cosmetic shop |

## 3. Recruitment (gacha) — power, but free

The collection pillar needs a gacha *feel* without selling power. Solution: **the banner is real, the pulls are earnable-only.**

- **Rates:** SSR 1.5% · SR 9% · R 89.5% (per pull).
- **Pity:** soft pity from pull 60, **hard pity at 80** (guaranteed SSR). **50/50** featured rule with carry-over guarantee on the next SSR.
- **Currency:** pulls cost `Starlight` or `Recruit Tickets` — **both earnable, neither purchasable.**
- **Generosity target:** F2P player earns **~2 ten-pulls/week** from dailies+events+campaign → reliably obtains the featured SSR every Season via pity. (Tuned so the *median* F2P clears all PvE content; see §7 sources/sinks.)
- **Spark/Exchange:** every banner has a guaranteed **exchange counter** — accumulate the banner's Echo Shards (earnable) to **buy the featured unit outright**, capping bad luck.

> Because pulls aren't purchasable, the gacha is a **pacing & excitement system**, not a revenue system. Revenue comes entirely from §4.

## 4. Monetization (where the money is)

### 4.1 Concepts (outfit/cosmetic sets) — primary revenue
The K-pop fantasy IS fashion. A **Concept** is a themed cosmetic bundle for a Resonant (or universal):
- 3D **outfit** (modeled, rigged, with cloth/accessory sim where budget allows),
- **hairstyle**, **accessories**, **weapon/mic skin**,
- a **stage skin** + **choreography/idle set**,
- **Encore cutscene variant** (the outfit shows in the hero moment),
- **namecard / profile theme**, **emote pack**.

Pricing tiers (Glow): **Mini** (single item) → **Concept** (full outfit) → **Signature Concept** (outfit + stage + Encore variant + emotes) → **Tour Collection** (multi-unit themed drop).

### 4.2 Battle Pass — "Tour Pass" (per Comeback Season, ~6 wks)
- **Free track:** Starlight, mats, Recruit Tickets, 1 cosmetic. (Generous — keeps F2P progressing.)
- **Premium track (paid):** exclusive **Concept**, emotes, photo props, namecards, **non-power conveniences** (extra loadout preset slots, larger idle cap, auto-repeat dungeon unlock). **No power.**
- **Premium+ :** instant +levels on the pass cosmetics track + an extra Concept. Still cosmetic.

### 4.3 Storefronts
- **Concept Boutique** (flagship, rotates weekly + Season drops).
- **Stage Coin shop** (earnable cosmetics, rotation).
- **Starter/returning bundles:** cosmetic-forward; any included Starlight is a *bonus*, never the sell, and capped so it can't constitute "buying power."
- **Direct gifting** of Concepts to friends/Label-mates (social + revenue).

### 4.4 No predatory patterns
- No paid loot boxes for power. (Concept "style boxes," if ever used, must be **duplicate-protected & fully previewed**, and contain only cosmetics — and we recommend **direct purchase** instead for trust.)
- Clear odds disclosure on every randomized cosmetic.
- No timers that *block* progress behind payment; energy is generous and never sold as the *only* path.
- Spending caps & parental controls (see 09 §8) — important given the youthful K-pop audience.

## 5. Source/sink ledger (per active day, median F2P)

| Resource | Daily SOURCE (approx) | Daily SINK |
|----------|----------------------|------------|
| Stamina | 288 regen + idle + refills(event) | Campaign/Dungeon runs |
| Gold | 120k (dungeon + clears) | Leveling/gear (slightly gold-starved early to value choices) |
| XP mats | enough for ~1.3 unit levels | Leveling |
| Starlight | ~ +1 ten-pull / 3.5 days | Recruit |
| Event tokens | event-gated burst | Event shop (cosmetics + units) |
| Gear | 6–10 pieces/day (Raids) | Endless optimization sink |

Economy is **gold-and-mat constrained, not unit-constrained** — players always have *something* to upgrade, sustaining the daily loop without pay pressure (because pay can't shortcut it). Full spreadsheet: `schemas/sample_data/economy_ledger.csv`.

## 6. Revenue model & KPIs (planning targets)

| Metric | Target band | Notes |
|--------|------------|-------|
| Conversion (payer %) | 4–8% | Cosmetic games skew higher engagement-conversion if fashion is desirable |
| ARPDAU | $0.08–0.18 | Lower per-head than P2W, offset by goodwill/retention/UA efficiency |
| D1 / D7 / D30 | 45% / 22% / 9% | Strong onboarding + fair model aids long retention |
| Whale ceiling | soft | No power ceiling to chase; cosmetic completion + collection drives top spend |
| Refund/chargeback | low | Direct-purchase cosmetics + previews reduce buyer's remorse |

**Why this works commercially:** fair, fashion-first F2P maximizes **goodwill, virality (photo-mode/MV sharing), creator/UGC marketing, and long retention**, which compounds LTV through cosmetic depth and Season cadence rather than power-selling.

## 7. F2P clear guarantee (the promise, made concrete)

- All **PvE content is clearable by a F2P player** with a roster built over time, correct affinity/role comps, and gear from Raids.
- Leaderboards (Showcase/Spotlight) are won by **execution + earned roster**, not wallet.
- Audit checklist for every new feature/banner: *"Does any path let money increase combat power or leaderboard placement? If yes → reject."* (See 06 LiveOps governance & 12 risk register.)
