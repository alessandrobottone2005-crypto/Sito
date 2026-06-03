import { motion, AnimatePresence } from "motion/react";

interface MissionTimerProps {
  timeLeft: number;
  isPaused: boolean;
}

export default function MissionTimer({ timeLeft, isPaused }: MissionTimerProps) {

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isWarning = timeLeft <= 30 && timeLeft > 10;
  const isUrgent = timeLeft <= 10 && timeLeft > 0;

  return (
    <div className="relative flex items-center justify-center mt-2 group">
      {/* Decorative SVG HUD Frame */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center w-full h-full scale-125 z-0 opacity-80">
        <svg viewBox="0 0 200 80" className="w-full h-full drop-shadow-lg" preserveAspectRatio="none">
          <path 
            d="M 20 5 L 180 5 L 195 20 L 195 60 L 180 75 L 20 75 L 5 60 L 5 20 Z" 
            fill="rgba(0,0,0,0.6)" 
            stroke={isUrgent ? "#ef4444" : isWarning ? "#f97316" : "#eab308"} 
            strokeWidth="2" 
            className="transition-colors duration-500"
          />
          {/* Corner accents */}
          <path d="M 5 30 L 5 20 L 15 10" stroke={isUrgent ? "#ef4444" : "#eab308"} strokeWidth="3" fill="none" />
          <path d="M 195 50 L 195 60 L 185 70" stroke={isUrgent ? "#ef4444" : "#eab308"} strokeWidth="3" fill="none" />
        </svg>
      </div>

      {/* Navbar Timer Display */}
      <div className={`
        relative px-8 md:px-12 py-2 md:py-3 transition-all duration-500 flex flex-col items-center
        ${isUrgent ? 'text-red-500 scale-110' : isWarning ? 'text-orange-400 scale-105' : 'text-gold hover:scale-105'}
      `}>
        
        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_3px] opacity-30 z-0 rounded-md overflow-hidden" />

        <div className="relative z-10 flex flex-col items-center">
          <div className={`text-[8px] md:text-[9px] uppercase tracking-[0.4em] md:tracking-[0.6em] mb-0.5 opacity-90 font-mono font-bold ${isUrgent ? 'animate-pulse text-red-400' : ''}`}>
            {isUrgent ? '!!! DETONAZIONE IMMINENTE !!!' : 'DETONAZIONE IN'}
          </div>
          {/* Removed tracking-tighter and tabular-nums to prevent cutting, added pr-2 just in case */}
          <div className={`text-2xl md:text-4xl font-black font-mono pr-2 pl-2 ${isUrgent ? 'camera-shake text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,1)]' : isWarning ? 'drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]' : 'drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]'}`}>
            {formattedTime}
          </div>
        </div>
        
        {/* Intense Glow effect */}
        <div className={`
          absolute inset-0 -z-10 blur-[30px] transition-opacity duration-500
          ${isUrgent ? 'bg-red-600/60 opacity-100' : 
            isWarning ? 'bg-orange-500/40 opacity-80' : 
            'bg-gold/30 opacity-60'}
        `} />
      </div>

      {/* Fullscreen Countdown for last 10 seconds */}
      <AnimatePresence>
        {isUrgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200000] pointer-events-none flex items-center justify-center bg-red-950/20 backdrop-blur-[2px]"
          >
            <motion.div
              key={timeLeft}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-[40vw] md:text-[30rem] font-black text-red-600 italic tracking-tighter drop-shadow-[0_0_50px_rgba(220,38,38,0.8)]"
            >
              {seconds}
            </motion.div>
            
            {/* Urgent UI Overlays */}
            <div className="absolute inset-0 border-[10px] md:border-[20px] border-red-600/20 animate-pulse pointer-events-none" />
            <div className="absolute top-1/2 left-2 md:left-10 -translate-y-1/2 text-red-600/40 text-[8px] md:text-xs font-black uppercase tracking-[0.5em] md:tracking-[1em] rotate-180 [writing-mode:vertical-lr]">
              SEQUENZA_EMERGENZA_ATTIVA
            </div>
            <div className="absolute top-1/2 right-2 md:right-10 -translate-y-1/2 text-red-600/40 text-[8px] md:text-xs font-black uppercase tracking-[0.5em] md:tracking-[1em] [writing-mode:vertical-lr]">
              COLLASSO_SISTEMA_IMMINENTE
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
