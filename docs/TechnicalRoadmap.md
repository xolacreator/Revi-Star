# Technical Roadmap — Technical Director Audit
_Rev. 2 · 2026-07-15 · evidence: byte-level payload audit, object census,
call-site review of build v88_

## Payload audit (measured)
| Finding | Size | Action |
|---|---|---|
| **icon-512.png** | **656KB** (!) | T7: recompress → ~40KB (quick win, ships in every install + iOS splash) |
| icon-192 + apple-touch | 184KB | T7: recompress → ~30KB |
| **assets/title.png** | **1.6MB, DEAD** — referenced only by a CSS comment since the concert intro (v83) | T8: delete + strip stale `.intro-art` CSS block |
| Legacy prototypes in SW SHELL (9 files) | 88KB + 2 extra HTML entry points reachable in prod | T3: archive to /legacy, drop from SHELL |
| SHELL total | ~2.0MB (→ ~1.2MB after T3/T7/T8) | |
| assets/ on-demand | 31MB total: VO 6.3MB (175 clips, fetched lazily ✅), GLBs 4.6MB (lazy ✅), coach PNGs ~2.5MB | acceptable; VO grows to ~13MB at full script — fine, per-clip fetch |
| vendor three.js | 904KB | pinned, cached-first ✅ |

## Architecture
- `a1.js`: 1,283 lines, single module, 12 subsystems. Still editable but at
  the ceiling. **T1: split into src/ modules (state/audio/world/characters/
  learning/shop/ui/main) before P5 or interiors land.** Behavior-identical
  refactor, harness-verified, one dedicated pass.
- Character mounting unified through `mountCharacter` across 3 call sites ✅.
  Slot concept formalizes during T1.
- Save migrations inline (`state.shop`) ✅ — **T6: add `state.v` + migrate()
  ladder** during T1.

## Rendering (static analysis; device numbers pending T2)
- 39 `scene.add` sites + loop-spawned pools → est. 140–170 draw calls at
  plaza view. Single 1024 shadow map, 22u frustum. No post FX. Materials
  ~15 shared + per-prop toon clones.
- Rules holding: bunting merged (1 call) · new props default castShadow=false
  · glow via additive sprites not bloom.
- **T2: `?fps=1` overlay** (rolling FPS + `renderer.info.render.calls`) —
  the founder screenshots real numbers from their iPhone. Our perf claims are
  estimates until this exists. Gate heavy atmosphere work (weather) on it.
- Per-frame allocation review: tick creates short-lived Vector3s in trail/
  burst paths — GC-tolerable at current rates; pool if profiling shows churn.

## Correctness debt (from QA cross-audit)
- `rumiTransform` hardcodes name/portrait (Q1) — parameterize by guide.
- `e.isPrimary` guard missing on pointer handlers (multi-touch mash).
- Marker not cleared when a lesson interrupts shop-walk (cosmetic).
- Google Fonts not in SW cache → offline loses brand type (Q3): self-host
  woff2 subsets (~90KB, replaces 3 network fetches — also faster first paint).

## Duplication & hygiene
- Version bump touches sw.js + index.html `?v=` — documented two-touch rule;
  acceptable for a no-build repo.
- Palette literals repeated across canvas textures — consolidate to consts
  during T1, not before.
- QS debug flags (`?hero3d=0 ?bg= ?allskills=1 ?observe=1 ?fps=1(planned)
  ?hero= ?heroNode= ?heroIndex= ?heroRotY=`) — T5: document in README block.

## Debt ledger (priority order)
| ID | Item | Effort | Status |
|---|---|---|---|
| T7 | Recompress icons (656KB→~40KB) | S | NEW — fold into P3 |
| T8 | Delete dead title.png + stale CSS | S | NEW — fold into P3 |
| T3 | SHELL legacy trim | S | → P3 |
| T2 | ?fps=1 overlay + founder profiling session | S | → P3 |
| T6 | Save schema version | S | → P3 (or T1) |
| Q-fixes | isPrimary, transform param, marker clear, reduced-motion | S | → P3 |
| T1 | Modularize a1.js | L | before P5/interiors |
| T5 | Document QS flags | S | anytime |
| — | Self-host fonts (offline brand + first paint) | S | with P3 or P4 |
