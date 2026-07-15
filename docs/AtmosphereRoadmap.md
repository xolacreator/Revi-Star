# Atmosphere Roadmap — Atmosphere Director Specification
_Rev. 2 · 2026-07-15 · implementation-ready: every value below maps to real
uniforms/materials in a1.js. Goal: the harbor feels alive when the child does
nothing — and different every time they return._

## Ground rules
1. **Nothing snaps.** Every state change lerps ≥ 4s (bloom-style pattern,
   `dt`-driven). Children read flicker as "broken."
2. **The gloom→bloom story owns pre-bloom.** All systems below modulate the
   *bloomed* world only; pre-bloom is its own art state (see ArtDirection #5
   "moonlit-gorgeous").
3. **Budgets:** ≤ 40 extra concurrent sprites from atmosphere systems, all
   pooled; zero new textures > 64px; zero new draw-call-per-frame allocations.
4. **Never move an NPC while the child watches.** Reposition during overlays.

## 1. Time of day — "Harmony Hours" (3 states, device clock)
Current rig (measured): hemi `#eaf2ff/#b6a9d8` 0.45→0.80 · sun `#fff0d0` 1.0 ·
fill `#5a8cff` 0.38 · rim `#b06aff` 0.7 · fog `#b9b3c6→#cdefff` (22,60) ·
sky tint `#9d97b6→#ffffff` · water `→#3fc8d2` · dock `→#ffe3b0`.

| Param | 🌅 Morning 5–11 | ☀️ Day 11–17 | 🌆 Evening 17–5 |
|---|---|---|---|
| sun color/int | `#ffe9c9` / 1.05 | `#fff0d0` / 1.0 (current) | `#ffc98f` / 0.9 |
| hemi int | 0.85 | 0.80 | 0.70 |
| rim | `#8fb7ff` / 0.55 | `#b06aff` / 0.7 | `#c77dff` / 0.9 |
| fog color | `#dff2ff` | `#cdefff` | `#c3aede` |
| water lerp target | `#57d0d8` | `#3fc8d2` | `#3aa8c9` |
| lamp base emissive | 0.55 | 0.85 | 1.15 + halo scale ×1.2 |
| window emissive | 0.35 | 0.55 | 0.9 |
| extras | gull layer on | — | fireflies allowed, cricket layer |

**Sky:** the dome is a *painted* canvas — tint alone can't make morning.
Refactor `paintBackdrop()` to take a palette `{top,mid,glow,horizon}`:
Morning `{#2a3f6e,#5f7fc2,#ffd9a0,#ffeecf}` · Day (current values) ·
Evening `{#151040,#46247f,#e85a8a,#ffb37a}`. Re-render once per state change
(~5ms), crossfade via a second sky sphere at opacity-lerp for the 6s
transition, then discard. Check state every 60s; also on `visibilitychange`.

## 2. Weather (gentle only — Bluey weather, never storms)
| State | Visual | Trigger | Duration | Budget |
|---|---|---|---|---|
| 🌸 Petal breeze | 14 petal sprites (blossom-tree pink) drifting diagonally + all trees sway ×1.6 | 1-in-3 sessions, explore only | 90s, 6s in/out | 14 sprites |
| 🌦 Sun shower | 22 falling sparkle-drops + rainbow arc (transparent ring segment over water) + ripple rate ×2 | 1-in-6 sessions | 45s | 23 sprites |
| ✨ Stardust drift | ambient mote count ×1.5, size ×1.3 | evenings, 1-in-4 | 120s | pooled |
Rules: never during lessons; never on a child's first-ever session (day 1 =
clean read of the world); weather + fireworks may overlap (it's delightful).

## 3. Ambient life (extends the living census)
Existing: 7 butterflies · 4 birds · 90 motes · footstep flowers · swaying
trees · breathing lamps · pulsing crystals · rotating glyphs.
Add, in order: **(a) shooting-star wishes** — every 60–120s idle in explore, a
streak crosses the sky ending in a landing sparkle; tap within 6s → +1⭐ +
Twinkle spin (economy tie-in). **(b) post-lesson fireflies** — 12 fireflies
orbit the lighthouse for the rest of the session after the day's lesson (the
world remembers). **(c) dock cat** (later, needs art) — sleeps on a crate,
ear-flicks when tapped. **(d) butterfly landings** — one butterfly may settle
on a planter for 5s, flutters off if the hero nears.

