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
import JokerAudioManager from "./components/audio/JokerAudioManager";

// Flow: intro → batcomputer (2) → transition1 → armeria (1) → transition2 → batmobile (2) → breather → reveal → showreel → checkout
type Phase = "intro" | "batcomputer" | "transition1" | "armeria" | "transition2" | "batmobile" | "breather" | "reveal" | "showreel" | "checkout";
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

  // Lifted Timer States
  const [timeLeft, setTimeLeft] = useState(180);
  const [initialTime, setInitialTime] = useState(180);
  const [timerABGroup, setTimerABGroup] = useState<"A" | "B">("A");
  const [bonusTimeGranted, setBonusTimeGranted] = useState(false);
  const [showBonusFeedback, setShowBonusFeedback] = useState(false);
  const [speedrunUnlocked, setSpeedrunUnlocked] = useState(false);
  const [finalTimeTaken, setFinalTimeTaken] = useState(0);

  // Mobile Detection & Skip Warning
  const [isMobile, setIsMobile] = useState(false);
  const [forceMobile, setForceMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // A/B Group Assignment on Mount
  useEffect(() => {
    const group = Math.random() < 0.5 ? "A" : "B";
    setTimerABGroup(group);
    const seconds = group === "A" ? 120 : 240;
    setInitialTime(seconds);
    setTimeLeft(seconds);
    console.log(`[A/B TEST] Assegnato al Gruppo ${group} (${seconds}s timer)`);
  }, []);

  // Derived: is a cinematic transition video currently playing?
  // During these phases the timer must be frozen so the player is not penalised.
  const isVideoTransition = phase === "transition1" || phase === "transition2";

  // Timer Tick Logic in App.tsx
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (missionStatus === "active" && !isPaused && !isVideoTransition && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [missionStatus, isPaused, isVideoTransition, timeLeft]);

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
          audio.play().catch(() => { });
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
      const timeTaken = initialTime - timeLeft;
      setFinalTimeTaken(timeTaken);
      
      // Speedrun Easter Egg check (under 90 seconds)
      if (timeTaken < 90) {
        setSpeedrunUnlocked(true);
        console.log(`[SPEEDRUN] Sconto sbloccato! Tempo di completamento: ${timeTaken}s`);
      } else {
        setSpeedrunUnlocked(false);
      }
      
      setMissionStatus("succeeded");
      changePhase("breather");
    }
  }, [completedCount, missionStatus]);

  // Bonus Time Check: when user finds first 2 clues
  useEffect(() => {
    if (completedCount === 2 && missionStatus === "active" && !bonusTimeGranted) {
      const timeElapsed = initialTime - timeLeft;
      if (timeElapsed <= 45) {
        setTimeLeft((prev) => prev + 60);
        setBonusTimeGranted(true);
        setShowBonusFeedback(true);
        console.log(`[BONUS] +60s per aver risolto i primi 2 indizi in ${timeElapsed}s!`);
        setTimeout(() => setShowBonusFeedback(false), 4000);
      }
    }
  }, [completedCount, missionStatus, bonusTimeGranted, initialTime, timeLeft]);

  // Unified phase change with transition overlay
  const changePhase = (newPhase: Phase) => {
    if (isTransitioning) return;

    if (phase === "intro" && newPhase === "batcomputer") {
      setCompletedCount(0);
      setTimerResetKey(prev => prev + 1);
      const seconds = timerABGroup === "A" ? 120 : 240;
      setTimeLeft(seconds);
      setBonusTimeGranted(false);
      setShowBonusFeedback(false);
      setMissionStatus("active");
      if (audioRef.current) {
        audioRef.current.currentTime = 20;
        audioRef.current.volume = 0.4;
        audioRef.current.play().catch(() => { });
      }
    }

    if (newPhase === "breather") {
      setMissionStatus("succeeded");
      setFinalTimeTaken(0);
      setSpeedrunUnlocked(false);

      // Fade out background music
      if (audioRef.current) {
        let currentVol = audioRef.current.volume;
        const fadeOut = setInterval(() => {
          currentVol = Math.max(0, currentVol - 0.05);
          if (audioRef.current) audioRef.current.volume = currentVol;
          if (currentVol <= 0) {
            clearInterval(fadeOut);
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.volume = 0.4;
            }
          }
        }, 80);
      }
      setIsTransitioning(true);
      setTimeout(() => { setPhase("breather"); }, 400);
      setTimeout(() => { setIsTransitioning(false); }, 1000);

      // Silent breather for 4 seconds, then transition to reveal
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setPhase("reveal");
          if (audioRef.current) {
            audioRef.current.currentTime = 0; // Play calm/heroic theme start
            audioRef.current.volume = 0.05;
            audioRef.current.play().catch(() => {});
            // Fade in theme
            let currentVol = 0.05;
            const fadeIn = setInterval(() => {
              currentVol = Math.min(0.4, currentVol + 0.05);
              if (audioRef.current) audioRef.current.volume = currentVol;
              if (currentVol >= 0.4) clearInterval(fadeIn);
            }, 100);
          }
        }, 400);
        setTimeout(() => { setIsTransitioning(false); }, 1000);
      }, 4400);
      return;
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
    const seconds = timerABGroup === "A" ? 120 : 240;
    setTimeLeft(seconds);
    setBonusTimeGranted(false);
    setShowBonusFeedback(false);
    setSpeedrunUnlocked(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 20;
    }
  };

  const handleSkipPhase = () => {
    setIsTransitioning(false); // bypass potential lock

    if (phase === "intro") {
      setPanoramaScene("batcomputer");
      changePhase("batcomputer");
    } else if (phase === "batcomputer") {
      setPanoramaScene("armeria");
      setCompletedCount(2);
      changePhase("transition1");
    } else if (phase === "transition1") {
      setPanoramaScene("armeria");
      changePhase("armeria");
    } else if (phase === "armeria") {
      setPanoramaScene("batmobile");
      setCompletedCount(3);
      changePhase("transition2");
    } else if (phase === "transition2") {
      setPanoramaScene("batmobile");
      changePhase("batmobile");
    } else if (phase === "batmobile" || phase === "breather") {
      setMissionStatus("succeeded");
      setCompletedCount(5);
      changePhase("reveal");
    } else if (phase === "reveal") {
      changePhase("showreel");
    } else if (phase === "showreel") {
      changePhase("checkout");
    } else if (phase === "checkout") {
      handleResetMission();
    }
  };

  // Easter Egg Shortcut: Command + 1 to skip to Showreel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD + 1 (Mac) or CTRL + 1 (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "1") {
        e.preventDefault();
        console.log("Easter Egg: Skipping gamification to showreel...");

        // Update states to simulate completion
        setMissionStatus("succeeded");
        setCompletedCount(5);

        // Trigger the transition to showreel
        changePhase("showreel");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, isTransitioning]); // Include dependencies to ensure we have current state if needed

  // Determine if the shared panorama canvas should be visible
  const panoramaPhases: Phase[] = ["batcomputer", "transition1", "armeria", "transition2", "batmobile"];
  const isPanoramaPhase = panoramaPhases.includes(phase);

  // Base completed counts per scene
  const baseCompleted =
    panoramaScene === "batcomputer" ? 0 :
      panoramaScene === "armeria" ? 2 : 3;

  // Joker laugh is active during investigation phases, but stops at victory (reveal)
  const isJokerActive = ["batcomputer", "transition1", "armeria", "transition2", "batmobile"].includes(phase) && missionStatus === "active";

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
        timeLeft={timeLeft}
        missionActive={missionStatus === "active"}
      />

      {/* ── DEV ONLY: Skip Phase Button ────────────────────────────────────── */}
      <div className="fixed bottom-4 right-4 z-[300000] pointer-events-auto select-none">
        <button
          onClick={handleSkipPhase}
          className="bg-black/60 border border-gold/30 hover:border-gold text-gold/80 hover:text-gold transition-all duration-200 px-3 py-1.5 text-[9px] rounded-sm backdrop-blur-sm focus:outline-none cursor-pointer font-mono tracking-wider"
          title="Salta alla fase successiva (Dev)"
        >
          ⚡ Salta a: {
            phase === "intro" ? "BatComputer 360" :
            phase === "batcomputer" ? "Transizione 1 (Video)" :
            phase === "transition1" ? "Armeria 360" :
            phase === "armeria" ? "Transizione 2 (Video)" :
            phase === "transition2" ? "BatMobile 360" :
            phase === "batmobile" ? "Vittoria" :
            phase === "breather" ? "Vittoria" :
            phase === "reveal" ? "Showreel" :
            phase === "showreel" ? "Checkout" :
            "Intro"
          }
        </button>
      </div>

      {/* Bonus Time Alert */}
      <AnimatePresence>
        {showBonusFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100000] bg-gold/15 border border-gold/40 px-6 py-3 backdrop-blur-md rounded-sm flex flex-col items-center select-none pointer-events-none"
          >
            <span className="text-gold text-[10px] font-mono tracking-[0.4em] uppercase font-bold mb-1">
              RIVELAZIONE RAPIDA ARMA
            </span>
            <span className="text-white text-sm font-black tracking-widest uppercase">
              +60 SECONDI DI BONUS TEMPO
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Warning Overlay */}
      {isMobile && !forceMobile && (
        <div className="fixed inset-0 z-[400000] bg-[#050505] flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.15)_0%,transparent_70%)]" />
          <div className="border border-gold/30 bg-gold/5 max-w-md p-8 md:p-12 relative flex flex-col items-center gap-6">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold" />

            <h2 className="text-gold font-mono text-[10px] tracking-[0.4em] uppercase">
              SISTEMA WAYNE TECH // MOBILE_ALERT
            </h2>
            <h3 className="text-white text-2xl font-black uppercase tracking-tighter">
              DISPOSITIVO NON OTTIMIZZATO
            </h3>
            <p className="text-white/60 text-xs font-medium tracking-wider leading-relaxed uppercase">
              L'esplorazione immersiva a 360° della Batcaverna richiede uno schermo desktop ed un mouse per completare la localizzazione degli indizi del Joker.
            </p>
            <div className="w-full flex flex-col gap-4 mt-4 pointer-events-auto">
              <button
                onClick={() => {
                  setMissionStatus("succeeded");
                  setSpeedrunUnlocked(false);
                  changePhase("showreel");
                }}
                className="w-full py-4 bg-gold text-black font-black uppercase tracking-widest text-xs transition-all hover:bg-white hover:shadow-[0_0_30px_rgba(250,204,21,0.4)]"
              >
                Salta al Prodotto & Ordina
              </button>
              <button
                onClick={() => setForceMobile(true)}
                className="w-full py-4 border border-white/20 text-white/50 font-black uppercase tracking-widest text-xs hover:text-white hover:border-white transition-colors"
              >
                Forza Esplorazione a 360°
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cinematic Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && <TransitionOverlay key="overlay" />}
      </AnimatePresence>
      <main className="text-white selection:bg-gold selection:text-black font-sans relative">

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
                changePhase("breather");
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

          {phase === "breather" && (
            <motion.div
              key="breather"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300000] bg-black flex flex-col items-center justify-center select-none"
            >
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center space-y-2"
              >
                <div className="text-[10px] font-mono text-green-500 tracking-[0.8em] uppercase font-bold">
                  DISATTIVAZIONE CARICHE... BOMBA DISINNESCATA.
                </div>
                <div className="text-[8px] font-mono text-white/30 tracking-[0.5em] uppercase">
                  RIPRISTINO SISTEMI DI SICUREZZA IN CORSO...
                </div>
              </motion.div>
            </motion.div>
          )}

          {phase === "reveal" && (
            <FinalReveal key="reveal" timeTaken={finalTimeTaken} onComplete={() => changePhase("showreel")} isPaused={isPaused} />
          )}

          {phase === "showreel" && (
            <div key="showreel" className="relative z-10">
              <BatmanCamera onPreorder={() => changePhase("checkout")} />
              <Pricing speedrunUnlocked={speedrunUnlocked} onPreorder={() => changePhase("checkout")} />
            </div>
          )}

          {phase === "checkout" && (
            <Checkout key="checkout" speedrunUnlocked={speedrunUnlocked} onClose={() => changePhase("showreel")} />
          )}
        </AnimatePresence>

        {/* Global Mission Overlays */}
        <AnimatePresence>
          {missionStatus === "failed" && (
            <ExplosionOverlay key="explosion" onReset={handleResetMission} onSkip={() => changePhase("breather")} />
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

      {/* Background Joker Audio Manager */}
      <JokerAudioManager
        isActive={isJokerActive}
        isMuted={isMuted}
        isPaused={isPaused}
      />
    </div>
  );
}
