# ASSET STRUCTURE — Batman Immersive Experience

Questo documento elenca la struttura e il pipeline degli asset presenti nel repository, garantendo chiarezza su formati e ottimizzazioni.

---

## 📁 `public/assets/`

Tutti gli asset "statici" accessibili dal server web (Vite) via URL relativo `./assets/`.

### 🎵 `audio/`
Tutti i formati `.wav` senza perdita. La qualità audio e le Web API compensano la dimensione (no MP3 a basso bit-rate per le esperienze premium).
- `SiglaBatman.wav` (~10MB): Soundtrack ambientale continua, riprodotta dal singleton audio.
- `RisataJoker.wav` (~760KB): Buffer caricato e manipolato dinamicamente dalla Web Audio API (Panner 3D e Delay) in `JokerAudioManager`.

### 🎬 `videos/`
Transizioni cinematiche per nascondere il caricamento e dare continuità narrativa. Formato `mp4` (H.264/AAC per cross-compatibility).
- `BatCaverna_PassaggioBatComputerAArmeria.mp4` (~1.9MB): Transizione 1 -> 2.
- `BatCaverna_PassaggioArmeriaABatMobile.mp4` (~5.7MB): Transizione 2 -> 3.
- `BatCaverna360_BatComputerArea.mp4` (~7.7MB): (Draft - mantenuto come sorgente video non usato nel router webGL attuale, se utile in fallback).

### 🌌 `textures/`
Texture equirettangolari (360°) caricate dinamicamente in Three.js (`SharedPanoramaCanvas`).
- Formato di produzione: `.jpg` (~600KB - 1.1MB) ottimizzati.
- *NOTA*: Nella cartella sono conservati anche i `*.png` originali da ~50MB. Non sono caricati nell'app React per limiti di banda/VRAM, ma mantenuti come backup o base per futuri export ad altissima risoluzione.

### 🖼 `images/`
Componenti UI e texture flat 2D.
- `Navbar.png`, `LogoTransizione.png`, `LogoSideshow.png`
- `JollyJokerCard.jpg` e `JollyJokerCard_Back.jpg` (rispettivamente Fronte/Retro usate su shader custom 3D in `JokerCard.tsx`).
- `batman-cursor.png`

### 🎞 `showreel/`
Sequenza di frame in `.png` per lo scroll-jacking (`BatmanCamera.tsx`).
- **800 frame totali**, enumerati come `0001.png` fino a `0800.png`.
- **Risoluzione**: 4K (3840×2160px) — altissima qualità, esportati in produzione definitiva.
- **Frame rate originale**: 25 FPS.
- **Sfondo**: trasparente (canale alpha PNG — nessun colore di sfondo composito).
- Il componente li carica in background (batching basato su un priority threshold).

---

## 🎨 Design System e Configurazione (Tailwind)

Nonostante non ci siano file `.css` "modulari", la configurazione in `index.css` è la spina dorsale estetica.
- **Colori Tema**: Estesi direttamente (es. `--color-gold: #FFD700; --color-joker: #39FF14;`).
- **Font**: Utilizzati web safe `monospace` stack per look terminale, o Google Fonts `Share Tech Mono`.
- **Keyframes CSS**: Tutte le animazioni complesse che non sono gestite da Framer Motion per questioni di performance (come lo scanline in loop infinito e gli effetti glitch noise sui testi) risiedono in `@keyframes` nativi in `index.css`.
