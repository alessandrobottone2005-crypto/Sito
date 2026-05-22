import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Html } from "@react-three/drei";
import { MouseLookControls } from "./MouseLookControls";
import * as THREE from "three";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import JokerCard from "../ui/JokerCard";

export type PanoramaScene = "batcomputer" | "armeria" | "batmobile";

interface SharedPanoramaCanvasProps {
  scene: PanoramaScene;
  onProgress: (count: number) => void;
  baseCompleted: number;
  isPaused: boolean;
  onNext: () => void;
}

const BATCOMPUTER_RIDDLES = [
  { id: 1, riddle: "Non è un uomo, non è un mostro, non è un re… ma tutta Gotham trattiene il respiro quando appare nel cielo.", options: ["Joker", "Batsegnale", "Pinguino", "Arkham"], correctAnswer: "Batsegnale" },
  { id: 2, riddle: "Ho un sorriso eterno, ma non conosco felicità. Più rido… più Gotham soffre.", options: ["Due Facce", "Robin", "Joker", "Enigmista"], correctAnswer: "Joker" },
];
const ARMERIA_RIDDLE = { id: 3, riddle: "Non ho superpoteri, ma faccio tremare i criminali. La notte è il mio regno.", options: ["Superman", "Batman", "Bane", "Flash"], correctAnswer: "Batman" };
const BATMOBILE_RIDDLES = [
  { id: 4, riddle: "CORRO PIÙ VELOCE DEL VENTO E BRUCIO L'ASFALTO DI GOTHAM. COSA SONO?", options: ["Batwing", "Batmobile", "Joker Van", "Treno di Gotham"], correctAnswer: "Batmobile" },
  { id: 5, riddle: "SONO IL MOTORE CHE RUGGISCE NELLA NOTTE. COSA SONO?", options: ["Reattore", "Turbina", "Pistone"], correctAnswer: "Reattore" },
];

function PanoramaSphere({ texture }: { texture: THREE.Texture }) {
  return (
    <mesh key={texture.uuid} scale={[-1, 1, 1]} rotation={[0, -Math.PI / 2, 0]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function ClueMesh({ position, riddle, onClick, isCompleted, isActive, onClose, onSuccess, isPaused, hoveredCountRef }: any) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const targetWorldPos = useRef(new THREE.Vector3());

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
      meshRef.current.scale.lerp(new THREE.Vector3(hovered ? 0.5 : 0.4, hovered ? 0.5 : 0.4, hovered ? 0.5 : 0.4), delta * 5);
    }
  });

  if (isCompleted) return null;
  return (
    <group ref={meshRef}>
      <Html transform distanceFactor={60} zIndexRange={[100, 0]} center>
        <motion.div
          onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerLeave={() => { setHovered(false); }}
          onClick={(e) => { e.stopPropagation(); if (!isActive && !isPaused) onClick(); }}
          animate={{ 
            borderColor: hovered || isActive ? "#39FF14" : "rgba(57, 255, 20, 0.8)",
            boxShadow: hovered || isActive 
              ? "0 0 80px rgba(57, 255, 20, 0.9), inset 0 0 30px rgba(57, 255, 20, 0.5)" 
              : [
                  "0 0 20px rgba(57, 255, 20, 0.2), inset 0 0 10px rgba(57, 255, 20, 0.1)", 
                  "0 0 60px rgba(57, 255, 20, 0.7), inset 0 0 25px rgba(57, 255, 20, 0.4)", 
                  "0 0 20px rgba(57, 255, 20, 0.2), inset 0 0 10px rgba(57, 255, 20, 0.1)"
                ],
            scale: hovered || isActive ? 1.05 : [1, 1.05, 1]
          }}
          transition={{
            boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            borderColor: { duration: 0.3 }
          }}
          style={{ 
            width: 140, 
            height: 196, 
            background: "rgba(0,0,0,0.9)", 
            borderRadius: 12, 
            border: "3px solid",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            cursor: isActive ? "default" : "pointer", 
            position: "relative" 
          }}
        >
          {!isActive && (
            <motion.div 
              animate={{ 
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 60, height: 60, color: "#39FF14" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ filter: "drop-shadow(0 0 10px #39FF14)" }}>
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
              </svg>
            </motion.div>
          )}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: isActive ? 1 : 0, pointerEvents: isActive ? "auto" : "none" }}>
            <JokerCard id={riddle.id} riddle={riddle.riddle} options={riddle.options} correctAnswer={riddle.correctAnswer} onSuccess={onSuccess} onClose={onClose} isFlipped={isActive} isPaused={isPaused} />
          </div>
        </motion.div>
      </Html>
    </group>
  );
}

