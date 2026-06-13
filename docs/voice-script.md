# Voice-Over Script — render these and drop into `assets/vo/`

Goal: replace the device's synthesized voice with **film/TV-style AI character voices**.
Recommended tool: **ElevenLabs** (assign each character a distinct voice; direct the emotion).
Render each line as **`<id>.mp3`**, push to `assets/vo/`, then tell me "update the voice clips"
and I'll wire them up (regenerate `manifest.json` + bump cache).

## Casting (suggested ElevenLabs voice character)
| Character | Vibe | Suggested voice direction |
|---|---|---|
| **Rumi** (guide, Wk1) | warm, confident, encouraging older sister | bright, kind, a little playful |
| **Mira** (guide, Wk2) | cool, clever, calm | steady, smiley, reassuring |
| **Zoey** (guide, Wk3) | bubbly, energetic, musical | upbeat, fast, giggly |
| **Revi Star** (the child hero) | a real kid (~6) | excited, sweet — use a child voice (e.g. ElevenLabs kid voice / Azure "Ana") |
| **Twinkle** (Star Pal) | tiny, cute creature | squeaky, gentle, magical |
| **Gloomling** (shy spirit) | small, timid, sad→hopeful | soft, hushed, a little wobbly |
| **Narrator** | warm storybook | gentle, clear |

## Lines to render (exact text — match punctuation incl. — and … and curly quotes)

### Rumi — story dialogue (Rumi's voice)
| id | delivery | text |
|---|---|---|
| `rumi_greet_d1` | warm, inviting | Hi! I'm Rumi! Welcome to Harmony Harbor! Oh no — the Lighthouse went dark and a shy Gloomling is hiding its words. Will you help me read to light it up? |
| `rumi_greet_d2` | happy they returned | You came back — yay! The dock signs got all mixed up in the wind. Can you read them with me? |
| `rumi_greet_d3` | proud | Three days in a row — you're a real Star Hunter! The lighthouse keeper left you a note. Let's read it together… |
| `rumi_rising` | awe, building excitement | You filled the harbor with harmony! Watch — Rumi is becoming a Rising Star! |
| `coach_here_we_go` | encouraging | Here we go — read these with me! |

### Other characters
| id | character | delivery | text |
|---|---|---|---|
| `keeper_note` | Narrator | tender storybook | "Dear friend… the harbor shines because of YOU. Read on!" |
| `gloomling_lost` | Gloomling | shy, sad | …I lost the words. Will you read them with me? |
| `twinkle_evolve` | Narrator/Twinkle | magical, thrilled | Twinkle is evolving into Glimmerfox! |

### Coach feedback & praise (render in **Rumi's** voice; reused across guides for now)
| id | delivery | text |
|---|---|---|
| `praise_did_it` | celebratory | You did it! |
| `praise_wonderful` | warm | Wonderful reading! |
| `praise_reading_star` | proud | You're a reading star! |
| `praise_amazing` | excited | Amazing! |
| `praise_yay` | joyful | Yay! You read it! |
| `fb_almost` | gentle, no-pressure | Almost! Listen again. |
| `fb_trace_hint` | helpful | Trace along the glowing line, like this! |
| `fb_blend_hint` | helpful | Tap this one next! |
| `fb_first_sound` | gentle | Start with the first sound! |
| `nav_see_tomorrow` | warm goodbye | See you tomorrow! |
| `reward_great_job` | big celebration | Great job today, Star Hunter! |

## Notes
- **Dynamic lines** that include the child's name (e.g. "Wow, Revi Star!") stay on the device
  voice for now — they can't be pre-rendered per child. We can record name-free variants later.
- **Per-guide praise (advanced):** if you want Mira/Zoey to praise in *their own* voices, render
  the praise/feedback lines a second and third time and name them `praise_amazing__mira.mp3`, etc.
  Tell me and I'll switch the lookup to pick the active guide's variant.
- Keep clips tight (trim leading/trailing silence) so they trigger snappily.
