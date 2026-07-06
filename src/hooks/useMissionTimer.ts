import { useState, useEffect, useRef, useCallback } from "react";

const TOTAL_TIME = 180; // 3 minuti fissi

export function useMissionTimer(
  missionStatus: "idle" | "active" | "failed" | "succeeded",
  isPaused: boolean,
  isVideoTransition: boolean,
  onTimeUp: () => void
) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [bonusTimeGranted, setBonusTimeGranted] = useState(false);

  // Refs per non avere dipendenze instabili nell'effect principale
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const endTimeRef = useRef<number | null>(null);     // quando il timer arriva a 0 (performance.now)
  const startTimeRef = useRef<number | null>(null);   // quando la missione è partita
  const totalPausedRef = useRef<number>(0);           // ms totali in pausa
  const pauseStartRef = useRef<number | null>(null);  // inizio pausa corrente
  const onTimeUpRef = useRef(onTimeUp);

  // Aggiorna sempre la ref senza aggiungere onTimeUp alle deps dell'effect
  useEffect(() => { onTimeUpRef.current = onTimeUp; }, [onTimeUp]);

  const clearTimerInterval = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startInterval = useCallback(() => {
    clearTimerInterval();
    timerRef.current = setInterval(() => {
      if (endTimeRef.current === null || startTimeRef.current === null) return;

      const now = performance.now();
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
      const paused = totalPausedRef.current + (pauseStartRef.current !== null ? now - pauseStartRef.current : 0);
      const elapsed = Math.floor((now - startTimeRef.current - paused) / 1000);

      setTimeLeft(remaining);
      setElapsedSeconds(Math.max(0, elapsed));

      if (remaining <= 0) {
        clearTimerInterval();
        onTimeUpRef.current();
      }
    }, 250);
  }, [clearTimerInterval]);

  // ── Effect principale: NON dipende da timeLeft per evitare ricreazione ogni tick ──
  useEffect(() => {
    // Missione non attiva → stoppa tutto
    if (missionStatus !== "active") {
      clearTimerInterval();
      // Registra inizio pausa se non già fatto (missione terminata)
      if (endTimeRef.current !== null && pauseStartRef.current === null) {
        pauseStartRef.current = performance.now();
      }
      return;
    }

    const shouldFreeze = isPaused || isVideoTransition;

    if (shouldFreeze) {
      // ── PAUSA / TRANSIZIONE: ferma l'intervallo e registra l'inizio pausa ──
      clearTimerInterval();
      if (pauseStartRef.current === null) {
        pauseStartRef.current = performance.now();
      }
    } else {
      // ── TIMER ATTIVO ──
      const now = performance.now();

      if (endTimeRef.current === null) {
        // Prima partenza: inizializza tutto
        startTimeRef.current = now;
        totalPausedRef.current = 0;
        endTimeRef.current = now + TOTAL_TIME * 1000;
        pauseStartRef.current = null;
      } else if (pauseStartRef.current !== null) {
        // Ripresa da pausa: compensa il tempo perso
        const pauseDuration = now - pauseStartRef.current;
        totalPausedRef.current += pauseDuration;
        endTimeRef.current += pauseDuration;
        pauseStartRef.current = null;
      }

      startInterval();
    }

    return () => {
      clearTimerInterval();
    };
  // NON includere timeLeft — l'intervallo gestisce i propri tick tramite refs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionStatus, isPaused, isVideoTransition, clearTimerInterval, startInterval]);

  const resetTimer = useCallback(() => {
    clearTimerInterval();
    setTimeLeft(TOTAL_TIME);
    setElapsedSeconds(0);
    setBonusTimeGranted(false);
    endTimeRef.current = null;
    startTimeRef.current = null;
    totalPausedRef.current = 0;
    pauseStartRef.current = null;
  }, [clearTimerInterval]);

  const grantBonusTime = useCallback((amount: number) => {
    if (!bonusTimeGranted) {
      setTimeLeft(prev => prev + amount);
      if (endTimeRef.current) {
        endTimeRef.current += amount * 1000;
      }
      setBonusTimeGranted(true);
      return true;
    }
    return false;
  }, [bonusTimeGranted]);

  return {
    timeLeft,
    elapsedSeconds,
    initialTime: TOTAL_TIME,
    timerABGroup: "A" as "A" | "B",
    bonusTimeGranted,
    resetTimer,
    grantBonusTime,
    setTimeLeft,
  };
}
