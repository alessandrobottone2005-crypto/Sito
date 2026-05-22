# 🏎 PERFORMANCE.md

L'esperienza richiede il caricamento di texture a 360° ad altissima risoluzione e riproduzione video fluida, il tutto all'interno di un browser e in un contesto narrativo dove un drop di framerate può rompere istantaneamente l'immersione. Questo documento delinea le strategie di ottimizzazione.

## 1. Preload Strategy (Just-in-Time Loading)
Il progetto non adotta una singola barra di caricamento iniziale del 100%. Il caricamento è distribuito:
- **Critical Path Load**: Al mount iniziale, vengono scaricati *solo* gli asset dell'Interfaccia HUD (font, SVG vettoriali) e il primissimo video di Intro. L'utente entra in scena entro ~1.5s su rete 4G.
- **Hidden Buffer**: Durante la riproduzione del video di intro (circa 15 secondi), l'app in background avvia il fetch della mappa 360° per la stanza "Armeria".
- **Look-ahead Fetching**: Risolto l'ultimo enigma di una stanza, il sistema inietta invisibilmente il video di transizione successiva nella cache del browser.

## 2. Image & Texture Optimization
- Formato **WebP / AVIF** impiegato per tutte le equirettangolari a 360°. Nessuna JPG non compressa.
- Risoluzione adattiva:
  - Desktop: 4096x2048px o superiore.
  - Mobile: Mappe downscalate a 2048x1024px tramite Media Queries e controlli User-Agent all'inizializzazione del Canvas, risparmiando drastici mega-byte di RAM GPU.
- **Lazy Loading**: Nessuna immagine fuoricampo o di scene future viene inserita nel DOM finché non strettamente necessaria.

## 3. Video Optimization
- Tutti i video cinematici (Transizioni, Final Reveal) sono renderizzati in `.mp4` (H.264) con bitrate calcolato in base alla destinazione d'uso (max 3-5 Mbps per streaming fluido).
- Proprietà `preload="auto"` per il video immediatamente in canna, `preload="none"` per quelli remoti.
- `muted` property settata su `true` di base nei test autoplay (le policy browser bloccano l'autoplay con audio), gestendo l'audio sincronizzato tramite WebAudioAPI dove necessario.

## 4. Render Optimization & Memory Cleanup
- **Garbage Collection (GC)**: Le scene a 360°, una volta superate e non più esplorabili back-tracking, vengono rimosse dal React Tree. I nodi del Canvas vengono distrutti. Le texture mappate nella memoria WebGL devono esplicitamente invocare `gl.deleteTexture(texture)` per evitare Memory Leaks letali, in particolar modo su iOS Safari che ha limiti restrittivi (spesso crolla a ~250MB di RAM allocata).
- **React Rendering**: 
  - Utilizzo intensivo di `useMemo` e `useCallback` sui componenti Hotspot che tracciano a 60fps, per prevenire render superflui di tutto l'albero DOM dell'HUD.
  - L'aggiornamento dei millisecondi del Timer NON trigghera un re-render del Layout principale. Il componente Timer è isolato e gestito tramite `requestAnimationFrame` e Refs dirette al DOM (`span.innerText`) bypassando il ciclo di reconcile di React per la pura visualizzazione.

## 5. Animation Optimization
- **Hardware Acceleration**: Tutte le animazioni HUD (glitch, posizionamenti, modali) utilizzano `transform` e `opacity`. Proprietà come `top`, `left`, o `width` non vengono *mai* animate per evitare reflows.
- `will-change: transform` usato strategicamente (e disabilitato quando l'animazione finisce) sui container che si muovono frequentemente.

## 6. Mobile Considerations & FPS Goals
- Il target è mantenere uno stabile **60 FPS** su desktop e **>30 FPS** su smartphone mid-range (es. iPhone 12 / Samsung S20).
- Su mobile vengono disabilitati: effetti di Post-Processing (CRT, Glitch complessi su tutto schermo), abbassate le particelle (es. polvere atmosferica).
