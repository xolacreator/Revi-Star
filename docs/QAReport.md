# QA Report — QA Director Findings
_2026-07-14 · build v88 · methods: headless Playwright harness (load + start +
5.5s world run + overlay renders), code-path review, edge-case analysis.
On-device iOS verification: **pending founder session** (top ask)._

## Automated results (this session)
- Load → title → "Take the Stage" → world + ambient-idol load: **0 pageerrors**.
- All overlay screens render correctly at 390×844 (title/challenge/star-check/
  shop/transform/reward screenshots reviewed).
- `node -c` clean. SW v88 and `?v=88` consistent across sw.js/index.html.

## Confirmed issues (should fix)
| ID | Severity | Finding |
|---|---|---|
| Q1 | Med | **`rumiTransform` is Rumi-hardcoded** (`RUMI is transforming!` + rumi-cheer.png). In week 2+, guide is Mira/Zoey — path currently only fires day 1–3, but the moment weekly rotation extends transforms, wrong name/art shows. Parameterize by guide. |
| Q2 | Med | **Star earn during lessons is invisible** — HUD (star counter) sits behind the challenge overlay, so +21 stars/day arrive unseen. Ties to reward-choreography fix; until then children can't connect reading→stars. |
| Q3 | Low | **Offline PWA loses fonts** — Google Fonts not in SW cache; offline launch falls back to system type (functional, off-brand). Consider self-hosting the 3 families. |
| Q4 | Low | **Legacy files precached** (9 files) — see TechnicalRoadmap T3; also means `classic.html` is reachable in production. |
| Q5 | Low | **`prefers-reduced-motion` unhonored** — CSS animations play regardless. Cheap media-query pass for accessibility. |

## Edge cases analyzed (code-path review, no repro possible headless)
- **Double-purchase race:** `spendStars` checks balance synchronously per tap — safe.
- **Shop walk interrupted by lesson trigger:** `shopPending` persists but tick
  gate requires `controlEnabled` — resumes correctly after lesson. OK, but
  marker stays visible during lesson (cosmetic; clear marker on lesson start).
- **Day rollover mid-session:** `decideDay` runs at boot only — a session
  spanning midnight keeps yesterday's day until relaunch. Acceptable; note.
- **Save from pre-shop era:** `state.shop` migration present — verified line.
- **Audio unlock:** all audio behind first user gesture (start button) — iOS-safe.
- **Trail equip when hero GLB failed to load:** applyAvatar guards — blob shows
  color instead. OK.
- **Multi-touch mash:** pointerdown handlers don't guard `e.isPrimary` —
  second simultaneous finger can issue a second walk target / prop pop.
  Low harm (no broken state), but add `if(!e.isPrimary) return` for cleanliness.

## Manual device checklist (founder's next phone session)
1. Meet Mira & Zoey south of plaza — do they idle/dance/turn? Tap-greet voices?
2. Tap ⭐ SHOP → hero walks → shop opens? Buy fireworks (needs 3⭐) → sky show?
3. Buy + equip a trail → color visibly changes while walking?
4. Balloons/bow visible after purchase AND after app relaunch?
5. Prop taps: tree/lamp/bench/crystal pop + sparkle + feel responsive?
6. FPS feel during fireworks + NPC dance simultaneously (worst case).
7. Long-press anywhere → no copy/select callout (regression check).
8. Airplane mode relaunch → game loads, plays silently-voiced? (offline check)

## Release gate status
No blocking issues for v88. Q1–Q2 scheduled; Q3–Q5 backlog. Next automated
investment: scripted full-day run (auto-answer 21 items → reward → daygate)
so lesson-flow regressions surface without device time.
