# 🎨 DESIGN_SYSTEM.md

Il Design System del progetto "The Dark Knight" garantisce coerenza visiva e atmosfere noir/high-tech. Non è un design system tradizionale (come Material Design), ma una **Fictional User Interface (FUI) System**, concepita per sembrare il computer tattico integrato nel cappuccio di Batman.

## 1. Palette Colori
I colori sono progettati per funzionare in modalità puramente "Dark". Nessuna light mode prevista.

- **Backgrounds & Core**:
  - `Void Black`: `#050505` (Sfondo base profondo)
  - `Graphite`: `#1A1A1A` (Pannelli e modali)
  - `Gunmetal`: `#2D3748` (Bordi e separatori)

- **Accents (Neon & Tactical)**:
  - `Riddler Green`: `#39FF14` (Primario per successo, indicatori positivi, testo terminale)
  - `Alert Red`: `#FF003C` (Errori, timer in scadenza sotto i 30 secondi, danger zones)
  - `Bat-Signal Yellow`: `#F7C815` (Highlight secondari, bottoni Call-to-Action nel checkout)
  - `Cyan Hologram`: `#00F0FF` (Hotspot esplorativi non ancora scansionati)

## 2. Typography
La tipografia deve comunicare tecnologia militare, data-processing e precisione.

- **Primary Font (Headings, Display, Numeri Timer)**: `Share Tech Mono` o `Rajdhani`.
  - Usato in Maiuscolo (Uppercase) con `letter-spacing: 2px`.
- **Secondary Font (Body, Descrizioni, Testo lungo)**: `Inter` o `Roboto Mono`.
  - Altamente leggibile per descrivere i prodotti e le regole di gioco.
  
*Regola tipografica*: I testi nei pannelli HUD devono simulare l'effetto "typing" quando appaiono.

## 3. HUD Rules & Spacing System
L'HUD (Heads-Up Display) è l'interfaccia in overlay sopra il canvas 360°.
- **Safe Zones**: L'HUD deve rispettare un margine interno (padding) di `40px` su Desktop e `20px` su Mobile per evitare di ostruire la visuale centrale.
- **Glassmorphism Tattico**: I pannelli dell'HUD usano un `backdrop-filter: blur(12px)` con uno sfondo nero trasparente `rgba(0,0,0,0.6)` e un bordo di `1px solid rgba(255,255,255,0.1)`. Niente ombre sfumate morbide, solo glow netti.
- **Griglia**: Layout basato su una griglia geometrica a blocchi rigidi.

## 4. Glow System & Visual Effects
Il "Glow" è fondamentale per indicare gli elementi interattivi nei canvas oscuri.
- **Hover Glow**: `box-shadow: 0 0 15px var(--riddler-green);`
- **CRT Effect**: Un sottile effetto di scanline (`repeating-linear-gradient`) e una lievissima aberrazione cromatica sui bordi dell'HUD per simulare l'ottica del cappuccio.
- **Vignette**: Un'ombra radiale fissa ai bordi dello schermo per focalizzare l'attenzione al centro.

## 5. Animations & Transitions
Il motion design deve risultare "meccanico", scattante e digitale. Niente "ease-in-out" morbidi in stile Apple, ma animazioni "ease-out" rapide.

- **Modali (Apertura)**: Animazione "Glitch In" (clip-path animato o scaleY da 0 a 1 in 0.2s).
- **Testo**: Effetto *Typewriter* o frammentazione dati (scrambled text effect) prima di mostrare la stringa finale.
- **Transizioni di Scena**: Flash bianco bruciato o disturbo statico TV (Noise overlay per 0.5 secondi) accompagnato da uno snap audio.

## 6. Accessibility Considerations
Nonostante l'aspetto dark e sperimentale, l'accessibilità non è ignorata:
- Contrasto ratio minimo 4.5:1 per tutti i testi di interfaccia.
- Gestione corretta dei `focus-visible` (outline verde brillante) per navigazione via tastiera (essenziale se l'utente gioca da PC senza mouse).
- I testi lampeggianti (timer) rallentano la frequenza di blink a < 3 Hz per evitare problematiche fotosensibili.
- Toggle opzionale per disabilitare gli effetti CRT/Glitch per chi soffre di motion sickness.
