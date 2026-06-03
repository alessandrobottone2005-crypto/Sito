# 🦇 Batman 87th Anniversary — Immersive Narrative Experience

> **Esperienza cinematografica interattiva** per la statua in edizione limitata Batman 87th Anniversary.  
> Progetto accademico IUAD — Corso UI/UX Design.

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
| TailwindCSS | 4.1 | Styling |
| Lucide React | 0.546 | Icone |
| Web Audio API | nativa | Audio spaziale Joker |

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
├── index.css                  # Design system globale + animazioni
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
│   │   ├── JokerCard.tsx      # Card indizio con riddles a scelta multipla
│   │   ├── JokerHintSystem.tsx # Overlay visivo hint (3 fasi + audio)
│   │   └── JokerAudioManager.tsx # Risata 3D spaziale (Web Audio API)
│   ├── hud/
│   │   ├── MissionTimer.tsx   # Timer con countdown drammatico ultimi 10s
│   │   └── ProgressTracker.tsx # Barre indizi completati
│   ├── layout/
│   │   └── Navbar.tsx         # Nav fissa con HUD integrato
│   ├── showreel/
│   │   ├── BatmanCamera.tsx   # Showreel scroll-driven 800 frame
│   │   ├── FinalReveal.tsx    # Risultati missione + leaderboard
│   │   ├── Checkout.tsx       # Form acquisto + speedrun discount
│   │   ├── Features.tsx       # Features statua (non usato in routing attivo)
│   │   ├── Pricing.tsx        # Pricing (non usato in routing attivo)
│   │   └── ThankYouPage.tsx   # Conferma preordine
│   ├── transitions/
│   │   ├── TransitionOverlay.tsx  # Fade nero tra fasi
│   │   ├── ExplosionOverlay.tsx   # Game over (missione fallita)
│   │   └── AssetPreloader.tsx     # Preload assets iniziali
│   └── ui/
│       ├── BatcomputerBootOverlay.tsx # Tutorial + sync movimento
│       ├── BatmanButton.tsx    # Bottone riutilizzabile con glitch
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
    └── 0001–0800.png          # Sequenza frame showreel statua
docs/
├── README.md (questo file)
├── ARCHITECTURE.md            # Struttura tecnica e routing
├── GAMEPLAY_SYSTEMS.md        # Timer, hint, leaderboard, sistemi di gioco
├── AUDIO_SYSTEM.md            # Audio singleton e effetti Joker
├── UI_UX_GUIDELINES.md        # Design language e componenti UI
├── ASSET_STRUCTURE.md         # Asset completi e formati
└── CHANGELOG.md               # Storia delle funzionalità
```

---

## Documentazione Tecnica

Tutta la documentazione approfondita si trova nella cartella [`/docs`](./docs/).

---

## Licenza

Uso accademico / dimostrativo — IUAD, Corso UI/UX Design.  
Non destinato alla vendita. DC Comics / Batman è proprietà di Warner Bros. / DC Entertainment.
