import { motion, AnimatePresence } from 'framer-motion';
import { useEngineStore } from '../../store/engineStore';
import { getHealthColor, getHealthLevel, getStatusText } from '../../utils/colors';
import { Badge } from '../ui/Badge';
import { X, Thermometer, Gauge, Activity, Zap, AlertTriangle } from 'lucide-react';
import type { ComponentHealth } from '../../types';

const componentData: Record<string, Partial<ComponentHealth>> = {
  intake: { name: 'Intake', temperature: 288, pressure: 101, rpm: 0, vibration: 0.02, efficiency: 0.97, remainingLife: 280, failureProbability: 0.02, degradation: 0.03, maintenanceRecommendation: 'No action required' },
  compressor: { name: 'Compressor', temperature: 450, pressure: 350, rpm: 50000, vibration: 0.08, efficiency: 0.88, remainingLife: 220, failureProbability: 0.08, degradation: 0.12, maintenanceRecommendation: 'Schedule compressor wash within 50 cycles' },
  combustor: { name: 'Combustor', temperature: 1200, pressure: 340, rpm: 0, vibration: 0.12, efficiency: 0.92, remainingLife: 240, failureProbability: 0.05, degradation: 0.08, maintenanceRecommendation: 'Monitor fuel nozzle condition' },
  turbine: { name: 'Turbine', temperature: 950, pressure: 120, rpm: 50000, vibration: 0.15, efficiency: 0.85, remainingLife: 180, failureProbability: 0.12, degradation: 0.15, maintenanceRecommendation: 'Borescope inspection recommended' },
  nozzle: { name: 'Nozzle', temperature: 850, pressure: 100, rpm: 0, vibration: 0.05, efficiency: 0.94, remainingLife: 260, failureProbability: 0.03, degradation: 0.06, maintenanceRecommendation: 'No action required' },
};

export function ComponentInfoPanel() {
  const { selectedComponent, setSelectedComponent, predictions } = useEngineStore();

  if (!selectedComponent || !predictions) return null;

  const base = componentData[selectedComponent];
  if (!base) return null;

  const healthKey = selectedComponent === 'intake' ? 'overallHealth'
    : selectedComponent === 'nozzle' ? 'overallHealth'
    : `${selectedComponent}Health` as keyof typeof predictions;

  const healthValue = predictions[healthKey as keyof typeof predictions] as number ?? predictions.overallHealth;

  const data = {
    ...base,
    health: healthValue,
    temperature: (base.temperature ?? 800) * (1 + (1 - healthValue) * 0.3),
    pressure: (base.pressure ?? 200) * (healthValue * 0.5 + 0.5),
    efficiency: base.efficiency! * healthValue,
    failureProbability: base.failureProbability! * (1 + (1 - healthValue) * 3),
    degradation: base.degradation! * (1 + (1 - healthValue) * 2),
    remainingLife: Math.round((base.remainingLife ?? 200) * healthValue),
  };

  const color = getHealthColor(data.health);
  const level = getHealthLevel(data.health);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.3 }}
        className="glass rounded-2xl p-4 relative overflow-hidden w-72"
      >
        <div className="hud-corner hud-corner-tl" />
        <div className="hud-corner hud-corner-br" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <h3 className="text-xs font-orbitron font-semibold text-white">{data.name}</h3>
          </div>
          <button onClick={() => setSelectedComponent(null)} className="text-gray-500 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="text-center mb-3">
          <div className="text-2xl font-black font-mono-jb" style={{ color }}>
            {(data.health * 100).toFixed(1)}%
          </div>
          <Badge variant={level}>{getStatusText(data.health)}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono-jb">
          <InfoItem icon={<Thermometer size={10} />} label="Temperature" value={`${data.temperature.toFixed(0)} K`} />
          <InfoItem icon={<Gauge size={10} />} label="Pressure" value={`${data.pressure.toFixed(1)} kPa`} />
          <InfoItem icon={<Activity size={10} />} label="RPM" value={data.rpm > 0 ? `${data.rpm.toFixed(0)}` : 'N/A'} />
          <InfoItem icon={<Zap size={10} />} label="Vibration" value={`${data.vibration.toFixed(3)} g`} />
        </div>

        <div className="mt-2 pt-2 border-t border-white/5 space-y-1.5">
          <ProgressRow label="Efficiency" value={data.efficiency} color="#3B82F6" />
          <ProgressRow label="RUL" value={data.remainingLife / 300} color="#22C55E" suffix={`${data.remainingLife} cyc`} />
          <ProgressRow label="Failure Prob" value={Math.min(1, data.failureProbability)} color="#EF4444" />
          <ProgressRow label="Degradation" value={Math.min(1, data.degradation)} color="#F97316" />
        </div>

        <div className="mt-2 p-2 rounded-lg bg-orange/10 border border-orange/20 flex items-start gap-1.5">
          <AlertTriangle size={12} className="text-orange mt-0.5 shrink-0" />
          <p className="text-[9px] font-mono-jb text-gray-300 leading-relaxed">{data.maintenanceRecommendation}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
      <span className="text-primary/70">{icon}</span>
      <span className="text-gray-500">{label}</span>
      <span className="ml-auto font-semibold text-white tabular-nums">{value}</span>
    </div>
  );
}

function ProgressRow({ label, value, color, suffix }: { label: string; value: number; color: string; suffix?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[8px] font-orbitron text-gray-500 tracking-wider">{label}</span>
        <span className="text-[9px] font-mono-jb text-white tabular-nums">{suffix || `${(value * 100).toFixed(1)}%`}</span>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, value * 100)}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
