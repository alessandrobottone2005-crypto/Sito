import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "./components/layout/Navbar";
import BatmanCamera from "./components/ui/BatmanCamera";
import Pricing from "./components/ui/Pricing";
import Checkout from "./components/ui/Checkout";
import IntroScreen from "./components/scenes/IntroScreen";
import FinalReveal from "./components/ui/FinalReveal";
import CinematicVideoPlayer from "./components/scenes/CinematicVideoPlayer";
import TransitionOverlay from "./components/effects/TransitionOverlay";
import ExplosionOverlay from "./components/effects/ExplosionOverlay";
import SharedPanoramaCanvas, { PanoramaScene } from "./components/scenes/SharedPanoramaCanvas";

// Flow: intro → batcomputer (2) → transition1 → armeria (1) → transition2 → batmobile (2) → reveal → showreel → checkout
type Phase = "intro" | "batcomputer" | "transition1" | "armeria" | "transition2" | "batmobile" | "reveal" | "showreel" | "checkout";
type MissionStatus = "idle" | "active" | "failed" | "succeeded";

// Map: which panorama scene is "active" for each phase
const PANORAMA_PHASE_MAP: Partial<Record<Phase, PanoramaScene>> = {
  batcomputer: "batcomputer",
  transition1: "batcomputer", // video overlays on top — keep canvas alive
  armeria: "armeria",
  transition2: "armeria",     // video overlays on top — keep canvas alive
  batmobile: "batmobile",
};

