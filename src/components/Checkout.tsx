import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import BatmanText from "./BatmanText";
import BatmanButton from "./BatmanButton";
import { 
  ShieldCheck, Mail, User, MapPin, CreditCard, Apple, Wallet, 
  Landmark, ChevronRight, Info, MessageSquare, X, CheckCircle2, 
  Download, Package, Phone, Building2, CreditCard as CardIcon, 
  Loader2, Plus, Minus 
} from "lucide-react";

interface CheckoutProps {
  onClose: () => void;
}

const STATUE_PRICE = 700;
const SHIPPING_COST = 60;

export default function Checkout({ onClose }: CheckoutProps) {
  const [step, setStep] = useState<"form" | "loading" | "success">("form");
  const [quantity, setQuantity] = useState(1);
  const [showBilling, setShowBilling] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    civico: "",
    cap: "",
    city: "",
    provincia: "",
    nazione: "",
    billingAddress: "",
    cardNumber: "",
    cardExpiry: "",
    cardOwner: "",
    cardCvv: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const requiredFields = [
      "fullName", "email", "phone", "address", "civico", 
      "cap", "city", "provincia", "nazione", 
      "cardNumber", "cardExpiry", "cardOwner", "cardCvv"
    ];
    
    const allFilled = requiredFields.every(field => formData[field as keyof typeof formData].trim() !== "");
    
    if (showBilling && formData.billingAddress.trim() === "") return false;
    
    return allFilled;
  };

  const handlePurchase = () => {
    if (!isFormValid()) return;
    
    setStep("loading");
    
    // Simulate order preparation
    setTimeout(() => {
      setStep("success");
    }, 4000);
  };

  const totalPrice = (STATUE_PRICE * quantity) + SHIPPING_COST;

  const inputStyles = "w-full bg-white/[0.03] border border-white/10 focus:border-gold/50 focus:bg-gold/[0.02] p-4 text-sm text-white placeholder:text-white/10 outline-none transition-all uppercase font-mono tracking-wider";
  const labelStyles = "text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1 block mb-2";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black overflow-y-auto selection:bg-gold selection:text-black"
    >
      {/* Background HUD Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,215,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>

      <div className="relative min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.main 
              key="checkout-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-grow max-w-7xl mx-auto w-full px-6 py-12 md:py-20"
            >
              {/* Main Titles */}
              <div className="text-center mb-16">
                <BatmanText delay={0.1}>
                  <div className="inline-block px-4 py-1 border border-gold/30 bg-gold/5 text-[9px] font-mono text-gold tracking-[0.4em] uppercase mb-6">
                    Transazione Sicura // Protocollo 0800
                  </div>
                </BatmanText>
                <BatmanText delay={0.2}>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase mb-4 glitch-med ghost-rgb">
                    Protocollo di Acquisizione
                  </h1>
                </BatmanText>
                <BatmanText delay={0.3}>
                  <div className="flex items-center justify-center gap-2 text-white/30 text-[10px] font-mono tracking-widest uppercase flicker">
                    <ShieldCheck size={12} className="text-gold" />
                    Connessione crittografata end-to-end // RSA_ACTIVE
                  </div>
                </BatmanText>
              </div>

              <div className="grid lg:grid-cols-12 gap-16 items-start">
                {/* Left Column: Form */}
                <div className="lg:col-span-7 space-y-16">
                  {/* 1. Dati Personali */}
                  <section className="space-y-8">
                    <div className="flex items-center gap-3">
                      <User className="text-gold" size={18} />
                      <h2 className="text-xl font-bold tracking-wider text-white uppercase">1. Dati Personali e Contatto</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-1">
                        <label className={labelStyles}>Nome e Cognome</label>
                        <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="BRUCE WAYNE" className={inputStyles} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyles}>Indirizzo Email</label>
                        <input name="email" value={formData.email} onChange={handleInputChange} placeholder="OPERATIVE@NETWORK.COM" className={inputStyles} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyles}>Numero di Telefono</label>
                        <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+39 000 0000000" className={inputStyles} />
                      </div>
                    </div>
                  </section>

                  {/* 2. Dati di Spedizione */}
                  <section className="space-y-8">
                    <div className="flex items-center gap-3">
                      <MapPin className="text-gold" size={18} />
                      <h2 className="text-xl font-bold tracking-wider text-white uppercase">2. Dati di Spedizione</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-1">
                        <label className={labelStyles}>Via / Piazza</label>
                        <input name="address" value={formData.address} onChange={handleInputChange} placeholder="1007 MOUNTAIN DRIVE" className={inputStyles} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyles}>N. Civico</label>
                        <input name="civico" value={formData.civico} onChange={handleInputChange} placeholder="12" className={inputStyles} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyles}>CAP</label>
                        <input name="cap" value={formData.cap} onChange={handleInputChange} placeholder="12345" className={inputStyles} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyles}>Città</label>
                        <input name="city" value={formData.city} onChange={handleInputChange} placeholder="GOTHAM" className={inputStyles} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyles}>Provincia</label>
                        <input name="provincia" value={formData.provincia} onChange={handleInputChange} placeholder="GT" className={inputStyles} />
                      </div>
                      <div className="md:col-span-3 space-y-1">
                        <label className={labelStyles}>Nazione</label>
                        <input name="nazione" value={formData.nazione} onChange={handleInputChange} placeholder="STATI UNITI" className={inputStyles} />
                      </div>
                    </div>

                    <label className="flex items-center gap-3 mt-4 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={showBilling} 
                          onChange={() => setShowBilling(!showBilling)} 
                          className="sr-only peer" 
                        />
                        <div className="w-5 h-5 border border-white/20 bg-white/5 group-hover:border-gold/50 transition-colors peer-checked:bg-gold peer-checked:border-gold" />
                        <ChevronRight className="absolute inset-0 text-black opacity-0 peer-checked:opacity-100 transition-opacity" size={20} />
                      </div>
                      <span className="text-[10px] font-mono text-white/40 group-hover:text-white/70 transition-colors uppercase tracking-widest">
                        Indirizzo di fatturazione diverso da quello di spedizione
                      </span>
                    </label>

                    {showBilling && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="pt-4"
                      >
                        <label className={labelStyles}>Indirizzo di Fatturazione</label>
                        <input name="billingAddress" value={formData.billingAddress} onChange={handleInputChange} placeholder="INSERISCI INDIRIZZO COMPLETO" className={inputStyles} />
                      </motion.div>
                    )}
                  </section>

                  {/* 3. Dati di Pagamento */}
                  <section className="space-y-8">
                    <div className="flex items-center gap-3">
                      <CardIcon className="text-gold" size={18} />
                      <h2 className="text-xl font-bold tracking-wider text-white uppercase">3. Dati di Pagamento</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-1">
                        <label className={labelStyles}>Numero Carta</label>
                        <input name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="0000 0000 0000 0000" className={inputStyles} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyles}>Data di Scadenza</label>
                        <input name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} placeholder="MM/AA" className={inputStyles} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyles}>CVV/CVC</label>
                        <input name="cardCvv" value={formData.cardCvv} onChange={handleInputChange} placeholder="000" className={inputStyles} />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className={labelStyles}>Nome Intestatario</label>
                        <input name="cardOwner" value={formData.cardOwner} onChange={handleInputChange} placeholder="BRUCE WAYNE" className={inputStyles} />
                      </div>
                    </div>
                  </section>

                  {/* Submit Section */}
                  <div className="pt-8 space-y-6">
                    <BatmanButton
                      variant={isFormValid() ? "secondary" : "ghost"}
                      className="w-full"
                      showScanLine={isFormValid()}
                      onClick={handlePurchase}
                      disabled={!isFormValid()}
                    >
                      <div className="flex items-center gap-4 py-2">
                        {isFormValid() ? "Completa Acquisto" : "Inserisci tutti i dati per procedere"}
                        {isFormValid() && <ChevronRight size={20} />}
                      </div>
                    </BatmanButton>
                    {!isFormValid() && (
                      <p className="text-center text-[9px] font-mono text-red-500/50 uppercase tracking-widest animate-pulse">
                        Sistemi in attesa: Dati necessari incompleti
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column: Summary */}
                <div className="lg:col-span-5">
                  <div className="border border-white/10 bg-white/[0.02] p-8 md:p-12 sticky top-32 space-y-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Info className="text-gold" size={16} />
                        <h2 className="text-lg font-bold tracking-wider text-white uppercase">Riepilogo Ordine</h2>
                      </div>
                      <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-1">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-mono font-bold text-gold">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(Math.min(2, quantity + 1))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-6 pb-10 border-b border-white/5">
                      <div className="w-32 h-32 bg-black border border-white/10 flex items-center justify-center p-2 group relative overflow-hidden">
                        <img 
                          src="0800.png" 
                          alt="Batman Statue" 
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex flex-col justify-center gap-2">
                        <h3 className="font-bold text-white uppercase tracking-wider">Statua Tattica di Batman</h3>
                        <div className="text-[10px] font-mono text-white/40 tracking-widest">SCALA: 1/4 | MAT: RESINA</div>
                        <div className="text-gold font-mono font-bold mt-2">€{STATUE_PRICE.toLocaleString()},00 x {quantity}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-[11px] font-mono tracking-widest uppercase">
                        <span className="text-white/40">Subtotale</span>
                        <span className="text-white">€{(STATUE_PRICE * quantity).toLocaleString()},00</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-mono tracking-widest uppercase">
                        <span className="text-white/40">Spedizione Tattica</span>
                        <span className="text-white">€{SHIPPING_COST.toLocaleString()},00</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-white/10 pt-8">
                      <span className="text-xl font-black text-white uppercase tracking-tighter">Totale</span>
                      <div className="text-right">
                        <div className="text-3xl font-black text-gold tracking-tighter">€{totalPrice.toLocaleString()},00</div>
                      </div>
                    </div>

                    <div className="bg-white/[0.03] border border-white/5 p-4 flex items-center gap-4">
                      <ShieldCheck className="text-gold" size={24} />
                      <div className="text-[9px] font-mono text-white/50 leading-relaxed uppercase tracking-widest">
                        Crittografia a 256-bit attiva. Limite di 2 unità per protocollo di sicurezza.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.main>
          )}

          {step === "loading" && (
            <motion.main
              key="loading-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="relative w-32 h-32 mb-12">
                <Loader2 className="w-full h-full text-gold animate-spin stroke-[1px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border border-gold/20 animate-ping rounded-full" />
                </div>
              </div>
              <BatmanText delay={0.2}>
                <h2 className="text-2xl font-bold text-white uppercase tracking-[0.3em] mb-4">Protocollo in Preparazione</h2>
              </BatmanText>
              <BatmanText delay={0.4}>
                <div className="text-[10px] font-mono text-gold/60 uppercase tracking-[0.2em] space-y-2">
                  <p>Inizializzazione server Wayne...</p>
                  <p>Crittografia dati transazione...</p>
                  <p>Allocazione inventario tattico...</p>
                </div>
              </BatmanText>
            </motion.main>
          )}

          {step === "success" && (
            <motion.main
              key="success-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex-grow flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto py-20 md:py-40"
            >
              <BatmanText delay={0.2}>
                <div className="mb-12 relative">
                  <div className="absolute inset-0 bg-gold/20 blur-[60px] animate-pulse" />
                  <div className="relative w-24 h-24 border-2 border-gold flex items-center justify-center mx-auto">
                    <CheckCircle2 size={48} className="text-gold" />
                    <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-gold/50" />
                    <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-gold/50" />
                  </div>
                </div>
              </BatmanText>

              <BatmanText delay={0.4}>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase mb-6 glitch-med ghost-rgb">
                  Grazie per l'acquisto
                </h1>
              </BatmanText>

              <BatmanText delay={0.6}>
                <p className="text-gold/60 font-mono tracking-[0.2em] uppercase text-sm mb-12 max-w-xl mx-auto leading-relaxed">
                  Il tuo ordine di {quantity} {quantity === 1 ? "statua" : "statue"} è stato ricevuto. 
                  Il protocollo di spedizione è stato attivato per il valore di €{totalPrice.toLocaleString()},00.
                </p>
              </BatmanText>

              <div className="grid md:grid-cols-2 gap-8 w-full max-w-2xl mb-16">
                <BatmanText delay={0.8}>
                  <div className="border border-white/10 bg-white/[0.02] p-6 text-left space-y-4">
                    <div className="flex items-center gap-2 text-gold/40 text-[10px] font-mono uppercase tracking-widest">
                      <Package size={12} />
                      Stato Spedizione
                    </div>
                    <div className="text-white font-bold uppercase tracking-wider">In fase di preparazione</div>
                    <div className="w-full bg-white/5 h-1 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "15%" }}
                        transition={{ duration: 2, delay: 1 }}
                        className="h-full bg-gold"
                      />
                    </div>
                  </div>
                </BatmanText>

                <BatmanText delay={1.0}>
                  <div className="border border-white/10 bg-white/[0.02] p-6 text-left space-y-4">
                    <div className="flex items-center gap-2 text-gold/40 text-[10px] font-mono uppercase tracking-widest">
                      <Download size={12} />
                      Documentazione
                    </div>
                    <div className="text-white font-bold uppercase tracking-wider">Ricevuta Criptata</div>
                    <BatmanButton variant="ghost" className="w-full !px-2">SCARICA PDF</BatmanButton>
                  </div>
                </BatmanText>
              </div>

              <BatmanText delay={1.2}>
                <div className="space-y-6">
                  <div className="text-[10px] font-mono text-white/20 tracking-widest uppercase">
                    La missione continua. Controlla la tua email per gli aggiornamenti tattici.
                  </div>
                  <BatmanButton 
                    variant="primary" 
                    showCorners={true}
                    onClick={onClose}
                  >
                    TORNA ALLA BASE
                  </BatmanButton>
                </div>
              </BatmanText>

              <div className="fixed inset-0 pointer-events-none -z-10 opacity-20">
                 <div className="absolute top-1/4 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-gold/50 to-transparent" />
                 <div className="absolute top-1/4 left-1/4 w-32 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                 <div className="absolute bottom-1/4 right-1/4 w-px h-32 bg-gradient-to-b from-transparent via-gold/50 to-transparent" />
                 <div className="absolute bottom-1/4 right-1/4 w-32 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
              </div>
            </motion.main>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 px-6 bg-black">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-[10px] font-mono text-white/20 tracking-widest uppercase text-center md:text-left">
              © Wayne Enterprises Defense Industries. Tutti i diritti riservati.
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {["Protocolli di sicurezza", "Politica di reso", "Crittografia dei dati", "Chat Live"].map((link) => (
                <BatmanButton key={link} variant="ghost">
                  {link}
                </BatmanButton>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
