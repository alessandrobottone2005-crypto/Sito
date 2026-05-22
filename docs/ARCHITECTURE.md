# ARCHITECTURE
### Technical System Design — The Dark Knight Experience

---

## Overview

The application is a **single-page, phase-driven experience** with no client-side router. Navigation between phases is managed by a central state machine in `App.tsx`, which gates rendering based on the current `phase` value. There are no URL changes; the entire experience lives on a single document.

The architecture prioritises:
1. **Render stability** — the Three.js panorama canvas is mounted once and never destroyed during gameplay
2. **State centralisation** — timer, mission status, progress, and audio are all owned by `App.tsx`
3. **Isolation of concerns** — each phase component is self-contained and communicates upward via callback props

---

## Phase State Machine

```
"intro"
   │  onBegin()
   ▼
"batcomputer" ──[2 riddles]──► "transition1"
                                      │ onEnded()
                                      ▼
                                  "armeria" ──[1 riddle]──► "transition2"
                                                                  │ onEnded()
                                                                  ▼
                                                             "batmobile" ──[2 riddles]──► "breather"
                                                                                               │ auto 4.4s
                                                                                               ▼
                                                                                           "reveal"
                                                                                               │ onComplete()
                                                                                               ▼
                                                                                           "showreel"
                                                                                               │ onPreorder()
                                                                                               ▼
                                                                                           "checkout"
```

**Failure:** `timeLeft === 0` → `missionStatus = "failed"` → `ExplosionOverlay` → reset or skip

**Escape:** "Salta al Prodotto" → `changePhase("breather")` (any panorama phase)

**Dev:** `⌘+1` skips directly to `"showreel"`

---

## TypeScript Types

```typescript
type Phase =
  | "intro" | "batcomputer" | "transition1"
  | "armeria" | "transition2" | "batmobile"
  | "breather" | "reveal" | "showreel" | "checkout";

type MissionStatus = "idle" | "active" | "failed" | "succeeded";
type PanoramaScene = "batcomputer" | "armeria" | "batmobile";
```

---

## App.tsx — Root State Owner

`App.tsx` is the single source of truth. No child component owns cross-cutting state.

### State Inventory

| State | Type | Purpose |
|---|---|---|
| `phase` | `Phase` | Controls scene rendering |
| `missionStatus` | `MissionStatus` | Gates timer, audio, overlays |
| `completedCount` | `number` | Aggregate clue progress |
| `timeLeft` | `number` | Live countdown in seconds |
| `initialTime` | `number` | A/B group ceiling (120s or 240s) |
| `timerABGroup` | `"A" \| "B"` | A/B assignment |
| `isPaused` | `boolean` | Freezes timer + 360° video |
| `isMuted` | `boolean` | Propagates to all audio systems |
| `isTransitioning` | `boolean` | Re-entrance guard on `changePhase` |
| `panoramaScene` | `PanoramaScene` | Tells canvas which scene to render |
| `bonusTimeGranted` | `boolean` | Prevents double bonus award |
| `speedrunUnlocked` | `boolean` | Discount flag for checkout |
| `finalTimeTaken` | `number` | Passed to FinalReveal |
| `isMobile` | `boolean` | Triggers mobile warning |
| `forceMobile` | `boolean` | Bypasses mobile warning |

### `changePhase(newPhase)` — Transition Controller

All phase changes are routed through this function. It:
1. Guards against re-entrance via `isTransitioning`
2. Handles per-transition side-effects (audio fade, timer reset)
3. Delays phase swap 400ms (TransitionOverlay covers the cut)
4. Releases the lock at 1000ms

The `breather` phase self-advances to `reveal` after 4.4s using a chained `setTimeout`, and orchestrates audio fade-out/fade-in.

---

## Shared Panorama Canvas

`SharedPanoramaCanvas` is a **persistent Three.js canvas** — mounted once, never destroyed during gamification.

