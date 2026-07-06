import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { IconButton } from "./IconButton";

interface MediaControlProps {
  variant?: "intro" | "navbar";
  onClick?: () => void;
}

interface PauseButtonProps extends MediaControlProps {
  isPaused?: boolean;
}

interface AudioButtonProps extends MediaControlProps {
  isMuted?: boolean;
}

// ─────────────────────────────────────────────────────────────────
// Intro variant: plain button with same 26×26 visual box (static)
// ─────────────────────────────────────────────────────────────────
function IntroIconBox({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        cursor: onClick ? "pointer" : "default",
        width: 46,
        height: 46,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 6,
          background: "#000000",
          border: "1px solid #FFD700",
          boxShadow: "0px 0px 14px rgba(255,215,0,0.9)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────
// PauseButton
// Active:  "II" yellow glow  |  Hovered: "II" black glow
// Paused:  "▶" yellow glow  |  Hovered: "▶" black glow
// ─────────────────────────────────────────────────────────────────
export function PauseButton({ variant = "navbar", isPaused, onClick }: PauseButtonProps) {
  if (variant === "intro") {
    return (
      <IntroIconBox onClick={onClick}>
        <span
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: isPaused ? "8px" : "9px",
            fontWeight: 700,
            color: "#FFD700",
            textShadow: "0px 0px 8px rgba(255,215,0,1)",
            lineHeight: 1,
            letterSpacing: isPaused ? "normal" : "2px",
          }}
        >
          {isPaused ? "▶" : "II"}
        </span>
      </IntroIconBox>
    );
  }

  return (
    <IconButton
      onClick={onClick}
      aria-label={isPaused ? "Riprendi missione" : "Metti in pausa missione"}
      title={isPaused ? "Riprendi" : "Pausa"}
    >
      {(_isHovered, iconColor) => (
        <span
          style={{
            fontFamily: isPaused ? "Inter, sans-serif" : "Space Grotesk, sans-serif",
            fontSize: isPaused ? "11px" : "11px",
            fontWeight: 900,
            color: iconColor,
            lineHeight: 1,
            letterSpacing: isPaused ? "normal" : "2px",
            userSelect: "none",
          }}
        >
          {isPaused ? "▶" : "II"}
        </span>
      )}
    </IconButton>
  );
}

// ─────────────────────────────────────────────────────────────────
// AudioButton
// Active: Volume2 yellow  |  Hovered: Volume2 black
// Muted:  VolumeX yellow  |  Hovered: VolumeX black
// ─────────────────────────────────────────────────────────────────
export function AudioButton({ variant = "navbar", isMuted, onClick }: AudioButtonProps) {
  if (variant === "intro") {
    return (
      <IntroIconBox onClick={onClick}>
        {isMuted
          ? <VolumeX size={12} color="#FFD700" />
          : <Volume2 size={12} color="#FFD700" />
        }
      </IntroIconBox>
    );
  }

  return (
    <IconButton
      onClick={onClick}
      aria-label={isMuted ? "Attiva audio" : "Silenzia audio"}
    >
      {(_isHovered, iconColor) =>
        isMuted
          ? <VolumeX size={16} color={iconColor} strokeWidth={2.5} />
          : <Volume2 size={16} color={iconColor} strokeWidth={2.5} />
      }
    </IconButton>
  );
}
