# 👨‍💻 DEVELOPER_NOTES.md

Questo file è una documentazione viva ("living document") per il team di sviluppo. Serve a raggruppare appunti tecnici, scorciatoie di debug, known issues e spunti per iterazioni future del codice di The Dark Knight Immersive Experience.

## 1. Debug Systems (Hotkeys e Comandi Nascosti)
Per evitare di dover testare il loop di gioco (e i 5 minuti di timer) ad ogni ricarica della pagina durante lo sviluppo, sono stati predisposti dei tool "dietro le quinte":

- I file di testing e i componenti in `/scripts` (es. `debug.mjs`, `check_pixels.js`) sono utilità dev.
- **Variabili Globale (Console)**: Si può forzare lo sblocco aprendo i Chrome DevTools e digitando:
  `window.__DEBUG_FORCE_VICTORY()` per trigerrare la scena finale.
- Un dev toggle URL-based: aggiungendo `?debug=true` all'url, l'HUD mostra coordinate `X,Y,Z` della telecamera, disabilita il tempo residuo, e rende cliccabile l'avanzamento scene istantaneo.

## 2. Optimization Notes & Attuali Colli di Bottiglia
- **Memory Leak su iOS Safari**: Si riscontra un saltuario crash del WebGL context quando si fa fast-forwarding fra i tre video di transizione e le scene 360 in rapida successione. Causa probabile: Safari fallisce nel de-allocare tempestivamente i `HTMLVideoElement` in background.
  - *Fix Attuale*: Disattivare `preload="auto"` massivo su iOS, caricare su base event-driven.
- **Gestione Mobile FPS**: L'evento `deviceorientation` per controllare la telecamera col movimento fisico dello smartphone è stato momentaneamente accantonato (problemi di calibrazione asse zero e restrizioni permessi https iOS 13+). Si utilizza solo lo swipe drag.

## 3. Known Issues
- Su dispositivi a basso refresh rate (< 60hz) e hardware low-end (vecchi android), la Frizione della telecamera (`damping`) risulta irregolare causando stuttering. Implementato temporaneo frame-delta time limitator ma serve una revisione della formula matematica nel componente `MouseLookControls`.
- L'Audio Autoplay policy fa sì che, al ricaricamento di pagina forzato ("CMD+R") mentre si è nella Batcaverna, l'audio rimanga muto finché non avviene un nuovo click nel DOM.

## 4. Future Improvements (Version 2.0)
- **Migrazione a WebGL puro o PlayCanvas**: Se la fedeltà visiva richiedesse effetti post-processing avanzati (Blur di movimento, Depth of field sulla UI) le Canvas API 2D e i workaround per le 360 faranno fatica.
- **Sistema multi-lingua (i18n)**: Attualmente tutti gli indovinelli sono hardcoded in italiano/inglese nei JSON locali. Passaggio a un CMS Headless (Sanity/Strapi) per gestire i testi enigmi in remoto.
- **Analytics & Heatmaps**: Tracciare le coordinate e lo yaw della telecamera via WebSocket per capire in quali zone i giocatori si bloccano o impiegano troppo tempo a trovare gli hotspot.
