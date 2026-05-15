import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Html } from "@react-three/drei";
import * as THREE from "three";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import JokerCard from "../ui/JokerCard";

interface BatmobilePanoramaProps {
  onNext: () => void;
  onProgress: (count: number) => void;
  baseCompleted: number;
  isPaused?: boolean;
}

const BATMOBILE_RIDDLES = [
  { id: 4, riddle: "Corro senza gambe. Ruggisco senza voce. Quando arrivo, i muri della caverna vibrano.", options: ["Batwing", "Batmobile", "Joker Van", "Treno di Gotham"], correctAnswer: "Batmobile" },
  { id: 5, riddle: "Non sono un trofeo. Non sono un’arma. Ma ogni collezionista sogna di possedermi.", options: ["Kryptonite", "Batarang", "Statua", "Mantello"], correctAnswer: "Statua" },
];

function toCartesian(r: number, phi: number, theta: number): [number, number, number] {
  return [r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)];
}

const SPAWN_POINTS: [number, number, number][] = [
  toCartesian(150, 1.62, -0.80), toCartesian(150, 1.62, 0.55), toCartesian(150, 1.28, 1.85),
  toCartesian(150, 1.10, -2.25), toCartesian(150, 1.42, 2.85), toCartesian(150, 1.72, -2.00),
];

function pickTwoSpawns(): [[number, number, number], [number, number, number]] {
  const shuffled = [...SPAWN_POINTS].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

function ClueMesh({ id, position, onClick, isCompleted, isActive, onClose, onSuccess, riddle, options, correctAnswer, isPaused }: any) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const targetWorldPos = useRef(new THREE.Vector3());

  useEffect(() => {
    if (meshRef.current && !isActive) {
      const [px, py, pz] = position;
      meshRef.current.position.set(px, py, pz);
      meshRef.current.lookAt(0, 0, 0);
      meshRef.current.scale.setScalar(0.4);
    }
  }, [position]);

  useFrame((state, delta) => {
    if (!meshRef.current || isCompleted) return;
    const isGlobalPaused = (state as any).isPaused;
    if (isGlobalPaused) return;

    if (isActive) {
      const dir = state.camera.getWorldDirection(new THREE.Vector3());
      targetWorldPos.current.copy(state.camera.position).add(dir.multiplyScalar(60));
      meshRef.current.position.lerp(targetWorldPos.current, delta * 5);
      meshRef.current.quaternion.slerp(state.camera.quaternion, delta * 5);
      meshRef.current.scale.lerp(new THREE.Vector3(0.65, 0.65, 0.65), delta * 5);
    } else {
      const origPos = new THREE.Vector3(...position);
      meshRef.current.position.lerp(origPos, delta * 5);
      const lookAtMat = new THREE.Matrix4().lookAt(meshRef.current.position, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
      meshRef.current.quaternion.slerp(new THREE.Quaternion().setFromRotationMatrix(lookAtMat), delta * 5);
      const ts = hovered ? 0.52 : 0.40;
      meshRef.current.scale.lerp(new THREE.Vector3(ts, ts, ts), delta * 5);
    }
  });

  if (isCompleted) return null;

  return (
    <group ref={meshRef}>
      <Html transform distanceFactor={60} zIndexRange={[100, 0]} center>
        <div
          onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerLeave={() => setHovered(false)}
          onClick={(e) => { e.stopPropagation(); if (!isActive && !isPaused) onClick(); }}
          style={{
            width: 140, height: 196, background: "#000", borderRadius: 12,
            border: hovered || isActive ? "2px solid #39FF14" : "1px solid rgba(255,255,255,0.05)",
            boxShadow: hovered || isActive ? "0 0 40px rgba(57,255,20,0.5)" : "none",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 16, cursor: isActive ? "default" : "pointer", transition: "all 0.3s",
          }}
        >
          {!isActive && (
            <div style={{ width: 40, height: 40, color: "#39FF14", opacity: hovered ? 0.8 : 0.2 }}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
            </div>
          )}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: isActive ? 1 : 0, pointerEvents: isActive ? "auto" : "none" }}>
            <JokerCard id={id} riddle={riddle} options={options} correctAnswer={correctAnswer} onSuccess={onSuccess} onClose={onClose} isFlipped={isActive} isPaused={isPaused} />
          </div>
        </div>
      </Html>
    </group>
  );
}

