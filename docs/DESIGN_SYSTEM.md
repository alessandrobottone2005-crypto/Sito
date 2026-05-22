# DESIGN SYSTEM
### Visual Language & Component Tokens — The Dark Knight Experience

---

## Design Philosophy

The visual language of this experience is built around three core principles:

- **Darkness as canvas.** Black is not empty — it is the medium through which light gains meaning. Every element earns its luminosity.
- **Gold as authority.** The gold accent (`#FACC15`) is reserved for Batman's domain: HUD readouts, CTAs, progress. It signals mastery, control, and premium quality.
- **Green as threat.** Neon green (`#39FF14`) belongs to the Joker. It marks every riddle hotspot, every clue. It is alive, unstable, wrong in a deliberate way.

---

## Colour Palette

### Primary Tokens

| Token | Hex | Usage |
|---|---|---|
| `--color-black` | `#050505` | Base background |
| `--color-gold` | `#FACC15` | Batman HUD, CTAs, progress, timer |
| `--color-joker` | `#39FF14` | Riddle hotspots, Joker text, accent |
| `--color-red-urgent` | `#DC2626` | Timer warning, failure state |
| `--color-white` | `#FFFFFF` | Body text, headings |
| `--color-white-dim` | `rgba(255,255,255,0.6)` | Secondary text |
| `--color-white-ghost` | `rgba(255,255,255,0.1-0.2)` | HUD decorators, borders |

### Semantic Usage

```
Black (#050505)     → page bg, modal bg, overlay bg
Gold (#FACC15)      → navbar timer, mission CTA, HUD labels, progress bar, showreel text
Joker green         → clue hotspots, clue glow, Joker dialogue text, intro accent
Red (#DC2626)       → urgent timer (<10s), explosion overlay, failure state borders
White               → headings, body copy, button text on dark bg
White/60            → supporting text, captions, feature labels
```

### Tailwind Custom Extensions

```css
/* Configured in Tailwind v4 via CSS variables */
--color-gold: #FACC15;
--color-joker: #39FF14;
```

Usage in JSX: `text-gold`, `border-gold`, `bg-gold`, `text-joker`, `border-joker`

---

## Typography

### Font Stack

| Role | Font | Source |
|---|---|---|
| Primary UI | `Share Tech Mono` | Google Fonts |
| HUD Labels | `Share Tech Mono` | Monospace, tracking-widest |
| Headings | System `font-black` + Tailwind weight | Ultra-bold, uppercase |
| Body | Tailwind `font-sans` (system) | Secondary reading text |

### Scale (Tailwind Classes)

| Use | Class | Notes |
|---|---|---|
| Micro-labels | `text-[7px]` / `text-[9px]` | HUD codes, area labels |
| Cinematic labels | `text-[10px]` / `text-xs` | `tracking-[0.4em]` + `uppercase` |
| Body copy | `text-sm` | General descriptions |
| Display | `text-4xl` → `text-8xl` | Countdown, key headings |
| Showreel beat | `text-5xl md:text-7xl` | Product attribute headlines |

### Typography Rules

1. **All-caps for HUD.** System labels, timers, area names, and Batcomputer readouts are always uppercase monospace.
2. **Sentence case for narrative.** Joker dialogue and story text use natural capitalisation.
3. **Letter spacing signals domain.** `tracking-[0.8em]` = maximum urgency/authority. `tracking-widest` = standard HUD. Normal tracking = human text.
4. **Tabular numerals for timers.** `tabular-nums` prevents layout shift during countdown.

### Custom CSS Typography Classes

```css
.cinematic-title {
  font-family: 'Share Tech Mono', monospace;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.cinematic-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
}

.cinematic-accent {
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.2em;
}
```

---

## Spacing System

Tailwind's default spacing scale is used. Custom dense spacing for HUD elements:

| Context | Spacing |
|---|---|
| HUD corner decorators | `top-12 left-12` (3rem) |
| Navbar height | `py-3` to `py-4` |
| Modal padding | `p-8` to `p-12` |
| Section gutters | `px-6` to `px-12` |
| Clue card dimensions | `140×196px` (fixed) |

---

## Glow System

Glows are the primary visual hierarchy tool in dark environments. All glows use `box-shadow` or `drop-shadow` with low opacity and large spread.

### Glow Tokens

```css
/* Gold glow — CTAs, selected states */
box-shadow: 0 0 50px rgba(250, 204, 21, 0.5);

/* Joker glow — active hotspot */
box-shadow: 0 0 80px rgba(57, 255, 20, 0.9), inset 0 0 30px rgba(57, 255, 20, 0.5);

/* Joker glow — idle pulse */
box-shadow: 0 0 20px rgba(57, 255, 20, 0.2), inset 0 0 10px rgba(57, 255, 20, 0.1);

/* Red glow — urgent */
box-shadow: 0 0 30px rgba(220, 38, 38, 0.6);

/* Timer drop shadow */
drop-shadow: 0 0 30px rgba(220, 38, 38, 0.6);
```

