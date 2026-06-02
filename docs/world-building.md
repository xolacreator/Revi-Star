# World Building — The City of Lumina

> *"A magical world where learning restores harmony."*
> Children should feel they are exploring a **living, animated world**, not navigating an app.

## 1. The world premise

**Lumina** is a bright pop-city that runs on the **Frequency** — a glowing web of music and light that carries everyone's feelings. When people feel worried, stuck, or lonely, the Frequency dims and gentle gray **Gloomlings** appear (a Gloomling is a *feeling that needs a friend*). The **Little Legends** — magical idol heroes — and their newest trainee (the child) restore harmony by **helping**: solving a puzzle, sharing a song, reading a sign, designing a gift. Each act re-lights the city and turns a Gloomling into a happy **Star Pal**.

**Harmony = the win state.** Every district has a "harmony meter" the child fills by learning, blooming the world from gray to dazzling color (visible, satisfying, never violent).

## 2. The 8 districts

Each district = **a place + a learning skill + a feeling + a hero + a creature family + a festival + an academy + a musical landmark.**

| # | District | Learning skill | Feeling (SEL) | Hero host |
|---|----------|----------------|---------------|-----------|
| 1 | **Harmony Harbor** | Reading, phonics, storytelling | Confidence | Rumi |
| 2 | **Neon Forest** | Pattern recognition | Curiosity | Zoey & Remi |
| 3 | **Starlight Station** | Math & sequencing | Persistence | Nova |
| 4 | **Logic Labyrinth** | Logic & problem-solving | Patience | Mira |
| 5 | **Rainbow Atelier** | Creativity, color, shape | Self-expression | Indie |
| 6 | **Echo Meadow** | Memory & recall | Calm / sharing | Remi |
| 7 | **Beat Boulevard** | Rhythm & music | Joy / focus | Zoey |
| 8 | **Friendship Plaza** (hub) | SEL & teamwork | Belonging | All + Mentors |

> District names are canonical; the GDD's early aliases (Storybook Square = Harmony Harbor, Puzzle Park = Logic Labyrinth, etc.) map here.

### District template (authored as data — see `schemas/district.schema.json`)
`{ id, name, skillDomain, sel, hostHero, palette, music, creatures[], spiritCompanion, academy, landmark, festival, harmonyTiers[], quests[] }`

---

### 1 · HARMONY HARBOR — *Reading & Storytelling*
A cozy seaside town of lighthouses, bookshops, and paper-boat canals. Words wash up like seashells.
- **Vibe & palette:** warm gold, teal water, sunset pinks; gentle harbor bells.
- **Creatures:** **Letterlings** (living alphabet seahorses), **Page Gulls** (carry storybook pages), **Whisperwhales** (hum sentences).
- **Spirit companion:** **Marlo**, a gentle lantern-fish spirit who lights words as you read them aloud (tap-to-hear).
- **Academy:** **The Lighthouse Library** — phonics & reading missions.
- **Musical landmark:** **The Singing Lighthouse** — its beam plays a melody when you complete a reading quest; the chorus grows as the harbor re-lights.
- **Festival:** **Story Tide** (every reading milestone) — paper boats carrying the child's "first words" sail out glowing.
- **Skills here:** letter ID, letter sounds, rhyming, blending, sight words, listening comprehension.

### 2 · NEON FOREST — *Pattern Recognition*
A bioluminescent woodland where mushrooms, fireflies, and vines pulse in repeating color-and-sound patterns. Complete the pattern → the path lights up.
- **Palette:** electric purple, lime, cyan glows on deep blue.
- **Creatures:** **Glimmerbugs** (blink in AB/ABC patterns), **Patternpillars** (segments to complete), **Mira-moths** (mirror/symmetry).
- **Spirit companion:** **Fern**, a leafy fox-spirit who "sings" the next beat of a pattern as a hint.
- **Academy:** **The Glow Grove** — pattern & sequencing missions.
- **Musical landmark:** **The Pulse Tree** — a giant tree whose branches light in the pattern you solve, playing a riff.
- **Festival:** **Firefly Glow Night** — kids author their own light-patterns to decorate the forest.
- **Skills:** AB/ABC/AABB patterns, what-comes-next, symmetry, sorting by attribute.

