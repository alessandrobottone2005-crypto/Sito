# GAME LOGIC
### Riddle System, Timer & Mission States — The Dark Knight Experience

---

## Overview

The gamification layer is a linear, stage-gated puzzle system distributed across three 360° panoramic environments. The player must solve 5 riddles in sequence (2 → 1 → 2) to progress. All game state is owned by `App.tsx`.

---

## Riddle Data

Riddles are hardcoded as static arrays inside `SharedPanoramaCanvas.tsx`. They are not fetched from an API.

### Batcomputer Riddles (Scene 1)

```typescript
const BATCOMPUTER_RIDDLES = [
  {
    id: 1,
    riddle: "Non è un uomo, non è un mostro, non è un re… ma tutta Gotham trattiene il respiro quando appare nel cielo.",
    options: ["Joker", "Batsegnale", "Pinguino", "Arkham"],
    correctAnswer: "Batsegnale"
  },
  {
    id: 2,
    riddle: "Ho un sorriso eterno, ma non conosco felicità. Più rido… più Gotham soffre.",
    options: ["Due Facce", "Robin", "Joker", "Enigmista"],
    correctAnswer: "Joker"
  }
];
```

### Armeria Riddle (Scene 2)

```typescript
const ARMERIA_RIDDLE = {
  id: 3,
  riddle: "Non ho superpoteri, ma faccio tremare i criminali. La notte è il mio regno.",
  options: ["Superman", "Batman", "Bane", "Flash"],
  correctAnswer: "Batman"
};
```

This riddle is the most narratively resonant: the correct answer is `"Batman"` — the identity the player is inhabiting. Solving it is an act of self-identification.

### Batmobile Riddles (Scene 3)

```typescript
const BATMOBILE_RIDDLES = [
  {
    id: 4,
    riddle: "CORRO PIÙ VELOCE DEL VENTO E BRUCIO L'ASFALTO DI GOTHAM. COSA SONO?",
    options: ["Batwing", "Batmobile", "Joker Van", "Treno di Gotham"],
    correctAnswer: "Batmobile"
  },
  {
    id: 5,
    riddle: "SONO IL MOTORE CHE RUGGISCE NELLA NOTTE. COSA SONO?",
    options: ["Reattore", "Turbina", "Pistone"],
    correctAnswer: "Reattore"
  }
];
```

Riddles 4 and 5 use all-caps text — stylistically matching the Batmobile zone's more intense, mechanical environment.

---

## Clue Hotspot System

### Spawn Positions

Clue positions are **randomised on every scene mount** using spherical coordinates:

```typescript
const count = scene === "armeria" ? 1 : 2;
const pts: [number, number, number][] = [];
let tries = 0;

while (pts.length < count && tries++ < 300) {
  const phi   = Math.random() * 1.8 + 0.6;     // avoid poles
  const theta = Math.random() * Math.PI * 2;    // full sweep
  const p: [number, number, number] = [
    200 * Math.sin(phi) * Math.cos(theta),
    200 * Math.cos(phi),
    200 * Math.sin(phi) * Math.sin(theta)
  ];
  // Reject if closer than 120 units to an existing clue
  if (!pts.some(q => Math.hypot(q[0]-p[0], q[1]-p[1], q[2]-p[2]) < 120)) {
    pts.push(p);
  }
}
```

**Why random?** Replaying the experience (after failure/reset) presents a different layout, increasing replayability and preventing players from memorising clue locations after one run.

**Pole avoidance:** The `phi` range `[0.6, 2.4]` keeps clues out of the ceiling and floor quadrants where equirectangular textures typically distort and where they would be visually awkward to interact with.

### Hotspot Visual

Each clue renders as a `ClueMesh` — a Three.js `group` with an `Html` overlay:

```
State: idle (not hovered, not active)
  → Pulsing green glow (box-shadow keyframe animation)
  → Batman-logo SVG icon, scale oscillating 0.8 → 1.2

State: hovered
  → Bright green glow (max intensity)
  → Scale: 1.05
  → MouseLookControls disabled (camera freezes)

State: active (clicked, riddle open)
  → ClueMesh lerps toward camera (Framer-like Three.js animation)
  → JokerCard renders at full opacity
  → MouseLookControls disabled

State: completed
  → ClueMesh returns null (hotspot disappears)
```

---

## Quiz System

### Answer Selection

The `JokerCard` component renders multiple-choice options. There is no input field — only button clicks. The answer system:

```
Player selects option
  │
  ├── Correct
  │     → Success animation on card
  │     → onSuccess() called
  │     → ClueMesh.completedIds updated
  │     → App.completedCount incremented via onProgress()
  │
  └── Wrong
        → Card shake animation (CSS keyframe)
        → No penalty — retry immediately
        → No attempt limit
```

**Design decision:** Wrong answers carry **no game penalty** (no time deduction, no strike system). The penalty is implicit — every second spent answering incorrectly is a second closer to zero. This avoids frustration while maintaining pressure.

---

## Progress Tracking

### Scene-Level Tracking (`SharedPanoramaCanvas`)

Each scene instance tracks its own `completedIds: number[]`. When `completedIds.length >= needed`:

```typescript
const needed = scene === "armeria" ? 1 : 2;
if (newCompleted.length >= needed) {
  setTimeout(() => { setIsExiting(true); setTimeout(onNext, 1000); }, 1000);
}
```

The 1-second delay before `setIsExiting` gives the player a moment to see the "last clue solved" animation before the scene transition begins.

### App-Level Tracking

`onProgress(count)` emits the **aggregate** clue count to `App.tsx`:

