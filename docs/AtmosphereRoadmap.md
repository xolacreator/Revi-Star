# Atmosphere Roadmap — Atmosphere Director Review
_2026-07-14 · live build v88 · goal: the harbor feels alive when the child does nothing_

## Current ambient census (good bones)
7 glow butterflies · 4 gliding birds · 90 round motes · 6 swaying trees ·
breathing lamps · pulsing crystals · rotating glyphs · drifting clouds ·
footstep flowers/ripples · gloom→bloom arc · lighthouse halo. Verdict: the
plaza already moves; what's missing is **change over time** — every visit looks
identical, and the bloom miracle happens once, ever.

## Design (ranked by wonder-per-effort)
### A1. Harmony Hours — time-of-day tint (S effort, huge return-visit value)
Three lighting states keyed to the device clock: **Morning** (cooler key,
mint-sky tint), **Day** (current), **Evening** (warmer key, pink-gold sky
tint, lamps brighter, windows warmer). Implementation: 3 preset color sets
lerped into existing lights/skyMat/fog — no new objects. A child playing after
dinner sees a different harbor than at breakfast: "it's nighttime in my game!"

### A2. Shooting star wishes (S) — retention magic
Every 60–120s idle in explore: a streak crosses the sky; tapping its landing
sparkle within 6s = +1 star + Twinkle spin. Ambient event + economy + delight
in one small system.

### A3. Post-lesson firefly hour (S)
After the day's lesson completes, 12 fireflies orbit the lighthouse for the
rest of the session — the world visibly remembers what the child did today.

### A4. Weather moods (M) — gentle only
Two optional states, never storms: **Petal breeze** (blossom-tree petals drift
across the plaza, 90s, 1-in-3 sessions) and **Sun shower** (soft sparkle-rain
+ rainbow arc over the water, 45s, rare). Both are particle passes reusing
existing sprite plumbing. No thunder, no darkness — this is Bluey weather.

### A5. NPC schedules (M)
Idols move between 2 anchor spots by time-of-day (morning: near bakery-house;
evening: under lamps, "concert warm-up" dance loop). Twinkle naps on a bench
at evening until tapped. Rule: never move an NPC while the child watches —
reposition during lessons/overlays so the world feels alive, not haunted.

### A6. Seasonal dressing (M, calendar-keyed)
Month-based swap of bunting colors + planter flowers + one prop (July:
sunflowers; October: pumpkins by doors; December: string-lights on trees +
snow-dust ground tint). Pure material/color swaps on existing objects.

### A7. Holiday micro-events (L, later)
One-day surprises on fixed dates: birthday-style balloon launch (New Year),
heart bunting (Feb 14). Gate: after seasonal system exists. Never gameplay-
gated — decoration + one free shop item that day.

### A8. Interactive scenery upgrades (S, continuous)
Tapped tree in petal season sheds petals · tapped lamp at evening flickers
moths · tapped water edge always ripples + splash tick. Extend the existing
tapProps table — each new prop ships with its tap response.

## Lighting transition rule
Every state change (hour tint, weather in/out, bloom) lerps over ≥4 seconds.
Nothing snaps. Children notice flicker more than adults — slow is magical,
fast is broken.

## Dependencies
Audio: crickets/gull layers per hour state (AudioBible ambience). Tech: keep
all new particles inside existing sprite pools; profile before A4 ships.
