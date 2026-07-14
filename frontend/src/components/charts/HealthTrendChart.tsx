import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface HealthTrendChartProps {
  data: Array<{ cycle: number; value: number }>;
  color?: string;
  title?: string;
}

export function HealthTrendChart({ data, color = '#3B82F6', title }: HealthTrendChartProps) {
  return (
    <div className="glass p-3.5 rounded-2xl relative">
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-br" />
      {title && (
        <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase mb-2.5">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`trend-grad-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
          <XAxis dataKey="cycle" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,23,42,0.95)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: '8px',
              fontSize: '11px',
              fontFamily: 'JetBrains Mono, monospace',
            }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#trend-grad-${title})`}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: '#0F172A', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
