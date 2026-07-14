# Audio Bible — Audio Director Review
_2026-07-14 · live build v88_

## Inventory (what exists)
- **Voice:** 175 ElevenLabs clips; cast = Rumi/Jessica, Mira/Alice, Zoey/Laura,
  child/Matilda, Twinkle/Lily, Gloomling/River, Narrator/Sarah. One-voice rule +
  music ducking in `say()`/`stopAudio()`. Voiced-only filter guards content.
- **Music:** one gapless Web Audio theme loop (bgmBase 0.09), 🎵 toggle.
- **SFX:** `chime('good')`, `collectChime()`, `chirp()` — three synthesized cues.
- **Silence:** everything else.

## Where audio is missing (every interaction, audited)
| Interaction | Today | Should be |
|---|---|---|
| Prop tap (tree/lamp/bench/crystal) | chirp (same for all) | per-family pitch/timbre variants (wood knock, glass ting, leaf shake) |
| Shop: open / buy / deny / equip | good-chime only on buy | door-bell jingle / purchase fanfare / soft "not yet" / equip swish |
| Star earn (+1) | silent | tiny ascending tick (varies with streak) |
| Fireworks purchase | chime | launch whistle + triple boom + crowd "ooh" (Twinkle) |
| Walk on dock vs water edge | silent | soft footfall pat / splash tick (throttled) |
| Door/lesson entry | silent | whoosh + guide line |
| Answer entrance (pads pop in) | silent | 3 quick soft pops (staggered w/ CSS delays) |
| Mid-set celebration (planned) | — | combo sting (2 notes up) |
| Twinkle proximity | silent | occasional happy trill (already has `chirp` — reuse, randomize pitch) |
| Day gate | silent | lighthouse horn (soft, warm) + night crickets fade-in |

**Rule: all of the above are WebAudio-synthesized (zero download, zero quota).**

## Ambience plan (replacing the removed drone)
Two-layer bed, both synthesized: (1) filtered noise "water lap" swelling every
7–9s, (2) sparse gull cries (pitched noise chirps) max 1/20s, silenced during
lessons. Bus at −24dB under music; hard-ducked with voices via existing chain.

## Voice lines needed (next ElevenLabs batches, in priority order)
1. **Blocked skill types** (already scripted in `tools/voice/lines.json`):
   blend, rhyme, case, sight batches — unblocks 4 skill types. ~90 lines.
2. **Mission intros** (Learning L1): 12 lines — e.g. Rumi: "The Bakery signs
   are mixed up — read them with me!" (one per host/location/skill family).
3. **Mid-set celebrations:** 6 short lines ("Halfway superstar!", "Three to
   go — you've got this!") rotating across guides.
4. **Shop voice** (child-development ask): Zoey welcome ("Welcome to the Star
   Shop!"), per-item name lines ×6, gentle deny ("Almost! Read more to earn
   stars!"), thank-you ×2. ~10 lines.
5. **Twinkle emotes:** 4 wordless trills/giggles (cheap insurance against
   repetition).

## Mix discipline (unchanged, enforced)
One voice at a time · music ducks −60% under voice · SFX never gate voice ·
ambience mutes in lessons · everything respects the 🔊/🎵 toggles.
