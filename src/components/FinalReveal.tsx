import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface FinalRevealProps {
  onComplete: () => void;
  isPaused?: boolean;
}

export default function FinalReveal({ onComplete, isPaused }: FinalRevealProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    // Remaining times based on current step
    const timings = [2000, 4500, 7500, 10500];
    const timers: NodeJS.Timeout[] = [];
    
    for (let i = step; i < timings.length; i++) {
      const delay = i === step ? timings[i] - (step > 0 ? timings[step-1] : 0) : timings[i] - (step > 0 ? timings[step-1] : 0);
      // Simplify: just start from the next step's relative delay
      const relativeDelay = timings[i] - (step > 0 ? timings[step-1] : 0);
      
      timers.push(setTimeout(() => {
        if (i === 3) onComplete();
        else setStep(i + 1);
      }, relativeDelay));
      
      // Wait, this is still a bit off if we pause mid-step. 
      // For now, let's just make it at least continue from the current step.
      break; // Only schedule the NEXT step to keep it simple and robust
    }

    return () => timers.forEach(clearTimeout);
  }, [onComplete, isPaused, step]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden">
      {/* Background: Batcomputer Area */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0"
          >
            <img 
              src="/BatCaverna360.png" 
              alt="Batcomputer" 
              className="w-full h-full object-cover filter grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-black/60" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 text-center px-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-joker text-[10px] tracking-[0.8em] uppercase font-bold"
            >
              MISSIONE COMPLETATA: BOMBA_DISINNESCATA
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="text-white/40 text-[8px] tracking-[0.5em] uppercase mb-4">Silenzio Improvviso</div>
              <h2 className="text-white text-4xl font-black tracking-tighter italic uppercase glitch-slow">
                Minaccia Sventata
              </h2>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <div className="text-joker text-[60px] leading-none mb-6 font-black italic glitch-main">
                COMPLIMENTI!
              </div>
              <p className="text-white text-lg tracking-[0.2em] uppercase font-bold text-center">
                "Complimenti, Bats... <br />
                <span className="text-joker text-sm">Per una volta non volevo farti saltare in aria."</span>
              </p>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="flex flex-col items-center"
            >
              <div className="w-px h-16 bg-gold mb-8" />
              <div className="text-white/40 text-[10px] tracking-[0.6em] uppercase mb-8">Batman apre il pacco...</div>
              <h1 className="text-gold text-5xl md:text-7xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]">
                B-KNIGHT 87
              </h1>
              <p className="text-white/60 text-xs tracking-[0.6em] uppercase mt-4 font-bold">
                Edizione Limitata Ottenuta
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 pointer-events-none z-20 border-[40px] border-black" />
      <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_30%,black_100%)]" />
      <div className="absolute inset-0 pointer-events-none z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
    </div>
  );
}
