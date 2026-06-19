import { useState } from 'react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface DataPoint {
  label: string;
  value: number;
}

interface SVGChartProps {
  data: DataPoint[];
  height?: number;
}

export default function SVGChart({ data, height = 220 }: SVGChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 text-sm">
        No recent scans available for trend representation.
      </div>
    );
  }

  // Calculate coordinates
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };
  const chartHeight = height - padding.top - padding.bottom;
  
  // Use container width references, let's standardise on a viewBox coordinate space (e.g. 500 x 200)
  const viewBoxWidth = 600;
  const viewBoxHeight = height;
  const chartWidth = viewBoxWidth - padding.left - padding.right;

  // Values range
  const minVal = 0;
  const maxVal = 100;
  const valRange = maxVal - minVal;

  const points = data.map((d, index) => {
    const x = padding.left + (chartWidth / Math.max(1, data.length - 1)) * index;
    const y = padding.top + chartHeight - ((d.value - minVal) / valRange) * chartHeight;
    return { x, y, label: d.label, value: d.value };
  });

  // Construct SVG Path
  let pathD = '';
  let areaD = '';

  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    areaD = `M ${points[0].x} ${padding.top + chartHeight} L ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
      areaD += ` L ${points[i].x} ${points[i].y}`;
    }
    
    // Close area path for gradient
    areaD += ` L ${points[points.length - 1].x} ${padding.top + chartHeight} Z`;
  }

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          {/* Gradient beneath line */}
          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
          </linearGradient>
          {/* Gradient for main path line */}
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* Horizontal Gridlines */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = padding.top + chartHeight - (tick / 100) * chartHeight;
          return (
            <g key={tick} className="opacity-40">
              <line
                x1={padding.left}
                y1={y}
                x2={viewBoxWidth - padding.right}
                y2={y}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500 font-medium"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* X-axis indicators */}
        {points.map((pt, idx) => (
          <text
            key={idx}
            x={pt.x}
            y={viewBoxHeight - 10}
            textAnchor="middle"
            className="text-[10px] font-sans fill-slate-400 dark:fill-slate-500 font-medium"
          >
            {pt.label}
          </text>
        ))}

        {/* Filled Path Area (Gradient) */}
        {points.length > 0 && (
          <path d={areaD} fill="url(#chartGlow)" />
        )}

        {/* Main Line */}
        {points.length > 0 && (
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]"
          />
        )}

        {/* Interactive Dots */}
        {points.map((pt, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <g
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 8 : 4.5}
                className="fill-emerald-500 stroke-white dark:stroke-slate-900 transition-all duration-200"
                strokeWidth={isHovered ? 2.5 : 2}
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 14 : 0}
                className="fill-emerald-400/20 transition-all duration-200"
              />
            </g>
          );
        })}
      </svg>

      {/* Real-time Custom HTML Tooltip */}
      {hoveredIndex !== null && points[hoveredIndex] && (
        <div
          className="absolute z-10 px-2.5 py-1.5 text-xs font-medium rounded-lg shadow-xl border bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 border-slate-100 dark:border-slate-800 font-sans pointer-events-none transition-all duration-100"
          style={{
            left: `${(points[hoveredIndex].x / viewBoxWidth) * 100}%`,
            top: `${(points[hoveredIndex].y / viewBoxHeight) * 100 - 15}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="text-slate-400 text-[10px] font-normal">{points[hoveredIndex].label}</div>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            SEO Score: {points[hoveredIndex].value}
          </div>
        </div>
      )}
    </div>
  );
}
