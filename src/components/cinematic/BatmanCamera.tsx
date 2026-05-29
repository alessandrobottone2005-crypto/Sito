import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence, useMotionValueEvent, useTransform } from "motion/react";
import BatmanButton from "../ui/BatmanButton";

const TOTAL_FRAMES = 800;
const IMAGE_PREFIX = "./assets/showreel/";
const IMAGE_SUFFIX = ".png";
// Show the canvas / hide the loading overlay once this many early frames are ready.
// The rest of the 800 frames continue loading silently in the background.
const SHOW_THRESHOLD = 120;
const CONCURRENCY_LIMIT = 60;

const pad = (num: number) => num.toString().padStart(4, "0");

/* ─── Glitch Text Component ──────────────────────────────────────── */
function GlitchText({
  children,
  className = "",
  intensity = "med",
  tag: Tag = "span",
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: "slow" | "med" | "main";
  tag?: any;
}) {
  const cls = intensity === "main" ? "glitch-main" : intensity === "slow" ? "glitch-slow" : "glitch-med";
  // @ts-ignore
  return <Tag className={`${cls} ${className}`}>{children}</Tag>;
}

/* ─── Typing text that re-types periodically ─────────────────────── */
function TypingText({ text, className = "", speed = 60 }: { text: string; className?: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "waiting" | "erasing">("typing");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (idx < text.length) {
        timeout = setTimeout(() => { setDisplayed(text.slice(0, idx + 1)); setIdx(i => i + 1); }, speed);
      } else {
        timeout = setTimeout(() => setPhase("waiting"), 2500);
      }
    } else if (phase === "waiting") {
      timeout = setTimeout(() => setPhase("erasing"), 500);
    } else {
      if (idx > 0) {
        timeout = setTimeout(() => { setIdx(i => i - 1); setDisplayed(text.slice(0, idx - 1)); }, speed / 2);
      } else {
        timeout = setTimeout(() => setPhase("typing"), 300);
      }
    }
    return () => clearTimeout(timeout);
  }, [idx, phase, text, speed]);

  return (
    <span className={`cursor-blink ${className}`}>{displayed}</span>
  );
}

/* ─── Scramble Text Component ────────────────────────────────────── */
function ScrambleText({ text, className = "", duration = 1.5, trigger = true }: { text: string; className?: string; duration?: number; trigger?: boolean }) {
  const [displayed, setDisplayed] = useState(text);
  const chars = "!@#$%^&*()_+{}:\"<>?|ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    const totalFrames = duration * 60;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const scrambled = text.split("").map((char, i) => {
        if (char === " " || i / text.length < progress) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join("");
      setDisplayed(scrambled);
      if (frame >= totalFrames) clearInterval(interval);
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [text, duration, trigger]);

  return <span className={className}>{displayed}</span>;
}

/* ─── HUD Corner decorators ──────────────────────────────────────── */
function HudCorners({ color = "rgba(255,215,0,0.5)" }: { color?: string }) {
  return (
    <>
      <div className="hud-corner-tl hud-pulse" style={{ borderColor: color }} />
      <div className="hud-corner-tr hud-pulse" style={{ borderColor: color }} />
      <div className="hud-corner-bl hud-pulse" style={{ borderColor: color }} />
      <div className="hud-corner-br hud-pulse" style={{ borderColor: color }} />
    </>
  );
}

