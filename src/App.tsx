import { useState, useEffect, useRef, useCallback, Suspense, startTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { lazy } from "react";
import IntroScreen from "./sections/IntroScreen";
import TransitionOverlay from "./components/transitions/TransitionOverlay";
import ExplosionOverlay from "./components/transitions/ExplosionOverlay";
import JokerAudioManager from "./components/joker/JokerAudioManager";
import AssetPreloader from "./components/transitions/AssetPreloader";
import type { PanoramaScene } from "./components/cinematic/SharedPanoramaCanvas";
import BatmanButton from "./components/ui/BatmanButton";

const CinematicVideoPlayer = lazy(() => import("./components/cinematic/CinematicVideoPlayer"));
const SharedPanoramaCanvas = lazy(() => import("./components/cinematic/SharedPanoramaCanvas"));
const BatmanCamera = lazy(() => import("./components/cinematic/BatmanCamera"));
const BatcomputerBootOverlay = lazy(() => import("./components/ui/BatcomputerBootOverlay"));
const Checkout = lazy(() => import("./sections/Checkout"));
const FinalReveal = lazy(() => import("./sections/FinalReveal"));
const ThankYouPage = lazy(() => import("./sections/ThankYouPage"));
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
  const [showBootOverlay, setShowBootOverlay] = useState(false);
  // Note: audioRef is now managed by useAudioSystem

  // Mobile Detection
  const { isMobile, forceMobile, setForceMobile } = useMobileDetection();

  // Derived: is a cinematic transition video currently playing?
  const isVideoTransition = phase === "transition1" || phase === "transition2";

  const handleTimeUp = useCallback(() => setMissionStatus("failed"), []);

  // Timer logic
  const {
    timeLeft,
    elapsedSeconds,
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
  const [purchasedTotal, setPurchasedTotal] = useState(0);

  // Audio system — solo sincronizzazione mute, la riproduzione è gestita
  // dal singleton BatcavernAudio avviato in IntroScreen.
  useAudioSystem(isMuted);

  // Success Condition
  useEffect(() => {
    if (completedCount === 5 && missionStatus === "active") {
      // elapsedSeconds = tempo reale trascorso (esclude pause e transizioni)
      const timeTaken = elapsedSeconds;
      setFinalTimeTaken(timeTaken);
      
      // Speedrun Easter Egg check (under 90 seconds)
      if (timeTaken < 90 && timeTaken > 0) {
        setSpeedrunUnlocked(true);
      } else {
        setSpeedrunUnlocked(false);
      }
      
      setMissionStatus("succeeded");
      changePhase("breather");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedCount, missionStatus]);

  // Bonus Time Check: when user finds first 2 clues
  useEffect(() => {
    if (completedCount === 2 && missionStatus === "active") {
      // Usa elapsedSeconds (tempo reale) per check accurato
      if (elapsedSeconds <= 45 && grantBonusTime(60)) {
        setShowBonusFeedback(true);
        setTimeout(() => setShowBonusFeedback(false), 4000);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedCount, missionStatus]);

  // Unified phase change with transition overlay
  const changePhase = useCallback((newPhase: Phase) => {
    if (isTransitioning) return;

    if (phase === "intro" && newPhase === "batcomputer") {
      setPhase("batcomputer");
      setShowBootOverlay(true);
      return;
    }

    if (newPhase === "breather") {
      // La musica NON si interrompe — continua in background senza soluzione
      // di continuità. Il singleton BatcavernAudio gestisce il loop permanente.
      setIsTransitioning(true);
      setTimeout(() => { setPhase("breather"); }, 400);
      setTimeout(() => { setIsTransitioning(false); }, 1000);

      // Breather di 4 secondi, poi transizione a reveal (musica sempre attiva)
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => { setPhase("reveal"); }, 400);
        setTimeout(() => { setIsTransitioning(false); }, 1000);
      }, 4400);
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => { setPhase(newPhase); }, 400);
    setTimeout(() => { setIsTransitioning(false); }, 1000);
  }, [isTransitioning, phase, setPhase]);

  const handleResetMission = () => {
    setMissionStatus("idle");
    setPhase("intro");
    setCompletedCount(0);
    setTimerResetKey(prev => prev + 1);
    setPanoramaScene("batcomputer");
    resetTimer();
    setShowBonusFeedback(false);
    setSpeedrunUnlocked(false);
    setShowBootOverlay(false);
    // La musica continua senza interruzioni anche durante il reset
  };

  const handleStartMission = () => {
    setShowBootOverlay(false);
    setCompletedCount(0);
    setTimerResetKey(prev => prev + 1);
    resetTimer();
    setShowBonusFeedback(false);
    setMissionStatus("active");
    // La musica è già in riproduzione dal singleton — nessun restart
  };

  const handleSkipPhase = useCallback(() => {
    setIsTransitioning(false); // bypass potential lock

    if (phase === "intro") {
      setPanoramaScene("batcomputer");
      setPhase("batcomputer");
    } else if (phase === "batcomputer") {
      setPanoramaScene("armeria");
      setCompletedCount(2);
      setPhase("transition1");
    } else if (phase === "transition1") {
      setPanoramaScene("armeria");
      setPhase("armeria");
    } else if (phase === "armeria") {
      setPanoramaScene("batmobile");
      setCompletedCount(3);
      setPhase("transition2");
    } else if (phase === "transition2") {
      setPanoramaScene("batmobile");
      setPhase("batmobile");
    } else if (phase === "batmobile" || phase === "breather") {
      setMissionStatus("succeeded");
      setCompletedCount(5);
      setPhase("reveal");
    } else if (phase === "reveal") {
      setPhase("showreel");
    } else if (phase === "showreel") {
      setPhase("checkout");
    } else if (phase === "checkout") {
      setPurchasedQuantity(1);
      setPhase("thankyou");
    } else if (phase === "thankyou") {
      handleResetMission();
    }
  }, [phase]);

  const handlePrevPhase = useCallback(() => {
    setIsTransitioning(false); // bypass potential lock

    if (phase === "thankyou") {
      setPhase("checkout");
    } else if (phase === "checkout") {
      setPhase("showreel");
    } else if (phase === "showreel") {
      setPhase("reveal");
    } else if (phase === "reveal") {
      setPhase("batmobile");
    } else if (phase === "batmobile" || phase === "breather") {
      setPanoramaScene("batmobile");
      setPhase("transition2");
    } else if (phase === "transition2") {
      setPanoramaScene("armeria");
      setPhase("armeria");
    } else if (phase === "armeria") {
      setPanoramaScene("armeria");
      setPhase("transition1");
    } else if (phase === "transition1") {
      setPanoramaScene("batcomputer");
      setPhase("batcomputer");
    } else if (phase === "batcomputer") {
      setPhase("intro");
    }
  }, [phase]);

  // Easter Egg Shortcut: Command + 1 to skip to Showreel
  // E navigazione tramite frecce (ArrowRight, ArrowLeft)
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
      
      // Freccia destra: vai alla fase successiva
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleSkipPhase();
      }
      
      // Freccia sinistra: torna alla fase precedente
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevPhase();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, isTransitioning, handleSkipPhase, handlePrevPhase]);

  // Determine if the shared panorama canvas should be visible
  const panoramaPhases: Phase[] = ["batcomputer", "transition1", "armeria", "transition2", "batmobile"];
  const isPanoramaPhase = panoramaPhases.includes(phase);

  // Base completed counts per scene
  const baseCompleted =
    panoramaScene === "batcomputer" ? 0 :
      panoramaScene === "armeria" ? 2 : 3;

  // Joker laugh is active during investigation phases, but stops at victory (reveal)
  const isJokerActive = ["batcomputer", "transition1", "armeria", "transition2", "batmobile"].includes(phase) && missionStatus === "active";

  const handleProgress = useCallback((count: number) => {
    setCompletedCount(count);
  }, []);

  const handleNextPanorama = useCallback(() => {
    if (panoramaScene === "batcomputer") {
      setPhase("transition1");
      setTimeout(() => setPanoramaScene("armeria"), 100);
    } else if (panoramaScene === "armeria") {
      setPhase("transition2");
      setTimeout(() => setPanoramaScene("batmobile"), 100);
    } else if (panoramaScene === "batmobile") {
      changePhase("breather");
    }
  }, [panoramaScene, setPhase, setPanoramaScene, changePhase]);

  const handleToggleMute = useCallback(() => setIsMuted(prev => !prev), []);
  const handleTogglePause = useCallback(() => setIsPaused(prev => !prev), []);
  const handleBackFromCheckout = useCallback(() => changePhase("showreel"), [changePhase]);
  const handleGoToCheckout = useCallback(() => changePhase("checkout"), [changePhase]);

  return (
    <div className="bg-black min-h-screen relative overflow-x-hidden">
      <AssetPreloader />
      {/* Moved Navbar below everything else */}



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
              <BatmanButton
                variant="secondary"
                size={20}
                className="w-full"
                onClick={() => {
                  setMissionStatus("succeeded");
                  setSpeedrunUnlocked(false);
                  changePhase("showreel");
                }}
              >
                Vai direttamente alla Statua & Preordina
              </BatmanButton>
              <BatmanButton
                variant="ghost"
                size={20}
                className="w-full"
                onClick={() => setForceMobile(true)}
              >
                Continua l'Esplorazione a 360°
              </BatmanButton>
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
              onProgress={handleProgress}
              baseCompleted={baseCompleted}
              isPaused={isPaused}
              isMuted={isMuted}
              isMissionActive={missionStatus === "active"}
              onNext={handleNextPanorama}
            />
          </Suspense>
        )}

        {/* ── BATCOMPUTER BOOT OVERLAY ────────────────────────────────────── */}
        <AnimatePresence>
          {phase === "batcomputer" && showBootOverlay && (
            <BatcomputerBootOverlay onComplete={handleStartMission} initialTime={initialTime} />
          )}
        </AnimatePresence>

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
              <IntroScreen 
                onBegin={() => {
                  setPanoramaScene("batcomputer");
                  changePhase("batcomputer");
                }}
                initialTime={initialTime}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(!isMuted)}
                isPaused={isPaused}
                onTogglePause={() => setIsPaused(!isPaused)}
              />
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
                <div className="text-[10px] font-mono text-[#FFD700] tracking-[0.8em] uppercase font-bold">
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
              </Suspense>
              <Footer />
            </div>
          )}

          {phase === "checkout" && (
            <Suspense fallback={null}>
              <Checkout 
                key="checkout" 
                speedrunUnlocked={speedrunUnlocked} 
                onClose={() => changePhase("showreel")} 
                onSuccess={(qty, total) => {
                  setPurchasedQuantity(qty);
                  setPurchasedTotal(total);
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
                totalPaid={purchasedTotal}
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
      {/* Moved Navbar below everything else so it renders last */}
      <Navbar
        phase={
          (["intro", "transition1", "transition2", "breather"].includes(phase) || (phase === "batcomputer" && showBootOverlay))
            ? "intro"
            : ["batcomputer", "armeria", "batmobile"].includes(phase)
              ? "gamification"
              : phase === "reveal"
                ? "reveal"
                : phase === "showreel"
                  ? "showreel"
                  : phase === "checkout"
                    ? "checkout"
                    : "thankyou"
        }
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
        completedCount={completedCount}
        totalClues={5}
        timeLeft={missionStatus === "active" ? timeLeft : undefined}
        onPreorder={handleGoToCheckout}
        onBack={handleBackFromCheckout}
      />
    </div>
  );
}
