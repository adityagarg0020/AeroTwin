import { useEffect, useCallback, useState } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { TopBar } from '../components/dashboard/TopBar';
import { HealthCard } from '../components/dashboard/HealthCard';
import { TelemetryPanel } from '../components/dashboard/TelemetryPanel';
import { PredictionsPanel } from '../components/dashboard/PredictionsPanel';
import { AlertCenter } from '../components/dashboard/AlertCenter';
import { DegradationTimeline } from '../components/dashboard/DegradationTimeline';
import { EngineView } from '../components/three/EngineView';
import { FlightSimulator } from '../components/flight/FlightSimulator';
import { RootCauseAnalysis } from '../components/ai/RootCauseAnalysis';
import { AICopilot } from '../components/ai/AICopilot';
import { FleetGrid } from '../components/fleet/FleetGrid';
import { HealthTrendChart } from '../components/charts/HealthTrendChart';
import { HealthRadarChart } from '../components/charts/RadarChart';
import { useEngineStore } from '../store/engineStore';
import { predict } from '../api/client';
import { Gauge, Flame, Thermometer, Activity, Expand, Minimize2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function Dashboard() {
  const {
    engineInput, predictions, setPredictions, currentCycle,
    setCurrentCycle, isExploded, setExploded, addAlert
  } = useEngineStore();
  const [demoMode, setDemoMode] = useState(false);

  const loadPrediction = useCallback(async () => {
    try {
      const res = await predict(engineInput);
      setPredictions(res.predictions);
      const oh = res.predictions.overallHealth;
      if (oh < 0.5) {
        addAlert({ id: Date.now().toString(), type: 'critical' as const, message: 'Critical engine health detected! Immediate action required.', timestamp: Date.now() });
      } else if (oh < 0.7) {
        addAlert({ id: Date.now().toString(), type: 'warning' as const, message: 'Engine health degrading. Schedule maintenance.', timestamp: Date.now() });
      }
    } catch {}
  }, [engineInput, setPredictions, addAlert]);

  useEffect(() => {
    loadPrediction();
    const interval = setInterval(loadPrediction, 3000);
    return () => clearInterval(interval);
  }, [loadPrediction]);

  const chartData = Array.from({ length: currentCycle }, (_, i) => ({
    cycle: i + 1,
    value: 1 - (i / 300) * 0.5 + Math.random() * 0.02
  }));

  const radarData = predictions ? [
    { component: 'Compressor', value: predictions.compressorHealth, fullMark: 1 },
    { component: 'Combustor', value: predictions.combustorHealth, fullMark: 1 },
    { component: 'Turbine', value: predictions.turbineHealth, fullMark: 1 },
    { component: 'Overall', value: predictions.overallHealth, fullMark: 1 },
  ] : [];

  const startDemo = () => {
    setDemoMode(true);
    setCurrentCycle(1);
    loadPrediction();
    const interval = setInterval(() => {
      const store = useEngineStore.getState();
      if (store.currentCycle >= 300) {
        clearInterval(interval);
        setDemoMode(false);
        return;
      }
      store.setCurrentCycle(store.currentCycle + 1);
      store.setEngineInput({ Cycle: store.currentCycle + 1 });
      predict({ ...store.engineInput, Cycle: store.currentCycle + 1 })
        .then((res) => store.setPredictions(res.predictions))
        .catch(() => {});
    }, 100);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-space-black text-white p-4 space-y-4">
        <TopBar />

        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gradient-blue">Mission Control</h1>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setExploded(!isExploded)}>
              {isExploded ? <Minimize2 size={14} /> : <Expand size={14} />}
              {isExploded ? 'Normal View' : 'Exploded View'}
            </Button>
            <Button size="sm" variant={demoMode ? 'danger' : 'primary'} onClick={startDemo}>
              {demoMode ? 'Demo Active...' : 'Start Demo'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <HealthCard title="Compressor" value={predictions?.compressorHealth ?? 0} trend={-0.3} icon={<Activity size={14} />} />
              <HealthCard title="Combustor" value={predictions?.combustorHealth ?? 0} trend={-0.2} icon={<Flame size={14} />} />
              <HealthCard title="Turbine" value={predictions?.turbineHealth ?? 0} trend={-0.4} icon={<Thermometer size={14} />} />
              <HealthCard title="Overall" value={predictions?.overallHealth ?? 0} trend={-0.3} icon={<Gauge size={14} />} />
            </div>
            <TelemetryPanel />
            <AlertCenter />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="glass rounded-2xl overflow-hidden" style={{ height: '550px' }}>
              <EngineView />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-3 space-y-4">
            <PredictionsPanel />
            <FlightSimulator />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-3">
            <DegradationTimeline />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <HealthRadarChart data={radarData} />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <HealthTrendChart data={chartData} color="#3B82F6" title="Health Trend" />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <RootCauseAnalysis />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8">
            <FleetGrid />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <AICopilot minimized />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
