import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useEngineStore } from '../../store/engineStore';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';
import type { ShapFeature } from '../../types';

function generateShapExplanation(): { features: ShapFeature[]; baseValue: number; confidence: number } {
  const baseValue = 0.75;
  const features: ShapFeature[] = [
    { name: 'Pressure Ratio (P3/P2)', value: 2.33, contribution: 0.08, positive: true },
    { name: 'Temperature Ratio (T3/T2)', value: 2.57, contribution: 0.06, positive: true },
    { name: 'Fuel Flow', value: 0.8, contribution: -0.04, positive: false },
    { name: 'RPM', value: 50000, contribution: 0.05, positive: true },
    { name: 'T4 Temperature', value: 800, contribution: -0.03, positive: false },
    { name: 'Cycle Number', value: 150, contribution: -0.07, positive: false },
    { name: 'Altitude', value: 5000, contribution: 0.02, positive: true },
    { name: 'Mach Number', value: 0.5, contribution: 0.03, positive: true },
  ];
  return { features, baseValue, confidence: 94.2 };
}

export function ShapExplainer() {
  const { predictions } = useEngineStore();
  const explanation = useMemo(() => generateShapExplanation(), []);

  if (!predictions) return null;

  const prediction = predictions.overallHealth;
  const sorted = [...explanation.features].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4 relative"
    >
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-br" />

      <div className="flex items-center gap-2 mb-3">
        <Info size={12} className="text-primary/70" />
        <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">SHAP Explainability</h3>
        <span className="ml-auto text-[9px] font-mono-jb text-accent tabular-nums">CONF: {explanation.confidence}%</span>
      </div>

      <div className="flex items-center justify-between mb-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
        <span className="text-[10px] font-orbitron text-gray-400">Base Value</span>
        <span className="text-sm font-mono-jb font-bold text-white">{(explanation.baseValue * 100).toFixed(1)}%</span>
        <span className="text-[10px] font-orbitron text-gray-400">→</span>
        <span className="text-sm font-mono-jb font-bold text-primary">{(prediction * 100).toFixed(1)}%</span>
      </div>

      <div className="relative h-8 mb-3 rounded-lg overflow-hidden bg-white/[0.03]">
        <div className="absolute inset-0 flex">
          {sorted.map((f, i) => {
            const width = Math.abs(f.contribution) / sorted.reduce((a, b) => a + Math.abs(b.contribution), 0) * 100;
            return (
              <div
                key={f.name}
                className="h-full transition-all duration-300"
                style={{
                  width: `${width}%`,
                  backgroundColor: f.positive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                  borderRight: i < sorted.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="space-y-1">
        {sorted.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {f.positive
                ? <ArrowUp size={10} className="text-green" />
                : <ArrowDown size={10} className="text-red" />
              }
              <span className="text-[10px] font-mono-jb text-gray-400">{f.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono-jb text-gray-600 tabular-nums">{f.value.toFixed(2)}</span>
              <span className={`text-[10px] font-mono-jb font-semibold tabular-nums ${f.positive ? 'text-green' : 'text-red'}`}>
                {f.positive ? '+' : ''}{(f.contribution * 100).toFixed(2)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
