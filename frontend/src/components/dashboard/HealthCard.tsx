import { motion } from 'framer-motion';
import { getHealthColor, getHealthLevel, getStatusText } from '../../utils/colors';
import { Badge } from '../ui/Badge';

interface HealthCardProps {
  title: string;
  value: number;
  trend?: number;
  icon?: React.ReactNode;
}

export function HealthCard({ title, value, trend, icon }: HealthCardProps) {
  const color = getHealthColor(value);
  const level = getHealthLevel(value);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - value * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-3.5 rounded-2xl hover-lift relative"
    >
      {/* HUD corners */}
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-br" />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          {icon && <span className="text-primary/70">{icon}</span>}
          <span className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">{title}</span>
        </div>
        <Badge variant={level}>{getStatusText(value)}</Badge>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative w-22 h-22">
          <svg className="w-22 h-22 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
            <motion.circle
              cx="50" cy="50" r="36" fill="none" stroke={color}
              strokeWidth="5" strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-lg font-bold tabular-nums font-mono-jb"
              style={{ color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={value}
            >
              {(value * 100).toFixed(1)}
            </motion.span>
            <span className="text-[8px] text-gray-600 font-orbitron tracking-wider">PCT</span>
          </div>
        </div>
      </div>

      {trend !== undefined && (
        <div className="mt-1.5 flex items-center justify-center gap-1">
          <span className={`text-[10px] font-mono-jb ${trend >= 0 ? 'text-green' : 'text-red'}`}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
          <span className="text-[9px] text-gray-600">vs prev</span>
        </div>
      )}
    </motion.div>
  );
}
