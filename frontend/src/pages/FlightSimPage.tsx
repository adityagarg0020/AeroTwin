import { useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { FlightSimulator } from '../components/flight/FlightSimulator';
import { PredictionsPanel } from '../components/dashboard/PredictionsPanel';
import { TopBar } from '../components/dashboard/TopBar';
import { EngineView } from '../components/three/EngineView';
import { useEngineStore } from '../store/engineStore';
import { predict } from '../api/client';
import { Gauge, Thermometer, Wind, Droplets, Weight, Fuel, Cloud, AlertTriangle } from 'lucide-react';

export function FlightSimPage() {
  const { engineInput, setPredictions, predictions } = useEngineStore();
  const [weather, setWeather] = useState({ temp: 15, humidity: 45, wind: 12 });

  const loadPrediction = useCallback(async () => {
    try {
      const res = await predict(engineInput);
      setPredictions(res.predictions);
    } catch (e) {
      console.error('Initial prediction failed:', e);
    }
  }, [engineInput, setPredictions]);

  useEffect(() => {
    loadPrediction();
  }, [loadPrediction]);

  const machToSpeed = (mach: number) => (mach * 343).toFixed(0);

  return (
    <PageTransition>
      <div className="min-h-screen bg-space-black text-white p-4 space-y-4">
        <TopBar />
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-primary font-orbitron text-xs font-bold">FS</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gradient">Advanced Flight Simulator</h1>
            <p className="text-[10px] text-gray-500 font-mono-jb">Real-Time Engine Performance Simulation with Environmental Conditions</p>
          </div>
        </div>

        {/* Environmental Conditions */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: 'OAT', value: `${(engineInput.Tamb_K - 273.15).toFixed(0)}°C`, icon: <Thermometer size={12} />, color: '#3B82F6' },
            { label: 'Humidity', value: `${weather.humidity}%`, icon: <Droplets size={12} />, color: '#22C55E' },
            { label: 'Wind', value: `${weather.wind} kts`, icon: <Wind size={12} />, color: '#FACC15' },
            { label: 'Payload', value: '12,500 kg', icon: <Weight size={12} />, color: '#F97316' },
            { label: 'Fuel', value: `${(engineInput.FuelFlow_kg_s * 100).toFixed(0)} kg`, icon: <Fuel size={12} />, color: '#7C3AED' },
          ].map((env, i) => (
            <motion.div
              key={env.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-2.5 text-center relative"
            >
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span style={{ color: env.color }}>{env.icon}</span>
              </div>
              <div className="text-xs font-bold font-mono-jb tabular-nums" style={{ color: env.color }}>{env.value}</div>
              <div className="text-[7px] font-orbitron text-gray-600 tracking-wider uppercase mt-0.5">{env.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4 space-y-3">
            <FlightSimulator />
            {/* Quick Performance Metrics */}
            <div className="glass rounded-2xl p-3 relative">
              <div className="flex items-center gap-2 mb-2">
                <Gauge size={12} className="text-primary/70" />
                <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">Performance</h3>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-mono-jb"><span className="text-gray-500">True Airspeed</span><span className="text-white tabular-nums">{machToSpeed(engineInput.Mach)} m/s</span></div>
                <div className="flex justify-between text-[9px] font-mono-jb"><span className="text-gray-500">Dynamic Pressure</span><span className="text-white tabular-nums">{(0.5 * 1.225 * (parseFloat(machToSpeed(engineInput.Mach)) ** 2) / 1000).toFixed(1)} kPa</span></div>
                <div className="flex justify-between text-[9px] font-mono-jb"><span className="text-gray-500">Thrust/Weight</span><span className="text-white tabular-nums">{predictions ? (predictions.thrust / 125000).toFixed(2) : '---'}</span></div>
                <div className="flex justify-between text-[9px] font-mono-jb"><span className="text-gray-500">Specific Thrust</span><span className="text-white tabular-nums">{predictions ? (predictions.thrust / engineInput.FuelFlow_kg_s / 1000).toFixed(1) : '---'}</span></div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <div className="glass rounded-2xl overflow-hidden" style={{ height: '480px' }}>
              <EngineView heatmap={false} />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3 space-y-3">
            <PredictionsPanel />
            {/* Weather advisory */}
            <div className="glass rounded-2xl p-3 relative">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Cloud size={12} className="text-primary/70" />
                <h3 className="text-[8px] font-orbitron text-gray-500 tracking-wider uppercase">Weather Advisory</h3>
              </div>
              <div className={`p-2 rounded-lg text-[9px] font-mono-jb ${
                weather.wind > 20 ? 'bg-orange/10 border border-orange/20 text-orange' : 'bg-green/10 border border-green/20 text-green'
              }`}>
                <div className="flex items-center gap-1">
                  {weather.wind > 20 ? <AlertTriangle size={10} /> : null}
                  {weather.wind > 20 ? 'Crosswind advisory — exercise caution during approach' : 'VFR conditions — clear for all operations'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
