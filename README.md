# 🦇 Batman 87th Anniversary — Immersive Narrative Experience

> **Esperienza cinematografica interattiva** per la statua in edizione limitata Batman 87th Anniversary.  
> Progetto accademico IUAD — Corso UI/UX Design.

> 🔄 **In trasformazione:** il progetto sta migrando dal design system AI-generated al **Design System ufficiale Figma** dell'autore. Vedi [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md).

---

## Concept

Una narrazione immersiva a tutto schermo nella Batcaverna. L'utente non sfoglia una scheda prodotto — **vive una missione**. Il Joker ha piazzato una bomba nella Batcaverna: trovare i 5 indizi nei 3 ambienti 360° prima che il tempo scada. La vittoria sblocca l'accesso alla statua e al checkout.

---

## User Journey

```
Intro Joker (briefing cinematografico)
  → Batcomputer Boot (tutorial sincronizzazione movimento)
  → Batcomputer Area 360° (2 Joker Cards)
  → Video Transizione cinematografica
  → Armeria Area 360° (2 Joker Cards)
  → Video Transizione cinematografica
  → BatMobile Area 360° (1 Joker Card)
  → Breather Screen (missione completata)
  → Final Reveal (classifica + tempo)
  → Showreel BatmanCamera (800 frame scroll)
  → Checkout (form acquisto)
  → Thank You Page
```

---

## Stack Tecnologico

| Tecnologia | Versione | Utilizzo |
|---|---|---|
| React | 19 | UI Framework |
| Vite | 6.4 | Build tool |
| TypeScript | 5.8 | Type safety |
| Motion (Framer) | 12 | Animazioni |
| Three.js | 0.184 | Rendering 360° |
| React Three Fiber | 9.6 | Three.js React bridge |
| TailwindCSS | 4.1 | Styling (corrente, in migrazione verso DS Figma) |
| Lucide React | 0.546 | Icone |
| Web Audio API | nativa | Audio spaziale Joker |
| CSS Modules | — | Nuovo DS Figma (Atomic Design) |

---

## Avvio Locale

```bash
npm install
npm run dev     # porta 3000
npm run build   # produzione
npm run lint    # TypeScript check
```

---

## Struttura Progetto

