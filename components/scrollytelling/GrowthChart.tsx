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
 * Chart area: x 48–410, y 12 (top) – 102 (bottom).
 */
function buildChartData(stages: Stage[]) {
  const userCounts = stages.map((s) => parseUserScale(s.userScale));
  const maxUsers = Math.max(...userCounts);

  // Map user count → y coordinate
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

  // Build cumulative paths for each stage (showing data up to that stage)
  return stages.map((_, stageIdx) => {
    const active = points.slice(0, stageIdx + 1);
    const last = active[active.length - 1];

    // Build line path: M then C segments. Normalize to always have M + 2 cubic segments.
    let line: string;
    let area: string;
    if (active.length === 1) {
      // Single point: collapsed cubics
      const p = active[0];
      line = `M${p.x},102 C${p.x},102 ${p.x},102 ${p.x},${p.y} C${p.x},${p.y} ${p.x},${p.y} ${p.x},${p.y}`;
      area = `${line} L${p.x},102 L${xStart},102 Z`;
    } else if (active.length === 2) {
      const [a, b] = active;
      // First cubic goes to midpoint, second to endpoint
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      line = `M${a.x},102 C${a.x},102 ${mx - 20},102 ${mx},${my} C${mx + 20},${my - (my - b.y) * 0.5} ${b.x - 30},${b.y + 2} ${b.x},${b.y}`;
      area = `${line} L${b.x},102 L${a.x},102 Z`;
    } else {
      // 3+ points: first cubic to second point, second cubic to third
      const [a, b, c] = active;
      line = `M${a.x},102 C${a.x + 40},102 ${b.x - 60},102 ${b.x},${b.y} C${b.x + 40},${b.y - (b.y - c.y) * 0.3} ${c.x - 50},${c.y + 8} ${c.x},${c.y}`;
      area = `${line} L${c.x},102 L${a.x},102 Z`;
    }

    // Projection: dashed continuation from last point to end (only if not last stage)
    const hasProj = stageIdx < stages.length - 1;
    const nextPoint = hasProj ? points[stageIdx + 1] : null;
    const proj = hasProj && nextPoint
      ? `M${last.x},${last.y} C${last.x + 40},${last.y - 10} ${nextPoint.x - 40},${nextPoint.y + 10} ${nextPoint.x},${nextPoint.y}`
      : `M${last.x},${last.y} C${last.x},${last.y} ${last.x},${last.y} ${last.x},${last.y}`;

    return {
      line,
      area,
      areaOp: stageIdx === 0 ? 0 : 1,
      proj,
      projOp: hasProj ? 1 : 0,
      dot: [last.x, last.y] as [number, number],
      label: last.label,
      labelPos: [last.x + 12, last.y - 4] as [number, number],
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
