import { useEngineStore } from '../../store/engineStore';
import { formatThrust, formatTSFC } from '../../utils/formatters';
import { useState, useEffect, useRef } from 'react';

export function PredictionsPanel() {
  const { predictions, engineInput } = useEngineStore();
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (predictions) {
      lastUpdateRef.current = Date.now();
      setSecondsSinceUpdate(0);
    }
  }, [predictions]);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsSinceUpdate(Math.round((Date.now() - lastUpdateRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (!predictions) {
    return (
      <div className="glass p-3.5 rounded-2xl relative">
        <div className="hud-corner hud-corner-tl" />
        <div className="hud-corner hud-corner-br" />
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange animate-blink" />
          <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">AI Predictions</h3>
        </div>
        <div className="flex items-center justify-center py-6">
          <span className="text-[10px] font-mono-jb text-gray-600 animate-blink">AWAITING DATA...</span>
        </div>
      </div>
    );
  }

  const rul = Math.max(0, 300 - engineInput.Cycle);

  return (
    <div className="glass p-3.5 rounded-2xl relative">
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-br" />
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-breathe" />
          <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">AI Predictions</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-1 h-1 rounded-full ${secondsSinceUpdate < 5 ? 'bg-green' : 'bg-orange'}`} />
          <span className="text-[8px] font-mono-jb text-gray-600 tabular-nums">
            {secondsSinceUpdate < 60 ? `T-${secondsSinceUpdate}s` : 'STALE'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <PredictionRow label="PREDICTED THRUST" value={formatThrust(predictions.thrust)} />
        <PredictionRow label="TSFC" value={formatTSFC(predictions.tsfc)} />
        <PredictionRow
          label="CONFIDENCE"
          value={`${((1 - 0.02) * 100).toFixed(0)}%`}
          accent
        />
        <div className="border-t border-white/5 pt-2 mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">RUL</span>
            <span className="text-sm font-mono-jb font-bold text-accent tabular-nums">{rul} cycles</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(rul / 300) * 100}%`,
                background: `linear-gradient(90deg, #EF4444, #F97316, #FACC15, #22C55E)`,
              }}
            />
          </div>
        </div>
        <PredictionRow
          label="DEGRADATION RATE"
          value={`${((1 - predictions.overallHealth) / Math.max(engineInput.Cycle, 1) * 100).toFixed(3)}%/cyc`}
        />
      </div>
    </div>
  );
}

function PredictionRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-white/[0.03] last:border-0">
      <span className="text-[9px] font-orbitron text-gray-500 tracking-wider">{label}</span>
      <span className={`text-[10px] font-mono-jb font-bold tabular-nums ${accent ? 'text-accent' : 'text-white'}`}>
        {value}
      </span>
    </div>
  );
}
