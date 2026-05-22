# ANIMATION GUIDELINES
### Motion Language & Timing — The Dark Knight Experience

---

## Philosophy

Motion in this experience is **always purposeful** and **never decorative**. Every animation either:

1. **Communicates state** — something changed, something matters
2. **Reinforces narrative** — the world breathes, the Joker lurks, the bomb ticks
3. **Provides spatial context** — where am I, where did that come from, where is it going

Gratuitous animation is the enemy. A static frame that earns its stillness is more cinematic than constant motion.

---

## Animation Library

All animations use **Motion (Framer Motion v12)** via the `motion/react` import:

```typescript
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "motion/react";
```

CSS keyframe animations (defined in `index.css`) are used for:
- Glitch effects
- Scan line sweeps
- HUD pulsing
- Camera shake
- Cursor blink

---

## Motion Language

### The Three Registers

| Register | Speed | Feel | Use Case |
|---|---|---|---|
| **Cinematic** | 800ms–1500ms | Weighty, deliberate | Phase transitions, reveals |
| **Interactive** | 200ms–400ms | Responsive, tactile | Hover, click, card flip |
| **Ambient** | 1500ms–4000ms | Breathing, living | Glow pulses, scan lines, HUD elements |

Never mix registers in a single element. A button that responds to hover should not also animate on an ambient cycle.

---

## Easing Reference

| Context | Easing | Tailwind / Motion |
|---|---|---|
| Phase transitions | `ease-out` | Decelerate to rest |
| Text reveals | `easeOut` with blur | Arrives with weight |
| Card flip | `easeInOut` | Symmetric, physical |
| Scroll canvas | Spring `stiffness 150, damping 40` | Inertial |
| Hover scale | Linear | Immediate response |
| Glitch offsets | `step-end` | Digital, non-eased |

---

## Transition Timing

### Phase Transitions (`changePhase`)

```
User action → isTransitioning = true
    │
    ▼ (0ms)
TransitionOverlay fades IN → 400ms ease-out
    │
    ▼ (400ms)
Phase state changes → new component mounts
    │
    ▼ (1000ms)
isTransitioning = false → TransitionOverlay fades OUT
```

Total visible transition: ~600ms (400ms in + ~200ms before exit begins)

### `AnimatePresence` — Exit Before Enter

All primary phase changes use `AnimatePresence mode="wait"`:

```tsx
<AnimatePresence mode="wait">
  {phase === "intro" && (
    <motion.div
      key="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
```

`mode="wait"` ensures the exit animation of the outgoing component completes before the incoming component begins its enter animation. This prevents simultaneous renders of heavy scene components.

### Breather Phase — Chained Automation

```
Mission success
    → missionStatus = "succeeded"
    → changePhase("breather")        [400ms transition]
    → Breather text renders
    → 4400ms wait (audio fade)
    → changePhase("reveal")          [400ms transition]
    → reveal mounts with fade-in music
```

Total: ~5.2 seconds of orchestrated time from last clue solved to reveal screen.

---

## Camera Movement — 360° Panorama

### MouseLookControls

Free-look navigation maps raw `mousemove` delta values to camera `rotation.y` and `rotation.x`. The sensitivity is calibrated to feel like physical head rotation — not too fast (dizzy), not too slow (sluggish).

```
mousemove delta X → camera.rotation.y (horizontal look)
mousemove delta Y → camera.rotation.x (vertical look, clamped)
```

The vertical axis is **clamped** to prevent the camera from flipping past the ceiling or floor — a disorienting experience in a spherical environment.

### Auto-Stop on Hover

When the user hovers a clue hotspot:

```typescript
onHoverChange(true) → hoveredCluesCount++
→ MouseLookControls enabled={hoveredCluesCount === 0}
```

This is an intentional **frustration eliminator**. Without it, the user would have to chase the hotspot while the camera drifts, making clicking impossible. The camera freezes the moment a hotspot is hovered.

---

## Showreel — Scroll-Driven Camera

The 800-frame canvas sequence uses spring physics to simulate camera weight:

```typescript
const smoothProgress = useSpring(scrollYProgress, {
  stiffness: 150,   // Higher = snappier
  damping: 40,      // Higher = less oscillation
  restDelta: 0.001  // Stops when change is < 0.1%
});
```

The result: fast scroll → statue rotates quickly but coasts to stop. Slow scroll → statue moves slowly and precisely. The spring means the statue never feels "locked to" the scroll position — it has physical weight.

**Why not `useTransform` directly?** Raw `scrollYProgress` jumps discretely on each scroll event. The spring interpolation fills in the gaps, creating the illusion of 60fps animation from ~10 scroll events per second.

---

## Text Beat Animations (Showreel)