### 3 · STARLIGHT STATION — *Math & Sequencing*
A whimsical sky-train station among the clouds where star-gems are counted, grouped, and loaded onto constellation-trains.
- **Palette:** midnight blue, gold, twinkling whites.
- **Creatures:** **Countcomets** (come in groups to count), **Number Nibbles** (tiny star-mice that line up), **Tally Owls**.
- **Spirit companion:** **Pip**, a bouncy star-sprite who counts along out loud.
- **Academy:** **The Constellation Depot** — counting, comparing, add/subtract within 10.
- **Musical landmark:** **The Chime Clock Tower** — rings the number you reach; sequences play as ascending notes.
- **Festival:** **Comet Count Carnival** — count falling comets to launch a fireworks finale.
- **Skills:** count to 20+, 1:1 correspondence, more/less, number order, add/subtract within 10.

### 4 · LOGIC LABYRINTH — *Logic & Problem-Solving*
A playful hedge-and-light maze of gates that open when you reason it out (sort, deduce, choose the path).
- **Palette:** crimson, magenta, warm garden greens.
- **Creatures:** **Riddlebunnies** (pose simple either/or choices), **Gateguard Pups** (open on the right rule), **Sortoise** (turtles who love sorting).
- **Spirit companion:** **Scout**, a brave little light-lynx who lights one safe step ahead (scaffold hint).
- **Academy:** **The Puzzle Pavilion** — sorting, classifying, cause/effect, deduction, mazes.
- **Musical landmark:** **The Echoing Arches** — each solved gate adds a note to a victory fanfare.
- **Festival:** **Maze Bloom** — solving the grand maze blooms flowers through the whole labyrinth.
- **Skills:** sort/classify, odd-one-out, sequencing events, simple if-then, spatial mazes.

### 5 · RAINBOW ATELIER — *Creativity, Color & Shape*
A sunlit art-and-fashion loft where color mixing, shape building, and outfit design paint the world back to life.
- **Palette:** every color (the most saturated district).
- **Creatures:** **Paint Pups** (drip primary colors that mix), **Shapelings** (friendly geometric blobs), **Mimsy Mannequins**.
- **Spirit companion:** **Dot**, a tiny rainbow-bird who chirps color/shape ideas.
- **Academy:** **The Color Loft** — color mixing, 2D shapes, symmetry, design challenges.
- **Musical landmark:** **The Crayon Carousel** — spins out a melody in the colors you choose.
- **Festival:** **Rainbow Festival** (tentpole) — kids design outfits & murals shown across the city.
- **Skills:** name/mix colors, identify/compose shapes, patterns in art, free-design self-expression.

### 6 · ECHO MEADOW — *Memory & Recall*
Calm twilight fields of glowing fireflies that replay little light-songs for you to remember and play back.
- **Palette:** soft teal, lavender, firefly gold.
- **Creatures:** **Memo Moths** (flash a sequence), **Pair Hares** (matching pairs), **Recall Deer**.
- **Spirit companion:** **Wink**, a sleepy owl-spirit who replays a sequence one more time (gentle hint).
- **Academy:** **The Lantern Circle** — memory match, sequence recall, "what changed?".
- **Musical landmark:** **The Lullaby Pond** — ripples replay the melody you remember.
- **Festival:** **Lantern Night** — kids light lanterns in remembered patterns; a calm, cozy event.
- **Skills:** working memory, recall sequences (growing length), match pairs, spot-the-change.

### 7 · BEAT BOULEVARD — *Rhythm & Music*
A neon dance-plaza of light-up tiles and stages — the heart of performances. Tap/hold/swipe to the beat.
- **Palette:** hot pink, cyan, gold neon.
- **Creatures:** **Boomblets** (drum-beat blobs), **Tempo Toads**, **DJ Doves**.
- **Spirit companion:** **Boomi**, a cheerful speaker-spirit who counts you in ("1-2-ready-go!").
- **Academy:** **The Rhythm Stage** — beat-keeping, tap/hold/swipe patterns, call-and-response.
- **Musical landmark:** **The Big Stage** — the city's main concert venue (weekly Comeback Concert, §live-events).
- **Festival:** **Comeback Concert** (weekly) — premiere a song with a featured hero.
- **Skills:** keep a beat, repeat rhythms, simple sequencing, listening, focus.

