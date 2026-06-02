# 05 — UX / UI

## 1. Principles

1. **Thumb-first, portrait-default.** Primary actions in the bottom 40% of screen; nothing critical in top corners.
2. **Three-tap rule.** Any core action (start a fight, upgrade a unit, equip a Concept) reachable in ≤3 taps from the hub.
3. **Show the fantasy.** Big character art, full-screen Encore cutscenes, fashion always on display.
4. **Respect time.** Skip/auto/2× everywhere; batch-claim; "use recommended" autofill with manual override.
5. **Readable on a 5" screen at arm's length.** Min font 28px @2x; affinity = icon shape + color + label.

## 2. Screen map

```
[Boot/Login] → [Backstage Hub]
   Backstage Hub (persistent bottom nav):
   ├── ⌂ Home (daily summary, idle claim, news, featured Concept)
   ├── ▶ Battle  → Campaign / Dungeons / Showcase / Raids / Spotlight / Tower
   ├── ☺ Roster  → Resonant list → Detail (Level/Ascend/Skills/Gear/R-Rank/Concepts)
   ├── ✦ Recruit → banners, pull, exchange
   ├── ◈ Shop    → Concept Boutique / Tour Pass / Stage Coin / Bundles
   └── ⚑ Social  → Label, Friends, Co-op, Photo Mode, Leaderboards
```

## 3. Key screens (wireframe intent)

### 3.1 Backstage Hub (Home)
- Hero banner (featured Comeback/Concept), 3D character idling in current Concept (tap → photo mode).
- Top bar: currencies (Gold, Starlight, Glow, Stamina), profile, mail, settings.
- Center: **Daily checklist** ring + **Idle reward** claim CTA.
- Bottom: persistent nav (6 tabs).

### 3.2 Lineup / pre-battle
- Left: stage info, enemy affinity/weakness, recommended power.
- Right: 4 unit slots + friend slot; **drag to fill**, "Auto-fill best" button.
- Synergy panel: Leader Aura, Affinity Resonance count, active Duet Links (lit/unlit).
- **Warnings, not blocks:** "No Frost unit vs Frost-weak boss" shown in amber.

### 3.3 Combat HUD
- Top: enemy HP + **Stagger gauge**, wave pips, phase markers.
- Bottom: 4 unit portraits = tappable **skill buttons** (cooldown radial), **Resonance meter** per unit; **Encore button** glows at 100%.
- Right edge: **Auto** toggle, **2× speed**, **Pause/Flee**.
- Encore prompt: center-screen shrinking ring + beat marker; haptic tick on Perfect.

### 3.4 Resonant Detail
- Left: full-body 3D in equipped Concept + rotate; **Concepts** carousel (cosmetics).
- Right tabs: **Stats · Skills · Gear · Ascension · Resonance Rank · Story/Voice**.
- Footer: "Power" score, "Recommended upgrades" nudges.

### 3.5 Concept Boutique (store)
- Full-screen 3D preview, rotate/zoom, **try-on** on any owned Resonant, see the **Encore cutscene variant** preview before buying.
- Clear price in **Glow**, "owned" states, gift button.

### 3.6 Photo Mode (social engine)
- Pose library, stage/MV backdrops, multiple Resonants, filters, stickers, framing → export/share. Drives organic UA.

## 4. FTUE UX specifics
- Masked/guided taps with a single highlighted action; no free-roam until hub handoff.
- "Juicy" reward moments (confetti, SFX, haptics) on first win, first pull, first Concept.
- Defer systems: dress-up introduced at L10, Raids at L20 — never dump all UI at once.

## 5. Onboarding nudges & retention UI
- **Daily checklist** with one-tap claim.
- **Smart inbox** (mail) for rewards/events.
- **"What's new"** modal per Comeback (cosmetic-forward, not nag).
- **Return gift** flow for lapsed players.

## 6. Accessibility (commit list)
- Colorblind modes (affinity shapes + patterns).
- Text scaling, dyslexia-friendly font option.
- **Reduced-motion** toggle (dampens screen shake, particle density).
- **Auto-play & skip** for all cleared content (motor accessibility).
- Subtitles/captions on all voiced cutscenes; visual cues for audio rhythm in Showcase (the beat ring is visual-first, audio-secondary).
- One-handed mode; remappable Encore tap zone.
- Haptics optional; SFX/music/voice independent volume.

## 7. Localization-ready UI
- All strings in `LocalizationTable` (no baked text in textures).
- Layout uses flexible containers (CJK + Latin + RTL-aware where applicable); +40% text-expansion headroom.
- Launch languages: EN, KO, JA, ZH-Hant/Hans, ES, PT-BR, FR, DE, TH, ID (K-pop core markets prioritized).

## 8. Art-UI handoff
- Design system: tokens for color/spacing/type, 9-slice frames, Spine/effect budget per screen.
- Figma component library mirrors Unity UI Toolkit components 1:1 (see 09 §3 for UI tech).
