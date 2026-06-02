# Art Bible — Starbound: Little Legends

> Visual foundation: the **HUNTRIX** concept sheet (Rumi/Mira/Zoey), **softened for ages 5–7**.
> One style governs game, animated shorts, books, and toys (see `franchise-bible.md`).
> Mockup boards: [`art/mockups/`](art/mockups/).

---

## 1. Art direction in one line
**"K-pop magic-hero glow meets cozy preschool warmth."** Bold, saturated, sparkly, expressive — but rounded, safe, and friendly. Never edgy, scary, or cluttered.

### Style pillars
1. **Stylized 3D, toon-shaded.** Clean silhouettes, flat-ish lit surfaces, soft rim light, sparkle/bloom accents. Readable at 5" arm's length.
2. **Expressive anime faces.** Big eyes, exaggerated emotion, snappy blink/brow/mouth — the "expressive & dynamic" promise of the sheet.
3. **Bold but limited color per shot.** 3–4 hero colors + neutrals; saturation = magic, gray = "gloom to heal."
4. **Mobile-optimized.** Silhouette-first design; everything reads as a flat shape before detail.
5. **Sparkle is the brand.** Light, stars, blooming color, soft particles — the visual language of "learning = magic."

---

## 2. Audience adaptation (teen sheet → 5–7)
| Teen sheet | Little Legends (5–7) |
|---|---|
| ~7–7.5 heads tall, slim | **~4.5–5 heads tall**, rounder, softer |
| Sharp jaw/edgy | round face, big cheeks, big eyes |
| Bladed weapons | **friendly light tools** (Songstaff, path-drawing Starlight Blade, musical Beat Stars) |
| Cool/fierce | warm, approachable, smiley defaults |
| Midriff/edgy fashion | playful, modest, kid-appropriate idol fashion |

Keep: bold hair colors, fashion-forward silhouettes, K-pop energy, clean shapes.

---

## 3. Master color system
| Token | Hex | Use |
|---|---|---|
| Magic Purple | `#6A4BC4` | primary brand, transformations |
| Star Gold | `#FFD24D` | rewards, sparkles, accents |
| Pop Pink | `#FF8FCF` | UI primary, joy |
| Sky | `#8FD0FF` | calm, backgrounds |
| Mint | `#7EF0C0` | success, growth |
| Ink | `#241B3A` | text/contrast (never pure black) |
| Cloud | `#FFF6FB` | surfaces (never pure white) |

**Gloom→Bloom rule:** unsolved areas are desaturated gray (`#9A93A8`); solving floods them with the district palette. The child *sees* color return — the core visual reward.

### Hero palettes
| Hero | Strength | Primary | Hair | Accent |
|---|---|---|---|---|
| **Rumi** | Reading | `#FFC83D` gold | `#7B4FC4` purple | `#FFFFFF` |
| **Mira** | Logic | `#E23E6B` crimson | `#C2185B` magenta | `#241B3A` |
| **Zoey** | Rhythm | `#2BC4B0` teal | `#2A2340` w/ `#8A5Cff` streak | `#F5B82E` gold |
| **Nova** | Math | `#4FB6FF` sky-blue | `#FFE08A` | `#FFD24D` gold |
| **Indie** | Creativity | `#FF8FCF` pink | rainbow | full spectrum |
| **Remi** | Memory | `#57C9C0` teal | `#B9A7F0` lavender | `#FFE08A` firefly |

### District palettes → see board `art/mockups/03-districts.png` and `world-building.md`.

---

## 4. Typography & logo
- **Display:** rounded heavy (Baloo 2 / similar) — playful, bubbly, high legibility.
- **Body/UI:** friendly humanist sans, large weights only; min on-screen 28px@2x.
- **Logo:** "STARBOUND • Little Legends" — chunky rounded letters, star dot on the *i*, gradient Purple→Pink with a gold sparkle. Always on a clean/dark plate for contrast.
- **No baked text in textures** (localization) — see `unity-architecture.md`.

---

## 5. Character design language
- **Shape grammar:** circles & soft rounded-rects; no sharp points on friendly characters. Each hero has a **signature silhouette** (Rumi=long braid, Mira=high pony, Zoey=bob+streak, etc.) readable in pure black.
- **Faces:** big eyes (≈⅓ face height), simple noses, expressive mouths; a shared **expression sheet** (happy, excited, thinking, proud, oops-but-okay, sleepy) — never angry/scary.
- **Fashion = identity:** each hero's "Concept" outfits express their vibe; modest, colorful, idol-styled.
- **Light tools** glow in the hero's accent color; clearly tools-of-help (mics, brushes, counters, lockets, light-blades that draw paths).

