# UI / UX GUIDELINES & DESIGN SYSTEM

## 1. Visione Estetica (Art Direction)

L'interfaccia non è un sito web, ma **l'hud interno dei sistemi Wayne Tech (Batcomputer)** fuso con l'estetica viscerale e rovinata del film "The Batman" (Matt Reeves).

### Colori Chiave (Tailwind Theme)
- **Nero (Black / #000)**: Dominante. Vuoto, oscurità, immersione.
- **Oro/Ambra (Gold / #FFD700 / `text-gold`)**: Il colore primario dell'HUD Wayne Tech (monocromatico arancione/ambra dei monitor nel film).
- **Verde Joker (Joker / #39FF14 / `text-joker`)**: Colore di corruzione. Sovrascrive il gold quando il sistema è "infetto". Colore ad alta saturazione per contrastare il buio.
- **Rosso Allarme (Red 500/600)**: Esclusivo per failure state e ultimi secondi di timer.

### Tipografia
Tutta la UI (testi informativi, bottoni, timer, coord) utilizza rigorosamente un font monospaziato.
- **Primary Type**: `font-mono` (`Share Tech Mono` o monospace system stack).
- **Secondary Type**: `font-sans` per descrizioni lunghe.
- **Headers (Glitch)**: Font impact/black italic.
- **Text Styling**: Uso intensivo di `uppercase` e tracking estremo (`tracking-widest`, `tracking-[0.5em]`). 

---

## 2. Motion e Microinterazioni (Framer Motion / CSS)

La motion non è mai "smooth" in stile Apple. È tattica, militare, o difettosa (Joker).

### Effetti Core
1. **Glitch & Flicker**: Definiti nel CSS globale (`.glitch-main`, `.glitch-slow`, `.flicker`, `.camera-shake`). Nessun elemento entra morbidamente senza un minimo di distorsione del tubo catodico.
2. **Scanlines**: Applicati in overlay. `background: repeating-linear-gradient(...)`.
3. **Ghost RGB (Aberrazione Cromatica)**: Spostamento sub-pixel rosso/blu (text-shadow) usato su titoli (es. `Protocollo di Acquisizione`).

### Transizioni di Fase (TransitionOverlay)
Le transizioni UI nere usano un easing brusco e veloce (durata 0.8s) per mimare tagli netti di telecamera e reboot hardware.

---

## 3. UI Components

### Navbar.tsx
- L'HUD principale. Invisible background, elementi fluttuanti in alto.
- Icone Lucide React (`Volume2`, `VolumeX`, `ArrowLeft`).
- ProgressTracker: blocchi rettangolari ambra (ispirato all'UI militare). `text-[10px]` e `tracking-[0.5em]`.

### JokerCard.tsx (Sistema Indizi)
La UI 3D interattiva per eccellenza.
- Effetto "Flip" 3D con `preserve-3d` via Tailwind + Framer Motion (`rotateY`).
- **Retro (Card Joker)**: Glow verde pulsante intenso (`box-shadow: inset...`).
- **Riddle (Form)**: Bottoni a scelta multipla con styling "Wayne Tech" (sfondo glassmorphism, linea laterale hover) che vira sul rosso in caso di errore (buzzer) e verde militare in caso di successo.

### BatmanButton.tsx / Button Styling (Checkout)
Bottoni squadrati, brutali, senza border-radius marcato (`rounded-sm`).
- **Primary**: `border-2 border-gold text-gold`. Effetti hover che "riempiono" o sfalsano i bordi.
- **Decorations**: Spesso racchiusi in parentesi quadre decorative o "corner brackets" animati (piccoli border `top-left`, `bottom-right` che pulsano).

### DepthText (BatmanCamera.tsx)
Sistema di testi parallax 3D dello showreel.
- Due layer identici: uno renderizzato *dietro* il canvas WebGL, uno *davanti*.
- Sfruttando blur e scale, i testi attraversano fisicamente la statua nello scroll.

---

## 4. Esperienza Utente (UX Flow)

- **Onboarding Rapido**: Batcomputer Boot Overlay sincronizza fisicamente l'utente (gli chiede di muovere il mouse) prima di abilitare l'HUD, garantendo che capisca di potersi guardare attorno (interazione WebGL).
- **Mobile Graceful Degradation**: Warning chiaro e non dismissibile se il layout esplode su mobile, indirizzando l'utente alla fase carrello.
- **Assenza di Scorrimento**: Eccetto lo showreel `BatmanCamera`, l'app è in `overflow: hidden`. Si guarda, si clicca, non si scrolla (gameplay). 
