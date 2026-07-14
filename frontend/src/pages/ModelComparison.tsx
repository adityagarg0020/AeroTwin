import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Brain, Clock, Gauge, BarChart3 } from 'lucide-react';

const modelData = [
  { name: 'Compressor Health', accuracy: 0.945, precision: 0.94, recall: 0.95, f1: 0.945, mae: 0.0132, rmse: 0.021, inference: 12, training: 145 },
  { name: 'Combustor Health', accuracy: 0.942, precision: 0.94, recall: 0.94, f1: 0.94, mae: 0.0055, rmse: 0.009, inference: 11, training: 138 },
  { name: 'Turbine Health', accuracy: 0.847, precision: 0.84, recall: 0.85, f1: 0.845, mae: 0.015, rmse: 0.028, inference: 13, training: 152 },
  { name: 'Overall Health', accuracy: 0.962, precision: 0.96, recall: 0.96, f1: 0.96, mae: 0.0071, rmse: 0.012, inference: 10, training: 140 },
  { name: 'Thrust (N)', accuracy: 0.971, precision: 0.97, recall: 0.97, f1: 0.97, mae: 2176, rmse: 3450, inference: 14, training: 160 },
  { name: 'TSFC', accuracy: 0.981, precision: 0.98, recall: 0.98, f1: 0.98, mae: 0.00074, rmse: 0.0012, inference: 11, training: 135 },
];

const metricColors = ['#3B82F6', '#22C55E', '#FACC15', '#F97316', '#EF4444', '#7C3AED'];

export function ModelComparison() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-space-black text-white p-4 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Brain size={20} className="text-primary" />
          <h1 className="text-lg font-bold text-gradient-blue">Model Comparison</h1>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Models', value: '6', icon: <Brain size={14} />, color: '#3B82F6' },
            { label: 'Avg Accuracy', value: '94.1%', icon: <Gauge size={14} />, color: '#22C55E' },
            { label: 'Avg Inference', value: '11.8ms', icon: <Clock size={14} />, color: '#F97316' },
            { label: 'Total Feats', value: '21', icon: <BarChart3 size={14} />, color: '#7C3AED' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-4 text-center relative"
            >
              <div className="hud-corner hud-corner-tl" />
              <div className="hud-corner hud-corner-br" />
              <div className="flex items-center justify-center gap-2 mb-1">
                <span style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <div className="text-xl font-black font-mono-jb" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Accuracy Comparison Chart */}
        <div className="glass rounded-2xl p-4 relative">
          <div className="hud-corner hud-corner-tl" />
          <div className="hud-corner hud-corner-br" />
          <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase mb-3">Model Accuracy Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} domain={[0.7, 1]} />
                <Tooltip
                  contentStyle={{ background: '#0F172A', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px', fontSize: '10px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="accuracy" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Accuracy" />
                <Bar dataKey="precision" fill="#22C55E" radius={[4, 4, 0, 0]} name="Precision" />
                <Bar dataKey="recall" fill="#FACC15" radius={[4, 4, 0, 0]} name="Recall" />
                <Bar dataKey="f1" fill="#7C3AED" radius={[4, 4, 0, 0]} name="F1 Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Details Table */}
        <div className="glass rounded-2xl p-4 relative overflow-x-auto">
          <div className="hud-corner hud-corner-tl" />
          <div className="hud-corner hud-corner-br" />
          <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase mb-3">Detailed Metrics</h3>
          <table className="w-full text-[10px] font-mono-jb">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-3 py-2 text-primary tracking-wider font-orbitron text-[9px]">Model</th>
                <th className="text-right px-3 py-2 text-gray-500 tracking-wider font-orbitron text-[9px]">R²</th>
                <th className="text-right px-3 py-2 text-gray-500 tracking-wider font-orbitron text-[9px]">MAE</th>
                <th className="text-right px-3 py-2 text-gray-500 tracking-wider font-orbitron text-[9px]">RMSE</th>
                <th className="text-right px-3 py-2 text-gray-500 tracking-wider font-orbitron text-[9px]">F1</th>
                <th className="text-right px-3 py-2 text-gray-500 tracking-wider font-orbitron text-[9px]">Inference</th>
                <th className="text-right px-3 py-2 text-gray-500 tracking-wider font-orbitron text-[9px]">Training</th>
              </tr>
            </thead>
            <tbody>
              {modelData.map((m, i) => (
                <motion.tr
                  key={m.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-3 py-2 text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: metricColors[i] }} />
                    {m.name}
                  </td>
                  <td className="text-right px-3 py-2 text-green tabular-nums">{(m.accuracy * 100).toFixed(1)}%</td>
                  <td className="text-right px-3 py-2 text-gray-300 tabular-nums">{m.mae < 1 ? m.mae.toFixed(4) : m.mae.toFixed(0)}</td>
                  <td className="text-right px-3 py-2 text-gray-300 tabular-nums">{m.rmse < 1 ? m.rmse.toFixed(4) : m.rmse.toFixed(0)}</td>
                  <td className="text-right px-3 py-2 text-accent tabular-nums">{(m.f1 * 100).toFixed(1)}%</td>
                  <td className="text-right px-3 py-2 text-gray-400 tabular-nums">{m.inference}ms</td>
                  <td className="text-right px-3 py-2 text-gray-400 tabular-nums">{m.training}s</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Confusion Matrix Placeholder */}
        <div className="glass rounded-2xl p-4 relative">
          <div className="hud-corner hud-corner-tl" />
          <div className="hud-corner hud-corner-br" />
          <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase mb-3">Performance Metrics Overview</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={modelData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} domain={[0.7, 1]} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px', fontSize: '10px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="accuracy" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="f1" stroke="#7C3AED" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
