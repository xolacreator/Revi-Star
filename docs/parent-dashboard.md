# Parent Dashboard — The Parent Zone

> **Goals:** demonstrate educational value · encourage healthy screen time · track learning progress.
> **Tone:** growth & confidence, **never** competitive pressure or comparison to other children.
> Parents should **immediately understand what their child is learning.**

---

## 1. Access & safety

- **Parental Gate** on every entry: an adult-only task (e.g., "Press and hold, then tap 4 – 7 – 1"). Blocks all settings, purchases, and data — kids can't wander in.
- **The same gate guards:** purchases/subscription, time settings, profile/privacy, and data export/delete.
- Surfaced reassurance banner: *"No ads · No chat · No data sold · Purchases require this gate."*

## 2. Dashboard home (at-a-glance)

A warm, plain-language summary a parent reads in 10 seconds:
```
┌─────────────────────────────────────────────┐
│  Maya · Age 6 · 🟢 Healthy play today        │
│  This week: 4 days · 52 min · 18 missions ✨  │
│                                              │
│  📖 Reading   ▓▓▓▓▓▓▓░░  Growing strong       │
│  🔢 Math      ▓▓▓▓▓░░░░  Making progress      │
│  🧩 Logic     ▓▓▓▓▓▓░░░  Growing strong       │
│  🎵 Rhythm    ▓▓▓▓▓▓▓▓░  A favorite!          │
│  🧠 Memory    ▓▓▓▓░░░░░  Just starting        │
│  🎨 Creativity▓▓▓▓▓▓▓░░  Loves this           │
│                                              │
│  🌟 This week Maya started reading 3-letter   │
│     words and counting to 20!                 │
└─────────────────────────────────────────────┘
```
- Progress shown as **friendly bars + warm labels** ("Just starting → Making progress → Growing strong → Shining"), **never** grades, percentiles, or rank.

## 3. Sections

### 3.1 Reading progress
- Sub-skills: letter ID, letter sounds, rhyming, blending, sight words, comprehension — each with a growth bar + a plain note ("knows 18 sight words").
- A short list of **words/sounds recently mastered**.

### 3.2 Math progress
- Sub-skills: counting, number ID, comparing, sequencing, adding/subtracting within 10 — growth bars + notes ("counts to 20; starting to add").

### 3.3 Other domains
- Logic, Patterns, Memory, Creativity, and **Social-Emotional (SEL)** each get a card: what it is, why it matters, current growth, recent wins.

### 3.4 Learning streaks (gentle)
- A **calendar of stars** for days played/learned — celebratory, **never punishing**. Missing days simply aren't lit; no "streak lost" shame. Encourages routine, protects wellbeing.

### 3.5 Areas of improvement (framed as "next adventures")
- Phrased positively: *"Maya is ready to explore more rhyming — try Harmony Harbor together!"* with a one-tap **"Suggest this next"** that gently weights tomorrow's content.
- **At-home tips:** one tiny real-world activity per area ("Count stairs as you climb!").

### 3.6 Time spent & healthy screen time
- Today / this week minutes + session count, with a **healthy-play indicator** (green/amber based on the parent's own limits).
- Encourages balance: a friendly note when limits are reached ("Great session — time to play outside! 🌳").

## 4. Controls (parent-set)

| Control | Options |
|---------|---------|
| **Daily time limit** | off / 10 / 15 / 20 / 30 min + custom |
| **Play schedule** | allowed time windows (e.g., after dinner) |
| **Wind-down** | gentle 2-min warning + calm stop (never a cliffhanger fighting bedtime) |
| **Difficulty** | auto-adaptive (default) / lock to age / lock to a band |
| **Subject focus** | emphasize or relax any domain |
| **Content** | toggle seasons/events; calm/reduced-stimulation mode |
| **Audio/Accessibility** | volumes, narration speed, captions, reduced motion, dyslexia font |

## 5. Reports

- **Weekly summary email/notification** (opt-in): "Maya's week" — minutes, top domain, 2–3 concrete wins, one suggested at-home activity. Warm, brief, jargon-free.
- **Monthly milestone card**: a shareable (parent-gated) "look how Maya grew!" keepsake.
- All reports celebrate **effort and growth**, never compare to other kids or to "grade level" as a judgment (optional curriculum-alignment note available for curious parents, framed supportively).

## 6. Multiple children
- **Per-child profiles** (siblings), each with its own avatar, progress, limits, and reports. Quick switch behind the gate; kids can't switch profiles themselves.

## 7. Privacy & compliance (parent-facing)
- **COPPA / GDPR-K compliant**; verifiable parental consent on setup.
- **Data minimization:** only learning-progress + health data needed for the dashboard; **no behavioral ad profiling, no selling/sharing data.**
- **No third-party ad SDKs.**
- One-tap **export** and **delete my child's data**.
- Clear, plain-language privacy summary (not just a legal wall).

## 8. Account & purchases
- Subscription status & management, restore purchases, family sharing.
- Spend history; all purchases require the gate; **no purchase prompts ever shown to the child.**

## 9. Design principles (recap)
1. **Clarity in 10 seconds** — a busy parent gets it instantly.
2. **Growth, not grades** — confidence over comparison.
3. **Healthy play is a feature** — the dashboard helps kids *stop*, not just play more.
4. **Trust by transparency** — safety and privacy stated plainly, up front.

> Data sources: the per-skill mastery model + privacy-safe telemetry defined in `learning-design.md` §5 and `unity-architecture.md` (analytics). Layout components: `unity-architecture.md` (UI framework).
