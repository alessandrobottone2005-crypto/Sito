import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Html } from "@react-three/drei";
import { MouseLookControls } from "./MouseLookControls";
import * as THREE from "three";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import JokerCard from "../joker/JokerCard";
import { useJokerHint } from "../../hooks/useJokerHint";
import JokerHintSystem from "../joker/JokerHintSystem";

export type PanoramaScene = "batcomputer" | "armeria" | "batmobile";

interface SharedPanoramaCanvasProps {
  scene: PanoramaScene;
  onProgress: (count: number) => void;
  baseCompleted: number;
  isPaused: boolean;
  onNext: () => void;
  isMuted?: boolean;
  isMissionActive?: boolean;
}

const BATCOMPUTER_RIDDLES = [
  { id: 1, riddle: "Non è un uomo, non è un mostro, non è un re… eppure tutta Gotham trattiene il fiato quando compare nel cielo notturno.", options: ["Joker", "Batsegnale", "Pinguino", "Arkham"], correctAnswer: "Batsegnale" },
  { id: 2, riddle: "Porto un sorriso eterno, ma non ho mai conosciuto la gioia. Più rido… più Gotham brucia.", options: ["Due Facce", "Robin", "Joker", "Enigmista"], correctAnswer: "Joker" },
];
const ARMERIA_RIDDLE = { id: 3, riddle: "Non ho poteri sovrumani, eppure i criminali tremano al mio nome. Le tenebre sono il mio dominio.", options: ["Superman", "Batman", "Bane", "Flash"], correctAnswer: "Batman" };
const BATMOBILE_RIDDLES = [
  { id: 4, riddle: "DIVORO L'ASFALTO DI GOTHAM A VELOCITÀ IMPOSSIBILI. LASCIO SOLO FUMO E TERRORE. COSA SONO?", options: ["Batwing", "Batmobile", "Joker Van", "Treno di Gotham"], correctAnswer: "Batmobile" },
  { id: 5, riddle: "RUGGIO NELL’OSCURITÀ DI GOTHAM, IL CUORE PULSANTE DELLA MACCHINA DEL CAVALIERE. COSA SONO?", options: ["Reattore", "Turbina", "Pistone"], correctAnswer: "Reattore" },
];

