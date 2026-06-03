# AUDIO SYSTEM — Batman Immersive Experience

Il sistema audio è progettato per essere opprimente, ininterrotto e spazialmente immersivo. Non usiamo il classico hook React con `new Audio()`, ma un **Singleton a livello modulo** e le **Web Audio API** per l'ambiente 3D.

---

## 1. Background Musicale: BatcavernAudio (audioManager.ts)

### Il Problema dei Re-render
Nelle classiche app React, cambiare schermata o rimontare componenti provoca l'interruzione o il reset dell'audio. Noi volevamo un'esperienza senza soluzioni di continuità dalla schermata Intro fino al Thank You.

### Soluzione: Il Singleton Globale
`BatcavernAudio` è un oggetto immutabile esportato da `lib/audioManager.ts` che incapsula una *singola istanza* di `HTMLAudioElement`.

- **Persistenza Assoluta**: Vive fuori dall'albero React. Sopravvive ai cambi di stato e router (fase).
- **Fade-in Custom**: Usa `requestAnimationFrame` per un volume ramp logaritmico, evitando i "click" secchi del `play()`.
- **Autoplay Handling**: Se il browser blocca l'autoplay, l'audio aspetta la prima interazione globale (`click`, `touchstart`, `keydown`) per sbloccarsi autonomamente, senza logica sparsa nei componenti UI.
- **Gapless Loop**: Ascolta l'evento `timeupdate` e forza il `.currentTime = 0` prima della fine naturale della traccia (`SiglaBatman.wav`) per garantire un loop infinito e impercettibile.

### Integrazione React (`useAudioSystem.ts`)
React interagisce col singleton unicamente tramite l'hook `useAudioSystem(isMuted)`. L'unico scopo dell'hook è sincronizzare la prop `isMuted` del pulsante UI con la proprietà `.muted` del singleton, e chiamare il preload iniziale.

---

## 2. JokerAudioManager (Risata Spaziale 3D)

La risata del Joker (`RisataJoker.wav`) che perseguita il giocatore non è una semplice clip riprodotta a volume variabile. Usa la **Web Audio API** per simulare acusticamente lo spazio cavernoso.

Implementato in `JokerAudioManager.tsx` e iniettato globalmente nell'App durante le fasi di indagine.

### Parametri Dinamici (Randomizzati a ogni evento)
- **Intervallo**: Da 55 a 70 secondi.
- **Playback Rate**: Rallentato pesantemente (0.62x – 0.75x) per distorcere la voce e renderla cupa e spaventosa.
- **Pan (StereoPannerNode)**: Assegnato casualmente (-0.88 to 0.88). La risata proviene sempre da una direzione inaspettata (sinistra, destra, dietro le spalle).

### DSP Routing (Elaborazione del Segnale)
Viene costruito un grafo audio per ogni evento:
```
Source ─(Pitch scuro)─> BiquadFilter(Lowpass 700-2100Hz) ─> Panner ─> Output
                          |
                          ├─> Delay1(0.3-0.5s) ─> Gain(40%) ─> PannerOpposto ─> Output
                          |
                          └─> Delay2(0.7-1.2s) ─> Gain(18%) ─> PannerLontano ─> Output
```

1. **Filtro Lowpass**: Attenua le frequenze alte. Simula la distanza e l'assorbimento acustico della pietra umida.
2. **Doppio Delay/Eco**: Simula i rimbalzi acustici:
   - *Eco vicina*: Ritardo corto, volume moderato, panner opposto alla fonte (rimbalzo sulla parete).
   - *Eco profonda*: Ritardo lungo, volume basso (fondo della caverna).

### Gestione Memoria
I nodi Web Audio vengono scollegati e distrutti (`.disconnect()`) immediatamente dopo il decadimento totale degli echi (onended handler), prevenendo severi memory leak riscontrati in altre implementazioni React WebAudio.

---

## 3. Audio HUD e Interactions (JokerCard.tsx)

Semplici cue audio generati proceduralmente (senza asset .wav esterni) via `OscillatorNode` (`playBeep`).
- **Risposta Errata**: Onda `sawtooth` (sega) a 150Hz. Suono aspro, buzz negativo.
- **Risposta Corretta**: Onda `sine` (sinusoidale) a 880Hz e poi 1760Hz. Tipico chime positivo d'interfaccia.
