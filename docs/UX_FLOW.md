# UX FLOW
### Complete User Journey — The Dark Knight Experience

---

## Design Principle

This experience is a **narrative funnel**, not a traditional product page. The user journey is structured as a three-act story: **tension** (gamification), **release** (reveal), and **conversion** (checkout). Each phase serves a specific psychological function.

---

## Full Experience Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 0 — LANDING                                                      │
│  URL: / (root)                                                          │
│  State: phase = "intro"                                                 │
│  Duration: ~18 seconds (auto-sequenced) + user trigger                  │
└─────────────────────────────────────────────────────────────────────────┘
           │
           ▼ [User clicks "INIZIA LA MISSIONE"]
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 1 — BATCOMPUTER (360° Panorama)                                  │
│  State: phase = "batcomputer"                                           │
│  Objective: Find 2 hidden riddle hotspots                               │
│  Timer: Running. Joker audio: active.                                   │
└─────────────────────────────────────────────────────────────────────────┘
           │
           ▼ [2 riddles solved]
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 2 — CINEMATIC TRANSITION 1                                       │
│  State: phase = "transition1"                                           │
│  Asset: BatCaverna_PassaggioBatComputerAArmeria.mp4                     │
│  Timer: FROZEN. Canvas: alive underneath.                               │
└─────────────────────────────────────────────────────────────────────────┘
           │
           ▼ [Video ends — onEnded()]
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 3 — ARMERIA (360° Panorama)                                      │
│  State: phase = "armeria"                                               │
│  Objective: Find 1 hidden riddle hotspot                                │
│  Timer: Resumes. Tension increases.                                     │
└─────────────────────────────────────────────────────────────────────────┘
           │
           ▼ [1 riddle solved]
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 4 — CINEMATIC TRANSITION 2                                       │
│  State: phase = "transition2"                                           │
│  Asset: BatCaverna_PassaggioArmeriaABatMobile.mp4                      │
│  Timer: FROZEN.                                                         │
└─────────────────────────────────────────────────────────────────────────┘
           │
           ▼ [Video ends]
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 5 — BATMOBILE (360° Panorama)                                    │
│  State: phase = "batmobile"                                             │
│  Objective: Find 2 final riddles. Max urgency.                          │
│  Timer: Running. Final stretch.                                         │
└─────────────────────────────────────────────────────────────────────────┘
           │
           ▼ [All 5 riddles solved — completedCount === 5]
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 6 — BREATHER (4.4 seconds)                                       │
│  State: phase = "breather"                                              │
│  Screen: "BOMBA DISINNESCATA" — green text, black screen                │
│  Audio: Batman theme fades out, then fades back in softly               │
└─────────────────────────────────────────────────────────────────────────┘
           │
           ▼ [Auto after 4.4s]
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 7 — FINAL REVEAL                                                 │
│  State: phase = "reveal"                                                │
│  Component: FinalReveal                                                 │
│  Shows: Time taken, performance rating, statue teaser                   │
└─────────────────────────────────────────────────────────────────────────┘
           │
           ▼ [onComplete()]
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 8 — SHOWREEL                                                     │
│  State: phase = "showreel"                                              │
│  Component: BatmanCamera + Pricing                                      │
│  Mechanic: Scroll-driven 800-frame animation                            │
└─────────────────────────────────────────────────────────────────────────┘
           │
           ▼ [onPreorder()]
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 9 — CHECKOUT                                                     │
│  State: phase = "checkout"                                              │
│  Component: Checkout                                                    │
│  Goal: Order conversion. Speedrun discount applied if unlocked.         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Onboarding — Intro Sequence (Step-by-Step)

The intro screen is fully automated and self-advancing. No user action is required until the final CTA.

| Time | Event |
|---|---|
| 0ms | Screen loads black. `SEGNALE_INTERCETTATO...` flickers |
| 1500ms | Joker symbol materialises (blurred, then sharpens) |
| 2000ms | Briefing text 1: *"Batman... Ti ho lasciato una piccola sorpresa..."* |
| 5000ms | Briefing text 2: *"Da qualche parte nella Batcaverna..."* |
| 8000ms | Briefing text 3: *"Ma fai attenzione... questo regalo contiene una bomba."* |
| 11000ms | Briefing text 4: *"Risolvi tutti e 5 gli indizi prima che il tempo finisca..."* |
| 14000ms | Briefing text 5: *"...oppure Gotham sentirà l'esplosione."* |
| 17000ms | Timer preview (03:00) + "INIZIA LA MISSIONE" button appears |

