# UI / UX GUIDELINES & DESIGN SYSTEM

> ⚠️ **Aggiornamento in corso:** Queste linee guida descrivono il design language **AI-generated** (prima fase del progetto). Il progetto sta migrando verso il **Design System ufficiale Figma** dell'autore — vedere [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) per il sistema definitivo.

---

## 1. Visione Estetica (Art Direction)

L'interfaccia non è un sito web, ma **l'hud interno dei sistemi Wayne Tech (Batcomputer)** fuso con l'estetica viscerale e rovinata del film "The Batman" (Matt Reeves).

### Colori Chiave (Design System Figma)
- **Nero (Black / #000)**: Dominante. Vuoto, oscurità, immersione.
- **Oro/Ambra (Gold / #FFD700)**: Il colore primario dell'HUD Wayne Tech (monocromatico arancione/ambra dei monitor nel film). Nel DS Figma usato come bordo e testo per i bottoni standard.
- **Verde Joker (#39FF14)**: Colore di corruzione. Nel DS Figma appare nella variante `size5StateactiveJoker` dei bottoni. Sovrascrive il gold quando il sistema è "infetto". Alta saturazione per contrastare il buio.
- **Rosso Allarme**: Esclusivo per failure state e ultimi secondi di timer. Response Certificate `statefalse`.
- **Viola / Purple**: Variante colore del Timer Atom nel DS Figma (`sizebigColorpurple`).
- **Giallo / Yellow**: Variante colore del Timer Atom nel DS Figma (`sizebigColoryellow`).

### Tipografia
Tutta la UI utilizza rigorosamente font monospaziato e uppercase:
- **Primary Type**: font monospaziato (`Share Tech Mono` o monospace system stack).
- **Secondary Type**: font sans per descrizioni lunghe (testi indovinelli).
- **Headers**: Font impact/black italic.
- **Casing**: Uso rigoroso di `UPPERCASE` e tracking estremo.

---

## 2. Motion e Microinterazioni

La motion non è mai "smooth" in stile Apple. È tattica, militare, o difettosa (Joker).

### Effetti Core (implementati nel design AI, in revisione per il DS)
1. **Glitch & Flicker**: Definiti nel CSS globale (`.glitch-main`, `.glitch-slow`, `.flicker`, `.camera-shake`).
2. **Scanlines**: Applicati in overlay. `background: repeating-linear-gradient(...)`.
3. **Ghost RGB (Aberrazione Cromatica)**: Spostamento sub-pixel rosso/blu (text-shadow) usato su titoli.

### Transizioni di Fase (TransitionOverlay)
Transizioni UI nere con easing brusco e veloce (durata 0.8s) per mimare tagli netti di telecamera e reboot hardware.

---

## 3. UI Components — Confronto AI → Design System Figma

### Navbar
**AI-generated** (`Navbar.tsx`):
- TailwindCSS, backdrop-blur, icone Lucide
- HUD integrato con timer e progress tracker

**Design System Figma** (`Molecule.tsx > navbarMolecule`):
- 4 stati espliciti: `storytelling`, `gamification`, `showreel`, `checkout`, `winThankyou`
- Logos Sideshow × Batman
- Icon buttons play/pause + audio on/off (con stati active/over/disabled)
- Timer Atom integrato nello stato `gamification`
- Progression Clues Molecule integrata nello stato `gamification`

### Timer
**AI-generated** (`MissionTimer.tsx`):
- Custom countdown con Framer Motion e TailwindCSS

**Design System Figma** (`Atoms.tsx > timerAtoms`):
- 4 varianti: `sizebig/small` × `purple/yellow`
- Label: `TEMPO_ALLA_DETONAZIONE`
- Display digitale `00.00`

### Bottoni
**AI-generated** (`BatmanButton.tsx`):
- Generico, effetto glitch, bordo gold TailwindCSS

**Design System Figma** (`Atoms.tsx > buttonsAtoms`):
- 5 dimensioni (`size1` → `size5`)
- 3 stati (`active`, `over`, `disabled`)
- Variante Joker su `size5` (bordo verde)
- Bottoni Checkout separati (`buttonsCheckoutAtoms`)

### JokerCard (Indizi)
**AI-generated** (`JokerCard.tsx`):
- Flip 3D con Framer Motion
- Stile custom glassmorphism

**Design System Figma** (`Molecule.tsx > clues1–5Molecule`):
- Card flip strutturato con `facecardfront` e `facecardback`
- Retro con: riddle text + 4 bottoni risposta + response certificate
- 5 card complete con riddles e risposte predefinite

### Checkout
**AI-generated** (`Checkout.tsx`):
- Form custom TailwindCSS
- Titolo "PROTOCOLLO DI ACQUISIZIONE"

**Design System Figma** (`Organisms.tsx > checkoutOrganisms`):
- 4 sezioni: Dati Personali, Spedizione, Pagamento, Riepilogo
- Bottone finale "ACQUISTA ORA"
- Codice sconto con bottone "APPLICA"
- Prezzo: €700 + €60 = €760

### ThankYouPage
**AI-generated** (`ThankYouPage.tsx`):
- Conferma custom

**Design System Figma** (`Organisms.tsx > thankyouOrganisms`):
- "MISSIONE COMPLETATA"
- Griglia info ordine completa
- 2 bottoni: "TORNA ALLA BATCAVERNA" + "RIVEDI IL CAVALIERE"

### Win Screen (FinalReveal)
**AI-generated** (`FinalReveal.tsx`):
- Schermata risultati

**Design System Figma** (`Organisms.tsx > winOrganisms`):
- "WAYNE TECH // ANALISI POST-MISSIONE"
- "BOMBA DISINNESCATA"
- Quote Joker: "Complimenti, Bats…"
- Timer residuo
- 2 bottoni: "CONDIVIDI IL RISULTATO" + "SCOPRI LA STATUA"

### Tutorial Screen
**AI-generated** (`BatcomputerBootOverlay.tsx`):
- Custom overlay

**Design System Figma** (`Organisms.tsx > tutorialOrganisms`):
- "ALLARME BATCAVEENA"
- 4 istruzioni (Esplora, Trova, Risolvi, Batti Il Tempo)
- CTA "INIZIA LA MISSIONE"

---

## 4. Esperienza Utente (UX Flow)

- **Onboarding Rapido**: Batcomputer Boot Overlay sincronizza fisicamente l'utente (gli chiede di muovere il mouse) prima di abilitare l'HUD, garantendo che capisca di potersi guardare attorno (interazione WebGL).
- **Mobile Graceful Degradation**: Warning chiaro e non dismissibile se il layout esplode su mobile, indirizzando l'utente alla fase carrello.
- **Assenza di Scorrimento**: Eccetto lo showreel `BatmanCamera`, l'app è in `overflow: hidden`. Si guarda, si clicca, non si scrolla (gameplay).

---

## 5. Design Tokens (Design System Figma)

I token globali sono definiti in `src/design-system/global.css`. Il naming convention nei CSS Modules segue il pattern Figma → camelCase:

```css
/* Esempi di token */
--color-gold: #FFD700;
--color-joker: #39FF14;
--color-black: #000000;
--font-mono: 'Share Tech Mono', monospace;
```

Per il dettaglio completo dei componenti e varianti, vedere [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).
