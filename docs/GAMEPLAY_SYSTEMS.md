# GAMEPLAY SYSTEMS — Batman Immersive Experience

Questo documento descrive in dettaglio i sistemi interattivi che compongono la missione della Batcaverna.

---

## 1. Sistema Timer (useMissionTimer.ts)

Il timer della missione è il cuore della tensione narrativa. È implementato nell'hook `useMissionTimer`.

### A/B Testing e Gruppi
All'avvio, viene assegnato casualmente (50/50) un gruppo di test che determina il tempo a disposizione:
- **Gruppo A**: 120 secondi
- **Gruppo B**: 240 secondi

### Precisione
Non si affida a un semplice `setInterval` con decremento (soggetto a drift in JavaScript). Usa `performance.now()` in combinazione con il tempo target calcolato per garantire precisione assoluta:
```typescript
endTimeRef.current = performance.now() + timeLeft * 1000;
const remaining = Math.max(0, Math.ceil((endTimeRef.current! - now) / 1000));
```

### Gestione Pausa e Video
Il timer si arresta automaticamente:
1. Quando l'utente preme Pausa (`isPaused`)
2. Durante i video di transizione cinematici (`isVideoTransition`)

### Countdown Drammatico (Ultimi 10s)
Quando il timer scende a <= 10 secondi, l'HUD attiva l'animazione di emergenza:
- Colore ROSSO (`text-red-500`)
- Pulsazione e camera shake
- Alert full-screen lampeggiante
- Al termine (00:00), scatta l'evento `onTimeUp` -> `missionStatus = "failed"` (ExplosionOverlay).

---

## 2. Progress Tracker e Reward System

La missione richiede di trovare **5 indizi** (Joker Cards) disseminati nei panorami.

### Struttura Indizi
- **Batcomputer Area**: 2 indizi (Count 0 → 2)
- **Armeria Area**: 2 indizi (Count 2 → 4)
- **BatMobile Area**: 1 indizio (Count 4 → 5)

Il tracciamento è gestito globalmente da `completedCount` in `App.tsx` e visualizzato nel componente HUD `ProgressTracker.tsx`.

### Speedrun Discount (Easter Egg)
Se la missione (tutti e 5 gli indizi) viene completata in **meno di 90 secondi** reali (al netto di bonus/pause):
- `speedrunUnlocked` diventa `true`
- Nel componente Checkout viene auto-compilato il promo code `SPEEDRUN15` (sconto 15%)
- Mostrato in `FinalReveal.tsx` come "VELOCITÀ LEGGENDARIA".

### Bonus Tempo Rapido (+60s)
Se il giocatore risolve i primi 2 indizi (superando la fase Batcomputer) entro i primi **45 secondi**, riceve un bonus:
- Aggiunta di +60 secondi al timer.
- Notifica "RIVELAZIONE RAPIDA ARMA: +60 SECONDI DI BONUS TEMPO" via `AnimatePresence`.

---

## 3. Sistema Hint Progressivo del Joker (useJokerHint.ts)

Il Joker fornisce "aiuti" se il giocatore impiega troppo tempo per trovare una carta nella scena corrente. È implementato per risultare minaccioso, non accomodante.

### Temporizzazioni
Si attiva dopo un ritardo iniziale di **60 secondi** (`HINT_DELAY_MS`) dalla comparsa di un indizio irrisolto.

### 3 Fasi Cinematografiche
Se la carta continua a non essere trovata, l'hint scala di intensità ogni 20 secondi:

- **Fase 1 (+60s)**: Glitch orizzontale verde sottile (`Phase1Glitch`). La voce del Joker (audio distortion) sussurra un indizio.
- **Fase 2 (+80s)**: Flicker ambientale, vignettatura verde aumentata (`Phase2Flicker`). Appare a schermo: "IL GIOCO È SOLO ALL'INIZIO...".
- **Fase 3 (+100s)**: Aberrazione cromatica, scanlines rosse distorte (`Phase3ChromaticAberration`). Audio risata più presente. Testo: "HA HA HA — GUARDA MEGLIO, DETECTIVE".

Appena il giocatore clicca o risolve la carta, l'hint si resetta istantaneamente (`resetHint()`).

---

## 4. Overlay di Fallimento (Mission Fail)

Gestito da `ExplosionOverlay.tsx` quando il timer arriva a zero.
- **Fase 1**: Flash e glitch immediato del sistema.
- **Fase 2**: Effetto esplosione (rosso, opacity pulse).
- **Fase 3**: Schermata nera con timer di reset (15 secondi).
- **Azioni**: "Riprendi la Missione" (ricomincia) o "Salta la Missione" (va al breather screen e procede allo showreel).

---

## 5. Mobile Fallback (useMobileDetection.ts)

L'esperienza panoramica richiede il mouse. Se `window.innerWidth < 768px`, l'app blocca l'interazione con un full-screen warning in `App.tsx` ("DISPOSITIVO NON COMPATIBILE").
L'utente può:
1. Forzare l'esplorazione (pessima UX ma permessa).
2. Saltare direttamente allo showreel della statua (raccomandato per mobile marketing).

---

## 6. Sistema di Skip e Dev Shortcuts

Per testing e presentazioni rapide, sono presenti due bypass:
1. **Bottone Overlay (Dev Only)**: Sempre presente in basso a destra, permette lo skip manuale e sequenziale di tutte le 11 fasi dell'app. Bypassa ogni logica di timer o progresso.
2. **Easter Egg (CMD+1 / CTRL+1)**: Shortcut da tastiera che salta da qualsiasi punto della missione direttamente allo showreel (`phase="showreel"`) segnando 5/5 indizi, simulando una vittoria rapida.
