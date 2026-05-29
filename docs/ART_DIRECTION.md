# 🎨 Art Direction & Visual Aesthetics

Questo documento funge da Bibbia Visiva per l'allineamento tra i team di 3D, Design e Sviluppo. L'obiettivo è ricreare l'oppressione psicologica e la brutalità tecno-grunge dell'universo di Batman, uniti a un reveal di prodotto elegante.

## 📌 Moodboard & Core Pillars

1. **Tech-Noir:** Tecnologia analogica e digitale fusa insieme. Tubi a raggi catodici, fosfori verdi/blu, rumore video, cavi esposti.
2. **Claustrofobia:** L'ambiente 3D deve sembrare immenso ma al contempo oppressivo (soffitti bassi, ombre profonde in cui "qualcosa" potrebbe nascondersi).
3. **Speranza Oscura:** Il contrasto tra l'oscurità e i punti di luce blu (Batcomputer) rappresenta l'intelletto contro il caos (Joker - Verde/Viola acido).

## 🦇 Arkham & The Batman (2022) Inspirations

* L'HUD del Batcomputer non è olografico e pulito come quello di Iron Man. È funzionale, squadrato, monocromatico, simile alle interfacce UNIX o MS-DOS pesantemente modificate, con grafici a linee vettoriali.
* **Texture:** Metallo graffiato, schermi con impronte digitali, polvere fluttuante (particelle).

## 💡 Lighting Direction

* **Ambiente (Investigation):** Low-key lighting. Buio dominante. La luce principale proviene dagli schermi dei monitor. Uso di luci intermittenti (flicker) per suggerire un malfunzionamento del sistema. Nessuna global illumination morbida.
* **Reveal (Showreel):** Studio Lighting. Contrasto elevatissimo. Key light fredda (Key) e fill light calda, più un forte Rim Light per far staccare il mantello scuro dal background nero (Chiaroscuro).

## 👁️ Noir Aesthetic & Post-Processing

Il render puro WebGL spesso appare troppo "plasticoso". Per ottenere il look AAA usiamo una pipeline di Post-Processing intensiva:
* **Film Grain:** Aggiunto per eliminare il banding sui gradienti neri e dare matericità cinematografica.
* **Vignetting:** Forte oscuramento ai bordi dello schermo (tunnel vision), costringe lo sguardo al centro.
* **Chromatic Aberration (RGB Shift):** Dinamico, aumenta con la vicinanza alla fine del timer. Sfarfalla sui bordi.
* **Bloom:** Usato con estrema parsimonia. Solo i LED verdi di sistema (e i messaggi del Joker) "sbavano" luce.
