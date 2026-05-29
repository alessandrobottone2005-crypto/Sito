# Architettura del Sistema 🏗️

L'architettura del **Batman Immersive Experience** si basa su una netta separazione delle responsabilità:

- **Data Layer:** Configurazioni, costanti, testi (in `/src/data`).
- **Core App & State:** `App.tsx` agisce come "Mission Director", gestendo le fasi (`intro`, `batcomputer`, `armeria`, `batmobile`, `reveal`, `showreel`, `checkout`, `thankyou`) usando React State e Contexts/Hooks.
- **Cinematic Layer:** Contenitori Three.js (`SharedPanoramaCanvas`) e video overlay. I componenti 3D non vengono distrutti tra una stanza e l'altra, per garantire fluidità (solo la texture viene scambiata).
- **Showreel Layer:** E-commerce classico, caricato asincronamente.
- **Audio Layer:** `useAudioSystem.ts` e `JokerAudioManager.tsx` gestiscono cross-fading, loop e layer dinamici.
