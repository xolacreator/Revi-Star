# Schemas & Sample Data

Data contracts for the Unity content pipeline (see `../unity-architecture.md` §4–§5).
All player-facing **content is data** so designers & curriculum specialists author it
without code. ScriptableObject C# definitions live in `Assets/_Project/Scripts/Data/`
(examples in the architecture doc); the JSON here mirrors them for tools/CMS import.

## Entities
| Entity | Key fields |
|--------|-----------|
| **Hero** | `id, displayNameKey, domain, themeColor, stages[5], voiceLines[]` |
| **EvolutionStage** | `stage, requirement{domain, masteryThreshold, districtHarmony}, unlock{costume, anims, dance, vfx, song, story}` |
| **Challenge** | `id, skillId, domain, band, type, promptVoKey, storyHookKey, items[], reward` |
| **Companion** | `id, displayNameKey, district, forms[3], ability, bondCurve, accessories[]` |
| **District** | `id, name, skillDomain, sel, hostHero, palette, music, creatures[], spirit, academy, landmark, festival, harmonyTiers[]` |
| **Event** | `id, type, startUtc, endUtc, stages[], rewards[], cosmetics[], storyBeat` |
| **Concept** | `id, heroId, items[], price{glow}, earnableWith{sparkles}` (cosmetic-only) |

## Invariants (enforced by CI lint)
1. Every content row has a **localization key** and (where spoken) a **VO ref** — pre-reader-first.
2. No reward attached to a **paid SKU** may affect gameplay difficulty/progress — **no pay-to-win**.
3. Difficulty `band ∈ {Discover, Practice, Master}`; every Challenge has a valid `skillId`.
4. No challenge defines a **fail state**; the scaffolding ladder guarantees eventual success.

## Files
- `sample_data/challenges_100.json` — representative subset of the 100 missions in
  `../learning-design.md` §4 (the full set is authored in the CMS).
- `sample_data/companions.json` — sample Star Pals (full 50 in `../companion-system.md`).
