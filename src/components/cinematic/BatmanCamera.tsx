import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useSpring, AnimatePresence, useMotionValueEvent } from "motion/react";

const TOTAL_FRAMES = 800;
const IMAGE_PREFIX = "./assets/showreel/";
const IMAGE_SUFFIX = ".png";
const SHOW_THRESHOLD = 120;
const CONCURRENCY_LIMIT = 60;

const pad = (num: number) => num.toString().padStart(4, "0");

import TechBackground from "../ui/TechBackground";

/* ════════════════════════════════════════════════════════════════════
   TECH BACKGROUND (Restored)
   Dark cyberpunk style with hex grid, circuit traces, data stream
════════════════════════════════════════════════════════════════════ */


/* ════════════════════════════════════════════════════════════════════
   3D DEPTH TEXT — Dual-layer system
════════════════════════════════════════════════════════════════════ */
type DepthPhase = "idle" | "behind" | "crossing" | "front" | "exiting";

interface DepthTextProps {
  isActive: boolean;
  children: React.ReactNode;
  yAnchor?: string;
  yTranslate?: string;
  alignX?: "left" | "center" | "right";
  xInset?: string;
  innerClass?: string;
  backZIndex?: number;
  frontZIndex?: number;
  crossDelay?: number;
}

function DepthText({
  isActive,
  children,
  yAnchor = "50%",
  yTranslate = "-50%",
  alignX = "left",
  xInset = "5vw",
  innerClass = "",
  backZIndex = 5,
  frontZIndex = 60,
  crossDelay = 700,
}: DepthTextProps) {
  const [phase, setPhase] = useState<DepthPhase>("idle");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (isActive) {
      setPhase("behind");
      timersRef.current.push(setTimeout(() => setPhase("crossing"), crossDelay));
      timersRef.current.push(setTimeout(() => setPhase("front"), crossDelay + 450));
    } else {
      if (phase !== "idle") {
        setPhase("exiting");
        timersRef.current.push(setTimeout(() => setPhase("idle"), 700));
      }
    }
    return () => timersRef.current.forEach(clearTimeout);
  }, [isActive]);

  if (phase === "idle") return null;

  const backVisible = phase === "behind";
  const backOpacity    = backVisible ? 0.55 : 0;
  const backScale      = backVisible ? 0.82 : 0.72;
  const backBlurPx     = backVisible ? 0   : 6;
  const backY          = backVisible ? 0   : 12;
  const backBrightness = backVisible ? 0.85 : 0.4;

  const frontVisible = phase === "front";
  const frontCross   = phase === "crossing";
  const frontExit    = phase === "exiting";
  const frontOpacity    = frontVisible ? 1 : frontCross ? 0.85 : frontExit ? 0 : 0;
  const frontScale      = frontVisible ? 1 : frontCross ? 1.06 : frontExit ? 0.9 : 0.9;
  const frontBlurPx     = frontCross ? 1.2 : 0;
  const frontY          = frontVisible ? 0 : frontCross ? -6 : frontExit ? 10 : 8;
  const frontBrightness = frontCross ? 1.4 : 1;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    top: yAnchor,
    transform: `translateY(${yTranslate})`,
    ...(alignX === "left"   ? { left:  xInset } : {}),
    ...(alignX === "right"  ? { right: xInset } : {}),
    ...(alignX === "center" ? { left: "50%", transform: `translateY(${yTranslate}) translateX(-50%)` } : {}),
    pointerEvents: "none",
  };

  const transitionStr = "opacity 0.45s cubic-bezier(0.23,1,0.32,1), transform 0.45s cubic-bezier(0.23,1,0.32,1), filter 0.45s ease";

  return (
    <>
      <div style={{ ...baseStyle, zIndex: backZIndex }}>
        <div
          className={innerClass}
          style={{
            opacity: backOpacity,
            transform: `scale(${backScale}) translateY(${backY}px)`,
            filter: `blur(${backBlurPx}px) brightness(${backBrightness})`,
            transition: transitionStr,
            transformOrigin: alignX === "right" ? "right center" : alignX === "center" ? "center" : "left center",
          }}
        >
          {children}
        </div>
      </div>

      <div style={{ ...baseStyle, zIndex: frontZIndex }}>
        {frontCross && (
          <motion.div
            key="burst"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.5, 0], scale: [0.7, 2.0, 3.0] }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: "-30px",
              borderRadius: 8,
              background: "radial-gradient(ellipse at center, rgba(255,215,0,0.25) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />
        )}
        <div
          className={innerClass}
          style={{
            opacity: frontOpacity,
            transform: `scale(${frontScale}) translateY(${frontY}px)`,
            filter: `blur(${frontBlurPx}px) brightness(${frontBrightness})`,
            transition: transitionStr,
            transformOrigin: alignX === "right" ? "right center" : alignX === "center" ? "center" : "left center",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════
   FINAL CTA — Appears smoothly between frame 700 and 800
   Title behind the statue head, Button below the statue
════════════════════════════════════════════════════════════════════ */
function FinalCTA({ progress, onPreorder }: { progress: number; onPreorder?: () => void }) {
  // progress 0.875 -> 1.0 (frame 700 to 800)
  const t = Math.max(0, Math.min(1, (progress - 0.875) / 0.125));
  
  if (t === 0) return null;

  return (
    <>
      {/* ─── TITLE: "L'EREDITÀ È TUA" ─── Behind the statue (z: 5) */}
      <div style={{
        position: "absolute",
        top: "15%",
        left: "50%",
        transform: `translateX(-50%) scale(${0.8 + 0.2 * t})`,
        zIndex: 5,
        opacity: t,
        pointerEvents: "none",
        textAlign: "center"
      }}>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 80px)",
            fontWeight: 900,
            color: "#FFD700",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            lineHeight: 1,
            whiteSpace: "nowrap",
            textShadow: "0 0 20px rgba(255,215,0,0.5), 0 0 50px rgba(255,215,0,0.2)"
          }}
        >
          L'EREDITÀ È TUA
        </h1>
        <div style={{
          fontFamily: "monospace",
          fontSize: "clamp(10px, 1.2vw, 14px)",
          letterSpacing: "0.6em",
          color: "rgba(255,215,0,0.7)",
          textTransform: "uppercase",
          marginTop: "16px",
          textShadow: "0 0 20px rgba(255,215,0,0.3)"
        }}>
          EDIZIONE LIMITATA · 500 ESEMPLARI
        </div>
      </div>

      {/* ─── PREORDER BUTTON — Bottom, above statue (z: 65) ─── */}
      <div
        style={{ 
          position: "absolute", 
          bottom: "12%", 
          left: "50%", 
          transform: `translateX(-50%) translateY(${(1 - t) * 40}px)`, 
          zIndex: 65, 
          opacity: t,
          pointerEvents: t > 0.8 ? "auto" : "none" 
        }}
      >
        <PreorderButtonInner btnGlitch={false} onPreorder={onPreorder} />
      </div>
    </>
  );
}