---

## HUD Rules

HUD (Heads-Up Display) elements follow a strict visual grammar:

1. **Monospace only.** Never use a proportional font inside a HUD element.
2. **Corner brackets.** All HUD panels use `border-t border-l` / `border-b border-r` corner markers. Never full borders.
3. **Opacity layering.** HUD elements sit at 10–40% opacity when inactive; they glow to 100% on hover/active.
4. **Skew for dynamism.** The timer container uses `skew-x-[-15deg]` — a FUI (Fictional User Interface) technique for kinetic energy.
5. **Underscore notation.** System labels use underscores, not spaces: `STATO_MISSIONE`, `COLLASSO_SISTEMA`.

### HUD Corner Decorator (CSS)

```css
.hud-corner-tl { position: absolute; top: 0; left: 0; width: 12px; height: 12px;
  border-top: 2px solid; border-left: 2px solid; }
.hud-corner-tr { position: absolute; top: 0; right: 0; width: 12px; height: 12px;
  border-top: 2px solid; border-right: 2px solid; }
/* ... bl, br same pattern */

.hud-pulse {
  animation: hudPulse 2s ease-in-out infinite;
}
```

---

## Button System

### Primary CTA (Batman Gold)

```tsx
<button className="
  relative py-5 px-10 bg-black border-2 border-gold text-gold
  overflow-hidden transition-all duration-500
  hover:shadow-[0_0_50px_rgba(250,204,21,0.5)]
  hover:bg-gold/10
">
  <span className="cinematic-label">ACTION TEXT</span>
  {/* HUD corner decorators — animated pulse */}
</button>
```

### Secondary / Ghost

```tsx
<button className="
  border border-white/20 text-white/50 font-black uppercase tracking-widest
  hover:text-white hover:border-white transition-colors
">
```

### Danger / Skip

```tsx
<button className="text-white/40 hover:text-white transition-colors
  underline font-mono text-[10px] tracking-[0.2em] uppercase">
```

### Dev Only

```tsx
<button className="
  bg-black/40 border border-white/10 text-white/25
  hover:text-white/70 hover:border-white/30
  text-[9px] px-3 py-1.5 rounded-sm backdrop-blur-sm
">
```

---

## Animation System

### Glitch Effects

```css
.glitch-main {
  animation: glitchMain 3s infinite;
}
.glitch-slow {
  animation: glitchSlow 6s infinite;
}
.glitch-med {
  animation: glitchMed 4s infinite;
}
```

Glitch animations use `clip-path` and CSS `transform: translate` offsets to create a digital corruption effect. They are applied to narrative headings and HUD labels.

### Scan Line Overlay

```css
/* CRT scan line texture applied as a background-image gradient */
background: linear-gradient(
  rgba(18,16,16,0) 50%,
  rgba(0,0,0,0.25) 50%
), linear-gradient(
  90deg,
  rgba(255,0,0,0.06),
  rgba(0,255,0,0.02),
  rgba(0,0,255,0.06)
);
background-size: 100% 2px, 3px 100%;
```

### Camera Shake

```css
.camera-shake {
  animation: cameraShake 0.5s infinite;
}
/* Used on: urgent countdown (<10s timer) */
```

### Cursor Blink (Typing Text)

```css
.cursor-blink::after {
  content: '|';
  animation: cursorBlink 1s step-end infinite;
}
```

### Flicker Fast (Joker Text)

```css
.flicker-fast {
  animation: flickerFast 0.15s infinite;
}
/* Used on Joker dialogue lines in intro */
```

---

## Cinematic Rules

1. **Black as transition medium.** All phase transitions cut to/from black via `TransitionOverlay` (400ms fade) before any new content appears.
2. **Motion blur from spring physics.** `useSpring` with `stiffness: 150, damping: 40` on the showreel scroll progress creates natural deceleration.
3. **Vignette on all 3D scenes.** A `radial-gradient` overlay (`transparent → rgba(0,0,0,0.8)`) is applied over every panorama canvas.
4. **Text beats sync to scroll.** Showreel copy fades in/out at defined scroll progress keyframes using `useTransform`.
5. **Scale-on-hover.** All interactive elements use `whileHover={{ scale: 1.02 }}` via Motion for haptic feel.

---

## Accessibility Considerations

- All interactive buttons have `focus:outline-none` replaced by visible custom focus rings where applicable
- Colour is never the sole indicator — pulsing animations also indicate interactive hotspots
- Mobile users are explicitly warned and offered a simplified path
- Timer urgency escalates through both colour (red) and motion (camera shake, border pulse)
- The pause feature allows any player to halt and disengage without losing progress
- Text contrast against black backgrounds exceeds WCAG AA for all primary text elements
