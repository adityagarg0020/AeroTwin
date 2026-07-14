import { PageTransition } from '../components/layout/PageTransition';
import { FleetGrid } from '../components/fleet/FleetGrid';
import { HealthCard } from '../components/dashboard/HealthCard';
import { useEngineStore } from '../store/engineStore';
import { Gauge } from 'lucide-react';

export function FleetPage() {
  const { predictions, selectedEngineId } = useEngineStore();

  return (
    <PageTransition>
      <div className="min-h-screen bg-space-black text-white p-4">
        <h1 className="text-lg font-bold text-gradient-blue mb-4">Fleet Management</h1>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <FleetGrid />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <HealthCard title="Engine Health" value={predictions?.overallHealth ?? 0} icon={<Gauge size={14} />} />
          </div>
          <div className="col-span-12 lg:col-span-9 glass p-4 rounded-2xl">
            <p className="text-sm text-gray-400">
              Currently viewing Engine {selectedEngineId.toString().padStart(3, '0')}. Select an engine from the fleet grid above to switch.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
