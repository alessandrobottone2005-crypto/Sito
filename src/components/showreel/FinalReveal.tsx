import { motion } from "motion/react";
import { useState } from "react";
import TechBackground from "../ui/TechBackground";

interface FinalRevealProps {
  timeTaken: number;
  onComplete: () => void;
  isPaused?: boolean;
}

export default function FinalReveal({ timeTaken, onComplete, isPaused }: FinalRevealProps) {
  const [copied, setCopied] = useState(false);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };



  const handleCopy = () => {
    const text = `Ho disinnescato la bomba del Joker nella Batcaverna in ${formatSeconds(timeTaken)}! Sblocca la tua statua Wayne Tech.`;
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
          className="w-full flex flex-col items-center gap-12 text-center"
        >
          {/* Top: Congratulations */}
          <div className="flex flex-col items-center text-center space-y-6 w-full">
            <span className="text-gold text-sm font-mono tracking-[0.4em] uppercase block">
              Wayne Tech // Analisi Post-Missione
            </span>
            <h1 className="text-6xl md:text-8xl font-black italic text-white tracking-tighter uppercase glitch-med leading-none">
              BOMBA <br />
              <span className="text-gold">DISINNESCATA</span>
            </h1>
            <p className="text-white/80 text-lg md:text-2xl leading-relaxed max-w-3xl font-medium">
              “Complimenti, Bats… Per una volta non era mia intenzione farti saltare in aria. Goditi pure la tua preziosa reliquia — te la sei guadagnata.”
            </p>
            
            <div className="bg-gold/5 border border-gold/20 p-6 w-full max-w-lg font-mono text-center space-y-3">
              <div className="text-xs text-gold/60 uppercase tracking-widest">Tempo di Completamento</div>
              <div className="text-4xl md:text-5xl font-black text-white">{formatSeconds(timeTaken)}</div>
              {timeTaken < 90 && timeTaken > 0 && (
                <div className="text-[9px] text-green-400 uppercase tracking-wider font-bold animate-pulse">
                  VELOCITÀ LEGGENDARIA: SCONTO 15% SBLOCCATO
                </div>
              )}
              <button
                onClick={handleCopy}
                className="mt-2 text-[9px] text-white/50 hover:text-white underline uppercase tracking-widest transition-colors block text-left"
              >
                {copied ? "Link Copiato!" : "Copia il Risultato & Condividi"}
              </button>
            </div>

            <button
              onClick={onComplete}
              className="mt-6 px-12 py-6 bg-gold text-black font-black uppercase tracking-widest text-base md:text-xl hover:bg-white hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all pointer-events-auto">
              Scopri la Statua
            </button>
          </div>


        </motion.div>
      </div>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 pointer-events-none z-20 border-[40px] border-black" />
      <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_30%,black_100%)]" />
      <div className="absolute inset-0 pointer-events-none z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
    </div>
  );
}
