# Documentazione Progetto: Batman Statue Experience

Questa documentazione spiega le logiche di funzionamento, gli script e le tecnologie utilizzate nel progetto "WebsiteBatmanStatue".

## 🚀 Panoramica del Progetto
Il sito è un'esperienza interattiva immersiva dedicata a una statua da collezione di Batman. L'utente viene guidato attraverso diverse aree della Batcaverna (Batcomputer, Armeria, Zona Batmobile) risolvendo indizi lasciati dal Joker per sbloccare la rivelazione finale del prodotto.

---

## 🛠 Tecnologie Utilizzate

### Core & Frameworks
- **React 18**: Framework principale per la gestione dell'interfaccia e dello stato.
- **TypeScript**: Utilizzato per garantire la tipizzazione e la manutenibilità del codice.
- **Vite**: Build tool veloce per lo sviluppo frontend.

### Grafica e 3D
- **Three.js / React Three Fiber (@react-three/fiber)**: Utilizzato per il rendering dei panorami 360 interattivi.
- **React Three Drei (@react-three/drei)**: Helper per Three.js (OrbitControls, PerspectiveCamera, Html).

### Animazioni
- **Framer Motion (motion/react)**: Gestione di tutte le transizioni, overlay, effetti glitch e animazioni di ingresso/uscita.

### Styling
- **Tailwind CSS**: Framework CSS utility-first per lo styling rapido e responsive.
- **CSS Vanilla**: Utilizzato per effetti complessi come animazioni glitch, pulsazioni HUD e scanlines.

---

## 🏗 Struttura del Progetto

├── docs/             # Documentazione tecnica di dettaglio
├── scripts/          # Script di utility e debug (debug.mjs, check_pixels.js)
├── src/
│   ├── components/   # Componenti divisi per macro-aree (ui, scenes, layout, audio, effects)
│   ├── hooks/        # Hook personalizzati (con .gitkeep)
│   ├── types/        # Definizione tipi e interfacce (con .gitkeep)
│   ├── utils/        # Funzioni di utility condivise (con .gitkeep)
│   ├── App.tsx       # Orchestratore principale dell'esperienza e macchina a stati
│   ├── main.tsx      # Entry point di React 19
│   └── index.css     # Design system, stili globali ed effetti grafici
├── public/           # Risorse statiche (video, audio, texture 360°, frame dello showreel)
└── index.html        # Entry point HTML per Vite
```

---

## 🧠 Logiche di Funzionamento

### 1. Sistema delle Fasi (State Machine)
L'applicazione è gestita in `App.tsx` tramite una macchina a stati definita dal tipo `Phase`.
Le fasi seguono questo flusso logico:
`intro` → `batcomputer` → `transition1` → `armeria` → `transition2` → `batmobile` → `reveal` → `showreel` → `checkout`.

- **Transizioni**: Ogni cambio fase è accompagnato da un `TransitionOverlay` per mascherare il caricamento degli asset successivi.
- **Cinematiche**: I componenti `CinematicVideoPlayer` riproducono video MP4 di transizione tra le aree 3D.

### 2. Sistema della Missione
- **Clue Tracking**: Lo stato `completedCount` tiene traccia di quanti enigmi del Joker sono stati risolti.
- **Timer**: Un timer globale (gestito nel Navbar) mette pressione all'utente.
- **Mission Status**: Se il tempo scade, lo stato passa a `failed`, innescando l'effetto `ExplosionOverlay`.

### 3. Panorami 360 Interattivi
Componenti: `BatcavePanorama`, `ArmeriaPanorama`, `BatmobilePanorama`.
- Utilizzano una sfera invertita con una texture (video a 360° o fallback immagine).
- **Indizi (Riddles)**: All'interno della scena 3D sono posizionati dei `ClueMesh` che appaiono come carte digitali sospese.
- **Sistema Enigmi (JokerCard)**: Quando un indizio viene attivato, si apre una `JokerCard`. L'utente deve risolvere un indizio a scelta multipla. La risposta corretta "brucia" la carta (animazione Framer Motion) e incrementa il progresso della missione.

### 4. BatmanCamera (Scroll-Based Animation)
Il componente `BatmanCamera` gestisce la sezione di presentazione del prodotto:
- **Tecnica**: Una sequenza di 800 immagini caricate in cache e renderizzate su un `<canvas>`.
- **Interazione**: Il frame visualizzato è legato alla posizione di scroll dell'utente (`useScroll` di Framer Motion).
- **HUD Dinamico**: Durante lo scroll, appaiono overlay informativi (materiali, dettagli, rarità) sincronizzati con specifici punti della sequenza.

### 5. Overlay e Feedback Visivo
- **TransitionOverlay**: Gestisce le chiusure "a serranda" (shutter) tra le varie fasi, mantenendo l'estetica HUD.
- **ExplosionOverlay**: Viene attivato in caso di fallimento della missione (tempo scaduto). Simula un'interferenza catastrofica nel Batcomputer con un pulsante di reset.
- **FinalReveal**: Un componente speciale che gestisce l'animazione di sblocco della statua una volta completati tutti gli indizi.

---

## 🔄 Flusso Utente Dettagliato

1.  **Intro**: Schermata di benvenuto con estetica "Power On".
2.  **Batcomputer Area**: L'utente esplora la zona computer e risolve i primi 2 indizi del Joker.
3.  **Transizione 1**: Video cinematico che sposta la visuale verso l'armeria.
4.  **Armeria**: Risoluzione di altri 2 indizi circondati dalle tute di Batman.
5.  **Transizione 2**: Video cinematico verso la zona Batmobile.
6.  **Batmobile**: Ultimo indizio per completare il protocollo di sicurezza.
7.  **Reveal**: Animazione climatica che mostra la statua in tutto il suo splendore.
8.  **Showreel (BatmanCamera)**: Presentazione tecnica della statua con scroll-animation.
9.  **Checkout**: Form finale per il pre-ordine della statua.

---

## 📂 Gestione degli Asset

- **Preloading**: `BatmanCamera` implementa un sistema di caricamento concorrente limitato (batch) per caricare 800 immagini senza bloccare il browser.
- **Video Texture**: I panorami tentano di caricare un video `.mp4` a 360° per un'esperienza viva (particelle, luci pulsanti), con fallback automatico su immagine statica `.png`.
- **Audio**: Una colonna sonora di sottofondo gestita con `audioRef` in `App.tsx`, con gestione dei permessi di riproduzione del browser (unlock al primo click).

---

## 🎨 Design System & Estetica
- **Palette**: Nero (#000000), Oro (#FFD700) e Verde Joker (#39FF14).
- **Effetti**: Glitch, Scanlines, HUD fantascientifico (Cromatic Aberration, Scan-sweeps).
- **Tipografia**: Utilizzo di font mono-spaziati per i dati tecnici e font bold/black per l'impatto visivo.

---

## 🛠 Script di Utilità
- `scripts/debug.mjs`: Script Puppeteer per il monitoraggio e test rapido degli stati.
- `scripts/check_pixels.js`: Script di supporto per il caricamento o i controlli degli asset.

---
## 🚀 Come Avviare il Progetto

Per eseguire il progetto in locale, segui questi passaggi:

1.  **Installazione dipendenze**:
    ```bash
    npm install
    ```
2.  **Avvio in modalità sviluppo**:
    ```bash
    npm run dev
    ```
3.  **Build per produzione**:
    ```bash
    npm run build
    ```

---
*Documentazione generata per il team di sviluppo.*
