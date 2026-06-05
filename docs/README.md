# STARBOUND: LITTLE LEGENDS — Production Bible (Index)

> **An educational mobile game for children ages 5–7.**
> **Fantasy:** *"I am becoming a magical idol hero — through learning."* (Not schoolwork.)
> **No combat.** K-pop magical-hero energy: friendship, transformation, music, exploration, creativity, growth.
> **Platforms:** iOS + Android · **Engine:** Unity 6 · **Sessions:** 5–15 min.
> **Visual foundation:** the **HUNTRIX** concept sheet (Rumi · Mira · Zoey), reframed age-appropriately + expanded to 6 heroes.

---

## Canonical document set (build order)

This suite follows the project's master prompt collection. Each prompt → one production document.

| Prompt | Document | Status |
|--------|----------|--------|
| Master vision + **Game Design Document** | [`GDD-little-legends.md`](GDD-little-legends.md) | ✅ |
| **Character Bible** | [`character-bible-little-legends.md`](character-bible-little-legends.md) | ✅ |
| **World Building** (8 districts) | [`world-building.md`](world-building.md) | ✅ |
| **Learning Design** (100 challenges, adaptive system) | [`learning-design.md`](learning-design.md) | ✅ |
| **Character Evolution** (5 stages/hero) | [`character-evolution.md`](character-evolution.md) | ✅ |
| **Pet Companion System** (50 companions) | [`companion-system.md`](companion-system.md) | ✅ |
| **Parent Dashboard** | [`parent-dashboard.md`](parent-dashboard.md) | ✅ |
| **Live Events & Seasonal** (12-month) | [`live-events-calendar.md`](live-events-calendar.md) | ✅ |
| **Unity Development** (architecture + C#) | [`unity-architecture.md`](unity-architecture.md) | ✅ |
| **Franchise Development** | [`franchise-bible.md`](franchise-bible.md) | ✅ |
| **Art Bible** (+ mockup boards) | [`art-bible.md`](art-bible.md) · [`art/mockups/`](art/mockups/) | ✅ |
| **Hero Production Package** (Rumi, 10 phases) | [`hero-package-rumi.md`](hero-package-rumi.md) | ✅ |
| **Vertical Slice — User Testing Kit** | [`vertical-slice-user-testing.md`](vertical-slice-user-testing.md) | ✅ |
| **Strategic Review** (slice evaluation) | [`vertical-slice-strategic-review.md`](vertical-slice-strategic-review.md) | ✅ |
| **Week-One Loop — Milestone Spec** | [`week-one-loop-spec.md`](week-one-loop-spec.md) | ✅ |
| **Milestone A1 — Three-Day Proof** (build notes) | [`milestone-a1-three-day-proof.md`](milestone-a1-three-day-proof.md) | ✅ |
| **Three-Day Proof — Recruiting & Testing Kit** | [`three-day-proof-research-kit.md`](three-day-proof-research-kit.md) | ✅ |
| **Character Production Spec** (Rumi / Twinkle / Child) | [`character-production-spec.md`](character-production-spec.md) | ✅ |

## Playable vertical slice
The repo root is now the **Harmony Harbor vertical slice** (`index.html` + `harbor.js` + `harbor.css`) — a web build that runs the full loop (explore → read with Rumi → befriend Twinkle → transformation → reward → "again?") with **audio narration** and **no-fail** learning, for testing with real 5–7s. Live: `https://xolacreator.github.io/revi-star/`. Prior demos preserved as `demo-explore.html` / `classic.html`.

Supporting: [`schemas/`](schemas/) (ScriptableObjects + sample data) · [`art/`](art/) (drop the HUNTRIX sheet here as `concept-sheet.png`).

## The one-paragraph pitch
A child joins the **Little Legends** — magical K-pop idol heroes whose music turns sadness into joy. They explore the living animated city of **Lumina**, help its people by solving short, magical **learning missions** (reading, math, logic, music, memory, creativity), **perform** sparkling concerts, **rescue and raise** cute companions called **Star Pals**, and — as they master skills — **transform** into ever-more-dazzling heroes. Every bit of learning literally powers a transformation: *learning is the superpower.*

## Cast (learning strengths)
**Rumi** (Reading) · **Mira** (Logic) · **Zoey** (Rhythm) · **Nova** (Math) · **Indie** (Creativity) · **Remi** (Memory). Mentors: **Director Luna**, **DJ Echo**, **Auntie Iris**. Plus the child's own customizable **Star Hunter trainee** avatar.

## Pledges (every doc upholds these)
No combat · no losing/fail states · pre-reader-first (everything narrated) · effort over results · no ads · no gacha · parent-gated purchases · COPPA/GDPR-K safe · accessibility built-in.

## Note on `/archive-teen-concept/`
Early in exploration we drafted a teen (12+) action-combat concept. It is **superseded** and kept only for reference. The **canonical** project is everything in this index.

## Concept playable
`/index.html` (repo root) is a lightweight Three.js **web demo** prototyping the explore-and-collect feel for stakeholders. The shipping client is Unity 6 (see `unity-architecture.md`).