```
src/
├── App.tsx                    # Orchestratore principale, state machine fasi
├── main.tsx                   # Entry point React 19
├── index.css                  # Design system globale + animazioni (AI-generated, in migrazione)
├── design-system/             # ✨ NUOVO — Design System Figma (Alessandro Bottone)
│   ├── Atoms.tsx              # Atoms: bottoni, icone, timer, testi, logo, cursore
│   ├── Atoms.module.css       # CSS Module per gli Atoms
│   ├── Molecule.tsx           # Molecules: Navbar, Clues, Tutorial, Checkout
│   ├── Molecule.module.css    # CSS Module per le Molecules
│   ├── Organisms.tsx          # Organisms: Showreel, Win, Tutorial, ThankYou, Checkout
│   ├── Organisms.module.css   # CSS Module per gli Organisms
│   ├── Templates.tsx          # Templates: layout completi per ogni schermata
│   ├── Templates.modules.css  # CSS Module per i Templates
│   └── global.css             # Token globali e variabili CSS del Design System
├── lib/
│   └── audioManager.ts        # Singleton BatcavernAudio (persistente tra fasi)
├── hooks/
│   ├── useAudioSystem.ts      # Sincronizzazione mute con singleton
│   ├── useMissionTimer.ts     # Timer A/B test (120s gruppo A, 240s gruppo B)
│   ├── useJokerHint.ts        # Sistema hint progressivo a 3 fasi
│   └── useMobileDetection.ts  # Rilevamento viewport < 768px
├── components/
│   ├── cinematic/
│   │   ├── IntroScreen.tsx    # Briefing Joker + avvio audio
│   │   ├── SharedPanoramaCanvas.tsx # Three.js 360° multi-scena
│   │   ├── BatmanCamera.tsx   # Showreel scroll 800 frame
│   │   ├── CinematicVideoPlayer.tsx # Transizioni video
│   │   └── MouseLookControls.tsx    # Controllo panorama da mouse
│   ├── joker/
│   │   ├── JokerCard.tsx      # Card indizio (→ migrazione a Clues Molecule DS)
│   │   ├── JokerHintSystem.tsx # Overlay visivo hint (3 fasi + audio)
│   │   └── JokerAudioManager.tsx # Risata 3D spaziale (Web Audio API)
│   ├── hud/
│   │   ├── MissionTimer.tsx   # Timer (→ migrazione a Timer Atom DS)
│   │   └── ProgressTracker.tsx # Barre indizi (→ migrazione a Progression Atom DS)
│   ├── layout/
│   │   └── Navbar.tsx         # Nav fissa (→ migrazione a Navbar Molecule DS)
│   ├── showreel/
│   │   ├── BatmanCamera.tsx   # Showreel scroll-driven 800 frame
│   │   ├── FinalReveal.tsx    # Risultati missione + leaderboard
│   │   ├── Checkout.tsx       # Form acquisto (→ migrazione a Checkout Template DS)
│   │   ├── Features.tsx       # Features statua (non usato in routing attivo)
│   │   ├── Pricing.tsx        # Pricing (non usato in routing attivo)
│   │   └── ThankYouPage.tsx   # Conferma (→ migrazione a ThankYou Template DS)
│   ├── transitions/
│   │   ├── TransitionOverlay.tsx  # Fade nero tra fasi
│   │   ├── ExplosionOverlay.tsx   # Game over (missione fallita)
│   │   └── AssetPreloader.tsx     # Preload assets iniziali
│   └── ui/
│       ├── BatcomputerBootOverlay.tsx # Tutorial + sync movimento
│       ├── BatmanButton.tsx    # Bottone (→ migrazione a Button Atom DS)
│       ├── BatmanText.tsx      # Testo animato con delay
│       └── TechBackground.tsx  # Background cyberpunk animato
public/assets/
├── audio/
│   ├── SiglaBatman.wav        # Musica principale (loop persistente)
│   └── RisataJoker.wav        # Risata Joker (spazializzata 3D)
├── videos/
│   ├── BatCaverna360_BatComputerArea.mp4           # (non usato nel routing)
│   ├── BatCaverna_PassaggioBatComputerAArmeria.mp4 # Transizione 1→2
│   └── BatCaverna_PassaggioArmeriaABatMobile.mp4   # Transizione 2→3
├── textures/
│   ├── BatCaverna360_BatComputerArea.jpg  # Panorama Batcomputer
│   ├── BatCaverna360_ArmeriaArea.jpg      # Panorama Armeria
│   └── BatCaverna360_BatMobileArea.jpg    # Panorama BatMobile
├── images/
│   ├── JollyJokerCard.jpg     # Fronte carta Joker
│   ├── JollyJokerCard_Back.jpg # Retro carta Joker
│   ├── Navbar.png             # Logo navbar
│   └── batman-cursor.png      # Cursore custom
    └── showreel/
        └── 0001–0800.png          # 800 frame 4K (3840×2160), 25 FPS, sfondo trasparente (alpha PNG)
docs/
├── README.md (questo file)
├── DESIGN_SYSTEM.md           # ✨ NUOVO — Design System Figma + stato migrazione
├── ARCHITECTURE.md            # Struttura tecnica e routing
├── GAMEPLAY_SYSTEMS.md        # Timer, hint, leaderboard, sistemi di gioco
├── AUDIO_SYSTEM.md            # Audio singleton e effetti Joker
├── UI_UX_GUIDELINES.md        # Design language e componenti UI (AI-gen, in aggiornamento)
├── ASSET_STRUCTURE.md         # Asset completi e formati
├── CHANGELOG.md               # Storia delle funzionalità
├── Testi_Sito_Batman_REVISED_v2.docx  # Testi definitivi (sorgente)
└── Testi_Sito_Batman_REVISED_v2.txt   # Testi definitivi (testo puro)
```

---

## 🔄 Migrazione Design System

Il progetto sta passando da un design system **AI-generated** (Antigravity) al **Design System ufficiale** progettato dall'autore in Figma, seguendo la metodologia **Atomic Design**.

I file del DS Figma si trovano in `src/design-system/` e coprono l'intera interfaccia dell'experience: atoms (bottoni, timer, icone), molecules (navbar, clue cards), organisms (win screen, tutorial, checkout) e templates (layout completi per ogni schermata).

Per la documentazione completa della migrazione, vedere [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md).

---

## Documentazione Tecnica

Tutta la documentazione approfondita si trova nella cartella [`/docs`](./docs/).

| File | Descrizione |
|---|---|
| [`DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) | ✨ Design System Figma — Atomic Design |
| [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Architettura tecnica e state machine |
| [`GAMEPLAY_SYSTEMS.md`](./docs/GAMEPLAY_SYSTEMS.md) | Timer, hint, indizi, leaderboard |
| [`AUDIO_SYSTEM.md`](./docs/AUDIO_SYSTEM.md) | Audio singleton e effetti spaziali |
| [`UI_UX_GUIDELINES.md`](./docs/UI_UX_GUIDELINES.md) | Design language (in aggiornamento) |
| [`ASSET_STRUCTURE.md`](./docs/ASSET_STRUCTURE.md) | Asset completi e formati |
| [`CHANGELOG.md`](./docs/CHANGELOG.md) | Storia delle funzionalità |

---

## Licenza

Uso accademico / dimostrativo — IUAD, Corso UI/UX Design.  
Non destinato alla vendita. DC Comics / Batman è proprietà di Warner Bros. / DC Entertainment.
