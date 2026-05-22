# PERFORMANCE
### Optimisation Strategy & Rendering Goals — The Dark Knight Experience

---

## Performance Philosophy

This experience carries an unusually heavy asset payload: 800 PNG frames for the showreel, 360° video textures, cinematic MP4 transitions, and real-time Three.js rendering. Every optimisation decision is made to ensure the user never perceives loading as waiting — only as cinematic pacing.

**Core principle: hide latency inside the experience.**

---

## Asset Inventory (Estimated)

| Asset Type | Count | Est. Size |
|---|---|---|
| Showreel PNG frames | 800 | ~80–120 MB total |
| 360° video (Batcomputer) | 1 MP4 | ~15–25 MB |
| Cinematic transition MP4s | 2 | ~20–40 MB |
| 360° equirectangular JPGs | 2 | ~4–10 MB |
| Audio WAV files | 2 | ~5–8 MB |

Total cold-load: **~120–200 MB** — managed entirely via progressive and lazy loading strategies.

---

## Showreel Preload Strategy

The 800-frame showreel is the heaviest component. The load is split into two phases to minimise perceived wait time.

### Phase 1 — Priority Load (Frames 1–120)

```typescript
const SHOW_THRESHOLD = 120;
const CONCURRENCY_LIMIT = 60;

// 60 concurrent workers race to load the first 120 frames
// Each image tagged with fetchPriority = "high"
// Experience unlocks (isLoaded = true) once 120 frames are ready
```

This means the showreel becomes interactive after loading only ~15% of its total frames. The remaining 680 frames load silently in the background while the user explores content above the fold.

### Phase 2 — Background Load (Frames 121–800)

```typescript
// Continues with fetchPriority = "low"
// Does not block the UI
// Frames are available progressively as the user scrolls deeper
```

### Frame Fallback Logic

If the target frame for the current scroll position is not yet loaded, the renderer scans backwards to find the nearest loaded frame:

```typescript
for (let i = frameIndex - 1; i >= 0; i--) {
  if (imagesRef.current[i]?.complete && imagesRef.current[i].naturalWidth !== 0) {
    img = imagesRef.current[i];
    break;
  }
}
```

This prevents black frames during scrolling. The user sees a slightly older frame rather than nothing.

### Loading Overlay

A `motion.div` with a gold progress bar (`loadedCount / TOTAL_FRAMES * 100%`) covers the canvas until `isLoaded === true`. Once the threshold is reached, the overlay exits via `AnimatePresence`.

---

## 360° Scene Loading

### Batcomputer — Video Texture

```typescript
const video = document.createElement("video");
video.src = "/assets/videos/BatCaverna360_BatComputerArea.mp4";
video.muted = true;
video.loop = true;
video.playsInline = true;

// Fires on canplay OR canplaythrough — whichever comes first
video.addEventListener("canplay", onReady, { once: true });

// Safety timer: clears loading state after 5s regardless
const safety = setTimeout(() => setIsLoading(false), 5000);
```

The video begins playing immediately and a `THREE.VideoTexture` is created from the live `<video>` element — no intermediate download step.

### Armeria / Batmobile — Static Texture with Fallback

```typescript
// Tries JPG first, falls back to PNG on error
const urls = [
  "/assets/textures/BatCaverna360_ArmeriaArea.jpg",
  "/assets/textures/BatCaverna360_ArmeriaArea.png"
];

// Recursive tryLoad(idx) attempts each URL in sequence
// Safety timer: 8s before forcing isLoading = false
```

### Pre-loading via CinematicVideoPlayer

The `CinematicVideoPlayer` accepts a `nextAsset` prop and begins fetching the next scene's texture while the transition video plays:

```typescript
// During transition1 video → preloads ArmeriaArea texture
// During transition2 video → preloads BatMobileArea texture
```

This means the next panorama scene is fully loaded (or nearly so) by the time the user arrives.

---

## Three.js Optimisations

### Renderer Settings

```typescript
<Canvas gl={{
  antialias: true,
  toneMapping: THREE.NoToneMapping,    // No post-processing overhead
  powerPreference: "high-performance"  // Requests discrete GPU if available
}}>
```

