# Rumi (Reading hero) — NPC model

Drop Rumi's character here. Workflow (same as the player):
1. Generate in Rodin (Smart Low Poly, T-pose, FBX, PBR).
2. Rig + Idle in Mixamo → download FBX.
3. Push the **Mixamo FBX** here (e.g. `Idle.fbx`) — I convert it to **`rumi.glb`**.
4. Also push the **textured Rodin file** (or its texture PNG) so I can re-apply color
   (Mixamo strips textures).

Loads automatically as the **Rumi NPC** (replaces her placeholder) when you open the
game with `?hero3d=1`. Standalone file → loaded by `assets/rumi/rumi.glb`.
