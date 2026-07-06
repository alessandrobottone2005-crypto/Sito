import React, { useState } from "react";
import { motion, HTMLMotionProps } from "motion/react";

interface IconButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  disabled?: boolean;
  /** Render prop: receives isHovered, returns the icon element */
  children: (isHovered: boolean, iconColor: string) => React.ReactNode;
}

/**
 * Design System — iconButtonMolecule
 *
 * Active:  fill=black,  border=#FFD700, glow=#FFD700, icon=#FFD700
 * Over:    fill=#FFD700, border=black,  glow=#FFD700, icon=black
 * Disabled: fill=#535353, border=#2A2A2A, no glow, icon=#C4C4C4
 *
 * Outer click area: 46×46px (transparent)
 * Inner visual box: 26×26px with all styling applied
 */
export function IconButton({ disabled, children, style, ...props }: IconButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Background color
  const bg = disabled
    ? "#535353"
    : isHovered
      ? "#FFD700"
      : "#000000";

  // Border/stroke color
  const borderColor = disabled
    ? "#2A2A2A"
    : isHovered
      ? "#000000"
      : "#FFD700";

  // Glow
  const boxShadow = disabled
    ? "none"
    : "0px 0px 14px rgba(255, 215, 0, 0.9)";

  // Icon color — yellow when active, black when hovered, gray when disabled
  const iconColor = disabled
    ? "#C4C4C4"
    : isHovered
      ? "#000000"
      : "#FFD700";

  // Icon glow
  const iconGlow = disabled
    ? "none"
    : "drop-shadow(0px 0px 6px rgba(255, 215, 0, 0.9))";

  return (
    <motion.button
      onHoverStart={() => !disabled && setIsHovered(true)}
      onHoverEnd={() => !disabled && setIsHovered(false)}
      whileTap={!disabled ? { scale: 0.92 } : undefined}
      disabled={disabled}
      style={{
        width: 46,
        height: 46,
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
        background: "transparent",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        padding: 0,
        ...style,
      }}
      {...props}
    >
      {/* Inner visual box — 36×36 */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 6,
          background: bg,
          border: `1px solid ${borderColor}`,
          boxShadow: boxShadow,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
          filter: iconGlow,
        }}
      >
        {children(isHovered, iconColor)}
      </div>
    </motion.button>
  );
}
