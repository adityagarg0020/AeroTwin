import type { HealthLevel } from '../types';

export function getHealthColor(value: number): string {
  if (value >= 0.85) return '#22C55E';
  if (value >= 0.7) return '#FACC15';
  if (value >= 0.5) return '#F97316';
  return '#EF4444';
}

export function getHealthGlow(value: number): string {
  if (value >= 0.85) return 'glow-green';
  if (value >= 0.7) return 'glow-yellow';
  if (value >= 0.5) return 'glow-orange';
  return 'glow-red';
}

export function getHealthLevel(value: number): HealthLevel {
  if (value >= 0.85) return 'healthy';
  if (value >= 0.7) return 'moderate';
  if (value >= 0.5) return 'warning';
  return 'critical';
}

export function getStatusText(value: number): string {
  if (value >= 0.85) return 'Healthy';
  if (value >= 0.7) return 'Moderate';
  if (value >= 0.5) return 'Warning';
  return 'Critical';
}

export function getEngineGlowColor(value: number): string {
  if (value >= 0.85) return '#3B82F6';
  if (value >= 0.7) return '#FACC15';
  if (value >= 0.5) return '#F97316';
  return '#EF4444';
}
