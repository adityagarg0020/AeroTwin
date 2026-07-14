import { useCallback, useRef } from 'react';
import { useEngineStore } from '../store/engineStore';

type SoundType = 'startup' | 'idle' | 'throttle' | 'alert' | 'click' | 'shutdown' | 'hover';

const audioCtxRef: { current: AudioContext | null } = { current: null };

function getAudioContext(): AudioContext {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new AudioContext();
  }
  return audioCtxRef.current;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', gain = 0.1) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(gain, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

function playNoise(duration: number, gain = 0.05) {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.max(0, 1 - i / bufferSize);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(gain, ctx.currentTime);
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start();
  } catch {}
}

const soundGenerators: Record<SoundType, () => void> = {
  startup: () => {
    playTone(200, 0.3, 'sawtooth', 0.08);
    setTimeout(() => playTone(400, 0.3, 'sawtooth', 0.08), 200);
    setTimeout(() => playTone(800, 0.5, 'sawtooth', 0.08), 400);
    playNoise(0.8, 0.03);
  },
  idle: () => {
    playTone(100, 0.5, 'sine', 0.03);
    playNoise(0.5, 0.02);
  },
  throttle: () => {
    playTone(300 + Math.random() * 200, 0.2, 'sawtooth', 0.06);
    playNoise(0.2, 0.04);
  },
  alert: () => {
    playTone(880, 0.15, 'square', 0.1);
    setTimeout(() => playTone(880, 0.15, 'square', 0.1), 200);
    setTimeout(() => playTone(880, 0.15, 'square', 0.1), 400);
  },
  click: () => {
    playTone(1000, 0.05, 'sine', 0.05);
  },
  shutdown: () => {
    playTone(400, 0.2, 'sawtooth', 0.08);
    setTimeout(() => playTone(200, 0.3, 'sawtooth', 0.08), 200);
    setTimeout(() => playTone(100, 0.5, 'sawtooth', 0.05), 400);
  },
  hover: () => {
    playTone(1500, 0.03, 'sine', 0.02);
  },
};

export function useSound() {
  const { soundEnabled } = useEngineStore();

  const play = useCallback((type: SoundType) => {
    if (!soundEnabled) return;
    soundGenerators[type]();
  }, [soundEnabled]);

  return { play };
}
