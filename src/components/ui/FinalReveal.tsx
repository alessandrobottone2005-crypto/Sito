import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface FinalRevealProps {
  onComplete: () => void;
  isPaused?: boolean;
}

export default function FinalReveal({ onComplete, isPaused }: FinalRevealProps) {
  useEffect(() => {
    if (isPaused) return;

    // Mostra la schermata di vittoria per 4 secondi, poi passa allo showreel
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete, isPaused]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden">
      {/* Background: Batcomputer Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/assets/textures/BatCaverna360_BatComputerArea.png" 
          alt="Batcomputer" 
          className="w-full h-full object-cover filter grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="text-joker text-[10px] tracking-[0.8em] uppercase font-bold mb-8">
            MISSIONE COMPLETATA // BOMBA_DISINNESCATA
          </div>
          
          <div className="text-joker text-[50px] md:text-[80px] leading-none mb-6 font-black italic glitch-main">
            COMPLIMENTI!
          </div>
          
          <div className="max-w-2xl">
            <p className="text-white text-xl md:text-2xl tracking-[0.1em] uppercase font-bold text-center leading-relaxed">
              "Complimenti, Bats... <br />
              <span className="text-joker text-base md:text-lg">Per una volta non volevo farti saltare in aria. <br />Goditi la tua preziosa statua!"</span>
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16 flex flex-col items-center gap-4"
          >
            <div className="w-48 h-[2px] bg-white/10 relative overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-joker"
                animate={{ left: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                style={{ width: "100%" }}
              />
            </div>
            <div className="text-white/40 text-[9px] tracking-[0.5em] uppercase font-mono">
              Inizializzazione Showreel...
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 pointer-events-none z-20 border-[40px] border-black" />
      <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_30%,black_100%)]" />
      <div className="absolute inset-0 pointer-events-none z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
    </div>
  );
}
