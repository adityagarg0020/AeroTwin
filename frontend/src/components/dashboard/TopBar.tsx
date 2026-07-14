import { useEngineStore } from '../../store/engineStore';
import { Badge } from '../ui/Badge';
import { Gauge, Thermometer, Wind, Fuel, Clock } from 'lucide-react';
import { formatAltitude, formatMach, formatRPM, formatFuelFlow } from '../../utils/formatters';
import { getHealthLevel, getStatusText, getEngineGlowColor } from '../../utils/colors';
import { useEffect, useState } from 'react';

function MissionElapsedTime() {
  const [start] = useState(Date.now());
  const [elapsed, setElapsed] = useState('00:00:00');

  useEffect(() => {
    const id = setInterval(() => {
      const diff = Date.now() - start;
      const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setElapsed(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(id);
  }, [start]);

  return <span className="tabular-nums">{elapsed}</span>;
}

export function TopBar() {
  const { engineInput, predictions } = useEngineStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const health = predictions?.overallHealth ?? 1;
  const status = predictions ? getHealthLevel(predictions.overallHealth) : 'neutral' as any;
  const statusText = predictions ? getStatusText(predictions.overallHealth) : 'INITIALIZING';
  const glowColor = getEngineGlowColor(health);

  const systemStatus = [
    { label: 'COMMS', ok: true },
    { label: 'NAV', ok: true },
    { label: 'PROP', ok: predictions ? health > 0.5 : true },
    { label: 'ELEC', ok: true },
    { label: 'ENV', ok: predictions ? health > 0.7 : true },
  ];

  return (
    <div className="glass rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0" style={{
        background: `linear-gradient(135deg, ${glowColor}05, transparent 60%)`,
      }} />

      {/* Top status bar */}
      <div className="flex items-center justify-between px-5 py-2 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="font-orbitron text-primary font-bold text-xs">AT</span>
            </div>
            <span className="font-orbitron text-xs font-semibold text-gray-400 tracking-widest uppercase">
              MISSION CONTROL
            </span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-600 font-orbitron tracking-wider uppercase">SYS:</span>
            {systemStatus.map((s) => (
              <div key={s.label} className="flex items-center gap-1">
                <span className={`status-light ${s.ok ? 'green animate-breathe' : 'red'}`} />
                <span className="text-[10px] text-gray-500 font-mono-jb">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock size={11} className="text-gray-600" />
            <span className="text-[10px] text-gray-600 font-orbitron tracking-wider uppercase">MET</span>
            <span className="text-xs font-mono-jb text-accent tabular-nums">
              <MissionElapsedTime />
            </span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-[11px] font-mono-jb text-gray-500 tabular-nums">
            {time.toLocaleTimeString()} UTC
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-between px-5 py-2.5">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="font-orbitron text-xs font-semibold text-gray-400 tracking-wider">ENG</span>
            <span className="font-mono-jb text-sm font-bold text-white">{engineInput.EngineID.toString().padStart(3, '0')}</span>
          </div>
          <div className="w-px h-5 bg-white/10" />
          <span className="font-mono-jb text-xs text-gray-400 tabular-nums">CYC {engineInput.Cycle.toString().padStart(3, '0')}</span>
          <div className="w-px h-5 bg-white/10" />
          <Badge variant={status}>{statusText}</Badge>
        </div>

        <div className="flex items-center gap-4">
          <Metric icon={<Gauge size={12} />} label="ALT" value={formatAltitude(engineInput.Altitude_m)} />
          <Metric icon={<Wind size={12} />} label="MACH" value={formatMach(engineInput.Mach)} />
          <Metric icon={<Thermometer size={12} />} label="N1" value={formatRPM(engineInput.RPM_rev_min)} />
          <Metric icon={<Fuel size={12} />} label="FF" value={formatFuelFlow(engineInput.FuelFlow_kg_s)} />
          <div className="w-px h-5 bg-white/10" />
          <Metric icon={<Thermometer size={12} />} label="TAMB" value={`${engineInput.Tamb_K.toFixed(0)}K`} />
        </div>
      </div>

      {/* HUD corners */}
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-tr" />
      <div className="hud-corner hud-corner-bl" />
      <div className="hud-corner hud-corner-br" />
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-primary/70">{icon}</span>
      <span className="text-[10px] font-orbitron text-gray-500 tracking-wider">{label}</span>
      <span className="text-xs font-mono-jb font-semibold text-white tabular-nums">{value}</span>
    </div>
  );
}
