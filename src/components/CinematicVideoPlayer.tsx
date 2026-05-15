import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface CinematicVideoPlayerProps {
  src: string;
  onEnded: () => void;
  label?: string;
  nextAsset?: string;
}

export default function CinematicVideoPlayer({ 
  src, 
  onEnded, 
  label = "Spostamento...", 
  nextAsset 
}: CinematicVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const hasTriggeredExit = useRef(false);

  // Preload next asset (silent background load)
  useEffect(() => {
    if (!nextAsset) return;
    const img = new Image();
    img.src = nextAsset;
  }, [nextAsset]);

  const markEnded = () => {
    if (!hasTriggeredExit.current) {
      hasTriggeredExit.current = true;
      setVideoEnded(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("ended", markEnded);
    
    const playTimer = setTimeout(async () => {
      try {
        await video.play();
        setIsVisible(true);
      } catch {
        markEnded();
      }
    }, 100);

    // Show safety skip after 3 seconds
    const skipTimer = setTimeout(() => setShowSkip(true), 3500);

    // Safety auto-advance (8 seconds max for any transition video)
    const safetyTimer = setTimeout(markEnded, 8500);

    return () => {
      video.removeEventListener("ended", markEnded);
      clearTimeout(playTimer);
      clearTimeout(skipTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  // Handle phase transition when video ends
  useEffect(() => {
    if (!videoEnded || isExiting) return;
    setIsExiting(true);
    
    // Smooth fade out before calling parent onEnded
    const t = setTimeout(() => {
      onEnded();
    }, 500);

    return () => clearTimeout(t);
  }, [videoEnded, isExiting, onEnded]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[500] overflow-hidden">
      <AnimatePresence>
        {isVisible && (
          <motion.video
            ref={videoRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full object-cover"
            playsInline
            muted
            src={src}
          />
        )}
      </AnimatePresence>

      {/* Cinematic HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-black/20">
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold text-[10px] tracking-[1em] uppercase font-black mb-2 opacity-60"
          >
            {label}
          </motion.div>
          <div className="w-48 h-[1px] bg-gold/20 relative overflow-hidden mx-auto">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-gold"
              animate={{ left: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: "40%" }}
            />
          </div>
        </div>
      </div>

      {/* Subtle Skip Safety */}
      <AnimatePresence>
        {showSkip && !isExiting && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            whileHover={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={markEnded}
            className="absolute bottom-8 right-8 z-[600] pointer-events-auto text-[8px] text-white/50 tracking-[0.4em] uppercase border border-white/10 px-4 py-2 hover:bg-white/5"
          >
            Salta Video
          </motion.button>
        )}
      </AnimatePresence>

      {/* Loading fallback */}
      {!isVisible && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-gold text-[9px] tracking-[0.5em] animate-pulse uppercase">Inizializzazione Video...</div>
        </div>
      )}
    </div>
  );
}
