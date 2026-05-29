# Performance & Ottimizzazioni ⚡

Linee guida per mantenere i 60fps costanti:

- **Lazy Loading:** I modelli pesanti e i video sono wrappati in `React.lazy()` e `<Suspense>`. Vengono fetchati solo quando necessari.
- **Three.js Instancing:** `SharedPanoramaCanvas` viene montato una sola volta e scambia solo la texture. **Non** smontare il canvas.
- **Preloading:** Asset critici (texture 360, video successivi) vengono pre-caricati invisibilmente (`AssetPreloader.tsx`).
- **Render Optimization:** Evitare re-render del DOM overlay se non necessari, usare `useMemo` e `useCallback` estensivamente.
