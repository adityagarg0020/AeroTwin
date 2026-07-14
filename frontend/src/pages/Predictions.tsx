import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { HealthCard } from '../components/dashboard/HealthCard';
import { PredictionsPanel } from '../components/dashboard/PredictionsPanel';
import { RootCauseAnalysis } from '../components/ai/RootCauseAnalysis';
import { HealthRadarChart } from '../components/charts/RadarChart';
import { ShapExplainer } from '../components/dashboard/ShapExplainer';
import { useEngineStore } from '../store/engineStore';
import { Gauge, Flame, Thermometer, Activity, Brain } from 'lucide-react';

export function Predictions() {
  const { predictions } = useEngineStore();

  const radarData = predictions ? [
    { component: 'Compressor', value: predictions.compressorHealth, fullMark: 1 },
    { component: 'Combustor', value: predictions.combustorHealth, fullMark: 1 },
    { component: 'Turbine', value: predictions.turbineHealth, fullMark: 1 },
    { component: 'Overall', value: predictions.overallHealth, fullMark: 1 },
  ] : [];

  return (
    <PageTransition>
      <div className="min-h-screen bg-space-black text-white p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Brain size={20} className="text-primary" />
          <div>
            <h1 className="text-lg font-bold text-gradient">AI Predictions</h1>
            <p className="text-[10px] text-gray-500 font-mono-jb">Multi-Model Ensemble Prediction with Explainable AI</p>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-4 gap-3 mb-4">
              <HealthCard title="Compressor" value={predictions?.compressorHealth ?? 0} icon={<Activity size={14} />} />
              <HealthCard title="Combustor" value={predictions?.combustorHealth ?? 0} icon={<Flame size={14} />} />
              <HealthCard title="Turbine" value={predictions?.turbineHealth ?? 0} icon={<Thermometer size={14} />} />
              <HealthCard title="Overall" value={predictions?.overallHealth ?? 0} icon={<Gauge size={14} />} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <HealthRadarChart data={radarData} />
              <RootCauseAnalysis />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <PredictionsPanel />
            <ShapExplainer />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
