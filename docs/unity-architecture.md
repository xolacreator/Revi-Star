# Unity 6 Technical Architecture

> Senior Unity 6 architect spec for *Starbound: Little Legends*.
> **Data-driven, offline-first, kid-safe.** Designers & curriculum specialists author content (heroes, challenges, pals, events) as data — no code changes to ship content.

---

## 1. Tech stack & targets

- **Engine:** Unity 6 (LTS line), **URP** (mobile, stylized 3D).
- **Language:** C# 9+, async/await, `UniTask` for allocation-free async.
- **Platforms:** iOS 13+ / Android 8+ (API 26+). Target **60fps** mid-tier, graceful **30fps** floor on low-end (family hand-me-down devices).
- **Content delivery:** **Addressables** (on-demand district/season bundles) + **Remote Config** (events, tuning, feature flags) → LiveOps without app updates.
- **Backend:** managed BaaS (e.g., PlayFab/Firebase-class) for **auth (parent), cloud save, remote config, privacy-safe analytics**. All COPPA/GDPR-K configured (no ad SDKs, no child PII).
- **Rendering budgets:** see `art-bible` (to be added) — characters ≤ 18–25k tris, 1 skinned mesh + atlased textures (1–2k), URP Lit/Toon, ≤ 3 real-time lights, baked where possible.

## 2. Folder structure

```
Assets/
├── _Project/
│   ├── Art/            (Characters, Pals, Environments, VFX, UI)
│   ├── Audio/          (Music, VO, SFX)  — VO per-locale Addressable groups
│   ├── Data/           (ScriptableObjects: Heroes, Stages, Districts,
│   │                    Challenges, Companions, Events, Concepts, Songs)
│   ├── Prefabs/
│   ├── Scenes/         (Boot, Hub_FriendshipPlaza, District_*, Performance)
│   ├── Scripts/
│   │   ├── Core/        (Bootstrap, ServiceLocator, EventBus, SaveSystem)
│   │   ├── Data/        (ScriptableObject definitions + runtime models)
│   │   ├── Gameplay/    (Exploration, Quests, Puzzles, Rhythm, Evolution)
│   │   ├── Learning/    (AdaptiveEngine, MasteryModel, ChallengeRunner)
│   │   ├── Companions/  (BondSystem, CareSystem)
│   │   ├── Economy/     (Currencies, Rewards, Store — parent-gated)
│   │   ├── UI/          (UI Toolkit views + ViewModels, NarrationSystem)
│   │   ├── Accessibility/(A11yManager, Narrator, Colorblind, ReducedMotion)
│   │   ├── Parent/      (ParentGate, ParentDashboard, Controls, Reports)
│   │   ├── Analytics/   (privacy-safe telemetry)
│   │   └── Platform/    (IAP, CloudSave, RemoteConfig adapters)
│   ├── Settings/       (URP, Addressables, Input, Localization)
│   └── Localization/   (string tables EN/KO/JA/…)
├── Plugins/            (vetted: UniTask, localization, BaaS SDK — NO ad SDKs)
└── Tests/              (EditMode + PlayMode)
```

## 3. Architecture pattern

- **Composition root / Bootstrap:** one `Bootstrap` scene wires services via a lightweight **ServiceLocator** (or VContainer DI). Services: `SaveSystem`, `RemoteConfig`, `AdaptiveEngine`, `EconomyService`, `CompanionService`, `EvolutionService`, `AnalyticsService`, `NarrationService`, `A11yManager`, `ParentService`.
- **Event-driven:** a typed **EventBus** decouples gameplay → UI → analytics (`ChallengeCompleted`, `HeroEvolved`, `PalBonded`, `RewardGranted`).
- **MVVM UI** (UI Toolkit): Views bind to ViewModels; no game logic in views.
- **Data-driven:** all content = **ScriptableObjects** (design-authored) + **runtime save models** (player state). Clean separation = testable + LiveOps-friendly.

## 4. ScriptableObject data models (examples)