### Geometry

The panorama sphere uses `SphereGeometry(500, 60, 40)` — 60 width segments and 40 height segments. This provides sufficient visual quality for a 360° photo without excessive vertex count. The sphere is scaled `[-1, 1, 1]` (inverted on X) to render the texture on the inside.

### `React.memo` on SharedPanoramaCanvas

The canvas is wrapped in `React.memo` to prevent unnecessary re-renders from parent state changes that don't affect the canvas (e.g., `showBonusFeedback`).

```typescript
export default React.memo(SharedPanoramaCanvas);
```

### Texture Lifecycle

Textures are **never explicitly disposed** in cleanup functions because the Three.js Canvas may still be rendering them during React's async unmount cycle. Instead, they are replaced in state and garbage-collected naturally. This was a deliberate architectural decision to prevent WebGL errors from premature disposal.

---

## Animation Optimisations

### Spring-Smoothed Scroll (Showreel)

```typescript
const smoothProgress = useSpring(scrollYProgress, {
  stiffness: 150,
  damping: 40,
  restDelta: 0.001,
});
```

The spring interpolation smooths jerky scroll events into fluid camera motion. The canvas render is triggered only when `smoothProgress` changes, via:

```typescript
const unsubscribe = smoothProgress.on("change", render);
```

This avoids `requestAnimationFrame` polling when the user is not scrolling.

### Canvas Resize Handler

```typescript
const handleResize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render(); // Re-draw immediately after resize
};
window.addEventListener("resize", handleResize);
```

The canvas dimensions are updated on viewport resize to prevent blurry or clipped frames.

---

## Memory Management

### Showreel Image Array

800 `HTMLImageElement` references are stored in `imagesRef.current` — a plain ref array (not React state). This prevents React from tracking 800 state updates and triggering re-renders per frame load.

Only `loadedCount` (a plain integer) is stored in state, triggering a single re-render to update the progress bar.

### Audio Cleanup

```typescript
// Background music
return () => { audio.pause(); audio.src = ""; };

// Joker audio context
return () => {
  clearTimeout(nextLaughTimeoutRef.current);
  audioContextRef.current?.close();
};
```

Both audio systems explicitly release resources on component unmount. The `AudioContext.close()` call releases the Web Audio API resources allocated by the browser.

---

## Render Optimisation

### `AnimatePresence mode="wait"`

Used for mutually exclusive scene transitions. Ensures the exiting component fully unmounts before the entering component mounts — preventing simultaneous render of heavy scene components.

### `isPanoramaPhase` Guard

The SharedPanoramaCanvas is only mounted when the phase is in the panorama group. It is unmounted entirely during `intro`, `reveal`, `showreel`, and `checkout`, freeing the Three.js renderer.

---

## FPS Goals

| Context | Target | Strategy |
|---|---|---|
| Showreel (desktop) | 60 fps | Spring smoothing, canvas-only rendering |
| Three.js panorama (desktop) | 60 fps | Minimal geometry, no post-FX |
| Motion animations | 60 fps | GPU-composited transform/opacity only |
| Showreel (mobile) | 30 fps | Native browser throttling acceptable |

---

## Mobile Considerations

- The 360° experience is behind a warning on `< 768px` viewports. Mobile users are routed to the showreel path.
- The showreel canvas uses `window.innerWidth/Height` — it adapts to any viewport without CSS-based scaling artefacts.
- The `forceMobile` flag allows power users to bypass the warning and access the 360° experience on mobile if they choose.
- Touch events on the panorama canvas are not currently mapped to look controls — a known limitation. Future iteration: gyroscope-based look.

---

## Build & Bundle

```bash
# Development (Vite HMR, source maps)
npm run dev       # → http://localhost:3000

# Type check only (no emit)
npm run lint      # → tsc --noEmit

# Production build
npm run build     # → /dist

# Preview production build
npm run preview
```

**Vite configuration** (`vite.config.ts`):
- `@vitejs/plugin-react` for React 19 fast refresh
- `@tailwindcss/vite` for TailwindCSS v4 integration
- Static assets served from `/public` — no Vite processing, direct URL access
