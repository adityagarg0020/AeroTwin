import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { FleetGrid } from '../components/fleet/FleetGrid';
import { HealthCard } from '../components/dashboard/HealthCard';
import { useEngineStore } from '../store/engineStore';
import { Gauge, Search, Filter, ArrowUpDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const fleetStats = [
  { label: 'Active Aircraft', value: 6, icon: <CheckCircle size={14} />, color: '#22C55E' },
  { label: 'Standby', value: 2, icon: <Clock size={14} />, color: '#FACC15' },
  { label: 'In Maintenance', value: 2, icon: <Wrench size={14} />, color: '#F97316' },
  { label: 'High Risk', value: 2, icon: <AlertTriangle size={14} />, color: '#EF4444' },
];

import { Wrench } from 'lucide-react';

export function FleetPage() {
  const { predictions, selectedEngineId } = useEngineStore();
  const [search, setSearch] = useState('');

  return (
    <PageTransition>
      <div className="min-h-screen bg-space-black text-white p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-primary font-orbitron text-xs font-bold">F</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient">Fleet Management</h1>
              <p className="text-[10px] text-gray-500 font-mono-jb">Multi-Aircraft Fleet Monitoring & Risk Assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search aircraft..."
                className="bg-white/[0.04] border border-white/10 rounded-xl pl-7 pr-3 py-1.5 text-[10px] font-mono-jb text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 w-40"
              />
            </div>
            <button className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-gray-500 hover:text-white transition-colors">
              <Filter size={12} />
            </button>
            <button className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-gray-500 hover:text-white transition-colors">
              <ArrowUpDown size={12} />
            </button>
          </div>
        </div>

        {/* Fleet Stats */}
        <div className="grid grid-cols-4 gap-3">
          {fleetStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-3 text-center relative"
            >
              <div className="hud-corner hud-corner-tl" />
              <div className="hud-corner hud-corner-br" />
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <div className="text-xl font-black font-mono-jb" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <FleetGrid />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <HealthCard title="Selected Engine" value={predictions?.overallHealth ?? 0} icon={<Gauge size={14} />} />
          </div>
          <div className="col-span-12 lg:col-span-9 glass rounded-2xl p-4 relative">
            <div className="hud-corner hud-corner-tl" />
            <div className="hud-corner hud-corner-br" />
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">Engine {selectedEngineId.toString().padStart(3, '0')}</span>
              <span className="text-[9px] font-mono-jb text-gray-600">| Fleet Asset Detail</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Total Cycles', value: '1,247', color: '#3B82F6' },
                { label: 'Engine Hours', value: '8,320', color: '#22C55E' },
                { label: 'Last Overhaul', value: 'CYC 1,000', color: '#FACC15' },
                { label: 'Risk Score', value: predictions ? `${((1 - predictions.overallHealth) * 100).toFixed(0)}%` : '---', color: predictions && predictions.overallHealth < 0.5 ? '#EF4444' : '#22C55E' },
              ].map((m) => (
                <div key={m.label} className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <div className="text-sm font-bold font-mono-jb" style={{ color: m.color }}>{m.value}</div>
                  <div className="text-[8px] font-orbitron text-gray-600 tracking-wider uppercase mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
