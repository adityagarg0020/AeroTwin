import { PageTransition } from '../components/layout/PageTransition';
import { Badge } from '../components/ui/Badge';
import { useEngineStore } from '../store/engineStore';
import { Wrench, Clock, CheckCircle, Activity } from 'lucide-react';

export function Maintenance() {
  const { predictions, currentCycle } = useEngineStore();

  const maintenanceItems = [
    {
      component: 'Compressor',
      dueIn: Math.round(30 - currentCycle * 0.1),
      action: 'Compressor wash & blade inspection',
      priority: predictions && predictions.compressorHealth < 0.7 ? 'high' as const : 'low' as const,
      recovery: '+12% efficiency',
    },
    {
      component: 'Combustor',
      dueIn: Math.round(50 - currentCycle * 0.08),
      action: 'Fuel nozzle cleaning & inspection',
      priority: predictions && predictions.combustorHealth < 0.7 ? 'high' as const : 'medium' as const,
      recovery: '+8% efficiency',
    },
    {
      component: 'Turbine',
      dueIn: Math.round(40 - currentCycle * 0.09),
      action: 'Turbine blade borescope inspection',
      priority: predictions && predictions.turbineHealth < 0.7 ? 'high' as const : 'medium' as const,
      recovery: '+15% efficiency',
    },
    {
      component: 'Overall',
      dueIn: Math.round(25 - currentCycle * 0.12),
      action: 'Full engine performance restoration',
      priority: predictions && predictions.overallHealth < 0.7 ? 'critical' as const : 'medium' as const,
      recovery: '+10% efficiency',
    },
  ];

  const getBadgeVariant = (priority: string) => {
    if (priority === 'critical') return 'critical' as const;
    if (priority === 'high') return 'warning' as const;
    return 'healthy' as const;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-space-black text-white p-4">
        <h1 className="text-lg font-bold font-orbitron tracking-wider mb-4 text-gradient-blue">Predictive Maintenance</h1>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8 space-y-3">
            {maintenanceItems.map((item) => (
              <div key={item.component} className="glass p-3.5 rounded-2xl flex items-center justify-between relative">
                <div className="hud-corner hud-corner-tl" />
                <div className="hud-corner hud-corner-br" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <Wrench size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-orbitron font-semibold text-white tracking-wider">{item.component}</h3>
                    <p className="text-[9px] font-mono-jb text-gray-400">{item.action}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[9px] font-mono-jb">
                      <Clock size={10} className="text-gray-500" />
                      <span className="text-gray-400 tabular-nums">{item.dueIn > 0 ? `${item.dueIn} cyc` : 'OVERDUE'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-mono-jb mt-0.5">
                      <CheckCircle size={10} className="text-green" />
                      <span className="text-green">{item.recovery}</span>
                    </div>
                  </div>
                  <Badge variant={getBadgeVariant(item.priority)}>
                    {item.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="glass p-4 rounded-2xl relative">
              <div className="hud-corner hud-corner-tl" />
              <div className="hud-corner hud-corner-br" />
              <div className="flex items-center gap-2 mb-3">
                <Activity size={12} className="text-primary/70" />
                <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">RUL Estimate</h3>
              </div>
              <div className="text-center py-5">
                <div className="text-4xl font-black font-mono-jb text-primary tabular-nums">
                  {predictions ? Math.max(0, 300 - currentCycle) : '---'}
                </div>
                <p className="text-[9px] font-orbitron text-gray-600 tracking-wider mt-1 uppercase">Remaining Cycles</p>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(Math.max(0, 300 - currentCycle) / 300) * 100}%`,
                    background: `linear-gradient(90deg, #EF4444, #F97316, #FACC15, #22C55E)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
