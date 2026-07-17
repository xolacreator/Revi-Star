# QA Report — QA Director Findings
_Rev. 2 · 2026-07-15 · build v88 · methods: load/overlay harness, measured
Day-1 playthrough, 6.5-minute idle soak, scripted full-day run v1, parent-gate
+ sim-tool exercise, code-path review. On-device iOS: **still pending founder
session** (top ask, unchanged)._

## Automated results (all runs, this cycle)
- Boot → title → world (+ambient idols): **0 pageerrors** (repeated ×5 runs).
- Tutorial → Star Check → walk → first lesson: flow completes; timings in
  GameplayEvolution rev.2.
- **6.5-minute idle soak in the live world: 0 errors**, animations stable, no
  visible leak symptoms (headless).
- Parent gate accepts 4·2·7 via scripted taps; dashboard opens (event logged).
- All overlay screens render at 390×844 (screenshot set current).

## New findings
| ID | Severity | Finding |
|---|---|---|
| **Q7** | **High (testability)** | **Week-2+ content is unreachable for testing.** "Simulate next day" (`pc-sim`) only clears today's completion gate + reloads — day advances solely by completing days. Nobody (founder or QA) can see Mira-as-guide, week greetings (`greet_*`), or rotation transforms without playing 7 real days. Guide-rotation paths have NEVER executed. Fix: `?day=N` debug flag (parent-gated or QS-only), fold into P3. |
| Q8 | Med (tooling) | Parent tool label vs behavior: "Simulate next day" actually means "unlock today again" — fine for parents, but testing docs must say so. Also `location.reload()` inside it invalidates any scripted multi-click. |
| Q9 | Low | `hero_model_loaded` logs junk node names ("RootNode") — harmless, noisy analytics. |
| Q10 | Info | Full-day scripted run v1 built (`probe-fullday.mjs`): auto-answers star check, options via glow-fallback clicking, trace via scribble sweeps, reward/daygate detection. v1 defect found in its own run (missing ground-tap step blocked lesson entry); fix staged for next cycle. The 6.5-min soak above is its byproduct. |

## Carried findings (rev. 1, all still open)
Q1 Med — `rumiTransform` hardcoded to Rumi (breaks week 2+; now *provably*
untested per Q7) · Q2 Med — stars earned in lessons invisible (HUD behind
overlay) · Q3 Low — offline loses Google Fonts (self-host; see Tech) ·
Q4 Low — legacy files precached + reachable (`classic.html` etc.; Tech T3) ·
Q5 Low — `prefers-reduced-motion` unhonored · isPrimary multi-touch guard ·
marker persists if lesson interrupts shop-walk · midnight-spanning session
keeps yesterday's day until relaunch (accepted).

## Edge cases re-verified in code this cycle
- `pc-sim` reload path: state saved before reload — no corruption risk ✅.
- Star Check answers register regardless of correctness (assessment) ✅.
- Double-tap purchase race: still safe (synchronous balance check) ✅.

## Manual device checklist (founder — unchanged, still pending)
1. Mira & Zoey south of plaza: idle/dance/turn/tap-greet voices.
2. ⭐ SHOP: walk-to-door entry, fireworks purchase, trail equip visible.
3. Balloons/bow persist after relaunch.
4. Prop taps feel responsive; no copy/select long-press callout.
5. FPS feel during fireworks + NPC dance (worst case) — with `?fps=1` once P3 ships.
6. Airplane-mode relaunch (offline shell).

## Release gate status
No new blockers for v88. Q7 changes risk math: **week-2 code is untested and
unreachable — treat all rotation-dependent features as unverified until
`?day=N` exists.** Next automated investment: probe-fullday v2 (ground-tap
step + sim-reload handling), then wire it as the standing regression run.
