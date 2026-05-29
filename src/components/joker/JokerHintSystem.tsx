import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface JokerHintSystemProps {
  hintActive: boolean;
  hintPhase: 0 | 1 | 2 | 3;
  isMuted: boolean;
  isPaused: boolean;
}

// ─── Joker distortion audio ──────────────────────────────────────────────────
function useJokerDistortionAudio(hintPhase: 0 | 1 | 2 | 3, isMuted: boolean, isPaused: boolean) {
  const templateAudioRef = useRef<HTMLAudioElement | null>(null);
  const playedPhaseRef = useRef<Set<number>>(new Set());

  // Carica la risata del Joker
  useEffect(() => {
    try {
      const audio = new Audio("./assets/audio/RisataJoker.wav");
      templateAudioRef.current = audio;
    } catch { /* silent fail */ }
  }, []);

  const playDistortedLaugh = useCallback((volume: number) => {
    if (!templateAudioRef.current || isMuted || isPaused) return;

    const clone = templateAudioRef.current.cloneNode() as HTMLAudioElement;
    clone.volume = volume;
    clone.play().catch(() => {});
  }, [isMuted, isPaused]);

  useEffect(() => {
    if (hintPhase === 0) {
      playedPhaseRef.current.clear();
      return;
    }
    if (playedPhaseRef.current.has(hintPhase)) return;
    playedPhaseRef.current.add(hintPhase);

    const volumes: Record<number, number> = { 1: 0.06, 2: 0.12, 3: 0.18 };
    const delays: Record<number, number> = { 1: 800, 2: 400, 3: 200 };
    const vol = volumes[hintPhase] ?? 0.06;
    const delay = delays[hintPhase] ?? 600;

    const t = setTimeout(() => playDistortedLaugh(vol), delay);
    return () => clearTimeout(t);
  }, [hintPhase, playDistortedLaugh]);
}

// ─── Componente Principale ───────────────────────────────────────────────────
export default function JokerHintSystem({ hintActive, hintPhase, isMuted, isPaused }: JokerHintSystemProps) {
  useJokerDistortionAudio(hintPhase, isMuted, isPaused);

  if (isPaused) return null;

  return (
    <AnimatePresence>
      {hintActive && hintPhase > 0 && (
        <motion.div
          key="joker-hint-system"
          className="fixed inset-0 pointer-events-none z-[9000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* ── FASE 1: Glitch UI sottile ──────────────────────────────── */}
          <Phase1Glitch active={hintPhase >= 1} />

          {/* ── FASE 2: Micro flicker ambientale + vignette verde ─────── */}
          {hintPhase >= 2 && <Phase2Flicker />}

          {/* ── FASE 3: Scanlines distorte + aberrazione cromatica ──────── */}
          {hintPhase >= 3 && <Phase3ChromaticAberration />}

          {/* ── Vignetta bordo Joker (tutte le fasi) ─────────────────── */}
          <JokerVignette phase={hintPhase} />

          {/* ── Firma narrativa del Joker ─────────────────────────────── */}
          <JokerNarrativeTag phase={hintPhase} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Glitch sottile orizzontale ──────────────────────────────────────────────
function Phase1Glitch({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0, 0, 0.7, 0, 0, 1, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut",
          }}
        >
          {/* Linea glitch orizzontale */}
          {[12, 37, 61, 83].map((pct, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0"
              style={{
                top: `${pct}%`,
                height: i % 2 === 0 ? 1 : 2,
                background: i % 2 === 0
                  ? "rgba(57, 255, 20, 0.3)"
                  : "rgba(255, 255, 255, 0.08)",
                filter: "blur(0.5px)",
              }}
              animate={{
                scaleX: [1, 1.02, 0.98, 1],
                x: [0, 3, -2, 0],
                opacity: [0.3, 0.7, 0.2, 0.5],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 2.5 + i * 1.2,
                ease: "linear",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Flicker ambientale verde ────────────────────────────────────────────────
function Phase2Flicker() {
  return (
    <motion.div
      className="absolute inset-0"
      animate={{
        background: [
          "radial-gradient(ellipse at 50% 50%, rgba(57,255,20,0) 0%, rgba(0,0,0,0) 100%)",
          "radial-gradient(ellipse at 50% 50%, rgba(57,255,20,0.04) 0%, rgba(0,0,0,0) 70%)",
          "radial-gradient(ellipse at 50% 50%, rgba(57,255,20,0) 0%, rgba(0,0,0,0) 100%)",
        ],
      }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: "easeInOut",
      }}
    />
  );
}

// ─── Aberrazione cromatica / scanlines ───────────────────────────────────────
function Phase3ChromaticAberration() {
  return (
    <>
      {/* Scanlines leggere */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(57,255,20,0.5) 2px, rgba(57,255,20,0.5) 3px)",
        }}
      />
      {/* Aberrazione cromatica — layer rosso spostato */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0, 0.04, 0, 0.06, 0],
          x: [0, -2, 0, 2, 0],
        }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "linear",
        }}
        style={{
          background: "rgba(255, 0, 0, 1)",
          mixBlendMode: "screen",
        }}
      />
    </>
  );
}

// ─── Vignetta bordo Joker progressiva ────────────────────────────────────────
function JokerVignette({ phase }: { phase: 0 | 1 | 2 | 3 }) {
  const intensityMap = { 0: 0, 1: 0.08, 2: 0.15, 3: 0.22 };
  const intensity = intensityMap[phase];

  return (
    <motion.div
      className="absolute inset-0"
      animate={{ opacity: 1 }}
      style={{
        background: `radial-gradient(ellipse at center, transparent 40%, rgba(57,255,20,${intensity}) 100%)`,
        mixBlendMode: "screen",
      }}
    />
  );
}

// ─── Tag narrativo Joker (bottom-left, molto sottile) ────────────────────────
function JokerNarrativeTag({ phase }: { phase: 0 | 1 | 2 | 3 }) {
  const messages: Record<number, string> = {
    1: "PROTOCOLLO CHAOS ATTIVATO",
    2: "IL GIOCO È SOLO ALL'INIZIO...",
    3: "HA HA HA — GUARDA MEGLIO, DETECTIVE",
  };
  const msg = messages[phase];

  return (
    <AnimatePresence mode="wait">
      {msg && (
        <motion.div
          key={phase}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 select-none"
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: [0, 0.7, 0.5, 0.7], y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <span
            className="text-[9px] font-mono tracking-[0.5em] uppercase"
            style={{
              color: "rgba(57, 255, 20, 0.7)",
              textShadow: "0 0 12px rgba(57,255,20,0.6), 0 0 4px rgba(57,255,20,0.3)",
              letterSpacing: "0.5em",
            }}
          >
            {msg}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
