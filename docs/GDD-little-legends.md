# STARBOUND: LITTLE LEGENDS — Game Design Document

> **Canonical design document.** Educational mobile game · ages **5–7** · iOS + Android.
> **Fantasy:** *"I am becoming a magical idol hero — through learning."*
> **Not:** schoolwork. **No combat.** Excitement and wonder come from music, friendship, transformation, exploration, and mastery.
> **Companion doc:** [`character-bible-little-legends.md`](character-bible-little-legends.md).

---

## 0. The team's north star

Built by children's game designers, child psychologists, curriculum specialists, Pixar-school storytellers, and mobile devs to one standard: **a child should feel like a rising K-pop magical hero, and only later realize they were learning to read, count, and solve.** Every skill mastered becomes a *power*; every power becomes a *transformation*; every transformation makes the world brighter.

### Design pledges (non-negotiable)
1. **No combat, no violence, no losing.** Challenges are *helped*, never *defeated*. There are no fail states — only "try again, you're closer."
2. **Pre-reader first.** Everything is narrated and icon-driven; a child who cannot read yet can play 100% of it independently.
3. **Effort over results** (growth mindset). We celebrate trying. Mistakes are "clues," never failures.
4. **Wonder, not pressure.** No harsh timers, no streyks-shame, no leaderboards, no comparison to other kids, no chat with strangers.
5. **Learning is hidden inside adventure** and validated against early-learning curriculum standards.
6. **Parents trusted by default:** no ads, no data selling, no pressure mechanics aimed at children, everything behind a parental gate.

---

## 1. Core fantasy

**You are a brand-new Star Hunter trainee** who joins the city's beloved idol group, the **Little Legends**. The Little Legends are magical K-pop heroes whose music turns sadness back into joy. You explore the city, help its people by **solving learning challenges** (each one a magical "spell"), **perform** sparkling concerts, **rescue cute creatures** called Star Pals, and — as you master new skills — **transform** into a more dazzling hero.

The emotional promise: *every time you learn something, you literally glow brighter and your hero levels up.* Learning = power = transformation = being seen and celebrated.

---

## 2. The world

**Lumina** — a bright, magical pop-city that runs on the **Frequency**, a glowing network of music and light that carries everyone's feelings. When people feel worried, lonely, or stuck, the Frequency dims and gentle gray creatures called **Gloomlings** appear (a Gloomling is a *feeling that needs help*, not a monster). Star Hunters re-light the city by helping — solving a puzzle, sharing a song, designing a cheer-up gift — which turns the Gloomling into a happy **Star Pal**.

### Districts (each = a learning domain + a feeling)
| District | Vibe | Learning domain | Feeling (SEL) | Host hero |
|----------|------|-----------------|---------------|-----------|
| **Storybook Square** | cozy library-town | Reading & words | Confidence | **Rumi** |
| **Puzzle Park** | playful maze-gardens | Logic & problem-solving | Patience | **Mira** |
| **Beat Street** | neon dance plaza | Rhythm & patterns | Joy / focus | **Zoey** |
| **Starlight Market** | sparkling bazaar | Math & counting | Persistence | **Nova** |
| **Rainbow Studio** | art & fashion loft | Creativity, color, shape | Self-expression | **Indie** |
| **Memory Meadow** | calm firefly fields | Memory & sequencing | Calm / sharing | **Remi** |
| **Friendship Plaza** (hub) | the group's clubhouse | SEL & teamwork | Belonging | All + Mentors |

Each district is a small, safe, explorable 3D space sized for a 5–7-year-old to wander, tap, and discover — never overwhelming, never a place you can get lost or stuck.

---

## 3. Story

**Structure: gentle, episodic, hopeful** — like a kids' TV season. No scary stakes; the "tension" is always a friend who needs help.

