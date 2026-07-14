import { useEngineStore } from '../../store/engineStore';
import { formatTemperature, formatPressure } from '../../utils/formatters';

export function TelemetryPanel() {
  const { engineInput } = useEngineStore();

  const metrics = [
    { label: 'P2', desc: 'INLET PRESSURE', value: formatPressure(engineInput.P2_Pa) },
    { label: 'T2', desc: 'INLET TEMP', value: formatTemperature(engineInput.T2_K) },
    { label: 'P3', desc: 'COMPRESSOR DISCHARGE', value: formatPressure(engineInput.P3_Pa) },
    { label: 'T3', desc: 'COMPRESSOR DISCHARGE', value: formatTemperature(engineInput.T3_K) },
    { label: 'P4', desc: 'TURBINE EXHAUST', value: formatPressure(engineInput.P4_Pa) },
    { label: 'T4', desc: 'TURBINE EXHAUST', value: formatTemperature(engineInput.T4_K) },
    { label: 'TAMB', desc: 'AMBIENT TEMP', value: formatTemperature(engineInput.Tamb_K) },
    { label: 'PAMB', desc: 'AMBIENT PRESSURE', value: formatPressure(engineInput.Pamb_Pa) },
  ];

  return (
    <div className="glass p-3.5 rounded-2xl relative">
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-br" />
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-breathe" />
        <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">Live Telemetry</h3>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-orbitron text-primary/60 tracking-wider">{m.label}</span>
              <span className="text-[7px] text-gray-600 uppercase tracking-wider hidden 2xl:inline">{m.desc}</span>
            </div>
            <span className="text-[10px] font-mono-jb font-semibold text-white tabular-nums">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
