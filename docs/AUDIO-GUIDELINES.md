# Audio System 🎵

L'audio è centrale per l'esperienza immersiva.
Gestito tramite `useAudioSystem.ts` e `JokerAudioManager.tsx`.

## Regole d'oro
- La musica principale non si ferma mai bruscamente, ma va in **fade-out** (es. durante i video di transizione).
- Effetti sonori UI (hover, click, hack) sono immediati e secchi.
- La traccia del Joker (`JokerAudioManager`) è indipendente e il suo volume / distorsione aumenta man mano che il tempo stringe.
