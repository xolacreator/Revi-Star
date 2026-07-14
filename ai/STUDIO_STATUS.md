# STUDIO STATUS — Harmony Harbor (Reventure)
_Last updated: 2026-07-14 · Live build: **v88** · Branch: `claude/laughing-volta-zjpVH`_
_Live URL: https://xolacreator.github.io/revi-star/ (GitHub Pages, auto-deploy on push)_

## What the product is right now
A web/PWA prototype (Three.js r184, vanilla JS, no build step) of a K-pop
magical-idol reading adventure for ages 5–7. One ~1,300-line module (`a1.js`)
drives a 3D harbor world + 2D overlay screens. Fully voiced with 175 ElevenLabs
clips (voiced-only content filter keeps unvoiced questions parked). 21
questions/day across 9 phonics skill types with difficulty progression.

## Systems shipped
| System | State |
|---|---|
| Visual identity | Claude Design flow 1b→2b→3c→4a: Concert title/challenge/star-check, Storybook transform, Aurora reward (v83–v86) |
| 3D world | Lighthouse landmark, dressed plaza (lamps/bunting/benches/planters/crates), 6 swaying trees, houses w/ lit windows, neon skyline, ambient life (butterflies, birds, motes, footstep flowers) (v85) |
| Cast presence | Rigged GLB hero + weekly guide + ambient idols (Mira/Zoey) with idle/dance/wave + voiced tap-greetings (v87) |
| Delight layer | All props tappable (pop+sparkle+chirp+haptic); sparkle burst + coach hop on correct answers (v80, v87) |
| Economy | Stars: +1/correct answer, +1/world sparkle. **Star Shop** (first enterable building): fireworks, 3 equip trails, plaza balloons, Twinkle's bow; purchases persist (v88) |
| Learning engine | 9 skill types, 21/day, difficulty ramp, voiced-only filter, adaptive hints/modeling, finger tracing |
| Voice pipeline | ElevenLabs premade cast; GitHub Action batch generation; quota-resilient partial commits |
| PWA | Service worker v88, network-first HTML/JS/CSS + `?v=` cache-busting (stale-CSS incident fixed) |

## Quality scores (honest, /10)
| Discipline | Score | One-line reason |
|---|---|---|
| Graphics — UI | 7.5 | Cohesive design system on every screen; missing bespoke icon art |
| Graphics — world | 6.5 | Real landmark + dressing; water flat, no interiors, primitive-built props |
| Gameplay | 6.5 | Tap/drag explore + taps everywhere + shop loop; camera static, no quests beyond daily |
| Learning | 7 | Strong engine + voice; presentation still Q&A-shaped, needs story context |
| Audio | 6 | Great VO + gapless music; no SFX design pass, no ambience |
| Performance | 7 (est.) | Low-poly + merged bunting; ~140 draw calls; **not profiled on real device** |
| UX (age 5–7) | 7 | One-finger everything, voiced prompts; shop deny-state is text (readers only) |
| Code quality | 5 | Single 1,300-line module; legacy prototype files still shipped |

## Known risks
1. **No on-device profiling** — perf scores are estimates; iOS Safari is the target.
2. **Monolith `a1.js`** — merge/edit risk grows with every pass.
3. **June ElevenLabs quota exhausted** — new skill-type content stays parked until
   quota resets or plan upgraded; game remains fully voiced meanwhile.
4. **Untested-on-device NPC/shop flows** — headless-verified only; founder phone
   check pending.
5. **Save-shape drift** — `state.shop` added v88 with migration; future fields
   need the same discipline.

## Studio documents (2026-07-14 review)
Nine director reports in `docs/`: LearningEvolution · ArtDirectionRoadmap ·
GameplayEvolution · AudioBible · AtmosphereRoadmap · ChildDevelopmentNotes ·
TechnicalRoadmap · QAReport · AnalyticsPlan. Charters in `ai/agents/`.
Pass plan P1–P5 in `ai/PRODUCTION_BACKLOG.md` — awaiting founder approval.

## Founder workflow
Non-technical founder: plays builds on phone, pushes art via GitHub Desktop,
runs GitHub Actions (voice batches). All code/conversions happen in AI sessions.
Parent-gate passcode: 4-2-7. Hero name "Revi Star" (voiced "REH-vee").
