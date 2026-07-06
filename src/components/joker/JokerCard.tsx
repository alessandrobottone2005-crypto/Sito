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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPaused) return;
    onClose();
  };

  const handleOptionClick = (option: string) => {
    if (isSolved || isPaused || error) return;

    setSelectedOption(option);

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
      
      setTimeout(() => {
        setError(false);
        setSelectedOption(null);
      }, 600);
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
        {/* ── FRONT SIDE (Retro Carta) ─────────────────────────────── */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-black rounded-2xl overflow-hidden shadow-2xl group">
          <img 
            src="./assets/images/JollyJokerCard_Front.jpg" 
            alt="Joker Hint" 
            className="absolute inset-0 w-full h-full object-cover opacity-90 scale-105"
          />
          
          {/* Pulsing Purple Glow Border */}
          <motion.div 
            className="absolute inset-0 border-2 border-joker rounded-2xl pointer-events-none"
            animate={{ 
              opacity: [0.5, 1, 0.5],
              boxShadow: [
                "inset 0 0 30px rgba(102, 0, 197, 0.4), 0 0 20px rgba(102, 0, 197, 0.3)",
                "inset 0 0 60px rgba(102, 0, 197, 0.8), 0 0 50px rgba(102, 0, 197, 0.9)",
                "inset 0 0 30px rgba(102, 0, 197, 0.4), 0 0 20px rgba(102, 0, 197, 0.3)"
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

        {/* ── BACK SIDE (Single Column Figma Layout) ─────────────────────────────── */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 overflow-hidden rounded-2xl transition-all duration-500
            ${isSolved
              ? "border-transparent shadow-[0_0_100px_rgba(57,255,20,0.8)]"
              : error
              ? "border-transparent shadow-[0_0_100px_rgba(255,0,0,0.8)]"
              : "border-transparent shadow-[0_0_50px_rgba(102,0,197,0.15)]"
            }`}
          style={{ background: "#000" }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <img 
              src="./assets/images/JollyJokerCard_Back.jpg" 
              alt="Card Background" 
              className="w-full h-full object-cover scale-105"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-8">
            {/* Badges Overlay */}
            <div className="absolute top-10 left-0 right-0 flex justify-center z-50">
              <AnimatePresence mode="wait">
                {isSolved && (
                  <motion.div
                    key="correct"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      background: "#39FF14",
                      color: "#010013",
                      padding: "10px 20px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontFamily: "Space Grotesk",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      boxShadow: "0 0 20px rgba(57, 255, 20, 0.4)"
                    }}
                  >
                    RISPOSTA CORRETTA
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      background: "#FF0000",
                      color: "#010013",
                      padding: "10px 20px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontFamily: "Space Grotesk",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      boxShadow: "0 0 20px rgba(255, 0, 0, 0.4)"
                    }}
                  >
                    RISPOSTA ERRATA
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                color: "#FFFFFF",
                fontSize: 18,
                fontFamily: "Space Grotesk",
                fontWeight: 400,
                lineHeight: "24px",
                wordWrap: "break-word",
                fontStyle: "italic",
                marginBottom: "2.5rem",
                padding: "0 10px"
              }}
            >
              {`"${riddle}"`}
            </div>

            {/* Options */}
            <div className="w-full flex flex-col gap-3 px-2" role="group" aria-label={riddle}>
              {options.map((option, idx) => {
                const isCorrectAndSolved = isSolved && option === correctAnswer;
                const isSelected = selectedOption === option;
                const isErrorState = error && isSelected;
                
                // Determine styling based on state
                let bgStyle = "var(--primary-active-riddle, #FAF9F6)";
                let outlineStyle = "1px solid var(--on-primary-stroke-active-riddle, #010013)";
                let boxShadowStyle = "none";
                
                if (isCorrectAndSolved) {
                  bgStyle = "#39FF14"; // Bright green
                  outlineStyle = "2px solid #1A800A";
                  boxShadowStyle = "0 0 20px rgba(57, 255, 20, 0.6)";
                } else if (isErrorState) {
                  bgStyle = "#FF0000"; // Bright red
                  outlineStyle = "2px solid #8B0000";
                  boxShadowStyle = "0 0 20px rgba(255, 0, 0, 0.6)";
                }

                return (
                  <motion.button
                    key={idx}
                    role="option"
                    aria-disabled={isSolved}
                    whileHover={!isSolved && !error ? { scale: 1.02 } : undefined}
                    whileTap={!isSolved && !error ? { scale: 0.98 } : undefined}
                    onClick={(e) => {
                      if (isSolved) return;
                      e.stopPropagation();
                      handleOptionClick(option);
                    }}
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      background: bgStyle,
                      borderRadius: 6,
                      outline: outlineStyle,
                      outlineOffset: "-1px",
                      boxShadow: boxShadowStyle,
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      cursor: isSolved ? "default" : "pointer",
                      transition: "all 0.2s ease",
                      position: "relative",
                      overflow: "hidden"
                    }}
                    className="group"
                  >
                    {/* Hover Purple Line */}
                    {!isSolved && !error && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#6600C5] opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    
                    <div
                      style={{
                        color: "var(--on-primary-active-riddle, #010013)", // Text is always black
                        fontSize: 14,
                        fontFamily: "Space Grotesk",
                        fontWeight: 400,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        position: "relative",
                        zIndex: 10
                      }}
                    >
                      {option}
                    </div>

                    {/* Micro-glow background on hover */}
                    {!isSolved && !error && (
                      <div className="absolute inset-0 bg-[#29004F]/0 group-hover:bg-[#29004F]/5 transition-colors" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Error message moved to top */}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
