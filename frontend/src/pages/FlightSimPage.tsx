import { useEffect, useCallback } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { FlightSimulator } from '../components/flight/FlightSimulator';
import { PredictionsPanel } from '../components/dashboard/PredictionsPanel';
import { TopBar } from '../components/dashboard/TopBar';
import { EngineView } from '../components/three/EngineView';
import { useEngineStore } from '../store/engineStore';
import { predict } from '../api/client';

export function FlightSimPage() {
  const { engineInput, setPredictions } = useEngineStore();

  const loadPrediction = useCallback(async () => {
    try {
      const res = await predict(engineInput);
      setPredictions(res.predictions);
    } catch (e) {
      console.error('Initial prediction failed:', e);
    }
  }, [engineInput, setPredictions]);

  useEffect(() => {
    loadPrediction();
  }, [loadPrediction]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-space-black text-white p-4 space-y-4">
        <TopBar />
        <h1 className="text-lg font-bold text-gradient-blue">Flight Simulator</h1>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4">
            <FlightSimulator />
          </div>
          <div className="col-span-12 lg:col-span-5">
            <div className="glass rounded-2xl overflow-hidden" style={{ height: '400px' }}>
              <EngineView />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <PredictionsPanel />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
