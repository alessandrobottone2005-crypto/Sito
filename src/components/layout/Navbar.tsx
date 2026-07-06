import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import ProgressTracker from "../hud/ProgressTracker";
import MissionTimer from "../hud/MissionTimer";
import { LogosGroup } from "../ui/Logos";
import { PauseButton, AudioButton } from "../ui/MediaControls";
import { IconButton } from "../ui/IconButton";

// ─────────────────────────────────────────────────────────────────
// Phase-based navbar layout rules:
//
// intro / batcomputer-boot:  [logos]               [pause] [audio]
// gamification (panoramas):  [logos] [timer] [bar]  [pause] [audio]
// reveal (victory):          [logos]                         [audio]
// showreel:                  [logos]          [preorder btn] [audio]
// checkout:                  [logos]                [back]  [audio]
// thankyou:                  [logos]                         [audio]
// ─────────────────────────────────────────────────────────────────

export type NavPhase =
  | "intro"
  | "gamification"
  | "reveal"
  | "showreel"
  | "checkout"
  | "thankyou";

interface NavbarProps {
  phase: NavPhase;
  isMuted: boolean;
  onToggleMute: () => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
  // Gamification only
  completedCount?: number;
  totalClues?: number;
  timeLeft?: number;
  // Showreel only
  onPreorder?: () => void;
  // Checkout only
  onBack?: () => void;
}

function Navbar({
  phase,
  isMuted,
  onToggleMute,
  isPaused,
  onTogglePause,
  completedCount = 0,
  totalClues = 5,
  timeLeft,
  onPreorder,
  onBack,
}: NavbarProps) {
  const isGamification = phase === "gamification";
  const showPause = phase === "intro" || phase === "gamification";
  const showBack = phase === "checkout";
  const showPreorder = phase === "showreel";
  const showHUD = isGamification;

  return (
    <nav
      className="fixed top-0 left-0 w-full select-none pointer-events-none"
      style={{ padding: "20px", zIndex: 100000, transform: "translateZ(0)" }}
    >
      {/* Gradient fade */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
        }}
      />

      <div className="relative flex items-center justify-between w-full" style={{ gap: "20px" }}>

        {/* ── LEFT: Logos [+ timer + progress bar in gamification] ── */}
        <div className="flex items-center pointer-events-auto" style={{ gap: "16px" }}>
          <LogosGroup />

          <AnimatePresence>
            {showHUD && timeLeft !== undefined && (
              <motion.div
                key="hud"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
                className="hidden md:flex items-center"
                style={{ gap: "12px" }}
              >
                {/* Compact purple timer */}
                <MissionTimer timeLeft={timeLeft} isPaused={!!isPaused} compact />

                {/* Progress bar / clue tracker */}
                <ProgressTracker completedCount={completedCount} total={totalClues} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT: Action buttons ── */}
        <div className="flex items-center pointer-events-auto" style={{ gap: "10px" }}>

          {/* Preorder button — showreel only */}
          <AnimatePresence>
            {showPreorder && (
              <motion.button
                key="preorder"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                onClick={onPreorder}
                aria-label="Preordina il Cavaliere"
                whileHover={{ backgroundColor: "#FFD700", color: "#000" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: "#000",
                  boxShadow: "0px 0px 14px rgba(255,215,0,0.8)",
                  borderRadius: "6px",
                  border: "1px solid #FFD700",
                  padding: "10px 14px",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "background 0.15s ease, color 0.15s ease",
                }}
              >
                <span style={{
                  color: "inherit",
                  fontSize: "11px",
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textShadow: "0px 0px 10px rgba(255,215,0,0.8)",
                  whiteSpace: "nowrap",
                }}>
                  PREORDINA IL CAVALIERE
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Pause button — intro + gamification */}
          <AnimatePresence>
            {showPause && (
              <motion.div
                key="pause"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <PauseButton variant="navbar" isPaused={isPaused} onClick={onTogglePause} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back button — checkout only */}
          <AnimatePresence>
            {showBack && (
              <motion.div
                key="back"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <IconButton onClick={onBack} aria-label="Indietro">
                  {(_isHovered, iconColor) => (
                    <ArrowLeft size={16} color={iconColor} strokeWidth={2.5} />
                  )}
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Audio button — always visible */}
          <AudioButton variant="navbar" isMuted={isMuted} onClick={onToggleMute} />
        </div>
      </div>
    </nav>
  );
}

export default React.memo(Navbar);
