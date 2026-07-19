// ============================================================
//  Doodle Stars — AI-asset pipeline (optional, with fallbacks)
// ============================================================
//  Drop AI-generated images into /assets using the names below and
//  they light up automatically. If a file is missing, the app keeps
//  using its built-in code-drawn art — so it always works.
//  See ASSETS.md for exact specs + ready-to-paste generation prompts.
// ============================================================

const ASSETS = {
  base: 'assets/',
  // Background art per world (used by the hub + sticker-play scenes).
  backgrounds: {
    pop:   'bg-pop.png',
    frost: 'bg-frost.png',
  },
};

// Probe an image; resolve with its URL if it loads, reject if missing.
function loadAsset(path) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img.src);
    img.onerror = reject;
    img.src = ASSETS.base + path;
  });
}

// Apply a world background image if available; otherwise leave the
// element's CSS gradient fallback in place.
function applyBackground(el, worldKey) {
  const file = ASSETS.backgrounds[worldKey];
  if (!el || !file) return;
  loadAsset(file).then((url) => {
    el.style.backgroundImage = `url("${url}")`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    el.classList.add('has-asset');
  }).catch(() => { /* keep the code-drawn gradient */ });
}

window.DSAssets = { ASSETS, loadAsset, applyBackground };
