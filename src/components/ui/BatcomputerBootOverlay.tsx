import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import TechBackground from "./TechBackground";
import BatmanButton from "./BatmanButton";

interface BatcomputerBootOverlayProps {
  onComplete: () => void;
  initialTime?: number; // Added for BUG-002
}

export default function BatcomputerBootOverlay({ onComplete, initialTime = 180 }: BatcomputerBootOverlayProps) {
  const [bootSequence, setBootSequence] = useState(0);

  // Helper per formattare il tempo dinamicamente
  const formattedMinutes = Math.floor(initialTime / 60);
  const formattedSeconds = (initialTime % 60).toString().padStart(2, "0");
  const displayTime = `${formattedMinutes.toString().padStart(2, "0")}:${formattedSeconds}`;

  useEffect(() => {
    // Sequence timing
    const t1 = setTimeout(() => setBootSequence(1), 300); // Header & Timer
    const t2 = setTimeout(() => setBootSequence(2), 1000); // Content/Mission
    const t3 = setTimeout(() => setBootSequence(3), 1800); // CTA

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      className="fixed inset-0 z-[50] bg-black/96 text-white font-sans flex flex-col items-center justify-center p-6 select-none overflow-y-auto pointer-events-auto"
    >
      {/* Background */}
      <TechBackground theme="joker" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(102,0,197,0.04)_0%,transparent_55%),radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)] z-0" />

      {/* Scanlines */}
      <div className="scanlines-overlay z-[2]" />

      {/* Vignette */}
      <div className="vignette z-[2]" />

      {/* Scan sweep line */}
      <div className="scan-sweep-line z-[3]" />

      {/* HUD Corners */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-joker/40 hud-corner-animated pointer-events-none z-[3]" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-joker/40 hud-corner-animated pointer-events-none z-[3]" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-joker/40 hud-corner-animated pointer-events-none z-[3]" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-joker/40 hud-corner-animated pointer-events-none z-[3]" style={{ animationDelay: "3s" }} />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-8 md:gap-10 text-center py-10">
        
        {/* Header & Timer */}
        <AnimatePresence>
          {bootSequence >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center max-w-4xl relative z-10"
            >
              <div
                className="joker-badge mb-6"
              >
                BATCOMPUTER // EMERGENCY PROTOCOL
              </div>

              <h1
                className="text-white font-black tracking-tighter uppercase mb-3 glitch-slow"
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontSize: "clamp(40px, 8vw, 80px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  textShadow: "0 0 40px rgba(255,255,255,0.15), 0 0 80px rgba(102,0,197,0.1)",
                }}
              >
                ALLARME BATCAVERNA
              </h1>

              {/* Timer Preview — con glow più drammatico */}
              <div
                className="font-black tracking-widest my-5"
                style={{
                  fontFamily: "Space Grotesk, monospace",
                  fontSize: "clamp(48px, 8vw, 88px)",
                  lineHeight: 1,
                  letterSpacing: "0.08em",
                  color: "#6600C5",
                  textShadow: "0 0 20px rgba(102,0,197,0.8), 0 0 50px rgba(102,0,197,0.4), 0 0 100px rgba(102,0,197,0.2)",
                }}
              >
                {displayTime}
              </div>

              <p className="text-white/80 text-base md:text-xl font-medium tracking-wide leading-relaxed max-w-3xl mt-2">
                <span className="text-joker font-black" style={{ textShadow: "0 0 14px rgba(102,0,197,0.6)" }}>Joker</span> ha attivato un ordigno nella Batcaverna.
                Individua tutti gli indizi e neutralizza la minaccia prima dello scadere del tempo.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mission Brief (Single Central Card) */}
        <AnimatePresence>
          {bootSequence >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="glass-panel-joker shimmer neon-border-joker relative z-10 w-full overflow-hidden"
              style={{ padding: "40px 48px" }}
            >
              {/* HUD corners on card */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-joker/60 pointer-events-none" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-joker/60 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-joker/60 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-joker/60 pointer-events-none" />

              {/* Mission Content */}
              <div className="flex flex-col items-center text-center mb-10 pb-8 border-b border-joker/10 relative z-10">
                <h2
                  className="font-black tracking-widest uppercase mb-6"
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "clamp(24px, 4vw, 40px)",
                    color: "#6600C5",
                    textShadow: "0 0 20px rgba(102,0,197,0.5)",
                  }}
                >
                  MISSIONE
                </h2>
                <div className="text-white/75 text-base md:text-lg leading-relaxed max-w-2xl space-y-2">
                  <p>Il <span className="text-joker font-bold" style={{ textShadow: "0 0 10px rgba(102,0,197,0.5)" }}>Joker</span> ha nascosto 5 indizi nella Batcaverna.</p>
                  <p>Ogni indizio contiene informazioni necessarie per disattivare la bomba.</p>
                  <p>Trovali tutti prima che il timer raggiunga lo zero.</p>
                </div>
              </div>

              {/* Game Rules (4 Blocks) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 text-center items-start relative z-10">
                {/* Rule 1 */}
                <div className="flex flex-col items-center gap-3">
                  <h3
                    className="font-black tracking-wider uppercase text-base"
                    style={{ color: "#6600C5", textShadow: "0 0 10px rgba(102,0,197,0.4)" }}
                  >
                    ESPLORA L'AMBIENTE
                  </h3>
                  <p className="text-white/65 text-sm leading-relaxed">
                    Muovi il cursore ai bordi dello schermo per esplorare la Batcaverna a 360°.
                  </p>
                </div>
                {/* Rule 2 */}
                <div className="flex flex-col items-center gap-3">
                  <h3
                    className="font-black tracking-wider uppercase text-base"
                    style={{ color: "#6600C5", textShadow: "0 0 10px rgba(102,0,197,0.4)" }}
                  >
                    TROVA GLI INDIZI
                  </h3>
                  <img
                    src="./assets/images/JollyJokerCard_Front.jpg"
                    alt="Joker Card"
                    className="w-12 h-16 object-cover rounded my-1"
                    style={{ boxShadow: "0 0 14px rgba(102,0,197,0.5)", border: "1px solid rgba(102,0,197,0.4)" }}
                  />
                  <p className="text-white/65 text-sm leading-relaxed">
                    Individua le <span className="text-joker font-bold">Joker Cards</span> nascoste nell'oscurità.
                  </p>
                </div>
                {/* Rule 3 */}
                <div className="flex flex-col items-center gap-3">
                  <h3
                    className="font-black tracking-wider uppercase text-base"
                    style={{ color: "#6600C5", textShadow: "0 0 10px rgba(102,0,197,0.4)" }}
                  >
                    RISOLVI GLI ENIGMI
                  </h3>
                  <p className="text-white/65 text-sm leading-relaxed">
                    Rispondi correttamente alle domande poste dal Joker per procedere.
                  </p>
                </div>
                {/* Rule 4 */}
                <div className="flex flex-col items-center gap-3">
                  <h3
                    className="font-black tracking-wider uppercase text-base"
                    style={{ color: "#6600C5", textShadow: "0 0 10px rgba(102,0,197,0.4)" }}
                  >
                    BATTI IL TEMPO
                  </h3>
                  <p className="text-white/65 text-sm leading-relaxed">
                    Hai a disposizione {formattedMinutes} {formattedMinutes === 1 ? "minuto" : "minuti"}. Se il timer scade, la missione fallisce.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <AnimatePresence>
          {bootSequence >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-8 mt-2"
            >
              <BatmanButton
                variant="joker"
                onClick={onComplete}
              >
                INIZIA LA MISSIONE
              </BatmanButton>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
