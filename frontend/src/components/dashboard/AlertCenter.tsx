import { useEngineStore } from '../../store/engineStore';
import { Badge } from '../ui/Badge';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { timeAgo } from '../../utils/formatters';
import { AnimatePresence, motion } from 'framer-motion';

export function AlertCenter() {
  const { alerts, clearAlerts } = useEngineStore();

  return (
    <div className="glass p-3.5 rounded-2xl relative">
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-br" />
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange animate-breathe" />
          <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">Warning System</h3>
        </div>
        {alerts.length > 0 && (
          <button onClick={clearAlerts} className="text-[9px] font-mono-jb text-gray-600 hover:text-white transition-colors">
            CLR
          </button>
        )}
      </div>

      <div className="space-y-1.5 max-h-40 overflow-y-auto">
        <AnimatePresence initial={false}>
          {alerts.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green animate-breathe" />
                <span className="text-[10px] font-mono-jb text-gray-600">ALL SYSTEMS NOMINAL</span>
              </div>
            </motion.div>
          )}
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]"
            >
              {alert.type === 'critical' && <AlertCircle size={12} className="text-red mt-0.5 shrink-0" />}
              {alert.type === 'warning' && <AlertTriangle size={12} className="text-orange mt-0.5 shrink-0" />}
              {alert.type === 'info' && <Info size={12} className="text-primary mt-0.5 shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant={alert.type as any}>
                    {alert.type}
                  </Badge>
                  <span className="text-[9px] font-mono-jb text-gray-600">{timeAgo(alert.timestamp)}</span>
                </div>
                <p className="text-[10px] font-mono-jb text-gray-300 mt-0.5 leading-relaxed">{alert.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
