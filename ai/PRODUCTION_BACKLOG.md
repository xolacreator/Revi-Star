# Harmony Harbor — Production Backlog
_Re-prioritized 2026-07-14 after the full nine-director studio review.
Sources: docs/LearningEvolution.md · ArtDirectionRoadmap.md ·
GameplayEvolution.md · AudioBible.md · AtmosphereRoadmap.md ·
ChildDevelopmentNotes.md · TechnicalRoadmap.md · QAReport.md · AnalyticsPlan.md_

## ✅ Shipped (see ai/SESSION_LOG.md for details)
v83 design-flow rebuild · v84 companion fix · v85 environment · v86 cohesion ·
v87 world life · v88 Star Shop · **v89 HUD fixes · v90 P1 Doors & Choreography ·
v91 P3 Safety & Truth (week-2 verified, 70 draw calls measured) ·
v92 P2 Sound of the Harbor · v93 World Layout (themed buildings) · v94 Back button · v95 P4 Living Water & Sky** — P1–P4 DONE.

## 🎯 Planned passes (Lead Dev proposal — approval pending)
| Pass | Contents | Directors served | Impact | Effort |
|---|---|---|---|---|
| ~~P1 Doors & Choreography~~ | ✅ shipped v89+v90 | | | |
| ~~P2 Sound of the Harbor~~ | ✅ shipped v92 | | | |
| ~~P3 Safety & Truth~~ | ✅ shipped v91 | | | |
| ~~P4 Living Water & Sky~~ | ✅ shipped v95 (sky repaint per hour deferred — tint-only) | | | |
| **P5 Story-Wrapped Lessons** | Mission intro per day (host + location tint) · Sound Catch + Word Builder interaction shapes · mastery-adaptive picker | Learning L1-L3 · Child C3 | ★★★★★ | L · **gated on VO quota** |
| ~~P6 Living Town~~ | ✅ shipped v96 (fireflies, petals, lamp flash, Twinkle idle-helper, bigger hit areas; NPC schedules deferred) | | | |

## 🔴 High (unscheduled)
- **Voice batches the moment ElevenLabs quota resets** (founder action): blocked
  skills (blend/rhyme/case/sight) → shop lines → mission intros → celebrations
- Modularize a1.js (T1) — must land before P5/interiors
- Avatar cosmetics attach to GLB hero bones (Art 8 — transform rewards invisible on real hero)
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