## 4. NPC schedules (time-keyed anchors, 2 per idol)
| NPC | Morning | Day | Evening |
|---|---|---|---|
| Mira | near bakery-house, "reading a note" idle | her house | under NE lamp, dance warm-up loop |
| Zoey | dock edge, watching water | her house | under NW lamp, dance warm-up loop |
| Twinkle | follows hero (unchanged) | follows | 20% chance: naps on bench until tapped |
| Gloomling (post-rescue cameo, later) | — | shy behind lighthouse rocks | peeks out |
Movement rule #4 applies: swap anchors only while an overlay is up.
Evening "concert warm-up" = both idols dance-loop facing the plaza star — a
nightly show the child can stumble into.

## 5. Seasonal changes (month-keyed material/prop swaps, zero new systems)
| Months | Bunting cols | Planters | One prop swap |
|---|---|---|---|
| Mar–May | pastel pinks/mints | tulip colors | blossom tree ×2 (swap one green) |
| Jun–Aug | current festival brights | sunflower gold | beach ball by the dock crates |
| Sep–Nov | amber/rust/gold | marigold | pumpkins by house doors |
| Dec–Feb | ice blue/white/gold | holly red/green | string-lights on trees + snow-dust dock tint `#f4ede4` |
Implementation: one `SEASON` lookup at boot feeding existing color arrays.

## 6. Holiday micro-events (date-keyed, decoration + one gift — never gated play)
| Date | Event |
|---|---|
| Jan 1 | Midnight-sky palette all day + free Firework Show in shop (price 0) |
| Feb 14 | Heart-shaped bunting pennants + pink lamp glow |
| Child's birthday (parent sets in dashboard, optional) | Balloons free + cast sings-greets (VO: `bday_1..3`) + confetti on launch |
| Oct 31 | Pumpkin lamps, bats replace 2 birds (same flap system) |
| Dec 24–26 | Gift crates under trees (tap = sparkle + 1⭐, 3/day) |
Ship order: birthday first (highest emotional value), then Jan 1, then rest.

## 7. Lighting transitions (unified system)
One `mood(target, seconds)` helper lerping {hemi, sun, fill, rim, fog, sky
tint, water, dock, lamp/window emissive} — replaces the inline bloom lerp and
serves: bloom (existing) · harmony hours · weather dimming (sun shower −10%
sun) · lesson spotlight (existing cine) · goodnight (day gate: −30% all +
lamp ×1.3, 8s). All future lighting goes through this one function.

## 8. Interactive scenery (extends tapProps — each with its AudioBible voice)
| Prop | Tap response (existing pop+sparkle plus…) | Sound |
|---|---|---|
| Tree | 3 leaf/petal sprites fall (petal-colored in spring) | leaf shake |
| Lamp | halo flash-brightens 1s; evening: 2 moths circle 4s | glass ting |
| Crystal | pulse ×2 + one magic ring | detuned chime |
| Bench | Twinkle hops onto it for 3s (if following) | wood knock |
| Planter | flowers bounce stagger + 1 butterfly spawns | soft pop |
| Crate | rattles; 1-in-10: a sparkle pops out (+1⭐, max 3/day) | wood knock |
| Water edge | big ripple + splash tick | splash |
| Lighthouse door (pre-interior) | knock-knock + light flickers | knock |

## Implementation order (feeds the pass plan)
P4 gets: §1 harmony hours + §3a shooting stars (+ water/sky from Art).
Post-P4 pass "Living Town": §4 schedules + §3b fireflies + §8 upgrades.
Seasonal (§5) rides any pass after; holidays (§6) after seasonal. Weather (§2)
last — it's the only system needing new pooled sprites + device profiling first.
