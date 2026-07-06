# DESIGN_AUDIT.md

## Riepilogo
Questo report evidenzia le discrepanze tra il codice attuale e il design system Figma di riferimento.
Si consiglia di sostituire i valori hardcoded con le variabili CSS definite in `index.css`.

## 1. Valori Hardcoded (Colori, Font, Ombre) che dovrebbero usare una variabile
Questi elementi usano colori o stili hardcoded (hex, rgba) e devono essere mappati alle variabili del design system.

| File | Riga | Tipo | Valore Trovato | Suggerimento |
|------|------|------|----------------|--------------|
| `App.tsx` | 332 | Tailwind Arbitrary Color | `bg-[#050505]` | Use Tailwind configured variables (e.g. text-yellow, bg-black) |
| `components/cinematic/BatmanCamera.tsx` | 177 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/cinematic/BatmanCamera.tsx` | 240 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/cinematic/BatmanCamera.tsx` | 271 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/cinematic/BatmanCamera.tsx` | 271 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/cinematic/BatmanCamera.tsx` | 272 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/cinematic/BatmanCamera.tsx` | 272 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/cinematic/BatmanCamera.tsx` | 273 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/cinematic/BatmanCamera.tsx` | 273 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/cinematic/BatmanCamera.tsx` | 274 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/cinematic/BatmanCamera.tsx` | 274 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/cinematic/BatmanCamera.tsx` | 331 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/cinematic/BatmanCamera.tsx` | 501 | Hardcoded Color | `#000` | var(--black) |
| `components/cinematic/CinematicVideoPlayer.tsx` | 127 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/cinematic/SharedPanoramaCanvas.tsx` | 132 | Hardcoded Color | `#39FF14` | var(--green-light) |
| `components/cinematic/SharedPanoramaCanvas.tsx` | 137 | Hardcoded Color | `#39FF14` | var(--green-light) |
| `components/cinematic/SharedPanoramaCanvas.tsx` | 184 | Hardcoded Color | `#39FF14` | var(--green-light) |
| `components/cinematic/SharedPanoramaCanvas.tsx` | 186 | Hardcoded Color | `#39FF14` | var(--green-light) |
| `components/cinematic/SharedPanoramaCanvas.tsx` | 260 | Hardcoded Color | `#39FF14` | var(--green-light) |
| `components/cinematic/SharedPanoramaCanvas.tsx` | 260 | Hardcoded Color | `#39FF14` | var(--green-light) |
| `components/cinematic/SharedPanoramaCanvas.tsx` | 260 | Hardcoded Color | `#39FF14` | var(--green-light) |
| `components/cinematic/SharedPanoramaCanvas.tsx` | 261 | Hardcoded Color | `#39FF14` | var(--green-light) |
| `components/cinematic/SharedPanoramaCanvas.tsx` | 261 | Hardcoded Color | `#39FF14` | var(--green-light) |
| `components/hud/MissionTimer.tsx` | 25 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/hud/MissionTimer.tsx` | 30 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/hud/MissionTimer.tsx` | 31 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/layout/Footer.tsx` | 5 | Tailwind Arbitrary Color | `bg-[#080808]` | Use Tailwind configured variables (e.g. text-yellow, bg-black) |
| `components/layout/Footer.tsx` | 7 | Hardcoded Color | `#fff` | var(--white) |
| `components/layout/Navbar.tsx` | 26 | Hardcoded Color | `#000` | var(--black) |
| `components/layout/Navbar.tsx` | 26 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/layout/Navbar.tsx` | 26 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/layout/Navbar.tsx` | 27 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/layout/Navbar.tsx` | 27 | Hardcoded Color | `#000` | var(--black) |
| `components/layout/Navbar.tsx` | 28 | Hardcoded Color | `#535353` | var(--gray-medium) |
| `components/layout/Navbar.tsx` | 28 | Hardcoded Color | `#2A2A2A` | var(--gray-dark) |
| `components/layout/Navbar.tsx` | 114 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `components/layout/Navbar.tsx` | 139 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `components/transitions/TransitionOverlay.tsx` | 98 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/BatcomputerBootOverlay.tsx` | 77 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `components/ui/BatcomputerBootOverlay.tsx` | 91 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `components/ui/BatcomputerBootOverlay.tsx` | 95 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/BatcomputerBootOverlay.tsx` | 131 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `components/ui/BatcomputerBootOverlay.tsx` | 133 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/BatcomputerBootOverlay.tsx` | 152 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/BatcomputerBootOverlay.tsx` | 164 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/BatcomputerBootOverlay.tsx` | 182 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/BatcomputerBootOverlay.tsx` | 194 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/BatmanButton.tsx` | 42 | Hardcoded Color | `#6600C5` | var(--purple-light) |
| `components/ui/BatmanButton.tsx` | 42 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/BatmanButton.tsx` | 46 | Hardcoded Color | `#535353` | var(--gray-medium) |
| `components/ui/BatmanButton.tsx` | 47 | Hardcoded Color | `#C4C4C4` | var(--gray-light) |
| `components/ui/BatmanButton.tsx` | 48 | Hardcoded Color | `#2A2A2A` | var(--gray-dark) |
| `components/ui/BatmanButton.tsx` | 104 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `components/ui/Logos.tsx` | 13 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/Logos.tsx` | 22 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `components/ui/Logos.tsx` | 26 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/Logos.tsx` | 27 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/Logos.tsx` | 39 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/Logos.tsx` | 39 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `components/ui/Logos.tsx` | 40 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/Logos.tsx` | 40 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `components/ui/Logos.tsx` | 51 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/Logos.tsx` | 60 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `components/ui/Logos.tsx` | 64 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/Logos.tsx` | 65 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/Logos.tsx` | 78 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/Logos.tsx` | 78 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `components/ui/Logos.tsx` | 101 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/Logos.tsx` | 103 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `components/ui/Logos.tsx` | 118 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/Logos.tsx` | 118 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `components/ui/MediaControls.tsx` | 68 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/MediaControls.tsx` | 70 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/MediaControls.tsx` | 106 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/MediaControls.tsx` | 108 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `components/ui/MediaControls.tsx` | 141 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `components/ui/MediaControls.tsx` | 154 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `components/ui/MediaControls.tsx` | 179 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/MediaControls.tsx` | 187 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/MediaControls.tsx` | 188 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/MediaControls.tsx` | 189 | Hardcoded Color | `#FFD700` | var(--yellow) |
| `components/ui/TechBackground.tsx` | 187 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `sections/IntroScreen.tsx` | 192 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `sections/IntroScreen.tsx` | 256 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `sections/IntroScreen.tsx` | 289 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `sections/IntroScreen.tsx` | 334 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `sections/IntroScreen.tsx` | 350 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `sections/IntroScreen.tsx` | 354 | Hardcoded Color | `#ffffff` | var(--white) |
| `sections/IntroScreen.tsx` | 390 | Hardcoded Font | `Space Grotesk` | var(--font-SpaceGrotesk) |
| `sections/ThankYouPage.tsx` | 30 | Tailwind Arbitrary Color | `bg-[#020202]` | Use Tailwind configured variables (e.g. text-yellow, bg-black) |


## 2. Inline Styles e CSS non standard
Evitare gli stili inline e utilizzare le classi Tailwind mappate sul design system.

| File | Riga | Contesto |
|------|------|----------|
| `components/cinematic/BatmanCamera.tsx` | 102 | `<div style={{ ...baseStyle, zIndex: backZIndex }}>...` |
| `components/cinematic/BatmanCamera.tsx` | 105 | `style={{...` |
| `components/cinematic/BatmanCamera.tsx` | 117 | `<div style={{ ...baseStyle, zIndex: frontZIndex }}...` |
| `components/cinematic/BatmanCamera.tsx` | 124 | `style={{...` |
| `components/cinematic/BatmanCamera.tsx` | 135 | `style={{...` |
| `components/cinematic/BatmanCamera.tsx` | 163 | `<div style={{...` |
| `components/cinematic/BatmanCamera.tsx` | 174 | `style={{...` |
| `components/cinematic/BatmanCamera.tsx` | 187 | `<div style={{...` |
| `components/cinematic/BatmanCamera.tsx` | 202 | `style={{...` |
| `components/cinematic/BatmanCamera.tsx` | 223 | `<div className="absolute inset-0 flex items-center...` |
| `components/cinematic/BatmanCamera.tsx` | 226 | `<div className="absolute inset-0 flex items-center...` |
| `components/cinematic/BatmanCamera.tsx` | 235 | `style={{...` |
| `components/cinematic/BatmanCamera.tsx` | 261 | `<span style={{ position: "relative", zIndex: 1 }}>...` |
| `components/cinematic/BatmanCamera.tsx` | 265 | `style={{ position: "absolute", top: 0, left: "-100...` |
| `components/cinematic/BatmanCamera.tsx` | 271 | `<motion.div animate={{ opacity: [0.3, 1, 0.3] }} t...` |
| `components/cinematic/BatmanCamera.tsx` | 272 | `<motion.div animate={{ opacity: [0.3, 1, 0.3] }} t...` |
| `components/cinematic/BatmanCamera.tsx` | 273 | `<motion.div animate={{ opacity: [0.3, 1, 0.3] }} t...` |
| `components/cinematic/BatmanCamera.tsx` | 274 | `<motion.div animate={{ opacity: [0.3, 1, 0.3] }} t...` |
| `components/cinematic/BatmanCamera.tsx` | 325 | `<div style={{ maxWidth: "44vw" }}>...` |
| `components/cinematic/BatmanCamera.tsx` | 326 | `<div style={{ fontFamily: "monospace", fontSize: "...` |
| `components/cinematic/BatmanCamera.tsx` | 331 | `<div key={i} style={{ fontSize: "clamp(42px, 7.5vw...` |
| `components/cinematic/BatmanCamera.tsx` | 336 | `<div style={{ height: 1, width: "55%", marginTop: ...` |
| `components/cinematic/BatmanCamera.tsx` | 337 | `<p style={{ fontSize: "clamp(10px, 1.1vw, 15px)", ...` |
| `components/cinematic/BatmanCamera.tsx` | 353 | `<div style={{ position: "absolute", inset: 0, zInd...` |
| `components/cinematic/BatmanCamera.tsx` | 354 | `<div style={{ position: "absolute", top: 24, left:...` |
| `components/cinematic/BatmanCamera.tsx` | 355 | `<div style={{ fontFamily: "monospace", fontSize: 8...` |
| `components/cinematic/BatmanCamera.tsx` | 356 | `<div style={{ fontFamily: "monospace", fontSize: 8...` |
| `components/cinematic/BatmanCamera.tsx` | 358 | `<div style={{ position: "absolute", top: 24, right...` |
| `components/cinematic/BatmanCamera.tsx` | 359 | `<div style={{ fontFamily: "monospace", fontSize: 8...` |
| `components/cinematic/BatmanCamera.tsx` | 360 | `<div style={{ fontFamily: "monospace", fontSize: 8...` |
| `components/cinematic/BatmanCamera.tsx` | 363 | `<div style={{ position: "absolute", top: "50%", le...` |
| `components/cinematic/BatmanCamera.tsx` | 364 | `<div style={{ width: 1, height: 36, background: "r...` |
| `components/cinematic/BatmanCamera.tsx` | 365 | `<div style={{ width: 36, height: 1, background: "r...` |
| `components/cinematic/BatmanCamera.tsx` | 475 | `<div ref={containerRef} style={{ position: "relati...` |
| `components/cinematic/BatmanCamera.tsx` | 476 | `<div style={{ position: "fixed", inset: 0, width: ...` |
| `components/cinematic/BatmanCamera.tsx` | 482 | `<canvas ref={canvasRef} style={{ position: "absolu...` |
| `components/cinematic/BatmanCamera.tsx` | 501 | `<motion.div initial={{ opacity: 1 }} exit={{ opaci...` |
| `components/cinematic/BatmanCamera.tsx` | 502 | `<motion.div animate={{ opacity: [0.2, 0.8, 0.2] }}...` |
| `components/cinematic/BatmanCamera.tsx` | 503 | `<div style={{ fontFamily: "monospace", fontSize: 1...` |
| `components/cinematic/BatmanCamera.tsx` | 504 | `<div style={{ width: 200, height: 2, background: "...` |
| `components/cinematic/BatmanCamera.tsx` | 505 | `<motion.div style={{ height: "100%", background: "...` |
| `components/cinematic/BatmanCamera.tsx` | 507 | `<div style={{ fontFamily: "monospace", fontSize: 9...` |
| `components/cinematic/CinematicVideoPlayer.tsx` | 130 | `style={{ width: "40%" }}...` |
| `components/cinematic/SharedPanoramaCanvas.tsx` | 151 | `style={{...` |
| `components/cinematic/SharedPanoramaCanvas.tsx` | 225 | `style={{...` |
| `components/cinematic/SharedPanoramaCanvas.tsx` | 242 | `style={{...` |
| `components/cinematic/SharedPanoramaCanvas.tsx` | 268 | `style={{ width: "100%", height: "100%", borderRadi...` |
| `components/cinematic/SharedPanoramaCanvas.tsx` | 275 | `style={{ width: "100%", height: "100%", objectFit:...` |
| `components/cinematic/SharedPanoramaCanvas.tsx` | 280 | `style={{...` |
| `components/cinematic/SharedPanoramaCanvas.tsx` | 619 | `<div className="absolute inset-0 pointer-events-no...` |
| `components/joker/JokerHintSystem.tsx` | 108 | `style={{...` |
| `components/joker/JokerHintSystem.tsx` | 164 | `style={{...` |
| `components/joker/JokerHintSystem.tsx` | 181 | `style={{...` |
| `components/joker/JokerHintSystem.tsx` | 199 | `style={{...` |
| `components/joker/JokerHintSystem.tsx` | 229 | `style={{...` |
| `components/layout/Footer.tsx` | 7 | `<div className="absolute inset-0 pointer-events-no...` |
| `components/layout/Navbar.tsx` | 63 | `style={{ padding: "20px" }}...` |
| `components/layout/Navbar.tsx` | 68 | `style={{...` |
| `components/layout/Navbar.tsx` | 76 | `style={{ gap: "20px" }}...` |
| `components/layout/Navbar.tsx` | 80 | `<div className="flex items-center pointer-events-a...` |
| `components/layout/Navbar.tsx` | 101 | `style={{ gap: "0px", fontSize: "15px" }}...` |
| `components/layout/Navbar.tsx` | 110 | `style={{...` |
| `components/layout/Navbar.tsx` | 135 | `style={{...` |
| `components/transitions/TransitionOverlay.tsx` | 101 | `style={{ width: "40%" }}...` |
| `components/ui/BatcomputerBootOverlay.tsx` | 54 | `<div className="absolute top-8 right-8 w-16 h-16 b...` |
| `components/ui/BatcomputerBootOverlay.tsx` | 55 | `<div className="absolute bottom-8 left-8 w-16 h-16...` |
| `components/ui/BatcomputerBootOverlay.tsx` | 56 | `<div className="absolute bottom-8 right-8 w-16 h-1...` |
| `components/ui/BatcomputerBootOverlay.tsx` | 76 | `style={{...` |
| `components/ui/BatcomputerBootOverlay.tsx` | 90 | `style={{...` |
| `components/ui/BatcomputerBootOverlay.tsx` | 103 | `<span className="text-joker font-black" style={{ t...` |
| `components/ui/BatcomputerBootOverlay.tsx` | 118 | `style={{ padding: "40px 48px" }}...` |
| `components/ui/BatcomputerBootOverlay.tsx` | 130 | `style={{...` |
| `components/ui/BatcomputerBootOverlay.tsx` | 140 | `<p>Il <span className="text-joker font-bold" style...` |
| `components/ui/BatcomputerBootOverlay.tsx` | 152 | `style={{ color: "#FFD700", textShadow: "0 0 10px r...` |
| `components/ui/BatcomputerBootOverlay.tsx` | 164 | `style={{ color: "#FFD700", textShadow: "0 0 10px r...` |
| `components/ui/BatcomputerBootOverlay.tsx` | 172 | `style={{ boxShadow: "0 0 14px rgba(102,0,197,0.5)"...` |
| `components/ui/BatcomputerBootOverlay.tsx` | 182 | `style={{ color: "#FFD700", textShadow: "0 0 10px r...` |
| `components/ui/BatcomputerBootOverlay.tsx` | 194 | `style={{ color: "#FFD700", textShadow: "0 0 10px r...` |
| `components/ui/BatmanButton.tsx` | 81 | `style={{...` |
| `components/ui/BatmanButton.tsx` | 97 | `<div style={{...` |
| `components/ui/Logos.tsx` | 11 | `style={{...` |
| `components/ui/Logos.tsx` | 21 | `style={{...` |
| `components/ui/Logos.tsx` | 49 | `style={{...` |
| `components/ui/Logos.tsx` | 59 | `style={{...` |
| `components/ui/Logos.tsx` | 87 | `style={{...` |
| `components/ui/Logos.tsx` | 96 | `style={{...` |
| `components/ui/Logos.tsx` | 127 | `style={{...` |
| `components/ui/Logos.tsx` | 144 | `style={{...` |
| `components/ui/MediaControls.tsx` | 37 | `style={{...` |
| `components/ui/MediaControls.tsx` | 52 | `style={{...` |
| `components/ui/MediaControls.tsx` | 64 | `style={{...` |
| `components/ui/MediaControls.tsx` | 83 | `<div style={{ opacity: isPaused ? 0.3 : 1 }}>...` |
| `components/ui/MediaControls.tsx` | 85 | `style={{...` |
| `components/ui/MediaControls.tsx` | 100 | `style={{...` |
| `components/ui/MediaControls.tsx` | 140 | `style={{...` |
| `components/ui/MediaControls.tsx` | 153 | `style={{...` |
| `components/ui/MediaControls.tsx` | 175 | `style={{...` |
| `components/ui/MediaControls.tsx` | 187 | `<div style={{ width: 4.5, height: 8, outline: "1.3...` |
| `components/ui/MediaControls.tsx` | 188 | `<div style={{ width: 0.5, height: 3, outline: "1.3...` |
| `components/ui/MediaControls.tsx` | 189 | `<div style={{ width: 1.32, height: 6.36, outline: ...` |
| `components/ui/MediaControls.tsx` | 212 | `<VolumeX size={16} style={{ color: "var(--gray-lig...` |
| `components/ui/MediaControls.tsx` | 214 | `<Volume2 size={16} style={{ color: "var(--yellow)"...` |
| `components/ui/TechBackground.tsx` | 228 | `style={{ zIndex: 1, pointerEvents: "none" }}...` |
| `main.tsx` | 15 | `<Suspense fallback={<div style={{backgroundColor: ...` |
| `sections/Checkout.tsx` | 122 | `<div className="absolute inset-0" style={{ backgro...` |
| `sections/IntroScreen.tsx` | 58 | `style={{...` |
| `sections/IntroScreen.tsx` | 77 | `style={{...` |
| `sections/IntroScreen.tsx` | 88 | `style={{...` |
| `sections/IntroScreen.tsx` | 97 | `style={{...` |
| `sections/IntroScreen.tsx` | 105 | `style={{...` |
| `sections/IntroScreen.tsx` | 117 | `style={{...` |
| `sections/IntroScreen.tsx` | 138 | `style={{...` |
| `sections/IntroScreen.tsx` | 153 | `style={{...` |
| `sections/IntroScreen.tsx` | 174 | `style={{...` |
| `sections/IntroScreen.tsx` | 183 | `style={{...` |
| `sections/IntroScreen.tsx` | 191 | `style={{...` |
| `sections/IntroScreen.tsx` | 219 | `style={{...` |
| `sections/IntroScreen.tsx` | 229 | `style={{...` |
| `sections/IntroScreen.tsx` | 240 | `style={{...` |
| `sections/IntroScreen.tsx` | 249 | `style={{...` |
| `sections/IntroScreen.tsx` | 269 | `style={{...` |
| `sections/IntroScreen.tsx` | 282 | `style={{...` |
| `sections/IntroScreen.tsx` | 309 | `style={{...` |
| `sections/IntroScreen.tsx` | 319 | `style={{...` |
| `sections/IntroScreen.tsx` | 333 | `style={{...` |
| `sections/IntroScreen.tsx` | 349 | `style={{...` |
| `sections/IntroScreen.tsx` | 376 | `<div style={{ position: "absolute", top: 40, left:...` |
| `sections/IntroScreen.tsx` | 377 | `<div style={{ position: "absolute", top: 40, right...` |
| `sections/IntroScreen.tsx` | 378 | `<div style={{ position: "absolute", bottom: 40, le...` |
| `sections/IntroScreen.tsx` | 379 | `<div style={{ position: "absolute", bottom: 40, ri...` |
| `sections/IntroScreen.tsx` | 385 | `style={{...` |
| `sections/ThankYouPage.tsx` | 40 | `<div className="absolute inset-0 opacity-20 bg-[ur...` |
| `sections/ThankYouPage.tsx` | 77 | `style={{ textShadow: "0 0 40px rgba(255,255,255,0....` |


## 3. Incoerenze e Colori non standard
Colori trovati nel codice che non appartengono alla palette Figma.

| File | Riga | Valore Trovato | Contesto |
|------|------|----------------|----------|
| `App.tsx` | 332 | `#050505` | `<div className="fixed inset-0 z-[400000] bg-[#0505...` |
| `components/hud/MissionTimer.tsx` | 25 | `#ef4444` | `stroke={isUrgent ? "#ef4444" : isWarning ? "#f9731...` |
| `components/hud/MissionTimer.tsx` | 25 | `#f97316` | `stroke={isUrgent ? "#ef4444" : isWarning ? "#f9731...` |
| `components/hud/MissionTimer.tsx` | 30 | `#ef4444` | `<path d="M 5 30 L 5 20 L 15 10" stroke={isUrgent ?...` |
| `components/hud/MissionTimer.tsx` | 31 | `#ef4444` | `<path d="M 195 50 L 195 60 L 185 70" stroke={isUrg...` |
| `components/joker/JokerCard.tsx` | 141 | `#16a34a` | `animate={{ color: "#16a34a" }}...` |
| `components/layout/Footer.tsx` | 5 | `#080808` | `<footer id="footer" className="bg-[#080808] py-20 ...` |
| `components/layout/Footer.tsx` | 51 | `#22c55e` | `<div className="w-1.5 h-1.5 rounded-full bg-green-...` |
| `sections/ThankYouPage.tsx` | 30 | `#020202` | `className="fixed inset-0 z-[200] bg-[#020202] over...` |
