# 🎧 AUDIO_SYSTEM.md

L'audio in questo progetto non è un decoro, ma un pilastro portante dell'esperienza UX e narrativa. L'80% dell'atmosfera tensiva è guidata dalle logiche audio.

## 1. Architettura Engine Audio (Howler.js)
L'implementazione utilizza Howler.js per gestire l'API Web Audio, garantendo compatibilità multipiattaforma, preload accurato e sprite management.

```javascript
// Esempio logico di sound pool
const SFX = new Howl({
  src: ['assets/audio/sfx_sprite.mp3'],
  sprite: {
    hover: [0, 150],
    click: [200, 300],
    glitch: [500, 1200],
    success: [1500, 2500]
  }
});
```

## 2. Layering Audio
Il progetto gestisce tre canali principali con volumi indipendenti e comportamenti di fade:

### A. Ambient / Drone (Canale 1)
- Traccia principale in loop costante, dal tono basso, "noir" e industriale.
- Pacing: Incrementa d'intensità man mano che le scene avanzano o il timer scende sotto soglie critiche.

### B. SFX (Sound Effects - Canale 2)
L'UI è fisicamente "pesante". Ogni interazione ha un peso sonoro.
- **Hover sui bottoni/hotspot**: "Tick" digitale veloce.
- **Click**: Suono meccanico solido, simile a uno switch analogico di derivazione militare.
- **Typewriter**: Quando del testo appare a schermo, un suono loop "clack-clack" accompagna i frame fino alla scrittura completa.

### C. Voiceover & Eventi Diegetici (Canale 3)
- Registrazioni vocali distorte dell'Enigmista che si attivano all'apertura dei modali o all'errore in una risposta.
- Spazializzazione simulata: Voci che pan-ano da destra a sinistra per trasmettere senso di disorientamento.

## 3. Gestione Tensione (Tension Escalation System)
Il Timer globale influisce sull'audio in tempo reale.

- **Fase Verde (> 2 min)**: Drone ambientale lineare.
- **Fase Gialla (< 1 min)**: Aggiunta layer percussivo (battito cardiaco ovattato).
- **Fase Rossa (< 30 sec)**: BGM filtrato, sirena in loop lento, il ticchettio del timer viene inviato al canale principale (audibile a ogni secondo), volume generale incrementato del 15% tramite master gain.

## 4. Policy Autoplay & User Interaction
I browser moderni (Chrome, Safari) impongono strict policy: l'audio non può partire senza l'interazione umana.
- L'esperienza è preceduta da un Bottone `INIZIALIZZA SISTEMA`. Questo click utente è il *trigger globale* che sblocca il Context Web Audio e avvia il primo layer ambientale, garantendo che i video successivi non partano silenziati.

## 5. Pause & Focus Management
L'audio engine è "context-aware":
- Se l'utente cambia tab nel browser o riduce a icona l'app (evento `visibilitychange`), l'istanza globale muta tutti i canali o pausa il tempo/gioco per evitare dissonanze e spreco risorse, ripristinandoli al `focus`.
