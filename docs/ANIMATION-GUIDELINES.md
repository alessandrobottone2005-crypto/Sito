# Linee Guida Animazioni 🎬

Tutte le animazioni usano **Framer Motion** e keyframes CSS ottimizzati in `index.css`.

- **UI Elements:** Dissolvenze secche o `typewriter` effect. Niente bounce o easing morbidi. Easing suggerito: `linear` o `ease-out` rapido.
- **Glitch:** Animazioni CSS per sfruttare l'hardware acceleration (GPU). Divise in `glitch-main`, `glitch-med`, `glitch-slow`.
- **Transizioni di Fase:** Schermo nero forzato, caricamento lazy, poi fade-in. Imita lo stacco di macchina cinematografico.
