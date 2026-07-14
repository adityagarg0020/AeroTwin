import { create } from 'zustand';
import type { PredictionResult, EngineInput, Alert, HealthStatus } from '../types';

interface EngineState {
  selectedEngineId: number;
  currentCycle: number;
  engineInput: EngineInput;
  predictions: PredictionResult | null;
  alerts: Alert[];
  engineHistory: EngineInput[];
  isPlaying: boolean;
  playbackSpeed: number;
  isExploded: boolean;
  selectedComponent: string | null;
  healthStatus: HealthStatus | null;

  setSelectedEngineId: (id: number) => void;
  setCurrentCycle: (cycle: number) => void;
  setEngineInput: (input: Partial<EngineInput>) => void;
  setPredictions: (pred: PredictionResult) => void;
  addAlert: (alert: Alert) => void;
  clearAlerts: () => void;
  setEngineHistory: (history: EngineInput[]) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setExploded: (exploded: boolean) => void;
  setSelectedComponent: (component: string | null) => void;
  setHealthStatus: (status: HealthStatus) => void;
}

const defaultEngineInput: EngineInput = {
  EngineID: 1, Cycle: 1, Altitude_m: 5000, Mach: 0.5,
  Tamb_K: 260, Pamb_Pa: 50000, RPM_rev_min: 50000,
  FuelFlow_kg_s: 0.8, P2_Pa: 150000, T2_K: 350,
  P3_Pa: 350000, T3_K: 900, P4_Pa: 120000, T4_K: 800
};

export const useEngineStore = create<EngineState>((set) => ({
  selectedEngineId: 1,
  currentCycle: 1,
  engineInput: defaultEngineInput,
  predictions: null,
  alerts: [],
  engineHistory: [],
  isPlaying: false,
  playbackSpeed: 1,
  isExploded: false,
  selectedComponent: null,
  healthStatus: null,

  setSelectedEngineId: (id) => set({ selectedEngineId: id }),
  setCurrentCycle: (cycle) => set((state) => ({
    currentCycle: cycle,
    engineInput: { ...state.engineInput, Cycle: cycle }
  })),
  setEngineInput: (input) => set((state) => ({
    engineInput: { ...state.engineInput, ...input }
  })),
  setPredictions: (pred) => set({ predictions: pred }),
  addAlert: (alert) => set((state) => ({
    alerts: [alert, ...state.alerts].slice(0, 50)
  })),
  clearAlerts: () => set({ alerts: [] }),
  setEngineHistory: (history) => set({ engineHistory: history }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setExploded: (exploded) => set({ isExploded: exploded }),
  setSelectedComponent: (component) => set({ selectedComponent: component }),
  setHealthStatus: (status) => set({ healthStatus: status }),
}));
