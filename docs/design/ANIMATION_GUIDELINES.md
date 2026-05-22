# 🎥 ANIMATION_GUIDELINES.md

Le animazioni all'interno di The Dark Knight Immersive Experience non servono solo a rendere gradevole l'interfaccia, ma sono strumenti narrativi e indicatori di feedback fondamentali per l'estetica "FUI" (Fictional User Interface).

## 1. Motion Language Philosophy
L'animazione deve comunicare l'elaborazione hardware di un supercomputer (il Batcomputer) sotto attacco. 
Il motion language è "meccanico", veloce, scattante e occasionalmente disturbato (glitched). Non c'è spazio per animazioni web tradizionali morbide, lente o gommose.

## 2. Easing & Transition Timing
La scelta delle curve di animazione (Easing Functions) è drastica:
- **UI Element Entrance**: `cubic-bezier(0.0, 0.9, 0.1, 1.0)` (Snap molto rapido all'inizio, decelerazione dura alla fine).
- **Durata Standard UI**: `150ms - 250ms`. Il computer tattico deve rispondere istantaneamente. L'utente non aspetta che i menu finiscano l'animazione.
- **Cinematic Fade**: Transizioni scena/video: `800ms - 1500ms`, `ease-in-out` lineare per dare un taglio drammatico da cinema.

## 3. UI Animation Behaviors
- **Hover Behaviors**: 
  - Switch istantaneo del colore e box-shadow dura (Neon Glow).
  - Un bottone hoverato non esegue uno "scale-up" del 110% (come nel web moderno), ma subisce uno snap in cui il contorno si illumina e genera un evento sonoro ("Tick").
- **Text Appearance (Typewriter/Decoding)**:
  - Il testo critico (es. indovinelli, avvisi) non appare in blocco ma viene simulato carattere per carattere, oppure utilizza uno "Scramble Effect" (ciclo di simboli randomizzati prima di rivelare la lettera corretta).

## 4. Camera Movement & Cinematic Pacing
La rotazione manuale nei canvas 360° è guidata dal mouse/touch ma filtrata matematicamente per dare peso.
- **Damping (Frizione)**: Lo swiping arresta la camera con una decelerazione graduale (Inerzia), non un hard-stop, simulando la rotazione della testa in un'armatura pesante.
- **Automated Panning**: Quando una scena si avvia per la prima volta, la camera potrebbe eseguire un lieve "Pan" automatico programmato verso l'hotspot d'interesse prima di restituire il controllo all'utente.

## 5. Transitions & Distortions (Glitch)
Le transizioni tra scene o la penalità di tempo causano un disturbo visivo globale per simulare l'attacco dell'Enigmista.
- **Video Transitions**: Un clip MP4 che interseca un effetto di statico analogico (noise overlay) fa da ponte tra l'ambiente interattivo e il video full-screen.
- **CSS Glitch**: Utilizzo intensivo di `clip-path` per frammentare orizzontalmente gli elementi HUD per brevissime frazioni di secondo (50-100ms), disallineando le repliche `::before` e `::after` con i canali RGB Cyan/Rosso attivi.
