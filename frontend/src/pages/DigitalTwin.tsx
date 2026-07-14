import { useState } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { EngineView } from '../components/three/EngineView';
import { Button } from '../components/ui/Button';
import { useEngineStore } from '../store/engineStore';
import { Expand, Minimize2, Layers } from 'lucide-react';

export function DigitalTwin() {
  const { isExploded, setExploded } = useEngineStore();
  const [xray, setXray] = useState(false);

  return (
    <PageTransition>
      <div className="min-h-screen bg-space-black text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-gradient-blue">Digital Twin</h1>
            <p className="text-xs text-gray-500">Interactive 3D Turbojet Engine</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setExploded(!isExploded)}>
              {isExploded ? <Minimize2 size={14} /> : <Expand size={14} />}
              {isExploded ? 'Assemble' : 'Exploded View'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setXray(!xray)}>
              <Layers size={14} />
              {xray ? 'Solid' : 'X-Ray'}
            </Button>
          </div>
        </div>
        <div className="glass rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
          <EngineView xray={xray} />
        </div>
      </div>
    </PageTransition>
  );
}
