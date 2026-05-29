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
    <div className="relative flex items-center justify-center">
      {/* Navbar Timer Display */}
      <div className={`
        relative px-4 md:px-6 py-2 transition-all duration-500
        ${isUrgent ? 'text-red-500' : isWarning ? 'text-orange-400' : 'text-gold'}
      `}>
        {/* Subtle HUD background */}
        <div className={`absolute inset-0 bg-black/20 backdrop-blur-sm border-l-2 ${isUrgent ? 'border-red-600' : 'border-gold/30'} skew-x-[-15deg] pointer-events-none`} />
        
        <div className="relative z-10">
          <div className={`text-[6px] md:text-[7px] uppercase tracking-[0.4em] md:tracking-[0.6em] mb-1 opacity-50 font-mono ${isUrgent ? 'animate-pulse' : ''}`}>
            {isUrgent ? 'DETONAZIONE IMMINENTE' : 'DETONAZIONE IN'}
          </div>
          <div className={`text-xl md:text-3xl font-black tabular-nums tracking-tighter ${isUrgent ? 'camera-shake' : ''}`}>
            {formattedTime}
          </div>
        </div>
        
        {/* Glow effect */}
        <div className={`
          absolute inset-0 -z-10 blur-2xl transition-opacity duration-500
          ${isUrgent ? 'bg-red-600/30 opacity-100' : 
            isWarning ? 'bg-orange-500/15 opacity-60' : 
            'bg-gold/10 opacity-30'}
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
