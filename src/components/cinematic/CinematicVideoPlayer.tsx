import { useEffect, useRef, useState } from "react";

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

    // Safety auto-advance basato sulla durata reale del video (+3s di margine)
    // Fallback a 30s se la durata non è ancora nota
    let safetyTimer: ReturnType<typeof setTimeout>;
    const scheduleSafety = () => {
      const duration = video.duration;
      const delay = isFinite(duration) ? (duration * 1000 + 3000) : 30000;
      safetyTimer = setTimeout(markEnded, delay);
    };

    if (video.readyState >= 1) {
      scheduleSafety();
    } else {
      video.addEventListener("loadedmetadata", scheduleSafety, { once: true });
      // Fallback se loadedmetadata non arriva
      safetyTimer = setTimeout(markEnded, 30000);
    }

    const startVideo = async () => {
      try {
        video.currentTime = 0;
        await video.play();
      } catch (err) {
        console.warn("Video playback failed:", err);
        markEnded();
      }
    };

    startVideo();

    return () => {
      video.removeEventListener("ended", markEnded);
      video.removeEventListener("loadedmetadata", scheduleSafety);
      clearTimeout(safetyTimer);
    };
  }, [src]);

  // Keep a stable ref to onEnded so we don't need it in effect deps
  const onEndedRef = useRef(onEnded);
  useEffect(() => { onEndedRef.current = onEnded; }, [onEnded]);

  // Handle phase transition when video ends — deps ONLY on videoEnded
  const transitionStarted = useRef(false);
  useEffect(() => {
    if (!videoEnded || transitionStarted.current) return;
    transitionStarted.current = true;
    setIsExiting(true);

    const t = setTimeout(() => {
      onEndedRef.current();
    }, 400);

    return () => clearTimeout(t);
  }, [videoEnded]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[500] overflow-hidden">
      <video
        ref={videoRef}
        onPlaying={() => setIsVisible(true)}
        className={`w-full h-full object-cover transition-opacity duration-700 ${isVisible && !isExiting ? "opacity-100" : "opacity-0"}`}
        playsInline
        muted
        src={src}
      />
    </div>
  );
}
