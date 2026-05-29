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
        <div className="absolute inset-0 w-full h-full backface-hidden bg-black border-2 border-white/10 rounded-2xl overflow-hidden shadow-2xl group">
          <img 
            src="./assets/images/JollyJokerCard.jpg" 
            alt="Joker Hint" 
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          
          {/* Pulsing Green Glow Border - INTENSIFIED */}
          <motion.div 
            className="absolute inset-0 border-2 border-joker rounded-2xl pointer-events-none"
            animate={{ 
              opacity: [0.5, 1, 0.5],
              boxShadow: [
                "inset 0 0 30px rgba(57, 255, 20, 0.4), 0 0 20px rgba(57, 255, 20, 0.3)",
                "inset 0 0 60px rgba(57, 255, 20, 0.8), 0 0 50px rgba(57, 255, 20, 0.9)",
                "inset 0 0 30px rgba(57, 255, 20, 0.4), 0 0 20px rgba(57, 255, 20, 0.3)"
              ]
            }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="absolute inset-0 bg-joker/5 group-hover:bg-joker/10 transition-colors pointer-events-none" />
        </div>

        {/* Back side (Riddle & Multiple Choice) */}
        <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-black overflow-hidden border-2 rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-500 ${isSolved ? "border-joker shadow-[0_0_80px_rgba(57,255,20,0.4)]" : error ? "border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]" : "border-joker/30 shadow-[0_0_50px_rgba(57,255,20,0.15)]"}`}>
          
          <div className="absolute inset-0 pointer-events-none z-0">
            <img 
              src="./assets/images/JollyJokerCard_Back.jpg" 
              alt="Card Background" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
            {/* Glitch Effect Overlay when solved */}
          {isSolved && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute inset-0 bg-joker/5 pointer-events-none rounded-2xl"
            />
          )}



          {isSolved && (
            <motion.h3 
              animate={{ color: "#7f1d1d" }}
              className="text-red-900 text-[11px] tracking-[0.4em] font-bold uppercase mb-8 font-serif bg-white/50 px-3 py-1 rounded backdrop-blur-sm"
            >
              RISPOSTA CORRETTA
            </motion.h3>
          )}
          
          <p className="text-black text-center text-xl md:text-2xl font-bold leading-relaxed mb-10 italic px-4 font-serif">
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
                  relative w-full py-4 px-6 bg-white/50 backdrop-blur-md border-2 transition-all duration-300 group overflow-hidden
                  ${isSolved && option === correctAnswer 
                    ? "border-green-700 text-green-900 bg-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.4)]" 
                    : "border-black/40 text-black hover:border-red-800 hover:text-red-900 hover:bg-red-500/20 hover:shadow-[0_0_10px_rgba(220,38,38,0.3)]"}
                  rounded-lg
                `}
              >
                {/* Red Hover Line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <span className="relative z-10 text-xs md:text-sm tracking-[0.2em] uppercase font-bold font-serif">
                  {option}
                </span>

                {/* Micro-glow background on hover */}
                <div className="absolute inset-0 bg-red-900/0 group-hover:bg-red-900/5 transition-colors" />
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-6 text-[11px] text-red-800 font-bold tracking-[0.3em] font-serif uppercase bg-white/60 px-4 py-2 rounded-lg backdrop-blur-md border border-red-800/40 shadow-lg"
              >
                Accesso Negato // Riprova
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

