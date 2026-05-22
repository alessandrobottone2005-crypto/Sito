# SHOWREEL SYSTEM
### Scroll-Driven Product Reveal — The Dark Knight Experience

---

## Overview

The showreel is the centrepiece of the product presentation phase. It is a **scroll-driven, frame-by-frame animation** of 800 PNG images rendered on an HTML5 canvas. As the user scrolls down the page, the Batman statue "rotates" or "animates" in real time — creating the sensation of physically handling the object before purchasing it.

This technique — sometimes called a **scroll-jacked image sequence** — is used by premium product brands (Apple, luxury watchmakers, high-end collectibles) to create tactile engagement with products that cannot be physically touched.

---

## Component: `BatmanCamera`

**Path:** `src/components/ui/BatmanCamera.tsx`

The component is self-contained and manages its own loading, rendering, and overlay systems.

### Scroll Container Architecture

```tsx
<div ref={containerRef} className="relative h-[800vh]">
  {/* Fixed viewport — stays on screen during entire scroll */}
  <div className="fixed inset-0 w-full h-full z-10 pointer-events-none">
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    {/* HUD overlay, text beats, vignette */}
  </div>
</div>
```

The container is `800vh` tall — 8× the viewport height — giving the scroll sequence a long, deliberate pacing. The canvas is `fixed` to the viewport, so it doesn't scroll with the page; it only updates its frame as the scroll position changes.

### Scroll → Frame Mapping

```typescript
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end end"],
});

// Smooth with spring physics
const smoothProgress = useSpring(scrollYProgress, {
  stiffness: 150,
  damping: 40,
  restDelta: 0.001,
});

// Map 0–1 progress to 1–800 frame index
const frameIndex = Math.min(
  Math.max(1, Math.floor(progressValue * TOTAL_FRAMES)),
  TOTAL_FRAMES
);
```

The spring interpolation (`stiffness: 150, damping: 40`) converts the raw `scrollYProgress` value (which jumps discretely with each scroll event) into a smoothly animated motion value. The result is that the statue appears to rotate with physical inertia — it coasts to a stop when scrolling ends.

---

## Asset Loading Strategy

### Two-Phase Concurrent Loading

```typescript
const TOTAL_FRAMES    = 800;
const SHOW_THRESHOLD  = 120;   // Frames needed to unlock the UI
const CONCURRENCY_LIMIT = 60;  // Max parallel HTTP requests
```

**Phase 1 — Priority (frames 1–120):**
- 60 concurrent fetch workers
- All images tagged `fetchPriority = "high"`
- Once 120 frames are loaded → `isLoaded = true` → canvas unlocks

**Phase 2 — Background (frames 121–800):**
- Continues with same 60 workers (now targeting remaining frames)
- Tagged `fetchPriority = "low"` to avoid competing with critical resources
- Loads silently; the user is already scrolling through frames 1–120

### Worker Pattern

```typescript
const workers = Array(CONCURRENCY_LIMIT).fill(null).map(async () => {
  while (currentIndex <= SHOW_THRESHOLD && isMounted) {
    const index = currentIndex++;  // Atomically claim next index
    await loadImage(index);
  }
});
await Promise.all(workers);
```

The shared `currentIndex` pointer prevents duplicate loads. Workers race to claim the next unloaded frame index. This saturates the browser's HTTP connection pool without creating duplicate requests.

### Frame Storage

```typescript
const imagesRef = useRef<HTMLImageElement[]>([]);
// imagesRef.current[0] = frame 1, [1] = frame 2, etc.
```

All 800 `HTMLImageElement` references are stored in a plain ref — not in React state. This is critical: storing 800 items in state would trigger 800 re-renders during loading. The ref is invisible to React's reconciler.

Only `loadedCount` (a single integer) is stored in state, providing the progress bar percentage without per-frame render cycles.

---

## Canvas Rendering

### Frame Draw Logic

```typescript
const render = () => {
  const progressValue = smoothProgress.get();
  const frameIndex = Math.min(Math.max(1, Math.floor(progressValue * TOTAL_FRAMES)), TOTAL_FRAMES);

  let img = imagesRef.current[frameIndex - 1];

  // Fallback: scan backward for nearest loaded frame
  if (!img || !img.complete || img.naturalWidth === 0) {
    for (let i = frameIndex - 1; i >= 0; i--) {
      if (imagesRef.current[i]?.complete && imagesRef.current[i].naturalWidth !== 0) {
        img = imagesRef.current[i];
        break;
      }
    }
  }

  // Draw with aspect-ratio cover
  if (img && img.complete && img.naturalWidth !== 0) {
    const imgRatio    = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;
    let dw, dh, ox, oy;

    if (imgRatio > canvasRatio) {
      // Image wider than canvas → constrain by height
      dh = canvas.height; dw = dh * imgRatio;
      ox = (canvas.width - dw) / 2; oy = 0;
    } else {
      // Image taller than canvas → constrain by width
      dw = canvas.width; dh = dw / imgRatio;
      ox = 0; oy = (canvas.height - dh) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, ox, oy, dw, dh);
  }
};
```

