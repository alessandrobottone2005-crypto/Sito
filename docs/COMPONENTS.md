# COMPONENTS
### React Component Reference — The Dark Knight Experience

---

## Component Map

```
src/components/
├── audio/
│   └── JokerAudioManager
├── effects/
│   ├── TransitionOverlay
│   └── ExplosionOverlay
├── layout/
│   └── Navbar
├── scenes/
│   ├── IntroScreen
│   ├── SharedPanoramaCanvas
│   ├── CinematicVideoPlayer
│   └── MouseLookControls
└── ui/
    ├── BatmanCamera
    ├── BatmanButton
    ├── BatmanText
    ├── Checkout
    ├── FinalReveal
    ├── JokerCard
    ├── MissionTimer
    ├── Pricing
    └── ProgressTracker
```

---

## `JokerAudioManager`
**Path:** `src/components/audio/JokerAudioManager.tsx`

### Function
A renderless audio controller that plays randomised, spatially-positioned Joker laugh audio during the gamification phases. Uses the Web Audio API for stereo panning and dynamic volume control.

### Props
| Prop | Type | Description |
|---|---|---|
| `isActive` | `boolean` | Enables/disables the scheduling loop |
| `isMuted` | `boolean` | Prevents audio playback when true |
| `isPaused` | `boolean` | Pauses scheduling while the game is paused |

### State
None — this component is stateless. All timing is handled via `useRef` timeouts.

### Behaviour
- On mount: initialises `AudioContext` and fetches/decodes `RisataJoker.wav` into an `AudioBuffer`
- When `isActive && !isPaused`: schedules a laugh after an initial random delay (2–5s), then recursively schedules the next at 4–12s intervals
- Each laugh creates a fresh `BufferSource → StereoPannerNode → GainNode` chain with randomised pan (`-0.8` to `+0.8`) and volume (`0.05` to `0.4`)
- When `isActive` becomes false or `isPaused` becomes true: clears the pending timeout
- Renders `null` — no DOM output

### UX Purpose
Creates the auditory illusion that the Joker is physically moving through the Batcave. The spatial randomisation (left, centre, right) and volume variation (near, far) give depth to the soundscape without occupying screen space.

---

## `TransitionOverlay`
**Path:** `src/components/effects/TransitionOverlay.tsx`

### Function
A fullscreen black overlay that fades in/out to cover phase transitions. Prevents jarring scene cuts.

### Props
None.

### Behaviour
- Rendered inside `<AnimatePresence>` in `App.tsx` whenever `isTransitioning === true`
- `initial={{ opacity: 0 }}`, `animate={{ opacity: 1 }}`, `exit={{ opacity: 0 }}`
- Duration: ~400ms in, 600ms out

### UX Purpose
Acts as the "cut to black" of cinematic editing. Gives the system time to unmount and mount scene components without the user seeing intermediate states.

---

## `ExplosionOverlay`
**Path:** `src/components/effects/ExplosionOverlay.tsx`

### Function
The mission failure screen. Renders fullscreen when `missionStatus === "failed"`. Presents two recovery options.

### Props
| Prop | Type | Description |
|---|---|---|
| `onReset` | `() => void` | Triggers full mission restart |
| `onSkip` | `() => void` | Skips to `breather` (product reveal path) |

### Behaviour
- Fullscreen overlay with red/chaotic visual treatment
- "RIPROVA LA MISSIONE" button → `onReset()`
- "Salta al Prodotto" button → `onSkip()` → `changePhase("breather")`

### UX Purpose
The failure state must feel impactful without feeling punishing. It is emotionally charged (red, chaos, urgency language) but immediately offers a path forward that doesn't require replaying.

---

## `Navbar`
**Path:** `src/components/layout/Navbar.tsx`

### Function
Global persistent navigation bar. Displays: mute/unmute toggle, pause toggle, clue progress, mission timer, optional back button.

### Props
| Prop | Type | Description |
|---|---|---|
| `isMuted` | `boolean` | Current mute state |
| `onToggleMute` | `() => void` | Mute toggle handler |
| `showBack` | `boolean` | Shows back button (checkout phase only) |
| `onBack` | `() => void` | Back button handler |
| `showPause` | `boolean` | Shows pause toggle (panorama + showreel phases) |
| `isPaused` | `boolean` | Current pause state |
| `onTogglePause` | `() => void` | Pause toggle handler |
| `completedCount` | `number \| undefined` | Current clue count (gamification phases only) |
| `totalClues` | `number` | Total riddles (always 5) |
| `timeLeft` | `number` | Current timer value |
| `missionActive` | `boolean` | Shows timer only when mission is active |

### State
Stateless — all data flows down from `App.tsx`.