function PreorderButtonInner({ btnGlitch, onPreorder }: { btnGlitch: boolean; onPreorder?: () => void }) {
  return (
    <div className="relative">
      {btnGlitch && (
        <>
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "translateX(-3px)", color: "rgba(255,150,20,0.7)", fontSize: "clamp(12px, 1.2vw, 14px)", fontFamily: "monospace", letterSpacing: "0.3em", fontWeight: 700, textTransform: "uppercase", mixBlendMode: "screen", pointerEvents: "none", zIndex: 2 }}>
            PREORDINA IL CAVALIERE
          </div>
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "translateX(3px)", color: "rgba(100,220,255,0.4)", fontSize: "clamp(12px, 1.2vw, 14px)", fontFamily: "monospace", letterSpacing: "0.3em", fontWeight: 700, textTransform: "uppercase", mixBlendMode: "screen", pointerEvents: "none", zIndex: 2 }}>
            PREORDINA IL CAVALIERE
          </div>
        </>
      )}
      <motion.button
        onClick={onPreorder}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "relative",
          padding: "20px 48px",
          background: "rgba(10, 10, 10, 0.85)",
          border: "2px solid rgba(255,215,0,0.9)",
          color: "#FFD700",
          fontFamily: "monospace",
          fontSize: "clamp(12px, 1.2vw, 16px)",
          letterSpacing: "0.4em",
          fontWeight: 700,
          textTransform: "uppercase",
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 50px rgba(255,215,0,0.4), inset 0 0 20px rgba(255,215,0,0.1)",
          overflow: "hidden",
          minWidth: "320px",
        }}
        animate={{
          boxShadow: [
            "0 0 40px rgba(255,215,0,0.3), inset 0 0 15px rgba(255,215,0,0.05)",
            "0 0 70px rgba(255,215,0,0.6), inset 0 0 35px rgba(255,215,0,0.15)",
            "0 0 40px rgba(255,215,0,0.3), inset 0 0 15px rgba(255,215,0,0.05)",
          ]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span style={{ position: "relative", zIndex: 1 }}>PREORDINA IL CAVALIERE</span>

        {/* Scan highlight */}
        <motion.div
          style={{ position: "absolute", top: 0, left: "-100%", width: "60%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.15), transparent)", pointerEvents: "none" }}
          animate={{ left: ["−100%", "150%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
        />

        {/* Corner brackets */}
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: "absolute", top: 6, left: 6, width: 12, height: 12, borderTop: "2px solid #FFD700", borderLeft: "2px solid #FFD700" }} />
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} style={{ position: "absolute", top: 6, right: 6, width: 12, height: 12, borderTop: "2px solid #FFD700", borderRight: "2px solid #FFD700" }} />
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 1.0 }} style={{ position: "absolute", bottom: 6, left: 6, width: 12, height: 12, borderBottom: "2px solid #FFD700", borderLeft: "2px solid #FFD700" }} />
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 1.5 }} style={{ position: "absolute", bottom: 6, right: 6, width: 12, height: 12, borderBottom: "2px solid #FFD700", borderRight: "2px solid #FFD700" }} />
      </motion.button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   BEAT TEXT CARDS 
