# Character Production Specification — Visual Convergence to the HUNTRIX Concept

> **Lead Character Art Director spec.** Goal: close the gap between the current 3D characters and the approved concept sheet — **modeling, texture, and rig only** (rendering pipeline assumed sufficient).
> **Audience adaptation:** the sheet is the *visual identity* source; built for the **ages-5–7 Little Legends** game (rounder, friendlier, combat-free — tools/instruments, not weapons).
> **Build targets the existing GLB pipeline** (`assets/hero/hero.glb`, toon + outline + face-card system already in engine). Supersedes the budgets in `hero-package-rumi.md` §8 where more specific.
>
> **Priorities (in order):** 1) mobile readability · 2) emotional appeal · 3) distinctive silhouette · 4) character identity · 5) animation compatibility.

---

## PART 1 — Gap Analysis (current build vs. approved art)

Current build = primitive-mesh placeholders: **capsule torso + sphere head + basic hair shapes + a flat canvas face card + a star prop. No arms, no hands, no legs, no feet, no real garments.**

### 1. Silhouette differences
- **Gap:** The characters are limbless blobs (~2.5–3 heads, no arm/leg read). The sheet's idols have a clear **full-body silhouette** — head, flowing hair, layered outfit, posed arms/hands, legs, and **chunky boots** — instantly identifiable in black.
- **Why it matters:** Silhouette is the #1 readability cue at phone size and the primary identity signal. A blob is unidentifiable and unappealing; a posed idol with a braid + jacket + boots reads in 1 frame.
- **Modeling req:** Build a **full humanoid** at **~4.7 heads** (friendly-hero proportions, not the 7-head teen sheet). Distinct hard points: hair shape, shoulder/jacket line, waist, hands, boot mass. Exaggerate the **3 biggest silhouette hooks per character** (Rumi = forward braid + jacket collar + boots).
- **Texture req:** None for silhouette per se — but keep **outline-friendly clean edges** (the engine's inverted-hull outline reads best on continuous surfaces).
- **Animation req:** Limbs must exist and be **rigged** so idle/walk/dance read; silhouette must stay legible through poses (no limbs that collapse into the torso).

### 2. Facial design differences
- **Gap:** Faces are a recent **flat canvas card** (good stopgap) but generic; the sheet has **large, idol-styled anime eyes** with defined iris gradients, eye-shine, eyeliner/lash shapes, and per-character eye color + brow personality.
- **Why it matters:** The face is the entire emotional-appeal engine for this genre and age. "Cute and expressive" is the product.
- **Modeling req:** Keep the **flat face-plane (face-card) approach** for mobile (no heavy facial geo), OR a low-poly face with **blendshapes** (see Part 2). Eyes occupy **~⅓ of face height**, slight upward outer tilt.
- **Texture req:** A dedicated **face atlas (512²)** with crisp eyes: white sclera, **2-tone iris + rim**, a large catch-light + a small secondary sparkle, soft upper lash line, simple brows. Authoring as **expression frames** (neutral/blink/happy/surprised/proud) on a sprite sheet, or as **blendshapes** if geo face.
- **Animation req:** Drive expressions by **UV-swap (face card)** or **blendshapes**; minimum set: blink, happy, surprised, proud, "star-eyes" (celebration). Eyes must read at 120px.

### 3. Hair design differences
- **Gap:** Hair = basic primitive lumps (sphere cap, a capsule "braid"). The sheet's hair is a **major silhouette element**: Rumi's long thick **plaited braid** with a gold ribbon + face-framing strands; bold flowing volumes.
- **Why it matters:** Hair shape + color is a recognizable-from-silhouette-and-palette-alone identity cue (your own design goal).
- **Modeling req:** Build hair as **layered hair-cards / chunky stylized clumps** (NOT strand sim): a fringe, two face-framing strands, crown volume, and the **signature mass** (Rumi braid in 5–6 readable plait segments). Keep large simple shapes.
- **Texture req:** **Hair atlas (1k)**: 2-band toon ramp baked or flat color + one broad highlight band; alpha for card tips. Avoid noisy strand textures (won't read on mobile, fights the toon look).
- **Animation req:** Add a **bone chain (3–6 joints)** through the signature hair mass for **jiggle/secondary motion** (the braid must sway — the engine already drives procedural braid sway; a bone chain makes it real). Fringe = 1–2 jiggle bones.

### 4. Outfit design differences
- **Gap:** "Outfit" is a single flat-colored capsule. The sheet has **layered K-pop idol fashion**: cropped jacket over a top, shorts/skirt over patterned leggings, boots, and accessories (star motifs, ribbon, earring).
- **Why it matters:** Fashion *is* the franchise (and the monetization pillar). It's also the second-strongest identity/color cue after hair.
- **Modeling req:** Model garments as **separate shells** over the body: jacket (with collar + rolled cuffs), inner top, shorts/skirt, **leggings/tights**, **chunky boots**. Age-appropriate coverage (no midriff for the kids build). Oversized friendly **boots** = key silhouette mass.
- **Texture req:** **Body/outfit atlas (2k)** with clear **color-blocking zones** (jacket / top / lower / boots) so the engine can tint the "outfit" zone to the child's chosen color; bake embroidered **star motifs** into the texture (not geo). ASTC-compressed.
- **Animation req:** Jacket hem + skirt get **2–4 cloth/jiggle bones** (or a lightweight cloth proxy). Keep garments skinned to the body skeleton so they deform with dance.

### 5. Color design differences
- **Gap:** Current colors are close (Rumi gold/purple ✓) but flat and unzoned; no consistent per-character family applied across hair/outfit/eyes/accessory.
- **Why it matters:** "Identifiable from color palette alone" is a stated design goal; consistent color families make the cast instantly legible.
- **Modeling req:** N/A — but assign **material zones** so each color family maps to body parts.
- **Texture req:** Author to the **locked palette** (Part 2 hex). Each character = **1 primary + 1 secondary + shared gold star-accent**. Keep saturation high (toon, not PBR).
- **Animation req:** N/A.

### 6. Appeal differences
- **Gap:** Blobs with a flat face = "prototype," not "I love this character." Missing: cute proportions, expressive face, fashion, hands that gesture, dance-ready body.
- **Why it matters:** Appeal (the "I want the plush" reaction) is the entire commercial + emotional bet of the project.
- **Modeling req:** Big head, big eyes, **rounded soft forms**, **oversized hands/feet** (appeal + readability), clear cheeks. Plush-friendly shapes.
- **Texture req:** Soft cheek blush, clean bright colors, eye-shine.
- **Animation req:** **Appeal poses** (idle attitude, a wave, a dance) and **snappy timing** carry appeal more than geo detail — keep the rig expressive.

---

## PART 2 — Full 3D Production Specifications

Shared technical envelope (mobile, matches engine): **URP/Three toon**, atlas textures, **Humanoid rig** (for retarget/Mixamo), inverted-hull outline (engine adds it), **flat face card OR blendshape face**. Export **GLB** (uncompressed) to `assets/hero/hero.glb`. Z-forward, Y-up, feet at origin, real-world-ish scale (~1.0–1.2 m tall in-engine units the loader rescales to ~1.8).

---

### 2A. RUMI — "The Voice" (Reading)

**Identity (read in 1 sec):** long royal-purple **braid over one shoulder** + **gold idol jacket** + the **Lyric-Star** motif.

**Proportions:** **~4.7 heads** tall; soft, leader-tallest of the cast; slim-but-round, no curve emphasis (age-appropriate).

**Silhouette hooks (exaggerate these 3):** (1) thick forward braid to mid-thigh, (2) gold jacket collar + rolled cuffs, (3) chunky short boots.

**Modeling**
- **Tri budget:** **16–22k** total (body+hair+outfit+props). LOD1 ~9k, LOD2 ~4k.
- **Parts:** single watertight body; jacket/top/shorts/leggings/boots as skinned shells; **braid as a jointed object**; **Songstaff = a friendly star-topped microphone** (oversized, emissive star — NOT a blade).
- **Hands:** simple **4-finger** mitten-friendly hands, slightly oversized; one posed to hold the mic.
- **Topology:** clean quad loops at shoulders/elbows/knees/hips for deformation; face either flat plane (card) or low-poly with loops around eyes/mouth.

**Face**
- Large rounded-almond eyes, slight upward tilt, **amber-gold iris (#E0A83A)** + rim + big catch-light; soft lash line; expressive purple-tinted brows; tiny button nose; warm open smile.
- **Texture:** 512² face atlas; expression frames **neutral / blink / happy / surprised / proud / star-eyes** (UV-swap) — or blendshapes (§rig).

**Hair**
- Royal-purple base `#7B4FC4`, lighter violet midtone, **gold ribbon** woven through the braid; one broad highlight band.
- **Cards/clumps:** fringe (off-center part) + 2 face-framing strands + crown volume + braid in **5–6 plait beads** with a **gold star tie** top and tip.
- **Texture:** 1k hair atlas, toon-flat + highlight, alpha tips.
- **Bones:** **braid chain 5–6 joints** (jiggle), fringe 1–2 jiggle bones.

**Outfit**
- **Gold jacket `#FFC83D`** (collar, rolled cuffs, embroidered back **Lyric Star**) over **white top `#FFFFFF`**; **purple shorts `#7B4FC4`** over patterned **tights**; **purple boots `#5B3FA0`** with gold sole stripe. Lyric-Star earring; gold braid-star.
- **Texture:** 2k body/outfit atlas, color-blocked zones; star motifs baked in; satin sheen baked as lighter band (no real specular needed).

**Color (locked):** Primary **Gold #FFC83D**, Secondary **Royal Purple #7B4FC4**, accents White #FFFFFF + **Star Gold #FFD24D**, eyes #E0A83A.

**Rig**
- Humanoid skeleton (~50 bones) + **braid 5–6** + jacket hem 2 + Songstaff 1 + a few jiggle. **~60–70 bones total.**
- **Blendshapes (if geo face):** ~30–40 — brow up/down/in (L/R), eye wide/blink/squint, cheek raise, mouth open/smile/o/press, + "star-eyes". (If face-card, expressions = UV frames instead.)

**Texture summary:** 2k body atlas (albedo + small packed mask for the tintable outfit zone), 1k hair, 512² face, 512 Songstaff. ASTC. **Keep the "outfit" material as its own slot** so the engine can tint it.

**Animation considerations:** idle with breath + braid sway + blink; walk with hem/braid overlap; a **performance/dance** set (mic-raise, point-up, spin, hip-sway) — the franchise glue; transformation pose. Eyes lead motion. Provide a **T-pose or A-pose** bind; Mixamo-compatible bone names.

---

### 2B. THE CHILD STAR HUNTER (player avatar)

**Identity:** *the child's own* customizable hero — the emotional center ("I become the hero"). Must support **customization zones**, not a fixed look.

**Proportions:** **~4.5 heads** (a touch rounder/younger than Rumi — the look-up-to vs. be-me distinction).

**Silhouette hooks:** (1) chosen **hairstyle mass** (5 options below), (2) a simple **star-tool** held/at hip, (3) chunky boots; later cosmetic hat/cape attach points.

**Modeling**
- **Tri budget:** **14–18k**. LOD1 ~8k.
- **Customization built for swap/tint:**
  - **Hairstyle = 5 swappable mesh pieces** (short / ponytail / puffs / bun / long) skinned to the same head/neck bones — exactly the engine's current 5 styles, but as real hair-card meshes.
  - **Skin** = head/hands material (tintable: provide 4–6 skin tones).
  - **Outfit** = a single tintable garment zone (the child picks the color; the engine tints this material) — a friendly **trainee jacket + top + shorts + leggings + boots**.
  - **Hair color** = hair material tint.
- **Attach points (empty transforms):** `head_top` (hat), `back` (cape), `hand_R` (star-tool) — so earned cosmetics snap on without re-rig.
- **Hands/feet:** 4-finger oversized hands; chunky rounded boots.

**Face**
- Same face-card/blendshape system as Rumi; **neutral-friendly default**, big bright eyes (offer 2–3 iris colors with skin/hair). Expression set identical (blink/happy/surprised/proud/star-eyes).
- **Texture:** 512² face atlas (expression frames).

**Hair**
- 5 style meshes, each **toon-flat + 1 highlight**, hair-color tintable (4 colors min). Each style needs its own **jiggle bones** (ponytail 2–3, long 3, puffs 1 each, bun 1, short 1).
- **Texture:** shared 1k hair atlas across styles where possible.

**Outfit**
- Trainee idol-casual: jacket + tee + shorts + tights + **boots**; **star chest motif** baked. Single **tintable outfit zone** (default teal `#5EC8C0`, but the child chooses). Earned **hat (cone/beanie)** and **cape** as separate snap-on meshes.

**Color (customizable):** Outfit = **player-chosen** (palette: teal #5EC8C0 / pink #FF8FCF / gold #FFC83D / sky #8FD0FF). Shared **Star Gold #FFD24D** accent. Skin/hair from provided sets. The chosen color must propagate to the **tool glow & VFX** (engine already does this).

**Rig**
- Humanoid (~50) + per-style hair jiggle (1–3) + boot/hem 2 + tool 1. **~55–65 bones.** Identical bone names to Rumi so animations **share/retarget**.
- Blendshapes/UV expressions: same set as Rumi.

**Texture summary:** 2k body (tintable outfit zone + skin zone clearly separated in the atlas), 1k hair, 512² face, small tool map.

**Animation considerations:** **shares Rumi's animation set** (same skeleton) — idle/walk/dance/transform; the avatar is the one that "grows" daily, so ensure the **transformation pose + accessory-reveal** read well. Customization swaps (hair mesh, tints) must not break skinning — keep all hair pieces weighted to the same head/neck bones.

---

### 2C. TWINKLE (Star Pal companion / glow-fox)

**Identity:** instantly-lovable round **glow-fox** — cream fur, purple ear/tail tips, **glowing gold star-tail**. The plush flagship.

**Proportions:** **~2 heads** (chibi pet); all circles & soft arcs; oversized fluffy tail; big eyes.

**Silhouette hooks:** (1) huge fluffy **star-tipped tail**, (2) big round head + ears, (3) tiny paws.

**Modeling**
- **Tri budget:** **4–6k**. LOD1 ~2.5k.
- **Parts:** round body, round head, 2 ears, fluffy tail (1 big clump), **tail-star (octahedral, emissive)**, 4 tiny legs/paws. 3 evolution forms = **same base, additive detail** (Form 2 adds tail-star size + small cape; Form 3 adds star-ears + a little cape) — model as **toggleable extra meshes**, not new bodies.
- **Hands/paws:** simple stubs.

**Face**
- Big round eyes (dark `#241B3A`) with catch-lights, tiny nose, optional mouth; **expressions via blendshapes or UV**: blink, happy, excited, sleepy. (Engine currently uses dot-eyes — upgrade to eyes-with-shine on a small face card or blendshapes.)
- **Texture:** 512² face/fur atlas.

**Hair/Fur**
- Stylized fur as **smooth toon surfaces** (no fur shells — too costly on mobile), cream `#FFF0CF`, purple `#9A6AE0` ear/tail tips. One highlight band.

**Outfit/Accessories**
- None base; evolution adds a tiny **gold cape** + **star-ear** accents; accessory **attach point** on collar for cosmetics.

**Color (locked):** Primary **Cream/Gold #FFF0CF**, Secondary **Purple #9A6AE0**, accent **Star Gold #FFD24D**, eyes #241B3A.

**Rig**
- **~18–22 bones:** body, head, 2 ears, 4 legs, **tail chain 3** (essential — the tail must swish), jaw optional.
- Blendshapes: ~8–10 (eyes/mouth/happy/blink).

**Texture summary:** 1k body/fur atlas + 512² face. ASTC.

**Animation considerations:** must feel **alive** (engine already drives look-at, blink, cheer, spin). Provide clips/poses: hover-bob idle, happy spin, cheer hop, sleepy curl, "found-it" point; **tail chain** swishes on all. Keep the tail-star a separate node so it can glow/pulse.

---

## PART 3 — Build Workflow (VRoid / Blender / Maya)

**Fastest path to the look (recommended): VRoid Studio → Blender → GLB.**
1. **VRoid Studio (free):** build Rumi & the Child base bodies/faces; use VRoid's hair editor for the **braid + 5 styles** (or model hair-cards in Blender). Set the **anime face textures** (big eyes, amber/iris colors). Export **VRM**.
2. **Blender (+ VRM add-on):** import VRM; refine outfit shells (jacket/boots), add the **Songstaff/star-tool**, set **material zones** (name the tintable outfit material `outfit` so the engine's keyword tint catches it — see `hero-art-pipeline.md`), add **hair + hem jiggle bones**, parent **attach-point empties** (`head_top`, `back`, `hand_R`). Twinkle is custom-modeled in Blender (simple primitives → sculpt-lite → retopo to 4–6k).
3. **Animation:** rig is **Humanoid**; pull **idle/walk/dance** from **Mixamo** (name clips `idle`/`walk`/`dance` — the engine auto-detects), or hand-key in Blender/Maya. Push jiggle as secondary.
4. **Export GLB** (uncompressed, +Y up, +Z forward, feet at origin, animations included) → drop at `assets/hero/hero.glb`.

**Maya path:** same deliverables — model + UV + skin to a Humanoid (HumanIK-compatible) skeleton, bake toon-flat textures, export GLB via the glTF exporter.

## PART 4 — Acceptance checklist (per character)
☐ Reads in **silhouette** at 120px (the 3 hooks survive) ☐ **Face** legible & expressive at 120px ☐ **Color family** consistent across hair/outfit/eyes/accent ☐ Tri/texture **within budget** ☐ **Humanoid rig**, Mixamo-named clips ☐ **Jiggle bones** on hair/braid/tail/hem ☐ Tintable **`outfit` material** + **attach-point empties** ☐ Toon-flat textures (no noisy detail) ☐ Plush-friendly **appeal** pass approved.

> The bar: a stranger glancing at the phone for one second should say **"that's a cute K-pop idol hero,"** and a child should say **"that's MY hero."**
