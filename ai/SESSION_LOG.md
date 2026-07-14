# SESSION LOG — production passes
_One entry per pass/commit, newest first. Format: date · version · commit · pass · outcome._

## 2026-07-14 (later) — Studio Review Day (documents only, no game code)
Full nine-director review conducted and written to docs/: LearningEvolution,
ArtDirectionRoadmap, GameplayEvolution, AudioBible, AtmosphereRoadmap,
ChildDevelopmentNotes, TechnicalRoadmap, QAReport, AnalyticsPlan. `ai/agents/`
charters completed (9). Backlog fully re-prioritized into passes P1–P5;
implementation plan submitted to founder — **awaiting approval, no code
written**. QA smoke: v88 loads clean (0 pageerrors) through title → world →
all overlays. Key new findings: rumiTransform hardcodes Rumi (Q1); stars
earned in lessons are invisible behind the overlay (Q2); lesson entry/exit
hard cut is the #1 momentum break (Gameplay); shop is text-dependent for
pre-readers (Child C1).

## 2026-07-14 — Production Mode day 1 (five passes)
- **v88 · `61787b5` · Star Shop v1** — First enterable building. Star economy
  (+1/correct, +1/sparkle), shop house w/ sign + roof star, walk-to-door entry,
  concert shop UI, 6 items (fireworks, 3 trails, balloons, Twinkle bow),
  persistent purchases. _Self-score 7.5/10; interior is a styled overlay, not 3D._
- **v87 · `d861915` · World Life Pass** — Mira/Zoey ambient NPC idols (idle/
  dance/wave, watch the hero, voiced greetings); every prop tappable with
  pop+sparkle+chirp+haptic. _7/10; NPCs not yet verified on device._
- **v86 · `ada4301` · Cohesion Pass** — Star Check onto the concert stage;
  transform screens show character portrait (design 3c). _Design system now
  covers 100% of screens._
- **v85 · `8a15bc2` · Environment Pass 1** — Lighthouse landmark rebuild, town
  dressing (lamps/bunting/benches/planters/crates/trees), houses w/ lit windows,
  round motes, brighter pre-bloom sky, cinematic camera. Graphics 4→6.5.
- Also: `ai/` studio structure created; backlog moved to `ai/PRODUCTION_BACKLOG.md`.

## 2026-07-11 — v84 · `ea31c27` · Companion fix
Twinkle shrunk (scale 0.6) + moved off the camera axis after founder reported it
blocking key figures.

## 2026-07-07 — v83 · `53abd8e` · Claude Design implementation
Founder shared Claude Design prototype (flow 1b→2b→3c→4a). Rebuilt title
(Concert Stage), challenge (Concert), transform (Storybook), reward (Aurora
Glass). Root-caused earlier "looks the same" complaint: previous polish had
implemented the *unchosen* light direction (2a).

## 2026-06-27 — v79–v82 · Polish sprint + caching incident
- v79 `792e91e` UI/typography pass (Fredoka/Nunito, glass HUD, gradient buttons)
- v80 `7eb3614` on-screen feedback (sparkles, coach hop, wrong-wobble)
- v81 `4075925` animated learning transitions (staggered answer entrances)
- v82 `dd4e2ac` **stale-CSS fix**: SW served CSS cache-first so deploys never
  appeared on device → CSS now network-first + `?v=` cache-busting. Lesson:
  founder-visible verification beats version bumps.

## 2026-06-15 → 06-19 — Learning engine + voice era (v74–v78)
9 skill types, 21/day, difficulty ramp, voiced-only filter (175 clips),
quota-resilient voice pipeline, correct-answer hang fix, iOS long-press fix.

## Standing lessons
1. `node -c` is not verification — always run the Playwright harness.
2. Screenshot before claiming visual change; the founder sees only the phone.
3. Every shell-file change bumps SW + `?v=` — no exceptions.
4. New state fields ship with a migration line.
5. One pass = one commit with the self-review template.
