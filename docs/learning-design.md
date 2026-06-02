# Learning Design — The Magical Curriculum (Ages 5–7)

> The most important document in the project. Authored as a curriculum specialist.
> **Rule #1:** learning challenges are **magical missions**, never worksheets.
> **Every activity:** lasts **< 3 minutes**, gives **instant feedback**, **rewards progress**, and **builds confidence** (no fail states).

---

## 1. Pedagogical framework

**Learner profile (5–7):** pre/early readers, short attention (~10–15 min), learn by doing & manipulating, need immediate feedback, motivated by play, story, and nurture.

**Principles baked into every activity:**
- **Mastery, not clock.** Advance by showing a skill, never by time spent.
- **ZPD / scaffolding (Vygotsky):** keep success ~80%; spirit-companions give just-enough hints.
- **Growth mindset (Dweck):** praise effort & strategy; "mistakes are clues."
- **Self-Determination (autonomy, competence, relatedness):** kids choose districts/missions/outfits, see visible growth, and learn *with* beloved heroes & pets.
- **Multisensory:** see + hear + tap/drag; everything narrated (pre-reader-first).
- **Spiral review:** old skills resurface inside new contexts to consolidate.

## 2. Subjects & skill ladders (difficulty progression)

Eight subjects, each a ladder of **micro-skills** across three bands: **Discover → Practice → Master**.

| Subject | Discover (5y) | Practice (6y) | Master (7y) |
|---------|---------------|---------------|-------------|
| **Reading** | letter ID, print awareness | sight words, decode CVC | read short sentences, comprehension |
| **Phonics** | letter sounds | blend onset-rime, CVC | digraphs (sh/ch/th), short vowels |
| **Vocabulary** | name objects, categories | opposites, describing words | synonyms, context meaning |
| **Math** | count to 10, 1:1 | count to 20+, compare | add/subtract within 10 |
| **Patterns** | AB copy | AB/ABC extend | AABB & translate patterns |
| **Logic** | sort by 1 attribute | odd-one-out, sequence | 2-attribute sort, if-then, deduce |
| **Memory** | match 4 pairs, recall 2 | recall 3–4 seq, 6 pairs | recall 5–6 seq, spot-2-changes |
| **Creativity** | name/pick colors & shapes | mix colors, compose shapes | design with intent, symmetry |

Each micro-skill has a stable `skillId` (e.g., `phon.cvc.blend`) used by the adaptive engine and parent reports. Master band content stays gentle and celebratory — it is *enrichment*, not pressure.

## 3. Activity design rules (the "magical mission" contract)

Every activity MUST:
1. Open with a **story hook** ("A Letterling lost its sound — help it sing!").
2. Be **operable without reading** (spoken prompt + icons + tap/drag).
3. Resolve in **< 3 minutes**, ideally 30–90s.
4. Give **instant feedback**: right → sparkle + warm SFX + character cheer; wrong → soft chime + **scaffolded hint**, never a buzzer of shame.
5. **Never fail.** Wrong answers escalate help until success (see §5 ladder).
6. End with a **reward + visible progress** (Sparkles, a Star Gem toward a transformation, harmony bloom, a sticker).
7. Tie back to the **fantasy**: the child *helped a friend* and *grew their hero*.

---

## 4. The 100 challenge examples

Format: **# · Mission name · skillId · band · mechanic & feedback.** Bands: **D**iscover / **P**ractice / **M**aster. All are < 3 min, narrated, no-fail.

### Phonics (1–14)
1. **Sing the Letterling** · `phon.letter.sound` · D · A seahorse shows a letter; tap to hear & repeat its sound; it glows and sings.
2. **Catch the Sound** · `phon.letter.sound` · D · Three letters float; tap the one that makes "mmm."
3. **First-Sound Shells** · `phon.onset` · D · Match a picture (sun) to its first-sound shell (S).
4. **Bubble Blend** · `phon.cvc.blend` · P · Hear /c/-/a/-/t/ pop in bubbles; tap them in order to blend "cat."
5. **Rhyme Reef** · `phon.rhyme` · P · Pick the fish that rhymes with "hat" (cat, dog, sun).
6. **Vowel Lantern** · `phon.shortvowel` · P · Light the lantern with the missing short vowel in "b_g."
7. **Sound Swap** · `phon.cvc.manip` · M · Change "cat" to "cot" by swapping the middle sound.
8. **Digraph Doors** · `phon.digraph.sh` · M · Open the door labeled with the "sh" sound when you hear "ship."
9. **Ch or Th?** · `phon.digraph.chth` · M · Sort words to the "ch" chest or "th" chest by sound.
10. **Onset Train** · `phon.onset` · P · Drag the first sound car to the rest of the word ("-og" + d → dog).
11. **Silly Sound Song** · `phon.letter.sound` · D · Tap letters to build a giggly sound-song (free, confidence).
12. **Last-Sound Lagoon** · `phon.coda` · P · Tap the ending sound you hear in "dog" (/g/).
13. **Blend Booster** · `phon.cvc.blend` · M · Blend 4-sound words (frog) as star-gems line up.
14. **Vowel Voyage** · `phon.shortvowel` · M · Sort CVC words by their vowel sound into glowing boats.

