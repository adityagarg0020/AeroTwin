import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { Badge } from '../components/ui/Badge';
import { MaintenanceSchedule } from '../components/dashboard/MaintenanceSchedule';
import { useEngineStore } from '../store/engineStore';
import { Wrench, Clock, CheckCircle, Activity, AlertTriangle, DollarSign, FileText, History } from 'lucide-react';

function getBadgeVariant(priority: string) {
  if (priority === 'critical') return 'critical' as const;
  if (priority === 'high') return 'warning' as const;
  return 'healthy' as const;
}

export function Maintenance() {
  const { predictions, currentCycle } = useEngineStore();
  const health = predictions?.overallHealth ?? 1;

  const maintenanceItems = [
    {
      component: 'Compressor',
      dueIn: Math.round(30 - currentCycle * 0.1),
      action: 'Compressor wash & blade inspection',
      priority: predictions && predictions.compressorHealth < 0.7 ? 'high' as const : 'low' as const,
      recovery: '+12% efficiency',
      downtime: '8 hours',
      cost: '$12,000',
      parts: ['Compressor blade set', 'Seal kit'],
    },
    {
      component: 'Combustor',
      dueIn: Math.round(50 - currentCycle * 0.08),
      action: 'Fuel nozzle cleaning & inspection',
      priority: predictions && predictions.combustorHealth < 0.7 ? 'high' as const : 'medium' as const,
      recovery: '+8% efficiency',
      downtime: '6 hours',
      cost: '$8,500',
      parts: ['Fuel nozzle set', 'Gasket kit'],
    },
    {
      component: 'Turbine',
      dueIn: Math.round(40 - currentCycle * 0.09),
      action: 'Turbine blade borescope inspection',
      priority: predictions && predictions.turbineHealth < 0.7 ? 'high' as const : 'medium' as const,
      recovery: '+15% efficiency',
      downtime: '12 hours',
      cost: '$18,000',
      parts: ['Turbine blade set', 'Bearings'],
    },
    {
      component: 'Full Engine',
      dueIn: Math.round(25 - currentCycle * 0.12),
      action: 'Complete performance restoration',
      priority: predictions && predictions.overallHealth < 0.7 ? 'critical' as const : 'medium' as const,
      recovery: '+20% efficiency',
      downtime: '48 hours',
      cost: '$85,000',
      parts: ['Full overhaul kit', 'All seals', 'Filters'],
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-space-black text-white p-4 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Wrench size={20} className="text-primary" />
          <div>
            <h1 className="text-lg font-bold text-gradient">Predictive Maintenance</h1>
            <p className="text-[10px] text-gray-500 font-mono-jb">AI-Driven Maintenance Scheduling & Fleet Health Management</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Due Actions', value: maintenanceItems.filter(i => i.dueIn <= 25).length, icon: <Wrench size={14} />, color: '#F97316' },
            { label: 'Avg Downtime', value: '18.5h', icon: <Clock size={14} />, color: '#3B82F6' },
            { label: 'Total Cost', value: '$123,500', icon: <DollarSign size={14} />, color: '#22C55E' },
            { label: 'Maintenance History', value: '12 records', icon: <History size={14} />, color: '#7C3AED' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-3 text-center relative"
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <div className="text-lg font-black font-mono-jb" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[8px] font-orbitron text-gray-500 tracking-wider uppercase mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-orbitron text-gray-500 tracking-wider uppercase">Recommended Actions</h3>
              <span className="text-[9px] font-mono-jb text-accent tabular-nums">Cycle {currentCycle}/300</span>
            </div>
            {maintenanceItems.map((item, i) => (
              <motion.div
                key={item.component}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass p-3.5 rounded-2xl relative hover-lift"
              >
                <div className="hud-corner hud-corner-tl" />
                <div className="hud-corner hud-corner-br" />
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      item.priority === 'critical' ? 'bg-red/15 border border-red/20' :
                      item.priority === 'high' ? 'bg-orange/15 border border-orange/20' :
                      'bg-primary/15 border border-primary/20'
                    }`}>
                      <Wrench size={16} className={item.priority === 'critical' ? 'text-red' : item.priority === 'high' ? 'text-orange' : 'text-primary'} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[10px] font-orbitron font-semibold text-white tracking-wider">{item.component}</h3>
                        <Badge variant={getBadgeVariant(item.priority)}>{item.priority}</Badge>
                      </div>
                      <p className="text-[9px] font-mono-jb text-gray-400 mt-0.5">{item.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono-jb">
                      <Clock size={10} className="text-gray-500" />
                      <span className={`tabular-nums ${item.dueIn > 0 ? 'text-gray-400' : 'text-red'}`}>
                        {item.dueIn > 0 ? `${item.dueIn} cyc` : 'OVERDUE'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono-jb mt-0.5">
                      <CheckCircle size={10} className="text-green" />
                      <span className="text-green">{item.recovery}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-2 pt-2 border-t border-white/5 text-[8px] font-mono-jb text-gray-600">
                  <span className="flex items-center gap-1"><Clock size={8} /> {item.downtime}</span>
                  <span className="flex items-center gap-1"><DollarSign size={8} /> {item.cost}</span>
                  <span className="flex items-center gap-1"><FileText size={8} /> {item.parts.join(', ')}</span>
                  {item.dueIn <= 25 && (
                    <span className="flex items-center gap-1 text-orange ml-auto">
                      <AlertTriangle size={8} /> Due soon
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="glass p-4 rounded-2xl relative">
              <div className="hud-corner hud-corner-tl" />
              <div className="hud-corner hud-corner-br" />
              <div className="flex items-center gap-2 mb-3">
                <Activity size={12} className="text-primary/70" />
                <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">Remaining Useful Life</h3>
              </div>
              <div className="text-center py-4">
                <div className="text-4xl font-black font-mono-jb text-primary tabular-nums">
                  {predictions ? Math.max(0, 300 - currentCycle) : '---'}
                </div>
                <p className="text-[9px] font-orbitron text-gray-600 tracking-wider mt-1 uppercase">Estimated Cycles Remaining</p>
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
              <div className="mt-3 p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <div className="text-[9px] font-mono-jb text-gray-400">
                  <span className="text-gray-600">Degradation rate: </span>
                  <span className="text-white tabular-nums">{((1 - health) / Math.max(currentCycle, 1) * 100).toFixed(3)}%/cyc</span>
                </div>
                <div className="text-[9px] font-mono-jb text-gray-400 mt-0.5">
                  <span className="text-gray-600">Projected failure: </span>
                  <span className="text-orange tabular-nums">~{Math.round((0.3 - health) / ((1 - health) / Math.max(currentCycle, 1)))} cycles</span>
                </div>
              </div>
            </div>
            <MaintenanceSchedule />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
