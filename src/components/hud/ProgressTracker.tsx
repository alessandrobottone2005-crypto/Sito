import { motion } from "motion/react";

interface ProgressTrackerProps {
  completedCount: number;
  total: number;
}

export default function ProgressTracker({ completedCount, total }: ProgressTrackerProps) {
  return (
    <div className="flex items-center gap-8 px-6 py-3 relative">
      <div className="absolute inset-0 bg-gold/5 blur-xl -z-10" />
      
      <div className="flex flex-col items-start gap-2">
        <div className="text-[10px] md:text-xs tracking-[0.5em] text-gold/40 uppercase font-black font-mono">
          PROTOCOLLO WAYNE
        </div>
        <div className="flex gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`w-8 h-2 md:w-10 md:h-3 transition-all duration-700 relative rounded-sm ${i < completedCount ? 'bg-gold border border-gold shadow-[0_0_12px_rgba(250,204,21,0.8)]' : 'bg-white/5 border border-white/10'}`}
            >
              {i === completedCount && (
                <motion.div 
                  animate={{ opacity: [0.2, 0.8, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 bg-gold/30 rounded-sm"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-gold font-mono text-sm md:text-base font-black tabular-nums border-l border-white/10 pl-6 py-2">
        {completedCount} <span className="opacity-30">/</span> {total}
      </div>
    </div>
  );
}
