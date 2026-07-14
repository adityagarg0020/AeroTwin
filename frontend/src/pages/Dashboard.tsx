import { useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
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
import { AICopilotEnhanced } from '../components/ai/AICopilotEnhanced';
import { FleetGrid } from '../components/fleet/FleetGrid';
import { HealthTrendChart } from '../components/charts/HealthTrendChart';
import { HealthRadarChart } from '../components/charts/RadarChart';
import { ShapExplainer } from '../components/dashboard/ShapExplainer';
import { MissionReplay } from '../components/dashboard/MissionReplay';
import { DegradationPlayback } from '../components/dashboard/DegradationPlayback';
import { MaintenanceSchedule } from '../components/dashboard/MaintenanceSchedule';
import { useEngineStore } from '../store/engineStore';
import { predict } from '../api/client';
import { useDemoMode } from '../components/effects/DemoMode';
import { Gauge, Flame, Thermometer, Activity, Expand, Minimize2, Thermometer as HeatIcon, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function Dashboard() {
  const {
    engineInput, predictions, setPredictions, currentCycle,
    setCurrentCycle, isExploded, setExploded, addAlert,
    heatmapMode, setHeatmapMode, xrayMode, setXrayMode
  } = useEngineStore();
  const [demoMode, setDemoMode] = useState(false);
  const { startDemo, stopDemo } = useDemoMode();

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

  const handleDemo = () => {
    if (demoMode) { stopDemo(); setDemoMode(false); }
    else { setDemoMode(true); startDemo(); }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-space-black text-white p-4 space-y-4">
        <TopBar />

        <div className="flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-bold text-gradient"
          >
            Mission Control Center
          </motion.h1>
          <div className="flex items-center gap-2">
            <Button size="sm" variant={heatmapMode ? 'primary' : 'ghost'} onClick={() => setHeatmapMode(!heatmapMode)}>
              <HeatIcon size={14} />
              Heatmap
            </Button>
            <Button size="sm" variant={xrayMode ? 'primary' : 'ghost'} onClick={() => setXrayMode(!xrayMode)}>
              <Eye size={14} />
              X-Ray
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setExploded(!isExploded)}>
              {isExploded ? <Minimize2 size={14} /> : <Expand size={14} />}
              {isExploded ? 'Normal View' : 'Exploded View'}
            </Button>
            <Button size="sm" variant={demoMode ? 'danger' : 'primary'} onClick={handleDemo}>
              {demoMode ? 'Demo Active...' : 'Demo Mode'}
            </Button>
          </div>
        </div>

        {/* First Row: Health Cards + 3D Engine + Predictions */}
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
              <EngineView xray={xrayMode} heatmap={heatmapMode} />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-3 space-y-4">
            <PredictionsPanel />
            <FlightSimulator />
          </div>
        </div>

        {/* Second Row: Timeline, Radar, Trend, Root Cause */}
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

        {/* Third Row: SHAP, Mission Replay, Degradation Playback, Maintenance */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4">
            <ShapExplainer />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <MissionReplay />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <DegradationPlayback />
          </div>
        </div>

        {/* Fourth Row: Fleet + Maintenance Schedule */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8">
            <FleetGrid />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <MaintenanceSchedule />
          </div>
        </div>

        {/* Fifth Row: AI Copilot */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-12">
            <div style={{ height: '400px' }}>
              <AICopilotEnhanced />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
