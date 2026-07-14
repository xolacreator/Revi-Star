# Art Direction Roadmap — Art Director Review
_2026-07-14 · live build v88 · bar: Nintendo-quality children's titles_

## State of the look
The 2D layer (Concert/Storybook/Aurora system, v83–v86) is cohesive and reads
professionally designed. The 3D layer made its biggest single jump in v85 but
remains primitive-built. Characters (rigged GLBs + toon ramp + 3-point
HUNTRIX lighting) are the visual high point; the gap between character quality
and world quality is now the defining art problem.

## The 15 highest-impact visual improvements (prioritized)
| # | Improvement | Why it matters | Effort |
|---|---|---|---|
| 1 | **Water that moves** — 2-layer scrolling shimmer + foam ring at plaza edge + slow wave scale | Water is 40% of every frame and currently a static disc | M |
| 2 | **Door transition** — iris/fade + camera push when entering shop (and every future interior) | Sells "buildings are real"; reused forever | M |
| 3 | **Challenge stage set** — the lesson bg gains silhouette crowd sticks, truss lights, animated spotlight sweep | The screen kids stare at longest is a flat gradient | M |
| 4 | **Reward choreography** — stars fly INTO the counter one by one w/ ticks, then card pop | Reward timing is the #1 "feel" gap vs Nintendo | M |
| 5 | **Shop interior art** — shelf backdrop, Zoey shopkeeper portrait, items on shelves not rows | First interior sets the interior bar | M |
| 6 | **Lamp/bench/planter silhouette round 2** — lantern heads, curved bench, glazed pots | Primitive shapes read at close camera | S |
| 7 | **Sky motion** — drifting star parallax layer + occasional shooting star | Painted sky is beautiful but frozen | S |
| 8 | **Avatar cosmetics on the GLB hero** — hat/cape attach to head/spine bones (currently blob-only) | Transform rewards are invisible on the real hero — quality bug | M |
| 9 | **Transform portraits for hero & Twinkle** — art exists for guides only | Emoji fallback breaks the storybook moment | S(art ask) |
| 10 | **Touch ripple → magic glyph** — tap feedback becomes tiny star-glyph bloom | Every single tap gets 10% more magical | S |
| 11 | **Butterfly → real wings** — two-plane flapping sprite replaces glow blob | Ambient life reads as fireflies only | S |
| 12 | **HUD icon pass** — draw star/energy/speaker as custom SVG glyphs (not emoji) | Emoji render differently per OS; last "HTML" tell | M |
| 13 | **Gloomling redesign** — sad cloud-creature w/ droopy ears vs gray ball | First creature a child meets is the least designed | M |
| 14 | **Colored shadow tint** — purple-tinted shadow color instead of black | Cheap Ghibli warmth (one uniform) | S |
| 15 | **Parent dashboard restyle** — bring the grown-up screen into the system | Cohesion completeness (lowest child impact) | S |

## Standing rules
- Characters stay the quality ceiling — world work may approach, never exceed budget spent on cast readability.
- No new art file without checking founder pipeline (they push PNGs/GLBs via GitHub Desktop).
- Every visual add ships with its motion (nothing static enters the world).
