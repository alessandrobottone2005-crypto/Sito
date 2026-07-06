import { motion } from "motion/react";
import React, { useState } from "react";
import BatmanText from "../components/ui/BatmanText";
import BatmanButton from "../components/ui/BatmanButton";
import { CheckCircle2, Package, ShieldCheck, ChevronRight } from "lucide-react";

interface ThankYouPageProps {
  onReturnHome: () => void;
  onViewStatue: () => void;
  quantity?: number;
  totalPaid?: number;
}

function ThankYouPage({ onReturnHome, onViewStatue, quantity = 1, totalPaid = 0 }: ThankYouPageProps) {
  const [fakeOrderNumber] = useState(`ORD-BW-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`);
  const [fakeDate] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit' });
  });

  // La musica di sottofondo è gestita dal singleton BatcavernAudio
  // che continua senza interruzioni — nessuna istanza duplicata.

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="fixed inset-0 z-[200] bg-[#020202] overflow-hidden selection:bg-gold selection:text-black flex flex-col items-center justify-center"
    >
      {/* Background with Statue & Smoke/Glow Effects */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Cinematic Lighting */}
        <div className="absolute top-0 w-full h-[50vh] bg-gradient-to-b from-black via-transparent to-transparent opacity-80 z-10" />
        <div className="absolute bottom-0 w-full h-[50vh] bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.05)_0%,rgba(0,0,0,0.8)_60%,rgba(0,0,0,1)_100%)] z-0" />
        
        {/* Particles / Dust simulation (CSS base) */}
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] animate-[pulse_10s_linear_infinite] z-0" style={{ backgroundSize: '60px 60px' }} />

        {/* The Reward: Statue in background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 0.25, scale: 1, y: 0 }}
          transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
          className="relative w-full max-w-[800px] h-[80vh] flex items-center justify-center z-0"
        >
          <img 
            src="./assets/showreel/0800.webp" 
            alt="Reward Statue" 
            className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(250,204,21,0.3)] brightness-75 contrast-125"
            loading="lazy"
            decoding="async"
          />
          {/* Volumetric smoke overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black mix-blend-multiply opacity-60" />
        </motion.div>
      </div>

      {/* Content Center - Hero */}
      <div className="relative z-20 w-full max-w-4xl px-6 flex flex-col items-center text-center mt-10">
        
        <BatmanText delay={0.3}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-gold/30 bg-gold/5 text-[10px] font-mono text-gold tracking-[0.4em] uppercase mb-8 backdrop-blur-sm">
            <ShieldCheck size={12} className="animate-pulse" />
            Trasmissione Criptata // Rete Wayne
          </div>
        </BatmanText>

        <BatmanText delay={0.8}>
          <motion.h1 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase mb-6"
            style={{ textShadow: "0 0 40px rgba(255,255,255,0.1)" }}
          >
            Missione Completata.
          </motion.h1>
        </BatmanText>

        <BatmanText delay={1.2}>
          <p className="text-white/60 font-medium tracking-widest uppercase text-xs md:text-sm mb-16 max-w-2xl mx-auto leading-relaxed">
            Il tuo preordine della Batman 87th Anniversary Limited Edition è stato registrato con successo nei database Wayne.
          </p>
        </BatmanText>

        {/* Order Details - Tech Noir HUD Card */}
        <BatmanText delay={1.6}>
          <motion.div 
            className="relative w-full max-w-2xl mx-auto border border-white/10 bg-black/40 backdrop-blur-md p-6 md:p-8 text-left group overflow-hidden mb-16"
            whileHover={{ borderColor: "rgba(250,204,21,0.3)" }}
            transition={{ duration: 0.3 }}
          >
            {/* HUD Corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gold/50" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gold/50" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gold/50" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gold/50" />
            
            {/* Very light glow */}
            <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            {/* Glitch overlay line */}
            <div className="absolute top-0 left-0 w-full h-px bg-white/10 animate-[scan_4s_linear_infinite] opacity-50 pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 border-b border-white/5 pb-6 mb-6 relative z-10">
              <div>
                <div className="text-[9px] font-mono text-gold/60 uppercase tracking-widest mb-1">ID Transazione</div>
                <div className="text-white font-mono text-lg tracking-widest">{fakeOrderNumber}</div>
              </div>
              <div className="text-left md:text-right">
                <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1">Stato Protocollo</div>
                <div className="inline-flex items-center gap-2 text-[#FFD700] font-bold tracking-wider text-sm">
                  <CheckCircle2 size={14} />
                  PREORDINE CONFERMATO
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
              <div className="space-y-1">
                <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Package size={10} /> Prodotto
                </div>
                <div className="text-white text-xs font-bold uppercase tracking-wider">Batman 87th Anniversary</div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Quantità</div>
                <div className="text-white text-xs font-bold font-mono">x{quantity}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Data</div>
                <div className="text-white text-xs font-mono">{fakeDate}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Totale Pagato</div>
                <div className="text-white text-xs font-bold font-mono">€{totalPaid.toFixed(2)}</div>
              </div>
            </div>
          </motion.div>
        </BatmanText>

        {/* Final CTAs */}
        <BatmanText delay={2.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <BatmanButton
              variant="primary"
              size={20}
              onClick={onReturnHome}
            >
              <span className="flex items-center gap-2">
                Torna alla Batcaverna <ChevronRight size={14} />
              </span>
            </BatmanButton>
            
            <BatmanButton
              variant="ghost"
              size={20}
              onClick={onViewStatue}
            >
              Rivedi la Statua
            </BatmanButton>
          </div>
        </BatmanText>
      </div>
    </motion.div>
  );
}

export default React.memo(ThankYouPage);