The user may **skip** by clicking the ghost text `MANOMISSIONE_JOKER_ATTIVA // SKIP_MISSION_BYPASS` in the bottom-right corner.

---

## Gamification Loop

```
Enter Scene
    │
    ▼
Mouse-look to explore 360° environment
    │
    ▼
Spot glowing green hotspot (pulsing, breathing glow)
    │
    ▼
Hover → camera auto-stops (MouseLookControls disabled)
    │
    ▼
Click hotspot → JokerCard flips into view (riddle appears)
    │
    ├──► Select wrong answer → card shakes, no penalty, retry
    │
    └──► Select correct answer → card exits, clue count +1
              │
              ▼
         completedCount < scene target → continue exploring
              │
         completedCount === scene target
              │
              ▼
         Scene exit animation (black fade 1s) → transition video or breather
```

---

## Bonus Time System

A one-time bonus of **+60 seconds** is awarded if the user solves the **first 2 riddles in under 45 seconds** from mission start.

```
completedCount === 2
&& missionStatus === "active"
&& !bonusTimeGranted
&& (initialTime - timeLeft) <= 45
```

A toast notification slides in from the top: `RIVELAZIONE RAPIDA ARMA — +60 SECONDI DI BONUS TEMPO`.

This mechanic rewards skilled, exploratory players and prevents early-mission frustration for engaged users.

---

## Speedrun Reward

If the player completes all 5 riddles in **under 90 seconds** total, `speedrunUnlocked` is set to `true`. This unlocks a visual discount badge and reduced pricing at the checkout screen.

```
completedCount === 5
&& (initialTime - timeLeft) < 90
→ speedrunUnlocked = true
```

---

## Failure State

When `timeLeft` reaches 0:

1. `missionStatus` → `"failed"`
2. `ExplosionOverlay` renders fullscreen — red, chaotic, cinematic
3. Two options presented:
   - **Reset Mission** → full restart from intro
   - **Skip to Product** → advances to `breather` (graceful exit)

This failure state is emotionally charged but never punishing — the skip option ensures conversion is never permanently blocked.

---

## Mobile Path

On viewport width < 768px, a **mobile warning overlay** intercepts the experience before gamification begins:

```
"DISPOSITIVO NON OTTIMIZZATO"
→ [Salta al Prodotto & Ordina]   → changePhase("breather") + missionStatus "succeeded"
→ [Forza Esplorazione a 360°]    → setForceMobile(true) — bypasses warning
```

Mobile users are directed to the showreel/checkout path as the primary CTA. The 360° experience remains accessible on request.

---

## Pause State

Pause is available during: `batcomputer`, `armeria`, `batmobile`, `showreel`.

When paused:
- Timer freezes
- 360° video texture pauses
- MouseLookControls disabled
- JokerAudioManager stops scheduling laughs
- A `backdrop-blur` overlay renders: "MISSIONE IN PAUSA"

---

## Conversion Flow

```
BatmanCamera (scroll) → Pricing → [PRE-ORDINA ORA] button
    │
    ▼
Checkout component
    ├── Order summary
    ├── Speedrun discount applied (if unlocked)
    ├── Shipping details form
    └── Payment CTA
```

The `showreel` phase intentionally places the pricing section **after** the full 800-frame animation. The user must scroll through the entire product reveal before the price is visible. This maximises perceived value before cost anchoring.

---

## UX Pacing Summary

| Phase | Emotional State | Design Goal |
|---|---|---|
| Intro | Curiosity / alarm | Establish stakes. Create urgency. |
| Batcomputer | Focus / exploration | Reward looking. Establish game loop. |
| Transition 1 | Relief / anticipation | Breath. Rebuild tension with movement. |
| Armeria | Heightened focus | One hard riddle. Stakes feel real. |
| Transition 2 | Anxiety | Timer pressure peaks. Last chance. |
| Batmobile | Urgency / flow state | Final sprint. Satisfying if fast. |
| Breather | Release / triumph | Emotional payoff. |
| Reveal | Awe / pride | The reward. First product glimpse. |
| Showreel | Desire / aspiration | Product love. Build want. |
| Checkout | Decision / action | Convert. Remove friction. |
