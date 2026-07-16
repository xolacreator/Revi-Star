# Child Development Notes — Specialist Review
_Rev. 2 · 2026-07-15 · lens: an average five-year-old alone with the phone ·
evidence: measured Day-1 playthrough (GameplayEvolution rev.2), VO coverage
audit (AudioBible rev.2), UI text + touch-target census_

## What already respects the child (keep protecting)
One-finger everything · every learning prompt voiced · no-fail hint ladder
(hint → model → guided success) · gentle wrong-answer wobble + encouragement ·
big answer pads (≥48px targets) · trace canvas large and forgiving · parent
content gated · no timers anywhere · one clear action per guided beat.

## Findings (ranked; C1–C7 carried, C8–C10 new with evidence)
### C8 🔴 NEW — Silent bubbles the child cannot read
The VO audit proved `greet_*` (Day-2+ welcome), `tease_*` (tomorrow hooks),
`explore_*` (day-start direction), `tip_*` (Rumi tips) and `xtra_thisone`
(**the guided-help line for a struggling child**) have no clips. Result: a
pre-reader gets a speech bubble of unreadable text and taps blindly. This is
the single largest age-appropriateness defect in the build. Fix = generate
the `extra` batch (23 clips) first; until then these beats fail their only
audience.

### C9 🔴 NEW — Two minutes of compliance before the first choice
The measured opening: 4 passive bubbles → assessment → first agency at ~2
minutes (real-child pace). Attention research and our own bible (10–15 min
budget) say the opening should spend that budget on *play*. Endorse Gameplay
M1 (play-first, Star Check after ~90s) and M2 (teach steering by steering).

### C10 🟠 NEW — The counting ceiling
"⭐ 3 / 21" requires reading a two-digit numeral and holding a 21-quantity
concept — beyond typical age-5 subitizing/number sense. A filling bar of star
nubs (7 per row, mirroring the celebration cadence) communicates "how much
left" pre-numerically. Same fix improves the shop: prices shown as a row of
star icons up to 5, icon+numeral above that.

### C1 The shop assumes reading (carried, sharpened)
"Wear", "Yours ✓", deny tip, item names — all text. Fix order: (1) voiced
shop pack (scripted in AudioBible §Voice scripts), (2) state via icon+color
(✓ badge, bounce on equipped), (3) star-icon prices (see C10).
### C2 Lesson entry/exit disorientation — carried; fix = door transition.
### C3 21-item attention curve — carried; mid-set celebrations + C10 bar.
### C4 Small/far tap targets (crystals, lamps) — carried; invisible expanded
hit spheres, nothing tappable under ~12mm equivalent.
### C5 Idle stall help — carried; Twinkle flies toward the objective at 20s.
### C6 Session off-ramp — carried; "sleepy harbor" state after day gate.
### C7 Left-handed trace occlusion — carried; guide letter above finger line.

## Touch-target census (CSS-measured, 390px viewport)
| Element | Size | Verdict |
|---|---|---|
| Answer pads `.opt` | ≥92×~52px | ✅ |
| Big buttons | ~56px tall | ✅ |
| Hear/music/parent round buttons | 46–52px | ✅ |
| Parent-gate pad | 72px | ✅ |
| `.pill` (Hear it/Hint) | ~36px tall | ⚠️ grow to 44px |
| Shop `si-buy` | ~36px tall | ⚠️ grow to 44px |
| 3D props at plaza edge | <8mm equiv. | ❌ C4 |

## Cognitive-load notes
Tutorial lines run 10–14 words — fine *when voiced*; the same length unvoiced
is a wall (C8). Shop shows 6 items at once — acceptable because rows are
visually distinct; do not exceed 6 without categories. Never stack two
animated attention-grabbers (glow hint + Twinkle flyby must not co-occur —
add a "one spotlight at a time" rule to the idle-helper design.

## The one-sentence test (unchanged)
"Could a five-year-old who cannot read use this alone, and would they smile?"
Both halves must pass or it doesn't ship for children.
