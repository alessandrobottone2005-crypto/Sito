/**
 * useAudioSystem — Hook React semplificato
 *
 * Delega tutta la logica audio al singleton BatcavernAudio.
 * Non crea, non distrugge, non ri-istanzia nessuna risorsa audio.
 * L'unica responsabilità di questo hook è sincronizzare lo stato
 * muted tra React e il singleton globale.
 */

import { useEffect } from "react";
import { BatcavernAudio } from "../lib/audioManager";

export function useAudioSystem(isMuted: boolean) {
  // Precaricare al primo mount dell'app (senza avviare la riproduzione)
  useEffect(() => {
    BatcavernAudio.preload();
  }, []);

  // Sincronizza lo stato muted in tempo reale
  useEffect(() => {
    BatcavernAudio.setMuted(isMuted);
  }, [isMuted]);

  return {
    // Esposto per compatibilità con App.tsx (accesso diretto all'istanza)
    audioRef: { current: BatcavernAudio.getInstance() },
  };
}
