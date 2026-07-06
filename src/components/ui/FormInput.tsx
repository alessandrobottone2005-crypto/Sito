import React, { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
}

export function FormInput({ label, containerClassName = "", className = "", ...props }: FormInputProps) {
  return (
    <div className={`space-y-1 ${containerClassName}`}>
      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1 block mb-2">
        {label}
      </label>
      <input
        className={`w-full bg-white/[0.03] border border-white/10 focus:border-gold/50 focus:bg-gold/[0.02] p-4 text-sm text-white placeholder:text-white/10 outline-none transition-all uppercase font-mono tracking-wider ${className}`}
        {...props}
      />
    </div>
  );
}
