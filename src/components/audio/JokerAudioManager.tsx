import { useEffect, useRef } from "react";

interface JokerAudioManagerProps {
  isActive: boolean;
  isMuted: boolean;
  isPaused: boolean;
}

export default function JokerAudioManager({ isActive, isMuted, isPaused }: JokerAudioManagerProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const nextLaughTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Audio Context and load the sound
  useEffect(() => {
    const initAudio = async () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        
        const response = await fetch("/assets/audio/RisataJoker.wav");
        const arrayBuffer = await response.arrayBuffer();
        audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
      } catch (error) {
        console.error("Failed to load Joker laugh audio:", error);
      }
    };

    initAudio();

    return () => {
      if (nextLaughTimeoutRef.current) clearTimeout(nextLaughTimeoutRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playLaugh = () => {
    if (!audioContextRef.current || !audioBufferRef.current || isMuted || isPaused || !isActive) return;

    // Resume context if suspended (browser security)
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;

    // Gain node for volume (distance)
    const gainNode = audioContextRef.current.createGain();
    // Randomize volume between 0.05 and 0.4 for a "distant yet present" effect
    const randomVolume = 0.05 + Math.random() * 0.35;
    gainNode.gain.value = randomVolume;

    // Panner node for stereo position
    const pannerNode = audioContextRef.current.createStereoPanner();
    // Randomize pan between -0.8 (left) and 0.8 (right)
    pannerNode.pan.value = (Math.random() * 1.6) - 0.8;

    // Connect nodes
    source.connect(pannerNode);
    pannerNode.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    source.start(0);
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
