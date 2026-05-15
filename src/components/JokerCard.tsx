import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface JokerCardProps {
  id: number;
  riddle: string;
  options: string[];
  correctAnswer: string;
  onSuccess: (id: number) => void;
  onClose: () => void;
  isFlipped: boolean;
  isPaused?: boolean;
}

const playBeep = (freq: number, type: OscillatorType, duration: number) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("AudioContext non supportato", e);
  }
};

export default function JokerCard({ 
  id, 
  riddle, 
  options,
  correctAnswer, 
  onSuccess,
  onClose,
  isFlipped,
  isPaused
}: JokerCardProps) {
  const [error, setError] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPaused) return;
    onClose();
  };

  const handleOptionClick = (option: string) => {
    if (isSolved || isPaused) return;

    if (option === correctAnswer) {
      setIsSolved(true);
      playBeep(880, 'sine', 0.5);
      setTimeout(() => playBeep(1760, 'sine', 0.5), 150);
      
      setTimeout(() => {
        onSuccess(id);
      }, 1000);
    } else {
      setError(true);
      playBeep(150, 'sawtooth', 0.5);
      
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <div className="relative w-[90vw] max-w-[320px] h-[450px] md:max-w-none md:w-[420px] md:h-[620px] transition-all duration-700 perspective-1000 z-50">
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-700"
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
          x: error ? [0, -10, 10, -10, 10, 0] : 0
        }}
        transition={{
          rotateY: { duration: 0.7, ease: "circOut" },
          x: { duration: 0.4 }
        }}
      >
        {/* Front side (Retro Carta) */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-black border-2 border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6 group">
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-joker opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-joker opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-joker opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-joker opacity-50 group-hover:opacity-100 transition-opacity" />
          
          <div className="w-24 h-24 text-joker opacity-20 group-hover:opacity-40 transition-opacity">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
          </div>
          
          <div className="mt-8 text-[10px] tracking-[0.4em] text-white/40 group-hover:text-joker/60 transition-colors uppercase font-bold">
            Indizio Joker #{id}
          </div>

          <div className="absolute inset-0 bg-joker/0 group-hover:bg-joker/5 transition-colors pointer-events-none" />
        </div>

        {/* Back side (Riddle & Multiple Choice) */}
        <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-zinc-950 border-2 rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-500 ${isSolved ? "border-joker shadow-[0_0_80px_rgba(57,255,20,0.4)]" : error ? "border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]" : "border-joker/30 shadow-[0_0_50px_rgba(57,255,20,0.15)]"}`}>
          
          {/* Glitch Effect Overlay when solved */}
          {isSolved && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute inset-0 bg-joker/5 pointer-events-none rounded-2xl"
            />
          )}

          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors z-50"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <motion.h3 
            animate={isSolved ? { color: "#39FF14" } : {}}
            className="text-joker text-[9px] tracking-[0.5em] font-bold uppercase mb-8 opacity-80 font-mono"
          >
            {isSolved ? "RISPOSTA CORRETTA" : "Protocollo Investigativo"}
          </motion.h3>
          
          <p className="text-white text-center text-lg md:text-xl font-medium leading-relaxed mb-10 italic px-2 font-serif">
            "{riddle}"
          </p>

          <div className="grid grid-cols-1 gap-3 w-full px-2">
            {options.map((option, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionClick(option);
                }}
                className={`
                  relative w-full py-4 px-6 bg-black border transition-all duration-300 group overflow-hidden
                  ${isSolved && option === correctAnswer 
                    ? "border-joker text-joker shadow-[0_0_20px_rgba(57,255,20,0.3)]" 
                    : "border-white/10 text-white/80 hover:border-joker hover:text-white hover:shadow-[0_0_15px_rgba(57,255,20,0.2)]"}
                  rounded-lg
                `}
              >
                {/* Batcomputer Hover Line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-joker opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <span className="relative z-10 text-xs md:text-sm tracking-[0.2em] uppercase font-bold font-space-grotesk">
                  {option}
                </span>

                {/* Micro-glow background on hover */}
                <div className="absolute inset-0 bg-joker/0 group-hover:bg-joker/5 transition-colors" />
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-6 text-[10px] text-red-500 font-bold tracking-[0.3em] font-mono uppercase"
              >
                Accesso Negato // Riprova
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

