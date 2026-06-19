import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import TechBackground from "./TechBackground";

interface BatcomputerBootOverlayProps {
  onComplete: () => void;
}

export default function BatcomputerBootOverlay({ onComplete }: BatcomputerBootOverlayProps) {
  const [bootSequence, setBootSequence] = useState(0);

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
      className="fixed inset-0 z-[200000] bg-black/95 text-white font-sans flex flex-col items-center justify-center p-6 select-none overflow-y-auto pointer-events-auto"
    >
      {/* Background */}
      <TechBackground theme="gold" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] z-0" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-8 md:gap-10 text-center py-10">
        
        {/* Header & Timer */}
        <AnimatePresence>
          {bootSequence >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center max-w-4xl"
            >
              <div className="text-gold text-[10px] md:text-xs tracking-[0.4em] mb-4 font-mono font-bold uppercase border border-gold/30 px-3 py-1 bg-gold/5">
                BATCOMPUTER // EMERGENCY PROTOCOL
              </div>
              
              <h1 className="text-white text-6xl md:text-8xl font-black tracking-tighter uppercase mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                ALLARME BATCAVERNA
              </h1>

              {/* Timer Preview */}
              <div className="text-white text-6xl md:text-[5rem] font-mono font-black tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] my-4" style={{ letterSpacing: '0.05em' }}>
                03:00
              </div>

              <p className="text-white/90 text-lg md:text-2xl font-medium tracking-wide leading-relaxed max-w-3xl mt-2">
                <span className="text-joker font-bold">Joker</span> ha attivato un ordigno nella Batcaverna. Individua tutti gli indizi e neutralizza la minaccia prima dello scadere del tempo.
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
              className="flex flex-col w-full bg-black/80 border-t-2 border-gold p-8 md:p-12 backdrop-blur-md relative shadow-[0_0_40px_rgba(0,0,0,0.8)]"
            >
              {/* Mission Content */}
              <div className="flex flex-col items-center text-center mb-10 pb-8 border-b border-white/10">
                <h2 className="text-gold text-3xl md:text-4xl font-black tracking-widest uppercase mb-6">
                  MISSIONE
                </h2>
                <div className="text-white text-lg md:text-xl leading-relaxed max-w-2xl space-y-2">
                  <p>Il <span className="text-joker font-bold">Joker</span> ha nascosto 5 indizi nella Batcaverna.</p>
                  <p>Ogni indizio contiene informazioni necessarie per disattivare la bomba.</p>
                  <p>Trovali tutti prima che il timer raggiunga lo zero.</p>
                </div>
              </div>

              {/* Game Rules (4 Blocks) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 text-center items-start">
                {/* Rule 1 */}
                <div className="flex flex-col items-center gap-3">
                  <h3 className="text-gold font-bold tracking-widest text-lg uppercase">ESPLORA L'AMBIENTE</h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">
                    Muovi il cursore ai bordi dello schermo per esplorare la Batcaverna a 360°.
                  </p>
                </div>
                {/* Rule 2 */}
                <div className="flex flex-col items-center gap-3">
                  <h3 className="text-gold font-bold tracking-widest text-lg uppercase">TROVA GLI INDIZI</h3>
                  <img src="./assets/images/JollyJokerCard.jpg" alt="Joker Card" className="w-12 h-16 object-cover rounded shadow-[0_0_10px_rgba(57,255,20,0.3)] border border-joker/50 my-1" />
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">
                    Individua le <span className="text-joker font-bold">Joker Cards</span> nascoste nell'oscurità.
                  </p>
                </div>
                {/* Rule 3 */}
                <div className="flex flex-col items-center gap-3">
                  <h3 className="text-gold font-bold tracking-widest text-lg uppercase">RISOLVI GLI ENIGMI</h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">
                    Rispondi correttamente alle domande poste dal Joker per procedere.
                  </p>
                </div>
                {/* Rule 4 */}
                <div className="flex flex-col items-center gap-3">
                  <h3 className="text-gold font-bold tracking-widest text-lg uppercase">BATTI IL TEMPO</h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">
                    Hai a disposizione 3 minuti. Se il timer scade, la missione fallisce.
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
              <button
                onClick={onComplete}
                className="group relative px-12 py-5 bg-gold text-black text-xl md:text-2xl font-black tracking-widest uppercase transition-all duration-300 hover:bg-white hover:shadow-[0_0_50px_rgba(250,204,21,0.6)] hover:scale-105 rounded-sm overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  INIZIA LA MISSIONE
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