════════════════════════════════════════════════════════════════════ */
const BEATS = [
  {
    side: "left" as const,
    title: ["SCULTURA DI", "PRECISIONE"],
    sub: "Ogni ombra di Gotham scolpita con ossessione",
    zDepth: "01",
  },
  {
    side: "right" as const,
    title: ["MATERIALI", "D'ELITE"],
    sub: "Finitura da pezzo da museo, non da scaffale",
    zDepth: "02",
  },
  {
    side: "left" as const,
    title: ["EDIZIONE", "LIMITATA"],
    sub: "Solo 500 esemplari al mondo. Il tuo porta un numero.",
    zDepth: "03",
  },
  {
    side: "right" as const,
    title: ["PRESENZA", "LEGGENDARIA"],
    sub: "Non arredamento. Una presenza.",
    zDepth: "04",
  },
];

function BeatCard({ beat, isActive, index }: { beat: typeof BEATS[0]; isActive: boolean; index: number }) {
  const isLeft = beat.side === "left";

  return (
    <DepthText
      isActive={isActive}
      yAnchor="50%"
      yTranslate="-50%"
      alignX={beat.side}
      xInset="5vw"
      backZIndex={5}
      frontZIndex={60}
      crossDelay={650}
      innerClass={isLeft ? "text-left" : "text-right"}
    >
      <div style={{ maxWidth: "44vw" }}>
        <div style={{ fontFamily: "monospace", fontSize: "clamp(7px, 0.7vw, 10px)", letterSpacing: "0.45em", color: "rgba(255,215,0,0.55)", marginBottom: 10, textTransform: "uppercase" }}>
          ◈ DEPTH_{beat.zDepth} / {isLeft ? "SINISTRA" : "DESTRA"}
        </div>
        <div>
          {beat.title.map((line, i) => (
            <div key={i} style={{ fontSize: "clamp(42px, 7.5vw, 120px)", fontWeight: 900, color: "#FFD700", textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 0.9, textShadow: "0px 8px 40px rgba(0,0,0,0.96), 0px 0px 30px rgba(255,215,0,0.45)", display: "block" }}>
              {line}
            </div>
          ))}
        </div>
        <div style={{ height: 1, width: "55%", marginTop: 14, marginBottom: 12, background: `linear-gradient(${isLeft ? "90deg" : "270deg"}, rgba(255,215,0,0.7), transparent)`, marginLeft: isLeft ? 0 : "auto", marginRight: isLeft ? "auto" : 0 }} />
        <p style={{ fontSize: "clamp(10px, 1.1vw, 15px)", color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.28em", fontFamily: "monospace", lineHeight: 1.6, textShadow: "0px 2px 12px rgba(0,0,0,0.98)", textAlign: isLeft ? "left" : "right" }}>
          {beat.sub}
        </p>
      </div>
    </DepthText>
  );
}

/* ════════════════════════════════════════════════════════════════════
   HUD OVERLAY
════════════════════════════════════════════════════════════════════ */
function HudOverlay({ progress }: { progress: number }) {
  const frame = Math.min(Math.round(progress * 800), 800);
  const pct   = Math.round(progress * 100);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 70, pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 24, left: 24, borderTop: "1px solid rgba(255,215,0,0.3)", borderLeft: "1px solid rgba(255,215,0,0.3)", padding: "10px 16px" }}>
        <div style={{ fontFamily: "monospace", fontSize: 8, color: "rgba(255,215,0,0.6)", letterSpacing: "0.45em" }}>BATCAM_ID: B-KNIGHT-87</div>
        <div style={{ fontFamily: "monospace", fontSize: 8, color: "rgba(255,255,255,0.25)", letterSpacing: "0.35em", marginTop: 4 }}>FRAME: {String(frame).padStart(4,"0")} / 0800</div>
      </div>
      <div style={{ position: "absolute", top: 24, right: 24, borderTop: "1px solid rgba(255,215,0,0.3)", borderRight: "1px solid rgba(255,215,0,0.3)", padding: "10px 16px", textAlign: "right" }}>
        <div style={{ fontFamily: "monospace", fontSize: 8, color: "rgba(255,215,0,0.6)", letterSpacing: "0.45em" }}>COORD: 40.712 N</div>
        <div style={{ fontFamily: "monospace", fontSize: 8, color: "rgba(255,255,255,0.25)", letterSpacing: "0.35em", marginTop: 4 }}>LONG: 74.006 O</div>
      </div>

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.06 }}>
        <div style={{ width: 1, height: 36, background: "rgba(255,215,0,0.9)", margin: "0 auto" }} />
        <div style={{ width: 36, height: 1, background: "rgba(255,215,0,0.9)", marginTop: -18, marginLeft: -18 }} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════ */