### UX Purpose
The Navbar is the persistent HUD layer. It must always be visible (z-50000) but never intrusive. It contextually shows only the controls relevant to the current phase.

---

## `IntroScreen`
**Path:** `src/components/scenes/IntroScreen.tsx`

### Function
The cinematic mission briefing sequence. Plays automatically and transitions to the CTA.

### Props
| Prop | Type | Description |
|---|---|---|
| `onBegin` | `() => void` | Called when user clicks "INIZIA LA MISSIONE" |

### State
| State | Purpose |
|---|---|
| `step` | Controls which briefing text is visible (0–6) |
| `isHacked` | Triggers the Joker takeover animation (after 1500ms) |

### Behaviour
- Steps 1–5: auto-advance every 3000ms via `setTimeout` chain
- Step 6: reveals timer preview + CTA button
- Background: CRT scan line overlay + radial green gradient at low opacity
- Joker symbol: SVG smile, `opacity: 0.15`, blur-in transition
- Skip path: ghost text `MANOMISSIONE_JOKER_ATTIVA` in bottom-right corner calls `onBegin`

### UX Purpose
Establishes the narrative contract with the user. Each briefing text escalates the stakes. The user arrives at the CTA already emotionally invested.

---

## `SharedPanoramaCanvas`
**Path:** `src/components/scenes/SharedPanoramaCanvas.tsx`

### Function
The Three.js 360° panorama renderer. A single canvas instance that swaps scenes internally based on the `scene` prop. Contains the full riddle interaction system.

### Props
| Prop | Type | Description |
|---|---|---|
| `scene` | `PanoramaScene` | Which environment to render |
| `onProgress` | `(count: number) => void` | Emits aggregate clue count to App |
| `baseCompleted` | `number` | Starting count for this scene (0, 2, or 3) |
| `isPaused` | `boolean` | Pauses video texture + disables controls |
| `onNext` | `() => void` | Called when all scene riddles are solved |

### State
| State | Purpose |
|---|---|
| `texture` | Current Three.js texture (video or static) |
| `isLoading` | Loading overlay visibility |
| `isExiting` | Black fade before transition |
| `activeCardId` | Which riddle card is open (null = none) |
| `completedIds` | Array of solved riddle IDs in this scene |
| `cardPositions` | Randomised 3D positions for clue hotspots |
| `hoveredCluesCount` | Count of currently hovered hotspots (pauses camera) |

### Key Sub-components
- `PanoramaSphere`: Inverted Three.js sphere with texture applied to the inner surface
- `ClueMesh`: A Three.js `group` containing an `Html` overlay (the riddle card). Floats in 3D space and animates toward the camera when activated
- `MouseLookControls`: Free-look controls, disabled when `activeCardId !== null` or `hoveredCluesCount > 0`
- `SceneContent`: Assembles the scene and distributes riddle data per scene

### UX Purpose
The core gamification viewport. Every design decision (inverted sphere, inside-out navigation, camera auto-stop on hover) is in service of the "you are inside the Batcave" illusion.

---

## `CinematicVideoPlayer`
**Path:** `src/components/scenes/CinematicVideoPlayer.tsx`

### Function
A fullscreen MP4 video player for cinematic transitions between panorama scenes. Auto-plays and calls `onEnded` when complete. Also preloads the next panorama asset.

### Props
| Prop | Type | Description |
|---|---|---|
| `src` | `string` | Video file path |
| `onEnded` | `() => void` | Callback when video finishes |
| `label` | `string` | HUD label text (e.g., "SPOSTAMENTO: AREA ARMERIA") |
| `nextAsset` | `string` | URL to preload for the next scene texture |

### UX Purpose
Provides diegetic travel between Batcave areas. The user is watching Batman move — not waiting for a load screen. The `nextAsset` preload means the next scene is ready before the video ends.

---

## `MouseLookControls`
**Path:** `src/components/scenes/MouseLookControls.tsx`

### Function
A Three.js camera controller that maps mouse movement to camera rotation, creating a free-look navigation experience inside the panorama sphere.

### Props
| Prop | Type | Description |
|---|---|---|
| `enabled` | `boolean` | Activates/deactivates the control |

### Behaviour
- Mouse movement → `camera.rotation.y` and `camera.rotation.x` delta
- Auto-disabled when a riddle card is active or a hotspot is hovered
- Uses `useFrame` for per-frame update

---

## `BatmanCamera`
**Path:** `src/components/ui/BatmanCamera.tsx`

### Function
The scroll-driven 800-frame showreel. Renders the Batman statue animation as a canvas element that updates frame-by-frame based on scroll position. Overlays cinematic text beats.

### Props
| Prop | Type | Description |
|---|---|---|
| `onPreorder` | `() => void` | CTA callback to transition to checkout |

