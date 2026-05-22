# 🏗 ARCHITECTURE.md

Questo documento delinea l'architettura tecnica del progetto "The Dark Knight: Immersive Experience", progettata per gestire rendering 360°, flussi video interattivi e logiche di gioco senza compromettere le performance del browser.

## 1. Architettura Generale
L'applicazione è una **Single Page Application (SPA)** basata su React, pensata come un'unica grande macchina a stati. Non ci sono caricamenti di pagina tradizionali (hard navigation). Tutto è gestito tramite un sistema di routing virtuale (o state-based rendering) per garantire transizioni visive ininterrotte, essenziali per la continuità cinematografica.

### Principi Core:
- **Separation of Concerns**: L'UI (HUD) è rigorosamente separata dal layer di rendering 3D/360.
- **Event-Driven Gameplay**: Gli avanzamenti di scena sono triggerati da eventi (es. `ON_RIDDLE_SOLVED`, `ON_TIME_EXPIRED`, `ON_VIDEO_ENDED`).
- **Graceful Degradation**: Su dispositivi meno potenti, gli effetti post-processing e le particelle vengono ridotti per mantenere stabili gli FPS.

## 2. Flow Experience & Routing
Il flow non segue le regole standard dei siti web (e.g. `/home` -> `/about`). Segue invece un copione lineare con biforcazioni basate sull'esito della missione.

**Fasi del Routing Interno:**
1. `INTRO_CINEMATIC` (Video Player a pieno schermo)
2. `SCENE_ARMORY` (Interazione 360° + HUD + Ricerca Indizi)
3. `TRANSITION_BATCAVE` (Video di passaggio mascherato da UI)
4. `SCENE_BATCAVE` (Interazione 360° + Risoluzione finale)
5. `OUTRO_SUCCESS` / `OUTRO_FAIL` (Reveal della statua o esplosione di Gotham)
6. `CHECKOUT` (Flusso e-commerce e conversione)

## 3. Gestione Stato
Il progetto utilizza un approccio ibrido per lo stato:
- **Stato Globale (Zustand / Context)**: Gestisce il Timer globale, il punteggio, gli indizi trovati e la scena corrente. Essendo uno stato condiviso, l'HUD in overlay può accedere al tempo residuo indipendentemente dalla scena 3D sottostante.
- **Stato Locale (React `useState`)**: Gestisce gli stati effimeri (hover sui bottoni, input dei form del quiz, toggle modali).

## 4. Gestione Scene e Rendering 360°
Le scene a 360° (Armeria, Batcaverna, Batmobile) condividono un componente root: `SharedPanoramaCanvas`.
- **Tecnologia**: Implementazione custom su Canvas API o libreria 3D leggera (es. Three.js).
- **Mouse Look Controls**: Calcolo differenziale del movimento del mouse (o giroscopio su mobile) convertito in coordinate polari (Yaw e Pitch) per muovere la telecamera virtuale.
- **Hotspot System**: Elementi HTML sovrapposti al Canvas (tramite posizionamento CSS assoluto) che tracciano la rotazione della telecamera. Calcolati proiettando le coordinate 3D nello spazio 2D dello schermo.

## 5. Preload Assets Strategy
Il tempo è fondamentale. Un caricamento durante il gioco romperebbe l'immersione.
- **Initial Load**: Vengono scaricati solo gli asset dell'Intro e della primissima stanza.
- **Background Fetching**: Non appena l'utente entra nell'Armeria, un worker invisibile o l'API `Image.src` / `<video preload="auto">` inizia a bufferizzare i video di transizione successivi.
- I video sono ottimizzati in formato MP4 (H.264) per massima compatibilità hardware decoding.

## 6. Gestione Audio e Video Cinematici
- **Sistema Audio**: Tre layer audio separati gestiti indipendentemente:
  1. *BGM (Background Music)*: Loop costante, gestito in fade in/out tra le scene.
  2. *SFX (Sound Effects)*: Suoni di UI (click, hover), glitch digitali.
  3. *Voiceover*: Voce dell'Enigmista, spazializzata quando necessario.
- **Video Player Integration**: I componenti `<video>` non hanno controlli visibili. L'evento `onEnded` del player notifica al Game Manager di effettuare lo switch di stato alla scena successiva, garantendo un "cut" invisibile tra video pre-renderizzato e scena interattiva.

## 7. Sistema Hotspot
Gli Hotspot sono la principale meccanica di interazione nelle stanze 360°.
- Ogni stanza ha un file JSON/configurazione con le coordinate `[x, y, z]` degli indizi.
- Quando la telecamera (viewport) inquadra l'hotspot entro una certa tolleranza, l'hotspot si attiva visivamente (glow effect) e diventa cliccabile.
- Il click apre il `RiddleModal`, che mette in pausa il movimento della telecamera ma *non* il timer globale (aumentando la tensione).