Each product attribute text panel enters and exits through a consistent choreography:

```typescript
// Enter: scale from 0.8, y from +20, opacity from 0
// Hold: full opacity for 10% of scroll progress
// Exit: scale to 1.2, y to -20, opacity to 0

const opacity = useTransform(progress, [start, start+0.05, end-0.05, end], [0, 1, 1, 0]);
const scale   = useTransform(progress, [start, start+0.05, end-0.05, end], [0.8, 1, 1, 1.2]);
const y       = useTransform(progress, [start, start+0.05, end-0.05, end], [20, 0, 0, -20]);
```

The +20px/-20px vertical offset gives the text direction — it rises in and floats out. The scale 0.8→1→1.2 mimics a camera pulling back, giving the words filmic weight.

---

## UI Micro-animations

### Button Hover

```typescript
// Motion component
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

The 1.02 scale is intentionally subtle — enough to feel responsive without being showy. 1.05+ feels playful; 1.02 feels premium.

### Hotspot Idle Pulse (Three.js)

```typescript
// AnimatePresence motion.div inside Html overlay
animate={{
  boxShadow: [
    "0 0 20px rgba(57,255,20,0.2)",
    "0 0 60px rgba(57,255,20,0.7)",
    "0 0 20px rgba(57,255,20,0.2)"
  ],
  scale: [1, 1.05, 1]
}}
transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
```

This "breathing" animation cycles over 1.5 seconds. It is perceptible but not distracting — the hotspot is always visible, never shouting.

### ClueMesh 3D Lerp (Activated State)

When a hotspot is clicked, it physically moves toward the player's camera:

```typescript
// useFrame — every render tick
if (isActive) {
  const dir = state.camera.getWorldDirection(new THREE.Vector3());
  targetWorldPos.current.copy(state.camera.position).add(dir.multiplyScalar(60));
  meshRef.current.position.lerp(targetWorldPos.current, delta * 5);
  meshRef.current.quaternion.slerp(state.camera.quaternion, delta * 5);
  meshRef.current.scale.lerp(new THREE.Vector3(0.6, 0.6, 0.6), delta * 5);
}
```

`lerp(target, delta * 5)` creates exponential approach — the clue card accelerates toward the camera, then decelerates as it arrives. This is physically believable and visually satisfying.

---

## Ambient Animations (CSS)

Defined in `index.css` and applied globally:

### Glitch System

```css
@keyframes glitchSlow {
  0%, 90%, 100% { clip-path: none; transform: none; }
  91% { clip-path: inset(20% 0 30% 0); transform: translateX(-4px); }
  93% { clip-path: inset(60% 0 10% 0); transform: translateX(4px); }
  95% { clip-path: none; transform: none; }
}
```

Three intensities: `glitch-slow` (fires every ~6s), `glitch-med` (every ~4s), `glitch-main` (every ~3s). Used sparingly — only on headings and key narrative text.

### Scan Sweep

```css
@keyframes scanSweep {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
.scan-sweep-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.03);
  animation: scanSweep 8s linear infinite;
}
```

The scan line sweeps the IntroScreen every 8 seconds at near-invisible opacity. Its purpose is subliminal: reinforcing the CRT/surveillance monitor aesthetic.

### HUD Pulse

```css
@keyframes hudPulse {
  0%, 100% { opacity: 0.3; }
  50%       { opacity: 1; }
}
.hud-pulse { animation: hudPulse 2s ease-in-out infinite; }
```

Used on corner bracket decorators throughout the experience. Makes the HUD feel alive without distracting.

### Camera Shake

```css
@keyframes cameraShake {
  0%  { transform: translate(0, 0); }
  20% { transform: translate(-2px, 1px); }
  40% { transform: translate(2px, -1px); }
  60% { transform: translate(-1px, 2px); }
  80% { transform: translate(1px, -2px); }
  100%{ transform: translate(0, 0); }
}
.camera-shake { animation: cameraShake 0.5s infinite; }
```

Applied to the timer display and countdown number when `timeLeft <= 10`. The rapid pixel-jitter communicates physical instability and system collapse.

---

## Animation Checklist for New Components

Before shipping any new animated component:

- [ ] Does every animated element have a clear **purpose** (state communication, spatial context, or narrative)?
- [ ] Are all durations consistent with the **three registers** (cinematic, interactive, ambient)?
- [ ] Is `AnimatePresence` used for any component that conditionally mounts/unmounts?
- [ ] Do hover animations use `whileHover` rather than CSS `:hover` transitions where motion is involved?
- [ ] Are `initial` / `animate` / `exit` all specified when using `AnimatePresence`?
- [ ] Is there a `key` prop on all children of `AnimatePresence`?
- [ ] Does the animation work correctly with `pointer-events: none` where required?