### State
| State | Purpose |
|---|---|
| `loadedCount` | Frames loaded so far |
| `isLoaded` | Whether the experience-unlock threshold is reached |
| `progress` | Current scroll progress (0–1) |

### Key Constants
```typescript
TOTAL_FRAMES    = 800
SHOW_THRESHOLD  = 120    // Unlock UI after first 120 frames
CONCURRENCY_LIMIT = 60   // Max parallel image loads
```

### Behaviour
- Phase 1 loading: loads frames 1–120 with `fetchPriority: "high"` and 60 concurrent workers
- Phase 2 loading: continues frames 121–800 in background with `fetchPriority: "low"`
- `useScroll` + `useSpring` maps scroll progress to a smoothed frame index
- Canvas draws the appropriate frame using `drawImage` with aspect-ratio cover logic
- Fallback: if target frame isn't loaded yet, renders the nearest loaded previous frame
- Text beats (A/B/C/D) fade in/out at defined scroll progress windows using `useTransform`

### UX Purpose
The centrepiece of the product presentation. The statue "comes to life" as the user scrolls — creating a tactile, engaging interaction that feels earned after completing the gamification phase.

---

## `JokerCard`
**Path:** `src/components/ui/JokerCard.tsx`

### Function
The flip-card riddle modal rendered inside each `ClueMesh` hotspot. Presents a riddle with multiple-choice answers.

### Props
| Prop | Type | Description |
|---|---|---|
| `id` | `number` | Riddle identifier |
| `riddle` | `string` | The riddle text |
| `options` | `string[]` | Answer choices |
| `correctAnswer` | `string` | The correct option |
| `onSuccess` | `() => void` | Called on correct answer |
| `onClose` | `() => void` | Called to dismiss the card |
| `isFlipped` | `boolean` | Whether the card is face-up |
| `isPaused` | `boolean` | Disables interaction when paused |

### Behaviour
- Wrong answer: visual shake animation, no state penalty, immediate retry
- Correct answer: success animation → `onSuccess()` → card exits scene

### UX Purpose
The riddle presentation. The flip-card mechanic adds a physical, tactile quality to the interaction. Wrong answers carry no timer penalty — the consequence is the time spent, not a discrete punishment.

---

## `MissionTimer`
**Path:** `src/components/ui/MissionTimer.tsx`

### Function
The live countdown display in the Navbar. Escalates visual treatment as time runs low.

### Props
| Prop | Type | Description |
|---|---|---|
| `timeLeft` | `number` | Seconds remaining |
| `isPaused` | `boolean` | Shows visual paused state |

### Visual States

| Time | State | Visual Treatment |
|---|---|---|
| > 30s | Normal | Gold text, `STATO_MISSIONE` label |
| 11–30s | Warning | Orange text |
| 1–10s | Urgent | Red + camera shake, fullscreen countdown digit |
| 0 | Dead | Mission failed, `handleTimeUp()` called |

### Fullscreen Countdown
When `timeLeft <= 10`, a secondary fullscreen overlay renders the current second as a massive red digit with scale-in/out animation per second tick.

---

## `ProgressTracker`
**Path:** `src/components/ui/ProgressTracker.tsx`

### Function
Visual indicator of how many clues have been found out of 5 total.

### Props
| Prop | Type | Description |
|---|---|---|
| `completedCount` | `number` | Clues found so far |
| `total` | `number` | Total clues (5) |

### UX Purpose
Gives the player a persistent sense of progress across all three panorama scenes. Visible in the Navbar during gamification.

---

## `FinalReveal`
**Path:** `src/components/ui/FinalReveal.tsx`

### Function
The post-mission reward screen. Shows completion time, performance rating, and a first glimpse of the product before transitioning to the showreel.

### Props
| Prop | Type | Description |
|---|---|---|
| `timeTaken` | `number` | Seconds taken to complete all riddles |
| `onComplete` | `() => void` | Transitions to showreel |
| `isPaused` | `boolean` | Pause state |

---

## `Checkout`
**Path:** `src/components/ui/Checkout.tsx`

### Function
The conversion screen. Displays order summary, applies speedrun discount if unlocked, and collects shipping/payment details.

### Props
| Prop | Type | Description |
|---|---|---|
| `speedrunUnlocked` | `boolean` | Whether the speedrun discount applies |
| `onClose` | `() => void` | Returns to showreel |

---

## `Pricing`
**Path:** `src/components/ui/Pricing.tsx`

### Function
Product pricing section rendered below the `BatmanCamera` showreel. Contains the primary "PRE-ORDINA ORA" CTA.

### Props
| Prop | Type | Description |
|---|---|---|
| `speedrunUnlocked` | `boolean` | Applies speedrun discount badge |
| `onPreorder` | `() => void` | Transitions to checkout |
