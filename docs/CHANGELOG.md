# CHANGELOG

Tutte le funzionalità e i refactor implementati nel progetto.

## [1.0.0] — Batman Immersive Experience Completa

### 🚀 Funzionalità Principali Implementate
- **State Machine Navigazionale**: Implementata architettura lineare a fasi (intro, batcomputer, armeria, ecc.) senza router per massimizzare il controllo narrativo in `App.tsx`.
- **Esplorazione 360° (WebGL)**: Creato `SharedPanoramaCanvas` in Three.js/Fiber che supporta il caricamento dinamico di texture equirettangolari.
- **Singleton Audio Continuo**: Implementato `BatcavernAudio` (modulo JS puro) per garantire il playback gapless cross-component e cross-fase, con gestione delle limitazioni browser Autoplay.
- **Audio 3D del Joker (Web Audio API)**: Implementato `JokerAudioManager` che spazializza e rallenta la voce del Joker assegnando un delay/reverb procedurale simulando l'acustica cavernosa.
- **Sistema di Hint Narrativo**: Implementato `useJokerHint` con 3 fasi progressive di distorsione UI (Glitch, Flicker, Chromatic Aberration).
- **Timer di Missione**: Implementato `useMissionTimer` con A/B testing integrato (Gruppo A: 120s, Gruppo B: 240s) e bonus di tempo. Include l'effetto UI drammatico negli ultimi 10 secondi e schermata failure personalizzata (`ExplosionOverlay`).
- **Joker Card (UI Interattiva 3D)**: Componenti card in CSS/FramerMotion con animazioni flip 3D e quiz logico per disinnescare l'indizio. Audio feedback su errori e risposte corrette.
- **Transizioni Cinematiche**: `CinematicVideoPlayer` che nasconde i caricamenti tra le stanze mantenendo l'illusione immersiva.
- **Showreel 800 Frame**: Componente `BatmanCamera` sviluppato per sincronizzare in performance (Canvas 2D) l'animazione della statua allo scroll dell'utente (`useScroll` da Framer Motion), con preloading a doppia priorità per fluidità immediata.
- **Checkout Mascherato**: Implementato form custom styled-terminal per il preordine con discount code engine e UX militarizzata.
- **Easter Egg e Dev Tools**: Modalità speedrun (shortcut key `CMD+1` / `CTRL+1`) per test rapidi saltando lo svolgimento della missione e bypass-panel mobile.
- **Mobile Fallback**: Modale persistente per avvertire che l'esperienza è ottimizzata per desktop (impossibile sfruttare appieno il canvas webgl 360 con device rotanti touch in questa build), ma che permette comunque all'utente di forzare lo sblocco per l'acquisto.

### 🧹 Refactor e Pulizia (Phase 4)
- Rimossi tutti i componenti non utilizzati e duplicati dalle vecchie iterazioni di test.
- Pulizia di import `unused` e librerie legacy nel `package.json`.
- Consolidamento completa della struttura `docs/` che prima presentava dozzine di frammenti documentali decontestualizzati. Adottata documentazione centralizzata in:
  - `README.md`
  - `PROJECT_OVERVIEW.md`
  - `ARCHITECTURE.md`
  - `GAMEPLAY_SYSTEMS.md`
  - `AUDIO_SYSTEM.md`
  - `UI_UX_GUIDELINES.md`
  - `ASSET_STRUCTURE.md`
