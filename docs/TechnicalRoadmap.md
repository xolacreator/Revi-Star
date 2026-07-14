# Technical Roadmap — Technical Director Audit
_2026-07-14 · live build v88_

## Architecture
- **`a1.js` is a ~1,450-line single ES module** containing state, audio, voice,
  3D world, characters, learning engine, shop, UI wiring, and the tick loop.
  It has been remarkably editable, but every pass raises collision risk and
  the file now exceeds what a future session can safely hold in view at once.
  **Recommendation (T1):** split into `src/` modules — `state.js`, `audio.js`,
  `world.js`, `characters.js`(new namespace), `learning.js`, `shop.js`,
  `ui.js`, `main.js` — with explicit imports, no behavior change, verified by
  the harness. Do this BEFORE interiors/lesson-shapes land. One dedicated pass.
- Three character-mount call sites (hero, guide, ambient idols) share
  `mountCharacter` — good. Unify the "slot" concept when splitting (T1).

## Rendering & performance
- Estimated ~140–170 draw calls at plaza view (低-poly primitives, 1024 shadow
  map, no post-processing; bunting correctly merged to 1 call). Materials:
  ~15 shared + per-prop toon instances. **Fine for modern phones; unverified
  on hardware.**
- **T2: on-device profiling flag** — `?fps=1` overlay (rolling FPS + draw-call
  readout from `renderer.info`) so the founder can screenshot real numbers.
  One founder session on their iPhone = our first ground truth.
- Per-frame allocations: `tapGround` creates Vector3s per event (ok), tick
  allocates in `spawnTrail`/bursts (short-lived, GC-tolerable). No leaks
  observed across 6-minute headless runs. Watch `stepFx`/`magic` pool sizes.
- Shadow: single 1024 map, 22u frustum — correct budget. Do not add casters
  casually; new props default `castShadow=false` unless silhouette-critical.

## Memory & assets
- GLBs: hero 1.4MB + guide ~1.4MB + 2 ambient ~1.8MB ≈ 4.6MB GPU-bound rigs —
  acceptable; do not add more persistent skinned characters without LOD story.
- VO: 175 mp3s fetched on demand, browser-cached — good.
- **T3: SW SHELL still precaches 9 legacy prototype files** (`demo-explore.html`,
  `classic.html`, `game.js`, `world3d.js`, `characters.js`, `assets.js`,
  `styles.css`, `harbor-slice.html`, `harbor.js`) — dead weight in every
  install and a confusion hazard. Decide: archive to `/legacy` (keep history)
  and drop from SHELL. Quick win.

## Duplication & smells
- Version string now lives in 2 places (sw.js CACHE + index.html `?v=`).
  **T4:** single `APP_V` const injected into both at edit time is overkill for
  a no-build repo — instead document the two-touch rule at top of sw.js (done
  informally; make it a comment checklist).
- Color literals repeated across world code (`#FFD24D` etc.) — acceptable in
  canvas-drawn textures; consolidate palette consts during T1.
- `tf-emoji`/`tfPortrait` pattern fine; `coachArt`/`VO_HAVE` globals fine for
  scale; `window` QS flags (`?hero3d`, `?bg`, `?allskills`) — document in one
  README block (T5, trivial).

## Save/state integrity
- Migrations handled inline (`state.shop` v88) — keep the pattern: every new
  field ships with `if(!state.x) state.x=default`.
- **T6:** add `state.v` schema version + a tiny `migrate()` ladder when T1
  lands (cheap insurance before economy grows).

## Debt ledger (priority order)
| ID | Item | Effort | Risk if ignored |
|---|---|---|---|
| T3 | Trim legacy files from SW SHELL | S | install bloat, confusion |
| T2 | ?fps=1 profiling overlay + founder session | S | shipping blind on perf |
| T1 | Modularize a1.js | L | pass collisions, context overflow |
| T6 | Save schema version | S | painful migrations later |
| T5 | Document QS debug flags | S | lost tribal knowledge |
| — | Playwright full-day scripted run (with QA) | M | regressions in day flow |
