# Batman Immersive Experience 🦇

> Esperienza cinematografica interattiva per la statua premium The Batman by Sideshow.

Questo progetto è una **piattaforma scrollytelling e webGL** AAA.
Progettato per trasformare una semplice operazione di marketing in una vera e propria avventura narrativa e immersiva. L'utente viene inserito nella Batcaverna, dove deve esplorare, investigare indizi lasciati dal Joker e superare missioni a tempo per sbloccare l'acquisto del prodotto premium.

## 📁 Architettura e Struttura

La codebase è stata rigorosamente organizzata secondo best practice per scalabilità e modularità:

- `/src/app` - Core logic e routing delle fasi.
- `/src/components/ui` - Componenti base (Bottoni, Testi).
- `/src/components/cinematic` - Componenti 3D (Three.js), video e camere interattive.
- `/src/components/showreel` - Checkout e showcase statua premium.
- `/src/components/joker` - Logica e UI dell'hacking del Joker.
- `/src/components/hud` - Timer e tracker di missione.

Tutta la documentazione tecnica approfondita si trova in `/docs`.

## ⚙️ Tecnologie e Performance

- **React 19** + **Vite**
- **Three.js** & **React Three Fiber** per le panorami a 360°.
- **Framer Motion** per animazioni fluide a 60fps.
- **Tailwind CSS v4** per styling rapido senza uscire dal flow.
- Componenti Lazy Loaded per l'ottimizzazione del First Contentful Paint.

## 🚀 Avvio Locale

```bash
npm install
npm run dev
```

## 📜 Licenza
Uso interno / Dimostrativo. Non destinato alla vendita diretta al di fuori dei canali autorizzati Sideshow/DC.
