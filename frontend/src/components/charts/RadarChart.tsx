import { Radar, RadarChart as RC, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RadarChartProps {
  data: Array<{ component: string; value: number; fullMark: number }>;
}

export function HealthRadarChart({ data }: RadarChartProps) {
  return (
    <div className="glass p-3.5 rounded-2xl relative">
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-br" />
      <h3 className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase mb-2.5">Health Radar</h3>
      <ResponsiveContainer width="100%" height={200}>
        <RC data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="rgba(255,255,255,0.05)" />
          <PolarAngleAxis dataKey="component" tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
          <PolarRadiusAxis angle={90} domain={[0, 1]} tick={false} axisLine={false} />
          <Radar
            name="Health"
            dataKey="value"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </RC>
      </ResponsiveContainer>
    </div>
  );
}
