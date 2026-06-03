# ARCHITECTURE.md — Batman Immersive Experience

## Panoramica Architetturale

L'applicazione è una **Single Page Application React 19** con Vite, strutturata come una **state machine lineare** governata da `App.tsx`. Non usa React Router: la navigazione tra fasi avviene tramite cambio di stato locale.

---

## State Machine delle Fasi

`App.tsx` gestisce il tipo `Phase`:

```typescript
type Phase =
  | "intro"        // IntroScreen — briefing Joker
  | "batcomputer"  // SharedPanoramaCanvas (scena batcomputer) + BatcomputerBootOverlay
  | "transition1"  // CinematicVideoPlayer — da batcomputer ad armeria
  | "armeria"      // SharedPanoramaCanvas (scena armeria)
  | "transition2"  // CinematicVideoPlayer — da armeria a batmobile
  | "batmobile"    // SharedPanoramaCanvas (scena batmobile)
  | "breather"     // Schermata nera "Missione Completata"
  | "reveal"       // FinalReveal — classifica e tempo
  | "showreel"     // BatmanCamera — scroll 800 frame
  | "checkout"     // Checkout — form acquisto
  | "thankyou"     // ThankYouPage — conferma ordine
```

```
intro
  ↓ onBegin()
batcomputer (BatcomputerBootOverlay → SharedPanoramaCanvas)
  ↓ 2 clue trovati → CinematicVideoPlayer
transition1
  ↓ video ended
armeria (SharedPanoramaCanvas)
  ↓ 2 clue trovati → CinematicVideoPlayer
transition2
  ↓ video ended
batmobile (SharedPanoramaCanvas)
  ↓ 1 clue trovato
breather (4 secondi automatici)
  ↓ auto
reveal (FinalReveal)
  ↓ onComplete()
showreel (BatmanCamera)
  ↓ onPreorder()
checkout
  ↓ onSuccess(quantity)
thankyou
  ↓ onReturnHome()
intro (reset completo)
```

---

## SharedPanoramaCanvas — Architettura Multi-Scena

Il componente `SharedPanoramaCanvas` è montato **una sola volta** per tutte le fasi panoramiche (batcomputer, armeria, batmobile). Non viene smontato durante le transizioni video: rimane vivo in background con `isPanoramaPhase` e cambia solo la texture caricata (`scene` prop).

```typescript
const panoramaPhases: Phase[] = ["batcomputer", "transition1", "armeria", "transition2", "batmobile"];
const isPanoramaPhase = panoramaPhases.includes(phase);
```

**Mapping scena → texture:**
| Scena | Texture |
|---|---|
| `batcomputer` | `BatCaverna360_BatComputerArea.jpg` |
| `armeria` | `BatCaverna360_ArmeriaArea.jpg` |
| `batmobile` | `BatCaverna360_BatMobileArea.jpg` |

---

## Lazy Loading

I componenti pesanti sono caricati in modo lazy:

```typescript
const CinematicVideoPlayer = lazy(() => import("./components/cinematic/CinematicVideoPlayer"));
const SharedPanoramaCanvas = lazy(() => import("./components/cinematic/SharedPanoramaCanvas"));
const BatmanCamera         = lazy(() => import("./components/cinematic/BatmanCamera"));
const BatcomputerBootOverlay = lazy(() => import("./components/ui/BatcomputerBootOverlay"));
const Checkout             = lazy(() => import("./components/showreel/Checkout"));
const FinalReveal          = lazy(() => import("./components/showreel/FinalReveal"));
const ThankYouPage         = lazy(() => import("./components/showreel/ThankYouPage"));
```

---

## State Globale (App.tsx)

| Stato | Tipo | Descrizione |
|---|---|---|
| `phase` | `Phase` | Fase corrente dell'experience |
| `missionStatus` | `"idle" \| "active" \| "failed" \| "succeeded"` | Stato missione |
| `completedCount` | `number` | Numero di indizi trovati (0–5) |
| `isPaused` | `boolean` | Pausa globale |
| `isMuted` | `boolean` | Stato audio globale |
| `panoramaScene` | `PanoramaScene` | Scena attiva nel canvas 360° |
| `showBootOverlay` | `boolean` | Mostra tutorial BatcomputerBoot |
| `showBonusFeedback` | `boolean` | Feedback +60s bonus tempo |
| `speedrunUnlocked` | `boolean` | Easter egg < 90 secondi |
| `finalTimeTaken` | `number` | Secondi impiegati per completare |
| `purchasedQuantity` | `number` | Quantità acquistata (1–2) |

---

## Hooks Custom

### `useMissionTimer`
Timer countdown con precisione `performance.now()`. Implementa A/B test:
- **Gruppo A**: 120 secondi
- **Gruppo B**: 240 secondi

Supporta bonus tempo (+60s), pausa, e video transition (timer fermo).

### `useJokerHint`
Sistema hint progressivo. Dopo 60s di inattività su una Joker Card:
1. Fase 1 (60s): glitch lieve + linee orizzontali verdi
2. Fase 2 (+20s): spotlight verde ambientale
3. Fase 3 (+20s): aberrazione cromatica + scanlines

### `useAudioSystem`
Thin wrapper che sincronizza lo stato `isMuted` con il singleton `BatcavernAudio`. Non crea audio, non lo distrugge.

### `useMobileDetection`
Controlla `window.innerWidth < 768px` con listener resize. Espone `forceMobile` per bypassare il warning.

---

## Dipendenze Chiave

| Package | Scopo |
|---|---|
| `motion` (Framer) | AnimatePresence, motion.div, useScroll, useSpring |
| `three` + `@react-three/fiber` | Rendering panorama 360° equirettangolare |
| `lucide-react` | Icone UI |
| `tailwindcss v4` | Utility CSS + design tokens |
| `@tailwindcss/vite` | Integrazione Vite per Tailwind 4 |

---

## Dev Tools

Un bottone "Salta a:" è sempre visibile in basso a destra (z-index 300000) durante lo sviluppo. Permette di navigare direttamente alla fase successiva senza completare la missione. Anche la shortcut `CMD+1` salta direttamente allo showreel.

---

## Performance Notes

- Il canvas showreel (BatmanCamera) carica 800 PNG in due fasi: prima 120 frame ad alta priorità, poi i restanti 680 a bassa priorità
- Le texture 360° in `.jpg` sono ottimizzate (605–1109 KB). I `.png` equivalenti esistono ma non vengono usati in produzione (50MB ciascuno)
- Il singleton audio evita re-istanziazioni e garantisce loop gapless cross-fase