### Reading & comprehension (15–24)
15. **Letterling Roll Call** · `read.letterID` · D · Tap the letter the lighthouse calls out.
16. **Sight-Word Stars** · `read.sightword` · D · Tap the star that says "the" (heard + shown).
17. **Word Match Tide** · `read.wordpic` · P · Match the written word to its picture (paper boats).
18. **Build-a-Word Boat** · `read.decode.cvc` · P · Drag letters to spell the pictured word (cat).
19. **Read the Sign** · `read.sentence` · P · Help a lost Star Pal by reading a 3-word sign aloud (tap-to-hear support).
20. **Story Tide: Who?** · `read.comp.character` · P · After a 3-line story, tap *who* it was about.
21. **Story Tide: What Next?** · `read.comp.sequence` · M · Put 3 story pictures in order.
22. **Find the Sight Word** · `read.sightword` · P · Spot "and" hidden in a fun banner.
23. **Sentence Sparkle** · `read.sentence` · M · Tap words in order to read a short sentence; each lights up.
24. **Feelings Page** · `read.comp.sel` · M · After a story, tap how the character *felt* (SEL + comprehension).

### Vocabulary (25–32)
25. **Name the Treasure** · `vocab.name` · D · Tap & name the object the gull drops (apple).
26. **Sorting Baskets** · `vocab.category` · D · Sort items into "fruit" vs "toys" baskets.
27. **Opposite Doors** · `vocab.opposite` · P · Open the door that's the opposite of "big."
28. **Describe the Pal** · `vocab.adjective` · P · Pick the word that describes the fluffy pal ("soft").
29. **Which Belongs?** · `vocab.category` · P · Tap the one that doesn't belong (apple, banana, shoe).
30. **Word of the Day** · `vocab.name` · D · Learn one magical new word with picture + voice; add to your Word Garden.
31. **Same-Meaning Stars** · `vocab.synonym` · M · Match "happy" to "glad."
32. **Picture Clues** · `vocab.context` · M · Guess the new word from a picture + sentence clue.

### Math (33–50)
33. **Count the Comets** · `math.count10` · D · Tap each comet as it's counted aloud (1–5).
34. **Star-Gem Line-Up** · `math.count10` · D · Drag gems to count 1:1 into a tray (to 10).
35. **More or Less Moons** · `math.compare` · D · Tap the side with *more* moons.
36. **Comet Carnival 20** · `math.count20` · P · Count a group up to 20.
37. **Number Train Order** · `math.numorder` · P · Put number cars 1–10 in order.
38. **Which Number?** · `math.numID` · D · Tap the numeral the chime rings (7).
39. **Add the Sparkles** · `math.add5` · P · 2 gems + 3 gems → tap how many (within 5).
40. **Take-Away Tunnel** · `math.sub5` · P · 5 gems, 2 zoom away → how many left?
41. **Group the Gems** · `math.group` · P · Make groups of 5; count by fives to 20.
42. **Comet Pairs to 10** · `math.add10` · M · Find two comets that add to 10.
43. **Missing Number Star** · `math.numorder` · M · Fill the missing number in 1–20 sequence.
44. **Subtract Skyfall** · `math.sub10` · M · Solve take-away within 10 to land the sky-train.
45. **Count by 2s Comets** · `math.skip2` · M · Tap every 2nd comet (skip-counting).
46. **Shape-Count Station** · `math.count.shape` · D · Count how many triangles in the picture.
47. **Heavier / Lighter** · `math.measure` · P · Tap the heavier crate (early measurement).
48. **Tallest Tower** · `math.measure` · D · Tap the tallest of three towers.
49. **Make 10 Machine** · `math.add10` · M · Drop gems to reach exactly 10 (number bonds).
50. **Sequence Sky-Train** · `math.seq` · M · Continue a number sequence (2,4,6,…).

