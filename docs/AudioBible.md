# Audio Bible — Audio Director Review
_Rev. 2 · 2026-07-15 · method: code audit of all 52 audio call sites + clip
inventory diff (assets/vo vs tools/voice/lines.json)_

## 🔴 Critical finding: key story lines are SILENT in production
The `extra` VO batch (23 clips) **was never generated**, and the live game
calls these ids today (device TTS is disabled, so they play as silence with
text only — unreadable for the target age):

| Silent line | Where it fires | Severity |
|---|---|---|
| `xtra_thisone` "This one! Let's tap it together!" | Guided help after 2 misses — **the most pedagogically important line in the game** | 🔴 |
| `xtra_grew` / `xtra_lookatyou` | Avatar transform celebration | 🔴 |
| `xtra_startry` | Star Check ending praise | 🔴 |
| `tip_0..4` | Tapping Rumi in the world | 🟠 |
| `greet_g0..4` | Day 2+ welcome-back greeting | 🟠 |
| `tease_d1..3/more/wk3` | Tomorrow teases (the retention hook!) | 🟠 |
| `explore_first/new` | Day-start direction line | 🟠 |

**Action (founder, when ElevenLabs quota resets): run batch `extra` FIRST.**
23 short clips — the cheapest, highest-impact batch in the queue.

## Voice coverage (measured)
175 / 382 clips on disk = **46%**.
| Batch | Voiced | Batch | Voiced |
|---|---|---|---|
| core | 40/40 ✅ | blend | 33/88 |
| letters | 41/41 ✅ | rhyme | 0/20 |
| tut | 4/4 ✅ | case | 0/18 |
| check | 5/5 ✅ | sight | 0/34 |
| words | 52/62 | last | 0/47 |
| **extra** | **0/23 🔴** | | |

**Generation queue (re-ordered by impact-per-clip):**
1. `extra` (23 — unmutes live story beats) → 2. `words` remainder (10) →
3. `rhyme` (20, unlocks skill) → 4. `case` (18, unlocks skill) →
5. `sight` (34, unlocks skill) → 6. `blend` remainder (55) → 7. `last` (47).
Plus the NEW packs scripted below (§ Voice scripts).

## Interaction → audio matrix (all 52 call sites audited)
Has audio: correct/wrong answers (chime + voiced praise/encourage) · trace
complete · collect sparkle (collectChime) · prop tap (chirp — same sound for
every prop) · NPC greet (voiced) · shop open/buy (chime) · Twinkle cheer
(chirp) · bgm loop + ducking.
**Silent today:** shop deny · star earn (+1) · fireworks (weak: reuses
collectChime) · lesson open/close · answer-pad entrances · walking (no
footsteps) · bubble advance taps · day gate · shop equip · balloons/bow
purchase moment (generic chime only).

## Synthesized SFX palette (WebAudio — zero download, zero quota; specs)
| Cue | Design |
|---|---|
| Star earn tick | Sine blip rising through C6→E6, 60ms, +3 semitones per combo streak step (resets on miss) |
| Combo sting (every 7th) | Two-note pentatonic rise (G5→C6) + shimmer noise tail, 400ms |
| Prop taps by family | wood knock (filtered noise burst, 80Hz body) / lamp glass ting (sine 1.2kHz, fast decay) / tree leaf shake (bandpassed noise, 200ms) / crystal chime (detuned pair 880+884Hz) |
| Door whoosh | Noise sweep 400→1200Hz bandpass, 350ms, + soft bell on open |
| Shop bell | Two-tone doorbell (E5, C5), warm triangle waves |
| Purchase fanfare | 3-note arpeggio + sparkle noise, 700ms |
| Gentle deny | Single low marimba-ish thud (sine 220Hz + quick decay) — kind, not sad |
| Fireworks | Launch whistle (sine gliss 300→900Hz) + filtered-noise boom + crackle grains |
| Footsteps | Soft pat (dock) / tick-splash (water edge), max 2/s, −18dB |
| Day-gate horn | Soft lighthouse horn (triangle 130Hz, 800ms swell) |

## Ambience bed (synthesized, replaces removed drone)
Layer 1 water lap: pink-noise lowpass swell every 7–9s (randomized), −24dB.
Layer 2 gulls: pitched noise chirps, max 1 per 20s, −20dB, disabled in lessons.
Evening state (harmony hours): swap gulls → cricket ticks. Ducks with voices
via existing chain; respects 🔊 toggle.

## Music cues (design; current theme loop stays)
| Cue | Spec |
|---|---|
| Lesson layer | Same theme, low-passed + −6dB during lessons (focus), opens up on mid-set celebration for 3s |
| Celebration sting | Keyed to theme's scale, plays over (not instead of) music |
| Shop interior | Theme + bell-melody overlay (music-box feel), same tempo — no jarring switch |
| Goodnight | Final 8 bars slowed 15%, lullaby voicing under day gate |

## Voice scripts — ready for tools/voice/lines.json (NEW packs)
**Shop pack (Zoey, batch `shop`, 10 lines):** `shop_welcome` "Welcome to the
Star Shop!" · `shop_thanks1` "Ooh, great pick!" · `shop_thanks2` "Enjoy it,
superstar!" · `shop_deny` "Almost! Read a little more to earn more stars!" ·
`shop_item_fireworks` "A firework show!" · `shop_item_trail` "A sparkle
trail!" · `shop_item_balloons` "Party balloons!" · `shop_item_bow` "A bow for
Twinkle!" · `shop_bye` "Come back soon!" · `shop_equip` "Looking great!"
**Mission intros (guides, batch `mission`, 12 lines, rotating):**
`mis_letters` "The harbor signs lost their letters — help me find them!" ·
`mis_sounds` "Listen close — the sounds are hiding today!" · `mis_words`
"The Bakery's word orders are all mixed up — read them with me!" ·
`mis_rhyme` "The Music Hall needs rhymes for tonight's song!" · `mis_blend`
"Let's stretch sounds together until they make a word!" · `mis_sight` "Quick
words light the lighthouse fastest — ready?" (+6 variants).
**Mid-set celebrations (guides, batch `mission`, 6 rotating):** `cel_7`
"Seven already? You're on fire!" · `cel_14` "Halfway superstar!" · `cel_18`
"Just three to go — you've got this!" (+3 variants).
**Twinkle emotes (batch `twinkle`, 4):** wordless happy trill · giggle ·
sleepy yawn · amazed gasp (prompt ElevenLabs with non-verbal cues).
**Goodnight (narrator, batch `night`, 2):** `night_1` "The harbor is getting
sleepy… great reading today." · `night_2` "The stars will wait for you.
Goodnight, Star Hunter."

## Mix discipline (unchanged, enforced)
One voice at a time · music ducks under voice · SFX never gate voice ·
ambience mutes in lessons · everything respects 🔊/🎵 · new: SFX bus cap −12dB
so layered taps never spike.