### 8 · FRIENDSHIP PLAZA — *SEL & Teamwork* (hub)
The Little Legends' sparkling clubhouse and town square — the safe "home base" you always return to.
- **Vibe:** warm, welcoming, your customizable clubhouse + Star Pal pen + dress-up mirror + the Star Path sky-map.
- **Creatures:** all Star Pals gather here; friendly citizens.
- **Spirit companion:** the **three Mentors** (Luna, Echo, Iris) live here.
- **Academy:** **The Heart Hall** — SEL stories: naming feelings, empathy, sharing, patience, courage, teamwork.
- **Musical landmark:** **The Friendship Fountain** — sings a duet whenever two heroes/Star Pals bond.
- **Festival:** **Friendship Festival** — group performances celebrating the whole team.
- **Skills (SEL):** recognize/name emotions, empathy, turn-taking, kindness, perseverance.

---

## 3. Magical creatures (taxonomy)

Three friendly tiers, none hostile:
1. **Citizens** — townsfolk who give quests (people & animal-folk; warm, diverse).
2. **Critter families** — district-themed ambient creatures that teach (Letterlings, Glimmerbugs, Countcomets…). Some become collectible **Star Pals**.
3. **Spirit companions** — one guardian spirit per district (Marlo, Fern, Pip, Scout, Dot, Wink, Boomi) who **scaffolds hints** in that skill. They are the district's friendly "teacher-buddy."

(Gloomlings are *pre-Star-Pals* — gray, sad, never scary — who transform on being helped.)

## 4. Friendly spirit companions (summary table)

| District | Spirit | Form | Hint style |
|----------|--------|------|-----------|
| Harmony Harbor | **Marlo** | lantern-fish | lights/speaks words |
| Neon Forest | **Fern** | leaf-fox | sings next pattern beat |
| Starlight Station | **Pip** | star-sprite | counts aloud |
| Logic Labyrinth | **Scout** | light-lynx | shows one safe step |
| Rainbow Atelier | **Dot** | rainbow-bird | suggests color/shape |
| Echo Meadow | **Wink** | owl | replays sequence |
| Beat Boulevard | **Boomi** | speaker-spirit | counts you in |
| Friendship Plaza | **Mentors** | people | gentle questions |

## 5. Seasonal festivals (overview — full calendar in `live-events-calendar.md`)

Every district hosts a signature festival; the world rotates a tentpole festival each season:
- **Story Tide** (Harbor) · **Firefly Glow Night** (Forest) · **Comet Count Carnival** (Station) · **Maze Bloom** (Labyrinth) · **Rainbow Festival** (Atelier, tentpole) · **Lantern Night** (Meadow) · **Comeback Concert** (Boulevard, weekly) · **Friendship Festival** (Plaza).

Festivals are **positive, magical, never fear-based** — light, music, color, and togetherness.

## 6. Learning academies

Each district has a small **academy** (the structured "lesson hub") where a hero/spirit teaches that skill through missions — but academies look like **magical clubs/stages**, never classrooms. The child *enrolls* to feel like a trainee hero earning their craft.

## 7. Musical landmarks

Every district has a **landmark that sings** as the child learns (Singing Lighthouse, Pulse Tree, Chime Clock, Echoing Arches, Crayon Carousel, Lullaby Pond, Big Stage, Friendship Fountain). Re-lighting a district literally **completes its song** — the audio reward for mastery, tying music to every domain.

## 8. The living-world feel (production notes)
- **Time-of-day & weather** drift gently (cozy mornings, sparkly nights).
- **Ambient life:** critters wander, citizens wave, music swells near landmarks.
- **Bloom system:** as harmony rises, gray husks visibly re-color and animate — the child *sees* their learning healing the world.
- **Free exploration** with a hideable breadcrumb; curiosity always rewarded (tap to discover). Small, safe, no-fail spaces sized for a 5–7-year-old.
- **Seamless travel:** a friendly **Sky-Tram / map** moves between districts in seconds (no loading anxiety).
