import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEngineStore } from '../../store/engineStore';
import { Button } from '../ui/Button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import type { DegradationStage } from '../../types';
import { getHealthColor } from '../../utils/colors';

const stages: DegradationStage[] = [
  { cycle: 1, label: 'Healthy', health: 0.99, description: 'All systems nominal. Engine operating at peak efficiency.' },
  { cycle: 60, label: 'Minor Wear', health: 0.88, description: 'Early signs of compressor blade erosion. Minimal performance impact.' },
  { cycle: 120, label: 'Efficiency Loss', health: 0.76, description: 'Noticeable efficiency degradation. Fuel consumption increasing.' },
  { cycle: 180, label: 'Heat Increase', health: 0.63, description: 'EGT rising. Turbine blade creep accelerating.' },
  { cycle: 240, label: 'Significant Damage', health: 0.49, description: 'Critical component wear detected. Immediate action recommended.' },
  { cycle: 300, label: 'Failure Imminent', health: 0.32, description: 'Emergency shutdown required. Complete overhaul needed.' },
];

export function DegradationPlayback() {
  const { currentCycle, setCurrentCycle, isPlaying, setIsPlaying, playbackSpeed, setPlaybackSpeed } = useEngineStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const next = Math.min(300, useEngineStore.getState().currentCycle + 1);
        useEngineStore.getState().setCurrentCycle(next);
        if (next >= 300) setIsPlaying(false);
      }, 1000 / playbackSpeed);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, playbackSpeed, setIsPlaying]);

  const currentStage = [...stages].reverse().find(s => currentCycle >= s.cycle) || stages[0];
  const color = getHealthColor(currentStage.health);
  const progress = ((currentCycle - 1) / 299) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4 relative"
    >
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-br" />

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">Degradation Playback</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-orbitron text-gray-600 tracking-wider">SPD</span>
          {[1, 2, 5, 10].map((s) => (
            <button key={s}
              onClick={() => setPlaybackSpeed(s)}
              className={`text-[9px] font-mono-jb px-1.5 py-0.5 rounded ${
                playbackSpeed === s ? 'bg-primary/30 text-primary border border-primary/30' : 'bg-white/[0.04] text-gray-500 border border-transparent'
              }`}
            >{s}x</button>
          ))}
        </div>
      </div>

      <div className="relative mb-4">
        <div className="w-full h-16 bg-white/[0.03] rounded-xl overflow-hidden relative">
          {stages.map((stage, i) => {
            const left = ((stage.cycle - 1) / 299) * 100;
            const isPast = currentCycle >= stage.cycle;
            return (
              <div key={stage.label}
                className="absolute top-0 bottom-0 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer"
                style={{ left: `${left}%`, transform: 'translateX(-50%)' }}
                onClick={() => { setCurrentCycle(stage.cycle); }}
              >
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isPast ? 'shadow-lg' : 'bg-gray-700'
                }`} style={{ backgroundColor: isPast ? getHealthColor(stage.health) : undefined }} />
                <span className={`text-[6px] font-mono-jb mt-0.5 ${isPast ? 'text-white' : 'text-gray-700'}`}>
                  {stage.label}
                </span>
              </div>
            );
          })}
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green via-yellow via-orange to-red rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="text-center mb-3">
        <div className="text-[10px] font-orbitron text-gray-500 tracking-wider uppercase mb-1">{currentStage.label}</div>
        <div className="text-3xl font-black font-mono-jb" style={{ color }}>{(currentStage.health * 100).toFixed(0)}%</div>
        <p className="text-[10px] font-mono-jb text-gray-400 mt-1 max-w-md mx-auto">{currentStage.description}</p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button size="sm" variant="ghost" onClick={() => setCurrentCycle(1)}><SkipBack size={12} /></Button>
        <Button size="md" variant="primary" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setCurrentCycle(300)}><SkipForward size={12} /></Button>
      </div>
    </motion.div>
  );
}
