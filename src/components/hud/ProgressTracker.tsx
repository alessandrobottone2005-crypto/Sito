import { motion } from "motion/react";

interface ProgressTrackerProps {
  completedCount: number;
  total: number;
}

export default function ProgressTracker({ completedCount, total }: ProgressTrackerProps) {
  return (
    <div className="flex items-center gap-6 px-4 py-2 relative">
      <div className="absolute inset-0 bg-gold/5 blur-xl -z-10" />
      
      <div className="flex flex-col items-start gap-1">
        <div className="text-[7px] tracking-[0.5em] text-gold/40 uppercase font-black font-mono">
          PROTOCOLLO WAYNE
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`w-5 h-1.5 border-r transition-all duration-700 relative ${i < completedCount ? 'bg-gold border-gold shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'bg-white/5 border-white/10'}`}
            >
              {i === completedCount && (
                <motion.div 
                  animate={{ opacity: [0.2, 0.8, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 bg-gold/30"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-gold font-mono text-[10px] font-black tabular-nums border-l border-white/10 pl-4 py-1">
        {completedCount} <span className="opacity-30">/</span> {total}
      </div>
    </div>
  );
}
