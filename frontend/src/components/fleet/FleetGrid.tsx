import { useEngineStore } from '../../store/engineStore';
import { getHealthColor, getHealthLevel } from '../../utils/colors';
import { Badge } from '../ui/Badge';
import type { FleetEngine } from '../../types';

const demoFleet: FleetEngine[] = [
  { id: 1, name: 'Engine 001', health: 0.92, cycles: 120, status: 'active', risk: 'low' },
  { id: 2, name: 'Engine 002', health: 0.85, cycles: 180, status: 'active', risk: 'low' },
  { id: 3, name: 'Engine 003', health: 0.73, cycles: 210, status: 'active', risk: 'medium' },
  { id: 4, name: 'Engine 004', health: 0.61, cycles: 260, status: 'standby', risk: 'medium' },
  { id: 5, name: 'Engine 005', health: 0.88, cycles: 95, status: 'active', risk: 'low' },
  { id: 6, name: 'Engine 006', health: 0.76, cycles: 150, status: 'active', risk: 'low' },
  { id: 7, name: 'Engine 007', health: 0.54, cycles: 275, status: 'standby', risk: 'high' },
  { id: 8, name: 'Engine 008', health: 0.91, cycles: 45, status: 'active', risk: 'low' },
  { id: 9, name: 'Engine 009', health: 0.68, cycles: 195, status: 'maintenance', risk: 'medium' },
  { id: 10, name: 'Engine 010', health: 0.44, cycles: 290, status: 'maintenance', risk: 'high' },
];

export function FleetGrid() {
  const { selectedEngineId, setSelectedEngineId } = useEngineStore();

  return (
    <div className="glass p-3.5 rounded-2xl relative">
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-br" />
      <div className="flex items-center gap-2 mb-2.5">
        <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">Fleet Overview</h3>
        <span className="text-[9px] font-mono-jb text-gray-600">({demoFleet.length} ACFT)</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {demoFleet.map((engine) => (
          <button
            key={engine.id}
            onClick={() => setSelectedEngineId(engine.id)}
            className={`p-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
              selectedEngineId === engine.id
                ? 'bg-primary/15 border border-primary/30 shadow-sm shadow-primary/10'
                : 'bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono-jb font-semibold text-white">{engine.name}</span>
              <Badge variant={getHealthLevel(engine.health)}>
                {(engine.health * 100).toFixed(0)}
              </Badge>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${engine.health * 100}%`, backgroundColor: getHealthColor(engine.health) }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[8px] font-mono-jb text-gray-600 tabular-nums">{engine.cycles}cyc</span>
              <span className="text-[8px] font-mono-jb text-gray-600 uppercase">{engine.status}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