function PanoramaSphere({ texture, onClick }: { texture: THREE.Texture, onClick?: () => void }) {
  return (
    <mesh key={texture.uuid} scale={[-1, 1, 1]} rotation={[0, -Math.PI / 2, 0]} onClick={onClick}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

interface ClueMeshProps {
  position: [number, number, number];
  riddle: any;
  onClick: () => void;
  isCompleted: boolean;
  isActive: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isPaused: boolean;
  hoveredCountRef: React.MutableRefObject<number>;
  isHintActive: boolean;
  hintPhase: number;
  onBecomeVisible: (id: number) => void;
}

function ClueMesh({ position, riddle, onClick, isCompleted, isActive, onClose, onSuccess, isPaused, hoveredCountRef, isHintActive, hintPhase, onBecomeVisible }: ClueMeshProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const targetWorldPos = useRef(new THREE.Vector3());
  const becameVisibleRef = useRef(false);

  useEffect(() => {
    const shouldCount = hovered && !isCompleted;
    if (shouldCount && hoveredCountRef) {
      hoveredCountRef.current += 1;
    }
    return () => {
      if (shouldCount && hoveredCountRef) {
        hoveredCountRef.current = Math.max(0, hoveredCountRef.current - 1);
      }
    };
  }, [hovered, isCompleted, hoveredCountRef]);

  useEffect(() => {
    if (meshRef.current && !isActive && position) {
      meshRef.current.position.set(...position);
      meshRef.current.lookAt(0, 0, 0);
      meshRef.current.scale.setScalar(0.4);
    }
  }, [position, isActive]);

  // Notifica quando la card con hint diventa visibile nella scena
  useEffect(() => {
    if (isHintActive && !becameVisibleRef.current && onBecomeVisible) {
      becameVisibleRef.current = true;
      onBecomeVisible(riddle.id);
    }
    if (!isHintActive) becameVisibleRef.current = false;
  }, [isHintActive, riddle.id, onBecomeVisible]);

  useFrame((state, delta) => {
    if (!meshRef.current || isCompleted || (state as any).isPaused || !position) return;
    if (isActive) {
      const dir = state.camera.getWorldDirection(new THREE.Vector3());
      targetWorldPos.current.copy(state.camera.position).add(dir.multiplyScalar(60));
      meshRef.current.position.lerp(targetWorldPos.current, delta * 5);
      meshRef.current.quaternion.slerp(state.camera.quaternion, delta * 5);
      meshRef.current.scale.lerp(new THREE.Vector3(0.6, 0.6, 0.6), delta * 5);
    } else {
      meshRef.current.position.lerp(new THREE.Vector3(...position), delta * 5);
      const lm = new THREE.Matrix4().lookAt(meshRef.current.position, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0));
      meshRef.current.quaternion.slerp(new THREE.Quaternion().setFromRotationMatrix(lm), delta * 5);
      // Con hint attivo la card si allarga leggermente come se il Joker la stesse "spingendo"
      const baseScale = isHintActive ? 0.85 : 0.8;
      const hoverScale = isHintActive ? 1.0 : 0.95;
      meshRef.current.scale.lerp(
        new THREE.Vector3(
          hovered ? hoverScale : baseScale,
          hovered ? hoverScale : baseScale,
          hovered ? hoverScale : baseScale
        ),
        delta * 5
      );
    }
  });

  // Calcola le proprietà dinamiche del glow in base alla fase hint
  const hintGlowMap: Record<number, { shadow: string; borderColor: string; bg: string }> = {
    0: {
      shadow: "0 0 20px rgba(57, 255, 20, 0.2), inset 0 0 10px rgba(57, 255, 20, 0.1)",
      borderColor: "rgba(57, 255, 20, 0.8)",
      bg: "rgba(0,0,0,0.9)",
    },
    1: {
      shadow: "0 0 40px rgba(57, 255, 20, 0.5), inset 0 0 20px rgba(57, 255, 20, 0.25)",
      borderColor: "rgba(57, 255, 20, 0.95)",
      bg: "rgba(5, 20, 5, 0.92)",
    },
    2: {
      shadow: "0 0 70px rgba(57, 255, 20, 0.75), inset 0 0 30px rgba(57, 255, 20, 0.4), 0 0 120px rgba(57, 255, 20, 0.3)",
      borderColor: "#39FF14",
      bg: "rgba(5, 25, 5, 0.95)",
    },
    3: {
      shadow: "0 0 100px rgba(57, 255, 20, 1.0), inset 0 0 50px rgba(57, 255, 20, 0.6), 0 0 200px rgba(57, 255, 20, 0.5)",
      borderColor: "#39FF14",
      bg: "rgba(10, 35, 10, 0.97)",
    },
  };

  const currentHint = isHintActive ? (hintGlowMap[hintPhase] ?? hintGlowMap[0]) : hintGlowMap[0];

  if (isCompleted) return null;
  return (
    <group ref={meshRef}>
      <Html transform distanceFactor={60} zIndexRange={[100, 0]} center>
        {/* Spotlight hint: cerchio luminoso attorno alla card quando hint è attivo */}
        {isHintActive && hintPhase >= 2 && (
          <motion.div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              pointerEvents: "none",
              zIndex: -1,
            }}
            animate={{
              width: hintPhase === 3 ? [220, 280, 220] : [180, 230, 180],
              height: hintPhase === 3 ? [220, 280, 220] : [180, 230, 180],
              opacity: hintPhase === 3 ? [0.25, 0.45, 0.25] : [0.15, 0.3, 0.15],
              background: [
                "radial-gradient(circle, rgba(57,255,20,0.4) 0%, rgba(57,255,20,0) 70%)",
                "radial-gradient(circle, rgba(57,255,20,0.7) 0%, rgba(57,255,20,0) 70%)",
                "radial-gradient(circle, rgba(57,255,20,0.4) 0%, rgba(57,255,20,0) 70%)",
              ],
            }}
            transition={{
              duration: hintPhase === 3 ? 1.5 : 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        <motion.div
          onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerLeave={() => { setHovered(false); }}
          onClick={(e) => { e.stopPropagation(); if (!isActive && !isPaused) onClick(); }}
          animate={{
            borderColor: hovered || isActive
              ? "#39FF14"
              : isHintActive
              ? [currentHint.borderColor, "#39FF14", currentHint.borderColor]
              : "rgba(57, 255, 20, 0.8)",
            boxShadow: hovered || isActive
              ? "0 0 80px rgba(57, 255, 20, 0.9), inset 0 0 30px rgba(57, 255, 20, 0.5)"
              : isHintActive
              ? [
                  currentHint.shadow,
                  currentHint.shadow.replace(/0\.\d+\)/g, (m) =>
                    String(Math.min(1, parseFloat(m) * 1.4)) + ")"
                  ),
                  currentHint.shadow,
                ]
              : [
                  "0 0 20px rgba(57, 255, 20, 0.2), inset 0 0 10px rgba(57, 255, 20, 0.1)",
                  "0 0 60px rgba(57, 255, 20, 0.7), inset 0 0 25px rgba(57, 255, 20, 0.4)",
                  "0 0 20px rgba(57, 255, 20, 0.2), inset 0 0 10px rgba(57, 255, 20, 0.1)",
                ],
            scale: hovered || isActive ? 1.05 : isHintActive ? [1, 1.06, 1, 1.04, 1] : [1, 1.05, 1],
            // Fluttuazione lenta della card quando hint attivo
            y: isHintActive && !isActive ? [0, -4, 0, -2, 0] : 0,
          }}
          transition={{
            boxShadow: {
              duration: isHintActive ? (hintPhase === 3 ? 1.2 : 2.0) : 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
            scale: {
              duration: isHintActive ? (hintPhase === 3 ? 1.0 : 1.8) : 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
            y: {
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
            borderColor: { duration: 0.3 },
          }}
          style={{
            width: 140,
            height: 196,
            background: isHintActive ? currentHint.bg : "rgba(0,0,0,0.9)",
            borderRadius: 12,
            border: "3px solid",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isActive ? "default" : "pointer",
            position: "relative",
            transition: "background 0.8s ease",
          }}
        >
          {/* Reflection overlay — luce ambientale sulla card quando hint */}
          {isHintActive && (
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 10,
                pointerEvents: "none",
                background:
                  "linear-gradient(135deg, rgba(57,255,20,0.08) 0%, transparent 50%, rgba(57,255,20,0.04) 100%)",
              }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {!isActive && (
            <motion.div
              animate={{
                opacity: isHintActive ? [0.8, 1, 0.8] : [0.7, 0.9, 0.7],
                filter: isHintActive
                  ? ["drop-shadow(0 0 15px #39FF14)", "drop-shadow(0 0 35px #39FF14)", "drop-shadow(0 0 15px #39FF14)"]
                  : ["drop-shadow(0 0 10px #39FF14)", "drop-shadow(0 0 10px #39FF14)"],
              }}
              transition={{
                duration: isHintActive ? (hintPhase === 3 ? 1.0 : 1.8) : 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ width: "100%", height: "100%", borderRadius: 8, overflow: "hidden" }}
            >
              <img 
                src="./assets/images/JollyJokerCard.jpg" 
                alt="Jolly Joker" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </motion.div>
          )}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              opacity: isActive ? 1 : 0,
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            <JokerCard
              id={riddle.id}
              riddle={riddle.riddle}
              options={riddle.options}
              correctAnswer={riddle.correctAnswer}
              onSuccess={onSuccess}
              onClose={onClose}
              isFlipped={isActive}
              isPaused={isPaused}
            />
          </div>
        </motion.div>
      </Html>
    </group>
  );
}

function SceneContent({ texture, scene, cardPositions, activeCardId, completedIds, onCardClick, onCloseCard, onCardSuccess, isPaused, hoveredCountRef, hintCardId, hintPhase, onCardBecomeVisible }: any) {
  const { set: setThree } = useThree();
  useEffect(() => { setThree({ isPaused } as any); }, [isPaused, setThree]);

  // Reset hovered count when scene changes
  useEffect(() => {
    if (hoveredCountRef) hoveredCountRef.current = 0;
  }, [scene, hoveredCountRef]);

  const riddles = scene === "batcomputer" ? BATCOMPUTER_RIDDLES : scene === "armeria" ? [ARMERIA_RIDDLE] : BATMOBILE_RIDDLES;
  return (
    <>
      {texture && <PanoramaSphere texture={texture} onClick={() => { if (activeCardId !== null && !isPaused) onCloseCard(); }} />}
      {cardPositions && riddles.map((r, i) => (
        <ClueMesh
          key={`${scene}-${r.id}`}
          position={cardPositions[i]}
          riddle={r}
          onClick={() => onCardClick(r.id)}
          isCompleted={completedIds.includes(r.id)}
          isActive={activeCardId === r.id}
          onClose={onCloseCard}
          onSuccess={() => onCardSuccess(r.id)}
          isPaused={isPaused}
          hoveredCountRef={hoveredCountRef}
          isHintActive={hintCardId === r.id}
          hintPhase={hintCardId === r.id ? hintPhase : 0}
          onBecomeVisible={onCardBecomeVisible}
        />
      ))}
    </>
  );
}

function SharedPanoramaCanvas({ scene, onProgress, baseCompleted, isPaused, onNext, isMuted = false, isMissionActive = true }: SharedPanoramaCanvasProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [cardPositions, setCardPositions] = useState<[number,number,number][] | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // ── Joker Hint System ─────────────────────────────────────────────────
  const { hintActive, hintCardId, hintPhase, resetHint, startHintTimer } = useJokerHint(
    isPaused,
    isMissionActive,
    completedIds,
    activeCardId
  );

  // Avvia il timer hint per ogni carta della scena appena le posizioni sono pronte
  useEffect(() => {
    if (!cardPositions || !isMissionActive) return;
    const riddles =
      scene === "batcomputer" ? BATCOMPUTER_RIDDLES
      : scene === "armeria" ? [ARMERIA_RIDDLE]
      : BATMOBILE_RIDDLES;

    // Parte con il timer per la prima carta non completata
    const firstPending = riddles.find((r) => !completedIds.includes(r.id));
    if (firstPending) startHintTimer(firstPending.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardPositions, scene, isMissionActive]);

  // Quando una carta viene completata, avvia il timer per la successiva
  const handleNextHintTarget = useCallback((newCompleted: number[]) => {
    const riddles =
      scene === "batcomputer" ? BATCOMPUTER_RIDDLES
      : scene === "armeria" ? [ARMERIA_RIDDLE]
      : BATMOBILE_RIDDLES;
    const nextPending = riddles.find((r) => !newCompleted.includes(r.id));
    if (nextPending) startHintTimer(nextPending.id);
    else resetHint();
  }, [scene, startHintTimer, resetHint]);

  // Reset interaction state on scene change
  useEffect(() => {
    setActiveCardId(null);
    setCompletedIds([]);
    setIsExiting(false);
    setIsLoading(true);
    setCardPositions(null);
  }, [scene]);

  // Card positions
  useEffect(() => {
    const count = scene === "armeria" ? 1 : 2;
    const pts: [number, number, number][] = [];
    let tries = 0;
    while (pts.length < count && tries++ < 300) {
      const phi = Math.random() * 1.8 + 0.6, theta = Math.random() * Math.PI * 2;
      const p: [number, number, number] = [200 * Math.sin(phi) * Math.cos(theta), 200 * Math.cos(phi), 200 * Math.sin(phi) * Math.sin(theta)];
      if (!pts.some(q => Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) < 120)) pts.push(p);
    }
    setCardPositions(pts);
  }, [scene]);

  // Load texture — cleanup ONLY disposes what belongs to this effect instance
  useEffect(() => {
    let active = true;
    let myVideo: HTMLVideoElement | null = null;
    let myTex: THREE.Texture | null = null;

    if (scene === "batcomputer") {
      const video = document.createElement("video");
      video.src = "./assets/videos/BatCaverna360_BatComputerArea.mp4";
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = "anonymous";
      myVideo = video;

      // Fallback: load static image if video texture fails (e.g. file:// security)
      const loadStaticFallback = () => {
        if (!active) return;
        console.log("[Panorama] Video texture not usable, loading static fallback for batcomputer");
        const loader = new THREE.TextureLoader();
        loader.load(
          "./assets/textures/BatCaverna360_BatComputerArea.jpg",
          (tex) => {
            if (!active) { tex.dispose(); return; }
            tex.colorSpace = THREE.SRGBColorSpace;
            myTex = tex;
            setTexture(tex);
            setIsLoading(false);
          },
          undefined,
          (err) => {
            console.error("[Panorama] Static fallback also failed:", err);
            if (active) setIsLoading(false);
          }
        );
      };

      const tex = new THREE.VideoTexture(video);
      tex.colorSpace = THREE.SRGBColorSpace;
      myTex = tex;
      videoRef.current = video;

      // Check if video can be used as a WebGL texture (fails in file://)
      let videoTextureWorking = false;

      const onPlaying = () => {
        if (!active) return;
        // Try drawing a frame to a test canvas to detect tainted canvas
        try {
          const testCanvas = document.createElement("canvas");
          testCanvas.width = 4;
          testCanvas.height = 4;
          const ctx = testCanvas.getContext("2d");
          ctx?.drawImage(video, 0, 0, 4, 4);
          ctx?.getImageData(0, 0, 1, 1); // this throws if tainted
          // If we get here, video texture is usable
          videoTextureWorking = true;
          setTexture(tex);
          setIsLoading(false);
        } catch (e) {
          // Video is tainted (file:// security), use static fallback
          video.pause();
          loadStaticFallback();
        }
      };

      const onError = () => {
        if (!active) return;
        loadStaticFallback();
      };

      video.addEventListener("playing", onPlaying, { once: true });
      video.addEventListener("error", onError, { once: true });
      video.load();
      video.play().catch(() => {
        // Autoplay blocked or file:// error — go straight to fallback
        loadStaticFallback();
      });

      const safety = setTimeout(() => {
        if (!active) return;
        if (!videoTextureWorking) {
          loadStaticFallback();
        }
      }, 4000);

      return () => {
        active = false;
        clearTimeout(safety);
        video.removeEventListener("playing", onPlaying);
        video.removeEventListener("error", onError);
        video.pause();
        video.src = "";
        video.load();
        videoRef.current = null;
      };
    }


    // Static texture
    const urls = scene === "armeria"
      ? ["./assets/textures/BatCaverna360_ArmeriaArea.jpg", "./assets/textures/BatCaverna360_ArmeriaArea.png"]
      : ["./assets/textures/BatCaverna360_BatMobileArea.jpg", "./assets/textures/BatCaverna360_BatMobileArea.png"];

    console.log(`[Panorama] Loading texture for scene: ${scene}, urls:`, urls);

    const loader = new THREE.TextureLoader();
    const tryLoad = (idx: number) => {
      if (!active || idx >= urls.length) {
        console.warn(`[Panorama] All texture URLs exhausted for scene: ${scene}`);
        if (active) setIsLoading(false);
        return;
      }
      console.log(`[Panorama] Attempting to load: ${urls[idx]}`);
      loader.load(urls[idx],
        (tex) => {
          if (!active) { tex.dispose(); return; }
          console.log(`[Panorama] ✅ Texture loaded for ${scene}: ${urls[idx]}, size: ${tex.image?.width}x${tex.image?.height}`);
          tex.colorSpace = THREE.SRGBColorSpace;
          myTex = tex;
          setTexture(tex);
          setIsLoading(false);
        },
        (progress) => {
          if (progress.total > 0) {
            console.log(`[Panorama] Loading ${urls[idx]}: ${Math.round(progress.loaded / progress.total * 100)}%`);
          }
        },
        (err) => {
          console.error(`[Panorama] ❌ Failed to load ${urls[idx]}:`, err);
          tryLoad(idx + 1);
        }
      );
    };
    tryLoad(0);
    const safety = setTimeout(() => {
      if (active) {
        console.warn(`[Panorama] ⏰ Safety timer fired for scene: ${scene} — texture may not have loaded`);
        setIsLoading(false);
      }
    }, 8000);

    return () => {
      active = false;
      clearTimeout(safety);
      // DO NOT dispose myTex here — let it be replaced in state.
    };
  }, [scene]);

  // Pause/resume video
  useEffect(() => {
    if (!videoRef.current) return;
    isPaused ? videoRef.current.pause() : videoRef.current.play().catch(() => {});
  }, [isPaused]);

  const handleCardSuccess = useCallback((id: number) => {
    const newCompleted = [...completedIds, id];
    setCompletedIds(newCompleted);
    setActiveCardId(null);
    resetHint(); // Reset hint immediatamente quando carta trovata
    onProgress(baseCompleted + newCompleted.length);
    const needed = scene === "armeria" ? 1 : 2;
    if (newCompleted.length >= needed) {
      setTimeout(() => { setIsExiting(true); setTimeout(onNext, 1000); }, 1000);
    } else {
      // Avvia timer hint per la prossima carta
      handleNextHintTarget(newCompleted);
    }
  }, [completedIds, baseCompleted, scene, onProgress, onNext, resetHint, handleNextHintTarget]);

  const areaLabel = scene === "batcomputer" ? "Bat-Cave // Area Batcomputer" : scene === "armeria" ? "Area Armeria" : "Area Batmobile";
  const hoveredCountRef = useRef(0);

  return (
    <div className="fixed inset-0 w-full h-full bg-black z-40 overflow-hidden">
      <Canvas gl={{ antialias: true, toneMapping: THREE.NoToneMapping, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 0, 0.1]} fov={75} />
        <MouseLookControls enabled={!activeCardId && !isExiting && !isPaused} hoveredCountRef={hoveredCountRef} />
        <SceneContent
          texture={texture}
          scene={scene}
          cardPositions={cardPositions}
          activeCardId={activeCardId}
          completedIds={completedIds}
          onCardClick={(id: number) => setActiveCardId(id)}
          onCloseCard={() => setActiveCardId(null)}
          onCardSuccess={handleCardSuccess}
          isPaused={isPaused}
          hoveredCountRef={hoveredCountRef}
          hintCardId={hintCardId}
          hintPhase={hintPhase}
          onCardBecomeVisible={(id: number) => startHintTimer(id)}
        />
      </Canvas>

      {/* ── Joker Hint System Overlay ─────────────────────────────── */}
      <JokerHintSystem
        hintActive={hintActive}
        hintPhase={hintPhase}
        isMuted={isMuted}
        isPaused={isPaused}
      />

      <AnimatePresence>
        {isLoading && (
          <motion.div key="loading" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 bg-black flex items-center justify-center z-[110]">
            <motion.div animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="text-gold tracking-[1em] font-black italic uppercase text-[10px] font-mono">
              Sincronizzazione Area...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExiting && (
          <motion.div key="exiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="absolute inset-0 bg-black z-[110] pointer-events-none" />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none z-20" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)" }} />
      <div className="absolute bottom-8 left-12 text-[9px] text-white/20 font-mono tracking-widest uppercase pointer-events-none z-30">
        {areaLabel}<br />Indizi: {completedIds.length} / {scene === "armeria" ? 1 : 2}
      </div>
    </div>
  );
}

export default React.memo(SharedPanoramaCanvas);
