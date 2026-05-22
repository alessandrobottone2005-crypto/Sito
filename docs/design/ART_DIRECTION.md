# 🖼 ART_DIRECTION.md

La direzione artistica di The Dark Knight Immersive Experience è focalizzata sulla riproduzione di un'estetica cruda, high-tech e cinematografica, posizionando l'utente all'interno dell'immaginario di Gotham City. Questo documento traccia i fondamenti visivi del progetto.

## 1. Moodboard & Visual References
Il tono visivo prende in prestito da tre grandi pilastri:
- **The Batman (Film, 2022)**: Per l'uso predominante di rossi desaturati, neri inchiostro, pioggia costante e illuminazione industriale sporca.
- **Batman: Arkham Series (Videogiochi)**: Per l'approccio tattico all'interfaccia HUD e il senso di indagine deduttiva (Detective Mode).
- **Interfacce FUI/HUD Hollywoodiane (Oblivion, Iron Man, Matrix)**: Per le animazioni di decodifica, testo monospazio, griglie vettoriali e look "terminale avanzato".

## 2. Lighting Direction (Illuminazione 3D e 360°)
L'illuminazione non è uniforme. È drammatica ed espressionista (Noir Estetica).
- **High Contrast**: Nelle scene 360°, grandi porzioni della stanza devono cadere nel buio più totale (valori di nero RGB 5,5,5), tagliate da forti luci direzionali (Spotlight su teche, Neon intermittenti).
- **Emergency Red**: Durante la fase a tempo della missione, le luci ambientali assumono toni rosso allarme, enfatizzando il senso di minaccia imminente.
- **Showcase Lighting**: Nella fase di Reveal (Showreel finale), l'illuminazione passa a un setup da studio fotografico premium per esaltare i volumi, le texture e la riflessione della resina della statua.

## 3. FUI (Fictional User Interface) Guidelines
L'UI deve risultare come uno strato ottico sovrapposto alla visione dell'utente (come dentro il visore del casco di Batman).
- **Grid Systems**: Utilizzo di reticoli leggeri sullo sfondo o ai bordi (`stroke: rgba(255,255,255,0.05)`).
- **Aberrazione Cromatica (CRT Effect)**: I bordi esterni dello schermo presentano un leggero disallineamento nei canali RGB per simulare una lente digitale.
- **Nessun elemento "Soft"**: Bottoni rigorosamente squadrati, spigoli vivi, niente border-radius eccessivi, niente ombre "morbide" web-standard.

## 4. Cinematic Inspirations e Scelta Formati
Il taglio delle inquadrature nei video di transizione rispetta i canoni del cinema thriller d'azione:
- Macchina a spalla (Handheld camera) durante i video d'ansia.
- Panning lenti e maestosi per svelare l'Armeria e la Batmobile.
- Formato **Letterbox (2.35:1 Anamorfico)** opzionale o mascherato, in alternativa a un full-bleed immersivo.

## 5. Tone of Voice
L'intera direzione artistica non è mai "giocosa". Il progetto deve sembrare un'operazione di decodifica di un database del Dipartimento di Polizia di Gotham infiltrato dall'Enigmista. 
Tutti i testi di errore UI non comunicano "Errore nel caricamento", ma "CORRUZIONE DATI. BYPASS SISTEMA RICHIESTO". L'interfaccia deve comunicare con la voce della macchina o la voce antagonista.
