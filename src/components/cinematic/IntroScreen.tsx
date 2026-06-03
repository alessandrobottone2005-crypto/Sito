import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import TechBackground from "../ui/TechBackground";
import { BatcavernAudio } from "../../lib/audioManager";

interface IntroScreenProps {
  onBegin: () => void;
}

const BRIEFING_TEXTS = [
  { text: "Batman 2 ...", accent: "Ho lasciato un regalino nella tua preziosa caverna..." },
  { text: "Non è il solito giocattolo,", accent: "ma qualcosa che farà il botto." },
  { text: "Trova i miei 5 indizi.", accent: "Dimostrami che il Grande Pipistrello sa ancora giocare." },
  { text: "Il tempo scorre.", accent: "Tic tac, Batsy..." },
  { text: "Risolvi il gioco", accent: "o la tua caverna diventerà polvere." }
];

export default function IntroScreen({ onBegin }: IntroScreenProps) {
  const [step, setStep] = useState(0); // 0: glitch/symbol, 1-5: texts, 6: timer/button
  const [isHacked, setIsHacked] = useState(false);

  useEffect(() => {
    // ── AUDIO ────────────────────────────────────────────────────────────
    // La musica parte esattamente quando compare il briefing del Joker.
    // Il fade-in di 2 secondi è sincronizzato con l'animazione del testo.
    // BatcavernAudio.start() è idempotente: sicuro da chiamare più volte.
    const audioTimer = setTimeout(() => {
      BatcavernAudio.start(2000);
    }, 1500); // coincide con setIsHacked(true)

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
      clearTimeout(audioTimer);
      clearTimeout(t1);
      timers.forEach(clearTimeout);
      // NON fermiamo la musica qui: deve sopravvivere alla transizione
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      <TechBackground theme="joker" />
      {/* Background: CRT Glitch / Batcomputer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-10">
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
            <div className="cinematic-label text-white/20 text-[11px] animate-pulse">
              SEGNALE_INTERCETTATO...
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="briefing-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center"
          >


            {/* Narrative Texts */}
            <div className="min-h-[260px] flex items-center justify-center mb-14">
              <AnimatePresence mode="wait">
                {step >= 1 && step <= 5 && (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -24, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center gap-6"
                  >
                    <h2 className="cinematic-title text-white text-5xl md:text-8xl glitch-slow px-4 font-black tracking-tight leading-none">
                      {BRIEFING_TEXTS[step - 1].text}
                    </h2>
                    <p className="cinematic-accent text-joker text-lg md:text-3xl flicker-fast px-4 font-medium tracking-wide max-w-2xl">
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
                <div className="mb-14 relative group w-[380px] md:w-[620px]">
                   <div className="absolute inset-0 pointer-events-none flex items-center justify-center w-full h-full z-0 opacity-40">
                     <svg viewBox="0 0 200 80" className="w-full h-full drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" preserveAspectRatio="none">
                       <path 
                         d="M 20 5 L 180 5 L 195 20 L 195 60 L 180 75 L 20 75 L 5 60 L 5 20 Z" 
                         fill="rgba(20,0,0,0.8)" 
                         stroke="#ef4444" 
                         strokeWidth="1.5" 
                       />
                       <path d="M 5 30 L 5 20 L 15 10" stroke="#ef4444" strokeWidth="3" fill="none" />
                       <path d="M 195 50 L 195 60 L 185 70" stroke="#ef4444" strokeWidth="3" fill="none" />
                     </svg>
                   </div>
                   
                   <div className="relative z-10 py-8 flex flex-col items-center justify-center overflow-visible">
                     <div className="cinematic-label text-sm md:text-base text-red-500/80 mb-4 text-center tracking-[0.6em] uppercase animate-pulse">
                       TEMPO_ALLA_DETONAZIONE
                     </div>
                     <div className="text-8xl md:text-[10rem] text-red-600 font-mono font-black drop-shadow-[0_0_40px_rgba(220,38,38,0.8)] camera-shake px-4" style={{ letterSpacing: '0.05em' }}>
                       03:00
                     </div>
                   </div>
                   
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none rounded-xl" />
                   <div className="absolute -inset-4 border border-red-600/10 animate-pulse pointer-events-none" />
                </div>

                <motion.button
                  onClick={onBegin}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-[320px] md:w-[520px] py-6 md:py-8 bg-black border-2 border-gold text-gold rounded-sm overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(250,204,21,0.5)]"
                >
                   <span className="cinematic-label font-['Share_Tech_Mono',monospace] relative z-10 text-sm md:text-lg block" style={{ letterSpacing: '0.5em' }}>
                     ACCETTA LA SFIDA
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
      <div className="cinematic-label absolute top-12 left-40 text-white/10 text-[8px]">BAT_SYS_V9.0 // MODALITÀ_BRIEFING</div>
      <div 
        className="cinematic-label absolute bottom-12 right-40 text-joker/10 text-[8px] animate-pulse cursor-pointer hover:text-joker/40 transition-colors"
        onClick={onBegin}
      >
        MANOMISSIONE_JOKER_ATTIVA // OVERRIDE_ACCETTA_LA_SFIDA
      </div>
    </div>
  );
}
