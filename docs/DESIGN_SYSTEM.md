# 🎨 DESIGN SYSTEM — Batman 87th Anniversary

> **Stato attuale:** 🔄 **Trasformazione in corso** — Il sito sta migrando dal design system generato dall'AI (Antigravity) verso il **Design System ufficiale di Alessandro Bottone**, progettato in Figma e codificato secondo la metodologia **Atomic Design**.

---

## Origine del Design System

Il Design System è stato creato dall'autore del progetto **Alessandro Bottone** in **Figma**, seguendo la metodologia Atomic Design (Brad Frost). I file sono stati poi esportati in codice React tramite pipeline Figma → React e depositati nella repository il **20 giugno 2026**.

### File del Design System (in `src/design-system/`)

| File | Livello Atomic | Descrizione |
|---|---|---|
| `Atoms.tsx` | ⚛️ Atoms | Componenti base: bottoni, icone, timer, testi, logo |
| `Atoms.module.css` | ⚛️ Atoms | Stili CSS Module per gli Atoms |
| `Molecule.tsx` | 🧬 Molecules | Combinazioni di atoms: Navbar, Clues, Tutorial |
| `Molecule.module.css` | 🧬 Molecules | Stili CSS Module per le Molecules |
| `Organisms.tsx` | 🦠 Organisms | Sezioni complete: Showreel, Win, Tutorial, Checkout |
| `Organisms.module.css` | 🦠 Organisms | Stili CSS Module per gli Organisms |
| `Templates.tsx` | 📐 Templates | Layout completi per ogni schermata dell'experience |
| `Templates.modules.css` | 📐 Templates | Stili CSS Module per i Templates |
| `global.css` | 🌐 Global | Token globali e variabili CSS del DS |

---

## Gerarchia Atomic Design

```
Atoms (Bottoni, Icone, Timer, Testi, Logo, Cursore)
  ↓
Molecules (Navbar, Clues Card, Button Riddles, Progressione, Tutorial)
  ↓
Organisms (Showreel Quality, Win Screen, Tutorial, ThankYou, Checkout)
  ↓
Templates (Win, Showreel, Storytelling, Tutorial, ThankYou, Checkout, Gamification)
```

---

## Atoms — Componenti Base

### 🔘 Buttons
5 dimensioni (`size1` → `size5`), 3 stati (`active`, `over`, `disabled`):
- **Variante standard** → bordo `#FFD700` (gold), sfondo trasparente
- **Variante Joker** → bordo `#39FF14` (verde), effetto corruzione
- **Variante Checkout** → stati `active` e `tapped`

### ⏱️ Timer
2 dimensioni (`sizebig`, `sizesmall`) × 2 colori (`purple`, `yellow`):
- Label: `TEMPO_ALLA_DETONAZIONE`
- Display digitale formato `MM.SS`

### 🃏 Clues (Joker Cards)
- **Front** (stato `over`, `active`): immagine fronte carta Joker
- **Back** (stato `over`, `true`, `false`): retro con risposta giusta/errata

### 📜 Storytelling Text
5 stati narrativi sequenziali (dialogo Joker):
1. `BATMAN...` / `HO LASCIATO UN REGALINO...`
2. `RISOLVI IL GIOCO` / `O LA TUA CAVERNA DIVENTERÀ POLVERE`
3. `NON È IL SOLITO GIOCATTOLO` / `MA QUALCOSA CHE FARÀ IL BOTTO...`
4. `IL TEMPO SCORRE` / `TIC, TAC, TIC, TAC BAT...`
5. `TROVA I MIEI 5 INDIZI` / `DIMOSTRAMI CHE IL GRANDE PIPISTRELLO SA ANCORA GIOCARE`

### 🏆 Win Text
- Label Wayne Tech: `WAYNE TECH // ANALISI POST-MISSIONE`
- Titolo: `BOMBA DISINNESCATA`
- Quote Joker: *"Complimenti, Bats…"*

### 📋 Checkout Atoms
Form completo in stile Wayne Tech con campi:
- Dati personali: NOME E COGNOME, EMAIL, TELEFONO
- Spedizione: VIA/PIAZZA, CITTÀ, CAP, N. CIVICO, PROVINCIA, NAZIONE
- Pagamento: NUMERO CARTA, NOME INTESTATARIO, DATA SCADENZA, CVV/CVC
- Riepilogo: PRODOTTO, SUBTOTALE, SPEDIZIONE, TOTALE, CODICE SCONTO

### 🎬 Showreel Titles
- `L'EREDITÀ É TUA`
- `EDIZIONE LIMITATA A 500 COPIE`

### 📊 Progression Clues
Barra progresso 5 slot (`disabled` / `active`)

### 🖱️ Icon Buttons
3 stati: `active`, `over`, `disabled`

### 🏷️ Icon Set
- **Back**: freccia indietro (3 stati)
- **Audio Off**: speaker off (3 stati)
- **Audio On**: speaker on con onde (3 stati)
- **Play**: triangolo play (3 stati)
- **Pause**: doppia barra (3 stati)

### ✅ Response Certificate
3 stati: `true` (RISPOSTA CORRETTA), `false` (RISPOSTA ERRATA), `active` (normale)

---

## Molecules — Combinazioni

