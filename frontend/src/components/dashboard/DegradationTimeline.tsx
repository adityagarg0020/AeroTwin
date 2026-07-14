import { useEngineStore } from '../../store/engineStore';
import { Slider } from '../ui/Slider';
import { Button } from '../ui/Button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function DegradationTimeline() {
  const { currentCycle, setCurrentCycle, isPlaying, setIsPlaying, playbackSpeed, setPlaybackSpeed } = useEngineStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        useEngineStore.getState().setCurrentCycle(
          Math.min(300, useEngineStore.getState().currentCycle + 1)
        );
        if (useEngineStore.getState().currentCycle >= 300) {
          setIsPlaying(false);
        }
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, playbackSpeed, setIsPlaying]);

  return (
    <div className="glass p-3.5 rounded-2xl relative">
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-br" />
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">Degradation Timeline</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-orbitron text-gray-600 tracking-wider">SPD</span>
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => setPlaybackSpeed(s)}
              className={`text-[9px] font-mono-jb px-1.5 py-0.5 rounded ${
                playbackSpeed === s ? 'bg-primary/30 text-primary border border-primary/30' : 'bg-white/[0.04] text-gray-500 border border-transparent'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <Slider
        label=""
        value={currentCycle}
        min={1}
        max={300}
        step={1}
        onChange={setCurrentCycle}
        format={(v) => `CYC ${v.toString().padStart(3, '0')}`}
        className="mb-2.5"
      />

      <div className="flex items-center justify-center gap-2">
        <Button size="sm" variant="ghost" onClick={() => setCurrentCycle(1)}>
          <SkipBack size={12} />
        </Button>
        <Button
          size="md"
          variant="primary"
          onClick={() => setIsPlaying(!isPlaying)}
          className="min-w-[90px]"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          {isPlaying ? 'HALT' : 'RUN'}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setCurrentCycle(300)}>
          <SkipForward size={12} />
        </Button>
      </div>
    </div>
  );
}
