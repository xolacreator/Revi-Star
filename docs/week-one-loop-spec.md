# The Week-One Loop — Milestone Spec (Smallest Viable Test)

> **Hypothesis under test (the only one):**
> *"A child ages 5–7 willingly returns for 7 consecutive days, AND the parent can clearly see educational value."*
>
> Everything in this milestone exists to validate that sentence with the **fewest features possible.** Built on the existing Harmony Harbor slice + the Unity-bound data model — but the *test* can ship on the current web build.

## North-star framing
- **Child question:** *"Do I want to come back tomorrow?"* → answered by variety + visible daily growth + a daily wow.
- **Parent question:** *"Is this actually teaching my kid?"* → answered by a 30-second dashboard + a daily "here's what they practiced."
- **Our question:** *Do we have the foundation of a product both want?* → answered by 7-day retention + a measurable reading gain + parent intent.

## What we deliberately are NOT building (scope fence)
❌ Other heroes ❌ Other districts ❌ Full dress-up store ❌ Pet *care* depth ❌ Story cutscene production ❌ Accounts/cloud ❌ Social ❌ Monetization/store ❌ Notifications infra ❌ Polished final art/VO.
*Minimal avatar (3 picks), minimal Twinkle (bond bar), one district (Harmony Harbor), one hero (Rumi), reading only.*

---

## 1. Week-One Progression Map

Three things visibly grow **every day** (so progression is felt daily), with a marquee finale on Day 7. Reading skill climbs a coherent literacy ladder.

| Day | Adventure (story wrapper) | Reading skill focus | **Avatar** (the child) | **Rumi** | **Twinkle** | Daily wow / reward |
|-----|---------------------------|---------------------|------------------------|----------|-------------|--------------------|
| **1** | "Welcome to the Harbor" | Letter **sounds** | **Create avatar** → ⭐1 | Trainee → **Rising Star** | Rescue → **Form 1 (Sparklet)** | Rumi's first transformation |
| **2** | "The Lost Letters" | Letter sounds + **first sound (onset)** | ⭐2 + **hat** unlock | (holds) | bond + | New hat for your avatar |
| **3** | "Reading the Signs" | **Sight words** / word↔picture | ⭐3 | (holds) | **Form 2 (Glimmerfox)** evolve | Twinkle evolves! |
| **4** | "Blending Bay" | **Blend CVC** (c-a-t) | ⭐4 + **cape** | Rising → **Harmony Hero** | bond + | Rumi relights the big lighthouse |
| **5** | "Rhyme Reef" | **Rhyming** | ⭐5 | (holds) | bond + | A rhyme dance + sticker |
| **6** | "Story Tide" | **Short sentences** + comprehension | ⭐6 + **accessory** | Harmony → **Spotlight Guardian** | bond + | Rumi's spotlight transformation |
| **7** | "The Big Comeback" | **Review (spiral all)** as a concert | ⭐7 → **"Star Hunter" badge** | Spotlight → **Legend Idol** (finale) | **Form 3 (Radiant)** | Finale concert + a printable certificate |

Design rules:
- **No repeated content.** ~6 activity templates rotate with **fresh words/items every day** (item bank below); a child never sees the same task twice.
- **Daily near-term goal visible:** the end-of-session "tomorrow" tease shows *what's next* ("Tomorrow: help Twinkle evolve!").
- **The child's avatar grows alongside Rumi** — the identity flip ("*I* am becoming a hero").

---

## 2. Daily Activity Schedule (5–10 min/day)

**Session shape (every day):**
```
① Return greeting + "what's new today" (15–30s, voiced)
② Short explore beat — walk to today's spot / pick the glowing adventure (~45s)
③ TWO learning micro-activities (fresh content, adaptive, no-fail)  ~3–5 min
④ Progression beat: avatar ⭐ + (Rumi or Twinkle advance) + daily reward  ~1 min
⑤ "Come back tomorrow!" tease (previews tomorrow's growth)  ~15s
⑥ → Parent takeaway card generated ("Here's what your child practiced today")
```

**6 reusable activity templates** (data-authored; this IS the content pipeline seed):
1. **Sound Match** — letter → its sound.
2. **First Sound** — which picture starts with /x/.
3. **Word↔Picture** — match sight word to image.
4. **Sound Blend** — tap c-a-t in order to read it.
5. **Rhyme Time** — pick the word that rhymes.
6. **Read the Sign** — tap to read a 2–3 word phrase; answer one comprehension tap.

