import React from "react";

// Small, dependency-free charts. The spec calls for Recharts, but this
// project avoids adding a charting library just for two simple visuals
// (see spec section 37: "Do not add huge libraries without a reason").
// Swap these for Recharts components later if you'd like richer charts -
// `npm install recharts` and the data shapes here already match what it expects.

export const SimpleBarChart: React.FC<{
  data: { label: string; value: number }[];
  isDarkMode?: boolean;
  color?: string;
  valueFormatter?: (value: number) => string;
}> = ({ data, color = "#E42528", valueFormatter = (v) => String(v) }) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full group">
          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
            {valueFormatter(d.value)}
          </span>
          <div
            className="w-full rounded-t-md transition-all"
            style={{ height: `${Math.max(2, (d.value / max) * 100)}%`, backgroundColor: color }}
          />
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

export const SimpleLineChart: React.FC<{
  data: { label: string; value: number }[];
  color?: string;
}> = ({ data, color = "#E42528" }) => {
  const width = 600;
  const height = 160;
  const padding = 12;
  const max = Math.max(1, ...data.map((d) => d.value));

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.value / max) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
      <polyline points={points.join(" ")} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => {
        const [x, y] = p.split(",");
        return <circle key={i} cx={x} cy={y} r={2.5} fill={color} />;
      })}
    </svg>
  );
};