export default function BatmanCamera({ onPreorder }: { onPreorder?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 40,
    restDelta: 0.001,
  });

  const [activeBeat, setActiveBeat] = useState<number>(-1);
  useMotionValueEvent(smoothProgress, "change", (p) => {
    if (p > 0.08 && p < 0.25) setActiveBeat(0);
    else if (p > 0.28 && p < 0.45) setActiveBeat(1);
    else if (p > 0.48 && p < 0.65) setActiveBeat(2);
    else if (p > 0.68 && p < 0.90) setActiveBeat(3);
    else setActiveBeat(-1);
  });

  const [progress, setProgress] = useState(0);
  // Use useEffect-based subscription for guaranteed reliability
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setProgress(latest);
      if (Math.round(latest * 100) % 10 === 0) {
        console.log("[BatmanCamera] scroll progress:", latest.toFixed(3));
      }
    });
    return unsubscribe;
  }, [scrollYProgress]);

  // Optimized Concurrent Preload — priority-first strategy:
  //   Phase 1: Load frames 1-SHOW_THRESHOLD with full concurrency so the
  //            loading overlay disappears quickly (~15% of total).
  //   Phase 2: Continue loading the remaining frames silently in background.
  //   The canvas fallback logic already handles any frame gaps during playback.
  useEffect(() => {
    let count = 0;
    let isMounted = true;
    // Shared queue pointer — workers race to claim the next index
    let currentIndex = 1;

    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        // Hint to the browser that early frames are high priority
        (img as any).fetchPriority = index <= SHOW_THRESHOLD ? "high" : "low";
        img.src = `${IMAGE_PREFIX}${pad(index)}${IMAGE_SUFFIX}`;
        const onFinish = () => {
          if (!isMounted) return resolve();
          count++;
          setLoadedCount(count);
          // Unlock the experience as soon as the first SHOW_THRESHOLD frames arrive
          if (count >= SHOW_THRESHOLD) setIsLoaded(true);
          resolve();
        };
        img.onload = onFinish;
        img.onerror = onFinish;
        imagesRef.current[index - 1] = img;
      });
    };

    // Phase 1 — race to load first SHOW_THRESHOLD frames
    const runPriorityPhase = async () => {
      const workers = Array(Math.min(SHOW_THRESHOLD, CONCURRENCY_LIMIT)).fill(null).map(async () => {
        while (currentIndex <= SHOW_THRESHOLD && isMounted) {
          const index = currentIndex++;
          await loadImage(index);
        }
      });
      await Promise.all(workers);
    };

    // Phase 2 — fill remaining frames in background
    const runBackgroundPhase = async () => {
      const workers = Array(CONCURRENCY_LIMIT).fill(null).map(async () => {
        while (currentIndex <= TOTAL_FRAMES && isMounted) {
          const index = currentIndex++;
          await loadImage(index);
        }
      });
      await Promise.all(workers);
    };

    const run = async () => {
      await runPriorityPhase();
      if (isMounted) await runBackgroundPhase();
    };

    run();
    return () => { isMounted = false; };
  }, []);

  // Draw Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const progressValue = smoothProgress.get();
      const frameIndex = Math.min(Math.max(1, Math.floor(progressValue * TOTAL_FRAMES)), TOTAL_FRAMES);
      
      let img = imagesRef.current[frameIndex - 1];
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let i = frameIndex - 1; i >= 0; i--) {
          if (imagesRef.current[i] && imagesRef.current[i].complete && imagesRef.current[i].naturalWidth !== 0) {
            img = imagesRef.current[i];
            break;
          }
        }
      }

      if (img && img.complete && img.naturalWidth !== 0) {
        const { width, height } = canvas;
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let dw, dh, ox, oy;
        
        if (imgRatio > canvasRatio) {
          dh = height; dw = height * imgRatio;
          ox = (width - dw) / 2; oy = 0;
        } else {
          dw = width; dh = width / imgRatio;
          ox = 0; oy = (height - dh) / 2;
        }
        
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, ox, oy, dw, dh);
      }
    };

    const unsubscribe = smoothProgress.on("change", render);
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => { unsubscribe(); window.removeEventListener("resize", handleResize); };
  }, [smoothProgress]);

  // Glitch animation variants for text beats
  const glitchVariants = {
    initial: { 
      opacity: 0, 
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", 
      filter: "brightness(2)" 
    },
    animate: { 
      opacity: 1, 
      clipPath: [
        "polygon(0 20%, 100% 20%, 100% 40%, 0 40%)",
        "polygon(0 80%, 100% 80%, 100% 100%, 0 100%)",
        "polygon(0 0, 100% 100%, 100% 0, 0 100%)",
        "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
      ],
      filter: ["brightness(2) contrast(1.5)", "brightness(1.5) contrast(2)", "brightness(1) contrast(1)"],
      x: [-15, 15, -10, 5, 0],
      transition: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 1] }
    },
    exit: {
      opacity: 0,
      filter: ["brightness(1) contrast(1)", "brightness(2) contrast(2)", "brightness(0) contrast(0)"],
      x: [0, -15, 15, -10, 0],
      clipPath: [
        "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        "polygon(0 40%, 100% 40%, 100% 60%, 0 60%)",
        "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)"
      ],
      transition: { duration: 0.3 }
    }
  };

  return (
    <div ref={containerRef} className="relative h-[800vh]">
      {/* ── Fixed Showreel Viewport ── */}
      <div className="fixed inset-0 w-full h-full z-10 pointer-events-none overflow-hidden">
        
        {/* Canvas Background */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-contain z-10" />

        {/* HUD Layer */}
        <div className="absolute inset-0 z-20 opacity-40 pointer-events-none">
          <div className="absolute top-24 left-10 w-32 h-32 border-t border-l border-white/20 p-4">
             <div className="text-[8px] font-mono text-gold uppercase tracking-tighter">ID: B-KNIGHT-87<br/>SCAN: ACTIVE</div>
          </div>
          <div className="absolute top-24 right-10 w-32 h-32 border-t border-r border-white/20 text-right p-4">
             <div className="text-[8px] font-mono text-gold uppercase tracking-widest">COORD: 40.712 N<br/>LONG: 74.006 O</div>
          </div>
          <div className="hud-axis-x" />
          <div className="hud-axis-y" />
        </div>

        {/* Text Beats Overlay */}
        <div className="absolute inset-0 z-[60] pointer-events-none overflow-hidden">
          <AnimatePresence>
            {activeBeat === 0 && (
              <motion.div
                key="beat0"
                variants={glitchVariants}
                initial="initial" animate="animate" exit="exit"
                className="absolute top-1/2 -translate-y-1/2 left-8 md:left-24 max-w-[40vw]"
              >
                <h2 className="text-[7vw] md:text-[4vw] font-black text-[#FFD700] uppercase tracking-[0.1em] leading-[0.9] mb-4"
                  style={{ textShadow: "0px 10px 40px rgba(0,0,0,0.95), 0px 0px 20px rgba(255,215,0,0.4)" }}>
                  SCULTURA DI<br/>PRECISIONE
                </h2>
                <p className="text-white uppercase tracking-[0.3em] text-[10px] md:text-sm font-light"
                  style={{ textShadow: "0px 2px 10px rgba(0,0,0,0.95)" }}>
                  Ogni ombra di Gotham scolpita con ossessione
                </p>
              </motion.div>
            )}

            {activeBeat === 1 && (
              <motion.div
                key="beat1"
                variants={glitchVariants}
                initial="initial" animate="animate" exit="exit"
                className="absolute top-1/2 -translate-y-1/2 right-8 md:right-24 max-w-[40vw] text-right"
              >
                <h2 className="text-[7vw] md:text-[4vw] font-black text-[#FFD700] uppercase tracking-[0.1em] leading-[0.9] mb-4"
                  style={{ textShadow: "0px 10px 40px rgba(0,0,0,0.95), 0px 0px 20px rgba(255,215,0,0.4)" }}>
                  MATERIALI<br/>D'ELITE
                </h2>
                <p className="text-white uppercase tracking-[0.3em] text-[10px] md:text-sm font-light"
                  style={{ textShadow: "0px 2px 10px rgba(0,0,0,0.95)" }}>
                  Finitura da pezzo da museo, non da scaffale
                </p>
              </motion.div>
            )}

            {activeBeat === 2 && (
              <motion.div
                key="beat2"
                variants={glitchVariants}
                initial="initial" animate="animate" exit="exit"
                className="absolute top-1/2 -translate-y-1/2 left-8 md:left-24 max-w-[40vw]"
              >
                <h2 className="text-[7vw] md:text-[4vw] font-black text-[#FFD700] uppercase tracking-[0.1em] leading-[0.9] mb-4"
                  style={{ textShadow: "0px 10px 40px rgba(0,0,0,0.95), 0px 0px 20px rgba(255,215,0,0.4)" }}>
                  EDIZIONE<br/>LIMITATA
                </h2>
                <p className="text-white uppercase tracking-[0.3em] text-[10px] md:text-sm font-light"
                  style={{ textShadow: "0px 2px 10px rgba(0,0,0,0.95)" }}>
                  Solo 500 esemplari al mondo. Il tuo porta un numero.
                </p>
              </motion.div>
            )}

            {activeBeat === 3 && (
              <motion.div
                key="beat3"
                variants={glitchVariants}
                initial="initial" animate="animate" exit="exit"
                className="absolute top-1/2 -translate-y-1/2 right-8 md:right-24 max-w-[40vw] text-right"
              >
                <h2 className="text-[7vw] md:text-[4vw] font-black text-[#FFD700] uppercase tracking-[0.1em] leading-[0.9] mb-4"
                  style={{ textShadow: "0px 10px 40px rgba(0,0,0,0.95), 0px 0px 20px rgba(255,215,0,0.4)" }}>
                  PRESENZA<br/>LEGGENDARIA
                </h2>
                <p className="text-white uppercase tracking-[0.3em] text-[10px] md:text-sm font-light"
                  style={{ textShadow: "0px 2px 10px rgba(0,0,0,0.95)" }}>
                  Non arredamento. Una presenza.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 z-40 pointer-events-none" style={{ background: "radial-gradient(circle, transparent 20%, rgba(0,0,0,0.8) 100%)" }} />
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            initial={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
          >
             <div className="text-gold font-mono text-[10px] tracking-[1em] mb-4">CARICAMENTO_DATI</div>
             <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gold" 
                  initial={{ width: 0 }} 
                  animate={{ width: `${(loadedCount/TOTAL_FRAMES)*100}%` }} 
                />
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