function SceneContent({ texture, scene, cardPositions, activeCardId, completedIds, onCardClick, onCloseCard, onCardSuccess, isPaused, hoveredCountRef }: any) {
  const { set: setThree } = useThree();
  useEffect(() => { setThree({ isPaused } as any); }, [isPaused, setThree]);

  // Reset hovered count when scene changes
  useEffect(() => {
    if (hoveredCountRef) hoveredCountRef.current = 0;
  }, [scene, hoveredCountRef]);

  const riddles = scene === "batcomputer" ? BATCOMPUTER_RIDDLES : scene === "armeria" ? [ARMERIA_RIDDLE] : BATMOBILE_RIDDLES;
  return (
    <>
      {texture && <PanoramaSphere texture={texture} />}
      {cardPositions && riddles.map((r, i) => (
        <ClueMesh key={`${scene}-${r.id}`} position={cardPositions[i]} riddle={r}
          onClick={() => onCardClick(r.id)} isCompleted={completedIds.includes(r.id)}
          isActive={activeCardId === r.id} onClose={onCloseCard}
          onSuccess={() => onCardSuccess(r.id)} isPaused={isPaused} hoveredCountRef={hoveredCountRef} />
      ))}
    </>
  );
}

function SharedPanoramaCanvas({ scene, onProgress, baseCompleted, isPaused, onNext }: SharedPanoramaCanvasProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [cardPositions, setCardPositions] = useState<[number,number,number][] | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
      video.src = "/assets/videos/BatCaverna360_BatComputerArea.mp4";
      video.crossOrigin = "Anonymous";
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      myVideo = video;

      const onReady = () => {
        if (!active) return;
        video.play().catch(() => {});
        const tex = new THREE.VideoTexture(video);
        tex.colorSpace = THREE.SRGBColorSpace;
        myTex = tex;
        videoRef.current = video;
        setTexture(tex);
        setIsLoading(false);
      };

      video.addEventListener("canplay", onReady, { once: true });
      video.addEventListener("canplaythrough", onReady, { once: true });
      video.load();
      const safety = setTimeout(() => { if (active) setIsLoading(false); }, 5000);

      return () => {
        active = false;
        clearTimeout(safety);
        video.removeEventListener("canplay", onReady);
        video.removeEventListener("canplaythrough", onReady);
        video.pause();
        video.src = "";
        video.load();
        videoRef.current = null;
        // DO NOT dispose myTex here — the Canvas may still be rendering it.
        // Let it be garbage collected naturally when React replaces the state.
      };
    }

    // Static texture
    const urls = scene === "armeria"
      ? ["/assets/textures/BatCaverna360_ArmeriaArea.jpg", "/assets/textures/BatCaverna360_ArmeriaArea.png"]
      : ["/assets/textures/BatCaverna360_BatMobileArea.jpg", "/assets/textures/BatCaverna360_BatMobileArea.png"];

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
    onProgress(baseCompleted + newCompleted.length);
    const needed = scene === "armeria" ? 1 : 2;
    if (newCompleted.length >= needed) {
      setTimeout(() => { setIsExiting(true); setTimeout(onNext, 1000); }, 1000);
    }
  }, [completedIds, baseCompleted, scene, onProgress, onNext]);

  const areaLabel = scene === "batcomputer" ? "Bat-Cave // Area Batcomputer" : scene === "armeria" ? "Area Armeria" : "Area Batmobile";
  const hoveredCountRef = useRef(0);

  return (
    <div className="fixed inset-0 w-full h-full bg-black z-40 overflow-hidden">
      <Canvas gl={{ antialias: true, toneMapping: THREE.NoToneMapping, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 0, 0.1]} fov={75} />
        <MouseLookControls enabled={!activeCardId && !isExiting && !isPaused} hoveredCountRef={hoveredCountRef} />
        <SceneContent texture={texture} scene={scene} cardPositions={cardPositions} activeCardId={activeCardId} completedIds={completedIds} onCardClick={(id: number) => setActiveCardId(id)} onCloseCard={() => setActiveCardId(null)} onCardSuccess={handleCardSuccess} isPaused={isPaused} hoveredCountRef={hoveredCountRef} />
      </Canvas>

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
