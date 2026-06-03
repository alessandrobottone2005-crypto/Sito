/**
 * BatcavernAudioManager — Singleton globale persistente
 *
 * Vive a livello di modulo, completamente fuori dal ciclo di vita React.
 * Una sola istanza Audio esiste per tutta la durata della sessione.
 * Sopravvive a qualsiasi re-render, cambio di fase, Strict Mode di React.
 *
 * Regole fondamentali:
 * - Non chiamare mai .pause() o .stop() durante i cambi di schermata
 * - Non creare nuove istanze: _audio è creato una volta sola
 * - Il loop è gestito dall'HTMLAudioElement nativo (gapless)
 */

const AUDIO_SRC = "./assets/audio/SiglaBatman.wav";
const TARGET_VOLUME = 0.45;
const FADE_IN_DURATION_MS = 2000; // 2 secondi di fade-in morbido

// ── Stato interno del singleton ────────────────────────────────────────────

let _audio: HTMLAudioElement | null = null;
let _started = false;          // true dopo la prima chiamata a start()
let _fadeRafId: number | null = null; // requestAnimationFrame per il fade

// ── Crea l'istanza Audio una sola volta ───────────────────────────────────

function _getInstance(): HTMLAudioElement {
  if (_audio) return _audio;

  _audio = new Audio(AUDIO_SRC);
  _audio.loop = true;
  _audio.volume = 0;
  _audio.preload = "auto";

  // Gestione seamless: se per qualsiasi motivo il loop nativo fallisce,
  // lo forziamo manualmente con margine di sicurezza.
  _audio.addEventListener("timeupdate", () => {
    if (!_audio) return;
    const d = _audio.duration;
    if (d && _audio.currentTime > d - 0.05) {
      _audio.currentTime = 0;
    }
  });

  return _audio;
}

// ── Fade-in fluido tramite requestAnimationFrame ──────────────────────────

function _cancelFade() {
  if (_fadeRafId !== null) {
    cancelAnimationFrame(_fadeRafId);
    _fadeRafId = null;
  }
}

function _fadeInRAF(
  startVolume: number,
  targetVolume: number,
  durationMs: number
): void {
  _cancelFade();
  if (!_audio) return;

  const startTime = performance.now();
  const delta = targetVolume - startVolume;

  const tick = (now: number) => {
    if (!_audio) return;
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    // Curva ease-out per un fade più naturale
    const eased = 1 - Math.pow(1 - progress, 3);
    _audio.volume = Math.min(targetVolume, startVolume + delta * eased);

    if (progress < 1) {
      _fadeRafId = requestAnimationFrame(tick);
    } else {
      _fadeRafId = null;
    }
  };

  _fadeRafId = requestAnimationFrame(tick);
}

// ── API pubblica ──────────────────────────────────────────────────────────

export const BatcavernAudio = {
  /**
   * Precaricare l'audio appena possibile senza riprodurlo.
   * Da chiamare al mount dell'app per minimizzare la latenza.
   */
  preload(): void {
    _getInstance();
  },

  /**
   * Avvia la traccia con fade-in morbido.
   * Se è già in riproduzione, non fa nulla (idempotente).
   * Gestisce automaticamente la autoplay policy dei browser moderni.
   */
  start(fadeDurationMs: number = FADE_IN_DURATION_MS): void {
    if (_started) return;
    _started = true;

    const audio = _getInstance();
    audio.currentTime = 0;
    audio.volume = 0;

    const doPlay = () => {
      audio
        .play()
        .then(() => {
          _fadeInRAF(0, TARGET_VOLUME, fadeDurationMs);
        })
        .catch(() => {
          // Autoplay bloccato: aspettiamo la prima interazione utente
          _started = false; // permettiamo un retry
        });
    };

    doPlay();

    // Fallback per autoplay bloccato: appena l'utente tocca qualcosa
    const unlockAndStart = () => {
      if (_started && _audio && !_audio.paused) return;
      _started = true;
      doPlay();
      document.removeEventListener("click", unlockAndStart, { capture: true });
      document.removeEventListener("keydown", unlockAndStart, {
        capture: true,
      });
      document.removeEventListener("touchstart", unlockAndStart, {
        capture: true,
      });
    };

    document.addEventListener("click", unlockAndStart, { capture: true });
    document.addEventListener("keydown", unlockAndStart, { capture: true });
    document.addEventListener("touchstart", unlockAndStart, { capture: true });
  },

  /**
   * Aggiorna lo stato muted senza interrompere la riproduzione.
   */
  setMuted(muted: boolean): void {
    const audio = _getInstance();
    audio.muted = muted;
  },

  /**
   * Ritorna true se la traccia è in riproduzione.
   */
  isPlaying(): boolean {
    return _audio !== null && !_audio.paused;
  },

  /**
   * Accesso diretto all'istanza (solo per debug / lettura volume).
   * Non usare per pause/stop.
   */
  getInstance(): HTMLAudioElement | null {
    return _audio;
  },
} as const;
