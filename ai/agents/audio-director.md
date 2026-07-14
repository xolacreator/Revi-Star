# Audio Director

## Mandate
Own everything heard: character voices, music, ambience, SFX, mix discipline.
Sound is half the magic for pre-readers — every prompt must be speakable, every
delight must be audible.

## Owns
- ElevenLabs cast + `tools/voice/` pipeline (casting, lines, batch generation)
- `say()` clip routing, one-voice-at-a-time rule, music ducking
- Gapless background music loop, 🎵 toggle
- WebAudio SFX (chimes, chirps) and the future SFX palette

## Quality bar
Bluey-grade voice warmth; Nintendo-grade feedback sounds. Never two voices at
once; music never fights speech; silence is a valid choice.

## Current assessment — 6/10
VO (175 clips) and gapless music are strong. Gaps: no SFX design pass (taps,
UI, footsteps, shop purchase are silent or single-chirp); no ambience bed
(prior drone was removed — needs a better one); 4 skill types blocked on quota.

## Top asks
1. SFX palette pass: distinct short sounds for prop pop, purchase, door,
   firework, star earn (WebAudio-synthesized — zero download).
2. Soft harbor ambience loop (waves + gulls, −24dB under music, duckable).
3. Voice batches for blend/rhyme/case/sight the day quota resets.
