import { useEngineStore } from '../../store/engineStore';
import { getHealthLevel } from '../../utils/colors';
import { Badge } from '../ui/Badge';
import { Lightbulb, AlertTriangle, Wrench, Crosshair } from 'lucide-react';
import type { AIAnalysis } from '../../types';

function generateAnalysis(value: number, component: string): AIAnalysis {
  if (value >= 0.85) {
    return {
      summary: `${component} is operating within nominal parameters.`,
      causes: ['Normal operational degradation', 'Standard wear patterns'],
      confidence: 94,
      recommendation: 'No action required. Continue monitoring.',
      component
    };
  }
  if (value >= 0.7) {
    return {
      summary: `${component} shows early signs of degradation.`,
      causes: ['Reduced pressure ratio', 'Increased fuel consumption', 'Minor fouling detected'],
      confidence: 92,
      recommendation: 'Schedule inspection within 50 cycles. Consider performance restoration.',
      component
    };
  }
  if (value >= 0.5) {
    return {
      summary: `${component} efficiency has significantly degraded.`,
      causes: ['Pressure ratio drop > 15%', 'Temperature rise in downstream stages', 'Probable compressor fouling or blade damage'],
      confidence: 96,
      recommendation: 'Immediate maintenance required. Perform compressor wash and borescope inspection.',
      component
    };
  }
  return {
    summary: `CRITICAL: ${component} failure imminent.`,
    causes: ['Severe performance degradation', 'Temperatures exceeding limits', 'Structural integrity at risk'],
    confidence: 99,
    recommendation: 'EMERGENCY SHUTDOWN. Replace component before next flight cycle.',
    component
  };
}

export function RootCauseAnalysis() {
  const { predictions } = useEngineStore();

  if (!predictions) return null;

  const comps = [
    { name: 'Compressor', value: predictions.compressorHealth },
    { name: 'Combustor', value: predictions.combustorHealth },
    { name: 'Turbine', value: predictions.turbineHealth },
  ];

  const worst = comps.reduce((a, b) => a.value < b.value ? a : b);
  const analysis = generateAnalysis(worst.value, worst.name);

  return (
    <div className="glass p-3.5 rounded-2xl relative">
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-br" />
      <div className="flex items-center gap-2 mb-2.5">
        <Crosshair size={12} className="text-primary/70" />
        <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">Root Cause Analysis</h3>
      </div>

      <div className="space-y-2.5">
        {/* Focus component indicator */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
          <span className="text-[8px] font-orbitron text-gray-600 tracking-wider uppercase">FOCUS</span>
          <span className="text-[10px] font-mono-jb font-semibold text-white">{worst.name}</span>
          <Badge variant={getHealthLevel(worst.value)}>
            {(worst.value * 100).toFixed(1)}%
          </Badge>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
          <div className="flex items-start gap-2">
            <Lightbulb size={14} className="text-yellow mt-0.5 shrink-0" />
            <p className="text-[10px] font-mono-jb text-gray-300 leading-relaxed">{analysis.summary}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <AlertTriangle size={10} className="text-orange" />
            <span className="text-[8px] font-orbitron text-gray-500 tracking-wider uppercase">Likely Causes</span>
          </div>
          <ul className="space-y-0.5">
            {analysis.causes.map((cause, i) => (
              <li key={i} className="text-[9px] font-mono-jb text-gray-400 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary" />
                {cause}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant={getHealthLevel(worst.value)}>
            CONF: {analysis.confidence}%
          </Badge>
        </div>

        <div className="p-2.5 rounded-xl bg-primary/[0.06] border border-primary/20">
          <div className="flex items-start gap-2">
            <Wrench size={14} className="text-primary mt-0.5 shrink-0" />
            <div>
              <span className="text-[8px] font-orbitron text-primary tracking-wider uppercase">Recommendation</span>
              <p className="text-[10px] font-mono-jb text-gray-300 mt-0.5 leading-relaxed">{analysis.recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
