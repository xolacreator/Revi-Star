# Art Direction Roadmap — Art Director Review
_Rev. 2 · 2026-07-14 · live build v88, reviewed from fresh renders · bar: Nintendo-quality children's titles_

## Per-category evaluation

**Characters — 8/10 (the quality ceiling).** Rigged GLBs + toon ramp + 3-point
HUNTRIX lighting read beautifully; silhouettes clear, contact shadows ground
them. Flaws: Rumi's staff renders as a thin cyan sliver artifact at default
camera; cosmetics (hat/cape) don't attach to the GLB hero so transform rewards
are invisible; Gloomling — the first creature every child meets — is a gray
sphere with two dots, the least-designed actor in the cast.

**Environment — 6.5/10.** Lighthouse landmark, dressed plaza, trees and lit
houses carry the frame. Flaws: default framing leaves the **bottom ~25% of
screen as dead flat water**; dock is a single brown tone (star inlay too
subtle); benches read as brown slabs when frame-clipped; bunting pennants are
nearly edge-on from the default camera and read as **floating shards** at the
plaza rim.

**Lighting — 6/10 with a strategic problem.** The 3-point rig flatters
characters, and gloom→bloom is a great story beat — but it means **a child's
first-ever frame is the game's ugliest state** (desaturated gray-violet).
"Gloomy" must become "moonlit-gorgeous": deep-blue rim light, stronger warm
window glow, visible lighthouse silhouette drama — beautiful sadness, not
washed-out sadness.

**Shaders — 6/10.** Toon ramp + inverted-hull outlines are the right identity.
Water has no motion/specular life (flat `MeshStandardMaterial` + static canvas
texture, slow UV drift only). Sky dome is a lovely painting that never moves.

**Menus/UI — 7.5/10 minus two defects.** Concert/Storybook/Aurora system is
cohesive and premium. Defects found this review: **(a) the 🎵 music button and
👪 parent button visually collide at 390px width** (parent-open is absolutely
positioned over the flex row); **(b) "Harmony Energy" wraps to two lines**
inside its pill. Both read as broken, not styled. Parent dashboard still
off-system (accepted, low priority).

**Typography — 8/10.** Fredoka/Nunito/Baloo hierarchy holds everywhere;
remaining tell is emoji-as-icons in HUD (OS-dependent rendering).

**Camera — 6.5/10.** v85 lowering was right. Remaining: composition wastes the
bottom quarter (see Environment); no motion language (no ease-in, look-ahead,
door push-in) — camera is a tripod, Nintendo's is a dolly.

**Transitions — 4/10. Weakest category.** World↔lesson and world↔shop are
instant `display:none` swaps. Every 2D screen has entrance animation, but the
biggest context switches in the game have none.

**Particles — 7/10.** Rich census (sparkles, motes, butterflies, bursts,
confetti, trails, footstep flowers). Gaps: tap-ring is a plain circle (should
be a star-glyph bloom); butterflies are glow-blobs, not winged; no reward-
specific choreography (stars don't travel).

**Reward moments — 6/10.** Storybook transform + aurora cards are strong
screens; the *moment-to-moment* rewards under-deliver: stars appear as an
invisible counter change (behind the lesson overlay!), correct-answer
celebration peaks at item 1 and never escalates.

## The 15 highest-impact visual improvements (prioritized, rev. 2)
| # | Improvement | Category | Effort |
|---|---|---|---|
| 1 | **HUD fixes: music/parent button collision + "Harmony" label wrap** — reads as broken today | UI | S |
| 2 | **Door transition** (iris/fade + camera push) for lessons + shop | Transitions | M |
| 3 | **Reward choreography** — stars fly to counter w/ ticks; star-bar progress; every-7th celebration escalation | Reward | M |
| 4 | **Water that moves** — 2-layer scroll shimmer + foam ring + fill the dead bottom band (reflections/boat prop) | Environment/Shaders | M |
| 5 | **Moonlit-gorgeous pre-bloom state** — first frame must be beautiful | Lighting | S |
| 6 | **Bunting fix** — thicken/lower pennants so they read as flags, not shards | Environment | S |
| 7 | **Challenge stage set** — silhouette crowd, truss lights, spotlight sweep behind lessons | Menus/Environment | M |
| 8 | **Avatar cosmetics on GLB hero** (bone attach) — make transform rewards visible | Characters | M |
| 9 | **Shop interior art** — shelves + Zoey shopkeeper portrait | Menus | M |
| 10 | **Sky motion** — star parallax drift + occasional shooting star | Shaders/Atmosphere | S |
| 11 | **Touch ripple → star-glyph bloom** on every tap | Particles | S |
| 12 | **Gloomling redesign** — droopy cloud-creature with feelable sadness | Characters | M |
| 13 | **Butterfly wings** — two flapping planes replace glow blobs | Particles | S |
| 14 | **Prop silhouettes round 2** — lantern heads, curved benches, glazed pots; fix Rumi staff sliver | Environment/Characters | S |
| 15 | **HUD custom icon pass** (star/energy/speaker as drawn glyphs) + parent dashboard restyle | UI | M |

## Standing rules (unchanged)
Characters remain the quality ceiling · no static additions (everything ships
with motion) · founder pipeline check before any new art file · every visual
state change lerps ≥ 4s (atmosphere rule) — nothing snaps.
