import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { EngineView } from '../components/three/EngineView';
import { ComponentInfoPanel } from '../components/three/ComponentInfoPanel';
import { Button } from '../components/ui/Button';
import { useEngineStore } from '../store/engineStore';
import { Expand, Minimize2, Layers, Thermometer, Flame } from 'lucide-react';

export function DigitalTwin() {
  const { isExploded, setExploded, selectedComponent } = useEngineStore();
  const [xray, setXray] = useState(false);
  const [heatmap, setHeatmap] = useState(false);

  return (
    <PageTransition>
      <div className="min-h-screen bg-space-black text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-bold text-gradient"
            >
              Digital Twin Engine
            </motion.h1>
            <p className="text-xs text-gray-500">Interactive 3D Turbojet Engine — Select any component for details</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant={heatmap ? 'primary' : 'ghost'} onClick={() => setHeatmap(!heatmap)}>
              <Thermometer size={14} />
              Heat Map
            </Button>
            <Button size="sm" variant={xray ? 'primary' : 'ghost'} onClick={() => setXray(!xray)}>
              <Layers size={14} />
              {xray ? 'Solid' : 'X-Ray'}
            </Button>
            <Button size="sm" variant={isExploded ? 'primary' : 'ghost'} onClick={() => setExploded(!isExploded)}>
              {isExploded ? <Minimize2 size={14} /> : <Expand size={14} />}
              {isExploded ? 'Assemble' : 'Exploded'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className={`${selectedComponent ? 'col-span-9' : 'col-span-12'} transition-all duration-500`}>
            <div className="glass rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
              <EngineView xray={xray} heatmap={heatmap} />
            </div>
          </div>

          {selectedComponent && (
            <div className="col-span-3">
              <ComponentInfoPanel />
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
