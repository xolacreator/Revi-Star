# Doodle Stars — AI Asset Pipeline

The app works fully with its built-in **code-drawn art**. Drop AI-generated
images into the `assets/` folder using the **exact file names** below and they
appear automatically (with a graceful fallback if a file is missing). No code
changes needed — `assets.js` wires them up.

## How it works
- `assets.js` defines an `ASSETS` manifest and an `applyBackground()` loader.
- On load, the app tries `assets/<name>`. If it loads → it's used. If not →
  the code-drawn gradient/art stays. So you can add assets one at a time.

## Global style guide (use in every prompt)
> Soft, friendly, rounded **kids' picture-book** illustration for ages 5–8.
> Bright, cheerful, high-contrast, simple shapes, no text, no scary elements.
> Clean flat shading with gentle gradients. Vector-like, app-quality.

Keep characters **original** — do **not** reference real franchises or named
characters. (The app's whole point is original, recolorable art.)

---

## Assets to generate (Phase 1)

### 1. World backgrounds — `assets/bg-pop.png`, `assets/bg-frost.png`
Used behind the hub and Sticker Play scenes.

- **Size:** 1080 × 1920 px (portrait, 9:16), PNG.
- **Composition:** keep the center relatively calm/empty (UI and stickers sit
  on top); put detail toward the edges/bottom.
- **bg-pop prompt:**
  > A dreamy pop-concert stage for kids: soft purple-to-pink gradient sky,
  > glowing stage lights and sparkles, a simple rounded stage at the bottom,
  > floating music notes and stars, no characters, no text. Picture-book style.
- **bg-frost prompt:**
  > A magical winter wonderland for kids: soft blue-to-teal gradient sky with
  > gentle aurora, rounded snowy hills, sparkling snowflakes falling, a calm
  > open center, no characters, no text. Picture-book style.

---

## Naming rules
- Lowercase, hyphenated, exactly as listed (e.g. `bg-pop.png`).
- PNG with transparency where noted; otherwise flat PNG is fine.
- Put files directly in `assets/`.

## Adding more later
Extend the `ASSETS` manifest in `assets.js` (e.g. per-activity backgrounds,
hero illustrations, sticker art) and follow the same name-and-drop flow. Ping
me and I'll wire new categories (sticker images, animated Lottie effects, etc.).
