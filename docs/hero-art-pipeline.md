# Hero Art Pipeline — dropping a real anime character into the web build

> Goal of this pass: replace the placeholder blob with a **rigged, animated, toon-shaded** character so the *avatar-ownership* test looks genuinely "anime" — using **free tools** and **no code changes**.
> The build auto-loads `assets/hero/hero.glb` if present (toon shading + idle/dance), and **falls back to the blob** if not. Pass a custom file with `?hero=URL`.

## What the build does automatically
- Loads `assets/hero/hero.glb` (or `?hero=...`).
- **Toon-shades** every material (cel ramp via `MeshToonMaterial` + a 3-step gradient).
- Plays animations whose clip names contain **idle / walk / dance**; a single-clip file becomes the idle. Walks when moving, idles otherwise, **dances during the transformation**.
- Tints materials named like `outfit/cloth/jacket/dress/...` with the child's chosen **Outfit color** (so customization still lands).
- Scales the model to ~1.8 units, drops feet to the ground, faces +Z (override with `?heroRotY=3.14159`).

## Route A — VRoid Studio → Blender → glb (most "anime", free)
1. **VRoid Studio** (free, Windows/Mac): design a stylized anime character. Export **VRM**.
2. **Blender** + the free **VRM add-on** (`VRM_Addon_for_Blender`): import the `.vrm`.
3. (Optional but recommended) add animations — see Mixamo step below — or skip for a static idle.
4. **Export glTF 2.0 (.glb)**, "Include → Animations", → save as `assets/hero/hero.glb`.

## Route B — Mixamo (best animations, incl. dance)
Mixamo gives mocap-quality clips (idle, walk, **dance**) — the fastest way to get *animation* quality up.
1. Go to **mixamo.com** (free Adobe account). Pick a character (or **Upload** your VRoid/RPM model).
2. Add animations: search **"Idle"**, **"Walking"**, and a dance (e.g. **"Hip Hop Dancing"**). Download each as **FBX** (without skin for extra clips).
3. In **Blender**: import the character + each FBX; put the three motions as **Actions** named exactly **`idle`**, **`walk`**, **`dance`** (use the NLA/Action editor; "Push Down" each).
4. **Export .glb** with animations → `assets/hero/hero.glb`.

## Route C — Ready Player Me (fastest, less anime)
1. **readyplayer.me** → create avatar → copy the **.glb** URL (it ends in `.glb`).
2. Either download it to `assets/hero/hero.glb`, or just load it live: `?hero=https://models.readyplayer.me/<id>.glb`.
3. Add Mixamo animations via Blender as in Route B for movement/dance (RPM rigs retarget well in Mixamo).

## Verify it worked
- Open the live URL; create your hero — you should see the **3D model turning** in the creation close-up (instead of the blob).
- Walk around → it should **walk**; complete a day → it should **dance** during the "grew today" moment.
- Append `?hero=...&heroRotY=3.14159` if it faces away; `?reset=1` to start a fresh child.

## Current limitations (honest)
- **Outfit color** tints (when material names match keywords); **hair/skin/hairstyle picks and hat/cape accessories don't map to the model yet** — those creation rows auto-hide when a model is loaded. Per-model customization (material slots / swappable meshes / attach points) is the next art-integration step.
- **No outline pass yet** (cel ramp + rim only). Inverted-hull/SSAO outline can be added.
- **Uncompressed glb only** (no Draco/KTX2 decoders bundled yet) — keep exports uncompressed, or we add the decoders.
- This is the **web prototype** path for testing feel. The shipping client (Unity 6 URP + a production toon shader, per `unity-architecture.md` / `art-bible.md`) is where the final concept-sheet bar gets hit.

## Caveat from the build side
I validated the loader by syntax + import-resolution checks, **not** a live WebGL render (no GPU here). Please confirm a model loads on a device; if anything looks off (scale, facing, animation names), tell me the model's clip names and I'll adjust the mapping.
