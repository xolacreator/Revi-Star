# 02 — Combat System

## 1. Overview

Real-time **squad combat**: the player fields a **Lineup** of up to **4 Resonants** (+1 borrowed friend support in solo modes) against waves of **Discords** on a stage-arena. Combat is **tap-to-skill with full auto fallback**. Each unit auto-attacks and auto-uses skills on cooldown unless the player taps to direct them; the signature layer is the **Encore** — a rhythm-timed tap that empowers ultimates.

- **Camera:** 3/4 cinematic, fixed-with-slight-parallax. Portrait default.
- **Positioning:** abstracted (front/back rows, no manual movement) for mobile clarity. Vanguards auto-take the front row; Casters/Supports the back.
- **Target fight length:** 30–90 s normal, up to 3 min for bosses.

## 2. Core stats

| Stat | Symbol | Notes |
|------|--------|-------|
| Health | `HP` | Unit dies at 0; revivable by some Supports. |
| Attack | `ATK` | Scales all damage skills. |
| Defense | `DEF` | Mitigates incoming via formula §5. |
| Speed | `SPD` | Drives turn-tick / action frequency & cooldown ticking. |
| Crit Rate | `CR` | 0–100% chance to crit. Base 5%. |
| Crit Damage | `CD` | Crit multiplier. Base 150%. |
| Effect Hit | `EHR` | Chance debuffs land. |
| Effect Res | `ERR` | Chance to resist debuffs. |
| Resonance Gen | `RES%` | Multiplier on ult-meter gain. |
| Healing Bonus | `HB%` | Amplifies healing dealt. |

## 3. Affinity wheel (6 elements)

```
        RADIANCE (light)
        ▲            ▲
   UMBRA              PULSE
   (dark)            (electric)
        ▲            ▲
        EMBER ◄────► FROST
              BLOOM
```

**Advantage ring (strong → weak), +25% dmg & higher debuff chance when advantaged, −15% when disadvantaged:**

`Radiance → Pulse → Frost → Bloom → Ember → Umbra → Radiance`

- **Radiance ↔ Umbra** are *opposed* (mutual +35% / "purifies vs corrupts") — a dramatic light/dark rivalry baked into the story.
- Neutral matchups: ×1.0. Implementation: a 6×6 `AffinityMatrix` lookup (see `schemas/affinity_matrix.json`).
- **Break synergy:** hitting an enemy's *Stagger* gauge with its weak affinity fills it 1.5×.

## 4. Roles (5)

| Role | Fantasy | Primary job | Example kit verbs |
|------|---------|-------------|-------------------|
| **Vanguard** | The anchor | Front-row tank, taunt, shields | Taunt, Shield, Damage-Reduction aura, Counter |
| **Striker** | The ace | Single-target burst melee | Execute, combo finisher, self-buff, follow-up |
| **Caster** | The voice | Ranged AoE / sustained DPS | AoE nuke, DoT, affinity-break, zone |
| **Support** | The heart | Heal, cleanse, revive, ATK/SPD buffs | Heal-over-time, cleanse, revive, haste, shield |
| **Breaker** | The disruptor | Debuff, control, Stagger | Stun, slow, DEF-down, vulnerability, Stagger boost |

A healthy Lineup = **1 Vanguard + 2 DPS (Striker/Caster) + 1 Support/Breaker**, but the synergy system (§8) rewards creative comps.

## 5. Damage & mitigation formulas

**Base outgoing skill damage:**
```
Raw = ATK × SkillMultiplier × (1 + DmgBonus%) 
```
**Mitigation by DEF (diminishing, level-aware):**
```
DefFactor = DEF / (DEF + K(attackerLevel))      // K(L) = 100 + 12 × L  (tuning constant)
Mitigated = Raw × (1 − DefFactor)
```
**Affinity multiplier:**
```
Aff = AffinityMatrix[attacker.affinity][target.affinity]   // {0.85, 1.0, 1.25, 1.35}
```
**Crit:**
```
isCrit = rand() < clamp(CR + skillCRmod, 0, 1)
CritMult = isCrit ? (1 + CD) : 1
```
**Vulnerability / amplification stack (multiplicative):**
```
Amp = (1 + Σ vulnerabilities) × (1 − Σ resistances)
```
**Final:**
```
Damage = Mitigated × Aff × CritMult × Amp × StaggerMult × variance(0.97..1.03)
```
`StaggerMult = 2.0` while target is **Staggered** (see §7), else `1.0`.

**Healing:**
```
Heal = (HealBase + ATK × HealRatio) × (1 + HB%) × (Staggered? 1 : 1)
```

