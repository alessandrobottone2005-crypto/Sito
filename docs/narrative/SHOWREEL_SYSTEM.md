# 🎬 SHOWREEL_SYSTEM.md

L'obiettivo finale del progetto Batman Immersive Experience è vendere un prodotto premium: la statua in resina da collezione. Se tutta la prima fase (gioco, esplorazione 360, timer) genera coinvolgimento emotivo ed esalta l'ip, il **Showreel System** (fase finale post-vittoria) rappresenta l'handoff verso il funnel e-commerce puro. 

## 1. Architettura della Fase di Reveal
Il reveal è una netta rottura rispetto alle interfacce "hacker/UI" precedenti. 

**Flusso:**
1. Il video cinematico "Good Ending" termina con un fade a nero.
2. Al posto della UI "sporca" appare un'interfaccia pulita, minimale, da vetrina di lusso (ispirazione: Apple Product Pages, Tesla).
3. Dominano il layout: testo ad alto contrasto, foto/render della statua giganti e illuminazione (virtuale) estremamente drammatica.

## 2. Scroll Storytelling (Apple-Style)
In questa fase la meccanica 360/gioco cessa. L'utente naviga la pagina tramite lo scroll verticale, che guida una narrazione guidata.
- **Scroll-jacking controllato**: Utilizzo di librerie come GSAP ScrollTrigger o Framer Motion `useScroll` per tracciare la percentuale di viewport in scorrimento.
- **Animazioni basate su scorrimento**:
  - Elementi di testo (Specifiche tecniche, Materiali, Dimensioni) fanno fade-in scorrendo.
  - La statua potrebbe rivelare strati ("Mesh / Clay / Final Color") al variare dello scroll.
  - Video in background collegati alla posizione dello scroll.

## 3. Cinematic Camera Logic & Prodotto
La presentazione del prodotto non si avvale di semplici JPG statici.
- Utilizzo di sequenze video alpha-channel o render continui che simulano una camera in rotazione attorno alla statua per evidenziarne i dettagli macro (mantello texturizzato, dettagli del cappuccio, basamento in rovina).
- Effetto Parallax massivo per dare profondità alla struttura della pagina rispetto alle sezioni fotografiche.

## 4. Struttura Call-To-Action (CTA)
Il Conversion Flow si regge sulla percezione di esclusività (Fomo - Fear Of Missing Out).
- **Sticky Pre-order Bar**: Appare dal basso (slide-up) dopo il primo fold e resta attaccata sul fondo dello schermo per l'intero scroll.
- **Pulsante Primario**: Colore distintivo (Yellow Bat-Signal o Gold premium), copy orientato all'azione "SECURE PRE-ORDER" o "ACCESS EXCLUSIVE SALE". 
- L'integrazione di countdown reali (e.g. "Pre-order chiude tra 48 ore") o unità limitate ("Solo 500 pezzi nel mondo") massimizza la conversione, ricollegandosi al tema del timer affrontato durante il gioco.

## 5. Acquisizione Finale (Checkout Flow)
Cliccata la CTA, l'utente passa all'ultimo modulo: il Checkout.
- **Modale In-context o Redirect**: Preferenza per una slide-over (drawer) integrato senza ricaricare la pagina per mantenere l'estetica, finché l'utente non raggiunge Stripe o il gateway di pagamento effettivo.
- Struttura step-by-step pulita, con persistenza carrello, calcolo tasse in tempo reale e supporto a wallet istantanei (Apple Pay, Google Pay).
