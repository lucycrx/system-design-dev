"use client";

import { useMemo } from "react";
import type { Stage } from "@/types/story";

interface Props {
  stages: Stage[];
  activeStageIndex: number;
}

// Parse "2 users" / "100 users" / "1,000 users" → number
function parseUserScale(scale: string): number {
  const num = scale.replace(/[^0-9]/g, "");
  return parseInt(num, 10) || 0;
}

/**
 * Compute chart paths for each stage.
 * Y-axis fixed at 0–maxUsers. All paths use M C C structure for smooth CSS d-interpolation.
 * Chart area: x 48–410, y 12 (top) – 102 (bottom), range = 90px.
 */
function buildChartData(stages: Stage[]) {
  const userCounts = stages.map((s) => parseUserScale(s.userScale));
  const maxUsers = Math.max(...userCounts);
  const toY = (users: number) => 102 - (users / maxUsers) * 90;

  // Spread data points evenly across x axis
  const xStart = 60;
  const xEnd = 410;
  const points = userCounts.map((u, i) => ({
    x: stages.length <= 1 ? xStart : xStart + (i / (stages.length - 1)) * (xEnd - xStart),
    y: toY(u),
    users: u,
    label: stages[i].userScale,
  }));

  // Build cumulative exponential paths for each stage.
  // All paths normalized to M C C for smooth d-interpolation between stages.
  // The curve stays flat near the baseline then shoots up — classic exponential.
  return stages.map((_, stageIdx) => {
    const pts = points.slice(0, stageIdx + 1);
    const last = pts[pts.length - 1];

    // Always use all data points to define control points for consistent M C C structure.
    // p0 = origin, p1 = stage-2 point, p2 = stage-3 point (or collapsed duplicates)
    const p0 = points[0];
    const p1 = points.length > 1 ? points[1] : p0;
    const p2 = points.length > 2 ? points[2] : p1;

    let endP1: typeof p1;
    let endP2: typeof p2;

    if (stageIdx === 0) {
      // Collapsed to a point at origin
      endP1 = { ...p0, y: 102 };
      endP2 = { ...p0, y: 102 };
    } else if (stageIdx === 1) {
      // Curve to p1, second segment collapsed at p1
      endP1 = p1;
      endP2 = p1;
    } else {
      // Full curve through p1 to p2
      endP1 = p1;
      endP2 = p2;
    }

    // First cubic: from start to endP1 (stays flat near baseline with exponential feel)
    // Second cubic: from endP1 to endP2 (shoots up for hockey stick)
    const line = `M${p0.x},102 C${p0.x + 40},102 ${endP1.x - 60},102 ${endP1.x},${endP1.y} C${endP1.x + 40},${endP1.y - (endP1.y - endP2.y) * 0.2} ${endP2.x - 50},${endP2.y + 8} ${endP2.x},${endP2.y}`;
    const area = `${line} L${endP2.x},102 L${p0.x},102 Z`;

    // Projection: dashed continuation to next stage's point
    const hasProj = stageIdx < stages.length - 1;
    const nextPt = hasProj ? points[stageIdx + 1] : null;
    const proj = hasProj && nextPt
      ? `M${last.x},${last.y} C${last.x + 40},${last.y - 10} ${nextPt.x - 40},${nextPt.y + 10} ${nextPt.x},${nextPt.y}`
      : `M${last.x},${last.y} C${last.x},${last.y} ${last.x},${last.y} ${last.x},${last.y}`;

    return {
      line,
      area,
      areaOp: stageIdx === 0 ? 0 : 1,
      proj,
      projOp: hasProj ? 1 : 0,
      dot: [last.x, stageIdx === 0 ? 102 : last.y] as [number, number],
      label: last.label,
      labelPos: [last.x + 12, (stageIdx === 0 ? 102 : last.y) - 4] as [number, number],
    };
  });
}

function formatMax(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

export function GrowthChart({ stages, activeStageIndex }: Props) {
  const chartData = useMemo(() => buildChartData(stages), [stages]);
  const maxUsers = Math.max(...stages.map((s) => parseUserScale(s.userScale)));
  const c = chartData[activeStageIndex] || chartData[0];

  return (
    <div className="h-[140px] py-3">
      <svg viewBox="0 0 440 120" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="scrolly-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Grid */}
        <line className="stroke-border" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" x1="48" y1="25" x2="420" y2="25" />
        <line className="stroke-border" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" x1="48" y1="50" x2="420" y2="50" />
        <line className="stroke-border" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" x1="48" y1="75" x2="420" y2="75" />

        {/* Axes */}
        <line className="stroke-border" strokeWidth="1" x1="48" y1="10" x2="48" y2="102" />
        <line className="stroke-border" strokeWidth="1" x1="48" y1="102" x2="420" y2="102" />
        <text className="font-mono text-[10px] fill-text-dim" x="42" y="106" textAnchor="end">0</text>
        <text className="font-mono text-[10px] fill-text-dim" x="42" y="16" textAnchor="end">{formatMax(maxUsers)}</text>

        {/* Area fill */}
        <path
          d={c.area}
          fill="url(#scrolly-area-grad)"
          className="transition-[d] duration-500 ease-linear"
          style={{ opacity: c.areaOp }}
        />

        {/* Projection */}
        <path
          d={c.proj}
          className="fill-none stroke-text-dim transition-[d,opacity] duration-500 ease-linear"
          strokeWidth="1"
          strokeDasharray="4 3"
          strokeLinecap="round"
          style={{ opacity: c.projOp }}
        />

        {/* Main line */}
        <path
          d={c.line}
          className="fill-none stroke-text transition-[d] duration-500 ease-linear"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Dot */}
        <circle
          r="3.5"
          cx="0"
          cy="0"
          className="fill-surface stroke-text transition-transform duration-500 ease-linear"
          strokeWidth="1.5"
          style={{ transform: `translate(${c.dot[0]}px, ${c.dot[1]}px)` }}
        />

        {/* Label */}
        <text
          x="0"
          y="0"
          className="font-mono text-[10px] tracking-wide fill-text-dim transition-transform duration-500 ease-linear"
          style={{ transform: `translate(${c.labelPos[0]}px, ${c.labelPos[1]}px)` }}
        >
          {c.label}
        </text>
      </svg>
    </div>
  );
}
