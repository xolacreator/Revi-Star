# Gameplay Evolution — Gameplay Director Review
_2026-07-14 · live build v88 · lens: Nintendo gameplay designer_

## Momentum map — every place the game loses energy
A Nintendo designer walks the whole session asking "what does the player *feel*
right now?" Here is the session, beat by beat:

| Beat | What happens | Momentum verdict |
|---|---|---|
| Title → tap | Concert stage, one button | ✅ strong open |
| Tutorial speech | 3 bubbles, tap-tap-tap | ⚠️ passive 20s — no touch until done |
| First walk | tap/drag steering, flowers bloom | ✅ good feel |
| Walk to Gloomling | one marker, clear goal | ✅ |
| **Lesson entry** | overlay pops instantly | ❌ **hardest cut in the game** — world vanishes, no transition, no "why" |
| 21 items | steady Q&A, sparkle+hop per correct | ⚠️ strong for 7 items, flat by 14 — no mid-set variety or escalation |
| **Lesson exit** | overlay closes, back to world | ❌ same hard cut in reverse |
| Transform/reward | storybook + aurora, confetti | ✅ good, but stars don't visibly *go* anywhere |
| Post-loop wander | free explore, tappables, shop | ✅ new since v87–88; best stretch of the game |
| Day gate | "see you tomorrow" | ⚠️ ends with a modal, not a moment |

## The five momentum breaks, with fixes
1. **Hard cuts into/out of lessons.** Fix: door-transition pattern (fade-iris +
   camera push + one guide line: "let's read!"). Same asset reused at shop,
   lighthouse, day gate. _This one fix touches 4 beats._
2. **Mid-set flatline.** Fix: every 7th correct = 3s micro-celebration
   (confetti burst + praise + combo sting); final 3 items get "last three!"
   energy (faster music layer or shimmer bg). No new mechanics — pacing only.
3. **Stars are abstract.** Earned stars should fly to the HUD counter with
   count-up ticks (reward choreography, shared ask with Art #4). The child
   must *see* wealth accumulate to want the shop.
4. **Passive tutorial.** Fix: make bubble 2 a doing-step ("drag me to the
   sparkle!") — teach steering by steering.
5. **Flat ending.** Fix: day gate becomes the lighthouse beam sweeping + cast
   waving goodnight (reuses NPCs + halo) before the modal.

## Input & camera notes
- Steering is good; add 0.15s ease-out when the finger lifts (currently stops
  abruptly at target).
- Camera: fixed offset works, but add (a) 0.5u look-ahead in drag direction,
  (b) gentle 2% zoom-in while idle near NPCs, (c) 300ms push-in at doors.
  All three are lerp-only — no new systems.
- Multi-touch: second finger currently ignored (correct for this age).

## Replayability honesty
Today's replay loop after the daily lesson: tap things, buy things. That holds
~3 minutes. The durable loop the backlog should build toward: daily surprise
(dock crate), collection shelf (shop purchases displayed somewhere visible),
and weekly cadence (new guide = new mission theme) — in that order.

## Asks
- Art: door transition + reward choreography (shared items #2, #4).
- Learning: mid-set celebration hooks inside the 21-item run.
- Audio: combo sting + star-tick + door sounds.