```csharp
// Assets/_Project/Scripts/Data/HeroDef.cs
using UnityEngine;

public enum LearningDomain { Reading, Phonics, Vocabulary, Math, Patterns, Logic, Memory, Creativity, SEL }

[CreateAssetMenu(menuName = "LittleLegends/Hero")]
public sealed class HeroDef : ScriptableObject
{
    public string Id;                 // "rumi"
    public string DisplayNameKey;     // localization key (never baked text)
    public LearningDomain Domain;     // Rumi → Reading
    public Color ThemeColor;
    public Sprite Portrait;
    public AssetReferenceGameObject ModelRef;   // Addressable
    public EvolutionStageDef[] Stages;          // exactly 5
    public AudioClipReference[] VoiceLines;
}

// EvolutionStageDef.cs
[CreateAssetMenu(menuName = "LittleLegends/EvolutionStage")]
public sealed class EvolutionStageDef : ScriptableObject
{
    public int Stage;                 // 1..5
    public string StageNameKey;
    [Header("Requirement (learning-powered)")]
    public LearningDomain Domain;
    [Range(0,1)] public float MasteryThreshold;   // e.g., 0.45, 0.8...
    public int DistrictHarmonyRequired;
    [Header("Unlocks (cosmetic + content only — no combat stats)")]
    public AssetReferenceGameObject CostumeRef;
    public string[] NewAnimationIds;
    public string NewDanceId;
    public AssetReference VfxRef;
    public AssetReference SongRef;
    public string StoryBeatId;
}
```

```csharp
// ChallengeDef.cs  — a single "magical mission"
[CreateAssetMenu(menuName = "LittleLegends/Challenge")]
public sealed class ChallengeDef : ScriptableObject
{
    public string Id;                 // "phon.cvc.blend.bubbleblend"
    public string SkillId;            // "phon.cvc.blend"
    public LearningDomain Domain;
    public DifficultyBand Band;       // Discover / Practice / Master
    public string PromptVoKey;        // narrated prompt (pre-reader first)
    public ChallengeType Type;        // TapChoose, DragSort, SequenceTap, FreeCreate...
    public ChallengeItem[] Items;     // options/targets (data, not code)
    public RewardTier Reward;
    public string StoryHookKey;       // "A Letterling lost its sound!"
}
public enum DifficultyBand { Discover, Practice, Master }
```

```csharp
// CompanionDef.cs
[CreateAssetMenu(menuName = "LittleLegends/Companion")]
public sealed class CompanionDef : ScriptableObject
{
    public string Id;                 // "twinkle"
    public string DisplayNameKey;
    public string District;
    public CompanionForm[] Forms;     // 3: Spark, Glow, Radiant
    public HelperAbility Ability;     // HintFirstSound, RevealSparkle, Cheer...
    public AnimationCurve BondCurve;  // bond points -> form thresholds
}
```

Plus `DistrictDef`, `EventDef`, `ConceptDef` (cosmetic), `SongDef`. JSON mirrors in [`schemas/`](schemas/) for tools/import.

## 5. Runtime save model & save system

```csharp
// Save models are POCOs, versioned, serialized to JSON.
[System.Serializable] public sealed class ChildProfile {
    public string ProfileId; public string AvatarJson; public int AccountStars;
    public Dictionary<string, SkillState> Skills = new();    // skillId -> mastery
    public Dictionary<string, HeroState> Heroes = new();     // heroId -> stage
    public Dictionary<string, PalState> Pals = new();        // palId -> form+bond
    public Wallet Wallet = new();                            // Sparkles, StarGems
    public List<string> Concepts = new();                    // owned cosmetics
    public StreakState Streak = new();
    public long LastPlayedUtc;
}
[System.Serializable] public sealed class SkillState { public float Mastery; public int Attempts; public int Correct; public long LastSeenUtc; }
[System.Serializable] public sealed class HeroState  { public int Stage; public float StardomMeter; }
[System.Serializable] public sealed class PalState   { public int Form; public float Bond; }
```

**Save system requirements**
- **Offline-first:** authoritative copy is **local** (atomic write, temp+rename, checksum, encrypted-at-rest). Game fully playable with no network (car/plane).
- **Cloud save:** async sync to BaaS keyed to the **parent account**; conflict resolution = last-writer-wins on a per-domain merge (skills merge by max mastery; never lose progress).
- **Multi-child:** N `ChildProfile`s under one parent account; switching is **behind the Parent Gate**.
- **Versioned migrations** (`SaveMigrator` runs on load).
- **No PII for children** stored (no names required; avatar + nickname optional, local).

## 6. Adaptive learning engine

