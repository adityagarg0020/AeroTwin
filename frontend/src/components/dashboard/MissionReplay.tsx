import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useEngineStore } from '../../store/engineStore';
import { Button } from '../ui/Button';
import { Play, Pause, RotateCcw, Plane, TrendingUp, ArrowRight } from 'lucide-react';
import type { MissionPhase } from '../../types';

const missionPhases: MissionPhase[] = [
  { name: 'Takeoff', startCycle: 1, endCycle: 30, altitude: 0, mach: 0.3, throttle: 95 },
  { name: 'Climb', startCycle: 31, endCycle: 80, altitude: 8000, mach: 0.6, throttle: 85 },
  { name: 'Cruise', startCycle: 81, endCycle: 200, altitude: 11000, mach: 0.8, throttle: 65 },
  { name: 'Combat', startCycle: 201, endCycle: 250, altitude: 9000, mach: 1.1, throttle: 100 },
  { name: 'Descent', startCycle: 251, endCycle: 280, altitude: 4000, mach: 0.5, throttle: 40 },
  { name: 'Landing', startCycle: 281, endCycle: 300, altitude: 0, mach: 0.2, throttle: 30 },
];

export function MissionReplay() {
  const { missionCycle, setMissionCycle, isMissionReplay, setIsMissionReplay, setEngineInput } = useEngineStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentPhase = missionPhases.find(p => missionCycle >= p.startCycle && missionCycle <= p.endCycle) || missionPhases[0];

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setMissionCycle(Math.min(300, useEngineStore.getState().missionCycle + 1));
        if (useEngineStore.getState().missionCycle >= 300) {
          setIsPlaying(false);
          setIsMissionReplay(false);
        }
      }, 200);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, setMissionCycle, setIsMissionReplay]);

  const handleSeek = (cycle: number) => {
    setMissionCycle(cycle);
    const phase = missionPhases.find(p => cycle >= p.startCycle && cycle <= p.endCycle);
    if (phase) {
      setEngineInput({
        Altitude_m: phase.altitude,
        Mach: phase.mach,
        FuelFlow_kg_s: phase.throttle * 0.02,
      });
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setMissionCycle(1);
    setIsMissionReplay(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4 relative"
    >
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-br" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Plane size={12} className="text-primary/70" />
          <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">Mission Replay</h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono-jb text-gray-500 tabular-nums">CYC {missionCycle.toString().padStart(3, '0')}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        {missionPhases.map((phase) => (
          <button
            key={phase.name}
            onClick={() => handleSeek(phase.startCycle)}
            className={`flex-1 py-2 rounded-lg text-center transition-all duration-300 ${
              currentPhase.name === phase.name
                ? 'bg-primary/20 border border-primary/30 shadow-sm shadow-primary/10'
                : 'bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06]'
            }`}
          >
            <div className="text-[7px] font-orbitron text-gray-500 uppercase tracking-wider">{phase.name}</div>
            <div className={`text-[8px] font-mono-jb mt-0.5 tabular-nums ${currentPhase.name === phase.name ? 'text-accent' : 'text-gray-600'}`}>
              C{phase.startCycle}
            </div>
          </button>
        ))}
      </div>

      <div className="w-full h-12 relative mb-3">
        <div className="absolute inset-0 flex items-center">
          {missionPhases.map((phase, i) => {
            const left = ((phase.startCycle - 1) / 300) * 100;
            const width = ((phase.endCycle - phase.startCycle + 1) / 300) * 100;
            const isActive = currentPhase.name === phase.name;
            return (
              <div
                key={phase.name}
                className="absolute h-2 rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255,255,255,0.03)',
                }}
                onClick={() => handleSeek(phase.startCycle)}
              />
            );
          })}
          <div
            className="absolute w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50 transition-all duration-300"
            style={{ left: `calc(${((missionCycle - 1) / 300) * 100}% - 6px)`, top: '-2px' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <PhaseMetric label="Altitude" value={`${currentPhase.altitude.toLocaleString()} m`} />
        <PhaseMetric label="Mach" value={`M ${currentPhase.mach.toFixed(1)}`} />
        <PhaseMetric label="Throttle" value={`${currentPhase.throttle}%`} />
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button size="sm" variant="ghost" onClick={handleReset}>
          <RotateCcw size={12} /> Reset
        </Button>
        <Button
          size="md"
          variant="primary"
          onClick={() => { setIsPlaying(!isPlaying); setIsMissionReplay(true); }}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          {isPlaying ? 'Pause' : 'Replay'}
        </Button>
      </div>
    </motion.div>
  );
}

function PhaseMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
      <div className="text-[8px] font-orbitron text-gray-500 tracking-wider uppercase">{label}</div>
      <div className="text-[10px] font-mono-jb font-semibold text-white tabular-nums mt-0.5">{value}</div>
    </div>
  );
}
