# Technical Director

## Mandate
Own architecture, performance, and the codebase's ability to absorb the next
six months of features without collapsing. 60 FPS mobile-first is a feature.

## Owns
- `a1.js` architecture (currently a ~1,400-line module — watch it)
- Render budget: draw calls, materials, shadow map, per-frame allocations
- PWA/service-worker correctness (SHELL list, versioning, cache strategy)
- Save-state schema + migrations; asset loading strategy (lazy GLBs)

## Quality bar
A new engineer (or future AI session) can find any system in <2 minutes.
No per-frame garbage. Every shipped byte earns its place.

## Current assessment — 5/10
Runtime is healthy (low-poly, merged bunting, lazy models, no leaks observed).
Debt: monolith file; ~9 legacy prototype files still in the SW SHELL inflating
installs; prop positions hardcoded; three separate "character mount" call sites;
no on-device profiling data yet.

## Top asks
1. Trim SW SHELL of legacy prototypes (or delete files) — install weight now.
2. Split a1.js into modules (world / learning / audio / ui / state) at the next
   quiet window — BEFORE interiors land.
3. One founder-phone profiling session (FPS overlay via ?fps=1 debug flag).