### Pattern recognition (51–62)
51. **Glimmer Copy** · `pat.AB.copy` · D · Copy a 2-color firefly pattern (blue, green, blue, green).
52. **What Glows Next?** · `pat.AB.extend` · D · Tap the next light in an AB pattern.
53. **Patternpillar Fix** · `pat.AB.fill` · P · Fill the missing segment in an AB pattern.
54. **Triple Twinkle** · `pat.ABC.extend` · P · Extend an ABC color/sound pattern.
55. **Sound Pattern Echo** · `pat.sound` · P · Repeat a clap pattern (high-low-high) — audio pattern.
56. **Mira-Moth Mirror** · `pat.symmetry` · P · Make the moth's wings match (symmetry).
57. **Shape Pattern Path** · `pat.shape` · P · Continue a square-circle-square path to cross.
58. **AABB Bloom** · `pat.AABB` · M · Build an AABB flower pattern.
59. **Pattern Translate** · `pat.translate` · M · Same pattern, new colors (red-blue → 🍎-🫐).
60. **Growing Pattern** · `pat.growing` · M · 1,2,3 dots… continue the growing pattern.
61. **Odd Light Out** · `pat.error` · P · Tap the firefly that breaks the pattern.
62. **Design a Pattern** · `pat.create` · D · Make your own light-pattern to decorate the forest (free).

### Logic & problem-solving (63–74)
63. **Color Sort Gates** · `logic.sort1` · D · Sort pups by one color into gates.
64. **Big & Small Bins** · `logic.sort1` · D · Sort by size.
65. **Odd One Out** · `logic.odd` · P · Tap the one that doesn't belong.
66. **Which Comes First?** · `logic.sequence` · P · Order 3 daily-routine pictures.
67. **Riddlebunny Choice** · `logic.deduce` · P · "I'm red and round." Tap the matching fruit.
68. **Two-Way Sort** · `logic.sort2` · M · Sort by color *and* shape into a 2×2 grid.
69. **If-Then Gate** · `logic.ifthen` · M · "If it's raining, tap the umbrella."
70. **Maze of Light** · `logic.maze` · P · Draw the path through a simple maze.
71. **Finish the Set** · `logic.matrix` · M · Complete a simple 2×2 matrix (early reasoning).
72. **Cause & Effect** · `logic.cause` · P · Tap what happens *next* (drop ball → it bounces).
73. **Hidden Rule** · `logic.rule` · M · Figure out which rule opens the gate (try & learn).
74. **Sortoise Helper** · `logic.sort1` · D · Help the turtle sort shells by shape (gentle intro).

### Memory (75–88)
75. **Pair Hares** · `mem.match4` · D · Match 4 pairs of cards.
76. **Memo Moth Flash (2)** · `mem.seq2` · D · Repeat a 2-light sequence.
77. **Memo Moth Flash (3)** · `mem.seq3` · P · Repeat a 3-light sequence.
78. **Memo Moth Flash (4)** · `mem.seq4` · P · Repeat a 4-light sequence.
79. **Lullaby Replay** · `mem.melody` · P · Play back a 3-note melody on lily-pads.
80. **What Changed?** · `mem.change1` · P · One thing moved — tap what changed.
81. **Spot Two Changes** · `mem.change2` · M · Two things changed — find both.
82. **Pair Hares (6)** · `mem.match6` · P · Match 6 pairs.
83. **Where's the Pal?** · `mem.location` · D · Remember which cup hides the Star Pal.
84. **Sequence Dance** · `mem.danceseq` · M · Remember & repeat a 4-step dance.
85. **Shopping List** · `mem.list` · P · Remember 3 items to gather at the Market.
86. **Color Code Lock** · `mem.seq4` · M · Repeat a 4-color sequence to open a chest.
87. **Story Recall** · `mem.story` · M · After a short tale, tap what happened first.
88. **Growing Glow** · `mem.seq5` · M · Repeat a 5-light sequence (max for age).

