import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { HealthTrendChart } from '../components/charts/HealthTrendChart';
import { HealthRadarChart } from '../components/charts/RadarChart';
import { useEngineStore } from '../store/engineStore';
import { BarChart3, TrendingUp, Activity, Gauge } from 'lucide-react';

export function Analytics() {
  const { currentCycle, predictions } = useEngineStore();

  const healthData = Array.from({ length: currentCycle }, (_, i) => ({
    cycle: i + 1, value: Math.max(0.1, 1 - (i / 300) * 0.7 + Math.sin(i * 0.3) * 0.03)
  }));

  const tempData = Array.from({ length: currentCycle }, (_, i) => ({
    cycle: i + 1, value: 900 - i * 0.3 + Math.sin(i * 0.5) * 15
  }));

  const pressureData = Array.from({ length: currentCycle }, (_, i) => ({
    cycle: i + 1, value: 350000 - i * 150 + Math.sin(i * 0.4) * 5000
  }));

  const thrustData = Array.from({ length: currentCycle }, (_, i) => ({
    cycle: i + 1, value: Math.max(10000, 52000 - i * 80 + Math.sin(i * 0.2) * 2000)
  }));

  const vibrationData = Array.from({ length: currentCycle }, (_, i) => ({
    cycle: i + 1, value: Math.min(1, 0.05 + (i / 300) * 0.6 + Math.sin(i * 0.7) * 0.02)
  }));

  const radarData = predictions ? [
    { component: 'Compressor', value: predictions.compressorHealth, fullMark: 1 },
    { component: 'Combustor', value: predictions.combustorHealth, fullMark: 1 },
    { component: 'Turbine', value: predictions.turbineHealth, fullMark: 1 },
    { component: 'Overall', value: predictions.overallHealth, fullMark: 1 },
  ] : [];

  return (
    <PageTransition>
      <div className="min-h-screen bg-space-black text-white p-4 space-y-4">
        <div className="flex items-center gap-3">
          <BarChart3 size={20} className="text-primary" />
          <div>
            <h1 className="text-lg font-bold text-gradient">Analytics Dashboard</h1>
            <p className="text-[10px] text-gray-500 font-mono-jb">Comprehensive Engine Performance Analytics & Trend Analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4">
            <HealthTrendChart data={healthData} color="#22C55E" title="Health Trend" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <HealthTrendChart data={tempData} color="#F97316" title="Temperature (T4) Trend" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <HealthTrendChart data={pressureData} color="#3B82F6" title="Pressure (P3) Trend" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <HealthTrendChart data={thrustData} color="#7C3AED" title="Thrust Trend" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <HealthTrendChart data={vibrationData} color="#EF4444" title="Vibration Trend" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <HealthRadarChart data={radarData} />
          </div>
        </div>

        {/* EGT vs Cycle */}
        <div className="glass rounded-2xl p-4 relative">
          <div className="hud-corner hud-corner-tl" />
          <div className="hud-corner hud-corner-br" />
          <div className="flex items-center gap-2 mb-3">
            <Activity size={12} className="text-primary/70" />
            <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">Compressor & Turbine Performance Correlation</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData.slice(0, currentCycle)} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="cycle" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 1]} tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px', fontSize: '10px' }} />
                <Area type="monotone" dataKey="value" stroke="#22C55E" fill="url(#colorHealth)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
