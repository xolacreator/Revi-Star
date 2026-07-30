# SESSION LOG — production passes
_One entry per pass/commit, newest first. Format: date · version · commit · pass · outcome._

## 2026-07-16 — High-fidelity build day (founder-approved, four versions shipped)
- **v92 · `d56f85b` · P2 Sound of the Harbor** — full synthesized SFX palette
  (streak-climbing star ticks, combo sting, per-family prop sounds, door
  whoosh, shop bell/fanfare/kind-deny, firework boom, lighthouse horn) +
  gentle wave/gull ambience that mutes in lessons. Zero download.
- **v91 · `c4f0273` · P3 Safety & Truth** — icons 841KB→156KB; dead 1.6MB
  title.png deleted; 9 legacy files → /legacy, SHELL ~2.0→~1.2MB; ?fps=1
  overlay (**first real number: 70 draw calls**); reduced-motion honored;
  isPrimary guards; transform parameterized to current guide (Q1 fixed);
  state.v; QS flags documented. **First-ever week-2 execution verified**
  (seeded profile + ?day=8: guide rotates, greeting fires, 0 errors — Q7
  risk closed; ?day flag already existed, was undocumented).
- **v90 · `ec0803c` · P1 Doors & Choreography** — star-iris transitions on
  every world↔screen switch; earned stars fly to a filling star-nub bar
  (rows of 7, replaces '3/21' numerals); mid-set celebration every 7th;
  tracing gets the whole stage (coach/canvas overlap fixed); marker clear.
- **v89 · `8525534` · P1a HUD fixes** — parent/music button collision +
  label wrap (Art rev.2 #1 'reads as broken').
- Status-report interlude: founder reported 'no updates' — root cause was
  correct perception: 9 doc-only commits since v88. Lesson: during review
  phases, say explicitly that nothing player-facing will change.
- Still parked for founder: Star Check play-first move (M1) — awaiting an
  explicit yes; VO batch `extra` first when ElevenLabs quota resets.

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

## 2026-07-17 — /loop cycle 1 (v94–v95)
- v94 `26f23b9` Back button (founder request): top-left glass circle in
  lessons/practice/soundwall/shop; lesson pauses at current question,
  Library resumes; Star Check stays uninterruptible. Headless-verified.
- v95 P4 Living Water & Sky: counter-rotating water shimmer layer, foam
  ring at plaza edge, slow sky-dome drift, shooting-star wishes
  (streak → landing sparkle → tap within 7s = +1⭐), Harmony Hours
  light tint (morning/day/evening sun/rim/fog/lamps/windows, applied
  after bloom). Deferred honestly: per-hour sky repaint (paintBackdrop
  palette refactor) — tint-only this pass.

## /loop cycle 2 — v96 P6 Living Town
Fireflies orbit the lighthouse after the day's lesson (and on
already-played boots); trees/planters shed petals on tap; lamps flash;
Twinkle notices a 20s stall and flies toward what's next (paused lesson
→ Library, else Gloomling, else Shop; 40s cooldown); invisible tap-target
spheres double the hit area of lamps/planters/crystals (Child C4+C5
closed). NPC time-of-day schedules deferred to a later cycle.

## /loop cycle 3 — v97 Building Identity + Telemetry
Each building now has a nameable silhouette: Library gets a gabled
open-book roof + porch lamp, Academy a bell tower with speaker horns,
Music Hall a neon marquee arch + note + bulbs, Shop a striped awning.
Camera pulled to (0,6.9,13.6) so the whole town frames from spawn.
Telemetry (Analytics rev.2): session_end (duration/items/hints/stars/
props/npc/shops/wishes, fires on daygate + tab-hide), lesson_pace every
7th item, vo_missing per absent clip — the explore blind spot is closed
and voice-coverage debt now reports itself from the field.
Harness caught a real TDZ bug pre-ship (libraryDress used lampMat
before init) — `node -c` passed, the browser probe did not. Standing
lesson #1 re-earned.

## /loop cycle 4 — v98 Curriculum Expansion + voice pipeline for it
Engine grew 9 → 13 skill types. NEW: medial vowels (What sound is in
the middle of cat?), word families (-at/-ig/-un…), digraphs (sh/ch/th/
wh), syllable counting (rab-bit = 2). Also fixed a real curriculum gap:
LETTERBANK had NO vowels — A/E/I/O/U added, which also feeds sound/
first/case/trace and grows TRBANK from 6 to 10 traceable letters.
Difficulty weights rebalanced across 13 skills.
Voice: build-lines.mjs mirrors every new bank; lines.json 382 → 540
clips and now includes the AudioBible packs (shop 10, mission+
celebrations 36 rotating, goodnight 2). Workflow dropdown reordered by
impact: extra → shop → mission → night → middle → family → digraph →
syll → …
Validated both states: voiced-only today = 21/21 valid days, 0
malformed, 5 skills (game stays fully voiced); ?allskills=1 = 13 skills
evenly distributed, 0 malformed. Harness caught two real scope bugs
pre-ship (TDZ, then an IIFE capturing the new builders) that `node -c`
passed — standing lesson #1 twice over.
