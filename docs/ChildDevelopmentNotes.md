# Child Development Notes — Specialist Review
_2026-07-14 · live build v88 · lens: an average five-year-old, alone with the phone_

## What already respects the child (keep protecting)
One-finger everything · every learning prompt voiced · no fail states (hint →
model → guided success) · wrong answers get a gentle wobble + encouragement ·
big type, big pads · parent content behind a gate · no timers anywhere.

## Findings (ranked by how much they'd confuse or exclude)
### C1. The shop assumes reading and number sense — highest concern
"Wear", "Yours ✓", "8 ⭐", and the deny tip are all text. A pre-reader taps,
gets a wobble, and doesn't know why.
**Fix:** voice the shop (welcome, item names on tap, warm deny line), price as
star-icons-with-numeral, owned = big ✓ + item glows, equipped = item bounces.
_Depends on AudioBible batch #4._

### C2. Lesson entry/exit is disorienting
The world vanishes mid-step with no cause. Five-year-olds track *place*
strongly; hard cuts read as "something broke."
**Fix:** the door-transition + one guide line (shared with Gameplay #1).

### C3. 21 items outruns the attention curve
Items 15–21 rely on grit. The engine is right (practice volume matters); the
*pacing* needs scaffolding.
**Fix:** mid-set celebrations every 7 (shared with Gameplay #2) + visible
progress that fills (the ⭐ 3/21 counter is numeric — make it a filling bar of
star nubs; counting to 21 is beyond many 5-year-olds, a filling bar is not).

### C4. Small/far tap targets
Crystals and lamps at plaza edge subtend <8mm at typical hold distance.
**Fix:** expand raycast hit area (invisible larger sphere per prop), not
visual size. Rule: nothing tappable under ~12mm equivalent.

### C5. Idle help gap
A child who stalls in explore gets one static hint line. After 20s of no
input, Twinkle should fly a small loop toward the current objective (guide
by companion, not text).

### C6. Session off-ramp
The day loop ends but the game doesn't help the child *stop*. After daygate,
a soft "the harbor is sleepy now" state (dimmer, slower music, Twinkle yawns)
supports the parent's "time to stop" conversation instead of fighting it.

### C7. Motor note — trace canvas
Trace tolerance is fair, but left-handed children occlude the guide letter
with their hand. **Fix:** optional mirror layout, or draw the guide letter
higher above the finger line. Low frequency, real accessibility.

## Non-findings (checked, fine)
Drag steering (gross motor, forgiving) · answer pad spacing · praise variety ·
volume levels · parent-gate difficulty (numbers spoken aloud would defeat it —
correctly NOT voiced).

## The one-sentence test for every future feature
"Could a five-year-old who cannot read use this alone, and would they smile?"
If either half fails, it doesn't ship for children.
