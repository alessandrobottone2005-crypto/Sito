# THE DARK KNIGHT EXPERIENCE
### An Immersive, Cinematic Product Reveal — Powered by React, Three.js & Web Audio API

---

> *"Gotham needs a Batman. And this time, Batman needs you."*

---

## Overview

**The Dark Knight Experience** is a premium, cinematic web experience built to sell a limited-edition Batman collectible statue. Rather than a conventional product page, it immerses the visitor inside the **Batcave** — placing them in the role of Batman, racing against the Joker's bomb countdown, solving environmental riddles across three 360° panoramic scenes before the product is finally revealed in a stunning, scroll-driven cinematic showreel.

This is not a landing page. It is a **narrative-first acquisition funnel** disguised as a game.

---

## Concept & Experience

```
PHASE 1 — INTRO        The Joker hacks the Batcomputer. A briefing sequence plays.
PHASE 2 — BATCOMPUTER  360° panorama. 2 riddles hidden in the environment.
PHASE 3 — TRANSITION   Cinematic video walkthrough to the Armoury.
PHASE 4 — ARMERIA      360° panorama. 1 riddle. Higher tension.
PHASE 5 — TRANSITION   Cinematic video walkthrough to the Batmobile bay.
PHASE 6 — BATMOBILE    360° panorama. 2 final riddles. Max urgency.
PHASE 7 — BREATHER     Mission success. Bomb defused. System reset.
PHASE 8 — REVEAL       Final cinematic reveal of the Batman statue.
PHASE 9 — SHOWREEL     800-frame scroll-driven animation. Product presentation.
PHASE 10 — CHECKOUT    Conversion screen. Order form. Delivery details.
```

---

## Storytelling

The Joker has left a package inside the Batcave. The package contains a bomb. The only way to defuse it: solve **5 riddles** hidden across the cave before the countdown hits zero.

Every element of the UX reinforces the narrative: the HUD typography, the ambient audio, the Joker's disembodied laugh drifting through the cave, the red countdown bleeding urgency into every frame. When the bomb is defused, the tension dissolves — and the product reveal feels like a **reward earned**, not a sales pitch endured.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| 3D Rendering | Three.js + @react-three/fiber + @react-three/drei |
| Animation | Motion (Framer Motion v12) |
| Styling | TailwindCSS v4 + Vanilla CSS |
| Audio | Web Audio API (AudioContext, GainNode, StereoPannerNode) |
| Icons | Lucide React |
| AI Integration | @google/genai (optional) |
| Dev Tooling | TypeScript 5.8, Puppeteer, tsx |

---

## Installation

**Prerequisites:** Node.js v18+, npm v9+

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Configure environment
cp .env.example .env
# Add your GEMINI_API_KEY if using AI features

# 3. Start development server
npm run dev
# → http://localhost:3000

