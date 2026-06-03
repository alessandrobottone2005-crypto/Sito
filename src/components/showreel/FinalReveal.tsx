import { motion } from "motion/react";
import { useState, useMemo } from "react";
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

  const leaderboard = useMemo(() => {
    const list = [
      { name: "Agente 009", time: 42 },
      { name: "Agente 003", time: 54 },
      { name: "Agente 012", time: 65 },
      { name: "Agente 007", time: 72 },
      { name: "Agente 015", time: 81 },
      { name: "Agente 004", time: 90 },
      { name: "Agente 008", time: 105 },
      { name: "Agente 011", time: 122 },
      { name: "Agente 002", time: 135 },
      { name: "Agente 014", time: 158 },
    ];
    if (timeTaken > 0) {
      list.push({ name: "TU (AGENTE)", time: timeTaken });
    }
    return list.sort((a, b) => a.time - b.time).slice(0, 10);
  }, [timeTaken]);

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
            
            {timeTaken > 0 && (
              <div className="bg-gold/5 border border-gold/20 p-6 w-full max-w-lg font-mono text-center space-y-3">
                <div className="text-xs text-gold/60 uppercase tracking-widest">Tempo di Completamento</div>
                <div className="text-4xl md:text-5xl font-black text-white">{formatSeconds(timeTaken)}</div>
                {timeTaken < 90 && (
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
            )}

            <button
              onClick={onComplete}
              className="mt-6 px-12 py-6 bg-gold text-black font-black uppercase tracking-widest text-base md:text-xl hover:bg-white hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all pointer-events-auto">
              Scopri la Statua
            </button>
          </div>

          {/* Leaderboard below */}
          <div className="border border-white/10 bg-black/60 p-6 md:p-10 backdrop-blur-md rounded-sm w-full max-w-2xl flex flex-col gap-4 max-h-[450px] overflow-y-auto pointer-events-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-sm font-mono text-gold tracking-widest uppercase font-bold">Classifica Agenti</span>
              <span className="text-xs font-mono text-white/40 uppercase">Top 10 — Rete Wayne</span>
            </div>

            <div className="space-y-2">
              {leaderboard.map((agent, index) => {
                const isUser = agent.name === "TU (AGENTE)";
                return (
                  <div 
                    key={index} 
                    className={`flex justify-between items-center py-2 px-3 font-mono text-xs transition-colors rounded-sm
                      ${isUser ? 'bg-gold/15 border border-gold/40 text-gold' : 'text-white/70 border border-transparent hover:bg-white/5'}
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <span className="opacity-40 text-[9px]">{(index + 1).toString().padStart(2, '0')}</span>
                      <span className={isUser ? 'font-bold' : ''}>{agent.name}</span>
                    </span>
                    <span className={`font-bold ${isUser ? 'text-gold' : 'text-white/50'}`}>
                      {formatSeconds(agent.time)}
                    </span>
                  </div>
                );
              })}
            </div>
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