---

## 6. Companions (Star Pals) art
- **Super-round, palm-sized, huge eyes**, one strong shape + one gimmick (fox tail, lantern, star). 3 evolution forms = same DNA, more sparkle/detail/accessories.
- District-color-coded so kids associate pal ↔ place ↔ skill. Plush-ready by design (`franchise-bible.md`).

---

## 7. Environment art
- **Diorama districts:** small, stylized, toy-like worlds with soft modeling and chunky props. Cozy depth-of-field, gentle parallax.
- **Living world:** ambient critters, drifting light motes, swaying foliage, time-of-day glow.
- **Landmarks** are the hero pieces of each district (Singing Lighthouse, Pulse Tree, Big Stage…) and animate as harmony rises.
- **No clutter:** generous negative space; clear path readability for a 5-year-old.

---

## 8. VFX & "juice" language
- Sparkles, soft bloom, star-bursts, ribbon trails, confetti, color-bloom waves.
- **Transformation** = the marquee VFX: light spiral → costume swap → pose → sparkle burst (6–10s).
- Feedback VFX scale: tiny twinkle (correct) → burst (mission) → fireworks (milestone).
- **Reduced-motion / Calm mode** dampens particle density, shake, and bloom (accessibility).

---

## 9. Lighting & camera
- Warm key + cool fill + soft rim; baked GI where possible, 1 dynamic light for the hero.
- Hub & districts: 3/4 cozy framing; Performance: dynamic stage lighting; portrait-first composition with safe-area-aware framing.

---

## 10. UI visual system
- **Audio-first, icon-driven, big targets** (≥9–10mm), ≤4 choices/screen, thumb-zone CTAs.
- Rounded cards, soft shadows, Cloud surfaces, Pop-Pink primary buttons, Star-Gold rewards.
- Affinity/skill cues = **color + shape + label** (never color alone — colorblind-safe).
- See mockups `art/mockups/02-ui-screens.png`.

---

## 11. Mobile optimization budgets (target: 60fps mid-tier, 30fps floor)
| Asset | Budget |
|---|---|
| Hero mesh | 15–22k tris, **1 skinned mesh**, 1–2 materials |
| Star Pal | 3–6k tris |
| Environment prop | 200–1.5k tris; instanced; LOD0/1 |
| Textures | atlased, 1k–2k hero / 512–1k props; ASTC compressed |
| Shaders | URP Toon (mobile) tier; ≤2 variants/material |
| Real-time lights | ≤3 (prefer baked); shadows: hero only |
| Draw calls | ≤ ~120/frame in district; SRP Batcher + atlas |
| Skinned on screen | hero + active buddy + ≤4 critters |
| VFX | pooled; particle caps; Calm-mode LOD |
| Install | ≤1.5GB base + on-demand season bundles (Addressables) |

---

## 12. Pipeline & naming
- DCC: any (Blender/Maya) → FBX; **Humanoid rig** for heroes (anim retarget/sharing), generic for pals.
- Naming: `char_rumi_stage3_body`, `pal_twinkle_form2`, `env_harbor_lighthouse`, `vfx_transform_spiral`, `ui_btn_primary`.
- Addressable groups: `district_<id>`, `season_<id>`, `vo_<locale>`, `heroes_core`.
- Source art in `art/`; the **HUNTRIX sheet → `art/concept-sheet.png`** as ground truth.

---

## 13. Accessibility-in-art (commitments)
- Silhouette-readable characters; UI legible at small sizes & low vision (contrast ≥ 4.5:1 for text).
- Colorblind-safe encodings everywhere (shape+label).
- Reduced-motion/Calm visual mode authored alongside the "full juice" mode.
- Inclusive, diverse cast & citizens; positive body image; warm, non-scary everything.

---

## 14. Deliverables checklist (per character)
Concept (front/side/back + expression sheet) → 3D model + textures → Humanoid rig → **5 evolution looks** → anim set (idle/walk/emote/dance/transform/teach) → VFX set → Concept (cosmetic) variants → UI portrait + icon. Per district: blockout → set dress → landmark (animated) → festival skin → lighting → ambient critters. (Counts roll up into the asset list — next production doc.)
