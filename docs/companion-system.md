# Pet Companion System — Star Pals

> *Companions should become a major source of emotional attachment.*
> **50 collectible Star Pals.** Each **evolves** through learning streaks, completing challenges, helping friends, and exploring districts. No combat, no gacha, no loss.

---

## 1. What a Star Pal is

A **Star Pal** is a cute creature the child **rescues** (a helped Gloomling), **raises**, and **bonds** with. Star Pals follow the child, react with personality, **help in learning missions** (gentle hints/cheers), **dance** in performances, and can be **cared for, fed, and dressed up**. They are the game's nurture + collection heart — the deepest emotional hook for ages 5–7.

**Never:** they never fight, never get sick, never "die," never shame the child. A neglected pal is just *sleepy-cute* and instantly happy on return.

## 2. Evolution (the "Bond Tree")

Every Star Pal grows through **3 forms**: **Spark → Glow → Radiant.** Evolution is earned by *caring + learning + adventuring*, never bought.

```
Bond points come from:
  • Learning streaks (play/learn on consecutive days)     +Bond
  • Completing challenges while the pal is your buddy       +Bond
  • Helping friends (SEL/Friendship quests)                +Bond
  • Exploring districts (discover with the pal along)       +Bond
  • Daily care: Feed (Sparkles) · Play (micro-game) · Cuddle +Bond

Bond thresholds → evolve form (Spark→Glow→Radiant),
unlocking: cuter animations, a better helper ability, more accessory slots,
and a special "happy dance" for performances.
```
- **Buddy slot:** the child picks an active buddy who tags along and earns Bond; others rest happily in the **Star Pal Pen** (Friendship Plaza).
- **Care is gentle & optional:** care *accelerates* bonding but adventuring alone still grows it — no guilt loops.
- Data: `schemas/companion.schema.json` → `{id, name, district, theme, forms[3], personality, ability, bondCurve, accessories[]}`.

## 3. Helper abilities (no power — only kindness)

Star Pal abilities assist *learning*, never combat:
- **Hint Pals** — give an extra scaffolded hint in their district's subject.
- **Spotter Pals** — reveal a hidden sparkle/secret in exploration.
- **Cheer Pals** — extra confetti + Sparkles on effort (motivation).
- **Memory/Counter/Rhythm Pals** — demonstrate a sequence/count/beat (modeling).
Abilities **strengthen as the pal evolves** (Spark = small cheer → Radiant = clearer hint), giving a warm reason to bond.

---

## 4. The 50 Star Pals

Forms listed **Spark → Glow → Radiant.** All cute, expressive, mobile-friendly.

### Harmony Harbor — reading (1–6)
| # | Name | Theme | Forms | Personality | Helper |
|---|------|-------|-------|-------------|--------|
| 1 | **Twinkle** | glow-fox | Sparklet → Glimmerfox → Radiant Twinkle | curious, friendly (starter) | Hint: first letter sound |
| 2 | **Marlow Jr.** | lantern-fish | Finlet → Lanternfin → Beacon Marlow | gentle, shy | lights/reads a word aloud |
| 3 | **Gully** | page-gull | Pagelet → Bookwing → Story Gully | chatty, eager | reveals a hidden storybook page |
| 4 | **Rhymee** | songbird | Tweetlet → Rhymewing → Chorus Rhymee | playful, musical | suggests a rhyming word |
| 5 | **Wadsworth** | wise crab | Clicklet → Scrollcrab → Sage Wadsworth | thoughtful, kind | sounds out a sight word |
| 6 | **Bubbles** | float-bunny | Bublet → Driftbun → Radiant Bubbles | dreamy, soft | cheer + extra Sparkles |

### Neon Forest — patterns (7–12)
| # | Name | Theme | Forms | Personality | Helper |
|---|------|-------|-------|-------------|--------|
| 7 | **Glimmy** | glimmerbug | Blinklet → Glimmerbug → Radiant Glimmy | bouncy, bright | shows next pattern beat |
| 8 | **Ferny** | leaf-fox kit | Sproutlet → Leaffox → Grove Ferny | calm, watchful | mirrors a symmetry hint |
| 9 | **Mothmo** | pattern-moth | Flutterlet → Mira-moth → Aurora Mothmo | graceful | highlights the broken pattern |
| 10 | **Pip-Pop** | bubble frog | Hoplet → Popfrog → Radiant Pip-Pop | silly, giggly | sounds out a sound-pattern |
| 11 | **Vinea** | vine-deer | Buddlet → Vinedeer → Bloom Vinea | gentle | extends a color pattern |
| 12 | **Sparx** | firefly | Emberlet → Sparkfly → Radiant Sparx | zippy | reveals a hidden path light |

### Starlight Station — math (13–18)
| # | Name | Theme | Forms | Personality | Helper |
|---|------|-------|-------|-------------|--------|
| 13 | **Pippa** | star-sprite | Sprig → Starpip → Radiant Pippa | counts everything | counts aloud with you |
| 14 | **Comet** | comet-pup | Cometlet → Streakpup → Radiant Comet | fast, fun | groups gems to count |
| 15 | **Tally** | owl | Owlet → Tallyowl → Sage Tally | careful, smart | shows number order |
| 16 | **Nibbles** | star-mouse | Mouselet → Tallymouse → Radiant Nibbles | tidy | lines up 1:1 |
| 17 | **Zero** | moon-cat | Mewlet → Mooncat → Radiant Zero | cool, calm | hints "more or less" |
| 18 | **Plusvine** | sprout | Seedlet → Sumsprout → Radiant Plusvine | growing, kind | models +1 / take-away |

