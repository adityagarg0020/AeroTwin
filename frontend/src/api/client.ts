import type { EngineInput, PredictionResponse, EngineHistoryRecord } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function fetchHealth() {
  return request<{ status: string; modelsLoaded: number; name: string }>('/health');
}

export async function fetchModels() {
  return request<{ models: Array<{ id: string; target: string; testR2: number }>; count: number }>('/models');
}

export async function predict(input: EngineInput): Promise<PredictionResponse> {
  return request<PredictionResponse>('/predict', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function simulate(input: EngineInput): Promise<PredictionResponse> {
  return request<PredictionResponse>('/predict/simulate', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function fetchEngineHistory(engineId: number, startCycle = 1, endCycle = 300) {
  return request<{ engineId: number; records: EngineHistoryRecord[]; count: number }>(
    `/history/${engineId}?start_cycle=${startCycle}&end_cycle=${endCycle}`
  );
}

export async function fetchCycleRange(engineId: number, cycle: number) {
  return request<{ engineId: number; cycle: number; data: EngineHistoryRecord }>(
    `/history/range?engine_id=${engineId}&cycle=${cycle}`
  );
}

export async function fetchPrediction(engineId: number, cycle: number) {
  return request<{ engineId: number; cycle: number; predicted: PredictionResponse; actual: any }>(
    `/history/predict/${engineId}?cycle=${cycle}`
  );
}
