# Gameplay Evolution — Gameplay Director Review
_Rev. 2 · 2026-07-15 · lens: Nintendo gameplay designer · method: **measured
scripted playthrough** of build v88 (headless, instant-tap player), plus code
review. Real children are 2–4× slower per beat._

## The measured opening (Day 1, first session)
| Clock (probe) | Real-child estimate | Beat |
|---|---|---|
| 0:05 | 0:05 | Tap "Take the Stage" |
| 0:06–0:14 | ~0:35 | **4 passive tutorial bubbles** (tap-tap-tap-tap; with VO each line runs 3–5s) |
| 0:15 | ~0:40 | **STAR CHECK opens — an assessment, before the child has ever taken a step** |
| 0:15–0:27 | ~2:00 | 6 assessment questions |
| 0:29 | ~2:10 | Story bubble → hint → **first ground tap (first toy moment of the game)** |
| 0:30–0:40 | ~2:30 | Walk to Gloomling (good beat: clear goal, flowers bloom) |
| 0:42 | ~2:45 | First lesson opens (hard cut) — trace S |

**Headline finding (new, M1): the game tests before it plays.** A five-year-old
gets ~2 minutes of listening and assessment before their first moment of agency.
Nintendo's opening law is *toy first*: Mario moves within 3 seconds. Our best
material (steering, blooming footsteps, sparkles, tappable town) is all locked
behind the least fun sequence we have.

## Momentum breaks, re-ranked with evidence
1. **M1 — Assessment before play** *(new, measured)*. Recommendation: let the
   child walk and collect 2–3 sparkles first (~60–90s of pure toy), then
   Twinkle invites them to the "star game." ⚠️ **Founder decision required:**
   Star Check is the research pre-test for the three-day proof — moving it
   after ~90s of play keeps pre/post validity (still before any instruction)
   while transforming the first impression. Data timestamps already distinguish.
2. **M2 — Tutorial teaches steering while steering is disabled** *(confirmed:
   bubble 2 says "tap the ground to walk" but `controlEnabled=false` until all
   4 bubbles pass)*. Make bubble 2 a doing-step: "Drag me to the sparkle!" —
   the tutorial's middle two bubbles become gameplay.
3. **M3 — Hard cut into/out of lessons** *(watched it happen at 0:42)*. The
   door-transition pattern (fade + camera push + guide line) remains the
   single highest-leverage fix; also reused for shop/day-gate.
4. **M4 — The 21-item flatline.** Strong for ~7 items, grinds by 14. Mid-set
   celebrations every 7th + "last three!" energy + filling star-bar (numerals
   "3/21" exceed age-5 number sense).
5. **M5 — Invisible wealth.** Stars earned in lessons update a counter hidden
   behind the lesson overlay (QA Q2). Stars must visibly fly to the counter.
6. **M6 — Flat ending.** Day gate is a modal; should be the lighthouse beam +
   cast waving goodnight (assets all exist).

## Input & movement (unchanged from rev. 1, still true)
Steering is genuinely good (tap + hold-drag, forgiving). Add: 0.15s ease-out on
finger lift (abrupt stop today); camera look-ahead 0.5u in drag direction;
300ms push-in at doors; gentle idle zoom near NPCs. Multi-touch: add
`e.isPrimary` guard (QA). Note for tooling: the start button's infinite bob
defeats automated stability checks — harmless for kids, worth an
`prefers-reduced-motion` freeze (pairs with QA Q5).

## Objectives & replayability
Objective clarity is strong in the guided flow (marker + hint + voiced goal)
and weak after the daily loop: nothing points at the shop or NPCs. Twinkle
should idle-fly toward whatever is "next" after 20s of stall (Child C5).
Durable replay loop order stands: daily surprise crate → collection shelf →
weekly guide theme.

## Learning activities (gameplay lens)
The engine's adaptivity is invisible fun-wise: every item is *select one of
three*. Two new interaction shapes (Sound Catch, Word Builder — Learning L2)
matter more to session feel than any visual polish on the current shape.

## Priority order (gameplay dept.)
M1 (founder call) → M3+M5 (one pass with Art) → M2 → M4 → M6 → input micro-feel.
