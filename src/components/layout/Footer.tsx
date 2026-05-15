import { motion } from "motion/react";

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#080808] py-20 px-10 border-t border-white/5 relative overflow-hidden">
       {/* Tactical Footer Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
             <img src="/assets/images/LogoSideshow.png" alt="Sideshow" className="h-10 w-auto object-contain" />
          </div>
          <p className="text-white/20 max-w-sm tracking-[0.2em] text-[10px] uppercase font-bold leading-relaxed">
            Partner di Produzione della Wayne Enterprises. <br />
            Sicurezza Tattica per il Guardiano Moderno.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-16">
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold text-[10px] uppercase tracking-[0.3em] mb-2 text-gold">Componenti</h4>
            <a href="#" className="text-white/30 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Bat_Suit_Mk_I</a>
            <a href="#" className="text-white/30 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Utility_Belt_Alpha</a>
            <a href="#" className="text-white/30 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Equip_Rack</a>
          </div>
          <div className="flex flex-col gap-6">
             <h4 className="text-white font-bold text-[10px] uppercase tracking-[0.3em] mb-2 text-gold">Protocolli</h4>
            <a href="#" className="text-white/30 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Sideshow_Net</a>
            <a href="#" className="text-white/30 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Privacy_Dati</a>
            <a href="#" className="text-white/30 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Linea_Supporto</a>
          </div>
          <div className="flex flex-col gap-6">
             <h4 className="text-white font-bold text-[10px] uppercase tracking-[0.3em] mb-2 text-gold">Connettiti</h4>
            <a href="#" className="text-white/30 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">IG: Sideshow</a>
            <a href="#" className="text-white/30 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">X: Bat_Sideshow</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <span className="text-white/10 text-[9px] tracking-[0.4em] uppercase font-mono">
          © 2026 SIDESHOW | DISTRETTO_DI_GOTHAM
        </span>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-white/30 text-[9px] tracking-widest uppercase font-mono">AES-256 BIT</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
              <span className="text-white/30 text-[9px] tracking-widest uppercase font-mono">LINK: OPERATIVO</span>
           </div>
        </div>
      </div>
    </footer>
  );
}
