# 03 — Characters, Collection & Progression

## 1. The Resonant (collectible unit)

A **Resonant** is defined by: identity (name, label affiliation, story), **Affinity** (1 of 6), **Role** (1 of 5), **Rarity**, base stats + growth curve, **4-node kit** (Basic / Skill / Passive / Encore-Ultimate), **Duet Links**, and a default **Concept** (outfit). Data schema: [`schemas/resonant.schema.json`](schemas/resonant.schema.json) + [`schemas/ResonantDef.cs`](schemas/ResonantDef.cs).

## 2. Rarity & acquisition (earnable-only)

| Rarity | Base power | Drop in recruit | How obtained |
|--------|-----------|-----------------|--------------|
| **★★★ (R)** | Entry | Common | Recruit, campaign, events |
| **★★★★ (SR)** | Mid | Uncommon | Recruit, event farming, shop exchange |
| **★★★★★ (SSR)** | High | Rare | Recruit (pity-guaranteed), event capstones, shard exchange |

> **Critical rule:** Resonants and their power are acquired **only with earnable currency** (`Starlight`, event tokens, shards). **Real money cannot buy a Resonant, a copy, or any stat.** Money buys **Concepts** (cosmetics) only — see [`04`](04-economy-monetization.md).

**Dupes → "Echoes":** pulling a duplicate grants **Echo Shards** of that unit, used for **Eidolon-style "Resonance Ranks" (R0→R6)** that add convenience/QoL and modest kit polish. To keep this off pay-to-win: Echo Shards for any unit are **also fully earnable** via the Shard Exchange and events; whales can't buy them. R-Ranks cap power creep by design (mostly utility, capped numeric gains).

## 3. Progression vectors

A Resonant grows along **five independent tracks**. All consume earnable resources from Resource Dungeons/events.

| Track | What it raises | Resource | Cap behavior |
|-------|----------------|----------|--------------|
| **1. Level** | Flat HP/ATK/DEF via growth curve | XP mats + Gold | Cap = account-gated (e.g., L80) |
| **2. Ascension** ("Debut tiers") | Raises level cap + unlocks passive nodes | Ascension mats (affinity-themed) | 6 tiers |
| **3. Skill Levels** | Skill multipliers, cooldowns | Skill books + Gold | L1–L12 |
| **4. Gear ("Stage Sets")** | 6 slots of substat gear (RNG rolls) | Gear from Raids/Dungeons | endless optimization (endgame sink) |
| **5. Resonance Ranks (R0–R6)** | QoL/utility via Echo Shards | Echo Shards (earnable) | capped, mostly utility |

### 3.1 Stat growth formula
```
Stat(level) = Base × (1 + GrowthPerLevel × (level − 1)) + AscensionBonus(tier)
```
Per-role `GrowthPerLevel` curves in `schemas/combat_tuning.json` (Vanguards favor HP/DEF, Strikers ATK/CR, etc.).

### 3.2 Gear ("Stage Sets")
- 6 slots: **Mic, Earpiece, Outfit-core, Boots, Emblem, Anthem.**
- Each piece: 1 main stat (slot-restricted) + up to 4 substats (rolled/upgraded).
- **Set bonuses** (2-pc / 4-pc), e.g., *Pulse Anthem Set: 2-pc +12% Pulse dmg, 4-pc Encore grants 1 extra action.*
- Gear is the **infinite endgame sink** and the reason to keep raiding — **earned, never sold for cash.**

## 4. Squad building (Lineup)

- Up to **4 Resonants** + **1 friend support** (solo modes).
- Building blocks: **Roles** (cover the holy trinity), **Affinity** (exploit enemy weak element; trigger Affinity Resonance set), **Leader Aura**, **Duet Links** (story pairs).
- The game **surfaces synergy hints** ("This stage's boss is weak to Frost; your Lineup has 0 Frost") without auto-solving — teaching squad-building (pillar 3).
- **Loadout presets**: save up to 8 Lineups for different content (Raid vs Showcase vs Campaign).

## 5. Launch roster plan

**Launch with 24 Resonants** (then +2–4 per Comeback Season). Coverage matrix ensures every Affinity×Role combo is fillable by F2P:

- 6 Affinities × 5 Roles = 30 cells; launch covers 24 (each affinity gets ≥3 roles; gaps filled in first 3 Seasons).
- **Free/earnable anchors:** at least **one strong 5★ per affinity is obtainable F2P** within ~30 days (event capstone or starter selector), guaranteeing no affinity is paywalled (it can't be — money buys no units — but this guarantees *time*-accessibility too).

**Starter selector:** after FTUE, the player picks **1 guaranteed SSR** from a rotating set of 4 (one per role archetype) — strong D0 agency & attachment.

## 6. Sample character bible entries (original IP)

> Names/designs below are **original**. Final visuals key off the Art Bible + your concept sheet.

### NOVA — "The Spark" · Radiance · Striker · ★★★★★
The breakout face of NOVA Division. A relentless front-line ace whose Encore, **"Supernova Drop,"** executes low-HP Discords and refunds Resonance on Perfect. Duet Link with **Vesper**. Theme: gold/white, comet motifs, high-energy hip-hop concept.
- Kit verbs: gap-closer, self CR↑, execute, follow-up on Staggered targets.

### VESPER — "The Hush-Walker" · Umbra · Caster · ★★★★★
A mysterious soloist who weaponizes silence against the Hush itself. AoE **Corruption** stacks + Seal (enemy ult lock). Duet Link with Nova (light/dark rivalry-romance). Theme: indigo/violet, eclipse motifs, dark-ballad concept.

### LYRA — "Heartbeat" · Bloom · Support · ★★★★
The label's emotional core. Heal-over-time + cleanse + a team Shield on Encore. Beginner-friendly, F2P-available early. Theme: pink/green, floral, bright-pop concept.

### KAI — "Wavebreaker" · Frost · Vanguard · ★★★★
Stoic dancer-tank. Taunt + self-Shield + Freeze counter. Anchors early comps. Theme: cyan/silver, crystalline, cool concept.

### RIOT — "Distortion" · Pulse · Breaker · ★★★★
Rebellious bassist. Shock + DEF-down + huge Stagger contribution. Theme: yellow/black, glitch, rock concept.

(Full launch roster sheet → `schemas/sample_data/roster_launch.json`.)

## 7. Collection meta-goals (long-tail)

- **Affinity & Role completion** badges.
- **Duet Link gallery** (unlock cinematic co-op Encores by owning pairs).
- **Concept (fashion) collection** — the cosmetic completionist track (monetized + earnable mix).
- **Resonance Rank** mastery per favorite unit.
- **Photo Mode / Backstage** — pose collected Resonants in their Concepts (social sharing → UA flywheel).

## 8. Anti power-creep guardrails

- New SSRs are **side-grades / niche-openers**, not strict upgrades; old anchors stay viable via gear & R-Ranks.
- Power budget per rarity is a **fixed envelope** (documented in tuning); new kits redistribute, not inflate.
- Periodic **"Remaster"** balance passes buff older units rather than only releasing stronger ones.
- Because power is earnable, the studio's incentive is **engagement, not stat-selling** — aligning business with balance.
