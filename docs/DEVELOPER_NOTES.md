# 🛠 Developer Notes & Runbook

Note operative, hack, known issues e shortcuts per il team di sviluppo.
**NB:** Questo documento NON deve finire nella build di produzione, serve solo come riferimento interno.

## 🐞 Known Issues & Quirks

* **iOS Safari Audio Context:** Su Safari l'AudioContext non parte finché non c'è un'interazione utente esplicita. Per questo la landing *deve* avere un tasto "ENTER SYSTEM" vistoso. Non rimuoverlo.
* **Texture Banding in WebGL:** Sui neri assoluti si può notare del color banding (righe circolari). Soluzione in atto: Pass di Dithering / Noise shader attivo costantemente sopra il canvas. Se disattivato per testing, il banding tornerà visibile.
* **Gestione RAM su Android vecchi:** In fase di transizione tra 'Gioco' e 'Showreel', se il Garbage Collector non scatta in tempo, la tab potrebbe crashare. Rispettare rigorosamente il ciclo di `.dispose()` per geometria e materiali nello store.

## 🚀 Optimization Notes

* `useFrame` in R3F è potentissimo ma pericoloso. **NON** istanziare nuovi vettori (`new THREE.Vector3()`) dentro il loop di render, usa vettori globali in memoria per evitare memory allocation selvaggia.
* Quando l'utente entra nella UI di decodifica (Riddle), il loop 3D va bypassato temporaneamente settando il frame-loop a `demand` finché non esce, salvando tonnellate di batteria su mobile.

## 🔮 Future Improvements (Post-V1)

* Implementare un sistema di **Dynamic Resolution Scaling**: se il frame rate scende sotto i 30 FPS, dimezzare il `pixelRatio` in runtime.
* Gestione multi-lingua dell'audio (richiede json per caricamento asincrono file audio del Joker tradotti).
* Supporto giroscopio per iOS (attualmente disattivato a causa delle policy di sicurezza Apple che richiedono permessi esplicti via modale).

## 🎛 Debug Systems & Cheat Codes

Per non dover testare ogni volta i 60 secondi interi o risolvere gli indizi, il sistema ascolta l'oggetto globale `window.batDebug` se ci si trova in `localhost` (Vite dev mode).

Apri la console e digita:
* `batDebug.win()` -> Triggera la vittoria immediatamente.
* `batDebug.fail()` -> Scade il timer immediatamente.
* `batDebug.showHotspots()` -> Renderizza sfere rosse sopra le coordinate degli hotspot invisibili.

## 🧪 Testing Shortcuts (Tastiera)

In ambiente di dev:
* `Shift + T` -> Sottrae 10 secondi al timer.
* `Shift + R` -> Resetta il timer e lo stato della partita.
* `M` -> Master Mute (Toggle globale per i developer stanchi di sentire il Joker durante le ore di codifica).