- **Pilot ("Your Debut"):** Director Luna invites *you* to become a Little Legends trainee. You make your own hero avatar, learn to walk the city, and help your first Gloomling — your first Star Pal joins you.
- **Season arc:** the Frequency has been dimming across the districts. District by district, you (with a hero mentor each time) help citizens, learn that hero's strength, and **re-light the district** with a big group concert.
- **Recurring heart:** every episode ends with a short, warm lesson about a *feeling* (it's okay to make mistakes; sharing feels good; being patient pays off) — delivered through story, never as a lecture.
- **No villain to defeat.** The closest thing to an "antagonist" is **the Hush** — a sleepy gray quiet that spreads when people feel alone. It is *soothed*, not fought. (Optionally personified later as a shy character who just wanted a friend — a powerful SEL payoff.)

Narrative delivery: short voiced **MV-style cutscenes** at district milestones, friendly mentor voice-over during quests, and collectible "memory cards" (storybook pages) that build the world for kids who want more.

---

## 4. Characters

Full bible in [`character-bible-little-legends.md`](character-bible-little-legends.md). Summary:

- **The player** = a **customizable Star Hunter trainee** (self-insert avatar; dress-up; the identity the child grows). *This is who transforms.*
- **Six hero mentor-companions**, one per learning strength: **Rumi** (Reading), **Mira** (Logic), **Zoey** (Rhythm), **Nova** (Math), **Indie** (Creativity), **Remi** (Memory). Unlocked by exploring their district; each teaches and performs duets with the player.
- **Three grown-up mentors:** **Director Luna** (leader/encouragement), **DJ Echo** (music/joy), **Auntie Iris** (creativity/care). They model warm, question-asking, never-scolding guidance.
- **Star Pals:** collectible cute companion creatures (pets) — see §9.

---

## 5. Core gameplay loop

### 5.1 The session loop (one "Adventure" = 5–15 minutes)
```
① OPEN  → Friendship Plaza hub; your hero + Star Pals greet you; today's glowing path beckons.
② EXPLORE → Walk into a district; tap to move; discover sparkles, citizens, a Gloomling who needs help.
③ LEARN  → A short Learning Quest: 1–3 adaptive micro-activities (the "spell" to help the Gloomling).
④ SOLVE  → (often) a small puzzle that uses what you just learned.
⑤ PERFORM → A short rhythm mini-concert (tap/hold/swipe) to "spread the joy."
⑥ TRANSFORM → Sparkles + Star Gems pour in; your hero's Stardom meter fills; sometimes a transformation!
⑦ COLLECT → The Gloomling becomes a Star Pal that joins your collection and follows you.
⑧ CELEBRATE → Confetti, the Star Pal does a happy dance, gentle "great trying!" — then back to ② or out.
```
A single full Adventure (one Gloomling rescued) targets **~7 minutes**; a child can stop cleanly after any ⑧, or chain 2 in a 15-minute sit.

### 5.2 Why it's exciting without combat
The dopamine comes from **discovery (explore), mastery (learn/solve), self-expression (perform/dress-up), nurture (collect/care), and spectacle (transform).** These are the same hooks as a hero game — minus conflict.

---

## 6. Core activities (detailed)

### 6.1 Exploration
- Small, tap-to-move 3D districts with hidden sparkles, citizens to greet, and decorations. **Curiosity rewarded** (tap a bush → a Star Pal peeks out).
- No way to "die," fall, or get lost; gentle invisible boundaries; a glowing breadcrumb always shows where to go for kids who want guidance, hideable for free explorers.
- Exploration is the connective tissue and the "open world" wonder that makes it feel like an adventure, not an app of menus.

### 6.2 Learning Quests
- The heart. A citizen/Gloomling has a problem solvable with a **learning micro-activity**, themed to the district (e.g., Storybook Square: "match the picture to its first letter sound").
- **1–3 micro-activities per quest**, each 20–60 seconds, **adaptive** (§11 difficulty).
- **No typing/reading required to operate**; answers are tap-to-choose with audio. Instructions always spoken.
- Wrong tap → gentle SFX, the mentor/Star Pal gives a **hint that scaffolds** (narrows choices, re-explains), retry. **Never a fail screen.**
- Curriculum-mapped (§10). Skills: letters & phonics, sight words, counting/number sense, add/subtract within 10, shapes, patterns, colors, sorting, memory/sequencing, and SEL.

### 6.3 Puzzle solving
- Light, tactile puzzles that apply the lesson: drag-and-sort, connect-the-path mazes (Mira's light-bridges), shape-fitting, "which doesn't belong," pattern completion, simple matching.
- Designed for **success-with-effort**: solvable in 2–5 tries, hints escalate, celebration on solve.

### 6.4 Rhythm games (Performance)
- The "concert" payoff. **Tap / hold / swipe** to a 30–90s original song. Beat ring is **visual-first** (color + shape + position), audio-secondary, so it's playable by kids with timing still developing and is accessible.
- **Forgiving scoring:** Good / Great / Perfect — *all* succeed; better timing = more sparkle, never a fail. No "miss = lose."
- Doubles as memory/pattern practice (Remi/Zoey). Builds the music pillar and is the most shareable, joyful moment (and where transformations & outfits shine).

### 6.5 Character evolution (Transformation)
- Each hero **and** the player avatar has a **Stardom Path** (3 transformation stages: **Trainee → Star Hunter → Starbound**).
- **Learning fuels it:** completing Learning Quests in a domain fills that hero's Stardom meter. Hit a threshold → a **magical transformation cutscene** (costume glow-up, new effects, new pose). *This is the core "I'm becoming a hero through learning" beat.*
- Transformations unlock new districts/quests and new performance choreographies (gameplay + spectacle, never stat-power).

### 6.6 Pet collection (Star Pals)
- Rescued Gloomlings become **Star Pals** (e.g., **Twinkle** the glow-fox, **Bubbles** the float-bunny, **Sunny** the cheer-bird, **Mochi** the cloud-pup). Cute, expressive, collectible.
- They **follow you, react, help in quests** (offer hints), **dance in performances**, and can be **cared for and dressed up** (§9). Collection + nurture = long-tail engagement appropriate for the age.

---

## 7. Learning systems (pedagogy & curriculum)

### 7.1 Grounding (child development)
- **Ages 5–7** span pre-operational → early concrete-operational thinking: short attention (~10–15 min), learn by *doing/manipulating*, need immediate feedback, pre/early readers.
- **Scaffolding & ZPD (Vygotsky):** mentors/Star Pals provide just-enough help; difficulty stays in the "challenging-but-doable" band.
- **Growth mindset (Dweck):** praise effort/strategy ("you kept trying!"), normalize mistakes.
- **Self-Determination Theory:** autonomy (choose districts/outfits), competence (mastery + visible growth), relatedness (heroes, Star Pals, teamwork).
- **Mastery learning:** advance by demonstrating a skill, not by clock.

### 7.2 Curriculum map (aligned to early-learning standards)
| Domain | Sample skills (5–7) | District |
|--------|---------------------|----------|
| **Early literacy** | letter ID, letter sounds, rhyming, blending, sight words, listening comprehension | Storybook Square |
| **Numeracy** | counting to 20+, 1:1 correspondence, compare, add/subtract within 10, number writing | Starlight Market |
| **Logic & reasoning** | sorting, classifying, sequencing, cause/effect, simple deduction, mazes | Puzzle Park |
| **Shapes/spatial & creativity** | 2D shapes, symmetry, color mixing, design/composition | Rainbow Studio |
| **Patterns & rhythm** | AB/ABC patterns, repetition, beat, sequencing | Beat Street |
| **Memory** | working memory, recall sequences, match pairs | Memory Meadow |
| **Social-emotional (SEL)** | naming feelings, empathy, patience, sharing, teamwork, courage | Friendship Plaza + all |

Each skill has discrete **micro-skills** with a mastery model (§11). Content authored as data so curriculum specialists can add/tune activities without code (§ technical).

### 7.3 Learning integrity
- Every activity tagged with `{domain, skill, microSkill, difficultyBand, standardRef}`.
- **Parent reports** roll up real mastery (§13), not vanity metrics.
- Periodic **spiral review** (re-surface earlier skills inside new contexts) to consolidate memory.

---

## 8. Progression systems

Three parallel, child-legible progression tracks — all **earned by playing/learning, none purchasable**:

### 8.1 Player "Trainee → Legend" path (account)
- A friendly **Star Path** (a literal path of stars across a sky-map). Each Adventure adds a star; milestone stars unlock new districts, outfits, Star Pals, story episodes, and the player avatar's **own transformations**.
- Visual, non-numeric primary read (a filling constellation), with optional level number for parents.

### 8.2 Hero Stardom (per character)
- Each of the 6 heroes has a 3-stage **Stardom transformation** fueled by learning in their domain (§6.5). Bonding with a hero unlocks duets, voice lines, and their best choreography.

### 8.3 Skill mastery (invisible spine)
- Under the hood, each micro-skill tracks mastery 0–100% (§11). Drives difficulty and parent reports. Surfaced to the *child* only as gentle "you're getting so good at counting!" moments + badge stickers.

---

## 9. Companion systems (Star Pals)

### 9.1 Collection
- 30+ Star Pals at launch, themed per district (glow-fox, float-bunny, cheer-bird, cloud-pup, star-kitten…). Rescued through Adventures and events; never bought from a random box.

### 9.2 Companion progression ("Bonding")
- Each Star Pal has a **3-stage growth** (Sparkle → Twinkle → Radiant) via **daily care** and adventuring together:
  - **Feed** (spend Sparkles on treats), **Play** (a 20-sec micro-game), **Cuddle/Praise** (a tap of affection) → fills a **Bond meter**.
  - Higher Bond = cuter animations, a happy "helper" ability (better hints), and the ability to wear more accessories.
- **Nurture loop** is a gentle daily reason to return (responsibility, empathy — great SEL), with **zero guilt mechanics** (a neglected pet is just sleepy/sad-cute and instantly happy again on return — never "dies," never shames).

### 9.3 Companion utility (no power-creep, no combat)
- In quests: a Star Pal can **offer a hint**, **cheer**, or **reveal a hidden sparkle**.
- In performances: Star Pals **dance along** (spectacle).
- In the hub: decorate your clubhouse with your Star Pals and their accessories (self-expression + collection display).

---

## 10. Reward loops & reward systems

**Principle:** frequent, immediate, celebratory, and *meaningful to a 5–7-year-old* (cute > numbers). No randomized rewards.

| Reward | What it is | Source | Spend / purpose |
|--------|-----------|--------|-----------------|
| **Sparkles** ✨ | soft currency | every activity, dailies | pet treats, avatar/pet/clubhouse cosmetics, district decorations |
| **Star Gems** ⭐ | progression token | learning quests | fills Star Path & hero Stardom (transformations) |
| **Star Pals** 🐾 | collectible pets | rescues, events | collection, care, helpers |
| **Concepts (outfits)** 👗 | cosmetic sets | play unlocks + parent-gated store | dress-up self-expression (also monetization, §15) |
| **Sticker Badges** 🏅 | mastery keepsakes | hitting skill milestones | sticker book (collection, pride) |
| **Memory Cards** 📖 | story/lore pages | exploration & milestones | storybook (optional depth) |

**Reward cadence:** something delightful every **~30–60 seconds** of play (a sparkle, a "great trying!", a Star Pal giggle), a **bigger reward** every Adventure (a Star Pal / outfit piece / transformation), and a **milestone celebration** daily/weekly. **Variable-ratio "loot box" psychology is explicitly avoided**; rewards are predictable and fair (trust > addiction).

---

## 11. Difficulty scaling (adaptive, child-safe)

### 11.1 Per-skill mastery model
For each micro-skill the game tracks a rolling **mastery estimate** (correct/attempts, time-to-answer, hint usage). Three **difficulty bands** (Discover → Practice → Master) are selected **invisibly** to keep the child in flow (the ZPD "sweet spot": ~80% success).

```
if recentSuccess > 0.85 and lowHintUse  → nudge band up (gently)
if recentSuccess < 0.55 or highHintUse  → nudge band down + add scaffolding
else → hold band, vary context (spiral review)
```

### 11.2 Scaffolding ladder (on a wrong answer — never a fail)
1. Encouraging retry ("Almost! Try again 💛").
2. **Hint** (highlight, eliminate one wrong option, re-speak the prompt).
3. **Model** (mentor/Star Pal shows how, then child does it) → guaranteed success → confidence preserved.

### 11.3 Comfort & autonomy
- **No timers that fail you.** Optional "race the sparkle" *bonus* timers exist only as opt-in flair, never gating.
- **Parent override:** difficulty can be locked to a band or to a child's age in the Parent Zone.
- **Re-playable** at any band for mastery and for the joy of repetition (which young kids love).

---

## 12. Retention systems

Age-appropriate retention = **gentle ritual + wonder + nurture**, never streak-shame or FOMO aimed at a child.

- **Daily Sparkle** login gift (cute, escalating across the week, fully forgiving if missed).
- **Today's Adventure:** one curated, fresh quest each day (5–10 min) — the core habit.
- **Pet care ritual:** Star Pals are happy to see you (nurture pull, §9).
- **Star Path** always shows the "next star" just ahead (visible near-term goal).
- **Weekly Concert** event (§14) gives a reason to come back across the week.
- **Seasonal wonder** (§16): new districts/songs/outfits keep the world growing.
- **Win-back, not guilt:** a returning child gets a warm "We missed you!" gift and an easy re-entry quest. Never "you lost your streak."
- **Parent-set session limits** are respected by design (the game *helps* a child stop: a gentle "great session — see you tomorrow!" wind-down, never a cliffhanger that fights bedtime).

---

## 13. Daily activities

A clean 5–15 minute daily menu (all optional, all forgiving):
1. **Daily Sparkle** claim.
2. **Today's Adventure** (1 curated learning quest).
3. **Pet Care** (feed + play + cuddle your Star Pals).
4. **Practice Stage** (one short rhythm song or a skill mini-game of the child's choice).
5. **Daily Sticker** (a mastery badge for effort that day).

Completing the day's menu fills a small **"Day Star"** and a friendly celebration — the daily "I did it!" ritual.

---

## 14. Weekly events

| Cadence | Event | Loop | Reward |
|---------|-------|------|--------|
| Weekly | **Comeback Concert** | a featured song + group performance with a rotating hero; practice all week, "premiere" on the weekend | exclusive outfit piece, Star Pal accessory, Star Gems |
| Weekly | **Mystery District Day** | a hidden mini-district opens with themed quests | a guest Star Pal |
| Weekly | **Friendship Quest** | a co-op-flavored SEL story (help a friend) | SEL sticker, clubhouse decor |
| Rotating | **Skill Spotlight** | extra rewards for practicing a chosen domain (e.g., "Math Week") | bonus Sparkles, badge |

No competitive leaderboards. "Events" = fresh content + collection, never ranked pressure.

---

## 15. Monetization strategy (kid-safe, parent-trusted)

**Model: Free-to-try + parent-gated Subscription, no ads, no gacha, no pressure on children.** This is the ethical and platform-compliant standard for the Kids category.

### 15.1 Structure
- **Free tier:** the first district (Storybook Square) + core loop + 1 hero + a few Star Pals fully free — enough to fall in love and for parents to evaluate.
- **"Little Legends Pass" subscription** (parent-gated, monthly/annual, family-sharing): unlocks **all districts, all heroes, full curriculum, all events, parent dashboard pro reports.** Power/learning is *behind one fair gate*, not nickel-and-dimed.
- **One-time "Forever" unlock** option for parents who dislike subscriptions (buy the game once).
- **Optional cosmetic packs** (outfits/Concepts, clubhouse decor) — **parent-gated, fixed-price, fully previewed, never randomized, never pressured to the child.** Most cosmetics are *also earnable* with Sparkles through play.

### 15.2 Hard rules (compliance & trust)
- **No third-party ads. No ad SDKs. No behavioral advertising.**
- **No loot boxes / gacha / randomized purchases.**
- **No purchase or social action reachable by the child** — everything sensitive is behind a **Parental Gate** (a "hold the button" / multi-digit task an adult passes, e.g., "tap the numbers 4-7-1").
- **No FOMO timers aimed at kids; no manipulative urgency.**
- **COPPA / GDPR-K compliant:** minimal data, no selling data, no profiling of children, parental consent flows.
- **No open chat / no UGC sharing with strangers.** Sharing (photo mode) exports to the *parent's* device to share, gated.

### 15.3 Why it's also good business
Parents *pay for trust and outcomes.* A safe, ad-free, demonstrably educational game with a beloved cast earns **subscription LTV + word-of-mouth among parents** (the strongest UA channel in kids' apps), and cosmetic depth provides gentle upside — without ever exploiting a child.

---

## 16. Seasonal content plan

**Seasons ≈ 6–8 weeks**, themed like a magical idol "era," keeping the world alive and giving marketing a beat.

| Season | Theme | New content |
|--------|-------|-------------|
| **S1 — Debut Days** | onboarding & the city | core 6 districts, starter heroes/pals, the pilot story |
| **S2 — Rainbow Festival** | color & creativity | Rainbow Studio expansion, art quests, festival outfits, paint Star Pals |
| **S3 — Starlight Winter** | cozy & memory | Memory Meadow snow event, lullaby songs, warm-cocoa cosmetics |
| **S4 — Big Concert Tour** | music & teamwork | new songs, group-performance episodes, tour outfits |
| **S5 — Bloom Spring** | growth & SEL | feelings-focused stories, garden district, kindness events |
| **S6 — Galaxy Explorers** | wonder & math | space-market math quests, comet Star Pals, cosmic transformations |

Each season ships: **1 story chapter, 1–2 new songs, a new district or district-expansion, a Concept (outfit) line, 2–4 new Star Pals, a tentpole event,** and **fresh curriculum content** (new skills + spiral review). Limited cosmetics **always return** within a couple of seasons (no permanent FOMO).

---

## 17. UX/UI for pre-readers

- **Audio-first:** every button, prompt, and bit of text is **spoken on tap** (tap-to-hear everywhere). Nothing requires reading to navigate.
- **Icon + character-driven nav**, huge touch targets (≥ 9–10mm), max ~4 choices on screen, generous spacing.
- **Portrait, one-handed default.** Consistent "home" and "back" anchors.
- **Juice:** confetti, squash-and-stretch, warm SFX, haptics, character reactions — the game *feels* alive and rewarding.
- **No dead-ends, no modal mazes.** A child is never more than one tap from "play."
- See the legacy concept playable (`/index.html`) for movement/feel; production UI per Art Bible.

---

## 18. Audio & music direction

- **Original K-pop-inspired kids' tracks** — bright, melodic, simple sing-along hooks, clean production, age-appropriate lyrics about friendship, trying, and shining. (All original; full rights cleared.)
- Each hero has a **signature genre** (anthem-pop, dance-pop, bubblegum, synth-pop, chill-pop) — see bible.
- **Full voice-over** for mentors, heroes, and all instructions/prompts (warm, encouraging, diverse voices). Launch VO: EN, KO, JA; text-loc for more.
- **Adaptive music** in hub/districts; performance songs are the gameplay centerpiece.
- Independent volume sliders (music / voice / SFX); "calm mode" softens everything.

---

## 19. Accessibility features

- **Pre-reader / non-reader full support** (everything narrated; icon nav).
- **Colorblind-safe** (color + shape + label for every learning cue; never color alone).
- **Reduced-motion / Calm mode** (dampened particles, screen movement, brightness; slower pacing).
- **Adjustable text size**, optional **dyslexia-friendly font**, **captions/subtitles** on all voiced content.
- **No-time-pressure** is the default; timing only ever earns *bonus*, never gates.
- **Generous timing windows** in rhythm; **left-handed** layout; remappable tap zones.
- **One-handed portrait**; large targets; **mis-tap forgiveness** (no destructive actions reachable by accident).
- **Independent audio channels**, haptics on/off.
- **Difficulty floor for younger/SEN children** (parent-set "Discover" lock).
- **Screen-reader-friendly** labels where the OS supports it.

---

## 20. Parent features (the "Parent Zone")

Reachable only via **Parental Gate**.
- **Dashboard:** time played, sessions, skills practiced, **mastery progress per domain**, recent badges — *real learning data, plainly explained.*
- **Educational reports:** weekly summary ("Maya is mastering counting to 20 and starting addition!") with simple at-home tips.
- **Controls:** daily **time limits** + scheduled play windows + **gentle wind-down** at limit; **difficulty** lock/age setting; **subject focus** (emphasize/relax domains); content/season toggles.
- **Safety assurances surfaced:** "No ads. No chat. No data sold. All purchases require this gate."
- **Account & privacy:** COPPA/GDPR-K consent, data export/delete, multiple child profiles (siblings), offline-play status.
- **Purchase management:** subscription status, restore, family sharing, spend history.

---

## 21. Difficulty, safety & content guardrails (summary)
- No violence, no scary imagery, no peril, no death (pets included).
- No failure states; mistakes always lead to support + eventual success.
- No comparison/ranking of children; no stranger contact; no open-ended text input from kids.
- Inclusive, diverse cast and citizens; positive body image; kindness as the core value.

---

## 22. Technical notes (for the build team — full TDD to follow)
- **Engine:** Unity 6 (URP), mobile-optimized stylized 3D (see Art Bible budgets). Target 60fps on mid-tier phones, graceful fallback to 30fps; works on older/cheaper devices common in family households.
- **Offline-first:** core single-player content playable offline; sync progress/reports when online. (Family travel/car play.)
- **Data-driven content:** quests, activities, drop tables, events, seasons, curriculum tags authored as data (ScriptableObjects + remote config) so designers/curriculum specialists add content without code.
- **No third-party ad/analytics SDKs that profile children;** privacy-preserving, aggregate-only telemetry for learning efficacy and crash/health.
- **Accessibility & localization** built into the UI framework from sprint 1 (audio-first string + VO pipeline).
- The repo's `/index.html` Three.js build remains a **web concept-playable** for stakeholder demos; the shipping client is Unity.

---

## 23. Production roadmap (high level)
1. **Pre-production (8–10 wks):** vertical slice — one district (Storybook Square), one hero (Rumi), core loop ⑦⑧, 3 Star Pals, 1 song, adaptive-difficulty prototype, parent gate. Validate with real 5–7 playtesters + an educational advisor.
2. **Production (6–9 mo):** all 6 districts, 6 heroes, 30+ Star Pals, full curriculum content library, dress-up/Concepts, parent dashboard, audio/VO, localization pipeline.
3. **Soft launch (6–8 wks, limited region):** tune difficulty/retention/learning efficacy + parent funnel + subscription.
4. **Global launch + Season cadence (§16).**
- Continuous: curriculum efficacy studies, accessibility audits, kid-safety/compliance reviews each release.

---

## 24. Success metrics
**Learning (primary):** measurable mastery gains per domain; quest completion with declining hint-reliance; parent-reported satisfaction with educational value.
**Engagement (healthy):** D1/D7/D30 retention, daily-ritual completion, Star Pal collection rate, season participation — *interpreted through a "healthy play" lens* (we are happy when a child plays their 15 minutes and stops).
**Trust (the moat):** parent review sentiment, subscription retention, refund rate, zero safety incidents.

> The win condition: a five-year-old begs to "play Little Legends," and their parent is *glad* to say yes.
```
```
