# Harmony Harbor — Production Backlog
_Re-prioritized 2026-07-14 after the full nine-director studio review.
Sources: docs/LearningEvolution.md · ArtDirectionRoadmap.md ·
GameplayEvolution.md · AudioBible.md · AtmosphereRoadmap.md ·
ChildDevelopmentNotes.md · TechnicalRoadmap.md · QAReport.md · AnalyticsPlan.md_

## ✅ Shipped (see ai/SESSION_LOG.md for details)
v83 design-flow rebuild · v84 companion fix · v85 environment · v86 cohesion ·
v87 world life (NPCs + tappables) · v88 Star Shop + economy.

## 🎯 Planned passes (Lead Dev proposal — approval pending)
| Pass | Contents | Directors served | Impact | Effort |
|---|---|---|---|---|
| **P1 Doors & Choreography** | Door-transition into/out of lessons+shop · earned stars fly to the counter with ticks · star-bar progress (replaces "3/21" numerals) · mid-set celebration every 7th item · clear marker on lesson start | Gameplay 1-3 · Child C2/C3 · QA Q2 · Art 2/4 | ★★★★★ | M |
| **P2 Sound of the Harbor** | WebAudio SFX palette (prop families, shop bell/fanfare/deny, star ticks, door whoosh, combo sting) · soft water/gull ambience bed | Audio synth items · Child C1-partial | ★★★★ | M |
| **P3 Safety & Truth** | SW SHELL legacy trim (T3) · ?fps=1 overlay (T2) · prefers-reduced-motion (Q5) · isPrimary guard · parameterize transform guide (Q1) · state schema version (T6) | Tech T2/T3/T6 · QA Q1/Q5 | ★★★ | S |
| **P4 Living Water & Sky** | 2-layer water shimmer + foam ring · sky star-drift + shooting-star wishes (tap = +1⭐) · harmony-hours 3-state time tint | Art 1/7 · Atmosphere A1/A2 | ★★★★ | M |
| **P5 Story-Wrapped Lessons** | Mission intro per day (host + location tint) · Sound Catch + Word Builder interaction shapes · mastery-adaptive picker | Learning L1-L3 · Child C3 | ★★★★★ | L · **gated on VO quota** |

## 🔴 High (unscheduled)
- **Voice batches the moment ElevenLabs quota resets** (founder action): blocked
  skills (blend/rhyme/case/sight) → shop lines → mission intros → celebrations
- Modularize a1.js (T1) — must land before P5/interiors
- Avatar cosmetics attach to GLB hero bones (Art 8 — transform rewards invisible on real hero)
- Idle helper: Twinkle flies toward objective after 20s stall (Child C5)
- Bigger raycast hit-areas for small props (Child C4)
- Scripted full-day headless QA run (QA top ask)

## 🟡 Medium
- Shop interior art round 2: shelves + Zoey shopkeeper (Art 5)
- Challenge stage-set dressing (Art 3) · collection shelf for purchases
- Prop silhouettes round 2 (Art 6) · butterfly wings (Art 11) · touch glyph (Art 10)
- Daily surprise crate at dock · day-gate lighthouse goodnight moment
- NPC schedules (A5) · post-lesson fireflies (A3) · petal-breeze weather (A4)
- Analytics events: session_end · lesson_pace · skill_mastery · funnel · shop_deny
- Parent dashboard: per-skill chips + weekly summary + restyle (Art 15)
- Left-handed trace layout (Child C7) · session off-ramp (C6) · offline fonts (Q3)

## 🟢 Long-term
- Library as second interior (story time) → Music Hall → Bakery → Academy → Observatory → Twinkle Forest
- Math Discover band (Learning L4) · spiral review across weeks
- Seasonal dressing (A6) → holiday micro-events (A7)
- True 3D interiors · texture atlas/LOD pass · gloomling redesign (Art 13) · HUD custom icons (Art 12)

## ⚠️ Debt ledger (TechnicalRoadmap)
T1 modularize (L) · T2 fps overlay (S→P3) · T3 SHELL trim (S→P3) ·
T6 schema version (S→P3) · T5 document QS flags (S) · full-day QA script (M) ·
hardcoded prop positions (accepted until plaza layout changes)
