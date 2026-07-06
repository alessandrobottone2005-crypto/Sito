/**
 * JokerAudioManager — Risata spaziale della Batcaverna
 *
 * Usa la Web Audio API per creare un effetto immersivo 3D:
 * - Playback rate rallentato (0.62–0.75×) → voce cupa e distorta
 * - StereoPannerNode randomico → la risata arriva da angoli diversi della caverna
 * - Doppio DelayNode → eco che rimbalza sulle pareti (riverbero simulato)
 * - BiquadFilter lowpass → la distanza smorza le alte frequenze
 * - Intervallo circa 60 secondi tra un episodio e l'altro
 */

import { useEffect, useRef } from "react";

interface JokerAudioManagerProps {
  isActive: boolean;
  isMuted: boolean;
  isPaused: boolean;
}

// Parametri audio cinematografici
const LAUGH_INTERVAL_MIN_MS = 55_000;  // 55 secondi
const LAUGH_INTERVAL_MAX_MS = 70_000;  // 70 secondi
const INITIAL_DELAY_MIN_MS  = 15_000;  // prima risata dopo 15s
const INITIAL_DELAY_MAX_MS  = 25_000;  // ...o 25s

const PLAYBACK_RATE_MIN = 0.62;  // rallentamento massimo — molto inquietante
const PLAYBACK_RATE_MAX = 0.75;  // rallentamento minimo

const VOLUME_MIN = 0.08;
const VOLUME_MAX = 0.28;

export default function JokerAudioManager({ isActive, isMuted, isPaused }: JokerAudioManagerProps) {
  const audioCtxRef    = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const nextTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadedRef    = useRef(false);
  const isMutedRef     = useRef(isMuted);
  const isPausedRef    = useRef(isPaused);

  useEffect(() => {
    isMutedRef.current = isMuted;
    isPausedRef.current = isPaused;
  }, [isMuted, isPaused]);

  // ── 1. Carica il buffer audio una sola volta ────────────────────────────────
  useEffect(() => {
    const loadBuffer = async () => {
      try {
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        const response = await fetch("./assets/audio/RisataJoker.wav");
        const arrayBuffer = await response.arrayBuffer();
        const decoded = await ctx.decodeAudioData(arrayBuffer);
        audioBufferRef.current = decoded;
        isLoadedRef.current = true;
      } catch (err) {
        console.warn("[JokerAudio] Impossibile caricare RisataJoker.wav", err);
      }
    };

    loadBuffer();

    return () => {
      if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
      // Non chiudiamo AudioContext per evitare ricreazioni costose
    };
  }, []);

  // ── 2. Riproduzione spaziale ────────────────────────────────────────────────
  const playSpatialized = () => {
    const ctx    = audioCtxRef.current;
    const buffer = audioBufferRef.current;

    if (!ctx || !buffer || !isLoadedRef.current) return;
    if (isMutedRef.current || isPausedRef.current || !isActive) return;

    // Risveglia AudioContext se sospeso dal browser (autoplay policy)
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    // ── Parametri casuali per ogni riproduzione ──────────────────────────────
    const playbackRate = PLAYBACK_RATE_MIN + Math.random() * (PLAYBACK_RATE_MAX - PLAYBACK_RATE_MIN);
    const volume       = VOLUME_MIN + Math.random() * (VOLUME_MAX - VOLUME_MIN);
    const panValue     = (Math.random() * 2 - 1) * 0.88; // -0.88 → +0.88

    // Lowpass: simula distanza e materiale roccioso della caverna
    const cutoffHz  = 700 + Math.random() * 1_400; // 700–2100 Hz
    // Eco 1: riflessione vicina (parete più prossima)
    const echo1Time = 0.30 + Math.random() * 0.25;  // 0.30–0.55s
    // Eco 2: riflessione lontana (fondo caverna)
    const echo2Time = 0.75 + Math.random() * 0.45;  // 0.75–1.20s

    // ── Grafo audio ──────────────────────────────────────────────────────────
    //
    //  source ──► filter ──► panner ──► gainMain ──► destination
    //                    │
    //                    ├──► delay1 ──► gainEcho1 ──► destination
    //                    │
    //                    └──► delay2 ──► gainEcho2 ──► destination
    //

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = playbackRate;

    // Lowpass filter — corpo cavernoso
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = cutoffHz;
    filter.Q.value = 0.8;

    // Panner stereo — posizione nella caverna
    const panner = ctx.createStereoPanner();
    panner.pan.value = panValue;

    // Volume principale
    const gainMain = ctx.createGain();
    gainMain.gain.value = volume;

    // Eco 1 — riflessione vicina, volume 40% del principale
    const delay1    = ctx.createDelay(2.0);
    delay1.delayTime.value = echo1Time;
    const gainEcho1 = ctx.createGain();
    gainEcho1.gain.value = volume * 0.38;

    // Panner eco 1 — leggermente opposto alla sorgente
    const pannerEcho1 = ctx.createStereoPanner();
    pannerEcho1.pan.value = panValue * -0.4; // riflessione dall'altra parte

    // Eco 2 — riflessione profonda, volume 18% del principale
    const delay2    = ctx.createDelay(2.0);
    delay2.delayTime.value = echo2Time;
    const gainEcho2 = ctx.createGain();
    gainEcho2.gain.value = volume * 0.18;

    // Panner eco 2 — ulteriore diffusione
    const pannerEcho2 = ctx.createStereoPanner();
    pannerEcho2.pan.value = panValue * -0.65;

    // Connessioni — sorgente
    source.connect(filter);
    filter.connect(panner);
    panner.connect(gainMain);
    gainMain.connect(ctx.destination);

    // Connessioni — eco 1
    filter.connect(delay1);
    delay1.connect(pannerEcho1);
    pannerEcho1.connect(gainEcho1);
    gainEcho1.connect(ctx.destination);

    // Connessioni — eco 2
    filter.connect(delay2);
    delay2.connect(pannerEcho2);
    pannerEcho2.connect(gainEcho2);
    gainEcho2.connect(ctx.destination);

    source.start();

    // Rilascio automatico nodi dopo la fine (evita memory leak)
    const duration = (buffer.duration / playbackRate) + echo2Time + 0.5;
    source.stop(ctx.currentTime + duration);
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      panner.disconnect();
      gainMain.disconnect();
      delay1.disconnect();
      pannerEcho1.disconnect();
      gainEcho1.disconnect();
      delay2.disconnect();
      pannerEcho2.disconnect();
      gainEcho2.disconnect();
    };
  };

  // ── 3. Scheduler temporale ──────────────────────────────────────────────────
  useEffect(() => {
    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
      nextTimerRef.current = null;
    }

    if (!isActive || isPaused) return;

    const schedule = (isFirst: boolean) => {
      const minMs = isFirst ? INITIAL_DELAY_MIN_MS : LAUGH_INTERVAL_MIN_MS;
      const maxMs = isFirst ? INITIAL_DELAY_MAX_MS : LAUGH_INTERVAL_MAX_MS;
      const delay = minMs + Math.random() * (maxMs - minMs);

      nextTimerRef.current = setTimeout(() => {
        playSpatialized();
        schedule(false);
      }, delay);
    };

    schedule(true);

    return () => {
      if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isPaused, isMuted]);

  return null;
}