```
SharedPanoramaCanvas (React.memo)
├── Canvas (@react-three/fiber)
│   ├── PerspectiveCamera     – FOV 75, position [0,0,0.1]
│   ├── MouseLookControls     – Disabled during riddles / pause / hover
│   └── SceneContent
│       ├── PanoramaSphere    – Inverted sphere, radius 500, BackSide material
│       └── ClueMesh ×N       – Three.js group + Html overlay (JokerCard)
│
├── Loading Overlay           – AnimatePresence fade
├── Exit Overlay              – Black fade before scene switch
└── HUD Label                 – Area name + clue count
```

### Texture Strategy

| Scene | Asset Type | Source |
|---|---|---|
| `batcomputer` | `THREE.VideoTexture` | `BatCaverna360_BatComputerArea.mp4` |
| `armeria` | `THREE.TextureLoader` (JPG→PNG fallback) | `BatCaverna360_ArmeriaArea.jpg` |
| `batmobile` | `THREE.TextureLoader` (JPG→PNG fallback) | `BatCaverna360_BatMobileArea.jpg` |

### Clue Position Randomisation

```typescript
phi   = Math.random() * 1.8 + 0.6   // avoids ceiling/floor poles
theta = Math.random() * Math.PI * 2  // full horizontal sweep
r     = 200 units                     // sphere interior radius
// Minimum separation between clues: 120 units
```

---

## Phase → Canvas Mapping

Transition phases keep the canvas alive so textures survive the video overlay:

```typescript
const PANORAMA_PHASE_MAP = {
  batcomputer: "batcomputer",
  transition1: "batcomputer",  // canvas kept alive under video
  armeria:     "armeria",
  transition2: "armeria",      // same pattern
  batmobile:   "batmobile",
};
```

`panoramaScene` state is updated 100ms before the phase changes, giving the canvas time to begin loading the next texture while the transition video plays.

---

## Timer Architecture

The timer is fully owned by `App.tsx` and ticks via a `setInterval` gated on:

```typescript
missionStatus === "active"
&& !isPaused
&& !isVideoTransition   // frozen during transition1 / transition2
&& timeLeft > 0
```

### Timer State Transitions

```
"idle"      → no tick
"active"    → ticks (unless paused or video transition)
"succeeded" → stopped
"failed"    → stopped; ExplosionOverlay shown
```

---

## Audio Architecture

Two parallel audio systems:

| System | Tech | File | Scope |
|---|---|---|---|
| Background music | `HTMLAudioElement` ref in App | `SiglaBatman.wav` | Global, looped |
| Joker laugh | `AudioContext` in JokerAudioManager | `RisataJoker.wav` | Gamification phases only |

---

## Z-Index System

| Z-Index | Element |
|---|---|
| 10 | SharedPanoramaCanvas |
| 20–30 | Panorama HUD labels |
| 500 | CinematicVideoPlayer overlay |
| 50000 | Navbar |
| 99999 | Pause screen |
| 200000 | MissionTimer urgent countdown |
| 400000 | Mobile warning |
| 500000+ | ExplosionOverlay |

---

## Render Tree (Simplified)

```
<App>
  <Navbar />
  <JokerAudioManager />                      // renders null
  <TransitionOverlay />                      // AnimatePresence
  <MobileWarning />                          // conditional
  <BonusFeedback />                          // AnimatePresence toast

  {isPanoramaPhase && <SharedPanoramaCanvas />}

  {phase === "transition1" && <CinematicVideoPlayer />}
  {phase === "transition2" && <CinematicVideoPlayer />}

  <AnimatePresence mode="wait">
    {phase === "intro"     && <IntroScreen />}
    {phase === "breather"  && <BreatherScreen />}
    {phase === "reveal"    && <FinalReveal />}
    {phase === "showreel"  && <BatmanCamera /> + <Pricing />}
    {phase === "checkout"  && <Checkout />}
  </AnimatePresence>

  {missionStatus === "failed" && <ExplosionOverlay />}
  {isPaused && <PauseOverlay />}
</App>
```
