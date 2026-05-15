import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValueEvent } from "motion/react";
import BatmanText from "./BatmanText";
import BatmanButton from "./BatmanButton";

const TOTAL_FRAMES = 800;
const IMAGE_PREFIX = "";
const IMAGE_SUFFIX = ".png";

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
  const [images, setImages] = useState<HTMLImageElement[]>([]);
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

  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  // Optimized Concurrent Preload
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;
    let isMounted = true;
    const CONCURRENCY_LIMIT = 30; // Batched loading for stability
    let currentIndex = 1;

    const timeout = setTimeout(() => {
      if (isMounted && !isLoaded) {
        console.warn("Loading timeout: Proceeding with available frames.");
        setIsLoaded(true);
      }
    }, 40000);

    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = `${IMAGE_PREFIX}${pad(index)}${IMAGE_SUFFIX}`;
        
        const onFinish = () => {
          if (!isMounted) return resolve();
          count++;
          setLoadedCount(count);
          if (count === TOTAL_FRAMES) {
            setIsLoaded(true);
            clearTimeout(timeout);
          }
          resolve();
        };

        img.onload = onFinish;
        img.onerror = onFinish;
        loadedImages[index - 1] = img;
      });
    };

    const runQueue = async () => {
      const workers = Array(CONCURRENCY_LIMIT).fill(null).map(async () => {
        while (currentIndex <= TOTAL_FRAMES && isMounted) {
          const index = currentIndex++;
          await loadImage(index);
          // Periodically update state to allow early rendering
          if (index % 50 === 0) {
            setImages([...loadedImages]);
          }
        }
      });
      await Promise.all(workers);
      if (isMounted) {
        setImages([...loadedImages]);
      }
    };

    runQueue();

    return () => { 
      isMounted = false; 
      clearTimeout(timeout); 
    };
  }, []);

  // Draw Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const progressValue = smoothProgress.get();
      const scrollFrameProgress = Math.max(0, Math.min(1, progressValue));
      
      // Calculate index based on available images
      const maxIndex = Math.max(0, images.length - 1);
      const frameIndex = Math.floor(scrollFrameProgress * maxIndex);
      
      const img = images[frameIndex];
      if (img && img.complete && img.naturalWidth !== 0) {
        const { width, height } = canvas;
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let drawWidth, drawHeight, offsetX, offsetY;
        if (imgRatio > canvasRatio) {
          drawHeight = height; drawWidth = height * imgRatio;
          offsetX = (width - drawWidth) / 2; offsetY = 0;
        } else {
          drawWidth = width; drawHeight = width / imgRatio;
          offsetX = 0; offsetY = (height - drawHeight) / 2;
        }
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
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
  }, [images, smoothProgress]);

  // Overlay animations
  const useBeatStyle = (start: number, end: number) => {
    const stableStart = start + (end - start) * 0.15;
    const stableEnd = end - (end - start) * 0.15;
    const opacity = useTransform(scrollYProgress, [start, stableStart, stableEnd, end], [0, 1, 1, 0]);
    const scale   = useTransform(scrollYProgress, [start, stableStart, stableEnd, end], [0.8, 1, 1, 1.2]);
    const filter  = useTransform(scrollYProgress, [start, stableStart, stableEnd, end], ["blur(15px)", "blur(0px)", "blur(0px)", "blur(15px)"]);
    const y       = useTransform(scrollYProgress, [start, stableStart, stableEnd, end], [40, 0, 0, -40]);
    return { opacity, scale, filter, y };
  };

  const beatA = useBeatStyle(0.1, 0.25);
  const beatB = useBeatStyle(0.3, 0.45);
  const beatC = useBeatStyle(0.5, 0.65);
  const beatD = useBeatStyle(0.7, 0.83);

  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <motion.div ref={containerRef} className="relative h-[2000vh] bg-black">

      {/* ── Loading Screen ── */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-10 select-none overflow-hidden power-on"
          >
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="absolute inset-0 pointer-events-none opacity-10">
              <div className="absolute top-1/2 w-full h-[1px] bg-[#FFD700]" />
              <div className="absolute left-1/2 h-full w-[1px] bg-[#FFD700]" />
            </div>

            {/* Scan line sweeping */}
            <div className="scan-sweep-line" />

            <div className="relative z-10 flex flex-col items-center w-full max-w-md">
              {/* Minimal Tech Loader replaced '87' block */}
              <div className="mb-12 relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 rounded-full border border-gold/40"
                />
              </div>

              {/* Progress Bar */}
              <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden mb-8 relative border-glitch">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#FFD700]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(loadedCount / TOTAL_FRAMES) * 100}%` }}
                />
                <motion.div
                  className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  animate={{ left: ["-20%", "120%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* Status Text */}
              <div className="flex flex-col items-center gap-3 mb-12">
                <BatmanText delay={0.1}>
                  <TypingText
                    text={`SINCRONIZZAZIONE BAT-COMPUTER | ${Math.round((loadedCount / TOTAL_FRAMES) * 100)}%`}
                    className="text-[#FFD700] font-mono text-[10px] tracking-[0.4em] uppercase font-bold text-center"
                    speed={30}
                  />
                </BatmanText>
                <BatmanText delay={0.2}>
                  <span className="text-white/20 font-mono text-[8px] tracking-[0.2em] uppercase flicker">
                    PROTOCOLLI: CRITTOGRAFATI-ATTIVI | BUFFER-FLUSSO: PRONTO
                  </span>
                </BatmanText>
                <BatmanText delay={0.3}>
                  <motion.span
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-white/15 font-mono text-[7px] tracking-[0.15em] uppercase text-jump"
                  >
                    RSA_2048 ██ CONNESSIONE SICURA ██ GOTHAM_NET_v9.0 ██ SISTEMA_INSTABILE_0x3F
                  </motion.span>
                </BatmanText>
              </div>

              {/* Emergency Skip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <BatmanButton
                  onClick={() => setIsLoaded(true)}
                  variant="ghost"
                  showScanLine={true}
                >
                  Accesso Manuale →
                </BatmanButton>
              </motion.div>
            </div>

            <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-white/10 hud-pulse" />
            <div className="absolute top-10 right-10 w-20 h-20 border-t border-r border-white/10 hud-pulse" />
            <div className="absolute bottom-10 left-10 w-20 h-20 border-b border-l border-white/10 hud-pulse" />
            <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-white/10 hud-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col z-10">
        <div className="absolute inset-0 z-20 pointer-events-none opacity-40">
          <div className="absolute top-24 left-10 w-32 h-32 border-t border-l border-white/20 p-4 hud-pulse">
            <BatmanText delay={0.1}>
              <div className="text-[8px] font-mono text-[#FFD700] uppercase tracking-tighter leading-tight glitch-slow">
                ID_OGG: B-KNIGHT-87<br />MODO_SCAN: ATTIVO<br />SORG: GOTHAM_SIDESHOW
              </div>
            </BatmanText>
          </div>
          <div className="absolute top-24 right-10 w-32 h-32 border-t border-r border-white/20 text-right p-4 hud-pulse">
            <BatmanText delay={0.2}>
              <div className="text-[8px] font-mono text-gold uppercase tracking-widest glitch-slow">
                COORD: 40.712° N<br />LONG: 74.006° O
              </div>
            </BatmanText>
          </div>
          <div className="absolute bottom-24 left-10 w-32 h-16 border-b border-l border-white/20 p-4 hud-pulse">
            <BatmanText delay={0.3}>
              <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest flicker">
                SIST: V9.0.2 / RSA
              </div>
            </BatmanText>
          </div>
          <div className="absolute bottom-24 right-10 w-32 h-16 border-b border-r border-white/20 text-right p-4 hud-pulse">
            <BatmanText delay={0.4}>
              <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest flicker">
                SINC: OPERATIVO
              </div>
            </BatmanText>
          </div>

          <div className="hud-axis-x" />
          <div className="hud-axis-y" />

          <motion.div
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent shadow-[0_0_15px_rgba(255,215,0,0.4)] z-10"
          />

          <motion.div
            animate={{ left: ['-20%', '120%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
            className="absolute top-0 w-32 h-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.03), transparent)',
              transform: 'skewX(-10deg)',
            }}
          />
        </div>

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-contain z-10"
        />

        <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center overflow-hidden">
          <motion.div style={beatA} className="absolute flex flex-col items-center text-center w-full px-6">
            <div className="relative inline-flex flex-col items-center p-8">
              <HudCorners />
              <div className="scan-sweep-line" />
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[#FFD700] text-[10px] font-mono mb-3 tracking-[0.3em]"
              >
                <TypingText text="SCAN_01 // ANALISI_DETTAGLIO" speed={50} />
              </motion.div>
              <GlitchText tag="h2" intensity="main" className="text-6xl md:text-8xl font-black tracking-tighter mb-4 uppercase text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] gold-glow ghost-rgb">
                <ScrambleText text="SCULPTING DI" trigger={progress > 0.08 && progress < 0.22} /> <br />
                <ScrambleText text="PRECISIONE" trigger={progress > 0.08 && progress < 0.22} />
              </GlitchText>
              <motion.div
                animate={{ width: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="h-[1px] bg-[#FFD700] mb-4 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
              />
              <p className="text-sm md:text-base text-white/70 font-medium tracking-wide uppercase max-w-md leading-relaxed text-center drop-shadow-md flicker">
                Dettagli ultra-definiti che catturano <br />
                ogni sfumatura del Cavaliere Oscuro.
              </p>
            </div>
          </motion.div>

          <motion.div style={beatB} className="absolute flex flex-col items-center text-center w-full px-6">
            <div className="relative inline-flex flex-col items-center p-8">
              <HudCorners />
              <div className="scan-sweep-line" />
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[#FFD700] text-[10px] font-mono mb-3 tracking-[0.3em]"
              >
                <TypingText text="SCAN_02 // INFO_MATERIALI" speed={50} />
              </motion.div>
              <GlitchText tag="h2" intensity="slow" className="text-6xl md:text-8xl font-black tracking-tighter mb-4 uppercase text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] gold-glow ghost-rgb">
                <ScrambleText text="MATERIALI" trigger={progress > 0.28 && progress < 0.48} /> <br />
                <ScrambleText text="PREMIUM" trigger={progress > 0.28 && progress < 0.48} />
              </GlitchText>
              <motion.div
                animate={{ width: ["0%", "100%", "0%"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-[1px] bg-[#FFD700] mb-4 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
              />
              <p className="text-sm md:text-base text-white/70 font-medium tracking-wide uppercase max-w-md leading-relaxed text-center drop-shadow-md flicker">
                Realizzata con resine di alta qualità <br />
                e finiture di livello museale.
              </p>
            </div>
          </motion.div>

          <motion.div style={beatC} className="absolute flex flex-col items-center text-center w-full px-6">
            <div className="relative inline-flex flex-col items-center p-8">
              <HudCorners />
              <div className="scan-sweep-line" />
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="text-[#FFD700] text-[10px] font-mono mb-3 tracking-[0.3em]"
              >
                <TypingText text="SCAN_03 // CONTROLLO_RARITÀ" speed={50} />
              </motion.div>
              <GlitchText tag="h2" intensity="main" className="text-6xl md:text-8xl font-black tracking-tighter mb-4 uppercase text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] gold-glow ghost-rgb">
                <ScrambleText text="EDIZIONE" trigger={progress > 0.73 && progress < 0.84} /> <br />
                <ScrambleText text="LIMITATA" trigger={progress > 0.73 && progress < 0.84} />
              </GlitchText>
              <motion.div
                animate={{ width: ["0%", "100%", "0%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-[1px] bg-[#FFD700] mb-4 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
              />
              <p className="text-sm md:text-base text-white/70 font-medium tracking-wide uppercase max-w-md leading-relaxed text-center drop-shadow-md flicker">
                Produzione numerata per garantire <br />
                esclusività e valore nel tempo.
              </p>
            </div>
          </motion.div>

          <motion.div style={beatD} className="absolute flex flex-col items-center text-center w-full px-6">
            <div className="relative inline-flex flex-col items-center p-8">
              <HudCorners />
              <div className="scan-sweep-line" />
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="text-[#FFD700] text-[10px] font-mono mb-3 tracking-[0.3em]"
              >
                <TypingText text="SCAN_04 // SCANSIONE_ATMOSFERA" speed={50} />
              </motion.div>
              <GlitchText tag="h2" intensity="slow" className="text-6xl md:text-8xl font-black tracking-tighter mb-4 uppercase text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] gold-glow">
                PRESENZA <br />ICONICA
              </GlitchText>
              <motion.div
                animate={{ width: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="h-[1px] bg-[#FFD700] mb-4 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
              />
              <p className="text-sm md:text-base text-white/70 font-medium tracking-wide uppercase max-w-md leading-relaxed text-center drop-shadow-md flicker">
                Una composizione scenica che trasforma <br />
                ogni spazio in una Batcaverna.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/20 text-[8px] tracking-[0.5em] uppercase cursor-blink flicker">
            Scorri per esplorare
          </span>
          <motion.div
            animate={{ height: [32, 64, 32] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] bg-gradient-to-b from-[#FFD700] to-transparent"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