export default function App() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [missionStatus, setMissionStatus] = useState<MissionStatus>("idle");
  const [timerResetKey, setTimerResetKey] = useState(0);
  // Track which panorama scene the SharedPanoramaCanvas should display
  const [panoramaScene, setPanoramaScene] = useState<PanoramaScene>("batcomputer");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Background Music Logic
  useEffect(() => {
    const audio = new Audio("/assets/audio/SiglaBatman.wav");
    audio.loop = true;
    audio.volume = 0.4;
    audio.muted = isMuted;
    audioRef.current = audio;

    const tryPlay = () => {
      audio.play().catch(() => {
        const unlock = () => {
          audio.play().catch(() => {});
          window.removeEventListener("click", unlock);
        };
        window.addEventListener("click", unlock);
      });
    };
    tryPlay();
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  const handleTimeUp = () => setMissionStatus("failed");

  // Success Condition
  useEffect(() => {
    if (completedCount === 5 && missionStatus === "active") {
      setMissionStatus("succeeded");
      changePhase("reveal");
    }
  }, [completedCount, missionStatus]);

  // Unified phase change with transition overlay
  const changePhase = (newPhase: Phase) => {
    if (isTransitioning) return;

    if (phase === "intro" && newPhase === "batcomputer") {
      setCompletedCount(0);
      setTimerResetKey(prev => prev + 1);
      setMissionStatus("active");
      if (audioRef.current) {
        audioRef.current.currentTime = 20;
        audioRef.current.play().catch(() => {});
      }
    }

    setIsTransitioning(true);
    setTimeout(() => { setPhase(newPhase); }, 400);
    setTimeout(() => { setIsTransitioning(false); }, 1000);
  };

  const handleResetMission = () => {
    setMissionStatus("idle");
    setPhase("intro");
    setCompletedCount(0);
    setTimerResetKey(prev => prev + 1);
    setPanoramaScene("batcomputer");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 20;
    }
  };

  // Determine if the shared panorama canvas should be visible
  const panoramaPhases: Phase[] = ["batcomputer", "transition1", "armeria", "transition2", "batmobile"];
  const isPanoramaPhase = panoramaPhases.includes(phase);

  // Base completed counts per scene
  const baseCompleted =
    panoramaScene === "batcomputer" ? 0 :
    panoramaScene === "armeria" ? 2 : 3;

  return (
    <div className="bg-black min-h-screen relative overflow-x-hidden">
      <Navbar
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        showBack={phase === "checkout"}
        onBack={() => changePhase("showreel")}
        showPause={["batcomputer", "armeria", "batmobile", "showreel"].includes(phase)}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        completedCount={["batcomputer", "armeria", "batmobile"].includes(phase) ? completedCount : undefined}
        totalClues={5}
        timerResetKey={timerResetKey}
        onTimeUp={handleTimeUp}
        missionActive={missionStatus === "active"}
      />

      {/* Cinematic Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && <TransitionOverlay key="overlay" />}
      </AnimatePresence>

      <main className="text-white selection:bg-gold selection:text-black font-sans h-full">

        {/* ── SHARED PANORAMA CANVAS ────────────────────────────────────────
            Mounted once, never destroyed. Scene swaps texture internally.
            The transition videos overlay on top (z-index 500).
        ────────────────────────────────────────────────────────────────── */}
        {isPanoramaPhase && (
          <SharedPanoramaCanvas
            scene={panoramaScene}
            onProgress={(count) => setCompletedCount(count)}
            baseCompleted={baseCompleted}
            isPaused={isPaused}
            onNext={() => {
              if (panoramaScene === "batcomputer") {
                setPhase("transition1");
                setTimeout(() => setPanoramaScene("armeria"), 100);
              } else if (panoramaScene === "armeria") {
                setPhase("transition2");
                setTimeout(() => setPanoramaScene("batmobile"), 100);
              } else if (panoramaScene === "batmobile") {
                changePhase("reveal");
              }
            }}
          />
        )}

        {/* ── TRANSITION VIDEOS (overlay above panorama canvas) ── */}
        <AnimatePresence>
          {phase === "transition1" && (
            <motion.div
              key="trans1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[500] bg-black"
            >
              <CinematicVideoPlayer
                src="/assets/videos/BatCaverna_PassaggioBatComputerAArmeria.mp4"
                onEnded={() => setPhase("armeria")}
                label="SPOSTAMENTO: AREA ARMERIA"
                nextAsset="/assets/textures/BatCaverna360_ArmeriaArea.jpg"
              />
            </motion.div>
          )}

          {phase === "transition2" && (
            <motion.div
              key="trans2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[500] bg-black"
            >
              <CinematicVideoPlayer
                src="/assets/videos/BatCaverna_PassaggioArmeriaABatMobile.mp4"
                onEnded={() => setPhase("batmobile")}
                label="SPOSTAMENTO: ZONA BATMOBILE"
                nextAsset="/assets/textures/BatCaverna360_BatMobileArea.jpg"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── OTHER PHASES ──────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
              <IntroScreen onBegin={() => {
                setPanoramaScene("batcomputer");
                changePhase("batcomputer");
              }} />
            </motion.div>
          )}

          {phase === "reveal" && (
            <FinalReveal key="reveal" onComplete={() => changePhase("showreel")} isPaused={isPaused} />
          )}

          {phase === "showreel" && (
            <motion.div key="showreel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
              <BatmanCamera onPreorder={() => changePhase("checkout")} />
              <Pricing onPreorder={() => changePhase("checkout")} />
            </motion.div>
          )}

          {phase === "checkout" && (
            <Checkout key="checkout" onClose={() => changePhase("showreel")} />
          )}
        </AnimatePresence>

        {/* Global Mission Overlays */}
        <AnimatePresence>
          {missionStatus === "failed" && (
            <ExplosionOverlay key="explosion" onReset={handleResetMission} />
          )}
        </AnimatePresence>

        {/* Pause Screen Overlay */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              key="pause"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-lg flex flex-col items-center justify-center select-none"
            >
              <h2 className="text-white text-4xl md:text-6xl font-black tracking-tighter mb-2 glitch-slow">MISSIONE IN PAUSA</h2>
              <p className="text-gold text-[10px] tracking-[0.8em] uppercase font-bold opacity-60">Batcomputer in Standby // In attesa di ripresa</p>
              <div className="absolute top-24 left-24 w-12 h-12 border-t-2 border-l-2 border-gold/20" />
              <div className="absolute bottom-24 right-24 w-12 h-12 border-b-2 border-r-2 border-gold/20" />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
