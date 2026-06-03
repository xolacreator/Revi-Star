# Three-Day Proof — Recruiting & Testing Kit (Field Manual)

> Purpose: make **every playtest produce trustworthy data**. Tests Milestone A1 (`index.html` + `a1.js`).
> **Hypothesis:** *children voluntarily return for Day 2 & Day 3, and parents feel good about saying yes.*
> **Disclaimer:** the consent language below is a plain-English template — have it reviewed by legal/IRB for your jurisdiction (COPPA / GDPR-K) before use.

## Study design at a glance
- **Cohort:** 10–20 families · children **5–7** · mixed reading ability · mixed gaming familiarity.
- **Duration:** 3 real calendar days (voluntary return is the point — don't compress with `?day=`).
- **Structure:** **Day 1 moderated** (in-home or video) → **Days 2 & 3 parent-facilitated at home** → **interviews after Day 3**.
- **Data sources:** (a) app **analytics export** (JSON from the Parent panel), (b) **observation checklist**, (c) **nightly parent micro-log**, (d) **interviews**, (e) optional **video** (separate consent).
- **Setup per session:** device with sound on; Day 1 add `?observe=1` for the Time-to-Delight bar; one child profile per device; `?reset=1` before a brand-new participant.

---

# 1. Participant Recruiting Guide

### Who we want (sampling matrix — aim to fill each cell)
| | Gaming: Low | Gaming: Medium | Gaming: High |
|---|---|---|---|
| **Reading: Emerging** (knows some letters) | ✔ | ✔ | ✔ |
| **Reading: Developing** (sounds out CVC) | ✔ | ✔ | ✔ |
| **Reading: Confident** (reads simple sentences) | ✔ | ✔ | ✔ |
Target ~1–2 families per cell; ensure **both 5s and 7s**, and a gender mix.

### Channels
Local preschools/K classrooms, parenting Facebook/WhatsApp groups, library story-time lists, pediatric/SLP waitlists, employee-family referrals (non-team), recruiting panels (e.g., User Interviews, dscout). Avoid recruiting only "gamer" or only "edtech-enthusiast" families.

### Screening questions (ask the parent)
1. Child's **age** (must be 5, 6, or 7). 
2. **Reading level** — pick one: "knows some letters / sounds out small words / reads simple sentences."
3. **Gaming familiarity** — "how often does your child use a tablet/phone game?" (rarely / weekly / daily).
4. **Device** — do you have an **iOS or Android tablet/phone** with sound for ~10 min/day? (tablet preferred).
5. **Language** — is your child comfortable with **spoken English** instructions? (current build is EN-only).
6. **Availability** — can your child play **~10 min on 3 different days** this week?
7. **Consent** — are you willing to sign a consent form and let us see in-app activity + a short nightly note?
8. (Optional) Comfortable with a **short video** of the Day-1 session? (not required to participate).

### Exclusion criteria
- Outside the 5–7 age range.
- No compatible device / no audio.
- Cannot commit to 3 separate days.
- Not comfortable with spoken English (until localized builds exist).
- **Prior exposure** to this prototype, or child of a project team member.
- Uncorrected vision/hearing needs the current build can't accommodate (note for a future a11y-specific study).
- Parent unwilling to provide consent or basic observation notes.

### Incentive & ethics
- A modest thank-you (e.g., $25–40 gift card) **for participation, not performance** — paid even if they stop early.
- Voluntary; withdraw anytime; no pressure on the child to "do well."

### Recruiting message template
> **Help shape a new reading game for ages 5–7! 📚✨**
> We're testing a playful, no-pressure reading adventure and want your child's honest reactions. If your child is **5–7**, you have a **tablet/phone**, and they can play **~10 minutes on 3 different days this week**, we'd love your help. There are **no right answers and no way to "lose."** You'll get a **[$XX gift card]** as thanks. Interested? Reply and we'll send a few quick questions. *(Participation is voluntary; you can stop anytime.)*

---

# 2. Parent Consent Script (template)

> **What this is.** Your child will play a reading game on 3 days (~10 min each). We want to learn what's fun, what's confusing, and whether it helps reading confidence.
> **What we collect.** In-app activity (which tasks they tried, hints used, scores on a short "Star Check"), our observation notes, and a short nightly note from you. **We do not collect your child's full name, photos, or contacts in the app.** Any name you tell us is replaced with a **participant code (e.g., F07)**.
> **Optional video.** With your separate permission, we may record the **Day-1 session** to review reactions. You can decline and still participate. Video is stored securely and deleted after analysis.
> **How we use it.** Only to improve the product, in aggregate. **No ads, no selling data, no sharing outside the research team.**
> **Your rights.** Participation is voluntary. You or your child may **stop anytime**, skip anything, and **request deletion** of your data.
> **Child assent.** Please tell your child: *"You can play, and you can stop whenever you want. It's just for fun."*
>
> ☐ I consent to my child's participation and the data described above.
> ☐ (Optional) I consent to **video/audio** recording of the Day-1 session.
> ☐ I am the parent/legal guardian.
> Name: ________  Participant code: ____  Date: ____  Signature: ________

---

# 3. Moderator Guide

**Your job:** create a calm, neutral space and **let the game do the teaching.** You are a fly on the wall, not a tutor or a cheerleader.

### Before the session (checklist)
☐ Consent signed (and video opt-in noted) ☐ Device charged, **sound on**, volume comfortable ☐ Open the link; for Day 1 append **`?observe=1`** ☐ Fresh profile (`?reset=1` for a new participant) ☐ Quiet room, child seated comfortably, parent nearby but not hovering ☐ Observation sheet + pen / timer ready ☐ Tell the child the one rule: *"There are no wrong answers — just have fun."*

### ✅ Moderators CAN say
- Neutral logistics: *"Whenever you're ready, you can start."* / *"You can hold it however is comfy."*
- Neutral re-direction to the game: *"What do you think you could try?"* / *"What does the game want you to do?"*
- Process care: *"We can take a break anytime."* / *"You can stop whenever you want."*
- Content-free acknowledgement of feelings: *"You're working hard."* (effort, not correctness).

### ⛔ Moderators CANNOT say
- **Any answer or hint** ("It's the S" / "Try the first one" / "Listen for the buh sound").
- **Correctness feedback** ("That's right!" / "Oops, not that one") — the game gives feedback; you don't.
- **Leading praise/pressure** ("You're so smart!" / "Almost! Keep trying that one").
- **Pointing, nodding, or eye-cues** toward the correct option.
- **Selling/priming** ("Isn't this cool?" / "Do you want to play tomorrow?") — that biases retention & interview answers.

### How to avoid coaching
- Sit **slightly behind or beside**, hands in lap. Let silences happen.
- **The 20-second rule:** if the child is stuck, **wait 20 seconds** — the game escalates hints and models the answer on its own. Only then offer the neutral *"What could you try?"* (never the answer).
- Resist filling pauses; young kids need processing time.
- Keep your face neutral-friendly; don't react to right/wrong.

### When intervention IS allowed
- **Technical failure** (crash, audio dead, frozen) → fix quietly, note the timestamp.
- **Child distress/frustration** → reassure (*"It's okay, you can't lose here"*), offer a break or to stop.
- **Safety / wellbeing** always overrides the protocol.
- **Truly stuck >30s** after the game's own model-the-answer step → neutral nudge only.
- **Navigation outside the activity** (child taps into the Parent gate) → gently redirect.
- Log every intervention (time + reason) — interventions reduce the "independence" signal.

### After each session
☐ Complete the observation checklist ☐ Day 1: **export JSON** (Parent panel 👪 → 3-7-1 → ⬇️ Export) and save as `F##_dayN.json` ☐ Note any tech issues ☐ Confirm the parent knows the Day-2/3 at-home steps (give them §5–7 parent cards).

---

# 4. Observation Checklist (one per session — printable)

Participant `F___` · Day `__` · Date `____` · Moderator `____`

| Signal | Capture | Notes |
|--------|---------|-------|
| **First smile** | time from start: `____s` (Observer bar / stopwatch) | what triggered it? |
| **First verbal excitement** ("wow!", "cute!", gasp) | time: `____s` | words used: |
| **First voluntary interaction** (taps to move/explore) | time: `____s` | |
| **Confusion moments** | tally: `▢▢▢▢▢` | where? (avatar / movement / which activity / dashboard) |
| **Hint usage (observed)** | 🔊 Hear-it ▢▢▢  ·  💡 Hint ▢▢▢ | which activities? |
| **Independent reading attempts** | first-try, no-hint correct: tally `▢▢▢▢▢` | |
| **"Model-the-answer" triggered** (2 misses) | tally `▢▢▢` | which skill? |
| **Parent reactions** | ▢ leaned in ▢ asked "what's this teaching?" ▢ surprised ▢ took photo/video ▢ neutral ▢ skeptical | quote: |
| **Voluntary replay / "again?"** | ▢ asked to replay ▢ asked about tomorrow (unprompted) | exact words: |
| **Disengagement** | ▢ looked away ▢ handed device back early ▢ fidgeting | when? |
| **Transformation reaction** (Rumi / Twinkle) | 😐 / 🙂 / 😄 + note | |
| **Interventions** | count + reason + time | |
| Session length | `____ min` | finished? ▢ yes ▢ no |

---

# 5. Day 1 Session Script (moderated)

**Goal:** capture Time-to-Delight, first-session engagement, the pre-test baseline, and whether the child *wants* tomorrow.

1. **Welcome (to parent + child).** *"Thanks for helping us! [Child], we have a fun reading game. Remember — there are no wrong answers, and you can stop whenever you want. Ready?"* Start your timer; open with `?observe=1`.
2. **Hand over the device.** Say nothing more. Observe: time-to-first-smile, first interaction (avatar creation), first "wow."
3. **Avatar creation → pre-test ("Star Check") → Day 1 play.** Do **not** help with the Star Check (it's hint-free by design). Mark Observer-bar buttons for first smile / first wow.
4. **During play:** follow Moderator Rules (§3). Tally confusion, hints, independent attempts; note the Rumi transformation + Twinkle rescue reactions.
5. **At "See you tomorrow!"** — do **not** prompt enthusiasm. Just observe: does the child *spontaneously* ask to keep playing or about tomorrow? (Strong signal.)
6. **Wrap (neutral).** *"All done for today! You can play the next part another day."* Export JSON. Do the **Child Interview (§9)** now while fresh.
7. **Brief the parent** on Days 2–3: give them the parent cards (§6–7) and the **nightly micro-log** (below). Emphasize: *"Please don't push them to play — we want to see if they choose to. If they ask, you can say yes."*

**Nightly parent micro-log (Days 1–3), 30 sec:** Did your child **ask to play** today (yes / no — who initiated)? Excitement 😐 🙂 😄. Anything notable?

---

# 6. Day 2 Session Script (parent-facilitated, at home)

Give the parent this card:
> **Day 2 — at home.** Sometime today, if your child is interested, open the game (same link). **Please don't pressure them** — we're learning whether they choose to come back. If they ask, great; help only with the device, not the answers. It's ~5–10 min. Afterward, fill the 30-second nightly log. (If the app says "come back tomorrow," tap 👪 → 3-7-1 → **Simulate next day** to unlock Day 2.)

**What we measure:** D1→D2 voluntary return (did the child initiate?), Day-2 engagement & hint trend (from JSON), continued delight (parent log). Moderator reviews the exported data + log; optional 5-min video call to observe.

---

# 7. Day 3 Session Script (parent-facilitated + post-test + interviews)

Parent card:
> **Day 3 — at home.** Same as Day 2 — let your child choose to return. After they finish Day 3, the game runs a short **"Star Check"** (don't help — it's just for fun) and shows a quick question for **you**. Then please do the short parent interview with us.

**Moderator (live or via call) after Day 3:**
1. Confirm Day 3 completed; collect the **post-test** score (Parent panel shows pre vs post; also in JSON).
2. Trigger the **Parent Re-Engagement** question if not already answered (Parent panel → it appears after Day 3).
3. **Export final JSON** (`F##_day3.json`).
4. Run the **Parent Interview (§8)** and a brief **Child Interview (§9)**.

---

# 8. Parent Interview Guide (max 10 questions)

Focus: educational value + willingness to allow future play. Keep neutral; let them talk.
1. In your words, **what did your child do** in the game over these 3 days?
2. Did your child **choose to come back** on Days 2 and 3, or did you suggest it? *(retention truth-check)*
3. **What's your child learning**, if anything? Can you point to something specific?
4. Did the **dashboard** (the grown-up screen) make sense? How long did it take to "get it"?
5. Did anything about it make you feel **good — or uneasy** — as a parent?
6. How did your child **react emotionally** — bored, delighted, frustrated, proud?
7. Was the **difficulty** about right for your child?
8. **If your child asked to keep playing this every day, would you encourage it?** Why / why not?
9. Would you **pay for** a version with much more content (a small monthly subscription)? *(weigh lightly — stated)*
10. What's the **one thing** you'd change?

---

# 9. Child Interview Guide (max 5 questions)

Playful, picture/point answers OK. Use 😢 🙂 😄 cards for ratings.
1. **Did you have fun?** (point: 😢 🙂 😄)
2. **What was your favorite part?** (let them point/tell — listen for Twinkle / transformation / reading / avatar)
3. **Tell me about your friend Twinkle.** (memorability + attachment)
4. **Do you want to play again tomorrow?** (yes / maybe / no)
5. **Was anything too hard or confusing?** (gentle)

*(Optional next-day recall, Day 4: "Remember the harbor game? What do you remember?")*

---

# 10. Results Scorecard (one page per family)

Participant `F___` · Age `__` · Reading `Emerging/Developing/Confident` · Gaming `Low/Med/High`

| Metric | What counts | 🟢 Green | 🟡 Yellow | 🔴 Red | This family |
|--------|-------------|----------|-----------|--------|-------------|
| **D1 retention** | returned for Day 2 | child-initiated, ≤36h | returned but **prompted**/late | did not return | ⬜ |
| **D3 retention** | completed Day 3 | child-initiated all 3 days | completed but prompted/late | didn't reach Day 3 | ⬜ |
| **Time-to-Delight** | first smile (s from start) | < 60s | 60–120s | > 120s | ⬜ |
| **Learning gain** | post − pre Stars (/6, transfer) | **≥ +2** | +1 | ≤ 0 | ⬜ |
| **Parent value perception** | "I can clearly see the learning" | clear yes + example | vague/partial | no | ⬜ |
| **Parent re-engagement intent** | "encourage tomorrow?" | **Yes** | Maybe | No | ⬜ |

**Family classification rule:**
- **🟢 Green family:** ≥ 4 Green **and** no Red on **D3 retention** or **Learning gain**.
- **🔴 Red family:** Red on **D3 retention** **or** Red on **Learning gain**, **or** ≥ 3 Reds total.
- **🟡 Yellow family:** everything else.

Guard-rail note: if "Learning gain" is Green but the JSON shows a **high model-the-answer rate** (>25% of items) and **no rise in independent attempts**, downgrade Learning to 🟡 (possible pattern-tapping, not reading).

---

# Sample report — one family (F07)

> **F07** · Age 6 · Reading *Developing* · Gaming *Medium* · Device iPad
>
> | Metric | Result | Color |
> |---|---|---|
> | D1 retention | Returned Day 2 next morning, **asked on her own** | 🟢 |
> | D3 retention | Completed all 3 days; Day 3 child-initiated | 🟢 |
> | Time-to-Delight | First smile **22s** (avatar hair pick); first "wow" 41s (Twinkle) | 🟢 |
> | Learning gain | Pre **3/6** → Post **5/6** (+2); gains on transfer items | 🟢 |
> | Parent value | *"I can see she's blending sounds — she read 'cat' to me at dinner."* | 🟢 |
> | Re-engagement | **Yes** — *"She begs for it; I'm happy to say yes."* | 🟢 |
>
> **Classification: 🟢 GREEN.** Notes: hint usage fell D1→D3 (1.4 → 0.4 / item); independent attempts rose; loved Twinkle's evolution ("the best part"); one confusion moment on Day-2 sign reading (self-recovered). Guard-rail clean (model rate 8%). **Strong PMF + learning signal.**

---

# Sample aggregate report — 15 families

**Cohort:** 15 families (5y ×5, 6y ×6, 7y ×4); reading mix 5 Emerging / 6 Developing / 4 Confident; gaming mix 4 Low / 7 Med / 4 High.

**Family outcomes:** 🟢 **9** · 🟡 **4** · 🔴 **2** (60% / 27% / 13%).

| Cohort metric | Result | Threshold (spec §8) | Color |
|---|---|---|---|
| **D1 retention** | 13/15 returned (10 child-initiated) = **87%** | ≥80% 🟢 | 🟢 |
| **D3 retention** | 9/15 completed all 3 = **60%** | ≥50% (3-day) 🟢 | 🟢 |
| **Child-initiated return** | 10/15 self-initiated ≥2 days = **67%** | ≥60% 🟢 | 🟢 |
| **Time-to-Delight** | median first smile **38s**; 12/15 <60s | <60s majority 🟢 | 🟢 |
| **Learning gain** | median **+2** (pre 3.1 → post 4.9); 11/15 improved | median +2 🟢 | 🟢 |
| **Hint trend / independence** | hints 1.3→0.5; independent rate 41%→58% | declining 🟢 | 🟢 |
| **Model-rate guard-rail** | 11% avg | <10–25% 🟡 | 🟡 |
| **Parent value perception** | 12/15 clear yes = **80%** | ≥75% 🟢 | 🟢 |
| **Parent re-engagement** | 12 Yes / 2 Maybe / 1 No = **80% Yes** | ≥80% 🟢 | 🟢 |
| **Pay intent (weigh lightly)** | 7/15 = 47% | ~50% 🟡 | 🟡 |

**Where the 🔴/🟡 came from:** the 2 Reds were both *Confident readers* who found Day 1 too easy (no learning gain, mild boredom → didn't return). 2 of the Yellows were *Low-gaming 5-year-olds* who needed a parent prompt to return on Day 2 (engaged once in).

**Patterns →** difficulty ceiling too low for confident readers (adaptive should ramp faster); a gentle Day-2 re-entry nudge could help the youngest.

---

# Recommendation framework

Apply after the aggregate is in. The **gate metrics** are: **D1, D3, Learning gain, Parent value, Time-to-Delight** (founder-defined).

### ✅ Proceed to the full Week-One Loop — if:
- **All five gate metrics are 🟢 cohort-level**, AND
- guard-rails clean (model-rate not 🔴; independence rising), AND
- ≥ 55–60% of families classify 🟢.
→ *The loop both retains and teaches.* Authorize the 7-day build + the content pipeline. (The 15-family sample above **meets this** — proceed, with a difficulty-ramp fix for confident readers.)

### 🔁 Iterate the Three-Day Proof — if:
- **1–2 gate metrics are 🟡** (not 🔴) with a **diagnosable cause**, e.g.:
  - Day-2 drop but Day-1 strong → strengthen the return hook / re-entry.
  - Slow Time-to-Delight → tighten onboarding to the first wow.
  - Learning flat for a sub-segment (e.g., confident readers) → fix adaptive ramp.
→ Make the **one targeted fix**, re-test the **same 3-day scope** with a fresh ~10 families. Don't expand yet.

### 🛑 Pivot — if:
- **D3 retention 🔴** (kids don't come back) → the daily-return engine is wrong (see strategic-review pivots: deepen collection/ritual, or rethink the hook).
- **Learning gain 🔴** or gains only on identical (non-transfer) items → it entertains but doesn't teach → deepen rigor or change anchor skill.
- **Parent value 🔴** (<40% see value / <25% would allow-and-pay) → move the buyer (co-play, or B2B2C preschools/SLPs).
→ Choose the pivot matching the failed assumption; re-validate before further investment.

> **Single most predictive read:** how many children **chose to return on Day 3**, *bounded by* a positive **transfer learning gain**. If both are green, you have the foundation of a product children and parents want.
