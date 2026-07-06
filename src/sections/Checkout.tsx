import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import BatmanText from "../components/ui/BatmanText";
import BatmanButton from "../components/ui/BatmanButton";
import { FormInput } from "../components/ui/FormInput";
import { 
  ShieldCheck, Mail, User, MapPin, CreditCard, Apple, Wallet, 
  Landmark, ChevronRight, Info, MessageSquare, X, CheckCircle2, 
  Download, Package, Phone, Building2, CreditCard as CardIcon, 
  Loader2, Plus, Minus 
} from "lucide-react";

interface CheckoutProps {
  speedrunUnlocked?: boolean;
  onClose: () => void;
  onSuccess?: (quantity: number, totalPrice: number) => void;
}

const STATUE_PRICE = 700;
const SHIPPING_COST = 60;

export default React.memo(function Checkout({ speedrunUnlocked = false, onClose, onSuccess }: CheckoutProps) {
  const [step, setStep] = useState<"form" | "loading">("form");
  const [quantity, setQuantity] = useState(1);
  const [showBilling, setShowBilling] = useState(false);
  
  // Promo code states
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    if (speedrunUnlocked) {
      setPromoCode("SPEEDRUN15");
      setAppliedDiscount(0.15);
    }
  }, [speedrunUnlocked]);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "SPEEDRUN15") {
      setAppliedDiscount(0.15);
      setPromoError("");
    } else {
      setPromoError("Codice promozionale non valido");
      setAppliedDiscount(0);
    }
  };
  
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
    if (!allFilled) return false;
    
    if (showBilling && formData.billingAddress.trim() === "") return false;
    
    // Regex validations
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const capValid = /^[0-9]{5}$/.test(formData.cap);
    const cardNumValid = /^[0-9\s]{16,19}$/.test(formData.cardNumber);
    const expiryValid = /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(formData.cardExpiry);
    const cvvValid = /^[0-9]{3,4}$/.test(formData.cardCvv);
    
    return emailValid && capValid && cardNumValid && expiryValid && cvvValid;
  };

  const handlePurchase = () => {
    if (!isFormValid()) return;
    
    setStep("loading");
    
    // Simulate order preparation
    setTimeout(() => {
      if (onSuccess) {
        const subtotal = STATUE_PRICE * quantity;
        const discountAmount = subtotal * appliedDiscount;
        const finalTotal = subtotal - discountAmount + SHIPPING_COST;
        onSuccess(quantity, finalTotal);
      }
    }, 4000);
  };

  const subtotal = STATUE_PRICE * quantity;
  const discountAmount = subtotal * appliedDiscount;
  const totalPrice = subtotal - discountAmount + SHIPPING_COST;

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
                      <FormInput containerClassName="md:col-span-2" label="Nome e Cognome" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="BRUCE WAYNE" />
                      <FormInput label="Indirizzo Email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="OPERATIVE@NETWORK.COM" />
                      <FormInput label="Numero di Telefono" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+39 000 0000000" />
                    </div>
                  </section>

                  {/* 2. Dati di Spedizione */}
                  <section className="space-y-8">
                    <div className="flex items-center gap-3">
                      <MapPin className="text-gold" size={18} />
                      <h2 className="text-xl font-bold tracking-wider text-white uppercase">2. Dati di Spedizione</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      <FormInput containerClassName="md:col-span-2" label="Via / Piazza" name="address" value={formData.address} onChange={handleInputChange} placeholder="1007 MOUNTAIN DRIVE" />
                      <FormInput label="N. Civico" name="civico" value={formData.civico} onChange={handleInputChange} placeholder="12" />
                      <FormInput label="CAP" name="cap" type="text" pattern="[0-9]{5}" maxLength={5} value={formData.cap} onChange={handleInputChange} placeholder="12345" />
                      <FormInput label="Città" name="city" value={formData.city} onChange={handleInputChange} placeholder="GOTHAM" />
                      <FormInput label="Provincia" name="provincia" value={formData.provincia} onChange={handleInputChange} placeholder="GT" />
                      <FormInput containerClassName="md:col-span-3" label="Nazione" name="nazione" value={formData.nazione} onChange={handleInputChange} placeholder="STATI UNITI" />
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
                        <FormInput label="Indirizzo di Fatturazione" name="billingAddress" value={formData.billingAddress} onChange={handleInputChange} placeholder="INSERISCI INDIRIZZO COMPLETO" />
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
                      <FormInput containerClassName="md:col-span-2" label="Numero Carta" name="cardNumber" type="text" pattern="[0-9\s]{16,19}" maxLength={19} value={formData.cardNumber} onChange={handleInputChange} placeholder="0000 0000 0000 0000" />
                      <FormInput label="Data di Scadenza" name="cardExpiry" type="text" pattern="(0[1-9]|1[0-2])\/[0-9]{2}" maxLength={5} value={formData.cardExpiry} onChange={handleInputChange} placeholder="MM/AA" />
                      <FormInput label="CVV/CVC" name="cardCvv" type="text" pattern="[0-9]{3,4}" maxLength={4} value={formData.cardCvv} onChange={handleInputChange} placeholder="000" />
                      <FormInput containerClassName="md:col-span-2" label="Nome Intestatario" name="cardOwner" value={formData.cardOwner} onChange={handleInputChange} placeholder="BRUCE WAYNE" />
                    </div>
                  </section>

                  {/* Submit Section */}
                  <div className="pt-8 space-y-6">
                    <BatmanButton
                      variant={isFormValid() ? "secondary" : "ghost"}
                      className="w-full"
                      onClick={handlePurchase}
                      disabled={!isFormValid()}
                    >
                      <div className="flex items-center gap-4 py-2">
                        {isFormValid() ? "Completa Acquisto" : "Inserisci tutti i dati per procedere"}
                        {isFormValid() && <ChevronRight size={20} />}
                      </div>
                    </BatmanButton>
                    {!isFormValid() && (
                      <p className="text-center text-[9px] font-mono text-white/40 uppercase tracking-widest animate-pulse">
                        Protocollo in attesa: dati di missione incompleti
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
                        <BatmanButton 
                          variant="ghost"
                          size={12}
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <Minus size={14} />
                        </BatmanButton>
                        <span className="w-8 text-center font-mono font-bold text-gold">{quantity}</span>
                        <BatmanButton 
                          variant="ghost"
                          size={12}
                          onClick={() => setQuantity(Math.min(2, quantity + 1))}
                        >
                          <Plus size={14} />
                        </BatmanButton>
                      </div>
                    </div>

                    <div className="flex gap-6 pb-10 border-b border-white/5">
                      <div className="w-32 h-32 bg-black border border-white/10 flex items-center justify-center p-2 group relative overflow-hidden">
                        <img 
                          src="./assets/showreel/0800.webp" 
                          alt="Batman Statue" 
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex flex-col justify-center gap-2">
                        <h3 className="font-bold text-white uppercase tracking-wider">Batman 87th Anniversary — Statua in Edizione Limitata</h3>
                        <div className="text-[10px] font-mono text-white/40 tracking-widest">SCALA: 1/4 | MAT: RESINA</div>
                        <div className="text-gold font-mono font-bold mt-2">€{STATUE_PRICE.toLocaleString()},00 x {quantity}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-[11px] font-mono tracking-widest uppercase">
                        <span className="text-white/40">Subtotale</span>
                        <span className="text-white">€{subtotal.toLocaleString()},00</span>
                      </div>
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-[11px] font-mono tracking-widest uppercase text-[#FFD700]">
                          <span>Sconto Speedrunner (15%)</span>
                          <span>-€{discountAmount.toLocaleString()},00</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[11px] font-mono tracking-widest uppercase">
                        <span className="text-white/40">Spedizione Tattica</span>
                        <span className="text-white">€{SHIPPING_COST.toLocaleString()},00</span>
                      </div>
                    </div>

                    {/* Promo Code Input */}
                    <div className="border-t border-white/10 pt-6 space-y-3 pointer-events-auto">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                        Codice Promozionale
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="SPEEDRUN15"
                          className="flex-grow bg-white/[0.03] border border-white/10 focus:border-gold/50 p-2 text-xs text-white placeholder:text-white/20 outline-none uppercase font-mono tracking-widest"
                        />
                        <BatmanButton
                          variant="secondary"
                          size={12}
                          onClick={handleApplyPromo}
                        >
                          APPLICA
                        </BatmanButton>
                      </div>
                      {promoError && (
                        <p className="text-white/50 font-mono text-[9px] uppercase tracking-widest">
                          {promoError}
                        </p>
                      )}
                      {appliedDiscount > 0 && (
                        <p className="text-[#FFD700] font-mono text-[9px] uppercase tracking-widest">
                          Sconto 15% applicato con successo.
                        </p>
                      )}
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
                        Crittografia a 256-bit attiva. Limite di 2 unità per ordine — protocollo di sicurezza Wayne.
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
                <h2 className="text-2xl font-bold text-white uppercase tracking-[0.3em] mb-4">Protocollo di Acquisizione in Corso</h2>
              </BatmanText>
              <BatmanText delay={0.4}>
                <div className="text-[10px] font-mono text-gold/60 uppercase tracking-[0.2em] space-y-2">
                  <p>Inizializzazione server Wayne...</p>
                  <p>Crittografia dati transazione...</p>
                  <p>Verifica disponibilità unità riservata…</p>
                </div>
              </BatmanText>
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
});
