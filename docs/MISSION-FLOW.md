# Mission Flow ⏱️

## Gestione del Timer e Fallimento
- Il timer parte da **120 secondi** o in base alla difficoltà scelta.
- Trovare i primi 2 indizi velocemente garantisce un **Bonus di 60 secondi** (Easter egg motivazionale).
- Se il timer scade, subentra `ExplosionOverlay.tsx` (Joker vince) e si torna all'intro.

## Gestione Indizi (Clues)
- 5 indizi totali sparsi nelle 3 stanze.
- L'HUD (`ProgressTracker.tsx`) aggiorna visivamente i blocchi da vuoti a pieni, mantenendo il tema Wayne Tech.