export default function BatmanCamera({ onPreorder }: { onPreorder?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const imagesRef    = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded]       = useState(false);
  const [progress, setProgress]       = useState(0);
  const [activeBeat, setActiveBeat]   = useState(-1);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 150, damping: 40, restDelta: 0.001 });

  useMotionValueEvent(smooth, "change", (p) => {
    setProgress(p);
    if      (p > 0.05 && p < 0.26) setActiveBeat(0);
    else if (p > 0.28 && p < 0.48) setActiveBeat(1);
    else if (p > 0.50 && p < 0.70) setActiveBeat(2);
    else if (p > 0.72 && p < 0.87) setActiveBeat(3);
    else setActiveBeat(-1);
  });

  useEffect(() => {
    let count = 0, isMounted = true, currentIndex = 1;
    const loadImage = (i: number): Promise<void> => new Promise(resolve => {
      const img = new Image();
      (img as any).fetchPriority = i <= SHOW_THRESHOLD ? "high" : "low";
      img.src = `${IMAGE_PREFIX}${pad(i)}${IMAGE_SUFFIX}`;
      const onDone = () => {
        if (!isMounted) return resolve();
        count++;
        setLoadedCount(count);
        if (count >= SHOW_THRESHOLD) setIsLoaded(true);
        resolve();
      };
      img.onload = img.onerror = onDone;
      imagesRef.current[i - 1] = img;
    });

    const phase1 = async () => {
      await Promise.all(Array(Math.min(SHOW_THRESHOLD, CONCURRENCY_LIMIT)).fill(null).map(async () => {
        while (currentIndex <= SHOW_THRESHOLD && isMounted) await loadImage(currentIndex++);
      }));
    };
    const phase2 = async () => {
      await Promise.all(Array(CONCURRENCY_LIMIT).fill(null).map(async () => {
        while (currentIndex <= TOTAL_FRAMES && isMounted) await loadImage(currentIndex++);
      }));
    };
    (async () => { await phase1(); if (isMounted) await phase2(); })();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const p = smooth.get();
      const frameIndex = Math.min(Math.max(1, Math.floor(p * TOTAL_FRAMES)), TOTAL_FRAMES);

      let img = imagesRef.current[frameIndex - 1];
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let i = frameIndex - 1; i >= 0; i--) {
          const fi = imagesRef.current[i];
          if (fi?.complete && fi.naturalWidth !== 0) { img = fi; break; }
        }
      }

      ctx.clearRect(0, 0, cv.width, cv.height);
      if (img?.complete && img.naturalWidth !== 0) {
        const { width: W, height: H } = cv;
        const ir = img.width / img.height, cr = W / H;
        let dw, dh, ox, oy;
        if (ir > cr) { dh = H; dw = H * ir; ox = (W - dw) / 2; oy = 0; }
        else         { dw = W; dh = W / ir; ox = 0; oy = (H - dh) / 2; }

        let scale = 1;
        // From frame 700 to 800 (p: 0.875 to 1.0)
        if (p > 0.875) {
          const t = (p - 0.875) / 0.125;
          scale = 1 - (t * 0.25); // Shrink up to 25%
        }

        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.scale(scale, scale);
        ctx.drawImage(img, ox - W / 2, oy - H / 2, dw, dh);
        ctx.restore();
      }
    };

    const unsub = smooth.on("change", render);
    const onResize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; render(); };
    window.addEventListener("resize", onResize);
    onResize();
    return () => { unsub(); window.removeEventListener("resize", onResize); };
  }, [smooth]);

  return (
    <div ref={containerRef} style={{ position: "relative", height: "800vh", overflowX: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, width: "100%", height: "100%", overflow: "hidden" }}>
        
        {/* z:1 — Tech background */}
        <TechBackground />

        {/* z:10 — Statue canvas */}
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 10, pointerEvents: "none" }} />

        {/* Removed black overlays/vignettes so the background is perfectly visible */}

        {/* z:5 & z:60 — Beat texts */}
        {BEATS.map((b, i) => (
          <BeatCard key={i} beat={b} isActive={activeBeat === i} index={i} />
        ))}

        {/* z:5 & z:62 — Final CTA (Title behind/in front of head, Button at bottom) */}
        <FinalCTA progress={progress} onPreorder={onPreorder} />

        {/* z:70 — HUD */}
        <HudOverlay progress={progress} />
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} style={{ position: "fixed", inset: 0, zIndex: 200, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <motion.div animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: 48, marginBottom: 24, filter: "drop-shadow(0 0 20px rgba(255,215,0,0.4))" }}></motion.div>
            <div style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,215,0,0.7)", letterSpacing: "1em", marginBottom: 20 }}>CARICAMENTO</div>
            <div style={{ width: 200, height: 2, background: "rgba(255,215,0,0.1)", borderRadius: 1, overflow: "hidden", marginBottom: 10 }}>
              <motion.div style={{ height: "100%", background: "rgba(255,215,0,0.6)", transformOrigin: "left" }} animate={{ scaleX: loadedCount / TOTAL_FRAMES }} transition={{ type: "tween", duration: 0.3 }} />
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,215,0,0.3)", letterSpacing: "0.5em" }}>{Math.round((loadedCount / TOTAL_FRAMES) * 100)}%</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