**Daily template assignment (no-repeat content):**
| Day | Activity A | Activity B | Sample fresh items |
|-----|-----------|-----------|--------------------|
| 1 | Sound Match | First Sound | s, m, t · sun/mop/top |
| 2 | First Sound | Sound Match | b, d, f · ball/dog/fish |
| 3 | Word↔Picture | Read the Sign (2-word) | cat, dog, sun · "go home" |
| 4 | Sound Blend | Word↔Picture | cat, pig, bus · hat/red/cup |
| 5 | Rhyme Time | First Sound | cat-hat, sun-bun · p, r, l |
| 6 | Read the Sign (3-word) | Sound Blend | "the big dog" · map, net, sit |
| 7 | Mixed Review (4 quick items across skills) — "concert" | — | spiral of week's items (new words) |

> **Item bank target for the test:** ~40–50 unique items across the 6 templates (cheap to author as data; proves the pipeline). No child exhausts or repeats content within 7 days.

---

## 3. Parent Dashboard Specification (<30s comprehension)

Opens behind the Parental Gate. **One screen, three bars, one sentence.** A busy parent "gets it" in a glance.

```
┌──────────────────────────────────────────┐
│  Maya · Day 3 of 7   🔥 3-day streak       │
│                                            │
│  📖 Reading      ▓▓▓▓▓▓░░░  Growing!        │
│  💪 Confidence   ▓▓▓▓▓▓▓░░  Growing!        │
│  ⭐ Week Streak  ●●●○○○○                    │
│                                            │
│  ✅ Today, Maya practiced READING:          │
│     • Matched 6 words to pictures           │
│     • Read the sign "go home"               │
│     • Tried 8, got 7, used 1 hint           │
│     "She's reading sight words on her own!" │
│                                            │
│  Starting Stars ⭐4/10  →  (post-test after Day 7) │
└──────────────────────────────────────────┘
```

Spec details:
- **Reading bar** = mastery across the week's skills (from the mastery model; 0–100%, labeled *Just starting → Growing! → Shining*).
- **Confidence bar** = **independence proxy** (see §4): `100 × (independentCorrect / attempts)` smoothed over days + persistence. Framed warmly as "Confidence," never a grade.
- **Week Streak** = 7 dots; today's lit; **forgiving** (a missed day is just unlit, no shame).
- **Daily takeaway (the required "here's what your child practiced today"):** auto-generated from the day's activity log — 2–3 plain-language bullets + one warm one-liner. Available as a **post-session card** (push-style, parent-gated) *and* archived in the dashboard.
- **Pre/Post "Stars":** shows the pre-test baseline; reveals the post-test result after Day 7 as a celebratory "look how far!" delta.
- **Hard rules:** no jargon, no comparison to other kids, no red/negative framing, ≤ one screen, readable in <30s. (Validate the <30s claim in testing.)

---

## 4. Analytics Specification

**Event taxonomy** (privacy-safe, aggregate, COPPA — no child PII):
| Event | Key fields |
|-------|-----------|
| `app_open` | profileId(anon), ts |
| `day_start` | dayIndex(1–7) |
| `activity_start` | templateId, skillId, dayIndex |
| `activity_item` | skillId, correct(bool), attempts, hintsUsed, modeled(bool), firstTryCorrect(bool), ms |
| `activity_complete` | templateId, skillId, itemsCorrect, itemsTotal |
| `day_complete` | dayIndex, durationSec, avatarStar, rumiStage, twinkleForm |
| `reward_claimed` | dayIndex, rewardType |
| `avatar_created` | choices |
| `tease_shown` / `next_day_returned` | fromDay, gapHours |
| `pretest_item` / `posttest_item` | skillId, correct |
| `parent_gate_pass`, `dashboard_view`, `takeaway_view` | ts |
| `parent_satisfaction` | rating(1–5), wouldContinue(bool), wouldPay(bool) — 1-tap, parent-gated |
| `child_excitement_proxy` | replayClicked(bool), askedAgain(parent-marked), sessionAbandoned(bool) |

**Derived metrics (the dashboard for US):**
| Metric | Definition | Why |
|--------|-----------|-----|
| **D1 retention** | returned for Day 2 | first habit signal |
| **D3 retention** | reached Day 3 (within 4 calendar days) | mid-week pull |
| **D7 retention** | completed Day 7 (within 9 calendar days) | **the hypothesis** |
| **Hint usage rate** | hintsUsed / items, per day → trend | should **decline** |
| **Independent reading attempts** | firstTryCorrect & 0 hints / items | competence/confidence |
| **Modeled rate** | modeled items / items | over-reliance flag |
| **Avg session length** | day duration | fit to 5–10 min |
| **Day-completion rate** | days completed / days started | drop-off points |
| **Pre→Post gain** | post − pre (parallel items) | **learning validation** |
| **Parent satisfaction** | mean rating; % wouldContinue; % wouldPay | adoption/monetization signal |
| **Child excitement** | % replay/asked-again; % abandoned | delight signal |

