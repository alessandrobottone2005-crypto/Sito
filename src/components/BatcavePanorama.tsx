import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import JokerCard from "./JokerCard";
interface BatcavePanoramaProps {
  onNext: () => void;
  onProgress: (count: number) => void;
  isPaused?: boolean;
}

// Fase 1: 2 indizi nella Batcaverna (Batcomputer Area)
const RIDDLES = [
  { 
    id: 1, 
    riddle: "Non è un uomo, non è un mostro, non è un re… ma tutta Gotham trattiene il respiro quando appare nel cielo.", 
    options: ["Joker", "Batsegnale", "Pinguino", "Arkham"],
    correctAnswer: "Batsegnale" 
  },
  { 
    id: 2, 
    riddle: "Ho un sorriso eterno, ma non conosco felicità. Più rido… più Gotham soffre.", 
    options: ["Due Facce", "Robin", "Joker", "Enigmista"],
    correctAnswer: "Joker" 
  },
];

function ClueMesh({ id, position, onClick, isCompleted, isActive, onClose, onSuccess, riddle, options, correctAnswer, isPaused }: any) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const targetWorldPos = useRef(new THREE.Vector3());

  // Fai in modo che la carta guardi verso il centro all'inizio
  useEffect(() => {
    if (meshRef.current && !isActive) {
      meshRef.current.position.set(position[0], position[1], position[2]);
      meshRef.current.lookAt(0, 0, 0);
      meshRef.current.scale.set(0.4, 0.4, 0.4); // Partono piccole
    }
  }, [position]);

  useFrame((state, delta) => {
    if (!meshRef.current || isCompleted) return;
    
    const isGlobalPaused = (state as any).isPaused;
    if (isGlobalPaused) return;

    if (isActive) {
      // Porta la carta davanti alla telecamera (circa 60 unità di distanza per non zoomare troppo)
      const dir = state.camera.getWorldDirection(new THREE.Vector3());
      targetWorldPos.current.copy(state.camera.position).add(dir.multiplyScalar(60));
      meshRef.current.position.lerp(targetWorldPos.current, delta * 5);
      
      // Fai in modo che guardi perfettamente verso la telecamera
      meshRef.current.quaternion.slerp(state.camera.quaternion, delta * 5);

      // Scala 0.6 per renderla molto più piccola e farla stare tutta nello schermo
      meshRef.current.scale.lerp(new THREE.Vector3(0.6, 0.6, 0.6), delta * 5);
    } else {
      // Riporta la carta alla posizione originale
      const origPos = new THREE.Vector3(...position);
      meshRef.current.position.lerp(origPos, delta * 5);
      
      // Guarda verso il centro della scena
      const lookAtMat = new THREE.Matrix4().lookAt(meshRef.current.position, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0));
      meshRef.current.quaternion.slerp(new THREE.Quaternion().setFromRotationMatrix(lookAtMat), delta * 5);

      // Scala piccola e stealth
      const targetScale = hovered ? 0.5 : 0.4;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
    }
  });

  if (isCompleted) return null;

  return (
    <group ref={meshRef} position={position}>
      <Html
        transform
        distanceFactor={60}
        zIndexRange={[100, 0]}
        center
      >
        <div 
          onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerLeave={() => setHovered(false)}
          onClick={(e) => { 
            e.stopPropagation(); 
            if (!isActive && !isPaused) onClick(); 
          }}
          className={`transition-all duration-300 ${isActive ? "cursor-default" : "cursor-pointer"} w-[140px] h-[196px] bg-black rounded-xl flex flex-col items-center justify-center p-4 relative ${
            hovered || isActive
              ? "border-2 border-joker shadow-[0_0_40px_rgba(57,255,20,0.5)]" 
              : "border border-white/5 shadow-[0_0_5px_rgba(57,255,20,0.1)]"
          }`}
        >
          {/* Green Fluo Details - Nascondiamo quasi del tutto quando idle */}
          <div className={`absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-joker transition-opacity ${hovered || isActive ? "opacity-100" : "opacity-10"}`} />
          <div className={`absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-joker transition-opacity ${hovered || isActive ? "opacity-100" : "opacity-10"}`} />
          <div className={`absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-joker transition-opacity ${hovered || isActive ? "opacity-100" : "opacity-10"}`} />
          <div className={`absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-joker transition-opacity ${hovered || isActive ? "opacity-100" : "opacity-10"}`} />
          
          {/* Non mostriamo la carta Joker interna finché non è cliccata, mostriamo solo un retro oscuro */}
          {!isActive && (
            <>
              <div className={`w-14 h-14 text-joker transition-opacity duration-300 ${hovered ? "opacity-60" : "opacity-10"}`}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                </svg>
              </div>
              <div className={`mt-6 text-[7px] tracking-[0.4em] uppercase font-bold transition-colors ${hovered ? "text-joker" : "text-white/10"}`}>
                Protocollo
              </div>
            </>
          )}

          <div className={`absolute inset-0 transition-colors pointer-events-none rounded-xl ${hovered && !isActive ? "bg-joker/10" : "bg-transparent"}`} />

          {/* Renderizza JokerCard completa solo se attiva (sovrascrive il design frontale) */}
          {/* Usa absolute e translate per centrarla perfettamente rispetto all'origine del mesh 3D */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isActive ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <JokerCard 
              id={id} 
              riddle={riddle} 
              options={options}
              correctAnswer={correctAnswer} 
              onSuccess={onSuccess} 
              onClose={onClose}
              isFlipped={isActive}
              isPaused={isPaused}
            />
          </div>
        </div>
      </Html>
    </group>
  );
}

