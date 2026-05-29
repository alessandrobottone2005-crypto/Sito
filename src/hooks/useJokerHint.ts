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

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phase2Ref = useRef<NodeJS.Timeout | null>(null);
  const phase3Ref = useRef<NodeJS.Timeout | null>(null);
  const currentCardRef = useRef<number | null>(null);

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (phase2Ref.current) { clearTimeout(phase2Ref.current); phase2Ref.current = null; }
    if (phase3Ref.current) { clearTimeout(phase3Ref.current); phase3Ref.current = null; }
  }, []);

  const resetHint = useCallback((cardId?: number) => {
    clearAllTimers();
    setHintActive(false);
    setHintCardId(null);
    setHintPhase(0);
    currentCardRef.current = null;
  }, [clearAllTimers]);

  const startHintTimer = useCallback((cardId: number) => {
    // Non avviare se già in corso per questa stessa carta
    if (currentCardRef.current === cardId) return;
    clearAllTimers();
    currentCardRef.current = cardId;
    setHintActive(false);
    setHintCardId(null);
    setHintPhase(0);

    // Fase 1: dopo 60s — glitch lieve + pulsazione verde
    timerRef.current = setTimeout(() => {
      setHintActive(true);
      setHintCardId(cardId);
      setHintPhase(1);

      // Fase 2: dopo altri 20s — spotlight + audio distorsione
      phase2Ref.current = setTimeout(() => {
        setHintPhase(2);

        // Fase 3: dopo altri 20s — glow massimo + flicker ambientale
        phase3Ref.current = setTimeout(() => {
          setHintPhase(3);
        }, 20_000);
      }, 20_000);
    }, HINT_DELAY_MS);
  }, [clearAllTimers]);

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
