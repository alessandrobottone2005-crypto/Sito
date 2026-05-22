# ♟ GAME_LOGIC.md

Questo documento delinea il core logico dell'esperienza ludica, ovvero i meccanismi che processano l'input utente e definiscono win/fail conditions. Non ci troviamo davanti a un gioco action, ma a una complessa "Escape Room" virtuale.

## 1. Struttura del Gioco (State Machine)

L'intero gioco è guidato da un GameManager Context che opera come macchina a stati finiti (FSM).

**Stati Possibili:**
- `IDLE`: Prima dell'inizio.
- `PLAYING`: Esplorazione stanza e conto alla rovescia.
- `SOLVING`: Modale aperto, telecamera e timer in pausa per consentire concentrazione (opzionale, a seconda della curva di difficoltà desiderata).
- `TRANSITION`: Video di mezzo, nessun input utente permesso.
- `VICTORY`: Condizioni di vittoria raggiunte.
- `DEFEAT`: Timer azzerato.

## 2. Sistema Enigmi (Riddle System)
Ogni scena possiede una configurazione JSON statica (o fetcheata via API) contenente gli array di Hotspot.

```json
{
  "scene": "Armeria",
  "hotspots": [
    {
      "id": "h_1",
      "position": { "yaw": 45, "pitch": -10 },
      "riddle": {
        "question": "Volteggio la notte ma non ho ali. Mi nascondo in un lampo. Chi sono?",
        "options": ["Pipistrello", "Il Segnale", "Il Mantello", "Batarang"],
        "correctIndex": 3
      }
    }
  ]
}
```

**Logica di Validazione:**
1. L'utente clicca l'hotspot.
2. Viene visualizzato l'enigma.
3. Al submit (sezione scelta multipla o testuale regex matcher):
   - **Esito Positivo**: L'id dell'hotspot viene pushato nell'array `solvedRiddles`. L'hotspot viene contrassegnato con un check verde o sparisce dalla mappa.
   - **Esito Negativo**: Trigger della funzione `penalizeTime(10)` e feedback visivo/sonoro di errore.

## 3. Progress Tracking & Scene Advancement
- L'Avanzamento di livello avviene automaticamente non appena l'array `solvedRiddles` corrente contiene tutti gli id della scena attiva.
- Esempio logico: `if (scene.hotspots.every(h => solvedRiddles.includes(h.id))) { proceedToNextLevel(); }`
- A questo punto l'input viene bloccato (`pointer-events: none` globale) per prevenire click accidentali e viene lanciato il video di transizione.

## 4. Timer Globale (The Core Loop)
Il tempo è la principale variabile del gioco.
- Gestito da un loop basato su `Date.now()` (e non `setInterval` per evitare delay accumulati in caso di cali di framerate) per mantenere precisione al millisecondo.
- Calcolo: `timeLeft = initialDuration - (Date.now() - startTime) - penaltiesAccumulated`.
- Se `timeLeft <= 0`, il GameManager setta lo stato su `DEFEAT`, interrompe eventuali layer attivi e forza il redirect alla schermata "Sistema Compromesso".

## 5. Randomizzazione (Anticheat leggero)
Per garantire che l'esperienza mantenga validità in caso di replay immediato da parte dell'utente:
- Gli hotspot potrebbero alterare la loro posizione (spawn da un set di location predefinite).
- L'ordine delle risposte multiple agli indovinelli è sempre randomizzato via algoritmo di Fisher-Yates per evitare cheat da "muscle memory" o risposte postate online (es. "premi sempre A-C-B").
