import React, { useState } from "react";

export interface BatmanButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "joker" | "riddle" | "riddle-true" | "riddle-false" | "checkout" | "ghost" | "icon" | string;
  size?: 12 | 20 | 40 | 60 | 80;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

function BatmanButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = 20,
  type = "button",
  disabled = false,
}: BatmanButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Dimensioni basate sullo snippet
  const sizeMap: Record<number, any> = {
    12: { padding: 10, borderRadius: 6, outlineWidth: 1, fontSize: 12, lineHeight: 13, fontWeight: 400 },
    20: { padding: 10, borderRadius: 6, outlineWidth: 1, fontSize: 20, lineHeight: 21, fontWeight: 400 },
    40: { padding: 10, borderRadius: 6, outlineWidth: 1, fontSize: 40, lineHeight: 41, fontWeight: 700 },
    60: { padding: 20, borderRadius: 12, outlineWidth: 2, fontSize: 60, lineHeight: 61, fontWeight: 700 },
    80: { padding: 40, borderRadius: 18, outlineWidth: 4, fontSize: 80, lineHeight: 81, fontWeight: 700 },
  };

  const currentSize = sizeMap[size] || sizeMap[20];
  const isJoker = variant === "joker";

  let bgVar = "";
  let textVar = "";
  let strokeVar = "";
  let shadowVar = "none";
  let shadowColor = "";

  const isJokerFamily = variant.includes("joker") || variant.includes("riddle");
  const baseColor = isJokerFamily ? "#6600C5" : "#FFD700";
  const baseShadow = isJokerFamily ? "rgba(102, 0, 197, 1.00)" : "rgba(255, 215, 0, 1.00)";

  if (disabled) {
    bgVar = "var(--primary-disabled, #535353)";
    textVar = "var(--on-primary-disabled, #C4C4C4)";
    strokeVar = "var(--on-primary-stroke-disabled, #2A2A2A)";
    shadowVar = "none";
  } else if (variant === "ghost" || variant === "icon") {
    bgVar = isHovered ? "rgba(255,255,255,0.1)" : "transparent";
    textVar = baseColor;
    strokeVar = isHovered ? baseColor : "transparent";
    shadowColor = baseShadow;
    shadowVar = isHovered ? `0px 0px 14px ${baseColor}` : "none";
  } else if (variant === "secondary" || variant === "checkout") {
    bgVar = isHovered ? "black" : baseColor;
    textVar = isHovered ? baseColor : "black";
    strokeVar = baseColor;
    shadowColor = baseShadow;
    shadowVar = `0px 0px 14px ${baseColor}`;
  } else {
    // Primary / default
    bgVar = isHovered ? baseColor : "black";
    textVar = isHovered ? "black" : baseColor;
    strokeVar = baseColor;
    shadowColor = baseShadow;
    shadowVar = `0px 0px 14px ${baseColor}`;
  }

  return (
    <div 
      className={`relative inline-flex flex-col justify-center items-center ${className}`}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
    >
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        style={{
          padding: currentSize.padding,
          background: bgVar,
          boxShadow: shadowVar,
          borderRadius: currentSize.borderRadius,
          outline: `${currentSize.outlineWidth}px ${strokeVar} solid`,
          outlineOffset: `-${currentSize.outlineWidth}px`,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          display: 'inline-flex',
          cursor: disabled ? 'not-allowed' : 'pointer',
          border: 'none',
          transition: 'all 0.2s ease-in-out',
        } as React.CSSProperties}
      >
        <div style={{
          textAlign: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: textVar,
          fontSize: currentSize.fontSize,
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: currentSize.fontWeight,
          lineHeight: `${currentSize.lineHeight}px`,
          wordWrap: 'break-word',
          textShadow: disabled ? 'none' : `0px 0px 14px ${shadowColor}`,
          textTransform: 'uppercase', // Assicuriamo che mantenga il look
          ...(size === 80 ? { textBoxTrim: 'trim-both', textBoxEdge: 'cap alphabetic' } : {})
        } as React.CSSProperties}>
          {children}
        </div>
      </button>
    </div>
  );
}

export default React.memo(BatmanButton);
