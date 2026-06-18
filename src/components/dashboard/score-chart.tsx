"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  date: string;
  score: number;
  label: string;
}

interface ScoreChartProps {
  data: DataPoint[];
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: DataPoint; value: number }[];
}) {
  if (!active || !payload?.length) return null;
  const { value } = payload[0];
  const label = payload[0].payload.label;
  return (
    <div className="rounded-xl border border-beige-200 bg-white/90 px-3 py-2 shadow-md text-sm">
      <p className="text-muted-foreground text-xs mb-0.5">{label}</p>
      <p className="font-bold text-coral-500">{value} / 100</p>
    </div>
  );
}

export function ScoreChart({ data }: ScoreChartProps) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF6B52" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#FF6B52" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e0d9" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#a89e94" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: "#a89e94" }}
          axisLine={false}
          tickLine={false}
          ticks={[0, 50, 100]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="score"
          stroke="#FF6B52"
          strokeWidth={2.5}
          fill="url(#scoreGrad)"
          dot={{ fill: "#FF6B52", strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, fill: "#FF6B52", strokeWidth: 2, stroke: "#fff" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
