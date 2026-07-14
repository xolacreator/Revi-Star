# Learning Evolution — Learning Director Review
_2026-07-14 · reviews live build v88 against `docs/learning-design.md` (the curriculum bible)_

## 1. Where the live game stands
The engine is the strongest system in the build: 9 phonics skill types
(trace/sound/first/last/word/rhyme/case/sight/blend), 21 items/day with a
16-day difficulty ramp, distinct-distractor generation, adaptive support
(2 misses → fewer options → glow-model → guided tap), full voice coverage via
the voiced-only filter, and honest measurement (hints, modeling, first-try, ms).

**Score: engine 8/10 · experience 5.5/10.** The bible demands "magical
missions, never worksheets." Today's presentation — picture, prompt, three
pads — is a beautiful worksheet. The concert restyle (v83) dressed the room;
it didn't change what happens in it.

## 2. Weaknesses (ranked)
1. **No story context.** Items arrive as abstract questions. The bible's
   contract: every activity is *helping someone*. Cast + buildings now exist
   in-world (v85–v88) but lessons never use them.
2. **One interaction shape.** 7 of 9 skills are choose-one-of-three. Only
   trace and blend feel mechanically different.
3. **Curriculum is phonics-only.** The bible spans 8 subjects (math, patterns,
   logic, memory…); live game covers reading/phonics band only.
4. **No spiral review.** Mastered skills never resurface deliberately; the
   ramp only moves forward.
5. **No mastery model.** `state.history` records everything, but nothing
   consumes it — a struggling skill isn't served more, a mastered one less.
6. **4 skill types quota-blocked.** blend/rhyme/case/sight variety waits on
   ElevenLabs reset (voiced-only filter correctly parks them).

## 3. Research notes (what the best do)
- **Khan Kids:** every activity hosted by a character with a reason ("Kodi
  needs 3 red apples") — context costs one sentence + one art reuse.
- **Teach Your Monster to Read:** phoneme play is *physical* — sounds are
  objects you drag, catch, pop. Mechanical variety per skill, not per theme.
- **Duolingo ABC:** micro-celebrations every 3–4 items (not only at set end)
  hold attention across a 21-item run.
- **PBS Kids:** mastery pacing invisible to the child; visible to the parent.

## 4. Curriculum expansion (implementation-ready)
### Phase L1 — Story-wrapped lessons (no new engine work)
Each day opens with a one-line voiced mission from the day's guide:
"The Bakery's signs are all mixed up — read them with me!" Item prompts are
unchanged; `ch-pic` band gains a small host portrait + location tint. Every
7 items → 3-second mid-set celebration (existing confetti + praise clip).
_Needs: ~12 mission VO lines (one per location/skill family)._

### Phase L2 — Two new interaction shapes (highest variety-per-effort)
- **Sound Catch (first/last/sound):** letters drift like bubbles; tap the one
  that says /m/. Same data, new feel. Reuses sparkle/burst systems.
- **Word Builder (blend/word):** letter tiles drag into slots, word "bakes"
  (Bakery tie-in). Reuses trace canvas touch plumbing.

### Phase L3 — Mastery-adaptive picker
Per-skill rolling accuracy from `state.history` (last 10 items): <60% → +1
weight & easier variants; >90% → −1 weight, resurface every 3rd day (spiral).
~30 lines in `genActivities()`; fully measurable.

### Phase L4 — Second subject: Math Discover band
Count-to-10 and compare, as "Observatory star counting" (tap N stars into the
sky). Reuses choose/one-shape + new count-tap shape. Gate: after phonics
phases ship and VO quota resets.

## 5. Asks of other departments
- **Audio:** 12 mission lines + 6 mid-set celebration lines next VO batch.
- **Art:** location tint per lesson host (bakery warm, observatory indigo).
- **Gameplay:** door-transition so lessons can *start at a building*.
- **Analytics:** per-skill mastery rollup (feeds L3 + parent dashboard).