### 🧭 Navbar (4 stati)
| Stato | Contenuto Destra |
|---|---|
| `storytelling` | Pulsante Pausa + Audio |
| `gamification` | Timer + Progressione Indizi + Pausa + Audio |
| `showreel` | Bottone "PREORDINA IL CAVALIERE" + Audio |
| `checkout` | Back + Audio |
| `winThankyou` | Play |

### 🃏 Clues 1–5 (Molecole complete)
Card flip con fronte + retro per ogni indizio. Il retro include:
- Testo riddle
- 4 bottoni risposta (A/B/C/D)
- Indicatore risposta (certificate)

### 📐 Tutorial Instructions
4 blocchi informativi:
1. Esplora l'Ambiente
2. Trova Tutti Gli Indizi
3. Risolvi Gli Enigmi
4. Batti Il Tempo

### 📦 Info Order
Griglia dati ordine (STATO, DATA, PRODOTTO, SPEDIZIONE, QUANTITÀ, ID TRANSAZIONE)

### 💳 Checkout Molecule
Raggruppamento form per sezione:
- Dati Personali e Contatto
- Dati di Spedizione
- Dati di Pagamento
- Riepilogo Ordine

---

## Organisms — Sezioni Complete

### 🎥 Showreel Quality Text
4 card qualità in riga:
- PRESENZA LEGGENDARIA
- EDIZIONE LIMITATA
- MATERIALI D'ELITE
- SCULTURA DI PRECISIONE

### 🏆 Win Organisms
Win screen completo: testo vittoria + timer residuo + bottoni (CONDIVIDI, SCOPRI LA STATUA)

### 🎓 Tutorial Organisms
Schermata tutorial completa: titolo allarme + 4 istruzioni + CTA "INIZIA LA MISSIONE"

### 🙏 ThankYou Organisms
Schermata conferma: testo successo + griglia ordine + bottoni (TORNA, RIVEDI)

### 💰 Checkout Organisms
Form acquisto completo: titolo "PROTOCOLLO DI ACQUISIZIONE" + 4 sezioni form + bottone "ACQUISTA ORA"

---

## Templates — Layout Completi per Schermata

| Template | Corrisponde alla Phase |
|---|---|
| `winTemplate` | `reveal` |
| `showreelTemplate` | `showreel` |
| `storytellingTemplates` | `intro` |
| Tutorial + Timer+Button | `batcomputer` / `armeria` / `batmobile` |
| `tutorialTemplate` | Tutorial overlay (`showBootOverlay`) |
| `thankyouTemplate` | `thankyou` |
| `checkoutTemplate` | `checkout` |

---

## 🔄 Stato della Migrazione

### ✅ Completato
- [x] Import dei file Figma in repository
- [x] Riorganizzazione in `src/design-system/`
- [x] Documentazione Design System creata

### 🔄 In Corso
- [ ] Sostituzione componenti `src/components/ui/BatmanButton.tsx` con atoms DS
- [ ] Sostituzione `src/components/layout/Navbar.tsx` con Navbar Molecule DS
- [ ] Sostituzione `src/components/hud/MissionTimer.tsx` con Timer Atoms DS
- [ ] Sostituzione `src/components/hud/ProgressTracker.tsx` con Progression DS
- [ ] Sostituzione `src/components/joker/JokerCard.tsx` con Clues Molecule DS
- [ ] Sostituzione `src/components/showreel/Checkout.tsx` con Checkout Template DS
- [ ] Sostituzione `src/components/showreel/ThankYouPage.tsx` con ThankYou Template DS
- [ ] Sostituzione `src/index.css` con tokens del `global.css` DS

### ⏳ Da fare
- [ ] Integrazione completa dei Templates come schermate principali
- [ ] Rimozione stili ad-hoc non conformi al DS
- [ ] Audit finale di conformità DS

---

## Differenze Chiave: Design AI → Design System Figma

| Aspetto | Design AI (precedente) | Design System Figma (in corso) |
|---|---|---|
| **Origine** | Generato da Antigravity AI | Progettato dall'autore in Figma |
| **Metodologia** | Componenti ad-hoc | Atomic Design rigoroso |
| **CSS** | TailwindCSS utility classes | CSS Modules con naming semantico |
| **Navbar** | Componente custom con TailwindCSS | Molecule con stati espliciti Figma |
| **Timer** | Custom con TailwindCSS | Atom con varianti di colore/dimensione |
| **Bottoni** | BatmanButton.tsx generico | 5 taglie × 3 stati × 2 varianti |
| **Joker Card** | Componente interattivo custom | Molecule flip card con atoms |
| **Checkout** | Form custom | Organism + Template completo |
| **Tokens** | Tailwind config | CSS custom properties in `global.css` |

---

## Note Tecniche

### Import degli Atoms
```tsx
import styles from './Atoms.module.css';
// Tutti i componenti usano CSS Modules con nomi semantici
```

### Naming Convention
I nomi delle classi CSS seguono la convenzione Figma → Locofy camelCase:
- `styles.size1Stateactive` → button size 1, stato active
- `styles.typeaudioOnStateactive` → icona audio-on, stato active
- `styles.sizebigColorpurple` → timer grande, colore viola

### Compatibilità con il Progetto
I file DS sono in **pura sintassi React** senza dipendenze esterne (solo `react` e `FunctionComponent`). Non richiedono TailwindCSS. Sono pronti per essere integrati nel progetto esistente sostituendo i componenti TailwindCSS attuali.