**Observation points (moderated Day-1 + at-home Days 2–7):**
- Day 1 in-person: time-to-first-smile, independence (adult interventions), reaction to transformation/Twinkle, "play again?" (reuse the user-testing kit checklist).
- Days 2–7 at home: a **30-second nightly parent micro-survey** (1-tap: did they ask to play? excitement 😐🙂😄; rating) + automatic event capture. Parent logs which days the child *initiated*.

---

## 5. Learning Validation — Pre/Post "Star Check" (<3 min each)

A short, in-world, **no-fail-feeling** quiz framed as **"Twinkle's Star Check"** (a fun game, not a test). Administered **before Day 1** (baseline) and **after Day 7** (result).

**10 items, ~15s each (~2.5 min), spanning the week's ladder:**
| # | Skill | Item style |
|---|-------|-----------|
| 1–3 | Letter sounds | "Which says /s/, /b/, /t/?" |
| 4–5 | First sound | "What starts 'fish'? 'moon'?" |
| 6–7 | Sight words | match word→picture (the, go) |
| 8–9 | Blend CVC | read 'cat', 'pig' |
| 10 | Rhyme | "What rhymes with 'sun'?" |

Rules:
- **Transfer items:** use words *parallel but NOT identical* to practiced content (measures real skill, not memorized answers).
- **Scored hint-free** (hints disabled in the Star Check; but still gentle/no-fail tone — every kid finishes and gets a star).
- Output: **Stars 0–10**, stored as `pre` and `post`; parent sees baseline then the celebratory delta.

---

## 6. Success Criteria — *justify building more heroes & districts*

Test cohort: **~20 recruited, engaged families** (parents who opted into a 7-day study — so thresholds assume motivated users; soft-launch funnels will be lower and judged separately).

**GO (build breadth) if ALL of:**
- **Retention:** D1 ≥ **80%**, D3 ≥ **60%**, **D7 ≥ 50%** complete all 7 days.
- **Self-initiated return:** child *asks to play* on ≥ **4 of 7** days (parent-logged) for ≥ 60% of kids.
- **Learning gain:** **median Pre→Post +2 stars** (e.g., 4→6+), and ≥ **70%** of children improve; gains hold on **transfer** items.
- **Independence:** hint-usage **declines** week-over-week; independent-attempt rate **rises**.
- **Parent value:** ≥ **80%** understand the dashboard in <30s; ≥ **75%** agree *"I can clearly see what my child is learning"*; ≥ **50%** *"I would pay/subscribe."*
- **Delight:** ≥ **70%** show repeated unprompted excitement (esp. at transformations/Twinkle).

→ Meeting these proves both halves of the hypothesis → **green-light a 2nd hero + 2nd district** (and the content pipeline investment).

## 7. Failure Criteria — *a pivot is needed*

**PIVOT / RETHINK if ANY of:**
- **Retention collapse:** **D7 < 25%**, or a steep daily cliff (most quit by Day 2–3) → the daily-return engine doesn't work.
- **No learning:** Pre ≈ Post, **or** gains only on *identical* practiced items (no transfer) → it entertains but doesn't teach.
- **Parent value fails:** < **40%** "can see the learning," dashboard confusing, or **wouldPay < 25%** → no business with parents.
- **Novelty-only delight:** excitement high on Day 1 but **flat by Day 3** → the wow doesn't survive repetition.
- **Pattern-tapping:** high success but high **modeled rate** + no independence growth → kids are gaming the no-fail, not reading.

**Pivot levers (if we land in the middle):** if kids return but don't learn → deepen activity rigor/adaptivity. If they learn but don't return → strengthen progression/collection/daily hook. If child loves it but parents don't → invest the dashboard + a guided "parent moment." Diagnose with the §4 metrics before changing course.

---

## Build checklist to run this test (minimal)
1. Avatar creation (3 picks: skin, hair, color) + 7-star Star Path + 4 daily cosmetic unlocks.
2. Day controller (7 days, return detection, tomorrow-tease) over the existing slice.
3. 6 activity templates + ~40–50 item data bank (the pipeline seed).
4. Rumi 5-stage + Twinkle 3-form progression wired to days.
5. Mastery + independence tracking → **parent dashboard** + nightly **takeaway card** (behind a parental gate).
6. Pre/Post "Star Check."
7. Analytics events + a simple results readout; nightly 1-tap parent survey.

> Goal is **maximize learning about the hypothesis, not features.** If this passes, breadth becomes a confident scaling decision; if it fails, we've spent weeks — not a year — to learn it.