# 4. Production build
npm run build
npm run preview
```

---

## Project Structure

```
ProvaSito/
├── public/
│   └── assets/
│       ├── audio/              # SiglaBatman.wav, RisataJoker.wav
│       ├── images/             # Static image assets
│       ├── showreel/           # 0001.png → 0800.png (800-frame sequence)
│       ├── textures/           # 360° equirectangular JPG/PNG textures
│       └── videos/             # Cinematic transition MP4s + BatComputer loop
│
├── src/
│   ├── App.tsx                 # Root orchestrator. Phase state machine. Timer logic.
│   ├── main.tsx                # React 19 entry point
│   ├── index.css               # Design system. Tokens. Animations. Glitch FX.
│   │
│   ├── components/
│   │   ├── audio/
│   │   │   └── JokerAudioManager.tsx   # Spatial laugh system (Web Audio API)
│   │   ├── effects/
│   │   │   ├── TransitionOverlay.tsx   # Phase transition flash
│   │   │   └── ExplosionOverlay.tsx    # Failure state overlay
│   │   ├── layout/
│   │   │   └── Navbar.tsx              # Global HUD nav bar
│   │   ├── scenes/
│   │   │   ├── IntroScreen.tsx         # Joker briefing cinematic
│   │   │   ├── SharedPanoramaCanvas.tsx # Three.js 360° renderer + hotspots
│   │   │   ├── BatcavePanorama.tsx     # Legacy (deprecated)
│   │   │   ├── ArmeriaPanorama.tsx     # Legacy (deprecated)
│   │   │   ├── BatmobilePanorama.tsx   # Legacy (deprecated)
│   │   │   ├── CinematicVideoPlayer.tsx # Transition video player
│   │   │   └── MouseLookControls.tsx   # Free-look mouse navigation
│   │   └── ui/
│   │       ├── BatmanCamera.tsx        # 800-frame showreel + scroll engine
│   │       ├── BatmanButton.tsx        # Reusable styled CTA button
│   │       ├── BatmanText.tsx          # Cinematic text renderer
│   │       ├── Checkout.tsx            # Conversion / order form
│   │       ├── Features.tsx            # Product feature highlights
│   │       ├── FinalReveal.tsx         # Post-mission statue reveal scene
│   │       ├── JokerCard.tsx           # Riddle modal (flip card UX)
│   │       ├── MissionTimer.tsx        # HUD countdown timer
│   │       ├── Pricing.tsx             # Pricing section
│   │       └── ProgressTracker.tsx     # Clue progress indicator
│   │
│   ├── hooks/                  # (Reserved for custom hooks)
│   ├── types/                  # (Reserved for TypeScript interfaces)
│   └── utils/                  # (Reserved for shared utilities)
│
├── docs/                       # Project documentation
│   ├── ANIMATION_GUIDELINES.md
│   ├── ARCHITECTURE.md
│   ├── ART_DIRECTION.md
│   ├── AUDIO_SYSTEM.md
│   ├── COMPONENTS.md
│   ├── DESIGN_SYSTEM.md
│   ├── DOCUMENTATION.md
│   ├── GAME_LOGIC.md
│   ├── PERFORMANCE.md
│   ├── SHOWREEL_SYSTEM.md
│   ├── STORYTELLING.md
│   └── UX_FLOW.md
│
├── scripts/                    # Utility & developer scripts
│   ├── check_pixels.js
│   └── debug.mjs
```

---

## Design Philosophy

**Narrative over UI.** Every interface element exists to serve the story. The timer creates tension. The HUD typography establishes world — Gotham's surveillance infrastructure made visible. The darkness is intentional: contrast is saved for gold and neon-green, the two chromatic signatures of the Batman universe.

**Earned revelation.** The product reveal is withheld behind a skill gate. Visitors who engage with the riddles arrive at the showreel with a sense of accomplishment — priming them for conversion.

**Zero filler.** Every second of the experience has purpose. Transitions are cinematic, not loading screens. The breather phase after mission success is a deliberate decompression beat, not dead time.

---

## UX Goals

- Average session duration: **> 4 minutes** (gamification phase alone)
- Mission completion rate target: **> 60%** (all 5 riddles solved)
- Showreel scroll completion target: **> 80%** (full 800-frame sequence)
- Checkout click-through rate target: **> 12%**
- Mobile fallback path maintains conversion via direct showreel access

---

## Performance Goals

| Metric | Target |
|---|---|
| Showreel first-frame display | < 4 seconds on fiber |
| 360° scene switch latency | < 1 second |
| Showreel render FPS | 60fps (desktop), 30fps (mobile) |
| Total JS bundle | < 450 KB gzipped |
| LCP (Landing/Intro) | < 2.5 seconds |

---

## A/B Testing

Timer duration is A/B split on session mount:

| Group | Timer | Hypothesis |
|---|---|---|
| A | 120 seconds | Higher urgency → faster decisions |
| B | 240 seconds | More exploration → higher engagement |

Assignment is random (50/50) and logged to console. Future iterations should pipe this to an analytics endpoint.

**Speedrun Easter Egg:** Players who complete all 5 riddles in under 90 seconds unlock a hidden discount at checkout.

---

## Cinematic Direction

Inspired by:
- **Batman: Arkham Knight** — FUI language, dark atmosphere, green/gold palette
- **Christopher Nolan's Dark Knight trilogy** — restraint, weight, practical darkness
- **Blade Runner 2049** — environmental storytelling, slowness as drama
- **AAA game HUD systems** — Halo, MGSV, Deus Ex — monospace readouts, scan lines

The camera never lies still. The world breathes: scan lines flicker, glitch animations interrupt text, the Joker's laugh drifts through space as a ghost of sound.

---

## Roadmap

- [ ] Analytics integration (timer A/B test data collection)
- [ ] Mobile 360° touch navigation (gyroscope-based look)
- [ ] Additional Joker audio lines (randomized taunts)
- [ ] Leaderboard for speedrun completions
- [ ] Multilingual support (EN/IT toggle)
- [ ] WebGL post-processing (bloom, film grain via Three.js EffectComposer)
- [ ] Checkout backend integration (Stripe / WooCommerce)

---

## Credits

| Role | Name |
|---|---|
| Creative Direction | Alessandro Bottone |
| 3D Environment & Rendering | Alessandro Bottone |
| Frontend Development | Alessandro Bottone |
| Motion Design | Alessandro Bottone |
| Narrative Writing | Alessandro Bottone |
| AI Development Partner | Antigravity (Google DeepMind) |

---

*Batman and all related marks are trademarks of DC Comics / Warner Bros. This project is an independent creative portfolio work.*
