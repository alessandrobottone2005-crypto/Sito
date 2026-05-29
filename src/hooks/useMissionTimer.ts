import { useState, useEffect, useRef, useCallback } from "react";

export function useMissionTimer(
  missionStatus: "idle" | "active" | "failed" | "succeeded",
  isPaused: boolean,
  isVideoTransition: boolean,
  onTimeUp: () => void
) {
  const [timeLeft, setTimeLeft] = useState(180);
  const [initialTime, setInitialTime] = useState(180);
  const [timerABGroup, setTimerABGroup] = useState<"A" | "B">("A");
  const [bonusTimeGranted, setBonusTimeGranted] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // A/B Group Assignment on Mount
  useEffect(() => {
    const group = Math.random() < 0.5 ? "A" : "B";
    setTimerABGroup(group);
    const seconds = group === "A" ? 120 : 240;
    setInitialTime(seconds);
    setTimeLeft(seconds);
    console.log(`[A/B TEST] Assegnato al Gruppo ${group} (${seconds}s timer)`);
  }, []);

  const endTimeRef = useRef<number | null>(null);

  const resetTimer = useCallback(() => {
    const seconds = timerABGroup === "A" ? 120 : 240;
    setTimeLeft(seconds);
    setInitialTime(seconds);
    setBonusTimeGranted(false);
    endTimeRef.current = null;
  }, [timerABGroup]);

  useEffect(() => {
    if (missionStatus === "active" && !isPaused && !isVideoTransition && timeLeft > 0) {
      if (!endTimeRef.current) {
        endTimeRef.current = performance.now() + timeLeft * 1000;
      }
      timerRef.current = setInterval(() => {
        const now = performance.now();
        const remaining = Math.max(0, Math.ceil((endTimeRef.current! - now) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          onTimeUp();
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 250); // check 4 times a second for better precision
    } else {
      // If paused or video transition, we must adjust endTimeRef when resuming
      // For simplicity, we just clear endTimeRef and it will be recalculated based on timeLeft when resuming
      if (endTimeRef.current) {
        endTimeRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [missionStatus, isPaused, isVideoTransition, timeLeft, onTimeUp]);

  const grantBonusTime = useCallback((amount: number) => {
    if (!bonusTimeGranted) {
      setTimeLeft((prev) => {
        const newTime = prev + amount;
        if (endTimeRef.current) {
          endTimeRef.current += amount * 1000;
        }
        return newTime;
      });
      setBonusTimeGranted(true);
      return true;
    }
    return false;
  }, [bonusTimeGranted]);

  return {
    timeLeft,
    initialTime,
    timerABGroup,
    bonusTimeGranted,
    resetTimer,
    grantBonusTime,
    setTimeLeft,
  };
}
