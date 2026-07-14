import { motion } from 'framer-motion';
import { useEngineStore } from '../../store/engineStore';
import { Badge } from '../ui/Badge';
import { Wrench, Clock, DollarSign, Package, FileText, AlertTriangle } from 'lucide-react';
import { getHealthLevel } from '../../utils/colors';
import type { MaintenanceRecommendation } from '../../types';

function generateRecommendations(health: number, cycle: number): MaintenanceRecommendation[] {
  return [
    {
      id: '1', component: 'Compressor', action: 'Compressor wash and blade inspection',
      dueIn: Math.max(1, Math.round(30 - cycle * 0.1)),
      priority: health < 0.5 ? 'critical' : health < 0.7 ? 'high' : 'low',
      estimatedDowntime: health < 0.5 ? '24 hours' : '8 hours',
      estimatedCost: health < 0.5 ? '$45,000' : '$12,000',
      recommendedParts: ['Compressor blade set', 'Seal kit', 'Filter set'],
      technicianNotes: 'Check for FOD damage. Measure blade tip clearances.',
      recoveryEfficiency: '+12% efficiency',
    },
    {
      id: '2', component: 'Combustor', action: 'Fuel nozzle cleaning and inspection',
      dueIn: Math.max(1, Math.round(45 - cycle * 0.08)),
      priority: health < 0.5 ? 'critical' : health < 0.7 ? 'high' : 'medium',
      estimatedDowntime: health < 0.5 ? '16 hours' : '6 hours',
      estimatedCost: health < 0.5 ? '$28,000' : '$8,500',
      recommendedParts: ['Fuel nozzle set', 'Gasket kit', 'Filter elements'],
      technicianNotes: 'Inspect for coking and carbon deposits. Check spray pattern.',
      recoveryEfficiency: '+8% efficiency',
    },
    {
      id: '3', component: 'Turbine', action: 'Turbine blade borescope inspection',
      dueIn: Math.max(1, Math.round(40 - cycle * 0.09)),
      priority: health < 0.5 ? 'critical' : health < 0.7 ? 'high' : 'medium',
      estimatedDowntime: health < 0.5 ? '36 hours' : '12 hours',
      estimatedCost: health < 0.5 ? '$65,000' : '$18,000',
      recommendedParts: ['Turbine blade set (if needed)', 'Bearings', 'Seals'],
      technicianNotes: 'Look for creep, cracking, and tip rubbing on HPT blades.',
      recoveryEfficiency: '+15% efficiency',
    },
    {
      id: '4', component: 'Fuel System', action: 'Fuel system flush and filter replacement',
      dueIn: Math.max(1, Math.round(20 - cycle * 0.05)),
      priority: 'medium',
      estimatedDowntime: '4 hours',
      estimatedCost: '$3,500',
      recommendedParts: ['Fuel filter', 'O-ring set', 'Fuel sample kit'],
      technicianNotes: 'Take fuel sample for contamination analysis.',
      recoveryEfficiency: '+3% efficiency',
    },
    {
      id: '5', component: 'Oil System', action: 'Oil analysis and filter change',
      dueIn: Math.max(1, Math.round(15 - cycle * 0.04)),
      priority: 'low',
      estimatedDowntime: '2 hours',
      estimatedCost: '$1,200',
      recommendedParts: ['Oil filter', 'Oil (5 gal)', 'Seal washer'],
      technicianNotes: 'Send oil sample for spectrometric analysis.',
      recoveryEfficiency: '+2% efficiency',
    },
  ];
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'critical': return 'critical' as const;
    case 'high': return 'warning' as const;
    case 'medium': return 'moderate' as const;
    default: return 'healthy' as const;
  }
}

export function MaintenanceSchedule() {
  const { predictions, currentCycle, maintenanceRecommendations, setMaintenanceRecommendations } = useEngineStore();
  const health = predictions?.overallHealth ?? 1;

  const recs = maintenanceRecommendations.length > 0 ? maintenanceRecommendations : generateRecommendations(health, currentCycle);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4 relative"
    >
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-br" />

      <div className="flex items-center gap-2 mb-3">
        <Wrench size={12} className="text-primary/70" />
        <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">Maintenance Schedule</h3>
        <span className="ml-auto text-[9px] font-mono-jb text-gray-600">{recs.filter(r => r.dueIn <= 25).length} due soon</span>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {recs.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all"
          >
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-orbitron font-semibold text-white">{rec.component}</span>
                <Badge variant={getPriorityBadge(rec.priority)}>{rec.priority}</Badge>
              </div>
              <span className="text-[10px] font-mono-jb text-gray-500 tabular-nums">in {rec.dueIn} cyc</span>
            </div>

            <p className="text-[9px] font-mono-jb text-gray-400 mb-1.5">{rec.action}</p>

            <div className="flex items-center gap-3 text-[8px] font-mono-jb text-gray-600">
              <span className="flex items-center gap-1"><Clock size={8} /> {rec.estimatedDowntime}</span>
              <span className="flex items-center gap-1"><DollarSign size={8} /> {rec.estimatedCost}</span>
              <span className="text-green">{rec.recoveryEfficiency}</span>
            </div>

            {rec.dueIn <= 25 && (
              <div className="mt-1.5 flex items-center gap-1 text-[8px] font-mono-jb text-orange">
                <AlertTriangle size={8} />
                <span>Due within {rec.dueIn} cycles</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
