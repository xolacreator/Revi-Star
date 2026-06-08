# Hyper3D (Rodin) Character Prompts

Generate **one character at a time**. Before exporting each, enable if available:
**T-pose / A-pose**, **PBR textures** (not unlit/emissive bake), **lowest-poly / game-ready**.
Then rig + animate each via **mixamo.com** (auto-rig → Idle/Walk/Dance → export glb), or
Hyper3D's own rig export if present. Drop the player model at `assets/hero/hero.glb`,
load the game with `?hero3d=1`.

## 1 · Rumi (Reading — gold + purple)
A cute stylized 3D anime idol girl, full body in a T-pose with arms straight out, about 5 heads tall, big friendly round eyes, soft rounded features. Long royal-purple braid over one shoulder with a gold star tie and a swept fringe. Gold cropped idol jacket over a white top, purple shorts, patterned tights, short purple boots with gold trim, holding a friendly star-topped microphone. Bright K-pop colors, soft toon shading, single character, game-ready, clean mesh, PBR textures, neutral expression, no weapons.

## 2 · Child Star Hunter (player avatar)
A cute stylized 3D kid hero, full body T-pose with arms straight out, about 5 heads tall, big friendly eyes, soft rounded child proportions, short tidy hair. A simple teal hooded jacket over a white tee, navy shorts, leggings, and chunky short boots, with a small gold star emblem on the chest. Bright cheerful colors, soft toon shading, single character, game-ready, clean mesh, PBR textures, gender-neutral, neutral expression.

## 3 · Mira (Logic — magenta + purple)
A cute stylized 3D anime hero girl, full body T-pose with arms straight out, about 5 heads tall, big confident friendly eyes, long crimson-magenta hair with a side ponytail. A magenta-and-purple graphic tee, black skirt over patterned leggings, fingerless gloves, short black boots with magenta laces. Bold magenta/purple K-pop colors, soft toon shading, single character, game-ready, clean mesh, PBR textures, neutral expression, no weapons.

## 4 · Zoey (Rhythm — cyan/teal + gold)
A cute stylized 3D anime hero girl, full body T-pose with arms straight out, about 5 heads tall, big playful friendly eyes, short black bob with purple streaks and little hair clips. A teal halter top, black cargo pants with gold-yellow accents, and bright yellow sneakers. Energetic cyan/teal and gold K-pop colors, soft toon shading, single character, game-ready, clean mesh, PBR textures, cheerful expression, no weapons.

## Tips
- One character per generation (asking for several fuses them into one un-riggable mesh).
- T-pose/A-pose is what makes a mesh riggable afterward.
- Choose PBR/base-color textures — avoid "unlit/emissive bake" (it renders colorless under toon lighting).
- Keep poly low (~20–40k); the loader also auto-simplifies on import.
