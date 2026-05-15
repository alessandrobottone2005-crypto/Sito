import { motion } from "motion/react";

interface ExplosionOverlayProps {
  onReset: () => void;
}

export default function ExplosionOverlay({ onReset }: ExplosionOverlayProps) {
  return (
    <div className="fixed inset-0 z-[300000] flex items-center justify-center bg-black overflow-hidden">
      {/* 1. Freeze & Glitch Initial Phase */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ 
          opacity: [1, 0.8, 1, 0.5, 1],
          x: [0, -10, 10, -5, 5, 0],
          filter: ["none", "hue-rotate(90deg) contrast(200%)", "none"]
        }}
        transition={{ duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
        className="absolute inset-0 z-10"
      />

      {/* 2. Explosion Flash */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.1 }}
        className="absolute inset-0 z-20 explosion-flash"
      />

      {/* 3. Red Pulse / Aftermath */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.3, 0.8, 0] }}
        transition={{ delay: 0.6, duration: 2 }}
        className="absolute inset-0 z-15 bg-red-600"
      />

      {/* 4. Game Over Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="relative z-30 flex flex-col items-center text-center px-6"
      >
        <h2 className="text-red-600 text-6xl md:text-8xl font-black italic tracking-tighter mb-4 glitch-main uppercase">
          MISSIONE FALLITA
        </h2>
        <p className="text-white/60 text-sm md:text-base tracking-[0.5em] uppercase font-bold mb-12">
          La Batcaverna è stata distrutta.
        </p>
        
        <button
          onClick={onReset}
          className="group relative px-12 py-5 bg-red-600 text-white font-black rounded-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(220,38,38,0.6)]"
        >
          <span className="relative z-10 tracking-[0.4em] uppercase text-xs">Riprova la Missione</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />
        </button>
      </motion.div>

      {/* Cinematic Borders */}
      <div className="absolute inset-0 pointer-events-none z-40 border-[40px] border-black" />
    </div>
  );
}
