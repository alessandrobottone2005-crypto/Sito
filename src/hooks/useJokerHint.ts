import { useState, useEffect, useRef, useCallback } from "react";

/** Durata (ms) prima che il sistema hint si attivi */
const HINT_DELAY_MS = 60_000;

export interface JokerHintState {
  /** true quando il sistema hint è attivo sull'indizio corrente */
  hintActive: boolean;
  /** L'id della carta che ha l'hint attivo */
  hintCardId: number | null;
  /** Fase di intensità dell'hint (0=inattivo, 1=lieve, 2=moderato, 3=forte) */
  hintPhase: 0 | 1 | 2 | 3;
  /** Resetta il timer (es. carta trovata o carta cliccata) */
  resetHint: (cardId?: number) => void;
  /** Avvia il timer per un indizio specifico */
  startHintTimer: (cardId: number) => void;
}

/**
 * Gestisce il timer narrativo del Joker per la rivelazione progressiva delle carte.
 * - Timer indipendente per ogni indizio attivo nella scena
 * - Auto-reset quando la carta viene trovata
 * - 3 fasi di intensità crescente (cinematica, non arcade)
 */
export function useJokerHint(
  isPaused: boolean,
  isMissionActive: boolean,
  completedIds: number[],
  activeCardId: number | null
): JokerHintState {
  const [hintActive, setHintActive] = useState(false);
  const [hintCardId, setHintCardId] = useState<number | null>(null);
  const [hintPhase, setHintPhase] = useState<0 | 1 | 2 | 3>(0);

  const currentCardRef = useRef<number | null>(null);
  const elapsedRef = useRef<number>(0);

  const resetHint = useCallback((cardId?: number) => {
    setHintActive(false);
    setHintCardId(null);
    setHintPhase(0);
    currentCardRef.current = null;
    elapsedRef.current = 0;
  }, []);

  const startHintTimer = useCallback((cardId: number) => {
    if (currentCardRef.current === cardId) return;
    setHintActive(false);
    setHintCardId(null);
    setHintPhase(0);
    currentCardRef.current = cardId;
    elapsedRef.current = 0;
  }, []);

  // Gestione timer con setInterval per supportare pause
  useEffect(() => {
    if (!isMissionActive || isPaused || currentCardRef.current === null) return;

    const interval = setInterval(() => {
      elapsedRef.current += 500;
      const e = elapsedRef.current;

      if (e >= HINT_DELAY_MS + 40_000) {
        setHintPhase(3);
      } else if (e >= HINT_DELAY_MS + 20_000) {
        setHintPhase(2);
      } else if (e >= HINT_DELAY_MS) {
        setHintActive(true);
        setHintCardId(currentCardRef.current);
        if (hintPhase < 1) setHintPhase(1);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isMissionActive, isPaused, hintPhase]);

  // Pausa/ripresa: se in pausa, non eseguire effetti (i timer continuano ma i componenti li ignorano)
  // Se la missione non è attiva, resetta tutto
  useEffect(() => {
    if (!isMissionActive) {
      resetHint();
    }
  }, [isMissionActive, resetHint]);

  // Se la carta con hint attivo viene completata, resetta
  useEffect(() => {
    if (hintCardId !== null && completedIds.includes(hintCardId)) {
      resetHint();
    }
  }, [completedIds, hintCardId, resetHint]);

  // Quando una carta viene aperta (activeCardId), resetta il timer di hint
  // (il giocatore ha trovato la carta, l'hint non serve più)
  useEffect(() => {
    if (activeCardId !== null) {
      resetHint();
    }
  }, [activeCardId, resetHint]);

  return {
    hintActive,
    hintCardId,
    hintPhase,
    resetHint,
    startHintTimer,
  };
}
