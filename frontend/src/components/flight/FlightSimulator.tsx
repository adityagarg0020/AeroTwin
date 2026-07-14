import { Slider } from '../ui/Slider';
import { Button } from '../ui/Button';
import { useEngineStore } from '../../store/engineStore';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { predict } from '../../api/client';
import { formatAltitude, formatMach, formatRPM, formatFuelFlow } from '../../utils/formatters';

export function FlightSimulator() {
  const { engineInput, setEngineInput, setPredictions } = useEngineStore();

  const handleChange = async (key: string, value: number) => {
    setEngineInput({ [key]: value });
    try {
      const updated = { ...engineInput, [key]: value };
      const res = await predict(updated);
      setPredictions(res.predictions);
    } catch (e) {
      console.error('Prediction failed:', e);
    }
  };

  const resetDefaults = () => {
    setEngineInput({
      Altitude_m: 5000, Mach: 0.5, RPM_rev_min: 50000,
      FuelFlow_kg_s: 0.8, Tamb_K: 260, Pamb_Pa: 50000
    });
  };

  return (
    <div className="glass p-3.5 rounded-2xl relative">
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-br" />
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={12} className="text-primary/70" />
          <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">Flight Controls</h3>
        </div>
        <Button size="sm" variant="ghost" onClick={resetDefaults}>
          <RotateCcw size={10} /> Reset
        </Button>
      </div>

      <div className="space-y-2.5">
        <Slider
          label="ALT"
          value={engineInput.Altitude_m}
          min={0} max={13000} step={100}
          onChange={(v) => handleChange('Altitude_m', v)}
          format={formatAltitude}
        />
        <Slider
          label="MACH"
          value={engineInput.Mach}
          min={0} max={1.2} step={0.01}
          onChange={(v) => handleChange('Mach', v)}
          format={formatMach}
        />
        <Slider
          label="N1 RPM"
          value={engineInput.RPM_rev_min}
          min={10000} max={90000} step={500}
          onChange={(v) => handleChange('RPM_rev_min', v)}
          format={formatRPM}
        />
        <Slider
          label="FUEL FLOW"
          value={engineInput.FuelFlow_kg_s}
          min={0.1} max={3.0} step={0.01}
          onChange={(v) => handleChange('FuelFlow_kg_s', v)}
          format={formatFuelFlow}
        />
        <Slider
          label="TAMB"
          value={engineInput.Tamb_K}
          min={200} max={320} step={1}
          onChange={(v) => handleChange('Tamb_K', v)}
          format={(v) => `${v} K`}
        />
        <Slider
          label="PAMB"
          value={engineInput.Pamb_Pa}
          min={10000} max={105000} step={100}
          onChange={(v) => handleChange('Pamb_Pa', v)}
          format={(v) => `${(v / 1000).toFixed(0)} kPa`}
        />
      </div>
    </div>
  );
}
