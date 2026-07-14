import { useEffect, useRef, useCallback } from 'react';
import { useEngineStore } from '../../store/engineStore';
import { predict } from '../../api/client';

export function useDemoMode() {
  const {
    demoModeActive, setDemoModeActive, setCurrentCycle,
    setExploded, setSelectedComponent, engineInput, setEngineInput,
    setPredictions, isExploded
  } = useEngineStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef(0);

  const runDemo = useCallback(() => {
    if (!demoModeActive) return;

    const phase = phaseRef.current;
    const store = useEngineStore.getState();

    switch (phase) {
      case 0:
        store.setExploded(true);
        store.setSelectedComponent('intake');
        setTimeout(() => store.setSelectedComponent('compressor'), 1500);
        setTimeout(() => store.setSelectedComponent('combustor'), 3000);
        setTimeout(() => store.setSelectedComponent('turbine'), 4500);
        setTimeout(() => store.setSelectedComponent('nozzle'), 6000);
        setTimeout(() => { store.setExploded(false); store.setSelectedComponent(null); phaseRef.current = 1; }, 8000);
        break;

      case 1:
        store.setSelectedComponent('combustor');
        setTimeout(() => { store.setSelectedComponent(null); phaseRef.current = 2; }, 2000);
        break;

      case 2: {
        let cycle = 1;
        const demoInterval = setInterval(() => {
          cycle += 3;
          if (cycle > 300) {
            clearInterval(demoInterval);
            phaseRef.current = 3;
            return;
          }
          store.setCurrentCycle(cycle);
          store.setEngineInput({ Cycle: cycle });
          predict({ ...store.engineInput, Cycle: cycle })
            .then(res => store.setPredictions(res.predictions))
            .catch(() => {});
        }, 200);
        intervalRef.current = demoInterval;
        break;
      }

      case 3:
        setTimeout(() => {
          store.setEngineInput({ FuelFlow_kg_s: 2.5, RPM_rev_min: 85000, Mach: 1.1 });
          setTimeout(() => {
            store.setEngineInput({ FuelFlow_kg_s: 0.3, RPM_rev_min: 20000, Mach: 0.2 });
            setTimeout(() => {
              phaseRef.current = 4;
            }, 2000);
          }, 3000);
        }, 1000);
        break;

      case 4:
        store.setCurrentCycle(1);
        store.setExploded(false);
        store.setSelectedComponent(null);
        setDemoModeActive(false);
        phaseRef.current = 0;
        break;
    }
  }, [demoModeActive, setDemoModeActive]);

  useEffect(() => {
    if (demoModeActive) {
      phaseRef.current = 0;
      runDemo();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [demoModeActive, runDemo]);

  const startDemo = useCallback(() => {
    phaseRef.current = 0;
    setDemoModeActive(true);
  }, [setDemoModeActive]);

  const stopDemo = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDemoModeActive(false);
    phaseRef.current = 0;
  }, [setDemoModeActive]);

  return { startDemo, stopDemo, isActive: demoModeActive };
}
