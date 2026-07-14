export interface EngineInput {
  EngineID: number;
  Cycle: number;
  Altitude_m: number;
  Mach: number;
  Tamb_K: number;
  Pamb_Pa: number;
  RPM_rev_min: number;
  FuelFlow_kg_s: number;
  P2_Pa: number;
  T2_K: number;
  P3_Pa: number;
  T3_K: number;
  P4_Pa: number;
  T4_K: number;
}

export interface PredictionResult {
  compressorHealth: number;
  combustorHealth: number;
  turbineHealth: number;
  overallHealth: number;
  thrust: number;
  tsfc: number;
}

export interface ModelMetadata {
  testR2: number;
  testMAE: number;
}

export interface PredictionResponse {
  predictions: PredictionResult;
  metadata: Record<string, ModelMetadata>;
  input: EngineInput;
}

export interface EngineHistoryRecord extends EngineInput {
  CompressorHealth?: number;
  CombustorHealth?: number;
  TurbineHealth?: number;
  OverallHealth?: number;
  Thrust_N?: number;
  TSFC_g_N_s?: number;
}

export interface HealthStatus {
  compressorHealth: number;
  combustorHealth: number;
  turbineHealth: number;
  overallHealth: number;
  thrust: number;
  tsfc: number;
}

export type HealthLevel = 'healthy' | 'moderate' | 'warning' | 'critical';

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: number;
  component?: string;
}

export interface FleetEngine {
  id: number;
  name: string;
  health: number;
  cycles: number;
  status: 'active' | 'standby' | 'maintenance';
  risk: 'low' | 'medium' | 'high';
}

export interface AIAnalysis {
  summary: string;
  causes: string[];
  confidence: number;
  recommendation: string;
  component: string;
}

export interface ShapFeature {
  name: string;
  value: number;
  contribution: number;
  positive: boolean;
}

export interface ShapExplanation {
  features: ShapFeature[];
  baseValue: number;
  prediction: number;
  confidence: number;
}

export interface MissionPhase {
  name: string;
  startCycle: number;
  endCycle: number;
  altitude: number;
  mach: number;
  throttle: number;
}

export interface DegradationStage {
  cycle: number;
  label: string;
  health: number;
  description: string;
}

export interface MaintenanceRecommendation {
  id: string;
  component: string;
  action: string;
  dueIn: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedDowntime: string;
  estimatedCost: string;
  recommendedParts: string[];
  technicianNotes: string;
  recoveryEfficiency: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  mae: number;
  rmse: number;
  inferenceTime: number;
  trainingTime: number;
  rocAuc?: number;
}

export interface ComponentHealth {
  name: string;
  health: number;
  temperature: number;
  pressure: number;
  rpm: number;
  vibration: number;
  efficiency: number;
  remainingLife: number;
  failureProbability: number;
  degradation: number;
  maintenanceRecommendation: string;
  historicalTrend: number[];
}
