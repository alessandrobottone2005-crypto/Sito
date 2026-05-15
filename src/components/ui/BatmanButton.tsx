import { motion } from "motion/react";
import React from "react";

interface BatmanButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "icon" | "ghost";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  showCorners?: boolean;
  showGlow?: boolean;
  showScanLine?: boolean;
}

export default function BatmanButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
  showCorners = false,
  showGlow = false,
  showScanLine = true,
}: BatmanButtonProps) {

  const baseStyles = "relative group overflow-hidden transition-all duration-300 border-glitch flex items-center justify-center font-black uppercase tracking-[0.3em] text-[10px] md:text-xs";

  const variants = {
    primary: "px-16 py-8 bg-transparent border border-gold/40 hover:border-gold text-gold hover:bg-gold/5",
    secondary: "px-16 py-8 bg-gold text-black hover:bg-white border border-gold hover:border-white",
    ghost: "px-4 py-2 bg-transparent border border-white/10 hover:border-gold/50 text-[9px] text-white/30 hover:text-gold font-mono tracking-widest",
    icon: "p-3 bg-black/40 border border-gold/30 text-gold hover:bg-gold/20 hover:border-gold/60 rounded-full",
  };

  const selectedVariant = variants[variant] || variants.primary;

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Animated Glow */}
      {showGlow && (
        <motion.div
          animate={{
            opacity: [0.1, 0.25, 0.1],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-gold/15 rounded-full blur-[40px] pointer-events-none"
        />
      )}

      {/* Corner Brackets */}
      {showCorners && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-gold/30 group-hover:border-gold group-hover:-top-4 group-hover:-left-4 transition-all duration-300" />
          <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-gold/30 group-hover:border-gold group-hover:-top-4 group-hover:-right-4 transition-all duration-300" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-gold/30 group-hover:border-gold group-hover:-bottom-4 group-hover:-left-4 transition-all duration-300" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-gold/30 group-hover:border-gold group-hover:-bottom-4 group-hover:-right-4 transition-all duration-300" />
        </div>
      )}

      <motion.button
        type={type}
        disabled={disabled}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`${baseStyles} ${selectedVariant}`}
      >
        {/* Moving Scan Line */}
        {showScanLine && (
          <motion.div
            animate={{ left: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-gold/10 to-transparent skew-x-12 pointer-events-none"
          />
        )}

        <span className="relative z-10">{children}</span>
      </motion.button>
    </div>
  );
}