The cover-fit algorithm ensures the frame always fills the canvas while maintaining aspect ratio — matching the behaviour of CSS `object-fit: cover`.

### Render Trigger

```typescript
const unsubscribe = smoothProgress.on("change", render);
```

The canvas re-draws only when `smoothProgress` emits a change. When the user is not scrolling, the value is stable and `render()` is not called. This is dramatically more efficient than a `requestAnimationFrame` loop.

### Resize Handler

```typescript
const handleResize = () => {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  render(); // Force immediate redraw at new dimensions
};
window.addEventListener("resize", handleResize);
handleResize(); // Set initial size
```

---

## Text Beat Overlays

Four cinematic text panels fade in and out at defined scroll progress windows. Each panel describes a product attribute.

### Beat Definitions

```typescript
const useBeatStyle = (start: number, end: number) => {
  const opacity = useTransform(scrollYProgress, [start, start+0.05, end-0.05, end], [0, 1, 1, 0]);
  const scale   = useTransform(scrollYProgress, [start, start+0.05, end-0.05, end], [0.8, 1, 1, 1.2]);
  const y       = useTransform(scrollYProgress, [start, start+0.05, end-0.05, end], [20, 0, 0, -20]);
  return { opacity, scale, y };
};

const beatA = useBeatStyle(0.1, 0.25);  // "SCULPTING DI PRECISIONE"
const beatB = useBeatStyle(0.3, 0.45);  // "MATERIALI PREMIUM"
const beatC = useBeatStyle(0.5, 0.65);  // "EDIZIONE LIMITATA"
const beatD = useBeatStyle(0.7, 0.9);   // "PRESENZA ICONICA"
```

### Beat Timing

| Beat | Scroll 0–1 | Message | Emotional Purpose |
|---|---|---|---|
| A | 10%–25% | SCULPTING DI PRECISIONE | Craft. Detail. Artisanal quality. |
| B | 30%–45% | MATERIALI PREMIUM | Material value. Museum-grade. |
| C | 50%–65% | EDIZIONE LIMITATA | Scarcity. Urgency. Collector's logic. |
| D | 70%–90% | PRESENZA ICONICA | Identity. Legacy. Why it matters. |

Each beat enters with a subtle `scale` from 0.8 and `y` offset from +20px, then exits with `scale` to 1.2 and `y` to -20px — mimicking a cinematic cut where text "passes through" the frame.

### HUD Corner Decorators

Each text beat wraps a `<HudCorners />` component:

```tsx
function HudCorners({ color = "rgba(255,215,0,0.5)" }) {
  return (
    <>
      <div className="hud-corner-tl hud-pulse" style={{ borderColor: color }} />
      <div className="hud-corner-tr hud-pulse" style={{ borderColor: color }} />
      <div className="hud-corner-bl hud-pulse" style={{ borderColor: color }} />
      <div className="hud-corner-br hud-pulse" style={{ borderColor: color }} />
    </>
  );
}
```

The `.hud-pulse` animation causes the corner brackets to breathe (opacity 0.3 → 1 → 0.3), keeping the frame alive even when the text is static.

---

## Loading Overlay

```tsx
<AnimatePresence>
  {!isLoaded && (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
    >
      <div className="text-gold font-mono text-[10px] tracking-[1em] mb-4">
        CARICAMENTO_RISORSE
      </div>
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gold"
          animate={{ width: `${(loadedCount / TOTAL_FRAMES) * 100}%` }}
        />
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

The overlay exits with a fade when `isLoaded` becomes true (at frame 120). The progress bar fills from 0% to 100% over the full 800-frame load — by the time it reaches 100%, the user has likely already scrolled through most of the sequence.

---

## HUD Overlay Layer

A persistent HUD is rendered above the canvas (z-20) at low opacity (0.4):

```
Top-left panel:  "ID: B-KNIGHT-87 // SCAN: ACTIVE"
Top-right panel: "COORD: 40.712 N // LONG: 74.006 O"
Axis lines:      Horizontal and vertical HUD crosshairs
```

These elements reinforce the Batcomputer / surveillance aesthetic from the gamification phase — the product reveal feels like a continuation of the same world, not a jarring transition to a standard product page.

---

## Pricing Integration

`BatmanCamera` is followed immediately by `Pricing` in the showreel phase:

```tsx
{phase === "showreel" && (
  <div key="showreel" className="relative z-10">
    <BatmanCamera onPreorder={() => changePhase("checkout")} />
    <Pricing speedrunUnlocked={speedrunUnlocked} onPreorder={() => changePhase("checkout")} />
  </div>
)}
```

The `Pricing` section begins below the `BatmanCamera` container (which is `800vh` tall). The user must scroll through the entire animation before reaching the price — maximising product desire before cost anchoring.

---

## CTA Structure

```
Showreel scroll completes
    │
    ▼
Pricing section visible
    │
    ├── Speedrun badge visible (if speedrunUnlocked)
    │
    ▼
"PRE-ORDINA ORA" button
    │
    ▼
changePhase("checkout")
    │
    ▼
Checkout component mounts
```
