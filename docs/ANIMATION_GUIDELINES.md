# 💫 Animation Guidelines

Le animazioni nella *Dark Knight Experience* servono uno scopo narrativo, non solo estetico. Non esistono animazioni "bouncy" o giocose; tutto è scattante, rotto, o drammaticamente lento.

## 🗣 Motion Language & Philosophy

Il linguaggio visivo si divide in due macro-comportamenti:

1. **Sistema Sano (Batman/Batcomputer):**
   * Movimenti lineari, calcolati, perfetti.
   * Scansioni dall'alto verso il basso.
   * Easing: `easeOutExpo` o `Custom Bezier (0.16, 1, 0.3, 1)`.
   * Feedback immediato, quasi aggressivo.

2. **Sistema Infetto (Joker):**
   * Movimenti spastici, glitchati, non lineari.
   * Stuttering (finti lag visivi).
   * Apparizioni repentine e disturbanti.

## ⏱ Transition Timing

* **Micro-interazioni (Hover, Click):** Rapide, `50ms` - `150ms`. Il sistema deve sembrare un'arma carica e reattiva.
* **Apertura Modali (Riddles):** `300ms` con effetto scanline e testo che si compone.
* **Transizioni Scena (Macro):** Molto lente e cinematiche, `1.5s` - `3s`, accompagnate da un forte sweep audio (swoosh).

## 🎥 Camera Movement (3D)

La videocamera WebGL non si muove mai in modo perfettamente fluido, simula un occhio umano o una helmet-cam.
* **Inerzia:** Alta. Quando l'utente smette di muovere il mouse, la camera continua per un attimo (damping).
* **Shake:** Tremore dinamico legato ad eventi (timer in esaurimento, errore). Implementato via sinusoide sovrapposta alla `camera.position`.
* **FOV (Field of View):** Dinamico. Durante la decodifica (focus), il FOV si stringe per simulare concentrazione.

## 👾 UI Animation (The Glitch)

L'effetto "glitch" è la firma stilistica del progetto. Si ottiene combinando tre tecniche CSS/SVG:
1. `clip-path: polygon()` che taglia fette orizzontali del DOM e le shifta di pochi pixel a destra o sinistra.
2. `filter: hue-rotate()` o shadow colorate (`cyan` e `magenta`) per simulare la separazione dei canali RGB del tubo catodico.
3. Salti di opacità casuali (`opacity: 0.1` per 10ms, poi `1`).
Queste animazioni non sono in loop continuo (sarebbero stancanti), ma si attivano con trigger casuali (es. `Math.random() > 0.95`).
