# Drop your rigged hero here

Place a rigged, animated character as **`hero.glb`** in this folder.
When present, the web build replaces the placeholder "blob" with your model
(toon-shaded, animated). When absent, it silently falls back to the blob — so
the prototype always works.

- File: `assets/hero/hero.glb` (binary glTF, uncompressed — no Draco/KTX2 yet).
- Animations: name clips with **idle / walk / dance** (case-insensitive) for
  auto-detection. A single-clip file is used as the idle.
- If the character faces away from the camera, load with `?heroRotY=3.14159`.
- Test a model without renaming the file via `?hero=assets/hero/whatever.glb`.

Full step-by-step (VRoid / Mixamo / Ready Player Me): see
`docs/hero-art-pipeline.md`.
