# 📦 ASSET_PIPELINE.md

Questo documento illustra il ciclo di vita degli asset grafici e video, dalla loro generazione tramite software DCC (Digital Content Creation come Blender/Unreal Engine) fino alla loro integrazione nel frontend React. Mantenere l'ottimizzazione è cruciale per la sostenibilità del progetto.

## 1. 360° Image Assets (Equirectangular)
Le stanze esplorabili sono background a 360 gradi statici.
- **Esportazione da Blender/UE5**: Rendering di camere panoramiche in formato Equirettangolare (Ratio 2:1).
- **Risoluzione di Base**: `8192 x 4096px` (Sorgente Master, MAI usare in prod).
- **Ottimizzazione Pipeline**:
  - Desktop Texture: Downscale a `4096 x 2048px`. Compressione **WebP** lossy con quality al 85%. Size target: < 1.5 MB.
  - Mobile Texture: Downscale a `2048 x 1024px`. Size target: < 500 KB.
- **Naming Convention**: `scene_name_360_[resolution].webp` (es. `armory_360_4k.webp`).

## 2. MP4 Transitions (Video Cinematici)
I video di transizione innescano passaggi fluidi da un'inquadratura all'altra.
- **Formato**: `H.264 MP4` (Compatibilità universale con tag `<video>`).
- **Risoluzione**: `1920x1080px` (o inferiore su mobile, utilizzando la `src` dinamica a seconda della viewport).
- **Bitrate**: VBR (Variable Bit Rate), massimo 4-5 Mbps. Nessuna traccia video deve superare i 10 MB per 15 secondi.
- **Audio**: Spesso silenziato e renderizzato a parte con Howler.js, oppure muxed a 128kbps AAC.
- **Naming Convention**: `trans_armory_to_batcave.mp4`

## 3. UI Assets (FUI Elements)
L'interfaccia utente è interamente costruita a codice, minimizzando il peso.
- Reticoli, Mirini, Icone Bottoni: Esportati esclusivamente come **SVG inline** dal team Design (Figma).
- Questo permette il controllo dinamico tramite CSS di colori (fill, stroke) per gestire stati di hover/glitch e assicura scaling vettoriale senza perdita su schermi Retina.
- Nessuna PNG per l'HUD è permessa, fatta eccezione per eventuali ritratti (es. logo distolto Enigmista), rigorosamente ottimizzati in WebP con canale Alpha.

## 4. Texture Management nel Canvas
- Poiché l'utente visualizza un canvas sferico, la memoria GPU si riempie in fretta.
- La pipeline logica prevede l'implementazione del concetto "One scene at a time".
- Il frontend ha l'obbligo di liberare tramite Garbage Collection il file .webp precedente non appena si atterra sulla stanza successiva. 

## 5. Struttura Cartelle per Produzione (Public/Assets)
Tutti gli asset "heavy" sono mantenuti al di fuori del build bundler (Vite) per evitare di appesantire la compilazione e sfruttare la cache aggressiva del browser o CDN esterne:
```
public/
  assets/
    360/
      armory_360_4k.webp
      armory_360_mobile.webp
    video/
      intro_cinematic.mp4
      outro_reveal.mp4
    audio/
      bgm_drone.mp3
      sfx_sprite.mp3
    models/ (Solo se usati veri .gltf/.glb)
```
