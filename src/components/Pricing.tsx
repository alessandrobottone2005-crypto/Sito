import { motion } from "motion/react";
import BatmanText from "./BatmanText";
import BatmanButton from "./BatmanButton";

export default function Pricing({ onPreorder }: { onPreorder: () => void }) {
  return (
    <section id="pricing" className="bg-black py-40 px-6 relative overflow-hidden border-t border-white/5">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        {/* Huge background text */}
        <BatmanText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
          <h2 className="text-[150px] md:text-[300px] font-black text-white/[0.03] tracking-tighter uppercase whitespace-nowrap">
            IL CAVALIERE OSCURO
          </h2>
        </BatmanText>

        {/* HUD Elements */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100px" }}
          className="h-[1px] bg-gold/50 mb-12"
        />

        <div className="text-center mb-16 relative">
          <BatmanText delay={0.1}>
            <span className="text-gold text-[10px] font-mono mb-4 tracking-[1em] uppercase block flicker">
              Accesso_Terminale // Approvato // GOTHAM_ROOT
            </span>
          </BatmanText>
          
          <BatmanText delay={0.2}>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase leading-none mb-6 glitch-med ghost-rgb">
              L'EREDITÀ <br /> <span className="text-transparent" style={{ WebkitTextStroke: "1px rgba(255, 215, 0, 0.4)" }}>È TUA</span>
            </h2>
          </BatmanText>
          
          <BatmanText delay={0.3}>
            <p className="max-w-xl mx-auto text-white/40 text-sm md:text-base font-medium tracking-wide uppercase leading-relaxed px-4 text-jump">
              Non è solo una statua. È il simbolo di una città che non si arrende mai. <br />
              Assicurati un pezzo di storia di Gotham.
            </p>
          </BatmanText>
        </div>

        {/* Premium Animated Button */}
        <BatmanButton
          onClick={onPreorder}
          variant="primary"
          showCorners={true}
          showGlow={true}
          className="scale-125 md:scale-150 my-12"
        >
          PREORDINA IL CAVALIERE
        </BatmanButton>

        {/* Extra HUD Data */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 text-center opacity-30">
          {[
            { label: "UNITÀ", value: "87/500", delay: 0.4 },
            { label: "STATO", value: "ULTIMA_CHIAMATA", delay: 0.5 },
            { label: "CERT.", value: "AUTENTICO", delay: 0.6 },
            { label: "PREZZO", value: "STIMA Q4", delay: 0.7 }
          ].map((item) => (
            <BatmanText key={item.label} delay={item.delay}>
              <div>
                <div className="text-[9px] font-mono text-gold mb-1">{item.label}</div>
                <div className="text-xs font-black text-white tracking-widest">{item.value}</div>
              </div>
            </BatmanText>
          ))}
        </div>
      </div>
    </section>
  );
}

