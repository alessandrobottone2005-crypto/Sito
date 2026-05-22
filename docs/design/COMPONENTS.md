# 🧩 COMPONENTS.md

Questa directory documenta l'architettura dei componenti React principali utilizzati per costruire l'esperienza. I componenti sono progettati per essere performanti, riutilizzabili e strettamente accoppiati al Design System del progetto.

## Layout & HUD Components

### `<Navbar />`
- **Funzione**: Header tattico globale, posizionato assoluto in alto.
- **Props**: `transparent` (boolean).
- **Comportamento**: A differenza delle navbar tradizionali, non contiene link di navigazione (`Home`, `About`). Contiene loghi del progetto, indicatori di stato del database ("CONNESSIONE SICURA") e menu hamburger per opzioni di accessibilità.
- **UX Purpose**: Fornisce un ancoraggio visivo per l'utente, mantenendo viva l'illusione del terminale Batcomputer.

### `<HUDOverlay />`
- **Funzione**: Componente contenitore (HOC) che wrappa tutti gli elementi dell'interfaccia (Timer, ProgressTracker, Mirino).
- **Stato**: Intercetta gli stati di gioco globali per nascondersi durante le transizioni cinematiche.
- **Comportamento**: Disabilita i `pointer-events: none` sulla sua area per non bloccare i click verso il Canvas 360° sottostante, riabilitandoli solo sui componenti figli interattivi.

### `<MissionTimer />` (Timer)
- **Funzione**: Mostra il tempo rimanente in formato `MM:SS:ms`.
- **Props**: `initialTime` (number, ms), `onExpire` (callback), `isPaused` (boolean).
- **Comportamento**: Quando scende sotto i 30 secondi, cambia colore in `Alert Red` e inizia a pulsare in sync con l'audio del battito cardiaco.
- **UX Purpose**: Generatore principale di tensione.

### `<ProgressTracker />`
- **Funzione**: Mostra visivamente quanti indizi sono stati trovati su quelli totali (es. `[x] [x] [ ] [ ]`).
- **Comportamento**: Animazione di "riempimento" digitale quando un nuovo enigma viene risolto.

---

## Interactivity & Scene Components

### `<HotspotCard />`
- **Funzione**: Icona interattiva posizionata in 3D (ma renderizzata in DOM 2D) sopra gli oggetti d'interesse nella stanza.
- **Props**: `id`, `x`, `y`, `z`, `iconType`, `onClick`.
- **Comportamento**: Usa un tracking system continuo che aggiorna il suo `transform: translate3d()` a 60fps seguendo il movimento della camera `BatmanCamera`. Effetto glow in hover.

### `<RiddleModal />`
- **Funzione**: Modale in overlay in stile "Hacking Console" che presenta l'indovinello.
- **Props**: `riddleData` (oggetto con domanda, risposte, e risposta corretta), `onClose`, `onSuccess`.
- **Stato**: Gestisce l'input dell'utente e lo stato di errore/successo locale prima di aggiornare lo store globale.
- **Comportamento**: Entra con animazione glitch. Ha un input text per le risposte libere o bottoni per la scelta multipla.

### `<BatmanCamera />` (o `MouseLookControls`)
- **Funzione**: Cuore dell'esplorazione 360°. Cattura l'input del mouse/touch e ruota la scena.
- **Comportamento**: Calcola lo sfasamento X/Y. Applica frizione (damping) per rendere il movimento "pesante" e realistico, simulando la rotazione della testa in un'armatura corazzata.

---

## Storytelling & Transitions

### `<StoryOverlay />`
- **Funzione**: Visualizza i dialoghi stile sottotitoli in basso allo schermo o chiamate radio ("Comlink").
- **Comportamento**: Testo appare progressivamente. Supportato da ritratti dei personaggi stilizzati (es. volto dell'Enigmista verde scuro).

### `<TransitionPlayer />`
- **Funzione**: Player video borderless a pieno schermo usato per le cinematiche di intermezzo.
- **Props**: `videoSrc`, `onComplete`.
- **Comportamento**: Pre-carica il file. Quando attivato, copre istantaneamente la UI e riproduce il video in autoplay. Al `onEnded`, triggera la rimozione di se stesso e rivela la scena sottostante, pre-caricata.

---

## Checkout & Conversion

### `<Checkout />` & `<FinalReveal />`
- **Funzione**: Gestiscono l'ultimo step dell'esperienza.
- **UX Purpose**: Abbandonano il look "hacker/game" per passare a un design ultra-premium, elegante, dominato da neri profondi e luci spot (Lighting) per presentare la statua come un prodotto di lusso da collezione.
