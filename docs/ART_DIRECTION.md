# ART DIRECTION
### Visual References & Aesthetic Foundations — The Dark Knight Experience

---

## Creative Vision Statement

The visual identity of this experience is built on a single premise: **darkness is a design material, not an absence of design**. Every frame should feel like a still from a Nolan film — composed, purposeful, and heavy with atmosphere.

We are not designing a website. We are designing a world that the user briefly inhabits.

---

## Moodboard — Core References

### Cinematic References

| Work | What We Borrow |
|---|---|
| *The Dark Knight* (Nolan, 2008) | Restraint, practical lighting, IMAX scale |
| *Batman: Arkham Knight* (Rocksteady, 2015) | FUI language, rain-soaked noir, gold-on-black palette |
| *Blade Runner 2049* (Villeneuve, 2017) | Slowness as drama, lonely grandeur, orange/teal split |
| *MGSV: The Phantom Pain* (Kojima, 2015) | Mission HUDs, monospace readouts, environmental tension |
| *Dead Space* (EA Motive, 2023) | UI embedded in world, ambient threat |
| *John Wick: Chapter 3* | Neon-on-black, slick choreography, premium darkness |

### FUI (Fictional User Interface) References

FUI is the practice of designing interfaces that exist within the fiction of a film, game, or experience — interfaces that prioritise *feeling* over *function*.

Key FUI inspirations:

- **Batcomputer displays** from all Batman media — monospace, green/amber phosphor, scan lines
- **Iron Man / JARVIS displays** — holographic overlays, parallax depth, data layers
- **Interstellar TARS interface** — clinical monospace, zero ornamentation
- **Halo UNSC overlays** — corner brackets, status bars, muted military palette

### Product Photography References

For the showreel and reveal:

- Apple product keynotes — dark background, single light source, surface reflections
- Bang & Olufsen product pages — obsessive material honesty, extreme close-ups
- Rolex "Deep Sea" campaigns — black-on-black contrast, tactile surfaces
- Sideshow Collectibles product shots — statue photography, dramatic uplighting

---

## Colour Direction

### Primary Chromatic Signatures

```
BLACK #050505    → The void. The cave. The night.
GOLD #FACC15     → Batman's authority. Wayne legacy. Premium.
GREEN #39FF14    → Joker's domain. Unstable. Alive. Wrong.
RED #DC2626      → Emergency. Failure. Blood.
WHITE #FFFFFF    → Truth, clarity — used sparingly
```

### Anti-palette (What We Avoid)

- No flat blues (signals corporate, not cinematic)
- No purple (despite Joker association — too costume-y at web scale)
- No gradients between gold and green (the two must never mix — they represent opposing forces)
- No white backgrounds (even in modals — the world is always dark)

### Atmosphere Tinting

The Batcomputer area reads as slightly cooler (blue-black) through the video texture. The Armeria reads warmer (amber-black). The Batmobile reads as near-monochrome industrial. These temperature shifts happen organically through the photographic content, not through CSS filters.

---

## Lighting Direction

### Environmental Lighting Philosophy

Every 360° environment uses **practical, motivated light sources** — meaning the light in the image appears to come from visible sources within the scene (monitors, equipment indicators, overhead rigs). There are no ambient fills or flat global illumination.

### Lighting Zones

| Area | Key Light | Ambient | Temperature |
|---|---|---|---|
| Batcomputer | Monitor glow (blue-green) | Near-zero | Cool, 4200K equiv |
| Armeria | Overhead industrial (amber) | Very low | Warm, 3000K equiv |
| Batmobile | Underfloor accent (neutral) | Near-zero | Neutral, 5500K equiv |

### Showreel Lighting (Product Photography)

The 800-frame PNG sequence is shot/rendered with a **single key light** from the upper-left, a soft fill from the right, and a dark environment behind. This creates strong form definition, deep shadows in the recesses of the sculpture, and highlights that reveal material quality.

---

## Typography Direction

### Font Philosophy

We use exactly **one typeface family**: `Share Tech Mono`. This is a practical decision with aesthetic intent:
- Monospace reads as technological, systemic, machine-generated
- It references the visual language of CRTs, terminals, and early digital displays
- It has strong numerals — critical for the countdown timer
- Zero decorative variation — every character serves function

**System fonts** are used only for body text that is subordinate to the design (form fields, legal text, supporting descriptions).

### Type Hierarchy in Practice

```
LEVEL 1 — Cinematic Title (uppercase, weight 900, -0.02em tracking)
  → Used: product beats in showreel, pause screen headline, mission failed

LEVEL 2 — HUD Label (uppercase, 10px, 0.4em tracking, monospace)
  → Used: all Batcomputer readouts, navbar labels, area identifiers

LEVEL 3 — Joker Dialogue (mixed case, 0.2em tracking, italic-capable)
  → Used: intro briefing texts, Joker voice lines

LEVEL 4 — System Output (uppercase, 0.8em+ tracking, 8-10px)
  → Used: underscore_notation labels, status codes
```

---

## Noir Aesthetic

The visual direction is deeply noir-influenced:

- **High contrast.** Details emerge from darkness rather than being evenly lit.
- **Isolation.** Elements appear alone in space — no busy backgrounds.
- **Texture over smoothness.** Scan lines, grain, glitch artefacts. The world is not clean.
- **Dread through stillness.** The Joker is never seen — only implied. The cave breathes.

### Practical Noir Techniques Applied

1. **CRT scan lines** on the IntroScreen — css gradient overlay creating 2px horizontal bands
2. **Radial vignette** on all 360° environments — `radial-gradient(transparent 30%, black 100%)`
3. **Glitch animations** on narrative text — three intensity levels: slow, medium, main
4. **Low-opacity decorative elements** — HUD corners at 10-20% opacity feel discovered, not placed

---

## Arkham Series Inspirations (Specific)

The *Batman: Arkham* series by Rocksteady Studios is the most direct reference for the environmental language of this project:

### From Arkham Asylum / City / Knight:
- Green Joker poison = our Joker green hotspot colour
- Batman's gold utility belt = our gold accent colour
- The Batcomputer interface = our HUD typographic system
- The Mission Select screen = our IntroScreen tone
- The "PROTOCOL 10" urgency aesthetic = our timer escalation

### Key Arkham UI Details We Reference:
- Corner-bracket UI frames
- All-caps monospace system text
- Subtle green/amber scan lines on displays
- "Area status" readouts at low opacity
- Batman logo as interactive element marker
