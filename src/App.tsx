import { useState, useEffect, useRef, useCallback, Suspense, startTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "./components/layout/Navbar";
import { lazy } from "react";
import IntroScreen from "./components/cinematic/IntroScreen";
import TransitionOverlay from "./components/transitions/TransitionOverlay";
import ExplosionOverlay from "./components/transitions/ExplosionOverlay";
import JokerAudioManager from "./components/joker/JokerAudioManager";
import AssetPreloader from "./components/transitions/AssetPreloader";
import type { PanoramaScene } from "./components/cinematic/SharedPanoramaCanvas";

const CinematicVideoPlayer = lazy(() => import("./components/cinematic/CinematicVideoPlayer"));
const SharedPanoramaCanvas = lazy(() => import("./components/cinematic/SharedPanoramaCanvas"));
const BatmanCamera = lazy(() => import("./components/cinematic/BatmanCamera"));
const Pricing = lazy(() => import("./components/showreel/Pricing"));
const Checkout = lazy(() => import("./components/showreel/Checkout"));
const FinalReveal = lazy(() => import("./components/showreel/FinalReveal"));
const ThankYouPage = lazy(() => import("./components/showreel/ThankYouPage"));
import { useMobileDetection } from "./hooks/useMobileDetection";
import { useMissionTimer } from "./hooks/useMissionTimer";
import { useAudioSystem } from "./hooks/useAudioSystem";



// Flow: intro → batcomputer (2) → transition1 → armeria (1) → transition2 → batmobile (2) → breather → reveal → showreel → checkout → thankyou
type Phase = "intro" | "batcomputer" | "transition1" | "armeria" | "transition2" | "batmobile" | "breather" | "reveal" | "showreel" | "checkout" | "thankyou";
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
  const [phase, setPhaseInternal] = useState<Phase>("intro");
  const setPhase = useCallback((newPhase: Phase | ((prev: Phase) => Phase)) => {
    startTransition(() => {
      setPhaseInternal(newPhase);
    });
  }, []);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [missionStatus, setMissionStatus] = useState<MissionStatus>("idle");
  const [timerResetKey, setTimerResetKey] = useState(0);
  // Track which panorama scene the SharedPanoramaCanvas should display
  const [panoramaScene, setPanoramaSceneInternal] = useState<PanoramaScene>("batcomputer");
  const setPanoramaScene = useCallback((newScene: PanoramaScene | ((prev: PanoramaScene) => PanoramaScene)) => {
    startTransition(() => {
      setPanoramaSceneInternal(newScene);
    });
  }, []);
  // Note: audioRef is now managed by useAudioSystem

  // Mobile Detection
  const { isMobile, forceMobile, setForceMobile } = useMobileDetection();

  // Derived: is a cinematic transition video currently playing?
  const isVideoTransition = phase === "transition1" || phase === "transition2";

  const handleTimeUp = useCallback(() => setMissionStatus("failed"), []);

  // Timer logic
  const {
    timeLeft,
    initialTime,
    timerABGroup,
    bonusTimeGranted,
    resetTimer,
    grantBonusTime,
    setTimeLeft,
  } = useMissionTimer(missionStatus, isPaused, isVideoTransition, handleTimeUp);

  const [showBonusFeedback, setShowBonusFeedback] = useState(false);
  const [speedrunUnlocked, setSpeedrunUnlocked] = useState(false);
  const [finalTimeTaken, setFinalTimeTaken] = useState(0);
  const [purchasedQuantity, setPurchasedQuantity] = useState(1);

  // Audio system
  const {
    audioRef,
    playMusic,
    pauseMusic,
    fadeOutMusic,
    fadeInMusic,
  } = useAudioSystem(isMuted);

  // Success Condition
  useEffect(() => {
    if (completedCount === 5 && missionStatus === "active") {
      const timeTaken = initialTime - timeLeft;
      setFinalTimeTaken(timeTaken);
      
      // Speedrun Easter Egg check (under 90 seconds)
      if (timeTaken < 90) {
        setSpeedrunUnlocked(true);

      } else {
        setSpeedrunUnlocked(false);
      }
      
      setMissionStatus("succeeded");
      changePhase("breather");
    }
  }, [completedCount, missionStatus, initialTime, timeLeft]);

  // Bonus Time Check: when user finds first 2 clues
  useEffect(() => {
    if (completedCount === 2 && missionStatus === "active") {
      const timeElapsed = initialTime - timeLeft;
      if (timeElapsed <= 45 && grantBonusTime(60)) {
        setShowBonusFeedback(true);

        setTimeout(() => setShowBonusFeedback(false), 4000);
      }
    }
  }, [completedCount, missionStatus, initialTime, timeLeft, grantBonusTime]);

  // Unified phase change with transition overlay
  const changePhase = (newPhase: Phase) => {
    if (isTransitioning) return;

    if (phase === "intro" && newPhase === "batcomputer") {
      setCompletedCount(0);
      setTimerResetKey(prev => prev + 1);
      resetTimer();
      setShowBonusFeedback(false);
      setMissionStatus("active");
      playMusic(20, 0.4);
    }

    if (newPhase === "breather") {
      setMissionStatus("succeeded");
      setFinalTimeTaken(0);
      setSpeedrunUnlocked(false);

      // Fade out background music
      fadeOutMusic();
      setIsTransitioning(true);
      setTimeout(() => { setPhase("breather"); }, 400);
      setTimeout(() => { setIsTransitioning(false); }, 1000);

      // Silent breather for 4 seconds, then transition to reveal
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setPhase("reveal");
          // Play calm/heroic theme start and fade in
          fadeInMusic(0.4, 0.05, 100);
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
    resetTimer();
    setShowBonusFeedback(false);
    setSpeedrunUnlocked(false);
    pauseMusic();
    if (audioRef.current) {
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
      setPurchasedQuantity(1);
      changePhase("thankyou");
    } else if (phase === "thankyou") {
      handleResetMission();
    }
  };

  // Easter Egg Shortcut: Command + 1 to skip to Showreel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD + 1 (Mac) or CTRL + 1 (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "1") {
        e.preventDefault();


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
      <AssetPreloader />
      <Navbar
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        showBack={phase === "checkout"}
        onBack={() => changePhase("showreel")}
        showPause={["batcomputer", "armeria", "batmobile"].includes(phase)}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        completedCount={["batcomputer", "armeria", "batmobile"].includes(phase) ? completedCount : undefined}
        totalClues={5}
        timeLeft={timeLeft}
        missionActive={missionStatus === "active"}
        showPreorder={phase === "showreel"}
        onPreorder={() => changePhase("checkout")}
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
            phase === "checkout" ? "Thank You" :
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
              DISPOSITIVO NON COMPATIBILE
            </h3>
            <p className="text-white/60 text-xs font-medium tracking-wider leading-relaxed uppercase">
              L'esplorazione immersiva a 360° della Batcaverna richiede un monitor desktop e un mouse. Solo così potrai individuare tutti gli indizi del Joker.
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
                Vai direttamente alla Statua & Preordina
              </button>
              <button
                onClick={() => setForceMobile(true)}
                className="w-full py-4 border border-white/20 text-white/50 font-black uppercase tracking-widest text-xs hover:text-white hover:border-white transition-colors"
              >
                Continua l’Esplorazione a 360°
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
          <Suspense fallback={<div className="absolute inset-0 bg-black flex items-center justify-center text-gold font-mono text-xs">CARICAMENTO AREA...</div>}>
            <SharedPanoramaCanvas
              scene={panoramaScene}
              onProgress={(count) => setCompletedCount(count)}
              baseCompleted={baseCompleted}
              isPaused={isPaused}
              isMuted={isMuted}
              isMissionActive={missionStatus === "active"}
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
          </Suspense>
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
              <Suspense fallback={<div className="fixed inset-0 bg-black z-[500]" />}>
                <CinematicVideoPlayer
                  src="./assets/videos/BatCaverna_PassaggioBatComputerAArmeria.mp4"
                  onEnded={() => setPhase("armeria")}
                  label="SPOSTAMENTO: ZONA ARMERIA"
                  nextAsset="./assets/textures/BatCaverna360_ArmeriaArea.jpg"
                />
              </Suspense>
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
              <Suspense fallback={<div className="fixed inset-0 bg-black z-[500]" />}>
                <CinematicVideoPlayer
                  src="./assets/videos/BatCaverna_PassaggioArmeriaABatMobile.mp4"
                  onEnded={() => setPhase("batmobile")}
                  label="SPOSTAMENTO: ZONA BATMOBILE"
                  nextAsset="./assets/textures/BatCaverna360_BatMobileArea.jpg"
                />
              </Suspense>
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
                  NEUTRALIZZAZIONE COMPLETATA… MINACCIA ELIMINATA.
                </div>
                <div className="text-[8px] font-mono text-white/30 tracking-[0.5em] uppercase">
                  RIPRISTINO PROTOCOLLI WAYNE TECH IN CORSO…
                </div>
              </motion.div>
            </motion.div>
          )}

          {phase === "reveal" && (
            <Suspense fallback={null}>
              <FinalReveal key="reveal" timeTaken={finalTimeTaken} onComplete={() => changePhase("showreel")} isPaused={isPaused} />
            </Suspense>
          )}

          {phase === "showreel" && (
            <div key="showreel" className="relative z-10">
              <Suspense fallback={null}>
                <BatmanCamera onPreorder={() => changePhase("checkout")} />
                <Pricing speedrunUnlocked={speedrunUnlocked} onPreorder={() => changePhase("checkout")} />
              </Suspense>
            </div>
          )}

          {phase === "checkout" && (
            <Suspense fallback={null}>
              <Checkout 
                key="checkout" 
                speedrunUnlocked={speedrunUnlocked} 
                onClose={() => changePhase("showreel")} 
                onSuccess={(qty) => {
                  setPurchasedQuantity(qty);
                  changePhase("thankyou");
                }}
              />
            </Suspense>
          )}

          {phase === "thankyou" && (
            <Suspense fallback={null}>
              <ThankYouPage
                key="thankyou"
                quantity={purchasedQuantity}
                onReturnHome={() => handleResetMission()}
                onViewStatue={() => changePhase("showreel")}
              />
            </Suspense>
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
              <p className="text-gold text-[10px] tracking-[0.8em] uppercase font-bold opacity-60">Batcomputer in Standby // In attesa di riattivazione</p>
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