function Scene({ texture, spawnPositions, activeCardId, completedIds, onCardClick, onCloseCard, onCardSuccess, isPaused }: any) {
  const { set: setThree } = useThree();
  useEffect(() => { setThree({ isPaused } as any); }, [isPaused, setThree]);
  return (
    <>
      <mesh scale={[-1, 1, 1]} rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
      {spawnPositions?.length === 2 && BATMOBILE_RIDDLES.map((r, i) => (
        <ClueMesh key={r.id} id={r.id} riddle={r.riddle} options={r.options} correctAnswer={r.correctAnswer} position={spawnPositions[i]} onClick={() => onCardClick(r.id)} isCompleted={completedIds.includes(r.id)} isActive={activeCardId === r.id} onClose={onCloseCard} onSuccess={onCardSuccess} isPaused={isPaused} />
      ))}
    </>
  );
}

const BatmobilePanorama = ({ onNext, onProgress, baseCompleted, isPaused }: BatmobilePanoramaProps) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [spawnPositions, setSpawnPositions] = useState<[[number,number,number],[number,number,number]] | null>(null);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [successFlash, setSuccessFlash] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => { setSpawnPositions(pickTwoSpawns()); }, []);

  // Delay Canvas mount to give GPU time to release previous WebGL context
  useEffect(() => {
    const t = setTimeout(() => setCanvasReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let mounted = true;
    const loader = new THREE.TextureLoader();
    const urls = [
      "/assets/textures/BatCaverna360_BatMobileArea.jpg", 
      "/assets/textures/BatCaverna360_BatMobileArea.png"
    ];

    const loadWithFallback = (idx: number) => {
      if (idx >= urls.length) {
        if (mounted) {
          console.error("All texture fallback failed for BatMobileArea");
          setIsEntering(false);
        }
        return;
      }

      loader.load(urls[idx], (tex) => {
        if (!mounted) return;
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
        setIsEntering(false);
      }, undefined, (err) => {
        console.warn(`Failed to load texture ${urls[idx]}:`, err);
        loadWithFallback(idx + 1);
      });
    };
    loadWithFallback(0);

    const safetyTimer = setTimeout(() => {
      if (mounted && isEntering) {
        setIsEntering(false);
      }
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  const handleCardSuccess = useCallback((id: number) => {
    const newCompleted = [...completedIds, id];
    setCompletedIds(newCompleted);
    setActiveCardId(null);
    setSuccessFlash(true);
    setTimeout(() => setSuccessFlash(false), 800);
    onProgress(baseCompleted + newCompleted.length);
    if (newCompleted.length === BATMOBILE_RIDDLES.length) {
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(onNext, 1000);
      }, 1000);
    }
  }, [completedIds, baseCompleted, onProgress, onNext]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black z-40 overflow-hidden">
      {(!texture || !canvasReady) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-[120]">
          <motion.div 
            animate={{ opacity: [0.2, 0.5, 0.2] }} 
            transition={{ duration: 2, repeat: Infinity }} 
            className="text-gold tracking-[1em] font-black italic uppercase text-[10px] font-mono"
          >
            Sincronizzazione Area...
          </motion.div>
        </div>
      )}

      {texture && canvasReady && (
        <Canvas gl={{ antialias: true, toneMapping: THREE.NoToneMapping, powerPreference: "high-performance" }}>
          <PerspectiveCamera makeDefault position={[0, 0, 0.1]} fov={75} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            rotateSpeed={-0.3} 
            enableDamping 
            dampingFactor={0.05} 
            enabled={!activeCardId && !isExiting && !isPaused} 
          />
          {spawnPositions && (
            <Scene 
              texture={texture} 
              spawnPositions={spawnPositions} 
              activeCardId={activeCardId} 
              completedIds={completedIds} 
              onCardClick={(id: number) => setActiveCardId(id)} 
              onCloseCard={() => setActiveCardId(null)} 
              onCardSuccess={handleCardSuccess} 
              isPaused={isPaused} 
            />
          )}
        </Canvas>
      )}
      <div className="absolute inset-0 pointer-events-none z-20" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)" }} />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center z-30 pointer-events-none">
        <div className="text-[10px] text-gold/60 tracking-[0.8em] uppercase font-bold font-mono">Area Batmobile</div>
        <div className="text-[7px] text-white/20 tracking-[0.4em] uppercase mt-1 font-mono">Indizi: {completedIds.length}/2</div>
      </div>
      <AnimatePresence>
        {(isEntering || isExiting) && (
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: isEntering ? 1 : 0 }} exit={{ opacity: 1 }} transition={{ duration: 1 }} className="absolute inset-0 bg-black z-[100] pointer-events-none" />
        )}
      </AnimatePresence>
      {successFlash && (
        <motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 z-[90] pointer-events-none bg-gold/10" />
      )}
    </div>
  );
};

export default React.memo(BatmobilePanorama);