function Scene({ texture, activeCardId, completedIds, onCardClick, onCloseCard, onCardSuccess, isPaused }: any) {
  const [positions, setPositions] = useState<[number, number, number][]>([]);
  const { set: setThree } = useThree();

  useEffect(() => {
    setThree({ isPaused } as any);
  }, [isPaused, setThree]);

  useEffect(() => {
    const newPositions: [number, number, number][] = [];
    const radius = 150;
    
    RIDDLES.forEach(() => {
      let x = 0, y = 0, z = 0;
      let valid = false;
      let attempts = 0;
      
      while (!valid && attempts < 50) {
        // Estendiamo il phi per posizionarle molto più in alto o molto più in basso nel buio
        const phi = Math.random() * 1.8 + 0.6; 
        const theta = Math.random() * Math.PI * 2;
        
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.cos(phi);
        z = radius * Math.sin(phi) * Math.sin(theta);
        
        valid = true;
        for (const pos of newPositions) {
          const dx = pos[0] - x;
          const dy = pos[1] - y;
          const dz = pos[2] - z;
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist < 80) { // Increased distance to prevent overlapping
            valid = false;
            break;
          }
        }
        attempts++;
      }
      
      newPositions.push([x, y, z]);
    });
    
    setPositions(newPositions);
  }, []);

  return (
    <>
      <mesh scale={[-1, 1, 1]} rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
      
      {positions.length > 0 && RIDDLES.map((riddle, index) => (
        <ClueMesh
          key={riddle.id}
          id={riddle.id}
          riddle={riddle.riddle}
          options={riddle.options}
          correctAnswer={riddle.correctAnswer}
          position={positions[index]}
          onClick={() => onCardClick(riddle.id)}
          isCompleted={completedIds.includes(riddle.id)}
          isActive={activeCardId === riddle.id}
          onClose={onCloseCard}
          onSuccess={onCardSuccess}
          isPaused={isPaused}
        />
      ))}
    </>
  );
}


const BatcavePanorama = ({ onNext, onProgress, isPaused }: BatcavePanoramaProps) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPaused) videoRef.current.pause();
      else videoRef.current.play().catch(() => {});
    }
  }, [isPaused]);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/BatCaverna360_BatComputerArea.mp4";
    video.crossOrigin = "Anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    let hasLoaded = false;

    // Carica immagine statica come fallback immediato
    const loader = new THREE.TextureLoader();
    loader.load("/BatCaverna360_BatComputerArea.png", (imgTex) => {
      imgTex.colorSpace = THREE.SRGBColorSpace;
      if (!hasLoaded) {
        setTexture(imgTex);
        setTimeout(() => setIsEntering(false), 1000);
      }
    });

    const onCanPlay = () => {
      if (hasLoaded) return;
      hasLoaded = true;
      const tex = new THREE.VideoTexture(video);
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
      videoRef.current = video;
      setTimeout(() => setIsEntering(false), 1000);
    };

    const onError = (err: any) => {
      console.error("Error loading video texture:", err);
      // Let the image fallback handle it instead of throwing error
    };

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("canplaythrough", onCanPlay);
    video.addEventListener("error", onError);

    video.play().catch((e) => {
      console.warn("Autoplay blocked for video panorama:", e);
    });

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("canplaythrough", onCanPlay);
      video.removeEventListener("error", onError);
      video.pause();
      video.src = "";
    };
  }, []);

  const handleCardSuccess = (id: number) => {
    const newCompleted = [...completedIds, id];
    setCompletedIds(newCompleted);
    setActiveCardId(null);
    onProgress(newCompleted.length);

    if (newCompleted.length === RIDDLES.length) {
      setIsFinishing(true);
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          onNext(); // → fase batmobile
        }, 1500);
      }, 1000);
    }
  };

  const activeRiddle = RIDDLES.find(r => r.id === activeCardId);

  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-gold uppercase tracking-widest font-mono p-8 text-center">
        {error}
        <button onClick={onNext} className="mt-4 px-4 py-2 border border-gold">Salta</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black z-40 overflow-hidden">
      {!texture ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
          <motion.div 
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gold tracking-[1em] font-black italic uppercase text-xs"
          >
            Sincronizzazione HUD...
          </motion.div>
        </div>
      ) : (
        <Canvas gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}>
          <PerspectiveCamera makeDefault position={[0, 0, 0.1]} fov={activeCardId ? 60 : 75} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            rotateSpeed={-0.3}
            enableDamping={true}
            dampingFactor={0.05}
            enabled={!activeCardId && !isFinishing && !isPaused}
          />
          <Scene 
            texture={texture} 
            activeCardId={activeCardId} 
            completedIds={completedIds}
            onCardClick={(id: number) => setActiveCardId(id)}
            onCloseCard={() => setActiveCardId(null)}
            onCardSuccess={handleCardSuccess}
            isPaused={isPaused}
          />
        </Canvas>
      )}

      {/* Cinematic HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-12 z-30">
        <div className="flex justify-between">
          <div className="w-16 h-16 border-t border-l border-white/10" />
          <div className="w-16 h-16 border-t border-r border-white/10" />
        </div>
        <div className="flex justify-between w-full">
          <div className="w-16 h-16 border-b border-l border-white/10" />
          <div className="w-16 h-16 border-b border-r border-white/10" />
        </div>
      </div>

      <div className="absolute bottom-8 left-12 text-[9px] text-white/20 font-mono tracking-widest uppercase pointer-events-none z-30">
        Bat-Cave // Area Batcomputer<br />
        Indizi: {completedIds.length} / {RIDDLES.length}
      </div>

      {/* Enter/Exit Fades */}
      <AnimatePresence>
        {isEntering && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-black z-[110] pointer-events-none"
          />
        )}
        {isExiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-black z-[110] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default React.memo(BatcavePanorama);