```typescript
onProgress(baseCompleted + newCompleted.length);
```

Where `baseCompleted` is:
- `0` for Batcomputer (first scene)
- `2` for Armeria (second scene, after 2 Batcomputer clues)
- `3` for Batmobile (third scene, after 3 total clues)

`App.tsx` stores this as `completedCount` and passes it to the Navbar's `ProgressTracker`.

---

## Timer System

### A/B Group Assignment

On mount, the player is randomly assigned to a timer group:

```typescript
const group = Math.random() < 0.5 ? "A" : "B";
const seconds = group === "A" ? 120 : 240;
```

| Group | Time | Notes |
|---|---|---|
| A | 120 seconds | High urgency — creates panic on Batmobile |
| B | 240 seconds | Comfortable exploration pace |

The assignment is logged: `[A/B TEST] Assegnato al Gruppo B (240s timer)`

### Timer Tick

```typescript
useEffect(() => {
  let interval: NodeJS.Timeout;
  if (missionStatus === "active" && !isPaused && !isVideoTransition && timeLeft > 0) {
    interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleTimeUp(); return 0; }
        return prev - 1;
      });
    }, 1000);
  }
  return () => clearInterval(interval);
}, [missionStatus, isPaused, isVideoTransition, timeLeft]);
```

The interval is destroyed and recreated whenever its dependencies change. This is the correct pattern for React-based timers — it avoids stale closure issues with `timeLeft`.

### Timer Freeze During Transitions

```typescript
const isVideoTransition = phase === "transition1" || phase === "transition2";
```

When `isVideoTransition === true`, the interval condition is false and the timer does not tick. This is critical fairness logic — the player cannot lose time to a cinematic they cannot skip or interact with.

### Visual Escalation

| Threshold | Visual Change |
|---|---|
| `timeLeft > 30` | Gold text — normal |
| `timeLeft <= 30` | Orange text — warning |
| `timeLeft <= 10` | Red + camera shake — urgent |
| `timeLeft <= 10` | Fullscreen digit countdown — critical |

---

## Bonus Time Mechanic

If the player solves their first 2 clues within 45 seconds of mission start, they receive a **+60 second bonus**:

```typescript
if (completedCount === 2
  && missionStatus === "active"
  && !bonusTimeGranted
  && (initialTime - timeLeft) <= 45
) {
  setTimeLeft(prev => prev + 60);
  setBonusTimeGranted(true);
  setShowBonusFeedback(true);
  setTimeout(() => setShowBonusFeedback(false), 4000);
}
```

**Purpose:** Rewards fast starters. Provides breathing room for Group A players (120s) who are particularly time-pressured. The `bonusTimeGranted` flag ensures it fires exactly once.

---

## Speedrun Easter Egg

```typescript
if (completedCount === 5 && missionStatus === "active") {
  const timeTaken = initialTime - timeLeft;
  if (timeTaken < 90) {
    setSpeedrunUnlocked(true);
  }
  setMissionStatus("succeeded");
  changePhase("breather");
}
```

Players who complete all 5 riddles in under 90 seconds receive `speedrunUnlocked = true`. This flag persists through the rest of the experience and unlocks:
- A visual badge at the Pricing section
- A price discount at Checkout

This mechanic is an **undisclosed** Easter Egg — it is never mentioned in the UI during the game. Players discover it only when they see the discount applied.

---

## Game States

```
missionStatus = "idle"
  → Initial state. Timer not ticking. Joker audio off.
  → Present during: intro, breather, reveal, showreel, checkout

missionStatus = "active"
  → Timer ticking. Joker audio active. Progress counting.
  → Present during: batcomputer, armeria, batmobile

missionStatus = "succeeded"
  → Timer stopped. All 5 clues collected.
  → Joker audio stops. Phase → breather.

missionStatus = "failed"
  → timeLeft reached 0.
  → ExplosionOverlay renders. Two recovery paths.
```

---

## Victory Condition

```typescript
useEffect(() => {
  if (completedCount === 5 && missionStatus === "active") {
    const timeTaken = initialTime - timeLeft;
    setFinalTimeTaken(timeTaken);
    if (timeTaken < 90) setSpeedrunUnlocked(true);
    setMissionStatus("succeeded");
    changePhase("breather");
  }
}, [completedCount, missionStatus]);
```

The effect is triggered by `completedCount` changing. The `missionStatus === "active"` guard prevents accidental re-triggering if the effect runs after status has already changed.

---

## Failure Condition

```typescript
const handleTimeUp = () => setMissionStatus("failed");

// Inside the timer tick:
if (prev <= 1) { handleTimeUp(); return 0; }
```

The `setMissionStatus("failed")` call triggers the `ExplosionOverlay` via `AnimatePresence` in the render tree. The timer stops automatically because the `missionStatus !== "active"` condition gates the interval.

---

## Reset Flow

```typescript
const handleResetMission = () => {
  setMissionStatus("idle");
  setPhase("intro");
  setCompletedCount(0);
  setTimerResetKey(prev => prev + 1);   // Forces child timer re-mount if needed
  setPanoramaScene("batcomputer");
  const seconds = timerABGroup === "A" ? 120 : 240;
  setTimeLeft(seconds);                  // Restore original A/B group time
  setBonusTimeGranted(false);
  setShowBonusFeedback(false);
  setSpeedrunUnlocked(false);
  // Audio: pause, seek to 20s for next mission start
};
```

The A/B group assignment is **preserved across resets** — a player in Group A stays in Group A. This maintains the validity of A/B test data.