## 6. Action economy: the SPD tick model

A lightweight **action-gauge** model (deterministic, server-verifiable):

- Each unit has an Action Value `AV = BaseTick / SPD` (BaseTick = 10000).
- A global timeline advances; the unit whose accumulated gauge reaches threshold **acts**. This yields "faster units act more often" without real-time desync risk, and replays/validation are deterministic given a seed.
- Real-time *feel* is preserved by animating actions continuously; the gauge governs *when* each unit's skill/attack fires. Auto and manual both ride this model — manual just lets the player override the next skill choice.

> This determinism is the backbone of **server-authoritative validation & anti-cheat** (see 09 §7): the client sends inputs + seed; the server can re-simulate.

## 7. Stagger / Break system

Every enemy (and elite/boss) has a **Stagger gauge**. Dealing damage — especially with the enemy's **weak affinity** or **Breaker** skills — fills it. On full:
- Enemy is **Staggered** for X turns: takes **2× damage** (`StaggerMult`), action delayed, debuffs auto-land.
- Creates the core combat puzzle: **break → dump burst during the window**. This is where Encore ultimates are timed for maximum payoff.

## 8. Squad synergy

Three synergy layers, all transparent in the Lineup screen:

1. **Leader Aura** — the Lineup's leader grants a team-wide passive (e.g., "+18% ATK to Ember units").
2. **Affinity Resonance** — fielding ≥3 of one affinity grants a set bonus (e.g., "3 Pulse: +15% Resonance generation").
3. **Duet Links** — specific character pairs (story-linked idols) unlock a **Duet** buff and a special **co-op Encore** animation when both are alive (e.g., "Nova & Vesper Duet: first Encore each fight is auto-Perfect").

Synergies are **roster-built (earnable)**, never purchasable — preserving no-pay-to-win.

## 9. Skills & the Resonance / Encore ultimate

Each Resonant has:
- **Basic** (auto, generates Resonance),
- **Skill** (cooldown-based; 1–2 actives),
- **Passive(s)**,
- **Ultimate ("Encore")** — fires when team/own **Resonance meter = 100%**.

**The Encore mechanic (signature):**
When an Ultimate is triggered, a brief **rhythm prompt** appears (a shrinking ring / beat marker synced to the track). The player taps:

| Timing | Result |
|--------|--------|
| **Perfect** (center window) | +30% ult damage/effect, full-quality cutscene flourish, +Resonance refund |
| **Great** | +15% |
| **Good / no tap** | base ult (auto players never lose progression — auto = "Good") |

- Encore windows are **generous** (Perfect ≈ 180 ms). It rewards engagement, never gatekeeps.
- **Co-op Encores** (Duet Links) play a shared two-character cutscene — a major collection/fashion flex moment (outfits show here → monetization showcase).

## 10. Status effects (canonical set)

Buffs: ATK↑, DEF↑, SPD↑, Shield, Regen, Crit↑, Damage-Reduction, Cleanse, Taunt-immunity, Resonance↑.
Debuffs: ATK↓, DEF↓, SPD↓, Stun, Freeze (skip + Frost combo), Burn (Ember DoT), Bleed, Shock (Pulse: bonus dmg on action), Silence (no skills), Vulnerability, Seal (no ult), Corruption (Umbra: stacking decay).
Each has stack rules, duration in turns, and EHR/ERR contest math (`landChance = base × clamp(1 + EHR − ERR, 0.1, 1)`).

## 11. Boss design tenets

- **Telegraphed mechanics** with on-screen warnings (accessibility).
- **Phases** at HP thresholds (e.g., 70/40/15%) that change affinity weakness or add adds — encourages bringing flexible rosters, not one god-unit.
- **Enrage timer** on hardest tiers (skill check), but standard tiers have none (no wall for casual players).
- **Stagger-gated burn windows** so the Break system matters at the top end.
- Boss roster & faction kits in [`08-enemies-factions.md`](08-enemies-factions.md).

## 12. Difficulty & auto-play philosophy

- **Auto** clears all evergreen content up to the top ~10% (Encore Tower upper floors, Spotlight high ranks, hardest Raid tier).
- **Manual + Encore timing + Stagger management** is the lever for the top tier and leaderboard score.
- This guarantees: a casual F2P player **never hits a paywall**, and a skilled player **always has headroom** — both essential to the cosmetics-only promise.

## 13. Tunables (initial)

See `schemas/combat_tuning.json` for the live values: `BaseTick`, `K(L)` defense constant, base CR/CD, Stagger thresholds per enemy tier, Encore windows (ms), affinity multipliers, and per-role stat-growth curves.
