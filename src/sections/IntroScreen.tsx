import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import BatmanButton from "../components/ui/BatmanButton";
import { BatcavernAudio } from "../lib/audioManager";

interface IntroScreenProps {
  onBegin: () => void;
  initialTime?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
}

const BRIEFING_TEXTS = [
  { text: "BATMAN...", accent: "HO LASCIATO UN REGALINO NELLA TUA PREZIOSA CAVERNA..." },
  { text: "NON È IL SOLITO GIOCATTOLO,", accent: "MA QUALCOSA CHE FARÀ IL BOTTO." },
  { text: "TROVA I MIEI 5 INDIZI.", accent: "DIMOSTRAMI CHE IL GRANDE PIPISTRELLO SA ANCORA GIOCARE." },
  { text: "IL TEMPO SCORRE.", accent: "TIC TAC, BATSY..." },
  { text: "RISOLVI IL GIOCO", accent: "O LA TUA CAVERNA DIVENTERÀ POLVERE." },
];

export default React.memo(function IntroScreen({ onBegin, initialTime = 180, isMuted, onToggleMute, isPaused, onTogglePause }: IntroScreenProps) {
  const formattedMinutes = Math.floor(initialTime / 60);
  const formattedSeconds = (initialTime % 60).toString().padStart(2, "0");
  const displayTime = `${formattedMinutes.toString().padStart(2, "0")}:${formattedSeconds}`;
  const [step, setStep] = useState(0); // 0: glitch, 1-5: briefing texts, 6: CTA
  const [isHacked, setIsHacked] = useState(false);

  useEffect(() => {
    // Audio starts with briefing
    const audioTimer = setTimeout(() => {
      BatcavernAudio.start(2000);
    }, 1500);

    const t1 = setTimeout(() => setIsHacked(true), 1500);

    const timers: NodeJS.Timeout[] = [];
    for (let i = 0; i < BRIEFING_TEXTS.length; i++) {
      timers.push(setTimeout(() => setStep(i + 1), 2000 + i * 3000));
    }
    timers.push(
      setTimeout(() => setStep(6), 2000 + BRIEFING_TEXTS.length * 3000)
    );

    return () => {
      clearTimeout(audioTimer);
      clearTimeout(t1);
      timers.forEach(clearTimeout);
      // Audio survives transition intentionally
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('./assets/images/screen.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      {/* ── Dark overlay — Figma: rgba(0,0,0,0.60) ──────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.85) 100%)",
          zIndex: 0,
        }}
      />

      {/* ── Atmospheric purple glow + CRT lines ────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.4,
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(102,0,197,0.3) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.5) 50()), linear-gradient(90deg, rgba(41,0,79,0.2), rgba(102,0,197,0.1), rgba(41,0,79,0.2))",
            backgroundSize: "100% 3px, 4px 100%",
          }}
        />
      </div>

      {/* ── Scan sweep line ────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: 1,
          pointerEvents: "none",
          zIndex: 4,
          background:
            "linear-gradient(90deg, transparent, rgba(102,0,197,0.5), transparent)",
          boxShadow: "0 0 16px rgba(102,0,197,0.4)",
          animation: "scan 8s linear infinite",
        }}
      />



      {/* STORYTELLING TEXT SECTION */}
      <AnimatePresence mode="wait">

        {/* Pre-briefing glitch */}
        {!isHacked && (
          <motion.div
            key="initial-glitch"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0.5, 1] }}
            exit={{ opacity: 0 }}
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                padding: "8px 20px",
                background: "rgba(0,0,0,0.8)",
                boxShadow: "0px 0px 14px rgba(102,0,197,0.6)",
                border: "1px solid rgba(102,0,197,0.4)",
              }}
            >
              <span
                style={{
                  fontFamily: "Space Grotesk, monospace",
                  fontSize: 10,
                  letterSpacing: "0.6em",
                  color: "rgba(102,0,197,0.7)",
                  textTransform: "uppercase",
                }}
              >
                SEGNALE_INTERCETTATO...
              </span>
            </div>
          </motion.div>
        )}

        {/* Narrative texts (step 1–5) — Figma data-state="1" */}
        {isHacked && step >= 1 && step <= 5 && (
          <motion.div
            key={`step-${step}`}
            data-state={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -20,
              filter: "blur(8px)",
              transition: { duration: 0.4 },
            }}
            transition={{ duration: 0.5 }}
            style={{
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              display: "flex",
              position: "relative",
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: 1200,
                maxWidth: "95vw",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 8,
                display: "flex",
              }}
            >
              {/* Title — Figma: white, 80px, 700, purple textShadow */}
              <div
                style={{
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                  display: "inline-flex",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    color: "white",
                    fontSize: 80,
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 700,
                    lineHeight: "81px",
                    wordWrap: "break-word",
                    textShadow: "0px 0px 14px rgba(102, 0, 197, 1.00)",
                  }}
                >
                  {BRIEFING_TEXTS[step - 1].text}
                </div>
              </div>

              {/* Accent subtitle — Figma: white, 20px, 400, purple textShadow */}
              <div
                style={{
                  alignSelf: "stretch",
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                  display: "inline-flex",
                }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  style={{
                    textAlign: "center",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    color: "white",
                    fontSize: 40,
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 400,
                    lineHeight: "42px",
                    wordWrap: "break-word",
                    textShadow: "0px 0px 14px rgba(102, 0, 197, 1.00)",
                  }}
                >
                  {BRIEFING_TEXTS[step - 1].accent}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Final step: timer + CTA */}
        {isHacked && step === 6 && (
          <motion.div
            key="final-step"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 48,
              position: "relative",
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 32,
                backgroundColor: "rgba(0,0,0,1)",
                boxShadow: "0px 0px 14px rgba(102, 0, 197, 1)",
                borderRadius: 18,
                border: "1px solid rgba(102, 0, 197, 1)",
                minWidth: 320,
              }}
            >
              <div
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontSize: 20,
                  lineHeight: "21px",
                  fontWeight: 400,
                  color: "rgba(102, 0, 197, 1)",
                  textShadow: "0px 0px 14px rgba(102, 0, 197, 1)",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                TEMPO_ALLA_DETONAZIONE
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  color: ["#ffffff", "#ff4444", "#ffffff"],
                  textShadow: [
                    "0px 0px 20px rgba(255,255,255,0.8), 4px 4px 0px rgba(102,0,197,1)",
                    "0px 0px 40px rgba(255,0,0,0.8), 6px 6px 0px rgba(255,0,0,1)",
                    "0px 0px 20px rgba(255,255,255,0.8), 4px 4px 0px rgba(102,0,197,1)",
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontSize: 120,
                  lineHeight: "121px",
                  fontWeight: 700,
                  color: "#ffffff",
                  textShadow:
                    "0px 0px 20px rgba(255,255,255,0.8), 4px 4px 0px rgba(102,0,197,1)",
                }}
              >
                {displayTime}
              </motion.div>
            </div>

            <BatmanButton
              variant="joker"
              size={60}
              onClick={onBegin}
              className="min-w-[500px]"
            >
              ACCETTA LA SFIDA
            </BatmanButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HUD corner brackets ─────────────────────────────────── */}
      <div style={{ position: "absolute", top: 40, left: 40, width: 80, height: 80, borderTop: "1px solid rgba(255,215,0,0.15)", borderLeft: "1px solid rgba(255,215,0,0.15)", zIndex: 5, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 40, right: 40, width: 80, height: 80, borderTop: "1px solid rgba(255,215,0,0.15)", borderRight: "1px solid rgba(255,215,0,0.15)", zIndex: 5, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 40, left: 40, width: 80, height: 80, borderBottom: "1px solid rgba(255,215,0,0.15)", borderLeft: "1px solid rgba(255,215,0,0.15)", zIndex: 5, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 40, right: 40, width: 80, height: 80, borderBottom: "1px solid rgba(255,215,0,0.15)", borderRight: "1px solid rgba(255,215,0,0.15)", zIndex: 5, pointerEvents: "none" }} />

      {/* ── HUD label bottom-right (easter egg, intentionally hidden) ── */}
      <div
        aria-hidden="true"
        tabIndex={-1}
        style={{
          position: "absolute",
          bottom: 48,
          right: 160,
          zIndex: 5,
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: 10,
          letterSpacing: "0.3em",
          color: "rgba(102,0,197,0.18)",
          cursor: "pointer",
          textTransform: "uppercase",
        }}
        onClick={onBegin}
      >
        MANOMISSIONE_JOKER_ATTIVA // OVERRIDE_ACCETTA_LA_SFIDA
      </div>
    </div>
  );
});
