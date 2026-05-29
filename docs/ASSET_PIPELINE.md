# 📦 Asset & 3D Pipeline

Le performance dell'esperienza WebGL dipendono interamente dall'ottimizzazione chirurgica degli asset alla fonte. Questo documento descrive la pipeline da Blender al Web.

## 🏗 Blender Export Workflow

Non esportiamo l'intera caverna come un singolo mostruoso file GLTF.
La scena è divisa per "Chunks" basati sul livello di dettaglio visibile:
1. **Base Mesh (`batcave_base.glb`):** Muri, pavimento, layout. Geometria essenziale, quasi interamente senza texture se non per la normal map.
2. **Hero Objects (`hero_props.glb`):** Schermi, cavi in primo piano, macchinari. Questi ricevono materiali dedicati e texture in risoluzione più alta (1K/2K).
3. **Statua (`batman_statue.glb`):** Asset ultra-dettagliato caricato *solo* per la fase di Showreel.

**Esportazione:**
* Formato: `.glb` (GLTF Binary).
* Compressione Mesh: Draco Compression attiva (riduce il peso della geometria dell'80%).
* Dati scartati in export: Cameras, Lights, Animation (se statici).

## 🎨 Texture Management & Baking

Tre.js fatica con le luci dinamiche su mobile.
* **Light Baking:** Tutta l'illuminazione complessa, le ombre e i rimbalzi di luce (Global Illumination) vengono "Bake-ati" in una texture unica all'interno di Blender (Lightmap).
* Nel browser, viene usato un materiale basico che moltiplica la Diffuse texture per la Lightmap, risultando in illuminazione iper-realistica ma a costo computazionale zero.
* **Format:** Le texture vengono passate in uno script CLI che genera i formati KTX2 (Basis Universal), l'unico formato che viene decompresso direttamente nella VRAM della GPU, annullando i picchi di CPU/Memoria durante il caricamento.

## 🎞 360 Assets & Environment Maps

* Lo sfondo che circonda la geometria 3D è gestito tramite una mappa equirettangolare HDRI.
* Per ridurre il peso (le HDRI pesano molto), usiamo un jpeg a bassa risoluzione pesantemente blurrato, coperto dal film grain aggiunto via post-processing per camuffare i pixel.

## 📼 Video & Transition Assets

* **Video Transizioni:** Renderizzati in mp4 (H.264). L'audio è separato e affidato all'Howler Audio Bus per garantire la perfetta sincronizzazione e mixaggio.
* **Alpha Channel:** Web video con canale alfa (trasparenza) non sono affidabili cross-browser. Se serve trasparenza, si usa un video renderizzato su fondo verde (Chroma key via custom shader) o in additive blending (fondo nero puro e blend mode `screen`).

## 🗂 Naming Conventions

* Modelli 3D: `snake_case_lowpoly.glb`
* Texture: `basecolor_1k_dxt.ktx2`
* Audio: `category_event_variation.mp3` (es. `joker_taunt_timerLow_01.mp3`)
