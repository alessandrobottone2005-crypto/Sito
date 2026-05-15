import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface IntroScreenProps {
  onBegin: () => void;
}

const BRIEFING_TEXTS = [
  { text: "Batman...", accent: "Ti ho lasciato una piccola sorpresa nella tua caverna..." },
  { text: "Da qualche parte nella Batcaverna", accent: "c'è un pacco che ti aspetta." },
  { text: "Ma fai attenzione...", accent: "questo regalo contiene una bomba." },
  { text: "Risolvi tutti e 5 gli indizi", accent: "prima che il tempo finisca..." },
  { text: "...oppure Gotham", accent: "sentirà l'esplosione." }
];

export default function IntroScreen({ onBegin }: IntroScreenProps) {
  const [step, setStep] = useState(0); // 0: glitch/symbol, 1-5: texts, 6: timer/button
  const [isHacked, setIsHacked] = useState(false);

  useEffect(() => {
    // Initial glitch sequence
    const t1 = setTimeout(() => setIsHacked(true), 1500);
    
    // Text sequence
    const timers: NodeJS.Timeout[] = [];
    for (let i = 0; i < BRIEFING_TEXTS.length; i++) {
      timers.push(setTimeout(() => setStep(i + 1), 2000 + (i * 3000)));
    }
    
    // Final step
    timers.push(setTimeout(() => setStep(6), 2000 + (BRIEFING_TEXTS.length * 3000)));

    return () => {
      clearTimeout(t1);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Background: CRT Glitch / Batcomputer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.05)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        <div className="absolute inset-0 scan-sweep-line opacity-30" />
      </div>

      <AnimatePresence mode="wait">
        {!isHacked ? (
          <motion.div 
            key="initial-glitch"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0.5, 1] }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="text-white/20 font-mono text-[10px] tracking-[1em] uppercase animate-pulse">
              SEGNALE_INTERCETTATO...
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="briefing-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center"
          >
            {/* Joker Symbol */}
            <motion.div 
              initial={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
              animate={{ opacity: 0.15, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <svg width="600" height="300" viewBox="0 0 120 60" fill="none" className="text-joker opacity-20">
                <path d="M10 20C30 45 90 45 110 20C90 55 30 55 10 20Z" fill="currentColor" />
              </svg>
            </motion.div>

            {/* Narrative Texts */}
            <div className="min-h-[200px] flex items-center justify-center mb-12">
              <AnimatePresence mode="wait">
                {step >= 1 && step <= 5 && (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center"
                  >
                    <h2 className="text-white text-xl md:text-5xl font-black tracking-tighter uppercase italic mb-2 glitch-slow px-4">
                      {BRIEFING_TEXTS[step - 1].text}
                    </h2>
                    <p className="text-joker text-sm md:text-2xl font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase flicker-fast px-4">
                      {BRIEFING_TEXTS[step - 1].accent}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Timer Preview & Start Button */}
            {step === 6 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                {/* Timer Preview */}
                <div className="mb-12 relative group">
                   <div className="text-[10px] text-red-500/60 uppercase tracking-[0.8em] font-black mb-4 text-center">
                     TEMPO_ALLA_DETONAZIONE
                   </div>
                   <div className="text-7xl md:text-8xl font-black text-red-600 italic tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(220,38,38,0.6)] camera-shake">
                     03:00
                   </div>
                   <div className="absolute -inset-8 border border-red-600/20 animate-pulse" />
                   <div className="absolute -inset-1 border border-red-600/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <motion.button
                  onClick={onBegin}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-[280px] md:w-[400px] py-5 md:py-6 bg-black border-2 border-gold text-gold font-black rounded-sm overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(250,204,21,0.5)]"
                >
                  <span className="relative z-10 tracking-[0.4em] md:tracking-[0.8em] uppercase text-xs md:text-sm block">
                    INIZIA LA MISSIONE
                  </span>
                  <div className="absolute inset-0 bg-gold opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  
                  {/* Decorative corner brackets */}
                  <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold" 
                  />
                  <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold" 
                  />
                  <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold" 
                  />
                  <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                    className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold" 
                  />
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative HUD Elements */}
      <div className="absolute top-12 left-12 w-24 h-24 border-t border-l border-white/10" />
      <div className="absolute top-12 right-12 w-24 h-24 border-t border-r border-white/10" />
      <div className="absolute bottom-12 left-12 w-24 h-24 border-b border-l border-white/10" />
      <div className="absolute bottom-12 right-12 w-24 h-24 border-b border-r border-white/10" />
      
      {/* HUD Labels */}
      <div className="absolute top-12 left-40 text-white/10 text-[8px] tracking-[0.5em] font-mono">BAT_SYS_V9.0 // MODALITÀ_BRIEFING</div>
      <div 
        className="absolute bottom-12 right-40 text-joker/10 text-[8px] tracking-[0.5em] font-mono animate-pulse cursor-pointer hover:text-joker/40 transition-colors"
        onClick={onBegin}
      >
        MANOMISSIONE_JOKER_ATTIVA // SKIP_MISSION_BYPASS
      </div>
    </div>
  );
}
