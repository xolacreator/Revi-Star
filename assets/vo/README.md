# Voice-over clips (film/TV-style AI audio)

Drop rendered voice clips here as **`<id>.mp3`** and list their ids in **`manifest.json`**.
When a line's clip is present, the game plays it instead of the device's robotic voice;
anything missing falls back automatically. No code changes needed.

## How it works
- The game fetches `manifest.json` (an array of ids) at launch and preloads those clips.
- Each authored line is keyed to an id (see `docs/voice-script.md` for the full list).
- I (Claude) regenerate `manifest.json` from whatever `.mp3`s you push — just drop the files
  and say "update the voice clips," and I'll wire them + bump the cache.

## Format
- **MP3**, mono is fine, ~**44.1 kHz**, target a few hundred KB each (trim silence).
- Name exactly by id, e.g. `rumi_greet_d1.mp3`, `praise_amazing.mp3`.

## Recommended tool
**ElevenLabs** (industry standard for character VO) — assign each character a distinct voice
and direct the emotion. See `docs/voice-script.md` for the per-line voice + delivery notes and
the exact text to render.
