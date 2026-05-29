# State Management 🧠

Il progetto predilige uno stato centralizzato per le fasi di alto livello e locale per i dettagli UI.

## Fasi Globali (`App.tsx`)
`phase` controlla l'orchestratore principale (intro -> indagini -> vittoria -> checkout).
`missionStatus` controlla lo stato logico della sfida (`idle`, `active`, `failed`, `succeeded`).
`panoramaScene` controlla la texture del canvas webGL senza smontare e rimontare Three.js, fondamentale per le performance.

## Hooks Dedicati
Logiche complesse estratte in `/hooks/`:
- `useMissionTimer`: Gestione puramente logica del tempo e dei calcoli dei bonus.
- `useAudioSystem`: Mantiene la referenza HTMLAudioElement e i volumi.
- `useMobileDetection`: Gestione del blocco responsività per schermi non supportati, garantendo UX su desktop.
