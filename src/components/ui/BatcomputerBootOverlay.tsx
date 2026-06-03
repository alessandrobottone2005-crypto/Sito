import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import TechBackground from "./TechBackground";

interface BatcomputerBootOverlayProps {
  onComplete: () => void;
}

export default function BatcomputerBootOverlay({ onComplete }: BatcomputerBootOverlayProps) {
  const [bootSequence, setBootSequence] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    // Sequence timing
    const t1 = setTimeout(() => setBootSequence(1), 1200); // Glitch -> Header
    const t2 = setTimeout(() => setBootSequence(2), 2500); // Content
    const t3 = setTimeout(() => setBootSequence(3), 4000); // CTA

    const handleMouseMove = (e: MouseEvent) => {
      if (hasMoved) return;
      // Normalize mouse to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      if (Math.abs(x) > 0.3 || Math.abs(y) > 0.3) {
        setHasMoved(true);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [hasMoved]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      className="fixed inset-0 z-[200000] bg-black/75 backdrop-blur-sm text-white font-mono flex flex-col items-center justify-center p-6 select-none overflow-hidden pointer-events-none"
    >
      <TechBackground theme="joker" />
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] opacity-20 z-10" />
      
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-0" />

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-8 md:gap-12 text-center">
        
        {/* Header Tecnico */}
        <div className="flex flex-col items-center text-center space-y-3">
          {bootSequence === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: [0, 1, 0.5, 1], scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-white/50 text-xl tracking-[0.5em] glitch-slow"
            >
              SYSTEM BOOT...
            </motion.div>
          )}

          <AnimatePresence>
            {bootSequence >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center"
              >
                <h2 className="text-white/40 text-base md:text-xl tracking-[0.4em] mb-2">
                  WAYNE TECH // INTERFACE TRAINING MODULE
                </h2>
                <div className="flex items-center justify-center gap-2 text-gold/80 text-base md:text-xl tracking-[0.2em] uppercase font-bold animate-pulse">
                  <div className="w-2 h-2 bg-gold/80" />
                  PROTOCOLLO DI SINCRONIZZAZIONE IN CORSO...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Istruzioni e Briefing */}
        <AnimatePresence>
          {bootSequence >= 2 && (
            <motion.div
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-6 w-full border border-white/10 bg-black/40 p-6 md:p-8 backdrop-blur-sm relative"
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/30" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/30" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/30" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/30" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Movement Block */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <span className={`text-base md:text-lg tracking-widest font-bold transition-colors duration-500 ${hasMoved ? 'text-green-500' : 'text-white/70'}`}>CONTROLLO MOVIMENTO</span>
                  </div>
                  <p className="text-white/60 text-sm md:text-base tracking-wider leading-relaxed">
                    Sincronizza il cursore con l'ambiente della Batcaverna muovendoti ai bordi dello schermo per esplorare lo spazio a 360°.
                  </p>
                  <div className="mt-3 text-xs tracking-[0.2em] uppercase font-bold">
                    {hasMoved ? (
                      <span className="text-green-500/80 animate-pulse">Sincronizzazione stabilita</span>
                    ) : (
                      <span className="text-gold/80 animate-pulse">In attesa di movimento...</span>
                    )}
                  </div>
                </div>

                {/* Interaction Block */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <span className="text-white/70 text-base md:text-lg tracking-widest font-bold">ANALISI INDIZI</span>
                  </div>
                  <p className="text-white/60 text-sm md:text-base tracking-wider leading-relaxed">
                    Interagisci con le <span className="text-green-500/80">Joker Cards</span> sparse nell'ambiente per decodificare gli enigmi.
                  </p>
                </div>
              </div>

              {/* Mission State */}
              <div className="mt-4 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02] p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-white/40 text-[9px] tracking-[0.3em]">STATO MISSIONE</span>
                  <span className="text-white/90 text-base md:text-xl tracking-widest font-bold">OBIETTIVO: NEUTRALIZZARE MINACCIA JOKER</span>
                </div>
                <div className="flex flex-col gap-1 md:items-end">
                  <span className="text-white/40 text-[9px] tracking-[0.3em]">DATI RILEVATI</span>
                  <span className="text-gold text-base md:text-xl tracking-widest font-bold">PROGRESSO: 0 / 5 INDIZI</span>
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
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mt-4 pointer-events-auto"
            >
              <button
                onClick={onComplete}
                disabled={!hasMoved}
                className={`group relative px-10 py-5 bg-transparent border text-sm md:text-lg font-bold tracking-[0.2em] uppercase transition-all duration-300 focus:outline-none ${
                  hasMoved 
                    ? "border-gold/50 text-gold hover:bg-gold/10 hover:border-gold hover:shadow-[0_0_20px_rgba(250,204,21,0.2)]" 
                    : "border-white/20 text-white/30 cursor-not-allowed"
                }`}
              >
                <div className="absolute inset-0 bg-gold/5 w-0 group-hover:w-full transition-all duration-500 ease-out z-0" />
                <span className="relative z-10 flex items-center gap-3">
                  {hasMoved ? "INIZIALIZZA PROTOCOLLO BATCOMPUTER" : "RICHESTA SINCRONIZZAZIONE MOVIMENTO..."}
                  {hasMoved && (
                    <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </span>
                
                {/* Micro glitch on hover */}
                {hasMoved && (
                  <span className="absolute inset-0 border border-gold opacity-0 group-hover:opacity-50 group-hover:animate-pulse z-20 pointer-events-none" />
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
