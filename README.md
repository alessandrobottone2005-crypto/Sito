# 🦇 The Dark Knight: Immersive Experience

> Un'esperienza web interattiva, cinematica e narrativa che unisce storytelling ambientale, enigmi e architettura frontend high-end per svelare l'esclusiva statua da collezione di Batman.

## 📌 Project Overview
The Dark Knight: Immersive Experience è un progetto creative-tech AAA sviluppato per offrire agli utenti un'immersione totale nell'universo di Batman. Non si tratta di un semplice sito web, ma di un **puzzle game investigativo e narrativo** ambientato in ambienti 360° interattivi (Armeria, Batcaverna, Batmobile) che culmina nel reveal spettacolare di un prodotto premium.

L'intero progetto è stato concepito con una **design philosophy "cinematic-first"**, dove ogni transizione, interazione e micro-animazione contribuisce a creare tensione e coinvolgimento.

## 🎬 Concept & Storytelling
Gotham City è sotto attacco. L'Enigmista ha piazzato un ordigno nella città. L'utente assume il ruolo di Batman e deve navigare attraverso le proprie basi operative, decifrando indizi criptici entro un tempo limite. Il completamento delle missioni sblocca l'accesso finale alla Batcaverna e, conseguentemente, al reveal del prodotto esclusivo.

Il tono è oscuro, teso e noir, fortemente ispirato all'estetica dei film di Matt Reeves e alla serie di videogiochi *Batman: Arkham*.

## 🛠 Tech Stack
L'architettura è costruita per garantire performance ottimali pur mantenendo un'alta fedeltà visiva:
- **Core Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Moduli CSS custom (per effetti glow/glassmorphism)
- **3D & Canvas**: Framer Motion (per animazioni UI complesse e page transitions), gestione custom per i canvas 360°
- **State Management**: React Context API / Zustand (per la persistenza dello stato globale di gioco e dei timer)
- **Audio Engine**: Howler.js (gestione dinamica di SFX, musica ambientale e voiceover)

## 📁 Struttura Progetto
```text
Sito/
├── public/                 # Assets statici, video mp4, textures 360
├── src/
│   ├── components/
│   │   ├── effects/        # Overlays, esplosioni, effetti particellari
│   │   ├── layout/         # Strutture UI globali (Navbar, HUD)
│   │   ├── scenes/         # Viste a 360° e canvas interattivi
│   │   └── ui/             # Componenti isolati (Bottoni, Modali, Timer)
│   ├── hooks/              # Custom hooks per logica di gioco e audio
│   ├── types/              # Definizioni TypeScript globali
│   ├── utils/              # Helper functions, math e parsing
│   ├── App.tsx             # Entry point e routing principale
│   └── index.css           # Variabili CSS, design tokens e utilities
├── docs/                   # Documentazione estesa di progetto
└── README.md
```

## 🎯 Design Philosophy & UX Goals
- **Diegetic UI**: L'interfaccia deve sembrare parte dell'equipaggiamento tecnologico di Batman. FUI (Fictional User Interface) con toni neon, griglie, font monospazio e distorsioni CRT.
- **Tensione Costante**: Il tempo è un nemico. Il timer HUD, l'audio ambientale in crescendo e le comunicazioni disturbate aumentano il senso di urgenza.
- **Frictionless Handoff**: Transizioni fluide tra i video di intermezzo (MP4) e gli ambienti esplorabili (Canvas 360°).

## ⚡ Performance Goals
- **Zero Layout Shifts (CLS 0)**: Precalcolo di tutti i container.
- **Aggressive Preloading**: Caricamento anticipato di video e texture della scena successiva durante la risoluzione dell'enigma corrente.
- **Memory Management**: Pulizia immediata dei context WebGL e scaricamento delle texture ad alta risoluzione non in uso per evitare battery drain su mobile.

## 🚀 Installazione & Sviluppo
```bash
# 1. Clona la repository
git clone https://github.com/alessandrobottone2005-crypto/Sito.git

# 2. Installa le dipendenze
npm install

# 3. Avvia il server di sviluppo (Vite)
npm run dev

# 4. Build per la produzione
npm run build
```

## 🗺 Roadmap
- [x] Sviluppo core engine 360° (Mouse look controls)
- [x] Implementazione sistema timer ed enigmi
- [x] Integrazione video transizioni cinematografiche
- [ ] Otimizzazione mobile-first per i canvas
- [ ] A/B Testing sul conversion rate del reveal finale
- [ ] Refactoring del sistema audio per supporto spaziale (Web Audio API)

## 👥 Credits
- **Art Direction & UX/UI**: Alessandro Bottone
- **Development & Technical Architecture**: Frontend Team
- **3D Assets & Animation**: Creative Department
