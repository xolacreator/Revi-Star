# Voice / Narration Options — making the audio more human

Today the game uses the **device's built-in Web Speech voice** (free, offline, zero setup) — I just tuned it to prefer *enhanced/natural* voices and softened the pitch so it sounds warmer and less robotic. That's the interim. Below are the real upgrade paths, cheapest → best, with **where to hear samples**.

> **Recommendation:** our narration lines are a *finite script* (a few dozen lines). The best bang-for-buck is to **pre-render each line to a small audio file** with a neural voice, ship them in `assets/vo/`, and play those — falling back to the device voice if a clip is missing. Pick one warm "narrator/Rumi" voice + one "child/Twinkle" voice. I can wire the player and hand you a line-by-line script to batch-render once you choose.

## Quick win (already applied, $0)
On iPhone/iPad, **Settings → Accessibility → Spoken Content → Voices → English → download "Ava (Enhanced)" or "Samantha (Enhanced)."** The game now auto-prefers these — a big quality jump with no code/cost. Android: install **Google** or **Samsung** TTS "natural" voice packs.

## Neural TTS services (pre-render the script — recommended)

| Service | Best kid/warm voices | Hear samples | Notes |
|---|---|---|---|
| **Microsoft Azure Neural TTS** | `en-US-AnaNeural` (**a real child's voice** — perfect for Twinkle/the avatar), `en-US-JennyNeural` (warm friendly woman → Rumi/narrator), `en-US-AriaNeural` | speech.microsoft.com/portal → "Voice Gallery" (live, free to try) | Generous free tier; very natural; **Ana being an actual child voice is rare and ideal for us** |
| **Amazon Polly** | `Ivy` (child), `Joanna`/`Kendra` (neural, warm) | AWS Console → Polly → "Try Polly" | Cheap; reliable; easy batch export to MP3 |
| **ElevenLabs** | huge library of warm/young voices; can design a custom kid voice | elevenlabs.io → "Voice Library" playground | **Most natural of all.** Paid. Can clone a real voice (a hired VO, or a parent) |
| **OpenAI TTS** | `nova` (warm female), `shimmer`, `fable` | platform.openai.com → text-to-speech docs/playground | Dead-simple API; great for batch-rendering our script |
| **Google Cloud TTS** | `en-US-Neural2-F`, WaveNet voices | cloud.google.com/text-to-speech → live demo on the page | Solid, well-priced |
| **PlayHT** | many ultra-real voices | play.ht (in-browser samples) | Good middle ground |

## The gold standard (later): a real voice actor
For launch, a **recorded child/young-adult VO** beats any TTS for warmth and character. ElevenLabs can even *clone* that actor so we generate new lines later without re-recording. Worth it once the script stabilizes.

## How I'd wire it (next step, on your go)
1. You pick **one narrator voice** + **one child voice** from samples above (Azure `JennyNeural` + `AnaNeural` is my default suggestion).
2. I give you a numbered **VO script** (every line in the game, keyed by id).
3. You batch-render them to MP3 (the service's bulk/SSML export, or I can script the API call).
4. Drop them in `assets/vo/` named by id; I add a `vo(id)` player that uses the clip when present and the device voice as fallback. Instant, human narration with no per-frame TTS lag.
