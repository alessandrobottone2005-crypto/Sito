import { useEffect, useRef } from "react";

interface JokerAudioManagerProps {
  isActive: boolean;
  isMuted: boolean;
  isPaused: boolean;
}

export default function JokerAudioManager({ isActive, isMuted, isPaused }: JokerAudioManagerProps) {
  const templateAudioRef = useRef<HTMLAudioElement | null>(null);
  const nextLaughTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio
  useEffect(() => {
    try {
      const audio = new Audio("./assets/audio/RisataJoker.wav");
      templateAudioRef.current = audio;
    } catch (error) {
      console.error("Failed to load Joker laugh audio:", error);
    }

    return () => {
      if (nextLaughTimeoutRef.current) clearTimeout(nextLaughTimeoutRef.current);
    };
  }, []);

  const playLaugh = () => {
    if (!templateAudioRef.current || isMuted || isPaused || !isActive) return;

    const randomVolume = 0.05 + Math.random() * 0.35;
    
    const clone = templateAudioRef.current.cloneNode() as HTMLAudioElement;
    clone.volume = randomVolume;
    clone.play().catch(() => {});
  };

  // Handle random intervals
  useEffect(() => {
    const scheduleNextLaugh = () => {
      if (nextLaughTimeoutRef.current) clearTimeout(nextLaughTimeoutRef.current);
      
      if (!isActive || isPaused) return;

      // Random delay between 4 and 12 seconds
      const delay = 4000 + Math.random() * 8000;
      
      nextLaughTimeoutRef.current = setTimeout(() => {
        playLaugh();
        scheduleNextLaugh();
      }, delay);
    };

    if (isActive && !isPaused) {
      // First laugh happens sooner (between 2 and 5 seconds)
      const initialDelay = 2000 + Math.random() * 3000;
      nextLaughTimeoutRef.current = setTimeout(() => {
        playLaugh();
        scheduleNextLaugh();
      }, initialDelay);
    } else {
      if (nextLaughTimeoutRef.current) clearTimeout(nextLaughTimeoutRef.current);
    }

    return () => {
      if (nextLaughTimeoutRef.current) clearTimeout(nextLaughTimeoutRef.current);
    };
  }, [isActive, isPaused, isMuted]);

  return null; // Component doesn't render anything visually
}
