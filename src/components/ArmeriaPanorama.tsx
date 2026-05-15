import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Html } from "@react-three/drei";
import * as THREE from "three";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import JokerCard from "./JokerCard";

interface ArmeriaPanoramaProps {
  onNext: () => void;
  onProgress: (count: number) => void;
  baseCompleted: number; // = 2
  isPaused?: boolean;
}

const ARMERIA_RIDDLE = {
  id: 3,
  riddle: "Non ho superpoteri, ma faccio tremare i criminali. La notte è il mio regno.",
  options: ["Superman", "Batman", "Bane", "Flash"],
  correctAnswer: "Batman",
};

const ARMERIA_POSITION: [number, number, number] = [
  150 * Math.sin(1.45) * Math.cos(-0.6),
  150 * Math.cos(1.45),
  150 * Math.sin(1.45) * Math.sin(-0.6),
];

function ClueMesh({ position, onClick, isCompleted, isActive, onClose, onSuccess, isPaused }: any) {
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
      const ts = hovered ? 0.52 : 0.4;
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
            width: 140,
            height: 196,
            background: "#000",
            borderRadius: 12,
            border: hovered || isActive ? "2px solid #39FF14" : "1px solid rgba(255,255,255,0.05)",
            boxShadow: hovered || isActive ? "0 0 40px rgba(57,255,20,0.5)": "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            cursor: isActive ? "default" : "pointer",
            transition: "all 0.3s",
          }}
        >
          {!isActive && (
            <div style={{ width: 40, height: 40, color: "#39FF14", opacity: hovered ? 0.8 : 0.2 }}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
            </div>
          )}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: isActive ? 1 : 0, pointerEvents: isActive ? "auto" : "none" }}>
            <JokerCard id={ARMERIA_RIDDLE.id} riddle={ARMERIA_RIDDLE.riddle} options={ARMERIA_RIDDLE.options} correctAnswer={ARMERIA_RIDDLE.correctAnswer} onSuccess={onSuccess} onClose={onClose} isFlipped={isActive} isPaused={isPaused} />
          </div>
        </div>
      </Html>
    </group>
  );
}

function Scene({ texture, activeCardId, isCompleted, onCardClick, onCloseCard, onCardSuccess, isPaused }: any) {
  const { set: setThree } = useThree();
  useEffect(() => { setThree({ isPaused } as any); }, [isPaused, setThree]);
  return (
    <>
      <mesh scale={[-1, 1, 1]} rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
      <ClueMesh position={ARMERIA_POSITION} onClick={onCardClick} isCompleted={isCompleted} isActive={activeCardId === ARMERIA_RIDDLE.id} onClose={onCloseCard} onSuccess={onCardSuccess} isPaused={isPaused} />
    </>
  );
}

const ArmeriaPanorama = ({ onNext, onProgress, baseCompleted, isPaused }: ArmeriaPanoramaProps) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [successFlash, setSuccessFlash] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const urls = ["/BatCaverna360_ArmeriaArea.jpg", "/BatCaverna360_ArmeriaArea.png"];
    
    const loadWithFallback = (idx: number) => {
      if (idx >= urls.length) return;
      loader.load(urls[idx], (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
        setTimeout(() => setIsEntering(false), 800);
      }, undefined, () => loadWithFallback(idx + 1));
    };
    loadWithFallback(0);
  }, []);

  const handleCardSuccess = useCallback(() => {
    setIsCompleted(true);
    setActiveCardId(null);
    setSuccessFlash(true);
    setTimeout(() => setSuccessFlash(false), 800);
    onProgress(baseCompleted + 1);
    setTimeout(() => {
      setIsExiting(true);
      setTimeout(onNext, 1200);
    }, 1000);
  }, [baseCompleted, onProgress, onNext]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black z-40 overflow-hidden">
      {!texture && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
          <motion.div animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="text-gold tracking-[0.8em] font-black uppercase text-[10px] font-mono">
            Accesso Armeria...
          </motion.div>
        </div>
      )}

      {texture && (
        <Canvas gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}>
          <PerspectiveCamera makeDefault position={[0, 0, 0.1]} fov={75} />
          <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={-0.3} enableDamping dampingFactor={0.05} enabled={!activeCardId && !isExiting && !isPaused} />
          <Scene texture={texture} activeCardId={activeCardId} isCompleted={isCompleted} onCardClick={() => setActiveCardId(ARMERIA_RIDDLE.id)} onCloseCard={() => setActiveCardId(null)} onCardSuccess={handleCardSuccess} isPaused={isPaused} />
        </Canvas>
      )}

      <div className="absolute inset-0 pointer-events-none z-20" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)" }} />
      
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center z-30 pointer-events-none">
        <div className="text-[10px] text-gold/60 tracking-[0.8em] uppercase font-bold font-mono">Area Armeria</div>
        <div className="text-[7px] text-white/20 tracking-[0.4em] uppercase mt-1 font-mono">Indizi: {isCompleted ? "1" : "0"}/1</div>
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

export default React.memo(ArmeriaPanorama);
