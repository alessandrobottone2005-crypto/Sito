# AUDIO SYSTEM
### Sound Design & Implementation — The Dark Knight Experience

---

## Overview

The audio system consists of two entirely independent subsystems operating in parallel:

| System | Component | Technology | File |
|---|---|---|---|
| Background Music | `App.tsx` (ref) | `HTMLAudioElement` | `SiglaBatman.wav` |
| Joker Spatial Laugh | `JokerAudioManager` | Web Audio API | `RisataJoker.wav` |

These systems are intentionally decoupled. The background music is managed by the root App component (it must survive all phase transitions), while the Joker laugh system lives in a dedicated component that can be mounted/unmounted per phase without affecting music playback.

---

## Background Music — `SiglaBatman.wav`

### Initialisation

```typescript
// In App.tsx, runs once on mount
const audio = new Audio("/assets/audio/SiglaBatman.wav");
audio.loop = true;
audio.volume = 0.4;
audio.muted = isMuted;
audioRef.current = audio;
```

The audio element is stored in a `useRef` — not in state — so it survives re-renders without restarting playback.

### Autoplay Strategy

Modern browsers block autoplay until a user gesture has occurred. The system uses a two-stage approach:

```typescript
const tryPlay = () => {
  audio.play().catch(() => {
    // If autoplay blocked, attach a one-time click listener
    const unlock = () => {
      audio.play().catch(() => {});
      window.removeEventListener("click", unlock);
    };
    window.addEventListener("click", unlock);
  });
};
```

The music begins as soon as the browser permits. For most visitors, the first interaction is the IntroScreen itself, so the track starts playing before the mission begins.

### Seek on Mission Start

When the player transitions from `intro` to `batcomputer`, the track is seeked forward:

```typescript
audioRef.current.currentTime = 20;
audioRef.current.volume = 0.4;
audioRef.current.play();
```

This skips past any ambient opening and drops the player into a more active section of the track — appropriate for the tension of the gamification phase.

### Fade Out on Mission Success

When the player completes all 5 riddles and transitions to `breather`, the music fades out over ~1.5 seconds:

```typescript
const fadeOut = setInterval(() => {
  currentVol = Math.max(0, currentVol - 0.05);
  if (audioRef.current) audioRef.current.volume = currentVol;
  if (currentVol <= 0) {
    clearInterval(fadeOut);
    audioRef.current?.pause();
    audioRef.current.volume = 0.4; // Reset for next use
  }
}, 80); // ~80ms per step = ~1.5s fade
```

### Fade In on Reveal

After the breather pause, as the `reveal` phase begins, the music fades back in from near-silence:

```typescript
audioRef.current.currentTime = 0; // Restart from beginning — more heroic
audioRef.current.volume = 0.05;
audioRef.current.play();

const fadeIn = setInterval(() => {
  currentVol = Math.min(0.4, currentVol + 0.05);
  if (audioRef.current) audioRef.current.volume = currentVol;
  if (currentVol >= 0.4) clearInterval(fadeIn);
}, 100);
```

Restarting from position 0 gives the reveal a fresh, triumphant quality — the beginning of the track typically has more emotional weight than the looping middle section.

### Mute Toggle

```typescript
useEffect(() => {
  if (audioRef.current) audioRef.current.muted = isMuted;
}, [isMuted]);
```

Muting is applied directly to the `HTMLAudioElement.muted` property — the track continues playing but produces no sound. This ensures instant unmute without seek position loss.

### Cleanup

```typescript
return () => { audio.pause(); audio.src = ""; };
```

Setting `audio.src = ""` releases the media resource held by the browser, preventing memory leaks.

---

## Joker Spatial Audio — `RisataJoker.wav`

### Architecture

The Joker laugh system uses the Web Audio API for precise spatial control. It is implemented as a renderless React component (`JokerAudioManager`) that mounts globally and returns `null`.

### Node Graph

```
AudioBuffer (decoded WAV)
    │
    ▼
BufferSourceNode (new instance per laugh)
    │
    ▼
StereoPannerNode   ← pan: random -0.8 to +0.8
    │
    ▼
GainNode           ← gain: random 0.05 to 0.4
    │
    ▼
AudioContext.destination
```

A fresh node chain is created for every laugh instance. This ensures:
- No audio artefacts from re-using nodes
- Independent volume and pan per laugh
- Proper garbage collection after each playback

### Initialisation

```typescript
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
audioContextRef.current = new AudioContextClass();

const response = await fetch("/assets/audio/RisataJoker.wav");
const arrayBuffer = await response.arrayBuffer();
audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
```

The WAV file is decoded once into an `AudioBuffer` on mount. Subsequent laughs reuse this buffer — there is no re-download or re-decode cost per playback.

### Scheduling Logic

```typescript
// First laugh: 2–5 seconds after becoming active
const initialDelay = 2000 + Math.random() * 3000;

// Subsequent laughs: 4–12 seconds between instances
const delay = 4000 + Math.random() * 8000;
```

The schedule is recursive: each laugh, when it completes, schedules the next. The system is self-sustaining while `isActive && !isPaused`.

### Spatial Parameters

| Parameter | Range | Effect |
|---|---|---|
| `StereoPannerNode.pan` | -0.8 to +0.8 | Left-right positioning in stereo field |
| `GainNode.gain` | 0.05 to 0.4 | Volume variation (distance simulation) |

The combination of random pan and random volume creates the perceptual illusion that the Joker is **moving through the space** — sometimes close (high volume), sometimes distant (low volume), sometimes to the left, sometimes to the right.

### State-Based Activation

```typescript
// isActive is computed in App.tsx:
const isJokerActive =
  ["batcomputer", "transition1", "armeria", "transition2", "batmobile"].includes(phase)
  && missionStatus === "active";
```

The Joker laugh is silenced immediately when:
- The player succeeds (`missionStatus !== "active"`)
- The player fails (`missionStatus === "failed"`)
- The experience moves past the gamification phases
- The user mutes audio (`isMuted`)
- The game is paused (`isPaused`)

### Browser Context Suspension

Browsers may suspend the `AudioContext` after a period of inactivity. Before each playback:

```typescript
if (audioContextRef.current.state === "suspended") {
  audioContextRef.current.resume();
}
```

### Cleanup

```typescript
return () => {
  clearTimeout(nextLaughTimeoutRef.current);
  audioContextRef.current?.close();
};
```

`AudioContext.close()` terminates all audio processing and releases hardware resources. This runs when the component unmounts.

---

## Pause/Resume Behaviour

| State | Background Music | Joker Laugh |
|---|---|---|
| `isPaused = false` | Playing | Scheduled |
| `isPaused = true` | Playing (not paused) | Scheduling stopped |
| `isMuted = true` | Muted (still playing) | Blocked at `playLaugh()` guard |
| Phase = `reveal` | Fading in | Inactive (not in active set) |
| Phase = `checkout` | Not playing | Inactive |

Note: Background music is **not paused** when `isPaused = true` — only the timer and Joker audio pause. This is intentional: ambient music during the pause screen maintains atmosphere without gameplay pressure.

---

## Audio File Reference

| File | Format | Duration | Usage |
|---|---|---|---|
| `SiglaBatman.wav` | WAV | ~3–5 min (looped) | Background theme throughout experience |
| `RisataJoker.wav` | WAV | ~2–4 seconds | Joker laugh, spatially played 1–N times |