### Creativity, color & shape (89–100)
89. **Color Pups Mix** · `cre.colormix` · D · Mix red + yellow Paint Pups → orange.
90. **Name That Color** · `cre.colorID` · D · Tap the color the bird names.
91. **Shapeling Sort** · `cre.shapeID` · D · Tap all the circles.
92. **Build a Shape** · `cre.compose` · P · Combine 2 triangles into a square.
93. **Symmetry Wings** · `cre.symmetry` · P · Paint the other wing to match.
94. **Design a Star Pal Outfit** · `cre.design` · D · Free dress-up; any choice celebrated.
95. **Color the Gloom** · `cre.colorID` · D · Paint a gray scene with the right colors to bloom it.
96. **Pattern Mural** · `cre.pattern` · P · Make a repeating art pattern for the city wall.
97. **Shape Picture** · `cre.compose` · P · Build a rocket from shapes.
98. **Mix to Match** · `cre.colormix` · M · Mix to make the exact target color (purple).
99. **Stage Designer** · `cre.design` · M · Design a concert stage (color + shape + layout; intentional design).
100. **My Masterpiece** · `cre.openart` · D · Free paint canvas saved to the gallery (pure expression, always a win).

> Full data: `schemas/sample_data/challenges_100.json` (each row = `{id, name, skillId, band, mechanic, prompt_vo, assets, rewardTier}`), authored by curriculum specialists without code.

---

## 5. Adaptive learning system

### 5.1 Mastery model (per `skillId`)
Track a rolling estimate `m ∈ [0,1]` from recent attempts, weighting: correctness, hints used, time-to-answer, and retries.
```
masteryUpdate:
  base   = correct ? +0.12 : -0.06
  hintPenalty = hintsUsed * 0.03
  speedBonus  = (answeredQuickly && correct) ? +0.03 : 0
  m = clamp(m + base - hintPenalty + speedBonus, 0, 1)
band(m): m < 0.45 → Discover | 0.45–0.8 → Practice | > 0.8 → Master
```
- **Mastered** at `m ≥ 0.85` sustained over ≥3 sessions → unlock badge + advance ladder.

### 5.2 Dynamic difficulty (keep the child in flow ~80% success)
```
each session, per skill:
  if recentSuccess > 0.85 and lowHintUse → serve next-harder item (nudge up)
  if recentSuccess < 0.55 or highHintUse → serve easier item + extra scaffold (nudge down)
  else → hold band, vary context (spiral review of mastered skills)
selection also balances: freshness (avoid repeats), curriculum coverage, and the child's chosen district/interest.
```
- **Invisible to the child.** They only feel "this is fun and I can do it."
- **Parent override:** lock to a band or to the child's age (Parent Zone).
- **Spiral review:** ~20% of items pull from previously-mastered skills to consolidate.

### 5.3 Scaffolding ladder (on any wrong answer — never a fail)
1. **Encourage + retry** ("So close! Try again 💛").
2. **Hint** — spirit-companion narrows choices / re-speaks / highlights.
3. **Model** — companion shows the answer, then child repeats → guaranteed success.
→ Confidence is *always* preserved; every mission ends in a win.

### 5.4 Telemetry (privacy-safe, aggregate)
Per attempt log `{skillId, band, correct, hints, ms, retries}` → drives mastery, parent reports, and curriculum efficacy studies. **No child profiling, no ads, no third-party sharing** (see `unity-architecture.md` §analytics + `parent-dashboard.md`).

---

## 6. Reward structures (tie learning → fantasy)

| Trigger | Reward | Feeling |
|---------|--------|---------|
| Correct answer | sparkle burst + companion cheer + SFX/haptic | "I did it!" |
| Mission complete | **Sparkles** ✨ + **Star Gem** ⭐ + harmony bloom | progress visible |
| Skill milestone (mastery) | **Sticker Badge** 🏅 + voice praise of *effort* | pride |
| Domain progress | fills a **hero's Stardom meter** → transformation | "my learning grew my hero!" |
| Helping = healing | Gloomling → **Star Pal** 🐾 | empathy + collection |
| Daily learning | **Day Star** + Daily Sparkle | gentle ritual |

**Anti-patterns avoided:** no variable-ratio loot psychology, no fail/loss punishment, no comparison to peers, no time-pressure gating. Rewards are **predictable, frequent, fair, and meaningful to a 5–7-year-old** (cute & celebratory > numbers).

**The core motivational engine:** *Learn → your hero transforms → the world blooms → a friend (Star Pal) joins you.* Learning is never the price of fun — **learning IS the magic.**