```csharp
public sealed class AdaptiveEngine {
    public void Record(string skillId, ChallengeResult r, ChildProfile p) {
        var s = p.Skills.GetOrAdd(skillId);
        float baseDelta = r.Correct ? 0.12f : -0.06f;
        baseDelta -= r.HintsUsed * 0.03f;
        if (r.Correct && r.AnsweredQuicklyNoHints) baseDelta += 0.03f;
        s.Mastery = Mathf.Clamp01(s.Mastery + baseDelta);
        s.Attempts++; if (r.Correct) s.Correct++; s.LastSeenUtc = Now;
    }
    public DifficultyBand BandFor(float m) =>
        m < 0.45f ? DifficultyBand.Discover : m <= 0.8f ? DifficultyBand.Practice : DifficultyBand.Master;

    // Pick next mission to keep ~80% success (flow / ZPD), with spiral review + coverage.
    public ChallengeDef SelectNext(string domainOrDistrict, ChildProfile p, IContentDb db, IRng rng) { /* see learning-design.md §5 */ }
}
```
Parent overrides (lock band/age) are honored here. **No timers gate success; scaffolding ladder guarantees eventual success** (NarrationService drives hints).

## 7. UI framework (UI Toolkit, audio-first)

- **UI Toolkit** (UXML/USS) + **MVVM**; a `View` binds to a `ViewModel`; `EventBus` updates VMs.
- **NarrationSystem:** every interactive element registers a `Narratable` (voKey). Tap-to-hear everywhere; auto-narrate prompts. Pre-recorded VO (warm human voices) per locale via Addressables, with optional TTS fallback for un-voiced strings.
- **Big-target, portrait, ≤4 choices** components; juicy feedback (DOTween/USS transitions, haptics).
- **Localization:** Unity Localization tables; **no baked text in textures**; +40% expansion headroom; CJK fonts.

## 8. Accessibility systems (first-class)

```csharp
public sealed class A11yManager {
    public bool ReducedMotion, Colorblind, Captions, DyslexiaFont, CalmMode;
    public float TextScale = 1f, NarrationSpeed = 1f;
    public float MusicVol=1, VoiceVol=1, SfxVol=1; public bool Haptics=true, LeftHanded=false;
    // Affinity/learning cues always pair color + SHAPE + label (never color-only).
    // ReducedMotion/CalmMode dampen particles, screen shake, brightness, pacing.
}
```
- Narration (non-reader support), colorblind-safe iconography, reduced-motion/calm mode, text scaling, dyslexia font, captions on all VO, independent audio channels, left-handed + remappable tap zones, **no-time-pressure default**, generous rhythm windows. Wired into UI Toolkit theming + the rhythm/quest systems.

## 9. Analytics framework (privacy-safe, COPPA)

- **No third-party ad/marketing SDKs. No child profiling. No cross-app tracking.**
- Aggregate, anonymized **learning-efficacy + app-health** events only: `{skillId, band, correct, hints, ms, retries}`, session length, crash/perf. Keyed to an anonymous profile id, **not** identity.
- Powers the **Parent Dashboard** (`parent-dashboard.md`) and curriculum studies. Parent can **export/delete**. Consent captured at setup.

```csharp
public interface IAnalytics {
    void ChallengeResult(string skillId, DifficultyBand band, bool correct, int hints, int ms, int retries);
    void Session(float minutes); void Health(string evt, string detail);
    // NO user-identifying or advertising events exist in this interface by design.
}
```

## 10. Parent gate & controls
- `ParentGate` modal (adult-only task) guards Store/IAP, settings, dashboard, data export/delete.
- `ParentService` persists controls (time limits, schedule, difficulty lock, subject focus, a11y) into the child profile + cloud.
- **Store/IAP** (Unity IAP): subscription + one-time unlock + cosmetic packs — **all behind the gate; no purchase UI reachable by the child; no random/loot purchases.**

## 11. Content pipeline (LiveOps)
- Designers/curriculum specialists author ScriptableObjects (or a CMS that emits the JSON in `schemas/`).
- **Addressables** bundle per district/season; **Remote Config** flips events/tuning/flags.
- **Cosmetics-vs-power lint** (CI): fails the build if any reward attached to a paid SKU touches gameplay difficulty/progress — enforces no-pay-to-win.

## 12. Testing & CI
- **EditMode** unit tests: AdaptiveEngine math, SaveMigrator, reward/economy rules, band selection.
- **PlayMode** tests: challenge runners, narration registration, parent-gate enforcement.
- **Device farm** smoke on low-end Android for fps/memory floors.
- CI: build iOS/Android, run tests, run the cosmetics/power lint, validate all ScriptableObjects have localization keys + VO refs.

## 13. Performance & device budget (summary)
- Pool VFX/UI; atlas textures; bake lighting; LODs on environments; cap skinned meshes on screen (hero + buddy + a few critters). Stream districts via Addressables. Target ≤ 1.5GB install (base) + on-demand seasons.
```
```
