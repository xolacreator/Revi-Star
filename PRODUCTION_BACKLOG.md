# Harmony Harbor — Production Backlog

Living document. Ranked by **player impact vs. effort**. Updated every production pass.

## ✅ Done (recent passes)
- Claude Design flow 1b→2b→3c→4a built into the game (Concert title/challenge, Storybook transform, Aurora reward) — v83
- Star Pal shrunk + moved off camera axis — v84
- **Environment Pass 1** — real lighthouse (striped tower, stone base, gallery, glass lantern, star finial, rocks), houses with doors/lit windows/chimneys, lamp posts w/ glow + festival bunting (single merged draw call), benches, planters, crates, 6 swaying toon trees, round ambient motes (were squares), brighter pre-bloom sky, lower cinematic camera — v85

## 🔴 High priority (do next)
| Item | Impact | Effort | Notes |
|---|---|---|---|
| Star Check screen still old pastel style | ★★★ | Low | Restyle to Concert to match challenge; keep light variant? decide |
| Transform screen: show the character portrait, not emoji | ★★ | Low | Design 3c mocks a circular photo; swap `tf-emoji` for coach img |
| Camera micro-polish: ease-in zoom on walk start, subtle push-in near lighthouse | ★★★ | Med | Keep motion gentle (kids) |
| Collect/reward camera bump + haptic already partial — extend to challenge correct | ★★ | Low | |

## 🟡 Medium
| Item | Impact | Effort | Notes |
|---|---|---|---|
| Combo meter in challenge (design 2b) | ★★ | Med | New scoring state; gameplay design decision — confirm with founder |
| Mira & Zoey appear in the world (idle NPCs near houses) | ★★★ | High | Needs GLB slots or reuse rumi rig with texture swap |
| Water: animated normal-ish shimmer layer, gentle waves at plaza edge | ★★ | Med | |
| Day/night or harmony-level lighting states beyond the one bloom | ★★ | Med | |
| Sound: lamp hum/harbor ambience loop (quiet, duckable) | ★★ | Med | Previous ambience was removed as droning — needs better loop |

## 🟢 Longer-term
| Item | Impact | Effort | Notes |
|---|---|---|---|
| Enterable buildings (Library, Academy, Music Hall, Bakery, Observatory, Twinkle Forest) | ★★★★ | Very high | Each: unique interior, transition, camera, ambience |
| Texture atlas + material/draw-call consolidation | ★★ | Med | ~140 draw calls now; fine, revisit if perf drops |
| LOD for props when camera pulls back | ★ | Med | |
| Interactive props (tap lamp → sparkle, tap tree → leaves) | ★★★ | Med | Delight directive |
| Seasonal/weekly plaza decorations | ★★ | Med | Retention hook |

## ⚠️ Technical debt
- `a1.js` is ~1200 lines and growing — split into modules (world / learning / audio / ui) at next big refactor window
- Two unused legacy prototypes still shipped in SW SHELL (`demo-explore.html`, `classic.html`, `game.js`, `world3d.js`, `characters.js`, `assets.js`, `styles.css`, `harbor-slice.html`, `harbor.js`) — decide keep/drop to slim install
- Bunting/lamp positions hardcoded — fine until plaza layout changes
- Star Check + challenge share `.opt` styling; concert overrides are scoped to `.challenge` — keep scoping discipline
