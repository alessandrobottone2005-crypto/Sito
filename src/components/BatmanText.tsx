import { motion } from "motion/react";
import React from "react";

interface BatmanTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

/**
 * BatmanText Component
 * Implements the "Sculpting di Precisione" animation style:
 * Blur + Scale + Opacity + Y-offset movement.
 */
export default function BatmanText({ 
  children, 
  className = "", 
  delay = 0,
  duration = 1.5 
}: BatmanTextProps) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.8, 
        filter: "blur(15px)", 
        y: 40 
      }}
      whileInView={{ 
        opacity: 1, 
        scale: 1, 
        filter: "blur(0px)", 
        y: 0 
      }}
      exit={{ 
        opacity: 0, 
        scale: 1.2, 
        filter: "blur(15px)", 
        y: -40 
      }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
