import { useEffect, useRef, useCallback } from "react";

export function useAudioSystem(isMuted: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("./assets/audio/SiglaBatman.wav");
    audio.loop = true;
    audio.volume = 0.4;
    audio.muted = isMuted;
    audioRef.current = audio;

    const tryPlay = () => {
      audio.play().catch(() => {
        const unlock = () => {
          audio.play().catch(() => { });
          window.removeEventListener("click", unlock);
        };
        window.addEventListener("click", unlock);
      });
    };
    tryPlay();
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  const playMusic = useCallback((time: number = 20, volume: number = 0.4) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const pauseMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const fadeOutMusic = useCallback((callback?: () => void) => {
    if (audioRef.current) {
      let currentVol = audioRef.current.volume;
      const fadeOut = setInterval(() => {
        currentVol = Math.max(0, currentVol - 0.05);
        if (audioRef.current) audioRef.current.volume = currentVol;
        if (currentVol <= 0) {
          clearInterval(fadeOut);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.volume = 0.4; // reset for next play
          }
          if (callback) callback();
        }
      }, 80);
    } else {
      if (callback) callback();
    }
  }, []);

  const fadeInMusic = useCallback((targetVol: number = 0.4, startVol: number = 0.05, duration: number = 100) => {
    if (audioRef.current) {
      audioRef.current.volume = startVol;
      audioRef.current.play().catch(() => {});
      let currentVol = startVol;
      const fadeIn = setInterval(() => {
        currentVol = Math.min(targetVol, currentVol + 0.05);
        if (audioRef.current) audioRef.current.volume = currentVol;
        if (currentVol >= targetVol) clearInterval(fadeIn);
      }, duration);
    }
  }, []);

  return { audioRef, playMusic, pauseMusic, fadeOutMusic, fadeInMusic };
}