### Logic Labyrinth — logic (19–24)
| # | Name | Theme | Forms | Personality | Helper |
|---|------|-------|-------|-------------|--------|
| 19 | **Scout Jr.** | light-lynx | Cublet → Lightlynx → Radiant Scout | brave, loyal | lights one safe step |
| 20 | **Riddle** | bunny | Bunlet → Riddlebun → Radiant Riddle | clever, cheeky | restates the clue |
| 21 | **Sortoise** | turtle | Shellet → Sortoise → Sage Sortoise | patient | sorts an example for you |
| 22 | **Maze** | mouse | Squeaklet → Mazemouse → Radiant Maze | adventurous | previews the maze path |
| 23 | **Yesno** | two-tone pup | Puplet → Logicpup → Radiant Yesno | fair, friendly | demonstrates if-then |
| 24 | **Oddball** | shapeshift blob | Bloblet → Oddblob → Radiant Oddball | quirky, funny | nudges the odd-one-out |

### Rainbow Atelier — creativity (25–30)
| # | Name | Theme | Forms | Personality | Helper |
|---|------|-------|-------|-------------|--------|
| 25 | **Dot** | rainbow-bird | Chicklet → Rainbird → Radiant Dot | imaginative | suggests a color |
| 26 | **Splatter** | paint-pup | Driplet → Paintpup → Radiant Splatter | messy, joyful | demos color-mixing |
| 27 | **Trio** | triangle-blob | Trilet → Shapeling → Radiant Trio | building, eager | shows a shape combo |
| 28 | **Mira-Belle** | mirror-moth | Wisplet → Mirrowing → Radiant Mira-Belle | elegant | symmetry helper |
| 29 | **Hue** | chameleon | Tintlet → Huelizard → Radiant Hue | flexible | names target color |
| 30 | **Carousel** | pony | Foallet → Swirlpony → Radiant Carousel | whimsical | spins a design idea |

### Echo Meadow — memory (31–36)
| # | Name | Theme | Forms | Personality | Helper |
|---|------|-------|-------|-------------|--------|
| 31 | **Wink Jr.** | owl | Owlet → Memowl → Radiant Wink | sleepy, wise | replays a sequence |
| 32 | **Pairy** | hare | Harelet → Pairhare → Radiant Pairy | sweet | flips a match hint |
| 33 | **Memo** | moth | Flicklet → Memomoth → Radiant Memo | quiet | re-flashes the lights |
| 34 | **Lulla** | swan | Cygnet → Lullaswan → Radiant Lulla | soothing | hums the melody back |
| 35 | **Recall** | deer | Fawnlet → Recalldeer → Radiant Recall | observant | points to what changed |
| 36 | **Lantern** | firefly | Glowlet → Lanternfly → Radiant Lantern | warm | extends recall length gently |

### Beat Boulevard — rhythm (37–42)
| # | Name | Theme | Forms | Personality | Helper |
|---|------|-------|-------|-------------|--------|
| 37 | **Boomi Jr.** | speaker-spirit | Beeplet → Boomspeaker → Radiant Boomi | hype, cheerful | counts you in |
| 38 | **Sunny** | cheer-bird | Chicklet → Sunbird → Radiant Sunny | sunny, kind | cheer + tempo guide |
| 39 | **Tappa** | toad | Hoplet → Tempotoad → Radiant Tappa | bouncy | shows the tap pattern |
| 40 | **Disco** | dove | Fledglet → Discodove → Radiant Disco | smooth | demos a swipe combo |
| 41 | **Mochi** | cloud-pup | Pufflet → Cloudpup → Radiant Mochi | squishy, lovable | hold-note helper |
| 42 | **Bassy** | whale-calf | Calflet → Basswhale → Radiant Bassy | deep, gentle | feels the downbeat |

### Friendship Plaza — special / event / rare (43–50)
| # | Name | Theme | Forms | Personality | Helper |
|---|------|-------|-------|-------------|--------|
| 43 | **Harmony** | rainbow phoenix | Emberlet → Harmonix → Radiant Harmony | radiant, kind (rare) | boosts any hint once/day |
| 44 | **Cinder** | shy gray pup (the "Hush" friend) | Hushlet → Warmpup → Radiant Cinder | shy → brave (story pal) | models courage (SEL) |
| 45 | **Lumie** | tiny sun | Raylet → Sunny-mote → Radiant Lumie | warm | extra Daily Sparkle |
| 46 | **Petal** | flower-cat (Spring event) | Buddlet → Petalcat → Radiant Petal | gentle | seasonal cheer |
| 47 | **Frostbite** | snow-bun (Winter event) | Flakelet → Snowbun → Radiant Frostbite | cozy | seasonal cheer |
| 48 | **Confetti** | party-pup (Festival) | Poplet → Partypup → Radiant Confetti | joyful | celebration boost |
| 49 | **Echofly** | music-firefly (Concert event) | Notelet → Echofly → Radiant Echofly | melodic | rhythm encouragement |
| 50 | **Starling** | baby star (Anniversary) | Twinklet → Starling → Radiant Starling | wondrous (legendary-cute) | all-rounder buddy |

> All 50 fully **earnable** through play/events. Event pals **always return** (no permanent FOMO). Cosmetic accessories for pals are earnable with Sparkles or available in the parent-gated cosmetic shop — **never random, never pressured.**

---

## 5. Why this drives attachment (design rationale)
- **Nurture + reciprocity:** caring for a pal that *helps you learn* builds a warm loop (SEL: responsibility, empathy).
- **Visible growth mirrors the child's:** the pal evolves as the child masters skills — a gentle metaphor for "I'm growing too."
- **Collection + personality:** 50 distinct personalities → "which is your favorite?" is the kid playground conversation (and franchise/plush hook — see `franchise-bible.md`).
- **Always positive:** no loss, no fail, no pay-wall — only friendship, growth, and delight.
