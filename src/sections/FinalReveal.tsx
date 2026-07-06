import { motion } from "motion/react";
import React, { useState } from "react";
import TechBackground from "../components/ui/TechBackground";
import BatmanButton from "../components/ui/BatmanButton";

interface FinalRevealProps {
  timeTaken: number; // secondi effettivi trascorsi
  onComplete: () => void;
  isPaused?: boolean;
}

function FinalReveal({ timeTaken, onComplete, isPaused }: FinalRevealProps) {
  const [copied, setCopied] = useState(false);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isSpeedrun = timeTaken > 0 && timeTaken < 90;

  // Rating basato sul tempo
  const getRating = () => {
    if (timeTaken <= 0) return { label: "---", color: "#ffffff" };
    if (timeTaken < 60) return { label: "LEGGENDARIO", color: "#FFD700" };
    if (timeTaken < 90) return { label: "ECCELLENTE", color: "#4ade80" };
    if (timeTaken < 120) return { label: "BUONO", color: "#60a5fa" };
    if (timeTaken < 150) return { label: "NELLA NORMA", color: "#a78bfa" };
    return { label: "AL LIMITE", color: "#f87171" };
  };

  const rating = getRating();

  const handleCopy = () => {
    const text = `Ho disinnescato la bomba del Joker nella Batcaverna in ${formatSeconds(timeTaken)}! ${isSpeedrun ? "⚡ SPEEDRUN LEGGENDARIA — " : ""}Sblocca la tua statua Wayne Tech.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden">
      <TechBackground />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center max-h-screen overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full flex flex-col items-center gap-10 text-center"
        >
          {/* Badge top */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="text-gold text-sm font-mono tracking-[0.4em] uppercase block">
              Wayne Tech // Analisi Post-Missione
            </span>
          </motion.div>

          {/* Titolo vittoria */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-6xl md:text-8xl font-black italic text-white tracking-tighter uppercase glitch-med leading-none"
          >
            BOMBA <br />
            <span className="text-gold">DISINNESCATA</span>
          </motion.h1>

          {/* Quote Joker */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl font-medium italic"
          >
            "Complimenti, Bats… Per una volta non era mia intenzione farti saltare in aria.
            Goditi pure la tua preziosa reliquia — te la sei guadagnata."
          </motion.p>

          {/* ── SCORE CARD ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-lg"
          >
            <div
              style={{
                background: "rgba(0,0,0,0.85)",
                border: `2px solid ${rating.color}`,
                borderRadius: 18,
                boxShadow: `0 0 40px ${rating.color}40, 0 0 80px ${rating.color}20`,
                padding: "40px 48px",
              }}
              className="flex flex-col items-center gap-4"
            >
              {/* Label */}
              <div
                style={{ color: rating.color, textShadow: `0 0 14px ${rating.color}` }}
                className="text-[11px] font-mono tracking-[0.5em] uppercase font-bold"
              >
                TEMPO DI COMPLETAMENTO
              </div>

              {/* Timer display */}
              <motion.div
                animate={{
                  textShadow: [
                    `0 0 20px ${rating.color}80`,
                    `0 0 40px ${rating.color}cc`,
                    `0 0 20px ${rating.color}80`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  fontFamily: "Space Grotesk, monospace",
                  fontSize: "clamp(64px, 12vw, 100px)",
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "0.06em",
                  color: "#ffffff",
                  textShadow: `0 0 30px ${rating.color}80`,
                }}
              >
                {timeTaken > 0 ? formatSeconds(timeTaken) : "--:--"}
              </motion.div>

              {/* Rating label */}
              <div
                style={{ color: rating.color, textShadow: `0 0 10px ${rating.color}` }}
                className="text-lg font-black tracking-widest uppercase"
              >
                {rating.label}
              </div>

              {/* Speedrun badge */}
              {isSpeedrun && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/40 px-4 py-2 rounded-full"
                >
                  <span className="text-[#FFD700] text-xs font-mono tracking-wider uppercase font-bold animate-pulse">
                    ⚡ SPEEDRUN — SCONTO 15% SBLOCCATO
                  </span>
                </motion.div>
              )}

              {/* Condividi */}
              <BatmanButton
                variant="ghost"
                size={12}
                onClick={handleCopy}
                className="mt-2"
              >
                {copied ? "✓ Copiato!" : "Copia & Condividi il Risultato"}
              </BatmanButton>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <BatmanButton
              variant="primary"
              size={20}
              onClick={onComplete}
              disabled={isPaused}
              className="pointer-events-auto min-w-[280px]"
            >
              Scopri la Statua
            </BatmanButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 pointer-events-none z-20 border-[40px] border-black" />
      <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_30%,black_100%)]" />
      <div className="absolute inset-0 pointer-events-none z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
    </div>
  );
}

export default React.memo(FinalReveal);
