import { motion } from "motion/react";

export default function TransitionOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Background Dim */}
      <motion.div 
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.8, times: [0, 0.2, 0.8, 1] }}
      />

      {/* Vertical Shutter Panels */}
      <motion.div 
        className="absolute top-0 left-0 w-1/2 h-full bg-black border-r border-gold/10"
        initial={{ x: "-100%" }}
        animate={{ x: ["-100%", "0%", "0%", "-100%"] }}
        transition={{ duration: 0.8, times: [0, 0.35, 0.65, 1], ease: [0.77, 0, 0.175, 1] }}
      >
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gold/30 blur-sm" />
      </motion.div>
      <motion.div 
        className="absolute top-0 right-0 w-1/2 h-full bg-black border-l border-gold/10"
        initial={{ x: "100%" }}
        animate={{ x: ["100%", "0%", "0%", "100%"] }}
        transition={{ duration: 0.8, times: [0, 0.35, 0.65, 1], ease: [0.77, 0, 0.175, 1] }}
      >
        <div className="absolute inset-y-0 left-0 w-[1px] bg-gold/30 blur-sm" />
      </motion.div>

      {/* Horizontal Bar Accents */}
      <motion.div 
        className="absolute top-1/4 left-0 w-full h-[1px] bg-gold/20"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.8, times: [0.1, 0.3, 0.7, 0.9] }}
      />
      <motion.div 
        className="absolute bottom-1/4 left-0 w-full h-[1px] bg-gold/20"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.8, times: [0.1, 0.3, 0.7, 0.9] }}
      />

      {/* Central HUD Content */}
      <div className="relative z-20 flex flex-col items-center">
        {/* Animated Scanning Circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 1.2] }}
          transition={{ duration: 0.8, times: [0.2, 0.4, 0.6, 0.9] }}
          className="relative w-48 h-48 flex items-center justify-center"
        >
          {/* Outer Ring */}
          <div className="absolute inset-0 border border-gold/20 rounded-full" />
          
          {/* Rotating Segments */}
          <motion.div 
            className="absolute inset-2 border-t-2 border-r-2 border-gold rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-6 border-b-2 border-l-2 border-white/40 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner Crosshair */}
          <div className="w-8 h-[1px] bg-gold/50 absolute" />
          <div className="w-[1px] h-8 bg-gold/50 absolute" />
          
          {/* Corner Brackets (HUD style) */}
          <div className="absolute -top-4 -left-4 w-6 h-6 border-t border-l border-gold" />
          <div className="absolute -top-4 -right-4 w-6 h-6 border-t border-r border-gold" />
          <div className="absolute -bottom-4 -left-4 w-6 h-6 border-b border-l border-gold" />
          <div className="absolute -bottom-4 -right-4 w-6 h-6 border-b border-r border-gold" />
        </motion.div>

        {/* Text Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
          transition={{ duration: 0.8, times: [0.3, 0.45, 0.65, 0.85] }}
          className="mt-12 text-center"
        >
          <h2 className="text-gold font-black italic tracking-[0.5em] uppercase text-xl md:text-2xl glitch-slow">
            Inizializzazione
          </h2>
          <div className="text-white/40 font-mono text-[10px] tracking-[0.8em] uppercase mt-2">
            Accesso Protocollo Bat-Computer
          </div>
          
          {/* Loading Bar */}
          <div className="w-48 h-[2px] bg-white/10 mt-6 relative overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-gold shadow-[0_0_10px_#FFD700]"
              animate={{ left: ["-100%", "100%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: "40%" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Scanline Sweep (Global) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/5 to-transparent h-20 w-full"
        animate={{ top: ["-10%", "110%"] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
