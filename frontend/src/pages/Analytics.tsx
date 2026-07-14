import { PageTransition } from '../components/layout/PageTransition';
import { HealthTrendChart } from '../components/charts/HealthTrendChart';
import { HealthRadarChart } from '../components/charts/RadarChart';
import { useEngineStore } from '../store/engineStore';

export function Analytics() {
  const { currentCycle, predictions } = useEngineStore();

  const healthData = Array.from({ length: currentCycle }, (_, i) => ({
    cycle: i + 1, value: Math.max(0.1, 1 - (i / 300) * 0.7 + Math.sin(i * 0.3) * 0.03)
  }));

  const tempData = Array.from({ length: currentCycle }, (_, i) => ({
    cycle: i + 1, value: 900 - i * 0.3 + Math.sin(i * 0.5) * 15
  }));

  const pressureData = Array.from({ length: currentCycle }, (_, i) => ({
    cycle: i + 1, value: 350000 - i * 150 + Math.sin(i * 0.4) * 5000
  }));

  const thrustData = Array.from({ length: currentCycle }, (_, i) => ({
    cycle: i + 1, value: Math.max(10000, 52000 - i * 80 + Math.sin(i * 0.2) * 2000)
  }));

  const radarData = predictions ? [
    { component: 'Compressor', value: predictions.compressorHealth, fullMark: 1 },
    { component: 'Combustor', value: predictions.combustorHealth, fullMark: 1 },
    { component: 'Turbine', value: predictions.turbineHealth, fullMark: 1 },
    { component: 'Overall', value: predictions.overallHealth, fullMark: 1 },
  ] : [];

  return (
    <PageTransition>
      <div className="min-h-screen bg-space-black text-white p-4">
        <h1 className="text-lg font-bold text-gradient-blue mb-4">Analytics</h1>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4">
            <HealthTrendChart data={healthData} color="#22C55E" title="Health Trend" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <HealthTrendChart data={tempData} color="#F97316" title="Temperature Trend" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <HealthTrendChart data={pressureData} color="#3B82F6" title="Pressure Trend" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <HealthTrendChart data={thrustData} color="#7C3AED" title="Thrust Trend" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <HealthRadarChart data={radarData} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
