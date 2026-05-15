import { motion } from "motion/react";
import BatmanText from "./BatmanText";
import { Shield, Eye, Smartphone } from "lucide-react";

const features = [
  {
    icon: <Eye className="w-10 h-10 text-gold" />,
    title: "Visione Notturna Avanzata",
    description: "Sensori CMOS di grado militare per una chiarezza assoluta anche nel buio totale. Nulla sfugge al Bat-Computer.",
  },
  {
    icon: <Shield className="w-10 h-10 text-gold" />,
    title: "Notifiche Intelligenti",
    description: "L'intelligenza artificiale integrata distingue tra minacce reali e rumore di fondo. Sicurezza senza compromessi.",
  },
  {
    icon: <Smartphone className="w-10 h-10 text-gold" />,
    title: "Accesso Remoto Ovunque",
    description: "App iOS e Android con crittografia end-to-end a 256-bit. Il tuo occhio su Gotham, ovunque tu sia.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-black py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <BatmanText className="text-center mb-16">
          <div className="text-gold text-[12px] font-mono mb-4 tracking-[0.5em] uppercase">CAPACITÀ_TATTICHE</div>
           <div className="w-16 h-[1px] bg-gold mx-auto mb-8" />
        </BatmanText>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <BatmanText key={feature.title} delay={index * 0.1}>
              <div className="group p-10 rounded-none bg-transparent border border-white/5 hover:border-gold/30 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20 group-hover:border-gold" />
                <div className="mb-8 text-gold opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-4 tracking-tighter uppercase">
                  {feature.title}
                </h3>
                <p className="text-white/40 text-[13px] leading-relaxed tracking-wider uppercase font-medium">
                  {feature.description}
                </p>
              </div>
            </BatmanText>
          ))}
        </div>
      </div>
    </section>
  );
}
